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
  selectCompaniesMetadata,
} from "@/store/slices/companiesSlice";
import { selectClients, fetchClients } from "@/store/slices/clientsSlice";
import { selectUserType, fetchCurrentUser } from "@/store/slices/authSlice";
import ConfirmModal from "@/components/modals/ConfirmModal";
import axiosClient from "@/lib/axios";
import { Plus, Building2, Check, AlertCircle } from "lucide-react";
import Pagination from "@/components/common/Pagination";
import CompanyFilters from "@/components/companies/CompanyFilters";
import CompaniesTable from "@/components/companies/CompaniesTable";
import CreateCompanyModal from "@/components/companies/CreateCompanyModal";
import CompanyDetailsDrawer from "@/components/companies/CompanyDetailsDrawer";
import useSystemOptions from "@/hooks/useSystemOptions";

const defaultFormState = {
  name: "",
  legalName: "",
  companyCode: "",
  clientId: "",
  companyType: "",
  industryType: "",
  description: "",
  registrationNumber: "",
  taxNumber: "",
  employeeCount: "",
  companySize: "",
  establishedYear: "",
  logoUrl: "",
  faviconUrl: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
};

function CompaniesContent() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const companies = useSelector(selectCompanies);
  const metadata = useSelector(selectCompaniesMetadata);
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [form, setForm] = useState(defaultFormState);
  const [editCompanyId, setEditCompanyId] = useState(null);
  
  const { options } = useSystemOptions();

  // Settings tab form states inside drawer
  const [settingsName, setSettingsName] = useState("");
  const [settingsActive, setSettingsActive] = useState(true);

  // Query states
  const [search, setSearch] = useState("");
  const [companyTypeFilter, setCompanyTypeFilter] = useState("ALL");
  const [industryTypeFilter, setIndustryTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    dispatch(fetchCompanies({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      companyType: companyTypeFilter,
      industryType: industryTypeFilter,
      status: statusFilter,
      sortField,
      sortOrder,
    }));
  }, [dispatch, currentPage, itemsPerPage, debouncedSearch, companyTypeFilter, industryTypeFilter, statusFilter, sortField, sortOrder]);

  useEffect(() => {
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
      setCompanyRoles(rolesRes.data?.data || (Array.isArray(rolesRes.data) ? rolesRes.data : []));

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
    setForm(defaultFormState);
    setIsEditMode(false);
    setEditCompanyId(null);
    setIsCreateOpen(true);
  };

  const openEdit = (company) => {
    setForm({
      name: company.name || "",
      legalName: company.legalName || "",
      companyCode: company.companyCode || "",
      clientId: company.clientId || "",
      companyType: company.companyType || "",
      industryType: company.industryType || "",
      description: company.description || "",
      registrationNumber: company.registrationNumber || "",
      taxNumber: company.taxNumber || "",
      employeeCount: company.employeeCount || "",
      companySize: company.companySize || "",
      establishedYear: company.establishedYear || "",
      logoUrl: company.logoUrl || "",
      faviconUrl: company.faviconUrl || "",
      email: company.email || "",
      phone: company.phone || "",
      website: company.website || "",
      address: company.address || "",
      city: company.city || "",
      state: company.state || "",
      country: company.country || "",
      pincode: company.pincode || "",
    });
    setIsEditMode(true);
    setEditCompanyId(company.id);
    setIsCreateOpen(true);
  };

  const closeModals = () => {
    setIsCreateOpen(false);
    setDeleteTarget(null);
    setEditCompanyId(null);
    setIsEditMode(false);
    dispatch(clearCompaniesError());
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...form };
      
      if (userType === "super_admin" && form.clientId) {
        payload.clientId = Number(form.clientId);
      }

      // Convert number fields safely
      if (payload.employeeCount) payload.employeeCount = Number(payload.employeeCount);
      else delete payload.employeeCount;

      if (payload.establishedYear) payload.establishedYear = Number(payload.establishedYear);
      else delete payload.establishedYear;

      // Clean empty string fields
      Object.keys(payload).forEach(key => {
        if (payload[key] === "") delete payload[key];
      });

      if (payload.companyCode) {
        payload.companyCode = payload.companyCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
      }

      if (isEditMode) {
        // Backend UpdateCompanyDto doesn't accept clientId
        delete payload.clientId;
        const res = await dispatch(updateCompany({ id: editCompanyId, ...payload })).unwrap();
        showToast("Enterprise Company updated successfully");
        if (selectedCompany?.id === res.id) {
            setSelectedCompany(res);
            setSettingsName(res.name);
        }
      } else {
        await dispatch(createCompany(payload)).unwrap();
        showToast("Enterprise Company created successfully");
        setCurrentPage(1);
        dispatch(fetchCompanies({
          page: 1, limit: itemsPerPage, search: debouncedSearch,
          companyType: companyTypeFilter, industryType: industryTypeFilter, status: statusFilter,
          sortField, sortOrder
        }));
      }
      // Refetch profile to update sidebar branding
      dispatch(fetchCurrentUser());
      closeModals();
    } catch (err) {
      showToast(err || `Failed to ${isEditMode ? "update" : "create"} company`, "error");
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
      await dispatch(deleteCompany(deleteTarget)).unwrap();
      showToast("Enterprise Company deleted securely");
      setDeleteTarget(null);
      dispatch(fetchCompanies({
        page: currentPage, limit: itemsPerPage, search: debouncedSearch,
        companyType: companyTypeFilter, industryType: industryTypeFilter, status: statusFilter,
        sortField, sortOrder
      }));
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

  if (isLoading && companies.length === 0) {
    return (
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6 animate-pulse">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded-xl" />
          <div className="h-10 w-40 bg-gray-200 rounded-xl" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex gap-4">
            <div className="h-10 w-1/3 bg-gray-100 rounded-xl" />
            <div className="h-10 w-1/4 bg-gray-100 rounded-xl" />
            <div className="h-10 w-1/4 bg-gray-100 rounded-xl" />
          </div>
          <div className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="p-4 flex gap-6 items-center">
                <div className="h-10 w-10 bg-gray-200 rounded-xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/4 bg-gray-200 rounded" />
                  <div className="h-3 w-1/3 bg-gray-100 rounded" />
                </div>
                <div className="h-6 w-24 bg-gray-200 rounded-full" />
                <div className="h-8 w-8 bg-gray-200 rounded-lg shrink-0" />
              </div>
            ))}
          </div>
        </div>
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
            Enterprise Companies
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            {userType === "super_admin"
              ? "Global repository of all enterprise companies."
              : "Isolated company workspaces assigned to your tenant organization."}
          </p>
        </div>
        {(userType === "client_admin" || userType === "super_admin") && (
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Create Company
          </button>
        )}
      </div>

      {/* Filters */}
      <CompanyFilters
        search={search}
        setSearch={setSearch}
        companyTypeFilter={companyTypeFilter}
        setCompanyTypeFilter={setCompanyTypeFilter}
        industryTypeFilter={industryTypeFilter}
        setIndustryTypeFilter={setIndustryTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setCurrentPage={setCurrentPage}
        filteredCount={companies.length}
        totalCount={metadata.total}
        options={options}
      />

      {/* Main Table Area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden relative min-h-[400px]">
        {isLoading && companies.length > 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-[#007aff]/30 border-t-[#007aff] rounded-full animate-spin"></div>
          </div>
        )}
        <CompaniesTable
          paginatedCompanies={companies}
          selectedCompany={selectedCompany}
          sortField={sortField}
          sortOrder={sortOrder}
          handleSort={handleSort}
          handleOpenDrawer={handleOpenDrawer}
          toggleActiveInline={toggleActiveInline}
          setDeleteTarget={setDeleteTarget}
          userType={userType}
          openEdit={openEdit}
        />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={metadata.totalPages}
        onPageChange={setCurrentPage}
      />

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
        isOpen={isCreateOpen}
        closeModals={closeModals}
        handleSubmit={handleCreateSubmit}
        form={form}
        setForm={setForm}
        isSaving={isSaving}
        userType={userType}
        clients={clients}
        error={error}
        options={options}
        isEditMode={isEditMode}
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
