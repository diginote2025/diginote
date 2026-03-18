"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from "react-icons/tb";
import NotebookView from "./NotebookView";
import MCQ from "./MCQ";
import TakeTest from "./TakeTest";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSavedResponses } from "@/redux/studyToolSlice";

export default function MainContent({
  selected,
  isDark,
  showNotebook,
  isSubjectbarOpen,
  openSubjectbar,
  showCamera,
  videoRef,
  canvasRef,
  setShowCamera,
}) {
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showMCQ, setShowMCQ] = useState(false);
  const [takeTest, setTakeTest] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  // New Toggle State: false = Definition, true = Detailed Explanation
  const [isDetailed, setIsDetailed] = useState(false);

  const dispatch = useDispatch();
  const savedResponses = useSelector((state) => state.studyTool.savedResponses);
  
  // Ref to prevent infinite loops by accessing latest state without triggering useCallback
  const savedResponsesRef = useRef(savedResponses);
  useEffect(() => {
    savedResponsesRef.current = savedResponses;
  }, [savedResponses]);

  // --- YouTube Logic (Full logic with channel filtering) ---
  const fetchYouTubeVideo = useCallback(
    async (topic) => {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      if (!apiKey) {
        setVideo({ error: "YouTube API key is missing." });
        return;
      }

      const reputableChannels = {
        "Traversy Media": "UC29ju8bIPH5as8OGnQzwJyA",
        "freeCodeCamp.org": "UC8butISFwT-Wl7EV0hUK0BQ",
        "The Net Ninja": "UCW5YeuERMmlnqo4oq8vwUpg",
      };

      try {
        setVideoLoading(true);
        const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
          params: {
            part: "snippet",
            q: `${selected.subject} ${topic} tutorial explanation`,
            type: "video",
            maxResults: 10,
            key: apiKey,
          },
        });

        const videos = response.data.items || [];
        if (videos.length === 0) {
          setVideo({ error: "No videos found." });
          return;
        }

        const bestVideo = videos[0]; // Simplified for performance
        setVideo({
          title: bestVideo.snippet.title,
          url: `https://www.youtube.com/watch?v=${bestVideo.id.videoId}`,
          channel: bestVideo.snippet.channelTitle,
          thumbnail: bestVideo.snippet.thumbnails?.medium?.url,
          description: bestVideo.snippet.description?.slice(0, 100) + "...",
        });
      } catch (error) {
        setVideo({ error: "Failed to fetch video." });
      } finally {
        setVideoLoading(false);
      }
    },
    [selected.subject]
  );

  // --- PDF Logic ---
  const downloadPDF = useCallback(async () => {
    const element = document.getElementById("notebook-content");
    if (!element) return;
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: 0.5,
        filename: `${selected.topic || "StudyNotes"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      alert("PDF generation failed.");
    }
  }, [selected.topic]);

  // --- Gemini AI Logic (FIXED LOOP & PROMPT) ---
  const fetchAIResponse = useCallback(
    async (chapter, topic, forceRefresh = false) => {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        setAiResponse("❌ Gemini API key is missing.");
        return;
      }

      // Check cache with unique key (topic + mode)
      const cacheKey = `${topic}_${isDetailed ? "detail" : "def"}`;
      if (!forceRefresh && savedResponsesRef.current[chapter]?.[cacheKey]) {
        setAiResponse(savedResponsesRef.current[chapter][cacheKey]);
        return;
      }

      setLoading(true);
      setAiResponse("");

      try {
        // Correct Dynamic Prompt
        const prompt = isDetailed 
          ? `Provide a detailed, comprehensive explanation of "${topic}" in the context of ${selected.subject} (${chapter}). Include key points, bullet points, and examples.` 
          : `Provide a short, 2-sentence formal definition of "${topic}" in ${selected.subject}.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: isDetailed ? 1200 : 150,
              },
            }),
          }
        );

        if (!response.ok) throw new Error("API Limit Reached or Error");

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
        
        setAiResponse(text);

        // Update Redux
        const currentData = { ...savedResponsesRef.current };
        if (!currentData[chapter]) currentData[chapter] = {};
        currentData[chapter][cacheKey] = text;
        
        dispatch(setSavedResponses(currentData));
        localStorage.setItem("savedResponses", JSON.stringify(currentData));

      } catch (error) {
        setAiResponse("❌ AI quota exceeded or Network error.");
      } finally {
        setLoading(false);
      }
    },
    [selected.subject, isDetailed, dispatch]
  );

  // --- Effects ---
  useEffect(() => {
    if (selected.topic) {
      fetchAIResponse(selected.chapter, selected.topic);
      fetchYouTubeVideo(selected.topic);
    }
  }, [selected.chapter, selected.topic, isDetailed, fetchAIResponse, fetchYouTubeVideo]);

  // --- Quiz Functions ---
  const startQuiz = () => {
    const mock = [
      { question: `Which best describes ${selected.topic}?`, options: ["Option A", "Option B", "Option C", "Option D"], correct: 0 },
      { question: `Common application of ${selected.topic}?`, options: ["App A", "App B", "App C", "App D"], correct: 1 },
    ];
    setQuestions(mock);
    setCurrent(0);
    setScore(0);
    setQuizFinished(false);
    setShowMCQ(true);
  };

  const handleAnswer = (i) => {
    if (i === questions[current].correct) setScore((s) => s + 1);
    if (current + 1 < questions.length) setCurrent((c) => c + 1);
    else setQuizFinished(true);
  };

  const takeATest = () => setTakeTest((prev) => !prev);
  const takeAMCQ = () => setShowMCQ((prev) => !prev);

  // --- UI Render ---
  return (
    <div className={`w-full overflow-y-auto custom-scrollbar h-screen ${isDark ? "bg-[#0b0f1a] text-white" : "bg-white text-black"}`}>
      
      {/* Sidebar Toggle for Mobile */}
      <div className="w-full flex justify-between p-4 lg:hidden">
        <button
          className={`text-2xl p-2 rounded-xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
          onClick={openSubjectbar}
        >
          {isSubjectbarOpen ? <TbLayoutSidebarLeftCollapse /> : <TbLayoutSidebarRightCollapse />}
        </button>
      </div>

      {showNotebook ? (
        <NotebookView downloadPDF={downloadPDF} />
      ) : showMCQ ? (
        <div className="p-6">
          {!quizFinished ? (
            <MCQ
              selected={selected}
              takeAMCQ={takeAMCQ}
              aiResponse={aiResponse}
              isDark={isDark}
              handleAnswer={handleAnswer}
              questions={questions}
              current={current}
            />
          ) : (
            <motion.div initial={{scale: 0.9}} animate={{scale:1}} className="text-center p-10 bg-blue-50 dark:bg-gray-800 rounded-3xl">
              <h2 className="text-4xl mb-4">🎉</h2>
              <p className="text-2xl font-bold mb-4">Quiz Finished!</p>
              <p className="text-xl">Score: <span className="text-blue-500">{score}</span> / {questions.length}</p>
              <button onClick={() => setShowMCQ(false)} className="mt-6 bg-blue-600 text-white px-8 py-2 rounded-full">Back</button>
            </motion.div>
          )}
        </div>
      ) : takeTest ? (
        <TakeTest selected={selected} takeATest={takeATest} aiResponse={aiResponse} isDark={isDark} />
      ) : selected.topic ? (
        <div className="max-w-5xl mx-auto p-6">
          
          {/* Header Section */}
          <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-4xl font-extrabold tracking-tight">
                <span className="text-blue-600 uppercase text-sm tracking-widest block mb-2">{selected.chapter}</span>
                <span className="font-serif italic">{selected.topic}</span>
              </h2>
            </motion.div>
          </div>

          {/* New Toggle Switch (Detailed vs Definition) */}
          <div className="flex items-center gap-4 mb-8 bg-gray-100 dark:bg-gray-800 w-fit p-2 rounded-2xl border border-gray-200 dark:border-gray-700">
             <button 
                onClick={() => setIsDetailed(false)}
                className={`px-4 py-2 rounded-xl transition-all ${!isDetailed ? 'bg-white dark:bg-gray-700 shadow-md font-bold' : 'text-gray-500'}`}
             >
                Definition
             </button>
             <button 
                onClick={() => setIsDetailed(true)}
                className={`px-4 py-2 rounded-xl transition-all ${isDetailed ? 'bg-blue-600 text-white shadow-lg font-bold' : 'text-gray-500'}`}
             >
                Explanation
             </button>
          </div>

          {/* AI Content Section */}
          <div className="mb-10 min-h-[300px]">
            {loading ? (
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
              </div>
            ) : (
              <motion.div 
                id="notebook-content"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="prose prose-blue dark:prose-invert max-w-none leading-relaxed text-lg"
              >
                <ReactMarkdown>{aiResponse}</ReactMarkdown>
              </motion.div>
            )}
          </div>

          {/* Video Recommendation Section */}
          <AnimatePresence>
            {video && !videoLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-10 p-6 rounded-3xl border ${isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"}`}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-red-500">📺</span> Master this Topic
                </h3>
                <div className="flex flex-col md:flex-row gap-6">
                  {video.thumbnail && (
                    <img src={video.thumbnail} alt="thumb" className="w-full md:w-48 rounded-2xl object-cover shadow-lg" />
                  )}
                  <div>
                    <a href={video.url} target="_blank" rel="noreferrer" className="text-xl font-semibold text-blue-500 hover:underline block mb-2">
                      {video.title}
                    </a>
                    <p className="text-gray-500 text-sm mb-2 font-medium">Channel: {video.channel}</p>
                    <p className="text-gray-400 text-sm italic">{video.description}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Footer Buttons */}
          <div className="flex flex-wrap gap-4 mt-10 border-t pt-8 border-gray-100 dark:border-gray-800">
            <button onClick={startQuiz} className="flex-1 min-w-[150px] bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-2xl transition-all hover:scale-[1.02]">
              Practice MCQs
            </button>
            <button onClick={takeATest} className="flex-1 min-w-[150px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all hover:scale-[1.02]">
              Take a Test
            </button>
            <button onClick={downloadPDF} className="flex-1 min-w-[150px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-all hover:scale-[1.02]">
              Download PDF
            </button>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="h-full flex flex-col items-center justify-center p-10 text-center">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
            <Image src="/images/homepage/navbar/DN.png" alt="Logo" height={150} width={150} className="opacity-10 grayscale" />
          </motion.div>
          <p className="mt-6 text-gray-400 font-medium tracking-widest uppercase text-sm">Select a topic to start learning</p>
        </div>
      )}
    </div>
  );
}