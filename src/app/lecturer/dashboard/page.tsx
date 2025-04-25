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
  ChartData,
  ChartOptions,
} from "chart.js";
import Link from "next/link";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
type TimeRange = "week" | "month" | "year";

interface AttendanceData {
  labels: string[];
  present: number[];
  absent: number[];
}

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

  const [timeRange, setTimeRange] = useState<TimeRange>("week");

  // Sample data with TypeScript typing
  const data: Record<TimeRange, AttendanceData> = {
    week: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      present: [25, 30, 28, 32, 29, 20, 15],
      absent: [5, 2, 4, 1, 3, 10, 8],
    },
    month: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      present: [120, 115, 125, 110],
      absent: [15, 20, 12, 18],
    },
    year: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      present: [500, 480, 520, 510, 530, 490, 470, 500, 520, 540, 530, 550],
      absent: [50, 45, 40, 35, 30, 40, 45, 42, 38, 35, 40, 30],
    },
  };

  const chartData: ChartData<"bar"> = {
    labels: data[timeRange].labels,
    datasets: [
      {
        label: "Present",
        data: data[timeRange].present,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Absent",
        data: data[timeRange].absent,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Attendance Data (${
          timeRange.charAt(0).toUpperCase() + timeRange.slice(1)
        })`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text:
            timeRange === "week"
              ? "Days"
              : timeRange === "month"
              ? "Weeks"
              : "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Students",
        },
        beginAtZero: true,
      },
    },
  };

  const getButtonStyle = (range: TimeRange) => ({
    backgroundColor: timeRange === range ? "#4bc0c0" : "#f5f5f5",
    marginRight: "10px",
    padding: "8px 16px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  });

  return (
    <DashboardLayout pageTitle="Dashboard">
      {!isLoading ? (
        <div className="w-full md:pl-[260px] pt-4 px-5 bg-neutral-100 min-h-screen overflow-x-scroll pr-5">
          <section className="flex md:flex-row flex-wrap md:flex-nowrap mb-8 items-start md:gap-5 gap-4 mt-10">
            <div className="md:w-1/4 w-[45%] bg-white rounded-lg p-5 flex items-center gap-4">
              <div className="flex items-center justify-center bg-[#E6F7FF] rounded-full w-12 h-12">
                <i className="ri-group-line text-xl text-[#1E90FF]"></i>
              </div>
              <div>
                <p className="text-sm text-gray-700">Total Students</p>
                <h6 className="mt-1 text-lg font-semibold">
                  {insights?.totalStudents}
                </h6>
              </div>
            </div>
            <div className="md:w-1/4 w-[45%] bg-white rounded-lg p-5 flex items-center gap-4">
              <div className="flex items-center justify-center bg-[#FFDB58] rounded-full w-12 h-12">
                <i className="ri-clapperboard-line text-xl text-[#ffa700]"></i>
              </div>
              <div>
                <p className="text-sm">Assigned Classes</p>
                <h6 className="mt-1 text-lg font-semibold">
                  {insights?.totalLecturers}
                </h6>
              </div>
            </div>
            <div className="md:w-1/4 w-[45%] bg-white rounded-lg p-5 flex items-center gap-4">
              <div className="flex items-center justify-center bg-[#728c69] rounded-full w-12 h-12">
                <i className="ri-book-line text-xl text-[#466d1d]"></i>
              </div>
              <div>
                <p className="text-sm text-gray-700">Courses</p>
                <h6 className="mt-1 text-lg font-semibold">
                  {insights?.totalStudents}
                </h6>
              </div>
            </div>
            <div className="md:w-1/4 w-[45%] bg-white rounded-lg p-5 flex items-center gap-4">
              <div className="flex items-center justify-center bg-[#d8bfd8] rounded-full w-12 h-12">
                <i className="ri-survey-line text-2xl text-[#795f80]"></i>
              </div>
              <div>
                <p className="text-sm">Total Attendance</p>
                <h6 className="mt-1 text-lg font-semibold">
                  {insights?.totalLecturers}
                </h6>
              </div>
            </div>
          </section>

          <section className="flex md:flex-row flex-wrap md:flex-nowrap mb-8 items-start md:gap-5 gap-4 mt-10">
            <div className="md:w-2/3 w-full bg-white rounded-lg p-5 flex items-center gap-4">
              <div style={{ width: "100%", margin: "0 auto" }}>
                <h2 className="mb-4 text-xl font-semibold">
                  Attendance Overview
                </h2>
                <div style={{ marginBottom: "20px", display: "flex" }}>
                  <button
                    onClick={() => setTimeRange("week")}
                    style={getButtonStyle("week")}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setTimeRange("month")}
                    style={getButtonStyle("month")}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setTimeRange("year")}
                    style={getButtonStyle("year")}
                  >
                    Year
                  </button>
                </div>
                <Bar data={chartData} options={options} />
              </div>
            </div>

            <div className="md:w-1/3 w-full bg-white rounded-lg p-5">
              <div className="flex items-center justify-between w-full">
                <h6 className="font-semibold text-lg  text-gray-700">
                  Recent Activity
                </h6>
                <Link
                  href="/lecturer/activities"
                  className="text-blue-700 text-sm"
                >
                  View all
                </Link>
              </div>

             <div className="flex flex-col gap-4 mt-4">
             <div className="flex mt-5">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <img src="" alt="" />
                </div>
                <div className="ml-4">
                  <p className="text-lg text-gray-800 font-semibold">Desmont Eliot</p>
                  <p className="text-sm text-gray-500">Role: Lecturer</p>
                  <p className="text-sm text-gray-700">Modified Year Two Timetable</p>
                  <p className="text-sm text-gray-500">5 hours ago</p>
                </div>
              </div>

              <div className="flex mt-5">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <img src="" alt="" />
                </div>
                <div className="ml-4">
                  <p className="text-lg text-gray-800 font-semibold">Desmont Eliot</p>
                  <p className="text-sm text-gray-500">Role: Lecturer</p>
                  <p className="text-sm text-gray-700">Modified Year Two Timetable</p>
                  <p className="text-sm text-gray-500">5 hours ago</p>
                </div>
              </div>

              <div className="flex mt-5">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <img src="" alt="" />
                </div>
                <div className="ml-4">
                  <p className="text-lg text-gray-800 font-semibold">Desmont Eliot</p>
                  <p className="text-sm text-gray-500">Role: Lecturer</p>
                  <p className="text-sm text-gray-700">Modified Year Two Timetable</p>
                  <p className="text-sm text-gray-500">5 hours ago</p>
                </div>
              </div>

              <div className="flex mt-5">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <img src="" alt="" />
                </div>
                <div className="ml-4">
                  <p className="text-lg text-gray-800 font-semibold">Desmont Eliot</p>
                  <p className="text-sm text-gray-500">Role: Lecturer</p>
                  <p className="text-sm text-gray-700">Modified Year Two Timetable</p>
                  <p className="text-sm text-gray-500">5 hours ago</p>
                </div>
              </div>

              <div className="flex mt-5">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <img src="" alt="" />
                </div>
                <div className="ml-4">
                  <p className="text-lg text-gray-800 font-semibold">Desmont Eliot</p>
                  <p className="text-sm text-gray-500">Role: Lecturer</p>
                  <p className="text-sm text-gray-700">Modified Year Two Timetable</p>
                  <p className="text-sm text-gray-500">5 hours ago</p>
                </div>
              </div>
             </div>
            </div>
          </section>

          <section className="flex md:flex-row flex-col gap-4 items-start">
            <div className="w-full md:w-full h-fit table__container table__container_full text-sm leading-4 pb-[4rem]">
              <h6 className="py-2 font-semibold text-gray-700 text-xl mb-2">Students</h6>
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
                          <span className="">No. of Class Attended This Week</span>
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
                      )
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
                    }
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

