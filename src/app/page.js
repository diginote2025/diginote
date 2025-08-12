

"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Homepage from "./components/Homepage";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();

    if (status === "loading") return<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
  {/* Logo */}
  <Image
    src="/images/homepage/navbar/DN.png"
    alt="DN Logo"
    width={120}
    height={120}
    className="animate-pulse"
  />

  {/* Loading text */}
  {/* <p className="text-gray-600 font-medium text-lg">
    Loading...
  </p> */}
</div>

;

  if (!session) {
    return (
      <div>
        {/* <div className="p-6">
        <p>You are not signed in.</p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      </div> */}
      <Homepage/>
      </div>
    );
  }

  return (
   <div>
     <div className="p-6">
      <p>Welcome, {session.user.name}</p>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
    <Homepage/>
   </div>
  );
}
