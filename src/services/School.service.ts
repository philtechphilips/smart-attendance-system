import makeNetworkCall from "@/helpers/axios-request";
import { errorMessage } from "@/helpers/error-message";

const getAllSchools = async () => {
  try {
    const response = await makeNetworkCall({ url: "/schools" });
    return response.data;
  } catch (err) {
    console.log(err);
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

const getAllSchoolsService = {
  getAllSchools,
};

export default getAllSchoolsService;
