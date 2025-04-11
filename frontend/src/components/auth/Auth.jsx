import React, { useState } from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import LoginModal from './LoginModal';

const Auth = ({ setOpenLogin,toggleLogin,setToggleLogin }) => {
    // const handleChangeTruncate = (e) => {
    //     const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    //     return value;
    // };
    // const [formData, setFormData] = useState({
    //     phone: "",
    //     password: "",
    // })
    // const [verified, setVerified] = useState(false);
    return (
        <>
            <div className="flex fixed flex-col min-h-[55vh] bg-white w-[90vw] max-w-[550px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">

                {/* Cros Button */}
                <div className="h-full w-full relative">
                    <div className="h-[1.75rem] w-[1.75rem] rounded-full bg-orange-400 absolute right-[-0.875rem] top-[-0.875rem] cursor-pointer" onClick={(e) => setOpenLogin(false)}></div>
                </div>

                <div className="flex flex-col flex-1 w-full p-5 mt-2">

                    <div className="flex gap-2">
                        <button type='button' className={`rounded-lg px-8 py-0.5 font-semibold text-lg cursor-pointer  ${toggleLogin?"border-2 border-[#e6e6e6]  text-[#900b3d]":"bg-[#900b3d]  text-white"}  `} onClick={(e)=>{setToggleLogin(false)}}>Complaint Login</button>
                        <button type='button' className={`rounded-lg px-8 py-0.5 font-semibold text-lg cursor-pointer  ${!toggleLogin?"border-2 border-[#e6e6e6]  text-[#900b3d]":"bg-[#900b3d]  text-white"}`} onClick={(e)=>{setToggleLogin(true)}}>Create Account</button>
                    </div>

                    {!toggleLogin&&
                        <LoginModal setToggleLogin={setToggleLogin}/>
                        
                    }
                    

                </div>



            </div>
            <div className="fixed bg-black opacity-[0.91] h-screen w-screen z-9" onClick={(e) => setOpenLogin(false)}></div>
        </>
    )
}

export default Auth