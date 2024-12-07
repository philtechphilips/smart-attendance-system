import authHeader from "@/services/Data.service";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { io } from "socket.io-client";
import { unAuthRoutes } from "@/util/constant";
import { ToastStatus } from "@/types/User";
import { customToast } from "./misc";
import { errorMessage } from "./error-message";

interface HeaderType {
  accept?: string;
  "Content-Type"?: string;
  Authorization?: string;
}
export const API_URL = process.env.NEXT_PUBLIC_BASE_URL
  ? process.env.NEXT_PUBLIC_BASE_URL
  : "https://apimdevtech.azure-api.net/smartsafetydev/";

const HEADERS = {
  ...authHeader(),
  accept: "application/json",
  "Content-Type": "application/json",
};

interface RequestProps {
  url: string;
  method?: string;
  headers?: HeaderType;
  body?: any;
  signal?: AbortSignal;
}
const makeNetworkCall = async ({
  url,
  method = "get",
  headers,
  body,
  signal,
}: RequestProps) => {
  if (!url) {
    throw "Url is Invalid";
  }
  if (!method) {
    throw "Method is Invalid";
  }

  const args = {
    method: method.toLowerCase(),
  };

  const axiosInstance = axios.create({
    baseURL: API_URL,
    signal,
    headers: { ...HEADERS, ...headers },
    //@ts-ignore
    requestId: uuid(),
  });

  axiosInstance.interceptors.request.use((config) => {
    //@ts-ignore
    const requestId = config.requestId;
    const { url, method, data } = config;
    const payload = { url, method, body: data };
    let signal = config.signal;
    const isUnAuthRoute = unAuthRoutes.includes(window.location.pathname);
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token && !isUnAuthRoute) {
        const controller = new AbortController();
        controller.abort();
        signal = controller.signal;
      }
      if (config.headers) config.headers["Authorization"] = `Bearer ${token}`;
    }
    return {
      ...config,
      signal,
    };
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      //@ts-ignore
      const requestId = response.config.requestId;
      const activityId = localStorage.getItem("activityId") || "";
      const { url, method, data } = response.config;
      const payload = { url, method, body: data, statusCode: response.status };
      return response;
    },
    (err) => {
      const message = errorMessage(err);
      if (err.response?.status === 401) {
        console.log("401 error");
      }
      const token = localStorage.getItem("token");
      if (token && message !== "canceled") {
        customToast(ToastStatus.error, message);
      }
      throw new Error(message);
    },
  );

  //@ts-ignore
  let requestBody = await axiosInstance[args.method](url, body)
    //@ts-ignore
    .then((response) => {
      return response;
    })
    //@ts-ignore
    .catch((err) => {
      throw err;
    });

  return requestBody;
};

export default makeNetworkCall;
