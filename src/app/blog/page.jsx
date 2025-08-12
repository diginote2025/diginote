import BlogCard from "./components/BlogCard";
import Sidebar from "./components/Sidebar";
import SectionTitle from "./components/SectionTitle";
import Breadcrumb from "./Breadcrumb";

export default function BlogPage() {
  const blogs = [
    {
      id: 1,
      category: "Educational",
     date: 'August 11, 2025',
      title: "The Future of AI Digital Notebook Makers",
      excerpt: "Traditional digital notebooks were essentially digital paper...",
      image: "/images/blog/future_of_ai_digital_notebook.jpg",
    },
  
  ];

  return (
    <div className="container mx-auto px-4">
      <Breadcrumb/>
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
