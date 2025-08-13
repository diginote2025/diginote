import CTA from "@/app/components/CTA";
import FAQ from "@/app/components/FAQ";
import React from "react";
import Breadcrumb from "./Breadcrumb";
import ServicesPage from "./ServicesPage";

export const metadata = {
  title: "Custom Unit Test Maker (AI & Manual) | Exam Prep Tool | DigiNote",
  description:
    "Build your perfect unit test with DigiNote's test builder. Choose AI-generated questions or manually select them to simulate exams, improve time management, and get detailed performance reports.",
  keywords: [
    "Unit test builder",
    "AI test generator",
    "custom unit test",
    "online test maker",
    "exam simulation",
    "personalized test",
    "manual test creation",
    "student assessment tool",
    "performance analytics",
    "timed tests",
    "syllabus-based test",
    "exam readiness",
  ],
  metadataBase: new URL("https://diginote.in"),
  openGraph: {
    title: "Custom Unit Test Maker (AI & Manual) | Exam Prep Tool | DigiNotee",
    description:
      "Build your perfect unit test with DigiNote's test builder. Choose AI-generated questions or manually select them to simulate exams, improve time management, and get detailed performance reports.",
    url: "/features/ai-unit-test",
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
};

export default function page() {
  return (
    <div>
      <Breadcrumb />
      <ServicesPage />
      <CTA />
      <FAQ />
    </div>
  );
}
