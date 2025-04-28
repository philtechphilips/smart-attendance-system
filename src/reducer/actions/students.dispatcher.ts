import { errorMessage } from "@/helpers/error-message";
import studentsService from "@/services/Students.service";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface StudentListParams {
  pageSize?: number;
  currentPage?: number;
  search?: string;
}

export interface AttendanceListParams {
  pageSize: number;
  currentPage: number;
  status?: string;
  level?: string;
  period?: string;
  search?: string;
}

export const getStudentsByDepartment = createAsyncThunk(
  "students",
  async (params: Partial<StudentListParams>, thunkAPI) => {
    try {
      const data = await studentsService.getDepartmentStudents(params);
      return data;
    } catch (error) {
      const message = errorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  },
);
