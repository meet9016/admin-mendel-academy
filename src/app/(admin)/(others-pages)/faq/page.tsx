
// "use client";
// import React, { useCallback, useEffect, useState } from "react";
// import ComponentCard from "@/components/common/ComponentCard";
// import PrimeReactTable from "@/components/tables/PrimeReactTable";
// import CommonDialog from "@/components/tables/CommonDialog";
// import { PlusIcon } from "@/icons";
// import { api } from "@/utils/axiosInstance";
// import endPointApi from "@/utils/endPointApi";
// import { useRouter } from "next/navigation";

// type QuestionType = {
//     id: number;
//     title: string;
//     description?: string;
// };

// export default function Page() {
//     const router = useRouter();

//     const [data, setData] = useState<QuestionType[]>([]);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [selectedRow, setSelectedRow] = useState<QuestionType | null>(null);
//     const [page, setPage] = useState<number>(1);
//     const [rows, setRows] = useState<number>(10);
//     const [totalRecords, setTotalRecords] = useState<number>(0);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

//     const getFaqData = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await api.get(`${endPointApi.getAllFaq}?page=${page}&rows=${rows}`);
//             setData(res.data || []);
//             setTotalRecords(res.data.total || 0);
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     }, [page, rows]);

//     useEffect(() => {
//         getFaqData();
//     }, [getFaqData]);


//     const handleDeleteClick = (row: QuestionType) => {
//         setSelectedRow(row);
//         setIsDeleteModalOpen(true);
//     };

//     const confirmDelete = async () => {
//         if (!selectedRow) return;
//         try {
//             await api.delete(`${endPointApi.deleteFaq}/${selectedRow.id}`);
//             getFaqData();
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setIsDeleteModalOpen(false);
//             setSelectedRow(null);
//         }
//     };
//     return (
//         <div>
//             {/* <PageBreadcrumb pageTitle="Question" /> */}
//             <div className="space-y-6">
//                 <ComponentCard
//                     title="FAQ"
//                     Plusicon={<PlusIcon />}
//                     name="Add FAQ"
//                     onAddProductClick="/faq/add"
//                 >
//                     <div className="card">
//                         <PrimeReactTable
//                             data={data}
//                             loading={loading}
//                             totalRecords={totalRecords}
//                             rows={rows}
//                             onPageChange={(newPage, newRows) => {
//                                 setPage(newPage);   
//                                 setRows(newRows);
//                             }}
//                             columns={[
//                                 { field: "title", header: "Title" },
//                                 {
//                                     field: "description", header: "Description",
//                                     body: (rowData: QuestionType) => (
//                                         <div
//                                             className="prose prose-sm max-w-none"
//                                             dangerouslySetInnerHTML={{ __html: rowData.description || "" }}
//                                         />
//                                     ),
//                                 },
//                             ]}
//                             onEdit={(row) => router.push(`/faq/add?id=${row.id}`)}
//                             onDelete={handleDeleteClick}
//                         />
//                     </div>
//                 </ComponentCard>

//                 <CommonDialog
//                     visible={isDeleteModalOpen}
//                     header="Confirm Delete"
//                     footerType="confirm-delete"
//                     onHide={() => setIsDeleteModalOpen(false)}
//                     onSave={confirmDelete}
//                 >
//                     <div className="confirmation-content flex items-center gap-3">
//                         <i className="pi pi-exclamation-triangle text-3xl text-red-500" />
//                         {selectedRow && (
//                             <span>
//                                 Are you sure you want to delete <b>{selectedRow.title}</b>?
//                             </span>
//                         )}
//                     </div>
//                 </CommonDialog>

//             </div>
//         </div>
//     );
// }












"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import dynamic from "next/dynamic";
const PrimeReactTable = dynamic(() => import("@/components/tables/PrimeReactTable"), { ssr: false });
import CommonDialog from "@/components/tables/CommonDialog";
import { PlusIcon } from "@/icons";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import { useRouter } from "next/navigation";
import TableSkeleton from "@/components/common/TableSkeleton";

type QuestionType = {
    id: number;
    title: string;
    description?: string;
};

export default function Page() {
    const router = useRouter();

    /* -------------------- State ------------------------------------ */
    const [data, setData] = useState<QuestionType[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRow, setSelectedRow] = useState<QuestionType | null>(null);
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    /* -------------------- Fetch Data ------------------------------- */
    const fetchFaq = useCallback(async () => {
        try {
            const res = await api.get(
                `${endPointApi.getAllFaq}?page=${page}&rows=${rows}`
            );

            setData(res.data || []);
            setTotalRecords(res.data.total || 0);
        } finally {
            setLoading(false);
        }
    }, [page, rows]);

    useEffect(() => {
        fetchFaq();
    }, [fetchFaq]);

    /* -------------------- Actions ---------------------------------- */
    const onDelete = (row: QuestionType) => setSelectedRow(row);

    const confirmDelete = useCallback(async () => {
        if (!selectedRow) return;

        await api.delete(`${endPointApi.deleteFaq}/${selectedRow.id}`);

        // refresh table
        fetchFaq();

        setSelectedRow(null);
    }, [selectedRow, fetchFaq]);

    /* -------------------- Columns ---------------------------------- */
    const columns = useMemo(
        () => [
            { field: "title", header: "Title" },

            {
                field: "description",
                header: "Description",
                body: (row: QuestionType) => (
                    <div
                        className="prose prose-sm max-w-none line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: row.description || "" }}
                    />
                ),
            },
        ],
        []
    );

    /* -------------------- Render ---------------------------------- */

    return (
        <div className="space-y-6">
            <ComponentCard
                title="FAQ"
                Plusicon={<PlusIcon />}
                name="Add FAQ"
                onAddProductClick="/faq/add"
            >
                {loading ? (
                    <TableSkeleton
                        count={10}
                        columns={["30rem", "50rem"]}
                    />
                ) : (
                    <PrimeReactTable
                        data={data}
                        loading={loading}
                        totalRecords={totalRecords}
                        rows={rows}
                        columns={columns}
                        onPageChange={(newPage, newRows) => {
                            setPage(newPage);
                            setRows(newRows);
                        }}
                        onEdit={(row) => router.push(`/faq/add?id=${row.id}`)}
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
                            Are you sure you want to delete <b>{selectedRow.title}</b>?
                        </span>
                    )}
                </div>
            </CommonDialog>
        </div>
    );
}
