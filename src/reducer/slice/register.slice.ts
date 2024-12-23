import { createSlice } from "@reduxjs/toolkit";
import { register } from "../actions/register.dispatcher";
import { PURGE } from "../store";
import { toast } from "react-toastify";

interface registerState {
  register: any;
}

const initialState: registerState = {
  register: [],
};

const registerSlice = createSlice({
  name: "Programs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PURGE, (state) => {
        state.register = initialState.register;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.register = action.payload;
        toast.success("Account created sucessfully!");
      })
      .addCase(register.rejected, (state, action) => {
        const errorMessage =
          action.payload || action.error.message || "Unable to create account!";
        toast.error(errorMessage);
      });
  },
});

export default registerSlice.reducer;
