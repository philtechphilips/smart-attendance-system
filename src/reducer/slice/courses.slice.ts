import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "../store";
import { toast } from "react-toastify";
import { getCoursesByDepartment } from "../actions/courses.dispatcher";

interface allCoursesState {
  allCourses: {
    items: any[];
    pagination: {
      total: number;
      currentPage: number;
    };
  };
}

const initialState: allCoursesState = {
  allCourses: {
    items: [],
    pagination: {
      total: 0,
      currentPage: 0,
    },
  },
};

const allCoursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PURGE, (state) => {
        state.allCourses = initialState.allCourses;
      })
      .addCase(getCoursesByDepartment.fulfilled, (state, action) => {
        state.allCourses = action.payload;
      })
      .addCase(getCoursesByDepartment.rejected, (state) => {
        toast.error("Unable to get students!");
      });
  },
});

export default allCoursesSlice.reducer;
