import makeNetworkCall from "@/helpers/axios-request";
import { errorMessage } from "@/helpers/error-message";

const getAllPrograms = async () => {
  try {
    const response = await makeNetworkCall({ url: "/programs" });
    return response.data;
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

const getAllProgramsService = {
  getAllPrograms,
};

export default getAllProgramsService;
