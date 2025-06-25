import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../utils/axios";
import ComplaintModal from "./ComplaintModal";

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
      <div className="m-10 bg-[rgba(255,255,255,0.9)] min-h-screen flex items-center justify-center text-lg">
        Loading user info...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="m-10 bg-[rgba(255,255,255,0.9)] min-h-screen flex items-center justify-center text-lg">
        Loading complaints...
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-10 bg-[rgba(255,255,255,0.9)] min-h-screen flex items-center justify-center text-lg text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="m-10 bg-[rgba(255,255,255,0.9)] min-h-screen">
      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          setSelectedComplaint={setSelectedComplaint}
        />
      )}
      <div className="overflow-x-auto min-h-screen rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="table-header-group bg-[rgba(255,255,255,0.91)]  rounded">
            <tr className="h-16">
              <th className=" px-4 py-2 text-left">Ref No.</th>
              <th className=" px-4 py-2 text-left">Issue Type</th>
              <th className=" px-4 py-2 text-left">PNR No.</th>
              <th className=" px-4 py-2 text-left">Status</th>
              <th className=" px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr
                key={complaint.complaintId || complaint._id}
                className="hover:bg-gray-50 cursor-pointer h-16 rounded "
                onClick={() => setSelectedComplaint(complaint)}
              >
                <td className=" px-4 py-2 text-blue-600 font-semibold ">
                  {complaint.complaintId || complaint._id}
                </td>
                <td className=" px-4 py-2">
                  {complaint.type || complaint.category}
                </td>
                <td className=" px-4 py-2">{complaint.pnr}</td>
                {complaint.resolved === 0 ? (
                  <td className="text-yellow-500">Pending</td>
                ) : (
                  <td className="text-green-600">Completed</td>
                )}
                <td className=" px-4 py-2">
                  {complaint.createdAt ? complaint.createdAt.slice(0, 10) : ""}
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
  );
};

export default ComplaintTable;
