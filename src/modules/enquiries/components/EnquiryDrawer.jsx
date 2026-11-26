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
    hours = hours % 12 || 12;
    return `${day}-${month}-${year} ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  } catch {
    return "N/A";
  }
}

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
  ChevronDown,
  User,
  Ship,
  Truck,
  Train,
  DollarSign,
  Route,
  Briefcase,
  Check
} from "lucide-react";
import { enquiriesApi } from "../services/enquiriesApi";
import { useEnquiriesMasters } from "../hooks/useEnquiries";
import { useCurrencyMaster } from "../hooks/useCurrencyMaster";
import LocationHierarchy from "@/components/common/LocationHierarchy";
import PortSelector from "@/components/common/PortSelector";
import axiosClient from "@/lib/axios";
import { getAllCountryOptions } from "@/lib/countryUtils";
import usePermissions from "@/hooks/usePermissions";
import TransportDetailsGrid from "@/modules/common/components/TransportDetailsGrid";
import { getShipmentTypeShortForm } from "@/modules/sales-contracts/utils/formatUtils";
import { parseRouteLocation } from "@/constants/routeLocationsData";

const SHIPMENT_MODE_OPTIONS = [
  { value: "SHIP", label: "Ship", Icon: Ship },
  { value: "ROAD", label: "Road", Icon: Truck },
  { value: "RAIL", label: "Rail / Wagon", Icon: Train },
];

function resolveIncotermFromData(data, mastersShipmentTypes = []) {
  if (!data) return "";

  // 1. From linked sales contract
  const sc = data.salesContract;
  if (sc) {
    const scIncoterm =
      sc.incoterm ||
      sc.shipmentType?.code ||
      sc.shipmentType?.name ||
      sc.transportDetails?.[0]?.incoterm;
    if (scIncoterm) {
      const match = mastersShipmentTypes.find(
        (st) =>
          (st.code && st.code.toLowerCase() === scIncoterm.toLowerCase()) ||
          (st.name && st.name.toLowerCase() === scIncoterm.toLowerCase())
      );
      if (match) return match.code || match.name;
      return scIncoterm;
    }
  }

  // 2. From transportDetails
  if (data.transportDetails && data.transportDetails.length > 0) {
    const tdIncoterm = data.transportDetails[0].incoterm;
    if (tdIncoterm) {
      const match = mastersShipmentTypes.find(
        (st) =>
          (st.code && st.code.toLowerCase() === tdIncoterm.toLowerCase()) ||
          (st.name && st.name.toLowerCase() === tdIncoterm.toLowerCase())
      );
      if (match) return match.code || match.name;
      return tdIncoterm;
    }
  }

  // 3. Match against shipmentTerms or shipmentType if it represents an Incoterm
  const cand = data.incoterm || data.shipmentTerms || data.shipmentType;
  if (cand && mastersShipmentTypes.length > 0) {
    const match = mastersShipmentTypes.find(
      (st) =>
        (st.code && st.code.toLowerCase() === cand.toLowerCase()) ||
        (st.name && st.name.toLowerCase() === cand.toLowerCase())
    );
    if (match) return match.code || match.name;
  }

  return "";
}

function createDefaultTransportDetails(shipmentTypes = []) {
  const firstShipmentType = shipmentTypes?.[0];
  const defaultIncoterm = firstShipmentType
    ? getShipmentTypeShortForm(firstShipmentType) || firstShipmentType.code || firstShipmentType.name || ""
    : "";

  return [{
    sequence: 1,
    origin: "",
    incoterm: defaultIncoterm,
    destination: "",
    destinationCountry: "",
    destinationCity: "",
    destinationPlace: "",
    destinationZipCode: "",
  }];
}

export default function EnquiryDrawer({ isOpen, onClose, editData, isViewMode, onSaveSuccess }) {
  const { masters, loading: mastersLoading } = useEnquiriesMasters();
  const {
    partnerRoles = [],
    products = [],
    packingTypes = [],
    shipmentTypes = []
  } = masters || {};
  const { data: currencies = [], isLoading: currenciesLoading } = useCurrencyMaster();
  const { hasPermission } = usePermissions();

  const [savingType, setSavingType] = useState(null); // 'SAVE' or 'SAVE_NOTIFY'
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errors, setErrors] = useState({});
  const [createdByName, setCreatedByName] = useState("");

  const [form, setForm] = useState({
    enquiryNo: "",
    enquiryDate: new Date().toISOString().split("T")[0],
    partnerRoleId: "",
    partnerId: "",
    partnerAnnualTurnover: null,
    brokerRoleId: "",
    brokerId: "",
    productId: "",
    originCountryId: "",
    shipmentMode: "",
    originPort: "",
    destinationPort: "",
    podPort: "",
    originState: "",
    originCity: "",
    originZipCode: "",
    originStationCode: "",
    destinationCountry: "",
    destinationState: "",
    destinationCity: "",
    destinationZipCode: "",
    destinationStationCode: "",
    purity: "",
    packingTypeId: "",
    shipmentType: "",
    quantity: "",
    shipmentDate: "",
    buyingInterest: "",
    offerAmount: "",
    bidCurrency: "",
    potentialEnquiry: false,
    bidType: "TARGET",
    note: "",
    status: "",
    closureReason: "",
    closureRemark: "",
    closedBy: "",
    closedByName: "",
    closedAt: "",
    transportDetails: createDefaultTransportDetails(shipmentTypes),
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
  const [partnerTurnoverHasMasterValue, setPartnerTurnoverHasMasterValue] = useState(false);
  const partnerDropdownRef = useRef(null);

  // States for broker selection inside Drawer
  const [brokerOptions, setBrokerOptions] = useState([]);
  const [brokerLoading, setBrokerLoading] = useState(false);
  const [brokerSearch, setBrokerSearch] = useState("");
  const [isBrokerOpen, setIsBrokerOpen] = useState(false);
  const [selectedBrokerName, setSelectedBrokerName] = useState("");
  const brokerDropdownRef = useRef(null);

  // Consistent enterprise UI tokens
  const inp =
    "w-full h-[38px] px-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007aff]/15 focus:border-[#007aff] bg-white text-gray-800 placeholder:text-gray-400 transition-all";
  const readonlyInp =
    "w-full h-[38px] px-3 text-xs border border-gray-200/80 rounded-lg bg-slate-50/90 text-gray-600 font-medium flex items-center";
  const lbl = "block text-[11px] font-semibold text-gray-600 mb-1.5 leading-none";
  const err = "text-[10px] font-medium text-red-500 mt-1";
  const card = "bg-white rounded-xl border border-gray-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden";
  const cardHeader = "px-5 py-3 border-b border-gray-100 flex items-center gap-2.5 bg-slate-50/60";

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
        setCreatedByName(editData.createdByName || editData.creator?.name || "");
        const existingDest = editData.destinationCountry || editData.destinationPort || editData.destinationCity || "";
        const existingIncoterm = resolveIncotermFromData(editData, shipmentTypes);
        let resolvedTransportDetails = (editData.transportDetails && editData.transportDetails.length > 0)
          ? editData.transportDetails.map((r, i) => {
            const parsedDestination = parseRouteLocation(r.destination || existingDest);
            return {
              sequence: r.sequence || i + 1,
              origin: r.origin || editData.originPort || editData.originCity || editData.originCountryId || "",
              incoterm: r.incoterm || existingIncoterm || "",
              destination: r.destination || existingDest,
              destinationCountry: r.destinationCountry || parsedDestination.country || "",
              destinationCity: r.destinationCity || parsedDestination.city || "",
              destinationPlace: r.destinationPlace || parsedDestination.place || "",
              destinationZipCode: r.destinationZipCode || parsedDestination.zipCode || "",
            };
          })
          : [];

        if (resolvedTransportDetails.length === 0 && (existingDest || existingIncoterm)) {
          resolvedTransportDetails = [{
            sequence: 1,
            origin: editData.originPort || editData.originCity || editData.originCountryId || "",
            incoterm: existingIncoterm || "",
            destination: existingDest,
          }];
        } else if (resolvedTransportDetails.length > 0) {
          if (!resolvedTransportDetails[0].destination && existingDest) {
            resolvedTransportDetails[0].destination = existingDest;
          }
          if (!resolvedTransportDetails[0].incoterm && existingIncoterm) {
            resolvedTransportDetails[0].incoterm = existingIncoterm;
          }
        }

        const initialForm = {
          enquiryNo: editData.enquiryNo || "",
          enquiryDate: editData.enquiryDate ? editData.enquiryDate.split("T")[0] : "",
          partnerRoleId: editData.partnerRoleId || "",
          partnerId: editData.partnerId || "",
          partnerAnnualTurnover: editData.partnerAnnualTurnover ?? null,
          brokerRoleId: editData.brokerRoleId || editData.brokerRole?.id || "",
          brokerId: editData.brokerId || editData.broker?.id || "",
          productId: editData.productId || "",
          originCountryId: editData.originCountryId || "",
          shipmentMode: editData.shipmentMode || "",
          originPort: editData.originPort || "",
          destinationPort: editData.destinationPort || "",
          podPort: editData.destinationPort || editData.podName || "",
          originState: editData.originState || "",
          originCity: editData.originCity || "",
          originZipCode: editData.originZipCode || "",
          originStationCode: editData.originStationCode || "",
          destinationCountry: editData.destinationCountry || "",
          destinationState: editData.destinationState || "",
          destinationCity: editData.destinationCity || "",
          destinationZipCode: editData.destinationZipCode || "",
          destinationStationCode: editData.destinationStationCode || "",
          purity: editData.purity || "",
          packingTypeId: editData.packingTypeId || "",
          shipmentType: editData.shipmentType || "",
          quantity: editData.quantity != null && editData.quantity !== "" ? parseFloat(String(editData.quantity)) : "",
          shipmentDate: editData.shipmentDate ? editData.shipmentDate.split("T")[0] : "",
          buyingInterest: editData.buyingInterest != null && editData.buyingInterest !== "" ? parseFloat(String(editData.buyingInterest)) : "",
          offerAmount: editData.offerAmount != null && editData.offerAmount !== "" ? parseInt(String(editData.offerAmount), 10) : "",
          bidCurrency: editData.bidCurrency || "",
          potentialEnquiry: editData.potentialEnquiry || false,
          bidType: editData.bidType || "TARGET",
          note: editData.note || "",
          status: editData.status || "",
          closureReason: editData.closureReason || "",
          closureRemark: editData.closureRemark || "",
          closedBy: editData.closedBy || editData.closedByUser?.id || "",
          closedByName: editData.closedByName || editData.closedByUser?.name || "",
          closedAt: editData.closedAt || "",
          transportDetails: resolvedTransportDetails,
        };
        setForm(initialForm);
        setInitialFormState(initialForm);
        setSelectedBrokerName(editData.brokerName || editData.broker?.entityName || "");
        setIsDirty(false);

        // Background query to refresh form data
        enquiriesApi.getOne(editData.id)
          .then((fresh) => {
            if (fresh) {
              setCreatedByName(fresh.createdByName || fresh.creator?.name || fresh.creator?.email || "");

              const freshDest = fresh.destinationCountry || fresh.destinationPort || fresh.destinationCity || existingDest;
              const freshIncoterm = resolveIncotermFromData(fresh, shipmentTypes) || existingIncoterm;
              let freshTransportDetails = (fresh.transportDetails && fresh.transportDetails.length > 0)
                ? fresh.transportDetails.map((r, i) => {
                  const parsedDestination = parseRouteLocation(r.destination || freshDest);
                  return {
                    sequence: r.sequence || i + 1,
                    origin: r.origin || fresh.originPort || fresh.originCity || fresh.originCountryId || "",
                    incoterm: r.incoterm || freshIncoterm || "",
                    destination: r.destination || freshDest,
                    destinationCountry: r.destinationCountry || parsedDestination.country || "",
                    destinationCity: r.destinationCity || parsedDestination.city || "",
                    destinationPlace: r.destinationPlace || parsedDestination.place || "",
                    destinationZipCode: r.destinationZipCode || parsedDestination.zipCode || "",
                  };
                })
                : [];

              if (freshTransportDetails.length === 0 && (freshDest || freshIncoterm)) {
                freshTransportDetails = [{
                  sequence: 1,
                  origin: fresh.originPort || fresh.originCity || fresh.originCountryId || "",
                  incoterm: freshIncoterm || "",
                  destination: freshDest,
                }];
              } else if (freshTransportDetails.length > 0) {
                if (!freshTransportDetails[0].destination && freshDest) {
                  freshTransportDetails[0].destination = freshDest;
                }
                if (!freshTransportDetails[0].incoterm && freshIncoterm) {
                  freshTransportDetails[0].incoterm = freshIncoterm;
                }
              }

              const freshForm = {
                enquiryNo: fresh.enquiryNo || "",
                enquiryDate: fresh.enquiryDate ? fresh.enquiryDate.split("T")[0] : "",
                partnerRoleId: fresh.partnerRoleId || "",
                partnerId: fresh.partnerId || "",
                partnerAnnualTurnover: fresh.partnerAnnualTurnover ?? null,
                brokerRoleId: fresh.brokerRoleId || fresh.brokerRole?.id || "",
                brokerId: fresh.brokerId || fresh.broker?.id || "",
                productId: fresh.productId || "",
                originCountryId: fresh.originCountryId || "",
                shipmentMode: fresh.shipmentMode || "",
                originPort: fresh.originPort || "",
                destinationPort: fresh.destinationPort || "",
                podPort: fresh.destinationPort || fresh.podPort || fresh.podName || "",
                originState: fresh.originState || "",
                originCity: fresh.originCity || "",
                originZipCode: fresh.originZipCode || "",
                originStationCode: fresh.originStationCode || "",
                destinationCountry: fresh.destinationCountry || "",
                destinationState: fresh.destinationState || "",
                destinationCity: fresh.destinationCity || "",
                destinationZipCode: fresh.destinationZipCode || "",
                destinationStationCode: fresh.destinationStationCode || "",
                purity: fresh.purity || "",
                packingTypeId: fresh.packingTypeId || "",
                shipmentType: fresh.shipmentType || "",
                quantity: fresh.quantity != null && fresh.quantity !== "" ? parseFloat(String(fresh.quantity)) : "",
                shipmentDate: fresh.shipmentDate ? fresh.shipmentDate.split("T")[0] : "",
                buyingInterest: fresh.buyingInterest != null && fresh.buyingInterest !== "" ? parseFloat(String(fresh.buyingInterest)) : "",
                offerAmount: fresh.offerAmount != null && fresh.offerAmount !== "" ? parseInt(String(fresh.offerAmount), 10) : "",
                bidCurrency: fresh.bidCurrency || "",
                potentialEnquiry: fresh.potentialEnquiry || false,
                bidType: fresh.bidType || "TARGET",
                note: fresh.note || "",
                status: fresh.status || "",
                closureReason: fresh.closureReason || "",
                closureRemark: fresh.closureRemark || "",
                closedBy: fresh.closedBy || fresh.closedByUser?.id || "",
                closedByName: fresh.closedByName || fresh.closedByUser?.name || "",
                closedAt: fresh.closedAt || "",
                transportDetails: freshTransportDetails,
              };
              setForm(freshForm);
              setInitialFormState(freshForm);
              if (fresh.brokerName || fresh.broker?.entityName) {
                setSelectedBrokerName(fresh.brokerName || fresh.broker?.entityName);
              }
            }
          })
          .catch((e) => console.error("Error refreshing background enquiry", e));
      } else {
        setCreatedByName("");
        const emptyForm = {
          enquiryNo: "",
          enquiryDate: new Date().toISOString().split("T")[0],
          partnerRoleId: "",
          partnerId: "",
          partnerAnnualTurnover: null,
          brokerRoleId: "",
          brokerId: "",
          productId: "",
          originCountryId: "",
          shipmentMode: "",
          originPort: "",
          destinationPort: "",
          podPort: "",
          originState: "",
          originCity: "",
          originZipCode: "",
          originStationCode: "",
          destinationCountry: "",
          destinationState: "",
          destinationCity: "",
          destinationZipCode: "",
          destinationStationCode: "",
          purity: "",
          packingTypeId: "",
          shipmentType: "",
          quantity: "",
          shipmentDate: "",
          buyingInterest: "",
          offerAmount: "",
          bidCurrency: "",
          potentialEnquiry: false,
          bidType: "TARGET",
          note: "",
          transportDetails: createDefaultTransportDetails(shipmentTypes),
        };
        setForm(emptyForm);
        setInitialFormState(emptyForm);
        setSelectedBrokerName("");
        setBrokerSearch("");
        setBrokerOptions([]);
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
        setPartnerTurnoverHasMasterValue(Number(found.annualTurnover) > 0);
        if (!editData) {
          setForm((f) => ({ ...f, partnerAnnualTurnover: found.annualTurnover ?? null }));
        }
      } else if (!selectedPartnerName) {
        axiosClient.get(`/masters/partners/${form.partnerId}`).then((res) => {
          const partnerData = res.data?.data || res.data;
          if (partnerData?.entityName) {
            setSelectedPartnerName(partnerData.entityName);
          }
          setPartnerTurnoverHasMasterValue(Number(partnerData?.annualTurnover) > 0);
          if (!editData && partnerData?.annualTurnover !== undefined) {
            setForm((f) => ({ ...f, partnerAnnualTurnover: partnerData.annualTurnover ?? null }));
          }
        }).catch(() => { });
      }
    } else {
      setSelectedPartnerName("");
      setPartnerTurnoverHasMasterValue(false);
      if (!editData) {
        setForm((f) => ({ ...f, partnerAnnualTurnover: null }));
      }
    }
  }, [form.partnerId, partnerOptions, editData]);

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
  const brokerPartnerRoles = useMemo(() => {
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
      borderColor: errors.bidCurrency ? "#ef4444" : state.isFocused ? "#007aff" : "#e5e7eb",
      borderRadius: "0.5rem",
      fontSize: "12px",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(0, 122, 255, 0.15)" : "none",
      minHeight: "38px",
      height: "38px",
      backgroundColor: "white",
      "&:hover": { borderColor: errors.bidCurrency ? "#ef4444" : state.isFocused ? "#007aff" : "#d1d5db" },
    }),
    valueContainer: (base) => ({ ...base, padding: "0 0.75rem" }),
    indicatorsContainer: (base) => ({ ...base, height: "36px" }),
    dropdownIndicator: (base) => ({ ...base, padding: "0 0.5rem" }),
    clearIndicator: (base) => ({ ...base, padding: "0 0.25rem" }),
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

  const shipmentModeSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: errors.shipmentMode ? "#ef4444" : state.isFocused ? "#007aff" : "#e5e7eb",
      borderRadius: "0.5rem",
      fontSize: "12px",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(0, 122, 255, 0.15)" : "none",
      minHeight: "38px",
      height: "38px",
      backgroundColor: "white",
      "&:hover": { borderColor: errors.shipmentMode ? "#ef4444" : state.isFocused ? "#007aff" : "#d1d5db" },
    }),
    valueContainer: (base) => ({ ...base, padding: "0 0.75rem" }),
    indicatorsContainer: (base) => ({ ...base, height: "36px" }),
    dropdownIndicator: (base) => ({ ...base, padding: "0 0.5rem" }),
    clearIndicator: (base) => ({ ...base, padding: "0 0.25rem" }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#007aff" : state.isFocused ? "#f8fafc" : "white",
      color: state.isSelected ? "white" : "#334155",
      fontSize: "12px",
      cursor: "pointer",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  const handleShipmentModeChange = (val) => {
    setForm((f) => {
      const updated = { ...f, shipmentMode: val };
      if (val === "SHIP") {
        updated.originState = "";
        updated.originCity = "";
        updated.originZipCode = "";
        updated.originStationCode = "";
        updated.destinationState = "";
        updated.destinationCity = "";
        updated.destinationZipCode = "";
        updated.destinationStationCode = "";
      } else if (val === "ROAD") {
        updated.originPort = "";
        updated.destinationPort = "";
        updated.podPort = "";
        updated.originStationCode = "";
        updated.destinationStationCode = "";
      } else if (val === "RAIL") {
        updated.originPort = "";
        updated.destinationPort = "";
        updated.podPort = "";
        updated.originZipCode = "";
        updated.destinationZipCode = "";
      } else {
        updated.originPort = "";
        updated.destinationPort = "";
        updated.podPort = "";
        updated.originState = "";
        updated.originCity = "";
        updated.originZipCode = "";
        updated.originStationCode = "";
        updated.destinationState = "";
        updated.destinationCity = "";
        updated.destinationZipCode = "";
        updated.destinationStationCode = "";
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
    if (form.brokerRoleId && !form.brokerId) {
      newErrors.brokerId = "Partner is required when Broker Role is selected";
    }

    if (form.buyingInterest !== undefined && form.buyingInterest !== null && form.buyingInterest !== "") {
      if (Number(form.buyingInterest) < 0) {
        newErrors.buyingInterest = "Bid Amount must be positive";
      }
      if (!form.bidCurrency) {
        newErrors.bidCurrency = "Currency is required when Bid Amount is entered";
      }
    }

    if (form.offerAmount !== undefined && form.offerAmount !== null && form.offerAmount !== "") {
      const valStr = String(form.offerAmount).trim();
      const num = Number(valStr);
      if (isNaN(num) || !Number.isInteger(num) || valStr.includes(".") || num < 0 || !/^\d+$/.test(valStr)) {
        newErrors.offerAmount = "Offer must be a whole number (no decimals or negative values allowed)";
      }
      if (!form.bidCurrency) {
        newErrors.bidCurrency = "Currency is required when Offer is entered";
      }
    }

    if (form.transportDetails && Array.isArray(form.transportDetails) && form.transportDetails.length > 0) {
      for (let i = 0; i < form.transportDetails.length; i++) {
        const r = form.transportDetails[i];
        const parsedDestination = parseRouteLocation(r.destination || "");
        const destinationCountry = (r.destinationCountry || parsedDestination.country || "").trim();
        if (!r.origin?.trim() || !r.incoterm?.trim() || !destinationCountry) {
          newErrors.transportDetails = `Route #${i + 1} is incomplete. Place of Loading (POL), Incoterm, and Destination Country are required.`;
          break;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (notifyGroup = false) => {
    if (isViewMode) return;
    if (!validate()) return;

    setSavingType(notifyGroup ? "SAVE_NOTIFY" : "SAVE");
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        ...form,
        enquiryDate: form.enquiryDate ? new Date(form.enquiryDate).toISOString() : undefined,
        shipmentDate: form.shipmentDate ? new Date(form.shipmentDate).toISOString() : undefined,
        partnerRoleId: Number(form.partnerRoleId),
        partnerId: Number(form.partnerId),
        brokerRoleId: form.brokerRoleId ? Number(form.brokerRoleId) : null,
        brokerId: form.brokerId ? Number(form.brokerId) : null,
        productId: Number(form.productId),
        packingTypeId: form.packingTypeId ? Number(form.packingTypeId) : undefined,
        quantity: form.quantity ? Number(form.quantity) : undefined,
        buyingInterest: form.buyingInterest ? Number(form.buyingInterest) : undefined,
        offerAmount: form.offerAmount !== "" && form.offerAmount != null ? parseInt(String(form.offerAmount), 10) : null,
      };

      if (!payload.podPort) delete payload.podPort;
      if (!payload.purity) delete payload.purity;
      if (!payload.shipmentType) delete payload.shipmentType;
      if (!payload.shipmentDate) delete payload.shipmentDate;
      if (!payload.shipmentMode) delete payload.shipmentMode;
      delete payload.enquiryNo;
      delete payload.closedByName;

      [
        "status",
        "originCountryId",
        "originPort",
        "destinationPort",
        "originState",
        "originCity",
        "destinationCountry",
        "destinationState",
        "destinationCity",
        "originZipCode",
        "destinationZipCode",
        "originStationCode",
        "destinationStationCode",
        "bidCurrency",
        "bidType",
        "note",
        "closureReason",
        "closureRemark",
        "closedBy",
      ].forEach((field) => {
        if (payload[field] === "") delete payload[field];
      });

      if (payload.shipmentMode === "SHIP") {
        delete payload.originState;
        delete payload.originCity;
        delete payload.originZipCode;
        delete payload.originStationCode;
        delete payload.destinationState;
        delete payload.destinationCity;
        delete payload.destinationZipCode;
        delete payload.destinationStationCode;
      } else if (payload.shipmentMode === "ROAD") {
        delete payload.originPort;
        delete payload.destinationPort;
        delete payload.originStationCode;
        delete payload.destinationStationCode;
      } else if (payload.shipmentMode === "RAIL") {
        delete payload.originPort;
        delete payload.destinationPort;
        delete payload.originZipCode;
        delete payload.destinationZipCode;
      }

      if (!editData) {
        if (form.partnerAnnualTurnover !== undefined && form.partnerAnnualTurnover !== null && form.partnerAnnualTurnover !== "") {
          payload.partnerAnnualTurnover = Number(form.partnerAnnualTurnover);
        } else {
          payload.partnerAnnualTurnover = null;
        }
      } else {
        delete payload.partnerAnnualTurnover;
      }

      if (form.transportDetails && Array.isArray(form.transportDetails)) {
        payload.transportDetails = form.transportDetails
          .filter((r) => (r.origin && r.origin.trim()) || (r.incoterm && r.incoterm.trim()) || (r.destination && r.destination.trim()))
          .map((r, i) => {
            const parsedDestination = parseRouteLocation(r.destination || "");
            return {
              sequence: i + 1,
              origin: (r.origin || "").trim(),
              incoterm: (r.incoterm || "").trim(),
              destination: (r.destination || "").trim(),
              destinationCountry: (r.destinationCountry || parsedDestination.country || "").trim(),
              destinationCity: (r.destinationCity || parsedDestination.city || "").trim(),
              destinationPlace: (r.destinationPlace || parsedDestination.place || "").trim(),
              destinationZipCode: (r.destinationZipCode || parsedDestination.zipCode || "").trim(),
            };
          });

        const firstDest = payload.transportDetails.find((r) => r.destination)?.destination;
        if (firstDest) {
          const parsedFirstDest = parseRouteLocation(firstDest);
          payload.destinationCountry = parsedFirstDest.country || firstDest;
        }
      }

      if (notifyGroup) {
        payload.notifyGroup = true;
      }

      if (editData) {
        await enquiriesApi.update(editData.id, payload);
      } else {
        await enquiriesApi.create(payload);
      }

      if (notifyGroup) {
        setSavingType("SENDING");
        await new Promise((r) => setTimeout(r, 500));
        setSuccessMsg("Enquiry updated and notification sent.");
        await new Promise((r) => setTimeout(r, 1500));
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

      if (notifyGroup && err.response?.status === 200) {
        setError("Enquiry updated successfully. WhatsApp notification failed.");
      } else {
        setError(errMsg);
      }
    } finally {
      setSavingType(null);
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

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={handleClose}
        title={titleText}
        widthClass="w-full md:w-[64vw] md:min-w-[780px] lg:min-w-[900px]"
      >
        <div className="flex-1 overflow-y-auto bg-slate-50/70 p-5 sm:p-6 space-y-5">
          {/* Error Banner */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200/80 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-red-800">Error saving enquiry</h3>
                <p className="text-xs text-red-600 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-start gap-3">
              <div className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check className="h-3 w-3" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-emerald-800">Success</h3>
                <p className="text-xs text-emerald-700 mt-0.5">{successMsg}</p>
              </div>
            </div>
          )}

          {mastersLoading || currenciesLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white rounded-xl border border-gray-200/80">
              <Loader2 className="h-6 w-6 text-[#007aff] animate-spin" />
              <p className="text-xs text-gray-400 font-medium">Loading dropdown options...</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Closed enquiry summary */}
              {String(form.status || editData?.status || "").toUpperCase() === "CLOSED" && (
                <div className="flex flex-wrap items-center gap-y-1 rounded-lg border border-red-200/80 border-l-[3px] border-l-red-600 bg-red-50/90 px-3.5 py-2 text-xs text-gray-700">
                  <span className="mr-2 inline-block h-2 w-2 shrink-0 rounded-full bg-red-600" />
                  <span className="font-medium text-gray-600">Reason for Closure:</span>
                  <span className="ml-1.5 font-semibold text-gray-900">
                    {form.closureReason || editData?.closureReason || "N/A"}
                  </span>
                  <span className="mx-2.5 text-gray-300">|</span>
                  <span className="font-medium text-gray-700">
                    {formatClosedDate(form.closedAt || editData?.closedAt)}
                  </span>
                </div>
              )}

              {/* SECTION 1: Basic Information */}
              <div className={card}>
                <div className={cardHeader}>
                  <div className="h-6 w-6 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <FileText className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <h3 className="text-xs font-bold text-gray-800 tracking-tight">Basic Information</h3>
                </div>

                <div className="p-5 space-y-4">
                  {/* Metadata Row (Edit / View Mode) */}
                  {(editData || isViewMode) && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-gray-100">
                      {editData && (
                        <div>
                          <label className={lbl}>Enquiry No.</label>
                          <input
                            type="text"
                            value={form.enquiryNo}
                            disabled
                            className={`${readonlyInp} font-semibold text-gray-800`}
                          />
                        </div>
                      )}

                      <div>
                        <label className={lbl}>Business Ref No.</label>
                        <input
                          type="text"
                          value={editData?.businessReference || editData?.businessTransaction?.businessReference || "—"}
                          readOnly
                          className={`${readonlyInp} font-mono`}
                        />
                      </div>

                      <div>
                        <label className={lbl}>Created By</label>
                        <div className={`${readonlyInp} gap-2 text-gray-700`}>
                          <User className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">
                            {createdByName || editData?.createdByName || editData?.creator?.name || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Editable Basic Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={lbl}>
                        Enquiry Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={form.enquiryDate}
                        onChange={(e) => setForm((f) => ({ ...f, enquiryDate: e.target.value }))}
                        disabled={isViewMode}
                        className={`${inp} ${errors.enquiryDate ? "border-red-400" : ""}`}
                      />
                      {errors.enquiryDate && <p className={err}>{errors.enquiryDate}</p>}
                    </div>

                    <div>
                      <label className={lbl}>Shipment Mode</label>
                      <Select
                        options={SHIPMENT_MODE_OPTIONS}
                        value={SHIPMENT_MODE_OPTIONS.find((option) => option.value === form.shipmentMode) || null}
                        onChange={(option) => handleShipmentModeChange(option?.value || "")}
                        isDisabled={isViewMode}
                        isClearable
                        formatOptionLabel={(option) => (
                          <span className="flex items-center gap-2">
                            <option.Icon className="h-3.5 w-3.5 text-gray-500 shrink-0" aria-hidden="true" />
                            <span>{option.label}</span>
                          </span>
                        )}
                        styles={shipmentModeSelectStyles}
                        placeholder="Select Shipment Mode"
                        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                        menuPosition="fixed"
                        className="text-xs"
                      />
                      {errors.shipmentMode && <p className={err}>{errors.shipmentMode}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Logistics & Locations — hidden temporarily */}
              {false && (
                <div className={card}>
                  <div className={cardHeader}>
                    <div className="h-6 w-6 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <h3 className="text-xs font-bold text-gray-800 tracking-tight">Logistics & Locations</h3>
                  </div>

                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {form.shipmentMode === "SHIP" && (
                      <>
                        <div>
                          <label className={lbl}>Origin Country</label>
                          {isViewMode ? (
                            <div className={readonlyInp}>{form.originCountryId || "—"}</div>
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

                        <PortSelector
                          value={form.originPort}
                          onChange={(val) => setForm((f) => ({ ...f, originPort: val }))}
                          label="Origin Port (POL)"
                          placeholder="Search origin port..."
                          isView={isViewMode}
                          error={errors.originPort}
                          countryName={form.originCountryId}
                        />

                        <div className="col-span-full border-t border-dashed border-gray-100 my-1" />

                        <div>
                          <label className={lbl}>Destination Country</label>
                          {isViewMode ? (
                            <div className={readonlyInp}>{form.destinationCountry || "—"}</div>
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
                        <LocationHierarchy
                          prefix="origin"
                          form={form}
                          setForm={setForm}
                          errors={errors}
                          isView={isViewMode}
                          shipmentMode={form.shipmentMode}
                        />

                        <div className="col-span-full border-t border-dashed border-gray-100 my-1" />

                        <LocationHierarchy
                          prefix="destination"
                          form={form}
                          setForm={setForm}
                          errors={errors}
                          isView={isViewMode}
                          shipmentMode={form.shipmentMode}
                        />
                      </>
                    )}

                    {!form.shipmentMode && (
                      <div className="col-span-full flex items-center justify-center py-6 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        Select Shipment Mode above to configure origin and destination locations.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION 3: Commercial Specifications */}
              <div className={card}>
                <div className={cardHeader}>
                  <div className="h-6 w-6 rounded-md bg-orange-50 border border-orange-100 flex items-center justify-center">
                    <Package className="h-3.5 w-3.5 text-orange-600" />
                  </div>
                  <h3 className="text-xs font-bold text-gray-800 tracking-tight">Commercial Specifications</h3>
                </div>

                <div className="p-5 space-y-5">
                  {/* Row 1: Partner Info (3 equal columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Partner Role */}
                    <div>
                      <label className={lbl}>
                        Partner Role <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={form.partnerRoleId || ""}
                          onChange={(e) => {
                            const newRoleId = e.target.value ? Number(e.target.value) : "";
                            setForm((f) => ({
                              ...f,
                              partnerRoleId: newRoleId,
                              partnerId: "",
                              ...(!editData ? { partnerAnnualTurnover: null } : {}),
                            }));
                            setSelectedPartnerName("");
                            setPartnerTurnoverHasMasterValue(false);
                            setPartnerSearch("");
                          }}
                          disabled={isViewMode}
                          className={`${inp} appearance-none pr-8 ${errors.partnerRoleId ? "border-red-400" : ""}`}
                        >
                          <option value="">Select Role</option>
                          {partnerRoles.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      </div>
                      {errors.partnerRoleId && <p className={err}>{errors.partnerRoleId}</p>}
                    </div>

                    {/* Partner Custom Searchable Select */}
                    <div className="relative" ref={partnerDropdownRef}>
                      <label className={lbl}>
                        Partner <span className="text-red-500">*</span>
                      </label>
                      {isViewMode ? (
                        <div className={readonlyInp}>
                          <span className="truncate">{selectedPartnerName || "—"}</span>
                        </div>
                      ) : (
                        <div className="relative">
                          <button
                            type="button"
                            disabled={!form.partnerRoleId}
                            onClick={() => setIsPartnerOpen((prev) => !prev)}
                            className={`${inp} text-left flex items-center justify-between gap-2 cursor-pointer disabled:opacity-60 disabled:bg-slate-50 disabled:cursor-not-allowed ${errors.partnerId ? "border-red-400" : ""}`}
                          >
                            <span className={`truncate ${selectedPartnerName ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                              {!form.partnerRoleId
                                ? "Select Role first"
                                : selectedPartnerName || "Select Partner"}
                            </span>
                            <div className="flex items-center gap-1 shrink-0 text-gray-400">
                              {partnerLoading && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
                              <ChevronDown className="h-3.5 w-3.5" />
                            </div>
                          </button>

                          {isPartnerOpen && form.partnerRoleId && (
                            <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-2 space-y-2">
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

                              <div className="max-h-44 overflow-y-auto space-y-0.5">
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
                                        setForm((f) => ({
                                          ...f,
                                          partnerId: p.id,
                                          ...(!editData ? { partnerAnnualTurnover: p.annualTurnover ?? null } : {}),
                                        }));
                                        setSelectedPartnerName(p.entityName);
                                        setPartnerTurnoverHasMasterValue(Number(p.annualTurnover) > 0);
                                        setIsPartnerOpen(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${form.partnerId === p.id
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

                    {/* Annual Sales (Turnover) */}
                    <div>
                      <label className={lbl}>Annual Sales (Turnover)</label>
                      <input
                        type={partnerTurnoverHasMasterValue || editData || isViewMode ? "text" : "number"}
                        min="0"
                        step="any"
                        readOnly={!!editData || isViewMode || partnerTurnoverHasMasterValue}
                        disabled={!!editData || isViewMode || partnerTurnoverHasMasterValue}
                        tabIndex={editData || isViewMode || partnerTurnoverHasMasterValue ? -1 : undefined}
                        value={
                          (partnerTurnoverHasMasterValue || editData || isViewMode) &&
                            form.partnerAnnualTurnover !== null &&
                            form.partnerAnnualTurnover !== undefined &&
                            form.partnerAnnualTurnover !== "" &&
                            !isNaN(Number(form.partnerAnnualTurnover))
                            ? new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                              maximumFractionDigits: 2,
                            }).format(Number(form.partnerAnnualTurnover))
                            : form.partnerAnnualTurnover ?? ""
                        }
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            partnerAnnualTurnover: e.target.value,
                          }))
                        }
                        className={`${inp} ${partnerTurnoverHasMasterValue || editData || isViewMode
                            ? "bg-slate-50/90 text-gray-600 cursor-not-allowed select-none"
                            : "bg-white"
                          } font-medium`}
                        placeholder="Enter turnover"
                      />
                    </div>
                  </div>

                  {/* Row 2 & 3: Product & Cargo Specs (3 equal columns x 2 rows) */}
                  <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Product */}
                    <div>
                      <label className={lbl}>
                        Product <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={form.productId || ""}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, productId: e.target.value ? Number(e.target.value) : "" }))
                          }
                          disabled={isViewMode}
                          className={`${inp} appearance-none pr-8 ${errors.productId ? "border-red-400" : ""}`}
                        >
                          <option value="">Select Product</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
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
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      </div>
                    </div>

                    {/* Packing Type */}
                    <div>
                      <label className={lbl}>Packing Type</label>
                      <div className="relative">
                        <select
                          value={form.packingTypeId || ""}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              packingTypeId: e.target.value ? Number(e.target.value) : "",
                            }))
                          }
                          disabled={isViewMode}
                          className={`${inp} appearance-none pr-8`}
                        >
                          <option value="">Select Packing Type</option>
                          {packingTypes.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
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
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      </div>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className={lbl}>Quantity (MT)</label>
                      {isViewMode ? (
                        <div className={readonlyInp}>
                          {form.quantity !== "" && form.quantity != null
                            ? Number(form.quantity).toLocaleString("en-IN")
                            : "—"}
                        </div>
                      ) : (
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={form.quantity !== "" && form.quantity != null ? parseFloat(String(form.quantity)) : ""}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, quantity: e.target.value ? parseFloat(e.target.value) : "" }))
                          }
                          disabled={isViewMode}
                          placeholder="0"
                          className={inp}
                        />
                      )}
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
                  </div>
                </div>
              </div>

              {/* SECTION 4: Price Details */}
              <div className={card}>
                <div className={cardHeader}>
                  <div className="h-6 w-6 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <h3 className="text-xs font-bold text-gray-800 tracking-tight">Price Details</h3>
                </div>

                <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                  {/* Offer Price */}
                  <div>
                    <div className="h-6 flex items-center mb-1.5">
                      <label className="text-[11px] font-semibold text-gray-600 leading-none">Offer Price</label>
                    </div>
                    {isViewMode ? (
                      <div className={readonlyInp}>
                        {form.offerAmount !== "" && form.offerAmount != null
                          ? `${Number(form.offerAmount).toLocaleString("en-US")} ${form.bidCurrency || "USD"}`
                          : "—"}
                      </div>
                    ) : (
                      <input
                        type="text"
                        inputMode="numeric"
                        value={form.offerAmount !== "" && form.offerAmount != null ? form.offerAmount : ""}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          if (val === "" || /^\d+$/.test(val)) {
                            setForm((f) => ({ ...f, offerAmount: val }));
                            if (errors.offerAmount) {
                              setErrors((prev) => ({ ...prev, offerAmount: undefined }));
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          if (["e", "E", "+", "-", "."].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        placeholder="0"
                        disabled={isViewMode}
                        className={`${inp} ${errors.offerAmount ? "border-red-400" : ""}`}
                      />
                    )}
                    {errors.offerAmount && <p className={err}>{errors.offerAmount}</p>}
                  </div>

                  {/* Target / Bid Amount */}
                  <div>
                    <div className="h-6 flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-gray-600 leading-none">
                        {form.bidType === "BID" ? "Bid Amount" : "Target Price"}
                      </span>
                      <div className="inline-flex rounded-md border border-gray-200 bg-gray-50 p-0.5 text-[10px] font-semibold">
                        <button
                          type="button"
                          disabled={isViewMode}
                          onClick={() => setForm((f) => ({ ...f, bidType: "TARGET" }))}
                          className={`px-2 py-0.5 rounded-[4px] transition-all cursor-pointer disabled:cursor-default ${form.bidType === "TARGET" || !form.bidType
                              ? "bg-[#007aff] text-white shadow-xs"
                              : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                          Target
                        </button>
                        <button
                          type="button"
                          disabled={isViewMode}
                          onClick={() => setForm((f) => ({ ...f, bidType: "BID" }))}
                          className={`px-2 py-0.5 rounded-[4px] transition-all cursor-pointer disabled:cursor-default ${form.bidType === "BID"
                              ? "bg-[#007aff] text-white shadow-xs"
                              : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                          Bid
                        </button>
                      </div>
                    </div>
                    {isViewMode ? (
                      <div className={readonlyInp}>
                        {form.buyingInterest !== "" && form.buyingInterest != null
                          ? `${Math.round(Number(form.buyingInterest)).toLocaleString("en-US")} ${form.bidCurrency || "USD"}`
                          : "—"}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={
                          form.buyingInterest !== "" && form.buyingInterest != null
                            ? typeof form.buyingInterest === "number"
                              ? String(parseFloat(form.buyingInterest.toString()))
                              : form.buyingInterest
                            : ""
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || (/^\d*\.?\d{0,4}$/.test(val) && val.length <= 15)) {
                            setForm((f) => ({ ...f, buyingInterest: val }));
                          }
                        }}
                        placeholder="0.00"
                        disabled={isViewMode}
                        className={`${inp} ${errors.buyingInterest ? "border-red-400" : ""}`}
                      />
                    )}
                    {errors.buyingInterest && <p className={err}>{errors.buyingInterest}</p>}
                  </div>

                  {/* Bid Currency */}
                  <div>
                    <div className="h-6 flex items-center mb-1.5">
                      <label className="text-[11px] font-semibold text-gray-600 leading-none">Currency</label>
                    </div>
                    {isViewMode ? (
                      <div className={readonlyInp}>{form.bidCurrency || "—"}</div>
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
                </div>
              </div>

              {/* SECTION 5: Transport Details */}
              <div className={card}>
                <div className={cardHeader}>
                  <div className="h-6 w-6 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <Route className="h-3.5 w-3.5 text-indigo-600" />
                  </div>
                  <h3 className="text-xs font-bold text-gray-800 tracking-tight">Transport Details</h3>
                </div>
                <div className="p-5">
                  <TransportDetailsGrid
                    routes={form.transportDetails || []}
                    onChange={(updated) => {
                      const firstDest = updated.find((r) => r.destination && r.destination.trim())?.destination || "";
                      const parsedFirstDest = parseRouteLocation(firstDest);
                      setForm((f) => ({
                        ...f,
                        transportDetails: updated,
                        destinationCountry: parsedFirstDest.country || f.destinationCountry,
                      }));
                    }}
                    shipmentTypes={shipmentTypes}
                    isView={isViewMode}
                    error={errors.transportDetails}
                  />
                </div>
              </div>

              {/* SECTION 6: Broker & Additional Notes */}
              <div className={card}>
                <div className={cardHeader}>
                  <div className="h-6 w-6 rounded-md bg-violet-50 border border-violet-100 flex items-center justify-center">
                    <Briefcase className="h-3.5 w-3.5 text-violet-600" />
                  </div>
                  <h3 className="text-xs font-bold text-gray-800 tracking-tight">Broker & Additional Notes</h3>
                </div>

                <div className="p-5 space-y-5">
                  {/* Broker Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Broker Partner Role */}
                    <div>
                      <label className={lbl}>Broker Role</label>
                      <div className="relative">
                        <select
                          value={form.brokerRoleId || ""}
                          onChange={(e) => {
                            const newRoleId = e.target.value ? Number(e.target.value) : "";
                            setForm((f) => ({ ...f, brokerRoleId: newRoleId, brokerId: "" }));
                            setSelectedBrokerName("");
                            setBrokerSearch("");
                          }}
                          disabled={isViewMode}
                          className={`${inp} appearance-none pr-8 ${errors.brokerRoleId ? "border-red-400" : ""}`}
                        >
                          <option value="">Select Role</option>
                          {brokerPartnerRoles.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      </div>
                      {errors.brokerRoleId && <p className={err}>{errors.brokerRoleId}</p>}
                    </div>

                    {/* Broker Partner Custom Searchable Select */}
                    <div className="relative" ref={brokerDropdownRef}>
                      <label className={lbl}>Broker Partner</label>
                      {isViewMode ? (
                        <div className={readonlyInp}>
                          <span className="truncate">{selectedBrokerName || "—"}</span>
                        </div>
                      ) : (
                        <div className="relative">
                          <button
                            type="button"
                            disabled={!form.brokerRoleId}
                            onClick={() => setIsBrokerOpen((prev) => !prev)}
                            className={`${inp} text-left flex items-center justify-between gap-2 cursor-pointer disabled:opacity-60 disabled:bg-slate-50 disabled:cursor-not-allowed ${errors.brokerId ? "border-red-400" : ""}`}
                          >
                            <span className={`truncate ${selectedBrokerName ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                              {!form.brokerRoleId
                                ? "Select Role first"
                                : selectedBrokerName || "Select Partner"}
                            </span>
                            <div className="flex items-center gap-1 shrink-0 text-gray-400">
                              {brokerLoading && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
                              <ChevronDown className="h-3.5 w-3.5" />
                            </div>
                          </button>

                          {isBrokerOpen && form.brokerRoleId && (
                            <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-2 space-y-2">
                              <div className="relative flex items-center">
                                <Search className="absolute left-2.5 h-3.5 w-3.5 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Search partner..."
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

                              <div className="max-h-44 overflow-y-auto space-y-0.5">
                                {brokerLoading && brokerOptions.length === 0 ? (
                                  <div className="p-3 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                                    <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                                    Loading...
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
                                      className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${form.brokerId === p.id
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
                      {errors.brokerId && <p className={err}>{errors.brokerId}</p>}
                    </div>
                  </div>

                  {/* Note */}
                  <div className="pt-4 border-t border-gray-100">
                    <label className={lbl}>Note</label>
                    {isViewMode ? (
                      <div className="w-full px-3 py-2.5 text-xs border border-gray-200/80 rounded-lg bg-slate-50/90 text-gray-700 min-h-[76px] whitespace-pre-wrap">
                        {form.note || "—"}
                      </div>
                    ) : (
                      <textarea
                        value={form.note || ""}
                        onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                        placeholder="Add any relevant notes for this enquiry..."
                        rows={3}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007aff]/15 focus:border-[#007aff] bg-white text-gray-800 placeholder:text-gray-400 resize-none transition-all"
                      />
                    )}
                  </div>

                  {/* Mark as High Potential */}
                  <div className="pt-1">
                    <label className="inline-flex items-center gap-2.5 cursor-pointer group select-none">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={form.potentialEnquiry}
                          onChange={(e) => setForm((f) => ({ ...f, potentialEnquiry: e.target.checked }))}
                          disabled={isViewMode}
                          className="peer sr-only"
                        />
                        <div className="w-4 h-4 border-2 border-gray-300 rounded bg-white transition-all peer-checked:bg-[#007aff] peer-checked:border-[#007aff] group-hover:border-[#007aff]" />
                        <svg
                          className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                          viewBox="0 0 14 10"
                          fill="none"
                        >
                          <path
                            d="M1 5L4.5 8.5L13 1"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
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
          <div className="px-6 py-3.5 border-t border-gray-200/80 bg-white flex items-center justify-end gap-2.5 shrink-0">
            <button
              onClick={handleClose}
              disabled={!!savingType}
              className="h-9 px-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg text-xs hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={!!savingType || mastersLoading}
              className="h-9 px-4 bg-[#007aff] hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 text-xs font-semibold shadow-xs cursor-pointer transition-colors disabled:opacity-50"
            >
              {savingType === "SAVE" ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" /> Save Enquiry
                </>
              )}
            </button>
            {editData && hasPermission("notification:send") && (
              <button
                onClick={() => handleSave(true)}
                disabled={!!savingType || mastersLoading}
                className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 text-xs font-semibold shadow-xs cursor-pointer transition-colors disabled:opacity-50"
              >
                {savingType === "SAVE_NOTIFY" ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                  </>
                ) : savingType === "SENDING" ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending WhatsApp...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" /> Save & Notify
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </Drawer>

      {/* Discard changes dialog */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-[110] overflow-hidden flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-xs"
            onClick={() => setShowDiscardConfirm(false)}
          />
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 relative w-full max-w-sm z-10 space-y-4">
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
                className="px-3.5 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDiscardConfirm(false);
                  onClose();
                }}
                className="px-3.5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer"
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