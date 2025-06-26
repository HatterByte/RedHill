import React from "react";

const Footer = () => {
  return (
    <>
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
          <a
            href="https://railmadad.indianrailways.gov.in/madad/final/home.jsp"
            target="_blank"
            rel="noreferrer"
            className="hover:underline mr-1"
          >
            FAQs
          </a>
          |
          <a
            href="https://www.railmadad.in/railway-admin-login"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            Railway Admin Login
          </a>
          |
          <a
            href="https://www.railmadad.in/mis-report-login"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            MIS Report Login
          </a>
        </div>
      </div>
    </>
  );
};

export default Footer;
