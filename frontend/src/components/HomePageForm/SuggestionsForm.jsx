import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useGlobalAlert } from "../../utils/AlertContext";
import { useLoginModal } from "../../utils/LoginModalContext";

const suggestionOptions = [
  "New Train",
  "New Stoppage",
  "Passenger Amenities",
  "Freight Services",
  "High Speed Rail Travel",
  "Infusing Technology",
  "Reducing Carbon Footprint",
  "Others",
];

const SuggestionsForm = () => {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const { showAlert } = useGlobalAlert();
  const auth = useSelector((state) => state.auth);
  const { openLoginModal } = useLoginModal();
  const formRef = useRef();

  // Block interaction if not logged in
  const requireLogin = (e) => {
    if (!auth.isAuthenticated) {
      if (e) e.preventDefault && e.preventDefault();
      openLoginModal(1); // OTP tab
      return true;
    }
    return false;
  };

  // Use onMouseDown to block dropdown/input opening
  const guardedProps = {
    onMouseDown: (e) => {
      if (requireLogin(e)) return;
    },
    onFocus: (e) => {
      if (requireLogin(e)) return;
    },
    tabIndex: 0,
    style: !auth.isAuthenticated
      ? { cursor: "pointer", background: "#f4f5f6" }
      : {},
  };

  const handleSubmit = (e) => {
    if (requireLogin(e)) return;
    e.preventDefault();
    if (!type) {
      showAlert("Please select a suggestion type.", "warning");
      return;
    }
    if (!description.trim()) {
      showAlert("Please enter a description.", "warning");
      return;
    }
    showAlert("Thank you for your suggestion!", "success");
    setType("");
    setDescription("");
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className=""
    >
      <div className="topBar flex flex-col sm:flex-row w-full justify-between border-b-[1px] border-gray-300 pb-2 h-auto sm:h-12 mb-4 gap-2 sm:gap-0">
        <h2 className="text-[#930b3e] text-xl sm:text-2xl font-bold">
          Submit a Suggestion
        </h2>
        <div className="flex gap-0.5 items-center">
          <span className="text-[#f05f40]">*</span>
          <span className="text-base sm:text-xl">Mandatory Fields</span>
        </div>
      </div>
      <div className="w-full mt-4">
        <div className="flex gap-0.5">
          <label className="text-[#7c7c7c] text-base sm:text-lg font-medium">
            Suggestion Type
          </label>
          <span className="text-[#f05f40]">*</span>
        </div>
        <select
          {...guardedProps}
          className="w-full border-[1px] h-11 sm:h-13 border-[#d9d9d9] p-2 text-base sm:text-xl bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb] mt-1"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="">Select a suggestion</option>
          {suggestionOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full mt-4">
        <div className="flex gap-0.5">
          <label className="text-[#7c7c7c] text-base sm:text-lg font-medium">
            Description
          </label>
          <span className="text-[#f05f40]">*</span>
        </div>
        <textarea
          {...guardedProps}
          className="w-full border-[1px] h-32 sm:h-40 border-[#d9d9d9] p-2 flex items-center bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb] mt-1 text-base sm:text-xl"
          placeholder="Describe your suggestion..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="flex w-full flex-col sm:flex-row justify-end items-center gap-4 mt-10">
        <button
          type="submit"
          className="w-full sm:w-28 h-11 sm:h-13 text-white p-2 rounded-lg cursor-pointer bg-[#75002b] hover:bg-[#f58220] transition-all duration-500 ease-in-out text-base sm:text-lg"
        >
          Submit
        </button>
        <button
          type="button"
          className="w-full sm:w-28 h-11 sm:h-13 text-white p-2 rounded-lg cursor-pointer bg-[#75002b] hover:bg-[#f58220] transition-all duration-500 ease-in-out text-base sm:text-lg"
          onClick={() => {
            setType("");
            setDescription("");
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default SuggestionsForm;
