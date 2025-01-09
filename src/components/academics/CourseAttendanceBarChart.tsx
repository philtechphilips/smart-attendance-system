// components/AttendanceBarChart.tsx
import React from "react";
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface ChartData {
  graphData: {
    date: string;
    presentCount: string;
    absentCount: string;
  }[];
}

const AttendanceBarChart: React.FC<ChartData> = ({ graphData }) => {
  // Extract and format the data for the chart
  const labels = graphData?.map((data) =>
    new Date(data.date).toLocaleDateString(),
  );
  const presentCounts = graphData?.map((data) => Number(data.presentCount));
  const absentCounts = graphData?.map((data) => Number(data.absentCount));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Present Count",
        data: presentCounts,
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Light teal
      },
      {
        label: "Absent Count",
        data: absentCounts,
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Light red
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Attendance Comparison",
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default AttendanceBarChart;
