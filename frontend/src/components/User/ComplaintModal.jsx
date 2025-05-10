import React, { useState } from "react";

const ComplaintModal = ({ complaint, setSelectedComplaint }) => {
  const [otp, setOtp] = useState("");

  const handleOtpSubmit = () => {
    if (otp === "1234") {
      alert("Complaint successfully completed!");
      onClose();
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <>
        <div className="fixed w-screen h-screen bg-black opacity-50 top-0 left-0 z-12" onClick={()=>setSelectedComplaint(null)}></div>

      <div className="bg-white rounded-lg p-6 w-88 sm:w-94 md:w-110 lg:w-115 shadow-lg z-15 fixed max-h-[90vh] overflow-y-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden custom-scroll">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
          onClick={() => setSelectedComplaint(null)}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Complaint Details</h2>
        <p className="mb-2">
          <strong>ID:</strong> {complaint.complaintId}
        </p>
        <p className="mb-2">
          <strong>Name</strong> {complaint.name}
        </p>
        <p className="mb-2">
          <strong>Phone:</strong> {complaint.phone}
        </p>
        <p className="mb-2">
          <strong>Train No:</strong> {complaint.trainCode}
        </p>
        <p className="mb-2">
          <strong>Train name:</strong> {complaint.trainName}
        </p>
        <p className="mb-2 items-center">
          <h2 className="font-bold">Media:</h2>
          <img className="h-36 w-36 mx-auto " src={complaint.media}></img>
        </p>
        <p className="mb-2">
          <strong>Severity:</strong> {complaint.severity}
        </p>
        <p className="mb-2">
          <strong>Category:</strong> {complaint.category}
        </p>
        <p className="mb-2">
          <strong>SubCategory:</strong> {complaint.subCategory} 
        </p>
        <p className="mb-4">
          <strong>Description:</strong> {complaint.description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum est necessitatibus officia ut magnam repudiandae dolor libero laborum nihil. Recusandae, hic distinctio labore ipsum nostrum optio! Vero alias repellendus asperiores.
        </p>
        <p className="mb-4">
          <strong>Date:</strong> {complaint.createdAt}
        </p>

        {/* OTP Section */}
        <p className="mb-2">
          <strong>OTP To Complete:</strong> {complaint.otp} 
        </p>
        
      </div>
    </>
  );
};

export default ComplaintModal;
