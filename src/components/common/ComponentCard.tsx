"use client"
import { useRouter } from "next/navigation";
import React from "react";

interface ComponentCardProps {
  title: string;
  name?: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  onAddProductClick?: string; // new prop for click handler
  Plusicon?: React.ReactNode;
  desc?: string; // Description text
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  name = "",
  children,
  className = "",
  onAddProductClick = "",
  Plusicon = null,
  desc = "",
}) => {
  const router = useRouter();
  return (
    <>
      <div
        className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 ${className}`}
      >
        {/* Card Header */}
        <div className="px-6 py-5 flex items-center justify-between">
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
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </>
  );
};

export default ComponentCard;
