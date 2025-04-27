"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoaderIcon from "@/components/icons/LoaderIcon";
import DashboardLayout from "@/layouts/dasboard";
import EmptyTable from "@/components/emptytable";
import classNames from "classnames";
import { getStaffDasboard } from "@/services/Dashboard";
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
  Legend,
);

type TimeRange = "week" | "month" | "year";

interface AttendanceDataItem {
  label: string;
  present: number | string;
  absent: number | string;
}

const Dashboard = () => {
  const [insights, setInsights] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("month"); // Default to month view

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await getStaffDasboard(timeRange);
      setInsights(res);
    } catch (error) {
      toast.error("Unable to fetch attendance details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [timeRange]);

  const processAttendanceData = (): {
    labels: string[];
    present: number[];
    absent: number[];
  } => {
    if (!insights.attendanceData || !Array.isArray(insights.attendanceData)) {
      return { labels: [], present: [], absent: [] };
    }

    const labels: string[] = [];
    const present: number[] = [];
    const absent: number[] = [];

    insights.attendanceData.forEach((item: AttendanceDataItem) => {
      labels.push(item.label);
      present.push(
        typeof item.present === "string"
          ? parseInt(item.present)
          : item.present,
      );
      absent.push(
        typeof item.absent === "string" ? parseInt(item.absent) : item.absent,
      );
    });

    return { labels, present, absent };
  };

  const { labels, present, absent } = processAttendanceData();

  const chartData: ChartData<"bar"> = {
    labels,
    datasets: [
      {
        label: "Present",
        data: present,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Absent",
        data: absent,
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
        text: `Attendance Data (${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)})`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text:
            timeRange === "week"
              ? "Days of Week"
              : timeRange === "month"
                ? "Days of Month"
                : "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Students",
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
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
                  {insights?.totalStudents || 0}
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
                  {insights?.courseCount || 0}
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
                  {insights?.courseCount || 0}
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
                  {insights?.totalAttendanceRecords || 0}
                </h6>
              </div>
            </div>
          </section>

          <section className="flex md:flex-row flex-wrap md:flex-nowrap mb-8 items-start md:gap-5 gap-4 mt-10">
            <div className="md:w-2/3 w-full bg-white rounded-lg p-5">
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
                {labels.length > 0 ? (
                  <Bar data={chartData} options={options} />
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p>No attendance data available</p>
                  </div>
                )} 
              </div>
            </div>

            <div className="md:w-1/3 w-full bg-white rounded-lg p-5">
      
            </div>
          </section>

          <section className="flex md:flex-row flex-col gap-4 items-start">
            <div className="w-full md:w-full h-fit table__container table__container_full text-sm leading-4 pb-[4rem]">
              <h6 className="py-2 font-semibold text-gray-700 text-xl mb-2">
                Students
              </h6>
              {insights?.studentList?.length > 0 ? (
                <table className="w-full text-sm leading-6 bg-white border-collapse">
                  <thead className="sticky top-0 bg-white z-[2]">
                    <tr className="text-left">
                      <th className="px-4 py-3 text-center leading-6 text-[#4D4D4D]">
                        S/N
                      </th>
                      <th>
                        <div className="flex items-left gap-2">
                          <span className="text-center">Name</span>
                        </div>
                      </th>
                      <th className="py-3 text-left">Matric No.</th>
                      <th>
                        <div className="flex items-left gap-2">
                          <span className="text-center">Department</span>
                        </div>
                      </th>
                      <th>
                        <div className="flex items-left gap-2">
                          <span className="text-center">Level</span>
                        </div>
                      </th>
                      <th>
                        <div className="flex items-left gap-2">
                          <span className="text-center">Phone No.</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {insights.studentList.map((item: any, index: number) => (
                      <tr
                        key={index}
                        className="border-t-2 border-[#e6e6e6] text-[#4D4D4D] w-full hover:bg-[#737373] hover:bg-opacity-10 cursor-pointer"
                      >
                        <td className="py-3 pr-4 text-center relative">
                          <p>{index + 1}</p>
                        </td>
                        <td className="py-3 text-left">
                          {item?.firstname + " " + item?.lastname}
                        </td>
                        <td className="py-3 text-left">{item?.matricNo}</td>
                        <td className="py-3 text-left">
                          {item?.department?.name}
                        </td>
                        <td className="py-3 text-left">{item?.level?.name}</td>
                        <td className="py-3 text-left">{item?.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyTable title="No students" />
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="flex w-full min-h-screen items-center justify-center">
          <LoaderIcon />
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
