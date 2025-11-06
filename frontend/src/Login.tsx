import React, { useState, useEffect } from "react";
import axios from "axios";

interface LoginProps {
  onLogin: (token: string) => void;
  toggleForm: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, toggleForm }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });
      if (res.data.token) {
        onLogin(res.data.token);
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Login failed");
    }
  };

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 8000);

    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-800 dark:text-black">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm p-6 bg-white rounded-xl shadow-xl"
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Sign in
        </h1>
        <input
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
        >
          Login
        </button>

        {error && (
          <p className="text-red-600 text-sm p-2 rounded-mod mt-2">{error}</p>
        )}

        <p className="text-sm text-gray-600 text-center mt-2">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => onLogin("guest-token")}
          >
            Continue as Guest
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
