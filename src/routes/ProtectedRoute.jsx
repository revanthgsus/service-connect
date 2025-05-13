import React, { useContext } from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import NotFound from './../common/NotFound/NotFound';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (!allowedRoles.includes(user?.role)) {
    return <NotFound />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
