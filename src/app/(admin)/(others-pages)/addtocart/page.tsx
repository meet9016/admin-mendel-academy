"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PrimeReactTable from "@/components/tables/PrimeReactTable";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import CommonDialog from "@/components/tables/CommonDialog";
import { Skeleton } from "primereact/skeleton";

type PreRecordType = {
    id: number;
    title: string;
    price: number;
    date?: string;
    createdAt?: string;
    description?: string;
    status?: string;
    category_name?: any;
    duration?: string;
    quantity?: number;
};

type Col = "category_name" | "duration" | "price" | "quantity" | "product_id" | "createdAt";

export default function Page() {
    const [data, setData] = useState<PreRecordType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<PreRecordType | null>(null);
    const [page, setPage] = useState<number>(1);
    const [rows, setRows] = useState<number>(10);
    const [totalRecords, setTotalRecords] = useState<number>(0);

    const getBlogData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`${endPointApi.getAllCart}?page=${page}&rows=${rows}`);
            console.log("res*******", res.data.data);

            setData(res.data.data || []);
            setTotalRecords(res.data.total || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, rows]);

    useEffect(() => {
        getBlogData();
    }, [getBlogData]);

    const confirmDelete = async () => {
        if (!selectedRow) return;

        try {
            const res = await api.delete(`${endPointApi.deletePreRecorded}/${selectedRow.id}`);

            if (res?.data?.message) {
                // Refresh data after deletion
                getBlogData();
            }
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setIsDeleteModalOpen(false);
            setSelectedRow(null);
        }
    };

    const columns = useMemo(
        () => [
            {
                field: "category_name" as Col,
                header: "Category Name",
                body: (rowData: PreRecordType) => {
                    const categoryName = typeof rowData.category_name === 'object'
                        ? JSON.stringify(rowData.category_name)
                        : rowData.category_name;
                    return <span>{categoryName || "-"}</span>;
                },
            },
            {
                field: "duration" as Col,
                header: "Duration",
                body: (rowData: PreRecordType) => <span>{rowData.duration || "-"}</span>,
            },
            {
                field: "price" as Col,
                header: "Price",
                body: (rowData: PreRecordType) => <span>{rowData.price || "-"}</span>,
            },
            {
                field: "quantity" as Col,
                header: "Quantity",
                body: (rowData: PreRecordType) => <span>{rowData.quantity || "-"}</span>,
            },
            {
                field: "createdAt" as Col,
                header: "Created At",
                body: (rowData: PreRecordType) =>
                    rowData.createdAt ? <span>{new Date(rowData.createdAt).toLocaleDateString()}</span> : <span>-</span>,
            },
        ],
        []
    );

    // Show skeleton while loading
  if (loading) {
    // fallthrough to render inside card skeleton (below)
  }

    return (
        <div className="space-y-6">
            <ComponentCard
                title="Add to Cart List"
            >
                <div className="card">
          {loading ? (
            renderSkeletonRows()
          ) : (
            <PrimeReactTable
              data={data}
              loading={false}
              totalRecords={totalRecords}
              rows={rows}
              columns={columns}
              onPageChange={(newPage, newRows) => {
                setPage(newPage);
                setRows(newRows);
              }}
            />
          )}
                </div>
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                />
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
        <Skeleton width="15rem" height="2.2rem" className="mr-4" />
        <Skeleton width="8rem" height="2.2rem" className="mr-4" />
        <Skeleton width="8rem" height="2.2rem" className="mr-4" />
        <Skeleton shape="circle" size="2rem" className="mr-2" />
        <Skeleton shape="circle" size="2rem" />
      </div>
    ))}
  </div>
);
