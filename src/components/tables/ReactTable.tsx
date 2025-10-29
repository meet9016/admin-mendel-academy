import React, { useState } from "react";
import {
  DataTable,
  DataTableValue,
  DataTablePageEvent, // ✅ import this
} from "primereact/datatable";
import { Column } from "primereact/column";

export interface CommonPrimeTableProps<T extends DataTableValue> {
  data: T[];
  columns: {
    field?: keyof T | string;
    header: string;
    body?: (rowData: T) => React.ReactNode;
    sortable?: boolean;
    style?: React.CSSProperties;
    filter?: boolean;
    filterPlaceholder?: string;
  }[];
  scrollHeight?: string;
  loading?: boolean;
  removableSort?: boolean;
  selectable?: boolean;

  paginator?: boolean;
  lazy?: boolean;
  page?: number;
  rows?: number;
  totalRecords?: number;
  onPageChange?: (page: number, rows: number) => void;
}

const ReactTable = <T extends DataTableValue>({
  data,
  columns,
  scrollHeight = "400px",
  loading = false,
  removableSort = true,
  selectable = false,
  totalRecords,
  page,
  rows,
  onPageChange,
}: CommonPrimeTableProps<T>) => {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  // ✅ Strongly type the event parameter
const handlePageChange = (e: DataTablePageEvent) => {
  const currentPage = typeof e.page === "number" ? e.page + 1 : 1; // ✅ fallback
  onPageChange?.(currentPage, e.rows);
};


  return (
    <div className="card">
      <DataTable
        value={data}
        loading={loading}
        scrollable
        scrollHeight={scrollHeight}
        removableSort={removableSort}
        tableStyle={{ minWidth: "50rem" }}
        stripedRows
        paginator
        lazy
        totalRecords={totalRecords}
        first={page ? (page - 1) * (rows || 10) : 0}
        rows={rows}
        onPage={handlePageChange} // ✅ no 'any'
        rowsPerPageOptions={[5, 10, 20]}
        emptyMessage="No data found"
        selection={selectable ? selectedItems : undefined}
        onSelectionChange={
          selectable ? (e) => setSelectedItems(e.value as T[]) : undefined
        }
        filterDisplay="menu"
      >
        {selectable && <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />}

        {columns.map((col, idx) => (
          <Column
            key={idx}
            field={col.field as string}
            header={col.header}
            body={col.body}
            sortable={col.sortable ?? true}
            filter={col.filter ?? false}
            filterPlaceholder={col.filterPlaceholder ?? "Search"}
            style={{ textAlign: "left", minWidth: "120px", ...col.style }}
          />
        ))}
      </DataTable>
    </div>
  );
};

export default ReactTable;

