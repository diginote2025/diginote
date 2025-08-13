import { Geist } from "next/font/google";
import Providers from "./App";
import "./globals.css";
import Script from "next/script";

const geist = Geist({ subsets: ["latin"], weight: ["400"] });

// app/layout.js or app/layout.tsx

export const metadata = {
  title: "DigiNote – AI Notebook Maker | MCQs, Chapter Videos & Tests",
  description:
    "DigiNote is an AI-powered notebook generator for students, offering MCQ tests, chapter-related YouTube videos, and customizable unit tests.",
  keywords: [
    "diginote",
    "ai notes taker",
    "student notes",
    "mcq tests",
    "youtube video",
    "unit tests",
    "ai study tool",
    "digital learning",
  ],
  openGraph: {
    title: "DigiNote – AI Notebook Maker | MCQs, Chapter Videos & Tests",
    description:
      "DigiNote is an AI-powered notebook generator for students, offering MCQ tests, chapter-related YouTube videos, and customizable unit tests.",

    siteName: "DigiNote",
    images: [
      {
        url: "https://diginote.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "DigiNote – AI Notebook Maker",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="lt26BMlkm0vfvrArTEIKCm1DT2gWldd_SMH3-cn6D0E"
        />
      </head>
      <body className={geist.className}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FZWZBN9RBF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FZWZBN9RBF');
          `}
        </Script>

        <main>
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
