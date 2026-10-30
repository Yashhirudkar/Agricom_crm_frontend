
"use client";

function formatClosedDate(dateStr) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-GB", { month: "short" });
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = String(hours).padStart(2, "0");
    return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;
  } catch {
    return "N/A";
  }
}

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Package, ChevronDown, Search, X, Loader2 } from "lucide-react";
import { PORTS_BY_COUNTRY } from "@/constants/portsData";
import CountrySelect from "@/components/common/CountrySelect";
import { getAlpha2Code } from "@/lib/countryUtils";
import axiosClient from "@/lib/axios";

export default function EnquiryDetailsSection({ form, setForm, errors, masters = {}, isView }) {
  const {
    countries = [],
    partnerRoles = [],
    products = [],
    packingTypes = [],
    shipmentTypes = []
  } = masters || {};

  const inp = "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white transition-all";
  const lbl = "block text-[11px] font-semibold text-gray-600 mb-1.5";
  const err = "text-[10px] text-red-500 mt-1";

  // State for partner options dropdown
  const [partnerOptions, setPartnerOptions] = useState([]);
  const [partnerLoading, setPartnerLoading] = useState(false);
  const [partnerSearch, setPartnerSearch] = useState("");
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const [selectedPartnerName, setSelectedPartnerName] = useState("");
  const partnerDropdownRef = useRef(null);

  // States for broker selection
  const [brokerOptions, setBrokerOptions] = useState([]);
  const [brokerLoading, setBrokerLoading] = useState(false);
  const [brokerSearch, setBrokerSearch] = useState("");
  const [isBrokerOpen, setIsBrokerOpen] = useState(false);
  const [selectedBrokerName, setSelectedBrokerName] = useState("");
  const brokerDropdownRef = useRef(null);

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

  // When partnerRoleId changes, refetch partner options and reset selected partner if needed
  useEffect(() => {
    if (form.partnerRoleId) {
      fetchPartnerOptions(form.partnerRoleId, partnerSearch);
    } else {
      setPartnerOptions([]);
      setSelectedPartnerName("");
    }
  }, [form.partnerRoleId, fetchPartnerOptions]);

  // Handle debounced search input
  useEffect(() => {
    if (!form.partnerRoleId) return;
    const timer = setTimeout(() => {
      fetchPartnerOptions(form.partnerRoleId, partnerSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [partnerSearch, form.partnerRoleId, fetchPartnerOptions]);

  // Sync selected partner entityName if partnerId changes
  useEffect(() => {
    if (form.partnerId) {
      const found = partnerOptions.find((p) => p.id === form.partnerId);
      if (found) {
        setSelectedPartnerName(found.entityName);
      } else if (!selectedPartnerName) {
        // If partner is selected but not present in current search results, fetch single partner option
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

  // Click outside to close partner dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (partnerDropdownRef.current && !partnerDropdownRef.current.contains(event.target)) {
        setIsPartnerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch broker partners asynchronously based on role and search query
  const fetchBrokerOptions = useCallback(async (roleId, search = "") => {
    if (!roleId) {
      setBrokerOptions([]);
      return;
    }
    setBrokerLoading(true);
    try {
      const res = await axiosClient.get("/masters/partners/options", {
        params: { partnerRoleId: roleId, search: search || undefined },
      });
      const data = res.data?.data || res.data || [];
      setBrokerOptions(data);
    } catch (e) {
      console.error("Failed to fetch broker partner options", e);
      setBrokerOptions([]);
    } finally {
      setBrokerLoading(false);
    }
  }, []);

  // Sync broker selections
  useEffect(() => {
    if (form.brokerRoleId) {
      fetchBrokerOptions(form.brokerRoleId, brokerSearch);
    } else {
      setBrokerOptions([]);
      setSelectedBrokerName("");
    }
  }, [form.brokerRoleId, fetchBrokerOptions]);

  useEffect(() => {
    if (!form.brokerRoleId) return;
    const timer = setTimeout(() => {
      fetchBrokerOptions(form.brokerRoleId, brokerSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [brokerSearch, form.brokerRoleId, fetchBrokerOptions]);

  useEffect(() => {
    if (form.brokerId) {
      const found = brokerOptions.find((p) => p.id === form.brokerId);
      if (found) {
        setSelectedBrokerName(found.entityName);
      } else if (!selectedBrokerName) {
        axiosClient.get(`/masters/partners/${form.brokerId}`).then((res) => {
          if (res.data?.entityName) {
            setSelectedBrokerName(res.data.entityName);
          }
        }).catch(() => { });
      }
    } else {
      setSelectedBrokerName("");
    }
  }, [form.brokerId, brokerOptions]);

  useEffect(() => {
    function handleClickOutsideBroker(event) {
      if (brokerDropdownRef.current && !brokerDropdownRef.current.contains(event.target)) {
        setIsBrokerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideBroker);
    return () => document.removeEventListener("mousedown", handleClickOutsideBroker);
  }, []);

  // Filter broker-related partner roles
  const brokerPartnerRoles = React.useMemo(() => {
    const filtered = partnerRoles.filter((r) =>
      r.name?.toLowerCase().includes("broker")
    );
    if (filtered.length === 0) return partnerRoles;
    if (form.brokerRoleId && !filtered.some((r) => r.id === Number(form.brokerRoleId))) {
      const currentRole = partnerRoles.find((r) => r.id === Number(form.brokerRoleId));
      if (currentRole) return [...filtered, currentRole];
    }
    return filtered;
  }, [partnerRoles, form.brokerRoleId]);


  // Port logic based on Origin Country
  const originCode = form.originCountry ? (getAlpha2Code(form.originCountry) || "") : "";
  const originPorts = PORTS_BY_COUNTRY[originCode] || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
          <Package className="h-3.5 w-3.5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">Enquiry Details</h2>
          <p className="text-[10px] text-gray-400">Partner, product, and shipping requirements</p>
        </div>
      </div>

      {(String(form.status || "").toUpperCase() === "CLOSED") && (
        <div className="mx-5 mt-3 flex h-9 items-center rounded-md border-l-[3px] border-red-600 bg-red-50 px-3 text-xs text-gray-600">
          <span className="mr-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-red-600" />
          <span className="font-medium">Reason for Closure:</span>
          <span className="ml-1 font-bold text-gray-800">{form.closureReason || "N/A"}</span>
          <span className="mx-2 text-gray-400">|</span>
          <span className="font-medium text-gray-800">{formatClosedDate(form.closedAt)}</span>
        </div>
      )}

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Partner Role */}
        <div>
          <label className={lbl}>Partner Role <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={form.partnerRoleId || ""}
              onChange={e => {
                const newRoleId = e.target.value ? Number(e.target.value) : "";
                setForm(f => ({ ...f, partnerRoleId: newRoleId, partnerId: "" }));
                setSelectedPartnerName("");
                setPartnerSearch("");
              }}
              disabled={isView}
              className={`${inp} appearance-none pr-8 ${errors.partnerRoleId ? "border-red-300" : ""}`}
            >
              <option value="">Select Role</option>
              {partnerRoles.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
          {errors.partnerRoleId && <p className={err}>{errors.partnerRoleId}</p>}
        </div>

        {/* Partner (Searchable Custom Dropdown) */}
        <div className="relative" ref={partnerDropdownRef}>
          <label className={lbl}>Partner <span className="text-red-500">*</span></label>
          {isView ? (
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
                      placeholder="Search partner by name..."
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

                  <div className="max-h-48 overflow-y-auto space-y-0.5">
                    {partnerLoading && partnerOptions.length === 0 ? (
                      <div className="p-3 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                        Loading partners...
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
              onChange={e => setForm(f => ({ ...f, productId: e.target.value ? Number(e.target.value) : "" }))}
              disabled={isView}
              className={`${inp} appearance-none pr-8 ${errors.productId ? "border-red-300" : ""}`}
            >
              <option value="">Select Product</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
          {errors.productId && <p className={err}>{errors.productId}</p>}
        </div>

        {/* Broker Details */}
        <div className="col-span-full pt-3 pb-0.5">
          <div className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <span>Broker Details</span>
            <div className="h-px bg-gray-100 flex-1" />
          </div>
        </div>

        {/* Broker Partner Role */}
        <div>
          <label className={lbl}>Partner Role</label>
          <div className="relative">
            <select
              value={form.brokerRoleId || ""}
              onChange={(e) => {
                const newRoleId = e.target.value ? Number(e.target.value) : "";
                setForm((f) => ({ ...f, brokerRoleId: newRoleId, brokerId: "" }));
                setSelectedBrokerName("");
                setBrokerSearch("");
              }}
              disabled={isView}
              className={`${inp} appearance-none pr-8 ${errors?.brokerRoleId ? "border-red-300" : ""}`}
            >
              <option value="">Select Role</option>
              {brokerPartnerRoles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
          {errors?.brokerRoleId && <p className={err}>{errors.brokerRoleId}</p>}
        </div>

        {/* Broker Partner Custom Searchable Select */}
        <div className="relative" ref={brokerDropdownRef}>
          <label className={lbl}>Partner</label>
          {isView ? (
            <div className={`${inp} bg-gray-50 text-gray-700 font-medium`}>
              {selectedBrokerName || "—"}
            </div>
          ) : (
            <div className="relative">
              <button
                type="button"
                disabled={!form.brokerRoleId}
                onClick={() => setIsBrokerOpen((prev) => !prev)}
                className={`${inp} text-left flex items-center justify-between gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${errors?.brokerId ? "border-red-300" : ""}`}
              >
                <span className={`truncate ${selectedBrokerName ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                  {!form.brokerRoleId
                    ? "Select Role first"
                    : selectedBrokerName || "Select Partner"}
                </span>
                <div className="flex items-center gap-1 shrink-0 text-gray-400">
                  {brokerLoading && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
                  <ChevronDown className="h-3 w-3" />
                </div>
              </button>

              {isBrokerOpen && form.brokerRoleId && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-2 space-y-2">
                  <div className="relative flex items-center">
                    <Search className="absolute left-2.5 h-3.5 w-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search partner by name..."
                      value={brokerSearch}
                      onChange={(e) => setBrokerSearch(e.target.value)}
                      className="w-full pl-8 pr-7 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#007aff]"
                      autoFocus
                    />
                    {brokerSearch && (
                      <button
                        type="button"
                        onClick={() => setBrokerSearch("")}
                        className="absolute right-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-0.5">
                    {brokerLoading && brokerOptions.length === 0 ? (
                      <div className="p-3 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                        Loading partners...
                      </div>
                    ) : brokerOptions.length === 0 ? (
                      <div className="p-3 text-center text-xs text-gray-400 font-medium">
                        No partners found
                      </div>
                    ) : (
                      brokerOptions.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setForm((f) => ({ ...f, brokerId: p.id }));
                            setSelectedBrokerName(p.entityName);
                            setIsBrokerOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${
                            form.brokerId === p.id
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
          {errors?.brokerId && <p className={err}>{errors.brokerId}</p>}
        </div>

        {/* Empty 3rd column placeholder to balance the 3-column grid cleanly */}
        <div className="hidden lg:block" />

        {/* Origin Country */}
        <div>
          <label className={lbl}>Origin Country</label>
          {isView ? (
            <div className={`${inp} text-gray-700 bg-gray-50/50`}>
              {form.originCountry || "—"}
            </div>
          ) : (
            <CountrySelect
              value={form.originCountry || ""}
              onChange={(val) => {
                setForm(f => ({ ...f, originCountry: val?.name || "", podPort: "" }));
              }}
            />
          )}
        </div>

        {/* Port of Discharge (podPort) */}
        <div>
          <label className={lbl}>Port (POD / POL)</label>
          <div className="relative">
            <select
              value={form.podPort || ""}
              onChange={e => setForm(f => ({ ...f, podPort: e.target.value }))}
              disabled={isView || !originCode}
              className={`${inp} appearance-none pr-8 disabled:opacity-60`}
            >
              <option value="">{originCode ? "Select Port" : "Select Origin Country first"}</option>
              {originPorts.map(p => (
                <option key={p.code} value={p.name}>{p.name}</option>
              ))}
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
              onChange={e => setForm(f => ({ ...f, packingTypeId: e.target.value ? Number(e.target.value) : "" }))}
              disabled={isView}
              className={`${inp} appearance-none pr-8`}
            >
              <option value="">Select Packing Type</option>
              {packingTypes.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
        </div>

        {/* Purity */}
        <div>
          <label className={lbl}>Purity</label>
          <div className="relative">
            <select
              value={form.purity || ""}
              onChange={e => setForm(f => ({ ...f, purity: e.target.value }))}
              disabled={isView}
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

        {/* Shipment Type */}
        <div>
          <label className={lbl}>Shipment Type</label>
          <div className="relative">
            <select
              value={form.shipmentType || ""}
              onChange={e => setForm(f => ({ ...f, shipmentType: e.target.value }))}
              disabled={isView}
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

        {/* Shipment Date */}
        <div>
          <label className={lbl}>Expected Shipment Date</label>
          <input
            type="date"
            value={form.shipmentDate}
            onChange={e => setForm(f => ({ ...f, shipmentDate: e.target.value }))}
            disabled={isView}
            className={inp}
          />
        </div>

        {/* Quantity */}
        <div>
          <label className={lbl}>Quantity (MT)</label>
          <input
            type="number"
            min="0"
            step="any"
            value={form.quantity !== "" && form.quantity != null ? parseFloat(String(form.quantity)) : ""}
            onChange={e => setForm(f => ({ ...f, quantity: e.target.value ? Number(e.target.value) : "" }))}
            disabled={isView}
            placeholder="0.00"
            className={inp}
          />
        </div>

        {/* Offer */}
        <div>
          <label className={lbl}>Offer</label>
          <input
            type="text"
            inputMode="numeric"
            value={form.offerAmount !== "" && form.offerAmount != null ? form.offerAmount : ""}
            onChange={e => {
              const val = e.target.value.trim();
              if (val === "" || /^\d+$/.test(val)) {
                setForm(f => ({ ...f, offerAmount: val }));
              }
            }}
            onKeyDown={e => {
              if (["e", "E", "+", "-", "."].includes(e.key)) {
                e.preventDefault();
              }
            }}
            disabled={isView}
            placeholder="0"
            className={`${inp} ${errors?.offerAmount ? "border-red-300" : ""}`}
          />
          {errors?.offerAmount && <p className={err}>{errors.offerAmount}</p>}
        </div>

        {/* Buying Interest */}
        <div>
          <label className={lbl}>Bid</label>
          <input
            type="number"
            min="0"
            max="100"
            value={form.buyingInterest !== "" && form.buyingInterest != null ? parseFloat(String(form.buyingInterest)) : ""}
            onChange={e => setForm(f => ({ ...f, buyingInterest: e.target.value ? Number(e.target.value) : "" }))}
            disabled={isView}
            placeholder="e.g. 75"
            className={inp}
          />
        </div>


        {/* Potential Enquiry */}
        <div className="flex items-center pt-5">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={form.potentialEnquiry}
                onChange={e => setForm(f => ({ ...f, potentialEnquiry: e.target.checked }))}
                disabled={isView}
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
  );
}
