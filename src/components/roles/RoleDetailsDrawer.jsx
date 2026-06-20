import React from "react";
import Drawer from "@/components/drawers/Drawer";
import { Info, ChevronDown, ChevronRight, Key } from "lucide-react";

export default function RoleDetailsDrawer({
  drawerOpen,
  setDrawerOpen,
  selectedRole,
  setSelectedRole,
  activeTab,
  setActiveTab,
  loadingDetails,
  permissionRegistry,
  expandedModules,
  toggleModuleAccordion,
  assignedIds,
  handlePermissionToggle,
  formatLabel,
}) {
  return (
    <Drawer
      isOpen={drawerOpen}
      onClose={() => {
        setDrawerOpen(false);
        setSelectedRole(null);
        const url = new URL(window.location.href);
        url.searchParams.delete("id");
        window.history.replaceState(null, "", url.toString());
      }}
      title={selectedRole?.name || "Role Details"}
      subtitle={selectedRole?.description}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={[
        { id: "overview", label: "Overview" },
        { id: "permissions", label: "Permissions" },
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
                Role Specifications
              </div>
              <div className="p-4 space-y-3.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Role ID</span>
                  <span className="font-bold text-gray-800">#{selectedRole?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Role Name</span>
                  <span className="font-bold text-gray-800">{selectedRole?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Definition Level</span>
                  <span className="font-bold text-gray-800 flex items-center gap-1">
                    {selectedRole?.isSystemRole ? (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded text-[9px] font-bold">
                        System Default
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[9px] font-bold">
                        Tenant Custom (Client ID: #{selectedRole?.clientId})
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* PERMISSIONS MATRIX TAB */}
          {activeTab === "permissions" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Enterprise Permission Matrix
                </h3>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                  Toggle individual rights
                </span>
              </div>

              <div className="overflow-hidden bg-white border border-gray-100 rounded-xl shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/20 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
                        <th className="px-4 py-3 w-[200px]">Module</th>
                        <th className="px-4 py-3">Granular Permissions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {permissionRegistry.map((modCat) => {
                        const category = modCat.module_name;
                        const isExpanded = expandedModules[category];
                        return (
                          <React.Fragment key={category}>
                            <tr
                              className="bg-gray-50/80 cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => toggleModuleAccordion(category)}
                            >
                              <td
                                colSpan="2"
                                className="px-4 py-2.5 font-bold text-gray-700 text-[11px] uppercase tracking-wider"
                              >
                                <div className="flex items-center gap-2">
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-gray-400 transition-transform" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-gray-400 transition-transform" />
                                  )}
                                  <Key className="h-3.5 w-3.5 text-gray-400" />
                                  {category}
                                </div>
                              </td>
                            </tr>
                            {isExpanded &&
                              (modCat.resources || []).map((res) => {
                                if (!res.actions || res.actions.length === 0) return null;

                                return (
                                  <tr
                                    key={res.resource_id}
                                    className="hover:bg-gray-50/30 transition-colors"
                                  >
                                    <td className="px-4 py-3 font-semibold text-gray-600 pl-8 align-top pt-4 border-r border-gray-100">
                                      {formatLabel(res.resource_name)}
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex flex-wrap gap-2 py-1">
                                        {res.actions.map((act) => {
                                          const isAssigned = assignedIds.has(act.action_id);
                                          return (
                                            <label
                                              key={act.action_id}
                                              className={`inline-flex items-center gap-2 border px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors ${
                                                isAssigned
                                                  ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
                                                  : "bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:bg-gray-50"
                                              }`}
                                              title={act.action_name}
                                            >
                                              <input
                                                type="checkbox"
                                                className="w-3.5 h-3.5 text-[#007aff] bg-white border-gray-300 rounded cursor-pointer focus:ring-[#007aff]"
                                                checked={isAssigned}
                                                onChange={() =>
                                                  handlePermissionToggle(act.action_id, isAssigned)
                                                }
                                              />
                                              {act.action_name.replace(/_/g, " ").toUpperCase()}
                                            </label>
                                          );
                                        })}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
}
