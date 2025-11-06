import { useState } from "react";
import Login from "./Login";

interface AuthProps {
  setToken: (token: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ setToken }) => {
  return (
    <div>
      <Login onLogin={setToken} toggleForm={() => {}} />
    </div>
  );
};
