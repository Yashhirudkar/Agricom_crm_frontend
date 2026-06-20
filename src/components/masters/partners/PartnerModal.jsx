import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Select from "react-select";
import { Plus, Trash2 } from "lucide-react";
import Modal from "@/components/modals/Modal";

export default function PartnerModal({
  isOpen,
  onClose,
  onSubmit,
  editData,
  isSaving,
  error,
  isEditMode,
  categories, // not used directly in Partner but good for future
  countries,
  hscodes, // not used directly
  partnerRoles,
  products, // active products list
}) {
  const [activeTab, setActiveTab] = useState("general");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
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

  useEffect(() => {
    if (isOpen) {
      setActiveTab("general");
      if (isEditMode && editData) {
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
          contacts: editData.contacts ? editData.contacts.map(c => ({
            name: c.name,
            designation: c.designation || "",
            phone: c.phone || "",
            email: c.email || "",
            communicationType: c.communicationType || "",
            isPrimary: c.isPrimary || false,
          })) : [],
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
  }, [isOpen, isEditMode, editData, reset]);

  const onFormSubmit = (data) => {
    const payload = { ...data };

    // Sanitize empty strings to respect backend DTO @IsOptional
    const optionalStringFields = [
      "address", "city", "website", "contactEmail", 
      "taxId", "panNo", "innNo", "financialStatus"
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

  // Convert products array to react-select options format
  const productOptions = products.map(p => ({ value: p.id, label: p.name }));

  const tabs = [
    { id: "general", label: "General Information" },
    { id: "financial", label: "Financial & Tax Details" },
    { id: "products", label: "Products Mapping" },
    { id: "contacts", label: "Contacts" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Partner" : "New Partner"} maxWidth="max-w-4xl">
      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col h-[75vh] max-h-[700px]">
        
        {/* Tabs Header */}
        <div className="flex border-b border-gray-200 mb-5 overflow-x-auto shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-[#007aff] text-[#007aff]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 pb-4">
          
          {/* TAB 1: General Information */}
          {activeTab === "general" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
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
                  {errors.entityName && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.entityName.message}</p>}
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
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                  {errors.partnerRoleId && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.partnerRoleId.message}</p>}
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
                      <option key={con.id} value={con.id}>{con.name}</option>
                    ))}
                  </select>
                  {errors.countryId && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.countryId.message}</p>}
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

          {/* TAB 2: Financial & Tax */}
          {activeTab === "financial" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
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
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Poor">Poor</option>
                    <option value="Blacklisted">Blacklisted</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Products Mapping */}
          {activeTab === "products" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200 min-h-[300px]">
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
                        value={productOptions.filter(c => field.value.includes(c.value))}
                        onChange={(val) => field.onChange(val.map(c => c.value))}
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: '42px',
                            borderColor: '#e5e7eb',
                            borderRadius: '0.5rem',
                            boxShadow: 'none',
                            '&:hover': { borderColor: '#007aff' }
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected ? '#007aff' : state.isFocused ? '#f0f7ff' : 'white',
                            color: state.isSelected ? 'white' : '#374151',
                            fontSize: '12px'
                          }),
                          multiValue: (base) => ({
                            ...base,
                            backgroundColor: '#eff6ff',
                            borderRadius: '0.25rem',
                            border: '1px solid #bfdbfe'
                          }),
                          multiValueLabel: (base) => ({
                            ...base,
                            color: '#1d4ed8',
                            fontSize: '11px',
                            fontWeight: '600'
                          }),
                          multiValueRemove: (base) => ({
                            ...base,
                            color: '#1d4ed8',
                            ':hover': {
                              backgroundColor: '#bfdbfe',
                              color: '#1e3a8a',
                            },
                          }),
                        }}
                      />
                    )}
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-medium">
                  Select the exact products this partner is authorized to supply or buy. This mapping restricts their available products in transactions.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Contacts Array */}
          {activeTab === "contacts" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#007aff]"></span>
                  Partner Representatives
                </p>
                <button
                  type="button"
                  onClick={() => append({ name: "", designation: "", phone: "", email: "", communicationType: "", isPrimary: false })}
                  className="px-3 py-1.5 bg-[#007aff]/10 hover:bg-[#007aff]/20 text-[#007aff] rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                >
                  <Plus className="h-3 w-3" /> Add Contact
                </button>
              </div>

              {fields.length === 0 ? (
                <div className="text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-xs font-semibold text-gray-400">No contacts added yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="relative p-4 bg-white border border-gray-200 rounded-xl shadow-sm group">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="absolute -top-2 -right-2 p-1.5 bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 rounded-full shadow-sm transition-all opacity-0 group-hover:opacity-100"
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
                            {...register(`contacts.${index}.name`, { required: "Name is required", maxLength: 200 })}
                            className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-gray-50/30"
                            placeholder="Full Name"
                          />
                          {errors.contacts?.[index]?.name && <p className="text-red-500 text-[10px] mt-0.5 font-semibold">{errors.contacts[index].name.message}</p>}
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
                            {...register(`contacts.${index}.communicationType`, { maxLength: 50 })}
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

        </div>

        {/* Footer Actions */}
        <div className="shrink-0 pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
          {isEditMode ? (
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
          ) : <div></div>}
          
          <div className="flex gap-3">
            {error && <p className="text-red-500 text-xs font-semibold self-center mr-2">{error}</p>}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-bold cursor-pointer transition-colors"
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
              {isEditMode ? "Save Changes" : "Create Partner"}
            </button>
          </div>
        </div>

      </form>
    </Modal>
  );
}
