"use client";
import React, { useState, useEffect } from "react";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "../skeltons/Skeltons";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <div className="h-[310px] w-full bg-gray-200 animate-pulse rounded-lg"></div>,
});

export default function StatisticsChart() {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<{
    options: ApexOptions;
    series: any[];
  } | null>(null);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      const options: ApexOptions = {
        legend: {
          show: false,
          position: "top",
          horizontalAlign: "left",
        },
        colors: ["#ffcc09", "#ffcc09"],
        chart: {
          fontFamily: "Outfit, sans-serif",
          height: 310,
          type: "line",
          toolbar: {
            show: false,
          },
        },
        stroke: {
          curve: "straight",
          width: [2, 2],
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.55,
            opacityTo: 0,
          },
        },
        markers: {
          size: 0,
          strokeColors: "#fff",
          strokeWidth: 2,
          hover: {
            size: 6,
          },
        },
        grid: {
          xaxis: {
            lines: {
              show: false,
            },
          },
          yaxis: {
            lines: {
              show: true,
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        tooltip: {
          enabled: true,
          x: {
            format: "dd MMM yyyy",
          },
        },
        xaxis: {
          type: "category",
          categories: [
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
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: "12px",
              colors: ["#6B7280"],
            },
          },
          title: {
            text: "",
            style: {
              fontSize: "0px",
            },
          },
        },
      };

      const series = [
        {
          name: "Sales",
          data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
        },
        {
          name: "Revenue",
          data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
        },
      ];

      setChartData({ options, series });
      setIsLoading(false);
    }, 1500); // 1.5 seconds delay to simulate loading

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <>
          <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
            <div className="w-full">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Statistics
              </h3>
              <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                Target you’ve set for each month
              </p>
            </div>
            <div className="flex items-start w-full gap-3 sm:justify-end">
              <ChartTab />
            </div>
          </div>

          <div className="max-w-full overflow-x-auto custom-scrollbar">
            <div className="min-w-[1000px] xl:min-w-full">
              {chartData && (
                <ReactApexChart
                  options={chartData.options}
                  series={chartData.series}
                  type="area"
                  height={310}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}