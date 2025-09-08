// "use client";

// import React from "react";
// import { motion } from "framer-motion";

// export default function TestScoresDashboard({ chapterTopics, selectedSubject, isDark }) {
//   const chapterScores = JSON.parse(localStorage.getItem("chapterScores") || "{}")[selectedSubject] || {};

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className={`border rounded-lg p-4 mb-4 ${isDark ? "bg-gray-800" : "bg-gray-200"}`}
//     >
//       <h3 className="text-lg font-semibold mb-3 text-center">Test Scores Dashboard</h3>
//       {Object.keys(chapterTopics).length === 0 ? (
//         <p className="text-gray-500 text-center">No chapters available.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {Object.keys(chapterTopics).map((chapter) => (
//             <div
//               key={chapter}
//               className={`p-4 rounded-lg border ${
//                 isDark ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"
//               }`}
//             >
//               <h4 className="font-semibold text-blue-600">{chapter}</h4>
//               {chapterScores[chapter] ? (
//                 <>
//                   <p className="text-sm">
//                     Score: {chapterScores[chapter].score} / {chapterScores[chapter].total}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     Last Taken: {new Date(chapterScores[chapter].timestamp).toLocaleString()}
//                   </p>
//                 </>
//               ) : (
//                 <p className="text-sm text-gray-500">No test taken yet.</p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </motion.div>
//   );
// }