// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import ComponentCard from "@/components/common/ComponentCard";
// import BasicTableOne from "@/components/tables/BasicTableOne";
// import { PlusIcon } from "@/icons";
// import ReactTable from "@/components/tables/ReactTable";
// import endPointApi from "@/utils/endPointApi";
// import { api } from "@/utils/axiosInstance";
// import Typography from "@mui/material/Typography";
// import type { ColumnDef } from '@tanstack/react-table'
// import { createColumnHelper } from '@tanstack/react-table'
// import Tooltip from "@mui/material/Tooltip";
// import IconButton from "@mui/material/IconButton";

// // export const metadata: Metadata = {
// //   title: "Next.js Calender | TailAdmin - Next.js Dashboard Template",
// //   description:
// //     "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
// //   // other metadata
// // };
// type UsersType = {
//   id: number
//   role: string
//   email: string
//   status: string
//   avatar: string
//   company: string
//   country: string
//   contact: string
//   fullName: string
//   username: string
//   currentPlan: string
//   image: string;
//   full_name: string;
//   phone: string
//   roles: any
// }
// interface UsersTypeWithAction {
//   title?: string
//   exam_name?: string
// }
// export default function page() {

//   const router = useRouter();
//   const [data, setData] = useState<UsersType[]>([])

//   const getBlogData = () => {
//     api.get(`${endPointApi.getAllBlogs}`)
//       .then(response => {
//         console.log("ressss", response.data);
//         setData(response.data)
//       })
//       .catch(error => {
//         console.error('Error fetching theme data:', error)
//       })
//   }

//   useEffect(() => {
//     getBlogData()
//   }, [])
//   // const columnHelper = createColumnHelper<UsersTypeWithAction>()

//   // const columns = useMemo<ColumnDef<UsersTypeWithAction, any>[]>(
//   //   () => [
//   //     columnHelper.accessor('exam_name', {
//   //       header: 'exam name',
//   //       cell: ({ row }) => <Typography>{row.original.exam_name}</Typography>
//   //     }),
//   //     columnHelper.accessor('title', {
//   //       header: 'Title',
//   //       cell: ({ row }) => <Typography>{row.original.title}</Typography>
//   //     }),
//   //     columnHelper.accessor('action', {
//   //       header: 'Action',
//   //       cell: ({ row }) => (
//   //         <div className='flex items-center'>
//   //           <>

//   //             <Tooltip title='Edit'>
//   //               <IconButton
//   //                 size='small'
//   //                 disabled={row.original.campaign_status_name === 'Done'}
//   //               >
//   //                 <i className='ri-pencil-line' style={{ color: 'green' }} />
//   //               </IconButton>
//   //             </Tooltip>
//   //             <Tooltip title='View Log'>
//   //               <IconButton
//   //                 size='small'
//   //               >
//   //                 <i className='ri-eye-line' style={{ color: '' }} />
//   //               </IconButton>
//   //             </Tooltip>
//   //           </>
//   //         </div>
//   //       ),
//   //       enableSorting: false,
//   //       enableColumnFilter: false
//   //     })
//   //   ],
//   //   [data]
//   // )
//   return (
//     <div>
//       <PageBreadcrumb pageTitle="Blogs" />
//       <div className="space-y-6">
//         <ComponentCard
//           title="Basic Table 1"
//           Plusicon={<PlusIcon />}
//           name="Add Blogs"
//           onAddProductClick="/blogs/add">
//           {/* <BasicTableOne /> */}
//           {/* <ReactTable
//             data={data}
//             columns={columns}
//             count={10} */}
//            {/* page={paginationInfo.page} */}
//            {/* rowsPerPage={paginationInfo.perPage} */}
//            {/* onPageChange={(_, newPage) => setPaginationInfo(prev => ({ ...prev, page: newPage }))} */}
//            {/* onRowsPerPageChange={newSize => setPaginationInfo({ page: 0, perPage: newSize })} */}
//           {/* /> */}
//         </ComponentCard>
//       </div>
//     </div>
//   );
// }










"use client";
import { useState, useEffect } from "react";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import ReactTable from "@/components/tables/ReactTable";
import ComponentCard from "@/components/common/ComponentCard";
import { PlusIcon } from "@/icons";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { useRouter } from "next/navigation";

type BlogType = {
  id: number;
  title: string;
  exam_name: string;
  author?: string;
  createdAt?: string;
};

export default function Page() {
    const router = useRouter();
  
  const [data, setData] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<BlogType | null>(null);
  console.log("*******", selectedRow);

  const handleDeleteClick = (row: BlogType) => {
    setSelectedRow(row);
    setIsDeleteModalOpen(true);
  };

  const getBlogData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${endPointApi.getAllBlogs}`);
      setData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedRow) return;

    try {
      const res = await api.delete(`${endPointApi.deleteBlog}/${selectedRow.id}`);

      if (res?.data?.message) {
        getBlogData(); // Refresh the table/list after deletion
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedRow(null);
    }
  };


  useEffect(() => {
    getBlogData();
  }, []);

  return (

    <div className="space-y-6">
      <ComponentCard
        title="Blog List"
        Plusicon={<PlusIcon />}
        name="Add Blog"
        onAddProductClick="/blogs/add"
      >
        <div className="card">
          <ReactTable
            selectable={true}
            data={data}
            loading={loading}
            columns={[
              { field: "exam_name", header: "Exam Name" },
              { field: "title", header: "Title" },
              // {
              //   field: "sort_description",
              //   header: "sort_description",
              //   body: (row) => row?.sort_description ?? "-",
              // },
              // {
              //   field: "date", header: "Date", body: (row) =>
              //     row.date ? new Date(row.date).toLocaleDateString() : "-",
              // },
              { field: "status", header: "Status" },
              {
                field: "createdAt",
                header: "Created At",
                body: (row) =>
                  row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
              },
              {
                header: "Action",
                sortable: false,
                body: (row) => (
                  <div className="flex gap-5">
                    <button className="text-green-500 hover:text-green-700"
                        onClick={() => router.push(`/blogs/add?id=${row.id}`)}
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteClick(row)}
                    >
                      <MdDeleteForever size={18} />
                    </button>
                  </div>
                ),
              }
            ]}
          />
        </div>
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        />
      </ComponentCard>
    </div>

  );
}
































