import React, { useRef, useEffect, useState } from "react";
import Auth from "./auth/Auth";
import { connect } from "react-redux";
import NavbarUserModal from "./User/NavbarUserModal";
import { useNavigate } from "react-router-dom";
import { useLoginModal } from "../utils/LoginModalContext";
function Navbar(props) {
  const [userModal, setUserModal] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef();
  const { openLoginModal, open, defaultTab, setOpen } = useLoginModal();

  useEffect(() => {
    // Prevent duplicate script loading
    if (!document.querySelector("#google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    // Ensure the function is globally available
    window.googleTranslateElementInit = () => {
      if (!window.google || !window.google.translate) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
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
  useEffect(() => {
    if (props.user) {
      setOpen(false);
    }
  }, [props.user]);
  useEffect(() => {
    console.log(userModal);
  }, [userModal]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setUserModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <>
      {open && (
        <Auth
          setOpenLogin={setOpen}
          toggleLogin={defaultTab === 1}
          setToggleLogin={() => {}}
        />
      )}
      <div className="w-full flex justify-around items-center px-1 lg:py-4 bg-white flex-wrap md:flex-wrap lg:flex-nowrap">
        <div className="leftThing flex items-center p-1 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}>
          <div className="leftImg bg-">
            <img
              src="../assets/HomePageImages/logog20.png"
              alt=""
              className=" h-14 xl:h-16 w-40"
            />
          </div>
          <div
            className="Headingg flex flex-col ml-3 max-w-[200px] lg:max-w-[350px] "
          >
            <div className="RedHill flex text-[#75002b] text-3xl xl:text-5xl font-bold">
              RedHill
            </div>
            <div className="text-black flex md:font-medium md-text-md text-sm ">
              For Inquiry, Assistance & Grievance Redressal
            </div>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-phone"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <div className="text-white text-xl lg:text-2xl xl:text-3xl font-semibold ml-1">
              139
            </div>
          </div>
          <div className="text-sm md:text-lg xl:text-xl ml-2 leading-tight">
            for Security/Medical Assistance
          </div>
        </div>
        <div className="endThing flex items-center  gap-4">
          {props.isAuthenticated ? (
            <div ref={modalRef} className="relative">
              <button
                type="button"
                className="max-w-55 relative flex justify-center items-center h-8 text-[#65002b] rounded-sm text-lg md:h-10 active:outline-0"
                onClick={(e) => {
                  e.preventDefault();
                  setUserModal((prev) => !prev);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  fill="#65002bda"
                  className="mr-2 w-4 h-5 shrink-0 cursor-pointer"
                >
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
                </svg>
                <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px] md:max-w-[125px] cursor-pointer">
                  {props.user?.name || "User"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  fill="#65002bda"
                  className="ml-2 w-4 h-4 shrink-0 cursor-pointer"
                >
                  <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
                </svg>
              </button>

              {userModal && (
                <div className="absolute top-full right-0 z-50 mt-2">
                  <NavbarUserModal
                    userModal={userModal}
                    setUserModal={setUserModal}
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                type="button"
                className="bg-[#dcdef9] w-22 h-8 rounded-sm text-sm md:text-md md:h-10 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  openLoginModal();
                }}
              >
                Login
              </button>
              <button
                type="button"
                className="bg-[#efe4e8] w-22 h-8 flex justify-center items-center rounded-sm text-sm md:text-md md:h-10 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  openLoginModal();
                }}
              >
                Sign Up
              </button>
            </>
          )}

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

          <div id="google_translate_element"></div>
          {/* <button type='button' className='bg-gray-500'>Login</button> */}
        </div>
      </div>
      <div className="w-full "></div>
      <div className="w-full hidden"></div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
  };
};
export default connect(mapStateToProps)(Navbar);
