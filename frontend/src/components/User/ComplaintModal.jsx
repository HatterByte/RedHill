import React, { useState } from "react";
import { axiosInstance } from "../../utils/axios";
import { useGlobalAlert } from "../../utils/AlertContext";

const ComplaintModal = ({ complaint, setSelectedComplaint }) => {
  const [otp, setOtp] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { showAlert } = useGlobalAlert();

  const handleStatusUpdate = async () => {
    try {
      setIsUpdating(true);
      await axiosInstance.put(`/complaints/${complaint._id}`, {
        resolved: 1,
      });

      // Update the local state to show the new status
      complaint.resolved = 1;
      setIsUpdating(false);
    } catch (error) {
      console.error("Error updating complaint status:", error);
      showAlert(
        "Failed to update complaint status. Please try again.",
        "error"
      );
      setIsUpdating(false);
    }
  };

  const handleOtpSubmit = () => {
    if (otp === "1234") {
      showAlert("Complaint successfully completed!", "success");
      onClose();
    } else {
      showAlert("Invalid OTP. Please try again.", "warning");
    }
  };

  return (
    <>
      <div
        className="fixed w-screen h-screen bg-black/60 top-0 left-0 z-12 backdrop-blur-sm"
        onClick={() => setSelectedComplaint(null)}
      ></div>

      <div className="bg-gradient-to-br from-gray-100/60 to-gray-300/20 rounded-2xl w-[95vw] max-w-[98vw] sm:w-[600px] shadow-2xl z-15 fixed max-h-[90vh] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-full max-h-[90vh] overflow-y-auto custom-scroll">
          <div className="px-4 sm:px-8 py-4 sm:py-8">
            <button
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 hover:bg-gray-200/50 text-gray-600 hover:text-gray-800 transition-colors"
              onClick={() => setSelectedComplaint(null)}
            >
              ×
            </button>

            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-[#900b3d]">
                Complaint Details
              </h2>
              <p className="text-sm font-semibold text-black mt-1">
                Reference ID: {complaint._id}
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 bg-gray-100/70 p-3 rounded-lg border border-gray-200/60 hover:bg-gray-200/50">
                  <p className="text-sm text-gray-800">Name</p>
                  <p className="font-medium">{complaint.name || "N/A"}</p>
                </div>
                <div className="space-y-1 bg-gray-100/70 p-3 rounded-lg border border-gray-200/60 hover:bg-gray-200/50">
                  <p className="text-sm text-gray-800">Phone</p>
                  <p className="font-medium">{complaint.phone || "N/A"}</p>
                </div>
                <div className="space-y-1 bg-gray-100/70 p-3 rounded-lg border border-gray-200/60 hover:bg-gray-200/50">
                  <p className="text-sm text-gray-800">Train Number</p>
                  <p className="font-medium">{complaint.trainCode || "N/A"}</p>
                </div>
                <div className="space-y-1 bg-gray-100/70 p-3 rounded-lg border border-gray-200/60 hover:bg-gray-200/50">
                  <p className="text-sm text-gray-800">Train Name</p>
                  <p className="font-medium">{complaint.trainName || "N/A"}</p>
                </div>
                <div className="space-y-1 bg-gray-100/70 p-3 rounded-lg border border-gray-200/60 hover:bg-gray-200/50">
                  <p className="text-sm text-gray-800">Category</p>
                  <p className="font-medium">{complaint.type || "N/A"}</p>
                </div>
                <div className="space-y-1 bg-gray-100/70 p-3 rounded-lg border border-gray-200/60 hover:bg-gray-200/50">
                  <p className="text-sm text-gray-800">Sub-Category</p>
                  <p className="font-medium">{complaint.subtype || "N/A"}</p>
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <p className="text-sm font-semibold text-gray-800">
                  Description
                </p>
                <p className="font-medium bg-gray-100/70 p-4 rounded-lg border border-gray-200/60 hover:bg-gray-200/50">
                  {complaint.description || "No description provided"}
                </p>
              </div>

              {complaint.media && complaint.media.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-sm font-semibold text-gray-800">
                    Attached Media ({complaint.media.length})
                  </p>
                  <div className="bg-gray-100/70 p-4 rounded-lg border border-gray-200/60 hover:bg-gray-200/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {complaint.media.map((mediaUrl, index) => {
                        const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
                        return isVideo ? (
                          <button
                            key={index}
                            type="button"
                            className="w-full h-full bg-black/10 rounded-lg flex flex-col items-center justify-center p-2 border border-gray-200 hover:bg-black/20 transition"
                            onClick={() => window.open(mediaUrl, "_blank")}
                          >
                            <span className="text-3xl mb-1">🎬</span>
                            <span className="text-xs text-gray-700">
                              View Video
                            </span>
                          </button>
                        ) : (
                          <a
                            href={mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={index}
                            className="block"
                          >
                            <img
                              className="h-auto max-h-[200px] w-full rounded-lg object-contain bg-white shadow-sm"
                              src={mediaUrl}
                              alt={`Complaint attachment ${index + 1}`}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-lg flex items-center justify-center">
                              <span className="text-white opacity-0 group-hover:opacity-100 transition-all">
                                Click to view
                              </span>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1 pt-2">
                <p className="text-sm font-semibold text-gray-800">Status</p>
                <div className="bg-gray-100/70 p-3 rounded-lg border border-gray-200/60 hover:bg-gray-200/50">
                  <div className="flex justify-between items-center">
                    <p
                      className={`font-bold ${
                        complaint.resolved === 0
                          ? "text-yellow-600"
                          : "text-green-700"
                      }`}
                    >
                      {complaint.resolved === 0 ? "Pending" : "Completed"}
                    </p>
                    {complaint.resolved === 0 && (
                      <button
                        onClick={handleStatusUpdate}
                        disabled={isUpdating}
                        className="px-3 py-1 bg-green-800 text-gray-50 rounded-md text-sm hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdating ? "Updating..." : "Mark as Completed"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {complaint.otp && (
                <div className="space-y-1 pt-2 mt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-800 pt-4">Verification OTP</p>
                  <div className="bg-gray-100/70 p-3 rounded-lg border border-gray-200/60 hover:bg-gray-200/50">
                    <p className="font-bold text-[#900b3d]">{complaint.otp}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComplaintModal;
