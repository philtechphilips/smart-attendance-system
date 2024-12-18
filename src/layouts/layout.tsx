"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../app/styles/auth.module.scss";

type AuthLayoutProps = {
  children: ReactNode;
  pageTitle: String;
};

export default function AuthLayout({ children, pageTitle }: AuthLayoutProps) {
  const router = useRouter();

  return (
    <main className={styles.main}>
      <div className={""}>
        <div className="w-full flex !px-24">{children}</div>
      </div>
    </main>
  );
}
