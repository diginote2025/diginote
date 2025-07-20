"use client";

import { ArrowLeft, TruckElectric } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toggleSubjectbar } from "@/redux/subjectbar";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from "react-icons/tb";
import NotebookView from "./NotebookView";
import MCQ from "./MCQ";
import axios from "axios";
import { motion } from "framer-motion";
import TakeTest from "./TakeTest";
import {
  setSavedResponses,
  updateSavedResponses,
  setShowNotebook,
} from "@/redux/studyToolSlice";

export default function AiStudyTool({ selectedSubject, setSelectedSubject }) {
  const [hasMounted, setHasMounted] = useState(false);
  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");
  const [chapterTopics, setChapterTopics] = useState({});
  const [selected, setSelected] = useState({ chapter: "", topic: "" });
  const [editing, setEditing] = useState({ chapter: "", topic: "", value: "" });
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMCQ, setShowMCQ] = useState(false);
  const [takeTest, setTakeTest] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [onlyDefinition, setOnlyDefinition] = useState(true);
  const [video, setVideo] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  
  const dispatch = useDispatch();
  const router = useRouter();
  const isSubjectbarOpen = useSelector((state) => state.subjectbar.isSubjectbarOpen);
  const { isDark } = useSelector((state) => state.theme);
  const savedResponses = useSelector((state) => state.studyTool.savedResponses);
  const showNotebook = useSelector((state) => state.studyTool.showNotebook);

  const openSubjectbar = () => {
    dispatch(toggleSubjectbar());
  };

  // YouTube video fetch function with better error handling
  const fetchYouTubeVideo = useCallback(async (topic) => {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    
    if (!apiKey) {
      console.error("YouTube API key is not configured.");
      setVideo({ error: "YouTube API key is missing. Please add NEXT_PUBLIC_YOUTUBE_API_KEY to your environment variables." });
      return;
    }

    const baseUrl = "https://www.googleapis.com/youtube/v3/search";
    const reputableChannels = {
      "Traversy Media": "UC29ju8bIPH5as8OGnQzwJyA",
      "freeCodeCamp.org": "UC8butISFwT-Wl7EV0hUK0BQ",
      "The Net Ninja": "UCW5YeuERMmlnqo4oq8vwUpg",
      "Academind": "UCSJbGtTlrDami-tDGPUV9-w",
    };

    try {
      setVideoLoading(true);
      setVideo(null);
      
      const response = await axios.get(baseUrl, {
        params: {
          part: "snippet",
          q: `${topic} tutorial explanation`,
          type: "video",
          maxResults: 20,
          order: "relevance",
          key: apiKey,
          videoDuration: "medium",
          videoDefinition: "high"
        },
        timeout: 10000
      });

      const videos = response.data.items || [];
      
      if (videos.length === 0) {
        console.warn(`No videos found for topic: ${topic}`);
        setVideo({ error: `No educational videos found for "${topic}". Try a different search term.` });
        return;
      }

      const reputableVideos = videos.filter((video) =>
        Object.values(reputableChannels).includes(video.snippet.channelId)
      );

      const qualityVideos = videos.filter((video) => {
        const title = video.snippet.title.toLowerCase();
        const description = video.snippet.description.toLowerCase();
        return (
          title.includes('tutorial') ||
          title.includes('explained') ||
          title.includes('guide') ||
          title.includes('learn') ||
          description.includes('tutorial') ||
          description.includes('education')
        );
      });

      const bestVideo = reputableVideos.length > 0 
        ? reputableVideos[0] 
        : qualityVideos.length > 0 
        ? qualityVideos[0] 
        : videos[0];

      setVideo({
        title: bestVideo.snippet.title,
        url: `https://www.youtube.com/watch?v=${bestVideo.id.videoId}`,
        channel: bestVideo.snippet.channelTitle,
        thumbnail: bestVideo.snippet.thumbnails?.medium?.url || bestVideo.snippet.thumbnails?.default?.url,
        description: bestVideo.snippet.description?.slice(0, 100) + "..." || ""
      });

      console.log("Successfully fetched video:", bestVideo.snippet.title);
      
    } catch (error) {
      console.error("Error fetching YouTube video:", error);
      
      if (error.response?.status === 403) {
        setVideo({ error: "YouTube API quota exceeded or invalid API key. Please check your API key and quota limits." });
      } else if (error.response?.status === 400) {
        setVideo({ error: "Invalid search parameters. Please try a different topic." });
      } else if (error.code === 'ECONNABORTED') {
        setVideo({ error: "Request timed out. Please check your internet connection and try again." });
      } else {
        setVideo({ error: `Failed to fetch video: ${error.message}` });
      }
    } finally {
      setVideoLoading(false);
    }
  }, []);

  // Download PDF function
  const downloadPDF = useCallback(async () => {
    const element = document.getElementById("notebook-content");
    if (!element) {
      console.error("Notebook content element not found!");
      alert("Cannot generate PDF: Notebook content is not available.");
      return;
    }
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: 0.5,
        filename: `${selected.chapter || "Notebook"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      await html2pdf().set(opt).from(element).save();
      console.log("PDF generation successful");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  }, [selected.chapter]);

  // Load for current subject
  useEffect(() => {
    setHasMounted(true);

    localStorage.setItem("currentSubject", selectedSubject);

    const allTopics = JSON.parse(localStorage.getItem("chapterTopics") || "{}");
    const allResponses = JSON.parse(localStorage.getItem("savedResponses") || "{}");

    if (!allTopics[selectedSubject]) allTopics[selectedSubject] = {};
    if (!allResponses[selectedSubject]) allResponses[selectedSubject] = {};

    setChapterTopics(allTopics[selectedSubject] || {});
    dispatch(setSavedResponses(allResponses[selectedSubject] || {}));

    localStorage.setItem("study_tool_responses", JSON.stringify(allResponses[selectedSubject] || {}));

    setSelected({ chapter: "", topic: "" });
    setAiResponse("");
    setChapter("");
    setTopic("");
    setShowMCQ(false);
    setTakeTest(false);
    dispatch(setShowNotebook(false));
    setVideo(null);
    setApiError("");

    localStorage.setItem("chapterTopics", JSON.stringify(allTopics));
    localStorage.setItem("savedResponses", JSON.stringify(allResponses));
  }, [selectedSubject, dispatch]);

  // Save chapterTopics to localStorage
  useEffect(() => {
    if (!hasMounted) return;
    const allTopics = JSON.parse(localStorage.getItem("chapterTopics") || "{}");
    allTopics[selectedSubject] = chapterTopics;
    localStorage.setItem("chapterTopics", JSON.stringify(allTopics));
  }, [chapterTopics, hasMounted, selectedSubject]);

  // Fetch AI response with better error handling
  const fetchAIResponse = useCallback(async (chapter, topic) => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      setAiResponse("❌ Gemini API key is not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.");
      setApiError("Missing API key");
      return;
    }

    setLoading(true);
    setApiError("");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const prompt = `Please provide a comprehensive explanation of the topic "${topic}" from the chapter "${chapter}". 
      Include:
      1. A clear definition
      2. Key concepts and principles
      3. Real-world applications or examples
      4. Important points to remember
      
      Format the response in a clear, educational manner suitable for study purposes.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error("Invalid response format from Gemini API");
      }

      const text = data.candidates[0].content.parts[0].text || "No response generated.";
      
      if (text.includes("I can't") || text.includes("I cannot")) {
        throw new Error("AI declined to provide information");
      }

      setAiResponse(text);

      const updated = { ...savedResponses };
      if (!updated[chapter]) updated[chapter] = {};
      updated[chapter][topic] = text;

      dispatch(setSavedResponses(updated));

      const allResponses = JSON.parse(localStorage.getItem("savedResponses") || "{}");
      allResponses[selectedSubject] = updated;
      localStorage.setItem("savedResponses", JSON.stringify(allResponses));
      localStorage.setItem("study_tool_responses", JSON.stringify(updated));

      console.log("AI response fetched successfully");

    } catch (error) {
      console.error("Error fetching AI response:", error);
      
      let errorMessage = "❌ Failed to get AI response. ";
      
      if (error.name === "AbortError") {
        errorMessage += "Request timed out. Please try again.";
      } else if (error.message.includes("403")) {
        errorMessage += "API key is invalid or quota exceeded.";
      } else if (error.message.includes("429")) {
        errorMessage += "Too many requests. Please wait and try again.";
      } else if (error.message.includes("400")) {
        errorMessage += "Invalid request format.";
      } else {
        errorMessage += error.message || "Unknown error occurred.";
      }
      
      setAiResponse(errorMessage);
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  }, [savedResponses, dispatch, selectedSubject]);

  // Combined effect for fetching AI response and YouTube video
  useEffect(() => {
    if (!selected.chapter || !selected.topic) return;

    const existingResponse = savedResponses[selected.chapter]?.[selected.topic];
    
    if (existingResponse) {
      setAiResponse(existingResponse);
      console.log("Using cached AI response");
    } else {
      fetchAIResponse(selected.chapter, selected.topic);
    }

    fetchYouTubeVideo(selected.topic);
    
  }, [selected.chapter, selected.topic, savedResponses, fetchAIResponse, fetchYouTubeVideo]);

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (!chapter.trim() || !topic.trim()) return;
    setChapterTopics((prev) => {
      const curr = { ...prev };
      if (!curr[chapter]) curr[chapter] = [];
      if (!curr[chapter].includes(topic)) curr[chapter].push(topic);
      return curr;
    });
    setChapter("");
    setTopic("");
  };

  const handleDeleteTopic = (chapName, topicName) => {
    if (!confirm(`Are you sure you want to delete topic "${topicName}" from chapter "${chapName}"?`)) return;

    setChapterTopics((prev) => {
      const curr = { ...prev };
      curr[chapName] = curr[chapName].filter((t) => t !== topicName);
      if (curr[chapName].length === 0) delete curr[chapName];
      return curr;
    });

    const updated = { ...savedResponses };
    if (updated[chapName]) {
      delete updated[chapName][topicName];
      if (Object.keys(updated[chapName]).length === 0) delete updated[chapName];
    }

    dispatch(setSavedResponses(updated));

    const allResponses = JSON.parse(localStorage.getItem("savedResponses") || "{}");
    allResponses[selectedSubject] = updated;
    localStorage.setItem("savedResponses", JSON.stringify(allResponses));
    localStorage.setItem("study_tool_responses", JSON.stringify(updated));

    if (selected.chapter === chapName && selected.topic === topicName) {
      setSelected({ chapter: "", topic: "" });
      setAiResponse("");
      setVideo(null);
    }
  };

  const startEdit = (chap, top) => {
    setEditing({ chapter: chap, topic: top, value: top });
  };

  const saveEdit = () => {
    const { chapter: chap, topic: oldT, value: newT } = editing;
    if (!newT.trim()) return;

    setChapterTopics((prev) => {
      const curr = { ...prev };
      curr[chap] = curr[chap].map((t) => (t === oldT ? newT : t));
      return curr;
    });

    const updated = { ...savedResponses };
    if (updated[chap] && updated[chap][oldT]) {
      updated[chap][newT] = updated[chap][oldT];
      delete updated[chap][oldT];
      dispatch(setSavedResponses(updated));

      const allResponses = JSON.parse(localStorage.getItem("savedResponses") || "{}");
      allResponses[selectedSubject] = updated;
      localStorage.setItem("savedResponses", JSON.stringify(allResponses));
      localStorage.setItem("study_tool_responses", JSON.stringify(updated));
    }

    if (selected.chapter === chap && selected.topic === oldT) {
      setSelected({ chapter: chap, topic: newT });
    }
    setEditing({ chapter: "", topic: "", value: "" });
  };

  const startQuiz = () => {
    const mock = [
      {
        question: `Key idea of ${selected.topic}?`,
        options: ["A", "B", "C", "D"],
        correct: 1,
      },
      {
        question: `Real life use of ${selected.topic}?`,
        options: ["A", "B", "C", "D"],
        correct: 2,
      },
    ];
    setQuestions(mock);
    setCurrent(0);
    setScore(0);
    setQuizFinished(false);
    setShowMCQ(true);
    setVideo(null);
  };

  const handleAnswer = (i) => {
    if (i === questions[current].correct) setScore((s) => s + 1);
    if (current + 1 < questions.length) setCurrent((c) => c + 1);
    else setQuizFinished(true);
  };

  const takeATest = () => {
    setTakeTest((prev) => !prev);
  };

  const takeAMCQ = () => {
    setShowMCQ((prev) => !prev);
  };

  const clearAllSubjectData = () => {
    if (!confirm("Are you sure you want to clear all data for this subject?")) return;

    setChapterTopics({});
    dispatch(setSavedResponses({}));

    const allTopics = JSON.parse(localStorage.getItem("chapterTopics") || "{}");
    const allResponses = JSON.parse(localStorage.getItem("savedResponses") || "{}");

    delete allTopics[selectedSubject];
    delete allResponses[selectedSubject];

    localStorage.setItem("chapterTopics", JSON.stringify(allTopics));
    localStorage.setItem("savedResponses", JSON.stringify(allResponses));
    localStorage.setItem("study_tool_responses", JSON.stringify({}));

    setSelected({ chapter: "", topic: "" });
    setAiResponse("");
    setVideo(null);

    alert("All data cleared for this subject!");
  };

  const debugLocalStorage = () => {
    console.log("=== DEBUG localStorage ===");
    console.log("study_tool_responses:", localStorage.getItem("study_tool_responses"));
    console.log("savedResponses:", localStorage.getItem("savedResponses"));
    console.log("currentSubject:", localStorage.getItem("currentSubject"));
    console.log("Redux savedResponses:", savedResponses);
    console.log("API Error:", apiError);
    console.log("========================");
  };

  const openNotebook = () => {
    console.log("Opening notebook...");
    debugLocalStorage();

    const currentData = { ...savedResponses };
    localStorage.setItem("study_tool_responses", JSON.stringify(currentData));
    console.log("Synced data:", currentData);

    router.push("/workspace/notes");
  };

  if (!hasMounted) return null;

  return (
    <div className="flex flex-row h-[90vh]">
      <div className="w-full px-4 overflow-y-auto custom-scrollbar">
        <div className="w-full flex justify-between py-2">
          <button
            onClick={() => setSelectedSubject("")}
            className="hover:bg-gray-500/20 rounded-full"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            className="text-2xl hidden max-lg:block"
            onClick={openSubjectbar}
          >
            {isSubjectbarOpen ? (
              <TbLayoutSidebarLeftCollapse />
            ) : (
              <TbLayoutSidebarRightCollapse />
            )}
          </button>
        </div>
        
        {showNotebook ? (
          <NotebookView downloadPDF={downloadPDF} />
        ) : showMCQ ? (
          <>
            <div className="flex justify-between">
              <h2 className="text-xl font-bold text-green-700 mb-4">
              📝 Quiz: {selected.topic}
            </h2>
             <button
        onClick={takeAMCQ}
        className="mb-4 bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300 text-sm"
      >
        🔙 Back to Chat
      </button>
            </div>
            {!quizFinished ? (
              <MCQ selected={selected} takeAMCQ={takeAMCQ} />
            ) : (
              <>
                <p className="text-xl font-semibold text-blue-600">
                  🎉 Quiz Complete! Your Score: {score} / {questions.length}
                </p>
                <button
                  onClick={() => setShowMCQ(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  🔙 Back to Topic
                </button>
              </>
            )}
          </>
        ) : takeTest ? (
          <TakeTest selected={selected} takeATest={takeATest} />
        ) : selected.topic ? (
          <>
            <div className="mb-6 border-b pb-3">
              <h2 className="text-3xl max-lg:text-2xl font-bold tracking-wide">
                <span className="block uppercase text-primary font-semibold">
                  {selected.chapter}
                </span>
                <span className="block italic font-serif text-lg text-gray-500 mt-1">
                  {selected.topic}
                </span>
              </h2>
            </div>

            <div className="mb-6">
              {loading ? (
                <div className="flex items-center gap-2 text-blue-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <p>Generating AI explanation...</p>
                </div>
              ) : aiResponse ? (
                <div id="notebook-content" className="prose max-w-none whitespace-pre-wrap">
      <ReactMarkdown>{aiResponse}</ReactMarkdown>
    </div>
              ) : (
                <p className="text-red-500">No AI response available.</p>
              )}
            </div>

            <div className="mb-6">
              {videoLoading ? (
                <div className="flex items-center gap-2 text-blue-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <p>Finding relevant video...</p>
                </div>
              ) : video ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
                >
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    📺 Recommended Video
                  </h3>
                  {video.error ? (
                    <p className="text-red-500">{video.error}</p>
                  ) : (
                    <div className="space-y-2">
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm block hover:underline"
                      >
                        {video.title}
                      </a>
                      <p className="text-gray-600 text-sm">by {video.channel}</p>
                      {video.description && (
                        <p className="text-gray-500 text-xs">{video.description}</p>
                      )}
                    </div>
                  )}
                </motion.div>
              ) : null}
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={startQuiz}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl transition-colors"
              >
                🧪 Practice MCQs
              </button>
              <button
                onClick={takeATest}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors"
              >
                📝 Take a Test
              </button>
              <button
                onClick={downloadPDF}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors"
              >
                📄 Download PDF
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600 text-lg">
            Please select a chapter and topic from the sidebar to view its
            AI-generated explanation. 👉
          </p>
        )}
      </div>

      <div
        onClick={openSubjectbar}
        className={`w-full max-lg:h-[92vh] z-20 max-lg:bg-gray-900/80 absolute ${
          isSubjectbarOpen ? "hidden" : "max-lg:block"
        }`}
      ></div>
      <div
        className={`max-w-sm border-l z-30 border-gray-600 h-[90vh] overflow-y-auto ${
          isSubjectbarOpen
            ? "max-lg:w-0 overflow-hidden lg:p-3"
            : `transition-all w-1/2 max-lg:w-[60%] p-3 max-lg:absolute right-0 ${
                isDark ? "bg-gray-900" : "bg-white"
              }`
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base flex flex-col py-2">
            <p>
              Subject:{" "}
              <span className="text-blue-600 font-bold">
                {selectedSubject
                  .toLowerCase()
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </span>
            </p>
          </h2>
        </div>

        <form onSubmit={handleAddTopic} className="space-y-3 mb-6">
          <input
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            placeholder="Chapter name"
            className="w-full px-1 py-2 border-b outline-none text-gray-500"
          />
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic title"
            className="w-full px-1 py-2 border-b outline-none text-gray-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            Add Topic
          </button>
        </form>

        <div className="space-y-6">
          {Object.entries(chapterTopics).map(([chap, topics]) => (
            <div key={chap}>
              <h3 className="uppercase font-semibold mb-2">{chap}</h3>
              <ul className="ml-3 space-y-1">
                {topics.map((t, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {editing.chapter === chap && editing.topic === t ? (
                      <>
                        <input
                          value={editing.value}
                          onChange={(e) =>
                            setEditing((ed) => ({
                              ...ed,
                              value: e.target.value,
                            }))
                          }
                          className="px-2 w-[13vw] max-lg:w-[30vw] py-1 border rounded"
                        />
                        <button onClick={saveEdit} className="text-green-600">
                          ✅
                        </button>
                        <button
                          onClick={() =>
                            setEditing({ chapter: "", topic: "", value: "" })
                          }
                        >
                          ❌
                        </button>
                      </>
                    ) : (
                      <>
                        <span
                          onClick={() => {
                            setSelected({ chapter: chap, topic: t });
                            openSubjectbar();
                          }}
                          className="flex-1 cursor-pointer hover:text-blue-600"
                        >
                          {t}
                        </span>
                        <button
                          onClick={() => startEdit(chap, t)}
                          className="text-yellow-500"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteTopic(chap, t)}
                          className="text-red-500"
                        >
                          ❌
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <button
          onClick={openNotebook}
          className="mt-8 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
        >
          📓 Save Notebook
        </button>
        <button
          onClick={clearAllSubjectData}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
        >
          🗑️ Clear All Data
        </button>
      </div>
    </div>
  );
}