import { errorMessage } from "@/helpers/error-message";
import studentsService from "@/services/Students.service";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getStudentsByDepartment = createAsyncThunk(
  "students",
  async (_, thunkAPI) => {
    try {
      const data = await studentsService.getDepartmentStudents();
      return data;
    } catch (error) {
      const message = errorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  },
);
