// import {
//     APP_ROLES,
//     maxFileSizeInMB,
//     regionalMenuItems,
//     siteMenuItems,
//     zonalMenuItems,
// } from '../utils/constant'

import { ToastStatus } from "@/types/User";
import { toast } from "react-toastify";

// export const formatDate = (date_string: string, formatString?: string) => {
//     let formatted_date = ''
//     const date = moment(date_string)
//     const current_date = moment()
//     if (formatString) {
//         return date.format(formatString)
//     }
//     if (date.isSame(current_date, 'day')) {
//         formatted_date = `Today at ${date.format('HH:mm')}`
//     } else {
//         formatted_date = date.format('YYYY-MMM-DD [at] HH:mm')
//     }
//     return formatted_date
// }

// export const sidebarMenu = (role: string) => {
//     switch (role) {
//         case 'SMART_SITE_MANAGER':
//             return siteMenuItems
//         case 'SMART_ZONAL_MANAGER':
//             return zonalMenuItems
//         case 'SMART_REGIONAL_MANAGER':
//             return regionalMenuItems
//         default:
//             return siteMenuItems
//     }
// }

export const customToast = (
  status: ToastStatus,
  message: string,
  timeout: number = 5000,
) => {
  if (!status || !message) return null;
  toast[status](message, {
    position: "top-right",
    autoClose: timeout,
    hideProgressBar: false,
    closeOnClick: true,
    theme: "light",
  });
};

export const fetchBaseUrl = () => {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_APP_BASE_URL ?? "";
  }
  return `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? `:${window.location.port}` : ""
  }`;
};

export const clearCookies = () => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const equalToIndex = cookie.indexOf("=");
    const name = equalToIndex > -1 ? cookie.slice(0, equalToIndex) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
};
