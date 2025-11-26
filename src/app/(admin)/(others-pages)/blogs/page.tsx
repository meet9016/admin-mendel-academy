"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import ComponentCard from "@/components/common/ComponentCard";
import { PlusIcon } from "@/icons";
import PrimeReactTable from "@/components/tables/PrimeReactTable";
import CommonDialog from "@/components/tables/CommonDialog";
import { Tag } from "primereact/tag";
import { Tooltip } from "primereact/tooltip";
import { Skeleton } from "primereact/skeleton";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
type Blog = {
  id: number;
  title: string;
  exam_name: string;
  createdAt?: string;
  status?: string;
};

type Col = "exam_name" | "title" | "createdAt" | "status";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
const statusSeverity = (s?: string): "success" | "warning" | "danger" =>
  s === "Active" ? "success" : s === "Pending" ? "warning" : "danger";

const truncate = (str: string, len: number) =>
  str.length > len ? `${str.slice(0, len)}…` : str;

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export default function BlogListPage() {
  const router = useRouter();

  /* -------------------- State ------------------------------------ */
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [rows] = useState(10);

  const [toDelete, setToDelete] = useState<Blog | null>(null);

  /* -------------------- Data fetch -------------------------------- */
  const fetchBlogs = useCallback(async () => {
    try {
      const { data } = await api.get<{
        data: Blog[];
        total: number;
      }>(`${endPointApi.getAllBlogs}`);
      setBlogs(data.data);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  /* -------------------- Actions ----------------------------------- */
  const onDelete = useCallback((b: Blog) => setToDelete(b), []);

  const confirmDelete = useCallback(async () => {
    if (!toDelete) return;
    await api.delete(`${endPointApi.deleteBlog}/${toDelete.id}`);
    setBlogs((prev) => prev.filter((b) => b.id !== toDelete.id));
    setTotal((t) => t - 1);
    setToDelete(null);
  }, [toDelete]);

  /* -------------------- Columns (memoised) ------------------------ */
  const columns = useMemo(
    () => [
      {
        field: "exam_name" as Col,
        header: "Exam Name",
        body: ({ id, exam_name }: Blog) => (
          <>
            <Tooltip target={`.exam-${id}`} content={exam_name} position="bottom" />
            <div className={`exam-${id} w-[150px] truncate cursor-pointer`}>
              {truncate(exam_name, 22)}
            </div>
          </>
        ),
      },
      {
        field: "title" as Col,
        header: "Title",
        body: ({ id, title }: Blog) => (
          <>
            <Tooltip target={`.title-${id}`} content={title} position="bottom" />
            <div className={`title-${id} w-[350px] truncate cursor-pointer`}>
              {truncate(title, 50)}
            </div>
          </>
        ),
      },
      {
        field: "createdAt" as Col,
        header: "Created At",
        body: ({ createdAt }: Blog) =>
          createdAt ? new Date(createdAt).toLocaleDateString() : "-",
      },
      {
        field: "status" as Col,
        header: "Status",
        body: ({ status }: Blog) => (
          <Tag value={status || "Inactive"} severity={statusSeverity(status)} />
        ),
      },
    ],
    []
  );

  /* -------------------- Render ------------------------------------ */
  return (
    <div className="space-y-6">
      <ComponentCard
        title="Blog List"
        Plusicon={<PlusIcon />}
        name="Add Blog"
        onAddProductClick="/blogs/add"
      >
        {
          loading ? (
            renderSkeletonRows()
          ) : (
            <PrimeReactTable
              data={blogs}
              loading={loading}
              totalRecords={total}
              rows={rows}
              columns={columns}
              onEdit={(b) => router.push(`/blogs/add?id=${b.id}`)}
              onDelete={onDelete}
            />
          )
        }
      </ComponentCard>

      <CommonDialog
        visible={!!toDelete}
        header="Confirm Delete"
        footerType="confirm-delete"
        onHide={() => setToDelete(null)}
        onSave={confirmDelete}
      >
        <div className="confirmation-content flex items-center gap-3">
          <i className="pi pi-exclamation-triangle text-3xl text-red-500" />
          {toDelete && (
            <span>
              Are you sure you want to delete <b>{toDelete.title}</b>?
            </span>
          )}
        </div>
      </CommonDialog>
    </div>
  );
}

const renderSkeletonRows = () => (
  <div className="card p-4">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="flex items-center py-2 border-b">
        <Skeleton size="1.5rem" className="mr-3" />
        <Skeleton width="15rem" height="2.2rem" className="mr-4" />
        <Skeleton width="25rem" height="2.2rem" className="mr-4" />
        <Skeleton width="20rem" height="2.2rem" className="mr-4" />
        <Skeleton width="10rem" height="2.2rem" className="mr-4" />
        <Skeleton width="10rem" height="2.2rem" className="mr-4" />
        <Skeleton shape="circle" size="2rem" className="mr-2" />
        <Skeleton shape="circle" size="2rem" />
      </div>
    ))}
  </div>
);
