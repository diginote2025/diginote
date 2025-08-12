"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTheme, setThemeLoaded } from "@/redux/themeSlice";

export default function Breadcrumb() {
  const { isDark, isThemeLoaded } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
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

  // if (!isThemeLoaded) {
  //   return (
  //     <div
  //       className={`min-h-screen flex items-center justify-center ${containerTheme}`}
  //     >
  //       <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="relative py-10 w-full overflow-hidden">
      <div className="relative container shadow-xl overflow-hidden border border-gray-200 mt-12 rounded-3xl mx-auto px-4 py-20 md:py-18 text-center">
        <div className="absolute inset-0  overflow-hidden pointer-events-none">
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

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
          AI Unit Test
        </h1>

        <nav className="text-sm md:text-base text-gray-600">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a
                href="/"
                className="inline-flex items-center text-gray-700 hover:text-teal-600 transition-colors duration-300"
              >
                Home
              </a>
            </li>
            <li className="inline-flex items-center">
              <span className="text-gray-400">/</span>
              <a
                href="/features"
                className="ml-1 md:ml-2 font-medium inline-flex items-center text-gray-700 hover:text-teal-600 transition-colors duration-300"
              >
                Features
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400">/</span>
                <span className="ml-1 md:ml-2 font-medium text-gray-500">
                  AI Unit Test
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
}
