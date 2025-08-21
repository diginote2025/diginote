'use client';

import { useState, useCallback, useRef } from 'react';
import { UploadCloud, FileText, Copy, Download, X, RefreshCw } from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';

// Configure the PDF.js worker from a CDN to avoid build issues.
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`;

export default function SyllabusParserPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'processing', 'success', 'error'
  const [parsedSyllabus, setParsedSyllabus] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError('');
        setStatus('idle');
        setParsedSyllabus('');
        processFile(selectedFile);
      } else {
        setError('Invalid file type. Please upload a JPEG, PNG, or PDF.');
      }
    }
  };

  const handleDragEvents = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    handleDragEvents(e);
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    handleDragEvents(e);
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    handleDragEvents(e);
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files && e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files && e.target.files[0];
    handleFileSelect(selectedFile);
  };
  
  const fileToGenerativePart = async (file) => {
    const base64EncodedData = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: {
        mimeType: file.type,
        data: base64EncodedData,
      },
    };
  };
  
  const pdfToImageParts = async (file) => {
    const fileBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument(fileBuffer).promise;
    const numPages = pdf.numPages;
    const imageParts = [];
  
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport: viewport }).promise;
      const imageData = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      imageParts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageData,
        },
      });
    }
    return imageParts;
  };


  const processFile = useCallback(async (fileToProcess) => {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY.includes("YOUR_KEY")) {
      setError("API Key is not configured. Please add it to your .env.local file.");
      setStatus('error');
      return;
    }

    setStatus('processing');
    setParsedSyllabus('');
    setError('');

    try {
      const prompt = `
        You are an intelligent syllabus parser. Your task is to analyze the provided file (image(s) of a course syllabus) and extract the chapters, units, or modules along with their corresponding topics.

        Instructions:
        1. Identify the main sections of the syllabus (e.g., Unit 1, Chapter 2, Module A).
        2. For each section, list all the topics and sub-topics.
        3. Format the output as a clean, hierarchical plain text list. Use indentation for sub-topics.
        4. Do NOT include any introductory text, concluding remarks, or conversational filler.
        5. Return ONLY the extracted syllabus content.

        Example Output Format:
        Unit 1: Introduction to Programming
        - History of Programming Languages
        - Basic Syntax and Semantics
        - Variables and Data Types

        Chapter 2: Control Structures
        - Conditional Statements (if-else)
        - Loops (for, while)
        - Switch Cases
      `;
      
      let parts = [];
      if(fileToProcess.type === 'application/pdf') {
          parts = await pdfToImageParts(fileToProcess);
      } else {
          parts = [await fileToGenerativePart(fileToProcess)];
      }

      const requestBody = {
        contents: [{
          parts: [{ text: prompt }, ...parts],
        }],
      };

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API Error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
        const resultText = data.candidates[0].content.parts[0].text;
        setParsedSyllabus(resultText.trim());
        setStatus('success');
      } else {
        // Handle cases where the response structure is unexpected or content is blocked
        const finishReason = data.candidates?.[0]?.finishReason;
        if (finishReason === 'SAFETY') {
            throw new Error("Content could not be generated due to safety settings.");
        } else {
            throw new Error('Failed to parse the syllabus. The model returned an empty or invalid response.');
        }
      }

    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(parsedSyllabus).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy'), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([parsedSyllabus], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'syllabus.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFile(null);
    setStatus('idle');
    setParsedSyllabus('');
    setError('');
    setIsDragging(false);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center p-10">
            <div className="w-12 h-12 border-4 border-dashed border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">Processing Syllabus...</p>
            <p className="text-gray-500">This may take a moment, especially for multi-page PDFs.</p>
          </div>
        );
      case 'success':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Extracted Syllabus</h2>
              <div className="flex items-center gap-2">
                <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                  <Copy size={16} /> {copyButtonText}
                </button>
                <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                  <Download size={16} /> Download .txt
                </button>
                 <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                  <RefreshCw size={16} /> Start Over
                </button>
              </div>
            </div>
            <pre className="p-6 bg-gray-50 border border-gray-200 rounded-lg whitespace-pre-wrap font-sans text-gray-800 text-base leading-relaxed max-h-[60vh] overflow-y-auto">
              {parsedSyllabus}
            </pre>
          </div>
        );
      case 'error':
        return (
          <div className="text-center p-10 bg-red-50 border border-red-200 rounded-lg">
            <X className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-lg font-semibold text-red-800">Processing Failed</h3>
            <p className="mt-2 text-sm text-red-700 max-w-md mx-auto">{error}</p>
            <button
              onClick={handleReset}
              className="mt-6 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      default:
        return (
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragEvents}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                className={`flex flex-col items-center justify-center p-10 border-4 border-dashed rounded-xl transition-colors duration-300
                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400'}`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg, image/png, application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <UploadCloud className={`w-16 h-16 mb-4 transition-colors ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />
                <p className="text-xl font-semibold text-gray-700">Drag & drop your syllabus here</p>
                <p className="text-gray-500 mt-1">or <span className="font-semibold text-blue-600">click to browse</span></p>
                <p className="text-xs text-gray-400 mt-4">Supports: PDF, JPEG, PNG</p>
            </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
            Syllabus Parser
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Instantly extract chapters and topics from any syllabus file.
          </p>
        </header>
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {renderContent()}
        </div>
        <footer className="text-center mt-8 text-sm text-gray-500">
            <p>Powered by Google Gemini AI. Built with Next.js & Tailwind CSS.</p>
        </footer>
      </div>
    </main>
  );
}