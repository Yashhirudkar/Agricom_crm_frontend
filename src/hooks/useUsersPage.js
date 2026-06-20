import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "@/lib/axios";
import {
  fetchUsers,
  deleteUser,
  updateUser,
  selectUsers,
  selectUsersMeta,
} from "@/store/slices/usersSlice";
import { selectCompanies, fetchCompanies } from "@/store/slices/companiesSlice";
import { selectUserType } from "@/store/slices/authSlice";

export function useUsersPage() {
  const dispatch = useDispatch();

  const users = useSelector(selectUsers);
  const meta = useSelector(selectUsersMeta);
  const companies = useSelector(selectCompanies);
  const userType = useSelector(selectUserType);

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
  const [bulkAction, setBulkAction] = useState(null); 
  const [bulkTargetId, setBulkTargetId] = useState("");
  const [bulkRoleId, setBulkRoleId] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);

  // Assign Workspace Modal
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
    axiosClient
      .get("/GetRoles")
      .then((res) => setAvailableRoles(res.data || []))
      .catch((err) => console.error("Failed to load roles:", err));
  }, [dispatch]);

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
    const clientCompanies = companies.filter((c) => c.clientId === Number(clientId));
    setInviteCompanies(clientCompanies);
    try {
      const res = await axiosClient.get(`/GetRoles?clientId=${clientId}`);
      setInviteRoles(res.data || []);
    } catch (err) {
      showToast("Failed to fetch roles for selected client", "error");
    }
  };

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
        companies: inviteForm.companyIds.map((id) => ({
          companyId: Number(id),
          roleId: Number(inviteForm.roleId),
        })),
      };

      if (userType === "super_admin") {
        payload.clientId = Number(inviteForm.clientId);
      }

      await axiosClient.post("/CreateUser", payload);
      showToast("User account created successfully");
      dispatch(fetchUsers());
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

  const handleBulkStatus = async (status) => {
    setBulkLoading(true);
    try {
      await Promise.all(
        selectedUserIds.map((id) => dispatch(updateUser({ id, status })).unwrap())
      );
      showToast(`Successfully updated status to ${status} for ${selectedUserIds.length} users`);
      setSelectedUserIds([]);
    } catch (err) {
      showToast("Bulk status update failed", "error");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkAssignCompanySubmit = async (e) => {
    e.preventDefault();
    if (!bulkTargetId) return;
    setBulkLoading(true);
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
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkAssignRoleSubmit = async (e) => {
    e.preventDefault();
    if (!bulkRoleId) return;
    setBulkLoading(true);
    try {
      const activeCompanyId = localStorage.getItem("activeCompanyId");
      if (!activeCompanyId) {
        setBulkLoading(false);
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
    } finally {
      setBulkLoading(false);
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
      setSelectedUserIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      setDeleteTarget(null);

      const filteredUsers = users.filter((u) => {
        const matchesSearch =
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
          statusFilter === "all" ? true : u.status?.toLowerCase() === statusFilter.toLowerCase();
        const matchesCompany =
          companyFilter === "all"
            ? true
            : u.userCompanies?.some((uc) => uc.companyId.toString() === companyFilter);
        return matchesSearch && matchesStatus && matchesCompany;
      });

      const newTotal = filteredUsers.length - 1;
      const newTotalPages = Math.ceil(newTotal / itemsPerPage) || 1;
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
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

  return {
    users,
    meta,
    companies,
    userType,
    toast,
    selectedUser,
    setSelectedUser,
    drawerOpen,
    setDrawerOpen,
    activeTab,
    setActiveTab,
    userLogs,
    loadingDetails,
    inviteOpen,
    setInviteOpen,
    inviteForm,
    setInviteForm,
    availableRoles,
    inviteSaving,
    inviteClients,
    inviteCompanies,
    inviteRoles,
    selectedUserIds,
    setSelectedUserIds,
    bulkAction,
    setBulkAction,
    bulkTargetId,
    setBulkTargetId,
    bulkRoleId,
    setBulkRoleId,
    bulkLoading,
    assignWorkspaceOpen,
    setAssignWorkspaceOpen,
    assignForm,
    setAssignForm,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    companyFilter,
    setCompanyFilter,
    sortField,
    sortOrder,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    handleInviteClientChange,
    handleOpenDrawer,
    handleInviteSubmit,
    closeInviteModal,
    handleBulkStatus,
    handleBulkAssignCompanySubmit,
    handleBulkAssignRoleSubmit,
    handleAssignWorkspaceSubmit,
    handleRemoveWorkspace,
    handleDeleteUser,
    toggleUserStatusDrawer,
    handleSelectRow,
    handleSort,
  };
}
