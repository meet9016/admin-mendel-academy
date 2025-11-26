import React from "react";
import { Skeleton } from "primereact/skeleton";

type Props = {
    count?: number;
    columns?: string[];   
};

const TableSkeleton = ({ count = 10, columns = [] }: Props) => {
    return (
        <div className="card p-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center py-2 border-b">

                    {/* Fixed left icon */}
                    <Skeleton size="1.5rem" className="mr-3" />

                    {/* Dynamic columns → based on widths array */}
                    {columns.map((colWidth, index) => (
                        <Skeleton
                            key={index}
                            width={colWidth}
                            height="2.2rem"
                            className="mr-4"
                        />
                    ))}

                    {/* Actions */}
                    <Skeleton shape="circle" size="2rem" className="mr-2" />
                    <Skeleton shape="circle" size="2rem" />
                </div>
            ))}
        </div>
    );
};

export default TableSkeleton;
