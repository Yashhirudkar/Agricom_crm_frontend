import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Drawer from "@/components/common/Drawer";
import Select from "react-select";
import { 
  FileText, 
  MapPin, 
  Package, 
  Save, 
  AlertCircle, 
  Loader2, 
  Search, 
  X, 
  ChevronDown 
} from "lucide-react";
import { enquiriesApi } from "../services/enquiriesApi";
import { useEnquiriesMasters } from "../hooks/useEnquiries";
import { useCurrencyMaster } from "../hooks/useCurrencyMaster";
import LocationHierarchy from "@/components/common/LocationHierarchy";
import PortSelector from "@/components/common/PortSelector";
import axiosClient from "@/lib/axios";
import { getAllCountryOptions } from "@/lib/countryUtils";

export default function EnquiryDrawer({ isOpen, onClose, editData, isViewMode, onSaveSuccess }) {
  const { masters, loading: mastersLoading } = useEnquiriesMasters();
  const { data: currencies = [], isLoading: currenciesLoading } = useCurrencyMaster();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    enquiryNo: "",
    enquiryDate: new Date().toISOString().split("T")[0],
    partnerRoleId: "",
    partnerId: "",
    productId: "",
    originCountryId: "",
    shipmentMode: "",
    originPort: "",
    destinationPort: "",
    podPort: "",
    originState: "",
    originCity: "",
    destinationCountry: "",
    destinationState: "",
    destinationCity: "",
    purity: "",
    packingTypeId: "",
    shipmentType: "",
    quantity: "",
    shipmentDate: "",
    buyingInterest: "",
    bidCurrency: "",
    potentialEnquiry: false,
  });

  const [initialFormState, setInitialFormState] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // States for partner selection inside Drawer
  const [partnerOptions, setPartnerOptions] = useState([]);
  const [partnerLoading, setPartnerLoading] = useState(false);
  const [partnerSearch, setPartnerSearch] = useState("");
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const [selectedPartnerName, setSelectedPartnerName] = useState("");
  const partnerDropdownRef = useRef(null);

  // Reusable classes
  const inp = "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white text-gray-800 transition-all";
  const lbl = "block text-[11px] font-semibold text-gray-600 mb-1.5";
  const err = "text-[10px] text-red-500 mt-1";

  // Watch form changes to set isDirty
  useEffect(() => {
    if (!isOpen) return;
    const isChanged = JSON.stringify(form) !== JSON.stringify(initialFormState);
    setIsDirty(isChanged);
  }, [form, initialFormState, isOpen]);

  // Sync / load form states on open / editData changes
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        const initialForm = {
          enquiryNo: editData.enquiryNo || "",
          enquiryDate: editData.enquiryDate ? editData.enquiryDate.split("T")[0] : "",
          partnerRoleId: editData.partnerRoleId || "",
          partnerId: editData.partnerId || "",
          productId: editData.productId || "",
          originCountryId: editData.originCountryId || "",
          shipmentMode: editData.shipmentMode || "",
          originPort: editData.originPort || "",
          destinationPort: editData.destinationPort || "",
          podPort: editData.destinationPort || editData.podName || "",
          originState: editData.originState || "",
          originCity: editData.originCity || "",
          destinationCountry: editData.destinationCountry || "",
          destinationState: editData.destinationState || "",
          destinationCity: editData.destinationCity || "",
          purity: editData.purity || "",
          packingTypeId: editData.packingTypeId || "",
          shipmentType: editData.shipmentType || "",
          quantity: editData.quantity || "",
          shipmentDate: editData.shipmentDate ? editData.shipmentDate.split("T")[0] : "",
          buyingInterest: editData.buyingInterest || "",
          bidCurrency: editData.bidCurrency || "",
          potentialEnquiry: editData.potentialEnquiry || false,
        };
        setForm(initialForm);
        setInitialFormState(initialForm);
        setIsDirty(false);

        // Background query to refresh form data
        enquiriesApi.getOne(editData.id)
          .then((fresh) => {
            if (fresh) {
              const freshForm = {
                enquiryNo: fresh.enquiryNo || "",
                enquiryDate: fresh.enquiryDate ? fresh.enquiryDate.split("T")[0] : "",
                partnerRoleId: fresh.partnerRoleId || "",
                partnerId: fresh.partnerId || "",
                productId: fresh.productId || "",
                originCountryId: fresh.originCountryId || "",
                shipmentMode: fresh.shipmentMode || "",
                originPort: fresh.originPort || "",
                destinationPort: fresh.destinationPort || "",
                podPort: fresh.destinationPort || fresh.podPort || fresh.podName || "",
                originState: fresh.originState || "",
                originCity: fresh.originCity || "",
                destinationCountry: fresh.destinationCountry || "",
                destinationState: fresh.destinationState || "",
                destinationCity: fresh.destinationCity || "",
                purity: fresh.purity || "",
                packingTypeId: fresh.packingTypeId || "",
                shipmentType: fresh.shipmentType || "",
                quantity: fresh.quantity || "",
                shipmentDate: fresh.shipmentDate ? fresh.shipmentDate.split("T")[0] : "",
                buyingInterest: fresh.buyingInterest || "",
                bidCurrency: fresh.bidCurrency || "",
                potentialEnquiry: fresh.potentialEnquiry || false,
              };
              setForm(freshForm);
              setInitialFormState(freshForm);
            }
          })
          .catch((e) => console.error("Error refreshing background enquiry", e));
      } else {
        const emptyForm = {
          enquiryNo: "",
          enquiryDate: new Date().toISOString().split("T")[0],
          partnerRoleId: "",
          partnerId: "",
          productId: "",
          originCountryId: "",
          shipmentMode: "",
          originPort: "",
          destinationPort: "",
          podPort: "",
          originState: "",
          originCity: "",
          destinationCountry: "",
          destinationState: "",
          destinationCity: "",
          purity: "",
          packingTypeId: "",
          shipmentType: "",
          quantity: "",
          shipmentDate: "",
          buyingInterest: "",
          bidCurrency: "",
          potentialEnquiry: false,
        };
        setForm(emptyForm);
        setInitialFormState(emptyForm);
        setIsDirty(false);
      }
      setErrors({});
      setError(null);
    }
  }, [isOpen, editData]);

  // Fetch partners asynchronously based on role and search query
  const fetchPartnerOptions = useCallback(async (roleId, search = "") => {
    if (!roleId) {
      setPartnerOptions([]);
      return;
    }
    setPartnerLoading(true);
    try {
      const res = await axiosClient.get("/masters/partners/options", {
        params: { partnerRoleId: roleId, search: search || undefined },
      });
      const data = res.data?.data || res.data || [];
      setPartnerOptions(data);
    } catch (e) {
      console.error("Failed to fetch partner options", e);
      setPartnerOptions([]);
    } finally {
      setPartnerLoading(false);
    }
  }, []);

  // Sync partner selections
  useEffect(() => {
    if (form.partnerRoleId) {
      fetchPartnerOptions(form.partnerRoleId, partnerSearch);
    } else {
      setPartnerOptions([]);
      setSelectedPartnerName("");
    }
  }, [form.partnerRoleId, fetchPartnerOptions]);

  useEffect(() => {
    if (!form.partnerRoleId) return;
    const timer = setTimeout(() => {
      fetchPartnerOptions(form.partnerRoleId, partnerSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [partnerSearch, form.partnerRoleId, fetchPartnerOptions]);

  useEffect(() => {
    if (form.partnerId) {
      const found = partnerOptions.find((p) => p.id === form.partnerId);
      if (found) {
        setSelectedPartnerName(found.entityName);
      } else if (!selectedPartnerName) {
        axiosClient.get(`/masters/partners/${form.partnerId}`).then((res) => {
          if (res.data?.entityName) {
            setSelectedPartnerName(res.data.entityName);
          }
        }).catch(() => {});
      }
    } else {
      setSelectedPartnerName("");
    }
  }, [form.partnerId, partnerOptions]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (partnerDropdownRef.current && !partnerDropdownRef.current.contains(event.target)) {
        setIsPartnerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Country options for SHIP mode
  const countryOptions = useMemo(() => {
    return getAllCountryOptions().map((c) => ({
      value: c.value,
      label: c.label,
      isoCode: c.alpha2,
    }));
  }, []);

  const selectedOriginCountryOption = useMemo(() => {
    if (!form.originCountryId) return null;
    return { value: form.originCountryId, label: form.originCountryId };
  }, [form.originCountryId]);

  const selectedDestinationCountryOption = useMemo(() => {
    if (!form.destinationCountry) return null;
    return { value: form.destinationCountry, label: form.destinationCountry };
  }, [form.destinationCountry]);

  // Currency select formatters
  const currencyOptions = useMemo(() => {
    return currencies.map((c) => ({
      value: c.code,
      label: `${c.code} - ${c.name}`,
    }));
  }, [currencies]);

  const selectedCurrencyOption = useMemo(() => {
    if (!form.bidCurrency) return null;
    const found = currencies.find(
      (c) => c.code.toUpperCase() === form.bidCurrency.toUpperCase()
    );
    return found 
      ? { value: found.code, label: `${found.code} - ${found.name}` } 
      : { value: form.bidCurrency, label: form.bidCurrency };
  }, [form.bidCurrency, currencies]);

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: errors.bidCurrency ? "#ef4444" : state.isFocused ? "#007aff" : "#e2e8f0",
      borderRadius: "0.75rem",
      fontSize: "12px",
      boxShadow: "none",
      minHeight: "38px",
      backgroundColor: "white",
      "&:hover": { borderColor: errors.bidCurrency ? "#ef4444" : state.isFocused ? "#007aff" : "#cbd5e1" },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#007aff" : state.isFocused ? "#f8fafc" : "white",
      color: state.isSelected ? "white" : "#334155",
      fontSize: "12px",
      cursor: "pointer",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const handleShipmentModeChange = (e) => {
    const val = e.target.value;
    setForm((f) => {
      const updated = { ...f, shipmentMode: val };
      if (val === "SHIP") {
        // Clear state & city fields (Country and Port are active)
        updated.originState = "";
        updated.originCity = "";
        updated.destinationState = "";
        updated.destinationCity = "";
      } else {
        updated.originPort = "";
        updated.destinationPort = "";
        updated.podPort = "";
      }
      return updated;
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.enquiryDate) newErrors.enquiryDate = "Enquiry Date is required";
    if (!form.partnerRoleId) newErrors.partnerRoleId = "Role is required";
    if (!form.partnerId) newErrors.partnerId = "Partner is required";
    if (!form.productId) newErrors.productId = "Product is required";
    if (!form.shipmentMode) newErrors.shipmentMode = "Shipment Mode is required";

    if (form.shipmentMode === "SHIP") {
      if (!form.originCountryId) newErrors.originCountryId = "Origin Country is required";
      if (!form.originPort) newErrors.originPort = "Origin Port is required";
      if (!form.destinationCountry) newErrors.destinationCountry = "Destination Country is required";
      if (!form.destinationPort) newErrors.destinationPort = "Destination Port is required";
    } else if (form.shipmentMode === "ROAD" || form.shipmentMode === "RAIL") {
      if (!form.originCountryId) newErrors.originCountryId = "Origin Country is required";
      if (!form.originState) newErrors.originState = "Origin State is required";
      if (!form.originCity) newErrors.originCity = "Origin City is required";
      if (!form.destinationCountry) newErrors.destinationCountry = "Destination Country is required";
      if (!form.destinationState) newErrors.destinationState = "Destination State is required";
      if (!form.destinationCity) newErrors.destinationCity = "Destination City is required";
    }

    if (form.buyingInterest !== undefined && form.buyingInterest !== null && form.buyingInterest !== "") {
      if (Number(form.buyingInterest) < 0) {
        newErrors.buyingInterest = "Bid Amount must be positive";
      }
      if (!form.bidCurrency) {
        newErrors.bidCurrency = "Currency is required when Bid Amount is entered";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (isViewMode) return;
    if (!validate()) return;

    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...form,
        enquiryDate: form.enquiryDate ? new Date(form.enquiryDate).toISOString() : undefined,
        shipmentDate: form.shipmentDate ? new Date(form.shipmentDate).toISOString() : undefined,
        partnerRoleId: Number(form.partnerRoleId),
        partnerId: Number(form.partnerId),
        productId: Number(form.productId),
        packingTypeId: form.packingTypeId ? Number(form.packingTypeId) : undefined,
        quantity: form.quantity ? Number(form.quantity) : undefined,
        buyingInterest: form.buyingInterest ? Number(form.buyingInterest) : undefined,
      };

      // clean up empty strings and UI-only fields
      if (!payload.podPort) delete payload.podPort;
      if (!payload.purity) delete payload.purity;
      if (!payload.shipmentType) delete payload.shipmentType;
      if (!payload.shipmentDate) delete payload.shipmentDate;
      delete payload.enquiryNo;

      if (payload.shipmentMode === "SHIP") {
        delete payload.originState;
        delete payload.originCity;
        delete payload.destinationState;
        delete payload.destinationCity;
      } else {
        delete payload.originPort;
        delete payload.destinationPort;
      }

      if (editData) {
        await enquiriesApi.update(editData.id, payload);
      } else {
        await enquiriesApi.create(payload);
      }

      onSaveSuccess?.();
      setIsDirty(false);
      onClose();
    } catch (err) {
      console.error(err);
      let errMsg = "Failed to save enquiry";
      if (err.response?.data?.message) {
        errMsg = Array.isArray(err.response.data.message) 
          ? err.response.data.message.join(", ") 
          : err.response.data.message;
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (isDirty && !isViewMode) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const titleText = isViewMode 
    ? "Enquiry Details" 
    : editData 
      ? `Edit Enquiry: ${form.enquiryNo}` 
      : "New Enquiry";

  const {
    partnerRoles = [],
    products = [],
    packingTypes = [],
    shipmentTypes = []
  } = masters || {};

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={handleClose}
        title={titleText}
        widthClass="w-full md:w-[750px] lg:w-[850px]"
      >
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-red-800">Error saving enquiry</h3>
                <p className="text-xs text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          {mastersLoading || currenciesLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-7 w-7 text-[#007aff] animate-spin" />
              <p className="text-xs text-gray-400 font-semibold">Loading dropdown options...</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* SECTION 1: Basic Information */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2.5 bg-gray-50/50">
                  <div className="h-6 w-6 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FileText className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <h3 className="text-xs font-bold text-gray-800">Basic Information</h3>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {editData && (
                    <div>
                      <label className={lbl}>Enquiry No.</label>
                      <input
                        type="text"
                        value={form.enquiryNo}
                        disabled
                        className={`${inp} bg-gray-50 text-gray-500 font-medium`}
                      />
                    </div>
                  )}

                  <div>
                    <label className={lbl}>Enquiry Date <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={form.enquiryDate}
                      onChange={(e) => setForm((f) => ({ ...f, enquiryDate: e.target.value }))}
                      disabled={isViewMode}
                      className={`${inp} ${errors.enquiryDate ? "border-red-300" : ""}`}
                    />
                    {errors.enquiryDate && <p className={err}>{errors.enquiryDate}</p>}
                  </div>

                  <div>
                    <label className={lbl}>Shipment Mode <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        value={form.shipmentMode || ""}
                        onChange={handleShipmentModeChange}
                        disabled={isViewMode}
                        className={`${inp} appearance-none pr-8 ${errors.shipmentMode ? "border-red-300" : ""}`}
                      >
                        <option value="">Select Shipment Mode</option>
                        <option value="SHIP">🚢 Ship</option>
                        <option value="ROAD">🚛 Road</option>
                        <option value="RAIL">🚆 Rail / Wagon</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    </div>
                    {errors.shipmentMode && <p className={err}>{errors.shipmentMode}</p>}
                  </div>
                </div>
              </div>

              {/* SECTION 2: Logistics & Locations */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2.5 bg-gray-50/50">
                  <div className="h-6 w-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <h3 className="text-xs font-bold text-gray-800">Logistics & Locations</h3>
                </div>

                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {form.shipmentMode === "SHIP" && (
                    <>
                      {/* Origin Country */}
                      <div>
                        <label className={lbl}>Origin Country <span className="text-red-500">*</span></label>
                        {isViewMode ? (
                          <div className={inp}>{form.originCountryId || "—"}</div>
                        ) : (
                          <Select
                            isClearable
                            options={countryOptions}
                            value={selectedOriginCountryOption}
                            onChange={(opt) => {
                              setForm((f) => ({
                                ...f,
                                originCountryId: opt ? opt.value : "",
                                originPort: ""
                              }));
                            }}
                            styles={selectStyles}
                            placeholder="Search country..."
                            menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                            menuPosition="fixed"
                            className="text-xs"
                          />
                        )}
                        {errors.originCountryId && <p className={err}>{errors.originCountryId}</p>}
                      </div>

                      {/* Origin Port */}
                      <PortSelector
                        value={form.originPort}
                        onChange={(val) => setForm((f) => ({ ...f, originPort: val }))}
                        label="Origin Port (POL)"
                        placeholder="Search origin port..."
                        isView={isViewMode}
                        error={errors.originPort}
                        countryName={form.originCountryId}
                      />

                      <div className="col-span-full border-t border-dashed border-gray-100 my-2" />

                      {/* Destination Country */}
                      <div>
                        <label className={lbl}>Destination Country <span className="text-red-500">*</span></label>
                        {isViewMode ? (
                          <div className={inp}>{form.destinationCountry || "—"}</div>
                        ) : (
                          <Select
                            isClearable
                            options={countryOptions}
                            value={selectedDestinationCountryOption}
                            onChange={(opt) => {
                              setForm((f) => ({
                                ...f,
                                destinationCountry: opt ? opt.value : "",
                                destinationPort: ""
                              }));
                            }}
                            styles={selectStyles}
                            placeholder="Search country..."
                            menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                            menuPosition="fixed"
                            className="text-xs"
                          />
                        )}
                        {errors.destinationCountry && <p className={err}>{errors.destinationCountry}</p>}
                      </div>

                      {/* Destination Port */}
                      <PortSelector
                        value={form.destinationPort}
                        onChange={(val) => setForm((f) => ({ ...f, destinationPort: val }))}
                        label="Destination Port (POD)"
                        placeholder="Search destination port..."
                        isView={isViewMode}
                        error={errors.destinationPort}
                        countryName={form.destinationCountry}
                      />
                    </>
                  )}

                  {(form.shipmentMode === "ROAD" || form.shipmentMode === "RAIL") && (
                    <>
                      {/* Origin Land Selector */}
                      <LocationHierarchy
                        prefix="origin"
                        form={form}
                        setForm={setForm}
                        errors={errors}
                        isView={isViewMode}
                      />
                      
                      {/* Spacer to separate origin and destination visually in 3-column grid */}
                      <div className="col-span-full border-t border-dashed border-gray-100 my-2" />

                      {/* Destination Land Selector */}
                      <LocationHierarchy
                        prefix="destination"
                        form={form}
                        setForm={setForm}
                        errors={errors}
                        isView={isViewMode}
                      />
                    </>
                  )}

                  {!form.shipmentMode && (
                    <div className="col-span-full flex items-center justify-center py-6 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                      Select Shipment Mode above to configure origin and destination locations.
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: Product, Packaging & Commercials */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2.5 bg-gray-50/50">
                  <div className="h-6 w-6 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Package className="h-3.5 w-3.5 text-orange-600" />
                  </div>
                  <h3 className="text-xs font-bold text-gray-800">Commercial Specifications</h3>
                </div>

                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Partner Role */}
                  <div>
                    <label className={lbl}>Partner Role <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        value={form.partnerRoleId || ""}
                        onChange={(e) => {
                          const newRoleId = e.target.value ? Number(e.target.value) : "";
                          setForm((f) => ({ ...f, partnerRoleId: newRoleId, partnerId: "" }));
                          setSelectedPartnerName("");
                          setPartnerSearch("");
                        }}
                        disabled={isViewMode}
                        className={`${inp} appearance-none pr-8 ${errors.partnerRoleId ? "border-red-300" : ""}`}
                      >
                        <option value="">Select Role</option>
                        {partnerRoles.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    </div>
                    {errors.partnerRoleId && <p className={err}>{errors.partnerRoleId}</p>}
                  </div>

                  {/* Partner Custom Searchable Select */}
                  <div className="relative" ref={partnerDropdownRef}>
                    <label className={lbl}>Partner <span className="text-red-500">*</span></label>
                    {isViewMode ? (
                      <div className={`${inp} bg-gray-50 text-gray-700 font-medium`}>
                        {selectedPartnerName || "—"}
                      </div>
                    ) : (
                      <div className="relative">
                        <button
                          type="button"
                          disabled={!form.partnerRoleId}
                          onClick={() => setIsPartnerOpen((prev) => !prev)}
                          className={`${inp} text-left flex items-center justify-between gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${errors.partnerId ? "border-red-300" : ""}`}
                        >
                          <span className={`truncate ${selectedPartnerName ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                            {!form.partnerRoleId
                              ? "Select Role first"
                              : selectedPartnerName || "Select Partner"}
                          </span>
                          <div className="flex items-center gap-1 shrink-0 text-gray-400">
                            {partnerLoading && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
                            <ChevronDown className="h-3 w-3" />
                          </div>
                        </button>

                        {isPartnerOpen && form.partnerRoleId && (
                          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-2 space-y-2">
                            <div className="relative flex items-center">
                              <Search className="absolute left-2.5 h-3.5 w-3.5 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search partner..."
                                value={partnerSearch}
                                onChange={(e) => setPartnerSearch(e.target.value)}
                                className="w-full pl-8 pr-7 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#007aff]"
                                autoFocus
                              />
                              {partnerSearch && (
                                <button
                                  type="button"
                                  onClick={() => setPartnerSearch("")}
                                  className="absolute right-2 text-gray-400 hover:text-gray-600"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              )}
                            </div>

                            <div className="max-h-40 overflow-y-auto space-y-0.5">
                              {partnerLoading && partnerOptions.length === 0 ? (
                                <div className="p-3 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                                  <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                                  Loading...
                                </div>
                              ) : partnerOptions.length === 0 ? (
                                <div className="p-3 text-center text-xs text-gray-400 font-medium">
                                  No partners found
                                </div>
                              ) : (
                                partnerOptions.map((p) => (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => {
                                      setForm((f) => ({ ...f, partnerId: p.id }));
                                      setSelectedPartnerName(p.entityName);
                                      setIsPartnerOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${
                                      form.partnerId === p.id
                                        ? "bg-blue-50 text-blue-600 font-semibold"
                                        : "hover:bg-gray-50 text-gray-700"
                                    }`}
                                  >
                                    <span className="truncate">{p.entityName}</span>
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {errors.partnerId && <p className={err}>{errors.partnerId}</p>}
                  </div>

                  {/* Product */}
                  <div>
                    <label className={lbl}>Product <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        value={form.productId || ""}
                        onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value ? Number(e.target.value) : "" }))}
                        disabled={isViewMode}
                        className={`${inp} appearance-none pr-8 ${errors.productId ? "border-red-300" : ""}`}
                      >
                        <option value="">Select Product</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    </div>
                    {errors.productId && <p className={err}>{errors.productId}</p>}
                  </div>

                  {/* Purity */}
                  <div>
                    <label className={lbl}>Purity</label>
                    <div className="relative">
                      <select
                        value={form.purity || ""}
                        onChange={(e) => setForm((f) => ({ ...f, purity: e.target.value }))}
                        disabled={isViewMode}
                        className={`${inp} appearance-none pr-8`}
                      >
                        <option value="">Select Purity</option>
                        <option value="99.99%">99.99%</option>
                        <option value="99%">99%</option>
                        <option value="98%">98%</option>
                        <option value="97%">97%</option>
                        <option value="96%">96%</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    </div>
                  </div>

                  {/* Packing Type */}
                  <div>
                    <label className={lbl}>Packing Type</label>
                    <div className="relative">
                      <select
                        value={form.packingTypeId || ""}
                        onChange={(e) => setForm((f) => ({ ...f, packingTypeId: e.target.value ? Number(e.target.value) : "" }))}
                        disabled={isViewMode}
                        className={`${inp} appearance-none pr-8`}
                      >
                        <option value="">Select Packing Type</option>
                        {packingTypes.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    </div>
                  </div>

                  {/* Shipment Type */}
                  <div>
                    <label className={lbl}>Shipment Type</label>
                    <div className="relative">
                      <select
                        value={form.shipmentType || ""}
                        onChange={(e) => setForm((f) => ({ ...f, shipmentType: e.target.value }))}
                        disabled={isViewMode}
                        className={`${inp} appearance-none pr-8`}
                      >
                        <option value="">Select Shipment Type</option>
                        <option value="FCL">FCL</option>
                        <option value="VESSEL">Vessel</option>
                        <option value="TRUCK">Truck</option>
                        <option value="WAGON">Wagon</option>
                        <option value="TRUCK_WAGON">Truck + Wagon</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    </div>
                  </div>

                  {/* Expected Shipment Date */}
                  <div>
                    <label className={lbl}>Expected Shipment Date</label>
                    <input
                      type="date"
                      value={form.shipmentDate}
                      onChange={(e) => setForm((f) => ({ ...f, shipmentDate: e.target.value }))}
                      disabled={isViewMode}
                      className={inp}
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className={lbl}>Quantity (MT)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.quantity || ""}
                      onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value ? Number(e.target.value) : "" }))}
                      disabled={isViewMode}
                      placeholder="0.00"
                      className={inp}
                    />
                  </div>

                  {/* Bid Amount (Decimal restricted text input) */}
                  <div>
                    <label className={lbl}>Bid Amount</label>
                    <input
                      type="text"
                      value={form.buyingInterest || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        // Limit to max 4 decimal digits and total digits limit (max 15 characters, allowing digits and a single decimal point)
                        if (val === "" || (/^\d*\.?\d{0,4}$/.test(val) && val.length <= 15)) {
                          setForm((f) => ({ ...f, buyingInterest: val }));
                        }
                      }}
                      placeholder="0.00"
                      disabled={isViewMode}
                      className={`${inp} ${errors.buyingInterest ? "border-red-300" : ""}`}
                    />
                    {errors.buyingInterest && <p className={err}>{errors.buyingInterest}</p>}
                  </div>

                  {/* Bid Currency (react-select Searchable Master Caching Select) */}
                  <div>
                    <label className={lbl}>Bid Currency</label>
                    {isViewMode ? (
                      <div className={inp}>{form.bidCurrency || "—"}</div>
                    ) : (
                      <Select
                        isClearable
                        options={currencyOptions}
                        value={selectedCurrencyOption}
                        onChange={(opt) => setForm((f) => ({ ...f, bidCurrency: opt ? opt.value : "" }))}
                        styles={selectStyles}
                        placeholder="Search currency..."
                        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                        menuPosition="fixed"
                        className="text-xs"
                      />
                    )}
                    {errors.bidCurrency && <p className={err}>{errors.bidCurrency}</p>}
                  </div>

                  {/* Mark as High Potential */}
                  <div className="flex items-center pt-5 col-span-full">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={form.potentialEnquiry}
                          onChange={(e) => setForm((f) => ({ ...f, potentialEnquiry: e.target.checked }))}
                          disabled={isViewMode}
                          className="peer sr-only"
                        />
                        <div className="w-4 h-4 border-2 border-gray-300 rounded bg-white transition-all peer-checked:bg-[#007aff] peer-checked:border-[#007aff] group-hover:border-[#007aff]"></div>
                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none">
                          <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                        Mark as High Potential
                      </span>
                    </label>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!isViewMode && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 shrink-0 rounded-b-2xl">
            <button
              onClick={handleClose}
              disabled={saving}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-xs hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || mastersLoading}
              className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              Save Enquiry
            </button>
          </div>
        )}
      </Drawer>

      {/* Discard changes dialog */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-[110] overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-xs" onClick={() => setShowDiscardConfirm(false)} />
          <div className="bg-white rounded-2xl p-6 shadow-2xl relative w-full max-w-sm z-10 space-y-4">
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Discard Changes?</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  You have unsaved changes in this enquiry. Are you sure you want to discard them?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="px-3.5 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDiscardConfirm(false);
                  onClose();
                }}
                className="px-3.5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors cursor-pointer"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
