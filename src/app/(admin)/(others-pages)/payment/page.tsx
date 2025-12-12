// 'use client'
// import React, { useCallback, useEffect, useState } from 'react'
// import ComponentCard from '@/components/common/ComponentCard'
// import PrimeReactTable from '@/components/tables/PrimeReactTable'
// import { IoCloseSharp } from "react-icons/io5";
// import endPointApi from '@/utils/endPointApi';
// import { api } from '@/utils/axiosInstance';
// import { useRouter } from 'next/navigation';
// import CommonDialog from '@/components/tables/CommonDialog';

// interface PrimeReactTableProps<T> {
//     data: T[];
//     columns: { field: keyof T; header: string }[];
//     onView?: (row: T) => void;
//     onDelete?: (row: T) => void;
// }

// type PaymentType = {
//     id: number
//     transaction_id: string
//     full_name: string
//     payment_method: string
//     amount: string
//     createdAt: string
//     email?: string
//     gateway?: string
//     status: string
//     payment_status: string
// }

// export default function page() {
//     const router = useRouter();
//     const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
//     const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(null)
//     const [loading, setLoading] = useState<boolean>(false);
//     const [paymentData, setPaymentData] = useState<PaymentType[]>([]);
//     const [page, setPage] = useState<number>(1);
//     const [rows, setRows] = useState<number>(10);
//     const [totalRecords, setTotalRecords] = useState<number>(0);
//     const [selectedRow, setSelectedRow] = useState<PaymentType | null>(null);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

//     const handleView = (rowData: PaymentType) => {
//         setIsModalOpen(true);
//         setSelectedPayment(rowData);
//     };

//     const getPaymentData = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await api.get(`${endPointApi.getAllPayment}?page=${page}&rows=${rows}`);
//             setPaymentData(res.data.data || []);
//             setTotalRecords(res.data.total || 0);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     }, [page, rows]);

//     useEffect(() => {
//         getPaymentData();
//     }, [getPaymentData]);

//     const handleDeleteClick = (row: PaymentType) => {
//         setSelectedRow(row);
//         setIsDeleteModalOpen(true);
//     };
//     const confirmDelete = async () => {
//         if (!selectedRow) return;
//         try {
//             await api.delete(`${endPointApi.deleteExamList}/${selectedRow.id}`);
//             getPaymentData();
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setIsDeleteModalOpen(false);
//             setSelectedRow(null);
//         }
//     };


//     return (
//         <div className="space-y-6">
//             <ComponentCard
//                 title='Payment List'
//             >
//                 <PrimeReactTable
//                     data={paymentData}
//                     columns={[
//                         { field: 'transaction_id', header: 'Transaction ID' },
//                         { field: 'full_name', header: 'User' },
//                         { field: 'email', header: 'Email' },
//                         { field: 'createdAt', header: 'Date & Time' },
//                         { field: 'payment_method', header: 'Method' },
//                         { field: 'amount', header: 'Amount' },
//                         { field: 'payment_status', header: 'Status' }
//                     ]}
//                     onDelete={handleDeleteClick}
//                     onView={handleView}
//                 />
//             </ComponentCard>

//             <CommonDialog
//                 visible={isDeleteModalOpen}
//                 header="Confirm Delete"
//                 footerType="confirm-delete"
//                 onHide={() => setIsDeleteModalOpen(false)}
//                 onSave={confirmDelete}
//             >
//                 <div className="confirmation-content flex items-center gap-3">
//                     <i className="pi pi-exclamation-triangle text-3xl text-red-500" />
//                     {selectedRow && (
//                         <span>
//                             Are you sure you want to delete <b>{selectedRow.transaction_id}</b>?
//                         </span>
//                     )}
//                 </div>
//             </CommonDialog>

//             {isModalOpen && selectedPayment && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
//                     <div className="bg-white text-gray-800 p-8 rounded-2xl w-full max-w-3xl shadow-2xl relative">
//                         {/* Close Button */}
//                         <button
//                             className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
//                             onClick={() => setIsModalOpen(false)}
//                         >
//                             <IoCloseSharp />
//                         </button>

//                         {/* Header */}
//                         <h2 className="text-2xl font-semibold mb-1 text-gray-900">Payment Details</h2>
//                         <p className="text-sm text-gray-500 mb-8">Transaction information and user details</p>

//                         {/* Details Section */}
//                         <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm">
//                             <p><span className="font-semibold text-gray-700">Transaction ID:</span> {selectedPayment.transaction_id}</p>
//                             <p className="flex items-center gap-2">
//                                 <span className="font-semibold text-gray-700">Status:</span>
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedPayment.status === 'Success'
//                                     ? 'bg-green-100 text-green-700'
//                                     : 'bg-yellow-100 text-yellow-700'
//                                     }`}>
//                                     {selectedPayment.status}
//                                 </span>
//                             </p>

//                             <p><span className="font-semibold text-gray-700">User Name:</span> {selectedPayment.full_name}</p>
//                             <p><span className="font-semibold text-gray-700">Email:</span> {selectedPayment.email}</p>
//                             <p><span className="font-semibold text-gray-700">Amount:</span> {selectedPayment.amount}</p>
//                             <p><span className="font-semibold text-gray-700">Payment Method:</span> {selectedPayment.payment_method}</p>
//                             <p><span className="font-semibold text-gray-700">Date & Time:</span> {selectedPayment.createdAt}</p>
//                             <p><span className="font-semibold text-gray-700">Payment Gateway:</span> {selectedPayment.gateway}</p>
//                             <p className="col-span-2"><span className="font-semibold text-gray-700">Course/Combo:</span> {''}</p>
//                         </div>

//                         {/* Divider */}
//                         <div className="my-8 border-t border-gray-200" />

//                         {/* Download Button */}
//                         <button
//                             className="w-full bg-[#ffcb07] hover:bg-[#e6b905] text-black font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all duration-200"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
//                             </svg>
//                             Download Invoice
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }








































"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import PrimeReactTable from "@/components/tables/PrimeReactTable";
import endPointApi from "@/utils/endPointApi";
import { api } from "@/utils/axiosInstance";
import CommonDialog from "@/components/tables/CommonDialog";
import TableSkeleton from "@/components/common/TableSkeleton";
import { IoCloseSharp } from "react-icons/io5";

type PaymentType = {
    id: number;
    transaction_id: string;
    full_name: string;
    payment_method: string;
    amount: string;
    createdAt: string;
    email?: string;
    gateway?: string;
    status: string;
    payment_status: string;
};

export default function Page() {
    const router = useRouter();

    /* -------------------- State ------------------------------------ */
    const [paymentData, setPaymentData] = useState<PaymentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [rows] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectedRow, setSelectedRow] = useState<PaymentType | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(
        null
    );

    /* -------------------- Fetch Data ------------------------------- */

    const fetchPayments = useCallback(async () => {
        try {
            const res = await api.get(`${endPointApi.getAllPayment}`);
            setPaymentData(res.data.data || []);
            setTotalRecords(res.data.total || 0);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    /* -------------------- Actions ---------------------------------- */

    const onView = (row: PaymentType) => {
        setSelectedPayment(row);
        setIsModalOpen(true);
    };

    const onDelete = (row: PaymentType) => setSelectedRow(row);

    const confirmDelete = useCallback(async () => {
        if (!selectedRow) return;

        await api.delete(`${endPointApi.deleteExamList}/${selectedRow.id}`);

        setPaymentData((prev) => prev.filter((p) => p.id !== selectedRow.id));
        setTotalRecords((t) => t - 1);

        setSelectedRow(null);
    }, [selectedRow]);

    /* -------------------- Columns ---------------------------------- */

    const columns = useMemo(
        () => [
            { field: "transaction_id", header: "Transaction ID" },
            { field: "full_name", header: "User" },
            { field: "email", header: "Email" },
            { field: "createdAt", header: "Date & Time" },
            { field: "payment_method", header: "Method" },
            { field: "amount", header: "Amount" },
            { field: "payment_status", header: "Status" },
        ],
        []
    );

    /* -------------------- Render ---------------------------------- */

    return (
        <div className="space-y-6">
            <ComponentCard title="Payment List">
                {loading ? (
                    <TableSkeleton
                        count={10}
                        columns={["16rem", "10rem", "14rem", "12rem", "8rem", "8rem", "8rem"]}
                    />
                ) : (
                    <PrimeReactTable
                        data={paymentData}
                        loading={loading}
                        totalRecords={totalRecords}
                        rows={rows}
                        columns={columns}
                        onView={onView}
                        onDelete={onDelete}
                    />
                )}
            </ComponentCard>

            {/* Delete Dialog */}
            <CommonDialog
                visible={!!selectedRow}
                header="Confirm Delete"
                footerType="confirm-delete"
                onHide={() => setSelectedRow(null)}
                onSave={confirmDelete}
            >
                <div className="confirmation-content flex items-center gap-3">
                    <i className="pi pi-exclamation-triangle text-3xl text-red-500" />
                    {selectedRow && (
                        <span>
                            Are you sure you want to delete{" "}
                            <b>{selectedRow.transaction_id}</b>?
                        </span>
                    )}
                </div>
            </CommonDialog>

            {/* View Payment Modal */}
            {isModalOpen && selectedPayment && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-3xl shadow-2xl relative">
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <IoCloseSharp />
                        </button>

                        <h2 className="text-2xl font-semibold mb-1 text-gray-900">
                            Payment Details
                        </h2>
                        <p className="text-sm text-gray-500 mb-8">
                            Transaction information and user details
                        </p>

                        <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm">
                            <p>
                                <b>Transaction ID:</b> {selectedPayment.transaction_id}
                            </p>
                            <p className="flex items-center gap-2">
                                <b>Status:</b>{" "}
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${selectedPayment.status === "Success"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {selectedPayment.status}
                                </span>
                            </p>

                            <p>
                                <b>User Name:</b> {selectedPayment.full_name}
                            </p>
                            <p>
                                <b>Email:</b> {selectedPayment.email}
                            </p>
                            <p>
                                <b>Amount:</b> {selectedPayment.amount}
                            </p>
                            <p>
                                <b>Payment Method:</b> {selectedPayment.payment_method}
                            </p>

                            <p>
                                <b>Date & Time:</b> {selectedPayment.createdAt}
                            </p>
                            <p>
                                <b>Payment Gateway:</b> {selectedPayment.gateway}
                            </p>

                            <p className="col-span-2">
                                <b>Course/Combo:</b> {""}
                            </p>
                        </div>

                        <div className="my-8 border-t border-gray-200" />

                        <button className="w-full bg-[#ffcb07] hover:bg-[#e6b905] text-black font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all duration-200">
                            Download Invoice
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
