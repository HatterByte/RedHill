import React,{useEffect,useState} from 'react'
import Auth from './auth/Auth'
export default function Navbar() {
    const [openLogin, setOpenLogin] = useState(false);
    const [toggleLogin, setToggleLogin] = useState(false);
    useEffect(() => {
        // Prevent duplicate script loading
        if (!document.querySelector("#google-translate-script")) {
          const script = document.createElement("script");
          script.id = "google-translate-script";
          script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
          script.async = true;
          document.body.appendChild(script);
        }
    
        // Ensure the function is globally available
        window.googleTranslateElementInit = () => {
          if (!window.google || !window.google.translate) return;
          new window.google.translate.TranslateElement(
            { pageLanguage: "en",
                includedLanguages: "en,hi,bn,mr,gu,kn,ml,pa,or,sa,ta,te,ur,mai", // Only these languages
             },
            "google_translate_element"
          );
        };
    
        // If script is already loaded, manually initialize
        if (window.google && window.google.translate) {
          window.googleTranslateElementInit();
        }
      }, []);
    return (
        <>
            {openLogin&&<Auth setOpenLogin={setOpenLogin} toggleLogin={toggleLogin} setToggleLogin={setToggleLogin}/>}
            <div className="w-full flex justify-around items-center px-1 lg:py-4 bg-white flex-wrap md:flex-wrap lg:flex-nowrap">
                <div className="leftThing flex items-center p-1">
                    <div className="leftImg bg-">
                        <img src="https://railmadad.indianrailways.gov.in/madad/final/images/logog20.png" alt="" className=' h-14 xl:h-16 w-40' />
                    </div>
                    <div className="Headingg flex flex-col ml-3 max-w-[200px] lg:max-w-[350px]">
                        <div className="RailMadad flex text-[#75002b] text-3xl xl:text-5xl font-bold">RailMadad</div>
                        <div className="text-black flex md:font-medium md-text-md text-sm ">For Inquiry, Assistance & Grievance Redressal</div>
                    </div>

                </div>
                <div className="midThing flex items-center">
                    <style>
                        {`
                            @keyframes color_change {
                                0% {     background-color: #930b3e; }
                                100% {background-color: #f58423;}
                            }
                            .color-animation {
                                animation: color_change 1s infinite alternate;
                           }
                        `}
                    </style>
                    <div className="md:h-10 lg:h-14 h-9 w-22 md:w-24 lg:w-28 color-animation rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        <div className="text-white text-xl lg:text-2xl xl:text-3xl font-semibold ml-1">139</div>
                    </div>
                    <div className="text-sm md:text-lg xl:text-xl ml-2 leading-tight">for Security/Medical Assistance</div>

                </div>
                <div className="endThing flex items-center  gap-2">
                    <button type='button' className='bg-[#dcdef9] w-22 h-8 rounded-sm text-sm md:text-md md:h-10 cursor-pointer' onClick={(e)=>{e.preventDefault();setOpenLogin(true);}}>Login</button>
                    <button type='button' className='bg-[#efe4e8] w-22 h-8 flex justify-center items-center rounded-sm text-sm md:text-md md:h-10 cursor-pointer' onClick={(e)=>{e.preventDefault();setToggleLogin(true);setOpenLogin(true)}}>Sign Up</button>

                    <style>
                        {`
                        #google_translate_element select {
                            background-color: white;
                            color: black;
                            border: 1px solid #ddd;
                            padding: 0.5rem;
                            border-radius: 5px;
                            font-size:1rem
                        }
                        
                        .goog-te-gadget {
                            font-size: 0px !important;
                            font-family: Arial, sans-serif;
                            color:white;
                            
                        }

                        .goog-logo-link, .goog-te-gadget span {
                            display: none !important;
                        }

                        .goog-te-banner-frame {
                            display: none !important;
                        }
                        `}
                    </style>

                    <div id='google_translate_element'></div>
                    {/* <button type='button' className='bg-gray-500'>Login</button> */}
                </div>
            </div>
            <div className="w-full ">
            </div>
            <div className="w-full hidden">
            </div>
        </>
    );
}
