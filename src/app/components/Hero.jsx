import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus } from "lucide-react";

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
    <section className="flex justify-center items-center bg-white">
      {/* Hero Section */}
      <div
        className=" py-16 md:py-24 
       flex items-center justify-center max-w-[1200px] max-lg:flex-col-reverse text-center"
      >
        <div className="flex justify-center items-center flex-col max-lg:items-center">
          <motion.h1
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-5xl max-xl:text-3xl font-thin text-gray-900 mb-4 md:mb-6 leading-tight"
          >
            Study Smarter with DigiNote <br /> Your AI-Powered Notes & Test
            Companion
          </motion.h1>
          <motion.p
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto"
          >
            Instantly generate chapter-wise notes, practice MCQs, watch curated
            YouTube videos, and take custom unit tests – all in one place.
          </motion.p>
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
          >
            <Link
              href={"/workspace/create"}
              className="px-6  py-3 bg-blue-600 text-white rounded-lg text-base font-medium shadow hover:bg-blue-700 transition"
            >
              <button className="flex justify-center items-center gap-1">
                <Plus /> Make Digital Notebook{" "}
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
