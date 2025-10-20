// 'use client'

// import '@tanstack/table-core'
// import { useEffect, useState, useMemo } from 'react'
// import {
//   useReactTable,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   flexRender,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   getFacetedMinMaxValues,
//   type ColumnDef,
//   type FilterFn,
//   type ColumnFiltersState,
//   type Table,
//   type Column
// } from '@tanstack/react-table'
// import { rankItem } from '@tanstack/match-sorter-utils'
// import type { RankingInfo } from '@tanstack/match-sorter-utils'
// import TextField from '@mui/material/TextField'
// import TablePagination from '@mui/material/TablePagination'
// import Card from '@mui/material/Card'

// const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
//   const itemRank = rankItem(row.getValue(columnId), value)
//   addMeta({ itemRank })
//   return itemRank.passed
// }

// declare module '@tanstack/table-core' {
//   interface FilterFns {
//     fuzzy: FilterFn<unknown>
//   }
//   interface FilterMeta {
//     itemRank: RankingInfo
//   }
// }

// const Filter = ({ column, table }: { column: Column<any, unknown>; table: Table<any> }) => {
//   const columnFilterValue = column.getFilterValue()

//   return (
//     <div className='flex gap-x-2'>
//       <TextField
//         fullWidth
//         size='small'
//         value={(columnFilterValue ?? '') as string}
//         onChange={e => column.setFilterValue(e.target.value)}
//         placeholder='Search...'
//       />
//     </div>
//   )
// }

// const ReactTable = ({
//   data,
//   columns,
//   count,
//   page,
//   rowsPerPage,
//   onPageChange,
//   onRowsPerPageChange,
//   rowsPerPageOptions = [10, 25, 50],
//   className = ''
// }: {
//   data: any[]
//   columns: ColumnDef<any, any>[]
//   count: number
//   page: number
//   rowsPerPage: number
//   onPageChange: (event: unknown, newPage: number) => void // ✅ Fixed typing
//   onRowsPerPageChange: (newRowsPerPage: number) => void // ✅ Adjusted typing
//   rowsPerPageOptions?: (number | { label: string; value: number })[]
//   className?: string
// }) => {
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
//   const [globalFilter, setGlobalFilter] = useState('')

//   const table = useReactTable({
//     data,
//     columns,
//     filterFns: {
//       fuzzy: fuzzyFilter
//     },
//     state: {
//       columnFilters,
//       globalFilter,
//       pagination: {
//         pageIndex: page, // 0-based
//         pageSize: rowsPerPage
//       }
//     },
//     manualPagination: true,
//     pageCount: Math.max(1, Math.ceil((count ?? 0) / (rowsPerPage || 10))), // total pages

//     // ✅ let TanStack notify us; we call parent handlers
//     onPaginationChange: updater => {
//       const next = typeof updater === 'function' ? updater({ pageIndex: page, pageSize: rowsPerPage }) : updater

//       if (next.pageIndex !== page) {
//         onPageChange(undefined as any, next.pageIndex) // MUI signature (event, newPage)
//       }
//       if (next.pageSize !== rowsPerPage) {
//         onRowsPerPageChange(next.pageSize)
//       }
//     },

//     // keep other models (no client pagination model)
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getSortedRowModel: getSortedRowModel(),

//     // optional: avoid jumping back to page 0 when data changes
//     autoResetPageIndex: false
//   })

//   return (
//     <Card className='flex flex-col h-[600px]'>
//       <div className='flex-1 overflow-y-auto'>
//         <table className={`w-full`}>
//           <thead className='sticky top-0 bg-white z-20 shadow-sm'>
//             {table.getHeaderGroups().map(headerGroup => (
//               <tr key={headerGroup.id}>
//                 {headerGroup.headers.map(header => (
//                   <th key={header.id} className='h-[42px] text-xs px-2 py-1'>
//                     {!header.isPlaceholder && (
//                       <div
//                         className='flex justify-center items-center capitalize text-[14px]'
//                         onClick={header.column.getToggleSortingHandler()}
//                       >
//                         {flexRender(header.column.columnDef.header, header.getContext())}
//                       </div>
//                     )}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody>
//             {table.getFilteredRowModel().rows.length === 0 ? (
//               <tr>
//                 <td colSpan={table.getAllColumns().length} className='text-center py-4'>
//                   No data available
//                 </td>
//               </tr>
//             ) : (
//               table.getRowModel().rows.map(row => (
//                 <tr key={row.id}>
//                   {row.getVisibleCells().map(cell => (
//                     <td key={cell.id} className='px-10 py-1'>
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//       <div className='sticky bottom-0 border-t z-20'>
//         <TablePagination
//           component='div'
//           className={className}
//           count={count}
//           page={page}
//           rowsPerPage={rowsPerPage}
//           rowsPerPageOptions={rowsPerPageOptions}
//           SelectProps={{ inputProps: { 'aria-label': 'rows per page' } }}
//           onPageChange={onPageChange}
//           onRowsPerPageChange={e => onRowsPerPageChange(Number((e.target as HTMLInputElement).value))}
//         />
//       </div>
//     </Card>
//   )
// }

// export default ReactTable










"use client";
import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
export interface CommonPrimeTableProps {
  data: any[];
  columns: {
    field?: string;
    header: string;
    body?: (rowData: any) => React.ReactNode;
    sortable?: boolean;
    style?: React.CSSProperties;
    filter?: boolean; // enable header filter
  }[];
  scrollHeight?: string;
  loading?: boolean;
  removableSort?: boolean;
  selectable?: boolean; // <-- new prop to enable checkbox selection
}

const ReactTable: React.FC<CommonPrimeTableProps> = ({
  data,
  columns,
  scrollHeight = "400px",
  loading = false,
  removableSort = true,
  selectable = false, // default false
}) => {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
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
        paginator rows={5}
        rowsPerPageOptions={[5, 10,]}
        emptyMessage="No data found"
        selection={selectable ? selectedItems : undefined}
        onSelectionChange={selectable ? (e) => setSelectedItems(e.value) : undefined}
        filterDisplay="menu"
      >
        {selectable && <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />}
        {columns.map((col, idx) => (
          <Column
            key={idx}
            field={col.field}
            header={col.header}
            body={col.body}
            // sortable={col.sortable}
            sortable={col.sortable ?? true} // <-- only sortable if col.sortable is true or undefined
            filter={col.filter ?? false} // enable header filter
            filterPlaceholder={col.filterPlaceholder ?? "Search"}
            style={{ textAlign: "left", minWidth: "120px", ...col.style }}
          />
        ))}
      </DataTable>
    </div>
  );
};

export default ReactTable;
