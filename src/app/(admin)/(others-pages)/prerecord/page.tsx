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
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);

  const handleDeleteClick = (row: BlogType) => {
    setSelectedRow(row);
    setIsDeleteModalOpen(true);
  };

  const getPreRecordData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${endPointApi.getAllPreRecorded}?page=${page}&limit=${rows}`);
      setData(res.data.data || []);
      setTotalRecords(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedRow) return;

    try {
      const res = await api.delete(`${endPointApi.deletePreRecorded}/${selectedRow.id}`);

      if (res?.data?.message) {
        getPreRecordData(); // Refresh the table/list after deletion
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedRow(null);
    }
  };


  useEffect(() => {
    getPreRecordData();
    }, [page, rows]);

  return (

    <div className="space-y-6">
      <ComponentCard
        title="Prerecord List"
        Plusicon={<PlusIcon />}
        name="Add Prerecord"
        onAddProductClick="/prerecord/add"
      >
        <div className="card">
          <ReactTable
            selectable={true}
            data={data}
            loading={loading}
            columns={[
              { field: "title", header: "Title" },
              { field: "vimeo_video_id", header: "vimeo_video_id" },
              { field: "price", header: "price" },
              { field: "duration", header: "duration" },
              // {
              //   field: "sort_description",
              //   header: "sort_description",
              //   body: (row) => row?.sort_description ?? "-",
              // },
              {
                field: "date", header: "Date", body: (row) =>
                  row.date ? new Date(row.date).toLocaleDateString() : "-",
              },
              { field: "status", header: "Status" },
            //   {
            //     field: "createdAt",
            //     header: "Created At",
            //     body: (row) =>
            //       row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
            //   },
              {
                header: "Action",
                sortable: false,
                body: (row) => (
                  <div className="flex gap-5">
                    <button className="text-green-500 hover:text-green-700"
                        onClick={() => router.push(`/prerecord/add?id=${row.id}`)}
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
            onPageChange={(newPage, newRows) => {
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