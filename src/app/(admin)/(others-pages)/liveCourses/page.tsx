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
  module_number: string;
  module_title: string;
  price: string | number;
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
    console.log('🗑️ Delete clicked for:', row); // Debug log
    setSelectedRow(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRow) return;
    try {
      console.log('🗑️ Deleting course ID:', selectedRow.id); // Debug log
      const res = await api.delete(`${endPointApi.deleteLiveCourses}/${selectedRow.id}`);
      if (res?.data?.message || res?.data?.success) {
        console.log('✅ Delete successful');
        getLiveCoursesData();
      }
    } catch (error) {
      console.error("❌ Delete error:", error);
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

      console.log('📦 Raw API Response:', res.data); // Debug log

      const apiData = Array.isArray(res.data.data) ? res.data.data : [];

      // ✅ Convert API data → TreeTable Format
      const formattedData: FormattedTreeData[] = apiData.map((item: any) => {
        // ✅ FIX: Use _id (MongoDB ID) instead of id
        const courseId = item._id || item.id;

        console.log('📝 Processing course:', item.course_title, 'ID:', courseId); // Debug log

        const children =
          Array.isArray(item?.choose_plan_list) &&
          item.choose_plan_list.map((p: any) => ({
            module_number: p?.moduleNumber || "-",
            module_title: p?.title || "-",
            price: p?.price || "-",
          }));

        return {
          id: String(courseId), // ✅ FIX: Ensure ID is properly set
          course_title: item.course_title ?? "-",
          instructor_name: item.instructor_name ?? "-",
          qualification: item.instructor?.qualification ?? "-",
          date: item.date,
          createdAt: item.createdAt,
          children: children || [],
        };
      });

      console.log('✅ Formatted Data:', formattedData); // Debug log

      setData(formattedData);

      // ✅ FIX: Handle pagination data correctly
      setTotalRecords(res.data.pagination?.totalRecords || res.data.total || apiData.length);
    } catch (err) {
      console.error('❌ API Error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rows]);

  useEffect(() => {
    getLiveCoursesData();
  }, [getLiveCoursesData]);

  const headerNameMap = {
    module_number: "Module Number",
    module_title: "Module Name",
    price: "Module Price",
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
            onEdit={(row) => {
              console.log('✏️ Edit clicked for ID:', row.id); // Debug log
              router.push(`/liveCourses/add?id=${row.id}`);
            }}
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