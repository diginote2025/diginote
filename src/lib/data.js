// This acts as our mock database.
const allPosts = [
  {
    slug: 'my-first-blog-post',
    title: 'My Very First Blog Post',
    excerpt: 'A short summary of my first post. It is very exciting!',
    content: 'This is the full content of my first post. Welcome to my new blog where I will be sharing my thoughts on web development and more. Stay tuned for exciting updates and tutorials.',
  },
  {
    slug: 'how-to-learn-nextjs',
    title: 'How to Learn Next.js Effectively',
    excerpt: 'Learning Next.js is a fun journey. Here are some tips for success.',
    content: 'Next.js is a powerful React framework. To learn it effectively, start with the official documentation, build small projects, and understand the difference between Server and Client Components. This will set you up for success.',
  },
  {
    slug: 'exploring-tailwind-css',
    title: 'Exploring the Power of Tailwind CSS',
    excerpt: 'A look into why Tailwind CSS is a popular choice for styling modern web apps.',
    content: 'Tailwind CSS is a utility-first CSS framework that allows for rapid UI development. Instead of writing custom CSS, you use pre-defined utility classes directly in your HTML, which can dramatically speed up your workflow.',
  }
];

// Function to get all posts, with an optional search filter
export async function getAllPosts(query) {
  // We add a fake delay to simulate a network request
  await new Promise(resolve => setTimeout(resolve, 100)); 

  if (!query) {
    return allPosts;
  }
  
  const lowerCaseQuery = query.toLowerCase();
  return allPosts.filter(post => 
    post.title.toLowerCase().includes(lowerCaseQuery) ||
    post.content.toLowerCase().includes(lowerCaseQuery)
  );
}

// Function to get a single post by its slug
export async function getPostBySlug(slug) {
  // We add a fake delay to simulate a network request
  await new Promise(resolve => setTimeout(resolve, 100)); 
  
  return allPosts.find((post) => post.slug === slug);
}