import React, { useState, useEffect } from 'react'
import data from '../../assets/categoryData.json'
import RecaptchaButton from '../../utils/Recaptcha.jsx'
import { connect, useDispatch } from 'react-redux'
import { generateOtp, verifyOtp } from '../../actions/auth.actions'
import { getUser } from '../../actions/auth.actions'
import ReCAPTCHA from "react-google-recaptcha";

const Trains = (props) => {
    // console.log("Trains")
    const dispatch = useDispatch()
    const [disabled, setDisabled] = useState(true)
    const [toggle, setToggle] = useState(false)
    const [otp, setOtp] = useState('')
    const [masterOtp, setMasterOtp] = useState('')
    const [formData, setFormData] = useState({
        phone: '',
        pnr: '',
        type: '',
        subtype: '',
        media: [],
        description: '',
    });
    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
        return value;
    };
    function handleGenerateOTP() {
        if (formData.phone.length !== 10) {
            alert("enter a valid Phone");
            return;
        }
        dispatch(generateOtp(formData.phone));
    }
    const check = () => {
        if (otp.length !== 6) {
            alert("enter a valid OTP");
            return;
        }
        dispatch(verifyOtp(formData.phone, otp))

    }

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        const updatedFiles = [...formData.media, ...newFiles].slice(0, 5);
        console.log(updatedFiles);
        setFormData({ ...formData, media: updatedFiles });
    };

    const removeFile = (indexToRemove, e) => {
        e.preventDefault();
        console.log(indexToRemove);
        // const arr=(files.filter((_, index) => index !== indexToRemove))
        setFormData({ ...formData, media: (formData.media.filter((_, index) => index !== indexToRemove)) });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    }
    // if (props.auth.loading) {
    //     return (
    //         <>Loading...</>
    //     )
    // }
    useEffect(() => {
        if (props.auth.isAuthenticated) {
            setDisabled(false)
        }
        else {
            if (disabled === false) {
                setFormData({
                    phone: '',
                    pnr: '',
                    type: '',
                    subtype: '',
                    media: [],
                    description: '',
                });
                setOtp('');
            }
            setDisabled(true)
        }
    }, [props.auth])
    useEffect(() => {
        if (props.otp.otpGenerated) {
            setToggle(true)
        }
    }, [props.otp])

    return (
        <>
            <div className="topBar flex flex-row w-full justify-between border-b-[1px] border-[#d9d9d9] pb-2 h-12">
                <h2 className='text-[#930b3e] text-2xl font-bold'>Grievance Detail</h2>
                <div className="flex gap-0.5">
                    <span className='text-[#f05f40]'>*</span>
                    <span className='text-xl'>Mandatory Fields</span>
                </div>
            </div>
            {disabled &&
                <form className='PhoneNumber mt-5' onSubmit={(e) => { e.preventDefault(); check() }}>
                    <div className="flex gap-0.5">
                        <div className="text-[#7c7c7c] text-lg font-medium">Mobile No.</div>
                        <span className='text-[#f05f40]'>*</span>

                    </div>
                    <div className="flex gap-4 mt-1">
                        <input type="tel" inputMode="numeric" pattern="[0-9]*" value={formData.phone} onChange={(e) => { setFormData({ ...formData, phone: (handleChange(e)) }) }} className='w-4/9 border-[1px] h-13 border-[#d9d9d9] p-2 text-2xl flex items-center  bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb]' />
                        {!toggle && <button type='button' className='bg-[#75002b] w-28 h-13 text-white p-2 rounded-lg cursor-pointer hover:bg-[#f58220] transition-all duration-500 ease-in-out ' onClick={(e) => { e.preventDefault(); handleGenerateOTP() }}>Send OTP</button>}
                    </div>
                    {toggle && <>

                        <div className="flex gap-0.5">
                            <div className="text-[#7c7c7c] text-lg font-medium">OTP</div>
                            <span className='text-[#f05f40]'>*</span>

                        </div>
                        <div className="flex gap-15 mt-1">
                            <input type="text" inputMode="numeric" pattern="[0-9]*" value={otp} onChange={(e) => { setOtp(handleChange(e)) }} className='w-2/9 border-[1px] h-13 border-[#d9d9d9] p-2 text-2xl flex items-center  bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb]' />

                            <button type='submit' className={`bg-[#75002b] w-28 h-13 text-white p-2 rounded-lg cursor-pointer hover:bg-[#f58220] transition-all duration-500 ease-in-out ${otp.length != 6 ? "opacity-[0.6]" : ""}`}>Submit</button>
                            <button type='button' className={`bg-[#75002b] w-40 h-13 text-white p-2 rounded-lg cursor-pointer hover:bg-[#f58220] transition-all duration-500 ease-in-out `} onClick={(e) => { e.preventDefault(); generateOTP() }}>Resend OTP</button>
                        </div>

                    </>}
                </form>
            }

            <form className={`mt-6 relative ${disabled ? "opacity-[0.6]" : ""}`} onSubmit={(e) => { handleSubmit(e) }}>
                {disabled && <>
                    <div className="h-full w-full z-2 bg-black opacity-0 absolute"></div>
                </>}
                <div className="w-full">
                    <div className="flex gap-0.5">
                        <div className="text-[#7c7c7c] text-lg font-medium">PNR No.</div>
                        <span className='text-[#f05f40]'>*</span>
                    </div>
                    <input type="tel" inputMode="numeric" pattern="[0-9]*" value={formData.pnr} onChange={(e) => { setFormData({ ...formData, pnr: (handleChange(e)) }) }} className='w-4/9 border-[1px] h-13 border-[#d9d9d9] p-2 text-2xl flex items-center  bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb]' />
                </div>
                <div className="w-full flex justify-between">

                    <div className="w-[48%] mt-3">
                        <div className="flex gap-0.5">
                            <div className="text-[#7c7c7c] text-lg font-medium">Type</div>

                        </div>

                        <select className={`w-full border-[1px] h-13 border-[#d9d9d9] p-2 text-xl  bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb] mt-1`} value={formData.type} onChange={(e) => { setFormData({ ...formData, type: e.target.value, subtype: '' }); }} >
                            <option value="" disabled className='text-[#7c7c7c]'>--select--</option>
                            {Object.keys(data).map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>

                    </div>
                    <div className={`w-[48%] mt-3 relative ${!disabled && !formData.type ? "opacity-[0.6]" : ""}`}>
                        {!disabled && !formData.type && <div className="h-full w-full z-2 bg-black opacity-0 absolute"></div>}
                        <div className="flex gap-0.5">
                            <div className="text-[#7c7c7c] text-lg font-medium">Sub-Type</div>

                        </div>

                        <select className='w-full border-[1px] h-13 border-[#d9d9d9] p-2 text-xl  bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb] mt-1' value={formData.subtype} onChange={(e) => { setFormData({ ...formData, subtype: e.target.value }); }} >
                            <option value="" disabled>--select--</option>
                            {formData.type && data[formData.type].map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>

                    </div>



                </div>

                <div className="border-[1px] min-h-13 border-[#d9d9d9] text-xl  bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb] pl-2 w-5/9 mt-6">
                    {formData.media.length === 0 ? (
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Select files</span>
                            <button type='button'
                                className=" text-center w-25 h-13 cursor-pointer relative rounded-md transition-colors  bg-[#b4b4b4] text-[#fff] hover:bg-[#75002b]"
                            >
                                Browse
                                <input
                                    type="file"
                                    className="absolute  w-25 h-13 z-1  left-0 top-0 opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png,.mp4"
                                    multiple
                                />
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="space-y-2">
                                {formData.media.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
                                    >
                                        <span className="truncate max-w-[70%]">{file.name}</span>
                                        <button
                                            onClick={(e) => removeFile(index, e)}
                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {formData.media.length < 5 && (
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-gray-500">Add more</span>
                                    <button type='button'
                                        className="bg-[#b4b4b4] text-[#fff]  hover:bg-[#75002b] text-center w-25 h-13 cursor-pointer relative rounded-md  transition-colors"
                                    >
                                        Browse
                                        <input
                                            type="file"
                                            className="absolute  w-25 h-13 z-1 opacity-0 cursor-pointer"
                                            onChange={handleFileChange}
                                            accept=".pdf,.jpg,.jpeg,.png,.mp4"
                                            multiple
                                        />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="w-full mt-4">
                    <div className="flex gap-0.5">
                        <div className="text-[#7c7c7c] text-lg font-medium">Grievance   Description</div>
                    </div>
                    <textarea value={formData.description} onChange={(e) => { setFormData({ ...formData, description: e.target.value }) }} className='w-full border-[1px] h-40 border-[#d9d9d9] p-2 flex items-center  bg-[#f4f5f6] rounded-lg focus:outline-1 focus:outline-[#bbbbbb] mt-1' placeholder='Describe your issue..' />
                </div>

                <div className="text-[#7c7c7c] text-sm mt-4">
                    {`Note: special characters {! @ # $ ^ : ; & + = ₹ ÷ , * % "} are not permitted`}
                    <br />
                    {`To submit the grievance, please enter one of the following : (a) type and subtype (b) Media (c) Description`}
                </div>

                <div className="flex w-full justify-end mt-10 ">
                    <ReCAPTCHA
                        sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                        onChange={(e) => { console.log(e) }}
                    />
                    <button type='submit' className={`bg-[#75002b] w-28 h-13 text-white p-2 rounded-lg cursor-pointer hover:bg-[#f58220] transition-all duration-500 ease-in-out `}>Submit</button>
                    <button type='button' className={`bg-[#75002b] w-28 h-13 text-white p-2 rounded-lg cursor-pointer hover:bg-[#f58220] transition-all duration-500 ease-in-out ml-6 `} onClick={(e) => {
                        e.preventDefault(); setFormData({
                            phone: '',
                            pnr: '',
                            type: '',
                            subtype: '',
                            media: [],
                            description: '',
                        });
                    }}>Reset</button>

                </div>

            </form>

        </>
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        otp: state.otp,
    };
};

export default connect(mapStateToProps)(Trains);