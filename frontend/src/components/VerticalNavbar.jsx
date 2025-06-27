import React, { useState } from "react";

const VerticalNavbar = ({ activeTab, setActiveTab }) => {
  return (
    <>
      <div className="flex flex-row md:flex-col w-full md:w-45 mt-2 md:mt-5 z-1 overflow-x-auto md:overflow-x-visible">
        {/* Each tab is now more responsive */}
        <div
          key={"train"}
          className={`flex flex-col relative items-center justify-center w-24 md:w-full p-2 md:p-3 border-b-0 md:border-b-[1px] border-b-[#9e2452] cursor-pointer gap-1 ${
            activeTab == "train" ? "bg-[#75002b]" : "bg-[#930b3e]"
          } `}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("train");
          }}
        >
          <img
            src="/assets/HomePageFormNav/train.svg"
            alt="station"
            height={40}
            width={40}
            className="md:h-[55px] md:w-[55px]"
          />
          <span className="text-white text-xs md:text-lg">{"Train"}</span>
          {activeTab === "train" && (
            <>
              <div className="hidden md:block absolute w-[5px] h-full left-[100%] top-0 bg-[#75002b]"></div>
              <div className="hidden md:block absolute left-[100%] top-[50%] w-0 h-0 mt-[-3px] border-t-[6px] border-t-transparent border-r-[6px] border-r-[rgba(255,255,255,0.9)] border-b-[6px] border-b-transparent"></div>
            </>
          )}
        </div>
        <div
          key={"Anubhav"}
          className={`flex flex-col relative items-center justify-center w-24 md:w-full p-2 md:p-3 border-b-0 md:border-b-[1px] border-b-[#9e2452] cursor-pointer gap-1 ${
            activeTab == "Anubhav" ? "bg-[#75002b]" : "bg-[#930b3e]"
          } `}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("Anubhav");
          }}
        >
          <img
            src="/assets/HomePageImages/notepad (2).png"
            alt="station"
            height={40}
            width={40}
            className="md:h-[55px] md:w-[55px]"
          />
          <div className="text-center">
          <span className="text-white text-xs md:text-lg">{"Appreciation/\nRail Anubhav"}</span>
          </div>
          {activeTab === "Anubhav" && (
            <>
              <div className="hidden md:block absolute w-[5px] h-full left-[100%] top-0 bg-[#75002b]"></div>
              <div className="hidden md:block absolute left-[100%] top-[50%] w-0 h-0 mt-[-3px] border-t-[6px] border-t-transparent border-r-[6px] border-r-[rgba(255,255,255,0.9)] border-b-[6px] border-b-transparent"></div>
            </>
          )}
        </div>
        <div
          key={"Track"}
          className={`flex flex-col relative items-center justify-center w-24 md:w-full p-2 md:p-3 border-b-0 md:border-b-[1px] border-b-[#9e2452] cursor-pointer gap-1 ${
            activeTab == "Track" ? "bg-[#75002b]" : "bg-[#930b3e]"
          } `}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("Track");
          }}
        >
          <img
            src="/assets/HomePageImages/progress (1).png"
            alt="station"
            height={40}
            width={40}
            className="md:h-[55px] md:w-[55px]"
          />
          <div className="text-center">
          <span className="text-white text-xs md:text-lg ">{"Track Your Concern"}</span>
          </div>
          {activeTab === "Track" && (
            <>
              <div className="hidden md:block absolute w-[5px] h-full left-[100%] top-0 bg-[#75002b]"></div>
              <div className="hidden md:block absolute left-[100%] top-[50%] w-0 h-0 mt-[-3px] border-t-[6px] border-t-transparent border-r-[6px] border-r-[rgba(255,255,255,0.9)] border-b-[6px] border-b-transparent"></div>
            </>
          )}
        </div>
        <div
          key={"Suggestion"}
          className={`flex flex-col relative items-center justify-center w-24 md:w-full p-2 md:p-3 border-b-0 md:border-b-[1px] border-b-[#9e2452] cursor-pointer gap-1 ${
            activeTab == "Suggestion" ? "bg-[#75002b]" : "bg-[#930b3e]"
          } `}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("Suggestion");
          }}
        >
          <img
            src="/assets/HomePageImages/feedback.png"
            alt="station"
            height={40}
            width={40}
            className="md:h-[55px] md:w-[55px]"
          />
          <span className="text-white text-xs md:text-lg">{"Suggestion"}</span>
          {activeTab === "Suggestion" && (
            <>
              <div className="hidden md:block absolute w-[5px] h-full left-[100%] top-0 bg-[#75002b]"></div>
              <div className="hidden md:block absolute left-[100%] top-[50%] w-0 h-0 mt-[-3px] border-t-[6px] border-t-transparent border-r-[6px] border-r-[rgba(255,255,255,0.9)] border-b-[6px] border-b-transparent"></div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default VerticalNavbar;
