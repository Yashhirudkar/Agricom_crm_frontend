import React from "react";

export default function FloatingActionBar({
  selectedUserIds,
  handleBulkStatus,
  setBulkAction,
  setBulkTargetId,
  setBulkRoleId,
  setSelectedUserIds,
  bulkLoading,
}) {
  if (selectedUserIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[80] bg-slate-900 border border-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-5 animate-in slide-in-from-bottom-5 duration-300">
      <span className="text-xs font-bold text-slate-300 border-r border-slate-800 pr-4">
        {selectedUserIds.length} Users Selected
      </span>
      <div className="flex items-center gap-2">
        <button
          disabled={bulkLoading}
          onClick={() => handleBulkStatus("Active")}
          className="px-3 py-1.5 bg-emerald-600/90 hover:bg-emerald-600 disabled:opacity-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Activate
        </button>
        <button
          disabled={bulkLoading}
          onClick={() => handleBulkStatus("Inactive")}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Deactivate
        </button>
        <button
          disabled={bulkLoading}
          onClick={() => handleBulkStatus("Suspended")}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Suspend
        </button>
        <button
          disabled={bulkLoading}
          onClick={() => {
            setBulkTargetId("");
            setBulkRoleId("");
            setBulkAction("company");
          }}
          className="px-3 py-1.5 bg-[#007aff] hover:bg-blue-600 disabled:opacity-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Assign Company
        </button>
        <button
          disabled={bulkLoading}
          onClick={() => {
            setBulkRoleId("");
            setBulkAction("role");
          }}
          className="px-3 py-1.5 bg-[#007aff] hover:bg-blue-600 disabled:opacity-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Assign Role
        </button>
      </div>
      <button
        disabled={bulkLoading}
        onClick={() => setSelectedUserIds([])}
        className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-50 transition-colors cursor-pointer ml-2"
      >
        Clear Selection
      </button>
    </div>
  );
}
