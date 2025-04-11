import { GET_USER_REQUEST,GET_USER_FAILURE,GET_USER_SUCCESS } from "../utils/types";
import { axiosInstance } from "../utils/axios";

const initialState = {
    loading: false,
    user: null,
    isAuthenticated: false,
};

const authReducer = (state = initialState, action) => {
    const {type, payload} = action;
    switch (type) {
        case GET_USER_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GET_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                user: payload,
                isAuthenticated: true,
            };
        case GET_USER_FAILURE:
            return {
                ...state,
                loading: false,
                user: null,
                isAuthenticated: false,
            };
        default:
            return state;
    }
};
export default authReducer;