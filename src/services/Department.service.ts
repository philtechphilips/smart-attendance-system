import makeNetworkCall from "@/helpers/axios-request";
import { errorMessage } from "@/helpers/error-message";

const getAllDepartments = async () => {
  try {
    const response = await makeNetworkCall({ url: "/departments/list" });
    return response.data;
  } catch (err) {
    console.log(err);
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

const getAllDepartmentsService = {
  getAllDepartments,
};

export default getAllDepartmentsService;
