import { GENERATE_OTP_FAILURE,GENERATE_OTP_REQUEST,GENERATE_OTP_RESET,GENERATE_OTP_SUCCESS,VERIFY_OTP_FAILURE,VERIFY_OTP_REQUEST,VERIFY_OTP_SUCCESS } from "../utils/types";

const initialState = {
    otpGenerating: false,
    otpGenerated: false,
    otpVerifying: false,
    otpVerified: false,
    error: null,
};
const otpReducer = (state = initialState, action) => {
    const {type, payload} = action;
    switch (type) {
        case GENERATE_OTP_REQUEST:
            return {
                ...state,
                otpGenerating: true,
                otpGenerated: false,
                error: null,
            };
        case GENERATE_OTP_SUCCESS:
            return {
                ...state,
                otpGenerating: false,
                otpGenerated: true,
                error: null,
            };
        case GENERATE_OTP_FAILURE:
            return {
                ...state,
                otpGenerating: false,
                otpGenerated: false,
            };
        case GENERATE_OTP_RESET:
            return {
                ...state,
                otpGenerating: false,
                otpGenerated: false,
                error: null,
            };
        case VERIFY_OTP_REQUEST:
            return {
                ...state,
                otpVerifying: true,
                otpVerified: false,
                error: null,
            };
        case VERIFY_OTP_SUCCESS:
            return {
                ...state,
                otpVerifying: false,
                otpVerified: true,
                error: null,
            };
        case VERIFY_OTP_FAILURE:
            return {
                ...state,
                otpVerifying: false,
                otpVerified: false,
                error:payload,
            };
        default:
            return state;
    }
};

export default otpReducer;