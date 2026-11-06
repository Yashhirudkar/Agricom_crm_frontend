"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Target,
  Lock,
  X,
  Sparkles,
  TrendingUp,
  PlusCircle,
} from "lucide-react";
import { useMonthlySalesTarget } from "@/hooks/useMonthlySalesTarget";
import SetMonthlyTargetModal from "./SetMonthlyTargetModal";
import ConfirmMonthlyTargetModal from "./ConfirmMonthlyTargetModal";

// ── Constants ────────────────────────────────────────────────────────────────
const LS_KEY = "sales_target_widget_y";
const EDGE_PADDING = 16;      // px from top / bottom viewport edge
const DRAG_THRESHOLD = 5;     // px of movement before we treat it as a drag (not a click)
const BUBBLE_HEIGHT = 44;

/** Clamp a Y value so the bubble always stays inside the visible viewport. */
function clampY(y, height = BUBBLE_HEIGHT) {
  const max = Math.max(EDGE_PADDING, window.innerHeight - height - EDGE_PADDING);
  return Math.min(max, Math.max(EDGE_PADDING, y));
}

/** Read saved Y from localStorage, or return the vertical-center default. */
function getInitialY() {
  if (typeof window === "undefined") return 0;
  const saved = localStorage.getItem(LS_KEY);
  if (saved !== null) {
    const parsed = parseFloat(saved);
    if (!Number.isNaN(parsed)) return clampY(parsed);
  }
  // Default: vertically centered
  return clampY(window.innerHeight / 2 - BUBBLE_HEIGHT / 2);
}

export default function SalesMonthlyTargetWidget() {
  const {
    isSales,
    stats,
    hasTarget,
    isLoading,
    setTarget,
    isSaving,
  } = useMonthlySalesTarget();

  // ── UI state ────────────────────────────────────────────────────────────────
  const [isExpanded, setIsExpanded]           = useState(false);
  const [isSetModalOpen, setIsSetModalOpen]   = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingTargetValue, setPendingTargetValue] = useState(null);
  const [hasAutoPrompted, setHasAutoPrompted] = useState(false);

  // ── Drag state (all in refs — zero re-render overhead during drag) ──────────
  const [bubbleY, setBubbleY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const posY = useRef(0);
  const dragStartY = useRef(0);
  const dragStartBubY = useRef(0);
  const hasDragged = useRef(false);
  const ignoreClick = useRef(false);
  const bubbleHeight = useRef(BUBBLE_HEIGHT);
  const widgetRef     = useRef(null);
  const bubbleRef     = useRef(null);
  const rafRef        = useRef(null);

  useEffect(() => {
    if (bubbleRef.current) {
      bubbleHeight.current = bubbleRef.current.getBoundingClientRect().height;
    }
    const y = getInitialY();
    const clamped = clampY(y, bubbleHeight.current);
    posY.current = clamped;
    setBubbleY(clamped);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (bubbleRef.current) {
        bubbleHeight.current = bubbleRef.current.getBoundingClientRect().height;
      }
      const clamped = clampY(posY.current, bubbleHeight.current);
      posY.current = clamped;
      setBubbleY(clamped);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onDragMove = useCallback((clientY) => {
    const delta = clientY - dragStartY.current;

    if (!hasDragged.current) {
      if (Math.abs(delta) < DRAG_THRESHOLD) return;
      hasDragged.current = true;
      setIsDragging(true);
    }

    const newY = clampY(dragStartBubY.current + delta, bubbleHeight.current);
    posY.current = newY;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setBubbleY(newY);
    });
  }, []);

  const onDragEnd = useCallback(() => {
    const didDrag = hasDragged.current;
    setIsDragging(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (didDrag) {
      localStorage.setItem(LS_KEY, String(posY.current));
      ignoreClick.current = true;
    }
  }, []);

  const onBubblePointerDown = useCallback((e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    dragStartY.current = e.clientY;
    dragStartBubY.current = posY.current;
    hasDragged.current = false;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, []);

  const onBubblePointerMove = useCallback((e) => {
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      onDragMove(e.clientY);
    }
  }, [onDragMove]);

  const onBubblePointerUp = useCallback((e) => {
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    onDragEnd();
  }, [onDragEnd]);

  const onBubbleClick = useCallback(() => {
    if (ignoreClick.current) {
      ignoreClick.current = false;
      return;
    }
    setIsExpanded((prev) => !prev);
  }, []);

  // ── Close expanded card on outside click ───────────────────────────────────
  useEffect(() => {
    if (!isExpanded) return;
    const handleOutside = (e) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleOutside);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [isExpanded]);

  // ── Auto-prompt for new month target ──────────────────────────────────────
  useEffect(() => {
    if (!isSales || isLoading) return;
    if (!hasTarget && !hasAutoPrompted) {
      const promptKey = `target_prompt_${stats?.month || ""}_${stats?.year || ""}`;
      const alreadyDismissed =
        typeof window !== "undefined" ? sessionStorage.getItem(promptKey) : null;
      if (!alreadyDismissed) {
        const timer = setTimeout(() => {
          setIsSetModalOpen(true);
          setHasAutoPrompted(true);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [isSales, isLoading, hasTarget, hasAutoPrompted, stats]);

  // Not a Sales user — render nothing
  if (!isSales) return null;

  // ── Business logic handlers ────────────────────────────────────────────────

  const handleProceedToConfirm = (val) => {
    setPendingTargetValue(val);
    setIsSetModalOpen(false);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!pendingTargetValue) return;
    try {
      await setTarget({
        targetMT: pendingTargetValue,
        month: stats?.month,
        year: stats?.year,
      });
      setIsConfirmModalOpen(false);
      setPendingTargetValue(null);
    } catch {
      // Error handled by mutation toast
    }
  };

  const handleDismissSetModal = () => {
    setIsSetModalOpen(false);
    const promptKey = `target_prompt_${stats?.month || ""}_${stats?.year || ""}`;
    sessionStorage.setItem(promptKey, "true");
  };

  // ── Derived display values ─────────────────────────────────────────────────

  const targetMT          = stats?.targetMT ?? 0;
  const completedMT       = stats?.completedMT ?? 0;
  const remainingMT       = stats?.remainingMT ?? 0;
  const progressPercentage = stats?.progressPercentage ?? 0;
  const isOverAchieved    = stats?.isOverAchieved ?? false;
  const monthName         = stats?.monthName || "Current Month";
  const year              = stats?.year || new Date().getFullYear();
  const barWidth          = Math.min(100, Math.max(0, progressPercentage));

  const accentBg       = isOverAchieved ? "bg-emerald-500"              : "bg-blue-600";
  const accentText     = isOverAchieved ? "text-emerald-600"            : "text-blue-600";
  const accentLight    = isOverAchieved ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600";
  const progressGrad   = isOverAchieved
    ? "bg-gradient-to-r from-emerald-500 to-teal-500"
    : "bg-gradient-to-r from-blue-500 to-indigo-600";

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/*
        Outer wrapper: fixed to right edge, top driven by drag Y.
        We use `top` (not `bottom`) so the value maps 1-to-1 with clientY math.
        `flex-col items-end` stacks the expanded card above the bubble.
      */}
      <div
        ref={widgetRef}
        className="fixed right-4 z-30 select-none print:hidden"
        style={{ top: bubbleY }}
      >
        {/* ── Expanded Detail Card (shown above bubble) ──────────────────── */}
        {isExpanded && (
          <div
            className="absolute right-0 w-[245px] bg-white/97 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden text-gray-800 animate-in slide-in-from-right-4 fade-in duration-200"
            style={{
              bottom: bubbleY < 220 ? undefined : "calc(100% + 8px)",
              top: bubbleY < 220 ? "calc(100% + 8px)" : undefined,
            }}
          >
            {/* Header */}
            <div className="px-3.5 pt-3 pb-2 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-lg ${accentLight}`}>
                  <Target className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-500 leading-none">
                    THIS MONTH TARGET
                  </h4>
                  <span className="text-[11px] font-bold text-gray-700">
                    {monthName} {year}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {hasTarget && (
                  <span
                    title="Target is locked permanently for this month"
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold"
                  >
                    <Lock className="h-2.5 w-2.5" />
                    Locked
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  title="Close"
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-3.5 space-y-3">
              {hasTarget ? (
                <>
                  {/* Target MT + Status badge */}
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-gray-900 tracking-tight">
                        {targetMT}
                      </span>
                      <span className="text-xs font-bold text-gray-500 ml-1">MT</span>
                    </div>

                    {isOverAchieved ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                        <Sparkles className="h-3 w-3 text-emerald-500" />
                        Over-achieved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                        <TrendingUp className="h-3 w-3 text-blue-500" />
                        In Progress
                      </span>
                    )}
                  </div>

                  {/* Completed & Remaining */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                        Completed
                      </span>
                      <p className="text-sm font-black text-gray-900 mt-0.5">
                        {completedMT}{" "}
                        <span className="text-[10px] font-semibold text-gray-500">MT</span>
                      </p>
                    </div>

                    <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                        Remaining
                      </span>
                      <p className="text-sm font-black text-gray-900 mt-0.5">
                        {remainingMT}{" "}
                        <span className="text-[10px] font-semibold text-gray-500">MT</span>
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5 pt-0.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-gray-700">
                        {progressPercentage}% Completed
                      </span>
                      {isOverAchieved && (
                        <span className="text-[10px] font-black text-emerald-600">
                          +{progressPercentage - 100}%
                        </span>
                      )}
                    </div>

                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200/50">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${progressGrad}`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* No Target Set */
                <div className="text-center py-2 space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-800">No Target Set Yet</p>
                    <p className="text-[11px] text-gray-500 leading-snug">
                      Set your monthly MT target for {monthName} to start tracking achievements.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsExpanded(false);
                      setIsSetModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all hover:shadow"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Set Monthly Target
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Compact Draggable Bubble ───────────────────────────────────── */}
        <div
          ref={bubbleRef}
          role="button"
          tabIndex={0}
          aria-label={
            hasTarget
              ? `Monthly Target: ${completedMT} / ${targetMT} MT — drag to reposition`
              : "Set Monthly Target — drag to reposition"
          }
          onPointerDown={onBubblePointerDown}
          onPointerMove={onBubblePointerMove}
          onPointerUp={onBubblePointerUp}
          onPointerCancel={onDragEnd}
          onClick={onBubbleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onBubbleClick();
          }}
          className={[
            "flex items-center gap-2 px-4 py-2.5",
            "bg-white border border-slate-200/90 rounded-full shadow-xl",
            "touch-none transition-shadow duration-200",
            // Drag scale — only transition when NOT dragging so there's no lag
            isDragging
              ? "scale-[1.03] shadow-2xl cursor-grabbing"
              : "cursor-grab hover:shadow-2xl hover:scale-105 active:scale-95",
            isExpanded && !isDragging ? "ring-2 ring-blue-400/60 ring-offset-1" : "",
          ].join(" ")}
          style={{
            // Suppress Tailwind transition on transform while dragging
            transition: isDragging
              ? "box-shadow 0.15s ease"
              : "transform 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          {/* Target icon dot */}
          <div
            className={`h-6 w-6 rounded-full flex items-center justify-center text-white flex-shrink-0 ${accentBg}`}
          >
            <Target className="h-3.5 w-3.5" />
          </div>

          {/* Progress text */}
          <span className="text-sm font-bold text-gray-800 whitespace-nowrap">
            {hasTarget ? (
              <>
                <span className={accentText}>{completedMT}</span>
                <span className="text-gray-400 mx-0.5 font-medium">/</span>
                <span>{targetMT}</span>
                <span className="text-gray-500 ml-1 font-semibold text-xs">MT</span>
              </>
            ) : (
              <span className="text-gray-400 text-xs font-semibold">Set Target</span>
            )}
          </span>
        </div>
      </div>

      {/* ── Target Entry Modal ─────────────────────────────────────────────── */}
      <SetMonthlyTargetModal
        isOpen={isSetModalOpen}
        onClose={handleDismissSetModal}
        onProceedToConfirm={handleProceedToConfirm}
        monthName={monthName}
        year={year}
      />

      {/* ── Permanent Lock Confirmation Dialog ────────────────────────────── */}
      <ConfirmMonthlyTargetModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSave}
        targetValue={pendingTargetValue}
        monthName={monthName}
        year={year}
        isSubmitting={isSaving}
      />
    </>
  );
}
