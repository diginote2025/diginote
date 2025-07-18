"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Download, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { setDownloadPDF, setSavedResponses, updateSavedResponses } from '@/redux/studyToolSlice';

const NotesPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const savedResponses = useSelector((state) => state.studyTool.savedResponses);
  const { isDark } = useSelector((state) => state.theme);
  const downloadPDF = useSelector((state) => state.studyTool.downloadPDF);

  // Load saved responses from localStorage on component mount
useEffect(() => {
  const loadSavedResponses = () => {
    try {
      // Try to get the current subject's data first
      const currentSubject = localStorage.getItem('currentSubject'); // You might need to set this in AiStudyTool
      const allResponses = JSON.parse(localStorage.getItem('savedResponses') || '{}');
      
      let savedData;
      if (currentSubject && allResponses[currentSubject]) {
        savedData = allResponses[currentSubject];
      } else {
        // Fallback to the old key for backward compatibility
        savedData = localStorage.getItem('study_tool_responses');
        if (savedData) {
          savedData = JSON.parse(savedData);
        }
      }
      
      if (savedData && Object.keys(savedData).length > 0) {
        dispatch(setSavedResponses(savedData));
        console.log('Loaded saved responses from localStorage:', savedData);
      }
    } catch (error) {
      console.error('Error loading saved responses from localStorage:', error);
    }
  };

  loadSavedResponses();
}, [dispatch]);
  // Save responses to localStorage whenever savedResponses changes
useEffect(() => {
  if (Object.keys(savedResponses).length > 0) {
    try {
      // Update both keys to maintain compatibility
      localStorage.setItem('study_tool_responses', JSON.stringify(savedResponses));
      
      // Also update the main savedResponses structure
      const currentSubject = localStorage.getItem('currentSubject');
      if (currentSubject) {
        const allResponses = JSON.parse(localStorage.getItem('savedResponses') || '{}');
        allResponses[currentSubject] = savedResponses;
        localStorage.setItem('savedResponses', JSON.stringify(allResponses));
      }
      
      console.log('Saved responses to localStorage:', savedResponses);
    } catch (error) {
      console.error('Error saving responses to localStorage:', error);
    }
  }
}, [savedResponses]);

  // Download PDF function with Redux integration
  const handleDownloadPDF = async () => {
    const element = document.getElementById("notebook-content");
    if (!element) {
      console.error("Notebook content element not found!");
      alert("Cannot generate PDF: Notebook content is not available.");
      return;
    }

    try {
      // Set loading state
      dispatch(setDownloadPDF({
        status: 'loading',
        filename: null,
        timestamp: new Date().toISOString()
      }));

      const html2pdf = (await import("html2pdf.js")).default;
      const filename = `Study_Notes_${new Date().toISOString().split('T')[0]}.pdf`;
      
      const opt = {
        margin: 0.5,
        filename: filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
      
      // Set success state
      dispatch(setDownloadPDF({
        status: 'success',
        filename: filename,
        timestamp: new Date().toISOString()
      }));

      console.log("PDF generation successful");
      
      // Reset state after 3 seconds
      setTimeout(() => {
        dispatch(setDownloadPDF(null));
      }, 3000);

    } catch (error) {
      console.error("Error generating PDF:", error);
      
      // Set error state
      dispatch(setDownloadPDF({
        status: 'error',
        filename: null,
        timestamp: new Date().toISOString(),
        error: error.message
      }));

      alert("Failed to generate PDF. Please try again.");
      
      // Reset state after 3 seconds
      setTimeout(() => {
        dispatch(setDownloadPDF(null));
      }, 3000);
    }
  };

  // Clear all saved data function
const handleClearAllData = () => {
  if (confirm('Are you sure you want to clear all saved study notes? This action cannot be undone.')) {
    try {
      localStorage.removeItem('study_tool_responses');
      
      const currentSubject = localStorage.getItem('currentSubject');
      if (currentSubject) {
        const allResponses = JSON.parse(localStorage.getItem('savedResponses') || '{}');
        delete allResponses[currentSubject];
        localStorage.setItem('savedResponses', JSON.stringify(allResponses));
      }
      
      dispatch(setSavedResponses({}));
      console.log('Cleared all saved responses');
      alert('All study notes have been cleared.');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      alert('Error clearing data. Please try again.');
    }
  }
};

  // Delete specific chapter function
 const handleDeleteChapter = (chapterToDelete) => {
  if (confirm(`Are you sure you want to delete the "${chapterToDelete}" chapter? This action cannot be undone.`)) {
    try {
      const updatedResponses = { ...savedResponses };
      delete updatedResponses[chapterToDelete];
      
      dispatch(setSavedResponses(updatedResponses));
      
      // Update both localStorage keys
      if (Object.keys(updatedResponses).length > 0) {
        localStorage.setItem('study_tool_responses', JSON.stringify(updatedResponses));
        
        const currentSubject = localStorage.getItem('currentSubject');
        if (currentSubject) {
          const allResponses = JSON.parse(localStorage.getItem('savedResponses') || '{}');
          allResponses[currentSubject] = updatedResponses;
          localStorage.setItem('savedResponses', JSON.stringify(allResponses));
        }
      } else {
        localStorage.removeItem('study_tool_responses');
        
        const currentSubject = localStorage.getItem('currentSubject');
        if (currentSubject) {
          const allResponses = JSON.parse(localStorage.getItem('savedResponses') || '{}');
          delete allResponses[currentSubject];
          localStorage.setItem('savedResponses', JSON.stringify(allResponses));
        }
      }
      
      console.log(`Deleted chapter: ${chapterToDelete}`);
      alert(`Chapter "${chapterToDelete}" has been deleted.`);
    } catch (error) {
      console.error('Error deleting chapter:', error);
      alert('Error deleting chapter. Please try again.');
    }
  }
};

  // Get button text and styling based on download state
  const getDownloadButtonProps = () => {
    if (!downloadPDF) {
      return {
        text: 'Download PDF',
        className: 'flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors',
        disabled: false
      };
    }

    switch (downloadPDF.status) {
      case 'loading':
        return {
          text: 'Generating PDF...',
          className: 'flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md cursor-not-allowed',
          disabled: true
        };
      case 'success':
        return {
          text: 'PDF Downloaded!',
          className: 'flex items-center gap-2 bg-green-800 text-white px-6 py-3 rounded-lg shadow-md cursor-not-allowed',
          disabled: true
        };
      case 'error':
        return {
          text: 'Download Failed',
          className: 'flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-md cursor-not-allowed',
          disabled: true
        };
      default:
        return {
          text: 'Download PDF',
          className: 'flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors',
          disabled: false
        };
    }
  };

  const buttonProps = getDownloadButtonProps();

  return (
    <div className={` ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'bg-white hover:bg-gray-100 text-gray-700'
              } shadow-md`}
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <div className="flex items-center gap-2">
              <BookOpen size={28} className="text-blue-600" />
              <h1 className="text-3xl font-bold">📓 Study Notebook</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Clear Data Button */}
            {Object.keys(savedResponses).length > 0 && (
              <button
                onClick={handleClearAllData}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'bg-red-800 hover:bg-red-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                } shadow-md`}
              >
                🗑️ Clear All
              </button>
            )}
            
            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              className={buttonProps.className}
              disabled={buttonProps.disabled}
            >
              <Download size={20} />
              {buttonProps.text}
            </button>
          </div>
        </div>

        {/* Download Status Display */}
        {downloadPDF && (
          <div className={`mb-4 p-3 rounded-lg ${
            downloadPDF.status === 'success' ? 'bg-green-100 border border-green-300 text-green-800' :
            downloadPDF.status === 'error' ? 'bg-red-100 border border-red-300 text-red-800' :
            'bg-blue-100 border border-blue-300 text-blue-800'
          }`}>
            {downloadPDF.status === 'loading' && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Generating PDF...</span>
              </div>
            )}
            {downloadPDF.status === 'success' && (
              <span>✅ PDF "{downloadPDF.filename}" downloaded successfully!</span>
            )}
            {downloadPDF.status === 'error' && (
              <span>❌ Error: {downloadPDF.error || 'Failed to generate PDF'}</span>
            )}
          </div>
        )}

        {/* Data Status Info */}
        {Object.keys(savedResponses).length > 0 && (
          <div className={`mb-4 p-3 rounded-lg  ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className={isDark ? 'text-gray-300' : 'text-blue-700'}>
                💾 Data saved locally - {Object.keys(savedResponses).length} chapter(s) with {
                  Object.values(savedResponses).reduce((total, topics) => total + Object.keys(topics).length, 0)
                } topic(s)
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div 
          id="notebook-content" 
          className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}
        >
          {Object.keys(savedResponses).length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <BookOpen size={64} className="mx-auto text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-500 mb-2">
                📝 No study notes available yet
              </h2>
              <p className="text-gray-400 text-lg">
                Go back and select topics from the sidebar to generate notes.
              </p>
            </div>
          ) : (
            <div className="space-y-8 custom-scrollbar h-[40vh]">
              {Object.entries(savedResponses).map(([chapter, topics]) => (
                <div key={chapter} className="chapter-section ">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-8 bg-blue-600 rounded"></div>
                      <h2 className="text-2xl font-bold uppercase text-blue-600 tracking-wide">
                        {chapter}
                      </h2>
                    </div>
                    
                    {/* Delete Chapter Button */}
                    <button
                      onClick={() => handleDeleteChapter(chapter)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        isDark 
                          ? 'bg-red-800 hover:bg-red-700 text-white' 
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      } shadow-md text-sm`}
                      title={`Delete ${chapter} chapter`}
                    >
                      🗑️ Delete Chapter
                    </button>
                  </div>
                  
                  <div className="grid gap-6 ">
                    {Object.entries(topics).map(([topic, content]) => (
                      <div 
                        key={topic} 
                        className={`topic-section ${
                          isDark ? 'bg-gray-700' : 'bg-gray-50'
                        } rounded-lg p-6 border-l-4 border-blue-500 shadow-sm`}
                      >
                        <h3 className="text-xl font-semibold text-blue-600 mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          {topic}
                        </h3>
                        <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
                          <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;