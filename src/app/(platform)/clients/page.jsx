"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import {
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
  selectClients,
  selectClientsLoading,
  clearClientsError,
} from "@/store/slices/clientsSlice";
import { selectUserType } from "@/store/slices/authSlice";
import Drawer from "@/components/drawers/Drawer";
import Modal from "@/components/modals/Modal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import axiosClient from "@/lib/axios";
import {
  Plus,
  Edit2,
  Trash2,
  Globe,
  Check,
  AlertCircle,
  Building2,
  Users,
  History,
  Info,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Search,
} from "lucide-react";

function ClientsContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clients = useSelector(selectClients);
  const isLoading = useSelector(selectClientsLoading);
  const userType = useSelector(selectUserType);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // State for Create/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    allowedCompanies: 3,
    allowedUsers: 15,
  });

  // State for Delete Confirm Dialog
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // State for Drawer
  const [selectedClient, setSelectedClient] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Drawer detail lists
  const [clientCompanies, setClientCompanies] = useState([]);
  const [clientUsers, setClientUsers] = useState([]);
  const [clientLogs, setClientLogs] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Table query states
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (userType !== "super_admin") {
      router.push("/");
      return;
    }
    dispatch(fetchClients());
  }, [dispatch, userType, router]);

  // Handle URL query parameters to open drawer automatically (e.g. from Command Palette)
  useEffect(() => {
    const id = searchParams.get("id");
    if (id && clients.length > 0) {
      const client = clients.find((c) => c.id.toString() === id);
      if (client) {
        handleOpenDrawer(client);
      }
    }
  }, [searchParams, clients]);

  const handleOpenDrawer = async (client) => {
    setSelectedClient(client);
    setDrawerOpen(true);
    setActiveTab("overview");
    setLoadingDetails(true);
    try {
      const [companiesRes, usersRes, logsRes] = await Promise.all([
        axiosClient.get("/GetCompanies"),
        axiosClient.get(`/GetUsers?clientId=${client.id}`),
        axiosClient.get(`/audit/logs?clientId=${client.id}`).catch(() => ({ data: [] })),
      ]);

      const cos = Array.isArray(companiesRes.data) ? companiesRes.data : [];
      setClientCompanies(cos.filter((c) => c.clientId === client.id));
      setClientUsers(usersRes.data?.users || []);
      setClientLogs(Array.isArray(logsRes.data) ? logsRes.data : []);
    } catch (err) {
      console.error("Failed to fetch client details:", err);
      showToast("Failed to load tenant details", "error");
    } finally {
      setLoadingDetails(false);
    }
  };

  const openModal = (client = null) => {
    dispatch(clearClientsError());
    setEditingClient(client);
    setFormData(
      client
        ? {
            name: client.name,
            email: client.email,
            password: "",
            allowedCompanies: client.allowedCompanies,
            allowedUsers: client.allowedUsers,
          }
        : { name: "", email: "", password: "", allowedCompanies: 3, allowedUsers: 15 }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingClient) {
      const data = { id: editingClient.id, ...formData };
      if (!data.password) delete data.password;
      const res = await dispatch(updateClient(data));
      if (!res.error) {
        showToast("Client updated successfully", "success");
        closeModal();
        if (selectedClient?.id === editingClient.id) {
          handleOpenDrawer(res.payload);
        }
      } else {
        showToast(res.payload, "error");
      }
    } else {
      const res = await dispatch(createClient(formData));
      if (!res.error) {
        showToast("Client created successfully", "success");
        closeModal();
      } else {
        showToast(res.payload, "error");
      }
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      const res = await dispatch(deleteClient(deleteConfirmId));
      if (!res.error) {
        showToast("Client and associated data cascaded successfully", "success");
        if (selectedClient?.id === deleteConfirmId) {
          setDrawerOpen(false);
        }
      } else {
        showToast(res.payload, "error");
      }
      setDeleteConfirmId(null);
    }
  };

  // Sort and filter logic
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const sortedClients = [...filteredClients].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === "string") {
      return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  const totalPages = Math.ceil(sortedClients.length / itemsPerPage);
  const paginatedClients = sortedClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading Platform Clients...</p>
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
            <Globe className="h-6 w-6 text-[#007aff]" />
            Platform Clients
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Global SaaS management controls for tenants, limits, and scoping.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Create Tenant Client
        </button>
      </div>

      {/* Grid with filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Filters bar */}
        <div className="p-4 border-b border-gray-50 bg-gray-50/20 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] text-gray-600 transition-colors"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
          </div>

          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Showing {filteredClients.length} of {clients.length} Clients
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
                <th
                  onClick={() => handleSort("name")}
                  className="px-6 py-4 cursor-pointer hover:text-gray-900 transition-colors"
                >
                  Client Name {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("email")}
                  className="px-6 py-4 cursor-pointer hover:text-gray-900 transition-colors"
                >
                  Admin Email {sortField === "email" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("allowedCompanies")}
                  className="px-6 py-4 cursor-pointer hover:text-gray-900 transition-colors"
                >
                  Workspaces Limit {sortField === "allowedCompanies" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("allowedUsers")}
                  className="px-6 py-4 cursor-pointer hover:text-gray-900 transition-colors"
                >
                  Users Limit {sortField === "allowedUsers" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {paginatedClients.map((client) => {
                const isSelected = selectedClient?.id === client.id;
                return (
                  <tr
                    key={client.id}
                    onClick={() => handleOpenDrawer(client)}
                    className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${
                      isSelected ? "bg-blue-50/40" : ""
                    }`}
                  >
                    <td className="px-6 py-4 font-bold text-gray-800">{client.name}</td>
                    <td className="px-6 py-4 text-gray-500 font-medium">{client.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {client.allowedCompanies} Max
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md font-bold bg-purple-50 text-purple-700 border border-purple-100">
                        {client.allowedUsers} Max
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 text-right space-x-2"
                      onClick={(e) => e.stopPropagation()} // Stop drawer from opening when clicking action icons
                    >
                      <button
                        onClick={() => openModal(client)}
                        className="p-1 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Edit limits"
                      >
                        <Edit2 className="h-4 w-4 inline" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(client.id)}
                        className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete client cascade"
                      >
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {paginatedClients.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-semibold">
                    No matching tenants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
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

      {/* Client Right Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedClient(null);
          // Clean ID from search params on close
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
                {/* Usage Meters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Company Usage Meter */}
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
                    {/* Meter Progress Bar */}
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

                  {/* User Usage Meter */}
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
                    {/* Meter Progress Bar */}
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

                {/* Profile Information Card */}
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
                      {/* Timeline dot */}
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

      {/* Create / Edit Client Limit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingClient ? "Modify Tenant Limits" : "Create Tenant Owner"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Company / Group Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
              placeholder="e.g. TNT Group"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Owner Admin Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
              placeholder="admin@tntgroup.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Password {editingClient && <span className="text-[10px] text-gray-400 font-medium lowercase">(leave blank to keep)</span>}
            </label>
            <input
              type="password"
              required={!editingClient}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Max Workspaces
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.allowedCompanies}
                onChange={(e) => setFormData({ ...formData, allowedCompanies: parseInt(e.target.value) })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Max Allowed Users
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.allowedUsers}
                onChange={(e) => setFormData({ ...formData, allowedUsers: parseInt(e.target.value) })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Save Tenant
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Cascading Confirmation Dialog */}
      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={confirmDelete}
        title="Cascading Client Deletion"
        message="Are you absolutely sure you want to delete this tenant client? This is a high-risk operation. It will permanently purge all companies, user roles, user memberships, note references, and audit histories associated with this client. This action is irreversible."
      />
    </div>
  );
}

export default function ClientsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading...</p>
      </div>
    }>
      <ClientsContent />
    </Suspense>
  );
}
