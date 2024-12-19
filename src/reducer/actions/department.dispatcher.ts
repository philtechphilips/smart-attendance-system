import { errorMessage } from "@/helpers/error-message";
import getAllDepartmentsService from "@/services/Department.service";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllDepartments = createAsyncThunk(
  "data/departments",
  async (_, thunkAPI) => {
    try {
      const data = await getAllDepartmentsService.getAllDepartments();
      return data;
    } catch (error) {
      const message = errorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  },
);
