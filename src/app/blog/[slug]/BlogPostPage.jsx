"use client";

import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";

export default function BlogPostPage({ post }) {
  const [progress, setProgress] = useState(0);
  const [toc, setToc] = useState([]);
  const contentRef = useRef(null);

  // Generate Table of Contents
  useEffect(() => {
    if (!post?.content) return;
    const el = contentRef.current;
    if (!el) return;
    const headings = el.querySelectorAll("h2, h3");
    const items = Array.from(headings).map((h, i) => {
      if (!h.id) {
        h.id = `heading-${i}-${h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      }
      return { id: h.id, text: h.textContent, tag: h.tagName };
    });
    setToc(items);
  }, [post?.content]);

  // Reading progress
  useEffect(() => {
    const onScroll = () => {
      const el = contentRef.current;
      if (!el) return setProgress(0);
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return setProgress(100);
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      setProgress(Math.round((scrolled / total) * 100));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      navigator.share({ title: post.title, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      alert("Link copied to clipboard");
    }
  };

  return (
    <>
      <Head>
        <title>{post.title} — My Blog</title>
        <meta name="description" content={`${post.readTime} — ${post.title}`} />
      </Head>

      {/* Reading Progress */}
      <div className="fixed left-0 top-0 h-1 w-full z-50 bg-transparent">
        <div
          className="h-1 transition-all duration-150"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg,#4f46e5,#06b6d4)",
          }}
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Header */}
          <header className="lg:col-span-2">
            {post.cover && (
              <img
                src={post.cover}
                alt="cover"
                className="w-full rounded-xl object-cover max-h-72 mb-6"
              />
            )}
            {post.author && (
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium">
                    {post.author.name}{" "}
                    <span className="text-gray-500">• {post.author.role}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString()} • {post.readTime}
                  </p>
                </div>
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
              {post.title}
            </h1>
            {post.tags?.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap mb-6">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Share
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Print
              </button>
            </div>
          </header>

          {/* Sidebar */}
          <aside className="hidden lg:block sticky top-24 h-[calc(100vh-6rem)] overflow-auto p-4 rounded-xl border bg-white">
            <nav aria-label="Table of contents">
              <h3 className="text-sm font-semibold mb-2">On this page</h3>
              <ul className="space-y-2 text-sm">
                {toc.length === 0 && (
                  <li className="text-gray-500">No sections</li>
                )}
                {toc.map((item) => (
                  <li
                    key={item.id}
                    className={item.tag === "H2" ? "pl-0" : "pl-4"}
                  >
                    <a
                      href={`#${item.id}`}
                      className="hover:underline truncate block"
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .getElementById(item.id)
                          ?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <section className="lg:col-span-2">
            <div ref={contentRef} className="prose prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: post.content || "<p>No content provided.</p>",
                }}
              />
            </div>

            {/* Author Card */}
            {post.author && (
              <div className="mt-10 p-6 border rounded-lg flex items-center gap-4">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{post.author.name}</p>
                  <p className="text-sm text-gray-600">{post.author.role}</p>
                  <div className="mt-3">
                    <a
                      className="inline-block px-4 py-2 rounded bg-indigo-600 text-white"
                      href="#"
                    >
                      Follow
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Comments Placeholder */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Comments</h3>
              <div className="p-4 border rounded">
                <p className="text-sm text-gray-500">
                  Comments are powered by your commenting system — placeholder here.
                </p>
              </div>
            </div>
          </section>
        </article>
      </main>

      <style jsx>{`
        .prose img {
          border-radius: 0.5rem;
        }
        .prose a {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}
