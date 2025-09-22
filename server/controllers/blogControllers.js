// backend/controllers/blogController.js
import Blog from "../models/blogSchema.js";

import { Types } from "mongoose"; // Import for ObjectId validation



// Create a new blog (without image)
export const sendData = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }
    const modelData = new Blog({ title, content, category });
    await modelData.save();
    res.status(201).json({ message: "Blog created successfully", data: modelData });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ error: "Failed to create blog", details: error.message });
  }
};

// Fetch all blogs
export const takeData = async (req, res) => {
  try {
    const modelData = await Blog.find({});
    res.status(200).json({
      message: "Blogs fetched successfully",
      data: modelData,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Failed to fetch blogs", details: error.message });
  }
};

// Delete a blog
export const deleteData = async (req, res) => {
  try {
    const { id } = req.params;
    const modelData = await Blog.findByIdAndDelete(id);
    if (!modelData) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json({
      message: "Blog deleted successfully",
      data: modelData,
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ error: "Failed to delete blog", details: error.message });
  }
};

// Update a blog (without image)
export const updateData = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const { id } = req.params;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }
    const modelData = await Blog.findByIdAndUpdate(
      id,
      { title, content, category },
      { new: true }
    );
    if (!modelData) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json({
      message: "Blog updated successfully",
      data: modelData,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ error: "Failed to update blog", details: error.message });
  }
};

// Fetch a single blog
// Example in getOneBlog
export const getOneBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name") // <-- populate author with name only
      .lean();

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// Create a blog with an image
// Create a blog with images
export const sendBlog = async (req, res) => {
  try {
    const { title, content, category, author, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const blogImage = req.files?.image?.[0];
    const authorImage = req.files?.authorImage?.[0];

    const newBlog = new Blog({
      title,
      content,
      category,
      author,
      tags: Array.isArray(tags) ? tags : tags ? [tags] : [], // handle array or single
      image: blogImage
        ? { data: blogImage.buffer, contentType: blogImage.mimetype }
        : undefined,
      authorImage: authorImage
        ? { data: authorImage.buffer, contentType: authorImage.mimetype }
        : undefined,
    });

    await newBlog.save();
    res
      .status(201)
      .json({ message: "Blog created successfully", data: newBlog });
  } catch (error) {
    console.error("Error saving blog:", error);
    res.status(500).json({ error: "Failed to create blog", details: error.message });
  }
};


// Fetch a blog's image
export const takeImage = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog || !blog.image) {
      return res.status(404).json({ error: "Image not found" });
    }
    res.set("Content-Type", blog.image.contentType);
    res.send(blog.image.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Failed to fetch image", details: error.message });
  }
};

// Update a blog with an optional image
export const updateBlogWithImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, author, tags } = req.body;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid blog ID" });
    }

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    // Debug incoming data
    console.log("Received data:", { title, content, category, author, tags, files: req.files });

    // Find the blog
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Update fields if provided
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.category = category || blog.category;
    blog.author = author || blog.author || "Anonymous";
    blog.tags = tags
      ? Array.isArray(tags)
        ? tags
        : tags.split(",").map((tag) => tag.trim()).filter((tag) => tag)
      : blog.tags;

    // Handle blog image upload
    if (req.files?.image?.[0]) {
      blog.image = {
        data: req.files.image[0].buffer,
        contentType: req.files.image[0].mimetype,
      };
      console.log("New blog image uploaded:", req.files.image[0].originalname);
    }

    // Handle author image upload
    if (req.files?.authorImage?.[0]) {
      blog.authorImage = {
        data: req.files.authorImage[0].buffer,
        contentType: req.files.authorImage[0].mimetype,
      };
      console.log("New author image uploaded:", req.files.authorImage[0].originalname);
    }

    // Save the updated blog
    const updatedBlog = await blog.save();
    console.log("Updated blog:", updatedBlog);

    res.status(200).json({
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ error: "Failed to update blog", details: error.message });
  }
};


// ✅ Add comment to a blog
export const addComment = async (req, res) => {
  try {
    const { id } = req.params; // blog id
    const { user, text } = req.body;
    if (!text) return res.status(400).json({ error: "Comment text is required" });

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    blog.comments.push({ user, text });
    await blog.save();

    res.status(200).json({ message: "Comment added successfully", data: blog.comments });
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment", details: error.message });
  }
};

// ✅ Like / Unlike a blog
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params; // blog id
    const { userId } = req.body; // logged in user id

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const index = blog.likes.indexOf(userId);
    if (index === -1) {
      blog.likes.push(userId);
      await blog.save();
      return res.status(200).json({ message: "Blog liked", likes: blog.likes.length });
    } else {
      blog.likes.splice(index, 1);
      await blog.save();
      return res.status(200).json({ message: "Blog unliked", likes: blog.likes.length });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle like", details: error.message });
  }
};

// ✅ Increment view count
export const incrementView = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    res.status(200).json({ message: "View count updated", views: blog.views });
  } catch (error) {
    res.status(500).json({ error: "Failed to update views", details: error.message });
  }
};

// ✅ Filter blogs by tag or category
export const filterBlogs = async (req, res) => {
  try {
    const { tag, category } = req.query;
    let filter = {};
    if (tag) filter.tags = tag;
    if (category) filter.category = category;

    const blogs = await Blog.find(filter);
    res.status(200).json({ message: "Blogs fetched", data: blogs });
  } catch (error) {
    res.status(500).json({ error: "Failed to filter blogs", details: error.message });
  }
};

// ✅ Upload/Update author image
export const updateAuthorImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    blog.authorImage = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    await blog.save();
    res.status(200).json({ message: "Author image updated", data: blog });
  } catch (error) {
    res.status(500).json({ error: "Failed to update author image", details: error.message });
  }
};

// ✅ Fetch author image
export const getAuthorImage = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog || !blog.authorImage) {
      return res.status(404).json({ error: "Author image not found" });
    }

    res.set("Content-Type", blog.authorImage.contentType);
    res.send(blog.authorImage.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch author image", details: error.message });
  }
};

