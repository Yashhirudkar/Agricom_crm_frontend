import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { transitionEmployeeLifecycle } from "@/store/entities/employeesSlice";
import {
  CheckCircle2, Circle, ArrowRight, Loader2, Play,
  AlertTriangle, XCircle, CheckCircle, X
} from "lucide-react";

const statusLabels = {
  DRAFT: "Draft",
  ONBOARDING: "Onboarding",
  PROBATION: "Probation",
  ACTIVE: "Active",
  CONFIRMED: "Confirmed",
  NOTICE_PERIOD: "Notice Period",
  RESIGNED: "Resigned",
  TERMINATED: "Terminated"
};

const actionIcons = {
  "start-onboarding": Play,
  "start-probation": Play,
  "confirm": CheckCircle,
  "resign": AlertTriangle,
  "terminate": XCircle,
  "start-notice-period": AlertTriangle
};

export default function EmployeeTimeline({ empDetails, onRefresh }) {
  const dispatch = useDispatch();
  const [selectedAction, setSelectedAction] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  if (!empDetails) return null;

  const currentStatus = empDetails?.status || "DRAFT";
  const normalizedStatus = currentStatus.trim().toUpperCase();
  const actualNorm = normalizedStatus === "ACTIVE" ? "CONFIRMED" : normalizedStatus;
  const statusLogs = empDetails.lifecycleLogs || [];
  const wasTerminated = statusLogs.some(log => log.newStatus === "TERMINATED" || log.oldStatus === "TERMINATED");

  const visualNorm = selectedAction ? selectedAction.status : actualNorm;

  const coreStates = ["DRAFT", "ONBOARDING", "PROBATION", "CONFIRMED"];

  const getCoreColState = (colStatus) => {
    const finalStates = ["RESIGNED", "NOTICE_PERIOD", "TERMINATED"];
    if (finalStates.includes(actualNorm)) {
      return "past";
    }

    const colIdx = coreStates.indexOf(colStatus);
    const actualIdx = coreStates.indexOf(actualNorm);

    if (colIdx < actualIdx) {
      return "past";
    }

    if (colIdx === actualIdx) {
      if (selectedAction && selectedAction.status === coreStates[colIdx + 1]) {
        return "past";
      }
      return "current";
    }

    if (colIdx === actualIdx + 1) {
      if (selectedAction && selectedAction.status === colStatus) {
        return "current";
      }
      return "next";
    }

    return "disabled";
  };

  const columns = [
    {
      status: "DRAFT",
      type: getCoreColState("DRAFT"),
      options: []
    },
    {
      status: "ONBOARDING",
      type: getCoreColState("ONBOARDING"),
      options: [{ status: "ONBOARDING", action: "start-onboarding" }]
    },
    {
      status: "PROBATION",
      type: getCoreColState("PROBATION"),
      options: [{ status: "PROBATION", action: "start-probation" }]
    },
    {
      status: "CONFIRMED",
      type: getCoreColState("CONFIRMED"),
      options: [{ status: "CONFIRMED", action: "confirm" }]
    }
  ];

  if (actualNorm === "TERMINATED") {
    columns.push({
      status: "TERMINATED",
      type: "current-red",
      options: []
    });
  } else if (actualNorm === "NOTICE_PERIOD" || actualNorm === "RESIGNED") {
    const isResigned = actualNorm === "RESIGNED";
    columns.push({
      status: "RESIGNED",
      type: isResigned ? "current-red" : "next",
      options: isResigned ? [] : [{ status: "RESIGNED", action: "resign" }]
    });
  }

  const handleActionClick = (option) => {
    setSelectedAction(option);
    setRemarks("");
  };

  const submitAction = async () => {
    if (!selectedAction) return;
    setLoading(true);
    try {
      await dispatch(transitionEmployeeLifecycle({
        id: empDetails.id,
        transition: selectedAction.action,
        data: { remarks: remarks || `Transitioned to ${selectedAction.status}` }
      })).unwrap();
      setSelectedAction(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      alert(err || "Failed to transition status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-2 relative">
      {/* Interactive Timeline */}
      <div className="flex w-full items-center justify-between pb-6 hide-scrollbar relative z-10">
        {columns.map((col, idx) => {
          const isSelected = selectedAction && selectedAction.status === col.status;
          return (
            <React.Fragment key={idx}>
              {/* Node Container */}
              <div className="flex flex-col items-center relative z-20 w-24 shrink-0">
                {col.type === 'past' && (
                  <>
                    <div className="h-10 w-10 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center text-emerald-500 shadow-sm transition-transform hover:scale-110">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 mt-2 text-center whitespace-nowrap">
                      {statusLabels[col.status] || col.status}
                    </span>
                  </>
                )}

                {col.type === 'current' && (
                  <>
                    <div className="relative flex items-center justify-center w-10 h-10">
                      <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-25"></div>
                      <div className="w-10 h-10 rounded-full bg-blue-500 shadow-lg shadow-blue-500/30 flex items-center justify-center text-white border-2 border-white relative z-30">
                        <Circle className="w-3.5 h-3.5 fill-white text-white" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-600 mt-2 text-center whitespace-nowrap">
                      {statusLabels[col.status] || col.status}
                    </span>
                  </>
                )}

                {col.type === 'next' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (col.options[0]) {
                        handleActionClick(col.options[0]);
                      }
                    }}
                    className="group flex flex-col items-center transition-all cursor-pointer hover:-translate-y-0.5 relative z-50 focus:outline-none"
                  >
                    <div className={`w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center shadow-sm transition-all duration-300
                      ${isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-600 scale-110 shadow-blue-500/20'
                        : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50 text-gray-400 hover:text-blue-500'}
                    `}>
                      <Circle className="w-2.5 h-2.5" />
                    </div>
                    <span className={`text-xs font-semibold mt-2 text-center whitespace-nowrap transition-colors
                      ${isSelected ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}
                    `}>
                      {statusLabels[col.status] || col.status}
                    </span>
                  </button>
                )}

                {col.type === 'disabled' && (
                  <>
                    <div className="h-10 w-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-300 shadow-sm">
                      <Circle className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-xs font-medium text-gray-400 mt-2 text-center whitespace-nowrap">
                      {statusLabels[col.status] || col.status}
                    </span>
                  </>
                )}

                {col.type === 'current-red' && (
                  <>
                    <div className="relative flex items-center justify-center w-10 h-10">
                      <div className="absolute inset-0 bg-rose-400 rounded-full animate-ping opacity-25"></div>
                      <div className="w-10 h-10 rounded-full bg-rose-500 shadow-lg shadow-rose-500/30 flex items-center justify-center text-white border-2 border-white relative z-30">
                        <XCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-rose-600 mt-2 text-center whitespace-nowrap">
                      {statusLabels[col.status] || col.status}
                    </span>
                  </>
                )}

                {col.type === 'past-red' && (
                  <>
                    <div className="h-10 w-10 rounded-full bg-rose-50 border-2 border-rose-400 flex items-center justify-center text-rose-500 shadow-sm">
                      <XCircle className="w-5 h-5 text-rose-500" />
                    </div>
                    <span className="text-xs font-bold text-rose-600 mt-2 text-center whitespace-nowrap">
                      {statusLabels[col.status] || col.status}
                    </span>
                  </>
                )}
              </div>

              {/* Connecting Line */}
              {idx < columns.length - 1 && (
                <div className="flex-1 mt-5 h-[2px] bg-gray-100 relative min-w-[2rem] -z-10">
                  {col.type === 'past' && <div className="absolute inset-0 bg-emerald-400 transition-all duration-700"></div>}
                  {col.type === 'current' && <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-gray-100"></div>}
                  {(col.type === 'current-red' || col.type === 'past-red' || columns[idx+1].type === 'current-red' || columns[idx+1].type === 'past-red') && (
                    <div className="absolute inset-0 bg-rose-400"></div>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Action Section Below Stepper */}
      <div className="mt-6 border-t border-gray-100 pt-6">
        {/* Render current non-stepper status details if applicable */}
        {["RESIGNED", "NOTICE_PERIOD", "TERMINATED"].includes(actualNorm) && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${actualNorm === 'TERMINATED' || actualNorm === 'RESIGNED'
            ? 'bg-rose-50/70 border-rose-100 text-rose-800'
            : 'bg-amber-50/70 border-amber-100 text-amber-800'
            }`}>
            {actualNorm === 'TERMINATED' || actualNorm === 'RESIGNED' ? (
              <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            )}
            <div className="text-sm">
              <span className="font-semibold">Current State:</span> Employee is currently{" "}
              <span className="font-bold underline">{statusLabels[actualNorm]}</span>.
            </div>
          </div>
        )}

        {/* Action Buttons Box */}
        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/80">
          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Available Actions
          </h5>

          <div className="flex flex-wrap gap-3">
            {/* If Draft, show Start Onboarding */}
            {actualNorm === "DRAFT" && (
              <button
                type="button"
                onClick={() => handleActionClick({ status: "ONBOARDING", action: "start-onboarding" })}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all focus:outline-none shadow-sm
                  ${selectedAction?.action === "start-onboarding"
                    ? "bg-blue-600 text-white shadow-blue-500/20"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600"
                  }
                `}
              >
                <Play className="w-4 h-4 shrink-0" />
                Start Onboarding
              </button>
            )}

            {/* If Onboarding, show Start Probation */}
            {actualNorm === "ONBOARDING" && (
              <button
                type="button"
                onClick={() => handleActionClick({ status: "PROBATION", action: "start-probation" })}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all focus:outline-none shadow-sm
                  ${selectedAction?.action === "start-probation"
                    ? "bg-blue-600 text-white shadow-blue-500/20"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600"
                  }
                `}
              >
                <Play className="w-4 h-4 shrink-0" />
                Start Probation
              </button>
            )}

            {/* If Probation, show Confirm Employee */}
            {actualNorm === "PROBATION" && (
              <button
                type="button"
                onClick={() => handleActionClick({ status: "CONFIRMED", action: "confirm" })}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all focus:outline-none shadow-sm
                  ${selectedAction?.action === "confirm"
                    ? "bg-blue-600 text-white shadow-blue-500/20"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600"
                  }
                `}
              >
                <CheckCircle className="w-4 h-4 shrink-0" />
                Confirm Employee
              </button>
            )}

            {/* If Confirmed, show Start Notice Period, Resign, Terminate */}
            {(actualNorm === "CONFIRMED" || actualNorm === "ACTIVE") && (
              <>
                <button
                  type="button"
                  onClick={() => handleActionClick({ status: "NOTICE_PERIOD", action: "start-notice-period" })}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all focus:outline-none shadow-sm
                    ${selectedAction?.action === "start-notice-period"
                      ? "bg-amber-600 text-white shadow-amber-500/20"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-amber-500 hover:text-amber-600"
                    }
                  `}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Start Notice Period
                </button>

                <button
                  type="button"
                  onClick={() => handleActionClick({ status: "RESIGNED", action: "resign" })}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all focus:outline-none shadow-sm
                    ${selectedAction?.action === "resign"
                      ? "bg-amber-600 text-white shadow-amber-500/20"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-amber-500 hover:text-amber-600"
                    }
                  `}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Resign Employee
                </button>

                <button
                  type="button"
                  onClick={() => handleActionClick({ status: "TERMINATED", action: "terminate" })}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all focus:outline-none shadow-sm
                    ${selectedAction?.action === "terminate"
                      ? "bg-rose-600 text-white shadow-rose-500/20"
                      : "bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-500"
                    }
                  `}
                >
                  <XCircle className="w-4 h-4 shrink-0" />
                  Terminate Employee
                </button>
              </>
            )}

            {/* If Notice Period, show Complete Resignation */}
            {actualNorm === "NOTICE_PERIOD" && (
              <button
                type="button"
                onClick={() => handleActionClick({ status: "RESIGNED", action: "resign" })}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all focus:outline-none shadow-sm
                  ${selectedAction?.action === "resign"
                    ? "bg-rose-600 text-white shadow-rose-500/20"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-rose-500 hover:text-rose-600"
                  }
                `}
              >
                <ArrowRight className="w-4 h-4 shrink-0" />
                Complete Resignation
              </button>
            )}

            {/* If Resigned or Terminated, show nothing available */}
            {["RESIGNED", "TERMINATED"].includes(actualNorm) && (
              <span className="text-sm font-medium text-gray-400 italic">
                No actions available for exited employees.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Confirmation Panel */}
      {selectedAction && (
        <div className="mt-3 mb-6 p-4 bg-white border border-gray-300 rounded-md">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-800 flex items-center gap-2">
                {React.createElement(
                  actionIcons[selectedAction.action] || Play,
                  { className: "w-4 h-4 text-gray-600" }
                )}
                Change Status: {statusLabels[selectedAction.status]}
              </h4>

              <p className="text-xs text-gray-500 mt-1">
                Confirm status update for this employee.
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedAction(null);
              }}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Remarks (optional)"
              className="flex-1 text-sm px-3 text-gray-400 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
              onKeyDown={(e) => e.key === "Enter" && submitAction()}
            />

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                submitAction();
              }}
              disabled={loading}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm rounded-md disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Status History Logs */}
      {statusLogs && statusLogs.length > 0 && (
        <div className="mt-8 space-y-4 pt-6 border-t border-gray-100">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Transition History</h4>
          <div className="space-y-4">
            {statusLogs.map((log, idx) => (
              <div key={idx} className="flex gap-4 text-xs group">
                <div className="w-px bg-gray-100 relative ml-2 group-hover:bg-blue-100 transition-colors">
                  <div className="absolute top-1.5 -left-1.5 h-3 w-3 rounded-full bg-white border-2 border-gray-300 group-hover:border-blue-400 transition-colors" />
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-600">{statusLabels[log.oldStatus] || log.oldStatus}</span>
                    <ArrowRight className="h-3 w-3 text-gray-300" />
                    <span className="font-bold text-gray-900">{statusLabels[log.newStatus] || log.newStatus}</span>
                  </div>
                  {log.remarks && <p className="text-gray-500 mt-1 italic bg-gray-50 p-2 rounded-lg inline-block border border-gray-100">"{log.remarks}"</p>}
                  <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
