"use client"; // needed because we're using hooks

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import MinimalNavbar from "./components/Navbar";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import Footer from "./components/Footer";

export const metadata = {
  title: "DigiNote – AI Notebook Maker | MCQs, Chapter Videos & Tests",
  description:
    "DigiNote is an AI-powered notebook generator for students, offering MCQ tests, chapter-related YouTube videos, and customizable unit tests.",
  keywords:
    "diginote, ai notes taker, student notes, mcq tests, youtube video, unit tests, ai study tool, digital learning",
  metadataBase: new URL("https://diginote.in"),
  openGraph: {
    title: "DigiNote – AI Notebook Maker | MCQs, Chapter Videos & Tests",
    description:
      "DigiNote is an AI-powered notebook generator for students, offering MCQ tests, chapter-related YouTube videos, and customizable unit tests.",
    url: "https://diginote.in",
    type: "website",
    images: ["/og-image.png"],
    siteName: "DigiNote",
  },
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith("/workspace");
  const canonicalUrl = `https://www.drkunalsayani.com${pathname}`;

  return (
    <div>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <ReduxProvider store={store}>
        <SessionProvider>
          {!hideNavbar && <MinimalNavbar />}
          {children}
          {!hideNavbar && <Footer />}
        </SessionProvider>
      </ReduxProvider>
    </div>
  );
}
