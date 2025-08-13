import BlogCard from "./components/BlogCard";
import Sidebar from "./components/Sidebar";
import SectionTitle from "./components/SectionTitle";
import Breadcrumb from "./Breadcrumb";

export const metadata = {
  title: "Study Smarter Blog | Tips, Tricks & EdTech News by DigiNote",
  description:
    "Explore the DigiNote blog for expert articles on effective study habits, exam strategies, productivity hacks, and how to leverage AI for academic success.",
  keywords: [
    "Study tips",
    "learning strategies",
    "exam preparation",
    "AI in education",
    "edtech blog",
    "student advice",
    "academic success",
    "productivity hacks",
    "online learning",
    "DigiNote blog",
  ],
  metadataBase: new URL("https://diginote.in"),
  openGraph: {
    title: "Study Smarter Blog | Tips, Tricks & EdTech News by DigiNote",
    description:
      "Explore the DigiNote blog for expert articles on effective study habits, exam strategies, productivity hacks, and how to leverage AI for academic success.",
    url: "/blog",
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

export default function BlogPage() {
  const blogs = [
    {
      id: 1,
      category: "Educational",
      date: "August 11, 2025",
      title: "The Future of AI Digital Notebook Makers",
      excerpt:
        "Traditional digital notebooks were essentially digital paper...",
      image: "/images/blog/future_of_ai_digital_notebook.jpg",
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <Breadcrumb />
      <SectionTitle title="Our Latest News & Blogs" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Blog List */}
        <div className="lg:col-span-2 space-y-8">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} {...blog} />
          ))}
        </div>

        {/* Right - Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
}
