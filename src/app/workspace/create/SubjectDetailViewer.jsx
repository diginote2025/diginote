"use client";

import { ArrowLeft, Camera, Upload, Loader2, X } from "lucide-react";
import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { setSavedResponses, setShowNotebook } from "@/redux/studyToolSlice";
import Image from "next/image";
import * as pdfjs from "pdfjs-dist";

// Configure the PDF.js worker from a CDN.
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function AiStudyTool({ selectedSubject, isDark }) {
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
  const [onlyDefinition, setOnlyDefinition] = useState(false);
  const [includeExamples, setIncludeExamples] = useState(false);
  const [video, setVideo] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showChapterInput, setShowChapterInput] = useState(false);
  const [showTopicInput, setShowTopicInput] = useState("");
  const [expandedChapters, setExpandedChapters] = useState({});
  const [chapterInput, setChapterInput] = useState("");
  const [topicInput, setTopicInput] = useState("");

  const [isParsingSyllabus, setIsParsingSyllabus] = useState(false);
  const [parsingError, setParsingError] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // FIX: Add a ref to track if it's an initial load for a topic.
  // This helps prevent the double API call.
  const isInitialTopicLoad = useRef(true);

  const dispatch = useDispatch();
  const router = useRouter();
  const isSubjectbarOpen = useSelector(
    (state) => state.subjectbar.isSubjectbarOpen
  );
  const savedResponses = useSelector((state) => state.studyTool.savedResponses);
  const showNotebook = useSelector((state) => state.studyTool.showNotebook);

  // All your functions (fileToGenerativePart, pdfToImageParts, etc.) remain the same.
  const fileToGenerativePart = async (file) => {
    const base64EncodedData = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { mimeType: file.type, data: base64EncodedData },
    };
  };

  const pdfToImageParts = async (file) => {
    const fileBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument(fileBuffer).promise;
    const imageParts = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport: viewport }).promise;
      const imageData = canvas.toDataURL("image/jpeg", 0.9).split(",")[1];
      imageParts.push({
        inlineData: { mimeType: "image/jpeg", data: imageData },
      });
    }
    return imageParts;
  };

  const parseSyllabusToObject = (text) => {
    const lines = text
      .split("\n")
      .filter((line) => line.trim() !== "" && !/unit/i.test(line));
    const syllabus = {};
    let currentChapter = "";

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (
        !trimmedLine.startsWith("-") &&
        !trimmedLine.startsWith("*") &&
        !/^\d+\./.test(trimmedLine)
      ) {
        currentChapter = trimmedLine.replace(/:$/, "").trim();
        if (currentChapter) {
          syllabus[currentChapter] = [];
        }
      } else if (currentChapter) {
        const topic = trimmedLine.replace(/^[-*\d.]+\s*/, "").trim();
        if (topic) {
          syllabus[currentChapter].push(topic);
        }
      }
    });

    if (Object.keys(syllabus).length === 0 && lines.length > 0) {
      syllabus["Imported Syllabus"] = lines.map((line) =>
        line.replace(/^[-*\d.]+\s*/, "").trim()
      );
    }

    return syllabus;
  };

  const handleSyllabusFile = async (file) => {
    if (!file) return;

    setIsParsingSyllabus(true);
    setParsingError("");

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key is not configured.");
      }

      const prompt = `
        Analyze the provided syllabus image(s). Extract all **chapter** titles and the topics listed under each one.
        **You must ignore any sections titled 'Unit' or 'Module'. Only focus on 'Chapter'.**
        Format the output as plain text. Each chapter title should be on its own line. Each topic under a chapter should be on a new line, starting with a hyphen.
        
        Example:
        Chapter 1: Introduction to Programming
        - History of Programming
        - Basic Syntax
        Chapter 2: Control Flow
        - Conditional Statements
        - Loops
      `;

      let parts = [];
      if (file.type === "application/pdf") {
        parts = await pdfToImageParts(file);
      } else {
        parts = [await fileToGenerativePart(file)];
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }, ...parts] }],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || `API Error: ${response.status}`
        );
      }

      const data = await response.json();
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!resultText) {
        throw new Error(
          "Failed to parse the syllabus. The AI returned an empty response."
        );
      }

      const parsedSyllabus = parseSyllabusToObject(resultText);

      if (Object.keys(parsedSyllabus).length === 0) {
        throw new Error(
          "Could not identify any chapters. Please try a clearer image or a file that contains chapter headings."
        );
      }

      setChapterTopics(parsedSyllabus);
      const newExpandedState = Object.keys(parsedSyllabus).reduce(
        (acc, chapter) => {
          acc[chapter] = true;
          return acc;
        },
        {}
      );
      setExpandedChapters(newExpandedState);
    } catch (err) {
      console.error("Syllabus parsing error:", err);
      setParsingError(err.message);
    } finally {
      setIsParsingSyllabus(false);
      setShowCamera(false);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setParsingError("Could not access camera. Please check permissions.");
        setShowCamera(false);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      canvas.toBlob((blob) => {
        const imageFile = new File([blob], "syllabus_capture.jpg", {
          type: "image/jpeg",
        });
        handleSyllabusFile(imageFile);
      }, "image/jpeg");

      stopCamera();
    }
  };

  const handleAddChapter = () => {
    if (!chapterInput.trim()) return;

    setChapterTopics((prev) => {
      const curr = { ...prev };
      curr[chapterInput] = [];
      return curr;
    });

    setExpandedChapters((prev) => ({
      ...prev,
      [chapterInput]: true,
    }));

    setShowTopicInput(chapterInput);
    setChapterInput("");
    setShowChapterInput(false);
  };

  const handleAddTopicToChapter = (chapterName) => {
    if (!topicInput.trim()) return;

    setChapterTopics((prev) => {
      const curr = { ...prev };
      if (!curr[chapterName]) curr[chapterName] = [];
      if (!curr[chapterName].includes(topicInput))
        curr[chapterName].push(topicInput);
      return curr;
    });

    setTopicInput("");
    setShowTopicInput("");
  };

  const toggleChapter = (chapterName) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterName]: !prev[chapterName],
    }));
  };

  const openSubjectbar = () => {
    dispatch(toggleSubjectbar());
  };

  const fetchYouTubeVideo = useCallback(async (topic) => {
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
          q: `${selectedSubject} ${topic} tutorial explanation`,
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

      console.log("Successfully fetched video:", bestVideo.snippet.title);
    } catch (error) {
      console.error("Error fetching YouTube video:", error);

      if (error.response?.status === 403) {
        setVideo({
          error:
            "YouTube API quota exceeded or invalid API key. Please check your API key and quota limits.",
        });
      } else if (error.response?.status === 400) {
        setVideo({
          error: "Invalid search parameters. Please try a different topic.",
        });
      } else if (error.code === "ECONNABORTED") {
        setVideo({
          error:
            "Request timed out. Please check your internet connection and try again.",
        });
      } else {
        setVideo({ error: `Failed to fetch video: ${error.message}` });
      }
    } finally {
      setVideoLoading(false);
    }
  }, [selectedSubject]);

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

  useEffect(() => {
    setHasMounted(true);

    localStorage.setItem("currentSubject", selectedSubject);

    const allTopics = JSON.parse(localStorage.getItem("chapterTopics") || "{}");
    const allResponses = JSON.parse(
      localStorage.getItem("savedResponses") || "{}"
    );

    if (!allTopics[selectedSubject]) allTopics[selectedSubject] = {};
    if (!allResponses[selectedSubject]) allResponses[selectedSubject] = {};

    setChapterTopics(allTopics[selectedSubject] || {});
    dispatch(setSavedResponses(allResponses[selectedSubject] || {}));

    localStorage.setItem(
      "study_tool_responses",
      JSON.stringify(allResponses[selectedSubject] || {})
    );

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

  useEffect(() => {
    if (!hasMounted) return;
    const allTopics = JSON.parse(localStorage.getItem("chapterTopics") || "{}");
    allTopics[selectedSubject] = chapterTopics;
    localStorage.setItem("chapterTopics", JSON.stringify(allTopics));
  }, [chapterTopics, hasMounted, selectedSubject]);

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
        let prompt = `In the subject of ${selectedSubject}, `;
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
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
            `HTTP ${response.status}: ${
              errorData.error?.message || response.statusText
            }`
          );
        }

        const data = await response.json();

        if (!data.candidates?.[0]?.content) {
          throw new Error("Invalid response format from Gemini API");
        }

        const text =
          data.candidates[0].content.parts[0].text || "No response generated.";

        setAiResponse(text);

        const currentResponses = JSON.parse(JSON.stringify(savedResponses));
        if (!currentResponses[chapter]) {
          currentResponses[chapter] = {};
        }
        currentResponses[chapter][topic] = text;

        dispatch(setSavedResponses(currentResponses));

        const allResponses = JSON.parse(
          localStorage.getItem("savedResponses") || "{}"
        );
        if (!allResponses[selectedSubject]) {
          allResponses[selectedSubject] = {};
        }
        allResponses[selectedSubject] = currentResponses;

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
        setApiError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [savedResponses, dispatch, selectedSubject, onlyDefinition, includeExamples]
  );

  // FIX: This is now the *only* useEffect responsible for fetching AI data.
  useEffect(() => {
    const { chapter, topic } = selected;

    if (!chapter || !topic) {
      setAiResponse("");
      return;
    }

    // If it's the initial load for this topic, fetch normally (use cache if possible)
    if (isInitialTopicLoad.current) {
      console.log("New topic selected:", chapter, topic);
      fetchAIResponse(chapter, topic, false);
      isInitialTopicLoad.current = false; // Mark initial load as complete
    } else {
      // If it's not the initial load, it means a setting like 'onlyDefinition' changed.
      // In this case, we *force* a refresh.
      console.log("Settings changed, refetching AI response");
      fetchAIResponse(chapter, topic, true);
    }
  }, [
    selected.chapter,
    selected.topic,
    onlyDefinition,
    includeExamples,
    fetchAIResponse,
  ]);

  // FIX: We need another small effect to reset our ref when the topic *actually* changes.
  useEffect(() => {
    isInitialTopicLoad.current = true;
  }, [selected.topic]);

  useEffect(() => {
    if (!selected.topic) {
      setVideo(null);
      return;
    }
    fetchYouTubeVideo(selected.topic);
  }, [selected.topic, fetchYouTubeVideo]);

  const handleDeleteTopic = (chapName, topicName) => {
    if (
      !confirm(
        `Are you sure you want to delete topic "${topicName}" from chapter "${chapName}"?`
      )
    )
      return;

    setChapterTopics((prev) => {
      const curr = { ...prev };
      curr[chapName] = curr[chapName].filter((t) => t !== topicName);
      if (curr[chapName].length === 0) delete curr[chapName];
      return curr;
    });

    const updated = JSON.parse(JSON.stringify(savedResponses));
    if (updated[chapName]) {
      delete updated[chapName][topicName];
      if (Object.keys(updated[chapName]).length === 0) delete updated[chapName];
    }

    dispatch(setSavedResponses(updated));

    const allResponses = JSON.parse(
      localStorage.getItem("savedResponses") || "{}"
    );
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

    const updated = JSON.parse(JSON.stringify(savedResponses));
    if (updated[chap] && updated[chap][oldT]) {
      updated[chap][newT] = updated[chap][oldT];
      delete updated[chap][oldT];
      dispatch(setSavedResponses(updated));

      const allResponses = JSON.parse(
        localStorage.getItem("savedResponses") || "{}"
      );
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

  const openNotebook = () => {
    const currentData = { ...savedResponses };
    localStorage.setItem("study_tool_responses", JSON.stringify(currentData));
    router.push("/workspace/notes");
  };

  if (!hasMounted) return null;

  return (
    <div className="flex flex-row h-[100vh]">
      {showCamera && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
          <video
            ref={videoRef}
            autoPlay
            className="w-full max-w-4xl h-auto rounded-lg"
          ></video>
          <canvas ref={canvasRef} className="hidden"></canvas>
          <div className="mt-4 flex gap-4">
            <button
              onClick={captureImage}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg"
            >
              Capture
            </button>
            <button
              onClick={stopCamera}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="w-full overflow-y-auto custom-scrollbar">
        <div className="w-full flex justify-between max-lg:py-0">
          <button
            className={`text-2xl p-[11px] ${
              isDark ? "bg-gray-900 text-white" : "bg-white"
            } z-40 rounded-xl absolute 
            right-5 top-4 border border-gray-600 hidden max-lg:block`}
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
            {!quizFinished ? (
              <MCQ
                selected={selected}
                takeAMCQ={takeAMCQ}
                aiResponse={aiResponse}
                isDark={isDark}
              />
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
          <TakeTest
            selected={selected}
            takeATest={takeATest}
            aiResponse={aiResponse}
            isDark={isDark}
          />
        ) : selected.topic ? (
          <>
            <div className="mb-6 border-b pb-3 px-4 max-lg:pt-20 py-4">
              <h2 className="text-3xl max-lg:text-2xl font-bold tracking-wide">
                <span className="block uppercase text-primary font-semibold">
                  {selected.chapter}
                </span>
                <span className="block italic font-serif text-lg text-gray-500 mt-1">
                  {selected.topic}
                </span>
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
                <div
                  id="notebook-content"
                  className="prose max-w-none whitespace-pre-wrap"
                >
                  <ReactMarkdown>{aiResponse}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-gray-500">
                  Click on a topic to get AI explanation...
                </p>
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
                  className={`border rounded-lg p-4 ${
                    isDark ? "bg-gray-800" : "bg-gray-200"
                  }`}
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
                      <p className="text-gray-600 text-sm">
                        by {video.channel}
                      </p>
                      {video.description && (
                        <p className="text-gray-500 text-xs">
                          {video.description}
                        </p>
                      )}
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
              src={"/images/homepage/navbar/DN.png"}
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

      <div
        onClick={openSubjectbar}
        className={`w-full max-lg:h-[100vh] z-20 max-lg:bg-black/50 backdrop-blur-sm absolute ${
          isSubjectbarOpen ? "hidden" : "max-lg:block"
        }`}
      ></div>
      <div
        className={`max-w-sm border-l z-30 border-gray-600 h-[100vh] overflow-y-auto ${
          isSubjectbarOpen
            ? "max-lg:w-0 overflow-hidden lg:p-3"
            : `transition-all w-1/2 max-lg:w-[75%] p-3 max-lg:absolute right-0 ${
                isDark ? "bg-gray-900" : "bg-white"
              }`
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold flex flex-col py-2">
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

        <div className="border border-gray-600 rounded-lg p-3 mb-4">
          <h3 className="font-semibold mb-3 text-center">
            Generate Syllabus with AI
          </h3>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="application/pdf, image/png, image/jpeg"
              onChange={(e) => handleSyllabusFile(e.target.files[0])}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={isParsingSyllabus}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-all disabled:bg-gray-500"
            >
              <Upload size={18} /> Upload
            </button>
            <button
              onClick={startCamera}
              disabled={isParsingSyllabus}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-3 rounded-lg transition-all disabled:bg-gray-500"
            >
              <Camera size={18} /> Scan
            </button>
          </div>
          {isParsingSyllabus && (
            <div className="flex items-center justify-center gap-2 mt-3 text-yellow-400">
              <Loader2 className="animate-spin" size={20} />
              <span>Parsing your syllabus...</span>
            </div>
          )}
          {parsingError && (
            <div className="mt-3 p-2 bg-red-900/50 border border-red-700 text-red-300 text-sm rounded-md">
              <p className="font-bold">Error:</p>
              <p>{parsingError}</p>
            </div>
          )}
        </div>

        <>
          {!showChapterInput && Object.keys(chapterTopics).length === 0 && (
            <button
              onClick={() => setShowChapterInput(true)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600
               to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4
               rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] mb-4"
            >
              <span className="text-lg">+</span>
              Add Chapter Manually
            </button>
          )}

          <div className="space-y-4 ">
            {Object.entries(chapterTopics).map(([chapterName, topics]) => (
              <div
                key={chapterName}
                className="border rounded-lg border-gray-600"
              >
                <div
                  onClick={() => toggleChapter(chapterName)}
                  className={`flex items-center justify-between p-3 cursor-pointer rounded-t-lg `}
                >
                  <h3 className="font-semibold text-blue-600">{chapterName}</h3>
                  <span className="text-gray-500">
                    {expandedChapters[chapterName] ? "▼" : "▶"}
                  </span>
                </div>

                {expandedChapters[chapterName] && (
                  <div className="border-t border-gray-600 px-3 pb-3">
                    <div className="space-y-1 mt-2">
                      {topics.map((topicName) => (
                        <div
                          key={topicName}
                          className={`group flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                            selected.chapter === chapterName &&
                            selected.topic === topicName
                              ? "bg-blue-900/50"
                              : ""
                          }
                          
                          ${
                            isDark ? "hover:bg-gray-800" : "hover:bg-gray-200"
                          }`}
                        >
                          {editing.chapter === chapterName &&
                          editing.topic === topicName ? (
                            <div className="flex-1 flex gap-2">
                              <input
                                value={editing.value}
                                onChange={(e) =>
                                  setEditing((prev) => ({
                                    ...prev,
                                    value: e.target.value,
                                  }))
                                }
                                className="flex-1 px-1 py-1 w-10 rounded text-sm outline-none bg-slate-700 border border-slate-600"
                                onKeyPress={(e) =>
                                  e.key === "Enter" && saveEdit()
                                }
                                autoFocus
                              />
                              <button
                                onClick={saveEdit}
                                className="text-green-600 hover:text-green-800 text-lg"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() =>
                                  setEditing({
                                    chapter: "",
                                    topic: "",
                                    value: "",
                                  })
                                }
                                className="text-red-600 hover:text-red-800 text-lg"
                              >
                                ✗
                              </button>
                            </div>
                          ) : (
                            <>
                              <span
                                onClick={() =>
                                  setSelected({
                                    chapter: chapterName,
                                    topic: topicName,
                                  })
                                }
                                className="flex-1 text-sm "
                              >
                                {topicName}
                              </span>
                              <div className="flex gap-1  transition-opacity">
                                <button
                                  onClick={() =>
                                    startEdit(chapterName, topicName)
                                  }
                                  className="text-blue-500 hover:text-blue-400 text-xs"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteTopic(chapterName, topicName)
                                  }
                                  className="text-red-500 hover:text-red-400 text-xs"
                                >
                                  🗑️
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    {showTopicInput === chapterName ? (
                      <div className="mt-3">
                        <label className="block text-sm font-medium mb-2">
                          Topic Name
                        </label>
                        <div className="flex gap-2">
                          <input
                            value={topicInput}
                            onChange={(e) => setTopicInput(e.target.value)}
                            placeholder="Enter topic name"
                            className="flex-1 px-3 py-2 w-10 bg-slate-500 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                            onKeyPress={(e) =>
                              e.key === "Enter" &&
                              handleAddTopicToChapter(chapterName)
                            }
                            autoFocus
                          />
                          <button
                            onClick={() => handleAddTopicToChapter(chapterName)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => {
                              setTopicInput("");
                              setShowTopicInput("");
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                          >
                            ✗
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowTopicInput(chapterName)}
                        className="w-full mt-3 flex items-center justify-center gap-2 bg-green-600/20 hover:bg-green-600/40 text-green-300 py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        <span>+</span>
                        Add Topic
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {showChapterInput && (
            <div className="border my-6 rounded-lg p-3  mb-4">
              <label className="block text-sm font-medium mb-2">
                Chapter Name
              </label>
              <div className="flex gap-2">
                <input
                  value={chapterInput}
                  onChange={(e) => setChapterInput(e.target.value)}
                  placeholder="Enter chapter name"
                  className="flex-1 px-3 py-2 w-10 bg-slate-500 text-white  border border-slate-600 rounded-lg focus:ring-2
                   focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  onKeyPress={(e) => e.key === "Enter" && handleAddChapter()}
                  autoFocus
                />
                <button
                  onClick={handleAddChapter}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg"
                >
                  ✓
                </button>
                <button
                  onClick={() => {
                    setChapterInput("");
                    setShowChapterInput(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                >
                  ✗
                </button>
              </div>
            </div>
          )}

          {Object.keys(chapterTopics).length > 0 &&
            !showChapterInput &&
            !showTopicInput && (
              <button
                onClick={() => setShowChapterInput(true)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-4"
              >
                <span className="text-lg">+</span>
                Add Another Chapter
              </button>
            )}
        </>

        <div className="mt-6 space-y-2">
          <button
            onClick={openNotebook}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Open Notebook
          </button>
        </div>
      </div>
    </div>
  );
}