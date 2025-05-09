import makeNetworkCall from "@/helpers/axios-request";
import { errorMessage } from "@/helpers/error-message";

export const getDasboardInsights = async () => {
  try {
    const response = await makeNetworkCall({
      url: "/dashboard",
    });
    return response.data;
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

export const getStudentDashboard = async () => {
  try {
    const response = await makeNetworkCall({
      url: "/dashboard/student-dashboard",
    });
    return response.data;
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

export const getDasboardAnalytics = async () => {
  try {
    const response = await makeNetworkCall({
      url: "/dashboard/insights",
    });
    return response.data;
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

export const getDasboardPerf = async () => {
  try {
    const response = await makeNetworkCall({
      url: "/dashboard/performance",
    });
    return response.data;
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

export const getStaffDasboard = async (period: string) => {
  try {
    const response = await makeNetworkCall({
      url: `/dashboard/staff-dashboard?period=${period}`,
    });
    return response.data;
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};

export const getAdminDasboard = async (period: string) => {
  try {
    const response = await makeNetworkCall({
      url: `/dashboard/admin-dashboard?period=${period}`,
    });
    return response.data;
  } catch (err) {
    const message = errorMessage(err);
    throw new Error(message ?? "Network error");
  }
};
