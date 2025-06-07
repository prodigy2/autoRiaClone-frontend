import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import carsReducer from './carsSlice';
import adsReducer from './adsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cars: carsReducer,
    ads: adsReducer,
  },
});

export default store;
