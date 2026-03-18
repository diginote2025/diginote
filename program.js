const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    contents: [
      {
        parts: [{ text: "Write a short motivational quote." }],
      },
    ],
  }),
});

const data = await res.json();
console.log(data);