import { Geist } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geist = Geist({ subsets: ["latin"], weight: ["400"] });

export const metadata = {
  title: "DigiNote – AI Notes Maker | MCQs, Chapter Videos & Tests",
  description:
    "DigiNote is an AI-powered notes maker for students, offering MCQ tests, chapter-related YouTube videos, and customizable unit tests.",
  keywords:
    "DigiNote, AI notes maker, student notes, MCQ tests, YouTube chapter videos, unit tests, AI study tool, digital learning",
  metadataBase: new URL("https://diginote.in"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <link rel="canonical" href="https://diginote.in/" />
        <link rel="icon" href="/favicon.ico" />
        <title>{metadata.title}</title>
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
        <main>{children}</main>
      </body>
    </html>
  );
}
