"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import ComponentCard from "@/components/common/ComponentCard";
import { useRouter } from "next/navigation";
import PrimeReactTreeTable from "@/components/tables/PrimeReactTreeTable";
import CommonDialog from "@/components/tables/CommonDialog";
import { PlusIcon } from "@/icons";

// ---------------------- TYPES ----------------------
type LiveCourseChild = {
  session_title: string;
  session_date: string;
};

export type FormattedTreeData = {
  id: string;
  course_title: string;
  instructor_name: string;
  date?: string;
  createdAt?: string;
  qualification?: string;
  children?: LiveCourseChild[];
};

// ---------------------- MAIN COMPONENT ----------------------
export default function Page() {
  const router = useRouter();

  const [data, setData] = useState<FormattedTreeData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<FormattedTreeData | null>(null);
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // ---------------------- DELETE HANDLER ----------------------
  const handleDeleteClick = (row: FormattedTreeData) => {
    setSelectedRow(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRow) return;
    try {
      const res = await api.delete(`${endPointApi.deleteLiveCourses}/${selectedRow.id}`);
      if (res?.data?.message) {
        getLiveCoursesData();
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedRow(null);
    }
  };

  // ---------------------- API CALL + DATA FORMAT ----------------------
  const getLiveCoursesData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`${endPointApi.getAllLiveCourses}?page=${page}&limit=${rows}`);

      const apiData = Array.isArray(res.data.data) ? res.data.data : [];

      // Convert API data → TreeTable Format
      const formattedData: FormattedTreeData[] = apiData.map((item: any) => {
        const children =
          Array.isArray(item?.choose_plan_list) &&
          item.choose_plan_list.map((p: any) => ({
            module_title: p?.title || "-",
            module_number: p?.moduleNumber || "-",
            price: p?.price || "-",
          }));

        return {
          id: String(item.id),
          course_title: item.course_title ?? "-",
          instructor_name: item.instructor_name ?? "-",
          qualification: item.instructor?.qualification ?? "-",
          date: item.date,
          createdAt: item.createdAt,
          children: children || [],
        };
      });


      setData(formattedData);
      setTotalRecords(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, rows]);

  useEffect(() => {
    getLiveCoursesData();
  }, [getLiveCoursesData]);

  const headerNameMap = {
    plan_day: "Module Number",
    plan_type: "Module Name",
    plan_pricing: "Module Price",
    plan_popular: "Most Popular",
  };

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Live Courses List"
        Plusicon={<PlusIcon />}
        name="Add Live Courses"
        onAddProductClick="/liveCourses/add"
      >
        <div className="card">
          <PrimeReactTreeTable
            data={data}
            loading={loading}
            totalRecords={totalRecords}
            rows={rows}
            onPageChange={(newPage, newRows) => {
              setPage(newPage);
              setRows(newRows);
            }}
            columns={[
              { field: "course_title", header: "Course Title" },
              { field: "instructor_name", header: "Instructor Name" },
              {
                field: "qualification",
                header: "Instructor Qualification",

              },
            ]}
            headerNameMap={headerNameMap}
            onEdit={(row) => router.push(`/liveCourses/add?id=${row.id}`)}
            onDelete={handleDeleteClick}
          />
        </div>
      </ComponentCard>

      <CommonDialog
        visible={isDeleteModalOpen}
        header="Confirm Delete"
        footerType="confirm-delete"
        onHide={() => setIsDeleteModalOpen(false)}
        onSave={confirmDelete}
      >
        <div className="confirmation-content flex items-center gap-3">
          <i className="pi pi-exclamation-triangle text-3xl text-red-500" />
          {selectedRow && (
            <span>
              Are you sure you want to delete <b>{selectedRow.course_title}</b>?
            </span>
          )}
        </div>
      </CommonDialog>
    </div>
  );
}
