"use client";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import ComponentCard from "@/components/common/ComponentCard";
// import { PlusIcon } from "@/icons";
import { useRouter } from "next/navigation";
import PrimeReactTable from "@/components/tables/PrimeReactTable";
import CommonDialog from "@/components/tables/CommonDialog";
import { PlusIcon } from "@/icons";
import { Skeleton } from "primereact/skeleton";

type PreRecordType = {
  id: number;
  title: string;
  waitlistCount: string;
  createdAt: string;
  course_types: string
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
      const res = await api.get(`${endPointApi.getAllUpcomeingProgram}?page=${page}&limit=${rows}`);
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
      const res = await api.delete(`${endPointApi.deleteUpcomeingProgram}/${selectedRow.id}`);

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
        title="Upcomeing Program"
        Plusicon={<PlusIcon />}
        name="Add Prerecord"
        onAddProductClick="/upcomingProgram/add"
      >
        <div className="card">
           {
          loading ? (
            renderSkeletonRows()
          ) : (
          <PrimeReactTable
            data={data}
            loading={loading}
            totalRecords={totalRecords}
            rows={rows}
            onPageChange={(newPage: number, newRows:number) => {
              setPage(newPage);
              setRows(newRows);
            }}
            columns={[
              { field: "title", header: "Title" },
              { field: "waitlistCount", header: "WaitlistCount" },
              { field: "course_types", header: "Course Type" }
            ]}
            onEdit={(row) => router.push(`/upcomingProgram/add?id=${row._id}`)}
            onDelete={handleDeleteClick}
          />
          )}
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

const renderSkeletonRows = () => (
  <div className="card p-4">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="flex items-center py-2 border-b">
        <Skeleton size="1.5rem" className="mr-3" />
        <Skeleton width="25rem" height="2.2rem" className="mr-4" />
        <Skeleton width="20rem" height="2.2rem" className="mr-4" />
        <Skeleton width="20rem" height="2.2rem" className="mr-4" />
        <Skeleton width="20rem" height="2.2rem" className="mr-4" />
        {/* <Skeleton width="10rem" height="2.2rem" className="mr-4" /> */}
        <Skeleton shape="circle" size="2rem" className="mr-2" />
        <Skeleton shape="circle" size="2rem" />
      </div>
    ))}
  </div>
);