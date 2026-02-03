"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import dynamic from "next/dynamic";
const PrimeReactTable = dynamic(() => import("@/components/tables/PrimeReactTable"), { ssr: false });
import endPointApi from "@/utils/endPointApi";
import { api } from "@/utils/axiosInstance";
import CommonDialog from "@/components/tables/CommonDialog";
import TableSkeleton from "@/components/common/TableSkeleton";
import { IoCloseSharp } from "react-icons/io5";
import { Tag } from "primereact/tag";
import { getStatusSeverity } from "@/utils/helper";

export type PaymentType = {
    _id: string;
    id: number;
    transaction_id: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    paymentIntentId?: string;
    full_name: string;
    email: string;
    phone?: string;
    payment_method: string;
    amount: number;
    currency: string;
    payment_status: string;
    createdAt: string;
    updatedAt: string;
    user_id?: {
        _id: string;
        full_name: string;
        email: string;
        phone: string;
    };
    guest_id?: string;
    plan_id?: string;
};

export default function Page() {
    const router = useRouter();

    const [paymentData, setPaymentData] = useState<PaymentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [rows] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectedRow, setSelectedRow] = useState<PaymentType | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(null);
    const [dates, setDates] = useState<[Date | null, Date | null] | null>(null);

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

    const statusBodyTemplate = (row: PaymentType) => {
        return (
            <Tag
                value={row.payment_status}
                severity={getStatusSeverity(row)}
                className="capitalize"
            />
        );
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number, currency: string) => {
        const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency;
        return `${symbol}${amount?.toLocaleString() || 0}`;
    };

    const columns = useMemo(
        () => [
            { field: "transaction_id", header: "Transaction ID" },
            {
                field: "full_name",
                header: "User",
                body: (row: PaymentType) => row.full_name || row.user_id?.full_name || "Guest User"
            },
            {
                field: "email",
                header: "Email",
                body: (row: PaymentType) => row.email || row.user_id?.email || "-"
            },
            {
                field: "createdAt",
                header: "Date",
                body: (row: PaymentType) => row.createdAt
                    ? new Date(row.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })
                    : "-",
            },
            { field: "payment_method", header: "Method" },
            {
                field: "amount",
                header: "Amount",
                body: (row: PaymentType) => formatCurrency(row.amount, row.currency)
            },
            { field: "payment_status", header: "Status", body: statusBodyTemplate },
        ],
        []
    );

    const downloadExcel = async () => {
        try {
            if (!dates || !dates[0] || !dates[1]) {
                alert("Please select start and end date");
                return;
            }

            const startDate = dates[0].toISOString().split("T")[0];
            const endDate = dates[1].toISOString().split("T")[0];

            const response = await api.get(
                `${endPointApi.getPaymentDownloadExcel}?start_date=${startDate}&end_date=${endDate}&payment_status=`,
                {
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `payments_${startDate}_to_${endDate}.xlsx`;
            link.click();

        } catch (error) {
            console.error("Excel download failed", error);
        }
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Payment List" downloadExcel={downloadExcel} dates={dates} setDates={setDates}>
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

            {/* Simplified Payment Details Modal */}
            {isModalOpen && selectedPayment && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative">
                        {/* Header */}
                        <div className="bg-[#ffcb07] px-8 py-6 rounded-t-2xl relative">
                            <button
                                className="absolute top-6 right-6 text-gray-700 hover:text-black text-2xl transition-colors"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <IoCloseSharp />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Payment Details
                            </h2>
                            <p className="text-gray-700 text-sm mt-1">
                                Transaction #{selectedPayment.transaction_id?.slice(-8)}
                            </p>
                        </div>

                        {/* Content */}
                        <div className="px-8 py-6">
                            {/* Status & Amount - Hero Section */}
                            <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-semibold ${selectedPayment.payment_status === "paid"
                                                ? "bg-green-100 text-green-700"
                                                : selectedPayment.payment_status === "failed"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-[#fff8e1] text-[#f57c00]"
                                            }`}
                                    >
                                        {selectedPayment.payment_status.toUpperCase()}
                                    </span>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Payment Method</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {selectedPayment.payment_method}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-center py-4">
                                    <p className="text-sm text-gray-600 mb-2">Amount Paid</p>
                                    <p className="text-4xl font-bold text-gray-900">
                                        {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {selectedPayment.currency}
                                    </p>
                                </div>
                            </div>

                            {/* User Information */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                    Customer Details
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <div className="w-28 text-sm text-gray-600">Name:</div>
                                        <div className="flex-1 text-sm font-medium text-gray-900">
                                            {selectedPayment.full_name || selectedPayment.user_id?.full_name || "Guest User"}
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-28 text-sm text-gray-600">Email:</div>
                                        <div className="flex-1 text-sm font-medium text-gray-900">
                                            {selectedPayment.email || selectedPayment.user_id?.email || "-"}
                                        </div>
                                    </div>
                                    {(selectedPayment.phone || selectedPayment.user_id?.phone) && (
                                        <div className="flex items-start">
                                            <div className="w-28 text-sm text-gray-600">Phone:</div>
                                            <div className="flex-1 text-sm font-medium text-gray-900">
                                                {selectedPayment.phone || selectedPayment.user_id?.phone}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Transaction Details */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                    Transaction Details
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <div className="w-28 text-sm text-gray-600">Transaction ID:</div>
                                        <div className="flex-1 text-sm font-mono text-gray-900 break-all">
                                            {selectedPayment.transaction_id}
                                        </div>
                                    </div>

                                    {selectedPayment.payment_method === "Razorpay" && selectedPayment.razorpay_payment_id && (
                                        <div className="flex items-start">
                                            <div className="w-28 text-sm text-gray-600">Payment ID:</div>
                                            <div className="flex-1 text-sm font-mono text-gray-900 break-all">
                                                {selectedPayment.razorpay_payment_id}
                                            </div>
                                        </div>
                                    )}

                                    {selectedPayment.payment_method === "Stripe" && selectedPayment.paymentIntentId && (
                                        <div className="flex items-start">
                                            <div className="w-28 text-sm text-gray-600">Intent ID:</div>
                                            <div className="flex-1 text-sm font-mono text-gray-900 break-all">
                                                {selectedPayment.paymentIntentId}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start">
                                        <div className="w-28 text-sm text-gray-600">Date & Time:</div>
                                        <div className="flex-1 text-sm font-medium text-gray-900">
                                            {formatDate(selectedPayment.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-8 py-4 rounded-b-2xl border-t border-gray-200">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full bg-[#ffcb07] hover:bg-[#e6b905] text-black font-semibold py-3 rounded-lg transition-all duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}