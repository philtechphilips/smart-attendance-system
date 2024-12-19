import makeNetworkCall from "@/helpers/axios-request";
import { errorMessage } from "@/helpers/error-message";
import { persistor } from "@/reducer/store";
import { User } from "@/types/User";
import axios from "axios";

const register = async (data: User) => {
  try {
    const response = await makeNetworkCall({
      url: `/students`,
      method: "POST",
      body: data,
    });

    return response;
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

const registerService = {
  register,
};

export default registerService;
