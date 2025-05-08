import React,{useState} from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from 'react-redux';
import { loginWithPassword } from '../../actions/auth.actions';


const LoginWithPassword = ({formData,reset,setFormData,setPage}) => {
    const dispatch = useDispatch();
    const [verified,setVerified]=useState(false);
    const handleSubmit = (e) => {
        console.log("formData",formData);
        e.preventDefault();
        if(!formData.phone|| formData.phone.length != 10) {
            alert("Please enter a valid phone number.");
            return;
        }
        if(!formData.password|| formData.password.length < 6) {
            alert("Please enter a valid password.");
            return;
        }
        if(!verified) {
            alert("Please verify the reCAPTCHA.");
            return;
        }
        dispatch(loginWithPassword(formData.phone,formData.password));
        // console.log("Logging in with phone:", formData.phone, formData.password);
    };
    const handleChangeTruncate = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
        return value;
    };
    return (
        <form className='h-full' onSubmit={(e)=>handleSubmit(e)}>
            <div className="flex flex-col mt-8 h-full">
                {/* Fixed onChange handler by removing e.preventDefault() */}
                <input 
                    type="tel" 
                    inputMode="numeric" 
                    pattern="[0-9]*" 
                    value={formData.phone} 
                    onChange={(e) => {
                        setFormData({...formData, phone: handleChangeTruncate(e)});
                    }} 
                    placeholder='Phone Number' 
                    required
                    className='w-full border-[1px] h-10 border-[#d9d9d9] px-2 text-lg flex items-center text-[#4e4e4e] bg-[#f4f5f6] placeholder-[#757575] rounded-md focus:outline-0' 
                />

                <input 
                    type='password' 
                    value={formData.password} 
                    onChange={(e) => { setFormData({ ...formData, password: e.target.value }) }} 
                    placeholder='Password' 
                    required
                    className='w-full border-[1px] h-10 border-[#d9d9d9] px-2 text-lg flex items-center text-[#4e4e4e] bg-[#f4f5f6] placeholder-[#757575] rounded-md focus:outline-0 mt-4' 
                />

                <div 
                    className="text-[#75002b] text-lg self-end mt-1 cursor-pointer" 
                    onClick={(e) => setPage("forgotPassword")}
                >
                    Forget Password
                </div>
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

export default LoginWithPassword