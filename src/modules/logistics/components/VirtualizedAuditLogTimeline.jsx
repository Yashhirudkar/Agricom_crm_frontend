"use client";
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Loader2, User, Clock, FileText, CheckCircle2, Sparkles, RefreshCcw } from "lucide-react";

const ACTION_ICONS = {
  QUOTE_ADDED: FileText,
  QUOTE_EDITED: RefreshCcw,
  STATUS_CHANGED: CheckCircle2,
  DETAILS_UPDATED: Sparkles,
};

const ACTION_COLORS = {
  QUOTE_ADDED: "text-blue-600 bg-blue-50 border-blue-200",
  QUOTE_EDITED: "text-amber-600 bg-amber-50 border-amber-200",
  STATUS_CHANGED: "text-emerald-600 bg-emerald-50 border-emerald-200",
  DETAILS_UPDATED: "text-purple-600 bg-purple-50 border-purple-200",
};

const PAGE_SIZE = 5;
const ITEM_HEIGHT = 92; // estimated card height + margin in px
const OVERSCAN = 2; // buffer items above/below viewport

export default function VirtualizedAuditLogTimeline({
  activities = [],
  isLoading = false,
}) {
  const [visibleLimit, setVisibleLimit] = useState(PAGE_SIZE);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  // Reset pagination when activities list changes
  useEffect(() => {
    setVisibleLimit(PAGE_SIZE);
    setScrollTop(0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [activities]);

  // Current active slice based on infinite scroll pagination (shows 5, 10, 15...)
  const paginatedActivities = useMemo(() => {
    return activities.slice(0, visibleLimit);
  }, [activities, visibleLimit]);

  const hasMore = visibleLimit < activities.length;

  // Infinite Scroll Trigger handler
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setScrollTop(scrollTop);

    // Near bottom trigger (within 60px of bottom)
    if (scrollHeight - (scrollTop + clientHeight) < 60 && !isFetchingMore && visibleLimit < activities.length) {
      setIsFetchingMore(true);
      setTimeout(() => {
        setVisibleLimit((prev) => Math.min(prev + PAGE_SIZE, activities.length));
        setIsFetchingMore(false);
      }, 250);
    }
  }, [isFetchingMore, visibleLimit, activities.length]);

  // Virtualization Window Calculation
  const totalCount = paginatedActivities.length;
  const containerHeight = 420; // fixed max height of scroll viewport in px

  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);
  const endIndex = Math.min(totalCount, Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + OVERSCAN);

  const visibleItems = useMemo(() => {
    return paginatedActivities.slice(startIndex, endIndex).map((act, index) => ({
      act,
      actualIndex: startIndex + index,
    }));
  }, [paginatedActivities, startIndex, endIndex]);

  const paddingTop = startIndex * ITEM_HEIGHT;
  const paddingBottom = Math.max(0, (totalCount - endIndex) * ITEM_HEIGHT);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <span className="text-xs font-bold text-slate-500">Loading operational audit logs...</span>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-2">
        <Clock className="h-8 w-8 text-slate-300 mx-auto" />
        <p className="text-xs font-bold">No operational audit logs recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header Badge & Stats */}
      <div className="flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-600 bg-slate-100/70 rounded-xl border border-slate-200/60">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-800 font-extrabold">Operational Audit Logs</span>
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md font-mono text-[10px] font-extrabold">
            {paginatedActivities.length} of {activities.length} Loaded
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Virtualized 5-Item Pagination</span>
      </div>

      {/* Scrollable Virtualized Timeline Viewport */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ height: `${containerHeight}px` }}
        className="overflow-y-auto pr-2 relative border-l-2 border-slate-200 ml-4 pl-6 scroll-smooth"
      >
        <div style={{ paddingTop: `${paddingTop}px`, paddingBottom: `${paddingBottom}px` }}>
          {visibleItems.map(({ act, actualIndex }) => {
            const IconComponent = ACTION_ICONS[act.action] || Clock;
            const iconColorClass = ACTION_COLORS[act.action] || "text-slate-600 bg-slate-50 border-slate-200";

            return (
              <div
                key={act.id || actualIndex}
                style={{ minHeight: `${ITEM_HEIGHT - 12}px` }}
                className="relative group mb-3 transition-all"
              >
                {/* Node Icon */}
                <div
                  className={`absolute -left-[35px] top-1 w-6 h-6 rounded-full border ${iconColorClass} flex items-center justify-center shadow-xs z-10`}
                >
                  <IconComponent className="h-3.5 w-3.5" />
                </div>

                {/* Audit Card */}
                <div className="bg-slate-50 hover:bg-white p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-200 hover:shadow-md transition-all space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-extrabold text-slate-900 text-xs truncate max-w-[280px]">
                      {act.description}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 shrink-0">
                      {new Date(act.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3 text-slate-400" />
                      {act.performedByName || "System"}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-slate-600 uppercase bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                      {act.action}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Infinite Scroll Footer Indicator */}
        {isFetchingMore && (
          <div className="py-2.5 text-center flex items-center justify-center gap-2 text-xs font-bold text-blue-600 bg-blue-50/60 rounded-xl border border-blue-100 my-2 animate-in fade-in duration-200">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Loading next 5 operational logs...</span>
          </div>
        )}

        {!hasMore && activities.length > 5 && (
          <div className="py-2 text-center text-[10px] font-bold text-slate-400 border-t border-slate-100 my-2">
            ✓ All {activities.length} operational audit logs loaded
          </div>
        )}
      </div>
    </div>
  );
}
