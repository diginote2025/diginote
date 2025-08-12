import { Geist } from "next/font/google";
import Providers from "./App";
import "./globals.css";
import Script from "next/script";

const geist = Geist({ subsets: ["latin"], weight: ["400"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
