import { GENERATE_OTP_FAILURE,GENERATE_OTP_REQUEST,GENERATE_OTP_RESET,GENERATE_OTP_SUCCESS,VERIFY_OTP_FAILURE,VERIFY_OTP_REQUEST,VERIFY_OTP_SUCCESS,GET_USER_FAILURE,GET_USER_REQUEST,GET_USER_SUCCESS } from "../utils/types";
import { axiosInstance } from "../utils/axios";

const getUserRequest = () => {
    return {
        type: GET_USER_REQUEST,
    };
}
const getUserSuccess = (data) => {
    return {
        type: GET_USER_SUCCESS,
        payload: data,
    };
}
const getUserFailure = () => {
    return {
        type: GET_USER_FAILURE,
    };
}

export const getUser = () => async (dispatch) => {
    try {
        dispatch(getUserRequest());
        const response = await axiosInstance.get("/auth/user");
        if (response.status === 200) {
            dispatch(getUserSuccess(response.data));
        } else {
            dispatch(getUserFailure());
        }
    } catch (error) {
        dispatch(getUserFailure());
    }
}


const generateOtpRequest = () => {
    return {
        type: GENERATE_OTP_REQUEST,
    };
}
const generateOtpSuccess = () => {
    return {
        type: GENERATE_OTP_SUCCESS,
    };
}
const generateOtpFailure = (error) => {
    return {
        type: GENERATE_OTP_FAILURE,
    };
}
export const generateOtpReset = () => {
    return {
        type: GENERATE_OTP_RESET,
    };
}

export const generateOtp = (phone)=>async (dispatch,getState)=>{
    try {
        const state=getState();
        if(state.auth.user){
            //toast error
            return;
        }
        dispatch(generateOtpRequest());
        const response = await axiosInstance.post("/auth/request-otp",{phone});
        if(response.status === 200){
            dispatch(generateOtpSuccess());
        }else{
            dispatch(generateOtpFailure());
        }
    } catch (error) {
        dispatch(generateOtpFailure());
    }
}

const verifyOtpRequest = (otp) => {
    return {
        type: VERIFY_OTP_REQUEST,
        payload: otp,
    };
}
const verifyOtpSuccess = () => {
    return {
        type: VERIFY_OTP_SUCCESS,
    };
}
const verifyOtpFailure = (error) => {
    return {
        type: VERIFY_OTP_FAILURE,
        payload: error,
    };
}
export const verifyOtp = (phone,otp)=>async (dispatch)=>{
    try {
        dispatch(verifyOtpRequest(otp));
        const response = await axiosInstance.post("/auth/login-otp",{phone,otp});
        if(response.status === 200){
            dispatch(verifyOtpSuccess());
            dispatch(getUserSuccess(response.data));
        }else{
            dispatch(verifyOtpFailure());
        }
    } catch (error) {
        if(error.response.status === 400){
            dispatch(verifyOtpFailure("Invalid OTP"));
        }
        else if(error.response.status === 500){
            dispatch(verifyOtpFailure("Server Error"));
        }
        else{
            dispatch(verifyOtpFailure("Something went wrong"));
        }
        dispatch(verifyOtpFailure());
    }
}