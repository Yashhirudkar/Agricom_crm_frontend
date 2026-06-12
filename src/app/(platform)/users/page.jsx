"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  selectUsers,
  selectUsersMeta,
  selectUsersLoading,
  selectUsersError,
  clearUsersError,
} from "@/store/slices/usersSlice";
import { selectCompanies, fetchCompanies } from "@/store/slices/companiesSlice";
import { selectUserType, selectUser } from "@/store/slices/authSlice";
import Drawer from "@/components/drawers/Drawer";
import Modal from "@/components/modals/Modal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import axiosClient from "@/lib/axios";
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  Check,
  AlertCircle,
  Building2,
  Shield,
  History,
  Info,
  ChevronLeft,
  ChevronRight,
  Search,
  Mail,
  Copy,
  PlusCircle,
  XCircle,
} from "lucide-react";

function UsersContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const users = useSelector(selectUsers);
  const meta = useSelector(selectUsersMeta);
  const companies = useSelector(selectCompanies);
  const isLoading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const userType = useSelector(selectUserType);
  const currentUser = useSelector(selectUser);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Drawer states
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [userLogs, setUserLogs] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Invitation Modal states
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", password: "", roleId: "", companyIds: [], clientId: "" });
  const [availableRoles, setAvailableRoles] = useState([]);
  const [inviteSaving, setInviteSaving] = useState(false);
  const [inviteClients, setInviteClients] = useState([]);
  const [inviteCompanies, setInviteCompanies] = useState([]);
  const [inviteRoles, setInviteRoles] = useState([]);

  // Bulk operation states
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [bulkAction, setBulkAction] = useState(null); // 'company' or 'role'
  const [bulkTargetId, setBulkTargetId] = useState("");
  const [bulkRoleId, setBulkRoleId] = useState("");

  // Assign Workspace Modal (drawer sub-action)
  const [assignWorkspaceOpen, setAssignWorkspaceOpen] = useState(false);
  const [assignForm, setAssignForm] = useState({ companyId: "", roleId: "" });

  // Modals / deletes
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Table filters & sorting
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchCompanies());
    // Fetch available roles for invites and drawer
    axiosClient
      .get("/GetRoles")
      .then((res) => setAvailableRoles(res.data || []))
      .catch((err) => console.error("Failed to load roles:", err));
  }, [dispatch]);

  // Handle invite modal setup and lifecycle
  useEffect(() => {
    if (inviteOpen) {
      if (userType === "super_admin") {
        axiosClient
          .get("/clients/GetClients")
          .then((res) => setInviteClients(res.data || []))
          .catch((err) => console.error("Failed to fetch clients for invitation:", err));
        setInviteCompanies([]);
        setInviteRoles([]);
      } else {
        setInviteCompanies(companies);
        setInviteRoles(availableRoles);
      }
    }
  }, [inviteOpen, userType, companies, availableRoles]);

  const handleInviteClientChange = async (clientId) => {
    setInviteForm((prev) => ({ ...prev, clientId: clientId, roleId: "", companyIds: [] }));
    if (!clientId) {
      setInviteCompanies([]);
      setInviteRoles([]);
      return;
    }

    // Filter companies for selected client
    const clientCompanies = companies.filter((c) => c.clientId === Number(clientId));
    setInviteCompanies(clientCompanies);

    // Fetch roles for this client
    try {
      const res = await axiosClient.get(`/GetRoles?clientId=${clientId}`);
      setInviteRoles(res.data || []);
    } catch (err) {
      console.error("Failed to fetch roles for client:", err);
      showToast("Failed to fetch roles for selected client", "error");
    }
  };

  // Command palette redirect binder
  useEffect(() => {
    const id = searchParams.get("id");
    if (id && users.length > 0) {
      const userObj = users.find((u) => u.id.toString() === id);
      if (userObj) {
        handleOpenDrawer(userObj);
      }
    }
  }, [searchParams, users]);

  const handleOpenDrawer = async (userObj) => {
    setSelectedUser(userObj);
    setDrawerOpen(true);
    setActiveTab("profile");
    setLoadingDetails(true);
    try {
      const logsRes = await axiosClient.get(`/audit/logs?userId=${userObj.id}`).catch(() => ({ data: [] }));
      setUserLogs(Array.isArray(logsRes.data) ? logsRes.data : []);
    } catch (err) {
      console.error("Failed to fetch user activity logs:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteForm.name) return showToast("Full Name is required", "error");
    if (!inviteForm.email) return showToast("Email is required", "error");
    if (!inviteForm.password) return showToast("Password is required", "error");
    if (userType === "super_admin" && !inviteForm.clientId) {
      return showToast("Client selection is required for Super Admin", "error");
    }
    if (!inviteForm.roleId) return showToast("Role is required", "error");

    setInviteSaving(true);
    try {
      const payload = {
        name: inviteForm.name,
        email: inviteForm.email,
        password: inviteForm.password,
        companies: inviteForm.companyIds.map(id => ({
          companyId: Number(id),
          roleId: Number(inviteForm.roleId)
        }))
      };

      if (userType === "super_admin") {
        payload.clientId = Number(inviteForm.clientId);
      }

      await axiosClient.post("/CreateUser", payload);
      showToast("User account created successfully");
      dispatch(fetchUsers()); // reload users list to show the new user
      closeInviteModal();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create user account", "error");
    } finally {
      setInviteSaving(false);
    }
  };

  const closeInviteModal = () => {
    setInviteOpen(false);
    setInviteForm({ name: "", email: "", password: "", roleId: "", companyIds: [], clientId: "" });
    setInviteCompanies([]);
    setInviteRoles([]);
  };

  // Bulk Actions execution
  const handleBulkStatus = async (status) => {
    try {
      await Promise.all(
        selectedUserIds.map((id) => dispatch(updateUser({ id, status })).unwrap())
      );
      showToast(`Successfully updated status to ${status} for ${selectedUserIds.length} users`);
      setSelectedUserIds([]);
    } catch (err) {
      showToast("Bulk status update failed", "error");
    }
  };

  const handleBulkAssignCompanySubmit = async (e) => {
    e.preventDefault();
    if (!bulkTargetId) return;
    try {
      await Promise.all(
        selectedUserIds.map((userId) =>
          axiosClient.post("/AssignUserToCompany", {
            userId,
            companyId: Number(bulkTargetId),
            roleId: bulkRoleId ? Number(bulkRoleId) : undefined,
          })
        )
      );
      showToast(`Assigned ${selectedUserIds.length} users to company workspace`);
      setSelectedUserIds([]);
      setBulkAction(null);
      dispatch(fetchUsers());
    } catch (err) {
      showToast("Bulk workspace assignment failed", "error");
    }
  };

  const handleBulkAssignRoleSubmit = async (e) => {
    e.preventDefault();
    if (!bulkRoleId) return;
    try {
      const activeCompanyId = localStorage.getItem("activeCompanyId");
      if (!activeCompanyId) {
        return showToast("Please select a workspace context first in the header", "error");
      }
      await Promise.all(
        selectedUserIds.map((userId) =>
          axiosClient.post("/UpdateUserCompanyRole", {
            userId,
            companyId: Number(activeCompanyId),
            roleId: Number(bulkRoleId),
          })
        )
      );
      showToast(`Updated workspace role for ${selectedUserIds.length} users`);
      setSelectedUserIds([]);
      setBulkAction(null);
      dispatch(fetchUsers());
    } catch (err) {
      showToast("Bulk role assignment failed", "error");
    }
  };

  const handleAssignWorkspaceSubmit = async (e) => {
    e.preventDefault();
    if (!assignForm.companyId) return;

    try {
      await axiosClient.post("/AssignUserToCompany", {
        userId: selectedUser.id,
        companyId: Number(assignForm.companyId),
        roleId: assignForm.roleId ? Number(assignForm.roleId) : undefined,
      });
      showToast("Workspace assignment added");
      setAssignWorkspaceOpen(false);
      setAssignForm({ companyId: "", roleId: "" });

      // Refresh selected user drawer state
      const freshUser = await axiosClient.get(`/GetUserById?id=${selectedUser.id}`);
      setSelectedUser(freshUser.data);
      dispatch(fetchUsers());
    } catch (err) {
      showToast(err.response?.data?.message || "Assignment failed", "error");
    }
  };

  const handleRemoveWorkspace = async (companyId) => {
    try {
      await axiosClient.post("/RemoveUserFromCompany", {
        userId: selectedUser.id,
        companyId,
      });
      showToast("User removed from workspace");

      const freshUser = await axiosClient.get(`/GetUserById?id=${selectedUser.id}`);
      setSelectedUser(freshUser.data);
      dispatch(fetchUsers());
    } catch (err) {
      showToast("Failed to remove user from workspace", "error");
    }
  };

  const handleDeleteUser = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteUser(deleteTarget.id)).unwrap();
      showToast("User removed from platform");
      if (selectedUser?.id === deleteTarget.id) {
        setDrawerOpen(false);
      }
      setDeleteTarget(null);
    } catch (err) {
      showToast(err || "Failed to remove user", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleUserStatusDrawer = async (status) => {
    try {
      const res = await dispatch(updateUser({ id: selectedUser.id, status })).unwrap();
      setSelectedUser(res);
      showToast("User status updated successfully");
    } catch (err) {
      showToast("Failed to update status", "error");
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUserIds(paginatedUsers.map((u) => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedUserIds([...selectedUserIds, id]);
    } else {
      setSelectedUserIds(selectedUserIds.filter((x) => x !== id));
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Table filter/sort algorithms
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : u.status?.toLowerCase() === statusFilter.toLowerCase();

    // Check if user belongs to the companyId inside userCompanies
    const matchesCompany =
      companyFilter === "all"
        ? true
        : u.userCompanies?.some((uc) => uc.companyId.toString() === companyFilter);

    return matchesSearch && matchesStatus && matchesCompany;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let valA = a[sortField] || "";
    let valB = b[sortField] || "";
    if (typeof valA === "string") {
      return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            <Users className="h-6 w-6 text-[#007aff]" />
            User Access Management
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Invite users, map workspaces, and control contextual client roles.
          </p>
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Create User
        </button>
      </div>

      {/* Meta User Quota Limit Alert */}
      {meta && (
        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-blue-900">Tenant User Slot Meter</h3>
            <p className="text-[10px] text-blue-600 font-medium">
              Calculates all active, inactive, and invited user slots against your client limit.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-blue-900">
              {meta.currentUsers} / {meta.maxUsers} Users
            </span>
            <div className="w-36 h-2 bg-blue-100/70 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${meta.currentUsers >= meta.maxUsers ? "bg-red-500" : "bg-blue-500"
                  }`}
                style={{ width: `${Math.min((meta.currentUsers / meta.maxUsers) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Grid Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/20 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search Input */}
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] text-gray-600 transition-colors"
                placeholder="Search user profile..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
            </div>

            {/* Status Selector */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs outline-none focus:border-[#007aff]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="invited">Invited</option>
            </select>

            {/* Company Scope Selector */}
            <select
              value={companyFilter}
              onChange={(e) => {
                setCompanyFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs outline-none focus:border-[#007aff]"
            >
              <option value="all">All Workspaces</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {filteredUsers.length} Users found
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
                <th className="px-6 py-4 w-4">
                  <input
                    type="checkbox"
                    checked={
                      paginatedUsers.length > 0 &&
                      paginatedUsers.every((u) => selectedUserIds.includes(u.id))
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-[#007aff] focus:ring-[#007aff] cursor-pointer"
                  />
                </th>
                <th
                  onClick={() => handleSort("name")}
                  className="px-6 py-4 cursor-pointer hover:text-gray-900 transition-colors"
                >
                  User Profile {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("email")}
                  className="px-6 py-4 cursor-pointer hover:text-gray-900 transition-colors"
                >
                  Contact Email {sortField === "email" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-6 py-4">Assigned Workspaces</th>
                <th
                  onClick={() => handleSort("status")}
                  className="px-6 py-4 cursor-pointer hover:text-gray-900 transition-colors"
                >
                  Account Status {sortField === "status" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {paginatedUsers.map((u) => {
                const isSelected = selectedUser?.id === u.id;
                const isChecked = selectedUserIds.includes(u.id);
                return (
                  <tr
                    key={u.id}
                    onClick={() => handleOpenDrawer(u)}
                    className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${isSelected ? "bg-blue-50/40" : ""
                      } ${isChecked ? "bg-blue-50/20" : ""}`}
                  >
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleSelectRow(u.id, e.target.checked)}
                        className="rounded border-gray-300 text-[#007aff] focus:ring-[#007aff] cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {u.name ? u.name.slice(0, 2).toUpperCase() : "??"}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">
                            {u.name
                              ? u.name
                                .split(" ")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1).toLowerCase()
                                )
                                .join(" ")
                              : "Invitation Pending"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-semibold">{u.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {u.userCompanies && u.userCompanies.length > 0 ? (
                          u.userCompanies.map((uc) => (
                            <span
                              key={uc.companyId}
                              className="px-2 py-0.5 rounded bg-gray-50 border border-gray-200 text-[10px] text-gray-500 font-semibold"
                            >
                              {uc.company?.name || "Workspace"}
                              {uc.role && (
                                <span className="text-gray-400 font-bold ml-1">({uc.role.name})</span>
                              )}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-gray-400 font-medium">None assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${u.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : u.status === "Invited"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : u.status === "Suspended"
                              ? "bg-red-50 text-red-700 border border-red-100"
                              : "bg-gray-50 text-gray-400 border border-gray-200"
                          }`}
                      >
                        <span
                          className={`h-1 w-1 rounded-full ${u.status === "Active"
                            ? "bg-green-500"
                            : u.status === "Invited"
                              ? "bg-amber-500"
                              : u.status === "Suspended"
                                ? "bg-red-500"
                                : "bg-gray-300"
                            }`}
                        />
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setDeleteTarget(u)}
                        className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-semibold">
                    No users matching the filter criteria found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
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

      {/* Floating Bulk Action Bar */}
      {selectedUserIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[80] bg-slate-900 border border-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-5 animate-in slide-in-from-bottom-5 duration-300">
          <span className="text-xs font-bold text-slate-300 border-r border-slate-800 pr-4">
            {selectedUserIds.length} Users Selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatus("Active")}
              className="px-3 py-1.5 bg-emerald-600/90 hover:bg-emerald-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Activate
            </button>
            <button
              onClick={() => handleBulkStatus("Inactive")}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Deactivate
            </button>
            <button
              onClick={() => handleBulkStatus("Suspended")}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Suspend
            </button>
            <button
              onClick={() => {
                setBulkTargetId("");
                setBulkRoleId("");
                setBulkAction("company");
              }}
              className="px-3 py-1.5 bg-[#007aff] hover:bg-blue-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Assign Company
            </button>
            <button
              onClick={() => {
                setBulkRoleId("");
                setBulkAction("role");
              }}
              className="px-3 py-1.5 bg-[#007aff] hover:bg-blue-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Assign Role
            </button>
          </div>
          <button
            onClick={() => setSelectedUserIds([])}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer ml-2"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* User Details Drawer */}
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
                {/* Profile card */}
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
                      <span className="text-gray-400 font-medium">Client Scoping ID</span>
                      <span className="font-bold text-gray-800">Client #{selectedUser?.clientId}</span>
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

                {/* Status configuration */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-800">Account Access</p>
                    <p className="text-[10px] text-gray-400">Lock, suspend, or activate user credentials.</p>
                  </div>
                  <select
                    value={selectedUser?.status}
                    onChange={(e) => toggleUserStatusDrawer(e.target.value)}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl text-xs outline-none focus:border-[#007aff] font-bold"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Invited" disabled>
                      Invited
                    </option>
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

      {/* User Creation Modal */}
      <Modal isOpen={inviteOpen} onClose={closeInviteModal} title="Create New User Account">
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={inviteForm.name}
              onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
              placeholder="colleague@domain.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={inviteForm.password}
              onChange={(e) => setInviteForm({ ...inviteForm, password: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
              placeholder="••••••••"
            />
          </div>

          {userType === "super_admin" && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Select Target Client Tenant
              </label>
              <select
                required
                value={inviteForm.clientId}
                onChange={(e) => handleInviteClientChange(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-600 bg-white"
              >
                <option value="" disabled>
                  Select client...
                </option>
                {inviteClients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Select Base Role
            </label>
            <select
              required
              value={inviteForm.roleId}
              onChange={(e) => setInviteForm({ ...inviteForm, roleId: e.target.value })}
              disabled={userType === "super_admin" && !inviteForm.clientId}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-600 bg-white disabled:opacity-50"
            >
              <option value="" disabled>
                {userType === "super_admin" && !inviteForm.clientId
                  ? "Select a client first..."
                  : "Select role level..."}
              </option>
              {inviteRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Scope Workspaces (Optional)
            </label>
            <div className="max-h-[140px] overflow-y-auto border border-gray-100 rounded-xl p-3 bg-gray-50/50 space-y-2">
              {inviteCompanies.map((co) => {
                const isChecked = inviteForm.companyIds.includes(co.id);
                return (
                  <label key={co.id} className="flex items-center gap-2 text-xs text-gray-600 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const newIds = e.target.checked
                          ? [...inviteForm.companyIds, co.id]
                          : inviteForm.companyIds.filter((x) => x !== co.id);
                        setInviteForm({ ...inviteForm, companyIds: newIds });
                      }}
                      className="rounded border-gray-300 text-[#007aff] focus:ring-[#007aff]"
                    />
                    {co.name}
                  </label>
                );
              })}
              {userType === "super_admin" && !inviteForm.clientId && (
                <p className="text-[10px] text-gray-400 text-center font-medium">
                  Select a client first to view their workspaces.
                </p>
              )}
              {((userType !== "super_admin") || inviteForm.clientId) && inviteCompanies.length === 0 && (
                <p className="text-[10px] text-gray-400 text-center font-medium">
                  No active company workspaces to scope.
                </p>
              )}
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={closeInviteModal}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={inviteSaving}
              className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs"
            >
              {inviteSaving ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Bulk Assign Company Workspace Modal */}
      {bulkAction === "company" && (
        <Modal isOpen={true} onClose={() => setBulkAction(null)} title="Bulk Workspace Assignment">
          <form onSubmit={handleBulkAssignCompanySubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Target Workspace
              </label>
              <select
                required
                value={bulkTargetId}
                onChange={(e) => setBulkTargetId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-600 bg-white"
              >
                <option value="" disabled>
                  Select target company...
                </option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Workspace Role (Optional)
              </label>
              <select
                value={bulkRoleId}
                onChange={(e) => setBulkRoleId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-600 bg-white"
              >
                <option value="">Default Workspace Role</option>
                {availableRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setBulkAction(null)}
                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                Assign Selected Users
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Bulk Assign Workspace Role Modal */}
      {bulkAction === "role" && (
        <Modal isOpen={true} onClose={() => setBulkAction(null)} title="Bulk Role Assignment">
          <form onSubmit={handleBulkAssignRoleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Select Workspace Role
              </label>
              <select
                required
                value={bulkRoleId}
                onChange={(e) => setBulkRoleId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-600 bg-white"
              >
                <option value="" disabled>
                  Select role...
                </option>
                {availableRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setBulkAction(null)}
                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                Update Selected Roles
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Assign Workspace Sub-modal for Drawer */}
      {assignWorkspaceOpen && (
        <Modal isOpen={true} onClose={() => setAssignWorkspaceOpen(false)} title="Scope User to Workspace">
          <form onSubmit={handleAssignWorkspaceSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Select Company Workspace
              </label>
              <select
                required
                value={assignForm.companyId}
                onChange={(e) => setAssignForm({ ...assignForm, companyId: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-600 bg-white"
              >
                <option value="" disabled>
                  Select company...
                </option>
                {companies
                  .filter((co) => !selectedUser?.userCompanies?.some((uc) => uc.companyId === co.id))
                  .map((co) => (
                    <option key={co.id} value={co.id}>
                      {co.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Workspace Role (Optional)
              </label>
              <select
                value={assignForm.roleId}
                onChange={(e) => setAssignForm({ ...assignForm, roleId: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-600 bg-white"
              >
                <option value="">Default role...</option>
                {availableRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setAssignWorkspaceOpen(false)}
                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                Assign
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete User Confirmation */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteUser}
        isLoading={isDeleting}
        title="Remove User Account"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action will permanently remove their access to the platform and all associated workspaces.`}
      />
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading...</p>
      </div>
    }>
      <UsersContent />
    </Suspense>
  );
}
