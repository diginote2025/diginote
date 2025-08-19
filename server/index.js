import express from "express";
const app = express();
const port = 3022;

app.get("/diginote/test", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}/diginote/test`);
});
