"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiThumbsUp, FiEye, FiMessageSquare } from "react-icons/fi";

const API_ROOT = "https://diginote-3b4g.onrender.com/blog";
const FALLBACK_USER_ID = "demoUser123";

// Function to generate a slug from a title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
};

const RightSidePanel = ({ tags, recentBlogs }) => (
  <aside className="w-full md:w-80 space-y-4 sticky top-4 self-start">
    {/* ... (Tags section remains the same) */}
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Explore Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags && tags.length > 0 ? (
          tags.map((tag, i) => (
            <Link
              key={i}
              href={`/blogs?tag=${tag}`}
              className="bg-gray-100 text-gray-700 hover:bg-green-500 hover:text-white transition-colors duration-300 px-4 py-2 rounded-full text-sm font-medium"
            >
              {tag}
            </Link>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No tags available.</p>
        )}
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-4">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Blogs</h3>
      <ul className="space-y-4">
        {recentBlogs && recentBlogs.length > 0 ? (
          recentBlogs.map((blog, i) => (
            <li key={i}>
              <Link
                href={`/blog/${blog.slug}`} // Now using the correct slug
                className="flex items-center gap-4 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
              >
                {blog.image && (
                  <img
                    src={`${API_ROOT}/image/${blog._id}`}
                    alt={blog.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900 line-clamp-2">
                    {blog.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No recent blogs.</p>
        )}
      </ul>
    </div>
  </aside>
);

export const BlogPages = () => {
  const router = useRouter();
  const pathname = usePathname();
  const slug = pathname.split("/").pop();

  const [post, setPost] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState("");

  // You would typically get the user ID from a context or session
  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId") || FALLBACK_USER_ID
      : FALLBACK_USER_ID;

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setPost(null);
      return;
    }

    const fetchPostAndData = async () => {
      setLoading(true);
      try {
        const listRes = await fetch(`${API_ROOT}`);
        if (!listRes.ok)
          throw new Error(`Failed to fetch blog list (${listRes.status})`);
        const listJson = await listRes.json();
        const blogs = listJson.data || [];

        const blogsWithSlug = blogs.map((blog) => ({
          ...blog,
          slug: generateSlug(blog.title),
        }));

        const found = blogsWithSlug.find(
          (p) => p.slug === decodeURIComponent(slug)
        );

        if (!found) {
          setPost(null);
          setLoading(false);
          return;
        }

        const singleRes = await fetch(`${API_ROOT}/${found._id}`);
        if (!singleRes.ok)
          throw new Error(`Failed to fetch blog (${singleRes.status})`);
        const blog = await singleRes.json();
        setPost(blog);

        const sortedBlogs = blogsWithSlug.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const recent = sortedBlogs.slice(0, 5);

        setRecentBlogs(recent);

        fetch(`${API_ROOT}/${found._id}/view`, { method: "POST" })
          .then(async (r) => {
            if (r.ok) {
              const j = await r.json();
              setPost((prev) => (prev ? { ...prev, views: j.views } : prev));
            }
          })
          .catch(console.warn);
      } catch (err) {
        console.error("Error loading post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndData();
  }, [slug]);

  if (loading)
    return (
      <div className="w-full h-screen fixed z-50 flex flex-col justify-center items-center bg-white">
        <AiOutlineLoading3Quarters
          className="animate-spin text-green-500"
          size={38}
        />
      </div>
    );
  if (!post)
    return <p className="p-6 text-center text-gray-500">Post not found...</p>;

  const isLiked = Array.isArray(post.likes)
    ? post.likes.map(String).includes(String(userId))
    : false;

  const handleLike = async () => {
    if (!post || likeLoading) return;
    setLikeLoading(true);
    try {
      setPost((prev) => {
        if (!prev) return prev;
        const likes = Array.isArray(prev.likes)
          ? [...prev.likes.map(String)]
          : [];
        const has = likes.includes(String(userId));
        const newLikes = has
          ? likes.filter((l) => l !== String(userId))
          : [...likes, String(userId)];
        return { ...prev, likes: newLikes };
      });

      const res = await fetch(`${API_ROOT}/${post._id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const json = await res.json();
      if (!res.ok) {
        setPost((prev) => {
          if (!prev) return prev;
          const likes = Array.isArray(prev.likes)
            ? [...prev.likes.map(String)]
            : [];
          const has = likes.includes(String(userId));
          const reverted = has
            ? likes.filter((l) => l !== String(userId))
            : [...likes, String(userId)];
          return { ...prev, likes: reverted };
        });
        alert(json.error || "Like failed");
        return;
      }

      setPost((prev) =>
        prev ? { ...prev, likesCountFromServer: json.likes } : prev
      );
    } catch (error) {
      console.error("Like fetch error:", error);
      alert("Like failed - check console/network");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!post || commentLoading) return;
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const res = await fetch(`${API_ROOT}/${post._id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: "Guest", text: newComment }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Comment failed");
        return;
      }

      const newCommentData = json.data || {
        _id: `temp-${Date.now()}`,
        user: "Guest",
        text: newComment,
        createdAt: new Date().toISOString(),
      };
      setPost((prev) =>
        prev
          ? {
              ...prev,
              comments: [...(prev.comments || []), newCommentData],
            }
          : prev
      );
      setNewComment("");
    } catch (error) {
      console.error("Comment fetch error:", error);
      alert("Comment failed");
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div className="pt-20 flex justify-center bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-10 flex flex-col md:flex-row gap-4 max-w-7xl">
        {/* Main Content Area */}
        <main className="w-full md:flex-1 space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            {/* Use router.back() for back navigation */}
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 mb-4 text-gray-500 no-underline hover:text-green-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Back to Blogs</span>
            </button>

            <h1
              className="text-4xl font-extrabold text-gray-900 leading-tight"
              dangerouslySetInnerHTML={{ __html: post.title }}
            />

            <div className="flex items-center gap-4 mb-6 text-gray-600">
              {post.author && (
                <div className="flex items-center gap-2">
                  <img
                    src={`${API_ROOT}/author-image/${post._id}`}
                    alt={post.author || "Author"}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}
              {post.createdAt && (
                <p className="text-sm">
                  <span className="font-semibold text-gray-800">
                    {post.author || "Unknown Author"}
                  </span>
                  <div className="">
                    <span className="text-gray-400">Published:</span>{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </p>
              )}
            </div>

            {post._id && post.image && (
              <img
                src={`${API_ROOT}/image/${post._id}`}
                alt={post.title}
                onError={(e) => (e.currentTarget.style.display = "none")}
                className="w-full h-80 object-cover rounded-xl mb-6 shadow-md"
              />
            )}

            <div
              className="
    [&>h1]:text-4xl [&>h1]:font-extrabold [&>h1]:text-gray-900 [&>h1]:leading-tight [&>h1]:mt-6 [&>h1]:mb-4
    [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-gray-800 [&>h2]:mt-5 [&>h2]:mb-3
    [&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:text-gray-700 [&>h3]:mt-4 [&>h3]:mb-2
    [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:text-gray-700 [&>h4]:mt-3 [&>h4]:mb-2
    [&>h5]:text-lg [&>h5]:font-medium [&>h5]:text-gray-600 [&>h5]:mt-2 [&>h5]:mb-1
    [&>h6]:text-base [&>h6]:font-medium [&>h6]:text-gray-600 [&>h6]:mt-2 [&>h6]:mb-1

    [&>p]:mb-4 [&>p]:leading-relaxed [&>p]:text-gray-800
    [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ul]:mt-2
    [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4 [&>ol]:mt-2
    [&>li]:mb-2
    [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:my-4
    [&>code]:bg-gray-100 [&>code]:text-sm [&>code]:px-1 [&>code]:py-[2px] [&>code]:rounded
    [&>pre]:bg-gray-100 [&>pre]:p-4 [&>pre]:rounded [&>pre]:overflow-x-auto [&>pre]:my-4
    [&>br]:my-2
    [&>a]:text-blue-600 [&>a]:underline [&>a]:hover:text-blue-800
    [&>img]:my-4 [&>img]:rounded [&>img]:shadow-md [&>img]:max-w-full [&>img]:h-auto

    prose max-w-none prose-lg md:prose-xl text-gray-800 leading-relaxed
  "
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="flex items-center gap-6 mt-8 border-t border-gray-200 pt-6">
              <button
                onClick={handleLike}
                disabled={likeLoading}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-colors duration-300 ${
                  isLiked
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <FiThumbsUp />
                <span>{isLiked ? "Liked" : "Like"}</span>
                <span className="ml-1">
                  {Array.isArray(post.likes)
                    ? post.likes.length
                    : post.likesCountFromServer ?? 0}
                </span>
              </button>
              <span className="flex items-center gap-2 text-gray-600">
                <FiEye /> {post.views ?? 0}
              </span>
              <span className="flex items-center gap-2 text-gray-600">
                <FiMessageSquare /> {(post.comments || []).length}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-4">
              Comments
            </h2>

            <div className="mb-6 space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {(post.comments || []).length > 0 ? (
                post.comments.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 bg-gray-50 rounded-xl p-4 transition-transform duration-300 hover:scale-[1.01]"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                      {c.user ? c.user[0].toUpperCase() : "A"}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-semibold">
                        {c.user || "Admin"}
                      </p>
                      <p className="text-gray-700 mt-1">{c.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic">
                  Be the first to leave a comment! ✍️
                </p>
              )}
            </div>

            <div className="flex gap-4 items-center">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border border-gray-300 rounded-xl p-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow duration-300"
              />
              <button
                onClick={handleAddComment}
                disabled={commentLoading || !newComment.trim()}
                className="px-6 py-3 rounded-xl font-semibold border-none cursor-pointer bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                {commentLoading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </main>

        <RightSidePanel tags={post.tags} recentBlogs={recentBlogs} />
      </div>
    </div>
  );
};


