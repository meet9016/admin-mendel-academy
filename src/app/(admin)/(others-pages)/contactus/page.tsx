
"use client";
import React, { useCallback, useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PrimeReactTable from "@/components/tables/PrimeReactTable";
import CommonDialog from "@/components/tables/CommonDialog";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import { useRouter } from "next/navigation";

type ContactType = {
    id: number;
    first_name: string;
    last_name?: string;
    email?: string;
    medical_school?:string;
    graduation_year?: number; 
};

export default function page() {
    const router = useRouter();

    const [data, setData] = useState<ContactType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<ContactType | null>(null);
    const [page, setPage] = useState<number>(1);
    const [rows, setRows] = useState<number>(10);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const getContactData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`${endPointApi.getAllContact}?page=${page}&rows=${rows}`);
            setData(res.data.data || []);
            setTotalRecords(res.data.total || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, rows]);

    useEffect(() => {
        getContactData();
    }, [getContactData]);


    const handleDeleteClick = (row: ContactType) => {
        setSelectedRow(row);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedRow) return;
        try {
            await api.delete(`${endPointApi.deleteContact}/${selectedRow.id}`);
            getContactData();
        } catch (err) {
            console.error(err);
        } finally {
            setIsDeleteModalOpen(false);
            setSelectedRow(null);
        }
    };
    return (
        <div>
            {/* <PageBreadcrumb pageTitle="Question" /> */}
            <div className="space-y-6">
                <ComponentCard
                    title="Contact Us"
                    // Plusicon={<PlusIcon />}
                    // name="Add FAQ"
                    // onAddProductClick="/faq/add"
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
                                { field: "first_name", header: "First Name" },
                                { field: "last_name", header: "Last Name" },
                                { field: "email", header: "Email" },
                                { field: "medical_school", header: "Medical School" },
                                { field: "graduation_year", header: "Graduation Year" },
                            ]}
                            // onEdit={(row) => router.push(`/faq/add?id=${row.id}`)}
                            // onEdit={(row) => console.log('oooo')}
                            onDelete={handleDeleteClick}
                        />
                    </div>
                </ComponentCard>

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
                                Are you sure you want to delete <b>{selectedRow.first_name}</b>?
                            </span>
                        )}
                    </div>
                </CommonDialog>
                {/* <Question /> */}
            </div>
        </div>
    );
}
