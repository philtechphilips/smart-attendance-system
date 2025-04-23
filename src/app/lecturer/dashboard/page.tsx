"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoaderIcon from "@/components/icons/LoaderIcon";
import DashboardLayout from "@/layouts/dasboard";
import EmptyTable from "@/components/emptytable";
import classNames from "classnames";
import {
  getDasboardAnalytics,
  getDasboardInsights,
  getDasboardPerf,
} from "@/services/Dashboard";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const Dashboard = () => {
  const [insights, setInsights] = useState<any>({});
  const [analytic, setAnalytics] = useState<any>({});
  const [performance, setPerformance] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await getDasboardInsights();
      const analytics = await getDasboardAnalytics();
      const perf = await getDasboardPerf();
      setInsights(res);
      setAnalytics(analytics);
      setPerformance(perf);
    } catch (error) {
      toast.error("Unable to fetch atendance details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const studentsCriticalData = {
    labels: performance?.studentsWithCriticalIssues?.map(
      (item: any) => item?.student_matricNo,
    ),
    datasets: [
      {
        label: "Average Attendance",
        data: performance?.studentsWithCriticalIssues?.map(
          (item: any) => item?.averageAttendance,
        ),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Top Performing Departments Data
  const topDepartmentsData = {
    labels: performance?.topPerformingDepartments?.map(
      (item: any) => item?.department_name,
    ),
    datasets: [
      {
        label: "Average Attendance",
        data: performance?.topPerformingDepartments?.map(
          (item: any) => item?.count,
        ),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Attendance Overview",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Labels",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Average Attendance",
        },
      },
    },
  };

  return (
    <DashboardLayout pageTitle="Dashboard">
      {!isLoading ? (
        <div className="w-full md:pl-[260px] pt-4 px-5 bg-neutral-100 min-h-screen overflow-x-scroll pr-5">
          <section className="flex md:flex-row flex-wrap md:flex-nowrap mb-8 items-start md:gap-5 gap-4 mt-10">
            <div className="md:w-1/4 w-[45%] bg-white rounded-lg p-5">
              <p className="text-sm text-gray-700">Total Students</p>
              <h6 className="mt-3 text-lg font-semibold">
                {insights?.totalStudents}
              </h6>
            </div>
            <div className="md:w-1/4 w-[45%] bg-white rounded-lg p-5">
              <p className="text-sm">Total Lecturer</p>
              <h6 className="mt-3 text-lg font-semibold">
                {insights?.totalLecturers}
              </h6>
            </div>
            <div className="md:w-1/4 w-[45%] bg-white rounded-lg p-5">
              <p className="text-sm">Total Courses</p>
              <h6 className="mt-3 text-lg font-semibold">
                {insights?.totalCourses}
              </h6>
            </div>
            <div className="md:w-1/4 w-[45%] bg-white rounded-lg p-5">
              <p className="text-sm">Todays Attendance</p>
              <h6 className="mt-3 text-lg font-semibold">
                {insights?.dailyAttendance}
              </h6>
            </div>
            <div className="md:w-1/4 w-[45%] bg-white rounded-lg p-5">
              <p className={`text-sm`}>Average Attendance</p>
              <h6
                className={`mt-3 text-lg font-semibold ${insights?.averageAttendanceRate < 60 ? "text-red-600" : "text-green-600"}`}
              >
                {insights?.averageAttendanceRate}%
              </h6>
            </div>
          </section>

          <section className="flex md:flex-row flex-col gap-4 items-start">
            <div className="w-full md:w-1/2 h-fit table__container table__container_full text-sm leading-4 pb-[4rem]">
              <h6 className="py-2 font-bold">Students With Low Attendance</h6>
              {analytic?.topLowAttendanceStudents?.length > 0 && (
                <table className="w-full text-sm leading-6 bg-white border-collapse ">
                  <thead className="sticky top-0 bg-white z-[2]">
                    <tr className="text-left">
                      <th className="px-4 py-3 text-center leading-6 text-[#4D4D4D]">
                        S/N
                      </th>
                      <th className="py-3 text-center ">Matric No.</th>
                      <th>
                        <div className="flex items-center gap-2">
                          <span className="text-center">Department</span>
                        </div>
                      </th>
                      <th>
                        <div className="flex items-center gap-2">
                          <span className="">No. of Class Attended</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytic?.topLowAttendanceStudents?.map(
                      (item: any, index: number) => (
                        <tr
                          key={index}
                          className="border-t-2 border-[#e6e6e6] text-[#4D4D4D] w-full hover:bg-[#737373] hover:bg-opacity-10 cursor-pointer"
                        >
                          <td className="py-3 pr-4 text-center relative">
                            <p>{index + 1}</p>
                          </td>
                          <td className="py-3 text-center ">
                            {item?.student_matricNo}
                          </td>
                          <td className="py-3 text-center ">
                            {item?.department_name}
                          </td>
                          <td className="py-3 text-center">
                            {item?.attendanceCount}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              )}
              {analytic?.topLowAttendanceStudents?.length <= 0 && (
                <EmptyTable title="No studets with low attendance records" />
              )}

              {isLoading && (
                <div
                  className={classNames(
                    "flex flex-col items-center justify-center w-full",
                    {
                      "h-full": analytic?.topLowAttendanceStudents?.length <= 0,
                    },
                  )}
                >
                  <LoaderIcon />
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 h-fit table__container table__container_full text-sm leading-4 pb-[4rem]">
              <h6 className="py-2 font-bold">Department Attendance</h6>
              {analytic?.departmentWiseAttendance?.length > 0 && (
                <table className="w-full text-sm leading-6 bg-white border-collapse ">
                  <thead className="sticky top-0 bg-white z-[2]">
                    <tr className="text-left">
                      <th className="px-4 py-3 text-center leading-6 text-[#4D4D4D]">
                        S/N
                      </th>
                      <th className="py-3 text-center ">Course Name</th>
                      <th>
                        <div className="flex items-center gap-2">
                          <span className="">Course Code</span>
                        </div>
                      </th>
                      <th>
                        <div className="flex items-center gap-2">
                          <span className="">Attendance Count</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytic?.departmentWiseAttendance?.map(
                      (item: any, index: number) => (
                        <tr
                          key={index}
                          className="border-t-2 border-[#e6e6e6] text-[#4D4D4D] w-full hover:bg-[#737373] hover:bg-opacity-10 cursor-pointer"
                        >
                          <td className="py-3 pr-4 text-center relative">
                            <p>{index + 1}</p>
                          </td>
                          <td className="py-3 text-center ">
                            {item?.course_name}
                          </td>
                          <td className="py-3 text-center ">
                            {item?.course_code}
                          </td>
                          <td className="py-3 text-center">{item?.count}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              )}
              {analytic?.topLowAttendanceStudents?.length <= 0 && (
                <EmptyTable title="No studets with low attendance records" />
              )}

              {isLoading && (
                <div
                  className={classNames(
                    "flex flex-col items-center justify-center w-full",
                    {
                      "h-full": analytic?.topLowAttendanceStudents?.length <= 0,
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

export default Dashboard;
