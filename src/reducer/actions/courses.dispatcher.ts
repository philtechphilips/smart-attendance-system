import { errorMessage } from "@/helpers/error-message";
import coursesService from "@/services/courses.service";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface StudentListParams {
  pageSize: number;
  currentPage: number;
}

export const getCoursesByDepartment = createAsyncThunk(
  "data/courses",
  async (params: Partial<StudentListParams>, thunkAPI) => {
    try {
      const data = await coursesService.getDepartmentCourses(params);
      return data;
    } catch (error) {
      const message = errorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  },
);
