"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useState } from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { FaRegEye } from "react-icons/fa6";
import { usePathname } from "next/navigation";

type ColumnType<T> = {
  field?: keyof T;
  header: string;
  body?: (rowData: T) => React.ReactNode;
  sortable?: boolean;
};

interface PrimeReactTableProps<T> {
  data: T[];
  loading: boolean;
  columns: ColumnType<T>[];
  totalRecords?: number;
  rows?: number;
  onPageChange?: (page: number, rows: number) => void;
  selection?: T[];
  onSelectionChange?: (selected: T[]) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  showSelection?: boolean;
}

export default function PrimeReactTable<T extends { id: number; status?: string }>({
  data,
  loading,
  columns,
  totalRecords = 0,
  rows = 10,
  onEdit,
  onDelete,
  onView,
}: PrimeReactTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const pathname = usePathname();

  // Action Buttons
  const actionBodyTemplate = (rowData: T) => (
    <div className="flex gap-3">
      {pathname === "/payment" && (
        <Button
          icon={<FaRegEye size={16} />}
          rounded
          outlined
          severity="info"
          onClick={() => onView?.(rowData)}
          className="p-0 flex items-center justify-center"
          style={{ height: "2rem", width: "2rem", borderRadius: "50%" }}
        />
      )}

      <Button
        icon={<GoPencil size={16} />}
        rounded
        outlined
        severity="success"
        onClick={() => onEdit?.(rowData)}
        className="p-0 flex items-center justify-center"
        style={{ height: "2rem", width: "2rem", borderRadius: "50%" }}
      />
      <Button
        icon={<RiDeleteBin5Line size={16} />}
        rounded
        outlined
        severity="danger"
        onClick={() => onDelete?.(rowData)}
        className="p-0 flex items-center justify-center"
        style={{ height: "2rem", width: "2rem", borderRadius: "50%" }}
      />
    </div>
  );

  return (
    <div className="card">
      {/* @ts-expect-error PrimeReact type mismatch (safe to ignore) */}
      <DataTable<T>
        value={data}
        loading={loading}
        paginator
        totalRecords={totalRecords}
        rows={rows}
        rowsPerPageOptions={[10, 15, 20]}
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        dataKey="id"
        lazy
        selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows((e.value as T[]) ?? [])}
      >
        {/* Checkbox Selection Column */}
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} exportable={false} />

        {/* Dynamic Columns */}
        {columns.map((col, idx) => (
          <Column
            key={idx}
            field={col.field as string}
            header={col.header}
            sortable={col.sortable}
            body={col.body}
          />
        ))}

        {/* Action Column */}
        <Column header="Action" body={actionBodyTemplate}></Column>
      </DataTable>
    </div>
  );
}
