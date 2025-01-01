import makeNetworkCall from "@/helpers/axios-request";
import { errorMessage } from "@/helpers/error-message";
import { AttendanceListParams } from "@/reducer/actions/students.dispatcher";

export const getDepartmentAttendances = async (
  params: Partial<AttendanceListParams>,
) => {
  const { currentPage, pageSize, status, level } = params;
  let queryString = `currentPage=${currentPage}&pageSize=${pageSize}`;
  if (status) {
    queryString = `currentPage=${currentPage}&pageSize=${pageSize}&status=${status}`;
  }
  if (level) {
    queryString = `${queryString}&level=${level}`;
  }

  try {
    const response = await makeNetworkCall({
      url: `/attendances/departmental-attendance?${queryString}`,
    });
    console.log(response.data, "res ....................");
    return response.data;
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};
