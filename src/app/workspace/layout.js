import { Geist } from "next/font/google";
import Head from "next/head"; // Import Head for meta tags
import Script from "next/script";
import ThemeProvider from "../workspace/components/ThemeProvider";
import Providers from "./App";

const geist = Geist({ subsets: ["latin"], weight: "400" });

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
    title: "DigiNote - AI Notes Maker | MCQs, chapter videos & tests",
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geist.className} suppressHydrationWarning={true}>
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
