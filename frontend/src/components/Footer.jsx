import React, { useState } from "react";
import FAQModal from "./FAQModal";
import AdminLoginModal from "../admin/components/AdminLoginModal";
import { useGlobalAlert } from "../utils/AlertContext";

const Footer = () => {
  const [faqOpen, setFaqOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const { showAlert } = useGlobalAlert();

  return (
    <>
      <FAQModal open={faqOpen} onClose={() => setFaqOpen(false)} />
      {/* Blur overlay only when admin modal is open */}
      {adminOpen && (
        <div
          style={{
            position: "fixed",
            zIndex: 1200,
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            background: "rgba(0,0,0,0.08)",
            pointerEvents: "auto",
          }}
        />
      )}
      <AdminLoginModal
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        onSuccess={() => showAlert("Welcome, Admin!", "success")}
      />
      <div className="flex flex-col md:flex-row w-full h-auto md:h-13 bg-[#75002b] justify-center md:justify-evenly items-center mt-auto px-2 py-3 gap-2 md:gap-0 text-center">
        <div className="text-white text-xs md:text-base">
          Copyright ©2025 RedHill || All Rights Reserved.
        </div>
        <div className="text-white text-xs md:text-base flex flex-wrap justify-center gap-x-2 gap-y-1">
          <a href="/" className="hover:underline mr-1">
            Home
          </a>
          |
          <button
            type="button"
            className="hover:underline mr-1 bg-transparent border-none text-white cursor-pointer underline-offset-2"
            onClick={() => setFaqOpen(true)}
          >
            FAQs
          </button>
          |
          <button
            type="button"
            className="hover:underline bg-transparent border-none text-white cursor-pointer underline-offset-2"
            onClick={() => setAdminOpen(true)}
          >
            Admin Panel
          </button>
        </div>
      </div>
    </>
  );
};

export default Footer;
