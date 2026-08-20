"use client";
import React from "react";
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Ship,
  Clock,
  CheckCircle2,
} from "lucide-react";

const RISK_LEVEL_BADGES = {
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-blue-50 text-blue-700 border-blue-200",
  High: "bg-amber-50 text-amber-700 border-amber-200",
  Critical: "bg-red-50 text-red-700 border-red-200 animate-pulse",
};

export default function HealthScoreCard({ summary }) {
  const health = summary?.health || {};
  const docSummary = summary?.documentSummary || {};

  const score = health.healthScore ?? 100;
  const riskLevel = health.riskLevel || "Low";
  const shipmentPct = health.shipmentCompletion ?? 100;
  const docPct = docSummary.completionPct ?? 100;
  const overdueCount = health.overdueCount ?? 0;
  const upcomingCount = health.upcomingCount ?? 0;

  // Determine SVG stroke color based on score
  const strokeColor =
    score >= 80 ? "#10b981" : score >= 60 ? "#3b82f6" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-5 sticky top-24">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Contract Health
        </h3>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
            RISK_LEVEL_BADGES[riskLevel] || "bg-gray-100 text-gray-700 border-gray-200"
          }`}
        >
          {riskLevel} Risk
        </span>
      </div>

      {/* Health Score Gauge / Circle Display */}
      <div className="flex flex-col items-center justify-center py-2 relative">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              strokeWidth="3.5"
              strokeDasharray={`${score}, 100`}
              strokeLinecap="round"
              stroke={strokeColor}
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold font-mono text-gray-900 leading-none">
              {score}%
            </span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-1">
              HEALTH SCORE
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4 pt-1 border-t border-gray-100">

        {/* Shipment Completion */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
            <span className="flex items-center gap-1.5">
              <Ship className="h-3.5 w-3.5 text-blue-500" />
              Shipment Completion
            </span>
            <span className="font-mono font-bold text-gray-900">{shipmentPct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${shipmentPct}%` }}
            />
          </div>
        </div>

        {/* Document Completion */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
            <span className="flex items-center gap-1.5">
              <FileCheck className="h-3.5 w-3.5 text-teal-500" />
              Document Compliance
            </span>
            <span className="font-mono font-bold text-gray-900">{docPct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${docPct}%` }}
            />
          </div>
        </div>

      </div>

      {/* Alerts & Counters */}
      <div className="space-y-2 pt-2 border-t border-gray-100 text-xs font-medium">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="flex items-center gap-1.5 text-gray-600">
            <Clock className="h-3.5 w-3.5 text-blue-500" />
            Upcoming Dispatches
          </span>
          <span className="font-bold font-mono text-gray-900">{upcomingCount}</span>
        </div>

        {overdueCount > 0 ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700">
            <span className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
              Overdue Shipments
            </span>
            <span className="font-bold font-mono text-red-800">{overdueCount}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              No Overdue Alerts
            </span>
            <span className="font-bold font-mono text-emerald-800">0</span>
          </div>
        )}
      </div>
    </div>
  );
}
