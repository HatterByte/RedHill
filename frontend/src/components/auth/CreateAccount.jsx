// import React from 'react'
import React,{use, useState} from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import { generateOtp,verifyOtp,signUp } from '../../actions/auth.actions';
import { useDispatch } from 'react-redux';

const CreateAccount = ({reset}) => {
    const [verified, setVerified] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        password:"",
        phone: "",
        otp: "",
    })
    const [confirmPassword,setConfirmPassword]=useState("");
        const dispatch = useDispatch();
        const handleChangeTruncate = (e) => {
            const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
            return value;
        };
        const handleGenerateOTP = () => {
            if(!formData.phone|| formData.phone.length != 10) {
                alert("Please enter a valid phone number.");
                return;
            }
            else dispatch(generateOtp(formData.phone));
            
            console.log("Generating OTP for:", formData.phone);
        };
        const handleSubmit = (e) => {
            e.preventDefault();
            if(!formData.phone|| formData.phone.length != 10) {
                alert("Please enter a valid phone number.");
                return;
            }
            if(formData.password!== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }
            if(!formData.otp|| formData.otp.length != 6) {
                alert("Please enter a valid OTP.");
                return;
            }
            if(!verified) {
                alert("Please verify the reCAPTCHA.");
                return;
            }
            // dispatch(verifyOtp(formData.phone,formData.otp));
            dispatch(signUp(formData.name,formData.phone,formData.password,formData.otp));
            console.log("Verifying OTP for:", formData.phone, formData.otp);
        };
  return (
    <form className='h-full' onSubmit={(e) => handleSubmit(e)}>
            <div className="flex flex-col mt-8 h-full">
                <input 
                    type="text" 
                    value={formData.name} 
                    required
                    onChange={(e) => { setFormData({ ...formData, name: e.target.value }) }} 
                    placeholder='Name' 
                    className='w-full border-[1px] h-10 border-[#d9d9d9] px-2 text-lg flex items-center text-[#4e4e4e] bg-[#f4f5f6] placeholder-[#757575] rounded-md focus:outline-0 mb-2' 
                />
                <input 
                    type="password" 
                    value={formData.password} 
                    required
                    onChange={(e) => { setFormData({ ...formData, password: e.target.value }) }} 
                    placeholder='Password' 
                    className='w-full border-[1px] h-10 border-[#d9d9d9] px-2 text-lg flex items-center text-[#4e4e4e] bg-[#f4f5f6] placeholder-[#757575] rounded-md focus:outline-0 mb-2' 
                />
                <input 
                    type="password" 
                    value={confirmPassword} 
                    required
                    onChange={(e) => {setConfirmPassword(e.target.value) }} 
                    placeholder='Confirm Password' 
                    className='w-full border-[1px] h-10 border-[#d9d9d9] px-2 text-lg flex items-center text-[#4e4e4e] bg-[#f4f5f6] placeholder-[#757575] rounded-md focus:outline-0 mb-2' 
                />
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
                    onClick={handleGenerateOTP}
                >
                    Generate OTP
                </button>
                <input 
                    type='text' 
                    inputMode='numeric' 
                    value={formData.otp} 
                    onChange={(e) => { setFormData({ ...formData, otp: handleChangeTruncate(e) }) }} 
                    placeholder='OTP' 
                    className='w-full border-[1px] h-10 border-[#d9d9d9] px-2 text-lg flex items-center text-[#4e4e4e] bg-[#f4f5f6] placeholder-[#757575] rounded-md focus:outline-0 mt-4' 
                />
            </div>
            <div className="mt-4">
                <ReCAPTCHA
                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                    onChange={(e) => { if (e) { setVerified(true) } }}
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

export default CreateAccount