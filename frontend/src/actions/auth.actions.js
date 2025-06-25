import {
  GENERATE_OTP_FAILURE,
  GENERATE_OTP_REQUEST,
  GENERATE_OTP_RESET,
  GENERATE_OTP_SUCCESS,
  VERIFY_OTP_FAILURE,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_RESET,
  LOGIN_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  LOGOUT_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
} from "../utils/types";
import { axiosInstance } from "../utils/axios";

const getUserRequest = () => {
  return {
    type: GET_USER_REQUEST,
  };
};
const getUserSuccess = (data) => {
  return {
    type: GET_USER_SUCCESS,
    payload: data,
  };
};
const getUserFailure = () => {
  return {
    type: GET_USER_FAILURE,
  };
};

export const getUser = () => async (dispatch) => {
  try {
    // console.log("getUser called");
    dispatch(getUserRequest());
    const response = await axiosInstance.get("/user/profile");
    if (response.status === 200 && response.data.user) {
      dispatch(getUserSuccess(response.data.user));
    } else {
      dispatch(getUserFailure());
    }
  } catch (error) {
    dispatch(getUserFailure());
  }
};

const generateOtpRequest = () => {
  return {
    type: GENERATE_OTP_REQUEST,
  };
};
const generateOtpSuccess = () => {
  return {
    type: GENERATE_OTP_SUCCESS,
  };
};
const generateOtpFailure = (error) => {
  return {
    type: GENERATE_OTP_FAILURE,
  };
};
export const generateOtpReset = () => {
  return {
    type: GENERATE_OTP_RESET,
  };
};

export const generateOtp = (phone) => async (dispatch, getState) => {
  try {
    const state = getState();
    if (state.auth.user) {
      //toast error
      return;
    }
    dispatch(generateOtpRequest());
    const response = await axiosInstance.post("/auth/request-otp", { phone });
    if (response.status === 200) {
      dispatch(generateOtpSuccess());
    } else {
      dispatch(generateOtpFailure());
    }
  } catch (error) {
    dispatch(generateOtpFailure());
  }
};

const verifyOtpRequest = (otp) => {
  return {
    type: VERIFY_OTP_REQUEST,
    payload: otp,
  };
};
const verifyOtpSuccess = () => {
  return {
    type: VERIFY_OTP_SUCCESS,
  };
};
const verifyOtpFailure = (error) => {
  return {
    type: VERIFY_OTP_FAILURE,
    payload: error,
  };
};
export const verifyOtp = (phone, otp) => async (dispatch) => {
  try {
    dispatch(verifyOtpRequest(otp));
    const response = await axiosInstance.post("/auth/login-otp", {
      phone,
      otp,
    });
    if (response.status === 200) {
      dispatch(verifyOtpSuccess());
      dispatch(getUserSuccess(response.data));
    } else {
      dispatch(verifyOtpFailure());
    }
  } catch (error) {
    if (error.response.status === 400) {
      dispatch(verifyOtpFailure("Invalid OTP"));
    } else if (error.response.status === 500) {
      dispatch(verifyOtpFailure("Server Error"));
    } else {
      dispatch(verifyOtpFailure("Something went wrong"));
    }
    // dispatch(verifyOtpFailure());
  }
};

const loginRequest = () => {
  return {
    type: LOGIN_REQUEST,
  };
};
const loginSuccess = (payload) => {
  return {
    type: LOGIN_SUCCESS,
    payload: payload,
  };
};
const loginFailure = (error) => {
  return {
    type: LOGIN_FAILURE,
    payload: error,
  };
};

export const loginReset = () => {
  return {
    type: LOGIN_RESET,
  };
};

export const loginWithPassword = (phone, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const response = await axiosInstance.post("/auth/login-password", {
      phone,
      password,
    });
    // console.log(response);
    if (response.status == 200) {
      // console.log("hello")
      dispatch(loginSuccess(response.data));
      // dispatch(getUserSuccess(response.data));
    } else {
      dispatch(loginFailure());
    }
  } catch (error) {
    if (error.response?.status === 400) {
      dispatch(loginFailure("Invalid OTP"));
    } else if (error.response?.status === 500) {
      dispatch(loginFailure("Server Error"));
    } else {
      dispatch(loginFailure("Something went wrong"));
    }
  }
};

const signUpRequest = () => {
  return {
    type: SIGNUP_REQUEST,
  };
};
const signUpSuccess = (payload) => {
  return {
    type: SIGNUP_SUCCESS,
    payload: payload,
  };
};
const signUpFailure = (error) => {
  return {
    type: SIGNUP_FAILURE,
    payload: error,
  };
};

export const signUp = (name, phone, password, otp) => async (dispatch) => {
  try {
    dispatch(signUpRequest());
    const respons1 = await axiosInstance.post("/auth/verify-otp", {
      phone,
      otp,
    });
    if (respons1.status === 200) {
      const response = await axiosInstance.post("/auth/register", {
        name,
        phone,
        password,
      });
      console.log(response);
      if (response.status === 200) {
        dispatch(signUpSuccess(response.data));
      } else {
        dispatch(signUpFailure());
      }
    } else {
      dispatch(signUpFailure());
    }
  } catch (error) {
    if (error.response?.status === 400) {
      dispatch(signUpFailure("Invalid OTP"));
    } else if (error.response?.status === 500) {
      dispatch(signUpFailure("Server Error"));
    } else {
      dispatch(signUpFailure("Something went wrong"));
    }
  }
};

const logoutRequest = () => {
  return {
    type: LOGOUT_REQUEST,
  };
};
const logoutSuccess = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};
const logoutFailure = (error) => {
  return {
    type: LOGOUT_FAILURE,
    payload: error,
  };
};
export const logout = () => async (dispatch) => {
  try {
    dispatch(logoutRequest());
    const response = await axiosInstance.post("/auth/logout");
    if (response.status === 200) {
      dispatch(logoutSuccess());
    } else {
      dispatch(logoutFailure("Logout failed"));
    }
  } catch (error) {
    dispatch(logoutFailure("Something went wrong"));
  }
};
