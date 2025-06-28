import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Complaints from "../pages/Complaints";
import ComplaintDetails from "../pages/ComplaintDetails";
import ClassificationMonitor from "../pages/ClassificationMonitor";
import UserHistory from "../pages/UserHistory";

const AdminRoutes = () => (
  <Routes>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="complaints" element={<Complaints />} />
    <Route path="complaints/:id" element={<ComplaintDetails />} />
    <Route path="classification" element={<ClassificationMonitor />} />
    <Route path="user-history" element={<UserHistory />} />
    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Routes>
);

export default AdminRoutes;
