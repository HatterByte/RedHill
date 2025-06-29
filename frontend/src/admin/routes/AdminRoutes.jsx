import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Complaints from "../pages/Complaints";
import ComplaintDetails from "../pages/ComplaintDetails";
import ClassificationMonitor from "../pages/ClassificationMonitor";
import UserHistory from "../pages/UserHistory";
import UserComplaintsTable from "../pages/UserComplaintsTable";
import ProtectedRoute from "./ProtectedRoute";

const AdminRoutes = () => (
  <Routes>
    <Route element={<ProtectedRoute redirectTo="/" />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="complaints" element={<Complaints />} />
      <Route path="complaints/:id" element={<ComplaintDetails />} />
      <Route path="classification" element={<ClassificationMonitor />} />
      <Route path="users" element={<UserHistory />} />
      <Route path="user-history/:phone" element={<UserComplaintsTable />} />
    </Route>
    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Routes>
);

export default AdminRoutes;
