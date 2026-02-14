"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/utils/axiosInstance";
import endPointApi from "@/utils/endPointApi";
import ComponentCard from "@/components/common/ComponentCard";
import { useRouter } from "next/navigation";
import PrimeReactTreeTable from "@/components/tables/PrimeReactTreeTable";
import CommonDialog from "@/components/tables/CommonDialog";
import { PlusIcon } from "@/icons";
import { Skeleton } from "primereact/skeleton";

// ---------------------- TYPES ----------------------
type LiveCourseChild = {
  session_title: string;
  session_date: string;
};

export type FormattedTreeData = {
  id: string;
  title: string;
  description: string;
  price_dollar: string;
  price_inr: string;
};

// ---------------------- MAIN COMPONENT ----------------------
export default function Page() {
  const router = useRouter();

  const [data, setData] = useState<FormattedTreeData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<FormattedTreeData | null>(null);
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
console.log("data******-----",data);

  // ---------------------- DELETE HANDLER ----------------------
  const handleDeleteClick = (row: FormattedTreeData) => {
    setSelectedRow(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRow) return;
    try {
      const res = await api.delete(`${endPointApi.deleteHyperSpecialist}/${selectedRow.id}`);
      if (res?.data?.message) {
        getLiveCoursesData();
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedRow(null);
    }
  };

  // ---------------------- API CALL + DATA FORMAT ----------------------
  const getLiveCoursesData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`${endPointApi.getAllHyperSpecialist}?page=${page}&limit=${rows}`);
console.log(":==",res);

      const apiData = Array.isArray(res.data.data) ? res.data.data : [];

      // Convert API data → TreeTable Format
      const formattedData: FormattedTreeData[] = apiData.map((item: any) => {
        return {
          id: String(item.id),
          title: item.title ?? "-",
          // description: item.description ?? "-",
          price_dollar: item.price_dollar ?? "-",
          price_inr: item.price_inr ?? "-",
        };
      });

      // Use the formatted data for the table
      setData(formattedData);
      setTotalRecords(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, rows]);

  useEffect(() => {
    getLiveCoursesData();
  }, [getLiveCoursesData]);

  const headerNameMap = {
    plan_month: "Module Number",
    plan_type: "Module Name",
    plan_pricing: "Module Price",
    plan_popular: "Most Popular",
  };

  return (
    <div className="space-y-6">
      <ComponentCard
        title="HyperSpecialist List"
        Plusicon={<PlusIcon />}
        name="Add HyperSpecialists"
        onAddProductClick="/hyperSpecialist/add"
      >
        <div className="card">
          {
          loading ? (
            renderSkeletonRows()
          ) : (
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
              { field: "title", header: "Title" },
              // { field: "description", header: "Description" },
              {
                field: "price_dollar",
                header: "Price Dollar($)",
              },
              {
                field: "price_inr",
                header: "Price Inr(₹)",
              },
            ]}
            headerNameMap={headerNameMap}
            onEdit={(row) => router.push(`/hyperSpecialist/add?id=${row.id}`)}
            onDelete={handleDeleteClick}
          />
          )}
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
    </div>
  );
}

const renderSkeletonRows = () => (
  <div className="card p-4">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="flex items-center py-2 border-b">
        <Skeleton size="1.5rem" className="mr-3" />
        <Skeleton width="15rem" height="2.2rem" className="mr-4" />
        <Skeleton width="35rem" height="2.2rem" className="mr-4" />
        <Skeleton width="10rem" height="2.2rem" className="mr-4" />
        <Skeleton width="8rem" height="2.2rem" className="mr-4" />
        <Skeleton width="8rem" height="2.2rem" className="mr-4" />
        {/* <Skeleton width="10rem" height="2.2rem" className="mr-4" /> */}
        <Skeleton shape="circle" size="2rem" className="mr-2" />
        <Skeleton shape="circle" size="2rem" />
      </div>
    ))}
  </div>
);
