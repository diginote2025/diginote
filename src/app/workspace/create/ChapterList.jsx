import React from "react";
import ChapterInput from "./ChapterInput";
import TopicInput from "./TopicInput";
import { setSavedResponses } from "@/redux/studyToolSlice";

export default function ChapterList({
  chapterTopics,
  setChapterTopics,
  selected,
  setSelected,
  editing,
  setEditing,
  expandedChapters,
  setExpandedChapters,
  showChapterInput,
  setShowChapterInput,
  chapterInput,
  setChapterInput,
  showTopicInput,
  setShowTopicInput,
  topicInput,
  setTopicInput,
  savedResponses,
  dispatch,
  selectedSubject,
  isDark,
}) {
  const handleAddChapter = () => {
    if (!chapterInput.trim()) return;

    setChapterTopics((prev) => ({
      ...prev,
      [chapterInput]: [],
    }));
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterInput]: true,
    }));
    setShowTopicInput(chapterInput);
    setChapterInput("");
    setShowChapterInput(false);
  };

  const handleAddTopicToChapter = (chapterName) => {
    if (!topicInput.trim()) return;

    setChapterTopics((prev) => {
      const curr = { ...prev };
      if (!curr[chapterName]) curr[chapterName] = [];
      if (!curr[chapterName].includes(topicInput)) curr[chapterName].push(topicInput);
      return curr;
    });

    setTopicInput("");
    setShowTopicInput("");
  };

  const toggleChapter = (chapterName) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterName]: !prev[chapterName],
    }));
  };

  const handleDeleteTopic = (chapName, topicName) => {
    if (!confirm(`Are you sure you want to delete topic "${topicName}" from chapter "${chapName}"?`)) return;

    setChapterTopics((prev) => {
      const curr = { ...prev };
      curr[chapName] = curr[chapName].filter((t) => t !== topicName);
      if (curr[chapName].length === 0) delete curr[chapName];
      return curr;
    });

    const updated = JSON.parse(JSON.stringify(savedResponses));
    if (updated[chapName]) {
      delete updated[chapName][topicName];
      if (Object.keys(updated[chapName]).length === 0) delete updated[chapName];
    }

    dispatch(setSavedResponses(updated));

    const allResponses = JSON.parse(localStorage.getItem("savedResponses") || "{}");
    allResponses[selectedSubject] = updated;
    localStorage.setItem("savedResponses", JSON.stringify(allResponses));
    localStorage.setItem("study_tool_responses", JSON.stringify(updated));

    if (selected.chapter === chapName && selected.topic === topicName) {
      setSelected({ chapter: "", topic: "" });
    }
  };

  const startEdit = (chap, top) => {
    setEditing({ chapter: chap, topic: top, value: top });
  };

  const saveEdit = () => {
    const { chapter: chap, topic: oldT, value: newT } = editing;
    if (!newT.trim()) return;

    setChapterTopics((prev) => {
      const curr = { ...prev };
      curr[chap] = curr[chap].map((t) => (t === oldT ? newT : t));
      return curr;
    });

    const updated = JSON.parse(JSON.stringify(savedResponses));
    if (updated[chap] && updated[chap][oldT]) {
      updated[chap][newT] = updated[chap][oldT];
      delete updated[chap][oldT];
      dispatch(setSavedResponses(updated));

      const allResponses = JSON.parse(localStorage.getItem("savedResponses") || "{}");
      allResponses[selectedSubject] = updated;
      localStorage.setItem("savedResponses", JSON.stringify(allResponses));
      localStorage.setItem("study_tool_responses", JSON.stringify(updated));
    }

    if (selected.chapter === chap && selected.topic === oldT) {
      setSelected({ chapter: chap, topic: newT });
    }
    setEditing({ chapter: "", topic: "", value: "" });
  };

  return (
    <>
      {!showChapterInput && Object.keys(chapterTopics).length === 0 && (
        <button
          onClick={() => setShowChapterInput(true)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] mb-4"
        >
          <span className="text-lg">+</span>
          Add Chapter Manually
        </button>
      )}
      <div className="space-y-4">
        {Object.entries(chapterTopics).map(([chapterName, topics]) => (
          <div key={chapterName} className="border rounded-lg border-gray-600">
            <div
              onClick={() => toggleChapter(chapterName)}
              className="flex items-center justify-between p-3 cursor-pointer rounded-t-lg"
            >
              <h3 className="font-semibold text-blue-600">{chapterName}</h3>
              <span className="text-gray-500">{expandedChapters[chapterName] ? "▼" : "▶"}</span>
            </div>
            {expandedChapters[chapterName] && (
              <div className="border-t border-gray-600 px-3 pb-3">
                <div className="space-y-1 mt-2">
                  {topics.map((topicName) => (
                    <div
                      key={topicName}
                      className={`group flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                        selected.chapter === chapterName && selected.topic === topicName ? "bg-blue-900/50" : ""
                      } ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
                    >
                      {editing.chapter === chapterName && editing.topic === topicName ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            value={editing.value}
                            onChange={(e) => setEditing((prev) => ({ ...prev, value: e.target.value }))}
                            className="flex-1 px-1 py-1 w-10 rounded text-sm outline-none bg-slate-700 border border-slate-600"
                            onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                            autoFocus
                          />
                          <button onClick={saveEdit} className="text-green-600 hover:text-green-800 text-lg">
                            ✓
                          </button>
                          <button
                            onClick={() => setEditing({ chapter: "", topic: "", value: "" })}
                            className="text-red-600 hover:text-red-800 text-lg"
                          >
                            ✗
                          </button>
                        </div>
                      ) : (
                        <>
                          <span
                            onClick={() => setSelected({ chapter: chapterName, topic: topicName })}
                            className="flex-1 text-sm"
                          >
                            {topicName}
                          </span>
                          <div className="flex gap-1 transition-opacity">
                            <button
                              onClick={() => startEdit(chapterName, topicName)}
                              className="text-blue-500 hover:text-blue-400 text-xs"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteTopic(chapterName, topicName)}
                              className="text-red-500 hover:text-red-400 text-xs"
                            >
                              🗑️
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <TopicInput
                  chapterName={chapterName}
                  showTopicInput={showTopicInput}
                  setShowTopicInput={setShowTopicInput}
                  topicInput={topicInput}
                  setTopicInput={setTopicInput}
                  handleAddTopicToChapter={handleAddTopicToChapter}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <ChapterInput
        showChapterInput={showChapterInput}
        setShowChapterInput={setShowChapterInput}
        chapterInput={chapterInput}
        setChapterInput={setChapterInput}
        handleAddChapter={handleAddChapter}
      />
      {Object.keys(chapterTopics).length > 0 && !showChapterInput && !showTopicInput && (
        <button
          onClick={() => setShowChapterInput(true)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-4"
        >
          <span className="text-lg">+</span>
          Add Another Chapter
        </button>
      )}
    </>
  );
}