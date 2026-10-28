import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Clock, Loader2 } from "lucide-react";
import { enquiriesApi } from "../services/enquiriesApi";

// Client-side cache per enquiry ID across the page session
const priceHistoryCache = new Map();

/**
 * Format timestamp into:
 * Date: 27 Oct 2026
 * Time: 03:10 PM
 */
function formatHistoryDateTime(dateStr) {
  if (!dateStr) return { date: "—", time: "" };
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { date: "—", time: "" };

    const date = d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return { date, time };
  } catch {
    return { date: "—", time: "" };
  }
}

export default function PriceHistoryTooltip({
  enquiryId,
  type = "BID", // 'BID' or 'OFFER'
  currency = "USD",
  children,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, placement: "bottom" });
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const showTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const isBid = type === "BID";
  const title = isBid ? "💰 Bid History" : "🤝 Offer History";
  const emptyMessage = isBid ? "No previous bid history." : "No previous offer history.";

  // Calculate coordinates relative to viewport
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = 280;
    const popoverMaxHeight = 320;

    // Check space below vs above
    const spaceBelow = window.innerHeight - rect.bottom;
    const placement = spaceBelow >= popoverMaxHeight || spaceBelow >= 200 ? "bottom" : "top";

    const top = placement === "bottom" ? rect.bottom + 6 : Math.max(10, rect.top - popoverMaxHeight - 6);

    // Center horizontally on trigger, clamped within viewport bounds
    let left = rect.left + rect.width / 2 - popoverWidth / 2;
    left = Math.max(12, Math.min(window.innerWidth - popoverWidth - 12, left));

    setCoords({ top, left, placement });
  }, []);

  // Fetch or load from cache
  const loadHistory = useCallback(async () => {
    if (!enquiryId) return;

    if (priceHistoryCache.has(enquiryId)) {
      setData(priceHistoryCache.get(enquiryId));
      return;
    }

    setIsLoading(true);
    setHasError(false);
    try {
      const res = await enquiriesApi.getPriceHistory(enquiryId);
      const historyResult = res?.data ?? res ?? { bidHistory: [], offerHistory: [] };
      priceHistoryCache.set(enquiryId, historyResult);
      setData(historyResult);
    } catch (err) {
      console.error("Failed to fetch price history", err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [enquiryId]);

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    // Delay: Show after 150ms
    showTimeoutRef.current = setTimeout(() => {
      updatePosition();
      setIsOpen(true);
      loadHistory();
    }, 150);
  };

  const handleMouseLeave = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    // Delay: Hide after 200ms
    hideTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handlePopoverMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handlePopoverMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  // Reposition on scroll or resize while open
  useEffect(() => {
    if (!isOpen) return;

    const handleWindowEvents = () => {
      updatePosition();
    };

    window.addEventListener("scroll", handleWindowEvents, true);
    window.addEventListener("resize", handleWindowEvents);
    return () => {
      window.removeEventListener("scroll", handleWindowEvents, true);
      window.removeEventListener("resize", handleWindowEvents);
    };
  }, [isOpen, updatePosition]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const historyList = isBid ? data?.bidHistory || [] : data?.offerHistory || [];

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block cursor-pointer transition-colors hover:text-[#007aff]"
      >
        {children}
      </span>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={popoverRef}
            onMouseEnter={handlePopoverMouseEnter}
            onMouseLeave={handlePopoverMouseLeave}
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 9999,
              width: "280px",
            }}
            className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 select-none text-left"
          >
            {/* Popover Header */}
            <div className="px-4 py-2.5 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800 tracking-wide">
                {title}
              </span>
              {historyList.length > 0 && (
                <span className="text-[10px] font-semibold text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded-full">
                  {historyList.length} {historyList.length === 1 ? "entry" : "entries"}
                </span>
              )}
            </div>

            {/* Popover Body */}
            <div className="p-3 max-h-[300px] overflow-y-auto custom-scrollbar">
              {isLoading && !data ? (
                <div className="py-6 flex flex-col items-center justify-center gap-2 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin text-[#007aff]" />
                  <span className="text-[11px] font-medium">Loading history...</span>
                </div>
              ) : hasError ? (
                <div className="py-5 text-center text-xs text-red-500">
                  Failed to load history
                </div>
              ) : historyList.length === 0 ? (
                <div className="py-6 px-4 text-center">
                  <p className="text-xs text-gray-400 font-medium">{emptyMessage}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {historyList.map((item, idx) => {
                    const { date, time } = formatHistoryDateTime(item.createdAt);
                    const formattedAmount =
                      item.amount != null
                        ? Math.round(Number(item.amount)).toLocaleString("en-US") +
                          " " +
                          (item.currency || currency || "USD")
                        : "—";
                    const isLatest = idx === 0;

                    return (
                      <div
                        key={idx}
                        className={`py-2 px-1 transition-colors ${
                          isLatest ? "bg-blue-50/30 rounded-lg" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold tabular-nums ${
                              isLatest ? "text-blue-700 font-extrabold" : "text-gray-900"
                            }`}
                          >
                            {formattedAmount}
                          </span>
                          {isLatest && (
                            <span className="text-[9px] font-bold text-blue-600 bg-blue-100/70 px-1.5 py-0.2 rounded uppercase">
                              Latest
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[10.5px] text-gray-400 mt-0.5">
                          <span>{date}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
