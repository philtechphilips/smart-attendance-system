"use client";

import LoaderIcon from "@/components/icons/LoaderIcon";
import DashboardLayout from "@/layouts/dasboard";
import { getAttendanceDetails } from "@/services/Attendance";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AttendanceDetails = () => {
  const params = useParams();
  const attendanceId = params?.id;
  const router = useRouter();
  const [attendanceDetails, setAttendanceDetails] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAttendanceDetails = async () => {
    setIsLoading(true);
    try {
      const res = await getAttendanceDetails(attendanceId);
      console.log(res);
      setAttendanceDetails(res);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceDetails();
  }, [attendanceId]);

  return (
    <DashboardLayout pageTitle="Attendance Details">
      {attendanceDetails && !isLoading ? (
        <div className="w-full md:pl-[260px] pt-4 px-5 bg-neutral-100 min-h-screen overflow-x-scroll pr-5">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => router.back()}
          >
            <i className="ri-arrow-left-long-fill text-lg font-semibold"></i>
            <p>Back</p>
          </div>
          <section className="flex md:flex-row flex-col items-start gap-10 mt-10">
            <div className="bg-white rounded-lg md:w-2/5 p-5">
              <div className="flex items-start gap-3">
                <div className="min-w-10 min-h-10 bg-gray-800 rounded-full"></div>
                <div>
                  <h2 className="font-semibold">
                    {attendanceDetails?.student?.firstname +
                      " " +
                      attendanceDetails?.student?.middlename +
                      " " +
                      attendanceDetails?.student?.lastname}
                  </h2>
                  <div className="flex flex-wrap gap-0">
                    <div className="flex w-1/2 items-center gap-1 mt-4 text-gray-700">
                      <i className="ri-graduation-cap-line"></i>
                      <p className="text-sm">
                        {attendanceDetails?.student?.level?.name}
                      </p>
                    </div>

                    <div className="flex w-1/2 items-center gap-1 mt-4 text-gray-700">
                      <i className="ri-database-line"></i>
                      <p className="text-sm">Face recognition</p>
                    </div>

                    <div className="flex w-1/2 items-center gap-1 mt-4 text-gray-700">
                      <i className="ri-book-2-line"></i>
                      <p className="text-sm">
                        {attendanceDetails?.course?.code}
                      </p>
                    </div>

                    <div className="flex w-1/2 items-center gap-1 mt-4 text-gray-700">
                      <i className="ri-calendar-line"></i>
                      <p className="text-sm">
                        {" "}
                        {attendanceDetails?.timestamp
                          ? new Date(attendanceDetails.timestamp)
                              .toISOString()
                              .split("T")[0]
                          : "N/A"}
                      </p>
                    </div>

                    <div className="flex w-1/2 items-center gap-1 mt-4 text-gray-700">
                      <i className="ri-time-line"></i>
                      <p className="text-sm">
                        {attendanceDetails?.timestamp
                          ? new Date(
                              attendanceDetails.timestamp,
                            ).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              second: "numeric",
                              hour12: true,
                            })
                          : "N/A"}
                      </p>
                    </div>

                    <div className="flex w-1/2 items-center gap-1 mt-4 text-gray-700">
                      <i
                        className={`ri-check-double-line ${
                          attendanceDetails?.status == "present"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      ></i>
                      <p
                        className={`text-sm capitalize ${
                          attendanceDetails?.status == "present"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {attendanceDetails?.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg md:w-3/5 p-5"></div>
          </section>
        </div>
      ) : (
        <div className=" flex w-full min-h-screen items-center justify-center">
          <LoaderIcon />
        </div>
      )}
    </DashboardLayout>
  );
};

export default AttendanceDetails;
