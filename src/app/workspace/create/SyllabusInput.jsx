import React from "react";
import { Upload, Camera, Loader2 } from "lucide-react";

export default function SyllabusInput({
  isParsingSyllabus,
  setIsParsingSyllabus,
  parsingError,
  setParsingError,
  fileInputRef,
  showCamera,
  setShowCamera,
  videoRef,
  canvasRef,
  setChapterTopics,
  setExpandedChapters,
}) {

  // --- Helper Functions ---
  const fileToData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const parseSyllabusToObject = (text) => {
    const lines = text.split("\n");
    const syllabus = {};
    let currentSection = null;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      const lowerLine = trimmed.toLowerCase();
      
      if (
        lowerLine.startsWith("chapter") || 
        lowerLine.startsWith("unit") || 
        lowerLine.startsWith("module")
      ) {
        currentSection = trimmed;
        syllabus[currentSection] = [];
      } else if (currentSection && (trimmed.startsWith("-") || trimmed.startsWith("*") || /^\d+\./.test(trimmed))) {
        const cleanTopic = trimmed.replace(/^[-*\d.]+\s*/, "");
        if (cleanTopic) syllabus[currentSection].push(cleanTopic);
      }
    });
    return syllabus;
  };

  // --- Camera Actions ---
  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera access error:", err);
      setParsingError("Could not access camera.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

      canvas.toBlob((blob) => {
        const imageFile = new File([blob], "capture.jpg", { type: "image/jpeg" });
        handleSyllabusFiles([imageFile]);
      }, "image/jpeg");

      stopCamera();
    }
  };

  // --- API Logic ---
  const handleSyllabusFiles = async (files) => {
    if (!files || files.length === 0) return;

    setIsParsingSyllabus(true);
    setParsingError("");

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key is not configured.");

      const prompt = `
        Analyze the provided syllabus images. 
        Extract all titles labeled as **Chapter**, **Unit**, or **Module**. 
        Under each title, list all the topics or sub-points.
        Combine information from all images into one continuous list.
        Format:
        Unit I: Name
        - Topic 1
        - Topic 2
      `;

      const imageParts = await Promise.all(
        Array.from(files).map(async (file) => {
          const base64 = await fileToData(file);
          return {
            inline_data: { mime_type: file.type, data: base64 },
          };
        })
      );

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }, ...imageParts] }],
          }),
        }
      );

      if (!response.ok) throw new Error("API call failed.");

      const data = await response.json();
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!resultText) throw new Error("AI returned an empty response.");

      const parsedSyllabus = parseSyllabusToObject(resultText);
      if (Object.keys(parsedSyllabus).length === 0) throw new Error("No Chapters/Units found.");

      setChapterTopics(parsedSyllabus);
      const newExpandedState = Object.keys(parsedSyllabus).reduce((acc, sec) => {
        acc[sec] = true;
        return acc;
      }, {});
      setExpandedChapters(newExpandedState);

    } catch (err) {
      setParsingError(err.message);
    } finally {
      setIsParsingSyllabus(false);
      stopCamera();
    }
  };

  return (
    <div className="border border-gray-600 rounded-lg p-3 mb-4">
      <h3 className="font-semibold mb-3 text-center text-white">
        Analyze Multi-Page Syllabus
      </h3>
      
      {/* Responsive Buttons Container */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept="image/png, image/jpeg"
          onChange={(e) => handleSyllabusFiles(e.target.files)}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          disabled={isParsingSyllabus}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-3 rounded-lg transition-all disabled:bg-gray-500"
        >
          <Upload size={18} /> Upload
        </button>
        <button
          onClick={startCamera}
          disabled={isParsingSyllabus}
          className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-3 rounded-lg transition-all disabled:bg-gray-500"
        >
          <Camera size={18} /> Scan
        </button>
      </div>

      {/* Loading State */}
      {isParsingSyllabus && (
        <div className="flex items-center justify-center gap-2 mt-4 text-yellow-400">
          <Loader2 className="animate-spin" size={20} />
          <span className="text-sm">Analyzing all pages...</span>
        </div>
      )}

      {/* Error Message */}
      {parsingError && (
        <div className="mt-3 p-2 bg-red-900/40 border border-red-700 text-red-300 text-xs rounded-md">
          <p className="font-bold">Error: {parsingError}</p>
        </div>
      )}

      {/* Camera Overlay - Fully Responsive */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-2xl bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-auto aspect-video object-cover" 
            />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="p-4 flex justify-center gap-4 bg-gray-900">
              <button 
                onClick={captureImage} 
                className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all"
              >
                Capture
              </button>
              <button 
                onClick={stopCamera} 
                className="px-8 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-full transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}