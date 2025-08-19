import mongoose from "mongoose";

const ChapterSchema = new mongoose.Schema({
  name: String,
  topics: String,
});

export default mongoose.models.Chapter ||
  mongoose.model("Chapter", ChapterSchema);