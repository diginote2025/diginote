"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X, Menu } from "lucide-react";

export default function MinimalNavbar() {
  const [open, setOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Features", href: "/features", dropdown: true },
    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/faq" },
  ];

  const featuresLinks = [
    { name: "AI Notebook Maker", href: "/features/ai-notebook-maker" },
    { name: "AI MCQ Practice", href: "/features/ai-mcq-practice" },
    { name: "AI Unit Test", href: "/features/ai-unit-test" },
    { name: "Topic Wise YouTube Video", href: "/features/topic-wise-youtube-video" },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && !event.target.closest('nav')) {
        setOpen(false);
        setMobileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const closeMobileMenu = () => {
    setOpen(false);
    setMobileDropdownOpen(false);
  };

  return (
    <header 
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg ' : 'bg-white shadow-sm '
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl block">
              <Image
                src="/images/homepage/navbar/logo.png"
                alt="diginote logo"
                width={144}
                height={40}
                className="w-32 sm:w-36 h-auto"
                priority
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {links.map((link) =>
              link.dropdown ? (
                <div
                  key={link.name}
                  className="relative group"
                  onMouseEnter={() => setFeaturesOpen(true)}
                  onMouseLeave={() => setFeaturesOpen(false)}
                >
                  <a
                    href={link.href}
                    className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium py-2"
                  >
                    {link.name}
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform duration-200 ${
                        featuresOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </a>

                  {/* Desktop Dropdown */}
                  <div
                    className={`absolute left-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-lg shadow-xl transition-all duration-200 ${
                      featuresOpen 
                        ? 'opacity-100 visible transform translate-y-0' 
                        : 'opacity-0 invisible transform -translate-y-2'
                    }`}
                  >
                    <div className="py-2">
                      {featuresLinks.map((feature, index) => (
                        <a
                          key={feature.name}
                          href={feature.href}
                          className={`block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 ${
                            index !== featuresLinks.length - 1 ? 'border-b border-gray-50' : ''
                          }`}
                        >
                          {feature.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium py-2 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                </a>
              )
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <a
              href="/contact"
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Contact Us
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              {open ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden absolute h-screen left-0 right-0 top-full bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ease-in-out z-40 ${
            open 
              ? 'max-h-screen opacity-100 visible' 
              : 'max-h-0 opacity-0 invisible'
          }`}
          style={{ 
            maxHeight: open ? 'calc(100vh - 4rem)' : '0',
            overflow: 'hidden'
          }}
        >
          <div className="px-4 py-6 space-y-1 overflow-y-auto max-h-screen">
            {links.map((link) =>
              link.dropdown ? (
                <div key={link.name} className="space-y-1">
                  <button
                    onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    {link.name}
                    <ChevronDown 
                      size={18} 
                      className={`transition-transform duration-200 ${
                        mobileDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {/* Mobile Dropdown Items */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      mobileDropdownOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="pl-6 space-y-1">
                      {featuresLinks.map((feature) => (
                        <a
                          key={feature.name}
                          href={feature.href}
                          onClick={closeMobileMenu}
                          className="block px-4 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200"
                        >
                          {feature.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  {link.name}
                </a>
              )
            )}

            {/* Mobile Contact Button */}
            <div className="pt-6 mt-6 border-t border-gray-100">
              <a
                href="/contact"
                onClick={closeMobileMenu}
                className="block w-full px-6 py-3 text-center text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-md"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}