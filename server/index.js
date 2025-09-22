import express from "express";
import cors from "cors";
import { connectDB } from "./db/connectDB.js";
import taskRoutes from "./routes/taskRoutes.js";
import counterRoutes from "./routes/counterRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const port = 5001;

app.use(express.json());
app.use(cors());
connectDB();

app.use("/task", taskRoutes);
app.use("/api/counter", counterRoutes);
app.use("/blog", blogRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
