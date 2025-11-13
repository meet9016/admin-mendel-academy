"use client";

import React, { useState } from "react";
import { DataTable, DataTableExpandedRows, DataTableRowEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin5Line } from "react-icons/ri";

type ColumnType<T> = {
    field?: keyof T;
    header: string;
    body?: (rowData: T) => React.ReactNode;
    sortable?: boolean;
};

interface PrimeReactTreeTableProps<T> {
    data: T[];
    loading: boolean;
    columns: ColumnType<T>[];
    totalRecords?: number;
    rows?: number;
    onPageChange?: (page: number, rows: number) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
}

export default function PrimeReactTreeTable<
    T extends { id: number | string; children?: Record<string, unknown>[] }
>({
    data,
    loading,
    columns,
    totalRecords = 0,
    rows = 10,
    onEdit,
    onDelete,
}: PrimeReactTreeTableProps<T>) {
    // ✅ Fixed: proper type instead of `any`
    const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | null>(null);

    /** ✅ Allow expansion only if there are children */
    const allowExpansion = (rowData: T) =>
        Array.isArray(rowData.children) && rowData.children.length > 0;

    /** ✅ Allow only ONE row to expand at a time */
    // const onRowExpand = (event: { data: T }) => {
    const onRowExpand = (event: DataTableRowEvent) => {
        setExpandedRows({ [event.data.id]: true });
    };

    const onRowCollapse = () => {
        setExpandedRows(null);
    };

    /** Template for expanded content */
    const rowExpansionTemplate = (data: T) => {
        if (!Array.isArray(data.children) || data.children.length === 0) {
            return (
                <div className="p-3 text-gray-500">
                    No additional details available.
                </div>
            );
        }

        const firstChild = data.children[0];

        const headerNameMap: Record<string, string> = {
            plan_day: "Plan Day",
            plan_type: "Plan Type",
            plan_pricing: "Plan Pricing",
            plan_popular: "Most Popular",
        };

        return (
            <div className="p-3">
                <h5 className="font-semibold mb-3">
                    Details for{" "}
                    {String(
                        (data as Record<string, unknown>)["category_name"] ??
                        (data as Record<string, unknown>)["exam_name"] ??
                        "-"
                    )}
                </h5>

                <DataTable value={data.children} dataKey="id" responsiveLayout="scroll">
                    {Object.keys(firstChild).map((key, index) => (
                        // <Column
                        //     key={index}
                        //     field={key}
                        //     header={key.charAt(0).toUpperCase() + key.slice(1)}
                        // />
                        <Column
                            key={index}
                            field={key}
                            header={headerNameMap[key] || key.charAt(0).toUpperCase() + key.slice(1)}
                        />
                    ))}
                </DataTable>
            </div>
        );
    };

    /**  Action buttons */
    const actionBodyTemplate = (rowData: T) => (
        <div className="flex gap-3">
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
            <DataTable
                value={data}
                loading={loading}
                paginator
                totalRecords={totalRecords}
                rows={rows}
                rowsPerPageOptions={[10, 15, 20]}
                dataKey="id"
                expandedRows={expandedRows as DataTableExpandedRows}
                onRowExpand={onRowExpand}
                onRowCollapse={onRowCollapse}
                rowExpansionTemplate={rowExpansionTemplate}
                tableStyle={{ minWidth: "60rem" }}
            >
                {/* Expander column */}
                <Column expander={allowExpansion} style={{ width: "3rem" }} />

                {/* Dynamic columns */}
                {columns.map((col, idx) => (
                    <Column
                        key={idx}
                        field={col.field as string}
                        header={col.header}
                        body={col.body}
                        sortable={col.sortable}
                    />
                ))}

                {/* Action column */}
                <Column header="Action" body={actionBodyTemplate}></Column>
            </DataTable>
        </div>
    );
}
