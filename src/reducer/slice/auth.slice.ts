import { createSlice } from "@reduxjs/toolkit";
import { login, logout } from "../actions/auth.dispatcher";
import { ToastStatus, UserType } from "../../../types/User";
import { customToast } from "@/helpers/misc";

interface AuthState {
  isLoggedIn: boolean;
  user: UserType | null;
  token: string | null;
  oauthToken: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: null,
  oauthToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        customToast(ToastStatus.success, "Login successful");
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login?.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
      });
  },
});

// Export the reducer
export default authSlice.reducer;
