"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  PlusCircle,
  Pencil,
  Search,
  AlertCircle,
  Newspaper,
  ThumbsUp,
  Eye,
  Loader2,
} from "lucide-react";

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
  <div className="flex flex-col sm:flex-row gap-6 bg-white rounded-3xl p-6 shadow-xl animate-pulse">
    <div className="w-full sm:w-48 h-36 bg-gray-200 rounded-2xl flex-shrink-0"></div>
    <div className="flex-1 space-y-3">
      <div className="h-6 bg-gray-200 rounded-xl w-4/5"></div>
      <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
      <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
);

// --- Confirmation Modal ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-white p-8 rounded-3xl max-w-sm w-11/12 text-center shadow-2xl animate-scaleIn">
        <h3 className="text-2xl font-bold mb-4 text-gray-900">{title}</h3>
        <p className="text-base text-gray-700 mb-6 leading-relaxed">
          {children}
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full text-base font-semibold transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 rounded-full text-base font-semibold transition-colors bg-red-600 text-white hover:bg-red-700"
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
    <div className="group bg-white rounded-3xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
      <div  className="block">
        <div className="flex flex-col sm:flex-row gap-6 items-start p-6">
          {post.image && (
            <img
              src={`https://diginote-3b4g.onrender.com/blog/image/${post._id}`}
              alt={post.title}
              className="w-full sm:w-48 h-36 object-cover rounded-2xl flex-shrink-0 transition-transform duration-300"
              onError={(e) => (e.target.style.display = "none")}
            />
          )}
          <div className="flex-1 py-2">
            <Link href={`/blog/${slug}`} className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
              {post.title}
            </Link>
            <div
              className="text-sm text-gray-600 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: excerpt }}
            />
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-700">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleLike(post._id);
                }}
                className={`flex items-center gap-1 p-2 rounded-full font-medium transition-all duration-300 ${
                  isLiked ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-700"
                } hover:bg-blue-200 hover:text-blue-800`}
              >
                <ThumbsUp size={16} />
                {post.likes?.length || 0}
              </button>
              <span className="flex items-center gap-1 text-gray-500">
                <Eye size={16} /> {post.views || 0} Views
              </span>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(post._id);
                  }}
                  className="p-2 rounded-full transition-colors bg-blue-100 text-blue-800 hover:bg-blue-200"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(post._id);
                  }}
                  className="p-2 rounded-full transition-colors bg-red-100 text-red-700 hover:bg-red-200"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Self-contained Dashboard Component with authentication logic ---
const Dashboard = () => {
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/admin");
          return;
        }
        try {
          const res = await fetch(
            "https://diginote-3b4g.onrender.com/api/auth/dashboard",
            {
              headers: { Authorization: token },
            }
          );
          if (!res.ok) throw new Error("Authentication failed");
          const data = await res.json();
          setMessage(data.message);
        } catch {
          localStorage.removeItem("token");
          router.push("/admin");
        }
      }
    };
    fetchDashboard();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin");
  };

  return (
    <div className="flex flex-col items-end justify-center">
      <button
        onClick={handleLogout}
        className="px-6 py-3 rounded-full font-semibold transition-colors bg-red-600 text-white hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

// --- Main Component ---
const AllBlogs = ({ currentUserId }) => {
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const router = useRouter();

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://diginote-3b4g.onrender.com/blog");
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
      await fetch(`https://diginote-3b4g.onrender.com/blog/${blogToDelete}`, {
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
      const res = await fetch(
        `https://diginote-3b4g.onrender.com/blog/${blogId}/like`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId }),
        }
      );
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
      <div className="bg-gray-100 min-h-screen font-sans">
        <div className="max-w-[1000px] mx-auto p-8">
          <header className="text-center my-12">
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Blog Dashboard
            </h1>
            <p className="text-xl text-gray-600 mt-4">
              Manage your articles with ease.
            </p>
          </header>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative flex-1 w-full max-w-xl">
              <Search
                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search blogs by title..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full py-3 pl-12 pr-6 border border-gray-300 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 shadow-sm text-base"
              />
            </div>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 py-3 px-6 rounded-full border-none text-base font-semibold transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-md"
            >
              <PlusCircle size={20} />
              <span>Add New Blog</span>
            </Link>
          </div>
          <div className="space-y-6">
            {loading ? (
              <div className="grid gap-6 md:grid-cols-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center p-12 text-gray-600 rounded-3xl bg-white shadow-xl flex flex-col items-center justify-center">
                <AlertCircle size={60} className="mx-auto text-red-500 mb-4" />
                <h3 className="text-2xl font-bold mt-4 text-gray-900">
                  An Error Occurred
                </h3>
                <p className="mt-2 text-lg text-gray-700">{error}</p>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center p-12 text-gray-600 rounded-3xl bg-white shadow-xl flex flex-col items-center justify-center">
                <Newspaper size={60} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-2xl font-bold mt-4 text-gray-900">
                  No Blog Posts Found
                </h3>
                <p className="mt-2 text-lg text-gray-700">
                  {input
                    ? "Try adjusting your search query."
                    : "Be the first to create one and share your story!"}
                </p>
              </div>
            ) : (
              <div className="grid gap-y-6 md:grid-cols-1">
                {filteredBlogs.map((post) => (
                  <BlogCard
                    key={post._id}
                    post={post}
                    currentUserId={currentUserId}
                    onEdit={(id) => router.push(`/blog/dashboard/edit/${id}`)}
                    onDelete={handleDeleteClick}
                    onToggleLike={handleToggleLike}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="my-12">
            <Dashboard />
          </div>
        </div>
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

export default AllBlogs;