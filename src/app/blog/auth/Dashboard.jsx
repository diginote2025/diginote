"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchDashboard = async () => {
      // Check for client-side environment before accessing localStorage
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/admin");
          return;
        }

        try {
          const res = await axios.get(
            "https://diginote-3b4g.onrender.com/api/auth/dashboard",
            {
              headers: { Authorization: token },
            }
          );
          setMessage(res.data.message);
        } catch {
          localStorage.removeItem("token");
          router.push("/admin");
        }
      }
    };
    fetchDashboard();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin");
  };

  return (
    <div className="flex flex-col items-end justify-center">
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}