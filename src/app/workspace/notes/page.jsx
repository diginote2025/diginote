"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { ArrowLeft, Download, BookOpen, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { setDownloadPDF, setSavedResponses } from "@/redux/studyToolSlice";

const NotesPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [pdfMethod] = useState("jspdf"); // Always use jspdf method
  const textareaRef = React.useRef(null);

  const savedResponses = useSelector((state) => state.studyTool.savedResponses);
  const { isDark } = useSelector((state) => state.theme);
  const downloadPDF = useSelector((state) => state.studyTool.downloadPDF);

  const [editChapter, setEditChapter] = useState(null); // Chapter name
  const [editTopic, setEditTopic] = useState(null); // Topic name
  const [editValue, setEditValue] = useState("");

  // Load saved responses from localStorage on component mount
  useEffect(() => {
    const loadSavedResponses = () => {
      try {
        const currentSubject = localStorage.getItem("currentSubject");
        const allResponses = JSON.parse(
          localStorage.getItem("savedResponses") || "{}"
        );
        let savedData;
        if (currentSubject && allResponses[currentSubject]) {
          savedData = allResponses[currentSubject];
        } else {
          savedData = localStorage.getItem("study_tool_responses");
          if (savedData) {
            savedData = JSON.parse(savedData);
          }
        }
        if (savedData && Object.keys(savedData).length > 0) {
          dispatch(setSavedResponses(savedData));
        }
      } catch (error) {
        console.error(
          "Error loading saved responses from localStorage:",
          error
        );
      }
    };
    loadSavedResponses();
  }, [dispatch]);

  // Save responses to localStorage whenever savedResponses changes
  useEffect(() => {
    if (Object.keys(savedResponses).length > 0) {
      try {
        localStorage.setItem(
          "study_tool_responses",
          JSON.stringify(savedResponses)
        );
        const currentSubject = localStorage.getItem("currentSubject");
        if (currentSubject) {
          const allResponses = JSON.parse(
            localStorage.getItem("savedResponses") || "{}"
          );
          allResponses[currentSubject] = savedResponses;
          localStorage.setItem("savedResponses", JSON.stringify(allResponses));
        }
      } catch (error) {
        console.error("Error saving responses to localStorage:", error);
      }
    }
  }, [savedResponses]);

  // Enhanced HTML2PDF method
  const handleDownloadPDFHtml2pdf = async () => {
    const element = document.getElementById("notebook-content");
    if (!element) {
      alert("Cannot generate PDF: Notebook content is not available.");
      return;
    }

    if (Object.keys(savedResponses).length === 0) {
      alert("No content available to export to PDF.");
      return;
    }

    dispatch(
      setDownloadPDF({
        status: "loading",
        filename: null,
        timestamp: new Date().toISOString(),
      })
    );

    // Longer delay to ensure all React components and Markdown are fully rendered
    setTimeout(async () => {
      try {
        const html2pdf = (await import("html2pdf.js")).default;
        const filename = `Study_Notes_${
          new Date().toISOString().split("T")[0]
        }.pdf`;

        // Enhanced options for better text capture
        const opt = {
          margin: [0.5, 0.5, 0.5, 0.5], // top, left, bottom, right
          filename,
          image: {
            type: "jpeg",
            quality: 0.98,
          },
          html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
            letterRendering: true, // Better text rendering
            logging: false,
            scrollX: 0,
            scrollY: 0,
            width: element.scrollWidth,
            height: element.scrollHeight,
          },
          jsPDF: {
            unit: "in",
            format: "letter",
            orientation: "portrait",
            compress: false, // Don't compress to preserve text quality
          },
          pagebreak: {
            mode: ["avoid-all", "css", "legacy"],
            before: ".chapter-section",
            after: ".chapter-section",
            avoid: ".topic-section",
          },
        };

        // Force reflow and ensure all content is visible
        const originalStyles = {
          height: element.style.height,
          overflow: element.style.overflow,
          maxHeight: element.style.maxHeight,
        };

        element.style.height = "auto";
        element.style.overflow = "visible";
        element.style.maxHeight = "none";

        // Wait a bit more for any lazy-loaded content
        await new Promise((resolve) => setTimeout(resolve, 100));

        await html2pdf().set(opt).from(element).save();

        // Restore original styles
        element.style.height = originalStyles.height;
        element.style.overflow = originalStyles.overflow;
        element.style.maxHeight = originalStyles.maxHeight;

        dispatch(
          setDownloadPDF({
            status: "success",
            filename,
            timestamp: new Date().toISOString(),
          })
        );

        setTimeout(() => dispatch(setDownloadPDF(null)), 3000);
      } catch (error) {
        console.error("PDF generation error:", error);
        dispatch(
          setDownloadPDF({
            status: "error",
            filename: null,
            timestamp: new Date().toISOString(),
            error: error.message,
          })
        );
        alert(`Failed to generate PDF: ${error.message}`);
        setTimeout(() => dispatch(setDownloadPDF(null)), 3000);
      }
    }, 800); // Increased delay to 800ms
  };

  // Alternative jsPDF method for better text handling
  const handleDownloadPDFJsPDF = async () => {
    if (Object.keys(savedResponses).length === 0) {
      alert("No content available to export to PDF.");
      return;
    }

    dispatch(
      setDownloadPDF({
        status: "loading",
        filename: null,
        timestamp: new Date().toISOString(),
      })
    );

    try {
      // Dynamic import of jsPDF
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      const filename = `Study_Notes_${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      let yPosition = 20;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const maxWidth = doc.internal.pageSize.width - margin * 2;

      // Add title
      doc.setFontSize(20);
      doc.setFont(undefined, "bold");
      doc.text("📓 Study Notebook", margin, yPosition);
      yPosition += 20;

      // Add date
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        margin,
        yPosition
      );
      yPosition += 15;

      // Add summary
      const totalChapters = Object.keys(savedResponses).length;
      const totalTopics = Object.values(savedResponses).reduce(
        (total, topics) => total + Object.keys(topics).length,
        0
      );
      doc.text(
        `Total Chapters: ${totalChapters} | Total Topics: ${totalTopics}`,
        margin,
        yPosition
      );
      yPosition += 20;

      // Process each chapter
      Object.entries(savedResponses).forEach(
        ([chapter, topics], chapterIndex) => {
          // Check if we need a new page for chapter header
          if (yPosition > pageHeight - 60) {
            doc.addPage();
            yPosition = 20;
          }

          // Chapter header with decorative line
          doc.setFontSize(16);
          doc.setFont(undefined, "bold");
          doc.setTextColor(0, 100, 200); // Blue color for chapter
          doc.text(
            `CHAPTER ${chapterIndex + 1}: ${chapter.toUpperCase()}`,
            margin,
            yPosition
          );

          // Add underline
          doc.setDrawColor(0, 100, 200);
          doc.line(margin, yPosition + 2, margin + 100, yPosition + 2);

          yPosition += 20;
          doc.setTextColor(0, 0, 0); // Reset to black

          // Process each topic
          Object.entries(topics).forEach(([topic, content], topicIndex) => {
            // Check if we need a new page
            if (yPosition > pageHeight - 40) {
              doc.addPage();
              yPosition = 20;
            }

            // Topic header
            doc.setFontSize(14);
            doc.setFont(undefined, "bold");
            doc.setTextColor(0, 150, 100); // Green color for topics
            doc.text(`${topicIndex + 1}. ${topic}`, margin, yPosition);
            yPosition += 12;

            doc.setTextColor(0, 0, 0); // Reset to black

            // Content processing with better markdown cleanup
            doc.setFontSize(10);
            doc.setFont(undefined, "normal");

            // Enhanced markdown cleanup
            let cleanContent = content
              .replace(/#{1,6}\s*/g, "") // Remove markdown headers
              .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markers but keep text
              .replace(/\*(.*?)\*/g, "$1") // Remove italic markers
              .replace(/`([^`]*)`/g, "$1") // Remove code markers
              .replace(/```[\s\S]*?```/g, "[Code Block]") // Replace code blocks
              .replace(/^\s*[-*+]\s+/gm, "• ") // Convert markdown bullets
              .replace(/^\s*(\d+)\.\s+/gm, "$1. ") // Keep numbered lists
              .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // Remove links but keep text
              .replace(/\n\s*\n/g, "\n") // Remove extra blank lines
              .trim();

            // Split content into paragraphs
            const paragraphs = cleanContent.split("\n").filter((p) => p.trim());

            paragraphs.forEach((paragraph) => {
              if (!paragraph.trim()) return;

              // Split paragraph into lines that fit the page width
              const lines = doc.splitTextToSize(
                paragraph.trim(),
                maxWidth - 10
              );

              lines.forEach((line) => {
                if (yPosition > pageHeight - 15) {
                  doc.addPage();
                  yPosition = 20;
                }
                doc.text(line, margin + 10, yPosition);
                yPosition += 5;
              });

              yPosition += 3; // Small space between paragraphs
            });

            yPosition += 8; // Space between topics
          });

          yPosition += 10; // Space between chapters
        }
      );

      // Add footer with page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont(undefined, "normal");
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 40,
          doc.internal.pageSize.height - 10
        );
        doc.text(
          "Study Notebook - Generated by AI",
          20,
          doc.internal.pageSize.height - 10
        );
      }

      doc.save(filename);

      dispatch(
        setDownloadPDF({
          status: "success",
          filename,
          timestamp: new Date().toISOString(),
        })
      );

      setTimeout(() => dispatch(setDownloadPDF(null)), 3000);
    } catch (error) {
      console.error("PDF generation error:", error);
      dispatch(
        setDownloadPDF({
          status: "error",
          filename: null,
          timestamp: new Date().toISOString(),
          error: error.message,
        })
      );
      alert(`Failed to generate PDF: ${error.message}`);
      setTimeout(() => dispatch(setDownloadPDF(null)), 3000);
    }
  };

  // Main PDF handler - always use jsPDF method
  const handleDownloadPDF = () => {
    handleDownloadPDFJsPDF();
  };

  // Clear all data handler
  const handleClearAllData = () => {
    if (
      confirm(
        "Are you sure you want to clear all saved study notes? This action cannot be undone."
      )
    ) {
      try {
        localStorage.removeItem("study_tool_responses");
        const currentSubject = localStorage.getItem("currentSubject");
        if (currentSubject) {
          const allResponses = JSON.parse(
            localStorage.getItem("savedResponses") || "{}"
          );
          delete allResponses[currentSubject];
          localStorage.setItem("savedResponses", JSON.stringify(allResponses));
        }
        dispatch(setSavedResponses({}));
        alert("All study notes have been cleared.");
      } catch (error) {
        alert("Error clearing data. Please try again.");
      }
    }
  };

  // Delete specific chapter handler
  const handleDeleteChapter = (chapterToDelete) => {
    if (
      confirm(
        `Are you sure you want to delete the "${chapterToDelete}" chapter? This action cannot be undone.`
      )
    ) {
      try {
        const updatedResponses = { ...savedResponses };
        delete updatedResponses[chapterToDelete];
        dispatch(setSavedResponses(updatedResponses));
        if (Object.keys(updatedResponses).length > 0) {
          localStorage.setItem(
            "study_tool_responses",
            JSON.stringify(updatedResponses)
          );
          const currentSubject = localStorage.getItem("currentSubject");
          if (currentSubject) {
            const allResponses = JSON.parse(
              localStorage.getItem("savedResponses") || "{}"
            );
            allResponses[currentSubject] = updatedResponses;
            localStorage.setItem(
              "savedResponses",
              JSON.stringify(allResponses)
            );
          }
        } else {
          localStorage.removeItem("study_tool_responses");
          const currentSubject = localStorage.getItem("currentSubject");
          if (currentSubject) {
            const allResponses = JSON.parse(
              localStorage.getItem("savedResponses") || "{}"
            );
            delete allResponses[currentSubject];
            localStorage.setItem(
              "savedResponses",
              JSON.stringify(allResponses)
            );
          }
        }
        alert(`Chapter "${chapterToDelete}" has been deleted.`);
      } catch (error) {
        alert("Error deleting chapter. Please try again.");
      }
    }
  };

  // Download Button Enable/Disable Logic
  const getDownloadButtonProps = () => {
    if (!downloadPDF) {
      return {
        text: "Export PDF",
        className: `flex items-center gap-2 ${
          Object.keys(savedResponses).length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        } text-white px-6 py-3 rounded-lg shadow-md transition-colors`,
        disabled: Object.keys(savedResponses).length === 0,
      };
    }
    switch (downloadPDF.status) {
      case "loading":
        return {
          text: "Generating PDF...",
          className:
            "flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md cursor-not-allowed",
          disabled: true,
        };
      case "success":
        return {
          text: "PDF Downloaded!",
          className:
            "flex items-center gap-2 bg-green-800 text-white px-6 py-3 rounded-lg shadow-md cursor-not-allowed",
          disabled: true,
        };
      case "error":
        return {
          text: "Download Failed",
          className:
            "flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-md cursor-not-allowed",
          disabled: true,
        };
      default:
        return {
          text: "Download PDF",
          className: `flex items-center gap-2 ${
            Object.keys(savedResponses).length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          } text-white px-6 py-3 rounded-lg shadow-md transition-colors`,
          disabled: Object.keys(savedResponses).length === 0,
        };
    }
  };

  const buttonProps = getDownloadButtonProps();

  return (
    <div
      className={`custom-scrollbar h-[100vh] ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6">
        {/* --------- Header Section --------- */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-8 gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => router.back()}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-sm sm:text-base ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-white hover:bg-gray-100 text-gray-700"
              } shadow-md`}
            >
              <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Back</span>
            </button>
            <div className="flex items-center gap-1 sm:gap-2">
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold">
                📓 Study Notebook
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              className={`${buttonProps.className} text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2`}
              disabled={buttonProps.disabled}
              title={
                Object.keys(savedResponses).length === 0
                  ? "No content to export"
                  : "Download PDF"
              }
            >
              {downloadPDF?.status === "loading" ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  <span className="hidden sm:inline">{buttonProps.text}</span>
                  <span className="sm:hidden">PDF</span>
                </>
              ) : (
                <>
                  <Download size={16} className="sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{buttonProps.text}</span>
                  <span className="sm:hidden">PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* -------- Main Notes Content -------- */}
        <div
          id="notebook-content"
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-lg sm:rounded-xl shadow-lg overflow-hidden`}
          style={{
            WebkitPrintColorAdjust: "exact",
            colorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        >
          {Object.keys(savedResponses).length === 0 ? (
            <div className="text-center py-8 sm:py-16 px-4 sm:px-8">
              <div className="mb-4 sm:mb-6">
                <BookOpen
                  size={48}
                  className="sm:w-18 sm:h-18 mx-auto text-gray-400"
                />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-500 mb-2 sm:mb-4">
                📝 No study notes available yet
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-400 mb-4 sm:mb-6">
                Go back and select topics from the sidebar to generate notes.
              </p>
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
              >
                <FileText size={16} className="sm:w-5 sm:h-5" />
                Start Creating Notes
              </button>
            </div>
          ) : (
            <div className="p-3 sm:p-6">
              <div className="space-y-6 sm:space-y-10">
                {Object.entries(savedResponses).map(
                  ([chapter, topics], chapterIndex) => (
                    <div key={chapter} className="chapter-section">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold uppercase text-blue-600 tracking-wide break-words">
                            Chapter {chapterIndex + 1}: {chapter}
                          </h2>
                        </div>
                        <button
                          onClick={() => handleDeleteChapter(chapter)}
                          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors self-start sm:self-auto ${
                            isDark
                              ? "bg-red-800 hover:bg-red-700 text-white"
                              : "bg-red-600 hover:bg-red-700 text-white"
                          } shadow-md text-xs sm:text-sm`}
                          title={`Delete ${chapter} chapter`}
                        >
                          🗑️
                          <span className="xs:hidden">Delete Chapter</span>
                        </button>
                      </div>
                      <div className="grid gap-3 sm:gap-6">
                        {Object.entries(topics).map(
                          ([topic, content], topicIndex) => (
                            <div
                              key={topic}
                              className={`topic-section ${
                                isDark ? "bg-gray-700" : "bg-gray-50"
                              } rounded-lg p-3 sm:p-6 border-l-4 border-blue-500 shadow-sm`}
                            >
                              {/* --- TOPIC HEADER + EDIT BUTTON --- */}
                              <div className="flex justify-between xs:items-center xs:justify-between gap-2 xs:gap-3 mb-3 sm:mb-4">
                                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-blue-600 flex items-center gap-2 break-words pr-2">
                                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                                  <span className="min-w-0">
                                    {topicIndex + 1}. {topic}
                                  </span>
                                </h3>
                                <button
                                  onClick={() => {
                                    setEditChapter(chapter);
                                    setEditTopic(topic);
                                    setEditValue(content);
                                  }}
                                  className="bg-yellow-300 text-yellow-900 hover:bg-yellow-400 px-2 sm:px-3 py-1 rounded transition-all text-xs sm:text-sm font-medium self-start xs:self-auto flex-shrink-0"
                                  title="Edit Note"
                                >
                                  ✏️ Edit
                                </button>
                              </div>

                              {/* --------- EDIT FORM ----------- */}
                              {editChapter === chapter &&
                              editTopic === topic ? (
                                <div className="flex flex-col justify-start items-end">
                                  <div className="flex gap-1 sm:gap-2 mb-2 flex-wrap">
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
                                      className="bg-green-600 text-white rounded px-2 sm:px-3 py-1 hover:bg-green-700 transition-all text-xs sm:text-sm"
                                    >
                                      💾 Save
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditChapter(null);
                                        setEditTopic(null);
                                        setEditValue("");
                                      }}
                                      className="bg-gray-400 text-gray-900 rounded px-2 sm:px-3 py-1 hover:bg-gray-500 transition-all text-xs sm:text-sm"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                  <textarea
                                    value={editValue}
                                    ref={(el) => {
                                      if (el) {
                                        el.style.height = "auto";
                                        el.style.height =
                                          el.scrollHeight + "px";
                                      }
                                    }}
                                    onChange={(e) => {
                                      setEditValue(e.target.value);
                                      const ta = e.target;
                                      ta.style.height = "auto";
                                      ta.style.height = ta.scrollHeight + "px";
                                    }}
                                    className="w-full p-2 sm:p-3 rounded min-h-[40px] max-h-[350px] sm:max-h-[550px] border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 resize-none custom-scrollbar text-sm sm:text-base"
                                  />
                                </div>
                              ) : (
                                <div
                                  className={`prose prose-sm sm:prose max-w-none ${
                                    isDark ? "prose-invert" : ""
                                  } prose-blue`}
                                >
                                  <ReactMarkdown
                                    components={{
                                      h1: ({ children }) => (
                                        <h1 className="text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3 text-blue-700 break-words">
                                          {children}
                                        </h1>
                                      ),
                                      h2: ({ children }) => (
                                        <h2 className="text-sm sm:text-base lg:text-lg font-semibold mb-1.5 sm:mb-2 text-blue-600 break-words">
                                          {children}
                                        </h2>
                                      ),
                                      h3: ({ children }) => (
                                        <h3 className="text-sm sm:text-base font-medium mb-1.5 sm:mb-2 text-blue-500 break-words">
                                          {children}
                                        </h3>
                                      ),
                                      p: ({ children }) => (
                                        <p className="mb-2 sm:mb-3 leading-relaxed text-sm sm:text-base break-words">
                                          {children}
                                        </p>
                                      ),
                                      ul: ({ children }) => (
                                        <ul className="list-disc list-inside mb-2 sm:mb-3 space-y-0.5 sm:space-y-1 text-sm sm:text-base">
                                          {children}
                                        </ul>
                                      ),
                                      ol: ({ children }) => (
                                        <ol className="list-decimal list-inside mb-2 sm:mb-3 space-y-0.5 sm:space-y-1 text-sm sm:text-base">
                                          {children}
                                        </ol>
                                      ),
                                      li: ({ children }) => (
                                        <li className="ml-1 sm:ml-2 break-words">
                                          {children}
                                        </li>
                                      ),
                                      code: ({ children }) => (
                                        <code className="bg-gray-200 px-1 py-0.5 rounded text-xs sm:text-sm font-mono break-all">
                                          {children}
                                        </code>
                                      ),
                                      pre: ({ children }) => (
                                        <pre className="bg-gray-100 p-2 sm:p-3 rounded overflow-x-auto text-xs sm:text-sm">
                                          {children}
                                        </pre>
                                      ),
                                    }}
                                  >
                                    {content}
                                  </ReactMarkdown>
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;