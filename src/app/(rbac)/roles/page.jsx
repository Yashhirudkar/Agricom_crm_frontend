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
  selectRolesMeta,
} from "@/store/slices/rolesSlice";
import { selectUserType } from "@/store/slices/authSlice";
import ConfirmModal from "@/components/modals/ConfirmModal";
import axiosClient from "@/lib/axios";
import { Plus, Shield, Check, AlertCircle } from "lucide-react";

import Pagination from "@/components/common/Pagination";
import RoleFilters from "@/components/roles/RoleFilters";
import RolesTable from "@/components/roles/RolesTable";
import CreateRoleModal from "@/components/roles/CreateRoleModal";
import RoleDetailsDrawer from "@/components/roles/RoleDetailsDrawer";
import useDebounce from "@/hooks/useDebounce";

function RolesContent() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const roles = useSelector(selectRoles);
  const meta = useSelector(selectRolesMeta);
  const isLoading = useSelector(selectRolesLoading);
  const error = useSelector(selectRolesError);

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

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const params = { page: currentPage, limit: itemsPerPage };
    if (debouncedSearch) params.search = debouncedSearch;
    dispatch(fetchRoles(params));
  }, [dispatch, debouncedSearch, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

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
    if (isSaving) return;
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
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteRole(deleteTarget.id)).unwrap();
      showToast("Role deleted successfully");
      if (selectedRole?.id === deleteTarget.id) {
        setDrawerOpen(false);
      }
      
      // Bug Fix: Fix pagination boundary when deleting
      const newTotal = roles.length - 1;
      const newTotalPages = Math.ceil(newTotal / itemsPerPage) || 1;
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }

      closeModals();
    } catch (err) {
      showToast(err || "Delete failed", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatLabel = (str) => {
    if (!str) return "";
    if (str === "hrpolicy") return "HR Policy";
    return str
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const assignedIds = new Set(assignedPermissions);

  const handlePermissionToggle = async (permissionId, isCurrentlyAssigned) => {
    const currentIds = latestAssignedIdsRef.current;
    let newAssignedIds;

    if (currentIds.has(permissionId)) {
      newAssignedIds = Array.from(currentIds).filter((id) => id !== permissionId);
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

  const totalPages = meta?.totalPages || 1;
  const paginatedRoles = roles;

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
          className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <RoleFilters
          search={search}
          setSearch={setSearch}
          setCurrentPage={setCurrentPage}
          filteredCount={roles.length}
          totalCount={roles.length}
        />

        <RolesTable
          paginatedRoles={paginatedRoles}
          selectedRole={selectedRole}
          handleOpenDrawer={handleOpenDrawer}
          openEdit={openEdit}
          setDeleteTarget={setDeleteTarget}
        />

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <RoleDetailsDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loadingDetails={loadingDetails}
        permissionRegistry={permissionRegistry}
        expandedModules={expandedModules}
        toggleModuleAccordion={toggleModuleAccordion}
        assignedIds={assignedIds}
        handlePermissionToggle={handlePermissionToggle}
        formatLabel={formatLabel}
        showToast={showToast}
      />

      <CreateRoleModal
        isCreateOpen={isCreateOpen}
        closeModals={closeModals}
        handleSave={handleSave}
        editingRole={editingRole}
        isCustomRole={isCustomRole}
        selectedRoleNameOption={selectedRoleNameOption}
        handleRoleNameOptionChange={handleRoleNameOptionChange}
        roles={roles}
        form={form}
        setForm={setForm}
        isSaving={isSaving}
        error={error}
      />

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
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-gray-400">Loading...</p>
        </div>
      }
    >
      <RolesContent />
    </Suspense>
  );
}
