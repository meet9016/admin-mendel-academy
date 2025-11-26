// "use client";
// import React, { useCallback, useEffect, useState } from "react";
// // import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// // import { PlusIcon } from "@/icons";
// import ComponentCard from "@/components/common/ComponentCard";
// import { api } from "@/utils/axiosInstance";
// import endPointApi from "@/utils/endPointApi";
// import { useRouter } from "next/navigation";
// import PrimeReactTable from "@/components/tables/PrimeReactTable";
// import CommonDialog from "@/components/tables/CommonDialog";
// import { PlusIcon } from "@/icons";

// type QuestionType = {
//   id: number;
//   title: string;
//   price?: string;
//   features?: string;
//   rating?: string;
//   tag?: string;
//   total_reviews?: string;
//   // duration?: string;
//   createdAt?: string;
//   description?: string;
// };

// export default function Page() {
//   const router = useRouter();

//   const [data, setData] = useState<QuestionType[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [selectedRow, setSelectedRow] = useState<QuestionType | null>(null);
//   const [rows, setRows] = useState<number>(10);
//   const [totalRecords, setTotalRecords] = useState<number>(0);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

//   const geQuestionData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await api.get(`${endPointApi.getAllQuestion}`);
//       setData(res.data.data || []);
//       setTotalRecords(res.data.total);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     geQuestionData();
//   }, [geQuestionData]);


//   const handleDeleteClick = (row: QuestionType) => {
//     setSelectedRow(row);
//     setIsDeleteModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!selectedRow) return;
//     try {
//       await api.delete(`${endPointApi.deleteQuestion}/${selectedRow.id}`);
//       geQuestionData();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsDeleteModalOpen(false);
//       setSelectedRow(null);
//     }
//   };
//   return (
//     <div>
//       {/* <PageBreadcrumb pageTitle="Question" /> */}
//       <div className="space-y-6">
//         <ComponentCard
//           title="Question List"
//           Plusicon={<PlusIcon />}
//           name="Add Question"
//           onAddProductClick="/question/add"
//         >
//           <div className="card">
//             <PrimeReactTable
//               data={data}
//               loading={loading}
//               totalRecords={totalRecords}
//               rows={rows}
//               columns={[
//                 { field: "title", header: "Title" },
//                 { field: "tag", header: "Tag" },
//                 { field: "rating", header: "Rating" },
//                 { field: "features", header: "Features" },
//                 { field: "price", header: "Price"},
//                 // { field: "description", header: "Description", sortable: true },
//                 {
//                   field: "createdAt",
//                   header: "Created At",
//                   body: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"),
//                 },
//               ]}
//               onEdit={(row) => router.push(`/question/add?id=${row.id}`)}
//               onDelete={handleDeleteClick}
//             />
//           </div>
//         </ComponentCard>

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
//         {/* <Question /> */}
//       </div>
//     </div>
//   );
// }































"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import ComponentCard from "@/components/common/ComponentCard";
import { PlusIcon } from "@/icons";
import PrimeReactTable from "@/components/tables/PrimeReactTable";
import CommonDialog from "@/components/tables/CommonDialog";
import { Tooltip } from "primereact/tooltip";
import TableSkeleton from "@/components/common/TableSkeleton";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

type QuestionType = {
  id: number;
  title: string;
  price?: string;
  features?: string;
  rating?: string;
  tag?: string;
  total_reviews?: string;
  createdAt?: string;
  description?: string;
};

type Col = "title" | "tag" | "rating" | "features" | "price" | "createdAt";

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

const truncate = (str: string, len: number) =>
  str.length > len ? `${str.slice(0, len)}…` : str;

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function Page() {
  const router = useRouter();
  /* -------------------- State ------------------------------------ */
  const [data, setData] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [rows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedRow, setSelectedRow] = useState<QuestionType | null>(null);

  /* -------------------- Fetch Data ------------------------------- */
  const fetchQuestions = useCallback(async () => {
    try {
      const res = await api.get(`${endPointApi.getAllQuestion}`);
      setData(res.data.data || []);
      setTotalRecords(res.data.total);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  /* -------------------- Actions ---------------------------------- */

  const onDelete = (row: QuestionType) => setSelectedRow(row);
  const confirmDelete = useCallback(async () => {
    if (!selectedRow) return;
    await api.delete(`${endPointApi.deleteQuestion}/${selectedRow.id}`);
    setData((prev) => prev.filter((item) => item.id !== selectedRow.id));
    setTotalRecords((t) => t - 1);
    setSelectedRow(null);
  }, [selectedRow]);

  /* -------------------- Columns ---------------------------------- */

  const columns = useMemo(
    () => [
      {
        field: "title" as Col,
        header: "Title",
        body: ({ id, title }: QuestionType) => (
          <>
            <Tooltip target={`.title-${id}`} content={title} position="bottom" />
            <div className={`title-${id} w-[300px] truncate cursor-pointer`}>
              {truncate(title, 50)}
            </div>
          </>
        ),
      },

      {
        field: "tag" as Col,
        header: "Tag",
        body: ({ id, tag }: QuestionType) =>
          tag ? (
            <>
              <Tooltip target={`.tag-${id}`} content={tag} position="bottom" />
              <div className={`tag-${id} w-[150px] truncate cursor-pointer`}>
                {truncate(tag, 20)}
              </div>
            </>
          ) : (
            "-"
          ),
      },

      {
        field: "rating" as Col,
        header: "Rating",
        body: (row: QuestionType) => row.rating || "-",
      },

      {
        field: "features" as Col,
        header: "Features",
        body: ({ id, features }: QuestionType) =>
          features ? (
            <>
              <Tooltip
                target={`.features-${id}`}
                content={features}
                position="bottom"
              />
              <div
                className={`features-${id} w-[200px] truncate cursor-pointer`}
              >
                {truncate(features, 35)}
              </div>
            </>
          ) : (
            "-"
          ),
      },

      {
        field: "price" as Col,
        header: "Price",
        body: (row: QuestionType) => row.price || "-",
      },

      {
        field: "createdAt" as Col,
        header: "Created At",
        body: (row: QuestionType) =>
          row.createdAt
            ? new Date(row.createdAt).toLocaleDateString()
            : "-",
      },
    ],
    []
  );

  /* -------------------- Render ---------------------------------- */

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Question List"
        Plusicon={<PlusIcon />}
        name="Add Question"
        onAddProductClick="/question/add"
      >
        {!loading ? (
          <TableSkeleton
            count={10}
            columns={[
              "20rem",
              "12rem",
              "7rem",
              "18rem",
              "8rem",
              "8rem",
            ]}
          />
        ) : (
          <PrimeReactTable
            data={data}
            loading={loading}
            totalRecords={totalRecords}
            rows={rows}
            columns={columns}
            onEdit={(row) => router.push(`/question/add?id=${row.id}`)}
            onDelete={onDelete}
          />
        )}
      </ComponentCard>

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

