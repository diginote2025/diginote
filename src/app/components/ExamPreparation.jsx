import React from "react";
import { BrainCircuit, FileText, ListChecks, ArrowRight } from "lucide-react";
import Link from "next/link";

// Main component for the Exam Preparation Section
const ExamPreparation = () => {
  // Data for the exam categories. This makes it easy to add or modify categories later.
  const examCategories = [
    {
      name: "NEET",
      description:
        "Ace medical entrances with AI-powered notes, extensive MCQs, and realistic mock tests.",
      icon: <BrainCircuit className="h-10 w-10 text-cyan-500" />,
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      buttonColor: "bg-cyan-500 hover:bg-cyan-600",
    },
    {
      name: "JEE",
      description:
        "Conquer engineering exams with smart study tools, thousands of practice questions, and timed online tests.",
      icon: <ListChecks className="h-10 w-10 text-orange-500" />,
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      buttonColor: "bg-orange-500 hover:bg-orange-600",
    },
    {
      name: "UPSC",
      description:
        "Master civil services prep with AI-curated notes, comprehensive MCQs, and full-length practice exams.",
      icon: <FileText className="h-10 w-10 text-blue-500" />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
    },
    {
      name: "SSC CGL",
      description:
        "Excel in government job exams with targeted AI tools, topic-wise MCQs, and performance-tracking tests.",
      icon: <BrainCircuit className="h-10 w-10 text-emerald-500" />,
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      buttonColor: "bg-emerald-500 hover:bg-emerald-600",
    },
  ];

  return (
    <section className="bg-slate-50 font-sans py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight">
            AI Study Tools, MCQs, and Online Tests for NEET, JEE, UPSC & CGL
            Prep
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Unlock your full potential with our all-in-one platform. We provide
            smart study tools and rigorous practice tests to help you study
            smarter, practice harder, and achieve your dream rank.{" "}
          </p>
        </div>

        {/* Grid of Exam Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {examCategories.map((exam, index) => (
            <div
              key={index}
              className={`
                flex flex-col rounded-2xl border p-6 transition-all duration-300 
                ease-in-out transform hover:-translate-y-2 hover:shadow-2xl 
                ${exam.bgColor} ${exam.borderColor}
              `}
            >
              <div className="flex-shrink-0 mb-4">
                <div
                  className={`inline-block p-3 rounded-xl bg-white shadow-md`}
                >
                  {exam.icon}
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {exam.name}
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {exam.description}
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/workspace/home"
                  className={`
                    inline-flex items-center justify-center w-full px-6 py-3 
                    font-semibold text-white rounded-lg transition-all duration-300 
                    ease-in-out shadow-md
                    ${exam.buttonColor}
                  `}
                >
                  Start Preparing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExamPreparation;
