import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export default function About() {
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
        className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12"
      >
        {/* Image Left */}
        <div className="flex-shrink-0 w-full md:w-1/2">
          <Image
            src={"/images/homepage/hero.png"}
            alt="DigiNote Hero"
            width={1000}
            height={1000}
            className="w-full h-auto"
          />
        </div>

        {/* Content Right */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 flex justify-center md:justify-start items-center gap-2">
            <Sparkles className="text-blue-500 w-6 h-6" />
            Why Use DigiNote?
          </h2>
          <p className="text-gray-700 text-lg mb-4">
            DigiNote is your all-in-one AI-powered study assistant. Whether you're preparing for exams or reviewing a topic, DigiNote helps you study smarter with features designed specifically for students.
          </p>
          <ul className="text-gray-700 text-base space-y-3 mt-6">
            <li>✅ AI-Generated Notes for any topic or chapter</li>
            <li>✅ MCQ Practice Tests to test your understanding</li>
            <li>✅ Curated YouTube Videos for visual learning</li>
            <li>✅ Manual or AI Unit Test Builder to prepare for exams</li>
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
