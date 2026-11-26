"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/authSlice";
import usePermissions from "@/hooks/usePermissions";
import {
  Building2,
  Globe2,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Landmark,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import banksApi from "@/api/banksApi";
import axiosInstance from "@/lib/axios";
import DomesticBankModal from "@/components/banks/DomesticBankModal";
import NostroBankModal from "@/components/banks/NostroBankModal";
import DomesticBankDetailDrawer from "@/components/banks/DomesticBankDetailDrawer";
import DocumentBankPreviewDrawer from "@/components/banks/DocumentBankPreviewDrawer";

export default function BankManagementPage() {
  const [activeTab, setActiveTab] = useState("domestic"); // "domestic" | "nostro"
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  // Data states
  const [domesticBanks, setDomesticBanks] = useState([]);
  const [nostroBanks, setNostroBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modals
  const [isDomesticModalOpen, setIsDomesticModalOpen] = useState(false);
  const [editingDomesticBank, setEditingDomesticBank] = useState(null);

  const [isNostroModalOpen, setIsNostroModalOpen] = useState(false);
  const [editingNostroBank, setEditingNostroBank] = useState(null);
  const [preselectedDomesticId, setPreselectedDomesticId] = useState(null);

  const [detailDomesticBank, setDetailDomesticBank] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [previewDomesticBank, setPreviewDomesticBank] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const user = useSelector(selectUser);
  const { hasAnyPermission } = usePermissions();

  const canView = hasAnyPermission([
    "bank_management:view",
    "bank_management:read",
    "banks:view",
    "banks:read",
  ]);
  const canCreate = hasAnyPermission([
    "bank_management:create",
    "banks:create",
  ]);
  const canUpdate = hasAnyPermission([
    "bank_management:update",
    "bank_management:edit",
    "banks:update",
    "banks:edit",
  ]);
  const canDelete = hasAnyPermission([
    "bank_management:delete",
    "banks:delete",
  ]);

  const canReadCompanies = hasAnyPermission([
    "companies:read",
    "companies:view",
    "company:read",
    "company:view",
  ]);

  // Fetch Companies safely without triggering 403 authorization error
  const loadCompanies = useCallback(async () => {
    let list = user?.workspaces || [];

    // Only attempt full companies API if user has permission to read companies
    if (canReadCompanies) {
      try {
        const res = await axiosInstance.get("/GetCompanies", {
          params: { limit: 100 },
          suppressToast: true,
          skipToast: true,
          suppressErrorLog: true,
        });
        const raw = res.data;
        const fetched = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
          ? raw.data
          : raw?.rows || raw?.companies || [];
        if (fetched.length > 0) {
          list = fetched;
        }
      } catch {
        try {
          const res = await axiosInstance.get("/companies", {
            params: { limit: 100 },
            suppressToast: true,
            skipToast: true,
            suppressErrorLog: true,
          });
          const raw = res.data;
          const fetched = Array.isArray(raw)
            ? raw
            : Array.isArray(raw?.data)
            ? raw.data
            : raw?.rows || raw?.companies || [];
          if (fetched.length > 0) {
            list = fetched;
          }
        } catch {
          // Fallback to user workspaces if API not accessible
          if (user?.workspaces?.length > 0) {
            list = user.workspaces;
          }
        }
      }
    }

    if ((!list || list.length === 0) && user?.workspaces?.length > 0) {
      list = user.workspaces;
    }

    setCompanies(list || []);
  }, [user, canReadCompanies]);

  // Fetch Domestic Banks
  const loadDomesticBanks = useCallback(async () => {
    if (!canView) return;
    try {
      setLoading(true);
      const params = {};
      if (selectedCompanyId) params.companyId = selectedCompanyId;
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await banksApi.getDomesticBanks(params);
      const rows = res.data?.rows || res.data || [];
      setDomesticBanks(rows);
    } catch (err) {
      console.error("Failed to load domestic banks", err);
      showToast("Failed to load domestic banks", "error");
    } finally {
      setLoading(false);
    }
  }, [canView, selectedCompanyId, search, statusFilter]);

  // Fetch Nostro Banks
  const loadNostroBanks = useCallback(async () => {
    if (!canView) return;
    try {
      const params = {};
      if (selectedCompanyId) params.companyId = selectedCompanyId;
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await banksApi.getNostroBanks(params);
      const rows = res.data?.rows || res.data || [];
      setNostroBanks(rows);
    } catch (err) {
      console.error("Failed to load nostro banks", err);
    }
  }, [canView, selectedCompanyId, search, statusFilter]);

  // Initial load
  useEffect(() => {
    if (canView) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadCompanies();
    }
  }, [canView, loadCompanies]);

  useEffect(() => {
    if (canView) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadDomesticBanks();
      loadNostroBanks();
    }
  }, [canView, loadDomesticBanks, loadNostroBanks]);

  // ── Domestic Bank Handlers ──
  const handleOpenCreateDomestic = () => {
    if (!canCreate) return;
    setEditingDomesticBank(null);
    setIsDomesticModalOpen(true);
  };

  const handleOpenEditDomestic = (bank) => {
    if (!canUpdate) return;
    setEditingDomesticBank(bank);
    setIsDomesticModalOpen(true);
  };

  const handleSaveDomestic = async (formData) => {
    try {
      setIsSaving(true);
      if (editingDomesticBank) {
        await banksApi.updateDomesticBank(editingDomesticBank.id, formData);
        showToast("Domestic bank updated successfully");
      } else {
        await banksApi.createDomesticBank(formData);
        showToast("Domestic bank created successfully");
      }
      setIsDomesticModalOpen(false);
      loadDomesticBanks();
      loadNostroBanks();

      // Update detail modal if open
      if (detailDomesticBank && editingDomesticBank?.id === detailDomesticBank.id) {
        const refreshed = await banksApi.getDomesticBank(detailDomesticBank.id);
        setDetailDomesticBank(refreshed.data);
      }
    } catch (err) {
      console.error("Error saving domestic bank", err);
      showToast(err.response?.data?.message || "Failed to save domestic bank", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDomestic = async (bank) => {
    if (!canDelete) return;
    const nostroCount = bank.nostroAccounts?.length || 0;
    const msg = nostroCount > 0
      ? `Are you sure you want to delete ${bank.bankName}? This will also delete ${nostroCount} linked Nostro account(s).`
      : `Are you sure you want to delete ${bank.bankName}?`;

    if (!window.confirm(msg)) return;

    try {
      await banksApi.deleteDomesticBank(bank.id);
      showToast("Domestic bank deleted successfully");
      loadDomesticBanks();
      loadNostroBanks();
      if (detailDomesticBank?.id === bank.id) {
        setIsDetailModalOpen(false);
        setDetailDomesticBank(null);
      }
    } catch (err) {
      console.error("Error deleting domestic bank", err);
      showToast(err.response?.data?.message || "Failed to delete domestic bank", "error");
    }
  };

  // ── Nostro Bank Handlers ──
  const handleOpenCreateNostro = (domesticBankId = null) => {
    if (!canCreate) return;
    setEditingNostroBank(null);
    setPreselectedDomesticId(domesticBankId);
    setIsNostroModalOpen(true);
  };

  const handleOpenEditNostro = (nostro) => {
    if (!canUpdate) return;
    setEditingNostroBank(nostro);
    setPreselectedDomesticId(nostro.domesticBankId);
    setIsNostroModalOpen(true);
  };

  const handleSaveNostro = async (formData) => {
    try {
      setIsSaving(true);
      if (editingNostroBank) {
        await banksApi.updateNostroBank(editingNostroBank.id, formData);
        showToast("Nostro account updated successfully");
      } else {
        await banksApi.createNostroBank(formData);
        showToast("Nostro account linked successfully");
      }
      setIsNostroModalOpen(false);
      loadDomesticBanks();
      loadNostroBanks();

      // Refresh detail modal if open
      if (detailDomesticBank) {
        const refreshed = await banksApi.getDomesticBank(detailDomesticBank.id);
        setDetailDomesticBank(refreshed.data);
      }
    } catch (err) {
      console.error("Error saving nostro bank", err);
      showToast(err.response?.data?.message || "Failed to save nostro bank", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNostro = async (nostro) => {
    if (!canDelete) return;
    if (!window.confirm(`Delete ${nostro.currency} Nostro account (${nostro.bankName})?`)) return;

    try {
      await banksApi.deleteNostroBank(nostro.id);
      showToast("Nostro account deleted successfully");
      loadDomesticBanks();
      loadNostroBanks();

      // Refresh detail modal if open
      if (detailDomesticBank) {
        const refreshed = await banksApi.getDomesticBank(detailDomesticBank.id);
        setDetailDomesticBank(refreshed.data);
      }
    } catch (err) {
      console.error("Error deleting nostro bank", err);
      showToast(err.response?.data?.message || "Failed to delete nostro bank", "error");
    }
  };

  // ── Detail & Preview Handlers ──
  const handleViewDomesticDetails = async (bank) => {
    try {
      const res = await banksApi.getDomesticBank(bank.id);
      setDetailDomesticBank(res.data);
      setIsDetailModalOpen(true);
    } catch (err) {
      console.error("Failed to load details", err);
      setDetailDomesticBank(bank);
      setIsDetailModalOpen(true);
    }
  };

  const handleOpenPreview = async (bank) => {
    try {
      const res = await banksApi.getDomesticBank(bank.id);
      setPreviewDomesticBank(res.data);
    } catch {
      setPreviewDomesticBank(bank);
    }
    setIsPreviewModalOpen(true);
  };

  // Statistics
  const totalDomestic = domesticBanks.length;
  const totalNostro = nostroBanks.length;

  if (!canView) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md text-center">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Access Restricted</h2>
          <p className="text-sm text-gray-500">
            You do not have permission to view Bank Management. Please contact your administrator for access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 space-y-4">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
          }`}
        >
          {toast.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
            <span>Accounts</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-blue-600 font-bold">Bank Management</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Landmark className="h-7 w-7 text-blue-600" />
            Bank Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Enterprise multi-currency banking system: 1 Domestic Bank → Many linked foreign currency Nostro accounts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadDomesticBanks()}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-gray-600 transition-colors shadow-xs"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          </button>

          {canCreate && (
            <button
              onClick={handleOpenCreateDomestic}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
            >
              <Plus className="h-4 w-4" />
              + Add Domestic Bank
            </button>
          )}
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          {/* Tab buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("domestic")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "domestic"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Building2 className="h-4 w-4" />
              Domestic Banks ({totalDomestic})
            </button>

            <button
              onClick={() => setActiveTab("nostro")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "nostro"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Globe2 className="h-4 w-4" />
              Linked Nostro Banks ({totalNostro})
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Company filter */}
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Companies</option>
              {companies.map((co) => (
                <option key={co.id} value={co.id}>
                  {co.name || co.legalName}
                </option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search bank name, A/C, SWIFT..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-white w-56 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* ── Tab 1: Domestic Banks Table ── */}
        {activeTab === "domestic" && (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-[10px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Enterprise Company</th>
                  <th className="px-4 py-3">Bank Name</th>
                  <th className="px-4 py-3">Currency</th>
                  <th className="px-4 py-3">Account Number</th>
                  <th className="px-4 py-3">SWIFT Code</th>
                  <th className="px-4 py-3">Linked Nostro Accounts</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white font-medium">
                {domesticBanks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400">
                      <Building2 className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-xs font-bold text-gray-600">No Domestic Banks Found</p>
                      {canCreate ? (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Click &quot;+ Add Domestic Bank&quot; above to register your primary settlement bank.
                        </p>
                      ) : (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          No domestic banks are currently registered.
                        </p>
                      )}
                    </td>
                  </tr>
                ) : (
                  domesticBanks.map((db) => {
                    const linked = db.nostroAccounts || [];
                    return (
                      <tr key={db.id} className="hover:bg-blue-50/20 transition-colors group">
                        {/* Company */}
                        <td className="px-4 py-3">
                          <span className="font-bold text-gray-900 block">
                            {db.company?.legalName || db.company?.name || "Agricom Impex"}
                          </span>
                        </td>

                        {/* Bank Name */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleViewDomesticDetails(db)}
                            className="font-bold text-blue-600 hover:text-blue-800 hover:underline text-left cursor-pointer"
                          >
                            {db.bankName?.toUpperCase()}
                          </button>
                          <span className="text-[10px] text-gray-400 line-clamp-1 block max-w-xs">
                            {db.bankAddress?.toUpperCase()}
                          </span>
                        </td>

                        {/* Currency */}
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-black bg-blue-50 text-blue-700 border border-blue-200">
                            {db.currency || "INR"}
                          </span>
                        </td>

                        {/* Account Number */}
                        <td className="px-4 py-3 font-mono font-bold text-gray-900">
                          {db.accountNumber}
                        </td>

                        {/* SWIFT Code */}
                        <td className="px-4 py-3 font-mono font-bold text-blue-700">
                          {db.swiftCode}
                        </td>

                        {/* Linked Nostro Accounts */}
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {linked.length === 0 ? (
                              <span className="text-[11px] text-gray-400 italic">None linked</span>
                            ) : (
                              linked.map((n) => (
                                <span
                                  key={n.id}
                                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  title={`${n.bankName?.toUpperCase()} (A/C: ${n.accountNumber})`}
                                >
                                  {n.currency}
                                </span>
                              ))
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              db.status === "Active"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                            }`}
                          >
                            {db.status === "Active" ? (
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                            ) : (
                              <XCircle className="h-3 w-3 text-gray-400" />
                            )}
                            {db.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => handleViewDomesticDetails(db)}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                            title="View Linked Nostro Accounts & Bank Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenPreview(db)}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer"
                            title="Preview PDF Output Layout"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          {canUpdate && (
                            <button
                              onClick={() => handleOpenEditDomestic(db)}
                              className="p-1.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                              title="Edit Domestic Bank"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteDomestic(db)}
                              className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                              title="Delete Domestic Bank"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Tab 2: Linked Nostro Banks Table ── */}
        {activeTab === "nostro" && (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-[10px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Currency</th>
                  <th className="px-4 py-3">Nostro Bank Name</th>
                  <th className="px-4 py-3">Account Name & Number</th>
                  <th className="px-4 py-3">SWIFT Code</th>
                  <th className="px-4 py-3">Parent Domestic Bank</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white font-medium">
                {nostroBanks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      <Globe2 className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-xs font-bold text-gray-600">No Nostro Accounts Found</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Link foreign currency correspondent banks to your domestic bank accounts.
                      </p>
                    </td>
                  </tr>
                ) : (
                  nostroBanks.map((n) => (
                    <tr key={n.id} className="hover:bg-emerald-50/20 transition-colors">
                      {/* Currency */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {n.currency}
                        </span>
                      </td>

                      {/* Nostro Bank Name */}
                      <td className="px-4 py-3">
                        <span className="font-bold text-gray-900 block">{n.bankName?.toUpperCase()}</span>
                        <span className="text-[10px] text-gray-400 block line-clamp-1">
                          {n.bankAddress?.toUpperCase()}
                        </span>
                      </td>

                      {/* Account Name & Number */}
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-gray-800 block">
                          {n.accountNumber}
                        </span>
                        <span className="text-[10px] text-gray-500 block">
                          {n.accountName?.toUpperCase()}
                        </span>
                      </td>

                      {/* SWIFT Code */}
                      <td className="px-4 py-3 font-mono font-bold text-blue-700">
                        {n.swiftCode}
                      </td>

                      {/* Parent Domestic Bank */}
                      <td className="px-4 py-3">
                        <span className="font-bold text-gray-900 block">
                          {n.domesticBank?.bankName?.toUpperCase() || "—"}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono block">
                          A/C: {n.domesticBank?.accountNumber} ({n.domesticBank?.currency || "INR"})
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            n.status === "Active"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {n.status === "Active" ? (
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                          ) : (
                            <XCircle className="h-3 w-3 text-gray-400" />
                          )}
                          {n.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                        {canUpdate && (
                          <button
                            onClick={() => handleOpenEditNostro(n)}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer"
                            title="Edit Nostro Account"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteNostro(n)}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete Nostro Account"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                        {!canUpdate && !canDelete && (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modals ── */}

      {/* Domestic Bank Modal (Add / Edit) */}
      <DomesticBankModal
        isOpen={isDomesticModalOpen}
        onClose={() => setIsDomesticModalOpen(false)}
        onSubmit={handleSaveDomestic}
        initialData={editingDomesticBank}
        companies={companies}
        isSaving={isSaving}
      />

      {/* Nostro Bank Modal (Add / Edit) */}
      <NostroBankModal
        isOpen={isNostroModalOpen}
        onClose={() => setIsNostroModalOpen(false)}
        onSubmit={handleSaveNostro}
        initialData={editingNostroBank}
        companies={companies}
        domesticBanks={domesticBanks}
        preselectedDomesticBankId={preselectedDomesticId}
        isSaving={isSaving}
      />

      {/* Domestic Bank Detail Drawer with Linked Nostro Accounts & Currency Accounts */}
      <DomesticBankDetailDrawer
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setDetailDomesticBank(null);
        }}
        domesticBank={detailDomesticBank}
        canCreate={canCreate}
        canUpdate={canUpdate}
        canDelete={canDelete}
        onEditDomestic={(bank) => {
          setIsDetailModalOpen(false);
          handleOpenEditDomestic(bank);
        }}
        onAddNostro={(domesticId) => {
          handleOpenCreateNostro(domesticId);
        }}
        onEditNostro={(nostro) => {
          handleOpenEditNostro(nostro);
        }}
        onDeleteNostro={(nostro) => {
          handleDeleteNostro(nostro);
        }}
        onRefresh={() => {
          loadDomesticBanks();
          loadNostroBanks();
        }}
      />

      {/* Document Bank Details Preview Drawer */}
      <DocumentBankPreviewDrawer
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setPreviewDomesticBank(null);
        }}
        domesticBank={previewDomesticBank}
        linkedNostroAccounts={previewDomesticBank?.nostroAccounts || []}
      />
    </div>
  );
}
