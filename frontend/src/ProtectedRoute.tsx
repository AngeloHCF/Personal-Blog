import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  token: string | null;
  children: React.ReactNode;
}

interface JwtPayload {
  username: string;
  role: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ token, children }) => {
  let isAdmin = false;

  if (token && token !== "guest-token") {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      isAdmin = decoded.role === "admin";
    } catch (error) {
      console.error`Invalid token: ${error}`;
    }
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
