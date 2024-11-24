import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogPage";
import UserPage from "./pages/UserPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import UserBlogs from "./pages/UserBlogs";
import UserFeed from "./pages/UserFeed";
import EditProfile from "./pages/EditProfile";
import CreateBlogPage from './pages/BlogForm';

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!authToken) {
          setLoading(false);
          return;
        }
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/logged-in-user`, {
          headers: {
            Authorization: `${authToken}`,
          },
        });
        setUserData(response.data.data);
        if (userData){
          navigate('/feed');
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user details.");
        localStorage.removeItem("authToken");
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authToken]);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!authToken) {
      navigate("/login");
      return null;
    }
    return children;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar userData={userData} setAuthToken={setAuthToken} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserPage userData={userData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:user_slug"
          element={
            <ProtectedRoute>
              <UserBlogs userData={userData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit"
          element={
            <ProtectedRoute>
              <EditProfile userData={userData} setUserData={setUserData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-blog"
          element={
            <ProtectedRoute>
              <CreateBlogPage userData={userData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <UserFeed userData={userData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;