"use client";

import Image from "next/image";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // Add icons

export default function MinimalNavbar() {
  const [open, setOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Features", href: "/features", dropdown: true },
    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/faq" },
  ];

  const featuresLinks = [
    { name: "Ai Notebook Maker", href: "/features/ai-notebook-maker" },
    { name: "Ai MCQ Practice", href: "/features/ai-mcq-practice" },
    { name: "Ai Unit Test", href: "/features/ai-unit-test" },
    { name: "Topic Wise Youtube Video", href: "/features/topic-wise-youtube-video" },
  ];

  return (
    <header className="w-full fixed z-50 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex gap-5">
            <a href="/" className="text-2xl">
              <Image
                src={"/images/homepage/navbar/logo.png"}
                alt="diginote logo"
                width={1000}
                height={1000}
                className="w-36"
              />
            </a>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {links.map((l) =>
              l.dropdown ? (
                <div
                  key={l.name}
                  className="relative group"
                  onMouseEnter={() => setFeaturesOpen(true)}
                  onMouseLeave={() => setFeaturesOpen(false)}
                >
                  <a
                    href={l.href}
                    className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    {l.name}
                    {featuresOpen ? (
                      <ChevronUp size={16} className="transition-transform duration-200" />
                    ) : (
                      <ChevronDown size={16} className="transition-transform duration-200" />
                    )}
                  </a>

                  {featuresOpen && (
                    <div className="absolute left-0 w-48 bg-white border border-gray-100 rounded-md shadow-lg">
                      {featuresLinks.map((f) => (
                        <a
                          key={f.name}
                          href={f.href}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          {f.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={l.name}
                  href={l.href}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {l.name}
                </a>
              )
            )}
          </div>

          {/* Actions */}
          <div className="hidden md:flex md:items-center md:space-x-3">
           
            <a
              href="/contact"
              className="px-4 py-1.5 rounded-md text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700"
            >
              Contact Us
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
            >
              {/* Hamburger Icon */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
