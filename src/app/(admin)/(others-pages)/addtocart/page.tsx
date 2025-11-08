"use client";
import { useCallback, useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
// import { PlusIcon } from "@/icons";
import PrimeReactTable from "@/components/tables/PrimeReactTable";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import CommonDialog from "@/components/tables/CommonDialog";


type PreRecordType = {
    id: number;
    title: string;

    price: number;
    date?: string;
    createdAt?: string;
    description?: string;
    status?: string
};

export default function Page() {

    const [data, setData] = useState<PreRecordType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<PreRecordType | null>(null);
    const [page, setPage] = useState<number>(1);
    const [rows, setRows] = useState<number>(10);
    const [totalRecords, setTotalRecords] = useState<number>(0);



    const getBlogData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`${endPointApi.getAllBlogs}?page=${page}&rows=${rows}`);
            setData(res.data.data || []);
            setTotalRecords(res.data.total || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, rows]); // ✅ now correct

    useEffect(() => {
        getBlogData();
    }, [getBlogData]);

    const confirmDelete = async () => {
        if (!selectedRow) return;

        try {
            const res = await api.delete(`${endPointApi.deletePreRecorded}/${selectedRow.id}`);

            if (res?.data?.message) {
                // getPreRecordData(); // Refresh the table/list after deletion
            }
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setIsDeleteModalOpen(false);
            setSelectedRow(null);
        }
    };

    return (

        <div className="space-y-6">
            <ComponentCard
                title="AddtoCart List"
            // Plusicon={<PlusIcon />}
            // name="Add MedicalExam"
            // onAddProductClick="/medicalexamlist/add"
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
                            { header: "Title", sortable: true },
                            { header: "Price" },
                            { header: "Description" },
                            { header: "Status" },

                        ]}

                    />
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