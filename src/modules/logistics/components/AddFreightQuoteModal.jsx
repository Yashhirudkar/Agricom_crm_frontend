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
  Check,
  Trash2,
  ArrowUp,
  ArrowDown,
  Info,
  MapPin,
  Map
} from "lucide-react";
import SearchablePartnerSelect from "@/components/common/SearchablePartnerSelect";
import { useCurrencyMaster } from "@/modules/enquiries/hooks/useCurrencyMaster";
import axiosClient from "@/lib/axios";

const ROAD_TRUCK_TYPES = [
  "Mini Truck", "Pickup", "Tata Ace", "14 FT Truck", "17 FT Truck",
  "20 FT Truck", "22 FT Truck", "24 FT Truck", "32 FT Single Axle",
  "32 FT Multi Axle", "Trailer", "Flatbed Trailer", "Low Bed Trailer",
  "Hydraulic Trailer", "Tanker", "Refrigerated Truck", "Open Body Truck", "Closed Body Truck",
];

const ROAD_TRUCK_CAPACITIES = [
  "1 MT", "2 MT", "3 MT", "5 MT", "7 MT", "9 MT", "10 MT",
  "12 MT", "15 MT", "18 MT", "20 MT", "25 MT", "30 MT", "35 MT", "40 MT",
];

const SEA_CONTAINER_TYPES = [
  "Standard (Dry)", "High Cube", "Open Top", "Hard Top",
  "Flat Rack", "Platform", "Reefer", "Ventilated", "Tank Container",
];

const SEA_CONTAINER_SIZES = [
  "10 FT", "20 FT", "40 FT", "40 FT High Cube", "45 FT High Cube",
];

const RAIL_WAGON_TYPES = [
  "BOXN", "BOXNHL", "BCN", "BTPN", "BRN",
  "Flat Wagon", "Covered Wagon", "Tank Wagon", "Hopper Wagon", "Parcel Van",
];

const RAIL_WAGON_CAPACITIES = [
  "20 MT", "30 MT", "40 MT", "50 MT", "60 MT", "70 MT", "80 MT",
];

export default function AddFreightQuoteModal({
  isOpen,
  onClose,
  onSave,
  quote = null,
  lastQuote = null,
  transportMode = "Road",
  mode = "Domestic",
  onOpenCreatePartner,
  onOpenAddContact,
  autoSelectPartner = null,
  isReadOnly = false,
  selectedRoute = null,
}) {
  // Form State
  const [sellerId, setSellerId] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [isManualEditLocked, setIsManualEditLocked] = useState(false);

  const [carrierReferenceNo, setCarrierReferenceNo] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [containerType, setContainerType] = useState("");
  const [containerSize, setContainerSize] = useState("");
  const [shippingLine, setShippingLine] = useState("");

  const [containerRates, setContainerRates] = useState([]);

  const [truckType, setTruckType] = useState("");
  const [truckCapacity, setTruckCapacity] = useState("");
  const [wagonType, setWagonType] = useState("");
  const [wagonCapacity, setWagonCapacity] = useState("");

  const [equipmentOptionsMap, setEquipmentOptionsMap] = useState({
    TRUCK_TYPE: ROAD_TRUCK_TYPES,
    TRUCK_CAPACITY: ROAD_TRUCK_CAPACITIES,
    CONTAINER_TYPE: SEA_CONTAINER_TYPES,
    CONTAINER_SIZE: SEA_CONTAINER_SIZES,
    WAGON_TYPE: RAIL_WAGON_TYPES,
    WAGON_CAPACITY: RAIL_WAGON_CAPACITIES,
  });

  const [activeInlineCategory, setActiveInlineCategory] = useState(null);
  const [inlineValue, setInlineValue] = useState("");
  const [inlineLoading, setInlineLoading] = useState(false);
  const [inlineError, setInlineError] = useState("");

  const fetchEquipmentOptions = async () => {
    try {
      const res = await axiosClient.get("/masters/equipment-options");
      const list = res.data?.data || res.data || [];
      if (Array.isArray(list) && list.length > 0) {
        const grouped = {
          TRUCK_TYPE: [], TRUCK_CAPACITY: [], CONTAINER_TYPE: [],
          CONTAINER_SIZE: [], WAGON_TYPE: [], WAGON_CAPACITY: [],
        };
        list.forEach((item) => {
          if (grouped[item.category]) grouped[item.category].push(item.value);
        });
        setEquipmentOptionsMap((prev) => ({
          TRUCK_TYPE: [...new Set([...ROAD_TRUCK_TYPES, ...grouped.TRUCK_TYPE])],
          TRUCK_CAPACITY: [...new Set([...ROAD_TRUCK_CAPACITIES, ...grouped.TRUCK_CAPACITY])],
          CONTAINER_TYPE: [...new Set([...SEA_CONTAINER_TYPES, ...grouped.CONTAINER_TYPE])],
          CONTAINER_SIZE: [...new Set([...SEA_CONTAINER_SIZES, ...grouped.CONTAINER_SIZE])],
          WAGON_TYPE: [...new Set([...RAIL_WAGON_TYPES, ...grouped.WAGON_TYPE])],
          WAGON_CAPACITY: [...new Set([...RAIL_WAGON_CAPACITIES, ...grouped.WAGON_CAPACITY])],
        }));
      }
    } catch (err) {
      console.warn("Failed to load equipment options:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEquipmentOptions();
      setActiveInlineCategory(null);
      setInlineValue("");
      setInlineError("");
    }
  }, [isOpen]);

  const handleSaveInline = async (category, setter) => {
    if (!inlineValue || !inlineValue.trim()) {
      setInlineError("Please enter an option value.");
      return;
    }
    setInlineLoading(true);
    setInlineError("");
    try {
      const res = await axiosClient.post("/masters/equipment-options", {
        category,
        value: inlineValue.trim(),
      });
      const created = res.data?.data || res.data;
      const createdVal = created?.value || inlineValue.trim();
      await fetchEquipmentOptions();
      setter(createdVal);
      setActiveInlineCategory(null);
      setInlineValue("");
    } catch (err) {
      console.error(err);
      setInlineError(err.response?.data?.message || "Failed to save option.");
    } finally {
      setInlineLoading(false);
    }
  };

  const renderEquipmentSelectField = (label, value, setter, category, defaultOptions, placeholder) => {
    const isInline = activeInlineCategory === category;
    const options = equipmentOptionsMap[category] || defaultOptions;

    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-slate-700">
            {label} <span className="text-red-500">*</span>
          </label>
          {!isInline && !isReadOnly && (
            <button
              type="button"
              onClick={() => {
                setActiveInlineCategory(category);
                setInlineValue("");
                setInlineError("");
              }}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3 w-3" /> Add Custom
            </button>
          )}
        </div>

        {isInline ? (
          <div className="space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                value={inlineValue}
                onChange={(e) => setInlineValue(e.target.value)}
                placeholder={`New ${label}...`}
                maxLength={100}
                autoFocus
                className="min-w-0 flex-1 px-3 py-2 border border-indigo-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white shadow-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSaveInline(category, setter);
                  }
                  if (e.key === "Escape") {
                    setActiveInlineCategory(null);
                    setInlineError("");
                  }
                }}
              />
              <button
                type="button"
                onClick={() => handleSaveInline(category, setter)}
                disabled={inlineLoading}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shrink-0 flex items-center justify-center cursor-pointer disabled:opacity-60"
              >
                {inlineLoading ? (
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveInlineCategory(null);
                  setInlineError("");
                }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors shrink-0 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {inlineError && (
              <p className="text-xs font-medium text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" /> {inlineError}
              </p>
            )}
          </div>
        ) : (
          <select
            value={value}
            onChange={(e) => {
              if (e.target.value === "__ADD_NEW__") {
                setActiveInlineCategory(category);
                setInlineValue("");
                setInlineError("");
              } else {
                setter(e.target.value);
              }
            }}
            disabled={isReadOnly}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white cursor-pointer disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed shadow-sm"
          >
            <option value="">{placeholder}</option>
            {options.map((opt, idx) => (
              <option key={`${opt}-${idx}`} value={opt}>{opt}</option>
            ))}
            <option value="__ADD_NEW__" className="font-semibold text-indigo-600 bg-indigo-50">
              + Add Custom...
            </option>
          </select>
        )}
      </div>
    );
  };

  const [freightAmount, setFreightAmount] = useState("");
  const [currency, setCurrency] = useState(mode === "International" || mode === "Export" || mode === "Merchant Export" ? "USD" : "INR");

  const [chargeMasterList, setChargeMasterList] = useState([]);
  const [charges, setCharges] = useState([]);

  const [isAddChargeModalOpen, setIsAddChargeModalOpen] = useState(false);
  const [newChargeName, setNewChargeName] = useState("");
  const [newChargeMode, setNewChargeMode] = useState(transportMode || "Road");
  const [newChargeLoading, setNewChargeLoading] = useState(false);
  const [newChargeError, setNewChargeError] = useState("");
  const [targetChargeIndex, setTargetChargeIndex] = useState(null);

  const fetchChargeMaster = async () => {
    try {
      const res = await axiosClient.get("/logistics/charge-master", {
        params: { mode: transportMode || "Road" },
      });
      const list = res.data?.data || res.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setChargeMasterList(list);
      } else {
        setChargeMasterList(getDefaultChargeList(transportMode));
      }
    } catch (err) {
      setChargeMasterList(getDefaultChargeList(transportMode));
    }
  };

  const getDefaultChargeList = (modeStr) => {
    const modeNorm = (modeStr || "").toLowerCase();
    let names = [];
    if (modeNorm === "sea") {
      names = ["Ocean Freight", "THC (Terminal Handling Charges)", "Documentation Charges", "ISPS Charges", "Seal Charges", "Detention Charges", "Demurrage Charges"];
    } else if (modeNorm === "rail") {
      names = ["Basic Freight", "Loading Charges", "Unloading Charges", "Handling Charges", "Documentation Charges", "Wagon Detention Charges", "Insurance", "GST"];
    } else {
      names = ["Basic Freight", "Loading Charges", "Unloading Charges", "Toll Charges", "Documentation Charges", "Fuel Surcharge (FSC)", "Handling Charges", "Insurance", "Waiting / Detention Charges", "Warehouse Charges", "GST"];
    }
    return names.map((name, idx) => ({ id: idx + 1, chargeName: name, mode: modeStr || "Road" }));
  };

  useEffect(() => { if (isOpen) fetchChargeMaster(); }, [isOpen, transportMode]);

  useEffect(() => {
    if (!isOpen) return;
    if (quote && Array.isArray(quote.charges) && quote.charges.length > 0) {
      setCharges(quote.charges.map((c, idx) => ({
        id: c.id || Date.now() + idx,
        chargeMasterId: c.chargeMasterId || null,
        chargeName: c.chargeName || "",
        amount: c.amount ? String(c.amount) : "",
        remarks: c.remarks || "",
      })));
    } else if (quote && quote.freightAmount && Number(quote.freightAmount) > 0) {
      const defaultName = (transportMode || "").toLowerCase() === "sea" ? "Ocean Freight" : "Basic Freight";
      setCharges([{
        id: Date.now(), chargeMasterId: null, chargeName: defaultName,
        amount: String(quote.freightAmount), remarks: quote.remarks || "",
      }]);
    } else {
      setCharges([]);
    }
  }, [quote, isOpen, transportMode]);

  const handleAddContainerRate = () => {
    setContainerRates(prev => [...prev, { id: Date.now() + Math.random(), containerType: "", containerSize: "", charges: [] }]);
  };

  const handleRemoveContainerRate = (index) => {
    setContainerRates(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleDuplicateContainerRate = (index) => {
    setContainerRates(prev => {
      const arr = [...prev];
      const source = arr[index];
      arr.push({ ...source, id: Date.now() + Math.random(), charges: source.charges.map(c => ({ ...c, id: Date.now() + Math.random() })) });
      return arr;
    });
  };

  const handleMoveContainerRateUp = (index) => {
    if (index === 0) return;
    setContainerRates(prev => {
      const arr = [...prev];
      const temp = arr[index - 1];
      arr[index - 1] = arr[index];
      arr[index] = temp;
      return arr;
    });
  };

  const handleMoveContainerRateDown = (index) => {
    setContainerRates(prev => {
      if (index >= prev.length - 1) return prev;
      const arr = [...prev];
      const temp = arr[index + 1];
      arr[index + 1] = arr[index];
      arr[index] = temp;
      return arr;
    });
  };

  const handleContainerRateFieldChange = (index, field, value) => {
    setContainerRates(prev => {
      const arr = [...prev];
      arr[index] = { ...arr[index], [field]: value };
      return arr;
    });
  };

  const handleContainerRateChargeChange = (rateIndex, chargeIndex, field, value) => {
    if (field === "chargeName" && value === "__ADD_NEW_CHARGE_TYPE__") {
      setTargetChargeIndex({ rateIndex, chargeIndex });
      setNewChargeName("");
      setNewChargeMode(transportMode || "Road");
      setNewChargeError("");
      setIsAddChargeModalOpen(true);
      return;
    }
    setContainerRates(prev => {
      const arr = [...prev];
      const charges = [...arr[rateIndex].charges];
      const updated = { ...charges[chargeIndex], [field]: value };
      if (field === "chargeName") {
        const match = chargeMasterList.find((m) => m.chargeName === value);
        if (match) updated.chargeMasterId = match.id;
      }
      charges[chargeIndex] = updated;
      arr[rateIndex] = { ...arr[rateIndex], charges };
      return arr;
    });
  };

  const handleAddContainerRateCharge = (rateIndex) => {
    setContainerRates(prev => {
      const arr = [...prev];
      const charges = [...arr[rateIndex].charges];
      charges.push({ id: Date.now() + Math.random(), chargeMasterId: null, chargeName: "", amount: "", remarks: "" });
      arr[rateIndex] = { ...arr[rateIndex], charges };
      return arr;
    });
  };

  const handleRemoveContainerRateCharge = (rateIndex, chargeIndex) => {
    setContainerRates(prev => {
      const arr = [...prev];
      const charges = arr[rateIndex].charges.filter((_, idx) => idx !== chargeIndex);
      arr[rateIndex] = { ...arr[rateIndex], charges };
      return arr;
    });
  };

  const handleAddChargeRow = () => {
    setCharges((prev) => [...prev, { id: Date.now() + Math.random(), chargeMasterId: null, chargeName: "", amount: "", remarks: "" }]);
  };

  const handleRemoveChargeRow = (index) => {
    setCharges((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleMoveRowUp = (index) => {
    if (index === 0) return;
    setCharges((prev) => {
      const arr = [...prev];
      const temp = arr[index - 1];
      arr[index - 1] = arr[index];
      arr[index] = temp;
      return arr;
    });
  };

  const handleMoveRowDown = (index) => {
    setCharges((prev) => {
      if (index >= prev.length - 1) return prev;
      const arr = [...prev];
      const temp = arr[index + 1];
      arr[index + 1] = arr[index];
      arr[index] = temp;
      return arr;
    });
  };

  const handleChargeRowChange = (index, field, value) => {
    if (field === "chargeName" && value === "__ADD_NEW_CHARGE_TYPE__") {
      setTargetChargeIndex(index);
      setNewChargeName("");
      setNewChargeMode(transportMode || "Road");
      setNewChargeError("");
      setIsAddChargeModalOpen(true);
      return;
    }
    setCharges((prev) => {
      const arr = [...prev];
      const updated = { ...arr[index], [field]: value };
      if (field === "chargeName") {
        const match = chargeMasterList.find((m) => m.chargeName === value);
        if (match) updated.chargeMasterId = match.id;
      }
      arr[index] = updated;
      return arr;
    });
  };

  const calculatedGrandTotal = useMemo(() => {
    return charges.reduce((acc, row) => {
      const val = parseFloat(row.amount);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  }, [charges]);

  const calculatedSubtotal = useMemo(() => {
    return charges.reduce((acc, row) => {
      if ((row.chargeName || "").toUpperCase().includes("GST")) return acc;
      const val = parseFloat(row.amount);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  }, [charges]);

  const calculatedTaxTotal = useMemo(() => {
    return charges.reduce((acc, row) => {
      if ((row.chargeName || "").toUpperCase().includes("GST")) {
        const val = parseFloat(row.amount);
        return acc + (isNaN(val) ? 0 : val);
      }
      return acc;
    }, 0);
  }, [charges]);

  useEffect(() => {
    setFreightAmount(calculatedGrandTotal > 0 ? String(calculatedGrandTotal) : "");
  }, [calculatedGrandTotal]);

  const handleSaveNewChargeType = async (e) => {
    e.preventDefault();
    if (!newChargeName || !newChargeName.trim()) {
      setNewChargeError("Charge Name is required.");
      return;
    }
    setNewChargeLoading(true);
    setNewChargeError("");
    try {
      const res = await axiosClient.post("/logistics/charge-master", {
        chargeName: newChargeName.trim(),
        mode: newChargeMode || transportMode || "Road",
      });
      const created = res.data?.data || res.data;
      const createdName = created?.chargeName || newChargeName.trim();
      await fetchChargeMaster();

      if (targetChargeIndex !== null) {
        if (typeof targetChargeIndex === 'object') {
          handleContainerRateChargeChange(targetChargeIndex.rateIndex, targetChargeIndex.chargeIndex, "chargeName", createdName);
        } else {
          handleChargeRowChange(targetChargeIndex, "chargeName", createdName);
        }
      }

      setIsAddChargeModalOpen(false);
      setNewChargeName("");
      setNewChargeError("");
    } catch (err) {
      setNewChargeError(err.response?.data?.message || "Failed to save charge type.");
    } finally {
      setNewChargeLoading(false);
    }
  };

  const [transitDays, setTransitDays] = useState("");
  const [validityDate, setValidityDate] = useState("");
  const [quoteDate, setQuoteDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [remarks, setRemarks] = useState("");

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

  const { data: currencies = [], isLoading: currenciesLoading } = useCurrencyMaster();

  const currencyOptions = useMemo(() => {
    return currencies.map((c) => ({ value: c.code, label: `${c.code} - ${c.name}` }));
  }, [currencies]);

  const selectedCurrencyOption = useMemo(() => {
    if (!currency) return null;
    const found = currencies.find((c) => c.code.toUpperCase() === currency.toUpperCase());
    return found ? { value: found.code, label: `${found.code} - ${found.name}` } : { value: currency, label: currency };
  }, [currency, currencies]);

  const reactSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#6366f1" : "#cbd5e1",
      borderRadius: "0.5rem",
      fontSize: "0.875rem",
      fontWeight: "500",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(99, 102, 241, 0.2)" : "none",
      minHeight: "42px",
      backgroundColor: state.isDisabled ? "#f8fafc" : "white",
      "&:hover": { borderColor: state.isFocused ? "#6366f1" : "#94a3b8" },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#6366f1" : state.isFocused ? "#e0e7ff" : "white",
      color: state.isSelected ? "white" : "#1e293b",
      fontSize: "0.875rem",
      cursor: "pointer",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  useEffect(() => {
    const modeNorm = (transportMode || "").toLowerCase();
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

      if (quote.containerRates && quote.containerRates.length > 0) {
        setContainerRates(quote.containerRates.map(cr => ({
          id: cr.id || Date.now() + Math.random(),
          containerType: cr.containerType || "",
          containerSize: cr.containerSize || "",
          charges: Array.isArray(cr.charges) ? cr.charges.map((c, idx) => ({
            id: c.id || Date.now() + idx, chargeMasterId: c.chargeMasterId || null,
            chargeName: c.chargeName || "", amount: c.amount ? String(c.amount) : "", remarks: c.remarks || "",
          })) : [],
        })));
      } else {
        setContainerRates([{ id: Date.now() + Math.random(), containerType: "", containerSize: "", charges: [] }]);
      }

      setTruckType(quote.truckType || (modeNorm === "road" ? quote.vehicleType : "") || "");
      setTruckCapacity(quote.truckCapacity || "");
      setWagonType(quote.wagonType || (modeNorm === "rail" ? quote.vehicleType : "") || "");
      setWagonCapacity(quote.wagonCapacity || "");

      setFreightAmount(quote.freightAmount ? String(quote.freightAmount) : "");
      setCurrency(quote.currency || (mode === "International" || mode === "Export" || mode === "Merchant Export" ? "USD" : "INR"));

      setTransitDays(quote.transitDays || "");
      setValidityDate(quote.validityDate ? quote.validityDate.split("T")[0] : "");
      setQuoteDate(quote.quoteDate ? quote.quoteDate.split("T")[0] : new Date().toISOString().split("T")[0]);
      setPaymentTerms(quote.paymentTerms || "");
      setRemarks(quote.remarks || "");

      setPol(quote.pol || ""); setPod(quote.pod || "");
      setEtd(quote.etd ? quote.etd.split("T")[0] : ""); setEta(quote.eta ? quote.eta.split("T")[0] : "");
      setFreeDays(quote.freeDays || 0);
      setCutoffDate(quote.cutoffDate ? quote.cutoffDate.split("T")[0] : "");
      setVessel(quote.vessel || ""); setVoyage(quote.voyage || "");
    } else {
      setSellerId(""); setContactPerson(""); setContactNumber(""); setIsManualEditLocked(false);
      setCarrierReferenceNo(""); setVehicleType(""); setContainerType(""); setContainerSize(""); setShippingLine("");
      setContainerRates([{ id: Date.now() + Math.random(), containerType: "", containerSize: "", charges: [] }]);
      setTruckType(""); setTruckCapacity(""); setWagonType(""); setWagonCapacity("");
      setFreightAmount(""); setCurrency(mode === "International" || mode === "Export" || mode === "Merchant Export" ? "USD" : "INR");
      setTransitDays(""); setValidityDate(""); setQuoteDate(new Date().toISOString().split("T")[0]); setPaymentTerms(""); setRemarks("");
      setPol(""); setPod(""); setEtd(""); setEta(""); setFreeDays(0); setCutoffDate(""); setVessel(""); setVoyage("");
    }
    setError("");
  }, [quote, lastQuote, mode, transportMode, isOpen]);

  const [partnerContactsList, setPartnerContactsList] = useState([]);

  useEffect(() => {
    if (sellerId) {
      axiosClient.get(`/masters/partners/${sellerId}`).then((res) => {
        const partnerData = res.data?.data || res.data;
        const contacts = partnerData?.contacts || [];
        setPartnerContactsList(contacts);
        if (!isManualEditLocked && contacts.length > 0) {
          const primary = contacts.find((c) => c.isPrimary) || contacts[0];
          setContactPerson(primary.name || "");
          setContactNumber(primary.phone || "");
        }
      }).catch(() => { setPartnerContactsList([]); });
    } else {
      setPartnerContactsList([]);
    }
  }, [sellerId, isManualEditLocked]);

  useEffect(() => {
    if (autoSelectPartner?.partnerId) {
      setSellerId(autoSelectPartner.partnerId);
      if (!isManualEditLocked) {
        setContactPerson(autoSelectPartner.contactName || "");
        setContactNumber(autoSelectPartner.phoneNumber || "");
      }
      if (autoSelectPartner.focusContactField) {
        setTimeout(() => { contactPersonInputRef.current?.focus(); }, 150);
      }
    }
  }, [autoSelectPartner, isManualEditLocked]);

  const handlePartnerSelect = (selectedData) => {
    setSellerId(selectedData?.partnerId || selectedData?.id);
    setIsManualEditLocked(false);
  };

  const handleContactSelectChange = (e) => {
    const val = e.target.value;
    if (val === "__custom__") {
      setIsManualEditLocked(true); setContactPerson(""); setContactNumber("");
    } else {
      setIsManualEditLocked(false); setContactPerson(val);
      const match = partnerContactsList.find((c) => c.name === val);
      if (match) setContactNumber(match.phone || "");
    }
  };

  const handleContactPersonChange = (e) => { setIsManualEditLocked(true); setContactPerson(e.target.value); };
  const handleContactNumberChange = (e) => { setIsManualEditLocked(true); setContactNumber(e.target.value); };

  const validatePhone = (phone) => {
    if (!phone) return true;
    return /^[0-9+\s\-()]{6,25}$/.test(phone.trim());
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;
    const modeNorm = (transportMode || "").toLowerCase();

    if (!sellerId) { setError("Please select a transport partner."); return; }
    if (contactNumber && !validatePhone(contactNumber)) { setError("Please enter a valid phone number."); return; }

    if (modeNorm !== "sea") {
      if (!charges || charges.length === 0) { setError("Please add at least one freight charge line item."); return; }
      for (let i = 0; i < charges.length; i++) {
        if (!charges[i].chargeName || !charges[i].chargeName.trim()) { setError(`Please select Charge Type for row #${i + 1}.`); return; }
        if (!charges[i].amount || parseFloat(charges[i].amount) <= 0) { setError(`Please enter a valid amount for "${charges[i].chargeName}".`); return; }
      }
    }

    if (!currency) { setError("Please select currency."); return; }
    if (!transitDays) { setError("Please enter transit days."); return; }
    if (!validityDate) { setError("Please enter quote validity date."); return; }

    if (modeNorm === "road") {
      if (!truckType) { setError("Truck Type is required."); return; }
      if (!truckCapacity) { setError("Truck Capacity is required."); return; }
    } else if (modeNorm === "sea") {
      if (!containerRates || containerRates.length === 0) { setError("Please add at least one Container Rate."); return; }
      const seen = new Set();
      for (let i = 0; i < containerRates.length; i++) {
        const cr = containerRates[i];
        if (!cr.containerType) { setError(`Container Rate #${i + 1}: Type is required.`); return; }
        if (!cr.containerSize) { setError(`Container Rate #${i + 1}: Size is required.`); return; }
        if (!cr.charges || cr.charges.length === 0) { setError(`Container Rate #${i + 1}: Please add at least one freight charge.`); return; }
        for (let j = 0; j < cr.charges.length; j++) {
          if (!cr.charges[j].chargeName || !cr.charges[j].chargeName.trim()) { setError(`Container Rate #${i + 1} Charge #${j + 1}: Select Charge Type.`); return; }
          if (!cr.charges[j].amount || parseFloat(cr.charges[j].amount) <= 0) { setError(`Container Rate #${i + 1} Charge #${j + 1}: Enter valid amount.`); return; }
        }
        const key = `${cr.containerType}-${cr.containerSize}`;
        if (seen.has(key)) { setError(`Duplicate Container Rate found: ${cr.containerType} ${cr.containerSize}. Each size must be unique.`); return; }
        seen.add(key);
      }
    } else if (modeNorm === "rail") {
      if (!wagonType) { setError("Wagon Type is required."); return; }
      if (!wagonCapacity) { setError("Wagon Capacity is required."); return; }
    }

    setLoading(true);
    try {
      const payload = {
        quoteDate, sellerId: Number(sellerId), freightAmount: calculatedGrandTotal,
        charges: charges.map((c, idx) => ({
          ...(c.chargeMasterId && { chargeMasterId: c.chargeMasterId }),
          chargeName: c.chargeName.trim(), amount: parseFloat(c.amount),
          ...(c.remarks && { remarks: c.remarks.trim() }), displayOrder: idx + 1,
        })),
        currency: currency || "INR", fuelCharges: 0, additionalCharges: 0, transitDays: parseInt(transitDays, 10), validityDate,
        ...(carrierReferenceNo && carrierReferenceNo.trim() && { carrierReferenceNo: carrierReferenceNo.trim() }),
        ...(contactPerson && contactPerson.trim() && { contactPerson: contactPerson.trim() }),
        ...(contactNumber && contactNumber.trim() && { contactNumber: contactNumber.trim() }),
        ...(paymentTerms && paymentTerms.trim() && { paymentTerms: paymentTerms.trim() }),
        ...(remarks && remarks.trim() && { remarks: remarks.trim() }),
        ...(selectedRoute?.id && selectedRoute.id !== 'all' && { routeId: selectedRoute.id }),

        ...(modeNorm === "road" && { truckType: truckType.trim(), truckCapacity: truckCapacity.trim(), vehicleType: truckType.trim() }),
        ...(modeNorm === "sea" && {
          containerRates: containerRates.map((cr, idx) => ({
            containerType: cr.containerType.trim(), containerSize: cr.containerSize.trim(),
            charges: cr.charges.map((c, cIdx) => ({
              ...(c.chargeMasterId && { chargeMasterId: c.chargeMasterId }),
              chargeName: c.chargeName.trim(), amount: parseFloat(c.amount),
              ...(c.remarks && { remarks: c.remarks.trim() }), displayOrder: cIdx + 1,
            })),
          })),
          ...(shippingLine && { shippingLine: shippingLine.trim() }),
        }),
        ...(modeNorm === "rail" && { wagonType: wagonType.trim(), wagonCapacity: wagonCapacity.trim(), vehicleType: wagonType.trim() }),

        ...((mode === "International" || mode === "Export" || mode === "Merchant Export") && {
          ...(pol && { pol: pol.trim() }), ...(pod && { pod: pod.trim() }), ...(etd && { etd }), ...(eta && { eta }),
          ...(freeDays && { freeDays: parseInt(freeDays, 10) }), ...(cutoffDate && { cutoffDate }),
          ...(vessel && { vessel: vessel.trim() }), ...(voyage && { voyage: voyage.trim() }),
          ...(shippingLine && { shippingLine: shippingLine.trim() }),
        }),
      };

      try {
        localStorage.setItem(`agricom_last_equipment_${modeNorm}`, JSON.stringify({
          truckType: (truckType || "").trim(), truckCapacity: (truckCapacity || "").trim(),
          containerType: (containerType || "").trim(), containerSize: (containerSize || "").trim(),
          wagonType: (wagonType || "").trim(), wagonCapacity: (wagonCapacity || "").trim(), shippingLine: (shippingLine || "").trim(),
        }));
      } catch (err) { }

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
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[70] w-full max-w-4xl bg-white shadow-2xl flex flex-col transition-transform duration-300 animate-in slide-in-from-right rounded-l-2xl">

        {/* Header */}
        <div className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between rounded-tl-2xl">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                {isReadOnly ? quote ? `Freight Quotation (${quote.quoteNumber})` : "Freight Quotation Details"
                  : quote ? `Revise Freight Quote (${quote.quoteNumber})` : "Add New Freight Quotation"}
                {isReadOnly && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-slate-100 text-slate-600 border border-slate-200 tracking-wider">
                    Read Only
                  </span>
                )}
              </h3>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                Mode: <span className="text-indigo-600 font-semibold">{mode}</span> ({transportMode} Logistics)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-slate-50/30">

            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 font-medium text-sm">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Route Context Banner */}
            {selectedRoute?.id && selectedRoute.id !== "all" && (
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <h4 className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">

                    <Map className="h-3.5 w-3.5" />
                    Route Details
                  </h4>
                  <div className="flex items-center gap-4 text-slate-800">
                    <div>
                      <span className="text-xs text-slate-500 block">Origin</span>
                      <span className="font-semibold text-sm flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" /> {selectedRoute.origin || "—"}
                      </span>
                    </div>
                    <div className="text-slate-300 px-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Destination</span>
                      <span className="font-semibold text-sm flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-indigo-400" /> {selectedRoute.destination || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 1: Partner Info */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
              <h4 className="text-sm font-semibold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400" /> 1. Transport Partner & Contact
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <SearchablePartnerSelect
                  label="Transport Partner *"
                  required={true}
                  value={sellerId}
                  onChange={(id) => setSellerId(id)}
                  onSelect={handlePartnerSelect}
                  roleNames={["Transport", "TRANSPORT-DOMESTIC", "TRANSPORT-INTERNATIONAL", "Freight Forwarder", "Shipping Line"]}
                  mode="entity"
                  allowCreate={!isReadOnly}
                  allowAddContact={!isReadOnly}
                  disabled={isReadOnly}
                  onOpenCreatePartner={onOpenCreatePartner}
                  onOpenAddContact={onOpenAddContact}
                  placeholder="Search Partner..."
                />

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center justify-between">
                    <span>Contact Person</span>
                    {isManualEditLocked && !isReadOnly && (
                      <span className="text-[10px] text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded">Edited</span>
                    )}
                  </label>
                  <div className="relative">
                    {partnerContactsList.length > 0 && !isManualEditLocked ? (
                      <select
                        value={contactPerson}
                        onChange={handleContactSelectChange}
                        disabled={isReadOnly}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-slate-800 cursor-pointer shadow-sm disabled:bg-slate-50"
                      >
                        <option value="">Select Contact...</option>
                        {partnerContactsList.map((c) => (
                          <option key={c.id || c.name} value={c.name}>
                            {c.name} {c.isPrimary ? "(Primary)" : ""}
                          </option>
                        ))}
                        {!isReadOnly && <option value="__custom__" className="text-indigo-600">+ Enter Custom...</option>}
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
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white shadow-sm disabled:bg-slate-50"
                        />
                        {partnerContactsList.length > 0 && isManualEditLocked && !isReadOnly && (
                          <button
                            type="button"
                            onClick={() => setIsManualEditLocked(false)}
                            className="absolute right-2 text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 hover:bg-indigo-100"
                          >
                            Saved List
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={handleContactNumberChange}
                    disabled={isReadOnly}
                    placeholder="+91 98230 12345"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white shadow-sm disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Carrier Ref / Booking No.
                  </label>
                  <input
                    type="text"
                    value={carrierReferenceNo}
                    onChange={(e) => setCarrierReferenceNo(e.target.value)}
                    disabled={isReadOnly}
                    placeholder="e.g. BKN-99201"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white shadow-sm disabled:bg-slate-50"
                  />
                </div>

                {(transportMode || "").toLowerCase() === "sea" && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Shipping Line
                    </label>
                    <input
                      type="text"
                      value={shippingLine}
                      onChange={(e) => setShippingLine(e.target.value)}
                      disabled={isReadOnly}
                      placeholder="e.g. Maersk, MSC"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white shadow-sm disabled:bg-slate-50"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Equipment (Road/Rail) */}
            {(() => {
              const modeNorm = (transportMode || "").toLowerCase();
              if (modeNorm === "sea") return null;

              return (
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
                  <h4 className="text-sm font-semibold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <Truck className="h-4 w-4 text-slate-400" /> 2. Vehicle & Equipment Specifications
                  </h4>

                  {modeNorm === "road" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {renderEquipmentSelectField("Truck Type", truckType, (val) => {
                        setTruckType(val);
                        if (val && !truckCapacity) setTruckCapacity((equipmentOptionsMap.TRUCK_CAPACITY || ROAD_TRUCK_CAPACITIES)[0] || "10 MT");
                      }, "TRUCK_TYPE", ROAD_TRUCK_TYPES, "Select Truck Type"
                      )}
                      {renderEquipmentSelectField("Truck Capacity", truckCapacity, setTruckCapacity, "TRUCK_CAPACITY", ROAD_TRUCK_CAPACITIES, "Select Truck Capacity")}
                    </div>
                  )}

                  {modeNorm === "rail" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {renderEquipmentSelectField("Wagon Type", wagonType, (val) => {
                        setWagonType(val);
                        if (val && !wagonCapacity) setWagonCapacity((equipmentOptionsMap.WAGON_CAPACITY || RAIL_WAGON_CAPACITIES)[0] || "60 MT");
                      }, "WAGON_TYPE", RAIL_WAGON_TYPES, "Select Wagon Type"
                      )}
                      {renderEquipmentSelectField("Wagon Capacity", wagonCapacity, setWagonCapacity, "WAGON_CAPACITY", RAIL_WAGON_CAPACITIES, "Select Wagon Capacity")}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Sea: Container Rates */}
            {(transportMode || "").toLowerCase() === "sea" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Ship className="h-4 w-4 text-slate-400" /> Container Rate Cards
                  </h4>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={handleAddContainerRate}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg transition-colors shadow-sm"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Container Rate
                    </button>
                  )}
                </div>

                {containerRates.map((cr, rateIdx) => {
                  const rateTotal = cr.charges.reduce((acc, row) => acc + (parseFloat(row.amount) || 0), 0);

                  return (
                    <div key={cr.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative group">
                      {!isReadOnly && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => handleMoveContainerRateUp(rateIdx)} disabled={rateIdx === 0} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded disabled:opacity-30">
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => handleMoveContainerRateDown(rateIdx)} disabled={rateIdx === containerRates.length - 1} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded disabled:opacity-30">
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => handleDuplicateContainerRate(rateIdx)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded" title="Duplicate">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => handleRemoveContainerRate(rateIdx)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" title="Remove">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pr-32">
                        {renderEquipmentSelectField("Container Type", cr.containerType, (val) => handleContainerRateFieldChange(rateIdx, "containerType", val), "CONTAINER_TYPE", SEA_CONTAINER_TYPES, "Select Type")}
                        {renderEquipmentSelectField("Container Size", cr.containerSize, (val) => handleContainerRateFieldChange(rateIdx, "containerSize", val), "CONTAINER_SIZE", SEA_CONTAINER_SIZES, "Select Size")}
                      </div>

                      <div className="mt-6 pt-5 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Freight Charges</h5>
                          <div className="text-right">
                            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">Rate Total</span>
                            <span className="font-semibold text-slate-800">
                              {currency} {rateTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>

                        {cr.charges.length === 0 ? (
                          <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                            <p className="text-sm text-slate-500 mb-2">No charges added.</p>
                            {!isReadOnly && (
                              <button type="button" onClick={() => handleAddContainerRateCharge(rateIdx)} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                                + Add First Charge
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-lg border border-slate-200">
                            <table className="w-full text-left text-sm">
                              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                                <tr>
                                  <th className="px-4 py-3 w-[50%]">Charge Type *</th>
                                  <th className="px-4 py-3 w-[25%] text-right">Amount ({currency}) *</th>
                                  <th className="px-4 py-3">Remarks</th>
                                  {!isReadOnly && <th className="px-4 py-3 text-center w-[50px]"></th>}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {cr.charges.map((row, chargeIdx) => (
                                  <tr key={row.id} className="bg-white">
                                    <td className="p-2">
                                      <select
                                        value={row.chargeName}
                                        onChange={(e) => handleContainerRateChargeChange(rateIdx, chargeIdx, "chargeName", e.target.value)}
                                        disabled={isReadOnly}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                      >
                                        <option value="">Select Charge...</option>
                                        {chargeMasterList.map((m) => (<option key={m.id || m.chargeName} value={m.chargeName}>{m.chargeName}</option>))}
                                        {!isReadOnly && <option value="__ADD_NEW_CHARGE_TYPE__" className="text-indigo-600">+ Custom...</option>}
                                      </select>
                                    </td>
                                    <td className="p-2">
                                      <input
                                        type="number" step="0.01" value={row.amount}
                                        onChange={(e) => handleContainerRateChargeChange(rateIdx, chargeIdx, "amount", e.target.value)}
                                        disabled={isReadOnly} placeholder="0.00"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-right tabular-nums focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                      />
                                    </td>
                                    <td className="p-2">
                                      <input
                                        type="text" value={row.remarks || ""}
                                        onChange={(e) => handleContainerRateChargeChange(rateIdx, chargeIdx, "remarks", e.target.value)}
                                        disabled={isReadOnly} placeholder="Optional..."
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                      />
                                    </td>
                                    {!isReadOnly && (
                                      <td className="p-2 text-center">
                                        <button type="button" onClick={() => handleRemoveContainerRateCharge(rateIdx, chargeIdx)} className="p-1.5 text-slate-400 hover:text-red-600 rounded">
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {!isReadOnly && (
                              <div className="p-2 bg-slate-50 border-t border-slate-200">
                                <button type="button" onClick={() => handleAddContainerRateCharge(rateIdx)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 px-2 py-1">
                                  <Plus className="h-3 w-3" /> Add Row
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Section 3: Dynamic Freight Charges (Road/Rail) */}
            {(transportMode || "").toLowerCase() !== "sea" && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-slate-400" /> 3. Freight Charges
                  </h4>

                  <div className="w-full md:w-64">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Quotation Currency
                    </label>
                    {currenciesLoading ? (
                      <div className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-400 text-sm flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" /> Loading...
                      </div>
                    ) : (
                      <Select
                        options={currencyOptions}
                        value={selectedCurrencyOption}
                        onChange={(opt) => setCurrency(opt ? opt.value : "INR")}
                        isDisabled={isReadOnly}
                        styles={reactSelectStyles}
                        placeholder="Select Currency"
                        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                        menuPosition="fixed"
                      />
                    )}
                  </div>
                </div>

                {charges.length === 0 ? (
                  <div className="text-center py-10 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                    <DollarSign className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">No freight charges added yet.</p>
                    <p className="text-xs text-slate-500 mt-1 mb-4">Click below to start adding itemized charges.</p>
                    {!isReadOnly && (
                      <button type="button" onClick={handleAddChargeRow} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all">
                        <Plus className="h-4 w-4" /> Add Charge
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                          <tr>
                            <th className="px-4 py-3 w-[45%]">Charge Type *</th>
                            <th className="px-4 py-3 w-[20%] text-right">Amount ({currency}) *</th>
                            <th className="px-4 py-3">Remarks</th>
                            {!isReadOnly && <th className="px-4 py-3 text-center w-[100px]">Actions</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {charges.map((row, idx) => (
                            <tr key={row.id || idx} className="bg-white hover:bg-slate-50/50 transition-colors">
                              <td className="p-3">
                                <select
                                  value={row.chargeName}
                                  onChange={(e) => handleChargeRowChange(idx, "chargeName", e.target.value)}
                                  disabled={isReadOnly}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                                >
                                  <option value="">Select...</option>
                                  {chargeMasterList.map((m) => (<option key={m.id || m.chargeName} value={m.chargeName}>{m.chargeName}</option>))}
                                  {!isReadOnly && <option value="__ADD_NEW_CHARGE_TYPE__" className="text-indigo-600 font-medium">+ Custom...</option>}
                                </select>
                              </td>
                              <td className="p-3">
                                <input
                                  type="number" step="0.01" value={row.amount}
                                  onChange={(e) => handleChargeRowChange(idx, "amount", e.target.value)}
                                  disabled={isReadOnly} placeholder="0.00"
                                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm text-right tabular-nums focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                              </td>
                              <td className="p-3">
                                <input
                                  type="text" value={row.remarks || ""}
                                  onChange={(e) => handleChargeRowChange(idx, "remarks", e.target.value)}
                                  disabled={isReadOnly} placeholder="Optional..."
                                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                              </td>
                              {!isReadOnly && (
                                <td className="p-3 text-center">
                                  <div className="flex items-center justify-center gap-1 text-slate-400">
                                    <button type="button" onClick={() => handleMoveRowUp(idx)} disabled={idx === 0} className="p-1 hover:text-indigo-600 hover:bg-slate-100 rounded disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                                    <button type="button" onClick={() => handleMoveRowDown(idx)} disabled={idx === charges.length - 1} className="p-1 hover:text-indigo-600 hover:bg-slate-100 rounded disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                                    <button type="button" onClick={() => handleRemoveChargeRow(idx)} className="p-1 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Summary Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
                      <div>
                        {!isReadOnly && (
                          <button type="button" onClick={handleAddChargeRow} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 rounded-lg transition-colors shadow-sm">
                            <Plus className="h-4 w-4" /> Add Charge Row
                          </button>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm flex items-center justify-end gap-6 w-full sm:w-auto">
                        {calculatedTaxTotal > 0 && (
                          <>
                            <div className="text-right">
                              <span className="text-xs font-semibold text-slate-500 uppercase">Subtotal</span>
                              <div className="text-base font-semibold text-slate-700">{currency} {calculatedSubtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                            </div>
                            <div className="text-right border-l border-slate-200 pl-6">
                              <span className="text-xs font-semibold text-slate-500 uppercase">Tax/GST</span>
                              <div className="text-base font-semibold text-slate-700">{currency} {calculatedTaxTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                            </div>
                          </>
                        )}
                        <div className="text-right border-l border-slate-200 pl-6">
                          <span className="text-xs font-semibold text-slate-500 uppercase">Grand Total</span>
                          <div className="text-xl font-bold text-indigo-600 tabular-nums">{currency} {calculatedGrandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Section 4: SLA & Validity */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
              <h4 className="text-sm font-semibold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" /> 4. Logistics SLA & Terms
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Transit Days <span className="text-red-500">*</span></label>
                  <input type="number" required value={transitDays} onChange={(e) => setTransitDays(e.target.value)} disabled={isReadOnly} placeholder="e.g. 5" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white disabled:bg-slate-50 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Quote Validity <span className="text-red-500">*</span></label>
                  <input type="date" required value={validityDate} onChange={(e) => setValidityDate(e.target.value)} disabled={isReadOnly} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white disabled:bg-slate-50 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Quotation Date <span className="text-red-500">*</span></label>
                  <input type="date" required value={quoteDate} onChange={(e) => setQuoteDate(e.target.value)} disabled={isReadOnly} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white disabled:bg-slate-50 shadow-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Terms</label>
                <input type="text" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} disabled={isReadOnly} placeholder="e.g. 30 Days Credit" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white shadow-sm disabled:bg-slate-50" />
              </div>
            </div>

            {/* Section 5: International Shipping */}
            {(mode === "International" || mode === "Export" || mode === "Merchant Export") && (
              <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-5 shadow-sm space-y-5">
                <h4 className="text-sm font-semibold text-indigo-800 pb-2 border-b border-indigo-100/50 flex items-center gap-2">
                  <Ship className="h-4 w-4 text-indigo-400" /> 5. International Shipping Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Estimated ETD</label>
                    <input type="date" value={etd} onChange={(e) => setEtd(e.target.value)} disabled={isReadOnly} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white disabled:bg-slate-50 shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Estimated ETA</label>
                    <input type="date" value={eta} onChange={(e) => setEta(e.target.value)} disabled={isReadOnly} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white disabled:bg-slate-50 shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Cutoff Date (Port / CY)</label>
                    <input type="date" value={cutoffDate} onChange={(e) => setCutoffDate(e.target.value)} disabled={isReadOnly} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white disabled:bg-slate-50 shadow-sm" />
                  </div>
                </div>
              </div>
            )}

            {/* Remarks */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Special Terms / Remarks</label>
              {isReadOnly ? (
                <div className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-700 min-h-[60px] whitespace-pre-wrap">
                  {remarks || "No special terms or remarks specified."}
                </div>
              ) : (
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter special routing instructions, demurrage terms..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white shadow-sm resize-none"
                />
              )}
            </div>

          </div>

          {/* Sticky Footer */}
          <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-end gap-3 rounded-bl-2xl">
            {isReadOnly ? (
              <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm bg-white">
                Close
              </button>
            ) : (
              <>
                <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm bg-white">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-2 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  {loading ? <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Save className="h-4 w-4" />}
                  {quote ? "Update Quote" : "Save Quote"}
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      {/* Add Custom Charge Modal */}
      {isAddChargeModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-600" /> New Charge Type
              </h3>
              <button type="button" onClick={() => setIsAddChargeModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {newChargeError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm font-medium flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                <span>{newChargeError}</span>
              </div>
            )}

            <form onSubmit={handleSaveNewChargeType} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Charge Name <span className="text-red-500">*</span></label>
                <input type="text" required value={newChargeName} onChange={(e) => setNewChargeName(e.target.value)} placeholder="e.g. Storage Fee" autoFocus className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Applicable Mode <span className="text-red-500">*</span></label>
                <select value={newChargeMode} onChange={(e) => setNewChargeMode(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white">
                  <option value="Road">Road</option>
                  <option value="Sea">Sea</option>
                  <option value="Rail">Rail</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsAddChargeModalOpen(false)} className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={newChargeLoading} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm disabled:opacity-70 transition-all flex items-center gap-2">
                  {newChargeLoading ? <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Check className="h-4 w-4" />}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}