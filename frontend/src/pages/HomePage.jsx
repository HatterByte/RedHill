import React, { useState } from "react";
import ResponsiveNavbar from "../components/Navbar";
import VerticalNavbar from "../components/VerticalNavbar";
import Trains from "../components/HomePageForm/trains";
import Footer from "../components/Footer";
import Auth from "../components/auth/Auth";
const HomePage = () => {
  const [activeTab, setActiveTab] = useState("train");
  return (
    <>
      <div className="flex flex-col-reverse items-center md:items-start md:flex-row md:justify-between p-2 sm:p-4 w-full h-auto min-h-full max-w-full overflow-x-auto">
        <div className="flex flex-wrap gap-y-2 w-full md:w-1/3 md:h-1/2 mt-10 md:mt-20 justify-center">
          {/* Responsive grid for icons */}
          <div className="w-1/2 sm:w-1/3 flex flex-col items-center justify-center p-2">
            <img
              src="/assets/HomePageImages/booking-icon-1.png"
              width={61}
              height={61}
              alt=""
            />
            <div className="text-white text-center mt-1 ">
              Ticket <br /> Booking
            </div>
          </div>
          <div className="w-1/2 sm:w-1/3 flex flex-col items-center justify-center p-2">
            <img
              src="/assets/HomePageImages/booking-icon-2.png"
              width={61}
              height={61}
              alt=""
            />
            <div className="text-white text-center mt-1 ">
              Train <br /> Enquiry
            </div>
          </div>
          <div className="w-1/2 sm:w-1/3 flex flex-col items-center justify-center p-2">
            <img
              src="/assets/HomePageImages/booking-icon-3.png"
              width={61}
              height={61}
              alt=""
            />
            <div className="text-white text-center mt-1 ">
              Reservation <br /> Enquiry
            </div>
          </div>
          <div className="w-1/2 sm:w-1/3 flex flex-col items-center justify-center p-2">
            <img
              src="/assets/HomePageImages/booking-icon-4.png"
              width={61}
              height={61}
              alt=""
            />
            <div className="text-white text-center mt-1 ">
              Retiring <br />
              Room Booking
            </div>
          </div>
          <div className="w-1/2 sm:w-1/3 flex flex-col items-center justify-center p-2">
            <img
              src="/assets/HomePageImages/booking-icon-5.png"
              width={61}
              height={61}
              alt=""
            />
            <div className="text-white text-center mt-1">
              Indian
              <br /> Railways
            </div>
          </div>
          <div className="w-1/2 sm:w-1/3 flex flex-col items-center justify-center p-2">
            <img
              src="/assets/HomePageImages/booking-icon-6.png"
              width={61}
              height={61}
              alt=""
            />
            <div className="text-white text-center mt-1 ">
              UTS <br />
              eTicketing
            </div>
          </div>
          <div className="w-1/2 sm:w-1/3 flex flex-col items-center justify-center p-2">
            <img
              src="/assets/HomePageImages/booking-icon-7.png"
              width={61}
              height={61}
              alt=""
            />
            <div className="text-white text-center mt-1 ">
              Freight <br /> Business
            </div>
          </div>
          <div className="w-1/2 sm:w-1/3 flex flex-col items-center justify-center p-2">
            <img
              src="/assets/HomePageImages/booking-icon-2.png"
              width={61}
              height={61}
              alt=""
            />
            <div className="text-white text-center mt-1 ">
              Railway <br />
              Parcel Website
            </div>
          </div>
        </div>
        <div className="w-full md:w-7/12 box-border flex flex-col md:flex-row justify-center m-2 sm:m-4 md:m-8 min-h-full">
          <VerticalNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="main-form flex flex-col flex-grow w-full min-h-150 bg-[rgba(255,255,255,0.9)] p-2 sm:p-6 border-l-0 md:border-l-[6px] border-[#f58220] shadow-[0_0_30px_rgba(0,0,0,0.7)] md:shadow-[0_0_50px_rgba(0,0,0,0.9)]">
            <Trains />
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default HomePage;
