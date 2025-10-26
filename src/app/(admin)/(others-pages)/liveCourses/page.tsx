"use client";
import { useState, useEffect } from "react";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import ReactTable from "@/components/tables/ReactTable";
import ComponentCard from "@/components/common/ComponentCard";
import { PlusIcon } from "@/icons";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { useRouter } from "next/navigation";

type BlogType = {
  id: number;
  title: string;
  exam_name: string;
  author?: string;
  createdAt?: string;
};

export default function Page() {
    const router = useRouter();
  
  const [data, setData] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<BlogType | null>(null);
  console.log("*******", data);

  const handleDeleteClick = (row: BlogType) => {
    setSelectedRow(row);
    setIsDeleteModalOpen(true);
  };

  const getBlogData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${endPointApi.getAllLiveCourses}`);
      setData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedRow) return;

    try {
      const res = await api.delete(`${endPointApi.deleteLiveCourses}/${selectedRow.id}`);

      if (res?.data?.message) {
        getBlogData(); // Refresh the table/list after deletion
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedRow(null);
    }
  };


  useEffect(() => {
    getBlogData();
  }, []);

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
                field: "date", header: "Date", body: (row) =>
                  row.date ? new Date(row.date).toLocaleDateString() : "-",
              },
              { field: "status", header: "Status" },
              {
                field: "createdAt",
                header: "Created At",
                body: (row) =>
                  row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
              },
              {
                header: "Action",
                sortable: false,
                body: (row) => (
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