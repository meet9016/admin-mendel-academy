"use client";
import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
// import { PlusIcon } from "@/icons";
import { useRouter } from "next/navigation";
import PrimeReactTable from "@/components/tables/PrimeReactTable";


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


    // const confirmDelete = async () => {
    //     if (!selectedRow) return;

    //     try {
    //         const res = await api.delete(`${endPointApi.deletePreRecorded}/${selectedRow.id}`);

    //         if (res?.data?.message) {
    //             // getPreRecordData(); // Refresh the table/list after deletion
    //         }
    //     } catch (error) {
    //         console.error("Delete error:", error);
    //     } finally {
    //         setIsDeleteModalOpen(false);
    //         setSelectedRow(null);
    //     }
    // };

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
                            { field: "title", header: "Title", sortable: true },
                            { field: "price", header: "Price" },
                            { field: "description", header: "Description" },
                            { header: "Status" },

                        ]}
                       
                    />
                </div>
                {/* <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        /> */}
                {/* <CommonDialog
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
                </CommonDialog> */}
            </ComponentCard>
        </div>

    );
}