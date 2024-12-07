import axios, { Axios, AxiosInstance, AxiosResponse } from "axios";

const requestHeaders: any = {
  contentType: "application/json",
};

const axiosOpenRequestHeaders: any = { headers: { source: "PWA" } };

export const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const axiosExtended = axios.create({
    baseURL,
    headers: requestHeaders,
  });

  axiosExtended.interceptors.request.use((config) => {
    const state = "get the state value here";
    const accessToken = "get token from state  upon signup";
    if (accessToken) {
      config.headers.Authorization = `bearer ${accessToken}`;
    }
    return config;
  });

  axiosExtended.interceptors.response.use(
    async (res: AxiosResponse) => {
      if (res.status === 200) {
        return Promise.resolve(res);
      } else {
        return Promise.reject({
          result: false,
          message: "Failed to load the data from server",
          ...res.data,
        });
      }
    },
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        const newAccessToken: any = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken?.Data?.AccessToken}`;
        return axios(originalRequest);
      } else if (error.response && error.response.status === 400) {
        error.response.message =
          error?.response?.data?.Message || error.message;
        return Promise.reject(error.response);
      } else {
        return Promise.reject(error);
      }
    },
  );

  const refreshToken = () => {
    // implement refresh token functionality
  };

  return axiosExtended;
};

export const AXIOS_OPEN_POST = async (
  requestUrlWithBaseUrl: string,
  requestData?: any,
  requestHeader?: any,
) => {
  try {
    let response;
    if (requestHeader) {
      response = await axios.post(
        `${requestUrlWithBaseUrl}`,
        requestData,
        requestHeader,
      );
    } else {
      response = await axios.post(
        `${requestUrlWithBaseUrl}`,
        requestData,
        axiosOpenRequestHeaders,
      );
    }
    if (response.data.StatusCode === 1) {
      return response.data.Result;
    } else {
      if (
        response.data.ErrorMessage &&
        response.data.ErrorMessage.toLowerCase() !== "internal server error"
      ) {
        throw new Error(response.data.ErrorMessage);
      } else {
        throw new Error("An error occured. Please try again");
      }
    }
  } catch (error: any) {
    const errorCode = error && error.response && error.response.status;
    return {
      error: {
        message:
          error.message === "Network Error"
            ? "Please check your internet connection and try again"
            : errorCode && errorCode > 300
              ? "Please try again"
              : error.message,
      },
    };
  }
};

export const AXIOS_OPEN_GET = async (
  requestUrlWithBaseUrl: string,
  requestHeader?: any,
) => {
  try {
    let response;
    if (requestHeader) {
      response = await axios.get(`${requestUrlWithBaseUrl}`, requestHeader);
    } else {
      response = await axios.get(
        `${requestUrlWithBaseUrl}`,
        axiosOpenRequestHeaders,
      );
    }
    if (response.status === 200) {
      return response.data;
    } else {
      if (
        response.data.ErrorMessage &&
        response.data.ErrorMessage.toLowerCase() !== "internal server error"
      ) {
        throw new Error(response.data.ErrorMessage);
      } else {
        throw new Error("An error occured. Please try again");
      }
    }
  } catch (error: any) {
    const errorCode = error && error.response && error.response.status;
    return {
      error: {
        message:
          error.message === "Network Error"
            ? "Please check your internet connection and try again"
            : errorCode && errorCode > 300
              ? "Please try again"
              : error.message,
      },
    };
  }
};

export class AxiosService {
  private static classInstance?: AxiosService;
  private axiosInstance: AxiosInstance;

  private constructor(axiosBaseUrl?: string) {
    this.axiosInstance = axios.create({
      baseURL: axiosBaseUrl,
    });
  }

  public static getInstance(axiosBaseUrl?: string): AxiosService {
    if (!this.classInstance) {
      this.classInstance = new AxiosService(axiosBaseUrl);
    }
    return this.classInstance;
  }
}
