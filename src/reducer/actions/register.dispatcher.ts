import AuthService from "@/services/Auth.service";
import { errorMessage } from "@/helpers/error-message";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateStudent, User } from "@/types/User";
import registerService from "@/services/CreateStudent.service";

type RegisterError = string; // Assuming your API returns a string message

export const register = createAsyncThunk<
  any, // Replace with the success payload type
  any, // Replace with the request payload type
  { rejectValue: RegisterError }
>(
  "auth/register",
  async (
    {
      firstname,
      lastname,
      middlename,
      dob,
      country,
      lga,
      state,
      phone,
      email,
      address,
      guardian,
      guardianAddress,
      guardianPhone,
      levelId,
      schoolId,
      departmentId,
      programId,
      guardianEmail,
    }: CreateStudent,
    { rejectWithValue },
  ) => {
    try {
      const data = await registerService.register({
        firstname,
        lastname,
        middlename,
        dob,
        country,
        lga,
        state,
        phone,
        email,
        address,
        guardian,
        guardianAddress,
        guardianPhone,
        levelId,
        schoolId,
        departmentId,
        programId,
        guardianEmail,
      });
      return { user: data, token: data.token };
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message); // Adjust based on your API structure
      }
      return rejectWithValue("An unexpected error occurred");
    }
  },
);
