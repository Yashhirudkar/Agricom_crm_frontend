"use client";
import React from "react";
import {
  AlertTriangle,
  Clock,
  FileCheck,
  Ship,
  Upload,
  Plus,
  ArrowRight,
  CheckCircle2,
  Zap,
} from "lucide-react";

export default function TodaysOperationsPanel({
  summary,
  documents = [],
  shipments = [],
  onOpenTab,
}) {
  const health = summary?.health || {};
  const overdueCount = health.overdueCount || 0;
  const pendingDocs = documents.filter((d) => !d.uploaded);
  const upcomingShipments = shipments.filter(
    (s) => s.timeline?.type === "today" || s.timeline?.type === "tomorrow" || s.timeline?.type === "upcoming"
  );

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white space-y-4 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute right-0 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Today's Operational Command & Priority Desk
            </h3>
            <p className="text-[11px] text-slate-400">
              Live operational task list for logistics desk manager.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {overdueCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 border border-red-800 text-red-300 text-xs font-bold animate-pulse">
              <AlertTriangle className="h-3.5 w-3.5" />
              {overdueCount} Overdue Alert(s)
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">
            {pendingDocs.length} Pending Docs
          </span>
        </div>
      </div>

      {/* Action Items List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

        {/* Priority 1: Overdue or Dispatch Alert */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Shipment Alerts
            </span>
            <span className="text-[10px] font-mono text-slate-500">Live Status</span>
          </div>

          <div>
            {overdueCount > 0 ? (
              <div className="text-xs font-bold text-red-300">
                {overdueCount} Shipment(s) require urgent delay investigation.
              </div>
            ) : (
              <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                All linked shipments are progressing on schedule.
              </div>
            )}
          </div>

          <button
            onClick={() => onOpenTab("shipments")}
            className="text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors self-start pt-1"
          >
            <span>Go to Shipments Desk</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Priority 2: Pending Compliance Docs */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <FileCheck className="h-3 w-3" />
              Customs Compliance
            </span>
            <span className="text-[10px] font-mono text-slate-500">{pendingDocs.length} Remaining</span>
          </div>

          <div>
            {pendingDocs.length > 0 ? (
              <div className="text-xs font-semibold text-slate-200">
                Upload required <span className="font-bold text-amber-300">{pendingDocs[0]?.tradeDocument?.name}</span> for clearance.
              </div>
            ) : (
              <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                100% Document compliance achieved.
              </div>
            )}
          </div>

          <button
            onClick={() => onOpenTab("documents")}
            className="text-[11px] font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors self-start pt-1"
          >
            <span>Open Document Checklist</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Priority 3: Upcoming Operations */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
              <Ship className="h-3 w-3" />
              Upcoming Dispatches
            </span>
            <span className="text-[10px] font-mono text-slate-500">{upcomingShipments.length} Scheduled</span>
          </div>

          <div>
            {upcomingShipments.length > 0 ? (
              <div className="text-xs font-semibold text-slate-200">
                Next dispatch: <span className="font-bold text-blue-300">{upcomingShipments[0]?.shipmentReference || "Shipment"}</span> ({upcomingShipments[0]?.quantity} MT)
              </div>
            ) : (
              <div className="text-xs font-semibold text-slate-400">
                No immediate upcoming dispatches for this week.
              </div>
            )}
          </div>

          <button
            onClick={() => onOpenTab("timeline")}
            className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors self-start pt-1"
          >
            <span>View Timeline Milestones</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

      </div>
    </div>
  );
}
