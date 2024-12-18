export interface User {
  email: string;
  password: string;
}

export interface UserType {
  id: string;
  firstname: string;
  email: string;
  lastname: string;
  role: string;
}
export type Period = "Week" | "Month" | "Year" | "Custom DATE";

export interface DateFilterType {
  name: Period;
  checked: boolean;
}

export enum ToastStatus {
  success = "success",
  error = "error",
  info = "info",
  warn = "warn",
}
