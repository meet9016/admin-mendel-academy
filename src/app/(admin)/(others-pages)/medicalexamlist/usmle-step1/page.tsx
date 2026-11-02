"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BackButton from "@/components/common/BackButton";
import USMLEStep1ContentForm from "@/components/medicalexam/USMLEStep1ContentForm";
import { Skeleton } from "primereact/skeleton";

function ContentPage() {
  const searchParams = useSearchParams();
  const examId = searchParams.get("id");

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              USMLE Step 1 Content Manager
            </h1>
            <p className="text-xs text-gray-500">
              Customize text, links, tools, and pricing for the USMLE Step 1 page
            </p>
          </div>
        </div>
      </div>

      {examId ? (
        <USMLEStep1ContentForm examId={examId} />
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-500">
          No Exam ID provided. Please navigate from the Medical Exam List table.
        </div>
      )}
    </div>
  );
}

export default function USMLEStep1PageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="p-6 bg-white rounded-2xl border border-gray-200 space-y-4">
          <Skeleton width="40%" height="2rem" />
          <Skeleton width="100%" height="15rem" />
        </div>
      }
    >
      <ContentPage />
    </Suspense>
  );
}

