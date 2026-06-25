import React, { useRef } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import TaskTablePagination from "./TaskTablePagination";

export function TaskTableFoundation({
  data,
  columns,
  totalCount,
  isLoading,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  rowSelection,
  onRowSelectionChange,
  columnVisibility,
  onColumnVisibilityChange,
  onRowClick,
}) {
  const tableContainerRef = useRef(null);

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
      rowSelection,
      columnVisibility,
    },
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    onPaginationChange,
    onSortingChange,
    onRowSelectionChange,
    onColumnVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    getRowId: (row) => row.id,
  });

  const { rows } = table.getRowModel();

  // Zoho rows are compact
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 40, // Reduced to 40px for Zoho's dense data layout
    overscan: 15,
  });

  return (
    <div className="flex flex-col w-full h-full bg-white border border-gray-200">
      <div
        ref={tableContainerRef}
        className="flex-1 overflow-auto custom-scrollbar"
      >
        <div className="min-w-max">
          {/* Header row with vertical dividers matching Zoho */}
          <div className="bg-white sticky top-0 z-10 border-b border-gray-200 flex w-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <div key={headerGroup.id} className="flex w-full">
                {headerGroup.headers.map((header) => (
                  <div
                    key={header.id}
                    className="px-3 py-2.5 text-left bg-white border-r border-gray-100 last:border-r-0 flex-shrink-0 cursor-pointer hover:bg-gray-50 transition-colors group"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ width: header.column.getSize() }}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="bg-white relative" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
            {isLoading && rows.length === 0 ? (
              <div className="w-full py-10 text-center text-[13px] text-gray-500">
                Loading tasks...
              </div>
            ) : rows.length === 0 ? (
              <div className="w-full py-10 text-center text-[13px] text-gray-500">
                No tasks found.
              </div>
            ) : (
              rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <div
                    key={row.id}
                    onClick={() => onRowClick && onRowClick(row)}
                    className="absolute w-full flex items-center hover:bg-[#f8f9fa] cursor-pointer group border-b border-gray-100"
                    style={{
                      top: 0,
                      left: 0,
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {/* Data cells with vertical dividers */}
                    {row.getVisibleCells().map((cell) => (
                      <div
                        key={cell.id}
                        className="px-3 flex items-center h-full border-r border-gray-100 last:border-r-0 flex-shrink-0 overflow-hidden"
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <TaskTablePagination
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        totalCount={totalCount}
        rowsCount={rows.length}
      />
    </div>
  );
}