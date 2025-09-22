import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:3000/api/auth/dashboard", {
          headers: { Authorization: token }
        });
        setMessage(res.data.message);
      } catch {
        localStorage.removeItem("token");
        navigate("/admin");
      }
    };
    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin");
  };

  return (
    <div className="flex flex-col items-end justify-center">
      {/* <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-6">{message}</p> */}
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
