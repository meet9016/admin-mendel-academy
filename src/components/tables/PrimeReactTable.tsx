// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { api } from "@/utils/axiosInstance";
// import endPointApi from "@/utils/endPointApi";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import { Toast } from "primereact/toast";
// import { Button } from "primereact/button";
// import { Tag } from "primereact/tag";
// import { Dialog } from "primereact/dialog";
// import { useRouter } from "next/navigation";
// import { GoPencil } from "react-icons/go";
// import { RxCross2 } from "react-icons/rx";
// import { RiDeleteBin5Line } from "react-icons/ri";
// import { MdCheck } from "react-icons/md";

// type BlogType = {
//     id: number;
//     title: string;
//     exam_name: string;
//     author?: string;
//     createdAt?: string;
//     status?: string;
// };

// export default function PrimeReactTable() {
//     const [blogs, setBlogs] = useState<BlogType[]>([]);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [totalRecords, setTotalRecords] = useState<number>(0);

//     // For selection
//     const [selectedBlogs, setSelectedBlogs] = useState<BlogType[]>([]);
//     const [deleteSelectedDialogVisible, setDeleteSelectedDialogVisible] = useState<boolean>(false);

//     //  For single delete
//     const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);
//     const [selectedBlog, setSelectedBlog] = useState<BlogType | null>(null);

//     const toast = useRef<Toast>(null);
//     const router = useRouter();

//     // Fetch blogs
//     const getBlogData = async () => {
//         setLoading(true);
//         try {
//             const res = await api.get(`${endPointApi.getAllBlogs}`);
//             setBlogs(res.data.data || []);
//             setTotalRecords(res.data.total || 0);
//         } catch (err) {
//             console.error(err);
//             toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to load blogs" });
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getBlogData();
//     }, []);

//     // Single delete confirm
//     const confirmDelete = (blog: BlogType) => {
//         setSelectedBlog(blog);
//         setDeleteDialogVisible(true);
//     };

//     const hideDeleteDialog = () => {
//         setDeleteDialogVisible(false);
//         setSelectedBlog(null);
//     };

//     const handleDelete = async () => {
//         if (!selectedBlog) return;
//         try {
//             await api.delete(`${endPointApi.deleteBlog}/${selectedBlog.id}`);
//             toast.current?.show({ severity: "success", summary: "Deleted", detail: "Blog deleted successfully" });
//             getBlogData();
//         } catch (error) {
//             console.error(error);
//             toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to delete blog" });
//         } finally {
//             hideDeleteDialog();
//         }
//     };



//     const hideDeleteSelectedDialog = () => {
//         setDeleteSelectedDialogVisible(false);
//     };

//     const handleDeleteSelected = async () => {
//         try {
//             const ids = selectedBlogs.map((b) => b.id);
//             await Promise.all(ids.map((id) => api.delete(`${endPointApi.deleteBlog}/${id}`)));
//             toast.current?.show({
//                 severity: "success",
//                 summary: "Deleted",
//                 detail: "Selected blogs deleted successfully",
//             });
//             getBlogData();
//         } catch (error) {
//             console.error(error);
//             toast.current?.show({ severity: "error", summary: "Error", detail: "Failed to delete selected blogs" });
//         } finally {
//             setSelectedBlogs([]);
//             hideDeleteSelectedDialog();
//         }
//     };

//     // Status Tag
//     const statusBodyTemplate = (rowData: BlogType) => {
//         const status = rowData.status || "Inactive";
//         const severity =
//             status === "Active" ? "success" : status === "Pending" ? "warning" : "danger";
//         return <Tag value={status} severity={severity} />;
//     };

//     // Action Buttons
//     const actionBodyTemplate = (rowData: BlogType) => {
//         return (
//             <div className="flex gap-3">
//                 <Button
//                     icon={<GoPencil size={16} />}
//                     rounded
//                     outlined
//                     severity="success"
//                     onClick={() => router.push(`/blogs/add?id=${rowData.id}`)}
//                     className="p-0 flex items-center justify-center"
//                     style={{
//                         height: "2rem",
//                         width: "2rem",
//                         borderRadius: "50%",
//                     }}
//                 />
//                 <Button
//                     icon={<RiDeleteBin5Line size={16} />}
//                     rounded
//                     outlined
//                     severity="danger"
//                     onClick={() => confirmDelete(rowData)}
//                     className="p-0 flex items-center justify-center"
//                     style={{
//                         height: "2rem",
//                         width: "2rem",
//                         borderRadius: "50%",
//                     }}
//                 />
//             </div>
//         );
//     };

//     // Dialog Footers
//     const deleteDialogFooter = (
//         <>
//             <Button
//                 label="No"
//                 icon={<RxCross2 size={18} />}
//                 outlined
//                 onClick={hideDeleteDialog}
//                 className="flex items-center gap-2"
//             />
//             <Button
//                 label="Yes"
//                 icon={<MdCheck size={18} />}
//                 severity="danger"
//                 onClick={handleDelete}
//                 className="flex items-center gap-2"
//             />
//         </>
//     );

//     const deleteSelectedDialogFooter = (
//         <>
//             <Button
//                 label="No"
//                 icon={<RxCross2 size={18} />}
//                 outlined
//                 onClick={hideDeleteSelectedDialog}
//                 className="flex items-center gap-2"
//             />
//             <Button
//                 label="Yes"
//                 icon={<MdCheck size={18} />}
//                 severity="danger"
//                 onClick={handleDeleteSelected}
//                 className="flex items-center gap-2"
//             />
//         </>
//     );

//     return (
//         <div className="card">
//             <Toast ref={toast} />



//             <DataTable
//                 value={blogs}
//                 loading={loading}
//                 paginator
//                 totalRecords={totalRecords}
//                 rows={10}
//                 rowsPerPageOptions={[10, 15, 20]}
//                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords} blogs"
//                 selection={selectedBlogs}
//                 onSelectionChange={(e) => setSelectedBlogs(e.value)}
//                 dataKey="id"
//             >
//                 {/* ✅ Checkbox Selection Column */}
//                 <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} exportable={false}></Column>

//                 <Column field="exam_name" header="Exam Name" sortable></Column>
//                 <Column field="title" header="Title" sortable></Column>
//                 <Column field="status" header="Status" body={statusBodyTemplate}></Column>
//                 <Column field="createdAt" header="Created At"></Column>
//                 <Column body={actionBodyTemplate} header="Action"></Column>
//             </DataTable>

//             {/* Delete single blog dialog */}
//             <Dialog
//                 visible={deleteDialogVisible}
//                 style={{ width: "32rem" }}
//                 header="Confirm Delete"
//                 modal
//                 footer={deleteDialogFooter}
//                 onHide={hideDeleteDialog}
//             >
//                 <div className="confirmation-content flex items-center gap-3">
//                     <i className="pi pi-exclamation-triangle" style={{ fontSize: "2rem" }} />
//                     {selectedBlog && (
//                         <span>
//                             Are you sure you want to delete <b>{selectedBlog.title}</b>?
//                         </span>
//                     )}
//                 </div>
//             </Dialog>

//             {/*  Delete Selected Dialog */}
//             <Dialog
//                 visible={deleteSelectedDialogVisible}
//                 style={{ width: "32rem" }}
//                 header="Confirm Bulk Delete"
//                 modal
//                 footer={deleteSelectedDialogFooter}
//                 onHide={hideDeleteSelectedDialog}
//             >
//                 <div className="confirmation-content flex items-center gap-3">
//                     <i className="pi pi-exclamation-triangle" style={{ fontSize: "2rem" }} />
//                     <span>Are you sure you want to delete the selected blogs?</span>
//                 </div>
//             </Dialog>
//         </div>
//     );
// }



















"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useState } from "react";

type ColumnType<T> = {
    field?: keyof T;
    header: string;
    body?: (rowData: T) => React.ReactNode;
    sortable?: boolean;
};

interface PrimeReactTableProps<T> {
    data: T[];
    loading: boolean;
    columns: ColumnType<T>[];
    totalRecords?: number;
    rows?: number;
    onPageChange?: (page: number, rows: number) => void;
    selection?: T[];
    onSelectionChange?: (selected: T[]) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    showSelection?: boolean;
}

export default function PrimeReactTable<T extends { id: number; status?: string }>({
    data,
    loading,
    columns,
    totalRecords = 0,
    rows = 10,
    onEdit,
    onDelete,
}: PrimeReactTableProps<T>) {
    const [selectedRows, setSelectedRows] = useState<T[]>([]);
    // Action Buttons
    const actionBodyTemplate = (rowData: T) => (
        <div className="flex gap-3">
            <Button
                icon={<GoPencil size={16} />}
                rounded
                outlined
                severity="success"
                onClick={() => onEdit?.(rowData)}
                className="p-0 flex items-center justify-center"
                style={{ height: "2rem", width: "2rem", borderRadius: "50%" }}
            />
            <Button
                icon={<RiDeleteBin5Line size={16} />}
                rounded
                outlined
                severity="danger"
                onClick={() => onDelete?.(rowData)}
                className="p-0 flex items-center justify-center"
                style={{ height: "2rem", width: "2rem", borderRadius: "50%" }}
            />
        </div>
    );

    return (
        <div className="card">
            <DataTable
                value={data}
                loading={loading}
                paginator
                totalRecords={totalRecords}
                rows={rows}
                rowsPerPageOptions={[10, 15, 20]}
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                dataKey="id"
                lazy
                selection={selectedRows}
                onSelectionChange={(e: any) => setSelectedRows(e.value)}
            >
                {/* Checkbox Selection Column */}
                <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} exportable={false} />

                {/*  Dynamic Columns */}
                {columns.map((col, idx) => (
                    <Column
                        key={idx}
                        field={col.field as string}
                        header={col.header}
                        sortable={col.sortable}
                        body={col.body}
                    />
                ))}

                {/* Action Column */}
                <Column header="Action" body={actionBodyTemplate}></Column>
            </DataTable>
        </div>
    );
}
