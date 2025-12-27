"use client";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import ComponentCard from "@/components/common/ComponentCard";
import { useRouter } from "next/navigation";
import PrimeReactTable from "@/components/tables/PrimeReactTable";
import { Tag } from "primereact/tag";
import CommonDialog from "@/components/tables/CommonDialog";
import { PlusIcon } from "@/icons";
import { Skeleton } from "primereact/skeleton";

type PreRecordType = {
  _id: string;
  title: string;
  vimeo_video_id: string;
  total_reviews: number;
  rating: number;
  price: number;
  date?: string;
  createdAt?: string;
  duration?: string;
  status?: string
};

export default function Page() {
  const router = useRouter();

  const [data, setData] = useState<PreRecordType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PreRecordType | null>(null);
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const handleDeleteClick = (row: PreRecordType) => {
    setSelectedRow(row);
    setIsDeleteModalOpen(true);
  };

  const getPreRecordData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`${endPointApi.getAllPreRecorded}?page=${page}&limit=${rows}`);
      setData(res.data.data || []);
      setTotalRecords(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, rows]);

  const confirmDelete = async () => {
    if (!selectedRow) return;

    try {
      const res = await api.delete(`${endPointApi.deletePreRecorded}/${selectedRow._id}`);
      if (res?.data?.message) {
        getPreRecordData(); // Refresh the table/list after deletion
      }

    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedRow(null);
    }
  };

  useEffect(() => {
    getPreRecordData();
  }, [getPreRecordData]);
  return (

    <div className="space-y-6">
      <ComponentCard
        title="Prerecord List"
        Plusicon={<PlusIcon />}
        name="Add Prerecord"
        onAddProductClick="/prerecord/add"
      >
        <div className="card">
          {
          loading ? (
            renderSkeletonRows()
          ) : (
          <PrimeReactTable
            data={data}
            loading={loading}
            totalRecords={totalRecords}
            rows={rows}
            onPageChange={(newPage: any, newRows: any) => {
              setPage(newPage);
              setRows(newRows);
            }}
            columns={[
              { field: "title", header: "Title" },
              { field: "total_reviews", header: "Total reviews" },
              { field: "rating", header: "Rating" },
              { field: "vimeo_video_id", header: "Vimeo video id" },
              { field: "price", header: "Price" },
              { field: "duration", header: "Duration" },
              {
                field: "status",
                header: "Status",
                body: (row) => {
                  const status = row.status || "Inactive";
                  const severity =
                    status === "Active"
                      ? "success"
                      : status === "Pending"
                        ? "warning"
                        : "danger";
                  return <Tag value={status} severity={severity} />;
                },
              },
            ]}
            onEdit={(row) => router.push(`/prerecord/add?id=${row._id}`)}
            onDelete={handleDeleteClick}
          />
           )
        }
        </div>
        {/* <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        /> */}
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
      </ComponentCard>
    </div>

  );
}

const renderSkeletonRows = () => (
  <div className="card p-4">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="flex items-center py-2 border-b">
        <Skeleton size="1.5rem" className="mr-3" />
        <Skeleton width="25rem" height="2.2rem" className="mr-4" />
        <Skeleton width="10rem" height="2.2rem" className="mr-4" />
        <Skeleton width="10rem" height="2.2rem" className="mr-4" />
        <Skeleton width="8rem" height="2.2rem" className="mr-4" />
        <Skeleton width="8rem" height="2.2rem" className="mr-4" />
        <Skeleton width="8rem" height="2.2rem" className="mr-4" />
        <Skeleton width="8rem" height="2.2rem" className="mr-4" />
        {/* <Skeleton width="10rem" height="2.2rem" className="mr-4" /> */}
        <Skeleton shape="circle" size="2rem" className="mr-2" />
        <Skeleton shape="circle" size="2rem" />
      </div>
    ))}
  </div>
);






































// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { api } from "@/utils/axiosInstance";
// import endPointApi from "@/utils/endPointApi";
// import ComponentCard from "@/components/common/ComponentCard";
// import PrimeReactTable from "@/components/tables/PrimeReactTable";
// import CommonDialog from "@/components/tables/CommonDialog";
// import { PlusIcon } from "@/icons";
// import { Tooltip } from "primereact/tooltip";
// import TableSkeleton from "@/components/common/TableSkeleton";

// type QuestionType = {
//   id: number;
//   title: string;
//   price?: string;
//   features?: string;
//   rating?: string;
//   tag?: string;
//   total_reviews?: string;
//   createdAt?: string;
//   description?: string;
// };

// type Col = "title" | "tag" | "rating" | "features" | "price" | "createdAt";

// const truncate = (str: string, len: number) =>
//   str.length > len ? `${str.slice(0, len)}…` : str;

// export default function Page() {
//   const router = useRouter();

//   const [data, setData] = useState<QuestionType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [selectedRow, setSelectedRow] = useState<QuestionType | null>(null);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [page, setPage] = useState<number>(1);
//   const [rows, setRows] = useState<number>(10);
//   const [totalRecords, setTotalRecords] = useState<number>(0);

//   const fetchQuestions = useCallback(async () => {
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

//   const handleDeleteClick = (row: QuestionType) => {
//     setSelectedRow(row);
//     setIsDeleteModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!selectedRow) return;
//     try {
//       await api.delete(`${endPointApi.deleteQuestion}/${selectedRow.id}`);
//       fetchQuestions(); // Refresh after deletion
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsDeleteModalOpen(false);
//       setSelectedRow(null);
//     }
//   };

//   useEffect(() => {
//     fetchQuestions();
//   }, [fetchQuestions]);

//   const columns = [
//     {
//       field: "title" as Col,
//       header: "Title",
//       body: ({ id, title }: QuestionType) => (
//         <>
//           <Tooltip target={`.title-${id}`} content={title} position="bottom" />
//           <div className={`title-${id} w-[300px] truncate cursor-pointer`}>
//             {truncate(title, 50)}
//           </div>
//         </>
//       ),
//     },
//     {
//       field: "tag" as Col,
//       header: "Tag",
//       body: ({ id, tag }: QuestionType) =>
//         tag ? (
//           <>
//             <Tooltip target={`.tag-${id}`} content={tag} position="bottom" />
//             <div className={`tag-${id} w-[150px] truncate cursor-pointer`}>
//               {truncate(tag, 20)}
//             </div>
//           </>
//         ) : (
//           "-"
//         ),
//     },
//     {
//       field: "rating" as Col,
//       header: "Rating",
//       body: (row: QuestionType) => row.rating || "-",
//     },
//     {
//       field: "features" as Col,
//       header: "Features",
//       body: ({ id, features }: QuestionType) =>
//         features ? (
//           <>
//             <Tooltip target={`.features-${id}`} content={features} position="bottom" />
//             <div className={`features-${id} w-[200px] truncate cursor-pointer`}>
//               {truncate(features, 35)}
//             </div>
//           </>
//         ) : (
//           "-"
//         ),
//     },
//     {
//       field: "price" as Col,
//       header: "Price",
//       body: (row: QuestionType) => row.price || "-",
//     },
//     {
//       field: "createdAt" as Col,
//       header: "Created At",
//       body: (row: QuestionType) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"),
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <ComponentCard
//         title="Question List"
//         Plusicon={<PlusIcon />}
//         name="Add Question"
//         onAddProductClick="/question/add"
//       >
//         {loading ? (
//           <TableSkeleton
//             count={10}
//             columns={["20rem", "12rem", "7rem", "18rem", "8rem", "8rem"]}
//           />
//         ) : (
//           <PrimeReactTable
//             data={data}
//             loading={loading}
//             totalRecords={totalRecords}
//             rows={rows}
//             columns={columns}
//             onPageChange={(newPage, newRows) => {
//               setPage(newPage);
//               setRows(newRows);
//             }}
//             onEdit={(row) => router.push(`/question/add?id=${row.id}`)}
//             onDelete={handleDeleteClick}
//           />
//         )}

//         <CommonDialog
//           visible={isDeleteModalOpen}
//           header="Confirm Delete"
//           footerType="confirm-delete"
//           onHide={() => setIsDeleteModalOpen(false)}
//           onSave={confirmDelete}
//         >
//           <div className="confirmation-content flex items-center gap-3">
//             <i className="pi pi-exclamation-triangle text-3xl text-red-500" />
//             {selectedRow && (
//               <span>
//                 Are you sure you want to delete <b>{selectedRow.title}</b>?
//               </span>
//             )}
//           </div>
//         </CommonDialog>
//       </ComponentCard>
//     </div>
//   );
// }
