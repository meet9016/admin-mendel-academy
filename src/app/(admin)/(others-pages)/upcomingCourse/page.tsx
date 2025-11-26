'use client';
import ComponentCard from '@/components/common/ComponentCard'
import CommonDialog from '@/components/tables/CommonDialog';
import PrimeReactTable from '@/components/tables/PrimeReactTable'
import { PlusIcon } from '@/icons'
import { api } from '@/utils/axiosInstance'
import endPointApi from '@/utils/endPointApi'
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'

type upcomeingcourse = {
  id: number
  title: string;
  level: string;
  type: string;
  startDate: number;
  waitlistSpots: number;
  createdAt: string;
}

const page = () => {
  const router = useRouter();
  const [data, setData] = useState<upcomeingcourse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<upcomeingcourse | null>(null);

  const getupComeingcourse = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`${endPointApi.getAllUpcomeing}?page=${page}&limit=${rows}`);
      setData(res.data.data || []);
      setTotalRecords(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, rows]);

  useEffect(() => {
    getupComeingcourse();
  }, [getupComeingcourse]);

  const handleDeleteClick = (row: upcomeingcourse) => {
    setSelectedRow(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRow) return;
    try {
      await api.delete(`${endPointApi.deleteUpcomeing}/${selectedRow.id}`);
      getupComeingcourse();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedRow(null);
    }
  };
  return (
    <div>
      <div className="space-y-6">
        <ComponentCard
          title="Upcomeing course List"
          Plusicon={<PlusIcon />}
          name="Add Upcomeing course"
          onAddProductClick="/upcomingCourse/add"
        >
          <div className="card">
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
                { field: "title", header: "Title" },
                { field: "level", header: "Level" },
                { field: "type", header: "Type" },
                { field: "startDate", header: "Date" },
                { field: "waitlistSpots", header: "Whishlist Spot" },
                {
                  field: "createdAt",
                  header: "Created At",
                  body: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"),
                },
              ]}
              onEdit={(row) => router.push(`/upcomingCourse/add?id=${row.id}`)}
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
      </div>
    </div>
  )
}

export default page