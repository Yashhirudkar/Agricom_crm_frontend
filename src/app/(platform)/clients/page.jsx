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
import ConfirmModal from "@/components/modals/ConfirmModal";
import axiosClient from "@/lib/axios";
import { Plus, Globe, Check, AlertCircle, Trash2 } from "lucide-react";

import Pagination from "@/components/common/Pagination";
import ClientFilters from "@/components/clients/ClientFilters";
import ClientsTable from "@/components/clients/ClientsTable";
import CreateClientModal from "@/components/clients/CreateClientModal";
import ClientDetailsDrawer from "@/components/clients/ClientDetailsDrawer";
import useDebounce from "@/hooks/useDebounce";

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
  const [isSaving, setIsSaving] = useState(false); // Bug Fix: Add isSaving

  // State for Delete Confirm Dialog
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [selectedClientIds, setSelectedClientIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false); // Bug Fix: Add isDeleting

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

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (userType !== "super_admin") {
      router.push("/");
      return;
    }
    const params = { page: currentPage, limit: itemsPerPage };
    if (debouncedSearch) params.search = debouncedSearch;
    dispatch(fetchClients(params));
  }, [dispatch, userType, router, debouncedSearch, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Handle URL query parameters to open drawer automatically
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
    if (isSaving) return; // Prevent duplicate requests
    setIsSaving(true);
    try {
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
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId || isDeleting) return; // Prevent duplicate requests
    setIsDeleting(true);
    try {
      const idsToDelete = Array.isArray(deleteConfirmId) ? deleteConfirmId : [deleteConfirmId];
      let hasError = false;
      let errorPayload = "";

      for (const id of idsToDelete) {
        const res = await dispatch(deleteClient(id));
        if (res.error) {
          hasError = true;
          errorPayload = res.payload;
        }
      }

      if (!hasError) {
        showToast(`${idsToDelete.length} client(s) and associated data cascaded successfully`, "success");
        if (idsToDelete.includes(selectedClient?.id)) {
          setDrawerOpen(false);
        }
        
        setSelectedClientIds(prev => prev.filter(id => !idsToDelete.includes(id)));

        // Bug Fix: Fix pagination boundary when deleting
        const newTotal = clients.length - idsToDelete.length;
        const newTotalPages = Math.ceil(newTotal / itemsPerPage) || 1;
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }
      } else {
        showToast(errorPayload || "Failed to delete client(s)", "error");
      }
    } finally {
      setDeleteConfirmId(null);
      setIsDeleting(false);
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

  // No local sorting/pagination, handled by backend
  // In a real scenario, sort parameters would be passed to backend too
  const paginatedClients = clients;
  const meta = useSelector((state) => state.clients.meta);
  const totalPages = meta?.totalPages || 1;

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
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {selectedClientIds.length > 0 && (
            <button
              onClick={() => setDeleteConfirmId(selectedClientIds)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-red-500/20 cursor-pointer transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Delete Selected ({selectedClientIds.length})
            </button>
          )}
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" /> Create Tenant Client
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <ClientFilters
          search={search}
          setSearch={setSearch}
          setCurrentPage={setCurrentPage}
          filteredCount={clients.length}
          totalCount={clients.length}
        />

        <ClientsTable
          paginatedClients={paginatedClients}
          selectedClient={selectedClient}
          sortField={sortField}
          sortOrder={sortOrder}
          handleSort={handleSort}
          handleOpenDrawer={handleOpenDrawer}
          openModal={openModal}
          setDeleteConfirmId={setDeleteConfirmId}
          selectedClientIds={selectedClientIds}
          setSelectedClientIds={setSelectedClientIds}
        />

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <ClientDetailsDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loadingDetails={loadingDetails}
        clientCompanies={clientCompanies}
        clientUsers={clientUsers}
        clientLogs={clientLogs}
      />

      <CreateClientModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        editingClient={editingClient}
        isSaving={isSaving}
      />

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={confirmDelete}
        title="Cascading Client Deletion"
        message="Are you absolutely sure you want to delete this tenant client? This is a high-risk operation. It will permanently purge all companies, user roles, user memberships, note references, and audit histories associated with this client. This action is irreversible."
        loading={isDeleting}
        isDestructive={true}
      />
    </div>
  );
}

export default function ClientsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-gray-400">Loading...</p>
        </div>
      }
    >
      <ClientsContent />
    </Suspense>
  );
}
