import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        form
      );
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful!");
      setTimeout(() => navigate("/dashboard"), 1000); // redirect after login
    } catch (err) {
      setMessage(err.response?.data?.error || "Error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80"
      >
        <h2 className="text-xl font-bold mb-4">Sign In</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Sign In
        </button>
        <p className="text-sm mt-2 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-600">
            Sign Up
          </Link>
        </p>
        <p className="text-sm mt-1 text-center">
          <Link to="/forgot-password" className="text-purple-600">
            Forgot Password?
          </Link>
        </p>
        {message && <p className="mt-3 text-center text-sm">{message}</p>}
      </form>
    </div>
  );
}
