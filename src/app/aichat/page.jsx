"use client";

import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // 1. Prepare the user message
    const userMessage = { role: "user", parts: [{ text: input }] };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // 2. Direct call to Google Gemini API
      // Note: In a real app, ensure process.env.NEXT_PUBLIC_GEMINI_API_KEY is defined
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`;

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: newMessages, // Sends the whole history for context
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to get response");
      }

      // 3. Extract the text from Gemini's specific response structure
      const aiText = data.candidates[0].content.parts[0].text;

      const botMessage = {
        role: "model",
        parts: [{ text: aiText }],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      // Optional: Add an error message to the chat UI
      setMessages((prev) => [...prev, { role: "model", parts: [{ text: "Error: " + error.message }] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-screen flex flex-col p-4">
      <h1 className="text-xl font-bold mb-4">AI Chat (Frontend Only)</h1>

      <div className="flex-1 overflow-y-auto space-y-3 border p-3 rounded">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-10">Start a conversation...</p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded max-w-[80%] ${
              msg.role === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.parts[0].text}
          </div>
        ))}
        {loading && <div className="text-gray-500 text-sm animate-pulse">Gemini is thinking...</div>}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2 mt-3">
        <input
          className="border p-2 flex-1 rounded text-black"
          placeholder="Type message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 rounded disabled:bg-blue-300"
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}