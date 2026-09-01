"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Select from "react-select";
import {
  X,
  Save,
  AlertCircle,
  DollarSign,
  Building2,
  Calendar,
  Truck,
  Ship,
  FileText,
  Calculator,
  ShieldCheck,
  User,
  Phone,
  Plus,
} from "lucide-react";
import SearchablePartnerSelect from "@/components/common/SearchablePartnerSelect";
import { useCurrencyMaster } from "@/modules/enquiries/hooks/useCurrencyMaster";
import axiosClient from "@/lib/axios";

const VEHICLE_OPTIONS = [
  "Mini Truck",
  "10 MT Truck",
  "15 MT Truck",
  "20 MT Truck",
  "25 MT Truck",
  "Trailer 32 FT",
  "Container Truck",
  "Other",
];
const CONTAINER_OPTIONS = ["20 GP", "40 GP", "40 HC", "20 RF", "40 RF", "Other"];
const CONTAINER_SIZES = ["20 FT", "40 FT", "Other"];

export default function AddFreightQuoteModal({
  isOpen,
  onClose,
  onSave,
  quote = null,
  transportMode = "Road",
  mode = "Domestic",
  onOpenCreatePartner,
  onOpenAddContact,
  autoSelectPartner = null, // { partnerId, contactName, phoneNumber, focusContactField }
  isReadOnly = false,
}) {
  // Form State
  const [sellerId, setSellerId] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [isManualEditLocked, setIsManualEditLocked] = useState(false); // Contact state machine lock

  const [carrierReferenceNo, setCarrierReferenceNo] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [containerType, setContainerType] = useState("");
  const [containerSize, setContainerSize] = useState("");
  const [shippingLine, setShippingLine] = useState("");

  const [freightAmount, setFreightAmount] = useState("");
  const [currency, setCurrency] = useState(mode === "International" ? "USD" : "INR");

  const [transitDays, setTransitDays] = useState("");
  const [validityDate, setValidityDate] = useState("");
  const [quoteDate, setQuoteDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [remarks, setRemarks] = useState("");

  // International Fields
  const [pol, setPol] = useState("");
  const [pod, setPod] = useState("");
  const [etd, setEtd] = useState("");
  const [eta, setEta] = useState("");
  const [freeDays, setFreeDays] = useState(0);
  const [cutoffDate, setCutoffDate] = useState("");
  const [vessel, setVessel] = useState("");
  const [voyage, setVoyage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const contactPersonInputRef = useRef(null);

  // Currency Master Hook
  const { data: currencies = [], isLoading: currenciesLoading } = useCurrencyMaster();

  const currencyOptions = useMemo(() => {
    return currencies.map((c) => ({
      value: c.code,
      label: `${c.code} - ${c.name}`,
    }));
  }, [currencies]);

  const selectedCurrencyOption = useMemo(() => {
    if (!currency) return null;
    const found = currencies.find((c) => c.code.toUpperCase() === currency.toUpperCase());
    return found
      ? { value: found.code, label: `${found.code} - ${found.name}` }
      : { value: currency, label: currency };
  }, [currency, currencies]);

  const reactSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#2563eb" : "#e2e8f0",
      borderRadius: "0.75rem",
      fontSize: "12px",
      fontWeight: "700",
      boxShadow: "none",
      minHeight: "38px",
      backgroundColor: "white",
      "&:hover": { borderColor: state.isFocused ? "#2563eb" : "#cbd5e1" },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#2563eb" : state.isFocused ? "#f8fafc" : "white",
      color: state.isSelected ? "white" : "#334155",
      fontSize: "12px",
      fontWeight: state.isSelected ? "700" : "500",
      cursor: "pointer",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  // Sync quote data on open/edit
  useEffect(() => {
    if (quote) {
      setSellerId(quote.sellerId || "");
      setContactPerson(quote.contactPerson || quote.seller?.contacts?.[0]?.name || "");
      setContactNumber(quote.contactNumber || "");
      setIsManualEditLocked(false);

      setCarrierReferenceNo(quote.carrierReferenceNo || "");
      setVehicleType(quote.vehicleType || "");
      setContainerType(quote.containerType || "");
      setContainerSize(quote.containerSize || "");
      setShippingLine(quote.shippingLine || "");

      setFreightAmount(quote.freightAmount ? String(quote.freightAmount) : "");
      setCurrency(quote.currency || (mode === "International" ? "USD" : "INR"));

      setTransitDays(quote.transitDays || "");
      setValidityDate(quote.validityDate ? quote.validityDate.split("T")[0] : "");
      setQuoteDate(quote.quoteDate ? quote.quoteDate.split("T")[0] : new Date().toISOString().split("T")[0]);
      setPaymentTerms(quote.paymentTerms || "");
      setRemarks(quote.remarks || "");

      // International
      setPol(quote.pol || "");
      setPod(quote.pod || "");
      setEtd(quote.etd ? quote.etd.split("T")[0] : "");
      setEta(quote.eta ? quote.eta.split("T")[0] : "");
      setFreeDays(quote.freeDays || 0);
      setCutoffDate(quote.cutoffDate ? quote.cutoffDate.split("T")[0] : "");
      setVessel(quote.vessel || "");
      setVoyage(quote.voyage || "");
    } else {
      setSellerId("");
      setContactPerson("");
      setContactNumber("");
      setIsManualEditLocked(false);

      setCarrierReferenceNo("");
      setVehicleType("");
      setContainerType("");
      setContainerSize("");
      setShippingLine("");

      setFreightAmount("");
      setCurrency(mode === "International" ? "USD" : "INR");

      setTransitDays("");
      setValidityDate("");
      setQuoteDate(new Date().toISOString().split("T")[0]);
      setPaymentTerms("");
      setRemarks("");

      setPol("");
      setPod("");
      setEtd("");
      setEta("");
      setFreeDays(0);
      setCutoffDate("");
      setVessel("");
      setVoyage("");
    }
    setError("");
  }, [quote, mode, transportMode, isOpen]);

  const [partnerContactsList, setPartnerContactsList] = useState([]);

  // Load contacts list for selected transport partner
  useEffect(() => {
    if (sellerId) {
      axiosClient
        .get(`/masters/partners/${sellerId}`)
        .then((res) => {
          const partnerData = res.data?.data || res.data;
          const contacts = partnerData?.contacts || [];
          setPartnerContactsList(contacts);

          // If not manually locked, auto-select primary or first contact
          if (!isManualEditLocked && contacts.length > 0) {
            const primary = contacts.find((c) => c.isPrimary) || contacts[0];
            setContactPerson(primary.name || "");
            setContactNumber(primary.phone || "");
          }
        })
        .catch(() => {
          setPartnerContactsList([]);
        });
    } else {
      setPartnerContactsList([]);
    }
  }, [sellerId, isManualEditLocked]);

  // Sync autoSelectPartner if passed from parent drawer flow
  useEffect(() => {
    if (autoSelectPartner?.partnerId) {
      setSellerId(autoSelectPartner.partnerId);
      if (!isManualEditLocked) {
        setContactPerson(autoSelectPartner.contactName || "");
        setContactNumber(autoSelectPartner.phoneNumber || "");
      }
      if (autoSelectPartner.focusContactField) {
        setTimeout(() => {
          contactPersonInputRef.current?.focus();
        }, 150);
      }
    }
  }, [autoSelectPartner, isManualEditLocked]);

  // Handle partner selection from dropdown
  const handlePartnerSelect = (selectedData) => {
    const pId = selectedData?.partnerId || selectedData?.id;
    setSellerId(pId);
    setIsManualEditLocked(false);
  };

  // Handle contact person selection from dropdown
  const handleContactSelectChange = (e) => {
    const val = e.target.value;
    if (val === "__custom__") {
      setIsManualEditLocked(true);
      setContactPerson("");
      setContactNumber("");
    } else {
      setIsManualEditLocked(false);
      setContactPerson(val);
      const match = partnerContactsList.find((c) => c.name === val);
      if (match) {
        setContactNumber(match.phone || "");
      }
    }
  };

  // State Machine handlers for manual contact edits
  const handleContactPersonChange = (e) => {
    setIsManualEditLocked(true);
    setContactPerson(e.target.value);
  };

  const handleContactNumberChange = (e) => {
    setIsManualEditLocked(true);
    setContactNumber(e.target.value);
  };

  // Phone Validation
  const validatePhone = (phone) => {
    if (!phone) return true;
    const phoneRegex = /^[0-9+\s\-()]{6,25}$/;
    return phoneRegex.test(phone.trim());
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!sellerId) {
      setError("Please select a transport partner.");
      return;
    }
    if (!contactNumber) {
      setError("Contact phone number is required.");
      return;
    }
    if (!validatePhone(contactNumber)) {
      setError("Please enter a valid phone number (digits, spaces, +, - allowed).");
      return;
    }
    if (!freightAmount || parseFloat(freightAmount) <= 0) {
      setError("Please enter a valid freight amount.");
      return;
    }
    if (!currency) {
      setError("Please select currency.");
      return;
    }
    if (!transitDays) {
      setError("Please enter transit days.");
      return;
    }
    if (!validityDate) {
      setError("Please enter quote validity date.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        quoteDate,
        sellerId: Number(sellerId),
        freightAmount: parseFloat(freightAmount),
        currency: currency || "INR",
        fuelCharges: 0,
        additionalCharges: 0,
        transitDays: parseInt(transitDays, 10),
        validityDate,
        ...(carrierReferenceNo && carrierReferenceNo.trim() && { carrierReferenceNo: carrierReferenceNo.trim() }),
        ...(contactPerson && contactPerson.trim() && { contactPerson: contactPerson.trim() }),
        ...(contactNumber && contactNumber.trim() && { contactNumber: contactNumber.trim() }),
        ...(paymentTerms && paymentTerms.trim() && { paymentTerms: paymentTerms.trim() }),
        ...(remarks && remarks.trim() && { remarks: remarks.trim() }),

        // Mode specific
        ...(transportMode === "Road" && vehicleType && { vehicleType: vehicleType.trim() }),
        ...(transportMode === "Sea" && {
          ...(containerType && { containerType: containerType.trim() }),
          ...(containerSize && { containerSize: containerSize.trim() }),
          ...(shippingLine && { shippingLine: shippingLine.trim() }),
        }),

        // International
        ...(mode === "International" && {
          ...(pol && { pol: pol.trim() }),
          ...(pod && { pod: pod.trim() }),
          ...(etd && { etd }),
          ...(eta && { eta }),
          ...(freeDays && { freeDays: parseInt(freeDays, 10) }),
          ...(cutoffDate && { cutoffDate }),
          ...(vessel && { vessel: vessel.trim() }),
          ...(voyage && { voyage: voyage.trim() }),
          ...(shippingLine && { shippingLine: shippingLine.trim() }),
        }),
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save freight quote.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Drawer Backdrop Overlay */}
      <div
        className="fixed inset-0 z-[60] bg-slate-800/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Right Side Drawer */}
      <div className="fixed inset-y-0 right-0 z-[70] w-full max-w-3xl bg-white border-l border-slate-200 shadow-2xl flex flex-col transition-transform duration-300 animate-in slide-in-from-right">
        {/* Header - White Enterprise Theme */}
        <div className="px-6 py-4 bg-white text-slate-900 border-b border-slate-200 flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold shadow-sm shadow-blue-500/20">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold tracking-tight uppercase text-slate-900">
                  {isReadOnly
                    ? quote
                      ? `Freight Quotation (${quote.quoteNumber})`
                      : "Freight Quotation Details"
                    : quote
                      ? `Revise Freight Quote (${quote.quoteNumber})`
                      : "Add New Freight Quotation"}
                </h3>
                {isReadOnly && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 border border-blue-200">
                    View Only
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Workspace Mode: <strong className="text-blue-600 font-bold">{mode}</strong> ({transportMode} Logistics)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 border border-slate-200 transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden text-xs">
          {/* Scrollable Form Content */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {error && (
              <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 font-bold">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Section 1: Transport Partner & Contact Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-4">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                1. Transport Partner & Contact Information
              </h4>

              {/* Row 1: Partner Selection & Contact Person (Desktop 2-Col Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SearchablePartnerSelect
                  label="Transport Partner *"
                  required={true}
                  value={sellerId}
                  onChange={(id) => setSellerId(id)}
                  onSelect={handlePartnerSelect}
                  roleNames={["Transport", "Freight Forwarder", "Shipping Line"]}
                  mode="entity"
                  allowCreate={!isReadOnly}
                  allowAddContact={!isReadOnly}
                  disabled={isReadOnly}
                  onOpenCreatePartner={onOpenCreatePartner}
                  onOpenAddContact={onOpenAddContact}
                  placeholder="Search Partner..."
                />

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Contact Person</span>
                    {isManualEditLocked && !isReadOnly && (
                      <span className="text-[10px] text-amber-600 font-extrabold">✏️ Manually Edited</span>
                    )}
                  </label>
                  <div className="relative">
                    {partnerContactsList.length > 0 && !isManualEditLocked ? (
                      <select
                        value={contactPerson}
                        onChange={handleContactSelectChange}
                        disabled={isReadOnly}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-blue-600 bg-white text-slate-900 cursor-pointer text-xs disabled:opacity-75 disabled:cursor-not-allowed"
                      >
                        <option value="">Select Contact Person...</option>
                        {partnerContactsList.map((c) => (
                          <option key={c.id || c.name} value={c.name}>
                            {c.name} {c.isPrimary ? "⭐ (Primary)" : ""} {c.phone ? ` - 📞 ${c.phone}` : ""}
                          </option>
                        ))}
                        {!isReadOnly && <option value="__custom__">+ Enter Custom Contact / Type Manually...</option>}
                      </select>
                    ) : (
                      <div className="relative flex items-center">
                        <input
                          ref={contactPersonInputRef}
                          type="text"
                          value={contactPerson}
                          onChange={handleContactPersonChange}
                          disabled={isReadOnly}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-blue-600 bg-white text-slate-900 text-xs disabled:opacity-75 disabled:cursor-not-allowed"
                        />
                        {partnerContactsList.length > 0 && isManualEditLocked && !isReadOnly && (
                          <button
                            type="button"
                            onClick={() => setIsManualEditLocked(false)}
                            className="absolute right-2 text-[10px] font-bold text-blue-600 hover:underline bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 cursor-pointer"
                            title="Switch back to Contacts Dropdown"
                          >
                            📋 Saved Contacts
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Phone Number & Carrier Reference */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactNumber}
                    onChange={handleContactNumberChange}
                    disabled={isReadOnly}
                    placeholder="e.g. +91 98230 12345"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono font-bold focus:outline-none focus:border-blue-600 bg-white text-slate-900 disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Carrier Ref / Booking No.
                  </label>
                  <input
                    type="text"
                    value={carrierReferenceNo}
                    onChange={(e) => setCarrierReferenceNo(e.target.value)}
                    disabled={isReadOnly}
                    placeholder="e.g. BKN-99201"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-blue-600 bg-white text-slate-800 disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Mode Specific Equipment */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-4">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                2. Vehicle & Equipment Specifications ({transportMode})
              </h4>

              {transportMode === "Road" && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Vehicle Type / Capacity
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    disabled={isReadOnly}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-600 bg-white cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Vehicle Type</option>
                    {VEHICLE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {transportMode === "Sea" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Container Type
                    </label>
                    <select
                      value={containerType}
                      onChange={(e) => setContainerType(e.target.value)}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-600 bg-white cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Type</option>
                      {CONTAINER_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Container Size
                    </label>
                    <select
                      value={containerSize}
                      onChange={(e) => setContainerSize(e.target.value)}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-600 bg-white cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Size</option>
                      {CONTAINER_SIZES.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Shipping Line
                    </label>
                    <input
                      type="text"
                      value={shippingLine}
                      onChange={(e) => setShippingLine(e.target.value)}
                      disabled={isReadOnly}
                      placeholder="e.g. Maersk, MSC, CMA CGM"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-blue-600 bg-white text-slate-800 disabled:opacity-75 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Freight Amount & Dynamic Currency */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
              <h4 className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="h-4 w-4" /> 3. Freight Cost & Currency
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Freight Amount with Financial Formatting */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">
                    Freight Base Amount <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={freightAmount}
                      onChange={(e) => setFreightAmount(e.target.value)}
                      disabled={isReadOnly}
                      placeholder="0.00"
                      className="w-full px-3 py-2 text-right font-mono text-sm font-extrabold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 tabular-nums shadow-xs disabled:opacity-75 disabled:cursor-not-allowed"
                    />
                  </div>
                  {freightAmount && (
                    <p className="text-[10px] text-emerald-700 font-bold text-right mt-1 tabular-nums">
                      Formatted: {currency} {Number(freightAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  )}
                </div>

                {/* Currency Select using useCurrencyMaster */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">
                    Currency <span className="text-rose-500">*</span>
                  </label>
                  {currenciesLoading ? (
                    <div className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-400 text-xs flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                      Loading currencies...
                    </div>
                  ) : (
                    <Select
                      options={currencyOptions}
                      value={selectedCurrencyOption}
                      onChange={(opt) => setCurrency(opt ? opt.value : "INR")}
                      isDisabled={isReadOnly}
                      styles={reactSelectStyles}
                      placeholder="Select Currency..."
                      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                      menuPosition="fixed"
                      className="text-xs"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Section 4: SLA & Validity */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-4">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                4. Logistics SLA & Validity
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Transit Days <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={transitDays}
                    onChange={(e) => setTransitDays(e.target.value)}
                    disabled={isReadOnly}
                    placeholder="e.g. 5"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-extrabold text-slate-900 focus:outline-none focus:border-blue-600 bg-white disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Quote Validity Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={validityDate}
                    onChange={(e) => setValidityDate(e.target.value)}
                    disabled={isReadOnly}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-blue-600 bg-white text-slate-900 disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Quotation Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={quoteDate}
                    onChange={(e) => setQuoteDate(e.target.value)}
                    disabled={isReadOnly}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-blue-600 bg-white text-slate-800 disabled:opacity-75 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Payment Terms
                </label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  disabled={isReadOnly}
                  placeholder="e.g. 30 Days Credit"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-blue-600 bg-white text-slate-900 disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Section 5: International Shipping Details */}
            {mode === "International" && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-4">
                <h4 className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                  5. International Sea Shipping Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Port of Loading (POL)
                    </label>
                    <input
                      type="text"
                      value={pol}
                      onChange={(e) => setPol(e.target.value)}
                      disabled={isReadOnly}
                      placeholder="e.g. Nhava Sheva"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-blue-600 bg-white text-slate-800 disabled:opacity-75 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Port of Discharge (POD)
                    </label>
                    <input
                      type="text"
                      value={pod}
                      onChange={(e) => setPod(e.target.value)}
                      disabled={isReadOnly}
                      placeholder="e.g. Port of Rotterdam"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-blue-600 bg-white text-slate-800 disabled:opacity-75 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Estimated ETD
                    </label>
                    <input
                      type="date"
                      value={etd}
                      onChange={(e) => setEtd(e.target.value)}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-blue-600 bg-white text-slate-800 disabled:opacity-75 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Estimated ETA
                    </label>
                    <input
                      type="date"
                      value={eta}
                      onChange={(e) => setEta(e.target.value)}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-blue-600 bg-white text-slate-800 disabled:opacity-75 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Cutoff Date (Port / CY)
                    </label>
                    <input
                      type="date"
                      value={cutoffDate}
                      onChange={(e) => setCutoffDate(e.target.value)}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-blue-600 bg-white text-slate-800 disabled:opacity-75 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Special Terms / Remarks
              </label>
              {isReadOnly ? (
                <div className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium bg-slate-50/90 text-slate-800 min-h-[50px] whitespace-pre-wrap">
                  {remarks || "No special terms or remarks specified."}
                </div>
              ) : (
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter special routing instructions, demurrage terms..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-600 bg-white text-slate-800 resize-none"
                />
              )}
            </div>
          </div>

          {/* Sticky Drawer Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
            {isReadOnly ? (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs font-extrabold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors shadow-xs bg-white cursor-pointer"
              >
                Close
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-extrabold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors shadow-xs bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-extrabold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer active:scale-95"
                >
                  {loading ? (
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {quote ? "Revise Freight Quote" : "Save Freight Quote"}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
}