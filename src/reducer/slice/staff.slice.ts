import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "../store";
import { toast } from "react-toastify";
import { getStaffsByDepartment } from "../actions/lecturer.dispatcher";

interface allStaffsState {
  allStaffs: any;
}

const initialState: allStaffsState = {
  allStaffs: [],
};

const allStaffsSlice = createSlice({
  name: "staffs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PURGE, (state) => {
        state.allStaffs = initialState.allStaffs;
      })
      .addCase(getStaffsByDepartment.fulfilled, (state, action) => {
        state.allStaffs = action.payload;
      })
      .addCase(getStaffsByDepartment.rejected, (state) => {
        toast.error("Unable to get staffs!");
      });
  },
});

export default allStaffsSlice.reducer;
