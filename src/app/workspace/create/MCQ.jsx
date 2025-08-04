"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader, Play, Trophy, RotateCcw, CheckCircle, XCircle, Clock, BookOpen } from "lucide-react";

const MCQ = ({ onBack, selected, takeAMCQ }) => {
  const [topic, setTopic] = useState("");
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
                    text: `Generate 10 multiple-choice questions (MCQs) on the topic "${selected.topic}".
                         Each question must follow this exact format:

Question: [question]
A) Option A
B) Option B
C) Option C
D) Option D
Correct Answer: [A/B/C/D]

Do not include explanations, numbering, or extra formatting.`
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

      const mcqsRaw = text
        .split(/Question:/)
        .map((chunk) => "Question:" + chunk.trim())
        .filter((x) => x.length > 30)
        .map((mcqText) => {
          const lines = mcqText.split("\n").map((l) => l.trim());
          const mcq = { question: "", options: {}, correctAnswer: "" };

          lines.forEach((line) => {
            if (line.startsWith("Question:")) mcq.question = line.slice(9).trim();
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

  // Timer effect
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
        isCorrect
      }
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

  const restartQuiz = () => {
    setQuizStarted(false);
    setCurrentIndex(0);
    setSelectedOption("");
    setScore(0);
    setFinished(false);
    setUserAnswers([]);
    setShowResult(false);
    setTimeLeft(30);
    setTimerActive(false);
  };

  const getScoreColor = () => {
    const percentage = (score / mcqs.length) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = () => {
    const percentage = (score / mcqs.length) * 100;
    if (percentage >= 90) return "Outstanding! 🌟";
    if (percentage >= 80) return "Excellent work! 🎉";
    if (percentage >= 70) return "Good job! 👏";
    if (percentage >= 60) return "Not bad! 👍";
    return "Keep practicing! 💪";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="p-2 max-w-4xl mx-auto  ">
        <AnimatePresence mode="wait">
          {!quizStarted ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mt-20  "
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800"  onClick={takeAMCQ}>Practice MCQs</h2>
               <div className="flex justify-center items-center py-4 gap-2 mb-4">
                 <p className="text-gray-600">Topic:</p>
                <p className="text-lg font-semibold text-blue-600">{selected?.topic || "General Knowledge"}</p>
               
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
              className="flex flex-col items-center justify-center mt-32 "
            >
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <Loader className="animate-spin mb-6 w-12 h-12 text-blue-500 mx-auto" />
                <p className="text-xl text-gray-700 mb-2">Generating questions...</p>
                <p className="text-sm text-gray-500">This may take a few moments</p>
              </div>
            </motion.div>
          ) : finished ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 ">
                <div className="text-center mb-8">
                  <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
                  <p className="text-xl mb-2">{getScoreMessage()}</p>
                  <div className={`text-4xl font-bold mb-4 ${getScoreColor()}`}>
                    {score} / {mcqs.length}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${(score / mcqs.length) * 100}%` }}
                    ></div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={restartQuiz}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Retake Quiz
                  </motion.button>
                </div>
              </div>

              {userAnswers.filter(item => !item.isCorrect).length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-8 ">
                  <h3 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-2">
                    <XCircle className="w-6 h-6" />
                    Review Incorrect Answers
                  </h3>
                  <div className="space-y-6">
                    {userAnswers
                      .filter((item) => !item.isCorrect)
                      .map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-red-200 rounded-xl p-6 bg-red-50"
                        >
                          <p className="font-semibold text-gray-800 mb-4 text-lg">
                            {index + 1}. {item.question}
                          </p>
                          <div className="grid gap-2">
                            {Object.entries(item.options).map(([key, value]) => {
                              const isCorrect = key === item.correct;
                              const isSelected = key === item.selected;

                              return (
                                <div
                                  key={key}
                                  className={`p-3 rounded-lg border-2 ${
                                    isCorrect
                                      ? "border-green-500 bg-green-50 text-green-800"
                                      : isSelected
                                      ? "border-red-500 bg-red-50 text-red-800"
                                      : "border-gray-200 bg-white text-gray-700"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span>{key}) {value}</span>
                                    <div className="flex items-center gap-2">
                                      {isSelected && !isCorrect && <span className="text-red-600 text-sm">Your Answer</span>}
                                      {isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : showResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center min-h-[400px]"
            >
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
                {userAnswers[userAnswers.length - 1]?.isCorrect ? (
                  <>
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-600 mb-2">Correct!</h3>
                    <p className="text-gray-600">Well done! 🎉</p>
                  </>
                ) : (
                  <>
                    <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-red-600 mb-2">Incorrect</h3>
                    <p className="text-gray-600 mb-2">The correct answer was:</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {mcqs[currentIndex]?.correctAnswer}) {mcqs[currentIndex]?.options[mcqs[currentIndex]?.correctAnswer]}
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto"
            >
              <div className=" rounded-2xl shadow-xl p-4 max-lg:mt-18 bg-white">
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Question {currentIndex + 1} of {mcqs.length}</span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className={timeLeft <= 10 ? "text-red-600 font-bold" : ""}>{timeLeft}s</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentIndex + 1) / mcqs.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Timer Bar */}
                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-1000 ${
                        timeLeft <= 10 ? "bg-red-500" : "bg-green-500"
                      }`}
                      style={{ width: `${(timeLeft / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
                  {mcqs[currentIndex]?.question}
                </h3>

                <div className="space-y-3 mb-8">
                  {Object.entries(mcqs[currentIndex]?.options || {}).map(([key, value]) => (
                    <motion.label
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedOption === key
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name="mcq"
                        value={key}
                        checked={selectedOption === key}
                        onChange={() => setSelectedOption(key)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="text-lg text-gray-700">
                        <span className="font-semibold">{key})</span> {value}
                      </span>
                    </motion.label>
                  ))}
                </div>

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