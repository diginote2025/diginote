import { Search, ArrowRight, PlayCircle } from 'lucide-react';

// --- COMPONENT: SearchBar ---
// A simple search bar component.
const SearchBar = () => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search"
        className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-4 pr-12 text-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
      />
      <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
    </div>
  );
};

// --- COMPONENT: PopularTags ---
// Displays a list of popular topic tags.
const PopularTags = () => {
  const tags = ['SEO', 'Email Marketing', 'PPC', 'Affiliate Marketing', 'Local SEO', 'Influencer Marketing'];
  return (
    <div>
      <h3 className="mb-4 text-xl font-semibold text-gray-800">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <button
            key={tag}
            className="rounded-md border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-green-100 hover:text-green-700 hover:border-green-300"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};


// --- COMPONENT: RecentPostItem ---
// Represents a single post in the "Recent Posts" list.
const RecentPostItem = ({ image, title, date }) => {
  return (
    <div className="flex items-center space-x-4">
      <img src={image} alt={title} className="h-16 w-16 flex-shrink-0 rounded-lg object-cover" />
      <div>
        <h4 className="font-semibold text-gray-800 leading-tight">{title}</h4>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </div>
  );
};


// --- COMPONENT: RecentPosts ---
// A list of recent blog posts.
const RecentPosts = () => {
  const posts = [
    {
      image: 'https://placehold.co/150x150/e2e8f0/334155?text=SEO+Audit',
      title: 'How to Perform a Full SEO Audit in 2025',
      date: '19 May 2025',
    },
    {
      image: 'https://placehold.co/150x150/e2e8f0/334155?text=PPC+Mistakes',
      title: '5 Common PPC Mistakes That Drain Your Budget',
      date: '18 May 2025',
    },
    {
      image: 'https://placehold.co/150x150/e2e8f0/334155?text=Blog+Posts',
      title: 'How to Write SEO-Friendly Blog Posts That Convert',
      date: '17 May 2025',
    },
  ];

  return (
    <div>
      <h3 className="mb-4 text-xl font-semibold text-gray-800">Recent Post</h3>
      <div className="space-y-4">
        {posts.map(post => (
          <RecentPostItem key={post.title} {...post} />
        ))}
      </div>
    </div>
  );
};

// --- COMPONENT: HireUsCard ---
// A promotional card to encourage user engagement.
const HireUsCard = () => {
    return (
        <div className="relative h-full min-h-[300px] w-full overflow-hidden rounded-xl">
            <img 
                src="https://placehold.co/600x800/a3a3a3/ffffff?text=Team" 
                alt="A team of professionals working together" 
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="relative z-10 flex h-full flex-col items-start justify-end p-6 text-white">
                <h3 className="mb-2 text-2xl font-bold">Hire Us</h3>
                <p className="mb-4 text-base">Looking to Elevate Your Digital Presence?</p>
                <button className="rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-transform hover:scale-105">
                    View More
                </button>
            </div>
        </div>
    );
};


// --- COMPONENT: BlogPostCard ---
// The main card for displaying a full blog post summary.
const BlogPostCard = ({ image, category, date, title, excerpt }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg">
      <div className="relative">
        <img src={image} alt={title} className="h-auto w-full object-cover" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <button className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 bg-opacity-80 text-white backdrop-blur-sm transition-transform hover:scale-110">
                <PlayCircle size={32} />
            </button>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-4 flex items-center space-x-4">
          <span className="rounded-md bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">{category}</span>
          <span className="text-sm text-gray-500">{date}</span>
        </div>
        <h2 className="mb-3 text-2xl font-bold text-gray-800">
          {title}
        </h2>
        <p className="mb-6 text-gray-600">
          {excerpt}
        </p>
        <a href="#" className="inline-flex items-center font-semibold text-green-600 hover:text-green-700">
          Read More <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </div>
  );
};


// --- PAGE COMPONENT: BlogPage ---
// This is the main component that assembles the entire page.
export default function App() {
  const mainPost = {
    image: 'https://placehold.co/800x500/a3a3a3/ffffff?text=Ad+Campaigns',
    category: 'Paid Advertising',
    date: '15 May 2025',
    title: "A Beginner's Guide to Running Profitable Ad Campaigns: Strategies That Actually Work",
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...',
  };
  
  const secondPost = {
    image: 'https://placehold.co/800x500/a3a3a3/ffffff?text=Team+Meeting',
    category: 'Content Marketing',
    date: '14 May 2025',
    title: "How to Build a Content Strategy That Drives Engagement",
    excerpt: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
  };

  return (
    <div className="bg-gray-50 font-sans">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
            <div className="inline-flex items-center gap-2">
                <span className="h-4 w-4 rounded-full bg-green-500"></span>
                <p className="text-lg font-semibold text-gray-600">News & Blogs</p>
            </div>
          <h1 className="text-5xl font-extrabold text-gray-900">Our Latest News & Blogs</h1>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          
          {/* Blog Posts Column */}
          <div className="space-y-12 lg:col-span-2">
            <BlogPostCard {...mainPost} />
            <BlogPostCard {...secondPost} />
          </div>

          {/* Sidebar Column */}
          <aside className="space-y-10 lg:col-span-1">
            <SearchBar />
            <PopularTags />
            <RecentPosts />
            <HireUsCard />
          </aside>

        </div>
      </div>
    </div>
  );
}
