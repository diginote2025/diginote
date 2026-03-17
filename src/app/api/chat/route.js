export async function POST(req) {
  try {
    const { messages } = await req.json();

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: messages,
        }),
      }
    );

    const data = await res.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return Response.json({ text });
  } catch (error) {
    return Response.json({ text: "Server Error" });
  }
}