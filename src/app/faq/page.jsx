import React from "react";
import FAQ from "./FAQ";
import Breadcrumb from "./Breadcrumb";

export const metadata = {
  title: "Frequently Asked Questions (FAQ) | DigiNote Help Center",
  description:
    "Find answers to all your questions about DigiNote. Our FAQ page covers how our AI note generator, MCQ tests, and other features work, plus details on usage and accounts.",
  keywords: [
    "FAQ",
    "frequently asked questions",
    "DigiNote help",
    "DigiNote questions",
    "how to use DigiNote",
    "AI study tool help",
    "student support",
    "account questions",
    "feature explanation",
  ],
  metadataBase: new URL("https://diginote.in"),
  openGraph: {
    title: "Frequently Asked Questions (FAQ) | DigiNote Help Center",
    description:
      "Find answers to all your questions about DigiNote. Our FAQ page covers how our AI note generator, MCQ tests, and other features work, plus details on usage and accounts.",
    url: "/faq",
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
      <FAQ />
    </div>
  );
}
