import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  PlusCircle,
  Pencil,
  Search,
  AlertCircle,
  Newspaper,
  ThumbsUp,
} from "lucide-react";
import Dashboard from "../auth/Dashboard";
import { GrView } from "react-icons/gr";

// --- slugify helper ---
const slugify = (str = "") =>
  encodeURIComponent(
    str
      .toString()
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  );

// --- Skeleton Loading Card ---
const SkeletonCard = () => (
  <div className="flex gap-4 bg-white rounded-xl p-4 shadow-sm animate-pulse">
    <div className="w-[120px] h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
    <div className="flex-1">
      <div className="h-3 bg-gray-200 rounded-md mb-2 w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded-md mb-2 w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded-md mb-2 w-[90%]"></div>
    </div>
  </div>
);

// --- Confirmation Modal ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl max-w-sm w-11/12 text-center shadow-lg animate-scaleIn">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">{title}</h3>
        <div className="text-base text-gray-700 mb-6 leading-normal">
          {children}
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Blog Card Component ---
const BlogCard = ({ post, onEdit, onDelete, onToggleLike, currentUserId }) => {
  const slug = post.slug ?? slugify(post.title);
  const excerpt =
    post.content?.substring(0, 140) + (post.content?.length > 100 ? "..." : "");

  const isLiked = post.likes?.includes(currentUserId);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md transition-transform hover:scale-[1.01] hover:shadow-lg">
      <div className="flex gap-4 items-start p-2.5">
        {post.image && (
          <img
            src={`http://localhost:3000/blog/image/${post._id}`}
            alt={post.title}
            className="w-[180px] h-[140px] object-cover rounded-lg flex-shrink-0"
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
        <div className="flex-1 py-2">
          <Link to={`/blog/${slug}`}>
            <h1 className="text-xl font-semibold mb-2 text-gray-900 hover:text-blue-600 transition-colors">
              {post.title}
            </h1>
          </Link>
          <div
            className="text-sm text-gray-600"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />

          <div className="flex items-center gap-4 mt-4 text-sm text-gray-700">
            <button
              onClick={() => onToggleLike(post._id)}
              className={`flex items-center gap-1 p-2 rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all ${
                isLiked ? "text-blue-500" : ""
              }`}
            >
              <ThumbsUp size={16} />
              {post.likes?.length || 0}
            </button>
            <span className="flex items-center gap-1 text-gray-500">
              <GrView /> {post.views || 0} Views
            </span>

            <button
              onClick={() => onEdit(post._id)}
              className="icon-btn bg-blue-100 text-blue-800 hover:bg-blue-200"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => onDelete(post._id)}
              className="icon-btn bg-red-100 text-red-700 hover:bg-red-200"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export const AllBlogs = ({ currentUserId }) => {
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const navigate = useNavigate();

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/blog");
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setBlogs(data.data || data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blog posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDeleteClick = (id) => {
    setBlogToDelete(id);
    setIsModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (!blogToDelete) return;
    try {
      await fetch(`http://localhost:3000/blog/${blogToDelete}`, {
        method: "DELETE",
      });
      setBlogs(blogs.filter((b) => b._id !== blogToDelete));
    } catch (err) {
      console.error("Error deleting blog:", err);
    } finally {
      setIsModalOpen(false);
      setBlogToDelete(null);
    }
  };

  const handleToggleLike = async (blogId) => {
    try {
      const res = await fetch(`http://localhost:3000/blog/${blogId}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });
      if (!res.ok) throw new Error("Failed to toggle like");
      const updatedBlog = await res.json();

      setBlogs((prev) => prev.map((b) => (b._id === blogId ? updatedBlog : b)));
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const filteredBlogs = useMemo(
    () =>
      blogs.filter((b) => b.title?.toLowerCase().includes(input.toLowerCase())),
    [blogs, input]
  );

  return (
    <>
      <div className="max-w-[1000px] mx-auto p-8 font-sans text-gray-800">
        <br />
        <br />
        <br />
        <br />
        <br />

        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blog Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your articles with ease.</p>
        </header>

        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div className="relative flex-1 max-w-[200px]">
            <Search
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search blogs by title..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full py-3 px-10 border border-gray-300 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
            />
          </div>
          <Link
            to="/create"
            className="inline-flex items-center gap-1.5 py-3 px-6 rounded-full border-none text-sm cursor-pointer transition-all bg-blue-600 text-white hover:bg-blue-700"
          >
            <PlusCircle size={20} />
            <span>Add New Blog</span>
          </Link>
        </div>

        <div>
          {loading ? (
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-12 text-gray-600">
              <AlertCircle size={40} className="mx-auto" />
              <h3 className="text-xl mt-4 text-gray-900">An Error Occurred</h3>
              <p>{error}</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center p-12 text-gray-600">
              <Newspaper size={40} className="mx-auto" />
              <h3 className="text-xl mt-4 text-gray-900">
                No Blog Posts Found
              </h3>
              <p>
                {input
                  ? "Try adjusting your search."
                  : "Why not create the first one?"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredBlogs.map((post) => (
                <BlogCard
                  key={post._id}
                  post={post}
                  currentUserId={currentUserId}
                  onEdit={(id) => navigate(`/edit/${id}`)}
                  onDelete={handleDeleteClick}
                  onToggleLike={handleToggleLike}
                />
              ))}
            </div>
          )}
        </div>
        <br />
        <br />
        <br />
        <Dashboard />
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
      >
        Are you sure you want to delete this blog post? This action cannot be
        undone.
      </ConfirmationModal>
    </>
  );
};
