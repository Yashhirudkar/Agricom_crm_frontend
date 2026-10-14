"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Ship,
  Anchor,
  Search,
  Plus,
  X,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Edit3,
  RefreshCw,
  AlertCircle,
  Globe,
  Mail,
  Phone,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { portsApi } from "@/api/ports.api";

export default function ShippingLinesMasterPage() {
  const [lines, setLines] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLine, setEditingLine] = useState(null);
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formWebsite, setFormWebsite] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchShippingLines = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await portsApi.getShippingLines({
        page: currentPage,
        limit: pageSize,
        search: search || undefined,
        isActive: statusFilter === "all" ? undefined : statusFilter,
      });

      setLines(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
      if (res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error("Failed to load shipping lines", err);
      toast.error("Failed to load shipping lines");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, search, statusFilter]);

  useEffect(() => {
    fetchShippingLines();
  }, [fetchShippingLines]);

  const handleOpenAddModal = () => {
    setEditingLine(null);
    setFormName("");
    setFormCode("");
    setFormWebsite("");
    setFormEmail("");
    setFormPhone("");
    setFormIsActive(true);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (line) => {
    setEditingLine(line);
    setFormName(line.lineName || "");
    setFormCode(line.lineCode || "");
    setFormWebsite(line.website || "");
    setFormEmail(line.contactEmail || "");
    setFormPhone(line.contactPhone || "");
    setFormIsActive(line.isActive !== undefined ? line.isActive : true);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSaveLine = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formName.trim()) {
      setFormError("Shipping line name is required");
      return;
    }

    setFormSaving(true);
    try {
      const payload = {
        lineName: formName.trim(),
        lineCode: formCode.trim() || undefined,
        website: formWebsite.trim() || undefined,
        contactEmail: formEmail.trim() || undefined,
        contactPhone: formPhone.trim() || undefined,
        isActive: formIsActive,
      };

      if (editingLine) {
        await portsApi.updateShippingLine(editingLine.id, payload);
        toast.success(`Shipping Line "${formName}" updated successfully!`);
      } else {
        await portsApi.createShippingLine(payload);
        toast.success(`Shipping Line "${formName}" created successfully!`);
      }

      setIsModalOpen(false);
      fetchShippingLines();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to save shipping line";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setFormSaving(false);
    }
  };

  const handleToggleStatus = async (line) => {
    try {
      await portsApi.toggleShippingLineStatus(line.id);
      const newStatus = !line.isActive;
      toast.success(`"${line.lineName}" is now ${newStatus ? "Active" : "Inactive"}`);
      setLines((prev) =>
        prev.map((l) => (l.id === line.id ? { ...l, isActive: newStatus } : l))
      );
    } catch (err) {
      toast.error("Failed to toggle status");
    }
  };

  const handleDeleteLine = async (line) => {
    const portsCount = line.portsCount || 0;
    const msg = portsCount > 0
      ? `Are you sure you want to delete "${line.lineName}"? It is assigned to ${portsCount} port(s). Deleting it will only remove the port relationships, NOT the ports.`
      : `Are you sure you want to delete "${line.lineName}"?`;

    if (!confirm(msg)) {
      return;
    }

    try {
      await portsApi.deleteShippingLine(line.id);
      toast.success(`Shipping Line "${line.lineName}" deleted successfully. Ports preserved.`);
      fetchShippingLines();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete shipping line";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ─── White Sticky Header ─── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-[#0F766E] shadow-2xs">
              <Ship className="w-5 h-5 text-[#0F766E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  Shipping Line Master
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-600 rounded-md border border-[#E5E7EB]">
                  Master Data
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Global container lines, carrier codes, contact directories & serving port mappings
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/masters/ports"
              className="h-10 inline-flex items-center gap-2 px-3.5 text-xs font-semibold text-gray-700 bg-white border border-[#E5E7EB] rounded-xl hover:bg-gray-50 transition-all shadow-xs"
            >
              <Anchor className="w-4 h-4 text-[#0F766E]" />
              <span>Port Master</span>
            </Link>

            <button
              onClick={handleOpenAddModal}
              className="h-10 inline-flex items-center gap-2 px-4 text-xs font-bold text-white bg-[#0F766E] hover:bg-[#0D5F58] rounded-xl shadow-xs transition-all hover:shadow active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Shipping Line</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ─── Stats KPI Cards ─── */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">{stats.total}</div>
              <div className="text-xs font-medium text-gray-500 mt-1">Total Shipping Lines</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0F766E]">
              <Ship className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-emerald-600 tracking-tight">{stats.active}</div>
              <div className="text-xs font-medium text-gray-500 mt-1">Active Carriers</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-600 tracking-tight">{stats.inactive}</div>
              <div className="text-xs font-medium text-gray-500 mt-1">Inactive Carriers</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500">
              <Anchor className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* ─── Filter Bar ─── */}
        <section className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by line name, code, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 pl-10 pr-3 text-xs bg-white border border-[#E5E7EB] rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#0F766E]"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 px-3 text-xs bg-white border border-[#E5E7EB] rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#0F766E]"
            >
              <option value="all">All Status</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </select>

            {(search || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
                className="h-10 px-3.5 inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-[#E5E7EB] rounded-xl transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </section>

        {/* ─── Table Section ─── */}
        <section className="bg-white border border-[#E5E7EB] rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="sticky top-0 bg-[#F8FAFC] border-b border-[#E5E7EB] text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Carrier / Line Name</th>
                  <th className="py-3.5 px-5">Line Code</th>
                  <th className="py-3.5 px-5">Website</th>
                  <th className="py-3.5 px-5">Contact Details</th>
                  <th className="py-3.5 px-5 text-center">Serving Ports</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-[#E5E7EB]/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-14 text-center text-gray-400">
                      <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2 text-[#0F766E]" />
                      Loading carriers...
                    </td>
                  </tr>
                ) : lines.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-14 text-center text-gray-400">
                      <Ship className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      No shipping lines found.
                    </td>
                  </tr>
                ) : (
                  lines.map((line) => {
                    return (
                      <tr
                        key={line.id}
                        className="odd:bg-white even:bg-[#F8FAFC]/60 hover:bg-[#F1F5F9]/80 transition-colors"
                      >
                        {/* Carrier Name with Brand Initials Circle */}
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/60 text-[#0F766E] font-bold text-xs flex items-center justify-center shadow-2xs">
                              {line.lineName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{line.lineName}</div>
                              <div className="text-[10px] text-gray-400 font-mono">ID: #{line.id}</div>
                            </div>
                          </div>
                        </td>

                        {/* Line Code */}
                        <td className="py-3.5 px-5 whitespace-nowrap font-mono font-bold text-gray-800">
                          {line.lineCode ? (
                            <span className="px-2 py-0.5 rounded-[6px] bg-gray-100 border border-[#E5E7EB]">
                              {line.lineCode}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        {/* Website */}
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          {line.website ? (
                            <a
                              href={line.website.startsWith("http") ? line.website : `https://${line.website}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-[#0F766E] hover:underline font-medium text-xs"
                            >
                              <Globe className="w-3.5 h-3.5 text-[#0F766E]" />
                              <span>{line.website.replace(/^https?:\/\//, "")}</span>
                              <ExternalLink className="w-2.5 h-2.5 text-gray-400" />
                            </a>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        {/* Contact Details */}
                        <td className="py-3.5 px-5 whitespace-nowrap text-[11px] text-gray-700">
                          {line.contactEmail && (
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-gray-400" />
                              <span>{line.contactEmail}</span>
                            </div>
                          )}
                          {line.contactPhone && (
                            <div className="flex items-center gap-1.5 mt-0.5 text-gray-500">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              <span>{line.contactPhone}</span>
                            </div>
                          )}
                          {!line.contactEmail && !line.contactPhone && <span className="text-gray-400">—</span>}
                        </td>

                        {/* Serving Ports Count */}
                        <td className="py-3.5 px-5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-[#0F766E] border border-teal-200">
                            <Anchor className="w-3 h-3 text-[#0F766E]" />
                            {line.portsCount || 0} Ports
                          </span>
                        </td>

                        {/* Status Toggle Centered */}
                        <td className="py-3.5 px-5 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(line)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              line.isActive ? "bg-[#0F766E]" : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                                line.isActive ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </td>

                        {/* Actions Right Aligned */}
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEditModal(line)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Edit Shipping Line"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLine(line)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Shipping Line"
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
              Showing <span className="font-semibold text-gray-900">{lines.length}</span> of{" "}
              <span className="font-semibold text-gray-900">{total}</span> total carriers
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
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════
          ADD / EDIT SHIPPING LINE MODAL (LIGHT ENTERPRISE THEME)
         ═══════════════════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200/60 text-[#0F766E] flex items-center justify-center font-bold">
                  <Ship className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">
                    {editingLine ? `Edit Line: ${editingLine.lineName}` : "Add New Shipping Line"}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Configure carrier name, code and official contact directory
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLine} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Line Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. MSC, Maersk, COSCO"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-white border border-[#E5E7EB] rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#0F766E]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Line Code (Carrier Code)
                </label>
                <input
                  type="text"
                  placeholder="e.g. MSCU, MAEU, COSU"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  className="w-full h-10 px-3 text-xs bg-white border border-[#E5E7EB] rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#0F766E] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  placeholder="https://www.msc.com"
                  value={formWebsite}
                  onChange={(e) => setFormWebsite(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-white border border-[#E5E7EB] rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#0F766E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    placeholder="contact@msc.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-white border border-[#E5E7EB] rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#0F766E]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+91..."
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-white border border-[#E5E7EB] rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#0F766E]"
                  />
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] pt-2">
                <div>
                  <div className="text-xs font-semibold text-gray-800">Status Active</div>
                  <div className="text-[10px] text-gray-500">Enable this carrier across contracts & bookings</div>
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

              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-4 text-xs font-semibold text-gray-700 bg-white border border-[#E5E7EB] rounded-xl hover:bg-gray-50 shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSaving}
                  className="h-10 px-5 text-xs font-bold text-white bg-[#0F766E] hover:bg-[#0D5F58] rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {formSaving ? "Saving..." : editingLine ? "Update Line" : "Save Line"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
