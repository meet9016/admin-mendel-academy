"use client";
import React, { useState } from "react";
import {
    DataTable,
    DataTableExpandedRows,
    DataTableRowEvent,
} from "primereact/datatable";
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
    headerNameMap?: Record<string, string>;
}

export default function PrimeReactTreeTable<
    T extends { id: number | string; children?: Record<string, any>[] }
>({
    data,
    loading,
    columns,
    totalRecords = 0,
    rows = 10,
    onEdit,
    onDelete,
    headerNameMap = {},
}: PrimeReactTreeTableProps<T>) {
    const [expandedRows, setExpandedRows] =
        useState<DataTableExpandedRows | null>(null);

    // ALLOW MULTIPLE EXPANSIONS
    const onRowExpand = (event: DataTableRowEvent) => {
        const id = event.data.id;
        setExpandedRows((prev) => ({
            ...(prev || {}),
            [id]: true,
        }));
    };

    // REMOVE ONLY THAT ROW WHEN COLLAPSED
    const onRowCollapse = (event: DataTableRowEvent) => {
        const id = event.data.id;
        setExpandedRows((prev) => {
            const updated = { ...(prev || {}) };
            delete updated[id];
            return updated;
        });
    };

    // Allow expansion only if children exist
    const allowExpansion = (rowData: T) =>
        Array.isArray(rowData.children) && rowData.children.length > 0;

    // CHILD ROW TABLE
    const rowExpansionTemplate = (data: T) => {
        if (!data.children?.length) {
            return (
                <div className="p-3 text-gray-500">
                    No additional details available.
                </div>
            );
        }

        const firstChild = data.children[0];

        return (
            <div className="p-3">
                <h5 className="font-semibold mb-3">Additional Information</h5>

                <DataTable value={data.children} dataKey="session_title" key={data?.id}>
                    {Object.keys(firstChild).map((key, idx) => (
                        <Column
                            key={idx}
                            field={key}
                            header={headerNameMap[key] || key.toUpperCase()}
                        />
                    ))}
                </DataTable>
            </div>
        );
    };

    const actionBodyTemplate = (rowData: T) => (
        <div className="flex gap-3">
            <Button
                icon={<GoPencil size={16} />}
                rounded
                outlined
                severity="success"
                onClick={() => onEdit?.(rowData)}
                className="p-0"
                style={{ width: "2rem", height: "2rem" }}
            />
            <Button
                icon={<RiDeleteBin5Line size={16} />}
                rounded
                outlined
                severity="danger"
                onClick={() => onDelete?.(rowData)}
                className="p-0"
                style={{ width: "2rem", height: "2rem" }}
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
                expandedRows={expandedRows || {}}
                onRowExpand={onRowExpand}
                onRowCollapse={onRowCollapse}
                rowExpansionTemplate={rowExpansionTemplate}
            >
                <Column expander={allowExpansion} style={{ width: "3rem" }} />

                {columns.map((col, idx) => (
                    <Column
                        key={idx}
                        field={col.field as string}
                        header={col.header}
                        body={col.body}
                        sortable={col.sortable}
                    />
                ))}

                <Column header="Action" body={actionBodyTemplate} />
            </DataTable>
        </div>
    );
}
