"use client";
import DashboardLayout from "@/layouts/dasboard";
import Analytics from "@/components/dashboard/home/Analytics";
import axios from "axios";

export default function Dashboard() {
  return (
    <DashboardLayout pageTitle="Dashboard">
      <DashboardContent />
    </DashboardLayout>
  );
}

const DashboardContent = ({ user, organizationData }: any) => {
  return (
    <div className="w-full md:pl-[260px] pt-4 px-5 bg-neutral-100 min-h-screen overflow-x-scroll pr-5">
      <h1>Dashboard</h1>
    </div>
  );
};
