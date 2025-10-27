"use client";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import ReactTable from "@/components/tables/ReactTable";
import ComponentCard from "@/components/common/ComponentCard";
import { PlusIcon } from "@/icons";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { useRouter } from "next/navigation";

type LiveCoursesType = {
  id: number;
  title: string;
  exam_name: string;
  author?: string;
  date?: string;
  createdAt?: string;
};

export default function Page() {
    const router = useRouter();
  
  const [data, setData] = useState<LiveCoursesType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<LiveCoursesType | null>(null);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);

  const handleDeleteClick = (row: LiveCoursesType) => {
    setSelectedRow(row);
    setIsDeleteModalOpen(true);
  };

    const getLiveCoursesData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`${endPointApi.getAllLiveCourses}?page=${page}&limit=${rows}`);
        setData(res.data.data || []);
      setTotalRecords(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
    }, [page, rows]);

  const confirmDelete = async () => {
    if (!selectedRow) return;

    try {
      const res = await api.delete(`${endPointApi.deleteLiveCourses}/${selectedRow.id}`);

      if (res?.data?.message) {
        getLiveCoursesData(); // Refresh the table/list after deletion
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedRow(null);
    }
  };

  useEffect(() => {
    getLiveCoursesData();
  }, [getLiveCoursesData]);

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Live Courses List"
        Plusicon={<PlusIcon />}
        name="Add Live Courses"
        onAddProductClick="/liveCourses/add"
      >
        <div className="card">
          <ReactTable
            selectable={true}
            data={data}
            loading={loading}
            columns={[
              { field: "course_title", header: "Course Title" },
              { field: "instructor_name", header: "Instructor Name" },
              { field: "sub_scribe_student_count", header: "Sub Scribe Count" },
              { field: "zoom_link", header: "Zoom Link" },
              {
                field: "date", header: "Date", body: (row: LiveCoursesType) =>
                  row.date ? new Date(row.date).toLocaleDateString() : "-",
              },
              { field: "status", header: "Status" },
              {
                field: "createdAt",
                header: "Created At",
                body: (row: LiveCoursesType) =>
                  row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
              },
              {
                header: "Action",
                sortable: false,
                body: (row: LiveCoursesType) => (
                  <div className="flex gap-5">
                    <button className="text-green-500 hover:text-green-700"
                        onClick={() => router.push(`/liveCourses/add?id=${row.id}`)}
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteClick(row)}
                    >
                      <MdDeleteForever size={18} />
                    </button>
                  </div>
                ),
              }
            ]}
             lazy
            page={page}
            rows={rows}
            totalRecords={totalRecords}
             onPageChange={(newPage: number, newRows: number) => {
              setPage(newPage);
              setRows(newRows);
            }}
          />
        </div>
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        />
      </ComponentCard>
    </div>

  );
}