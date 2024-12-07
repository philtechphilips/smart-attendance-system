import AuthService from "@/services/Auth.service";
import { errorMessage } from "@/helpers/error-message";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/types/User";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: User, thunkAPI) => {
    try {
      const data = await AuthService.login({ email, password });
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
