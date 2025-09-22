import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String },

    image: {
      data: Buffer,
      contentType: String,
    },

    tags: [{ type: String, trim: true, lowercase: true, default: [] }],

    // Change author to String if you don’t have User auth yet
    author: {
      type: String,
      default: "Anonymous",
    },

    authorImage: {
      data: Buffer,
      contentType: String,
    },

    // Change likes to String
    likes: [{ type: String, default: [] }],

    views: { type: Number, default: 0 },

    comments: [
      {
        user: { type: String, default: "Anonymous" }, // string instead of ObjectId
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Blog = mongoose.model("blogs", blogSchema);

export default Blog;
