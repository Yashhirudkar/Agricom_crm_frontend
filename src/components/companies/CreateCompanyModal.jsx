import React, { useState, useEffect } from "react";
import Modal from "@/components/modals/Modal";
import { UploadCloud, X, Image as ImageIcon, ChevronRight, ChevronLeft } from "lucide-react";
import axiosClient, { getAvatarUrl } from "@/lib/axios";

const TABS = [
  { id: "general", label: "General" },
  { id: "business", label: "Business" },
  { id: "branding", label: "Branding" },
  { id: "contact", label: "Contact" },
  { id: "address", label: "Address" }
];

export default function CreateCompanyModal({
  isOpen,
  closeModals,
  handleSubmit,
  form,
  setForm,
  isSaving,
  userType,
  clients,
  error,
  options,
  isEditMode = false,
}) {
  const [activeTab, setActiveTab] = useState("general");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setActiveTab("general");
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    if (type === "logo" && form.logoUrl) formData.append("oldUrl", form.logoUrl);
    if (type === "favicon" && form.faviconUrl) formData.append("oldUrl", form.faviconUrl);

    const setUploading = type === "logo" ? setIsUploadingLogo : setIsUploadingFavicon;
    const urlField = type === "logo" ? "logoUrl" : "faviconUrl";
    const endpoint = type === "logo" ? "/upload-logo" : "/upload-favicon";

    setUploading(true);
    try {
      const res = await axiosClient.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.url) {
        setForm((prev) => ({ ...prev, [urlField]: res.data.url }));
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (type) => {
    setForm((prev) => ({ ...prev, [type === "logo" ? "logoUrl" : "faviconUrl"]: "" }));
  };

  const validateCurrentTab = () => {
    const newErrors = {};
    if (activeTab === "general") {
      if (!form.name?.trim()) newErrors.name = "Company Name is required";
      if (userType === "super_admin" && !form.clientId && !isEditMode) newErrors.clientId = "Tenant is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextTab = () => {
    if (!validateCurrentTab()) return;
    const currentIndex = TABS.findIndex((t) => t.id === activeTab);
    if (currentIndex < TABS.length - 1) {
      setActiveTab(TABS[currentIndex + 1].id);
    }
  };

  const prevTab = () => {
    const currentIndex = TABS.findIndex((t) => t.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(TABS[currentIndex - 1].id);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateCurrentTab()) return;
    handleSubmit(e);
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModals} title={isEditMode ? "Edit Enterprise Workspace" : "New Enterprise Workspace"} maxWidth="max-w-3xl">
      <div className="flex flex-col h-full">
        {/* Tabs Header */}
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2 overflow-x-auto custom-scrollbar">
          {TABS.map((tab, idx) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (idx < TABS.findIndex(t => t.id === activeTab) || validateCurrentTab()) {
                  setActiveTab(tab.id);
                }
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${activeTab === tab.id
                  ? "bg-[#007aff] text-white"
                  : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="flex-1 flex flex-col">
          <div className="min-h-[300px] max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">

            {/* GENERAL TAB */}
            {activeTab === "general" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Company Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={form.name || ""}
                      onChange={handleChange}
                      className={`w-full border rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none transition-colors ${errors.name ? 'border-red-300 bg-red-50 text-red-900' : 'border-gray-200 text-gray-700 bg-gray-50/50 hover:bg-white'}`}
                      placeholder="e.g. Acme Corp"
                    />
                    {errors.name && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Legal Name</label>
                    <input
                      type="text"
                      name="legalName"
                      value={form.legalName || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-gray-50/50 hover:bg-white transition-colors"
                      placeholder="e.g. Acme Corporation Pvt. Ltd."
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Company Code</label>
                    <input
                      type="text"
                      name="companyCode"
                      value={form.companyCode || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-gray-50/50 hover:bg-white transition-colors uppercase"
                      placeholder="e.g. ACM001"
                    />
                  </div>
                  {userType === "super_admin" && !isEditMode && (
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Assign to Tenant <span className="text-red-500">*</span></label>
                      <select
                        name="clientId"
                        value={form.clientId || ""}
                        onChange={handleChange}
                        className={`w-full border rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none transition-colors ${errors.clientId ? 'border-red-300 bg-red-50 text-red-900' : 'border-gray-200 text-gray-700 bg-gray-50/50 hover:bg-white'}`}
                      >
                        <option value="" disabled>Select Tenant Client...</option>
                        {clients?.map((c) => (
                          <option key={c.id} value={c.id}>{c.name} (Client #{c.id})</option>
                        ))}
                      </select>
                      {errors.clientId && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.clientId}</p>}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* BUSINESS TAB */}
            {activeTab === "business" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Company Type</label>
                    <select
                      name="companyType"
                      value={form.companyType || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-gray-50/50 hover:bg-white transition-colors"
                    >
                      <option value="">Select Type</option>
                      {options?.companies?.types?.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Industry Type</label>
                    <select
                      name="industryType"
                      value={form.industryType || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-gray-50/50 hover:bg-white transition-colors"
                    >
                      <option value="">Select Industry</option>
                      {options?.companies?.industryTypes?.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Registration Number</label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={form.registrationNumber || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-gray-50/50 hover:bg-white transition-colors"
                      placeholder="e.g. CIN / EIN"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tax Number</label>
                    <input
                      type="text"
                      name="taxNumber"
                      value={form.taxNumber || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-gray-50/50 hover:bg-white transition-colors"
                      placeholder="e.g. GSTIN / VAT"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Employee Count</label>
                    <input
                      type="number"
                      name="employeeCount"
                      value={form.employeeCount || ""}
                      onChange={handleChange}
                      min={0}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-gray-50/50 hover:bg-white transition-colors"
                      placeholder="e.g. 50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Company Size</label>
                    <select
                      name="companySize"
                      value={form.companySize || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-gray-50/50 hover:bg-white transition-colors"
                    >
                      <option value="">Select Size</option>
                      {options?.companies?.companySizes?.map((size) => (
                        <option key={size} value={size}>{size} employees</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Established Year</label>
                    <input
                      type="number"
                      name="establishedYear"
                      value={form.establishedYear || ""}
                      onChange={handleChange}
                      min={1800}
                      max={new Date().getFullYear()}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-gray-50/50 hover:bg-white transition-colors"
                      placeholder="e.g. 2015"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                    <textarea
                      name="description"
                      value={form.description || ""}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-gray-50/50 hover:bg-white transition-colors resize-none"
                      placeholder="Brief description about the company..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* BRANDING TAB */}
            {activeTab === "branding" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Company Logo</label>
                    {form.logoUrl ? (
                      <div className="relative border border-gray-200 rounded-xl p-4 bg-white shadow-xs flex flex-col items-center justify-center gap-3 group h-40">
                        <button type="button" onClick={() => removeImage("logo")} className="absolute top-2 right-2 p-1.5 bg-gray-100 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10">
                          <X className="h-4 w-4" />
                        </button>
                        <img 
                          src={getAvatarUrl(form.logoUrl)} 
                          alt="Logo Preview" 
                          className="h-20 w-auto object-contain rounded-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                            if (e.target.nextElementSibling) {
                              e.target.nextElementSibling.classList.remove("hidden");
                            }
                          }}
                        />
                        <div className="hidden flex-col items-center gap-1 text-red-500 text-xs font-semibold">
                          <ImageIcon className="h-8 w-8 text-gray-300" />
                          <span>Image File Not Found</span>
                        </div>
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">Logo Uploaded</span>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-gray-200 hover:border-[#007aff] rounded-xl p-6 bg-gray-50/50 hover:bg-[#007aff]/5 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all text-center relative overflow-hidden group h-40">
                        {isUploadingLogo && <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm z-10"><div className="h-6 w-6 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin" /></div>}
                        <UploadCloud className="h-8 w-8 text-gray-300 group-hover:text-[#007aff] transition-colors" />
                        <div>
                          <p className="text-xs font-bold text-gray-700 group-hover:text-[#007aff] transition-colors">Click or drag to upload Logo</p>
                          <p className="text-[10px] text-gray-400 font-medium mt-1">SVG, PNG, JPG or WebP (max. 5MB)</p>
                        </div>
                        <input type="file" className="hidden" accept=".png,.jpg,.jpeg,.svg,.webp" onChange={(e) => handleFileUpload(e, "logo")} disabled={isUploadingLogo} />
                      </label>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Company Favicon</label>
                    {form.faviconUrl ? (
                      <div className="relative border border-gray-200 rounded-xl p-4 bg-white shadow-xs flex flex-col items-center justify-center gap-3 group h-40">
                        <button type="button" onClick={() => removeImage("favicon")} className="absolute top-2 right-2 p-1.5 bg-gray-100 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10">
                          <X className="h-4 w-4" />
                        </button>
                        <img 
                          src={getAvatarUrl(form.faviconUrl)} 
                          alt="Favicon Preview" 
                          className="h-12 w-12 object-contain rounded-lg shadow-sm border border-gray-100" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                            if (e.target.nextElementSibling) {
                              e.target.nextElementSibling.classList.remove("hidden");
                            }
                          }}
                        />
                        <div className="hidden flex-col items-center gap-1 text-red-500 text-xs font-semibold">
                          <ImageIcon className="h-6 w-6 text-gray-300" />
                          <span>Favicon Not Found</span>
                        </div>
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">Favicon Uploaded</span>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-gray-200 hover:border-[#007aff] rounded-xl p-6 bg-gray-50/50 hover:bg-[#007aff]/5 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all text-center relative overflow-hidden group h-40">
                        {isUploadingFavicon && <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm z-10"><div className="h-6 w-6 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin" /></div>}
                        <ImageIcon className="h-8 w-8 text-gray-300 group-hover:text-[#007aff] transition-colors" />
                        <div>
                          <p className="text-xs font-bold text-gray-700 group-hover:text-[#007aff] transition-colors">Click or drag to upload Favicon</p>
                          <p className="text-[10px] text-gray-400 font-medium mt-1">ICO, PNG or SVG (max. 5MB)</p>
                        </div>
                        <input type="file" className="hidden" accept=".png,.ico,.svg" onChange={(e) => handleFileUpload(e, "favicon")} disabled={isUploadingFavicon} />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CONTACT TAB */}
            {activeTab === "contact" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-gray-50/50 hover:bg-white transition-colors"
                      placeholder="contact@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={form.phone || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-gray-50/50 hover:bg-white transition-colors"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={form.website || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-gray-50/50 hover:bg-white transition-colors"
                      placeholder="https://company.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ADDRESS TAB */}
            {activeTab === "address" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Street Address</label>
                    <textarea
                      name="address"
                      value={form.address || ""}
                      onChange={handleChange}
                      rows={2}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-gray-50/50 hover:bg-white transition-colors resize-none"
                      placeholder="123 Business Avenue..."
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-gray-50/50 hover:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">State / Province</label>
                    <input
                      type="text"
                      name="state"
                      value={form.state || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-gray-50/50 hover:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={form.country || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-gray-50/50 hover:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Pincode / ZIP</label>
                    <input
                      type="text"
                      name="pincode"
                      value={form.pincode || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-gray-50/50 hover:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-xs font-semibold border border-red-100 flex items-center gap-2 mt-4">
              <span className="h-4 w-4 shrink-0 bg-red-100 rounded-full flex items-center justify-center">!</span>
              {error}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-6 bg-white pb-2">
            <div>
              {activeTab !== "general" && (
                <button
                  type="button"
                  onClick={prevTab}
                  className="px-4 py-2 text-gray-500 hover:text-gray-900 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeModals}
                className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              {activeTab !== "address" ? (
                <button
                  type="button"
                  onClick={nextTab}
                  className="px-6 py-2.5 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-sm disabled:opacity-70"
                >
                  {isSaving && <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {isEditMode ? "Save Changes" : "Create Workspace"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
