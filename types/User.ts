export interface User {
  email: string;
  password: string;
}

export interface CreateStudent {
  firstname: string;
  lastname: string;
  middlename: string;
  dob: string;
  country: string;
  lga: string;
  state: string;
  phone: string;
  email: string;
  address: string;
  guardian: string;
  guardianAddress: string;
  guardianPhone: string;
  levelId: string;
  schoolId: string;
  departmentId: string;
  programId: string;
  guardianEmail: string;
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
