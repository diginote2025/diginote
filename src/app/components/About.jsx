import React from "react";
import { BookOpen, FileText, Globe, Leaf, Phone } from "lucide-react";
import { FaArrowRightLong } from "react-icons/fa6";
import Image from "next/image";
import { Source_Serif_4 } from 'next/font/google'

const Source_Serif_4fFont = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400'],
 
});

export default function EducationAboutSection() {
  return (
    <section className={`bg-white py-8 md:py-16 px-4 md:px-6 ${Source_Serif_4fFont.className}`} id="about">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center">
          {/* Left Side - Images */}
          
            <Image
              src={"/images/homepage/about/about_diginote.jpg"}
              alt=""
              width={1000}
              height={1000}
              className="object-cover w-11/24 max-lg:w-full rounded-2xl"
            />
   

          {/* Right Side - Content */}
          <div className=" w-full lg:w-auto flex-1">
            {/* Header */}
            <div>
              <h2 className="text-4xl lg:text-5xl font-libertinus font-bold text-gray-900 leading-tight mb-3 md:mb-4">
                Study Smarter with DigiNote <br /> The AI-Powered Tool Built for
                Students
              </h2>

              <p className="text-gray-700 text-lg mb-4">
                DigiNote is your all-in-one AI-powered study assistant. Whether
                you're preparing for exams or reviewing a topic, DigiNote helps
                you study smarter with features designed specifically for
                students.
              </p>
            </div>

            {/* Services */}
        <div className="flex flex-col lg:flex-row gap-6">
  <div className="grid gap-4 md:gap-6 w-full">
    {/* AI-Powered Education Services */}
    <div className="flex items-start gap-3 md:gap-4">
      <div className="bg-orange-100 rounded-full p-2 md:p-3 flex-shrink-0 mt-1">
        <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
      </div>
      <div className="flex-1">
        <h4 className="text-base md:text-lg font-bold text-gray-900">
          AI-Powered Education Services
        </h4>
        <p className="text-gray-600 text-base leading-relaxed">
          We provide smart, AI-generated notes to help students
          grasp key concepts quickly and efficiently — perfect for
          revision, self-study, or catching up on missed classes.
        </p>
      </div>
    </div>

    {/* Serving Students Worldwide */}
    <div className="flex items-start gap-3 md:gap-4">
      <div className="bg-orange-100 rounded-full p-2 md:p-3 flex-shrink-0 mt-1">
        <Globe className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
      </div>
      <div className="flex-1">
        <h4 className="text-base md:text-lg font-bold text-gray-900">
          Serving Students Worldwide
        </h4>
        <p className="text-gray-600 text-base leading-relaxed">
          Our platform is built for students across the globe — from
          high school learners to university students — offering
          multi-language support and curriculum-aligned content.
        </p>
      </div>
    </div>

    {/* Digital Future-Ready Notes */}
    <div className="flex items-start gap-3 md:gap-4">
      <div className="bg-orange-100 rounded-full p-2 md:p-3 flex-shrink-0 mt-1">
        <FileText className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
      </div>
      <div className="flex-1">
        <h4 className="text-base md:text-lg font-bold text-gray-900">
          Future-Ready Digital Notes
        </h4>
        <p className="text-gray-600 text-base leading-relaxed">
          Say goodbye to outdated notebooks — access organized, searchable, and cloud-synced notes anytime, anywhere, from any device.
        </p>
      </div>
    </div>

    {/* Environmentally Friendly */}
    <div className="flex items-start gap-3 md:gap-4">
      <div className="bg-orange-100 rounded-full p-2 md:p-3 flex-shrink-0 mt-1">
        <Leaf className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
      </div>
      <div className="flex-1">
        <h4 className="text-base md:text-lg font-bold text-gray-900">
          Save Paper, Save the Planet
        </h4>
        <p className="text-gray-600 text-base leading-relaxed">
          By going digital, you're not just learning smarter — you're also reducing paper waste and contributing to a more sustainable future.
        </p>
      </div>
    </div>
  </div>
</div>


            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center md:pt-6">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white 
              rounded-4xl font-semibold transition-colors duration-300 flex items-center gap-3 text-sm md:text-lg
              px-8 py-4"
              >
              Read More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
