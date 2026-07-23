import React from "react";
import Drawer from "@/components/drawers/Drawer";
import { Info, Shield, History, Building2, PlusCircle } from "lucide-react";
import useSystemOptions from "@/hooks/useSystemOptions";

export default function UserDetailsDrawer({
  drawerOpen,
  setDrawerOpen,
  selectedUser,
  setSelectedUser,
  activeTab,
  setActiveTab,
  loadingDetails,
  userLogs,
  toggleUserStatusDrawer,
  setAssignForm,
  setAssignWorkspaceOpen,
  handleRemoveWorkspace,
}) {
  const { options } = useSystemOptions();

  return (
    <Drawer
      isOpen={drawerOpen}
      onClose={() => {
        setDrawerOpen(false);
        setSelectedUser(null);
        const url = new URL(window.location.href);
        url.searchParams.delete("id");
        window.history.replaceState(null, "", url.toString());
      }}
      title={selectedUser?.name || "User Details"}
      subtitle={selectedUser?.email}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={[
        { id: "profile", label: "Profile" },
        { id: "workspaces", label: `Workspaces (${selectedUser?.userCompanies?.length || 0})` },
        { id: "roles", label: "Roles" },
        { id: "activity", label: "Activity" },
      ]}
    >
      {loadingDetails ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <div className="h-6 w-6 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-400 font-semibold">Loading logs...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/20 text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-gray-400" />
                  Identity Card
                </div>
                <div className="p-4 space-y-3.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Full Name</span>
                    <span className="font-bold text-gray-800">{selectedUser?.name || "Pending Invite"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Email Address</span>
                    <span className="font-bold text-gray-800">{selectedUser?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Client Organization</span>
                    <span className="font-bold text-gray-800">
                      {selectedUser?.client?.name || `Client #${selectedUser?.clientId}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Role Level Scope</span>
                    <span className="font-bold text-gray-800">
                      {selectedUser?.roles?.[0]?.name || "Standard Member"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Creation Date</span>
                    <span className="font-bold text-gray-800">
                      {selectedUser?.createdAt && new Date(selectedUser.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-800">Account Access</p>
                  <p className="text-[10px] text-gray-400">Lock, suspend, or activate user credentials.</p>
                </div>
                <select
                  value={selectedUser?.status || ""}
                  onChange={(e) => toggleUserStatusDrawer(e.target.value)}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl text-xs outline-none focus:border-[#007aff] font-bold"
                >
                  {options?.users?.statuses?.map(s => (
                    <option key={s.value} value={s.value} disabled={s.value === 'Invited'}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* WORKSPACES TAB */}
          {activeTab === "workspaces" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Workspace Memberships
                </h3>
                <button
                  onClick={() => {
                    setAssignForm({ companyId: "", roleId: "" });
                    setAssignWorkspaceOpen(true);
                  }}
                  className="px-2.5 py-1.5 bg-[#007aff] text-white rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:bg-blue-600 shadow-xs transition-all"
                >
                  <PlusCircle className="h-3.5 w-3.5" /> Assign Workspace
                </button>
              </div>

              <div className="space-y-3">
                {!selectedUser?.userCompanies || selectedUser.userCompanies.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-xs font-semibold bg-white rounded-xl border border-gray-100">
                    User has not been scoped to any company workspaces.
                  </div>
                ) : (
                  selectedUser.userCompanies.map((uc) => (
                    <div
                      key={uc.companyId}
                      className="p-4 bg-white rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs font-bold text-gray-800">{uc.company?.name || "Workspace"}</p>
                          <p className="text-[10px] text-gray-400 font-semibold">
                            Role: {uc.role?.name || "No role assignment"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveWorkspace(uc.companyId)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ROLES TAB */}
          {activeTab === "roles" && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Active Security Roles
              </h3>
              {selectedUser?.userCompanies && selectedUser.userCompanies.some((uc) => uc.role) ? (
                <div className="space-y-3">
                  {selectedUser.userCompanies
                    .filter((uc) => uc.role)
                    .map((uc) => (
                      <div
                        key={uc.companyId}
                        className="p-4 bg-white rounded-xl border border-gray-100 shadow-2xs flex items-center gap-3"
                      >
                        <Shield className="h-4.5 w-4.5 text-blue-500" />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-800">{uc.role?.name}</span>
                          <span className="text-[10px] text-gray-400 font-semibold">
                            Scoped inside: {uc.company?.name}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 text-xs font-semibold bg-white rounded-xl border border-gray-100">
                  No roles mapping found.
                </div>
              )}
            </div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === "activity" && (
            <div className="relative border-l border-gray-100 pl-5 ml-3 space-y-6">
              {userLogs.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs font-semibold bg-white rounded-xl border border-gray-100 -ml-8">
                  No activity logs mapping to this user ID.
                </div>
              ) : (
                userLogs.map((log) => (
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
