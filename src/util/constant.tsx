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
