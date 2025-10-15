import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import Blogs from "@/components/blogs/Blogs";
import ComponentCard from "@/components/common/ComponentCard";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { PlusIcon } from "@/icons";

export const metadata: Metadata = {
  title: "Next.js Calender | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Blogs" />
      <div className="space-y-6">
        <ComponentCard
          title="Basic Table 1" 
          Plusicon={<PlusIcon />}
          name="Add blogs"
          onAddProductClick="/add-product">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
