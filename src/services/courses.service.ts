import makeNetworkCall from "@/helpers/axios-request";
import { errorMessage } from "@/helpers/error-message";
import { StudentListParams } from "@/reducer/actions/students.dispatcher";

const getDepartmentCourses = async (params: Partial<StudentListParams>) => {
  const { currentPage, pageSize } = params;
  let queryString = `currentPage=${currentPage}&pageSize=${pageSize}`;
  try {
    const response = await makeNetworkCall({
      url: `/courses/departmental-courses?${queryString}`,
    });
    return response.data;
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

export const createCourses = async (data: any) => {
  try {
    const response = await makeNetworkCall({
      url: `/courses`,
      method: "POST",
      body: data,
    });

    return response.data;
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

export const getCourseDetails = async (courseId: any) => {
  try {
    const response = await makeNetworkCall({
      url: `/courses/course-attendance/${courseId}`,
      method: "GET",
    });

    return response.data;
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

export const deleteCourse = async (id: string) => {
  try {
    const response = await makeNetworkCall({
      method: "delete",
      url: `/courses/${id}`,
    });
    return response.data;
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

const coursesService = {
  getDepartmentCourses,
};

export default coursesService;
