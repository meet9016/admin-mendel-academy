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
import { Skeleton } from "primereact/skeleton";

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
  rows = 10,
  onEdit,
  onDelete,
  onView,
}: PrimeReactTableProps<T>) {
  const pathname = usePathname();

  // Action Buttons
  const actionBodyTemplate = (rowData: T) => {
    if (loading) {
      return (
        <div className="flex gap-3">
          {/* View button skeleton (Only on "payment") */}
          {pathname === "/payment" && (
            <Skeleton shape="circle" width="2.2rem" height="2.2rem" />
          )}

          {/* Edit skeleton (No payment + No contactus) */}
          {(pathname !== "/payment" && pathname !== "/contactus") && (
            <Skeleton shape="circle" width="2.2rem" height="2.2rem" />
          )}

          {/* Delete skeleton (Always) */}
          <Skeleton shape="circle" width="2.2rem" height="2.2rem" />
        </div>
      );
    }
    return (
      <>
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

          {
            pathname !== "/payment" && pathname !== "/contactus" && (
              <Button
                icon={<GoPencil size={16} />}
                rounded
                outlined
                severity="success"
                onClick={() => onEdit?.(rowData)}
                className="p-0 flex items-center justify-center"
                style={{ height: "2rem", width: "2rem", borderRadius: "50%" }}
              />
            )
          }
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
      </>
    )
  };
   const [selectedCustomers, setSelectedCustomers] = useState([]);

 return (
  <div className="card">
    {/* @ts-expect-error PrimeReact type mismatch (safe to ignore) */}
    <DataTable<T>
     value={data}
        paginator
        rows={rows}
         className="p-datatable-sm p-fluid" 
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}
        dataKey="id"
        selectionMode="checkbox"
        selection={selectedCustomers}
        onSelectionChange={(e) => setSelectedCustomers(e.value)}
        emptyMessage={loading ? null : "No customers found."}  
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
    >
      <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} exportable={false} />

      {columns.map((col, idx) => (
        <Column
          key={idx}
          field={col.field as string}
          header={col.header}
          sortable={col.sortable}
          body={(rowData) =>
             col.body
                ? col.body(rowData)
                : rowData[col.field as keyof T]
          }
        />
      ))}

      <Column header="Action" body={actionBodyTemplate} />
    </DataTable>
  </div>
);
}
