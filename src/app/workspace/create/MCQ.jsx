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
  const [currentResult, setCurrentResult] = useState(null);

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
  }, [aiResponse]);

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

    const answerResult = {
      question: current.question,
      correct: current.correctAnswer,
      selected: selectedOption || "No answer",
      options: current.options,
      isCorrect,
    };

    setUserAnswers((prev) => [...prev, answerResult]);
    setCurrentResult(answerResult);
    setShowResult(true);
    setTimerActive(false);

    setTimeout(() => {
      setShowResult(false);
      setSelectedOption("");
      setTimeLeft(30);
      setCurrentResult(null);

      const next = currentIndex + 1;
      if (next < mcqs.length) {
        setCurrentIndex(next);
        setTimerActive(true);
      } else {
        setFinished(true);
      }
    }, 2000);
  };

  const optionBg = (key) => {
    if (showResult && currentResult) {
      if (key === currentResult.correct) {
        return "border-green-500 bg-green-100 dark:bg-green-900 dark:border-green-400";
      } else if (key === currentResult.selected && !currentResult.isCorrect) {
        return "border-red-500 bg-red-100 dark:bg-red-900 dark:border-red-400";
      }
    }
    
    return selectedOption === key
      ? "border-blue-100 bg-blue-100 dark:bg-blue-500 "
      : isDark
      ? "border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-600 "
      : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100";
  };

  const baseBg = isDark
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50";

  const cardBg = isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800";

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentIndex(0);
    setSelectedOption("");
    setScore(0);
    setFinished(false);
    setUserAnswers([]);
    setShowResult(false);
    setTimeLeft(30);
    setTimerActive(false);
    setCurrentResult(null);
    setMcqs([]);
  };

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
          ) : finished ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center mt-20"
            >
              <div className={`rounded-2xl shadow-xl p-8 max-w-2xl mx-auto ${cardBg}`}>
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
                <div className="text-6xl font-bold text-blue-500 mb-4">
                  {score}/{mcqs.length}
                </div>
                <p className="text-xl mb-8">
                  {score === mcqs.length
                    ? "Perfect Score! 🎉"
                    : score >= mcqs.length * 0.7
                    ? "Great Job! 👏"
                    : "Keep Practicing! 📚"}
                </p>
                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetQuiz}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Try Again
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={takeAMCQ}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-full hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Topics
                  </motion.button>
                </div>
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
                <div className="mb-6 pt-0 max-lg:pt-14">
                  <div className="flex flex-col gap-5 mb-2">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={takeAMCQ}
                        className="flex items-center space-x-2 transition-colors"
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

                {/* Result Display */}
                {showResult && currentResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                      currentResult.isCorrect
                        ? "bg-green-100 border border-green-300 dark:bg-green-900 dark:border-green-600"
                        : "bg-red-100 border border-red-300 dark:bg-red-900 dark:border-red-600"
                    }`}
                  >
                    {currentResult.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <div>
                      <p className={`font-semibold ${currentResult.isCorrect ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}`}>
                        {currentResult.isCorrect ? "Correct!" : "Incorrect!"}
                      </p>
                      {!currentResult.isCorrect && (
                        <p className={`text-sm ${isDark ? "text-red-300" : "text-red-600"}`}>
                          Correct answer: {currentResult.correct}) {currentResult.options[currentResult.correct]}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Options */}
                <div className="space-y-3 mb-8">
                  {Object.entries(mcqs[currentIndex]?.options || {}).map(([key, value]) => (
                    <motion.label
                      key={key}
                      whileHover={!showResult ? { scale: 1.02 } : {}}
                      whileTap={!showResult ? { scale: 0.98 } : {}}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                        showResult ? "cursor-default" : "cursor-pointer"
                      } ${optionBg(key)}`}
                    >
                      <input
                        type="radio"
                        name="mcq"
                        value={key}
                        checked={selectedOption === key}
                        onChange={() => !showResult && setSelectedOption(key)}
                        disabled={showResult}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className={`text-lg ${
                        showResult && currentResult
                          ? key === currentResult.correct
                            ? "text-green-800 dark:text-green-200 font-semibold"
                            : key === currentResult.selected && !currentResult.isCorrect
                            ? "text-red-800 dark:text-red-200 font-semibold"
                            : isDark ? "text-white" : "text-gray-700"
                          : isDark ? "text-white" : "text-gray-700"
                      }`}>
                        <span className="font-semibold">{key})</span> {value}
                        {showResult && currentResult && key === currentResult.correct && (
                          <CheckCircle className="w-4 h-4 text-green-600 inline ml-2" />
                        )}
                        {showResult && currentResult && key === currentResult.selected && !currentResult.isCorrect && (
                          <XCircle className="w-4 h-4 text-red-600 inline ml-2" />
                        )}
                      </span>
                    </motion.label>
                  ))}
                </div>

                {/* Submit Button */}
                {!showResult && (
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
                )}

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