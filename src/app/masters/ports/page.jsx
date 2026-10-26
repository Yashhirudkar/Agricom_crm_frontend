"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Anchor,
  Ship,
  Plane,
  Building2,
  Warehouse,
  Search,
  Plus,
  Download,
  Upload,
  X,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Edit3,
  Eye,
  RefreshCw,
  AlertCircle,
  Globe,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { portsApi } from "@/api/ports.api";
import CountrySelect from "@/components/common/CountrySelect";

// ─── Port Type Helpers (Light Theme Badges) ──────────────────────────────────
const PORT_TYPES = [
  { value: "SEA", label: "Sea Port", icon: Anchor, color: "text-[#0F766E] bg-teal-50 border-teal-200/80" },
  { value: "AIR", label: "Air Port", icon: Plane, color: "text-purple-700 bg-purple-50 border-purple-200/80" },
  { value: "ICD", label: "Inland Depot (ICD)", icon: Building2, color: "text-amber-700 bg-amber-50 border-amber-200/80" },
  { value: "DRY_PORT", label: "Dry Port", icon: Warehouse, color: "text-emerald-700 bg-emerald-50 border-emerald-200/80" },
];

function getPortTypeBadge(type = "SEA") {
  const t = PORT_TYPES.find((pt) => pt.value === type) || PORT_TYPES[0];
  const Icon = t.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-[11px] font-semibold border ${t.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {t.value}
    </span>
  );
}

export default function PortMasterPage() {
  // ─── State ───────────────────────────────────────────────────────────────────
  const [ports, setPorts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPorts: 0,
    activePorts: 0,
    totalCountriesWithPorts: 0,
    totalShippingLines: 0,
  });

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedPortType, setSelectedPortType] = useState("all");
  const [selectedShippingLine, setSelectedShippingLine] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Reference Data
  const [allCountries, setAllCountries] = useState([]);
  const [allShippingLines, setAllShippingLines] = useState([]);

  // Modals & Drawers
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingPort, setEditingPort] = useState(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [selectedPortDetails, setSelectedPortDetails] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Form State
  const [formCountryId, setFormCountryId] = useState("");
  const [formCountryName, setFormCountryName] = useState("");
  const [formCustomCountryName, setFormCustomCountryName] = useState("");
  const [formPortName, setFormPortName] = useState("");
  const [formPortCode, setFormPortCode] = useState("");
  const [formUnlocode, setFormUnlocode] = useState("");
  const [formPortType, setFormPortType] = useState("SEA");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formSelectedLineIds, setFormSelectedLineIds] = useState([]);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Drawer inline assign line
  const [drawerAddLineId, setDrawerAddLineId] = useState("");
  const [drawerAddingLine, setDrawerAddingLine] = useState(false);

  // Import Modal State
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);

  // ─── Fetch Reference Data ────────────────────────────────────────────────────
  const fetchReferences = useCallback(async () => {
    try {
      const [countriesRes, linesRes] = await Promise.all([
        portsApi.getCountries({ limit: 300 }),
        portsApi.getShippingLines({ limit: 300, isActive: "all" }),
      ]);
      setAllCountries(Array.isArray(countriesRes) ? countriesRes : countriesRes?.data || []);
      setAllShippingLines(linesRes?.data || []);
    } catch (err) {
      console.error("Failed to load reference data", err);
    }
  }, []);

  useEffect(() => {
    fetchReferences();
  }, [fetchReferences]);

  // ─── Fetch Ports ─────────────────────────────────────────────────────────────
  const fetchPorts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await portsApi.getPorts({
        page: currentPage,
        limit: pageSize,
        search: search || undefined,
        countryId: selectedCountry === "all" ? undefined : selectedCountry,
        portType: selectedPortType === "all" ? undefined : selectedPortType,
        shippingLineId: selectedShippingLine === "all" ? undefined : selectedShippingLine,
        isActive: selectedStatus === "all" ? undefined : selectedStatus,
      });

      setPorts(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
      if (res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error("Failed to fetch ports", err);
      toast.error("Failed to load ports. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, search, selectedCountry, selectedPortType, selectedShippingLine, selectedStatus]);

  useEffect(() => {
    fetchPorts();
  }, [fetchPorts]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCountry("all");
    setSelectedPortType("all");
    setSelectedShippingLine("all");
    setSelectedStatus("all");
    setCurrentPage(1);
  };

  // ─── Add / Edit Modal ────────────────────────────────────────────────────────
  const handleOpenAddModal = () => {
    setEditingPort(null);
    setFormCountryId("");
    setFormCountryName("");
    setFormCustomCountryName("");
    setFormPortName("");
    setFormPortCode("");
    setFormUnlocode("");
    setFormPortType("SEA");
    setFormIsActive(true);
    setFormSelectedLineIds([]);
    setFormError("");
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (port) => {
    setEditingPort(port);
    const cName = port.country?.name || allCountries.find((c) => String(c.id) === String(port.countryId))?.name || "";
    setFormCountryId(port.countryId ? String(port.countryId) : "");
    setFormCountryName(cName);
    setFormCustomCountryName("");
    setFormPortName(port.portName || "");
    setFormPortCode(port.portCode || "");
    setFormUnlocode(port.unlocode || "");
    setFormPortType(port.portType || "SEA");
    setFormIsActive(port.isActive !== undefined ? port.isActive : true);
    const existingLineIds = (port.shippingLines || []).map((l) => l.id);
    setFormSelectedLineIds(existingLineIds);
    setFormError("");
    setIsAddEditModalOpen(true);
  };

  const handleAddShippingLineToSelection = (lineId) => {
    const numId = Number(lineId);
    if (!numId) return;
    if (!formSelectedLineIds.includes(numId)) {
      setFormSelectedLineIds((prev) => [...prev, numId]);
    }
  };

  const handleRemoveShippingLineFromSelection = (lineId) => {
    setFormSelectedLineIds((prev) => prev.filter((id) => id !== lineId));
  };

  const handleSavePort = async (e) => {
    e.preventDefault();
    setFormError("");

        const resolvedCountryName = formCountryName?.trim() || formCustomCountryName?.trim();
    if (!formCountryId && !resolvedCountryName) {
      setFormError("Please select a country");
      return;
    }

    if (!formPortName.trim()) {
      setFormError("Port Name is required");
      return;
    }

    setFormSaving(true);
    try {
      const payload = {
        countryId: formCountryId ? Number(formCountryId) : undefined,
        countryName: !formCountryId ? resolvedCountryName : undefined,
        portName: formPortName.trim(),
        portCode: formPortCode.trim() || undefined,
        unlocode: formUnlocode.trim() || undefined,
        portType: formPortType,
        isActive: formIsActive,
        shippingLineIds: formSelectedLineIds,
      };

      if (editingPort) {
        await portsApi.updatePort(editingPort.id, payload);
        toast.success(`Port "${formPortName}" updated successfully!`);
      } else {
        await portsApi.createPort(payload);
        toast.success(`Port "${formPortName}" created successfully!`);
      }

      setIsAddEditModalOpen(false);
      fetchPorts();
      fetchReferences();

      if (selectedPortDetails && editingPort && selectedPortDetails.id === editingPort.id) {
        const refreshed = await portsApi.getPortById(editingPort.id);
        setSelectedPortDetails(refreshed);
      }
    } catch (err) {
      console.error("Save port failed", err);
      const msg = err.response?.data?.message || err.message || "Failed to save port";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setFormSaving(false);
    }
  };

  const handleToggleStatus = async (port) => {
    try {
      await portsApi.togglePortStatus(port.id);
      const newStatus = !port.isActive;
      toast.success(`Port "${port.portName}" is now ${newStatus ? "Active" : "Inactive"}`);
      setPorts((prev) =>
        prev.map((p) => (p.id === port.id ? { ...p, isActive: newStatus } : p))
      );
      if (selectedPortDetails?.id === port.id) {
        setSelectedPortDetails((prev) => ({ ...prev, isActive: newStatus }));
      }
    } catch (err) {
      toast.error("Failed to toggle status");
    }
  };

  const handleDeletePort = async (port) => {
    if (!confirm(`Are you sure you want to delete Port "${port.portName}"? All its shipping line mappings will be unlinked.`)) {
      return;
    }
    try {
      await portsApi.deletePort(port.id);
      toast.success(`Port "${port.portName}" deleted successfully`);
      if (selectedPortDetails?.id === port.id) {
        setIsDetailsDrawerOpen(false);
        setSelectedPortDetails(null);
      }
      fetchPorts();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete port";
      toast.error(msg);
    }
  };

  // ─── Details Drawer Handlers ────────────────────────────────────────────────
  const handleOpenDetailsDrawer = async (port) => {
    setSelectedPortDetails(port);
    setIsDetailsDrawerOpen(true);
    setDrawerAddLineId("");
    try {
      const full = await portsApi.getPortById(port.id);
      setSelectedPortDetails(full);
    } catch (err) {
      console.error("Failed to fetch port details", err);
    }
  };

  const handleDrawerAddShippingLine = async () => {
    if (!drawerAddLineId || !selectedPortDetails) return;
    setDrawerAddingLine(true);
    try {
      await portsApi.addShippingLineToPort(selectedPortDetails.id, {
        shippingLineId: Number(drawerAddLineId),
      });
      toast.success("Shipping line assigned successfully");
      setDrawerAddLineId("");
      const refreshed = await portsApi.getPortById(selectedPortDetails.id);
      setSelectedPortDetails(refreshed);
      fetchPorts();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to assign shipping line";
      toast.error(msg);
    } finally {
      setDrawerAddingLine(false);
    }
  };

  const handleDrawerRemoveShippingLine = async (lineId, lineName) => {
    if (!selectedPortDetails) return;
    try {
      await portsApi.removeShippingLineFromPort(selectedPortDetails.id, lineId);
      toast.success(`Unlinked ${lineName} from this port`);
      const refreshed = await portsApi.getPortById(selectedPortDetails.id);
      setSelectedPortDetails(refreshed);
      fetchPorts();
    } catch (err) {
      toast.error("Failed to remove shipping line");
    }
  };

  // ─── Excel Operations ───────────────────────────────────────────────────────
  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const blob = await portsApi.exportPorts();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `AgriCom_Ports_Master_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Ports Master exported successfully!");
    } catch (err) {
      toast.error("Failed to export Excel file");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await portsApi.getImportTemplate();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Ports_Import_Template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Sample template downloaded!");
    } catch (err) {
      toast.error("Failed to download template");
    }
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!importFile) {
      toast.error("Please select an Excel or CSV file");
      return;
    }

    setImportLoading(true);
    setImportResult(null);

    const formData = new FormData();
    formData.append("file", importFile);

    try {
      const result = await portsApi.importPorts(formData);
      setImportResult(result);
      toast.success("Excel processed successfully!");
      fetchPorts();
      fetchReferences();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to import Excel file";
      toast.error(msg);
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ─── White Sticky Header ─── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-[#0F766E] shadow-2xs">
              <Anchor className="w-5 h-5 text-[#0F766E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  Port Master
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-600 rounded-md border border-[#E5E7EB]">
                  Master Data
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Country → Port → Shipping Line relational master architecture
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/masters/shipping-lines"
              className="h-10 inline-flex items-center gap-2 px-3.5 text-xs font-semibold text-gray-700 bg-white border border-[#E5E7EB] rounded-xl hover:bg-gray-50 transition-all shadow-xs"
            >
              <Ship className="w-4 h-4 text-[#0F766E]" />
              <span>Shipping Lines</span>
            </Link>

            <button
              onClick={handleDownloadTemplate}
              className="h-10 inline-flex items-center gap-1.5 px-3.5 text-xs font-medium text-gray-700 bg-white border border-[#E5E7EB] rounded-xl hover:bg-gray-50 transition-all shadow-xs"
              title="Download Excel Sample Template"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Template</span>
            </button>

            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className="h-10 inline-flex items-center gap-1.5 px-3.5 text-xs font-medium text-gray-700 bg-white border border-[#E5E7EB] rounded-xl hover:bg-gray-50 transition-all shadow-xs disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>{isExporting ? "Exporting..." : "Export"}</span>
            </button>

            <button
              onClick={() => {
                setImportFile(null);
                setImportResult(null);
                setIsImportModalOpen(true);
              }}
              className="h-10 inline-flex items-center gap-1.5 px-3.5 text-xs font-semibold text-gray-700 bg-white border border-[#E5E7EB] rounded-xl hover:bg-gray-50 transition-all shadow-xs"
            >
              <Upload className="w-4 h-4 text-[#0F766E]" />
              <span>Import Excel</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="h-10 inline-flex items-center gap-2 px-4 text-xs font-bold text-white bg-[#0F766E] hover:bg-[#0D5F58] rounded-xl shadow-xs transition-all hover:shadow active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Port</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content Container ─── */}
      <main className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ─── Metric KPI Cards ─── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {stats.totalPorts}
              </div>
              <div className="text-xs font-medium text-gray-500 mt-1">Total Ports</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0F766E]">
              <Anchor className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-emerald-600 tracking-tight">
                {stats.activePorts}
              </div>
              <div className="text-xs font-medium text-gray-500 mt-1">Active Ports</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600 tracking-tight">
                {stats.totalCountriesWithPorts}
              </div>
              <div className="text-xs font-medium text-gray-500 mt-1">Countries Covered</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Globe className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-indigo-600 tracking-tight">
                {stats.totalShippingLines}
              </div>
              <div className="text-xs font-medium text-gray-500 mt-1">Shipping Lines</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Ship className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* ─── White Filter Section ─── */}
        <section className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Box First */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Port, UNLOCODE, Line..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-10 pl-10 pr-3 text-xs bg-white border border-[#E5E7EB] rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#0F766E] transition-all"
              />
            </div>

            {/* Country Dropdown (Searchable CountrySelect) */}
            <div>
              <CountrySelect
                value={
                  selectedCountry && selectedCountry !== "all"
                    ? (allCountries.find((c) => String(c.id) === String(selectedCountry))?.name || selectedCountry)
                    : ""
                }
                onChange={(val) => {
                  if (!val || !val.name) {
                    setSelectedCountry("all");
                    setCurrentPage(1);
                    return;
                  }
                  const name = val.name.trim();
                  const matched = allCountries.find(
                    (c) =>
                      c.name?.toLowerCase() === name.toLowerCase() ||
                      (val.iso2Code && c.iso2Code?.toLowerCase() === val.iso2Code.toLowerCase())
                  );
                  setSelectedCountry(matched ? String(matched.id) : name);
                  setCurrentPage(1);
                }}
                placeholder="All Countries"
              />
            </div>

            {/* Port Type Dropdown */}
            <div>
              <select
                value={selectedPortType}
                onChange={(e) => {
                  setSelectedPortType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-10 px-3 text-xs bg-white border border-[#E5E7EB] rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#0F766E]"
              >
                <option value="all">All Port Types</option>
                <option value="SEA">Sea Port (SEA)</option>
                <option value="AIR">Air Port (AIR)</option>
                <option value="ICD">Inland Depot (ICD)</option>
                <option value="DRY_PORT">Dry Port</option>
              </select>
            </div>

            {/* Shipping Line Dropdown */}
            <div>
              <select
                value={selectedShippingLine}
                onChange={(e) => {
                  setSelectedShippingLine(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-10 px-3 text-xs bg-white border border-[#E5E7EB] rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#0F766E]"
              >
                <option value="all">All Shipping Lines</option>
                {allShippingLines.map((line) => (
                  <option key={line.id} value={line.id}>
                    {line.lineName} {line.lineCode ? `(${line.lineCode})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Dropdown & Reset */}
            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-1 h-10 px-3 text-xs bg-white border border-[#E5E7EB] rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#0F766E]"
              >
                <option value="all">All Status</option>
                <option value="true">Active Only</option>
                <option value="false">Inactive Only</option>
              </select>

              {(search || selectedCountry !== "all" || selectedPortType !== "all" || selectedShippingLine !== "all" || selectedStatus !== "all") && (
                <button
                  onClick={handleResetFilters}
                  className="h-10 px-3.5 inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-[#E5E7EB] rounded-xl transition-all"
                  title="Reset Filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ─── White Table Container ─── */}
        <section className="bg-white border border-[#E5E7EB] rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="sticky top-0 bg-[#F8FAFC] border-b border-[#E5E7EB] text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Country</th>
                  <th className="py-3.5 px-5">Port Name</th>
                  <th className="py-3.5 px-5">UNLOCODE</th>
                  <th className="py-3.5 px-5">Port Type</th>
                  <th className="py-3.5 px-5">Serving Shipping Lines</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-[#E5E7EB]/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-14 text-center text-gray-400">
                      <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2 text-[#0F766E]" />
                      Loading port records...
                    </td>
                  </tr>
                ) : ports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-14 text-center text-gray-400">
                      <Anchor className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      No ports found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  ports.map((port) => {
                    const countryName = port.country?.name || "Unknown";
                    const countryCode = port.country?.iso2Code || "";
                    const lines = port.shippingLines || [];

                    return (
                      <tr
                        key={port.id}
                        onClick={() => handleOpenDetailsDrawer(port)}
                        className="odd:bg-white even:bg-[#F8FAFC]/60 hover:bg-[#F1F5F9]/80 transition-colors cursor-pointer group"
                      >
                        {/* Country with Flag Badge */}
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-[6px] bg-gray-100 border border-[#E5E7EB] text-[10px] font-bold font-mono text-gray-700 uppercase">
                              {countryCode || "—"}
                            </span>
                            <span className="font-semibold text-gray-900">{countryName}</span>
                          </div>
                        </td>

                        {/* Port Name & Code */}
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <div className="font-bold text-gray-900 group-hover:text-[#0F766E] transition-colors">
                            {port.portName}
                          </div>
                          {port.portCode && (
                            <div className="text-[10px] text-gray-400 font-mono">
                              Code: {port.portCode}
                            </div>
                          )}
                        </td>

                        {/* UNLOCODE Badge */}
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          {port.unlocode ? (
                            <span className="inline-block px-2.5 py-1 font-mono text-[11px] font-bold bg-teal-50/80 text-[#0F766E] rounded-[6px] border border-teal-200/80">
                              {port.unlocode}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        {/* Port Type Badge */}
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          {getPortTypeBadge(port.portType)}
                        </td>

                        {/* Shipping Lines as Colored Chips */}
                        <td className="py-3.5 px-5">
                          <div className="flex flex-wrap items-center gap-1.5 max-w-md">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#0F766E] border border-teal-200">
                              {lines.length} {lines.length === 1 ? "Line" : "Lines"}
                            </span>

                            {lines.slice(0, 3).map((line) => (
                              <span
                                key={line.id}
                                className="px-2 py-0.5 rounded-[6px] text-[11px] font-medium bg-white text-gray-700 border border-[#E5E7EB] shadow-2xs"
                              >
                                {line.lineName}
                              </span>
                            ))}

                            {lines.length > 3 && (
                              <span className="text-[10px] font-semibold text-gray-400">
                                +{lines.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status Toggle Switch (Centered) */}
                        <td
                          className="py-3.5 px-5 text-center whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(port)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              port.isActive ? "bg-[#0F766E]" : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                                port.isActive ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </td>

                        {/* Action Icons Right Aligned */}
                        <td
                          className="py-3.5 px-5 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenDetailsDrawer(port)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-[#0F766E] hover:bg-teal-50 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleOpenEditModal(port)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Edit Port"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeletePort(port)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Port"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ─── Pagination Footer ─── */}
          <div className="px-5 py-3.5 bg-[#F8FAFC] border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <div>
              Showing <span className="font-semibold text-gray-900">{ports.length}</span> of{" "}
              <span className="font-semibold text-gray-900">{total}</span> total ports
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span>Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="h-8 px-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-gray-700"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="h-8 px-2 rounded-lg border border-[#E5E7EB] bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-40 transition-all flex items-center justify-center shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-semibold text-gray-700">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="h-8 px-2 rounded-lg border border-[#E5E7EB] bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-40 transition-all flex items-center justify-center shadow-2xs"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════
          ADD / EDIT PORT MODAL (LIGHT ENTERPRISE THEME)
         ═══════════════════════════════════════════════════════════════════════ */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200/60 flex items-center justify-center text-[#0F766E]">
                  <Anchor className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 leading-tight">
                    {editingPort ? `Edit Port: ${editingPort.portName}` : "Add New Port"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Configure port identification and assign serving shipping lines
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePort} className="p-6 space-y-5 overflow-y-auto flex-1">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Section 1: Port Identification */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pb-1 border-b border-[#E5E7EB]">
                  General Information
                </div>

                {/* Country */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Country <span className="text-rose-500">*</span>
                  </label>
                  <CountrySelect
                    value={formCountryName}
                    onChange={(val) => {
                      if (!val) {
                        setFormCountryName("");
                        setFormCountryId("");
                        setFormCustomCountryName("");
                        return;
                      }
                      const name = val.name || "";
                      setFormCountryName(name);
                      const matched = allCountries.find(
                        (c) =>
                          c.name?.toLowerCase() === name.toLowerCase() ||
                          (val.iso2Code && c.iso2Code?.toLowerCase() === val.iso2Code.toLowerCase())
                      );
                      if (matched) {
                        setFormCountryId(String(matched.id));
                        setFormCustomCountryName("");
                      } else {
                        setFormCountryId("");
                        setFormCustomCountryName(name);
                      }
                    }}
                    error={formError && !formCountryId && !formCountryName}
                  />
                </div>

                {/* Port Name & Port Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Port Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mundra, Nhava Sheva"
                      value={formPortName}
                      onChange={(e) => setFormPortName(e.target.value)}
                      className="w-full h-10 px-3 text-xs bg-white border border-[#E5E7EB] rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#0F766E]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Port Code (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MUN, NSA"
                      value={formPortCode}
                      onChange={(e) => setFormPortCode(e.target.value.toUpperCase())}
                      className="w-full h-10 px-3 text-xs bg-white border border-[#E5E7EB] rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#0F766E] font-mono"
                    />
                  </div>
                </div>

                {/* UNLOCODE & Port Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      UNLOCODE (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. INMUN, AEJEA"
                      value={formUnlocode}
                      onChange={(e) => setFormUnlocode(e.target.value.toUpperCase())}
                      className="w-full h-10 px-3 text-xs bg-white border border-[#E5E7EB] rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#0F766E] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Port Type
                    </label>
                    <select
                      value={formPortType}
                      onChange={(e) => setFormPortType(e.target.value)}
                      className="w-full h-10 px-3 text-xs bg-white border border-[#E5E7EB] rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#0F766E]"
                    >
                      <option value="SEA">Sea Port (SEA)</option>
                      <option value="AIR">Air Port (AIR)</option>
                      <option value="ICD">Inland Depot (ICD)</option>
                      <option value="DRY_PORT">Dry Port</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Serving Shipping Lines Assignment */}
              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pb-1 border-b border-[#E5E7EB]">
                  Shipping Lines Assignment
                </div>

                <label className="block text-[11px] font-semibold text-gray-700">
                  Assign Serving Shipping Lines (Multi-Select)
                </label>

                {/* Select Dropdown */}
                <select
                  value=""
                  onChange={(e) => handleAddShippingLineToSelection(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-white border border-[#E5E7EB] rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#0F766E]"
                >
                  <option value="">+ Select shipping lines to link to this port...</option>
                  {allShippingLines
                    .filter((line) => !formSelectedLineIds.includes(line.id))
                    .map((line) => (
                      <option key={line.id} value={line.id}>
                        {line.lineName} {line.lineCode ? `(${line.lineCode})` : ""}
                      </option>
                    ))}
                </select>

                {/* Removable Chips Container */}
                <div className="p-3.5 min-h-[60px] rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] flex flex-wrap items-center gap-2">
                  {formSelectedLineIds.length === 0 ? (
                    <span className="text-[11px] text-gray-400 italic">
                      No shipping lines selected. Choose from the dropdown above to assign.
                    </span>
                  ) : (
                    formSelectedLineIds.map((id) => {
                      const lineObj = allShippingLines.find((l) => l.id === id);
                      const name = lineObj ? lineObj.lineName : `Line #${id}`;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-lg text-xs font-semibold bg-white text-[#0F766E] border border-teal-200 shadow-2xs"
                        >
                          <Ship className="w-3.5 h-3.5 text-[#0F766E]" />
                          <span>{name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveShippingLineFromSelection(id)}
                            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
                            title="Remove"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <div>
                  <div className="text-xs font-semibold text-gray-800">Port Active Status</div>
                  <div className="text-[10px] text-gray-500">Enable or disable this port in dropdowns across the CRM</div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormIsActive(!formIsActive)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formIsActive ? "bg-[#0F766E]" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      formIsActive ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="h-10 px-4 text-xs font-semibold text-gray-700 bg-white border border-[#E5E7EB] hover:bg-gray-50 rounded-xl transition-all shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSaving}
                  className="h-10 px-5 text-xs font-bold text-white bg-[#0F766E] hover:bg-[#0D5F58] rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {formSaving ? "Saving..." : editingPort ? "Update Port" : "Save Port"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PORT DETAILS DRAWER (LIGHT ENTERPRISE THEME)
         ═══════════════════════════════════════════════════════════════════════ */}
      {isDetailsDrawerOpen && selectedPortDetails && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-[#E5E7EB] animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 text-[#0F766E] flex items-center justify-center font-bold shadow-2xs">
                  <Anchor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">
                    {selectedPortDetails.portName}
                  </h3>
                  <div className="text-xs text-gray-500 font-medium flex items-center gap-2 mt-0.5">
                    <span>{selectedPortDetails.country?.name || "Country"}</span>
                    {selectedPortDetails.unlocode && (
                      <span className="font-mono text-[#0F766E] font-semibold">
                        • {selectedPortDetails.unlocode}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEditModal(selectedPortDetails)}
                  className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Edit Port"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsDetailsDrawerOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Content Body */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto bg-white">
              {/* Badges Overview */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                  <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Port Type</div>
                  <div>{getPortTypeBadge(selectedPortDetails.portType)}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                  <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Active Status</div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-xs font-bold border ${
                      selectedPortDetails.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {selectedPortDetails.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Location Information
                </h4>
                <div className="rounded-xl border border-[#E5E7EB] divide-y divide-[#E5E7EB] text-xs bg-white">
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-500">Country:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedPortDetails.country?.name || "—"} ({selectedPortDetails.country?.iso2Code || "—"})
                    </span>
                  </div>
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-500">Port Name:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedPortDetails.portName}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-500">Port Code:</span>
                    <span className="font-mono font-semibold text-gray-900">
                      {selectedPortDetails.portCode || "—"}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-500">UNLOCODE:</span>
                    <span className="font-mono font-bold text-[#0F766E]">
                      {selectedPortDetails.unlocode || "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Serving Shipping Lines Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Serving Shipping Lines ({(selectedPortDetails.shippingLines || []).length})
                  </h4>
                </div>

                {/* Inline Assign Shipping Line Dropdown */}
                <div className="flex items-center gap-2">
                  <select
                    value={drawerAddLineId}
                    onChange={(e) => setDrawerAddLineId(e.target.value)}
                    className="flex-1 h-9 px-3 text-xs bg-white border border-[#E5E7EB] rounded-lg text-gray-700 focus:outline-none"
                  >
                    <option value="">+ Assign another shipping line...</option>
                    {allShippingLines
                      .filter((l) => !(selectedPortDetails.shippingLines || []).some((sl) => sl.id === l.id))
                      .map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.lineName} {l.lineCode ? `(${l.lineCode})` : ""}
                        </option>
                      ))}
                  </select>
                  <button
                    disabled={!drawerAddLineId || drawerAddingLine}
                    onClick={handleDrawerAddShippingLine}
                    className="h-9 px-3.5 text-xs font-bold text-white bg-[#0F766E] hover:bg-[#0D5F58] rounded-lg disabled:opacity-40 transition-all shadow-xs"
                  >
                    {drawerAddingLine ? "..." : "Link"}
                  </button>
                </div>

                {/* List of Serving Lines as Clean Light Cards */}
                <div className="space-y-2">
                  {(selectedPortDetails.shippingLines || []).length === 0 ? (
                    <div className="p-4 text-center rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-gray-400 text-xs">
                      No shipping lines currently assigned.
                    </div>
                  ) : (
                    (selectedPortDetails.shippingLines || []).map((line) => (
                      <div
                        key={line.id}
                        className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-between shadow-2xs hover:border-teal-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 text-[#0F766E] flex items-center justify-center font-bold text-xs">
                            <Ship className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                              <span>{line.lineName}</span>
                              {line.lineCode && (
                                <span className="font-mono text-[10px] text-gray-400">
                                  ({line.lineCode})
                                </span>
                              )}
                            </div>
                            {line.website && (
                              <a
                                href={line.website.startsWith("http") ? line.website : `https://${line.website}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-[#0F766E] hover:underline flex items-center gap-1 mt-0.5"
                              >
                                {line.website.replace(/^https?:\/\//, "")}
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDrawerRemoveShippingLine(line.id, line.lineName)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Unlink shipping line"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t border-[#E5E7EB] text-[10px] text-gray-400 space-y-1 font-mono">
                <div>Created: {selectedPortDetails.createdAt ? new Date(selectedPortDetails.createdAt).toLocaleString() : "—"}</div>
                <div>Updated: {selectedPortDetails.updatedAt ? new Date(selectedPortDetails.updatedAt).toLocaleString() : "—"}</div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#F8FAFC] flex justify-end">
              <button
                onClick={() => setIsDetailsDrawerOpen(false)}
                className="h-10 px-5 text-xs font-semibold text-gray-700 bg-white border border-[#E5E7EB] rounded-xl hover:bg-gray-50 shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          EXCEL IMPORT MODAL (LIGHT ENTERPRISE THEME)
         ═══════════════════════════════════════════════════════════════════════ */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200/60 text-[#0F766E] flex items-center justify-center font-bold">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Bulk Import Ports & Shipping Lines
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Fast Excel data import with smart entity mapping
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="p-6 space-y-4">
              <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 text-xs text-teal-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-[#0F766E]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Smart Relational Import Rules:
                </div>
                <ul className="list-disc list-inside text-[11px] text-teal-800 space-y-0.5">
                  <li>If Country exists: Reused.</li>
                  <li>If Shipping Line exists: Reused.</li>
                  <li>If Port exists in Country: Updated with shipping line relation.</li>
                  <li>Duplicate mappings are safely skipped.</li>
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">
                  Select Excel file (.xlsx, .xls, .csv):
                </span>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="text-xs font-bold text-[#0F766E] hover:underline flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Get Sample Template
                </button>
              </div>

              <div className="border-2 border-dashed border-[#E5E7EB] hover:border-[#0F766E] rounded-xl p-6 text-center transition-colors bg-[#F8FAFC]">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="port-file-upload-light"
                />
                <label
                  htmlFor="port-file-upload-light"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <FileSpreadsheet className="w-8 h-8 text-[#0F766E]" />
                  <span className="text-xs font-semibold text-gray-700">
                    {importFile ? importFile.name : "Click to select or drag & drop Excel file"}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Expected columns: Country, Port Name, UNLOCODE, Port Type, Shipping Line
                  </span>
                </label>
              </div>

              {/* Import Results Summary */}
              {importResult && (
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs space-y-2">
                  <div className="font-bold text-gray-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Import Completed:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700">
                    <div>Processed: <span className="font-bold">{importResult.stats?.totalProcessed || 0}</span></div>
                    <div>Ports Created: <span className="font-bold text-emerald-600">{importResult.stats?.createdPorts || 0}</span></div>
                    <div>Ports Updated: <span className="font-bold text-blue-600">{importResult.stats?.updatedPorts || 0}</span></div>
                    <div>Lines Created: <span className="font-bold text-[#0F766E]">{importResult.stats?.createdShippingLines || 0}</span></div>
                    <div>Relations Linked: <span className="font-bold text-purple-600">{importResult.stats?.linkedRelations || 0}</span></div>
                    <div>Skipped / Duplicates: <span className="font-bold text-amber-600">{importResult.stats?.skippedRows || 0}</span></div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="h-10 px-4 text-xs font-semibold text-gray-700 bg-white border border-[#E5E7EB] rounded-xl hover:bg-gray-50 shadow-xs"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={!importFile || importLoading}
                  className="h-10 px-5 text-xs font-bold text-white bg-[#0F766E] hover:bg-[#0D5F58] rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {importLoading ? "Processing..." : "Import Rows"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
