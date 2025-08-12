"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      window.location.href = "/workspace";
    }
  }, [session]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>
      <button
        onClick={() => signIn("google")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}
