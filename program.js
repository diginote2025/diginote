const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=", {
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