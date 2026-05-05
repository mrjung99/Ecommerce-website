// features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
    user: null, // { id, email, role }
    profile: null,
    isInitialized: false, // silent refresh done or not
  },
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.user = null;
      state.profile = null;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
});

export const { setCredentials, setProfile, clearCredentials, setInitialized } =
  authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectProfile = (state) => state.auth.profile;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsInitialized = (state) => state.auth.isInitialized;
