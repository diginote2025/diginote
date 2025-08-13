import Image from "next/image";
import React from "react";

// A reusable SVG checkmark icon component for use in feature lists.
const CheckIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ServicesPage = () => {
  // Data for the core services/expertise grid. This makes the JSX cleaner and easier to update.
  const expertiseItems = [
    {
      number: "01",
      title: "Adaptive Question Generation",
      description:
        "AI creates questions that match your current skill level and gradually increases complexity.",
    },
    {
      number: "02",
      title: "Comprehensive Syllabus Coverage",
      description:
        "Every MCQ set is aligned with your academic or exam requirements.",
    },
    {
      number: "03",
      title: "Explanatory Feedback System",
      description:
        "Detailed answer explanations to promote deeper understanding of concepts.",
    },
    {
      number: "04",
      title: "Performance Analytics",
      description:
        "Track scores, speed, and accuracy to target your weak points effectively.",
    },
    {
      number: "05",
      title: "Diverse Question Formats",
      description:
        "Single-correct, multiple-correct, and case-based questions for varied learning.",
    },
    {
      number: "06",
      title: "Continuous Content Updates",
      description:
        "Questions are regularly refreshed to stay relevant with the latest syllabus trends.",
    },
  ];

  return (
    <div className="bg-white text-gray-800 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Section 1: Main Introduction */}
        <header className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            MCQ Practice Tests – Assess & Strengthen Your Knowledge
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Master any subject with AI-powered multiple-choice practice tests.
            Our topic-wise MCQs are designed to challenge your understanding,
            identify weak areas, and reinforce learning through active recall.
          </p>
        </header>

        {/* Section 2: Included Features List */}
        <section className="max-w-5xl mx-auto mb-16 md:mb-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
            Services Include:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-lg text-gray-700">
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                Topic-Wise MCQs – Focused questions for each chapter or subject
                area.
              </span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                Instant Answer Feedback – Get explanations for correct and
                incorrect answers.
              </span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                Difficulty-Level Control – Practice with easy, moderate, or
                advanced questions.
              </span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                Custom Test Creation – Select topics and number of questions for
                personalized tests.
              </span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                Progress Tracking – Monitor improvement over time with detailed
                analytics.
              </span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                Exam Simulation Mode – Experience real-time test conditions to
                build confidence.
              </span>
            </div>
          </div>
        </section>

        {/* Section 3: Image Showcase */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 md:mb-20">
          <div className="rounded-lg overflow-hidden shadow-lg h-80">
            <Image
              width={1000}
              height={1000}
              src="/images/features/ai-mcq-practice/ai-mcq-practice1.jpg"
              alt="Student reviewing test questions on a tablet"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg h-80">
            <Image
              width={1000}
              height={1000}
              src="/images/features/ai-mcq-practice/ai-mcq-practice2.jpg"
              alt="Students collaborating with technology"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Section 4: Our Expertise Grid */}
        <section className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Our Expertise in AI Education
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-12">
            We've developed a comprehensive set of tools to address every aspect
            of your academic journey. Explore our core services designed for
            maximum impact and efficiency.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {expertiseItems.map((item) => (
              <div
                key={item.number}
                className="bg-gray-50 p-6 rounded-lg shadow-md text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-500 text-white font-bold text-xl">
                    {item.number}
                  </div>
                  <h3 className="ml-4 text-xl font-bold text-gray-900">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Service Benefits */}
        <section className="bg-gray-900 text-white rounded-lg p-10 md:p-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Service Benefits (Specific to MCQ Practice Tests)
            </h2>
            <p className="text-lg text-gray-300 text-center mb-10">
              Integrating our AI tools into your study routine provides tangible
              benefits that translate directly into better results and a more
              enjoyable learning experience.
            </p>
            <ul className="space-y-4 text-lg">
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong>Reinforces Learning:</strong> Active recall boosts
                  long-term memory retention.
                </span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong>Identifies Weak Areas:</strong> Pinpoint topics that
                  need more attention.
                </span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong>Exam-Ready Preparation:</strong> Builds speed and
                  accuracy under time constraints.
                </span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong>Customizable Practice:</strong> Learn at your own pace
                  and focus on specific topics.
                </span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong>Confidence Building:</strong> Familiarizes you with
                  exam patterns and reduces anxiety.
                </span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong>Immediate Results:</strong> No waiting—get instant
                  scores and feedback.
                </span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServicesPage;
