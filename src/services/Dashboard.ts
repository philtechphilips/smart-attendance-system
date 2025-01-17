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
