import React from "react";
import Drawer from "@/components/drawers/Drawer";
import { Info, Shield, History } from "lucide-react";

export default function CompanyDetailsDrawer({
  drawerOpen,
  setDrawerOpen,
  selectedCompany,
  setSelectedCompany,
  activeTab,
  setActiveTab,
  loadingDetails,
  companyUsers,
  companyRoles,
  companyLogs,
  settingsName,
  setSettingsName,
  settingsActive,
  setSettingsActive,
  handleUpdateSettings,
}) {
  return (
    <Drawer
      isOpen={drawerOpen}
      onClose={() => {
        setDrawerOpen(false);
        setSelectedCompany(null);
        const url = new URL(window.location.href);
        url.searchParams.delete("id");
        window.history.replaceState(null, "", url.toString());
      }}
      title={selectedCompany?.name || "Workspace Details"}
      subtitle="Manage member access, settings, and logs."
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={[
        { id: "overview", label: "Overview" },
        { id: "users", label: `Users (${companyUsers.length})` },
        { id: "roles", label: "Roles" },
        { id: "settings", label: "Settings" },
        { id: "activity", label: "Activity" },
      ]}
    >
      {loadingDetails ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <div className="h-6 w-6 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-400 font-semibold">Loading details...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-gray-50 bg-gray-50/20 text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-gray-400" />
                Workspace Scoping Details
              </div>
              <div className="p-4 space-y-3.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Workspace ID</span>
                  <span className="font-bold text-gray-800">#{selectedCompany?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Workspace Name</span>
                  <span className="font-bold text-gray-800">{selectedCompany?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Parent Tenant Owner</span>
                  <span className="font-bold text-gray-800">Client #{selectedCompany?.clientId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Active Status</span>
                  <span
                    className={`font-bold ${
                      selectedCompany?.isActive ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {selectedCompany?.isActive ? "Active / Enabled" : "Disabled / Locked"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <div className="space-y-3">
              {companyUsers.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs font-semibold bg-white rounded-xl border border-gray-100">
                  No users assigned to this company workspace.
                </div>
              ) : (
                companyUsers.map((u) => (
                  <div
                    key={u.id}
                    className="p-4 bg-white rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {u.name ? u.name.slice(0, 2).toUpperCase() : "??"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{u.name || "Invite Pending"}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{u.email}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-md text-[10px] font-bold">
                      {u.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ROLES TAB */}
          {activeTab === "roles" && (
            <div className="space-y-3">
              {companyRoles.filter(
                (r) => r.clientId === selectedCompany?.clientId || r.isSystemRole
              ).length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs font-semibold bg-white rounded-xl border border-gray-100">
                  No roles set up for this client.
                </div>
              ) : (
                companyRoles
                  .filter((r) => r.clientId === selectedCompany?.clientId || r.isSystemRole)
                  .map((r) => (
                    <div
                      key={r.id}
                      className="p-4 bg-white rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span className="text-xs font-bold text-gray-800">{r.name}</span>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          r.isSystemRole
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-blue-50 text-blue-700 border border-blue-100"
                        }`}
                      >
                        {r.isSystemRole ? "System" : "Custom Tenant"}
                      </span>
                    </div>
                  ))
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <form
              onSubmit={handleUpdateSettings}
              className="space-y-4 bg-white p-4 rounded-xl border border-gray-100 shadow-2xs"
            >
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  required
                  value={settingsName}
                  onChange={(e) => setSettingsName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-xs font-bold text-gray-800">Workspace Status</p>
                  <p className="text-[10px] text-gray-400">Lock or unlock this company workspace.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settingsActive}
                  onChange={(e) => setSettingsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#007aff] focus:ring-[#007aff] cursor-pointer"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          )}

          {/* ACTIVITY LOG TAB */}
          {activeTab === "activity" && (
            <div className="relative border-l border-gray-100 pl-5 ml-3 space-y-6">
              {companyLogs.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs font-semibold bg-white rounded-xl border border-gray-100 -ml-8">
                  No activities recorded on this workspace.
                </div>
              ) : (
                companyLogs.map((log) => (
                  <div key={log.id} className="relative">
                    <span className="absolute -left-[27px] top-1 bg-white border-2 border-blue-500 rounded-full h-3.5 w-3.5 flex items-center justify-center" />
                    <div>
                      <p className="text-xs font-bold text-gray-800 flex items-center gap-2">
                        <span>{log.action}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-bold">
                          {log.entityType}
                        </span>
                      </p>
                      {log.details && (
                        <div className="mt-1.5 p-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-mono text-gray-500 max-w-full overflow-x-auto">
                          {typeof log.details === "object"
                            ? JSON.stringify(log.details, null, 2)
                            : log.details}
                        </div>
                      )}
                      <p className="text-[9px] text-gray-400 font-semibold mt-1 flex items-center gap-1">
                        <History className="h-3 w-3" />
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
}
