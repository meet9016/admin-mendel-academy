"use client";
import { Tag } from "primereact/tag";
import ComponentCard from "@/components/common/ComponentCard";
import PrimeReactTreeTable from "@/components/tables/PrimeReactTreeTable";
import { PlusIcon } from "@/icons";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";

export default function DemoPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const getExamData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`${endPointApi.getAllExamList}?page=${page}&rows=${rows}`);
      const apiData = res.data.data || [];

      //  Flatten data for DataTable
      const formattedData = apiData.map((item) => ({
        id: item._id,
        category_name: item.category_name,
        exam_name: item.exams?.[0]?.exam_name || "-",
        status: item.exams?.[0]?.status || "Inactive",
        children: item.choose_plan_list?.map((plan, idx) => ({
          // id: `${item.category_name}-${idx}`,
          plan_day: plan.plan_day,
          plan_type: plan.plan_type,
          plan_pricing: plan.plan_pricing,
          plan_popular: plan.most_popular
        })),
      }));

      setData(formattedData);
      setTotalRecords(res.data.total || 0);
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      setLoading(false);
    }
  }, [page, rows]);

  useEffect(() => {
    getExamData();
  }, [getExamData]);

  return (
    <div className="space-y-6">
      <ComponentCard
        title="Medical Exam"
        Plusicon={<PlusIcon />}
        name="Add Exam"
        onAddProductClick="/medicalexamlist/add"
      >
        <PrimeReactTreeTable
          data={data}
          loading={loading}
          totalRecords={totalRecords}
          rows={rows}
          onPageChange={(newPage, newRows) => {
            setPage(newPage);
            setRows(newRows);
          }}
          columns={[
            { field: "category_name", header: "Course" },
            { field: "exam_name", header: "Exam Name" },
            {
              field: "status",
              header: "Status / Price",
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
          onEdit={(row) => console.log("Edit", row)}
          onDelete={(row) => console.log("Delete", row)}
        />
      </ComponentCard>
    </div>
  );
}
