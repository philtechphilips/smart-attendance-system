import { errorMessage } from "@/helpers/error-message";
import getAllDepartmentsService from "@/services/Department.service";
import getAllProgramsService from "@/services/Program.service";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPrograms = createAsyncThunk(
  "data/departments",
  async (_, thunkAPI) => {
    try {
      const data = await getAllProgramsService.getAllPrograms();
      return data;
    } catch (error) {
      const message = errorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  },
);
