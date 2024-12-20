import { errorMessage } from "@/helpers/error-message";
import getAllSchoolsService from "@/services/School.service";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllSchools = createAsyncThunk(
  "data/schools",
  async (_, thunkAPI) => {
    try {
      const data = await getAllSchoolsService.getAllSchools();

      return data;
    } catch (error) {
      const message = errorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  },
);
