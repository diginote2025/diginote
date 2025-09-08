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
  fileToGenerativePart,
  pdfToImageParts,
  parseSyllabusToObject,
}) {
  const handleSyllabusFile = async (file) => {
    if (!file) return;

    setIsParsingSyllabus(true);
    setParsingError("");

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key is not configured.");

      const prompt = `
        Analyze the provided syllabus image(s). Extract all **chapter** titles and the topics listed under each one.
        **You must ignore any sections titled 'Unit' or 'Module'. Only focus on 'Chapter'.**
        Format the output as plain text. Each chapter title should be on its own line. Each topic under a chapter should be on a new line, starting with a hyphen.
        Example:
        Chapter 1: Introduction to Programming
        - History of Programming
        - Basic Syntax
        Chapter 2: Control Flow
        - Conditional Statements
        - Loops
      `;

      let parts = [];
      if (file.type === "application/pdf") {
        parts = await pdfToImageParts(file);
      } else {
        parts = [await fileToGenerativePart(file)];
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }, ...parts] }] }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!resultText) throw new Error("Failed to parse the syllabus. The AI returned an empty response.");

      const parsedSyllabus = parseSyllabusToObject(resultText);
      if (Object.keys(parsedSyllabus).length === 0) {
        throw new Error("Could not identify any chapters. Please try a clearer image or a file that contains chapter headings.");
      }

      setChapterTopics(parsedSyllabus);
      const newExpandedState = Object.keys(parsedSyllabus).reduce((acc, chapter) => {
        acc[chapter] = true;
        return acc;
      }, {});
      setExpandedChapters(newExpandedState);
    } catch (err) {
      console.error("Syllabus parsing error:", err);
      setParsingError(err.message);
    } finally {
      setIsParsingSyllabus(false);
      setShowCamera(false);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing camera:", err);
        setParsingError("Could not access camera. Please check permissions.");
        setShowCamera(false);
      }
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
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      canvas.toBlob((blob) => {
        const imageFile = new File([blob], "syllabus_capture.jpg", { type: "image/jpeg" });
        handleSyllabusFile(imageFile);
      }, "image/jpeg");

      stopCamera();
    }
  };

  return (
    <div className="border border-gray-600 rounded-lg p-3 mb-4">
      <h3 className="font-semibold mb-3 text-center">Generate Syllabus with AI</h3>
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="application/pdf, image/png, image/jpeg"
          onChange={(e) => handleSyllabusFile(e.target.files[0])}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          disabled={isParsingSyllabus}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-all disabled:bg-gray-500"
        >
          <Upload size={18} /> Upload
        </button>
        <button
          onClick={startCamera}
          disabled={isParsingSyllabus}
          className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-3 rounded-lg transition-all disabled:bg-gray-500"
        >
          <Camera size={18} /> Scan
        </button>
      </div>
      {isParsingSyllabus && (
        <div className="flex items-center justify-center gap-2 mt-3 text-yellow-400">
          <Loader2 className="animate-spin" size={20} />
          <span>Parsing your syllabus...</span>
        </div>
      )}
      {parsingError && (
        <div className="mt-3 p-2 bg-red-900/50 border border-red-700 text-red-300 text-sm rounded-md">
          <p className="font-bold">Error:</p>
          <p>{parsingError}</p>
        </div>
      )}
      {showCamera && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
          <video ref={videoRef} autoPlay className="w-full max-w-4xl h-auto rounded-lg"></video>
          <canvas ref={canvasRef} className="hidden"></canvas>
          <div className="mt-4 flex gap-4">
            <button
              onClick={captureImage}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg"
            >
              Capture
            </button>
            <button
              onClick={stopCamera}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}