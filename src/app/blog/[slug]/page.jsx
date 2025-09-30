import React from "react";
import { BlogPages } from "./BlogPages";

const API_ROOT = "https://diginote-3b4g.onrender.com/blog";

// Function to generate slug
const generateSlug = (title) =>
  title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

// Async function to fetch post details (title + content + tags)
async function getPostDetails(slug) {
  const res = await fetch(API_ROOT);
  if (!res.ok) return null;

  const data = await res.json();
  const blogs = data.data || [];

  const blogsWithSlug = blogs.map((b) => ({ ...b, slug: generateSlug(b.title) }));
  const post = blogsWithSlug.find((p) => p.slug === slug);

  if (!post) return null;

  // fetch single post to get full content and tags
  const singleRes = await fetch(`${API_ROOT}/${post._id}`);
  if (!singleRes.ok)
    return { title: post.title, content: "", tags: post.tags || [] };

  const singlePost = await singleRes.json();
  return {
    title: singlePost.title || post.title,
    content: singlePost.content || "",
    tags: singlePost.tags || [],
  };
}

// Next.js App Router: generate dynamic metadata
export async function generateMetadata({ params }) {
  const slug = params.slug; // assuming route like /blog/[slug]
  const post = await getPostDetails(slug);

  const title = post?.title || "Blog";
  const contentSnippet =
    post?.content
      ? post.content.replace(/<[^>]+>/g, "").slice(0, 160) // remove HTML + trim
      : "DigiNote blog post";

  // Use tags as keywords (fallback to default)
  const keywords = post.tags
     

  return {
    title: `${title}`,
    description: contentSnippet,
    keywords,
    metadataBase: new URL("https://diginote.in"),
    openGraph: {
      title: title,
      description: contentSnippet,
      url: `/blog/${slug}`,
      siteName: "DigiNote",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "DigiNote Logo",
        },
      ],
      type: "website",
    },
  };
}

export default function page() {
  return (
    <div>
      <BlogPages />
    </div>
  );
}
