import React from "react";
import { jwtDecode } from "jwt-decode";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  token: string | null;
  onLogout?: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

interface JwtPayload {
  username: string;
  role: string;
}

const Header: React.FC<HeaderProps> = ({
  token,
  onLogout,
  darkMode,
  setDarkMode,
}) => {
  const navigate = useNavigate();
  let isAdmin = false;

  if (token && token !== "guest-token") {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      isAdmin = decoded.role === "admin";
    } catch (error) {
      console.error(`Invalid token ${error}`);
    }
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-50 shadow-md dark:shadow-xl dark:bg-gray-800">
      <h1
        onClick={() => navigate("/")}
        className="text-xl font-semibold cursor-pointer text-gray-800 hidden sm:block dark:text-white"
      >
        Personal Blog
      </h1>

      <div className="flex-1 mx-6 justify-center max-w-md">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div className="flex items-center gap-2">
        {isAdmin ? (
          <>
            <button
              onClick={() => navigate("/create-blog")}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 active:bg-green-700 transition-colors cursor-pointer"
            >
              Create new Blog
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 active:hover:bg-red-700 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Sign in
          </button>
        )}
        <div className="flex items-center space-x-2">
          <Switch
            className="cursor-pointer"
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={setDarkMode}
          />
          <Label
            htmlFor="dark-mode"
            className="text-gray-800 dark:text-white cursor-pointer"
          >
            Dark Mode
          </Label>
        </div>
      </div>
    </header>
  );
};

export default Header;
