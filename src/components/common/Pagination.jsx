import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  onLimitChange,
  itemName = "items",
  limitOptions = [10, 20, 50, 100],
}) {
  const total = typeof totalItems === "number" ? totalItems : null;
  const page = Math.max(1, Number(currentPage) || 1);
  const pages = Math.max(1, Number(totalPages) || 1);
  const limit = Number(itemsPerPage) || 10;

  // Calculate range text
  let rangeText = "";
  if (total !== null) {
    if (total === 0) {
      rangeText = `0 ${itemName}`;
    } else {
      const start = (page - 1) * limit + 1;
      const end = Math.min(page * limit, total);
      rangeText = `Showing ${start}–${end} of ${total} ${itemName}`;
    }
  } else {
    rangeText = `Page ${page} of ${pages}`;
  }

  // Generate visible page numbers algorithm
  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 font-medium select-none">
      {/* Left side: Range text & Items per page */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-gray-600 font-semibold">{rangeText}</span>

        {onLimitChange && (
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <span>Show:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] cursor-pointer"
            >
              {limitOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / page
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right side: Pagination buttons */}
      <div className="flex items-center gap-1 flex-wrap">
        {/* First page button */}
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
          className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed"
          title="First Page"
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </button>

        {/* Prev button */}
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-1 font-semibold text-[11px]"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Prev</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-1">
          {pageNumbers.map((p, idx) => {
            if (p === "...") {
              return (
                <span key={`dots-${idx}`} className="px-1.5 text-gray-400 font-bold">
                  ...
                </span>
              );
            }
            const isCurrent = p === page;
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`min-w-[28px] h-7 px-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                  isCurrent
                    ? "bg-[#007aff] text-white shadow-xs"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          disabled={page >= pages}
          onClick={() => onPageChange(Math.min(page + 1, pages))}
          className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-1 font-semibold text-[11px]"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

        {/* Last page button */}
        <button
          disabled={page >= pages}
          onClick={() => onPageChange(pages)}
          className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed"
          title="Last Page"
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

