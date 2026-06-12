import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  apiStatus: 'idle',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    apiCheckStarted(state) {
      state.apiStatus = 'loading';
    },
    apiCheckSucceeded(state) {
      state.apiStatus = 'healthy';
    },
    apiCheckFailed(state) {
      state.apiStatus = 'offline';
    },
  },
});

export const { apiCheckStarted, apiCheckSucceeded, apiCheckFailed } = appSlice.actions;

export default appSlice.reducer;