"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image"; // Import the Next.js Image component
import { SlCalender } from "react-icons/sl";
import { GrInstagram } from "react-icons/gr";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { BiTime } from "react-icons/bi";
import { HiOutlineArrowRight } from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Breadcrumb from "./Breadcrumb";

// Slugify helper
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

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [currentPage, setCurrentPage] = useState(1);

  const blogsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("https://diginote-3b4g.onrender.com/blog");
        const data = await res.json();

        const sorted = (data.data || data).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setBlogs(sorted);

        const uniqueCategories = [
          "All",
          ...new Set(sorted.map((blog) => blog.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title
      ?.toLowerCase()
      .includes(query.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const paginatedBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const LoadingSkeleton = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-300"></div>
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-300 w-3/4 rounded"></div>
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 w-2/3 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="font-sans text-gray-800 bg-gray-100">
      <Breadcrumb/>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:px-8 md:py-16 flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Articles Section */}
        <div className="flex-1">
          {/* Articles Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} />)
            ) : (
              paginatedBlogs.map((article) => (
                <article key={article._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                  {/* Updated Link Component usage */}
                  <a href={`/blog/${slugify(article.title)}`}>
                    <div className="relative h-48 sm:h-56">
                      <Image
                        src={`http://localhost:3000/blog/image/${article._id}`}
                        alt={article.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                      <div className="absolute top-3 left-3 bg-gray-900 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        {article.category || "Blog"}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center text-sm text-gray-500 mb-3 gap-4">
                        <div className="flex items-center gap-1">
                          <SlCalender />
                          {new Date(article.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mb-3 line-clamp-2">{article.title}</h3>

                      <p
                        className="text-sm text-gray-600 mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: article.content?.substring(0, 120) + "...",
                        }}
                      />

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="text-gray-600 font-medium">
                          By {article.author || "SP Advertising"}
                        </span>
                        <div className="flex items-center gap-1.5 text-blue-600 group-hover:text-blue-800 transition-colors duration-300">
                          Read more
                          <HiOutlineArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </a>
                </article>
              ))
            )}
          </div>

          {/* No Results */}
          {filteredBlogs.length === 0 && !loading && (
            <div className="text-center p-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No articles found</h3>
              <p className="text-gray-500">
                Try adjusting your search or category filter
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center p-16 text-gray-500">
              <AiOutlineLoading3Quarters className="animate-spin text-4xl mb-4" />
              <p>Loading amazing content...</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full md:w-80">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            {/* Search */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Search Articles</h3>
              <input
                type="text"
                placeholder="Search articles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
            </div>

   

            {/* Recent Posts */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Recent Posts</h3>
              <div className="space-y-4">
                {blogs.slice(0, 5).map((article) => (
                  <a
                    key={article._id}
                    href={`/blog/${slugify(article.title)}`}
                  >
                    <p className="block hover:text-blue-600 transition-colors duration-200">
                      <h4 className="font-semibold mb-1 text-base">{article.title}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </p>
                    </p>
                  </a>
                ))}
              </div>
            </div>



            {/* Social Follow */}
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex flex-wrap gap-4">
                <a
                  href=""
                  className="flex items-center gap-2 p-2 rounded-full text-white bg-pink-500 hover:bg-pink-600 transition-colors duration-200"
                >
                  <GrInstagram className="text-lg" />
                  <span className="sr-only">Instagram</span>
                </a>
                <a
                  href=""
                  className="flex items-center gap-2 p-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  <FaFacebookF className="text-lg" />
                  <span className="sr-only">Facebook</span>
                </a>
                <a
                  href=""
                  className="flex items-center gap-2 p-2 rounded-full text-white bg-blue-700 hover:bg-blue-800 transition-colors duration-200"
                >
                  <FaLinkedinIn className="text-lg" />
                  <span className="sr-only">LinkedIn</span>
                </a>
                <a
                  href=""
                  className="flex items-center gap-2 p-2 rounded-full text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                >
                  <IoLogoYoutube className="text-lg" />
                  <span className="sr-only">YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Blog;