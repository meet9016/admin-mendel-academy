"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import ComponentCard from "@/components/common/ComponentCard";
import { useRouter } from "next/navigation";
import PrimeReactTreeTable from "@/components/tables/PrimeReactTreeTable";
import CommonDialog from "@/components/tables/CommonDialog";
import { PlusIcon } from "@/icons";
import { Skeleton } from "primereact/skeleton";
import { toast } from "react-toastify";

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
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<FormattedTreeData | null>(null);
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isConverting, setIsConverting] = useState(false);

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
        toast.success(res.data.message || "Course deleted successfully");
        getLiveCoursesData();
      }
    } catch (error: any) {
      console.error("❌ Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete course");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedRow(null);
    }
  };

  // ---------------------- CONVERT HANDLER ----------------------
  const handleConvertClick = (row: FormattedTreeData) => {
    console.log('🔄 Convert clicked for:', row);
    setSelectedRow(row);
    setIsConvertModalOpen(true);
  };

  const confirmConvert = async () => {
    if (!selectedRow) return;
    setIsConverting(true);
    try {
      const res = await api.post(`${endPointApi.convertLiveToPreRecord}/${selectedRow.id}`);
      if (res?.data?.success) {
        toast.success(res.data.message || "Converted successfully!");
        router.push("/prerecord"); // Redirect to prerecord list
      }
    } catch (error: any) {
      console.error("❌ Conversion error:", error);
      toast.error(error.response?.data?.message || "Failed to convert course");
    } finally {
      setIsConverting(false);
      setIsConvertModalOpen(false);
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
           {
          loading ? (
            renderSkeletonRows()
          ) : (
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
            onConvert={handleConvertClick}
          />
          )}
        </div>
      </ComponentCard>

      {/* Delete Confirmation Modal */}
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

      {/* Convert Confirmation Modal */}
      <CommonDialog
        visible={isConvertModalOpen}
        header="Convert to Pre-recorded"
        footerType="confirm-save"
        onHide={() => !isConverting && setIsConvertModalOpen(false)}
        onSave={confirmConvert}
        saveLabel={isConverting ? "Converting..." : "Convert Now"}
      >
        <div className="confirmation-content flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <i className="pi pi-sync text-3xl text-blue-500" />
            {selectedRow && (
              <span>
                Are you sure you want to convert <b>{selectedRow.course_title}</b> to a pre-recorded course?
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
            Note: The Vimeo video ID will be set to a placeholder. You will need to update it manually in the Pre-recorded courses section.
          </p>
        </div>
      </CommonDialog>
    </div>
  );
}

const renderSkeletonRows = () => (
  <div className="card p-4">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="flex items-center py-2 border-b">
        <Skeleton size="1.5rem" className="mr-3" />
        <Skeleton width="25rem" height="2.2rem" className="mr-4" />
        <Skeleton width="20rem" height="2.2rem" className="mr-4" />
        <Skeleton width="15rem" height="2.2rem" className="mr-4" />
        <Skeleton width="8rem" height="2.2rem" className="mr-4" />
        <Skeleton width="8rem" height="2.2rem" className="mr-4" />
        {/* <Skeleton width="10rem" height="2.2rem" className="mr-4" /> */}
        <Skeleton shape="circle" size="2rem" className="mr-2" />
        <Skeleton shape="circle" size="2rem" />
      </div>
    ))}
  </div>
);