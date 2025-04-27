"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../app/styles/auth.module.scss";
import { RootState, useAppSelector } from "@/reducer/store";

type AuthLayoutProps = {
  children: ReactNode;
  pageTitle: String;
};

export default function AuthLayout({ children, pageTitle }: AuthLayoutProps) {
  const router = useRouter();

  const { user: userData, isLoggedIn } = useAppSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isLoggedIn && userData) {
      const userRole = userData?.role;
      if (userRole === "STUDENT") {
        router.push("/student/dashboard");
      } else if (userRole === "LECTURER") {
        router.push("/lecturer/dashboard");
      } else if (userRole === "ADMIN") {
        router.push("/dashboard/home");
      }
    }
  }, [userData, isLoggedIn]);

  return (
    <main className={styles.main}>
      <div className={""}>
        <div className="w-full flex !px-24">{children}</div>
      </div>
    </main>
  );
}

