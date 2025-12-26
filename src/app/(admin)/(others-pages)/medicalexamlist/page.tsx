"use client";
import { Tag } from "primereact/tag";
import ComponentCard from "@/components/common/ComponentCard";
import PrimeReactTreeTable from "@/components/tables/PrimeReactTreeTable";
import { PlusIcon } from "@/icons";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import CommonDialog from "@/components/tables/CommonDialog";
import { useRouter } from "next/navigation";

interface Plan {
  plan_month: string | number;
  plan_type: string;
  plan_pricing: number;
  most_popular?: boolean;
}

type FormattedData = {
  id: string;
  category_name: string;
  exam_name: string;
  status: string;
  children?: {
    plan_month: string;
    plan_type: string;
    plan_pricing: number;
    plan_popular: boolean;
  }[];
};

export default function DemoPage() {
  const [data, setData] = useState<FormattedData[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [selectedRow, setSelectedRow] = useState<FormattedData | null>(null);
  const router = useRouter();

  const getExamData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`${endPointApi.getAllExamList}?page=${page}&rows=${rows}`);
      type ApiItem = {
        id?: string;
        _id?: string;
        category_name?: string;
        exams?: { id?: string; exam_name?: string; status?: string }[];
        choose_plan_list?: Plan[];
      };

      const apiData: ApiItem[] = Array.isArray(res.data.data) ? res.data.data : [];
      const formattedData: FormattedData[] = apiData.map((item) => {
        const children =
          Array.isArray(item.choose_plan_list) &&
          item.choose_plan_list.map((plan: Plan) => ({
            plan_type: plan.plan_type ?? "-",
            plan_month: String(plan.plan_month ?? "-"),
            plan_pricing: Number(plan.plan_pricing ?? 0),
            plan_popular: Boolean(plan.most_popular),
          }));
        return {
          id: String(item.id),
          exam_id: String(item.id ?? item.exams?.[0]?._id ?? ""),
          category_name: item.category_name ?? "-",
          exam_name: item.exams?.[0]?.exam_name ?? "-",
          status: item.exams?.[0]?.status ?? "Inactive",
          children: children || [],
        };
      });

      setData(formattedData);
      setTotalRecords(Number(res.data.total ?? 0));
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      setLoading(false);
    }
  }, [page, rows]);

  const confirmDelete = async () => {
    if (!selectedRow) return;
    try {
      await api.delete(`${endPointApi.deleteExamList}/${selectedRow.id}`);
      getExamData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedRow(null);
    }
  };
  const handleDeleteClick = (row: FormattedData) => {
    setSelectedRow(row);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    getExamData();
  }, [getExamData]);

  const headerNameMap = {
    plan_month: "Plan Day",
    plan_type: "Plan Type",
    plan_pricing: "Pricing",
    plan_popular: "Most Popular",
  };


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
              header: "Status",
              body: (row: { status?: string }) => {
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
          headerNameMap={headerNameMap}
          // onEdit={(row) => console.log("Edit", row)}
          onEdit={(row) => router.push(`/medicalexamlist/add?id=${row.id}`)}
          onDelete={handleDeleteClick}
        />
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
              Are you sure you want to delete <b>{selectedRow.category_name}</b>?
            </span>
          )}
        </div>
      </CommonDialog>
    </div>
  );
}
