import { errorMessage } from "@/helpers/error-message";
import StaffsService from "@/services/Staffs.service";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getStaffsByDepartment = createAsyncThunk(
  "staffs",
  async (_, thunkAPI) => {
    try {
      const data = await StaffsService.getDepartmentStaffs();
      console.log(data, "......................");
      return data;
    } catch (error) {
      const message = errorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  },
);
