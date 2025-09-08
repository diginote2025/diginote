import React from "react";

export default function ChapterInput({
  showChapterInput,
  setShowChapterInput,
  chapterInput,
  setChapterInput,
  handleAddChapter,
}) {
  return (
    showChapterInput && (
      <div className="border my-6 rounded-lg p-3 mb-4">
        <label className="block text-sm font-medium mb-2">Chapter Name</label>
        <div className="flex gap-2">
          <input
            value={chapterInput}
            onChange={(e) => setChapterInput(e.target.value)}
            placeholder="Enter chapter name"
            className="flex-1 px-3 py-2 w-10 bg-slate-500 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            onKeyPress={(e) => e.key === "Enter" && handleAddChapter()}
            autoFocus
          />
          <button
            onClick={handleAddChapter}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg"
          >
            ✓
          </button>
          <button
            onClick={() => {
              setChapterInput("");
              setShowChapterInput(false);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
          >
            ✗
          </button>
        </div>
      </div>
    )
  );
}