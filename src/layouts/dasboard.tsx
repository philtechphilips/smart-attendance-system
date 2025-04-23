"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

type DashboardLayoutProps = {
  children: ReactNode;
  pageTitle: string;
};

export default function DashboardLayout({
  children,
  pageTitle,
}: DashboardLayoutProps) {
  const router = useRouter();

  type AuthLayoutProps = {
    children: ReactNode;
    pageTitle: String;
  };

  return (
    <main className="w-full">
      <div className="w-full relative ">
        <Sidebar />
        <Navbar pageTitle={pageTitle} />
        <div className="w-full">{children}</div>
      </div>
      <ToastContainer />
    </main>
  );
}
