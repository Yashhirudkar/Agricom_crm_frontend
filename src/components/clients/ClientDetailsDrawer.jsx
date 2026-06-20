import React from "react";
import Drawer from "@/components/drawers/Drawer";
import { Building2, Users, History, Info } from "lucide-react";

export default function ClientDetailsDrawer({
  drawerOpen,
  setDrawerOpen,
  selectedClient,
  setSelectedClient,
  activeTab,
  setActiveTab,
  loadingDetails,
  clientCompanies,
  clientUsers,
  clientLogs,
}) {
  return (
    <Drawer
      isOpen={drawerOpen}
      onClose={() => {
        setDrawerOpen(false);
        setSelectedClient(null);
        const url = new URL(window.location.href);
        url.searchParams.delete("id");
        window.history.replaceState(null, "", url.toString());
      }}
      title={selectedClient?.name || "Client Details"}
      subtitle="Manage client spaces, configurations, and meters."
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={[
        { id: "overview", label: "Overview" },
        { id: "companies", label: `Companies (${clientCompanies.length})` },
        { id: "users", label: `Users (${clientUsers.length})` },
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
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#007aff]" />
                      <span className="text-xs font-bold text-gray-700">Company Usage</span>
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      {clientCompanies.length} / {selectedClient?.allowedCompanies}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        clientCompanies.length >= selectedClient?.allowedCompanies
                          ? "bg-red-500"
                          : "bg-[#007aff]"
                      }`}
                      style={{
                        width: `${Math.min(
                          (clientCompanies.length / (selectedClient?.allowedCompanies || 1)) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Maximum company workspaces this tenant is permitted to create.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span className="text-xs font-bold text-gray-700">User Usage</span>
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      {clientUsers.length} / {selectedClient?.allowedUsers}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        clientUsers.length >= selectedClient?.allowedUsers ? "bg-red-500" : "bg-purple-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          (clientUsers.length / (selectedClient?.allowedUsers || 1)) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Maximum team user slots this tenant is permitted to invite.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/20 text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-gray-400" />
                  Tenant Client Details
                </div>
                <div className="p-4 space-y-3.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Tenant ID</span>
                    <span className="font-bold text-gray-800">#{selectedClient?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Account Owner</span>
                    <span className="font-bold text-gray-800">{selectedClient?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Contact Email</span>
                    <span className="font-bold text-gray-800">{selectedClient?.email}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COMPANIES TAB */}
          {activeTab === "companies" && (
            <div className="space-y-3">
              {clientCompanies.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs font-semibold bg-white rounded-xl border border-gray-100">
                  No company workspaces set up for this tenant.
                </div>
              ) : (
                clientCompanies.map((co) => (
                  <div
                    key={co.id}
                    className="p-4 bg-white rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {co.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{co.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">
                          Status: {co.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <div className="space-y-3">
              {clientUsers.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs font-semibold bg-white rounded-xl border border-gray-100">
                  No users mapped to this tenant yet.
                </div>
              ) : (
                clientUsers.map((u) => (
                  <div
                    key={u.id}
                    className="p-4 bg-white rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                        {u.name ? u.name.slice(0, 2).toUpperCase() : "??"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{u.name || "Invite Pending"}</p>
                        <p className="text-[10px] text-gray-400 font-semibold">{u.email}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        u.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : u.status === "Invited"
                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {u.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ACTIVITY LOG TAB */}
          {activeTab === "activity" && (
            <div className="relative border-l border-gray-100 pl-5 ml-3 space-y-6">
              {clientLogs.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs font-semibold bg-white rounded-xl border border-gray-100 -ml-8">
                  No logged activities on this tenant.
                </div>
              ) : (
                clientLogs.map((log) => (
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
