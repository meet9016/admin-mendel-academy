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
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);

  const handleDeleteClick = (row: BlogType) => {
    setSelectedRow(row);
    setIsDeleteModalOpen(true);
  };

   const getBlogData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`${endPointApi.getAllBlogs}?page=${page}&limit=${rows}`);
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
      const res = await api.delete(`${endPointApi.deleteBlog}/${selectedRow.id}`);

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
  }, [getBlogData]);

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Blog List"
        Plusicon={<PlusIcon />}
        name="Add Blog"
        onAddProductClick="/blogs/add"
      >
        <div className="card">
          <ReactTable
            selectable={true}
            data={data}
            loading={loading}
            columns={[
              { field: "exam_name", header: "Exam Name" },
              { field: "title", header: "Title" },
              // {
              //   field: "sort_description",
              //   header: "sort_description",
              //   body: (row) => row?.sort_description ?? "-",
              // },
              // {
              //   field: "date", header: "Date", body: (row) =>
              //     row.date ? new Date(row.date).toLocaleDateString() : "-",
              // },
              { field: "status", header: "Status" },
              {
                field: "createdAt",
                header: "Created At",
                // body: (row) =>
                //   row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
              },
              {
                header: "Action",
                sortable: false,
                body: (row: BlogType) => (
                  <div className="flex gap-5">
                    <button className="text-green-500 hover:text-green-700"
                      onClick={() => router.push(`/blogs/add?id=${row.id}`)}
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
            //  paginator
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