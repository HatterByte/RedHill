import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers';
import logger from "redux-logger"; // Import logger middleware


const store = configureStore({
  reducer: rootReducer,
  // Optional: add other middleware if needed, though `redux-thunk` is included by default
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;