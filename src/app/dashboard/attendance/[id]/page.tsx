"use client";

import DashboardLayout from "@/layouts/dasboard";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const AttendanceDetails = () => {
  const params = useParams();
  const attendanceId = params?.id;
  const router = useRouter();

  console.log(attendanceId, "Attendance ID");

  return (
    <DashboardLayout pageTitle="Attendance Details">
      <div className="w-full md:pl-[260px] pt-4 px-5 bg-neutral-100 min-h-screen overflow-x-scroll pr-5">
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => router.back()}
        >
          <i className="ri-arrow-left-long-fill text-lg font-semibold"></i>
          <p>Back</p>
        </div>
        <section className="flex items-start gap-10 mt-10">
          <div className="bg-white rounded-lg w-2/5 p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded-full"></div>
              <div>
                <h2 className="font-semibold">Student Name</h2>
                <div className="flex flex-wrap gap-0">
                  <div className="flex w-1/2 items-center gap-1 mt-4 text-gray-700">
                    <i className="ri-graduation-cap-line"></i>
                    <p className="text-sm">ND 1</p>
                  </div>

                  <div className="flex w-1/2 items-center gap-1 mt-4 text-gray-700">
                    <i className="ri-database-line"></i>
                    <p className="text-sm">Source</p>
                  </div>

                  <div className="flex w-1/2 items-center gap-1 mt-4 text-gray-700">
                    <i className="ri-book-2-line"></i>
                    <p className="text-sm">Course</p>
                  </div>

                  <div className="flex w-1/2 items-center gap-1 mt-4 text-gray-700">
                    <i className="ri-calendar-line"></i>
                    <p className="text-sm">Date</p>
                  </div>

                  <div className="flex w-1/2 items-center gap-1 mt-4 text-gray-700">
                    <i className="ri-time-line"></i>
                    <p className="text-sm">Time</p>
                  </div>

                  <div className="flex w-1/2 items-center gap-1 mt-4 text-gray-700">
                    <i className="ri-check-double-line"></i>
                    <p className="text-sm">Status</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg w-3/5 p-5"></div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default AttendanceDetails;
