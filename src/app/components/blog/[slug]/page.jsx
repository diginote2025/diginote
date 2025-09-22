import React from "react";
import BlogPostPage from "./BlogPostPage";

export const metadata = {
  title: "The Future of AI Digital Notebooks: An In-depth Guide",
  description:
    "Explore the evolution of note-taking with AI-powered digital notebooks. Learn about their intelligent features, from smart content understanding to predictive writing, and how they are revolutionizing education, business, and creative industries.",
  keywords: [
    "AI digital notebook",
    "AI note-taking",
    "future of education",
    "smart content understanding",
    "intelligent organization",
    "predictive writing",
    "AI notes maker",
    "knowledge graphs",
    "DigiNote",
    "educational technology",
    "student tools",
  ],
  metadataBase: new URL("https://diginote.in"),
  openGraph: {
    title: "Study Smarter Blog | Tips, Tricks & EdTech News by DigiNote",
    description:
      "Explore the DigiNote blog for expert articles on effective study habits, exam strategies, productivity hacks, and how to leverage AI for academic success.",
    url: "/blog/the-future-of-ai-digital-notebook-makers",
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

export default function page() {
  return (
    <div>
      <BlogPostPage />
    </div>
  );
}
