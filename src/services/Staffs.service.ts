import makeNetworkCall from "@/helpers/axios-request";
import { errorMessage } from "@/helpers/error-message";
import { StudentListParams } from "@/reducer/actions/students.dispatcher";

const getDepartmentStaffs = async (params: Partial<StudentListParams>) => {
  const { currentPage, pageSize } = params;
  let queryString = `currentPage=${currentPage}&pageSize=${pageSize}`;
  try {
    const response = await makeNetworkCall({
      url: `/staffs/departmental-staffs?${queryString}`,
    });
    return response.data;
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

export const getDepartmentStaff = async () => {
  try {
    const response = await makeNetworkCall({
      url: `/staffs/departmental-staffs`,
    });
    return response.data;
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

export const getStaffCourses = async (staffId: any) => {
  try {
    const response = await makeNetworkCall({
      url: `/staffs/courses/${staffId}`,
    });
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
