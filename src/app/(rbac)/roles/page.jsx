"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  selectRoles,
  selectRolesLoading,
  selectRolesError,
  clearRolesError,
} from "@/store/slices/rolesSlice";
// Legacy permissions slice removed
import { selectUserType } from "@/store/slices/authSlice";
import Drawer from "@/components/drawers/Drawer";
import Modal from "@/components/modals/Modal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import axiosClient from "@/lib/axios";
import {
  Plus,
  Edit2,
  Trash2,
  Shield,
  Check,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Search,
  Key,
} from "lucide-react";

function RolesContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const roles = useSelector(selectRoles);
  const allPermissions = []; // useSelector(selectPermissions);
  const isLoading = useSelector(selectRolesLoading);
  const error = useSelector(selectRolesError);
  const userType = useSelector(selectUserType);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Drawer details states
  const [selectedRole, setSelectedRole] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [assignedPermissions, setAssignedPermissions] = useState([]);
  const latestAssignedIdsRef = useRef(new Set());
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});

  // Modals states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [form, setForm] = useState({ name: "", description: "" });
  const [selectedRoleNameOption, setSelectedRoleNameOption] = useState("");
  const [isCustomRole, setIsCustomRole] = useState(false);

  // Query states
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [permissionRegistry, setPermissionRegistry] = useState([]);
  const [registryLoading, setRegistryLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchRoles());
    const fetchRegistry = async () => {
      setRegistryLoading(true);
      try {
        const res = await axiosClient.get("/system/matrix/registry");
        setPermissionRegistry(res.data || []);
      } catch (err) {
        console.error("Failed to load permission registry:", err);
      } finally {
        setRegistryLoading(false);
      }
    };
    fetchRegistry();
  }, [dispatch]);

  // Handle query parameter (for automatic drawer opening from Command Palette)
  useEffect(() => {
    const id = searchParams.get("id");
    if (id && roles.length > 0) {
      const roleObj = roles.find((r) => r.id.toString() === id);
      if (roleObj) {
        handleOpenDrawer(roleObj);
      }
    }
  }, [searchParams, roles]);

  const handleOpenDrawer = async (roleObj) => {
    setSelectedRole(roleObj);
    setDrawerOpen(true);
    setActiveTab("overview");
    setLoadingDetails(true);
    setExpandedModules({});

    try {
      const res = await axiosClient.get(`/GetRolePermissions?roleId=${roleObj.id}`);
      const roleData = res.data?.roleActionPermissions || res.data || [];
      // roleActionPermissions objects have resource_action_id
      setAssignedPermissions(roleData.map((p) => p.resource_action_id));
      latestAssignedIdsRef.current = new Set(roleData.map((p) => p.resource_action_id));
    } catch (err) {
      console.error("Failed to load role permissions:", err);
      showToast("Failed to load role permissions", "error");
    } finally {
      setLoadingDetails(false);
    }
  };

  const openCreate = () => {
    dispatch(clearRolesError());
    setForm({ name: "", description: "" });
    setSelectedRoleNameOption("");
    setIsCustomRole(false);
    setEditingRole(null);
    setIsCreateOpen(true);
  };

  const openEdit = (role) => {
    dispatch(clearRolesError());
    setForm({ name: role.name, description: role.description || "" });
    setSelectedRoleNameOption(role.name);
    setIsCustomRole(false);
    setEditingRole(role);
    setIsCreateOpen(true);
  };

  const closeModals = () => {
    setIsCreateOpen(false);
    setEditingRole(null);
    setDeleteTarget(null);
    setSelectedRoleNameOption("");
    setIsCustomRole(false);
    dispatch(clearRolesError());
  };

  const handleRoleNameOptionChange = (val) => {
    setSelectedRoleNameOption(val);
    if (val === "new_role") {
      setIsCustomRole(true);
      setForm((prev) => ({ ...prev, name: "" }));
    } else {
      setIsCustomRole(false);
      const matchedRole = roles.find((r) => r.name === val);
      setForm((prev) => ({
        ...prev,
        name: val,
        description: matchedRole ? matchedRole.description || "" : prev.description,
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingRole) {
        const res = await dispatch(updateRole({ id: editingRole.id, ...form })).unwrap();
        showToast("Role updated successfully");
        if (selectedRole?.id === editingRole.id) {
          setSelectedRole(res);
        }
      } else {
        await dispatch(createRole(form)).unwrap();
        showToast("Role created successfully");
      }
      closeModals();
    } catch (err) {
      showToast(err || "Save failed", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteRole(deleteTarget.id)).unwrap();
      showToast("Role deleted successfully");
      if (selectedRole?.id === deleteTarget.id) {
        setDrawerOpen(false);
      }
      closeModals();
    } catch (err) {
      showToast(err || "Delete failed", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const getCategory = (moduleName) => {
    if (!moduleName) return "Other Modules";
    const mod = moduleName.toUpperCase();
    if (mod === "HR") return "HR Module";
    if (mod === "CRM") return "CRM Module";
    if (mod === "ADMINISTRATION") return "Administration Module";
    return `${moduleName} Module`;
  };

  const formatLabel = (str) => {
    if (!str) return "";
    if (str === 'hrpolicy') return 'HR Policy';
    return str
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // The matrix registry is already grouped by module
  const groupedRegistry = permissionRegistry;

  const assignedIds = new Set(assignedPermissions);

  const handlePermissionToggle = async (permissionId, isCurrentlyAssigned) => {
    const currentIds = latestAssignedIdsRef.current;
    let newAssignedIds;
    
    if (currentIds.has(permissionId)) {
      newAssignedIds = Array.from(currentIds).filter(id => id !== permissionId);
    } else {
      newAssignedIds = [...new Set([...Array.from(currentIds), permissionId])];
    }
    
    // Optimistic update of refs and UI
    latestAssignedIdsRef.current = new Set(newAssignedIds);
    setAssignedPermissions(newAssignedIds);

    try {
      await axiosClient.post("/UpdateRolePermissions", {
        roleId: selectedRole.id,
        permissionIds: newAssignedIds,
      });
      showToast(currentIds.has(permissionId) ? "Permission disabled" : "Permission enabled");
    } catch (err) {
      showToast("Failed to update role permission settings", "error");
    }
  };

  const toggleModuleAccordion = (category) => {
    setExpandedModules((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Sorting/filtering roles list
  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if ((isLoading && roles.length === 0) || registryLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading RBAC roles...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
        >
          {toast.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#007aff]" />
            Security RBAC Roles
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Configure system and custom client roles. Manage scoped permissions matrix.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Create Custom Role
        </button>
      </div>

      {/* Grid table list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-50 bg-gray-50/20 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] text-gray-600 transition-colors"
              placeholder="Search roles..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
          </div>

          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Showing {filteredRoles.length} of {roles.length} Roles
          </div>
        </div>

        {/* Roles Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
                <th className="px-6 py-4">Role ID</th>
                <th className="px-6 py-4">Role Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {paginatedRoles.map((role) => {
                const isSelected = selectedRole?.id === role.id;
                return (
                  <tr
                    key={role.id}
                    onClick={() => handleOpenDrawer(role)}
                    className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${isSelected ? "bg-blue-50/40" : ""
                      }`}
                  >
                    <td className="px-6 py-4 text-gray-400 font-mono font-semibold">#{role.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">
                          {role.name
                            ?.split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                        </span>
                        {role.isSystemRole && (
                          <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded text-[9px] font-bold">
                            System
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      {role.description || <span className="text-gray-300 italic">No description</span>}
                    </td>
                    <td
                      className="px-6 py-4 text-right space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => openEdit(role)}
                        className="p-1 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Edit details"
                      >
                        <Edit2 className="h-4 w-4 inline" />
                      </button>
                      {!role.isSystemRole && (
                        <button
                          onClick={() => setDeleteTarget(role)}
                          className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete role"
                        >
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {paginatedRoles.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-semibold">
                    No matching roles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-50 bg-gray-50/20 flex items-center justify-between text-xs font-semibold text-gray-500">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-opacity cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-opacity cursor-pointer flex items-center gap-1"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Role Details Drawer */}
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
                                <td colSpan="2" className="px-4 py-2.5 font-bold text-gray-700 text-[11px] uppercase tracking-wider">
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
                              {isExpanded && (modCat.resources || []).map((res) => {
                                if (!res.actions || res.actions.length === 0) return null;
                                
                                return (
                                  <tr key={res.resource_id} className="hover:bg-gray-50/30 transition-colors">
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
                                                ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300' 
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:bg-gray-50'
                                              }`}
                                              title={act.action_name}
                                            >
                                              <input
                                                type="checkbox"
                                                className="w-3.5 h-3.5 text-[#007aff] bg-white border-gray-300 rounded cursor-pointer focus:ring-[#007aff]"
                                                checked={isAssigned}
                                                onChange={() => handlePermissionToggle(act.action_id, isAssigned)}
                                              />
                                              {act.action_name.replace(/_/g, ' ').toUpperCase()}
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={closeModals}
        title={editingRole ? "Edit Role Configuration" : "New Custom Scoped Role"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Role Name
            </label>
            <select
              required
              value={isCustomRole ? "new_role" : selectedRoleNameOption}
              onChange={(e) => handleRoleNameOptionChange(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-white mb-2"
            >
              <option value="" disabled>
                Select Role Name...
              </option>
              {Array.from(new Set(roles.map((r) => r.name)))
                .filter(Boolean)
                .map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              <option value="new_role" className="font-semibold text-[#007aff]">
                + Create New Role...
              </option>
            </select>

            {isCustomRole && (
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 mt-2"
                placeholder="Enter custom role name (e.g. Sales Coordinator)"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description of role permissions..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={closeModals}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              {isSaving && <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Save Configuration
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Role"
        message="Are you sure you want to delete this role? Any users assigned to it may lose their current access privileges."
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function RolesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading...</p>
      </div>
    }>
      <RolesContent />
    </Suspense>
  );
}
