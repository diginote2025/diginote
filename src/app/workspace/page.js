"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme, setThemeLoaded } from "@/redux/themeSlice";
import Link from "next/link";
import { Plus } from "lucide-react";



export default function Page() {
  const dispatch = useDispatch();
  const { isDark, isThemeLoaded } = useSelector((state) => state.theme);
  const [isVisible, setIsVisible] = useState(false);

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

         <Link
        href="/workspace/create"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-medium shadow hover:bg-blue-700 transition"
      >
        <Plus size={18} />
        Make Digital Notebook
      </Link>
    </div>

     
    </div>
  );
}