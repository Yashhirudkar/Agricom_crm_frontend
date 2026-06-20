"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import {
  fetchCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  selectCompanies,
  selectCompaniesLoading,
  selectCompaniesError,
  clearCompaniesError,
} from "@/store/slices/companiesSlice";
import { fetchClients, selectClients } from "@/store/slices/clientsSlice";
import { selectUserType } from "@/store/slices/authSlice";
import ConfirmModal from "@/components/modals/ConfirmModal";
import axiosClient from "@/lib/axios";
import { Plus, Building2, Check, AlertCircle } from "lucide-react";

import Pagination from "@/components/common/Pagination";
import CompanyFilters from "@/components/companies/CompanyFilters";
import CompaniesTable from "@/components/companies/CompaniesTable";
import CreateCompanyModal from "@/components/companies/CreateCompanyModal";
import CompanyDetailsDrawer from "@/components/companies/CompanyDetailsDrawer";

function CompaniesContent() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const companies = useSelector(selectCompanies);
  const clients = useSelector(selectClients);
  const isLoading = useSelector(selectCompaniesLoading);
  const error = useSelector(selectCompaniesError);
  const userType = useSelector(selectUserType);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Drawer details states
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [companyUsers, setCompanyUsers] = useState([]);
  const [companyRoles, setCompanyRoles] = useState([]);
  const [companyLogs, setCompanyLogs] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Modals states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [form, setForm] = useState({ name: "", clientId: "" });

  // Settings tab form states inside drawer
  const [settingsName, setSettingsName] = useState("");
  const [settingsActive, setSettingsActive] = useState(true);

  // Query states
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchCompanies());
    if (userType === "super_admin") {
      dispatch(fetchClients());
    }
  }, [dispatch, userType]);

  // Command palette redirect binder
  useEffect(() => {
    const id = searchParams.get("id");
    if (id && companies.length > 0) {
      const company = companies.find((c) => c.id.toString() === id);
      if (company) {
        handleOpenDrawer(company);
      }
    }
  }, [searchParams, companies]);

  const handleOpenDrawer = async (company) => {
    setSelectedCompany(company);
    setSettingsName(company.name);
    setSettingsActive(company.isActive);
    setDrawerOpen(true);
    setActiveTab("overview");
    setLoadingDetails(true);

    try {
      const [usersRes, rolesRes, logsRes] = await Promise.all([
        axiosClient.get(`/GetUsers?companyId=${company.id}`),
        axiosClient.get("/GetRoles").catch(() => ({ data: [] })),
        axiosClient.get(`/audit/logs?entityType=Company`).catch(() => ({ data: [] })),
      ]);

      setCompanyUsers(usersRes.data?.users || []);
      setCompanyRoles(Array.isArray(rolesRes.data) ? rolesRes.data : []);

      const logs = Array.isArray(logsRes.data) ? logsRes.data : [];
      setCompanyLogs(logs.filter((l) => l.entityId === company.id));
    } catch (err) {
      console.error("Failed to load company drawer details:", err);
      showToast("Failed to load company workspace details", "error");
    } finally {
      setLoadingDetails(false);
    }
  };

  const openCreate = () => {
    setForm({ name: "", clientId: "" });
    setIsCreateOpen(true);
  };

  const closeModals = () => {
    setIsCreateOpen(false);
    setDeleteTarget(null);
    dispatch(clearCompaniesError());
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { name: form.name };
      if (userType === "super_admin" && form.clientId) {
        payload.clientId = Number(form.clientId);
      }
      await dispatch(createCompany(payload)).unwrap();
      showToast("Company created successfully");
      closeModals();
    } catch (err) {
      showToast(err || "Failed to create company", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    if (!settingsName.trim()) return showToast("Company name cannot be blank", "error");

    try {
      const res = await dispatch(
        updateCompany({ id: selectedCompany.id, name: settingsName, isActive: settingsActive })
      ).unwrap();
      showToast("Workspace configuration saved");
      setSelectedCompany(res);
      // Reload drawer activity
      const logsRes = await axiosClient.get(`/audit/logs?entityType=Company`).catch(() => ({ data: [] }));
      const logs = Array.isArray(logsRes.data) ? logsRes.data : [];
      setCompanyLogs(logs.filter((l) => l.entityId === selectedCompany.id));
    } catch (err) {
      showToast(err || "Save configuration failed", "error");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteCompany(deleteTarget.id)).unwrap();
      showToast("Company workspace deleted successfully");
      if (selectedCompany?.id === deleteTarget.id) {
        setDrawerOpen(false);
      }
      
      // Bug Fix: Fix pagination boundary when deleting
      const newTotal = filteredCompanies.length - 1;
      const newTotalPages = Math.ceil(newTotal / itemsPerPage) || 1;
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
      
      closeModals();
    } catch (err) {
      showToast(err || "Failed to delete company", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleActiveInline = async (company) => {
    try {
      const res = await dispatch(updateCompany({ id: company.id, isActive: !company.isActive })).unwrap();
      showToast(`Company workspace ${company.isActive ? "disabled" : "enabled"}`);
      if (selectedCompany?.id === company.id) {
        setSelectedCompany(res);
        setSettingsActive(res.isActive);
      }
    } catch (err) {
      showToast(err || "Failed to toggle status", "error");
    }
  };

  // Sorting and filtering
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toString().includes(search)
  );

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === "string") {
      return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  const totalPages = Math.ceil(sortedCompanies.length / itemsPerPage) || 1;
  const paginatedCompanies = sortedCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading && companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading workspaces...</p>
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

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-[#007aff]" />
            Company Workspaces
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            {userType === "super_admin"
              ? "Global repository of company spaces."
              : "Isolated company workspaces assigned to your tenant organization."}
          </p>
        </div>
        {(userType === "client_admin" || userType === "super_admin") && (
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Create Company Workspace
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <CompanyFilters
          search={search}
          setSearch={setSearch}
          setCurrentPage={setCurrentPage}
          filteredCount={filteredCompanies.length}
          totalCount={companies.length}
        />

        <CompaniesTable
          paginatedCompanies={paginatedCompanies}
          selectedCompany={selectedCompany}
          sortField={sortField}
          sortOrder={sortOrder}
          handleSort={handleSort}
          handleOpenDrawer={handleOpenDrawer}
          toggleActiveInline={toggleActiveInline}
          setDeleteTarget={setDeleteTarget}
          userType={userType}
        />

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <CompanyDetailsDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loadingDetails={loadingDetails}
        companyUsers={companyUsers}
        companyRoles={companyRoles}
        companyLogs={companyLogs}
        settingsName={settingsName}
        setSettingsName={setSettingsName}
        settingsActive={settingsActive}
        setSettingsActive={setSettingsActive}
        handleUpdateSettings={handleUpdateSettings}
      />

      <CreateCompanyModal
        isCreateOpen={isCreateOpen}
        closeModals={closeModals}
        handleCreateSubmit={handleCreateSubmit}
        form={form}
        setForm={setForm}
        isSaving={isSaving}
        userType={userType}
        clients={clients}
        error={error}
      />

      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={closeModals}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Workspace Company"
        message={`Delete workspace company "${deleteTarget?.name}"? All associated leads, customers, settings, and scopes under this company will be affected.`}
      />
    </div>
  );
}

export default function CompaniesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-gray-400">Loading...</p>
        </div>
      }
    >
      <CompaniesContent />
    </Suspense>
  );
}
