import React from "react";
import Image from "next/image";

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
  // Data for the core services grid. This makes the JSX cleaner and easier to update.
  const services = [
    {
      number: "01",
      title: "Precision Learning Tools",
      description:
        "Our AI systems are fine-tuned to provide only the most relevant information, removing noise and irrelevant details.",
    },
    {
      number: "02",
      title: "Curriculum Integration",
      description:
        "We ensure generated notes match specific academic standards, exam boards, and syllabus outlines.",
    },
    {
      number: "03",
      title: "Natural Language Processing (NLP) Excellence",
      description:
        "Using advanced NLP models, we create human-like, easy-to-read content from complex study materials.",
    },
    {
      number: "04",
      title: "Custom Content Generation",
      description:
        "Tailored notes based on your personal learning style and preferences.",
    },
    {
      number: "05",
      title: "Multi-Disciplinary Coverage",
      description:
        "Whether it’s science, literature, history, or technical subjects, our AI adapts to all fields.",
    },
    {
      number: "06",
      title: "Continuous Improvement",
      description:
        "Our AI models learn from user feedback, ensuring notes become more accurate and relevant over time.",
    },
  ];

  return (
    <div className="bg-white text-gray-800 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Section 1: Main Introduction */}
        <header className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            AI-Generated Notes – Your Smart Study Companion
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Leverage the power of AI to instantly generate accurate, concise,
            and syllabus-focused notes for any topic or chapter. Perfect for
            students, educators, and professionals seeking clear, well-organized
            learning material without spending hours summarizing content
            manually.
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
                Topic-Specific Notes – AI generates notes based on your selected
                topic or chapter.
              </span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                Syllabus-Aligned Content – Ensures notes follow your curriculum
                or exam requirements.
              </span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                Concise Summarization – Removes unnecessary details while
                keeping essential points.
              </span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                Customizable Depth – Choose between brief summaries or in-depth
                explanations.
              </span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                Multi-Language Support – Generate notes in your preferred
                language.
              </span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                Export & Share Options – Download as PDF or share directly with
                classmates.
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
              src="/images/features/ai-notebook/ai-notebook1.jpg"
              alt="Student using a laptop for AI-powered learning"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg h-80">
            <Image
              width={1000}
              height={1000}
              src="/images/features/ai-notebook/ai-notebook2.jpg"
              alt="Students collaborating with technology"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Section 4: Our Expertise / Core Services Grid */}
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
            {services.map((service) => (
              <div
                key={service.number}
                className="bg-gray-50 p-6 rounded-lg shadow-md text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-500 text-white font-bold text-xl">
                    {service.number}
                  </div>
                  <h3 className="ml-4 text-xl font-bold text-gray-900">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Service Benefits */}
        <section className="bg-gray-900 text-white rounded-lg p-10 md:p-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Services Benefits
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
                  <strong>Time-Saving Efficiency –</strong> Instantly receive
                  ready-to-use notes without manual writing.
                </span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong>Improved Retention –</strong> Structured summaries
                  enhance comprehension and memory.
                </span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong>Syllabus Accuracy –</strong> Every note aligns
                  perfectly with your academic goals.
                </span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong> Consistency in Quality –</strong> Maintain the same
                  high standard for every topic.
                </span>
              </li>{" "}
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong> Study Anytime, Anywhere –</strong> Access notes on
                  any device for flexible learning.
                </span>
              </li>{" "}
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong> Collaboration Made Easy –</strong> Share notes with
                  classmates or study groups effortlessly.
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
