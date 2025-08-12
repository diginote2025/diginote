"use client";
import React from "react";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="w-full mt-14 py-16 px-4 md:px-10 lg:px-20">
      <div
        className="max-w-7xl relative mx-auto bg-blue-200 rounded-xl flex flex-col md:flex-row items-end 
      justify-between gap-10"
      >
        {/* Left Content */}
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="relative z-10 max-lg:flex max-lg:justify-center max-lg:items-center max-lg:flex-col">
            <span className="inline-block bg-white/90 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              AI-Powered
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
              Don’t just study <br />
              <span className="text-blue-600">
                study smarter.
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 max-w-2xl text-gray-700 max-xl:text-center">
              With AI-powered notes, targeted MCQs, curated videos, and custom
              test builders, you have everything you need to master your
              subjects faster and with confidence.
            </p>
            <div className="mt-10">
              <a
                href="/workspace" // <-- Change this to your desired link
                className="inline-block rounded-lg bg-yellow-400 px-8 py-3.5 text-base font-bold text-black shadow-sm transition-transform hover:scale-105 hover:bg-yellow-300 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
              >
                Generate My Notes
              </a>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <motion.div
          className="md:w-1/2 w-full flex justify-center"
          // initial={{ x: -100, opacity: 0 }}
          // whileInView={{ x: 0, opacity: 1 }}
          // transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          // viewport={{ once: true }}
        >
          <img
            src={"/images/homepage/CTA/contact_us.png"}
            alt="Smiling Doctor"
            className="w-[45rem] absolute max-lg:relative bottom-0 right-5"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
