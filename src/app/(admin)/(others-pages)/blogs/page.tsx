"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { PlusIcon } from "@/icons";
import ReactTable from "@/components/tables/ReactTable";
import endPointApi from "@/utils/endPointApi";
import { api } from "@/utils/axiosInstance";
import Typography from "@mui/material/Typography";
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

// export const metadata: Metadata = {
//   title: "Next.js Calender | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
//   // other metadata
// };
type UsersType = {
  id: number
  role: string
  email: string
  status: string
  avatar: string
  company: string
  country: string
  contact: string
  fullName: string
  username: string
  currentPlan: string
  image: string;
  full_name: string;
  phone: string
  roles: any
}
interface UsersTypeWithAction {
  title?: string
  exam_name?: string
}
export default function page() {

  const router = useRouter();
  const [data, setData] = useState<UsersType[]>([])

  const getBlogData = () => {
    api.get(`${endPointApi.getAllBlogs}`)
      .then(response => {
        console.log("ressss", response.data);
        setData(response.data)
      })
      .catch(error => {
        console.error('Error fetching theme data:', error)
      })
  }

  useEffect(() => {
    getBlogData()
  }, [])
  // const columnHelper = createColumnHelper<UsersTypeWithAction>()

  // const columns = useMemo<ColumnDef<UsersTypeWithAction, any>[]>(
  //   () => [
  //     columnHelper.accessor('exam_name', {
  //       header: 'exam name',
  //       cell: ({ row }) => <Typography>{row.original.exam_name}</Typography>
  //     }),
  //     columnHelper.accessor('title', {
  //       header: 'Title',
  //       cell: ({ row }) => <Typography>{row.original.title}</Typography>
  //     }),
  //     columnHelper.accessor('action', {
  //       header: 'Action',
  //       cell: ({ row }) => (
  //         <div className='flex items-center'>
  //           <>
              
  //             <Tooltip title='Edit'>
  //               <IconButton
  //                 size='small'
  //                 disabled={row.original.campaign_status_name === 'Done'}
  //               >
  //                 <i className='ri-pencil-line' style={{ color: 'green' }} />
  //               </IconButton>
  //             </Tooltip>
  //             <Tooltip title='View Log'>
  //               <IconButton
  //                 size='small'
  //               >
  //                 <i className='ri-eye-line' style={{ color: '' }} />
  //               </IconButton>
  //             </Tooltip>
  //           </>
  //         </div>
  //       ),
  //       enableSorting: false,
  //       enableColumnFilter: false
  //     })
  //   ],
  //   [data]
  // )
  return (
    <div>
      <PageBreadcrumb pageTitle="Blogs" />
      <div className="space-y-6">
        <ComponentCard
          title="Basic Table 1"
          Plusicon={<PlusIcon />}
          name="Add Blogs"
          onAddProductClick="/blogs/add">
          {/* <BasicTableOne /> */}
          {/* <ReactTable
            data={data}
            columns={columns}
            count={10} */}
           {/* page={paginationInfo.page} */}
           {/* rowsPerPage={paginationInfo.perPage} */}
           {/* onPageChange={(_, newPage) => setPaginationInfo(prev => ({ ...prev, page: newPage }))} */}
           {/* onRowsPerPageChange={newSize => setPaginationInfo({ page: 0, perPage: newSize })} */}
          {/* /> */}
        </ComponentCard>
      </div>
    </div>
  );
}
