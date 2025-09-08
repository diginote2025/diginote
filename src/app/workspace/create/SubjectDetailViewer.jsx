"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toggleSubjectbar } from "@/redux/subjectbar";
import { setSavedResponses, setShowNotebook } from "@/redux/studyToolSlice";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from "react-icons/tb";
import SyllabusInput from "./SyllabusInput";
import ChapterList from "./ChapterList";
import MainContent from "./MainContent";
import * as pdfjs from "pdfjs-dist";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function AiStudyTool({ selectedSubject, isDark }) {
  const [hasMounted, setHasMounted] = useState(false);
  const [chapterTopics, setChapterTopics] = useState({});
  const [selected, setSelected] = useState({ chapter: "", topic: "" });
  const [editing, setEditing] = useState({ chapter: "", topic: "", value: "" });
  const [expandedChapters, setExpandedChapters] = useState({});
  const [chapterInput, setChapterInput] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [showChapterInput, setShowChapterInput] = useState(false);
  const [showTopicInput, setShowTopicInput] = useState("");
  const [isParsingSyllabus, setIsParsingSyllabus] = useState(false);
  const [parsingError, setParsingError] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const isInitialTopicLoad = useRef(true);

  const dispatch = useDispatch();
  const router = useRouter();
  const isSubjectbarOpen = useSelector((state) => state.subjectbar.isSubjectbarOpen);
  const savedResponses = useSelector((state) => state.studyTool.savedResponses);
  const showNotebook = useSelector((state) => state.studyTool.showNotebook);

  // Initialize component
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
    setShowCamera(false);
  }, [selectedSubject, dispatch]);

  // Save chapter topics to localStorage
  useEffect(() => {
    if (!hasMounted) return;
    const allTopics = JSON.parse(localStorage.getItem("chapterTopics") || "{}");
    allTopics[selectedSubject] = chapterTopics;
    localStorage.setItem("chapterTopics", JSON.stringify(allTopics));
  }, [chapterTopics, hasMounted, selectedSubject]);

  // File handling utilities
  const fileToGenerativePart = async (file) => {
    const base64EncodedData = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });
    return { inlineData: { mimeType: file.type, data: base64EncodedData } };
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
      await page.render({ canvasContext: context, viewport }).promise;
      const imageData = canvas.toDataURL("image/jpeg", 0.9).split(",")[1];
      imageParts.push({ inlineData: { mimeType: "image/jpeg", data: imageData } });
    }
    return imageParts;
  };

  const parseSyllabusToObject = (text) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "" && !/unit/i.test(line));
    const syllabus = {};
    let currentChapter = "";

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine.startsWith("-") && !trimmedLine.startsWith("*") && !/^\d+\./.test(trimmedLine)) {
        currentChapter = trimmedLine.replace(/:$/, "").trim();
        if (currentChapter) syllabus[currentChapter] = [];
      } else if (currentChapter) {
        const topic = trimmedLine.replace(/^[-*\d.]+\s*/, "").trim();
        if (topic) syllabus[currentChapter].push(topic);
      }
    });

    if (Object.keys(syllabus).length === 0 && lines.length > 0) {
      syllabus["Imported Syllabus"] = lines.map((line) => line.replace(/^[-*\d.]+\s*/, "").trim());
    }
    return syllabus;
  };

  const openSubjectbar = () => dispatch(toggleSubjectbar());

  if (!hasMounted) return null;

  return (
    <div className="flex flex-row h-[100vh]">
      <MainContent
        selected={selected}
        isDark={isDark}
        showNotebook={showNotebook}
        isSubjectbarOpen={isSubjectbarOpen}
        openSubjectbar={openSubjectbar}
        showCamera={showCamera}
        videoRef={videoRef}
        canvasRef={canvasRef}
        setShowCamera={setShowCamera}
      />
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
            : `transition-all w-1/2 max-lg:w-[75%] p-3 max-lg:absolute right-0 ${isDark ? "bg-gray-900" : "bg-white"}`
        }`}
      >
        <h2 className="text-lg font-semibold flex flex-col py-2">
          <p>
            Subject: <span className="text-blue-600 font-bold">{selectedSubject}</span>
          </p>
        </h2>
        <SyllabusInput
          isParsingSyllabus={isParsingSyllabus}
          setIsParsingSyllabus={setIsParsingSyllabus}
          parsingError={parsingError}
          setParsingError={setParsingError}
          fileInputRef={fileInputRef}
          showCamera={showCamera}
          setShowCamera={setShowCamera}
          videoRef={videoRef}
          canvasRef={canvasRef}
          setChapterTopics={setChapterTopics}
          setExpandedChapters={setExpandedChapters}
          fileToGenerativePart={fileToGenerativePart}
          pdfToImageParts={pdfToImageParts}
          parseSyllabusToObject={parseSyllabusToObject}
        />
        <ChapterList
          chapterTopics={chapterTopics}
          setChapterTopics={setChapterTopics}
          selected={selected}
          setSelected={setSelected}
          editing={editing}
          setEditing={setEditing}
          expandedChapters={expandedChapters}
          setExpandedChapters={setExpandedChapters}
          showChapterInput={showChapterInput}
          setShowChapterInput={setShowChapterInput}
          chapterInput={chapterInput}
          setChapterInput={setChapterInput}
          showTopicInput={showTopicInput}
          setShowTopicInput={setShowTopicInput}
          topicInput={topicInput}
          setTopicInput={setTopicInput}
          savedResponses={savedResponses}
          dispatch={dispatch}
          selectedSubject={selectedSubject}
          isDark={isDark}
        />
        <button
          onClick={() => router.push("/workspace/notes")}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-6"
        >
          Open Notebook
        </button>
      </div>
    </div>
  );
}