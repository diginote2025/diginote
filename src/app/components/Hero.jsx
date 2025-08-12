import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus } from "lucide-react";
import Image from "next/image";
import { FaPencil } from "react-icons/fa6";
import { Merriweather } from 'next/font/google';

const MerriweatherFont = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'], // Add more weights if needed
  style: ['normal', 'italic'],
  variable: '--font-noto-serif',
  display: 'swap',
});

export default function Hero() {
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
    <section className="relative max-lg:py-24 lg:pt-[2rem] flex justify-center items-center overflow-hidden bg-gradient-to-b from-white via-blue-50 to-white">
      {/* Background Image */}
      <Image
        src="/images/homepage/hero/background-image-for-diginote-hero-section.png"
        alt="Abstract background with educational elements"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover opacity-40 max-lg:opacity-100 blur-2xl scale-105"
        priority
      />

      {/* Content Container */}
      <div className="relative z-10 px-4 py-12 md:py-24 text-center max-w-[50rem] mx-auto">
        {/* Headline */}
        <motion.h1
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className={`text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-snug
            ${MerriweatherFont.className}`}
        >
          Study Smarter with <span className="text-blue-600">DigiNote</span>{" "}
          Your <span className="text-green-500">AI-Powered Notes</span> & Test
          Companion
        </motion.h1>

        {/* Subtext */}
        <motion.p
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mt-6 text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
        >
          Instantly generate chapter-wise notes, practice MCQs, watch curated
          YouTube videos, and take custom unit tests – all in one place.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mt-10 flex justify-center  "
        >
          <Link href="/workspace/create" passHref>
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
              Create Digital Notebook
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
    </section>
  );
}
