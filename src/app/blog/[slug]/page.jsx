import React from "react";
import { BlogPages } from "./BlogPages";

const API_ROOT = "https://diginote-3b4g.onrender.com/blog";

// Function to generate slug
const generateSlug = (title) =>
  title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

// Async function to fetch post title
async function getPostTitle(slug) {
  const res = await fetch(API_ROOT);
  if (!res.ok) return "Blog"; // fallback

  const data = await res.json();
  const blogs = data.data || [];

  const blogsWithSlug = blogs.map((b) => ({ ...b, slug: generateSlug(b.title) }));
  const post = blogsWithSlug.find((p) => p.slug === slug);
  return post ? post.title : "Blog";
}

// Next.js App Router: generate dynamic metadata
export async function generateMetadata({ params }) {
  const slug = params.slug; // assuming route like /blog/[slug]
  const title = await getPostTitle(slug);

  return {
    title: `${title}`,
    description:
      "DigiNote is an all-in-one AI-powered study assistant that helps students study smarter with AI-generated notes, MCQ practice, curated YouTube videos, and custom unit tests. Save time, reduce paper waste, and enhance your learning efficiency.",
    keywords: [
      "AI study tool",
      "digital notes",
      "MCQ practice",
      "AI notebook",
      "online learning",
      "student resources",
      "study smarter",
      "unit test builder",
      "AI-powered education",
    ],
    metadataBase: new URL("https://diginote.in"),
    openGraph: {
      title: `Study Smarter Blog | Tips, Tricks & EdTech News by DigiNote`,
      description:
        "DigiNote is an all-in-one AI-powered study assistant that helps students study smarter with AI-generated notes, MCQ practice, curated YouTube videos, and custom unit tests. Save time, reduce paper waste, and enhance your learning efficiency.",
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
