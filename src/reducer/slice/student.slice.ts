import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "../store";
import { toast } from "react-toastify";
import { getStudentsByDepartment } from "../actions/students.dispatcher";

interface allStudentsState {
  allStudents: any;
  isLoading: boolean;
}

const initialState: allStudentsState = {
  allStudents: [],
  isLoading: true,
};

const allStudentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PURGE, (state) => {
        state.allStudents = initialState.allStudents;
        state.isLoading = false;
      })
      .addCase(getStudentsByDepartment.fulfilled, (state, action) => {
        state.allStudents = action.payload;
        state.isLoading = false;
      })
      .addCase(getStudentsByDepartment.rejected, (state) => {
        state.isLoading = false;
        toast.error("Unable to get students!");
      });
  },
});

export default allStudentsSlice.reducer;
