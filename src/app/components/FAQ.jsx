"use client"

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ() {
 const faqs = [
  {
    q: "What is DigiNote?",
    a: "DigiNote is an AI-powered platform that helps students and educators create instant notes, practice MCQs, watch related videos, and build unit tests — all in one place.",
  },
  {
    q: "Who can use DigiNote?",
    a: "DigiNote is perfect for school and college students, teachers, and self-learners who want to study smarter, not harder.",
  },
  {
    q: "How does the AI notes generator work?",
    a: "You simply enter a topic or chapter name, and DigiNote’s AI will generate concise, easy-to-understand notes based on that subject.",
  },
  {
    q: "Can I practice MCQs on DigiNote?",
    a: "Yes! DigiNote lets you take chapter-based or mixed MCQ quizzes to test your knowledge and track your improvement.",
  },
  {
    q: "Are YouTube videos integrated into notes?",
    a: "Absolutely. DigiNote automatically suggests high-quality YouTube videos that match your topic for better visual understanding.",
  },
  {
    q: "Can I create my own unit tests?",
    a: "Yes. You can either manually select questions or let DigiNote generate a custom unit test with balanced difficulty levels.",
  },
  {
    q: "Is DigiNote free to use?",
    a: "Yes, DigiNote offers free access to its core features — no sign-up required to get started.",
  },
  {
    q: "Do I need to sign up to use DigiNote?",
    a: "No sign-up is needed for basic use. However, creating an account lets you save notes, quizzes, and track your progress.",
  },
];


  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 px-4 sm:px-8 lg:px-24 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map(({ q, a }, idx) => (
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
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="text-lg font-medium text-gray-800">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight: height }}
        className="overflow-hidden transition-all duration-500 ease-in-out px-5"
      >
        <div className="pb-4 text-gray-600">{answer}</div>
      </div>
    </div>
  );
}
