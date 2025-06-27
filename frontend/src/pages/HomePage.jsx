import React, { useState } from "react";
import ResponsiveNavbar from "../components/Navbar";
import VerticalNavbar from "../components/VerticalNavbar";
import Trains from "../components/HomePageForm/trains";
import AnubhavForm from "../components/HomePageForm/AnubhavForm";
import Footer from "../components/Footer";
import Auth from "../components/auth/Auth";
import HomePageIconGrid from "../components/HomePageIconGrid";
import SuggestionsForm from "../components/HomePageForm/SuggestionsForm";
import TrackConcernForm from "../components/HomePageForm/TrackConcernForm";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("train");
  return (
    <>
      <div className="flex flex-col-reverse items-stretch md:items-start md:flex-row md:justify-between p-2 sm:p-4 w-full min-h-screen">
        <div className="flex w-full md:w-1/3 md:sticky md:top-0 md:h-screen">
          <div className="flex w-full justify-center items-center">
            <HomePageIconGrid />
          </div>
        </div>
        <div className="w-[95%] mx-auto md:w-7/12 box-border flex flex-col md:flex-row justify-center md:m-8 min-h-full">
          <VerticalNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="main-form flex flex-col flex-grow w-full min-h-150 bg-white/90 backdrop-blur-sm px-3 py-4 sm:p-6 border-l-0 md:border-l-[6px] border-[#f58220] shadow-[0_0_30px_rgba(0,0,0,0.7)] md:shadow-[0_0_50px_rgba(0,0,0,0.9)]">
            {activeTab === "train" && <Trains />}
            {activeTab === "Anubhav" && <AnubhavForm />}
            {activeTab === "Suggestion" && <SuggestionsForm />}
            {activeTab === "Track" && <TrackConcernForm />}
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default HomePage;
