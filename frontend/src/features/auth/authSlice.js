import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../lib/apiClient';
import { clearAuthState, loadAuthState, saveAuthState } from './authStorage';

const persistedAuth = loadAuthState();

const initialState = {
  user: persistedAuth?.user ?? null,
  accessToken: persistedAuth?.accessToken ?? null,
  refreshToken: persistedAuth?.refreshToken ?? null,
  status: 'idle',
  error: null,
  registration: null,
};

function persistSession(state, payload) {
  state.user = payload.user;
  state.accessToken = payload.accessToken;
  state.refreshToken = payload.refreshToken;

  saveAuthState({
    user: payload.user,
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
  });
}

export const register = createAsyncThunk('auth/register', async (request, { rejectWithValue }) => {
  try {
    const response = await apiClient.post('/auth/register', request);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message ?? 'Registration failed');
  }
});

export const verifyEmail = createAsyncThunk('auth/verifyEmail', async (token, { rejectWithValue }) => {
  try {
    const response = await apiClient.post('/auth/verify-email', { token });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message ?? 'Email verification failed');
  }
});

export const login = createAsyncThunk('auth/login', async (request, { rejectWithValue }) => {
  try {
    const response = await apiClient.post('/auth/login', request);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message ?? 'Login failed');
  }
});

export const refreshSession = createAsyncThunk('auth/refreshSession', async (_, { getState, rejectWithValue }) => {
  const refreshToken = getState().auth.refreshToken;

  if (!refreshToken) {
    return rejectWithValue('No refresh token available');
  }

  try {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message ?? 'Session refresh failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { getState }) => {
  const refreshToken = getState().auth.refreshToken;

  if (refreshToken) {
    await apiClient.post('/auth/logout', { refreshToken });
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionCleared(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.status = 'idle';
      state.error = null;
      clearAuthState();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.registration = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.registration = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        persistSession(state, action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        persistSession(state, action.payload);
      })
      .addCase(refreshSession.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        clearAuthState();
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.status = 'idle';
        state.error = null;
        clearAuthState();
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.status = 'idle';
        state.error = null;
        clearAuthState();
      });
  },
});

export const { sessionCleared } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.accessToken);

export default authSlice.reducer;