import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Ensure `useAuth` provides this state
  const token = sessionStorage.getItem("authToken");

  return isAuthenticated && token ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
