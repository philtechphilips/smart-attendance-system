import makeNetworkCall from "@/helpers/axios-request";
import { errorMessage } from "@/helpers/error-message";

const getDepartmentStudents = async () => {
  try {
    const response = await makeNetworkCall({
      url: "/students/departmental-students?pageSize=10&currentPage=1",
    });
    console.log(response);
    return response.data;
  } catch (err) {
    console.log(err);
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

const studentsService = {
  getDepartmentStudents,
};

export default studentsService;
