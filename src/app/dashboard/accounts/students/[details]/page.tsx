"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AttendanceBarChart from "@/components/academics/CourseAttendanceBarChart";
import LoaderIcon from "@/components/icons/LoaderIcon";
import DashboardLayout from "@/layouts/dasboard";
import { getStudentAttendanceDetails } from "@/services/Students.service";
import EmptyTable from "@/components/emptytable";
import classNames from "classnames";

const CourseDetails = () => {
  const params = useParams();
  const studentId = params?.details;
  const router = useRouter();
  const [attendanceDetails, setAttendanceDetails] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAttendanceDetails = async () => {
    setIsLoading(true);
    try {
      const res = await getStudentAttendanceDetails(studentId);
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

  function getOrdinalSuffix(rank: number): string {
    const remainder10 = rank % 10;
    const remainder100 = rank % 100;

    if (remainder100 - remainder10 === 10) {
      return `${rank}th`;
    }

    switch (remainder10) {
      case 1:
        return `${rank}st`;
      case 2:
        return `${rank}nd`;
      case 3:
        return `${rank}rd`;
      default:
        return `${rank}th`;
    }
  }

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
                {attendanceDetails?.totalClasses}
              </h6>
            </div>
            <div className="md:w-1/4 w-[45%] bg-white rounded-lg p-5">
              <p className="text-sm text-green-700">No. of Present</p>
              <h6 className="mt-3 text-lg font-semibold">
                {attendanceDetails?.totalPresent}
              </h6>
            </div>
            <div className="md:w-1/4 w-[45%] bg-white rounded-lg p-5">
              <p className="text-sm text-red-700">No. of Absent</p>
              <h6 className="mt-3 text-lg font-semibold">
                {attendanceDetails?.totalAbsent}
              </h6>
            </div>
            <div className="md:w-1/4 w-[45%] bg-white rounded-lg p-5">
              <p className="text-sm text-gray-700">Rank</p>
              <h6 className="mt-3 text-lg font-semibold">
                {attendanceDetails
                  ? `${getOrdinalSuffix(attendanceDetails.studentRank)} / ${attendanceDetails.totalStudents}`
                  : "N/A"}
              </h6>
            </div>
          </section>

          <section>
            <div className="w-full table__container table__container_full text-sm leading-4 pb-[4rem]">
              {attendanceDetails?.courseAttendanceTable?.length > 0 && (
                <table className="w-full text-sm leading-6 bg-white border-collapse ">
                  <thead className="sticky top-0 bg-white z-[2]">
                    <tr className="text-left">
                      <th className="px-4 text-center py-3 leading-6 text-[#4D4D4D]">
                        S/N
                      </th>
                      <th className="py-3 ">Course Code</th>
                      <th>
                        <div className="flex items-center gap-2">
                          <span className="">Lecturer</span>
                        </div>
                      </th>
                      <th>
                        <div className="flex items-center gap-2">
                          <span className="">No. of Time Present</span>
                        </div>
                      </th>
                      <th className="py-3 ">No. of Time Present</th>
                      <th className="py-3 ">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceDetails?.courseAttendanceTable?.map(
                      (item: any, index: number) => (
                        <tr
                          key={index}
                          className="border-t-2 border-[#e6e6e6] text-[#4D4D4D] w-full hover:bg-[#737373] hover:bg-opacity-10 cursor-pointer"
                        >
                          <td className="py-3 pr-4 text-center relative">
                            <p>{index + 1}</p>
                          </td>
                          <td className="py-3 ">{item?.course?.code}</td>
                          <td className="py-3 ">
                            {item?.course?.lecturer?.firstname +
                              " " +
                              item?.course?.lecturer?.lastname}
                          </td>
                          <td className="py-3 ">{item?.present}</td>
                          <td className="py-3">{item?.absent}</td>
                          <td className={`py-1 px-5 rounded w-fit text-white ${item.percentage < 75 ? 'bg-red-600' : 'bg-green-600'}`}>{item?.percentage}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              )}
              {attendanceDetails?.courseAttendanceTable?.length <= 0 && (
                <EmptyTable title="No studets Attendance Record" />
              )}

              {isLoading && (
                <div
                  className={classNames(
                    "flex flex-col items-center justify-center w-full",
                    {
                      "h-full":
                        attendanceDetails?.courseAttendanceTable?.length <= 0,
                    },
                  )}
                >
                  <LoaderIcon />
                </div>
              )}
            </div>
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

export default CourseDetails;
