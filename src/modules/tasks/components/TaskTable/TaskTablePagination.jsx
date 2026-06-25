import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function TaskTablePagination({
  pagination,
  onPaginationChange,
  totalCount,
  rowsCount
}) {
  const { pageIndex, pageSize } = pagination;
  const pageCount = Math.ceil(totalCount / pageSize);

  const startRow = totalCount === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalCount);

  return (
    <div className="px-4 py-2 bg-white border-t border-gray-200 flex items-center justify-between shrink-0">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPaginationChange(p => ({ ...p, pageIndex: p.pageIndex - 1 }))}
          disabled={pageIndex === 0}
          className="px-3 py-1 border border-gray-200 text-[13px] rounded text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPaginationChange(p => ({ ...p, pageIndex: p.pageIndex + 1 }))}
          disabled={pageIndex >= pageCount - 1}
          className="ml-3 px-3 py-1 border border-gray-200 text-[13px] rounded text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-6 text-[13px] text-gray-500">
          <p>
            Showing <span className="text-gray-800">{startRow}</span> to <span className="text-gray-800">{endRow}</span> of{" "}
            <span className="text-gray-800">{totalCount}</span>
          </p>

          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPaginationChange({ pageIndex: 0, pageSize: Number(e.target.value) })}
              className="border-none bg-transparent text-gray-800 cursor-pointer focus:ring-0 py-0 pl-1 pr-4"
            >
              {[10, 20, 50, 100].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPaginationChange(p => ({ ...p, pageIndex: 0 }))}
            disabled={pageIndex === 0}
            className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => onPaginationChange(p => ({ ...p, pageIndex: p.pageIndex - 1 }))}
            disabled={pageIndex === 0}
            className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="px-2 text-[13px] text-gray-600">
            {pageIndex + 1} / {Math.max(1, pageCount)}
          </span>

          <button
            onClick={() => onPaginationChange(p => ({ ...p, pageIndex: p.pageIndex + 1 }))}
            disabled={pageIndex >= pageCount - 1}
            className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => onPaginationChange(p => ({ ...p, pageIndex: pageCount - 1 }))}
            disabled={pageIndex >= pageCount - 1}
            className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}