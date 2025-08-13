"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoClose, IoAdd } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSubject } from "@/redux/subjectSlice";
import SubjectDetailViewer from "./SubjectDetailViewer";
import { MdOutlineDeleteForever, MdSchool, MdBook } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

export const metadata = {
  title: "DigiNote – AI Notes Maker | MCQs, Chapter Videos & Tests",
  description:
    "DigiNote is an AI-powered notes maker for students, offering MCQ tests, chapter-related YouTube videos, and customizable unit tests.",
  keywords: [
    "DigiNote",
    "AI notes maker",
    "student notes",
    "MCQ tests",
    "YouTube chapter videos",
    "unit tests",
    "AI study tool",
    "digital learning",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL("https://diginote.in"),
  openGraph: {
    title: "DigiNote - AI Notebook Maker | MCQs, chapter videos & tests",
    description:
      "DigiNote is an AI-powered notebook generator for students, offering MCQ tests, chapter-related YouTube videos, and customizable unit tests.",
    url: "/workspace",
    siteName: "DigiNote",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DigiNote Logo",
      },
    ],
    type: "website",
  },
  verification: {
    google: "lt26BMlkm0vfvrArTEIKCm1DT2gWldd_SMH3-cn6D0E",
    other: {
      "custom-verification-name": "custom-verification-code",
    },
  },
};

export default function AddSubjectName() {
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const [openSubjectForm, setOpenSubjectForm] = useState(false);
  const [addtodo, setAddtodo] = useState([]);
  const [addtask, setAddtask] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const selectedSubject = useSelector((state) => state.subject.selectedSubject);
      const { isDark, isThemeLoaded } = useSelector((state) => state.theme);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const savedTodos = JSON.parse(localStorage.getItem("addtodo")) || [];
      setAddtodo(savedTodos);
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("addtodo", JSON.stringify(addtodo));
    }
  }, [addtodo, isClient]);

  useEffect(() => {
    if (isClient && selectedSubject) {
      localStorage.setItem("selectedSubject", selectedSubject);
    }
  }, [selectedSubject, isClient]);

  const addSubjectName = async (e) => {
    e.preventDefault();
    if (addtask.trim() && !isSubmitting) {
      setIsSubmitting(true);
      
      // Check for duplicates
      if (addtodo.some(subject => subject.toLowerCase() === addtask.toLowerCase())) {
        alert("Subject already exists!");
        setIsSubmitting(false);
        return;
      }

      const updated = [...addtodo, addtask];
      setAddtodo(updated);
      setAddtask("");
      
      // Smooth close with delay
      setTimeout(() => {
        setOpenSubjectForm(false);
        setIsSubmitting(false);
      }, 300);

      const allTopics = JSON.parse(
        localStorage.getItem("chapterTopics") || "{}"
      );
      const allResponses = JSON.parse(
        localStorage.getItem("savedResponses") || "{}"
      );
      allTopics[addtask] = {};
      allResponses[addtask] = {};
      localStorage.setItem("chapterTopics", JSON.stringify(allTopics));
      localStorage.setItem("savedResponses", JSON.stringify(allResponses));
    }
  };

  const removeSubjectName = (index) => {
    if (deleteConfirm === index) {
      const subjectToRemove = addtodo[index];
      const updated = addtodo.filter((_, i) => i !== index);
      setAddtodo(updated);

      if (selectedSubject === subjectToRemove) {
        dispatch(setSelectedSubject(""));
        localStorage.removeItem("selectedSubject");
      }
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(index);
      // Auto-cancel delete confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const subjecthandle = () => {
    setOpenSubjectForm((prev) => !prev);
    setAddtask("");
  };

  const handleClickSubject = (subject) => {
    dispatch(setSelectedSubject(subject));
  };

  // Color palette for subjects
  const subjectColors = [
    "from-blue-500 to-blue-700",
    "from-purple-500 to-purple-700",
    "from-green-500 to-green-700",
    "from-red-500 to-red-700",
    "from-yellow-500 to-orange-600",
    "from-indigo-500 to-indigo-700",
    "from-pink-500 to-pink-700",
    "from-cyan-500 to-cyan-700",
    "from-emerald-500 to-emerald-700",
  ];

  if (!isClient) return null;

  // ✅ If subject is clicked, show viewer only
  if (selectedSubject) {
    return (
      <div className="w-full">
        <SubjectDetailViewer
          selectedSubject={selectedSubject}
          setSelectedSubject={(value) => dispatch(setSelectedSubject(value))}
          isDark={isDark}
        />
      </div>
    );
  }
 

  // ✅ Show subject UI by default (even if no subjects yet)
  return (
    <div className={`relative w-full min-h-[100vh] flex flex-col items-center custom-scrollbar bg-gradient-to-br
     from-gray-50 to-gray-100 ${isDark?"dark:from-gray-900 dark:to-gray-800":""}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
          isDark ? 'bg-blue-500' : 'bg-blue-400'
        } blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${
          isDark ? 'bg-purple-500' : 'bg-purple-400'
        } blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Empty state if no subjects */}
      {addtodo.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex justify-center items-center px-6"
        >
          <div className="text-center max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <div className="relative mx-auto w-32 h-32 mb-6">
               <Image
                  src="/images/workspace/create/box.png"
                  alt="no notes"
                  width={128}
                  height={128}
                  className="relative z-10"
                />
              </div>
              <h2 className="text-2xl font-semibold  mb-3">
                Start Your Learning Journey
              </h2>
              <p className=" mb-8 leading-relaxed">
                Create your first subject to begin organizing your study materials and notes
              </p>
            </motion.div>
            
            <motion.button
              onClick={subjecthandle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              <IoAdd className="text-2xl group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-medium">Create Your First Subject</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Subject input form */}
      <AnimatePresence>
        {openSubjectForm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={subjecthandle}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60"
            />
            
            {/* Modal */}
            <motion.form
              onSubmit={addSubjectName}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-96 max-w-[90vw] z-80 border border-gray-200 dark:border-gray-700"
            >
              <button
                type="button"
                onClick={subjecthandle}
                className="absolute right-4 top-4 text-2xl cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <IoClose />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MdBook className="text-2xl text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Add New Subject
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Give your subject a memorable name
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    value={addtask}
                    onChange={(e) => setAddtask(e.target.value)}
                    placeholder="e.g., Mathematics, History, Physics"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl 
                      focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 
                      bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-200"
                    autoFocus
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!addtask.trim() || isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                    disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                    text-white font-medium py-3 rounded-xl transition-all duration-300 
                    transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </span>
                  ) : (
                    "Create Subject"
                  )}
                </button>
              </div>
            </motion.form>
          </>
        )}
      </AnimatePresence>

      {/* Subject list UI */}
      {addtodo.length > 0 && (
        <div className="w-full max-w-6xl px-6 pb-10 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold  mb-4">
              Your Subjects
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Choose a subject to continue studying
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {addtodo.map((subject, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleClickSubject(subject)}
                className={`relative bg-gradient-to-br ${subjectColors[index % subjectColors.length]} 
                  text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer 
                  transition-all duration-300 group min-h-[140px] flex flex-col justify-between`}
              >
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeSubjectName(index);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${
                    deleteConfirm === index
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg scale-110'
                      : 'bg-white/20 hover:bg-red-500 text-white/80 hover:text-white hover:scale-110'
                  }`}
                  title={deleteConfirm === index ? "Click again to confirm" : "Delete subject"}
                >
                  <MdOutlineDeleteForever className="text-lg"  />
                </button>

                {/* Subject icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MdBook className="text-xl" />
                  </div>
                  <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                  <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                </div>

                {/* Subject name */}
                <div>
                  <h3 className="font-bold text-lg leading-tight group-hover:scale-105 transition-transform duration-200">
                    {subject
                      .toLowerCase()
                      .split(" ")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </h3>
                  <p className="text-white/80 text-sm mt-1">Click to open</p>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </motion.div>
            ))}
            
            {/* Add new subject button */}
            <motion.button
              onClick={subjecthandle}
              whileHover={{ y: -5, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: addtodo.length * 0.1 }}
              className="min-h-[140px] border-2 border-dashed border-gray-300 dark:border-gray-600 
                rounded-2xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 
                flex flex-col items-center justify-center gap-3 text-gray-600 dark:text-gray-400 
                hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 group"
            >
              <div className="w-12 h-12 border-2 border-current rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                <IoAdd className="text-2xl" />
              </div>
              <span className="font-medium">Add Subject</span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}