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
import BaseButton from "@/components/buttons/base-button/BaseButton";
import makeNetworkCall from "@/helpers/axios-request";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const StudentDashboard = () => {
  const [insights, setInsights] = useState<any>({});
  const [analytic, setAnalytics] = useState<any>({});
  const [performance, setPerformance] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useAppSelector((state: RootState) => state.auth.user);

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
              <p className="text-sm">Today's Attendance</p>
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
