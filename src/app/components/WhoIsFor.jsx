import React from 'react'
import { motion } from "framer-motion";

export default function WhoIsFor() {
  return (
    <div>
      {/* Who is DigiNote For Section */}
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
  viewport={{ once: true }}
  className="relative z-10 mt-20 max-w-4xl mx-auto text-center"
>
  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
    Who is DigiNote for?
  </h2>
  <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 text-gray-700">
    <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold mb-2">📚 Students</h3>
      <p>From Class 6 to 12 and university – prepare notes, MCQs & tests efficiently.</p>
    </div>
    <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold mb-2">👩‍🏫 Teachers</h3>
      <p>Create notes and tests faster. Focus on teaching, not content prep.</p>
    </div>
    <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold mb-2">📖 Self-Learners</h3>
      <p>Learn any topic with AI-generated resources and chapter videos.</p>
    </div>
  </div>
</motion.div>

    </div>
  )
}
