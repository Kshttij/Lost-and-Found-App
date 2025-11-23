
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const userRole = localStorage.getItem("userRole");

  return userRole === "ADMIN" ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;