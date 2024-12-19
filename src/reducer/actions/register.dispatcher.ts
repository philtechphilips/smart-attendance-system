import AuthService from "@/services/Auth.service";
import { errorMessage } from "@/helpers/error-message";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/types/User";
import registerService from "@/services/CreateStudent.service";

export const login = createAsyncThunk(
  "auth/register",
  async ({ email, password }: User, thunkAPI) => {
    try {
      const data = await registerService.register({ email, password });
      return { user: data, token: data.token };
    } catch (error: any) {
      const message = errorMessage(error);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await AuthService.logout();
});
