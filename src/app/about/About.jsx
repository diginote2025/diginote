"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Globe } from "lucide-react";
import { FaArrowRight, FaPencil } from "react-icons/fa6";

export default function EducationAboutSection() {
  return (
    <section className="bg-white py-8 md:py-16 px-4 md:px-6" id="about">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center">
          {/* Left Side - Images */}
          <div className="relative w-full h-full lg:w-auto flex justify-center lg:justify-start">
            <div className="relative flex gap-3 md:gap-6 scale-85 sm:scale-90 lg:scale-100">
              <div className="flex flex-col gap-6 md:gap-10 items-end">
                <div className="w-48 md:w-60 h-72 md:h-96 rounded-t-[40px] md:rounded-t-[60px] rounded-bl-[40px] md:rounded-bl-[60px] overflow-hidden shadow-xl z-10 relative">
                  <Image
                    src={"/images/homepage/about/about_diginote.jpg"}
                    alt="Woman studying"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="w-48 md:w-60 h-72 md:h-80 rounded-tl-[40px] md:rounded-tl-[60px] rounded-b-[40px] md:rounded-b-[60px] overflow-hidden shadow-xl z-10 relative">
                  <Image
                    src={"/images/homepage/about/serving_students.jpg"}
                    alt="Woman studying"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-6 md:gap-12">
                <div className="w-48 h-48 md:w-64 md:h-64 relative p-2 rounded-full overflow-hidden z-20">
                  <Image
                    src={"/images/homepage/about/2151977843.jpg"}
                    alt="Students collaborating"
                    fill
                    className="object-cover rounded-full p-2"
                  />
                  <div
                    style={{ animationDuration: "20s" }}
                    className="w-50 max-lg:w-48 h-50 max-lg:h-48 absolute top-0 left-0 animate-spin md:w-64 md:h-64 p-2 rounded-full border-2 border-gray-500 border-dashed"
                  ></div>
                </div>

                <div className="w-48 md:w-60 h-56 md:h-84 rounded-b-[40px] md:rounded-b-[60px] rounded-tr-[40px] md:rounded-tr-[60px] overflow-hidden shadow-xl z-10 relative">
                  <Image
                    src={"/images/homepage/about/save_paper.jpg"}
                    alt="Students studying"
                    fill
                    className="object-cover"
                  />
                </div>

              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6 md:space-y-8 w-full lg:w-auto">
            <div>
              <h2 className="text-4xl lg:text-5xl font-[roboto] font-bold text-blue-700 leading-tight mb-3 md:mb-4">
                Study Smarter with DigiNote The AI-Powered Tool for Students
              </h2>
              <p className="text-gray-600 leading-relaxed text-base">
                DigiNote is your all-in-one AI-powered study assistant. Whether
                you're preparing for exams or reviewing a topic, DigiNote helps
                you study smarter with features designed specifically for
                students.
              </p>
            </div>

            {/* Services */}
            <div className="grid gap-4 md:gap-6">
              <ServiceItem
                icon={
                  <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                }
                title="AI-Powered Education Services"
                text="We provide smart, AI-generated notes to help students grasp key concepts quickly and efficiently — perfect for revision, self-study, or catching up on missed classes."
              />
              <ServiceItem
                icon={
                  <Globe className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                }
                title="Serving Students Worldwide"
                text="Our platform is built for students across the globe — from high school learners to university students — offering multi-language support and curriculum-aligned content."
              />
              <ServiceItem
                icon={
                  <Globe className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                }
                title="Future-Ready Digital Notes"
                text="Say goodbye to outdated notebooks — access organized, searchable, and cloud-synced notes anytime, anywhere, from any device."
              />
              <ServiceItem
                icon={
                  <Globe className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                }
                title="Save Paper, Save the Planet"
                text="By going digital, you're not just learning smarter — you're also reducing paper waste and contributing to a more sustainable future."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceItem({ icon, title, text }) {
  return (
    <div className="flex items-start gap-3 md:gap-4">
      <div className="bg-orange-100 rounded-full p-2 md:p-3 flex-shrink-0 mt-1">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-base md:text-lg font-bold text-gray-900">
          {title}
        </h4>
        <p className="text-gray-600 text-base leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

// Animation variant
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};
