import makeNetworkCall from "@/helpers/axios-request";
import { errorMessage } from "@/helpers/error-message";
import { StudentListParams } from "@/reducer/actions/students.dispatcher";

export const getDepartmentStudents = async (
  params: Partial<StudentListParams>,
) => {
  const { currentPage, pageSize } = params;
  let queryString = `currentPage=${currentPage}&pageSize=${pageSize}`;
  try {
    const response = await makeNetworkCall({
      url: `/students/departmental-students?${queryString}`,
    });
    return response.data;
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

export const getStudentAttendanceDetails = async (studentId: any) => {
  try {
    const response = await makeNetworkCall({
      url: `/attendances/student-attendance/${studentId}`,
      method: "GET",
    });

    return response.data;
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

const studentsService = {
  getDepartmentStudents,
};

export default studentsService;
