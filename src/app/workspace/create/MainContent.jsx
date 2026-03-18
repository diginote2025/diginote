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
  const dispatch = useDispatch();
  const savedResponses = useSelector((state) => state.studyTool.savedResponses);
  
  // Persistent State Logic: Check localStorage on initial load
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [showMCQ, setShowMCQ] = useState(false);
  const [takeTest, setTakeTest] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [isDetailed, setIsDetailed] = useState(true);

  // Use a Ref to avoid stale closures in callbacks
  const savedResponsesRef = useRef(savedResponses);
  useEffect(() => {
    savedResponsesRef.current = savedResponses;
  }, [savedResponses]);

  // --- 1. Hydrate Redux from LocalStorage on Mount ---
  useEffect(() => {
    const localData = localStorage.getItem("savedResponses");
    if (localData) {
      try {
        dispatch(setSavedResponses(JSON.parse(localData)));
      } catch (e) {
        console.error("Failed to parse saved responses", e);
      }
    }
  }, [dispatch]);

  // --- 2. YouTube Logic ---
  const fetchYouTubeVideo = useCallback(async (topic) => {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    if (!apiKey || !topic) return;

    try {
      setVideoLoading(true);
      const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          part: "snippet",
          q: `${selected.subject} ${topic} tutorial explanation`,
          type: "video",
          maxResults: 5,
          key: apiKey,
        },
      });
      const videos = response.data.items || [];
      if (videos.length > 0) {
        const bestVideo = videos[0];
        setVideo({
          title: bestVideo.snippet.title,
          url: `https://www.youtube.com/watch?v=${bestVideo.id.videoId}`,
          channel: bestVideo.snippet.channelTitle,
          thumbnail: bestVideo.snippet.thumbnails?.medium?.url,
          description: bestVideo.snippet.description?.slice(0, 100) + "...",
        });
      }
    } catch (error) {
      console.error("YouTube Fetch Error", error);
    } finally {
      setVideoLoading(false);
    }
  }, [selected.subject]);

  // --- 3. Gemini AI Logic (With Persistence Fix) ---
  const fetchAIResponse = useCallback(
    async (chapter, topic, forceRefresh = false) => {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        setAiResponse("❌ Gemini API key is missing.");
        return;
      }

      const cacheKey = `${topic}_${isDetailed ? "detail" : "def"}`;
      
      // CRITICAL FIX: Don't clear state if data is already in cache
      const cachedData = savedResponsesRef.current[chapter]?.[cacheKey];
      if (!forceRefresh && cachedData) {
        setAiResponse(cachedData);
        return;
      }

      setLoading(true);
      // Only clear response if we are actually fetching new data
      if (forceRefresh) setAiResponse(""); 

      try {
        const prompt = isDetailed
          ? `Provide a detailed, comprehensive explanation of "${topic}" in the context of ${selected.subject} (${chapter}). Include key points, bullet points, and examples.`
          : `Provide a short, 2-sentence formal definition of "${topic}" in ${selected.subject}.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: isDetailed ? 1500 : 200,
              },
            }),
          }
        );

        if (!response.ok) throw new Error("API Limit Reached");
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

        setAiResponse(text);

        // Update Redux and LocalStorage
        const updatedCache = { 
          ...savedResponsesRef.current,
          [chapter]: {
            ...(savedResponsesRef.current[chapter] || {}),
            [cacheKey]: text
          }
        };
        
        dispatch(setSavedResponses(updatedCache));
        localStorage.setItem("savedResponses", JSON.stringify(updatedCache));
      } catch (error) {
        setAiResponse("❌ Error fetching AI response. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [selected.subject, isDetailed, dispatch]
  );

  // --- 4. Main Effect to trigger loads ---
  useEffect(() => {
    if (selected.topic && selected.chapter) {
      const cacheKey = `${selected.topic}_${isDetailed ? "detail" : "def"}`;
      const existingData = savedResponses[selected.chapter]?.[cacheKey];

      if (existingData) {
        setAiResponse(existingData);
      } else {
        fetchAIResponse(selected.chapter, selected.topic);
      }
      fetchYouTubeVideo(selected.topic);
    }
  }, [selected.topic, selected.chapter, isDetailed, fetchAIResponse, fetchYouTubeVideo, savedResponses]);

  // --- 5. PDF & Quiz Logic ---
  const downloadPDF = async () => {
    const element = document.getElementById("notebook-content");
    if (!element) return;
    const html2pdf = (await import("html2pdf.js")).default;
    const opt = {
      margin: 0.5,
      filename: `${selected.topic}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const startQuiz = () => {
    const mock = [
      { question: `Which best describes ${selected.topic}?`, options: ["Concept A", "Concept B", "Concept C", "Concept D"], correct: 0 },
      { question: `Identify a key feature of ${selected.topic}.`, options: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"], correct: 2 },
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

  // --- 6. UI Rendering ---
  return (
    <div className={`w-full overflow-y-auto custom-scrollbar h-screen ${isDark ? "bg-[#0b0f1a] text-white" : "bg-white text-black"}`}>
      {/* Mobile Toggle */}
      <div className="w-full flex justify-end p-4 lg:hidden">
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
              takeAMCQ={() => setShowMCQ(false)}
              aiResponse={aiResponse}
              isDark={isDark}
              handleAnswer={handleAnswer}
              questions={questions}
              current={current}
            />
          ) : (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center p-10 bg-blue-50 dark:bg-gray-800 rounded-3xl">
              <h2 className="text-4xl mb-4">🎉</h2>
              <p className="text-2xl font-bold mb-4">Quiz Finished!</p>
              <p className="text-xl">Score: <span className="text-blue-500">{score}</span> / {questions.length}</p>
              <button onClick={() => setShowMCQ(false)} className="mt-6 bg-blue-600 text-white px-8 py-2 rounded-full">Back to Lesson</button>
            </motion.div>
          )}
        </div>
      ) : takeTest ? (
        <TakeTest selected={selected} takeATest={() => setTakeTest(false)} aiResponse={aiResponse} isDark={isDark} />
      ) : selected.topic ? (
        <div className="max-w-5xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-4xl font-extrabold">
                <span className="text-blue-600 uppercase text-xs tracking-widest block mb-2">{selected.chapter}</span>
                <span className="font-serif italic">{selected.topic}</span>
              </h2>
            </motion.div>
          </div>

          {/* Toggle Definition/Detailed */}
          {/* <div className="flex items-center gap-4 mb-8 bg-gray-100 dark:bg-gray-800 w-fit p-1.5 rounded-2xl">
            <button
              onClick={() => setIsDetailed(false)}
              className={`px-5 py-2 rounded-xl text-sm transition-all ${!isDetailed ? 'bg-white dark:bg-gray-700 shadow-md font-bold' : 'text-gray-500'}`}
            >
              Definition
            </button>
            <button
              onClick={() => setIsDetailed(true)}
              className={`px-5 py-2 rounded-xl text-sm transition-all ${isDetailed ? 'bg-blue-600 text-white shadow-lg font-bold' : 'text-gray-500'}`}
            >
              Explanation
            </button>
          </div> */}

          {/* AI Content */}
          <div className="mb-10 min-h-[400px]">
            {loading ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
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

          {/* Video Section */}
          <AnimatePresence>
            {video && !videoLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mb-10 p-6 rounded-3xl border ${isDark ? "bg-gray-800/40 border-gray-700" : "bg-gray-50 border-gray-200"}`}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-red-500">📺</span> Recommended Video
                </h3>
                <div className="flex flex-col md:flex-row gap-6">
                  {video.thumbnail && (
                    <img src={video.thumbnail} alt="video" className="w-full md:w-56 rounded-2xl object-cover shadow-md" />
                  )}
                  <div className="flex-1">
                    <a href={video.url} target="_blank" rel="noreferrer" className="text-xl font-semibold text-blue-500 hover:underline mb-2 block">
                      {video.title}
                    </a>
                    <p className="text-gray-400 text-sm mb-4">Channel: {video.channel}</p>
                    <p className="text-gray-500 text-sm line-clamp-2">{video.description}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 border-t pt-8 border-gray-100 dark:border-gray-800">
            <button onClick={startQuiz} className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-2xl transition-transform active:scale-95">
              Practice MCQs
            </button>
            <button onClick={() => setTakeTest(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-transform active:scale-95">
              Take a Test
            </button>
            <button onClick={downloadPDF} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-transform active:scale-95">
              Download PDF
            </button>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="h-full flex flex-col items-center justify-center p-10 text-center opacity-40">
           <Image src="/images/homepage/navbar/DN.png" alt="Logo" height={120} width={120} className="grayscale mb-6" />
           <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">Select a topic from the sidebar to begin</p>
        </div>
      )}
    </div>
  );
}