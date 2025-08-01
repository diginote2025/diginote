"use client";

import React, { useEffect, useState, useRef } from "react";
import { Loader2, CheckCircle, Clock, BookOpen, ArrowLeft, Send } from "lucide-react";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyA31o-dTbqh99GFesdP1ePILTiV4TvXVSE`;

export default function TakeTest({ topic, onBack, selected, takeATest }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const textareaRefs = useRef([]);
  const startTimeRef = useRef(Date.now());

  const callGemini = async (prompt) => {
    try {
      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
      const data = await res.json();
      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "❌ Gemini did not return any questions."
      );
    } catch (error) {
      console.error("❌ API error:", error);
      return "❌ Failed to reach Gemini API.";
    }
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      const prompt = `You are a test maker. Create 10 numbered basic test questions on the topic "${selected.topic}". Format clearly like:\n1. What is ...?\n2. Explain ...\n3. How does ...`;
      const responseText = await callGemini(prompt);
      const list = responseText
        .split("\n")
        .filter((line) => line.trim().match(/^\d+\./));
      setQuestions(
        list.length > 0
          ? list
          : ["❌ Gemini did not return valid questions. Try another topic."]
      );
      setLoading(false);
    };

    fetchQuestions();
  }, [topic]);

  // Resize textarea based on content
  const resizeTextarea = (index) => {
    const textarea = textareaRefs.current[index];
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    questions.forEach((_, index) => resizeTextarea(index));
  }, [questions, answers]);

  const handleSubmit = async () => {
    setSubmitting(true);
    const evalPrompt = `Evaluate the following test answers on the topic "${topic}". Give total marks out of 10 with detailed feedback for each answer.\n\n${questions
      .map(
        (q, i) => `Q${i + 1}: ${q}\nAnswer: ${answers[i] || "No answer provided"}`
      )
      .join("\n\n")}`;
    const responseText = await callGemini(evalPrompt);
    setResult(responseText);
    setSubmitting(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const answeredQuestions = Object.keys(answers).filter(key => answers[key]?.trim()).length;
    return (answeredQuestions / questions.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Preparing Your Test</h3>
          <p className="text-gray-600">Generating questions on {selected.topic}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={takeATest}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Chat</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <BookOpen className="text-blue-600" size={20} />
                <h1 className="text-xl font-bold text-gray-800">{selected.topic}</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>{formatTime(timeSpent)}</span>
              </div>
              <div className="text-sm text-gray-600">
                {Object.keys(answers).filter(key => answers[key]?.trim()).length} / {questions.length} answered
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Questions */}
        <div className="space-y-6 mb-8">
          {questions.map((q, i) => (
            <div 
              key={i} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      answers[i]?.trim() 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {answers[i]?.trim() ? <CheckCircle size={16} /> : i + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <p className="text-gray-800 font-medium leading-relaxed">{q}</p>
                    
                    <div className="relative">
                      <textarea
                        ref={(el) => (textareaRefs.current[i] = el)}
                        className="w-full p-4 border border-gray-200 rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50 focus:bg-white"
                        style={{ minHeight: "80px", maxHeight: "200px" }}
                        placeholder="Type your answer here..."
                        value={answers[i] || ""}
                        onChange={(e) => {
                          setAnswers((prev) => ({ ...prev, [i]: e.target.value }));
                          resizeTextarea(i);
                        }}
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                        {answers[i]?.length || 0} characters
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={submitting || Object.keys(answers).filter(key => answers[key]?.trim()).length === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                submitting || Object.keys(answers).filter(key => answers[key]?.trim()).length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit Test</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <CheckCircle size={20} />
                <span>Test Results</span>
              </h3>
            </div>
            <div className="p-6">
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border">
                  {result}
                </pre>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Test completed in {formatTime(timeSpent)}</span>
                  <span>{Object.keys(answers).filter(key => answers[key]?.trim()).length} questions answered</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}