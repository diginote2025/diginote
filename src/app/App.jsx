"use client";

import { usePathname } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import MinimalNavbar from "./components/Navbar";
import Footer from "./components/Footer";
import Image from "next/image";
import "./globals.css";

// This is your preloader component. It will be shown while the session is loading.
const Preloader = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
    <Image
      src="/images/homepage/navbar/DN.png"
      alt="DigiNote Logo"
      width={120}
      height={120}
      className="animate-pulse"
      priority // 'priority' helps the logo load faster for the preloader
    />
  </div>
);

// This new component contains the main logic.
// It can safely use hooks because it will be rendered inside the providers.
function AppBody({ children }) {
  const pathname = usePathname();
  const { status } = useSession(); // Get session status for loading check.

  const hideNavbar = pathname.startsWith("/workspace");

  // If the session status is "loading", display the preloader.
  if (status === "loading") {
    return <Preloader />;
  }

  // Once loading is complete, render the actual page content.
  // This structure now works for both logged-in and logged-out users.
  return (
    <>
      {!hideNavbar && <MinimalNavbar />}
      <main>{children}</main> {/* Good practice to wrap page content in <main> */}
      {!hideNavbar && <Footer />}
    </>
  );
}

// JSON-LD schema
// const schemaData = {
//   "@context": "https://schema.org",
//   "@type": "WebPage",
//   name: "Features to Study Smarter | AI Notes, MCQ Tests & More | DigiNote",
//   url: "https://diginote.in/features",
//   description:
//     "Discover DigiNote's suite of AI-powered study tools. From instant notes and MCQ practice to a custom test builder and curated videos, we have everything you need for academic success.",
//   about: {
//     "@type": "SoftwareApplication",
//     name: "DigiNote",
//     applicationCategory: "EducationalApplication",
//     operatingSystem: "Web-based",
//     provider: {
//       "@type": "Organization",
//       name: "DigiNote",
//       url: "https://diginote.in",
//       contactPoint: {
//         "@type": "ContactPoint",
//         telephone: "+91-74705-78448",
//         email: "diginote2025@gmail.com",
//         contactType: "Customer Support",
//         areaServed: "Worldwide",
//       },
//       address: {
//         "@type": "PostalAddress",
//         streetAddress: "Telibandha",
//         addressLocality: "Raipur",
//         addressRegion: "Chhattisgarh",
//         addressCountry: "IN",
//       },
//     },
//   },
//   mainEntity: {
//     "@type": "ItemList",
//     name: "DigiNote Features",
//     description:
//       "An overview of the core features designed to supercharge your learning.",
//     itemListElement: [
//       {
//         "@type": "ListItem",
//         position: 1,
//         item: {
//           "@type": "Thing",
//           name: "AI-Generated Notes",
//           description:
//             "Instantly get concise, well-structured notes for any topic or chapter, tailored to your syllabus.",
//           url: "https://diginote.in/features/ai-notebook-maker",
//         },
//       },
//       {
//         "@type": "ListItem",
//         position: 2,
//         item: {
//           "@type": "Thing",
//           name: "MCQ Practice Tests",
//           description:
//             "Reinforce your learning with topic-wise multiple-choice questions to assess and strengthen your knowledge.",
//           url: "https://diginote.in/features/ai-mcq-practice",
//         },
//       },
//       {
//         "@type": "ListItem",
//         position: 3,
//         item: {
//           "@type": "Thing",
//           name: "Curated YouTube Videos",
//           description:
//             "Access handpicked educational videos from trusted channels that explain complex topics visually.",
//           url: "https://diginote.in/features/topic-wise-youtube-video",
//         },
//       },
//       {
//         "@type": "ListItem",
//         position: 4,
//         item: {
//           "@type": "Thing",
//           name: "Manual or AI Unit Test Builder",
//           description:
//             "Create custom unit tests to simulate real exam conditions and boost your readiness.",
//           url: "https://diginote.in/features/ai-unit-test",
//         },
//       },
//     ],
//   },
// };


// The main RootLayout's only job is to set up the HTML structure and providers.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
    
   
      
 
        {/* <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        /> */}
      </head>
      <body>
        <ReduxProvider store={store}>
          <SessionProvider>
            <AppBody>{children}</AppBody>
          </SessionProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}