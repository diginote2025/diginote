import React from "react";
import AboutUs from "./About";
import FAQ from "../components/FAQ";
import MissionVisionGoal from "./Mission";
import HappyClientSection from "../components/CTA";
import Breadcrumb from "./Breadcrumb";

export const metadata = {
  title: "AI-Powered Study Tool for Students | DigiNote",
  description:
    "DigiNote is an all-in-one AI-powered study assistant that helps students study smarter with AI-generated notes, MCQ practice, curated YouTube videos, and custom unit tests. Save time, reduce paper waste, and enhance your learning efficiency.",
  keywords: [
    "AI study tool",
    "digital notes",
    "MCQ practice",
    "AI notebook",
    "online learning",
    "student resources",
    "study smarter",
    "unit test builder",
    "AI-powered education",
  ],

  metadataBase: new URL("https://diginote.in"),
  openGraph: {
    title: "AI-Powered Study Tool for Students | DigiNote",
    description:
      "DigiNote is an all-in-one AI-powered study assistant that helps students study smarter with AI-generated notes, MCQ practice, curated YouTube videos, and custom unit tests. Save time, reduce paper waste, and enhance your learning efficiency.",
    url: "/about",
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
      <AboutUs />
      <MissionVisionGoal />
      <HappyClientSection />
      <FAQ />
    </div>
  );
}
