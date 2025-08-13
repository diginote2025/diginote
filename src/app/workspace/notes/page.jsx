import React from 'react'
import Notes from './Notes';

  export const metadata = {
    title: "DigiNote – AI Notes Maker | MCQs, Chapter Videos & Tests",
    description:
      "DigiNote is an AI-powered notes maker for students, offering MCQ tests, chapter-related YouTube videos, and customizable unit tests.",
    keywords: [
      "DigiNote",
      "AI notes maker",
      "student notes",
      "MCQ tests",
      "YouTube chapter videos",
      "unit tests",
      "AI study tool",
      "digital learning",
    ],
    icons: {
      icon: "/favicon.ico",
    },
    metadataBase: new URL("https://diginote.in"),
    openGraph: {
      title: "DigiNote - AI Notebook Maker | MCQs, chapter videos & tests",
      description:
        "DigiNote is an AI-powered notebook generator for students, offering MCQ tests, chapter-related YouTube videos, and customizable unit tests.",
      url: "/workspace",
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
    verification: {
      google: "lt26BMlkm0vfvrArTEIKCm1DT2gWldd_SMH3-cn6D0E",
      other: {
        "custom-verification-name": "custom-verification-code",
      },
    },
  };

export default function page() {
  return (
    <div>
      <Notes/>
    </div>
  )
}
