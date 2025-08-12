"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// Expanded FAQ data (30 questions total)
const faqData = [
{
  category: "General",
  questions: [
    { 
      q: "What is DigiNote?", 
      a: "DigiNote is your all-in-one AI-powered study assistant. Instead of juggling between apps, videos, and books, you can instantly generate structured notes, test yourself with MCQs, watch curated videos, and even create custom quizzes — all from a single, distraction-free platform."
    },
    { 
      q: "Who can use DigiNote?", 
      a: "DigiNote is designed for school and college students, teachers preparing learning materials, and self-learners who want to absorb knowledge faster. Whether you’re revising for exams, preparing lessons, or exploring a new subject, DigiNote adapts to your needs."
    },
    { 
      q: "Do I need technical skills to use DigiNote?", 
      a: "Not at all. DigiNote works right from your browser with a clean, click-and-go interface. If you can type in a search bar, you can use DigiNote — no installations, coding, or advanced settings required."
    },
    { 
      q: "Does DigiNote work for all subjects?", 
      a: "Yes. DigiNote supports a wide range of subjects, from math and science to history, languages, and even niche topics. As long as you can describe your topic, DigiNote can generate learning resources for it."
    },
    { 
      q: "Is DigiNote available on mobile?", 
      a: "Absolutely. DigiNote is fully responsive, so you can create notes, take quizzes, and watch videos seamlessly on your phone, tablet, or desktop without downloading any app."
    },
    { 
      q: "Can DigiNote replace my textbook?", 
      a: "DigiNote is not meant to replace textbooks but to supercharge them. Think of it as your personal study guide that condenses, explains, and reinforces what you learn — making revision faster and retention stronger."
    },
  ],
},
 {
  category: "Features",
  questions: [
    { 
      q: "How does the AI notes generator work?", 
      a: "Just type your topic, and DigiNote’s AI instantly creates structured, easy-to-understand notes. It breaks complex ideas into digestible points, making your study sessions more efficient and less overwhelming."
    },
    { 
      q: "Can I practice MCQs on DigiNote?", 
      a: "Yes. DigiNote offers instant MCQ quizzes with immediate scoring and explanations for each answer — so you’re not just testing knowledge, you’re actively learning from mistakes."
    },
    { 
      q: "Are YouTube videos integrated into notes?", 
      a: "Yes, DigiNote automatically suggests high-quality, relevant YouTube videos for your topic. You get both text and visuals in one place, so you can reinforce concepts without wasting time searching."
    },
    { 
      q: "Can I create my own unit tests?", 
      a: "Definitely. You can either handpick questions from the database or let DigiNote auto-generate balanced tests with varying difficulty levels, perfect for exam prep."
    },
    { 
      q: "Does DigiNote provide answer explanations?", 
      a: "Yes. When you take quizzes or MCQs, DigiNote gives clear, step-by-step explanations, ensuring you understand the reasoning behind the correct answers."
    },
    { 
      q: "Can I export my notes?", 
      a: "Yes, with a single click you can download notes as a clean, printable PDF — perfect for offline study or sharing with classmates."
    },
    { 
      q: "Does DigiNote support multiple languages?", 
      a: "Currently, DigiNote is optimized for English, but multilingual note generation is in active development to support more learners worldwide."
    },
    { 
      q: "Can I collaborate with classmates?", 
      a: "Yes. You can share generated notes or quizzes via links, making it easy to study together even if you’re miles apart."
    },
    { 
      q: "Does DigiNote have flashcards?", 
      a: "Flashcard mode is in the works, which will allow you to revise bite-sized Q&A cards for faster recall."
    },
    { 
      q: "Can DigiNote summarize long articles?", 
      a: "Yes. Paste any long text or article into DigiNote, and it will condense it into clear, well-structured notes that are easier to revise."
    },
  ],
},
  {
    category: "Account & Pricing",
    questions: [
      { q: "Is DigiNote free to use?", a: "Yes! Core features are free. Advanced features may require a premium plan in the future." },
      { q: "Do I need to sign up to use DigiNote?", a: "No sign-up is required for basic features. An account unlocks saving, syncing, and personalization." },
      { q: "What extra features do I get with an account?", a: "You can save your progress, create custom study lists, and access your history anytime." },
      { q: "Will my saved notes be private?", a: "Yes, all saved data is private to your account unless you choose to share it." },
      { q: "Is there a student discount?", a: "If premium plans launch, student discounts will be available." },
      { q: "How can I delete my account?", a: "You can delete your account anytime from the settings page." },
    ],
  },
  {
    category: "Privacy & Security",
    questions: [
      { q: "Is my data safe on DigiNote?", a: "Yes, all your data is stored securely and not shared with third parties." },
      { q: "Does DigiNote store my generated notes?", a: "Only if you are logged in and choose to save them." },
      { q: "Will my data be used for AI training?", a: "No — your content remains yours and is not used for AI training without consent." },
      { q: "Can I use DigiNote without sharing personal info?", a: "Yes, basic use requires no personal details." },
    ],
  },
  {
    category: "Troubleshooting & Support",
    questions: [
      { q: "Why are my notes not generating?", a: "Check your internet connection and try again. If it persists, contact support." },
      { q: "Why can’t I see YouTube videos?", a: "Some schools block YouTube; try on a different network." },
      { q: "Can I request new features?", a: "Yes, we welcome feature suggestions through the feedback form." },
      { q: "How do I report incorrect answers?", a: "Use the ‘Report’ option on the question to help us improve accuracy." },
      { q: "Does DigiNote work offline?", a: "Currently, no — an internet connection is required for AI features." },
    ],
  },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleCategoryChange = (categoryIndex) => {
    setActiveCategory(categoryIndex);
    setOpenIndex(null);
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 pb-2">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Have a question? We’ve answered the most common ones below. Still curious?{" "}
            <a href="/contact" className="text-blue-600 hover:underline">
              Contact us
            </a>{" "}
            and we’ll be happy to help.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center border-b border-gray-200 mb-8 flex-wrap">
          {faqData.map((item, index) => (
            <button
              key={item.category}
              onClick={() => handleCategoryChange(index)}
              aria-label={`Show ${item.category} questions`}
              className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-medium transition-colors duration-300 focus:outline-none ${
                activeCategory === index
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "border-b-2 border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {item.category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqData[activeCategory].questions.map(({ q, a }, idx) => (
            <Accordion
              key={idx}
              isOpen={openIndex === idx}
              question={q}
              answer={a}
              onClick={() => toggleFAQ(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Accordion({ question, answer, isOpen, onClick }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white transition-all duration-300 shadow-sm hover:shadow-lg">
      <button
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={question.replace(/\s+/g, "-").toLowerCase()}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
      >
        <span className="text-lg font-medium text-gray-800">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-6 h-6 text-blue-600 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-500 flex-shrink-0" />
        )}
      </button>
      <div
        id={question.replace(/\s+/g, "-").toLowerCase()}
        ref={contentRef}
        style={{ maxHeight: height }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div className="px-5 pb-5 pt-1 text-gray-600">{answer}</div>
      </div>
    </div>
  );
}
