// "use client";
// import React, { useCallback, useEffect, useState } from "react";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import { PlusIcon } from "@/icons";
// import ComponentCard from "@/components/common/ComponentCard";
// import ReactTable from "@/components/tables/ReactTable";
// import { api } from "@/utils/axiosInstance";
// import endPointApi from "@/utils/endPointApi";
// import { FaEdit } from "react-icons/fa";
// import { MdDeleteForever } from "react-icons/md";
// import { useRouter } from "next/navigation";

// type QuestionType = {
//   id: number;
//   title: string;
//   exam_name: string;
//   price?: string;
//   date?: string;
//   createdAt?: string;
// };

// export default function Page() {
//   const router = useRouter();

//   const [data, setData] = useState<QuestionType[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [page, setPage] = useState(1);
//   const [rows, setRows] = useState(5);
//   const [totalRecords, setTotalRecords] = useState(0);

//     const geQuestionData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await api.get(`${endPointApi.getAllQuestion}?page=${page}&limit=${rows}`);
//       setData(res.data.data || []);
//       setTotalRecords(res.data.total);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, rows]);

//   useEffect(() => {
//     geQuestionData();
//    }, [geQuestionData]);

//   return (
//     <div>
//       <PageBreadcrumb pageTitle="Question" />
//       <div className="space-y-6">
//         <ComponentCard
//           title="Question List"
//           Plusicon={<PlusIcon />}
//           name="Add Question"
//           onAddProductClick="/question/add"
//         >
//           <div className="card">
//             <ReactTable
//               selectable={true}
//               data={data}
//               loading={loading}
//               columns={[
//                 { field: "title", header: "Title" },
//                 {
//                   field: "price",
//                   header: "Price",
//                   body: (row: QuestionType) => row.price || "-",
//                 },
//                 { field: "duration", header: "Duration" },
//                 { field: "description", header: "Description" },
//                 {
//                   field: "createdAt",
//                   header: "Created At",
//                   body: (row: QuestionType) =>
//                     row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
//                 },
//                 {
//                   header: "Action",
//                   sortable: false,
//                   body: (row: QuestionType) => (
//                     <div className="flex gap-5">
//                       <button
//                         onClick={() => router.push(`/question/add?id=${row.id}`)}
//                         className="text-green-500 hover:text-green-700"
//                       >
//                         <FaEdit size={18} />
//                       </button>
//                       <button

//                         className="text-red-500 hover:text-red-700"
//                       >
//                         <MdDeleteForever size={18} />
//                       </button>
//                     </div>
//                   ),
//                 }
//               ]}
//                lazy
//             page={page}
//             rows={rows}
//             totalRecords={totalRecords}
//              onPageChange={(newPage: number, newRows: number) => {
//               setPage(newPage);
//               setRows(newRows);
//             }}
//             />
//           </div>
//         </ComponentCard>
//         {/* <Question /> */}
//       </div>
//     </div>
//   );
// }


































"use client";
import React, { useCallback, useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { PlusIcon } from "@/icons";
import ComponentCard from "@/components/common/ComponentCard";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import { useRouter } from "next/navigation";
import PrimeReactTable from "@/components/tables/PrimeReactTable";
import CommonDialog from "@/components/tables/CommonDialog";

type QuestionType = {
  id: number;
  title: string;
  price?: string;
  features?: string;
  rating?: string;
  tag?: string;
  total_reviews?: string;
  // duration?: string;
  createdAt?: string;
  description?: string;
};

export default function Page() {
  const router = useRouter();

  const [data, setData] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<QuestionType | null>(null);
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const geQuestionData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`${endPointApi.getAllQuestion}?page=${page}&limit=${rows}`);
      setData(res.data.data || []);
      setTotalRecords(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, rows]);

  useEffect(() => {
    geQuestionData();
  }, [geQuestionData]);


  const handleDeleteClick = (row: QuestionType) => {
    setSelectedRow(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRow) return;
    try {
      await api.delete(`${endPointApi.deleteQuestion}/${selectedRow.id}`);
      geQuestionData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedRow(null);
    }
  };
  return (
    <div>
      <PageBreadcrumb pageTitle="Question" />
      <div className="space-y-6">
        <ComponentCard
          title="Question List"
          Plusicon={<PlusIcon />}
          name="Add Question"
          onAddProductClick="/question/add"
        >
          <div className="card">
            {/* <ReactTable
              selectable={true}
              data={data}
              loading={loading}
              columns={[
                { field: "title", header: "Title" },
                {
                  field: "price",
                  header: "Price",
                  body: (row: QuestionType) => row.price || "-",
                },
                { field: "duration", header: "Duration" },
                { field: "description", header: "Description" },
                {
                  field: "createdAt",
                  header: "Created At",
                  body: (row: QuestionType) =>
                    row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
                },
                {
                  header: "Action",
                  sortable: false,
                  body: (row: QuestionType) => (
                    <div className="flex gap-5">
                      <button
                        onClick={() => router.push(`/question/add?id=${row.id}`)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button

                        className="text-red-500 hover:text-red-700"
                      >
                        <MdDeleteForever size={18} />
                      </button>
                    </div>
                  ),
                }
              ]}
              lazy
              page={page}
              rows={rows}
              totalRecords={totalRecords}
              onPageChange={(newPage: number, newRows: number) => {
                setPage(newPage);
                setRows(newRows);
              }}
            /> */}



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
                { field: "tag", header: "Tag", sortable: true },
                { field: "rating", header: "Rating", sortable: true },
                { field: "features", header: "Features" },
                { field: "price", header: "Price", sortable: true },
                // { field: "description", header: "Description", sortable: true },
                {
                  field: "createdAt",
                  header: "Created At",
                  body: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"),
                },
              ]}
              onEdit={(row) => router.push(`/question/add?id=${row.id}`)}
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
                Are you sure you want to delete <b>{selectedRow.title}</b>?
              </span>
            )}
          </div>
        </CommonDialog>
        {/* <Question /> */}
      </div>
    </div>
  );
}
