'use client'
import React, { useState } from 'react'
import ComponentCard from '@/components/common/ComponentCard'
import PrimeReactTable from '@/components/tables/PrimeReactTable'
import { IoCloseSharp } from "react-icons/io5";
type PaymentType = {
    transactionId: string
    user: string
    dateTime: string
    method: string
    amount: string
    course: string
    status: string
    email?: string
    gateway?: string
}
const page = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(null)
    const [paymentData] = useState<PaymentType[]>([
        {
            transactionId: 'TXN123456',
            user: 'John Doe',
            dateTime: '2025-11-10 14:30',
            method: 'Stripe',
            amount: '$120',
            course: 'React Mastery',
            status: 'Success',
        },
        {
            transactionId: 'TXN789012',
            user: 'Jane Smith',
            dateTime: '2025-11-09 10:15',
            method: 'Razorpay',
            amount: '$80',
            course: 'Next.js Bootcamp',
            status: 'Pending',
        },
    ]);

    const handleView = (rowData: PaymentType) => {
        setIsModalOpen(true);
        setSelectedPayment(rowData);
    };

    return (
        <div className="space-y-6">
            <ComponentCard
                title='Payment List'
            >
                <PrimeReactTable
                    data={paymentData}
                    columns={[
                        { header: 'Transaction ID', field: 'transactionId', },
                        { header: 'User', field: 'user', },
                        { header: 'Date & Time', field: 'dateTime' },
                        { header: 'Method', field: 'method' },
                        { header: 'Amount', field: 'amount' },
                        { header: 'Course', field: 'course' },
                        { header: 'Status', field: 'status' },
                    ]}
                    onEdit={() => console.log("EDIT")}
                    onDelete={() => console.log("DELETE")}
                    onView={handleView}
                />
            </ComponentCard>

            {isModalOpen && selectedPayment && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white text-gray-800 p-8 rounded-2xl w-full max-w-3xl shadow-2xl relative">
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <IoCloseSharp />
                        </button>

                        {/* Header */}
                        <h2 className="text-2xl font-semibold mb-1 text-gray-900">Payment Details</h2>
                        <p className="text-sm text-gray-500 mb-8">Transaction information and user details</p>

                        {/* Details Section */}
                        <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm">
                            <p><span className="font-semibold text-gray-700">Transaction ID:</span> {selectedPayment.transactionId}</p>
                            <p className="flex items-center gap-2">
                                <span className="font-semibold text-gray-700">Status:</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedPayment.status === 'Success'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {selectedPayment.status}
                                </span>
                            </p>

                            <p><span className="font-semibold text-gray-700">User Name:</span> {selectedPayment.user}</p>
                            <p><span className="font-semibold text-gray-700">Email:</span> {selectedPayment.email}</p>
                            <p><span className="font-semibold text-gray-700">Amount:</span> {selectedPayment.amount}</p>
                            <p><span className="font-semibold text-gray-700">Payment Method:</span> {selectedPayment.method}</p>
                            <p><span className="font-semibold text-gray-700">Date & Time:</span> {selectedPayment.dateTime}</p>
                            <p><span className="font-semibold text-gray-700">Payment Gateway:</span> {selectedPayment.gateway}</p>
                            <p className="col-span-2"><span className="font-semibold text-gray-700">Course/Combo:</span> {selectedPayment.course}</p>
                        </div>

                        {/* Divider */}
                        <div className="my-8 border-t border-gray-200" />

                        {/* Download Button */}
                        <button
                            className="w-full bg-[#ffcb07] hover:bg-[#e6b905] text-black font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                            </svg>
                            Download Invoice
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default page