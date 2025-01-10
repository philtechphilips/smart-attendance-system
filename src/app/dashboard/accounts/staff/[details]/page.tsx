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
import { getStaffCourses } from "@/services/Staffs.service";

const StaffDetails = () => {
  const params = useParams();
  const staffId = params?.details;
  const router = useRouter();
  const [attendanceDetails, setAttendanceDetails] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAttendanceDetails = async () => {
    setIsLoading(true);
    try {
      const res = await getStaffCourses(staffId);
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
    <DashboardLayout pageTitle="Lecturer Details">
      {attendanceDetails && !isLoading ? (
        <div className="w-full md:pl-[260px] pt-4 px-5 bg-neutral-100 min-h-screen overflow-x-scroll pr-5">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => router.back()}
          >
            <i className="ri-arrow-left-long-fill text-lg font-semibold"></i>
            <p>Back</p>
          </div>
          <section>
            <div className="w-full mt-10 table__container table__container_full text-sm leading-4 pb-[4rem]">
              {attendanceDetails?.length > 0 && (
                <table className="w-full text-sm leading-6 bg-white border-collapse ">
                  <thead className="sticky top-0 bg-white z-[2]">
                    <tr className="text-left">
                      <th className="px-4 text-center py-3 leading-6 text-[#4D4D4D]">
                        S/N
                      </th>
                      <th className="py-3 ">Course Code</th>
                      <th>
                        <div className="flex items-center gap-2">
                          <span className="">Course Title</span>
                        </div>
                      </th>
                      <th>
                        <div className="flex items-center gap-2">
                          <span className="">Class</span>
                        </div>
                      </th>
                      <th className="py-3 ">Departmemt</th>
                      <th className="py-3 ">Program</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceDetails?.map((item: any, index: number) => (
                      <tr
                        key={index}
                        className="border-t-2 border-[#e6e6e6] text-[#4D4D4D] w-full hover:bg-[#737373] hover:bg-opacity-10 cursor-pointer"
                      >
                        <td className="py-3 pr-4 text-center relative">
                          <p>{index + 1}</p>
                        </td>
                        <td className="py-3 ">{item?.code}</td>
                        <td className="py-3 ">{item?.name}</td>
                        <td className="py-3 ">{item?.class?.name}</td>
                        <td className="py-3 ">{item?.department?.name}</td>
                        <td className="py-3">{item?.program?.name}</td>
                      </tr>
                    ))}
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

export default StaffDetails;
