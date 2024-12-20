import { errorMessage } from "@/helpers/error-message";
import getAllLevelsService from "@/services/Level.service";
import getAllSchoolsService from "@/services/School.service";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllLevels = createAsyncThunk(
  "data/levels",
  async (_, thunkAPI) => {
    try {
      const data = await getAllLevelsService.getAllLevels();
      return data;
    } catch (error) {
      const message = errorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  },
);
