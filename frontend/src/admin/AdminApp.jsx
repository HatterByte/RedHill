import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import AdminRoutes from "./routes/AdminRoutes";

const AdminApp = () => (
  <AdminLayout>
    <AdminRoutes />
  </AdminLayout>
);

export default AdminApp;
