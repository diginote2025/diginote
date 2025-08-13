"use client";

import { usePathname } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import MinimalNavbar from "./components/Navbar";
import Footer from "./components/Footer";
import Image from "next/image";
import "./globals.css";

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

function AppBody({ children }) {
  const pathname = usePathname();
  const { status } = useSession(); // Get session status for loading check.

  const hideNavbar = pathname.startsWith("/workspace");

  if (status === "loading") {
    return <Preloader />;
  }

  return (
    <>
      {!hideNavbar && <MinimalNavbar />}
      <main>{children}</main> {/* Good practice to wrap page content in <main> */}
      {!hideNavbar && <Footer />}
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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