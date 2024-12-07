import makeNetworkCall from "@/helpers/axios-request";
import { errorMessage } from "@/helpers/error-message";
import { persistor } from "@/reducer/store";
import { User } from "@/types/User";
import axios from "axios";

const login = async (data: User) => {
  try {
    const response = await makeNetworkCall({
      url: `auth/login`,
      method: "POST",
      body: data,
    });
    const { ...rest } = response.data;
    if (response?.data?.token) {
      localStorage.setItem("user", JSON.stringify({ ...rest }));
    }
    return { ...rest };
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  persistor.purge();
};

const authService = {
  login,
  logout,
};

export default authService;
