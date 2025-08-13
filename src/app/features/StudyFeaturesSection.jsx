import Link from "next/link";
import React from "react";

const featuresData = [
  {
    title: "AI-Generated Notes",
    description:
      "Instantly get concise, well-structured notes for any topic or chapter, tailored to your syllabus, saving you time and effort in manual summarization.",
    imageUrl:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop",
    isHighlighted: false,
    links: "/features/ai-notebook-maker",
  },
  {
    title: "MCQ Practice Tests",
    description:
      "Reinforce your learning with topic-wise multiple-choice questions designed to help you assess and strengthen your knowledge.",
    imageUrl:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop",
    isHighlighted: false,
    links: "/features/ai-mcq-practice",
  },
  {
    title: "Curated YouTube Videos",
    description:
      "Access handpicked educational videos from trusted channels that explain complex topics in a simple, engaging way for visual learning.",
    imageUrl:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop",
    isHighlighted: false,
    links: "/features/topic-wise-youtube-video",
  },
  {
    title: "Manual or AI Unit Test Builder",
    description:
      "Create custom unit tests using either manual selection or AI-generated questions to simulate real exam conditions and boost your readiness.",
    imageUrl:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop",
    isHighlighted: false,
    links: "/features/ai-unit-test",
  },
];

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 8l4 4m0 0l-4 4m4-4H3"
    />
  </svg>
);

const StudyFeaturesSection = () => {
  return (
    <div className="bg-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="p-1.5 rounded-full bg-lime-200">
              <svg
                className="h-5 w-5 text-lime-700"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.512 5.73 6.512 5.73c.244-.244.64-.244.884 0l.001.001c.244.244.244.64 0 .884l-.001.001-1.54 1.54c-.21.21-.33.48-.33.78V12a.75.75 0 001.5 0V9.813a.75.75 0 00-.22-.53l-.53-.53.001.001c-.244-.244-.244-.64 0-.884l.001-.001.001-.001a.632.632 0 01.884 0l1.912 1.912a6.012 6.012 0 012.706 1.912c.244.244.244.64 0 .884l-.001.001a.632.632 0 01-.884 0l-1.912-1.912a4.51 4.51 0 00-1.28-1.28l-1.54-1.54c-.21-.21-.48-.33-.78-.33V4.5a.75.75 0 00-1.5 0v2.187a.75.75 0 00.22.53l.53.53-.001-.001c.244.244.244.64 0 .884l-.001.001-.001.001a.632.632 0 01-.884 0L8.028 9.168a4.51 4.51 0 00-1.28 1.28l-1.54 1.54c-.244.244-.64.244-.884 0l-.001-.001a.632.632 0 010-.884z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <p className="ml-2 text-sm font-semibold text-lime-600 uppercase tracking-wider">
              Our Features
            </p>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            Supercharge Your Learning
          </h2>
        </div>

        {/* Features grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {featuresData.map((feature) => (
            <div
              key={feature.title}
              className={`rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 ease-in-out hover:-translate-y-2 
              ${
                feature.isHighlighted
                  ? "bg-lime-400 text-slate-800"
                  : "bg-white"
              }`}
            >
              <div className="flex-shrink-0">
                <Image
                  width={1000}
                  height={1000}
                  className={`h-64 w-full object-cover ${
                    !feature.isHighlighted ? "grayscale" : ""
                  }`}
                  src={feature.imageUrl}
                  alt={feature.title}
                />
              </div>
              <div className="p-8 flex flex-col justify-between flex-grow">
                <div>
                  <h3
                    className={`text-xl font-bold ${
                      feature.isHighlighted ? "text-gray-900" : "text-gray-800"
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`mt-3 text-base ${
                      feature.isHighlighted ? "text-gray-800" : "text-gray-600"
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    href={feature.links}
                    className={`group font-semibold inline-flex items-center ${
                      feature.isHighlighted
                        ? "text-gray-900 hover:text-black"
                        : "text-lime-600 hover:text-lime-700"
                    }`}
                  >
                    Learn more
                    <ArrowIcon />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyFeaturesSection;
