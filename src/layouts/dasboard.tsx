"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import Organization from "@/components/modals/Organization";
import useUserStore from "@/store/userStore";
import React, { ReactNode, ReactElement, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import makeNetworkCall from "@/http/http.service";

type DashboardLayoutProps = {
  children: ReactNode;
  pageTitle: string;
};

export default function DashboardLayout({
  children,
  pageTitle,
}: DashboardLayoutProps) {
  const { user } = useUserStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !user) {
      router.push("/auth/sign-in");
    }
  }, [isMounted, user, router]);

  const getUserOrg = async (userId: string) => {
    return makeNetworkCall({
      method: "get",
      url: `/members/user/${userId}`,
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    }).then((response: any) => {
      if (response) {
        return response.data;
      }
      throw new Error(response?.error?.message);
    });
  };

  const { isLoading, isError, data } = useQuery({
    queryKey: ["userOrg", user?.id],
    queryFn: () => getUserOrg(user!.id),
    retry: false,
  });

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  const childWithProps = React.isValidElement(children)
    ? React.cloneElement(children as ReactElement, { organizationData: data })
    : children;

  return (
    <main className="w-full">
      <div className="relative w-full">
        <Sidebar />
        <Navbar pageTitle={pageTitle} />
        <div className="w-full">{childWithProps}</div>
      </div>
      {user && !user.organizations && !data && (
        <div className="bg-black flex items-center justify-center bg-opacity-60 w-screen h-screen fixed top-0 z-[1000]">
          <Organization />
        </div>
      )}
      <ToastContainer />
    </main>
  );
}
