import React, { useState, useEffect } from "react";
import {
  Edit2,
  Package,
  Globe,
  Tag,
  Truck,
  Layers,
  FileText,
  Boxes,
  Package2,
  Loader2,
} from "lucide-react";
import Drawer from "@/components/common/Drawer";
import HasPermission from "@/components/rbac/HasPermission";
import PackagingSelector from "@/components/masters/products/PackagingSelector";
import axiosClient from "@/lib/axios";
import CountrySelect from "@/components/common/CountrySelect";

export default function ProductDrawer({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  isSaving,
  error,
  isEditMode: initialEditMode,
  categories,
  countries,
  hscodes,
}) {
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [activeTab, setActiveTab] = useState("overview");

  // Packaging state
  const [allSpecs, setAllSpecs] = useState([]);
  const [selectedPackagingIds, setSelectedPackagingIds] = useState([]);
  const [packagingLoading, setPackagingLoading] = useState(false);
  const [packagingSaving, setPackagingSaving] = useState(false);
  const [packagingError, setPackagingError] = useState("");

  // Sync edit mode state when drawer opens or mode changes from parent
  useEffect(() => {
    setIsEditMode(initialEditMode);
    if (isOpen) {
      setActiveTab(initialEditMode ? "general" : "overview");
    }
  }, [isOpen, initialEditMode]);

  // Load all available bag specifications whenever drawer opens
  useEffect(() => {
    if (!isOpen) return;
    axiosClient
      .get("/masters/bag-specifications", { params: { isActive: true, limit: 200 } })
      .then((res) => setAllSpecs(res.data?.data || []))
      .catch(() => setAllSpecs([]));
  }, [isOpen]);

  // Load assigned packaging for this product
  useEffect(() => {
    if (!isOpen || !form.id) {
      setSelectedPackagingIds([]);
      return;
    }
    setPackagingLoading(true);
    axiosClient
      .get(`/masters/products/${form.id}/packaging`)
      .then((res) => {
        const ids = (res.data || []).map((s) => s.id);
        setSelectedPackagingIds(ids);
      })
      .catch(() => setSelectedPackagingIds([]))
      .finally(() => setPackagingLoading(false));
  }, [isOpen, form.id]);

  const handleDecimalChange = (field, val) => {
    setForm({ ...form, [field]: val === "" ? null : parseFloat(val) });
  };

  // Save packaging assignment separately then call main onSubmit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // First save the packaging assignments if we have a product id
    if (form.id && selectedPackagingIds !== null) {
      setPackagingSaving(true);
      setPackagingError("");
      try {
        await axiosClient.put(`/masters/products/${form.id}/packaging`, {
          bagSpecificationIds: selectedPackagingIds,
        });
      } catch (err) {
        setPackagingError("Packaging save failed. Product info saved.");
      } finally {
        setPackagingSaving(false);
      }
    }
    // Then save the product core fields
    onSubmit(e);
  };

  const currentCategory = categories.find((c) => c.id === parseInt(form.categoryId, 10));
  const currentCountryName = form.country || "";
  const currentHSCode = hscodes.find((h) => h.id === parseInt(form.hsCodeId, 10));

  const tabs = isEditMode
    ? [
        { id: "general", label: "General Information" },
        { id: "logistics", label: "Logistics Capacities" },
        { id: "packaging", label: "Packaging Options" },
      ]
    : [
        { id: "overview", label: "Overview" },
        { id: "general", label: "General Information" },
        { id: "logistics", label: "Logistics Capacities" },
        { id: "packaging", label: "Packaging Options" },
      ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={form.id ? (isEditMode ? `Edit: ${form.name}` : form.name) : "New Product"}
      widthClass="w-full md:w-[700px] lg:w-[800px]"
    >
      <div className="flex flex-col h-full bg-slate-50/50">
        {/* CRM Info Summary Bar in View Mode */}
        {!isEditMode && form.id && (
          <div className="bg-white border-b border-gray-100 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                {form.name?.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400">
                    {currentCategory?.name || "Product"}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      form.isActive
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {form.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-800 flex items-center gap-1.5 mt-0.5">
                  Origin: {currentCountryName || "-"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <HasPermission permission="product:update">
                <button
                  onClick={() => {
                    setIsEditMode(true);
                    setActiveTab("general");
                  }}
                  className="px-3.5 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Edit2 className="h-3.5 w-3.5 text-gray-500" /> Edit Product
                </button>
              </HasPermission>
            </div>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="bg-white border-b border-gray-200 px-6 shrink-0 flex items-center justify-between overflow-x-auto">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 -mb-[1px] ${
                  activeTab === tab.id
                    ? "border-[#007aff] text-[#007aff]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {tab.id === "packaging" && selectedPackagingIds.length > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-[#007aff] text-white text-[9px] font-bold">
                    {selectedPackagingIds.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Main Area */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col">
          {/* VIEW MODE CONTAINER */}
          {!isEditMode && form.id && (
            <div className="flex-1 space-y-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Category Classification
                      </span>
                      <span className="text-xs font-bold text-gray-800 mt-2 flex items-center gap-1.5">
                        <Layers className="h-4 w-4 text-[#007aff]" />
                        {currentCategory?.name || "-"}
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Origin & HS Code
                      </span>
                      <span className="text-xs font-bold text-gray-800 mt-2 flex flex-col gap-0.5">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5 text-slate-400" />
                          {currentCountryName || "-"}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-500 font-mono mt-0.5">
                          HS: {currentHSCode?.code || "-"}
                        </span>
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Quality Sub-Type
                      </span>
                      <span className="text-xs font-bold text-gray-800 mt-2 flex items-center gap-1.5">
                        <Tag className="h-4 w-4 text-emerald-500" />
                        {form.qualitySubType || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Specification Card */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#007aff]" />
                      Technical Specifications
                    </h3>
                    <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                      {form.specification || "No technical specification provided."}
                    </p>
                  </div>

                  {/* Logistics Summary Card */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                      <Truck className="h-4 w-4 text-[#007aff]" />
                      Logistics Base Capacities
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      <div className="bg-slate-50/50 p-3 rounded-xl border border-gray-100 text-center">
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">20ft Cont</div>
                        <div className="text-xs font-mono font-bold text-gray-800 mt-1">{form.qty20ftContainer ?? "-"}</div>
                      </div>
                      <div className="bg-slate-50/50 p-3 rounded-xl border border-gray-100 text-center">
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">40ft Cont</div>
                        <div className="text-xs font-mono font-bold text-gray-800 mt-1">{form.qty40ftContainer ?? "-"}</div>
                      </div>
                      <div className="bg-slate-50/50 p-3 rounded-xl border border-gray-100 text-center">
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">40HC Cont</div>
                        <div className="text-xs font-mono font-bold text-gray-800 mt-1">{form.qty40hcContainer ?? "-"}</div>
                      </div>
                      <div className="bg-slate-50/50 p-3 rounded-xl border border-gray-100 text-center">
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Truck Cap.</div>
                        <div className="text-xs font-mono font-bold text-gray-800 mt-1">{form.truckCapacity ?? "-"}</div>
                      </div>
                      <div className="bg-slate-50/50 p-3 rounded-xl border border-gray-100 text-center">
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Wagon Cap.</div>
                        <div className="text-xs font-mono font-bold text-gray-800 mt-1">{form.wagonCapacity ?? "-"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* General Information Tab — View */}
              {activeTab === "general" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-xs animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Product Name</div>
                      <div className="text-sm font-bold text-gray-800 mt-1 uppercase">{form.name || "-"}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</div>
                      <div className="text-xs font-bold text-gray-800 mt-1">{currentCategory?.name || "-"}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Origin Country</div>
                      <div className="text-xs font-bold text-gray-800 mt-1">{currentCountryName || "-"}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">HS Code</div>
                      <div className="text-xs font-mono font-bold text-gray-800 mt-1">{currentHSCode?.code || "-"}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quality Sub-type</div>
                      <div className="text-xs font-bold text-gray-800 mt-1">{form.qualitySubType || "-"}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Specifications</div>
                      <p className="text-xs text-gray-700 mt-1 leading-relaxed whitespace-pre-line">{form.specification || "-"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Logistics Capacities Tab — View */}
              {activeTab === "logistics" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-xs animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">20ft Container Capacity</div>
                      <div className="text-sm font-mono font-bold text-gray-800 mt-1">{form.qty20ftContainer ?? "-"} MT</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">40ft Container Capacity</div>
                      <div className="text-sm font-mono font-bold text-gray-800 mt-1">{form.qty40ftContainer ?? "-"} MT</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">40HC Container Capacity</div>
                      <div className="text-sm font-mono font-bold text-gray-800 mt-1">{form.qty40hcContainer ?? "-"} MT</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Truck Capacity</div>
                      <div className="text-sm font-mono font-bold text-gray-800 mt-1">{form.truckCapacity ?? "-"} MT</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Wagon Capacity</div>
                      <div className="text-sm font-mono font-bold text-gray-800 mt-1">{form.wagonCapacity ?? "-"} MT</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Packaging Options Tab — View */}
              {activeTab === "packaging" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs animate-in fade-in duration-200">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                    <Package2 className="h-4 w-4 text-[#007aff]" />
                    Assigned Packaging Options
                  </h3>
                  {packagingLoading ? (
                    <div className="flex items-center gap-2 py-8 justify-center">
                      <Loader2 className="h-5 w-5 text-[#007aff] animate-spin" />
                      <span className="text-xs text-gray-400">Loading packaging...</span>
                    </div>
                  ) : (
                    <PackagingSelector
                      allSpecs={allSpecs}
                      selectedIds={selectedPackagingIds}
                      onChange={setSelectedPackagingIds}
                      isEditMode={false}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* EDIT/CREATE MODE CONTAINER */}
          {isEditMode && (
            <div className="flex-1 space-y-6">
              {/* TAB: General Information */}
              {activeTab === "general" && (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-xs animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={150}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 uppercase bg-white shadow-sm transition-all"
                        placeholder="e.g. ORGANIC SOYBEANS"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={form.categoryId}
                        onChange={(e) => setForm({ ...form, categoryId: parseInt(e.target.value, 10) || "" })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-white shadow-sm transition-all"
                      >
                        <option value="">Select...</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Origin Country <span className="text-red-500">*</span>
                      </label>
                      <CountrySelect
                        value={form.country || ""}
                        onChange={(val) => {
                          setForm({ ...form, country: val?.name || "" });
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        HS Code
                      </label>
                      <select
                        value={form.hsCodeId}
                        onChange={(e) => setForm({ ...form, hsCodeId: parseInt(e.target.value, 10) || "" })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-white shadow-sm transition-all"
                      >
                        <option value="">Select...</option>
                        {hscodes.map((hs) => (
                          <option key={hs.id} value={hs.id}>{hs.code}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Quality Sub-type
                      </label>
                      <input
                        type="text"
                        maxLength={100}
                        value={form.qualitySubType}
                        onChange={(e) => setForm({ ...form, qualitySubType: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-white shadow-sm transition-all"
                        placeholder="e.g. Grade A"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Specification
                      </label>
                      <input
                        type="text"
                        maxLength={1000}
                        value={form.specification}
                        onChange={(e) => setForm({ ...form, specification: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-white shadow-sm transition-all"
                        placeholder="Technical specifications, moisture content..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Logistics Capacities */}
              {activeTab === "logistics" && (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-xs animate-in fade-in duration-200">
                  <p className="text-[11px] font-bold text-gray-700 mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-gray-200 pb-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#007aff]" />
                    Logistics Base Capacities (Optional)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">20ft Cont.</label>
                      <input
                        type="number" step="0.01" min="0"
                        value={form.qty20ftContainer ?? ""}
                        onChange={(e) => handleDecimalChange("qty20ftContainer", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 font-mono shadow-sm bg-white"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">40ft Cont.</label>
                      <input
                        type="number" step="0.01" min="0"
                        value={form.qty40ftContainer ?? ""}
                        onChange={(e) => handleDecimalChange("qty40ftContainer", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 font-mono shadow-sm bg-white"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">40HC Cont.</label>
                      <input
                        type="number" step="0.01" min="0"
                        value={form.qty40hcContainer ?? ""}
                        onChange={(e) => handleDecimalChange("qty40hcContainer", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 font-mono shadow-sm bg-white"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Truck Cap.</label>
                      <input
                        type="number" step="0.01" min="0"
                        value={form.truckCapacity ?? ""}
                        onChange={(e) => handleDecimalChange("truckCapacity", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 font-mono shadow-sm bg-white"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Wagon Cap.</label>
                      <input
                        type="number" step="0.01" min="0"
                        value={form.wagonCapacity ?? ""}
                        onChange={(e) => handleDecimalChange("wagonCapacity", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 font-mono shadow-sm bg-white"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Packaging Options */}
              {activeTab === "packaging" && (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs animate-in fade-in duration-200">
                  <div className="border-b border-gray-100 pb-3 mb-4 flex items-center justify-between">
                    <h3 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                      <Package2 className="h-4 w-4 text-[#007aff]" />
                      Packaging Options
                    </h3>
                    {!form.id && (
                      <span className="text-[10px] text-amber-500 font-semibold bg-amber-50 px-2 py-1 rounded-lg">
                        Save product first to assign packaging
                      </span>
                    )}
                  </div>

                  {packagingLoading ? (
                    <div className="flex items-center gap-2 py-8 justify-center">
                      <Loader2 className="h-5 w-5 text-[#007aff] animate-spin" />
                      <span className="text-xs text-gray-400">Loading packaging options...</span>
                    </div>
                  ) : (
                    <PackagingSelector
                      allSpecs={allSpecs}
                      selectedIds={selectedPackagingIds}
                      onChange={setSelectedPackagingIds}
                      isEditMode={!!form.id}
                    />
                  )}
                  {packagingError && (
                    <p className="text-amber-600 text-xs font-semibold mt-3">{packagingError}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Edit Mode Actions Block */}
          {isEditMode && (
            <div className="shrink-0 pt-4 border-t border-gray-150 flex items-center justify-between mt-auto bg-slate-50/50">
              {form.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActiveProduct"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-[#007aff] focus:ring-[#007aff]"
                  />
                  <label htmlFor="isActiveProduct" className="text-xs font-semibold text-gray-700">
                    Active Status
                  </label>
                </div>
              ) : (
                <div />
              )}

              <div className="flex gap-3">
                {error && <p className="text-red-500 text-xs font-semibold self-center mr-2">{error}</p>}
                <button
                  type="button"
                  onClick={() => {
                    if (form.id) {
                      setIsEditMode(false);
                      setActiveTab("overview");
                    } else {
                      onClose();
                    }
                  }}
                  className="px-5 py-2.5 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || packagingSaving}
                  className="px-5 py-2.5 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-md shadow-blue-500/20"
                >
                  {(isSaving || packagingSaving) && (
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {form.id ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </Drawer>
  );
}
