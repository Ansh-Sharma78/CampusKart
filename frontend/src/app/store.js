import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import authReducer from '../features/auth/authSlice';
import { configureAuthInterceptors } from '../features/auth/configureAuthInterceptors';

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
  },
});

configureAuthInterceptors(store);