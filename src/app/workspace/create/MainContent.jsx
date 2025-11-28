"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from "react-icons/tb";
import NotebookView from "./NotebookView";
import MCQ from "./MCQ";
import TakeTest from "./TakeTest";
  import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
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
  const [onlyDefinition, setOnlyDefinition] = useState(false);
  const [includeExamples, setIncludeExamples] = useState(false);

  const dispatch = useDispatch();
  const savedResponses = useSelector((state) => state.studyTool.savedResponses);

  const fetchYouTubeVideo = useCallback(
    async (topic) => {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      if (!apiKey) {
        console.error("YouTube API key is not configured.");
        setVideo({
          error:
            "YouTube API key is missing. Please add NEXT_PUBLIC_YOUTUBE_API_KEY to your environment variables.",
        });
        return;
      }

      const baseUrl = "https://www.googleapis.com/youtube/v3/search";
      const reputableChannels = {
        "Traversy Media": "UC29ju8bIPH5as8OGnQzwJyA",
        "freeCodeCamp.org": "UC8butISFwT-Wl7EV0hUK0BQ",
        "The Net Ninja": "UCW5YeuERMmlnqo4oq8vwUpg",
        Academind: "UCSJbGtTlrDami-tDGPUV9-w",
      };

      try {
        setVideoLoading(true);
        setVideo(null);

        const response = await axios.get(baseUrl, {
          params: {
            part: "snippet",
            q: `${selected.subject} ${topic} tutorial explanation`,
            type: "video",
            maxResults: 20,
            order: "relevance",
            key: apiKey,
            videoDuration: "medium",
            videoDefinition: "high",
          },
          timeout: 10000,
        });

        const videos = response.data.items || [];
        if (videos.length === 0) {
          console.warn(`No videos found for topic: ${topic}`);
          setVideo({
            error: `No educational videos found for "${topic}". Try a different search term.`,
          });
          return;
        }

        const reputableVideos = videos.filter((video) =>
          Object.values(reputableChannels).includes(video.snippet.channelId)
        );
        const qualityVideos = videos.filter((video) => {
          const title = video.snippet.title.toLowerCase();
          const description = video.snippet.description.toLowerCase();
          return (
            title.includes("tutorial") ||
            title.includes("explained") ||
            title.includes("guide") ||
            title.includes("learn") ||
            description.includes("tutorial") ||
            description.includes("education")
          );
        });

        const bestVideo =
          reputableVideos.length > 0
            ? reputableVideos[0]
            : qualityVideos.length > 0
            ? qualityVideos[0]
            : videos[0];
        setVideo({
          title: bestVideo.snippet.title,
          url: `https://www.youtube.com/watch?v=${bestVideo.id.videoId}`,
          channel: bestVideo.snippet.channelTitle,
          thumbnail:
            bestVideo.snippet.thumbnails?.medium?.url ||
            bestVideo.snippet.thumbnails?.default?.url,
          description: bestVideo.snippet.description?.slice(0, 100) + "..." || "",
        });
      } catch (error) {
        console.error("Error fetching YouTube video:", error);
        if (error.response?.status === 403) {
          setVideo({
            error:
              "YouTube API quota exceeded or invalid API key. Please check your API key and quota limits.",
          });
        } else if (error.response?.status === 400) {
          setVideo({ error: "Invalid search parameters. Please try a different topic." });
        } else if (error.code === "ECONNABORTED") {
          setVideo({
            error: "Request timed out. Please check your internet connection and try again.",
          });
        } else {
          setVideo({ error: `Failed to fetch video: ${error.message}` });
        }
      } finally {
        setVideoLoading(false);
      }
    },
    [selected.subject]
  );

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
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  }, [selected.chapter]);

  const fetchAIResponse = useCallback(
    async (chapter, topic, forceRefresh = false) => {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        setAiResponse(
          "❌ Gemini API key is not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables."
        );
        setApiError("Missing API key");
        return;
      }

      if (!forceRefresh && savedResponses[chapter]?.[topic]) {
        console.log("Using cached response for:", chapter, topic);
        setAiResponse(savedResponses[chapter][topic]);
        return;
      }

      setLoading(true);
      setApiError("");
      setAiResponse("");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        let prompt = `In the subject of ${selected.subject}, `;
        if (onlyDefinition) {
          prompt += `please provide a concise definition of the topic "${topic}" from the chapter "${chapter}". Keep it brief and to the point.`;
        } else {
          prompt += `please provide a comprehensive explanation of the topic "${topic}" from the chapter "${chapter}".`;
          if (includeExamples) {
            prompt += ` Include practical, relevant examples.`;
          }
        }

        const requestBody = {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: onlyDefinition ? 256 : 1024,
          },
        };

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDHnDJDS-Kx2yR3pafo6bf9Vc-LbLMerPk`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `HTTP ${response.status}: ${errorData.error?.message || response.statusText}`
          );
        }

        const data = await response.json();
        if (!data.candidates?.[0]?.content) {
          throw new Error("Invalid response format from Gemini API");
        }

        const text = data.candidates[0].content.parts[0].text || "No response generated.";
        setAiResponse(text);

        const currentResponses = JSON.parse(JSON.stringify(savedResponses));
        if (!currentResponses[chapter]) {
          currentResponses[chapter] = {};
        }
        currentResponses[chapter][topic] = text;

        dispatch(setSavedResponses(currentResponses));

        const allResponses = JSON.parse(localStorage.getItem("savedResponses") || "{}");
        if (!allResponses[selected.subject]) {
          allResponses[selected.subject] = {};
        }
        allResponses[selected.subject] = currentResponses;
        localStorage.setItem("savedResponses", JSON.stringify(allResponses));
      } catch (error) {
        console.error("Error fetching AI response:", error);
        let errorMessage = "❌ Failed to get AI response. ";
        if (error.name === "AbortError") {
          errorMessage += "Request timed out.";
        } else if (error.message.includes("429")) {
          errorMessage += "API quota exceeded. Please wait and try again.";
        } else {
          errorMessage += error.message;
        }
        setAiResponse(errorMessage);
        setApiError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [selected.subject, onlyDefinition, includeExamples, savedResponses, dispatch]
  );

  useEffect(() => {
    if (!selected.chapter || !selected.topic) {
      setAiResponse("");
      return;
    }
    fetchAIResponse(selected.chapter, selected.topic);
  }, [selected.chapter, selected.topic, onlyDefinition, includeExamples, fetchAIResponse]);

  useEffect(() => {
    if (!selected.topic) {
      setVideo(null);
      return;
    }
    fetchYouTubeVideo(selected.topic);
  }, [selected.topic, fetchYouTubeVideo]);

  const startQuiz = () => {
    const mock = [
      { question: `Key idea of ${selected.topic}?`, options: ["A", "B", "C", "D"], correct: 1 },
      { question: `Real life use of ${selected.topic}?`, options: ["A", "B", "C", "D"], correct: 2 },
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

  const takeATest = () => setTakeTest((prev) => !prev);
  const takeAMCQ = () => setShowMCQ((prev) => !prev);

  return (
    <div className="w-full overflow-y-auto custom-scrollbar">
      <div className="w-full flex justify-between max-lg:py-0">
        <button
          className={`text-2xl p-[11px] ${isDark ? "bg-gray-900 text-white" : "bg-white"} z-40 rounded-xl absolute right-5 top-4 border border-gray-600 hidden max-lg:block`}
          onClick={openSubjectbar}
        >
          {isSubjectbarOpen ? <TbLayoutSidebarLeftCollapse /> : <TbLayoutSidebarRightCollapse />}
        </button>
      </div>
      {showNotebook ? (
        <NotebookView downloadPDF={downloadPDF} />
      ) : showMCQ ? (
        <>
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
            <div className="p-4">
              <p className="text-xl font-semibold text-blue-600">
                🎉 Quiz Complete! Your Score: {score} / {questions.length}
              </p>
              <button
                onClick={() => setShowMCQ(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
              >
                🔙 Back to Topic
              </button>
            </div>
          )}
        </>
      ) : takeTest ? (
        <TakeTest selected={selected} takeATest={takeATest} aiResponse={aiResponse} isDark={isDark} />
      ) : selected.topic ? (
        <>
          <div className="mb-6 border-b pb-3 px-4 max-lg:pt-20 py-4">
            <h2 className="text-3xl max-lg:text-2xl font-bold tracking-wide">
              <span className="block uppercase text-primary font-semibold">{selected.chapter}</span>
              <span className="block italic font-serif text-lg text-gray-500 mt-1">{selected.topic}</span>
            </h2>
          </div>
          {/* <div className="mb-4 px-4 flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={onlyDefinition}
                onChange={(e) => setOnlyDefinition(e.target.checked)}
                className="w-4 h-4"
              />
              Only Definition
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeExamples}
                onChange={(e) => setIncludeExamples(e.target.checked)}
                className="w-4 h-4"
              />
              Include Examples
            </label>
          </div> */}
          <div className="mb-6 px-4">
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
              <p className="text-gray-500">Click on a topic to get AI explanation...</p>
            )}
          </div>
          <div className="mb-6 px-4">
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
                className={`border rounded-lg p-4 ${isDark ? "bg-gray-800" : "bg-gray-200"}`}
              >
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">📺 Recommended Video</h3>
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
                    {video.description && <p className="text-gray-500 text-xs">{video.description}</p>}
                  </div>
                )}
              </motion.div>
            ) : null}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6 px-4">
            <button
              onClick={startQuiz}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl transition-colors"
            >
              Practice MCQs
            </button>
            <button
              onClick={takeATest}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors"
            >
              Take a Test
            </button>
            <button
              onClick={downloadPDF}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors"
            >
              Download PDF
            </button>
          </div>
        </>
      ) : (
        <div className="text-gray-600 relative text-lg p-4 h-[100vh] flex justify-center items-center">
          <Image
            src="/images/homepage/navbar/DN.png"
            alt=""
            className="opacity-10 rounded-2xl max-lg:w-[120px] max-lg:h-[120px]"
            height={150}
            width={150}
          />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
                isDark ? "bg-blue-500" : "bg-blue-400"
              } blur-3xl animate-pulse`}
            ></div>
            <div
              className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${
                isDark ? "bg-purple-500" : "bg-purple-400"
              } blur-3xl animate-pulse`}
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}