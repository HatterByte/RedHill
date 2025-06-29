import React, { useState } from "react";
import { axiosInstance } from "../../utils/axios";
import { useGlobalAlert } from "../../utils/AlertContext";

const TrackConcernForm = () => {
  const [refNumber, setRefNumber] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useGlobalAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!refNumber.trim()) {
      showAlert("Please enter a reference number.", "warning");
      return;
    }
    setLoading(true);
    setComplaint(null);
    try {
      const res = await axiosInstance.get(`/complaints/complaint/${refNumber}`);
      setComplaint(res.data.complaint);
      if (!res.data) {
        showAlert("No complaint found with this reference number.", "warning");
      }
    } catch (err) {
      showAlert("No complaint found with this reference number.", "warning");
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 px-2 sm:px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 rounded-lg shadow-md p-6 flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-[#930b3e] mb-2">
          Track Your Concern
        </h2>
        <label className="text-base sm:text-lg font-medium text-[#7c7c7c]">
          Reference Number
          <input
            type="text"
            className="w-full border-[1px] h-11 sm:h-13 border-[#d9d9d9] p-2 text-base sm:text-xl bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb] mt-2"
            placeholder="Enter your reference number"
            value={refNumber}
            onChange={(e) => setRefNumber(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="w-full sm:w-32 h-11 sm:h-13 text-white p-2 rounded-lg cursor-pointer bg-[#75002b] hover:bg-[#f58220] transition-all duration-500 ease-in-out text-base sm:text-lg"
          disabled={loading}
        >
          {loading ? "Searching..." : "Submit"}
        </button>
      </form>
      {complaint && (
        <div className="mt-8 bg-white/90 rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-bold text-[#900b3d] mb-2">
            Complaint Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <span className="font-semibold">Name:</span>{" "}
              {complaint.name || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Phone:</span>{" "}
              {complaint.phone || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Train Number:</span>{" "}
              {complaint.trainCode || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Train Name:</span>{" "}
              {complaint.trainName || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Category:</span>{" "}
              {complaint.type || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Sub-Category:</span>{" "}
              {complaint.subtype || "N/A"}
            </div>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Description:</span>
            <div className="bg-gray-100/70 p-3 rounded-lg border border-gray-200/60 mt-1">
              {complaint.description || "No description provided"}
            </div>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Status:</span>
            <span
              className={`ml-2 font-bold ${
                complaint.resolved === 0 ? "text-yellow-600" : "text-green-700"
              }`}
            >
              {complaint.resolved === 0 ? "Pending" : "Completed"}
            </span>
          </div>
          {complaint.media && complaint.media.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Attached Media:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {complaint.media.map((mediaUrl, idx) => {
                  const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
                  return isVideo ? (
                    <button
                      key={idx}
                      type="button"
                      className="w-full h-full bg-black/10 rounded-lg flex flex-col items-center justify-center p-2 border border-gray-200 hover:bg-black/20 transition"
                      onClick={() => window.open(mediaUrl, "_blank")}
                    >
                      <span className="text-3xl mb-1">🎬</span>
                      <span className="text-xs text-gray-700">View Video</span>
                    </button>
                  ) : (
                    <a
                      key={idx}
                      href={mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={mediaUrl}
                        alt={`Attachment ${idx + 1}`}
                        className="h-auto max-h-[200px] w-full rounded-lg object-contain bg-white shadow-sm"
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackConcernForm;
