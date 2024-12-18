"use client";
import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface LineChartProp {
  hidLegend?: boolean;
  chartData: any;
}
interface Dataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  barThickness: number;
}
interface Data {
  labels: any[];
  datasets: Dataset[];
}

const ChartOne: React.FC<LineChartProp> = ({ chartData }) => {
  const [hidLegend, setHideLegend] = useState(true);
  const data: Data = {
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        borderColor: "#325A6D",
        backgroundColor: "#325A6D",
        barThickness: 15,
      },
    ],
  };

  chartData?.forEach((value: any) => {
    data.labels.push(value.period);
    data.datasets[0].data.push(value.avg_points);
  });
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: hidLegend ? false : true,
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        border: { dash: [4, 4] },
        grid: {
          drawTicks: false,
        },
      },
      x: {
        grid: {
          display: false,
          drawOnChartArea: false,
          drawTicks: false,
          drawBorder: false,
        },
      },
    },
  };

  return (
    <div id="chart-container" className="w-full max-h-[300px] mb-4">
      <Bar options={options} data={data} />
    </div>
  );
};

export default ChartOne;
