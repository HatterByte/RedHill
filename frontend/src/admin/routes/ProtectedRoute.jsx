import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { axiosInstance } from "../../utils/axios";

const ProtectedRoute = ({ redirectTo = "/" }) => {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Always check with backend, since cookie is HttpOnly
    axiosInstance
      .get("/user/profile")
      .then((res) => {
        const user = res.data.user;
        console.log("[ProtectedRoute] user fetched:", user);
        setIsAuthenticated(!!user);
        const adminStatus = user && (user.isAdmin || user.role === "admin");
        setIsAdmin(adminStatus);
        console.log("[ProtectedRoute] isAdmin:", adminStatus);
      })
      .catch((err) => {
        setIsAuthenticated(false);
        setIsAdmin(false);
        console.log("[ProtectedRoute] Error fetching user/profile", err);
      })
      .finally(() => {
        setChecking(false);
        console.log("[ProtectedRoute] Done checking");
      });
  }, []);

  console.log(
    "[ProtectedRoute] checking:",
    checking,
    "isAuthenticated:",
    isAuthenticated,
    "isAdmin:",
    isAdmin
  );
  if (checking) return null; // or a spinner
  return isAuthenticated && isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to={redirectTo} replace />
  );
};

export default ProtectedRoute;
