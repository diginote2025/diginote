import React from 'react'
import {motion} from "framer-motion"

export default function Features() {
  return (
    <div>
      {/* Section 3: Key Features */}
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
  viewport={{ once: true }}
  className="relative z-10 mt-20 max-w-6xl mx-auto text-center"
>
  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
    🟩 Key Features of DigiNote
  </h2>
  <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-2 text-left">
    {/* Feature 1 */}
    <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold mb-2">🚀 AI Notes Generator</h3>
      <p className="text-gray-700">
        Get instant, chapter-specific notes that are clear, concise, and exam-ready — powered by AI to help you grasp key concepts faster.
      </p>
    </div>

    {/* Feature 2 */}
    <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold mb-2">🎯 MCQ Practice Mode</h3>
      <p className="text-gray-700">
        Practice with automatically generated MCQs for any topic or chapter. Choose mixed mode or focused quizzes to test your understanding.
      </p>
    </div>

    {/* Feature 3 */}
    <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold mb-2">🎥 YouTube Integration</h3>
      <p className="text-gray-700">
        Access high-quality, chapter-aligned educational videos to visualize tough topics and reinforce learning.
      </p>
    </div>

    {/* Feature 4 */}
    <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold mb-2">🧠 Custom Unit Tests</h3>
      <p className="text-gray-700">
        Create your own unit tests manually or let AI generate them for you — with smart difficulty levels and answer keys.
      </p>
    </div>
  </div>
</motion.div>

    </div>
  )
}
