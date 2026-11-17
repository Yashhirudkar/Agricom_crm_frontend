import React, { useState, useEffect, useRef, useMemo } from "react";
import Drawer from "@/components/drawers/Drawer";
import {
  Info, ChevronDown, ChevronRight, Key, Tag, Search, CheckSquare, Square, Save, RotateCcw,
  Shield, CalendarCheck, Clock, Users, FileCheck, MessageSquare, Truck, Database,
  BarChart3, FileText, Briefcase, CheckCircle2, XCircle, AlertCircle, Sparkles, Folder, Layers, Check, Plus
} from "lucide-react";
import axiosClient from "@/lib/axios";

const ICON_MAP = {
  Shield,
  CalendarCheck,
  Clock,
  Users,
  FileCheck,
  MessageSquare,
  Truck,
  Database,
  BarChart3,
  FileText,
  Briefcase,
  Folder,
  Layers,
  Sparkles,
};

const resolveGroupIcon = (iconName) => {
  if (!iconName) return Folder;
  return ICON_MAP[iconName] || Folder;
};

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
  handleBatchPermissionsToggle,
  formatLabel,
  showToast,
  refetchRolePermissions,
}) {
  // ─── Partner Roles Tab State ───────────────────────────────────────────────
  const [allPartnerRoles, setAllPartnerRoles] = useState([]);
  const [selectedPartnerRoleIds, setSelectedPartnerRoleIds] = useState(new Set());
  const [originalPartnerRoleIds, setOriginalPartnerRoleIds] = useState(new Set());
  const [prLoading, setPrLoading] = useState(false);
  const [prSaving, setPrSaving] = useState(false);
  const [prSearch, setPrSearch] = useState("");
  const [matrixSearch, setMatrixSearch] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({});

  // ─── Backend Permission Groups State (Backend-Driven RBAC) ────────────────
  const [backendGroups, setBackendGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [operatingGroupId, setOperatingGroupId] = useState(null);

  const fetchRolePermissionGroups = async () => {
    if (!selectedRole?.id) return;
    setGroupsLoading(true);
    try {
      const res = await axiosClient.get(`/roles/${selectedRole.id}/permission-groups`);
      setBackendGroups(res.data || []);
    } catch (err) {
      console.error("Failed to load permission groups:", err);
    } finally {
      setGroupsLoading(false);
    }
  };

  useEffect(() => {
    if (drawerOpen && selectedRole?.id) {
      fetchRolePermissionGroups();
    }
  }, [drawerOpen, selectedRole?.id, activeTab]);

  const handleGrantGroup = async (group) => {
    if (!selectedRole?.id || !group?.id) return;
    setOperatingGroupId(group.id);
    try {
      await axiosClient.post(`/roles/${selectedRole.id}/permission-groups`, {
        groupId: group.id,
      });
      if (showToast) showToast(`Permission pack "${group.name}" granted successfully`);
      await Promise.all([
        fetchRolePermissionGroups(),
        refetchRolePermissions ? refetchRolePermissions(selectedRole.id) : Promise.resolve(),
      ]);
    } catch (err) {
      console.error("Failed to assign permission group:", err);
      if (showToast) showToast(err?.response?.data?.message || "Failed to assign permission group", "error");
    } finally {
      setOperatingGroupId(null);
    }
  };

  const handleRevokeGroup = async (group) => {
    if (!selectedRole?.id || !group?.id) return;
    setOperatingGroupId(group.id);
    try {
      await axiosClient.delete(`/roles/${selectedRole.id}/permission-groups/${group.id}`);
      if (showToast) showToast(`Permission pack "${group.name}" revoked successfully`);
      await Promise.all([
        fetchRolePermissionGroups(),
        refetchRolePermissions ? refetchRolePermissions(selectedRole.id) : Promise.resolve(),
      ]);
    } catch (err) {
      console.error("Failed to revoke permission group:", err);
      if (showToast) showToast(err?.response?.data?.message || "Failed to revoke permission group", "error");
    } finally {
      setOperatingGroupId(null);
    }
  };

  const handleGrantAllGroups = async () => {
    if (!selectedRole?.id || backendGroups.length === 0) return;
    setGroupsLoading(true);
    try {
      for (const g of backendGroups) {
        if (g.status !== "FULL") {
          await axiosClient.post(`/roles/${selectedRole.id}/permission-groups`, {
            groupId: g.id,
          });
        }
      }
      if (showToast) showToast("All enterprise groups granted successfully");
      await Promise.all([
        fetchRolePermissionGroups(),
        refetchRolePermissions ? refetchRolePermissions(selectedRole.id) : Promise.resolve(),
      ]);
    } catch (err) {
      if (showToast) showToast("Failed to grant all groups", "error");
    } finally {
      setGroupsLoading(false);
    }
  };

  const handleRevokeAllGroups = async () => {
    if (!selectedRole?.id || backendGroups.length === 0) return;
    setGroupsLoading(true);
    try {
      for (const g of backendGroups) {
        if (g.assignedCount > 0 || g.isExplicitlyAssigned) {
          await axiosClient.delete(`/roles/${selectedRole.id}/permission-groups/${g.id}`);
        }
      }
      if (showToast) showToast("All enterprise groups revoked successfully");
      await Promise.all([
        fetchRolePermissionGroups(),
        refetchRolePermissions ? refetchRolePermissions(selectedRole.id) : Promise.resolve(),
      ]);
    } catch (err) {
      if (showToast) showToast("Failed to revoke groups", "error");
    } finally {
      setGroupsLoading(false);
    }
  };

  const toggleGroupAccordion = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const sortedRegistry = useMemo(() => {
    if (!Array.isArray(permissionRegistry)) return [];
    let list = [...permissionRegistry].sort((a, b) =>
      (a.module_name || "").localeCompare(b.module_name || "")
    );
    if (matrixSearch.trim()) {
      const q = matrixSearch.toLowerCase().trim();
      list = list.filter((m) =>
        (m.module_name || "").toLowerCase().includes(q) ||
        (m.resources || []).some((r) =>
          (r.resource_name || "").toLowerCase().includes(q)
        )
      );
    }
    return list;
  }, [permissionRegistry, matrixSearch]);

  // Load all partner roles (for the checklist) when drawer is opened
  useEffect(() => {
    if (!drawerOpen) return;
    const fetchAllPartnerRoles = async () => {
      try {
        // Use the admin-level endpoint (not the user-filtered options)
        const res = await axiosClient.get("/masters/partner-roles", {
          params: { limit: 100, isActive: true, page: 1 },
        });
        setAllPartnerRoles(res.data?.data || []);
      } catch (err) {
        console.error("Failed to load partner roles list", err);
      }
    };
    fetchAllPartnerRoles();
  }, [drawerOpen]);

  // Load role's partner role access config when drawer opens or role changes
  useEffect(() => {
    if (activeTab === "partnerRoles" && selectedRole?.id) {
      loadPartnerRoleAccess();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedRole?.id]);

  const loadPartnerRoleAccess = async () => {
    if (!selectedRole?.id) return;
    setPrLoading(true);
    try {
      const res = await axiosClient.get(`/GetRolePartnerRoleAccess?roleId=${selectedRole.id}`);
      const ids = new Set(res.data?.partnerRoleIds || []);
      setSelectedPartnerRoleIds(ids);
      setOriginalPartnerRoleIds(ids);
    } catch (err) {
      console.error("Failed to load partner role access", err);
      if (showToast) showToast("Failed to load partner role access", "error");
    } finally {
      setPrLoading(false);
    }
  };

  const handlePartnerRoleToggle = (id) => {
    setSelectedPartnerRoleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedPartnerRoleIds(new Set(filteredPartnerRoles.map((r) => r.id)));
  };

  const handleClearAll = () => {
    setSelectedPartnerRoleIds(new Set());
  };

  const handleCancelPartnerRoles = () => {
    setSelectedPartnerRoleIds(new Set(originalPartnerRoleIds));
    setPrSearch("");
  };

  const handleSavePartnerRoles = async () => {
    if (!selectedRole?.id) return;
    setPrSaving(true);
    try {
      await axiosClient.post("/UpdateRolePartnerRoleAccess", {
        roleId: selectedRole.id,
        partnerRoleIds: Array.from(selectedPartnerRoleIds),
      });
      setOriginalPartnerRoleIds(new Set(selectedPartnerRoleIds));
      if (showToast) showToast("Partner role access saved successfully");
    } catch (err) {
      console.error("Failed to save partner role access", err);
      if (showToast) showToast("Failed to save partner role access", "error");
    } finally {
      setPrSaving(false);
    }
  };

  const isDirty =
    JSON.stringify([...selectedPartnerRoleIds].sort()) !==
    JSON.stringify([...originalPartnerRoleIds].sort());

  const filteredPartnerRoles = allPartnerRoles.filter((r) =>
    r.name.toLowerCase().includes(prSearch.toLowerCase())
  );

  const isUnrestricted = selectedPartnerRoleIds.size === 0;

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
      onTabChange={(tab) => {
        setActiveTab(tab);
        setPrSearch("");
      }}
      tabs={[
        { id: "overview", label: "Overview" },
        { id: "permissions", label: "Permissions" },
        { id: "groupPermissions", label: "Group Permissions" },
        { id: "partnerRoles", label: "Partner Roles" },
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Enterprise Permission Matrix (A-Z)
                  </h3>
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    Toggle individual rights
                  </span>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={matrixSearch}
                    onChange={(e) => setMatrixSearch(e.target.value)}
                    placeholder="Search module..."
                    className="w-full pl-8 pr-7 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#007aff] focus:bg-white transition-all text-gray-800"
                  />
                  {matrixSearch && (
                    <button
                      onClick={() => setMatrixSearch("")}
                      className="absolute right-2.5 top-1.5 text-xs text-gray-400 hover:text-gray-600 font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>
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
                      {sortedRegistry.map((modCat) => {
                        const moduleKey = modCat.module_id;
                        const category = modCat.module_name;
                        const isExpanded = expandedModules[moduleKey];
                        const modAllActions = (modCat.resources || []).flatMap((r) =>
                          (r.actions || []).map((a) => a.action_id)
                        );
                        const assignedInMod = modAllActions.filter((id) => assignedIds.has(id)).length;
                        const isModFull = modAllActions.length > 0 && assignedInMod === modAllActions.length;

                        return (
                          <React.Fragment key={moduleKey}>
                            <tr
                              className="bg-gray-50/80 cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => toggleModuleAccordion(moduleKey)}
                            >
                              <td
                                colSpan="2"
                                className="px-4 py-2.5 font-bold text-gray-700 text-[11px] uppercase tracking-wider"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {isExpanded ? (
                                      <ChevronDown className="h-4 w-4 text-gray-400 transition-transform" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-gray-400 transition-transform" />
                                    )}
                                    <Key className="h-3.5 w-3.5 text-gray-400" />
                                    <span>{category}</span>
                                    <span className="text-[10px] font-normal text-gray-400 lowercase">
                                      ({assignedInMod}/{modAllActions.length} rights)
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (handleBatchPermissionsToggle) {
                                          handleBatchPermissionsToggle(modAllActions, !isModFull, category);
                                        }
                                      }}
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                        isModFull
                                          ? "bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                                          : "bg-blue-50 text-[#007aff] border-blue-100 hover:bg-blue-100"
                                      }`}
                                    >
                                      {isModFull ? "Deselect All" : "Select All"}
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            {isExpanded &&
                              (modCat.resources || []).map((res) => {
                                if (!res.actions || res.actions.length === 0) return null;

                                return (
                                  <tr
                                    key={`${moduleKey}-${res.resource_id}`}
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

          {/* GROUP PERMISSIONS TAB (Enterprise Backend-Driven RBAC) */}
          {activeTab === "groupPermissions" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" /> Enterprise Permission Groups
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Backend-driven functional permission packs. Granting or revoking a group automatically assigns all underlying rights in the database.
                  </p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={groupSearch}
                    onChange={(e) => setGroupSearch(e.target.value)}
                    placeholder="Search groups or modules..."
                    className="w-full pl-8 pr-7 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#007aff] focus:bg-white transition-all text-gray-800"
                  />
                  {groupSearch && (
                    <button
                      onClick={() => setGroupSearch("")}
                      className="absolute right-2.5 top-1.5 text-xs text-gray-400 hover:text-gray-600 font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Summary Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50/70 border border-gray-100 rounded-xl text-xs gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-700">Quick Actions:</span>
                  <button
                    type="button"
                    onClick={handleGrantAllGroups}
                    disabled={groupsLoading}
                    className="px-2.5 py-1 bg-gray-900 hover:bg-black text-white rounded-lg font-bold text-[11px] transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
                  >
                    Grant All Groups
                  </button>
                  <button
                    type="button"
                    onClick={handleRevokeAllGroups}
                    disabled={groupsLoading}
                    className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg font-bold text-[11px] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Revoke All
                  </button>
                </div>
                <span className="text-gray-400 font-medium text-[11px]">
                  {backendGroups.filter((g) => g.status === "FULL").length} of {backendGroups.length} Groups fully active
                </span>
              </div>

              {/* Group Cards */}
              {groupsLoading && backendGroups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <div className="h-6 w-6 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-gray-400 font-semibold">Loading enterprise permission groups...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {backendGroups
                    .filter((g) => {
                      if (!groupSearch.trim()) return true;
                      const q = groupSearch.toLowerCase().trim();
                      return (
                        g.name?.toLowerCase().includes(q) ||
                        g.description?.toLowerCase().includes(q) ||
                        (g.modules || []).some((m) => m.name?.toLowerCase().includes(q))
                      );
                    })
                    .map((g) => {
                      const IconComponent = resolveGroupIcon(g.icon);
                      const isExpanded = expandedGroups[g.id];
                      const isOperating = operatingGroupId === g.id;
                      const isFull = g.status === "FULL";
                      const isPartial = g.status === "PARTIAL";

                      return (
                        <div
                          key={g.id}
                          className={`border rounded-xl transition-all overflow-hidden ${
                            isFull
                              ? "bg-white border-emerald-200 shadow-2xs"
                              : isPartial
                              ? "bg-white border-amber-200 shadow-2xs"
                              : "bg-white border-gray-100"
                          }`}
                        >
                          {/* Group Header */}
                          <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div
                              className="flex items-start gap-3 cursor-pointer flex-1"
                              onClick={() => toggleGroupAccordion(g.id)}
                            >
                              <div
                                className={`p-2.5 rounded-xl border flex-shrink-0 ${
                                  isFull
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                    : isPartial
                                    ? "bg-amber-50 text-amber-600 border-amber-100"
                                    : "bg-gray-50 text-gray-400 border-gray-200"
                                }`}
                              >
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-gray-900 tracking-tight">
                                    {g.name}
                                  </h4>
                                  {isFull ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                      Full Access
                                    </span>
                                  ) : isPartial ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                                      Partial ({g.assignedCount}/{g.totalCount})
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-50 text-gray-500 border border-gray-100">
                                      No Access (0/{g.totalCount})
                                    </span>
                                  )}
                                  {g.isExplicitlyAssigned && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                                      Explicit Group
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-gray-500">{g.description}</p>
                                <p className="text-[10px] text-gray-400 font-medium">
                                  Modules:{" "}
                                  <span className="text-gray-600">
                                    {(g.modules || []).map((m) => m.name).join(", ")}
                                  </span>
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 self-end md:self-auto">
                              {!isFull && (
                                <button
                                  type="button"
                                  disabled={isOperating}
                                  onClick={() => handleGrantGroup(g)}
                                  className="px-3 py-1.5 bg-[#007aff] hover:bg-blue-600 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  {isOperating ? (
                                    <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  )}
                                  Grant Group
                                </button>
                              )}
                              {(g.assignedCount > 0 || g.isExplicitlyAssigned) && (
                                <button
                                  type="button"
                                  disabled={isOperating}
                                  onClick={() => handleRevokeGroup(g)}
                                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold border border-red-200 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  {isOperating ? (
                                    <div className="h-3.5 w-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <XCircle className="h-3.5 w-3.5" />
                                  )}
                                  Revoke
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => toggleGroupAccordion(g.id)}
                                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                title="Toggle Modules"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Modules List */}
                          {isExpanded && (
                            <div className="border-t border-gray-100 bg-gray-50/40 p-4 space-y-2.5">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                Included Modules ({g.modules?.length || 0})
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                {(g.modules || []).map((m) => {
                                  // Look up matching module in permissionRegistry for granular info
                                  const regMod = (permissionRegistry || []).find(
                                    (pr) =>
                                      pr.module_id === m.id ||
                                      (pr.module_name || "").toLowerCase() === (m.name || "").toLowerCase()
                                  );
                                  const modActionIds = (regMod?.resources || []).flatMap((r) =>
                                    (r.actions || []).map((a) => a.action_id)
                                  );
                                  const assignedInMod = modActionIds.filter((id) => assignedIds.has(id)).length;
                                  const isModFull = modActionIds.length > 0 && assignedInMod === modActionIds.length;

                                  return (
                                    <div
                                      key={m.id}
                                      className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${
                                        isModFull
                                          ? "bg-white border-emerald-200 shadow-2xs"
                                          : assignedInMod > 0
                                          ? "bg-white border-amber-200"
                                          : "bg-white border-gray-100"
                                      }`}
                                    >
                                      <div>
                                        <div className="flex items-center gap-1.5">
                                          <Key className="h-3.5 w-3.5 text-gray-400" />
                                          <span className="text-xs font-bold text-gray-800">
                                            {m.name}
                                          </span>
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-0.5 block">
                                          {modActionIds.length > 0
                                            ? `${assignedInMod}/${modActionIds.length} rights granted`
                                            : `${m.totalActions || 0} rights in database`}
                                        </span>
                                      </div>
                                      {modActionIds.length > 0 && handleBatchPermissionsToggle && (
                                        <button
                                          type="button"
                                          onClick={async () => {
                                            await handleBatchPermissionsToggle(
                                              modActionIds,
                                              !isModFull,
                                              m.name
                                            );
                                            fetchRolePermissionGroups();
                                          }}
                                          className={`px-2.5 py-1 text-[10px] font-bold rounded border transition-colors cursor-pointer ${
                                            isModFull
                                              ? "bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                                              : "bg-blue-50 text-[#007aff] border-blue-100 hover:bg-blue-100"
                                          }`}
                                        >
                                          {isModFull ? "Revoke Module" : "Grant Module"}
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* PARTNER ROLES TAB */}
          {activeTab === "partnerRoles" && (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" />
                  Partner Role Access
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isUnrestricted
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                >
                  {isUnrestricted ? "Unrestricted" : `${selectedPartnerRoleIds.size} Selected`}
                </span>
              </div>

              {/* Description */}
              <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-[11px] text-blue-700 font-medium leading-relaxed">
                Select which Partner Roles users with the <strong>{selectedRole?.name}</strong> RBAC role are allowed to access.
                <br />
                <span className="text-blue-500 font-semibold">
                  Leave all unchecked for unrestricted access (all Partner Roles allowed).
                </span>
              </div>

              {prLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <div className="h-6 w-6 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-gray-400 font-semibold">Loading access config...</span>
                </div>
              ) : (
                <div className="bg-white border border-gray-100 rounded-xl shadow-2xs overflow-hidden">
                  {/* Search bar */}
                  <div className="p-3 border-b border-gray-100 bg-gray-50/30">
                    <div className="relative">
                      <Search className="h-3.5 w-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search Partner Roles..."
                        value={prSearch}
                        onChange={(e) => setPrSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Select All / Clear All bar */}
                  <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/10">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-[11px] font-semibold text-[#007aff] hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <CheckSquare className="h-3.5 w-3.5" />
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-[11px] font-semibold text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Square className="h-3.5 w-3.5" />
                      Clear All
                    </button>
                  </div>

                  {/* Checklist */}
                  <div className="divide-y divide-gray-50 max-h-[320px] overflow-y-auto">
                    {filteredPartnerRoles.length === 0 ? (
                      <div className="text-center py-10 text-xs text-gray-400 font-semibold">
                        {prSearch ? "No partner roles match your search." : "No partner roles found."}
                      </div>
                    ) : (
                      filteredPartnerRoles.map((role) => {
                        const isChecked = selectedPartnerRoleIds.has(role.id);
                        return (
                          <label
                            key={role.id}
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50/50 ${
                              isChecked ? "bg-blue-50/30" : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handlePartnerRoleToggle(role.id)}
                              className="w-4 h-4 text-[#007aff] bg-white border-gray-300 rounded cursor-pointer focus:ring-[#007aff] focus:ring-2"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-gray-800">{role.name}</div>
                              {role.description && (
                                <div className="text-[10px] text-gray-400 font-medium mt-0.5 truncate">
                                  {role.description}
                                </div>
                              )}
                            </div>
                            {isChecked && (
                              <span className="text-[9px] font-bold text-[#007aff] bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full shrink-0">
                                ALLOWED
                              </span>
                            )}
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleCancelPartnerRoles}
                  disabled={!isDirty || prSaving}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePartnerRoles}
                  disabled={!isDirty || prSaving}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl shadow-sm shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {prSaving ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
}
