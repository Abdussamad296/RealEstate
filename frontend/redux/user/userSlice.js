import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.email = action.payload.email;
      state.loading = false;
      state.error = null;
    },
    signFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStart: (state) => {
      state.loading = true;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUsers: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
    logout: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
    resetLoading: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  signStart,
  signInSuccess,
  signFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUsers,
  logout,
  resetLoading,
} = userSlice.actions;

export default userSlice.reducer;