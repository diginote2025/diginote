import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { CreateBlog } from "./pages/dashboard/CreateBlog";
import  {BlogPages}  from "./pages/dashboard/BlogPages"; 
import  Blog  from "./pages/Blog"; 
import { AllBlogs } from "./pages/dashboard/AllBlogs";
import { EditBlog } from "./pages/dashboard/EditBlog";
import Test from "./Test";

import SignIn from "./pages/auth/SignIn";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ProtectedRoute from "./pages/auth/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/blog"
          element={
            <ProtectedRoute>
              <Blog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <ProtectedRoute>
              <BlogPages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditBlog />
            </ProtectedRoute>
          }
        />
        <Route path="/test" element={<Test />} />
        <Route path="/admin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AllBlogs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
