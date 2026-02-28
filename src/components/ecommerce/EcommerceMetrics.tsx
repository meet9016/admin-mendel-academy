"use client";
import React, { useState, useEffect, useRef } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { EcommerceMetricsSkeleton } from "../skeltons/Skeltons";

// Measure actual text widths
const TEXT_MEASUREMENTS = {
  customers: {
    label: "Customers", // Approx 90px at 14px font
    value: "3,782",    // Approx 60px at 20px font
    badge: "11.01%"    // Approx 85px with icon
  },
  orders: {
    label: "Orders",   // Approx 70px at 14px font
    value: "5,359",    // Approx 60px at 20px font
    badge: "9.05%"     // Approx 85px with icon
  }
};

export const EcommerceMetrics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const customersRef = useRef<HTMLDivElement>(null);
  const ordersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <EcommerceMetricsSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Customers Card - with ref for measurement */}
      <div 
        ref={customersRef}
        className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
      >
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              3,782
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>

      {/* Orders Card - with ref for measurement */}
      <div 
        ref={ordersRef}
        className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
      >
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              5,359
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge>
        </div>
      </div>
    </div>
  );
};