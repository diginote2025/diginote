"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Loader2,
  CheckCircle,
  Clock,
  BookOpen,
  ArrowLeft,
  Send,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyA31o-dTbqh99GFesdP1ePILTiV4TvXVSE`;

export default function TakeTest({ topic, onBack, selected, takeATest, aiResponse, isDark }) {
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      const prompt = `You are a test maker. Create 10 numbered basic test questions according to this "${aiResponse}". Format clearly like:\n1. What is ...?\n2. Explain ...\n3. How does ...`;
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
  }, [aiResponse]);

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
    const evalPrompt = `Evaluate the following test answers on the topic "${aiResponse}". 
    Give total marks out of 10 with detailed feedback for each answer.\n\n${questions
      .map(
        (q, i) =>
          `Q${i + 1}: ${q}\nAnswer: ${answers[i] || "No answer provided"}`
      )
      .join("\n\n")}`;
    const responseText = await callGemini(evalPrompt);
    setResult(responseText);
    setSubmitting(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    const answeredQuestions = Object.keys(answers).filter((key) =>
      answers[key]?.trim()
    ).length;
    return (answeredQuestions / questions.length) * 100;
  };

  const baseBg = isDark
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50";

  const cardBg = isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const inputBg = isDark ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-800";
  const progressBg = isDark ? "bg-gray-700" : "bg-gray-200";
  const mutedText = isDark ? "text-gray-400" : "text-gray-600";

  if (loading) {
    return (
      <div className={`min-h-screen ${baseBg} flex items-center justify-center`}>
        <div className={`rounded-2xl shadow-xl p-8 text-center ${cardBg}`}>
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Preparing Your Test</h3>
          <p className={`${mutedText}`}>Generating questions on {selected.topic}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${baseBg}`}>
      {/* Header */}
      <div className={`border-b sticky top-0 z-10  ${cardBg}`}>
        <div className={`max-w-4xl mx-auto px-6 pt-4 max-lg:pt-18 ${cardBg}`}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={takeATest}
                className={`flex items-center space-x-2 ${mutedText}  transition-colors`}
              >
                <ArrowLeft size={20} />
              </button>
              <div className={`h-6 w-px bg-gray-400 ${borderColor}`}></div>
              <h1 className="text-xl font-bold">{selected.topic}</h1>
            </div>

            <div className="flex items-center space-x-6 justify-between">
              <div className={`text-sm ${mutedText}`}>
                {
                  Object.keys(answers).filter((key) => answers[key]?.trim())
                    .length
                }{" "}
                / {questions.length} answered
              </div>
              <div className={`flex items-center space-x-2 text-sm ${mutedText}`}>
                <Clock size={16} />
                <span>{formatTime(timeSpent)}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-2 py-8">
        {/* Questions */}
        <div className="space-y-6 mb-8">
          {questions.map((q, i) => (
            <div
              key={i}
              className={`rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${cardBg} ${borderColor}`}
            >
              <div className="p-6">
                <p className="font-bold leading-relaxed flex gap-2">
                  {i + 1}. <ReactMarkdown>{q}</ReactMarkdown>
                </p>

                <div className="relative mt-4">
                  <textarea
                    ref={(el) => (textareaRefs.current[i] = el)}
                    className={`w-full p-4 rounded-lg outline-none transition-all duration-200 resize-none border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg} ${borderColor}`}
                    style={{ minHeight: "80px", maxHeight: "200px" }}
                    placeholder="Type your answer here..."
                    value={answers[i] || ""}
                    onChange={(e) => {
                      setAnswers((prev) => ({
                        ...prev,
                        [i]: e.target.value,
                      }));
                      resizeTextarea(i);
                    }}
                  />
                  <div className={`absolute bottom-2 right-2 text-xs ${mutedText}`}>
                    {answers[i]?.length || 0} characters
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className={`rounded-xl shadow-sm border p-6 ${cardBg} ${borderColor}`}>
          <div className="flex items-center justify-center">
            {/* <button
              onClick={onBack}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${mutedText} hover:bg-gray-100`}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button> */}

            <button
              onClick={handleSubmit}
              disabled={
                submitting ||
                Object.keys(answers).filter((key) => answers[key]?.trim()).length === 0
              }
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                submitting ||
                Object.keys(answers).filter((key) => answers[key]?.trim()).length === 0
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

        {/* Result */}
        {result && (
          <div className={`mt-8 rounded-xl shadow-sm border overflow-hidden ${cardBg} ${borderColor}`}>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <CheckCircle size={20} />
                <span>Test Results</span>
              </h3>
            </div>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed p-4">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  className={`${isDark ? "text-white" : "text-gray-700"}`}
                >
                  {result}
                </ReactMarkdown>
              </div>

              <div className="mt-6 pt-4 border-t px-4 pb-4 flex items-center justify-between text-sm">
                <span className={mutedText}>Test completed in {formatTime(timeSpent)}</span>
                <span className={mutedText}>
                  {Object.keys(answers).filter((key) => answers[key]?.trim()).length} questions
                  answered
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
