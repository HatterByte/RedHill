import React, { useState } from "react";
import FAQModal from "./FAQModal";

const Footer = () => {
  const [faqOpen, setFaqOpen] = useState(false);
  return (
    <>
      <FAQModal open={faqOpen} onClose={() => setFaqOpen(false)} />
      <div className="flex flex-col md:flex-row w-full h-auto md:h-13 bg-[#75002b] justify-center md:justify-evenly items-center mt-auto px-2 py-3 gap-2 md:gap-0 text-center">
        <div className="text-white text-xs md:text-base">
          Copyright ©2024 REDHILL. All Rights Reserved.
        </div>
        <div className="text-white text-xs md:text-base flex flex-wrap justify-center gap-x-2 gap-y-1">
          <a
            href="https://railmadad.indianrailways.gov.in/madad/final/home.jsp"
            target="_blank"
            rel="noreferrer"
            className="hover:underline mr-1"
          >
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
          <a
            href="https://www.railmadad.in/railway-admin-login"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            Railway Admin Login
          </a>
        </div>
      </div>
    </>
  );
};

export default Footer;
