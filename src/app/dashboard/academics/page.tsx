"use client";
import DashboardLayout from "@/layouts/dasboard";
import Analytics from "@/components/dashboard/home/Analytics";
import axios from "axios";
import LoaderIcon from "@/components/icons/LoaderIcon";
import SolidDivider from "@/components/icons/SolidDivider";
import StudentList from "@/components/studdent-list";
import Academics from "@/components/academics";

export default function Academic() {
  return (
    <DashboardLayout pageTitle="Academics">
      <DashboardContent />
    </DashboardLayout>
  );
}

const DashboardContent = ({ user, organizationData }: any) => {
  return (
    <div className="w-full md:pl-[260px] pt-4 px-5 bg-neutral-100 min-h-screen overflow-x-scroll pr-5">
      <Academics />
    </div>
  );
};
