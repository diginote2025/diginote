"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader,
  Play,
  Trophy,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  ArrowLeft,
} from "lucide-react";

const MCQ = ({ onBack, selected, takeAMCQ, aiResponse, isDark }) => {
  const [mcqs, setMcqs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  const generateMCQs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Generate 10 multiple-choice questions (MCQs) on the topic "${aiResponse}".
Each question must follow this exact format:

Question: [question]
A) Option A
B) Option B
C) Option C
D) Option D
Correct Answer: [A/B/C/D]

Do not include explanations, numbering, or extra formatting.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

      const mcqsRaw = text
        .split(/Question:/)
        .map((chunk) => "Question:" + chunk.trim())
        .filter((x) => x.length > 30)
        .map((mcqText) => {
          const lines = mcqText.split("\n").map((l) => l.trim());
          const mcq = { question: "", options: {}, correctAnswer: "" };

          lines.forEach((line) => {
            if (line.startsWith("Question:"))
              mcq.question = line.slice(9).trim();
            else if (/^[A-D]\)/.test(line)) {
              const [key, ...rest] = line.split(")");
              mcq.options[key.trim()] = rest.join(")").trim();
            } else if (line.startsWith("Correct Answer:")) {
              mcq.correctAnswer = line.split(":")[1].trim();
            }
          });

          return mcq;
        });

      setMcqs(mcqsRaw);
      setTimerActive(true);
    } catch (err) {
      console.error("MCQ generation error:", err);
      setError("⚠️ " + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [selected.topic]);

  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0 && !finished) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      handleSubmit();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, finished]);

  const handleStart = () => {
    setQuizStarted(true);
    generateMCQs();
  };

  const handleSubmit = () => {
    const current = mcqs[currentIndex];
    const isCorrect = selectedOption === current.correctAnswer;

    if (isCorrect) {
      setScore((s) => s + 1);
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        question: current.question,
        correct: current.correctAnswer,
        selected: selectedOption || "No answer",
        options: current.options,
        isCorrect,
      },
    ]);

    setShowResult(true);
    setTimerActive(false);

    setTimeout(() => {
      setShowResult(false);
      setSelectedOption("");
      setTimeLeft(30);

      const next = currentIndex + 1;
      if (next < mcqs.length) {
        setCurrentIndex(next);
        setTimerActive(true);
      } else {
        setFinished(true);
      }
    }, 2000);
  };

  const optionBg = (key) =>
    selectedOption === key
      ? "border-blue-500 bg-blue-100 dark:bg-blue-100 "
      : isDark
      ? "border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-600 "
      : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100";

  const baseBg = isDark
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50";

  const cardBg = isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800";

  return (
    <div className={`min-h-screen ${baseBg}`}>
      <div className="p-2 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!quizStarted ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mt-20"
            >
              <div className={`rounded-2xl shadow-xl p-8 max-w-md mx-auto ${cardBg}`}>
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold">Practice MCQs</h2>
                <div className="flex justify-center items-center py-4 gap-2 mb-4">
                  <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>Topic:</p>
                  <p className="text-lg font-semibold text-blue-400">
                    {selected?.topic || "General Knowledge"}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStart}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg"
                >
                  <Play className="w-5 h-5" />
                  Start Quiz
                </motion.button>
              </div>
            </motion.div>
          ) : isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center mt-32"
            >
              <div className={`rounded-2xl shadow-xl p-12 text-center ${cardBg}`}>
                <Loader className="animate-spin mb-6 w-12 h-12 text-blue-500 mx-auto" />
                <p className="text-xl mb-2">Generating questions...</p>
                <p className={`${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}>
                  This may take a few moments
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`max-w-3xl mx-auto ${baseBg}`}
            >
              <div className={`rounded-2xl shadow-xl p-4 ${cardBg}`}>
                {/* Progress Info */}
                <div className="mb-6 pt-14">
                  <div className="flex flex-col gap-5 mb-2">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={takeAMCQ}
                        className="flex items-center space-x-2 hover:text-gray-800 transition-colors"
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <div className="h-6 w-px bg-gray-400" />
                      <h1 className="text-xl font-bold">{selected.topic}</h1>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        Question {currentIndex + 1} of {mcqs.length}
                      </span>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className={timeLeft <= 10 ? "text-red-600 font-bold" : ""}>
                          {timeLeft}s
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`w-full rounded-full h-2 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                    <div
                      className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentIndex + 1) / mcqs.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Timer Bar */}
                <div className={`mb-6 w-full rounded-full h-1 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                  <div
                    className={`h-1 rounded-full transition-all duration-1000 ${
                      timeLeft <= 10 ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{ width: `${(timeLeft / 30) * 100}%` }}
                  ></div>
                </div>

                {/* Question */}
                <h3 className="text-xl font-bold mb-6 leading-relaxed">
                  {mcqs[currentIndex]?.question}
                </h3>

                {/* Options */}
                <div className="space-y-3 mb-8 ">
                  {Object.entries(mcqs[currentIndex]?.options || {}).map(([key, value]) => (
                    <motion.label
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-4 p-4  rounded-xl border-2 cursor-pointer transition-all duration-200 ${optionBg(key)}`}
                    >
                      <input
                        type="radio"
                        name="mcq"
                        value={key}
                        checked={selectedOption === key}
                        onChange={() => setSelectedOption(key)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className={`text-lg ${isDark ? "text-white" : "text-gray-700"}`}>
                        <span className="font-semibold">{key})</span> {value}
                      </span>
                    </motion.label>
                  ))}
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={!selectedOption}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    selectedOption
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Submit Answer
                </motion.button>

                {/* Error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 mt-4 text-center bg-red-50 p-3 rounded-lg"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MCQ;
