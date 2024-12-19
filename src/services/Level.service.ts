import makeNetworkCall from "@/helpers/axios-request";
import { errorMessage } from "@/helpers/error-message";

const getAllLevels = async () => {
  try {
    const response = await makeNetworkCall({ url: "/levels" });
    return response.data;
  } catch (err) {
    console.log(err);
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

const getAllLevelsService = {
  getAllLevels,
};

export default getAllLevelsService;
