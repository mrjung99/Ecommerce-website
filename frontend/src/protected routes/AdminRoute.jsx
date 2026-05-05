import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/features/auth/authSlice";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = useSelector(selectCurrentUser);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
