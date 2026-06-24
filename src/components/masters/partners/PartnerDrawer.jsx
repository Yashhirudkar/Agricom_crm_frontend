import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Select from "react-select";
import {
  Plus,
  Trash2,
  Edit2,
  Globe,
  Building2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Users2,
  Package,
  CheckCircle,
  FileText,
  User,
} from "lucide-react";
import Drawer from "@/components/common/Drawer";
import HasPermission from "@/components/rbac/HasPermission";
import useSystemOptions from "@/hooks/useSystemOptions";

export default function PartnerDrawer({
  isOpen,
  onClose,
  onSubmit,
  editData,
  isSaving,
  error,
  isEditMode: initialEditMode,
  countries,
  partnerRoles,
  products,
}) {
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [activeTab, setActiveTab] = useState("overview");
  const { options } = useSystemOptions();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      entityName: "",
      partnerRoleId: "",
      countryId: "",
      address: "",
      city: "",
      website: "",
      contactEmail: "",
      taxId: "",
      panNo: "",
      innNo: "",
      financialStatus: "",
      isActive: true,
      productIds: [],
      contacts: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
  });

  // Sync edit mode state when drawer opens or mode changes from parent
  useEffect(() => {
    setIsEditMode(initialEditMode);
    if (isOpen) {
      setActiveTab(initialEditMode ? "general" : "overview");
    }
  }, [isOpen, initialEditMode]);

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        reset({
          entityName: editData.entityName || "",
          partnerRoleId: editData.partnerRoleId || "",
          countryId: editData.countryId || "",
          address: editData.address || "",
          city: editData.city || "",
          website: editData.website || "",
          contactEmail: editData.contactEmail || "",
          taxId: editData.taxId || "",
          panNo: editData.panNo || "",
          innNo: editData.innNo || "",
          financialStatus: editData.financialStatus || "",
          isActive: editData.isActive,
          productIds: editData.products ? editData.products.map((p) => p.id) : [],
          contacts: editData.contacts
            ? editData.contacts.map((c) => ({
                name: c.name,
                designation: c.designation || "",
                phone: c.phone || "",
                email: c.email || "",
                communicationType: c.communicationType || "",
                isPrimary: c.isPrimary || false,
              }))
            : [],
        });
      } else {
        reset({
          entityName: "",
          partnerRoleId: "",
          countryId: "",
          address: "",
          city: "",
          website: "",
          contactEmail: "",
          taxId: "",
          panNo: "",
          innNo: "",
          financialStatus: "",
          isActive: true,
          productIds: [],
          contacts: [],
        });
      }
    }
  }, [isOpen, editData, reset]);

  const onFormSubmit = (data) => {
    const payload = { ...data };

    // Sanitize empty strings to respect backend DTO @IsOptional
    const optionalStringFields = [
      "address",
      "city",
      "website",
      "contactEmail",
      "taxId",
      "panNo",
      "innNo",
      "financialStatus",
    ];
    optionalStringFields.forEach((k) => {
      if (payload[k] === "") delete payload[k];
    });

    if (payload.contacts) {
      payload.contacts = payload.contacts.map((c) => {
        const contact = { ...c };
        ["designation", "phone", "email", "communicationType"].forEach((k) => {
          if (contact[k] === "") delete contact[k];
        });
        return contact;
      });
    }

    payload.partnerRoleId = parseInt(payload.partnerRoleId, 10);
    payload.countryId = parseInt(payload.countryId, 10);

    onSubmit(payload);
  };

  const onFormInvalid = (errors) => {
    if (errors.entityName || errors.partnerRoleId || errors.countryId) {
      setActiveTab("general");
    } else if (
      errors.contactEmail ||
      errors.taxId ||
      errors.panNo ||
      errors.innNo ||
      errors.financialStatus
    ) {
      setActiveTab("financial");
    } else if (errors.productIds) {
      setActiveTab("products");
    } else if (errors.contacts) {
      setActiveTab("contacts");
    }
  };

  const handleCloseAttempt = () => {
    if (isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Convert products array to react-select options format
  const productOptions = products.map((p) => ({ value: p.id, label: p.name }));

  const primaryContact = editData?.contacts?.find((c) => c.isPrimary);

  // Tabs define depending on edit mode or view mode
  const tabs = isEditMode
    ? [
        { id: "general", label: "General Information" },
        { id: "financial", label: "Financial Details" },
        { id: "contacts", label: "Contacts" },
        { id: "products", label: "Products" },
      ]
    : [
        { id: "overview", label: "Overview" },
        { id: "general", label: "General Information" },
        { id: "financial", label: "Financial Details" },
        { id: "contacts", label: "Contacts" },
        { id: "products", label: "Products" },
      ];

  const currentCountry = countries.find(
    (c) => c.id === parseInt(editData?.countryId || editData?.country?.id, 10)
  );
  const currentRole = partnerRoles.find(
    (r) => r.id === parseInt(editData?.partnerRoleId || editData?.partnerRole?.id, 10)
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleCloseAttempt}
      title={editData ? (isEditMode ? `Edit: ${editData.entityName}` : editData.entityName) : "New Partner"}
      widthClass="w-full md:w-[750px] lg:w-[850px]"
    >
      <div className="flex flex-col h-full bg-slate-50/50">
        {/* CRM Info Summary Bar in View Mode */}
        {!isEditMode && editData && (
          <div className="bg-white border-b border-gray-100 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                {editData.entityName?.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400">
                    {currentRole?.name || "Business Partner"}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      editData.isActive
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {editData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="text-sm font-bold text-gray-800 flex items-center gap-1.5 mt-0.5">
                  {currentCountry?.name}
                  {editData.city && <span className="text-gray-400 font-normal">({editData.city})</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <HasPermission permission="partner:update">
                <button
                  onClick={() => {
                    setIsEditMode(true);
                    setActiveTab("general");
                  }}
                  className="px-3.5 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Edit2 className="h-3.5 w-3.5 text-gray-500" /> Edit Partner
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
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Main Area */}
        <form
          onSubmit={handleSubmit(onFormSubmit, onFormInvalid)}
          className="flex-1 overflow-y-auto p-6 flex flex-col"
        >
          {/* VIEW MODE CONTAINER */}
          {!isEditMode && editData && (
            <div className="flex-1 space-y-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Role & Classification
                      </span>
                      <span className="text-sm font-bold text-gray-800 mt-2 flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-[#007aff]" />
                        {currentRole?.name || "-"}
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Financial Status
                      </span>
                      <span className="text-sm font-bold text-gray-800 mt-2 flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4 text-emerald-500" />
                        {editData.financialStatus || "N/A"}
                      </span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Associations Summary
                      </span>
                      <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-gray-600">
                        <span className="flex items-center gap-1 bg-blue-50 text-[#007aff] px-2 py-0.5 rounded">
                          <Users2 className="h-3.5 w-3.5" />
                          {editData.contacts?.length || 0} Contacts
                        </span>
                        <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                          <Package className="h-3.5 w-3.5" />
                          {editData.products?.length || 0} Products
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Contact Card */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                      <User className="h-4 w-4 text-[#007aff]" />
                      Primary Contact Representative
                    </h3>
                    {primaryContact ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Name
                          </div>
                          <div className="text-xs font-bold text-gray-800 mt-0.5">
                            {primaryContact.name}
                          </div>
                        </div>
                        {primaryContact.designation && (
                          <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              Designation
                            </div>
                            <div className="text-xs text-gray-700 mt-0.5">
                              {primaryContact.designation}
                            </div>
                          </div>
                        )}
                        {primaryContact.email && (
                          <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              Email
                            </div>
                            <a
                              href={`mailto:${primaryContact.email}`}
                              className="text-xs text-[#007aff] hover:underline font-medium flex items-center gap-1 mt-0.5"
                            >
                              <Mail className="h-3.5 w-3.5" /> {primaryContact.email}
                            </a>
                          </div>
                        )}
                        {primaryContact.phone && (
                          <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              Phone
                            </div>
                            <div className="text-xs text-gray-700 font-medium flex items-center gap-1 mt-0.5">
                              <Phone className="h-3.5 w-3.5 text-gray-400" /> {primaryContact.phone}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-xs text-gray-400 font-semibold border border-dashed border-gray-100 rounded-xl">
                        No primary contact specified for this partner.
                      </div>
                    )}
                  </div>

                  {/* Company Level Info */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" /> Address Details
                      </h4>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {editData.address || "No address specified."}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5 text-gray-400" /> Web & Digital
                      </h4>
                      {editData.website ? (
                        <a
                          href={editData.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-[#007aff] hover:underline font-bold"
                        >
                          {editData.website}
                        </a>
                      ) : (
                        <p className="text-xs text-gray-400 font-semibold">No website listed.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* General Information Tab */}
              {activeTab === "general" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-xs animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Entity Name
                      </div>
                      <div className="text-sm font-bold text-gray-800 mt-1 uppercase">
                        {editData.entityName}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Partner Role
                      </div>
                      <div className="text-sm font-bold text-gray-850 mt-1">
                        {currentRole?.name || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Country
                      </div>
                      <div className="text-xs font-bold text-gray-800 mt-1">
                        {currentCountry?.name || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        City
                      </div>
                      <div className="text-xs font-bold text-gray-800 mt-1">
                        {editData.city || "-"}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Full Address
                      </div>
                      <div className="text-xs text-gray-700 mt-1 font-medium leading-relaxed">
                        {editData.address || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Website
                      </div>
                      <div className="text-xs text-gray-800 mt-1 font-medium">
                        {editData.website ? (
                          <a
                            href={editData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#007aff] hover:underline"
                          >
                            {editData.website}
                          </a>
                        ) : (
                          "-"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Financial & Tax Details Tab */}
              {activeTab === "financial" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-xs animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Primary Contact Email (Company Level)
                      </div>
                      <div className="text-xs font-bold text-gray-800 mt-1">
                        {editData.contactEmail ? (
                          <a href={`mailto:${editData.contactEmail}`} className="text-[#007aff]">
                            {editData.contactEmail}
                          </a>
                        ) : (
                          "-"
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Tax ID / VAT
                      </div>
                      <div className="text-xs font-mono font-bold text-gray-805 mt-1">
                        {editData.taxId || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        PAN No (India)
                      </div>
                      <div className="text-xs font-mono font-bold text-gray-805 mt-1 uppercase">
                        {editData.panNo || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        INN No (Russia/CIS)
                      </div>
                      <div className="text-xs font-mono font-bold text-gray-850 mt-1">
                        {editData.innNo || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Financial Status
                      </div>
                      <div className="text-xs font-bold text-gray-800 mt-1">
                        {editData.financialStatus || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contacts List Tab */}
              {activeTab === "contacts" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {(!editData.contacts || editData.contacts.length === 0) ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-xs">
                      <p className="text-xs font-semibold text-gray-400">No representative contacts mapped.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {editData.contacts.map((c, index) => (
                        <div key={index} className="bg-white border border-gray-150 p-4 rounded-xl shadow-xs relative">
                          {c.isPrimary && (
                            <span className="absolute top-4 right-4 bg-blue-50 border border-blue-200 text-[#007aff] text-[9px] font-bold px-2 py-0.5 rounded">
                              Primary
                            </span>
                          )}
                          <div className="font-bold text-gray-800 text-xs">{c.name}</div>
                          {c.designation && <div className="text-[10px] text-gray-400 font-semibold mt-0.5">{c.designation}</div>}
                          
                          <div className="mt-3 space-y-1.5">
                            {c.email && (
                              <div className="text-[11px] flex items-center gap-1.5 text-gray-600">
                                <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                <a href={`mailto:${c.email}`} className="text-[#007aff] hover:underline truncate">{c.email}</a>
                              </div>
                            )}
                            {c.phone && (
                              <div className="text-[11px] flex items-center gap-1.5 text-gray-600">
                                <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                <span>{c.phone}</span>
                              </div>
                            )}
                            {c.communicationType && (
                              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1.5 bg-gray-50 px-2 py-0.5 rounded inline-block">
                                Comm: {c.communicationType}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Products List Tab */}
              {activeTab === "products" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs animate-in fade-in duration-200">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                    Authorized Products ({editData.products?.length || 0})
                  </h3>
                  {(!editData.products || editData.products.length === 0) ? (
                    <p className="text-xs text-gray-400 font-semibold py-4 text-center">No authorized products mapped to this business partner.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {editData.products.map((p) => (
                        <span key={p.id} className="px-3 py-1 bg-slate-50 border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold shadow-xs">
                          {p.name}
                        </span>
                      ))}
                    </div>
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
                <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5 shadow-xs animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Entity Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("entityName", { required: "Entity Name is required", maxLength: 200 })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-0 text-gray-700 uppercase bg-gray-50/30"
                        placeholder="e.g. GLOBAL AGRI CORP"
                      />
                      {errors.entityName && (
                        <p className="text-red-500 text-[10px] mt-1 font-semibold">
                          {errors.entityName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Partner Role <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("partnerRoleId", { required: "Partner Role is required" })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-gray-50/30"
                      >
                        <option value="">Select Role...</option>
                        {partnerRoles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                      {errors.partnerRoleId && (
                        <p className="text-red-500 text-[10px] mt-1 font-semibold">
                          {errors.partnerRoleId.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("countryId", { required: "Country is required" })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-gray-50/30"
                      >
                        <option value="">Select Country...</option>
                        {countries.map((con) => (
                          <option key={con.id} value={con.id}>
                            {con.name}
                          </option>
                        ))}
                      </select>
                      {errors.countryId && (
                        <p className="text-red-500 text-[10px] mt-1 font-semibold">
                          {errors.countryId.message}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Address
                      </label>
                      <input
                        {...register("address", { maxLength: 1000 })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-gray-50/30"
                        placeholder="Full street address..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        City
                      </label>
                      <input
                        {...register("city", { maxLength: 100 })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-gray-50/30"
                        placeholder="City name"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Website
                      </label>
                      <input
                        {...register("website", { maxLength: 300 })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-gray-50/30"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Financial Details */}
              {activeTab === "financial" && (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5 shadow-xs animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Primary Contact Email (Company Level)
                      </label>
                      <input
                        type="email"
                        {...register("contactEmail", { maxLength: 255 })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-white"
                        placeholder="info@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Tax ID / VAT
                      </label>
                      <input
                        {...register("taxId", { maxLength: 50 })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-white font-mono"
                        placeholder="Tax Identification Number"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        PAN No (India)
                      </label>
                      <input
                        {...register("panNo", { maxLength: 50 })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-white font-mono uppercase"
                        placeholder="ABCDE1234F"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        INN No (Russia/CIS)
                      </label>
                      <input
                        {...register("innNo", { maxLength: 50 })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Financial Status
                      </label>
                      <select
                        {...register("financialStatus", { maxLength: 100 })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-white"
                      >
                        <option value="">Select Status...</option>
                        {options?.masters?.financialStatuses?.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Contacts (Array) */}
              {activeTab === "contacts" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-gray-150 pb-3 bg-white p-4 rounded-xl shadow-xs">
                    <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#007aff]"></span>
                      Partner Representatives
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        append({
                          name: "",
                          designation: "",
                          phone: "",
                          email: "",
                          communicationType: "",
                          isPrimary: false,
                        })
                      }
                      className="px-3 py-1.5 bg-[#007aff]/10 hover:bg-[#007aff]/20 text-[#007aff] rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="h-3 w-3" /> Add Contact
                    </button>
                  </div>

                  {fields.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200 shadow-xs">
                      <p className="text-xs font-semibold text-gray-400">No contacts added yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="relative p-4 bg-white border border-gray-200 rounded-2xl shadow-xs group"
                        >
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="absolute -top-2 -right-2 p-1.5 bg-white border border-gray-250 text-gray-400 hover:text-red-500 hover:border-red-200 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Remove Contact"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="md:col-span-1">
                              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                Contact Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                {...register(`contacts.${index}.name`, {
                                  required: "Name is required",
                                  maxLength: 200,
                                })}
                                className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-gray-50/30"
                                placeholder="Full Name"
                              />
                              {errors.contacts?.[index]?.name && (
                                <p className="text-red-500 text-[10px] mt-0.5 font-semibold">
                                  {errors.contacts[index].name.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                Designation
                              </label>
                              <input
                                {...register(`contacts.${index}.designation`, { maxLength: 100 })}
                                className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-white"
                                placeholder="e.g. Sales Manager"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                Email
                              </label>
                              <input
                                type="email"
                                {...register(`contacts.${index}.email`, { maxLength: 255 })}
                                className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-white"
                                placeholder="email@company.com"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                Phone
                              </label>
                              <input
                                {...register(`contacts.${index}.phone`, { maxLength: 50 })}
                                className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-white"
                                placeholder="+1 234 567 8900"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                Comm. Type
                              </label>
                              <select
                                {...register(`contacts.${index}.communicationType`, {
                                  maxLength: 50,
                                })}
                                className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-white"
                              >
                                <option value="">Select...</option>
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="WeChat">WeChat</option>
                                <option value="Telegram">Telegram</option>
                                <option value="Skype">Skype</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2 pt-5">
                              <input
                                type="checkbox"
                                {...register(`contacts.${index}.isPrimary`)}
                                className="h-4 w-4 rounded border-gray-300 text-[#007aff] focus:ring-[#007aff]"
                              />
                              <label className="text-[11px] font-bold text-gray-700">
                                Primary Contact
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: Products Mapping */}
              {activeTab === "products" && (
                <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5 shadow-xs animate-in fade-in duration-200">
                  <div className="bg-[#f8f9fc] p-5 rounded-xl border border-gray-100">
                    <p className="text-[11px] font-bold text-gray-700 mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-gray-200 pb-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#007aff]"></span>
                      Select Permitted Products for this Partner
                    </p>
                    <div className="mb-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Search and Multi-Select Products (Max 100)
                      </label>
                      <Controller
                        name="productIds"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            isMulti
                            options={productOptions}
                            className="text-xs"
                            classNamePrefix="select"
                            placeholder="Type to search products..."
                            value={productOptions.filter((c) => field.value.includes(c.value))}
                            onChange={(val) => field.onChange(val.map((c) => c.value))}
                            styles={{
                              control: (base) => ({
                                ...base,
                                minHeight: "42px",
                                borderColor: "#e5e7eb",
                                borderRadius: "0.5rem",
                                boxShadow: "none",
                                "&:hover": { borderColor: "#007aff" },
                              }),
                              option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isSelected
                                  ? "#007aff"
                                  : state.isFocused
                                  ? "#f0f7ff"
                                  : "white",
                                color: state.isSelected ? "white" : "#374151",
                                fontSize: "12px",
                              }),
                              multiValue: (base) => ({
                                ...base,
                                backgroundColor: "#eff6ff",
                                borderRadius: "0.25rem",
                                border: "1px solid #bfdbfe",
                              }),
                              multiValueLabel: (base) => ({
                                ...base,
                                color: "#1d4ed8",
                                fontSize: "11px",
                                fontWeight: "600",
                              }),
                              multiValueRemove: (base) => ({
                                ...base,
                                color: "#1d4ed8",
                                ":hover": {
                                  backgroundColor: "#bfdbfe",
                                  color: "#1e3a8a",
                                },
                              }),
                            }}
                          />
                        )}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium mt-2">
                      Select the exact products this partner is authorized to supply or buy. This mapping
                      restricts their available products in transactions.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Edit Mode Actions Block */}
          {isEditMode && (
            <div className="shrink-0 pt-4 border-t border-gray-150 flex items-center justify-between mt-auto bg-slate-50/50">
              {editData ? (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActivePartner"
                    {...register("isActive")}
                    className="h-4 w-4 rounded border-gray-300 text-[#007aff] focus:ring-[#007aff]"
                  />
                  <label htmlFor="isActivePartner" className="text-xs font-semibold text-gray-700">
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
                    if (editData) {
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
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-md shadow-blue-500/20"
                >
                  {isSaving && (
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {editData ? "Save Changes" : "Create Partner"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </Drawer>
  );
}
