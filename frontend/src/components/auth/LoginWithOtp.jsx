import React from 'react'
import ReCAPTCHA from "react-google-recaptcha";


const LoginWithOtp = ({reset,formData,setFormData,setPage}) => {
    const handleChangeTruncate = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
        return value;
    };
    return (
        <form className='h-full'>
            <div className="flex flex-col mt-8 h-full">
                <input 
                    type="tel" 
                    inputMode="numeric" 
                    pattern="[0-9]*" 
                    value={formData.phone} 
                    required
                    onChange={(e) => { setFormData({ ...formData, phone: (handleChangeTruncate(e)) }) }} 
                    placeholder='Phone Number' 
                    className='w-full border-[1px] h-10 border-[#d9d9d9] px-2 text-lg flex items-center text-[#4e4e4e] bg-[#f4f5f6] placeholder-[#757575] rounded-md focus:outline-0' 
                />
                <button 
                    type='button' 
                    className='bg-[#75002b] w-full text-white rounded-md h-9 mt-4 font-medium text-xl cursor-pointer'
                >
                    Generate OTP
                </button>
                <input 
                    type='text' 
                    inputMode='numeric' 
                    value={formData.otp} 
                    onChange={(e) => { setFormData({ ...formData, otp: handleChangeTruncate(e.target.value) }) }} 
                    placeholder='OTP' 
                    className='w-full border-[1px] h-10 border-[#d9d9d9] px-2 text-lg flex items-center text-[#4e4e4e] bg-[#f4f5f6] placeholder-[#757575] rounded-md focus:outline-0 mt-4' 
                />
            </div>

            <button 
                type='submit' 
                className='bg-[#75002b] w-full text-white rounded-md h-9 mt-12 font-bold text-xl cursor-pointer'
            >
                Submit
            </button>
            <div 
                className='text-[11px] mt-3 font-medium cursor-pointer hover:underline text-[#444444] text-end mr-2' 
                onClick={(e) => reset()}
            >
                Go Back
            </div>
        </form>
    )
}

export default LoginWithOtp