import React from "react";
import { ArrowLeft, Sliders, Trash2, Eye } from "lucide-react";

export default function Header({
  router,
  role,
  userType,
  allCompanies = [],
  selectedCompanyId,
  setSelectedCompanyId,
  hasConfig,
  configVersion,
  isConfigActive,
  handleDeactivate,
  handleActivate,
  isDeactivating,
  setIsPreviewOpen,
  setPreviewActiveTab,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
      <div className="space-y-1">
        <button
          onClick={() => router.push("/masters/partner-roles")}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4.5 w-4.5" /> Back to Partner Roles
        </button>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
          <Sliders className="h-6 w-6 text-[#007aff]" />
          Custom Form Builder
        </h1>
        <p className="text-xs font-semibold text-gray-400">
          Define extra configuration details and additional fields for role:{" "}
          <span className="text-gray-700 font-extrabold uppercase">{role?.name || "..."}</span>
        </p>
      </div>

      {/* Status context & Preview Button */}
      <div className="flex items-center gap-3">
        {userType === "super_admin" && allCompanies && allCompanies.length > 0 && (
          <select
            value={selectedCompanyId}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedCompanyId?.(val);
              if (val) {
                localStorage.setItem("activeCompanyId", val);
              } else {
                localStorage.removeItem("activeCompanyId");
              }
            }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-white"
          >
            <option value="">-- Select Company Context --</option>
            {allCompanies.map((c, idx) => (
              <option key={`company-${c.id || idx}-${idx}`} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}

        {hasConfig && (
          <div className="flex items-center gap-2">
            <div className="bg-white border border-gray-100 px-3.5 py-2 rounded-xl flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${isConfigActive ? "bg-emerald-500 animate-pulse" : "bg-gray-300"}`}></span>
              <div className="text-[10px] uppercase font-bold tracking-wider text-gray-450">
                Published Version:{" "}
                <span className="text-gray-700 font-extrabold">v{configVersion}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (isDeactivating) return;
                if (isConfigActive) {
                  handleDeactivate();
                } else {
                  handleActivate();
                }
              }}
              disabled={isDeactivating}
              className={`px-4 py-1.5 font-bold text-[10px] tracking-wider uppercase rounded-xl transition-all cursor-pointer ${
                isConfigActive
                  ? "bg-[#007aff] hover:bg-blue-600 text-white shadow-[0_2px_4px_rgba(0,122,255,0.25)]"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-400 border border-gray-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"
              }`}
            >
              {isConfigActive ? "ON" : "OFF"}
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setIsPreviewOpen(true);
            setPreviewActiveTab("additional");
          }}
          className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <Eye className="h-4 w-4 text-gray-400" />
          Preview Form
        </button>
      </div>
    </div>
  );
}
