"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import LoaderIcon from "@/components/icons/LoaderIcon";
import DashboardLayout from "@/layouts/dasboard";
import EmptyTable from "@/components/emptytable";
import classNames from "classnames";
import {
  getDasboardAnalytics,
  getDasboardInsights,
  getDasboardPerf,
  getStudentDashboard,
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
import { RootState, useAppSelector } from "@/reducer/store";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StudentDashboard = () => {
  const [insights, setInsights] = useState<any>({});
  const [performance, setPerformance] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useAppSelector((state: RootState) => state.auth.user);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await getStudentDashboard();
      console.log("Dashboard Data: ", res);
      setInsights(res);
    } catch (error) {
      toast.error("Unable to fetch attendance details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Prepare chart data for students with critical issues
  const studentsCriticalData = {
    labels: performance?.studentsWithCriticalIssues?.map(
      (item: any) => item?.student_matricNo
    ),
    datasets: [
      {
        label: "Average Attendance",
        data: performance?.studentsWithCriticalIssues?.map(
          (item: any) => item?.averageAttendance
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
      (item: any) => item?.department_name
    ),
    datasets: [
      {
        label: "Average Attendance",
        data: performance?.topPerformingDepartments?.map(
          (item: any) => item?.count
        ),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
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
          {/* Dashboard Insights Section */}
          <section className="flex md:flex-row flex-wrap md:flex-nowrap mb-8 items-start md:gap-5 gap-4 mt-10">
            <div className="md:w-1/4 w-[45%] bg-white rounded-lg p-5 flex items-center gap-4">
              <div className="flex items-center justify-center bg-[#E6F7FF] rounded-full w-12 h-12">
                <i className="ri-group-line text-xl text-[#1E90FF]"></i>
              </div>
              <div>
                <p className="text-sm text-gray-700">Total Lecturer</p>
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
                  {insights?.attendances?.length || 0}
                </h6>
              </div>
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

export default StudentDashboard;

