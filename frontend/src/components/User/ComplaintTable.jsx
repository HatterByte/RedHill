import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../utils/axios";
import ComplaintModal from "./ComplaintModal";
import HomePageIconGrid from "../HomePageIconGrid";

const ComplaintTable = () => {
  const user = useSelector((state) => state.auth.user);
  const authLoading = useSelector((state) => state.auth.loading);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    if (!user || !user._id) return;
    setLoading(true);
    setError(null);
    axiosInstance
      .get(`/complaints/user/me`)
      .then((res) => {
        if (res.data && res.data.complaints) {
          setComplaints(res.data.complaints);
        } else {
          setComplaints([]);
        }
      })
      .catch(() => setError("Failed to fetch complaints."))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="m-2 sm:m-10 bg-[rgba(255,255,255,0.9)] min-h-[60vh] flex items-center justify-center text-base sm:text-lg">
        Loading user info...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="m-2 sm:m-10 bg-[rgba(255,255,255,0.9)] min-h-[60vh] flex items-center justify-center text-base sm:text-lg">
        Loading complaints...
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-2 sm:m-10 bg-[rgba(255,255,255,0.9)] min-h-[60vh] flex items-center justify-center text-base sm:text-lg text-red-600">
        {error}
      </div>
    );
  }

  // Helper to format date and time
  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const d = date.toLocaleDateString();
    const t = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${d} ${t}`;
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 m-2 sm:m-10 min-h-[60vh]">
      <div className="hidden md:flex w-1/3 lg:w-1/4 flex-shrink-0 items-center">
        <div className="max-w-full w-full">
          <HomePageIconGrid responsiveSize="small" />
        </div>
      </div>
      <div className="flex-1 bg-[rgba(255,255,255,0.95)] rounded-2xl shadow-lg p-2 sm:p-6">
        {selectedComplaint && (
          <ComplaintModal
            complaint={selectedComplaint}
            setSelectedComplaint={setSelectedComplaint}
          />
        )}
        <div className="overflow-x-auto min-h-[60vh] rounded-xl">
          <table className="min-w-[400px] w-full text-xs sm:text-sm border-separate border-spacing-y-1">
            <thead className="bg-white/80 rounded-xl">
              <tr className="h-12 sm:h-14">
                <th className="px-2 py-2 text-left font-semibold text-[#900b3d]">
                  Ref No.
                </th>
                <th className="px-2 py-2 text-left font-semibold text-[#900b3d]">
                  PNR No.
                </th>
                <th className="px-2 py-2 text-left font-semibold text-[#900b3d]">
                  Status
                </th>
                <th className="px-2 py-2 text-left font-semibold text-[#900b3d]">
                  Date & Time
                </th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr
                  key={complaint._id}
                  className="bg-white/90 hover:bg-[#f58220]/10 cursor-pointer h-12 sm:h-14 rounded-xl shadow transition-all duration-150 border border-[#f58220]/30"
                  onClick={() => setSelectedComplaint(complaint)}
                >
                  <td className="px-2 py-2 text-cyan-600 font-semibold rounded-l-xl ">
                    {complaint._id}
                  </td>
                  <td className="px-2 py-2">{complaint.pnr}</td>
                  {complaint.resolved === 0 ? (
                    <td className="text-yellow-600 font-bold">Pending</td>
                  ) : (
                    <td className="text-green-600 font-bold">Completed</td>
                  )}
                  <td className="px-2 py-2 rounded-r-xl">
                    {formatDateTime(complaint.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {complaints.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No complaints found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintTable;
