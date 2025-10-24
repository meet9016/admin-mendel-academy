"use client";
import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { PlusIcon } from "@/icons";
import ComponentCard from "@/components/common/ComponentCard";
import ReactTable from "@/components/tables/ReactTable";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useRouter } from "next/navigation";

type BlogType = {
  id: number;
  title: string;
  exam_name: string;
  author?: string;
  createdAt?: string;
};

export default function page() {
    const router = useRouter();
  
   const [data, setData] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getBlogData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${endPointApi.getAllQuestion}`);

      setData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlogData();
  }, []);

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
          <ReactTable
            selectable={true}
            data={data}
            loading={loading}
            columns={[
              { field: "title", header: "Title" },
              {
                field: "price",
                header: "Price",
                body: (row) => row.price || "-",
              },
              { field: "duration", header: "Duration" },
              { field: "description", header: "Description" },
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
          />
        </div>
      </ComponentCard>
        {/* <Question /> */}
      </div>
    </div>
  );
}
