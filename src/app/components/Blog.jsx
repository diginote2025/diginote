import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Individual Blog Post Card Component
const BlogPost = ({ imageUrl, title, tags, date, link }) => {
  const [imgSrc, setImgSrc] = useState(imageUrl);

  return (
    <div className="bg-white w-full rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row items-center">
      <div className="w-full md:w-1/3 relative h-48 md:h-40 lg:h-48 ">
        <Image
          src={imgSrc}
          alt={title}
          layout="fill"
          objectFit="cover"
          onError={() => setImgSrc('https://placehold.co/400x300/6366f1/ffffff?text=Image')}
          priority={true}
          unoptimized={true}
          className='rounded-xl'
        />
      </div>

      <div className="w-full md:w-2/3 p-6 md:p-8">
        <Link href={link} passHref>
          <p className="text-2xl font-bold text-gray-800 mb-4 block hover:text-indigo-600 transition-colors">
            {title}
          </p>
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className={`px-3 py-1 text-sm font-semibold rounded-full ${tag.bgColor} ${tag.textColor}`}
            >
              {tag.name}
            </span>
          ))}
        </div>

        <p className="text-gray-500 text-sm">{date}</p>
      </div>
    </div>
  );
};

// Main Blog Section Component
const Blog = () => {
  const blogPosts = [
    {
      imageUrl: '/images/blog/future_of_ai_digital_notebook.jpg',
      title: 'The Future of AI Digital Notebook Makers',
      tags: [
        { name: 'AI Notes', bgColor: 'bg-indigo-100', textColor: 'text-indigo-800' },
        { name: 'Smart Study', bgColor: 'bg-indigo-100', textColor: 'text-indigo-800' },
      ],
      date: 'August 11, 2025',
      link: '/blog/the-future-of-ai-digital-notebook-makers',
    },
    {
      imageUrl: '/images/blog/future_of_ai_digital_notebook.jpg',
      title: 'Coming Soon',
      tags: [{ name: '', bgColor: 'bg-blue-100', textColor: 'text-blue-800' }],
      date: 'August 28, 2025',
      link: '/',
    },
  
  ];

  return (
    <section className="bg-gray-50 min-h-screen py-12 md:py-20 font-sans">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <span className="inline-block bg-cyan-400 text-white text-sm font-bold px-4 py-2 rounded-full mb-4">
            FROM THE BLOG
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">Latest News & Insights</h2>
        </header>

        <div className="flex max-lg:flex-col gap-8 lg:gap-12 max-w-6xl mx-auto">
          {blogPosts.map((post, index) => (
            <BlogPost key={index} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
