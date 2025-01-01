import {
  ADMIN_SIDEBAR,
  LECTURER_SIDEBAR,
  STUDENT_SIDEBAR,
} from "@/constants/dashboard";

export const unAuthRoutes: string[] = ["/", "/auth/sign-up"];

export enum APP_ROLES {
  STUDENT = "student",
  LECTURER = "lecturer",
  HOD = "hod",
}

export const sidebarMenu = (role: string | undefined) => {
  switch (role) {
    case "STUDENT":
      return STUDENT_SIDEBAR;
    case "LECTURER":
      return LECTURER_SIDEBAR;
    case "HOD":
      return ADMIN_SIDEBAR;
    default:
      return ADMIN_SIDEBAR;
  }
};

export const defaultIncidentAdvanceFilter = {
  department: "All",
  category: "All",
  workflow: "All",
  nature: "All",
};

export const statusOptions = [
  { label: "All", value: "all" },
  { label: "Present", value: "present" },
  { label: "Absent", value: "absent" },
];

export const levelOptions = [
  { label: "All", value: "all" },
  { label: "ND 1", value: "ND 1" },
  { label: "ND 2", value: "ND 2" },
  { label: "ND 3", value: "ND 3" },
  { label: "HND 1", value: "HND 1" },
  { label: "HND 2", value: "HND 2" },
  { label: "HND 3", value: "HND 3" },
];

export const periodOptions = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];
