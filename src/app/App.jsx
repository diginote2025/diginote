"use client"; // needed because we're using hooks

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import MinimalNavbar from "./components/Navbar";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import Footer from "./components/Footer";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith("/workspace");

  return (
    <div>
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
