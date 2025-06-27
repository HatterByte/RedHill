import React, { useState, useRef } from "react";
import { useGlobalAlert } from "../../utils/AlertContext";
import { useSelector } from "react-redux";
import { useLoginModal } from "../../utils/LoginModalContext";

const positiveAspects = [
  "Neat & Clean Coaches",
  "Clean Toilets",
  "Good Quality & Clean Bed Roll",
  "Courteous &Prompt Behavior of Staff",
  "Good Food",
  "Support Provided for Senior Citizen, Divyangjan/Women",
  "Others",
];

const StarRating = ({ rating, setRating, onFocus }) => (
  <div className="flex flex-row gap-2 mt-2 mb-4">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        onClick={() => setRating(star)}
        onFocus={onFocus}
        tabIndex={0}
        className={`w-12 h-12 cursor-pointer transition-colors ${
          rating >= star ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
      </svg>
    ))}
  </div>
);

const AnubhavForm = () => {
  const [mode, setMode] = useState("Train");
  const [inputValue, setInputValue] = useState("");
  const [aspect, setAspect] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const { showAlert } = useGlobalAlert();
  const auth = useSelector((state) => state.auth);
  const { openLoginModal } = useLoginModal();
  const formRef = useRef();

  // Block interaction if not logged in
  const requireLogin = (e) => {
    if (!auth.isAuthenticated) {
      if (e) e.preventDefault && e.preventDefault();
      openLoginModal(1); // Open OTP tab by default
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
    showAlert("Thank you for your feedback!", "success");
  };

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className=""
      >
        <div className="topBar flex flex-col sm:flex-row w-full justify-between border-b-[1px] border-gray-300 pb-2 h-auto sm:h-12 mb-4 gap-2 sm:gap-0">
          <h2 className="text-[#930b3e] text-xl sm:text-2xl font-bold">
            Share Your Rail Experience
          </h2>
          <div className="flex gap-0.5 items-center">
            <span className="text-[#f05f40]">*</span>
            <span className="text-base sm:text-xl">Mandatory Fields</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex gap-0.5">
              <label className="text-[#7c7c7c] text-base sm:text-lg font-medium">
                Mode
              </label>
              <span className="text-[#f05f40]">*</span>
            </div>
            <select
              {...guardedProps}
              className="w-full border-[1px] h-11 sm:h-13 border-[#d9d9d9] p-2 text-base sm:text-xl bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb] mt-1"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              required
            >
              <option value="Train">Train</option>
              <option value="Station">Station</option>
            </select>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex gap-0.5">
              <label className="text-[#7c7c7c] text-base sm:text-lg font-medium">
                {mode === "Train" ? "Train No." : "Station Name"}
              </label>
              <span className="text-[#f05f40]">*</span>
            </div>
            <input
              {...guardedProps}
              className="w-full border-[1px] h-11 sm:h-13 border-[#d9d9d9] p-2 text-base sm:text-xl bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb] mt-1"
              type="text"
              placeholder={
                mode === "Train" ? "Enter Train Number" : "Enter Station Name"
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="w-full mt-4">
          <div className="flex gap-0.5">
            <label className="text-[#7c7c7c] text-base sm:text-lg font-medium">
              Positive Aspect
            </label>
            <span className="text-[#f05f40]">*</span>
          </div>
          <select
            {...guardedProps}
            className="w-full border-[1px] h-11 sm:h-13 border-[#d9d9d9] p-2 text-base sm:text-xl bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb] mt-1"
            value={aspect}
            onChange={(e) => setAspect(e.target.value)}
            required
          >
            <option value="">Select an aspect</option>
            {positiveAspects.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full mt-4">
          <div className="flex gap-0.5">
            <label className="text-[#7c7c7c] text-base sm:text-lg font-medium">
              Write your experience
            </label>
            <span className="text-[#f05f40]">*</span>
          </div>
          <textarea
            {...guardedProps}
            className="w-full border-[1px] h-32 sm:h-40 border-[#d9d9d9] p-2 flex items-center bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb] mt-1 text-base sm:text-xl"
            placeholder="Describe your experience..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="w-full mt-4">
          <div className="flex gap-0.5">
            <label className="text-[#7c7c7c] text-base sm:text-lg font-medium">
              Feedback
            </label>
          </div>
          <StarRating
            rating={rating}
            setRating={setRating}
            onFocus={requireLogin}
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
              setMode("Train");
              setInputValue("");
              setAspect("");
              setDescription("");
              setRating(0);
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </>
  );
};

export default AnubhavForm;
