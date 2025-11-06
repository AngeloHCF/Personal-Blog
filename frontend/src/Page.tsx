import React from "react";
import Header from "./components/Header";
import Blogs from "./Blogs";

interface PageProps {
  token: string | null;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const Page: React.FC<PageProps> = ({
  token,
  onLogout,
  darkMode,
  setDarkMode,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <Header
        token={token}
        onLogout={onLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <Blogs />
    </div>
  );
};
