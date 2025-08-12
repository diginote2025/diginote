"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import MinimalNavbar from "./components/Navbar";
import Footer from "./components/Footer";

// JSON-LD schema
const schemaData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Features to Study Smarter | AI Notes, MCQ Tests & More | DigiNote",
  url: "https://diginote.in/features",
  description:
    "Discover DigiNote's suite of AI-powered study tools. From instant notes and MCQ practice to a custom test builder and curated videos, we have everything you need for academic success.",
  about: {
    "@type": "SoftwareApplication",
    name: "DigiNote",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web-based",
    provider: {
      "@type": "Organization",
      name: "DigiNote",
      url: "https://diginote.in",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-74705-78448",
        email: "diginote2025@gmail.com",
        contactType: "Customer Support",
        areaServed: "Worldwide",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Telibandha",
        addressLocality: "Raipur",
        addressRegion: "Chhattisgarh",
        addressCountry: "IN",
      },
    },
  },
  mainEntity: {
    "@type": "ItemList",
    name: "DigiNote Features",
    description:
      "An overview of the core features designed to supercharge your learning.",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Thing",
          name: "AI-Generated Notes",
          description:
            "Instantly get concise, well-structured notes for any topic or chapter, tailored to your syllabus.",
          url: "https://diginote.in/features/ai-notebook-maker",
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Thing",
          name: "MCQ Practice Tests",
          description:
            "Reinforce your learning with topic-wise multiple-choice questions to assess and strengthen your knowledge.",
          url: "https://diginote.in/features/ai-mcq-practice",
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Thing",
          name: "Curated YouTube Videos",
          description:
            "Access handpicked educational videos from trusted channels that explain complex topics visually.",
          url: "https://diginote.in/features/topic-wise-youtube-video",
        },
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "Thing",
          name: "Manual or AI Unit Test Builder",
          description:
            "Create custom unit tests to simulate real exam conditions and boost your readiness.",
          url: "https://diginote.in/features/ai-unit-test",
        },
      },
    ],
  },
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith("/workspace");
  const canonicalUrl = `https://diginote.in${pathname}`;

  return (
    <html lang="en">
      <head>
        <title>
          DigiNote – AI Notebook Maker | MCQs, Chapter Videos & Tests
        </title>
        <meta
          name="description"
          content="DigiNote is an AI-powered notebook generator for students, offering MCQ tests, chapter-related YouTube videos, and customizable unit tests."
        />
        <meta
          name="keywords"
          content="diginote, ai notes taker, student notes, mcq tests, youtube video, unit tests, ai study tool, digital learning"
        />
        <meta
          property="og:title"
          content="DigiNote – AI Notebook Maker | MCQs, Chapter Videos & Tests"
        />
        <meta
          property="og:description"
          content="DigiNote is an AI-powered notebook generator for students, offering MCQ tests, chapter-related YouTube videos, and customizable unit tests."
        />
          <meta name="google-site-verification" content="lt26BMlkm0vfvrArTEIKCm1DT2gWldd_SMH3-cn6D0E" />
       
        <meta property="og:url" content="https://diginote.in" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body>
        <ReduxProvider store={store}>
          <SessionProvider>
            {!hideNavbar && <MinimalNavbar />}
            {children}
            {!hideNavbar && <Footer />}
          </SessionProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
