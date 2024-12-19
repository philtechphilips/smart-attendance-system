import { createSlice } from "@reduxjs/toolkit";
import { getAllDepartments } from "../actions/department.dispatcher";
import { PURGE } from "../store";
import { toast } from "react-toastify";

interface allDepartmentsState {
  allDepartments: any;
}

const initialState: allDepartmentsState = {
  allDepartments: [],
};

const allDepartmentsSlice = createSlice({
  name: "Schools",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PURGE, (state) => {
        state.allDepartments = initialState.allDepartments;
      })
      .addCase(getAllDepartments.fulfilled, (state, action) => {
        state.allDepartments = action.payload;
      })
      .addCase(getAllDepartments.rejected, (state) => {
        toast.error("Unable to get departments!");
      });
  },
});

export default allDepartmentsSlice.reducer;
