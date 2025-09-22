'use client'; // This is essential! It marks this component as interactive.

import { useState } from 'react';
import BlogCard from './BlogCard'; // Assuming your BlogCard is in the same folder

export default function BlogSearch({ posts }) {
  // State to hold the user's search query
  const [searchQuery, setSearchQuery] = useState('');

  // Filter the posts based on the search query
  const filteredPosts = posts.filter(post => {
    // Convert both title and query to lower case for case-insensitive search
    return post.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a blog post..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 mb-8 border rounded-md focus:ring-2 focus:ring-blue-500"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
}