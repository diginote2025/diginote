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
  // Data for the core services/expertise grid. This makes the JSX cleaner and easier to update.
  const expertise = [
    {
      number: "01",
      title: "Content Curation Excellence",
      description:
        "We select only the most accurate and engaging videos after thorough quality checks.",
    },
    {
      number: "02",
      title: "Learning Psychology Integration",
      description:
        "Videos are chosen to match visual learning styles for maximum retention.",
    },
    {
      number: "03",
      title: "Curriculum Matching",
      description: "Every video aligns with your syllabus and academic needs.",
    },
    {
      number: "04",
      title: "Educational Variety",
      description:
        "Includes animations, lectures, real-life demonstrations, and case studies.",
    },
    {
      number: "05",
      title: "Engagement Optimization",
      description:
        "We prioritize videos that keep learners focused and motivated.",
    },
    {
      number: "06",
      title: "Continuous Resource Expansion",
      description:
        "New video recommendations are added regularly to keep your learning library fresh.",
    },
  ];

  return (
    <div className="bg-white text-gray-800 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Section 1: Main Introduction */}
        <header className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Curated YouTube Videos – Learn Visually, Understand Better
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Boost your understanding with carefully selected educational videos
            from trusted YouTube channels. Each video is chosen to break down
            complex concepts into simple, engaging explanations, helping you
            learn faster and remember longer.
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
                <strong>Topic-Specific Playlists:</strong> Videos grouped by
                subject for easy access.
              </span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                <strong>Trusted Educational Sources:</strong> Content from
                reputable channels.
              </span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                <strong>Concept Simplification:</strong> Complex topics
                explained with visuals.
              </span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                <strong>Updated Recommendations:</strong> Regularly refreshed
                video list.
              </span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                <strong>Multi-Language Learning:</strong> Videos available in
                various languages.
              </span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                <strong>Accessible Anywhere:</strong> Watch on any device,
                anytime.
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
              src="/images/features/topic-wise-youtube-video/topic-wise-youtube-video1.jpg"
              alt="Student learning visually from a screen"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg h-80">
            <Image
              width={1000}
              height={1000}
              src="/images/features/topic-wise-youtube-video/topic-wise-youtube-video2.jpg"
              alt="Students collaborating with technology"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Section 4: Our Expertise / Core Services Grid */}
        <section className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Our Expertise in Educational Curation
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-12">
            We meticulously curate educational content to ensure it's not just
            informative, but also engaging and perfectly aligned with your
            learning goals.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {expertise.map((item) => (
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
              Service Benefits
            </h2>
            <p className="text-lg text-gray-300 text-center mb-10">
              Integrating our curated videos into your study routine provides
              tangible benefits that translate directly into better results and
              a more enjoyable learning experience.
            </p>
            <ul className="space-y-4 text-lg">
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong>Visual Understanding:</strong> Easier to grasp
                  difficult concepts with visual aids.
                </span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong>Time-Saving Selection:</strong> No need to search—best
                  videos are already picked for you.
                </span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong>Improved Retention:</strong> Visual explanations help
                  store information in long-term memory.
                </span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong>Trusted Quality:</strong> Learn from credible and
                  expert educators.
                </span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong>Flexible Learning:</strong> Study at your own pace,
                  anywhere, anytime.
                </span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong>Engaging & Interactive:</strong> Keeps learning
                  enjoyable and stress-free.
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
