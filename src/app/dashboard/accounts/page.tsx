"use client";
import DashboardLayout from "@/layouts/dasboard";
import StudentList from "@/components/studdent-list";

export default function Accounts() {
  return (
    <DashboardLayout pageTitle="Accounts">
      <DashboardContent />
    </DashboardLayout>
  );
}

const DashboardContent = ({ user, organizationData }: any) => {
  return (
    <div className="w-full md:pl-[260px] pt-4 px-5 bg-neutral-100 min-h-screen overflow-x-scroll pr-5">
      <StudentList />
    </div>
  );
};
