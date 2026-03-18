const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyBNEBhci5WkuHXTK-0t2ua_I5wjOf0INK4", {
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