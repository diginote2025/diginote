import express from "express";
import cors from "cors"
const app = express();
const port = 3022;

app.use(cors())

app.get("/diginote/test", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}/diginote/test`);
});
