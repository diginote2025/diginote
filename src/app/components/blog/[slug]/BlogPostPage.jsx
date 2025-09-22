"use client";

import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";

const samplePost = {
  title: "The Future of AI Digital Notebook Makers",
  date: "August 11, 2025",
  author: {
    name: "D. Raju Rao",
    avatar: "/images/blog/raju.jpg",
    role: "Web Developer",
  },
  readTime: "6 min read",
  tags: ["AINotesMaker", "FutureOfEducation", "EasyToLearn"],
  cover: "/images/blog/future_of_ai_digital_notebook.jpg",
  // For demo purposes we use HTML in `content`. In real usage, sanitize or render markdown safely.
  content: (
    <>
      <div class=" ">
        <article class=" bg-white rounded-xl  mb-8">
          <div class="prose prose-slate max-w-none text-slate-700 prose-p:leading-relaxed prose-h2:text-slate-800 prose-h3:text-slate-700">
            <p>
              The humble notebook has been humanity's trusted companion for
              centuries, evolving from papyrus scrolls to leather-bound journals
              to digital apps. Now, we're witnessing the next evolutionary leap:
              AI-powered digital notebooks that don't just store our
              thoughts—they understand, enhance, and actively participate in our
              thinking process.
            </p>

            <h2 class="text-2xl sm:text-3xl font-bold border-b-2 border-blue-500 pb-2 mb-6 mt-12">
              The Intelligence Revolution in Note-Taking
            </h2>
            <p>
              Traditional digital notebooks were essentially digital
              paper—static repositories for our thoughts. Today's AI-powered
              notebooks are dynamic thinking partners that adapt to your
              workflow, understand context, and provide intelligent assistance
              at every step.
            </p>

            <h3 class="text-xl sm:text-2xl font-semibold mt-8 mb-4">
              Smart Content Understanding
            </h3>
            <p>
              Modern AI notebook makers leverage advanced natural language
              processing to understand not just what you're writing, but the
              intent behind it. When you jot down "Meeting with Sarah tomorrow
              about Q3 budget," the system doesn't just store text—it recognizes
              this as a calendar-worthy event, identifies the key participants,
              and understands the business context. These systems can
              automatically:
            </p>
            <ul class="space-y-3 my-6 list-none p-0">
              <li class="flex items-start">
                <span class="flex-shrink-0 h-6 w-6 text-blue-500 mt-0.5 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                <strong>Extract actionable items</strong> from meeting notes and
                convert them into tasks
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 h-6 w-6 text-blue-500 mt-0.5 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                <strong>Identify key concepts</strong> and create automatic
                cross-references between related notes
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 h-6 w-6 text-blue-500 mt-0.5 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                <strong>Detect sentiment and priority</strong> to help you focus
                on what matters most
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 h-6 w-6 text-blue-500 mt-0.5 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                <strong>Generate summaries</strong> of lengthy brainstorming
                sessions or research notes
              </li>
            </ul>

            <h3 class="text-xl sm:text-2xl font-semibold mt-8 mb-4">
              Intelligent Organization Beyond Folders
            </h3>
            <p>
              The future of digital notebooks transcends traditional
              hierarchical organization. AI-powered systems create dynamic,
              context-aware connections between your ideas, forming what
              researchers call "knowledge graphs" of your thoughts. Instead of
              rigid folder structures, these systems use:
            </p>
            <ul class="space-y-3 my-6 list-none p-0">
              <li class="flex items-start">
                <span class="flex-shrink-0 h-6 w-6 text-blue-500 mt-0.5 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                <strong>Semantic clustering</strong> that groups related ideas
                regardless of when or where you wrote them
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 h-6 w-6 text-blue-500 mt-0.5 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                <strong>Temporal connections</strong> that link ideas based on
                when they were created or last accessed
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 h-6 w-6 text-blue-500 mt-0.5 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                <strong>Contextual tagging</strong> that automatically applies
                relevant labels based on content analysis
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 h-6 w-6 text-blue-500 mt-0.5 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                <strong>Relationship mapping</strong> that shows how different
                concepts in your notebook connect and influence each other
              </li>
            </ul>

            <h3 class="text-xl sm:text-2xl font-semibold mt-8 mb-4">
              Predictive Writing and Creative Enhancement
            </h3>
            <p>
              AI notebook makers are evolving into creative collaborators,
              offering:
            </p>
            <ul class="space-y-3 my-6 list-none p-0">
              <li>
                <strong>Context-aware writing suggestions</strong> that
                understand your field and project
              </li>
              <li>
                <strong>Style consistency</strong> for improvements while
                maintaining your voice
              </li>
              <li>
                <strong>Research integration</strong> to suggest sources and
                citations automatically
              </li>
              <li>
                <strong>Multi-language support</strong> with real-time
                translation and cultural context
              </li>
            </ul>
            <p>
              They serve as brainstorming partners, generating related concepts,
              finding patterns, suggesting alternative perspectives, and
              connecting disparate ideas to spark innovation.
            </p>

            <h3 class="text-xl sm:text-2xl font-semibold mt-8 mb-4">
              Real-World Applications Across Industries
            </h3>
            <ul class="space-y-3 my-6 list-none p-0">
              <li>
                <strong>Education & Research:</strong> Automated bibliographies,
                adaptive study guides, finding knowledge gaps, collaborative
                idea synthesis.
              </li>
              <li>
                <strong>Business & Consulting:</strong> Automated action items,
                client profile aggregation, proposal generation, scenario
                modeling.
              </li>
              <li>
                <strong>Creative Industries:</strong> Character consistency,
                mood board generation, tracking creative influences,
                collaborative ideation.
              </li>
            </ul>

            <h3 class="text-xl sm:text-2xl font-semibold mt-8 mb-4">
              Privacy, Security, and Ethical Considerations
            </h3>
            <ul class="space-y-3 my-6 list-none p-0">
              <li>
                <strong>Data ownership</strong> with local processing and
                granular privacy settings
              </li>
              <li>
                <strong>Encryption standards</strong> safeguard ideas and
                intellectual property
              </li>
              <li>
                <strong>Bias mitigation</strong> via diverse training data,
                cultural sensitivity, and transparent recommendations
              </li>
            </ul>

            <h3 class="text-xl sm:text-2xl font-semibold mt-8 mb-4">
              The Technology Stack Behind AI Notebooks
            </h3>
            <ul class="space-y-3 my-6 list-none p-0">
              <li>
                <strong>NLP and transformer models</strong>, adapted for
                context-rich note-taking and multilingual support.
              </li>
              <li>
                <strong>Machine learning personalization</strong> via usage
                analysis and preference learning.
              </li>
              <li>
                <strong>Integration ecosystems</strong> connecting with
                calendars, research databases, communication platforms, and
                creative tools.
              </li>
            </ul>

            <h3 class="text-xl sm:text-2xl font-semibold mt-8 mb-4">
              Challenges and Limitations
            </h3>
            <ul class="space-y-3 my-6 list-none p-0">
              <li>
                <strong>Computational demands</strong> affect battery life,
                cloud reliance, and cost.
              </li>
              <li>
                <strong>Potential for mistakes</strong>—AI hallucinations,
                context misunderstandings, bias risk, and user over-reliance.
              </li>
            </ul>

            <h3 class="text-xl sm:text-2xl font-semibold mt-8 mb-4">
              Looking Ahead: The Next Five Years
            </h3>
            <ul class="space-y-3 my-6 list-none p-0">
              <li>
                <strong>Multimodal intelligence</strong>: Voice, handwriting,
                image, and video understanding
              </li>
              <li>
                <strong>Collaborative intelligence</strong>: Real-time editing,
                expertise matching, knowledge synthesis, and cultural adaptation
              </li>
              <li>
                <strong>Augmented reality integration</strong>: AR overlays,
                gesture controls, environmental adaptation, mixed reality
                collaboration
              </li>
            </ul>
            <p>
              When choosing your AI notebook, consider feature priorities,
              integrations, collaboration needs, privacy preferences, ease of
              use, customization, data portability, and cost structure.
            </p>

            <h2 class="text-2xl sm:text-3xl font-bold border-b-2 border-blue-500 pb-2 mb-6 mt-12">
              Conclusion: Embracing the Intelligent Future
            </h2>
            <p>
              AI digital notebook makers represent more than just technological
              advancement—they signal a shift toward more intelligent,
              responsive tools that understand and adapt to human needs. As
              these systems continue to evolve, they'll become increasingly
              integral to how we process information, generate ideas, and
              collaborate with others.
            </p>
            <p>
              The key to success in this new landscape is approaching AI
              notebooks as partners rather than replacement tools. By
              understanding their capabilities and limitations, we can harness
              their power to augment our natural creativity and productivity
              while maintaining the human insight and intuition that drives true
              innovation.
            </p>
            <p>
              Whether you're a student, researcher, creative professional, or
              business leader, the AI-powered digital notebook of the future
              promises to be your most intelligent and capable thinking
              companion yet. The question isn't whether to embrace this
              technology—it's how quickly you can learn to dance with it.
            </p>
          </div>
        </article>
      </div>
    </>
  ),
};

export default function BlogPostPage({ post = samplePost }) {
  const [progress, setProgress] = useState(0);
  const contentRef = useRef(null);

  // Build a basic Table of Contents from headings inside the content.
  const [toc, setToc] = useState([]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const headingNodes = el.querySelectorAll("h2, h3");
    const items = Array.from(headingNodes).map((h, i) => {
      // Ensure each heading has an id
      if (!h.id)
        h.id = `heading-${i}-${h.textContent
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}`;
      return { id: h.id, text: h.textContent, tag: h.tagName };
    });
    setToc(items);
  }, [post.content]);

  // Reading progress
  useEffect(() => {
    function onScroll() {
      const el = contentRef.current;
      if (!el) return setProgress(0);
      const top = el.getBoundingClientRect().top;
      const height = el.getBoundingClientRect().height;
      const winHeight = window.innerHeight;
      const total = height - winHeight;
      if (total <= 0) return setProgress(100);
      const scrolled = Math.min(Math.max(-top, 0), total);
      setProgress(Math.round((scrolled / total) * 100));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function handleShare() {
    const url = (typeof window !== "undefined" && window.location.href) || "";
    const title = post.title;
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else {
      // fallback: copy to clipboard
      navigator.clipboard?.writeText(url);
      alert("Link copied to clipboard");
    }
  }

  return (
    <div className="pt-[5rem]">
      <Head>
        <title>{post.title} — My Blog</title>
        <meta
          name="description"
          content={`Read ${post.readTime} — ${post.title}`}
        />
      </Head>

      {/* Reading progress bar */}
      <div className="fixed left-0 top-0 h-1 w-full z-50 bg-transparent">
        <div
          className="h-1 transition-all duration-150"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg,#4f46e5,#06b6d4)",
          }}
          aria-hidden
        />
      </div>

      <main className="max-w-7xl mx-auto ">
        {/* Hero */}
        <article className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <header className="lg:col-span-2">
            <Image
              width={1000}
              height={1000}
              src={post.cover}
              alt="cover"
              className="w-full rounded-xl object-cover mb-6"
            />
            <div className="flex items-center gap-4 mb-4">
              <Image
                width={1000}
                height={1000}
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium">
                  {post.author.name}{" "}
                  <span className="text-gray-500">• {post.author.role}</span>
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString()} • {post.readTime}
                </p>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 flex-wrap mb-6">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700"
                >
                  #{t}
                </span>
              ))}
            </div>
            {/* <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Share
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Print
              </button>
            </div> */}
          </header>

          {/* Sidebar (TOC + Related) */}
          <aside className="hidden lg:block sticky top-24 h-[calc(100vh-6rem)] overflow-auto p-4 rounded-xl border bg-white">
            <nav aria-label="Table of contents">
              <h3 className="text-sm font-semibold mb-2">On this page</h3>
              <ul className="space-y-2 text-sm">
                {toc.length === 0 && (
                  <li className="text-gray-500">No sections</li>
                )}
                {toc.map((item) => (
                  <li
                    key={item.id}
                    className={item.tag === "H2" ? "pl-0" : "pl-4"}
                  >
                    <a
                      href={`#${item.id}`}
                      className="hover:underline truncate block"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-2">Related posts</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a className="block hover:bg-gray-50 p-2 rounded" href="#">
                    The Future of AI Digital Notebook Makers
                  </a>
                </li>
                {/* <li>
                  <a className="block hover:bg-gray-50 p-2 rounded" href="#">
                    Data-driven UX in property search
                  </a>
                </li> */}
              </ul>
            </div>
          </aside>

          {/* Main content area */}
          <section className="lg:col-span-2">
            <div ref={contentRef} className="w-full">
              {/* Danger: in real projects sanitize HTML or render markdown safely */}
              {post.content}
            </div>

            {/* Author card + CTA */}
            <div className=" border rounded-lg flex items-center gap-4 p-4">
              <Image
                width={1000}
                height={1000}
                src={post.author.avatar}
                alt={post.author.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{post.author.name}</p>
                <p className="text-sm text-gray-600">{post.author.role}</p>
                <div className="mt-3">
                  <a
                    className="inline-block px-4 py-2 rounded bg-indigo-600 text-white"
                    href="https://www.instagram.com/iamrajurao/"
                  >
                    Follow
                  </a>
                </div>
              </div>
            </div>

            {/* Comments placeholder */}
            {/* <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Comments</h3>
              <div className="p-4 border rounded">
                <p className="text-sm text-gray-500">Comments are powered by your commenting system (e.g. Disqus, Commento) — placeholder here.</p>
              </div>
            </div> */}
          </section>
        </article>
      </main>

      <style jsx>{`
        /* Prose tweaks so long content looks nice with Tailwind prose plugin or native classes */
        .prose img {
          border-radius: 0.5rem;
        }
        .prose a {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
