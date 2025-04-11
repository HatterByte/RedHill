import React, { useState } from 'react'
import ResponsiveNavbar from '../components/Navbar'
import VerticalNavbar from '../components/VerticalNavbar'
import Trains from '../components/HomePageForm/trains'
import Footer from '../components/Footer'
import Auth from '../components/auth/Auth'
const HomePage = () => {
    const [activeTab, setActiveTab] = useState('train');
    const [openLogin, setOpenLogin] = useState(false);
    const [toggleLogin, setToggleLogin] = useState(false);
    console.log("Hello Mihir")
    return (
        <div className="h-auto min-h-screen w-full flex flex-col">
            {openLogin&&<Auth setOpenLogin={setOpenLogin} toggleLogin={toggleLogin} setToggleLogin={setToggleLogin}/>}
            <ResponsiveNavbar setOpenLogin={setOpenLogin} setToggleLogin={setToggleLogin} />
            <div className="flex flex-col-reverse items-center min-[1150px]:items-start min-[1150px]:flex-row min-[1150px]:justify-between p-4 min-w-[1250px]:p-10 w-full h-auto min-h-full">
                <div className="flex flex-wrap gap-y-2 min-[1150px]:w-1/3 min-[1150px]:h-1/2 mt-20">
                    <div className="w-1/4 max-sm:w-1/3 flex flex-col items-center justify-center">
                        <img src="/assets/HomePageImages/booking-icon-1.png" width={61} height={61} alt="" />
                        <div className="text-white text-center mt-1 ">Ticket <br /> Booking</div>
                    </div>
                    <div className="w-1/4 max-sm:w-1/3 flex flex-col items-center justify-center">
                        <img src="/assets/HomePageImages/booking-icon-2.png" width={61} height={61} alt="" />
                        <div className="text-white text-center mt-1 ">Train <br /> Enquiry</div>
                    </div>
                    <div className="w-1/4 max-sm:w-1/3 flex flex-col items-center justify-center">
                        <img src="/assets/HomePageImages/booking-icon-3.png" width={61} height={61} alt="" />
                        <div className="text-white text-center mt-1 ">Reservation <br /> Enquiry</div>
                    </div>
                    <div className="w-1/4 max-sm:w-1/3 flex flex-col items-center justify-center">
                        <img src="/assets/HomePageImages/booking-icon-4.png" width={61} height={61} alt="" />
                        <div className="text-white text-center mt-1 ">Retiring <br />Room Booking</div>
                    </div>
                    <div className="w-1/4 max-sm:w-1/3 flex flex-col items-center justify-center">
                        <img src="/assets/HomePageImages/booking-icon-5.png" width={61} height={61} alt="" />
                        <div className="text-white text-center mt-1">Indian<br /> Railways</div>
                    </div>
                    <div className="w-1/4 max-sm:w-1/3 flex flex-col items-center justify-center">
                        <img src="/assets/HomePageImages/booking-icon-6.png" width={61} height={61} alt="" />
                        <div className="text-white text-center mt-1 ">UTS <br />eTicketing</div>
                    </div>
                    <div className="w-1/4 max-sm:w-1/3 flex flex-col items-center justify-center">
                        <img src="/assets/HomePageImages/booking-icon-7.png" width={61} height={61} alt="" />
                        <div className="text-white text-center mt-1 ">Freight <br /> Business</div>
                    </div>
                    <div className="w-1/4 max-sm:w-1/3 flex flex-col items-center justify-center">
                        <img src="/assets/HomePageImages/booking-icon-2.png" width={61} height={61} alt="" />
                        <div className="text-white text-center mt-1 ">Railway <br />Parcel Website</div>
                    </div>

                </div>
                <div className="min-[1150px]:w-7/12 box-border flex justify-center m-4 min-[1250px]:m-8 min-h-full">
                    <VerticalNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="main-form flex flex-col flex-grow w-full min-h-150 bg-[rgba(255,255,255,0.9)] p-6.25 border-l-[6px] border-[#f58220] shadow-[0_0_50px_rgba(0,0,0,0.9)]">
                    <Trains />
                        
                    </div>

                </div>
            </div>
            <Footer />


        </div>
        

    )
}

export default HomePage