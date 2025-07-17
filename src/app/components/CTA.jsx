import React from 'react'
import {motion} from 'framer-motion'

export default function CTA() {
  return (
    <div>
      {/* CTA Section */}
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  whileInView={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  viewport={{ once: true }}
  className="relative z-10 mt-24 max-w-4xl mx-auto text-center border border-yellow-300 shadow-xl rounded-2xl px-8 py-12"
>
  <h2 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-4">
    🔥 Ready to boost your grades with AI?
  </h2>
  <p className="text-lg text-gray-800 mb-8">
    👉 Try <span className="font-semibold text-blue-600">DigiNote</span> free — no signup needed!
  </p>
  <a
    href="/workspace/create"
    className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-full shadow-md transition duration-300"
  >
    🚀 Get Started Now
  </a>
</motion.div>

    </div>
  )
}
