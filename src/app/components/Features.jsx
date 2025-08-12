import React from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Youtube, ClipboardList } from "lucide-react";

import Image from "next/image";
import { FaPencil } from "react-icons/fa6";
import Link from "next/link";

export default function About() {
   const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };
  return (
    <section className="relative overflow-hidden py-20 px-4 sm:px-8 lg:px-20 bg-white">
      {/* Animated Background Bubbles */}
      <motion.div
        className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-blue-100 rounded-full filter blur-3xl opacity-60 z-0"
        animate={{ x: [0, 30, -30, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-purple-100 rounded-full filter blur-2xl opacity-50 z-0"
        animate={{ x: [0, -30, 30, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Flex Container for Side-by-Side Layout */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-start   justify-center gap-12"
      >
        {/* Image Left */}
        <div className=" w-full">
          <Image
            src={"/images/homepage/about/hero.png"}
            alt="DigiNote Hero"
            width={1000}
            height={1000}
            className="object-cover"
          />
        </div>

        {/* Content Right */}
        <div className="w-full text-left max-lg:flex max-lg:flex-col max-lg:justify-center max-lg:items-center">
          <h2 className="text-3xl max-lg:text-center sm:text-4xl font-extrabold text-gray-900 mb-6 flex justify-center md:justify-start items-center gap-2">
            Study Smarter with DigiNote: Best AI Study Tools for Students
          </h2>
         
          <ul className="text-gray-700 text-base space-y-3 mt-6">
            <li className="flex items-start space-x-3">
              <FileText
                className="text-blue-300 mt-1 flex-shrink-0 bg-blue-500/10 p-2 rounded-lg"
                size={50}
              />
              <div>
                <h1 className="font-bold text-lg">
                  AI-Generated Notes for any topic or chapter:
                </h1>
                Instantly get concise, well-structured notes tailored to your
                syllabus, saving you time and effort in manual summarization.
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle
                className="text-green-300 mt-1 flex-shrink-0 bg-green-500/10 p-2 rounded-lg"
                size={50}
              />
              <div>
                <h1 className="font-bold text-lg">
                  MCQ Practice Tests to test your understanding:
                </h1>
                Reinforce your learning with topic-wise multiple-choice
                questions designed to help you assess and strengthen your
                knowledge.
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <Youtube
                className="text-red-300 mt-1 flex-shrink-0 bg-red-500/10 p-2 rounded-lg"
                size={50}
              />
              <div>
                <h1 className="font-bold text-lg">
                  Curated YouTube Videos for visual learning:
                </h1>
                Access handpicked educational videos from trusted channels that
                explain complex topics in a simple, engaging way.
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <ClipboardList
                className="text-purple-300 mt-1 flex-shrink-0 bg-purple-500/10 p-2 rounded-lg"
                size={50}
              />
              <div>
                <h1 className="font-bold text-lg">
                  Manual or AI Unit Test Builder to prepare for exams:
                </h1>
                Create custom unit tests using either manual selection or
                AI-generated questions to simulate real exam conditions and
                boost your readiness.
              </div>
            </li>
          </ul> 
             {/* CTA Button */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mt-10 flex  "
        >
          <Link href="/features" passHref>
            <button
              className="group flex items-center relative justify-center gap-2 p-1 pl-4 text-gray-900 hover:text-black 
    bg-gradient-to-r from-green-500/30 to-blue-500/30 
    hover:from-green-500/50 hover:to-blue-500/50 
    font-semibold text-base rounded-full border border-blue-500/40
    shadow-md hover:shadow-xl hover:scale-105 hover:border-blue-800 
    transition-all duration-300 
    focus:outline-none focus:ring-4 focus:ring-blue-300/50 active:scale-95"
              role="button"
              aria-label="Create a new digital notebook"
            >
              Know More Features
              {/* Pencil Icon with group-hover animation */}
              <div
                className="bg-purple-500 rounded-full text-gray-200 p-2 transform transition-transform duration-300 
      group-hover:rotate-45 "
              >
                <FaPencil size={28} />
              </div>
            </button>
          </Link>
        </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
