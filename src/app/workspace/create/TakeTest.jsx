"use client";

import React, { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyA31o-dTbqh99GFesdP1ePILTiV4TvXVSE`;

export default function TakeTest({ topic, onBack, selected, takeATest }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const textareaRefs = useRef([]);

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
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight
    }
  };

  useEffect(() => {
    // Resize all textareas when questions or answers change
    questions.forEach((_, index) => resizeTextarea(index));
  }, [questions, answers]);

  const handleSubmit = async () => {
    setSubmitting(true);
    const evalPrompt = `Evaluate the following test answers on the topic "${topic}". Give total marks out of 10 with answer.\n\n${questions
      .map(
        (q, i) => `Q${i + 1}: ${q}\nAnswer: ${answers[i] || "No answer provided"}`
      )
      .join("\n\n")}`;
    const responseText = await callGemini(evalPrompt);
    setResult(responseText);
    setSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 h-[43rem] overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-700">
          🧪 Test on: {selected.topic}
        </h2>
       
        <button
      onClick={takeATest}
        className="mb-4 bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300 text-sm"
      >
        🔙 Back to Chat
      </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center mt-20 text-blue-500">
          <Loader2 className="animate-spin mr-2" />
          Generating questions...
        </div>
      ) : (
        <>
          {questions.map((q, i) => (
            <div key={i} className="rounded-xl p-4">
              <p className="font-medium mb-2">{q}</p>
              <textarea
                ref={(el) => (textareaRefs.current[i] = el)} // Assign ref to textarea
                className="w-full p-3 border-t border-gray-300 outline-none transition"
                style={{ height: "auto", resize: "none" }} // Disable manual resize
                placeholder="Write your answer here..."
                value={answers[i] || ""}
                onChange={(e) => {
                  setAnswers((prev) => ({ ...prev, [i]: e.target.value }));
                  resizeTextarea(i); // Resize on input
                }}
              />
            </div>
          ))}

          <div className="flex gap-4 justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`px-4 py-2 rounded font-medium transition ${
                submitting
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {submitting ? "Submitting..." : "✅ Submit Test"}
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 rounded font-medium bg-gray-500 hover:bg-gray-600 transition"
>
              🔙 Back
            </button>
          </div>

          {result && (
            <div className="p-4 mt-6 rounded-lg border border-gray-300">
              <h3 className="font-semibold mb-2 text-blue-700">
                📊 Test Result:
              </h3>
              <pre className="whitespace-pre-wrap">{result}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}