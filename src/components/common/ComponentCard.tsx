"use client"
import { usePathname, useRouter } from "next/navigation";
import { Calendar } from "primereact/calendar";
import React, { useState } from "react";

interface ComponentCardProps {
  title: string;
  name?: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  onAddProductClick?: string; // new prop for click handler
  Plusicon?: React.ReactNode;
  desc?: string; // Description text
  dates?: [Date | null, Date | null] | null;
  setDates?: (dates: [Date | null, Date | null] | null) => void;
  downloadExcel?: () => void;
  action?: React.ReactNode; // Custom action element to display in header
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  name = "",
  children,
  className = "",
  onAddProductClick = "",
  downloadExcel = () => { },
  Plusicon = null,
  desc = "",
  dates,
  setDates,
  action
}) => {
  const router = useRouter();
   const pathname = usePathname();

  // ✅ URL based condition
  const isPaymentPage = pathname?.includes("payment");

  return (
    <>
      <div
        className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 ${className}`}
      >
        {/* Card Header */}
        <div className="px-6 py-5 flex items-center justify-between w-full">
          <div>
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {title}
            </h3>
            {desc && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {desc}
              </p>
            )}
            {/* <h3 className="font-semibold text-[18px]">
            {dashboardTitle}
          </h3> */}
          </div>

          {name && (
            <button
              onClick={() => router.push(onAddProductClick)}
              className="bg-[#ffca00] px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2">
              {Plusicon} {name}
            </button>
          )}
          {action && action}
          {/* Date Range */}
          {/* Date Range + Download */}
         {isPaymentPage && (
            <div className="flex items-center gap-3">
                <Calendar
                  value={dates}
                  placeholder="Start Date - End Date"
                  onChange={(e) => setDates(e.value)}
                  selectionMode="range"
                  readOnlyInput
                  hideOnRangeSelection
                  className="p-inputtext-sm"
                />

                <button
                  onClick={downloadExcel}
                  className="bg-[#ffca00] px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                >
                  Download
                </button>
            </div>
         )}
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-4">
          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </>
  );
};

export default ComponentCard;
