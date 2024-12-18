"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import React, { ReactNode, ReactElement, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

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
      <div className="relative w-full">
        <Sidebar />
        <Navbar pageTitle={pageTitle} />
        <div className="w-full">{children}</div>
      </div>
      <Toaster />
    </main>
  );
}
