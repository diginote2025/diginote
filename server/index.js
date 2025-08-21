// Import necessary packages
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dataRouter } from "./routes/data.route.js";
import connectDB from "./db/mongodb.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3022;

app.use(cors());
app.use(express.json());

await connectDB();

app.use("/", dataRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
