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
  // Data for the core services grid. This makes the JSX cleaner and easier to update.
  const services = [
    {
      number: "01",
      title: "Smart Question Generation",
      description:
        "Our AI creates balanced question papers that match exam patterns and difficulty.",
    },
    {
      number: "02",
      title: "Adaptive Testing",
      description:
        "Question selection adjusts based on your previous performance to target weak spots.",
    },
    {
      number: "03",
      title: "Full Curriculum Coverage",
      description:
        "Every unit test is aligned with your syllabus for effective revision.",
    },
    {
      number: "04",
      title: "Realistic Exam Simulation",
      description:
        "Replicates actual test conditions to reduce anxiety and improve time management.",
    },
    {
      number: "05",
      title: "Manual Control Option",
      description:
        "Teachers and students can handpick questions for personalized assessments.",
    },
    {
      number: "06",
      title: "Continuous Question Bank Expansion",
      description:
        "New questions are added regularly to keep content fresh and relevant.",
    },
  ];

  return (
    <div className="bg-white text-gray-800 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Section 1: Main Introduction */}
        <header className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Manual or AI Unit Test Builder – Your Exam Readiness Partner
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Easily create custom unit tests with either manual question
            selection or AI-generated sets. Simulate real exam conditions,
            identify weak areas, and strengthen your preparation with targeted
            practice.
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
                Manual Test Creation – Select your own questions from a question
                bank.
              </span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                AI-Generated Test Sets – Automatically generate topic-wise or
                full-unit tests.
              </span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                Customizable Difficulty Levels – Choose from easy, medium, or
                challenging questions.
              </span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                Timed Exam Simulation – Practice under realistic time
                constraints.
              </span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                Detailed Performance Reports – Get analytics on accuracy, speed,
                and topic mastery.
              </span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span>
                Flexible Question Formats – Supports MCQs, short answers, and
                descriptive questions.
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
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop"
              alt="Student reviewing test questions on a tablet"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg h-80">
            <Image
              width={1000}
              height={1000}
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop"
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
            Our platform is built on cutting-edge AI to provide a robust and
            intelligent testing experience. Explore the core features that make
            our test builder a powerful tool for academic success.
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
              Service Benefits
            </h2>
            <p className="text-lg text-gray-300 text-center mb-10">
              Using our Unit Test Builder provides tangible benefits that
              translate directly into better exam results and a more confident
              approach to your studies.
            </p>
            <ul className="space-y-4 text-lg">
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong>Personalized Preparation:</strong> Create tests
                  tailored to your needs.
                </span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong>Time Management Skills:</strong> Practice completing
                  exams within set time limits.
                </span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong>Identifies Knowledge Gaps:</strong> Spot and fix weak
                  areas before the real exam.
                </span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong>Boosts Exam Confidence:</strong> Familiarizes you with
                  test structure and pressure.
                </span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong>Flexibility in Learning:</strong> Choose AI automation
                  or manual selection.
                </span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <span>
                  <strong>Better Performance Tracking:</strong> Monitor progress
                  with detailed insights.
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
