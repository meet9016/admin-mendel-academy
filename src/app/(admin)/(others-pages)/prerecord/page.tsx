"use client";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import ComponentCard from "@/components/common/ComponentCard";
// import { PlusIcon } from "@/icons";
import { useRouter } from "next/navigation";
import PrimeReactTable from "@/components/tables/PrimeReactTable";
import { Tag } from "primereact/tag";
import CommonDialog from "@/components/tables/CommonDialog";

type PreRecordType = {
  id: number;
  title: string;
  vimeo_video_id: string;
  total_reviews: number;
  rating: number;
  price: number;
  date?: string;
  createdAt?: string;
  duration?: string;
  status?: string
};

export default function Page() {
  const router = useRouter();

  const [data, setData] = useState<PreRecordType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PreRecordType | null>(null);
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const handleDeleteClick = (row: PreRecordType) => {
    setSelectedRow(row);
    setIsDeleteModalOpen(true);
  };

  const getPreRecordData = useCallback(async () => {
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
  }, [page, rows]);

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
  }, [getPreRecordData]);
  return (

    <div className="space-y-6">
      <ComponentCard
        title="Prerecord List"
        // Plusicon={<PlusIcon />}
        // name="Add Prerecord"
        // onAddProductClick="/prerecord/add"
      >
        <div className="card">
          <PrimeReactTable
            data={data}
            loading={loading}
            totalRecords={totalRecords}
            rows={rows}
            onPageChange={(newPage, newRows) => {
              setPage(newPage);
              setRows(newRows);
            }}
            columns={[
              { field: "title", header: "Title", sortable: true},
              { field: "total_reviews", header: "Total reviews"},
              { field: "rating", header: "Rating"},
              { field: "vimeo_video_id", header: "Vimeo video id"},
              { field: "price", header: "Price", sortable: true },
              { field: "duration", header: "Duration", sortable: true },
              {
                field: "status",
                header: "Status",
                body: (row) => {
                  const status = row.status || "Inactive";
                  const severity =
                    status === "Active"
                      ? "success"
                      : status === "Pending"
                        ? "warning"
                        : "danger";
                  return <Tag value={status} severity={severity} />;
                },
              },
            ]}
            onEdit={(row) => router.push(`/prerecord/add?id=${row.id}`)}
            onDelete={handleDeleteClick}
          />
        </div>
        {/* <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        /> */}
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
                Are you sure you want to delete <b>{selectedRow.title}</b>?
              </span>
            )}
          </div>
        </CommonDialog>
      </ComponentCard>
    </div>

  );
}