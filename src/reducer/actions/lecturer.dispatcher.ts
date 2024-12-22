import { errorMessage } from "@/helpers/error-message";
import StaffsService from "@/services/Staffs.service";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { StudentListParams } from "./students.dispatcher";

export const getStaffsByDepartment = createAsyncThunk(
  "staffs",
  async (params: Partial<StudentListParams>, thunkAPI) => {
    try {
      const data = await StaffsService.getDepartmentStaffs(params);
      return data;
    } catch (error) {
      const message = errorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  },
);
