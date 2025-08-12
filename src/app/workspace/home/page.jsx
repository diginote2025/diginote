"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme, setThemeLoaded } from "@/redux/themeSlice";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaPencil } from "react-icons/fa6";



export default function Page() {
  const dispatch = useDispatch();
  const { isDark, isThemeLoaded } = useSelector((state) => state.theme);
  const [isVisible, setIsVisible] = useState(false);

    const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme !== null) {
      dispatch(setTheme(storedTheme === "true"));
    }
    dispatch(setThemeLoaded(true));
    
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
  }, [dispatch]);

  const containerTheme = isDark
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    : "bg-gradient-to-br from-blue-50 via-white to-indigo-50";

  const textTheme = isDark ? "text-white" : "text-gray-900";
  const subtextTheme = isDark ? "text-gray-300" : "text-gray-600";

  if (!isThemeLoaded) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${containerTheme}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className={`h-screen ${containerTheme} transition-all flex justify-center items-center duration-500 ease-in-out relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
          isDark ? 'bg-blue-500' : 'bg-blue-400'
        } blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${
          isDark ? 'bg-purple-500' : 'bg-purple-400'
        } blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
      </div>

<div className="w-full flex flex-col items-center justify-center text-center rounded-2xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">
        Welcome To The <br className="hidden max-lg:block" />
        <span className="text-blue-500">DigiNote</span>
      </h1>

      <p className="text-base leading-relaxed mb-8 max-w-3xl">
        Empowering educators and learners through advanced AI solutions. <br />
        DigiNote delivers personalized learning paths, real-time academic
        assistance, and intelligent tools designed to streamline educational
        workflows and maximize outcomes.
      </p>

         <motion.div
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className=" flex justify-center  "
                >
                  <Link href="/workspace/create" passHref>
                    <button
                      className="group flex items-center relative justify-center gap-2 p-1 pl-4 text-white 
            bg-gradient-to-r from-green-500 to-blue-500 
            hover:from-green-500 hover:to-blue-500 
             text-base rounded-full border border-blue-500
            shadow-md hover:shadow-xl hover:scale-105 hover:border-blue-800 
            transition-all duration-300 
            focus:outline-none focus:ring-4 focus:ring-blue-300/50 active:scale-95"
                      role="button"
                      aria-label="Create a new digital notebook"
                    >
                      Create Digital Notebook
                      {/* Pencil Icon with group-hover animation */}
                      <div
                        className="bg-purple-500 rounded-full text-gray-200 p-2 transform transition-transform duration-300 
              group-hover:rotate-45 "
                      >
                        <FaPencil size={28} />
                      </div>
                    </button>
                  </Link>
                </motion.div>
    </div>

     
    </div>
  );
}