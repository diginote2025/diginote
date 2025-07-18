import { Geist } from "next/font/google";
import Head from "next/head"; // Import Head for meta tags

import Script from "next/script";

import Providers from "./App";

const geist = Geist({ subsets: ["latin"], weight: "400" });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://aiguru.vercel.app/" />
        <title>DigiNote – AI Notes Maker | MCQs, Chapter Videos & Tests</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="DigiNote is an AI-powered notes maker for students, offering MCQ tests, chapter-related YouTube videos, and customizable unit tests."
        />
        <meta
          name="keywords"
          content="DigiNote, AI notes maker, student notes, MCQ tests, YouTube chapter videos, unit tests, AI study tool, digital learning"
        />
      </head>
      <body className={geist.className} suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
