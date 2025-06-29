import { combineReducers } from 'redux';
import otpReducer from './otp.reducer';
import authReducer from './auth.reducer'; // Import your auth reducer
// Import your reducers here

const rootReducer = combineReducers({
    auth:authReducer,
    otp: otpReducer,
    // Add more reducers as needed
});

export default rootReducer;