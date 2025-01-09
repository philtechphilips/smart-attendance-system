"use client";

import AttendanceBarChart from "@/components/academics/CourseAttendanceBarChart";
import LoaderIcon from "@/components/icons/LoaderIcon";
import DashboardLayout from "@/layouts/dasboard";
import { getAttendanceDetails } from "@/services/Attendance";
import { getCourseDetails } from "@/services/courses.service";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CourseDetails = () => {
  const params = useParams();
  const courseId = params?.details;
  const router = useRouter();
  const [attendanceDetails, setAttendanceDetails] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAttendanceDetails = async () => {
    setIsLoading(true);
    try {
      const res = await getCourseDetails(courseId);
      console.log(res, "...............");
      setAttendanceDetails(res);
    } catch (error) {
      toast.error("Unable to fetch atendance details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceDetails();
  }, []);

  return (
    <DashboardLayout pageTitle="Course Details">
      {attendanceDetails && !isLoading ? (
        <div className="w-full md:pl-[260px] pt-4 px-5 bg-neutral-100 min-h-screen overflow-x-scroll pr-5">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => router.back()}
          >
            <i className="ri-arrow-left-long-fill text-lg font-semibold"></i>
            <p>Back</p>
          </div>
          <section className="flex md:flex-row flex-wrap md:flex-nowrap mb-8 items-start md:gap-10 gap-4 mt-10">
            <div className="md:w-1/4 w-[45%] bg-white rounded-lg p-5">
              <p className="text-sm text-gray-700">No of classes held</p>
              <h6 className="mt-3 text-lg font-semibold">
                {attendanceDetails?.daysClassHeld}
              </h6>
            </div>
            <div className="md:w-1/4 w-[45%] bg-white rounded-lg p-5">
              <p className="text-sm text-gray-700">Total No. of Student</p>
              <h6 className="mt-3 text-lg font-semibold">
                {attendanceDetails?.totalPresent}
              </h6>
            </div>
            <div className="md:w-1/4 w-[45%] bg-white rounded-lg p-5">
              <p className="text-sm text-gray-700">Total Present</p>
              <h6 className="mt-3 text-lg font-semibold">
                {attendanceDetails?.totalPresent}
              </h6>
            </div>
            <div className="md:w-1/4 w-[45%] bg-white rounded-lg p-5">
              <p className="text-sm text-gray-700">Total Absent</p>
              <h6 className="mt-3 text-lg font-semibold">
                {attendanceDetails?.totalStudents}
              </h6>
            </div>
          </section>

          <AttendanceBarChart graphData={attendanceDetails?.graphData} />
        </div>
      ) : (
        <div className=" flex w-full min-h-screen items-center justify-center">
          <LoaderIcon />
        </div>
      )}
    </DashboardLayout>
  );
};

export default CourseDetails;
