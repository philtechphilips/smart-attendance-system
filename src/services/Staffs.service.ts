import makeNetworkCall from "@/helpers/axios-request";
import { errorMessage } from "@/helpers/error-message";

const getDepartmentStaffs = async () => {
  try {
    const response = await makeNetworkCall({
      url: "/staffs/departmental-staffs?pageSize=10&currentPage=1",
    });
    console.log(response);
    return response.data;
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

const StaffsService = {
  getDepartmentStaffs,
};

export default StaffsService;
