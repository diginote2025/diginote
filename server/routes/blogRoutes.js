import express from "express";
import multer from "multer";
import {
  sendBlog,
  takeData,
  deleteData,
  updateData,
  getOneBlog,
  addComment,
  toggleLike,
  incrementView,
  filterBlogs,
  updateBlogWithImage,
  takeImage,
  updateAuthorImage,
  getAuthorImage,
} from "../controllers/blogControllers.js";

const router = express.Router();

// Multer storage (memory storage for MongoDB)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Create blog with optional blog image + author image
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "authorImage", maxCount: 1 },
  ]),
  sendBlog
);

// Other routes
router.get("/", takeData);
router.get("/:id", getOneBlog);
router.delete("/:id", deleteData);
router.put("/:id", updateData);

// Update blog with optional image
router.put(
  "/update-with-image/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "authorImage", maxCount: 1 },
  ]),
  updateBlogWithImage
);

// Get blog image
router.get("/image/:id", takeImage);

// Author image routes
router.put(
  "/author-image/:id",
  upload.single("authorImage"),
  updateAuthorImage
);
router.get("/author-image/:id", getAuthorImage);

// Comments & Likes
router.post("/:id/comment", addComment);
router.post("/:id/like", toggleLike);

// Views
router.post("/:id/view", incrementView);

// Filter
router.get("/filter/search", filterBlogs);

export default router;
