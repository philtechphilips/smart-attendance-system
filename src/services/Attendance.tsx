import makeNetworkCall from "@/helpers/axios-request";
import { errorMessage } from "@/helpers/error-message";
import { AttendanceListParams } from "@/reducer/actions/students.dispatcher";

export const getDepartmentAttendances = async (
  params: Partial<AttendanceListParams>,
) => {
  const { currentPage, pageSize, status, level, period } = params;
  let queryString = `currentPage=${currentPage}&pageSize=${pageSize}`;

  if (status) {
    queryString = `currentPage=${currentPage}&pageSize=${pageSize}&status=${status}`;
  }

  if (level) {
    queryString = `${queryString}&level=${level}`;
  }

  if (period) {
    queryString = `${queryString}&period=${period}`;
  }

  try {
    const response = await makeNetworkCall({
      url: `/attendances/departmental-attendance?${queryString}`,
    });
    return response.data;
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

export const getAttendanceDetails = async (id: any) => {
  try {
    const response = await makeNetworkCall({
      url: `/attendances/${id}`,
    });
    return response.data;
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};
