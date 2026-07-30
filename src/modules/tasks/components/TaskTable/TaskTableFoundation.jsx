import React, { useRef, useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useTaskStore } from "../../store/taskStore";

// Dynamic sticky column positioning overrides
const getStickyStyles = (columnId, isHeader = false) => {
  if (columnId === "select") {
    return {
      position: "sticky",
      left: 0,
      zIndex: isHeader ? 20 : 2,
    };
  }
  if (columnId === "taskCode") {
    return {
      position: "sticky",
      left: "40px",
      zIndex: isHeader ? 20 : 2,
    };
  }
  return {};
};

const getStickyClassName = (columnId) => {
  if (columnId === "select" || columnId === "taskCode") {
    return "shadow-[2px_0_5px_rgba(0,0,0,0.03)] bg-white group-hover:bg-[#f8f9fa] transition-colors duration-150";
  }
  return "";
};

// Highly optimized memoized row component
const TaskTableRow = React.memo(({ row, onRowClick, virtualRow, visibleCells, isFocused }) => {
  return (
    <div
      onClick={() => onRowClick && onRowClick(row)}
      role="row"
      aria-selected={row.getIsSelected()}
      className={`absolute w-full flex items-center hover:bg-[#f8f9fa] cursor-pointer group border-b border-gray-100 bg-white ${isFocused ? "ring-1 ring-blue-400 bg-blue-50/10" : ""
        }`}
      style={{
        top: 0,
        left: 0,
        height: `${virtualRow.size}px`,
        transform: `translateY(${virtualRow.start}px)`,
        contain: "layout paint", // CSS Containment
      }}
    >
      {visibleCells.map((cell) => {
        const stickyStyles = getStickyStyles(cell.column.id);
        const stickyClassName = getStickyClassName(cell.column.id);
        return (
          <div
            key={cell.id}
            role="gridcell"
            className={`px-3 flex items-center h-full border-r border-gray-100 last:border-r-0 flex-shrink-0 overflow-hidden ${stickyClassName}`}
            style={{
              width: cell.column.getSize(),
              ...stickyStyles
            }}
            onClick={cell.column.id === 'select' ? (e) => e.stopPropagation() : undefined}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        );
      })}
    </div>
  );
}, (prevProps, nextProps) => {
  // Minimize re-renders: only update if index position, sizing, data, selection, or focus state changes
  const prevSizes = prevProps.visibleCells.map(c => c.column.getSize());
  const nextSizes = nextProps.visibleCells.map(c => c.column.getSize());
  const sizesEqual = prevSizes.every((sz, idx) => sz === nextSizes[idx]);

  return (
    sizesEqual &&
    prevProps.isFocused === nextProps.isFocused &&
    prevProps.virtualRow.start === nextProps.virtualRow.start &&
    prevProps.virtualRow.size === nextProps.virtualRow.size &&
    prevProps.row.original === nextProps.row.original &&
    prevProps.row.getIsSelected() === nextProps.row.getIsSelected()
  );
});

// React Error Boundary to isolate virtual container crashes
class TableBodyErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Virtualized body crash:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full py-16 text-center text-[13px] text-red-500 bg-white">
          Something went wrong rendering the table body. Please try refreshing or clear your filters.
        </div>
      );
    }
    return this.props.children;
  }
}

export function TaskTableFoundation({
  data,
  columns,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  isError,
  refetch,
  columnVisibility,
  onColumnVisibilityChange,
  onRowClick,
}) {
  const tableContainerRef = useRef(null);
  const sentinelRef = useRef(null);
  const [focusedRowIndex, setFocusedRowIndex] = useState(-1);

  // Zustand Scroll Restoration State
  const { scrollTop, setScrollState } = useTaskStore();

  // Column Width Layout v2 Storage state
  const [columnSizing, setColumnSizing] = useState({});

  useEffect(() => {
    const savedSizing = localStorage.getItem("task-table-layout-v2");
    if (savedSizing) {
      try {
        setColumnSizing(JSON.parse(savedSizing));
      } catch (e) { }
    }
  }, []);

  const handleColumnSizingChange = (updaterOrValue) => {
    setColumnSizing((old) => {
      const newVal = typeof updaterOrValue === "function" ? updaterOrValue(old) : updaterOrValue;
      localStorage.setItem("task-table-layout-v2", JSON.stringify(newVal));
      return newVal;
    });
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      columnSizing,
    },
    columnResizeMode: 'onEnd', // resize updates on end boundary
    onColumnSizingChange: handleColumnSizingChange,
    onColumnVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  // Calculate virtualizer rows. Extends count during fetching to house skeletons
  const extraRowCount = isFetchingNextPage ? 5 : (isError ? 1 : (hasNextPage ? 0 : 1));
  const totalRowsCount = rows.length + extraRowCount;

  const rowVirtualizer = useVirtualizer({
    count: totalRowsCount,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 40,
    overscan: 12,
    getItemKey: (index) => {
      if (index >= rows.length) return `extra-row-${index}`;
      return rows[index]?.id || index;
    }
  });

  // 1. IntersectionObserver Sentinel setup at the bottom of the table
  useEffect(() => {
    if (!sentinelRef.current || !tableContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage && !isError) {
          fetchNextPage();
        }
      },
      {
        root: tableContainerRef.current,
        rootMargin: "200px", // prefetch 200px before reaching the end
      }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isError]);

  // 2. Scroll Anchoring (Zero-jump on prepend)
  const prevFirstRowIdRef = useRef(null);
  const firstRowId = data[0]?.id;

  useEffect(() => {
    if (prevFirstRowIdRef.current !== null && firstRowId !== prevFirstRowIdRef.current) {
      const container = tableContainerRef.current;
      if (container && container.scrollTop > 10) {
        const newIndex = data.findIndex(item => String(item.id) === String(prevFirstRowIdRef.current));
        if (newIndex > 0) {
          container.scrollTop += newIndex * 40;
        }
      }
    }
    prevFirstRowIdRef.current = firstRowId;
  }, [data, firstRowId]);

  // 3. Restore Scroll position on Mount
  useEffect(() => {
    if (scrollTop > 0 && tableContainerRef.current) {
      tableContainerRef.current.scrollTop = scrollTop;
    }
  }, []);

  const handleScroll = (e) => {
    const targetScrollTop = e.currentTarget.scrollTop;
    setScrollState(targetScrollTop);
  };

  // 4. Keyboard Navigation Handler
  const handleKeyDown = (e) => {
    if (data.length === 0) return;

    let nextIndex = focusedRowIndex;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        nextIndex = Math.min(focusedRowIndex + 1, data.length - 1);
        if (focusedRowIndex === -1) nextIndex = 0;
        break;
      case "ArrowUp":
        e.preventDefault();
        nextIndex = Math.max(focusedRowIndex - 1, 0);
        break;
      case "PageDown":
        e.preventDefault();
        nextIndex = Math.min(focusedRowIndex + 12, data.length - 1);
        break;
      case "PageUp":
        e.preventDefault();
        nextIndex = Math.max(focusedRowIndex - 12, 0);
        break;
      case "Home":
        e.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        e.preventDefault();
        nextIndex = data.length - 1;
        break;
      case " ":
        e.preventDefault();
        if (focusedRowIndex >= 0 && focusedRowIndex < data.length) {
          const focusedRow = data[focusedRowIndex];
          const isSelectAllActive = useTaskStore.getState().isSelectAllActive;
          const selectedRowIds = useTaskStore.getState().selectedRowIds;
          const setSelectedRowIds = useTaskStore.getState().setSelectedRowIds;

          setSelectedRowIds(prev => {
            const next = new Set(prev);
            if (isSelectAllActive) {
              if (next.has(focusedRow.id)) next.delete(focusedRow.id);
              else next.add(focusedRow.id);
            } else {
              if (next.has(focusedRow.id)) next.delete(focusedRow.id);
              else next.add(focusedRow.id);
            }
            return next;
          });
        }
        break;
      default:
        return;
    }

    if (nextIndex !== focusedRowIndex) {
      setFocusedRowIndex(nextIndex);
      rowVirtualizer.scrollToIndex(nextIndex, { align: "auto" });
    }
  };

  // Development performance logging
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && data.length > 0) {
      const start = performance.now();
      return () => {
        const renderTime = performance.now() - start;
        console.log(`[TaskTable Render] Size: ${data.length} tasks, Render cycles duration: ${renderTime.toFixed(2)}ms`);
      };
    }
  });

  return (
    <div className="flex flex-col w-full h-full bg-white border border-gray-200">
      {/* Accessibility live announcers */}
      <div className="sr-only" aria-live="polite" id="task-live-announcer">
        {isFetchingNextPage ? "Loading more tasks..." : ""}
        {data.length > 0 ? `${data.length} tasks loaded.` : "No tasks loaded."}
      </div>

      <div
        ref={tableContainerRef}
        role="grid"
        aria-rowcount={data.length}
        aria-busy={isLoading || isFetchingNextPage}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        className="flex-1 overflow-auto custom-scrollbar outline-none focus:ring-1 focus:ring-blue-300"
      >
        <div className="min-w-max relative" style={{ height: `${rowVirtualizer.getTotalSize() + 50}px` }}>
          {/* Header row with sticky positioning */}
          <div className="bg-white sticky top-0 z-10 border-b border-gray-200 flex w-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <div key={headerGroup.id} className="flex w-full">
                {headerGroup.headers.map((header) => {
                  const stickyStyles = getStickyStyles(header.id, true);
                  const stickyClassName = getStickyClassName(header.id);
                  return (
                    <div
                      key={header.id}
                      className={`px-3 py-2.5 text-left bg-white border-r border-gray-100 last:border-r-0 flex-shrink-0 cursor-pointer hover:bg-gray-50 transition-colors group relative ${stickyClassName}`}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{
                        width: header.column.getSize(),
                        ...stickyStyles
                      }}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>

                      {/* Column resizing handle */}
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`resizer absolute right-0 top-0 h-full w-[4px] cursor-col-resize user-select-none touch-action-none transition-colors ${header.column.getIsResizing() ? "bg-blue-400 w-[6px]" : "bg-transparent hover:bg-gray-200"
                            }`}
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Virtualized Body inside isolated Error Boundary */}
          <TableBodyErrorBoundary>
            <div className="bg-white relative">
              {isLoading && rows.length === 0 ? (
                <div className="w-full py-10 text-center text-[13px] text-gray-500">
                  Loading tasks...
                </div>
              ) : rows.length === 0 && !isFetchingNextPage ? (
                <div className="w-full py-10 text-center text-[13px] text-gray-500">
                  No tasks found.
                </div>
              ) : (
                rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const isLoaderRow = virtualRow.index >= rows.length;

                  if (isLoaderRow) {
                    const loaderIndex = virtualRow.index - rows.length;

                    if (isError) {
                      return (
                        <div
                          key={`error-row`}
                          className="absolute w-full flex items-center justify-center py-2 text-[13px] border-b border-gray-100 bg-white"
                          style={{
                            top: 0,
                            left: 0,
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)`,
                          }}
                        >
                          <span className="text-red-500 mr-2">Failed to load next page.</span>
                          <button
                            onClick={() => refetch()}
                            className="px-2.5 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-gray-700 cursor-pointer"
                          >
                            Retry
                          </button>
                        </div>
                      );
                    }

                    if (isFetchingNextPage) {
                      return (
                        <div
                          key={`skeleton-${loaderIndex}`}
                          className="absolute w-full flex items-center border-b border-gray-100 bg-white animate-pulse"
                          style={{
                            top: 0,
                            left: 0,
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)`,
                          }}
                        >
                          {columns.map((col, idx) => {
                            const stickyStyles = getStickyStyles(col.id || col.accessorKey);
                            const stickyClassName = getStickyClassName(col.id || col.accessorKey);
                            return (
                              <div
                                key={`skeleton-cell-${idx}`}
                                className={`px-3 flex items-center h-full border-r border-gray-100 last:border-r-0 flex-shrink-0 ${stickyClassName}`}
                                style={{
                                  width: col.size || 100,
                                  ...stickyStyles
                                }}
                              >
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                              </div>
                            );
                          })}
                        </div>
                      );
                    }

                    // End of List Announcement Row
                    return (
                      <div
                        key={`end-of-list`}
                        className="absolute w-full flex items-center justify-center text-[13px] text-gray-400 border-b border-gray-100 bg-white"
                        style={{
                          top: 0,
                          left: 0,
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        You're all caught up
                      </div>
                    );
                  }

                  const row = rows[virtualRow.index];
                  const isFocused = virtualRow.index === focusedRowIndex;

                  return (
                    <TaskTableRow
                      key={row.id}
                      row={row}
                      onRowClick={onRowClick}
                      virtualRow={virtualRow}
                      visibleCells={row.getVisibleCells()}
                      isFocused={isFocused}
                    />
                  );
                })
              )}
            </div>
          </TableBodyErrorBoundary>

          {/* Absolute Observer Sentinel placed at the bottom */}
          <div
            ref={sentinelRef}
            style={{
              position: 'absolute',
              top: `${rowVirtualizer.getTotalSize()}px`,
              left: 0,
              width: '100%',
              height: '1px',
              pointerEvents: 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
}