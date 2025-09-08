import React from "react";

export default function TopicInput({
  chapterName,
  showTopicInput,
  setShowTopicInput,
  topicInput,
  setTopicInput,
  handleAddTopicToChapter,
}) {
  return (
    <>
      {showTopicInput === chapterName ? (
        <div className="mt-3">
          <label className="block text-sm font-medium mb-2">Topic Name</label>
          <div className="flex gap-2">
            <input
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Enter topic name"
              className="flex-1 px-3 py-2 bg-slate-500 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
              onKeyPress={(e) => e.key === "Enter" && handleAddTopicToChapter(chapterName)}
              autoFocus
            />
            <button
              onClick={() => handleAddTopicToChapter(chapterName)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors"
            >
              ✓
            </button>
            <button
              onClick={() => {
                setTopicInput("");
                setShowTopicInput("");
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors"
            >
              ✗
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowTopicInput(chapterName)}
          className="w-full mt-3 flex items-center justify-center gap-2 bg-green-600/20 hover:bg-green-600/40 text-green-300 py-2 px-4 rounded-lg transition-colors text-sm"
        >
          <span>+</span>
          Add Topic
        </button>
      )}
    </>
  );
}