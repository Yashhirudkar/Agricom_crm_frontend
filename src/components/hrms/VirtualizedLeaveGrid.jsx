"use client";

/**
 * VirtualizedLeaveGrid
 *
 * Row-based virtualized grid for leave request cards.
 * Uses @tanstack/react-virtual v3 (already installed).
 *
 * Layout:
 *   >= 1024px  →  3 columns
 *   >= 640px   →  2 columns
 *   <  640px   →  1 column
 *
 * Virtualization strategy:
 *   - Group items into rows (e.g. 9 items at 3 cols → 3 virtual rows)
 *   - Virtualizer operates on ROWS, not individual cards
 *   - estimateSize = 260px; measureElement for real heights
 *   - overscan = 3 rows
 *   - Prefetch trigger: when last 7 rows approach → fetchNextPage
 *   - NO window.scroll listeners; uses virtualizer.range to detect
 *
 * Deep-link: if requestId is given and that card is not yet loaded,
 * the parent fetches via GET /leave-requests/:id and opens a modal.
 *
 * This file contains NO business logic — all data flows in as props.
 */

import { useEffect, useRef, useCallback, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import LeaveRequestCard from "@/components/hrms/LeaveRequestCard";
import { Loader2, RefreshCw, CheckCircle2 } from "lucide-react";

// ------------------------------------------------------------------ //
//  Column count detection via ResizeObserver on the grid container
// ------------------------------------------------------------------ //

function getColumnCount(width) {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

// ------------------------------------------------------------------ //
//  Row skeleton for loading state
// ------------------------------------------------------------------ //

function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs animate-pulse flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-2 bg-gray-100 rounded w-1/4" />
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded w-3/4" />
      <div className="h-16 bg-gray-100 rounded-xl" />
      <div className="h-2 bg-gray-100 rounded w-full" />
      <div className="h-2 bg-gray-100 rounded w-5/6" />
    </div>
  );
}

// ------------------------------------------------------------------ //
//  Main component
// ------------------------------------------------------------------ //

export default function VirtualizedLeaveGrid({
  items,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  isError,
  fetchNextPage,
  // Card interaction props (passed through to LeaveRequestCard)
  isActiveTabPending,
  loadingId,
  highlightedId,
  cardRefs,
  onApprove,
  onRejectClick,
}) {
  const containerRef = useRef(null);
  // Track container width for responsive column count
  const containerWidthRef = useRef(0);
  const colsRef = useRef(3);

  // ---- Measure container width via ResizeObserver ----
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        containerWidthRef.current = w;
        colsRef.current = getColumnCount(w);
      }
    });
    ro.observe(el);

    // Initial measurement
    containerWidthRef.current = el.getBoundingClientRect().width;
    colsRef.current = getColumnCount(containerWidthRef.current);

    return () => ro.disconnect();
  }, []);

  // ---- Group flat items into rows ----
  const cols = colsRef.current;
  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < items.length; i += cols) {
      result.push(items.slice(i, i + cols));
    }
    return result;
  }, [items, cols]);

  // ---- Virtualizer setup ----
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 280, // reasonable estimate for mixed-height cards
    overscan: 3,
    measureElement:
      typeof window !== "undefined" &&
      "ResizeObserver" in window
        ? (el) => el.getBoundingClientRect().height
        : undefined,
  });

  // ---- Prefetch: trigger when approaching end of loaded rows ----
  // Using virtualizer range (not IntersectionObserver on a sentinel).
  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    if (!virtualItems.length || !hasNextPage || isFetchingNextPage) return;
    const lastVirtualItem = virtualItems[virtualItems.length - 1];
    // When the last 7 rows of loaded data are approaching, fetch next page
    if (lastVirtualItem.index >= rows.length - 7) {
      fetchNextPage();
    }
  }, [virtualItems, rows.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ---- Empty state ----
  if (!isLoading && items.length === 0 && !isFetchingNextPage) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
        <CheckCircle2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
        <h2 className="text-sm font-bold text-gray-700 mb-1">All Caught Up!</h2>
        <p className="text-xs text-gray-500">
          There are no {isActiveTabPending ? "pending leave requests" : "past approvals"} to show.
        </p>
      </div>
    );
  }

  // ---- Initial loading state (skeleton grid) ----
  if (isLoading && items.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const totalHeight = virtualizer.getTotalSize();

  return (
    <div>
      {/* Scrolling container — the virtualizer measures this */}
      <div
        ref={containerRef}
        // Max height so the page doesn't grow infinitely;
        // full window height minus header/tabs approximately.
        style={{ height: "calc(100vh - 280px)", overflowY: "auto" }}
        className="pr-1" // small right padding to avoid scrollbar overlap
      >
        {/* Total-height spacer so the scrollbar is correctly sized */}
        <div style={{ height: totalHeight, position: "relative" }}>
          {virtualItems.map((virtualRow) => {
            const rowItems = rows[virtualRow.index];
            if (!rowItems) return null;

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: virtualRow.start,
                  left: 0,
                  right: 0,
                  // Padding ensures gap between rows
                  paddingBottom: 24,
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rowItems.map((leave) => (
                    <div
                      key={leave.id}
                      ref={(el) => {
                        if (el && cardRefs?.current) {
                          cardRefs.current[leave.id] = el;
                        }
                      }}
                    >
                      <LeaveRequestCard
                        leave={leave}
                        isActiveTabPending={isActiveTabPending}
                        loadingId={loadingId}
                        highlightedId={highlightedId}
                        onApprove={onApprove}
                        onRejectClick={onRejectClick}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- Next-page loading indicator ---- */}
      {isFetchingNextPage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {Array.from({ length: cols }).map((_, i) => (
            <CardSkeleton key={`skeleton-next-${i}`} />
          ))}
        </div>
      )}

      {/* ---- Error loading next page with retry ---- */}
      {isError && items.length > 0 && (
        <div className="flex items-center justify-center gap-3 py-6 mt-2">
          <p className="text-xs text-gray-500">Unable to load more requests</p>
          <button
            onClick={() => fetchNextPage()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      )}

      {/* ---- End of list indicator ---- */}
      {!hasNextPage && !isLoading && !isFetchingNextPage && items.length > 0 && (
        <p className="text-center text-[11px] text-gray-400 py-6 font-medium">
          — All requests loaded —
        </p>
      )}
    </div>
  );
}
