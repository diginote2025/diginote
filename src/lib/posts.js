export const posts = [
  {
    slug: "mastering-react-hooks",
    title: "Mastering React Hooks: A Deep Dive",
    author: "Jane Doe",
    date: "2024-07-28",
    excerpt:
      "Unlock the full potential of React Hooks. This guide covers everything from useState to custom hooks, with practical examples and best practices.",
    imageUrl: "https://placehold.co/800x400/6366F1/FFFFFF?text=React+Hooks",
    content: `
      <p>React Hooks have revolutionized the way we write components. They allow us to use state and other React features without writing a class. In this post, we'll explore the most common Hooks and learn how to build our own.</p>
      <h2 class="text-2xl font-bold mt-8 mb-4">The Power of useState and useEffect</h2>
      <p>The <code>useState</code> hook is the most fundamental hook. It allows you to add state to your functional components. Here’s a simple counter:</p>
      <pre><code class="language-jsx">
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
      </code></pre>
      <p>The <code>useEffect</code> hook lets you perform side effects in function components. It's a close replacement for <code>componentDidMount</code>, <code>componentDidUpdate</code>, and <code>componentWillUnmount</code>.</p>
      <h2 class="text-2xl font-bold mt-8 mb-4">Building a Custom Hook</h2>
      <p>One of the most powerful features of Hooks is the ability to create your own. Let's create a <code>useWindowSize</code> hook:</p>
       <pre><code class="language-jsx">
import { useState, useEffect } from 'react';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
      </code></pre>
      <p>Now you can easily get the window size in any component: <code>const size = useWindowSize();</code></p>
    `,
  },
  {
    slug: "tailwind-css-for-modern-uis",
    title: "Designing Modern UIs with Tailwind CSS",
    author: "John Smith",
    date: "2024-07-25",
    excerpt:
      "Tailwind CSS is a utility-first CSS framework that helps you build beautiful, custom designs without leaving your HTML. Learn why it's a game-changer.",
    imageUrl: "https://placehold.co/800x400/38BDF8/FFFFFF?text=Tailwind+CSS",
    content: `
      <p>Forget writing custom CSS for every little thing. Tailwind CSS provides low-level utility classes that let you build completely custom designs without ever leaving your HTML.</p>
      <h2 class="text-2xl font-bold mt-8 mb-4">Core Concepts</h2>
      <p>The main idea behind Tailwind is that instead of pre-styled components (like in Bootstrap or Materialize), you get building blocks. For example, to create a card:</p>
      <pre><code class="language-html">
<div class="max-w-sm rounded overflow-hidden shadow-lg">
  <Image width={1000}
            height={1000} class="w-full" src="/card-top.jpg" alt="Sunset in the mountains">
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">The Coldest Sunset</div>
    <p class="text-gray-700 text-base">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
    </p>
  </div>
</div>
      </code></pre>
      <h2 class="text-2xl font-bold mt-8 mb-4">Why It's So Productive</h2>
      <ul>
        <li><strong>No more naming things:</strong> You don't need to come up with class names like <code>.user-profile-card__header--title</code>.</li>
        <li><strong>Your CSS stops growing:</strong> Since you're reusing classes, your CSS file size stays tiny.</li>
        <li><strong>Making changes is safer:</strong> CSS is global, and you never know what you might break. With utilities, all changes are local to the component.</li>
      </ul>
    `,
  },
  {
    slug: "getting-started-with-nextjs",
    title: "Getting Started with Next.js for Production Apps",
    author: "Alex Johnson",
    date: "2024-07-22",
    excerpt:
      "Next.js is the React framework for production. This post will guide you through setting up a new project, understanding its core features like SSR and SSG, and deploying it.",
    imageUrl: "https://placehold.co/800x400/10B981/FFFFFF?text=Next.js",
    content: `
      <p>Next.js provides a robust foundation for building server-rendered React applications, static websites, and more. It handles tooling and configuration for you, so you can focus on building your product.</p>
      <h2 class="text-2xl font-bold mt-8 mb-4">Key Features</h2>
      <ul>
        <li><strong>Server-Side Rendering (SSR):</strong> Render pages on the server for better performance and SEO.</li>
        <li><strong>Static Site Generation (SSG):</strong> Pre-render pages at build time for lightning-fast load times. This is great for blogs and marketing sites.</li>
        <li><strong>File-based Routing:</strong> Create pages by simply adding files to the <code>/pages</code> directory. No complex routing libraries needed.</li>
        <li><strong>API Routes:</strong> Easily create backend API endpoints within your Next.js application.</li>
      </ul>
      <p>To get started, you just need to run:</p>
      <pre><code class="language-bash">
npx create-next-app@latest
      </code></pre>
      <p>This command sets up everything you need to start developing. The developer experience is fantastic, with features like Fast Refresh giving you instantaneous feedback on your edits.</p>
    `,
  },
];

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug);
}
