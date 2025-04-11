import React, { useState } from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import LoginWithPassWord from './LoginWithPassword';
import LoginWithOtp from './LoginWithOtp';
import ForgotPassword from './ForgotPassword';

const LoginPortal = ({ setToggleLogin }) => {
    const handleChangeTruncate = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
        return value;
    };
    
    const [formData, setFormData] = useState({
        phone: "",
        password: "",
        otp: "",
    })
    const [verified, setVerified] = useState(false);
    const [page, setPage] = useState("Home");

    const reset = () => {
        setPage("Home")
        setFormData({
            phone: "",
            password: "",
            otp: "",
        })
    }


    const Home = () => {
        return (
            <div className='flex-1 flex flex-col justify-center items-center'>
                <button 
                    type='button' 
                    className="rounded-lg w-full py-0.5 font-semibold text-lg cursor-pointer border-2 border-[#e6e6e6] text-[#900b3d] mb-5" 
                    onClick={(e) => { setPage("withPassword") }}
                >
                    Login With Password
                </button>
                <button 
                    type='button' 
                    className="rounded-lg w-full py-0.5 font-semibold text-lg cursor-pointer border-2 border-[#e6e6e6] text-[#900b3d]" 
                    onClick={(e) => { setPage("withOTP") }}
                >
                    Login with OTP
                </button>
                <span 
                    className='text-[11px] mt-3 font-medium cursor-pointer hover:underline' 
                    onClick={(e) => setToggleLogin(true)}
                >
                    Create An Account
                </span>
            </div>
        )
    }

    return (
        <>
            {page === "withPassword"
                ? <LoginWithPassWord formData={formData} setFormData={setFormData} setPage={setPage} reset={reset} />
                : page === "withOTP"
                    ? <LoginWithOtp formData={formData} setFormData={setFormData} setPage={setPage} reset={reset}  />
                    : page === "forgotPassword"
                        ? <ForgotPassword formData={formData} setFormData={setFormData} setPage={setPage} reset={reset} />
                        : <Home />
            }
        </>
    )
}

export default LoginPortal