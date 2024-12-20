import makeNetworkCall from "@/helpers/axios-request";
import { errorMessage } from "@/helpers/error-message";
import { CreateStudent } from "@/types/User";

const register = async (data: CreateStudent) => {
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
