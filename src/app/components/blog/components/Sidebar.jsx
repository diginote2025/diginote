import Tag from "./Tag";
import RecentPostItem from "./RecentPostItem";

export default function Sidebar() {
 const tags = [
  "AI Note-Taking",
  "Knowledge Management",
  "Productivity Tools",
  "Research Automation",
  "Writing Assistance"
];

  const recentPosts = [
    { title: "The Future of AI Digital Notebook Makers", date: "11 Aug 2025", image: "/images/blog/future_of_ai_digital_notebook.jpg" },
    
  ];

  return (
    <aside className="space-y-8">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search"
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Tags */}
      <div>
        <h4 className="font-semibold mb-3">Popular Tags</h4>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <Tag key={i} text={tag} />
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h4 className="font-semibold mb-3">Recent Post</h4>
        <div className="space-y-4">
          {recentPosts.map((post, i) => (
            <RecentPostItem key={i} {...post} />
          ))}
        </div>
      </div>
    </aside>
  );
}
