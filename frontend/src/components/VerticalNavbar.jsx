import React, { useState } from 'react';

const VerticalNavbar = ({ activeTab, setActiveTab }) => {
    return (
        <>
            <div className="flex flex-col w-45 mt-5 z-1">
                <div key={"train"} className={`flex flex-col relative items-center justify-center w-full p-3 border-b-[1px] border-b-[#9e2452] cursor-pointer gap-1 ${activeTab == 'train' ? 'bg-[#75002b]' : 'bg-[#930b3e]'} `} onClick={(e) => {e.preventDefault();console.log("clicked");setActiveTab("train")}}>

                    <img src="/assets/HomePageFormNav/train.svg" alt="station" height={55} width={55} />
                    <span className="text-white  text-lg">{"TRAIN"}</span>
                    {activeTab ==="train" &&<><div className="absolute w-[5px] h-full left-[100%] top-0 bg-[#75002b]"></div>
                    <div className="absolute left-[100%] top-[50%] w-0 h-0 mt-[-3px] border-t-[6px] border-t-transparent border-r-[6px] border-r-[rgba(255,255,255,0.9)] border-b-[6px] border-b-transparent"></div></>}
                </div>
                <div key={"Anubhav"} className={`flex flex-col relative items-center justify-center w-full p-3 border-b-[1px] border-b-[#9e2452] cursor-pointer gap-1 ${activeTab == 'Anubhav' ? 'bg-[#75002b]' : 'bg-[#930b3e]'} `} onClick={(e) => {e.preventDefault();console.log("clicked");setActiveTab("Anubhav")}}>

                    <img src="/assets/HomePageImages/notepad (2).png" alt="station" height={55} width={55} />
                    <span className="text-white  text-lg">{"Anubhav"}</span>
                    {activeTab ==="Anubhav" &&<><div className="absolute w-[5px] h-full left-[100%] top-0 bg-[#75002b]"></div>
                    <div className="absolute left-[100%] top-[50%] w-0 h-0 mt-[-3px] border-t-[6px] border-t-transparent border-r-[6px] border-r-[rgba(255,255,255,0.9)] border-b-[6px] border-b-transparent"></div></>}
                </div>
                <div key={"Track"} className={`flex flex-col relative items-center justify-center w-full p-3 border-b-[1px] border-b-[#9e2452] cursor-pointer gap-1 ${activeTab == 'Track' ? 'bg-[#75002b]' : 'bg-[#930b3e]'} `} onClick={(e) => {e.preventDefault();console.log("clicked");setActiveTab("Track")}}>

                    <img src="/assets/HomePageImages/progress (1).png" alt="station" height={55} width={55} />
                    <span className="text-white  text-lg">{"Track"}</span>
                    {activeTab ==="Track" &&<><div className="absolute w-[5px] h-full left-[100%] top-0 bg-[#75002b]"></div>
                    <div className="absolute left-[100%] top-[50%] w-0 h-0 mt-[-3px] border-t-[6px] border-t-transparent border-r-[6px] border-r-[rgba(255,255,255,0.9)] border-b-[6px] border-b-transparent"></div></>}
                </div>
                <div key={"Suggestion"} className={`flex flex-col relative items-center justify-center w-full p-3 border-b-[1px] border-b-[#9e2452] cursor-pointer gap-1 ${activeTab == 'Suggestion' ? 'bg-[#75002b]' : 'bg-[#930b3e]'} `} onClick={(e) => {e.preventDefault();console.log("clicked");setActiveTab("Suggestion")}}>

                    <img src="/assets/HomePageImages/feedback.png" alt="station" height={55} width={55} />
                    <span className="text-white  text-lg">{"Suggestion"}</span>
                    {activeTab ==="Suggestion" &&<><div className="absolute w-[5px] h-full left-[100%] top-0 bg-[#75002b]"></div>
                    <div className="absolute left-[100%] top-[50%] w-0 h-0 mt-[-3px] border-t-[6px] border-t-transparent border-r-[6px] border-r-[rgba(255,255,255,0.9)] border-b-[6px] border-b-transparent"></div></>}
                </div>


                



            </div>
        </>
    );
};

export default VerticalNavbar;