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

type Plan = {
  _id: string;
  id: string;
  name: string;
  price: string;
  price_amount: number;
  currency: string;
  duration: string;
  duration_months: number;
  features: string[];
  icon_type: 'crown' | 'shield' | 'zap' | 'star' | 'rocket';
  badge?: {
    text: string;
    color: string;
  };
  is_popular: boolean;
  is_best_value: boolean;
  button_text: string;
  highlights: string[];
  sort_order: number;
  status: 'Active' | 'Inactive';
  createdAt?: string;
};

const statusSeverity = (s?: string): "success" | "warning" | "danger" =>
  s === "Active" ? "success" : "danger";

const truncate = (str: string, len: number) =>
  str.length > len ? `${str.slice(0, len)}…` : str;

export default function PlansListPage() {
  const router = useRouter();

  /* -------------------- State ------------------------------------ */
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [rows] = useState(10);

  const [toDelete, setToDelete] = useState<Plan | null>(null);

  /* -------------------- Data fetch -------------------------------- */
  const fetchPlans = useCallback(async () => {
    try {
      const { data } = await api.get<{
        success: boolean;
        data: Plan[];
        total: number;
      }>(`${endPointApi.getAllPlans}`);
      if (data.success) {
        setPlans(data.data);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  /* -------------------- Actions ----------------------------------- */
  const onDelete = useCallback((plan: Plan) => setToDelete(plan), []);

  const confirmDelete = useCallback(async () => {
    if (!toDelete) return;
    try {
      await api.delete(`${endPointApi.deletePlan}/${toDelete._id}`);
      setPlans((prev) => prev.filter((p) => p._id !== toDelete._id));
      setTotal((t) => t - 1);
      setToDelete(null);
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  }, [toDelete]);

  const toggleStatus = useCallback(async (plan: Plan) => {
    try {
      const newStatus = plan.status === 'Active' ? 'Inactive' : 'Active';
      await api.put(`${endPointApi.updatePlan}/${plan._id}`, {
        status: newStatus
      });
      
      setPlans(prev => prev.map(p => 
        p._id === plan._id ? { ...p, status: newStatus } : p
      ));
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  }, []);

  /* -------------------- Columns (memoised) ------------------------ */
  const columns = useMemo(
    () => [
      {
        field: "name" as keyof Plan,
        header: "Plan Name",
        body: ({ _id, name, icon_type }: Plan) => (
          <div className="flex items-center gap-2">
            
            <Tooltip target={`.plan-name-${_id}`} content={name} position="bottom" />
            <div className={`plan-name-${_id} font-medium cursor-pointer`}>
              {truncate(name, 20)}
            </div>
          </div>
        ),
      },
      
      {
        field: "price_inr" as keyof Plan,
        header: "Price",
        body: ({ price_inr }: Plan) => (
          <span className="font-semibold">{price_inr}</span>
        ),
      },
      {
        field: "duration" as keyof Plan,
        header: "Duration",
        body: ({ duration }: Plan) => (
          <Tooltip target={`.duration`} content={duration} position="bottom">
            <span className="text-sm">{truncate(duration, 20)}</span>
          </Tooltip>
        ),
      },
      {
        field: "features" as keyof Plan,
        header: "Features",
        body: ({ features }: Plan) => (
          <span className="text-sm">{features.length} features</span>
        ),
      },
      {
        field: "is_popular" as keyof Plan,
        header: "Popular",
        body: ({ is_popular,is_best_value }: Plan) => {
          let badgeText = "";
          if (is_popular) badgeText = "Popular";
          if (is_best_value) badgeText = "Best Value";
          
          return badgeText ? (
            <Tag 
              value={badgeText} 
              severity="info" 
              className="text-xs"
            />
          ) : (
            <span className="text-gray-400">-</span>
          );
        },
      },
      {
        field: "sort_order" as keyof Plan,
        header: "Order",
        body: ({ sort_order }: Plan) => (
          <span className="text-sm">{sort_order}</span>
        ),
      },
      {
        field: "status" as keyof Plan,
        header: "Status",
        body: ({ status, _id }: Plan) => (
          <div className="flex items-center gap-2">
            <Tag 
              value={status} 
              severity={statusSeverity(status)} 
              className="cursor-pointer"
              onClick={() => toggleStatus({ _id, status } as Plan)}
            />
          </div>
        ),
      },
      {
        field: "createdAt" as keyof Plan,
        header: "Created At",
        body: ({ createdAt }: Plan) =>
          createdAt ? new Date(createdAt).toLocaleDateString() : "-",
      },
    ],
    [toggleStatus]
  );

  /* -------------------- Render ------------------------------------ */
  return (
    <div className="space-y-6">
      <ComponentCard
        title="Plans Management"
        Plusicon={<PlusIcon />}
        name="Add New Plan"
        onAddProductClick="/plan/add"
      >
        {loading ? (
          renderSkeletonRows()
        ) : (
          <PrimeReactTable
            data={plans}
            loading={loading}
            totalRecords={total}
            rows={rows}
            columns={columns}
            onEdit={(plan) => router.push(`/plan/add?id=${plan.id}`)}
            onDelete={onDelete}
          />
        )}
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
              Are you sure you want to delete <b>{toDelete.name}</b> plan?
            </span>
          )}
        </div>
      </CommonDialog>
    </div>
  );
}

const renderSkeletonRows = () => (
  <div className="card p-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center py-3 border-b gap-4">
        <Skeleton shape="circle" size="3rem" className="mr-2" />
        <Skeleton width="12rem" height="2rem" />
        <Skeleton width="8rem" height="2rem" />
        <Skeleton width="8rem" height="2rem" />
        <Skeleton width="10rem" height="2rem" />
        <Skeleton width="6rem" height="2rem" />
        <Skeleton shape="circle" size="2.5rem" className="ml-auto" />
      </div>
    ))}
  </div>
);