import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Auth } from "./Auth";
import axios from "axios";
import { Page } from "./Page";
import Login from "./Login";
import CreateBlog from "./CreateBlog";
import ProtectedRoute from "./ProtectedRoute";
import BlogDetails from "./BlogDetails";
import "./index.css";
import { Toaster } from "sonner";

const App = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [message, setMessage] = useState("");

  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // useEffect(() => {
  //   const fetchDashboard = async () => {
  //     if (!token) return;
  //     try {
  //       const res = await axios.get("http://localhost:5000/api/dashboard", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setMessage(res.data.message);
  //     } catch {
  //       setMessage("Unauthorized");
  //     }
  //   };
  //   fetchDashboard();
  // }, [token]);

  return (
    <Router>
      <Toaster richColors />
      <>
        {!token ? (
          <Login onLogin={(t: string) => setToken(t)} toggleForm={() => {}} />
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <Page
                  token={token}
                  onLogout={() => setToken(null)}
                  setDarkMode={setDarkMode}
                  darkMode={darkMode}
                />
              }
            />
            <Route
              path="/create-blog"
              element={
                <ProtectedRoute token={token}>
                  <CreateBlog
                    token={token}
                    onLogout={() => setToken(null)}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog/:id"
              element={
                <BlogDetails
                  token={token}
                  onLogout={() => setToken(null)}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </>
    </Router>
  );
};

export default App;
