"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { 
  ArrowLeft, 
  Download, 
  BookOpen, 
  FileText, 
  Edit3, 
  Save, 
  X, 
  Trash2, 
  AlertCircle,
  CheckCircle,
  Loader2,
  BookOpenCheck,
  Sparkles
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import HTMLFlipBook from "react-pageflip";
import { setDownloadPDF, setSavedResponses } from "@/redux/studyToolSlice";

const PAGE_WIDTH = 420;
const PAGE_HEIGHT = 580;
const PAGE_PADDING = 40;

const NotesPageFlip = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const savedResponses = useSelector((state) => state.studyTool.savedResponses);
  const { isDark } = useSelector((state) => state.theme);
  const downloadPDF = useSelector((state) => state.studyTool.downloadPDF);

  const [editChapter, setEditChapter] = useState(null);
  const [editTopic, setEditTopic] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isFlipBookReady, setIsFlipBookReady] = useState(false);

  const measurerRef = useRef(null);
  const flipBookRef = useRef(null);

  // Enhanced pagination with better content splitting
  const paginatedResponses = useMemo(() => {
    if (!measurerRef.current) return {};

    const paginated = {};
    const measurer = measurerRef.current;

    Object.assign(measurer.style, {
      width: `${PAGE_WIDTH - PAGE_PADDING}px`,
      padding: "20px",
      fontSize: "14px",
      lineHeight: "1.6",
      position: "absolute",
      visibility: "hidden",
      whiteSpace: "normal",
      overflowWrap: "break-word",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    });

    Object.entries(savedResponses).forEach(([chapter, topics]) => {
      paginated[chapter] = {};
      Object.entries(topics).forEach(([topic, content]) => {
        const lines = content.split(/\n/).filter((line) => line.trim().length);
        let pages = [];
        let currentPageLines = [];

        for (let line of lines) {
          currentPageLines.push(line);
          measurer.innerText = currentPageLines.join("\n");
          if (measurer.scrollHeight > PAGE_HEIGHT - PAGE_PADDING - 100) {
            currentPageLines.pop();
            if (currentPageLines.length === 0) {
              currentPageLines.push(line);
            }
            pages.push(currentPageLines.join("\n"));
            currentPageLines = [line];
          }
        }
        if (currentPageLines.length > 0) {
          pages.push(currentPageLines.join("\n"));
        }
        paginated[chapter][topic] = pages;
      });
    });

    return paginated;
  }, [savedResponses, isDark]);

  // Load saved responses from localStorage on mount
  useEffect(() => {
    try {
      const currentSubject = localStorage.getItem("currentSubject");
      const allResponses = JSON.parse(localStorage.getItem("savedResponses") || "{}");
      let savedData;
      if (currentSubject && allResponses[currentSubject]) {
        savedData = allResponses[currentSubject];
      } else {
        savedData = localStorage.getItem("study_tool_responses");
        if (savedData) savedData = JSON.parse(savedData);
      }
      if (savedData && Object.keys(savedData).length) {
        dispatch(setSavedResponses(savedData));
      }
    } catch (error) {
      console.error("Error loading saved responses from localStorage:", error);
    }
  }, [dispatch]);

  // Save to localStorage on changes
  useEffect(() => {
    if (Object.keys(savedResponses).length > 0) {
      try {
        localStorage.setItem("study_tool_responses", JSON.stringify(savedResponses));
        const currentSubject = localStorage.getItem("currentSubject");
        if (currentSubject) {
          const allResponses = JSON.parse(localStorage.getItem("savedResponses") || "{}");
          allResponses[currentSubject] = savedResponses;
          localStorage.setItem("savedResponses", JSON.stringify(allResponses));
        }
      } catch (error) {
        console.error("Error saving responses to localStorage:", error);
      }
    }
  }, [savedResponses]);

  // Enhanced PDF export with better styling
  const handleDownloadPDF = async () => {
    if (Object.keys(savedResponses).length === 0) {
      alert("No content available to export to PDF.");
      return;
    }
    dispatch(setDownloadPDF({
      status: "loading", filename: null, timestamp: new Date().toISOString(),
    }));
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const filename = `Study_Notes_${new Date().toISOString().split("T")[0]}.pdf`;
      let yPosition = 30;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 25;
      const maxWidth = doc.internal.pageSize.width - margin * 2;

      // Enhanced header
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, doc.internal.pageSize.width, 50, "F");
      
      doc.setFontSize(24);
      doc.setFont(undefined, "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("📓 Study Notebook", margin, 25);
      
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 35);

      yPosition = 70;
      doc.setTextColor(0, 0, 0);

      const totalChapters = Object.keys(savedResponses).length;
      const totalTopics = Object.values(savedResponses).reduce(
        (total, topics) => total + Object.keys(topics).length, 0
      );
      
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text(`📊 Summary: ${totalChapters} Chapters • ${totalTopics} Topics`, margin, yPosition);
      yPosition += 25;

      Object.entries(savedResponses).forEach(([chapter, topics], chapterIndex) => {
        if (yPosition > pageHeight - 80) {
          doc.addPage();
          yPosition = 30;
        }
        
        // Chapter header with background
        doc.setFillColor(239, 246, 255);
        doc.rect(margin - 5, yPosition - 15, maxWidth + 10, 25, "F");
        
        doc.setFontSize(18);
        doc.setFont(undefined, "bold");
        doc.setTextColor(29, 78, 216);
        doc.text(`Chapter ${chapterIndex + 1}: ${chapter}`, margin, yPosition);
        
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(0.8);
        doc.line(margin, yPosition + 3, margin + 120, yPosition + 3);
        
        yPosition += 25;
        doc.setTextColor(0, 0, 0);

        Object.entries(topics).forEach(([topic, content], topicIndex) => {
          if (yPosition > pageHeight - 50) {
            doc.addPage();
            yPosition = 30;
          }
          
          doc.setFontSize(15);
          doc.setFont(undefined, "bold");
          doc.setTextColor(16, 185, 129);
          doc.text(`${topicIndex + 1}. ${topic}`, margin, yPosition);
          yPosition += 15;
          
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(11);
          doc.setFont(undefined, "normal");

          let cleanContent = content
            .replace(/#{1,6}\s*/g, "")
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .replace(/\*(.*?)\*/g, "$1")
            .replace(/`([^`]*)`/g, "$1")
            .replace(/``````/g, "[Code Block]")
            .replace(/^\s*[-*+]\s+/gm, "• ")
            .replace(/^\s*(\d+)\.\s+/gm, "$1. ")
            .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
            .replace(/\n\s*\n/g, "\n")
            .trim();

          const paragraphs = cleanContent.split("\n").filter((p) => p.trim());
          paragraphs.forEach((paragraph) => {
            if (!paragraph.trim()) return;
            const lines = doc.splitTextToSize(paragraph.trim(), maxWidth - 15);
            lines.forEach((line) => {
              if (yPosition > pageHeight - 20) {
                doc.addPage();
                yPosition = 30;
              }
              doc.text(line, margin + 15, yPosition);
              yPosition += 6;
            });
            yPosition += 4;
          });
          yPosition += 12;
        });
        yPosition += 15;
      });

      // Enhanced footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(248, 250, 252);
        doc.rect(0, doc.internal.pageSize.height - 20, doc.internal.pageSize.width, 20, "F");
        
        doc.setFontSize(9);
        doc.setFont(undefined, "normal");
        doc.setTextColor(100, 116, 139);
        doc.text(`Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 8
        );
        doc.text("Study Notebook - AI Generated",
          25, doc.internal.pageSize.height - 8
        );
      }
      
      doc.save(filename);
      dispatch(setDownloadPDF({
        status: "success", filename, timestamp: new Date().toISOString(),
      }));
      setTimeout(() => dispatch(setDownloadPDF(null)), 3000);
    } catch (error) {
      console.error("PDF generation error:", error);
      dispatch(setDownloadPDF({
        status: "error",
        filename: null,
        timestamp: new Date().toISOString(),
        error: error.message,
      }));
      setTimeout(() => dispatch(setDownloadPDF(null)), 3000);
    }
  };

  const handleClearAllData = () => {
    setShowClearConfirm(false);
    try {
      localStorage.removeItem("study_tool_responses");
      const currentSubject = localStorage.getItem("currentSubject");
      if (currentSubject) {
        const allResponses = JSON.parse(localStorage.getItem("savedResponses") || "{}");
        delete allResponses[currentSubject];
        localStorage.setItem("savedResponses", JSON.stringify(allResponses));
      }
      dispatch(setSavedResponses({}));
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  };

  const handleDeleteChapter = (chapterToDelete) => {
    try {
      const updatedResponses = { ...savedResponses };
      delete updatedResponses[chapterToDelete];
      dispatch(setSavedResponses(updatedResponses));
      
      if (Object.keys(updatedResponses).length > 0) {
        localStorage.setItem("study_tool_responses", JSON.stringify(updatedResponses));
        const currentSubject = localStorage.getItem("currentSubject");
        if (currentSubject) {
          const allResponses = JSON.parse(localStorage.getItem("savedResponses") || "{}");
          allResponses[currentSubject] = updatedResponses;
          localStorage.setItem("savedResponses", JSON.stringify(allResponses));
        }
      } else {
        localStorage.removeItem("study_tool_responses");
        const currentSubject = localStorage.getItem("currentSubject");
        if (currentSubject) {
          const allResponses = JSON.parse(localStorage.getItem("savedResponses") || "{}");
          delete allResponses[currentSubject];
          localStorage.setItem("savedResponses", JSON.stringify(allResponses));
        }
      }
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting chapter:", error);
    }
  };

  const getDownloadButtonProps = () => {
    if (!downloadPDF) {
      return {
        text: "Export PDF",
        icon: Download,
        className: `flex items-center gap-2 transition-all duration-300 transform ${Object.keys(savedResponses).length === 0
          ? "bg-gray-400 cursor-not-allowed opacity-60"
          : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 hover:scale-105 shadow-lg hover:shadow-xl"
          } text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium`,
        disabled: Object.keys(savedResponses).length === 0,
      };
    }
    
    switch (downloadPDF.status) {
      case "loading":
        return {
          text: "Generating PDF...",
          icon: Loader2,
          className: "flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium cursor-not-allowed",
          disabled: true,
          spinning: true,
        };
      case "success":
        return {
          text: "PDF Downloaded!",
          icon: CheckCircle,
          className: "flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium cursor-not-allowed",
          disabled: true,
        };
      case "error":
        return {
          text: "Download Failed",
          icon: AlertCircle,
          className: "flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium cursor-not-allowed",
          disabled: true,
        };
      default:
        return {
          text: "Export PDF",
          icon: Download,
          className: `flex items-center gap-2 transition-all duration-300 transform ${Object.keys(savedResponses).length === 0
            ? "bg-gray-400 cursor-not-allowed opacity-60"
            : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 hover:scale-105 shadow-lg hover:shadow-xl"
            } text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium`,
          disabled: Object.keys(savedResponses).length === 0,
        };
    }
  };

  const buttonProps = getDownloadButtonProps();
  const IconComponent = buttonProps.icon;

  useEffect(() => {
    const timer = setTimeout(() => setIsFlipBookReady(true), 300);
    return () => clearTimeout(timer);
  }, [savedResponses]);

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? "bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900" 
        : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    }`}>
      {/* Hidden div for measuring content height */}
      <div
        ref={measurerRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          top: 0,
          left: 0,
          width: `${PAGE_WIDTH - PAGE_PADDING}px`,
          fontSize: "14px",
          lineHeight: 1.6,
          whiteSpace: "normal",
          padding: "20px",
          overflowWrap: "break-word",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      {/* Confirmation Modals */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-2xl p-6 max-w-md w-full shadow-2xl transform animate-in zoom-in-95 duration-300`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold">Clear All Notes</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to clear all saved study notes? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClearAllData}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-xl font-medium transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className={`flex-1 ${isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} py-2.5 px-4 rounded-xl font-medium transition-colors`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-2xl p-6 max-w-md w-full shadow-2xl transform animate-in zoom-in-95 duration-300`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold">Delete Chapter</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the "{showDeleteConfirm}" chapter? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDeleteChapter(showDeleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-xl font-medium transition-colors"
              >
                Delete Chapter
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className={`flex-1 ${isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} py-2.5 px-4 rounded-xl font-medium transition-colors`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-10 gap-4 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => router.back()}
              className={`group flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl"
                  : "bg-white hover:bg-gray-50 text-gray-700 shadow-lg hover:shadow-xl"
              }`}
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="hidden xs:inline font-medium">Back</span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <BookOpenCheck className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
              </div>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Study Notebook
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={handleDownloadPDF}
              className={buttonProps.className}
              disabled={buttonProps.disabled}
              title={Object.keys(savedResponses).length === 0 ? "No content to export" : "Download PDF"}
            >
              <IconComponent 
                size={18} 
                className={`${buttonProps.spinning ? "animate-spin" : ""}`} 
              />
              <span className="hidden sm:inline">{buttonProps.text}</span>
              <span className="sm:hidden">PDF</span>
            </button>
            
            <button
              onClick={() => setShowClearConfirm(true)}
              className={`group flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                Object.keys(savedResponses).length === 0
                  ? "bg-gray-400 cursor-not-allowed opacity-60"
                  : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg hover:shadow-xl"
              }`}
              disabled={Object.keys(savedResponses).length === 0}
              title="Clear All Notes"
            >
              <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={`${
          isDark ? "bg-gray-800/50" : "bg-white/70"
        } backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden min-h-[500px] flex justify-center items-center border border-white/20`}>
          {Object.keys(savedResponses).length === 0 ? (
            <div className="text-center py-12 sm:py-20 px-6 sm:px-12 w-full animate-in fade-in-50 duration-700">
              <div className="mb-6 sm:mb-8 relative">
                <BookOpen size={64} className="mx-auto text-gray-400 animate-pulse" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Sparkles size={14} className="text-white" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text mb-4 sm:mb-6">
                No study notes yet
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-500 mb-8 sm:mb-10 max-w-md mx-auto leading-relaxed">
                Start your learning journey by creating your first study notes
              </p>
              <button
                onClick={() => router.back()}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium text-base sm:text-lg"
              >
                <FileText size={20} className="group-hover:scale-110 transition-transform" />
                Start Creating Notes
              </button>
            </div>
          ) : (
            <div className={`w-full flex justify-center transition-all duration-700 ${isFlipBookReady ? "animate-in zoom-in-95" : "opacity-0"}`}>
              <HTMLFlipBook
                ref={flipBookRef}
                width={PAGE_WIDTH}
                height={PAGE_HEIGHT}
                minWidth={320}
                minHeight={450}
                showCover
                className="my-8 shadow-2xl rounded-2xl overflow-hidden outline-none"
                style={{ 
                  borderRadius: "1rem",
                  filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15))"
                }}
                uncutPages={false}
                useMouseEvents
                clickEventForward={false}
                swipeDistance={30}
              >
                {/* Enhanced Front Cover */}
                <div className="flex flex-col items-center justify-center h-full text-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <div className="mb-6">
                      <BookOpenCheck size={48} className="mx-auto mb-4 animate-pulse" />
                      <div className="flex items-center justify-center gap-2">
                        <Sparkles size={20} className="animate-pulse" />
                        <Sparkles size={16} className="animate-pulse delay-75" />
                        <Sparkles size={20} className="animate-pulse delay-150" />
                      </div>
                    </div>
                    <h1 className="text-3xl font-bold tracking-wide mb-4">Study Notebook</h1>
                    <p className="text-blue-100 text-lg opacity-90">
                      {Object.keys(savedResponses).length} Chapters • {" "}
                      {Object.values(savedResponses).reduce((total, topics) => total + Object.keys(topics).length, 0)} Topics
                    </p>
                  </div>
                </div>

                {/* Enhanced Chapters and Pages */}
                {Object.entries(savedResponses).map(([chapter, topics], chapterIndex) => {
                  const chapterCoverPage = (
                    <div
                      key={chapter + "-cover"}
                      className={`flex flex-col items-center justify-center h-full p-8 bg-gradient-to-br from-indigo-50 to-blue-100 ${
                        isDark ? "from-gray-700 to-gray-800 text-white" : "text-gray-800"
                      } relative overflow-hidden`}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200/30 rounded-full translate-y-12 -translate-x-12"></div>
                      
                      <div className="text-center z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-6 text-2xl font-bold">
                          {chapterIndex + 1}
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-blue-800">Chapter {chapterIndex + 1}</h2>
                        <h3 className="text-xl font-semibold mb-6 text-gray-700 px-4">{chapter}</h3>
                        
                        <div className="bg-white/50 rounded-xl p-4 mb-6 backdrop-blur-sm">
                          <p className="text-gray-600 font-medium">
                            📚 {Object.keys(topics).length} Topics
                          </p>
                        </div>
                        
                        <button
                          onClick={() => setShowDeleteConfirm(chapter)}
                          className="group flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
                        >
                          <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                          Delete Chapter
                        </button>
                      </div>
                    </div>
                  );

                  const topicPages = Object.entries(topics).flatMap(([topic, content], topicIndex) => {
                    const pages = paginatedResponses[chapter]?.[topic] || [content];
                    return pages.map((pageContent, pageIndex) => (
                      <div
                        key={`${chapter}--${topic}--page-${pageIndex}`}
                        className={`flex flex-col h-full justify-between p-6 ${
                          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                        } relative overflow-hidden`}
                      >
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-transparent rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
                        
                        {/* Header */}
                        <div className="flex justify-between items-start gap-3 mb-4 relative z-10">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {topicIndex + 1}
                              </div>
                              <h3 className="text-lg font-bold text-blue-600 line-clamp-2">{topic}</h3>
                            </div>
                            {pages.length > 1 && (
                              <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">
                                Page {pageIndex + 1} of {pages.length}
                              </p>
                            )}
                          </div>
                          
                          <button
                            onClick={() => {
                              setEditChapter(chapter);
                              setEditTopic(topic);
                              setEditValue(content);
                            }}
                            className={`group flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 ${
                              isDark 
                                ? "bg-yellow-500 hover:bg-yellow-600 text-yellow-900" 
                                : "bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
                            } shadow-sm hover:shadow-md`}
                            title="Edit Note"
                          >
                            <Edit3 size={12} className="group-hover:rotate-12 transition-transform" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                        </div>

                        {/* Content Area */}
                        {editChapter === chapter && editTopic === topic ? (
                          <div className="flex flex-col flex-1 relative z-10">
                            <div className="flex-1 mb-4">
                              <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className={`w-full h-full p-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-300 ${
                                  isDark 
                                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400" 
                                    : "bg-gray-50 border-gray-200 text-gray-800 focus:border-blue-400"
                                } font-mono text-sm leading-relaxed`}
                                placeholder="Enter your notes here..."
                                style={{ minHeight: '280px' }}
                              />
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const updated = {
                                    ...savedResponses,
                                    [chapter]: {
                                      ...savedResponses[chapter],
                                      [topic]: editValue,
                                    },
                                  };
                                  dispatch(setSavedResponses(updated));
                                  setEditChapter(null);
                                  setEditTopic(null);
                                  setEditValue("");
                                }}
                                className="group flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium text-sm"
                              >
                                <Save size={14} className="group-hover:scale-110 transition-transform" />
                                Save
                              </button>
                              
                              <button
                                onClick={() => {
                                  setEditChapter(null);
                                  setEditTopic(null);
                                  setEditValue("");
                                }}
                                className={`group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium text-sm ${
                                  isDark 
                                    ? "bg-gray-600 hover:bg-gray-500 text-white" 
                                    : "bg-gray-300 hover:bg-gray-400 text-gray-700"
                                }`}
                              >
                                <X size={14} className="group-hover:rotate-90 transition-transform" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className={`flex-1 relative z-10 overflow-y-auto custom-scrollbar ${
                            isDark ? "prose-invert" : ""
                          }`}>
                            <div className={`prose prose-sm max-w-none ${
                              isDark 
                                ? "prose-headings:text-blue-300 prose-strong:text-white prose-code:text-green-300 prose-code:bg-gray-700" 
                                : "prose-headings:text-blue-700 prose-strong:text-gray-800 prose-code:text-green-700 prose-code:bg-green-50"
                            } prose-p:leading-relaxed prose-li:leading-relaxed`}>
                              <ReactMarkdown
                                components={{
                                  h1: ({children}) => <h1 className="text-xl font-bold mb-3 text-blue-600">{children}</h1>,
                                  h2: ({children}) => <h2 className="text-lg font-semibold mb-2 text-blue-600">{children}</h2>,
                                  h3: ({children}) => <h3 className="text-base font-semibold mb-2 text-blue-600">{children}</h3>,
                                  p: ({children}) => <p className="mb-3 text-sm leading-relaxed">{children}</p>,
                                  ul: ({children}) => <ul className="list-disc pl-4 mb-3 space-y-1">{children}</ul>,
                                  ol: ({children}) => <ol className="list-decimal pl-4 mb-3 space-y-1">{children}</ol>,
                                  li: ({children}) => <li className="text-sm">{children}</li>,
                                  code: ({children}) => <code className="text-xs px-1.5 py-0.5 rounded bg-opacity-50">{children}</code>,
                                  pre: ({children}) => <pre className="text-xs p-3 rounded-lg overflow-x-auto mb-3">{children}</pre>,
                                }}
                              >
                                {pageContent}
                              </ReactMarkdown>
                            </div>
                          </div>
                        )}

                        {/* Page decoration */}
                        <div className="absolute bottom-2 right-4 text-xs text-gray-400 font-medium">
                          📄
                        </div>
                      </div>
                    ));
                  });

                  return [chapterCoverPage, ...topicPages];
                })}

                {/* Enhanced Back Cover */}
                <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 -translate-x-20"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 translate-x-16"></div>
                  
                  <div className="text-center z-10">
                    <div className="mb-6">
                      <CheckCircle size={48} className="mx-auto mb-4 text-green-300" />
                      <div className="flex items-center justify-center gap-2">
                        <Sparkles size={16} className="text-yellow-300 animate-pulse" />
                        <Sparkles size={20} className="text-yellow-300 animate-pulse delay-75" />
                        <Sparkles size={16} className="text-yellow-300 animate-pulse delay-150" />
                      </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-4">Well Done! 🎉</h2>
                    <p className="text-purple-100 text-lg mb-2">
                      You've completed your study notebook
                    </p>
                    <p className="text-purple-200 text-sm opacity-75">
                      Keep learning and growing! 📚✨
                    </p>
                  </div>
                </div>
              </HTMLFlipBook>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPageFlip;