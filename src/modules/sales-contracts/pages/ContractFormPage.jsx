"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { selectActiveCompany } from "@/store/slices/companyContextSlice";
import { useSalesMasters } from "../hooks/useSalesContracts";
import { salesContractApi } from "../services/salesContractApi";
import { enquiryApi } from "@/modules/enquiries/services/enquiryApi";
import { enquiriesApi } from "@/modules/enquiries/services/enquiriesApi";
import { getCurrentFinancialYear, getFinancialYearForDate } from "../utils/dateUtils";
import { cleanNumberValue, formatNumberDisplay } from "../utils/formatUtils";
import { isDivisible } from "../utils/scheduleUtils";
import { getContractTransportMode } from "../utils/quantityUtils";
import HeaderSection from "../components/HeaderSection";
import PartySection from "../components/PartySection";
import CommercialSection from "../components/CommercialSection";
import ItemsTable from "../components/ItemsTable";
import ShipmentTable from "../components/ShipmentTable";
import DocumentSection from "../components/DocumentSection";
import RemarksSection, { DEFAULT_CONTRACT_NOTE } from "../components/RemarksSection";
import TermsSection from "../components/TermsSection";
import OtherConditionsSection, { DEFAULT_OTHER_CONDITIONS } from "../components/OtherConditionsSection";
import DisputeResolutionSection from "../components/DisputeResolutionSection";
import ForceMajeureSection from "../components/ForceMajeureSection";
import ContractAcceptanceSection from "../components/ContractAcceptanceSection";
import BusinessReference from "@/components/common/BusinessReference";

const defaultForm = () => ({
  enquiryId: null,
  financialYear: getCurrentFinancialYear(),
  contractNumber: "",
  businessReference: "",
  contractDate: "",
  contractType: "Export",
  buyerId: "",
  buyer: null,
  sellerId: null,
  brokerId: null,
  currencyCode: "",
  shipmentTypeId: "",
  paymentTermId: "",
  originCountry: "",
  destinationCountry: "",
  destinationSelectionMode: "enquiry",
  enquiryDestination: "",
  // Multi-Modal Transport Routing
  originTransportMode: "sea",
  destinationTransportMode: "sea",
  originLocationName: "",
  destinationLocationName: "",
  // Legacy fields kept for backward compat (not used in new contracts)
  portOfLoading: "",
  portOfDischarge: "",
  remarks: DEFAULT_CONTRACT_NOTE,
  terms: [],
  otherConditions: [...DEFAULT_OTHER_CONDITIONS],
  disputeResolution: null,
  forceMajeure: null,
  sellerCompanyName: "",
  sellerAuthorizedSignatory: "",
  sellerSignature: "",
  sellerCompanySeal: "",
  buyerCompanyName: "",
  buyerAuthorizedSignatory: "",
  buyerSignature: "",
  buyerCompanySeal: "",
  numShipments: 1,
  items: [],
  shipments: [],
  documents: [],
  transportDetails: [],
  printOverrides: {},
});

function getEnquiryDestination(enquiry, savedDestinations = []) {
  if (!enquiry) return "";
  const responseDestination =
    typeof enquiry.enquiryDestination === "string"
      ? enquiry.enquiryDestination.trim()
      : "";
  if (responseDestination) return responseDestination;

  const defaultRoute = Array.isArray(enquiry.transportDetails)
    ? [...enquiry.transportDetails].sort(
      (a, b) => Number(a.sequence ?? 1) - Number(b.sequence ?? 1)
    )[0]
    : null;
  const routeDestination =
    typeof defaultRoute?.destination === "string"
      ? defaultRoute.destination.trim()
      : "";
  if (routeDestination) return routeDestination;

  const savedDestination = (Array.isArray(savedDestinations) ? savedDestinations : []).find(
    (destination) => typeof destination === "string" && destination.trim()
  );
  if (savedDestination) return savedDestination;
  if (enquiry.shipmentMode === "SHIP") {
    return enquiry.destinationPort || enquiry.podPort || "";
  }
  const city = [enquiry.destinationCity, enquiry.destinationZipCode]
    .filter(Boolean)
    .join(" ");
  return (
    [city, enquiry.destinationState, enquiry.destinationCountry]
      .filter(Boolean)
      .join(", ") ||
    enquiry.destinationPort ||
    enquiry.podPort ||
    ""
  );
}

function validate(form, isAutoNumber) {
  const e = {};
  const isSeaFreight = getContractTransportMode(form) === "SEA";
  if (!form.financialYear) e.financialYear = "Financial Year is required";
  // For auto-generated sellers, contractNumber is not required from user
  if (!isAutoNumber && !form.contractNumber?.trim()) e.contractNumber = "Contract No. is required";
  if (!form.contractDate) e.contractDate = "Contract Date is required";
  if (!form.buyerId) e.buyerId = "Buyer is required";
  // Commercial Details fields are optional (not required)

  if (!form.items || form.items.length === 0) {
    e.items = "At least one product item is required";
  } else {
    const itemErrors = [];
    form.items.forEach((item, idx) => {
      const rowErrors = [];
      if (!item.productId) rowErrors.push("Product");
      if (!item.bagTypeId) rowErrors.push("Bag Type");
      if (!item.packingTypeId) rowErrors.push("Packing Type");
      if (!item.quality?.trim()) rowErrors.push("Quality");
      if (!item.qtyPerCount || parseFloat(item.qtyPerCount) <= 0) rowErrors.push("Qty Per Count");
      if (isSeaFreight && !item.containerType) rowErrors.push("Container Type");
      if (!item.quantity || parseFloat(item.quantity) <= 0) rowErrors.push("Quantity");
      if (item.quantity && item.qtyPerCount && parseFloat(item.qtyPerCount) > 0 && !isDivisible(item.quantity, item.qtyPerCount)) {
        rowErrors.push(`Product Quantity (${item.quantity} MT) is not divisible by Qty Per Count (${item.qtyPerCount} MT). Product Quantity must be an exact multiple of Qty Per Count.`);
      }
      if (!item.unitPrice || parseFloat(item.unitPrice) <= 0) rowErrors.push("Unit Price");
      if (rowErrors.length > 0) itemErrors.push(`Item ${idx + 1}: ${rowErrors.join(", ")} required`);
    });
    if (itemErrors.length > 0) e.items = itemErrors.join(" · ");
  }
  const totalProductQty = (form.items || []).reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
  const totalShipmentQty = (form.shipments || []).reduce((sum, s) => sum + (parseFloat(s.quantity) || 0), 0);

  const hasDivisibilityError = (form.items || []).some(
    (item) =>
      parseFloat(item.quantity) > 0 &&
      parseFloat(item.qtyPerCount) > 0 &&
      !isDivisible(item.quantity, item.qtyPerCount)
  );

  // Suppress duplicate shipment errors when divisibility error is active
  if (!hasDivisibilityError) {
    const shipmentCount = parseInt(form.numShipments, 10);

    if (!shipmentCount || shipmentCount < 1) {
      e.shipments = "Shipment count cannot be less than 1";
    } else if (!form.shipments || form.shipments.length === 0) {
      e.shipments = "At least one shipment is required";
    } else {
      const hasNegativeQty = form.shipments.some(s => parseFloat(s.quantity) < 0);
      const hasInvalidContainers = form.shipments.some(s => s.noOfContainers === "" || s.noOfContainers === null || parseInt(s.noOfContainers, 10) < 1);
      const missingDate = form.shipments.some(s => !s.shipmentDate);

      if (hasNegativeQty) {
        e.shipments = "Shipment quantity cannot be negative";
      } else if (hasInvalidContainers) {
        e.shipments = "Every shipment must have at least 1 container";
      } else if (missingDate) {
        e.shipments = "Shipment date is required for all shipments";
      } else if (totalProductQty > 0 && Math.abs(totalShipmentQty - totalProductQty) > 0.001) {
        e.shipments = `Shipment Quantity Total (${formatNumberDisplay(totalShipmentQty)} MT) does not match Product Quantity (${formatNumberDisplay(totalProductQty)} MT).`;
      }
    }
  }

  if (form.transportDetails && Array.isArray(form.transportDetails) && form.transportDetails.length > 0) {
    for (let i = 0; i < form.transportDetails.length; i++) {
      const r = form.transportDetails[i];
      if (!r.origin?.trim() || !r.incoterm?.trim() || !r.destination?.trim()) {
        e.transportDetails = `Transport Route #${i + 1} is incomplete. Origin, Incoterm, and Destination are all required.`;
        break;
      }
    }
  }

  return e;
}

export default function ContractFormPage({ editId, viewId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const enquiryId = searchParams ? searchParams.get("enquiryId") : null;
  const activeCompany = useSelector(selectActiveCompany);
  const { masters, loading: mastersLoading } = useSalesMasters();
  const [form, setForm] = useState(defaultForm());
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loadingContract, setLoadingContract] = useState(false);
  const [pageError, setPageError] = useState(null);
  const [uploadedDocIds, setUploadedDocIds] = useState([]);

  // Auto contract number state
  const [contractNumberPreview, setContractNumberPreview] = useState(undefined);
  const [isLoadingContractNumber, setIsLoadingContractNumber] = useState(false);
  // Whether the currently selected seller uses auto-number generation
  const [isAutoNumber, setIsAutoNumber] = useState(false);

  const isEdit = !!editId;
  const isView = !!viewId && !editId;
  const contractId = editId || viewId;

  // Handle contract date change: update shipment dates if user hasn't manually customized them
  const handleContractDateChange = (newDate) => {
    setForm((f) => {
      const oldDate = f.contractDate;
      const updatedShipments = (f.shipments || []).map((s) => {
        if (!s.isDateCustomized && (s.shipmentDate === oldDate || !s.shipmentDate)) {
          return { ...s, shipmentDate: newDate };
        }
        return s;
      });
      return {
        ...f,
        contractDate: newDate,
        shipments: updatedShipments,
      };
    });
  };

  // Load existing contract for edit/view
  useEffect(() => {
    if (!contractId) return;
    const load = async () => {
      setLoadingContract(true);
      try {
        const res = await salesContractApi.getOne(contractId);
        const c = res.data;
        const [linkedEnquiry, savedEnquiryDestinations] = c.enquiryId
          ? await Promise.all([
            enquiryApi.getOne(c.enquiryId),
            enquiriesApi.getDestinations(c.enquiryId),
          ])
          : [null, []];
        const legacyEnquiryDestination =
          Boolean(c.enquiryId) &&
          c.destinationSelectionMode === "select" &&
          !c.enquiryDestination;
        const destinationSelectionMode =
          legacyEnquiryDestination
            ? "enquiry"
            : c.destinationSelectionMode || (c.enquiryId ? "enquiry" : "select");
        setForm({
          enquiryId: c.enquiryId || null,
          // financialYear is now a plain string from the server
          financialYear: c.financialYear || getCurrentFinancialYear(),
          contractNumber: c.contractNumber || "",
          businessReference: c.businessTransaction?.businessReference || c.businessReference || "",
          contractDate: c.contractDate ? c.contractDate.split("T")[0] : "",
          contractType: c.contractType || "Export",
          buyerId: c.buyerId || "",
          buyer: c.buyer || null,
          sellerId: c.sellerId || null,
          brokerId: c.brokerId || null,
          currencyCode: c.currencyCode || "",
          shipmentTypeId: c.shipmentTypeId || "",
          paymentTermId: c.paymentTermId || "",
          originCountry: c.originCountry || "",
          destinationCountry: c.destinationCountry || "",
          destinationSelectionMode,
          enquiryDestination:
            c.enquiryDestination ||
            (destinationSelectionMode === "enquiry"
              ? getEnquiryDestination(
                linkedEnquiry?.data || linkedEnquiry,
                savedEnquiryDestinations
              ) ||
              c.destinationLocationName ||
              c.portOfDischarge ||
              ""
              : ""),
          // Multi-Modal Transport Routing
          originTransportMode: c.originTransportMode || c.transportMode || "sea",
          destinationTransportMode: c.destinationTransportMode || c.transportMode || "sea",
          originLocationName:
            c.originLocationName || c.portOfLoading || "",
          destinationLocationName:
            c.destinationLocationName || c.portOfDischarge || "",
          // Keep legacy fields as-is for older records
          portOfLoading: c.portOfLoading || "",
          portOfDischarge: c.portOfDischarge || "",
          remarks: c.remarks || "",
          terms: Array.isArray(c.terms) ? c.terms : [],
          otherConditions: Array.isArray(c.otherConditions) ? c.otherConditions : [],
          disputeResolution: c.disputeResolution || null,
          forceMajeure: c.forceMajeure || null,
          sellerCompanyName: c.sellerCompanyName || "",
          sellerAuthorizedSignatory: c.sellerAuthorizedSignatory || "",
          sellerSignature: c.sellerSignature || "",
          sellerCompanySeal: c.sellerCompanySeal || "",
          buyerCompanyName: c.buyerCompanyName || "",
          buyerAuthorizedSignatory: c.buyerAuthorizedSignatory || "",
          buyerSignature: c.buyerSignature || "",
          buyerCompanySeal: c.buyerCompanySeal || "",
          numShipments: c.shipments?.length || 1,
          items: (c.items || []).map((item, idx) => {
            const overrideQuality =
              (c.printOverrides?.[`quality_${idx}`] !== undefined && c.printOverrides?.[`quality_${idx}`] !== null && String(c.printOverrides?.[`quality_${idx}`]).trim() !== "")
                ? String(c.printOverrides[`quality_${idx}`]).trim()
                : (idx === 0 && c.printOverrides?.quality_0 !== undefined && c.printOverrides?.quality_0 !== null && String(c.printOverrides?.quality_0).trim() !== "")
                  ? String(c.printOverrides.quality_0).trim()
                  : null;

            const resolvedQuality =
              (item.quality && String(item.quality).trim() !== "")
                ? String(item.quality).trim()
                : (overrideQuality ||
                  [item.product?.qualitySubType, item.product?.specification, item.productQuality, c.quality]
                    .filter(Boolean)
                    .join(" - ") ||
                  c.enquiry?.purity ||
                  "");

            return {
              id: item.id,
              productId: item.productId || "",
              origin: item.origin || item.originCountry || "",
              quality: resolvedQuality,
              marking: item.marking || (idx === 0 ? c.printOverrides?.marking_0 : c.printOverrides?.[`marking_${idx}`]) || "",
              bagTypeId: item.bagTypeId || "",
              packingTypeId: item.packingTypeId || "",
              bagSpecificationId: item.bagSpecificationId || null,
              qtyPerCount: cleanNumberValue(item.qtyPerCount),
              containerType: item.containerType || "40 FT",
              quantity: cleanNumberValue(item.quantity),
              unitPrice: cleanNumberValue(item.unitPrice),
              amount: cleanNumberValue(item.amount) || 0,
              remarks: item.remarks || "",
            };
          }),
          shipments: (c.shipments || []).map((s, i) => ({
            id: s.id,
            shipmentNo: s.shipmentNo || i + 1,
            shipmentDate: s.shipmentDate ? s.shipmentDate.split("T")[0] : "",
            quantity: cleanNumberValue(s.quantity),
            noOfContainers: s.noOfContainers != null && s.noOfContainers !== "" ? Math.max(1, parseInt(s.noOfContainers, 10)) : 1,
            ratePerMt: cleanNumberValue(s.ratePerMt),
            // Normalize to Contract Currency — discard any row-level divergence from older data
            currencyCode: c.currencyCode || "",
            purchaseRate: cleanNumberValue(s.purchaseRate),
            forex: cleanNumberValue(s.forex),
            freight: cleanNumberValue(s.freight),
            remarks: s.remarks || "",
          })),
          documents: (c.documents || []).map(d => ({
            id: d.id,
            tradeDocumentId: d.tradeDocumentId,
            isMandatory: d.isMandatory || false,
            remarks: d.remarks || "",
          })),
          transportDetails: c.transportDetails || [],
          printOverrides: c.printOverrides || {},
        });

      } catch (err) {
        setPageError("Failed to load contract details.");
      } finally {
        setLoadingContract(false);
      }
    };
    load();
  }, [contractId]);

  /**
   * Fetch the next auto-generated contract number from the backend.
   * Only triggered when: seller is selected, buyer is selected, FY is selected, and we are in CREATE mode.
   * Prefix = <BuyerInitial><SellerCode> — so both buyer and seller are needed.
   * On edit/view — the contract number is already known and must not change.
   */
  const fetchContractNumberPreview = useCallback(async (sellerId, buyerId, financialYear) => {
    if (!sellerId || !buyerId || !financialYear || isEdit || isView) {
      setContractNumberPreview(undefined);
      setIsAutoNumber(false);
      return;
    }
    setIsLoadingContractNumber(true);
    try {
      const res = await salesContractApi.getNextContractNumber(sellerId, buyerId, financialYear);
      const contractNo = res.data?.contractNo;
      if (contractNo) {
        // Auto-number seller
        setContractNumberPreview(contractNo);
        setIsAutoNumber(true);
        // Clear any manually typed contract number
        setForm(f => ({ ...f, contractNumber: "" }));
      } else {
        // Regular seller — manual entry
        setContractNumberPreview(undefined);
        setIsAutoNumber(false);
      }
    } catch (err) {
      // Silently fail — user can still type manually
      setContractNumberPreview(undefined);
      setIsAutoNumber(false);
    } finally {
      setIsLoadingContractNumber(false);
    }
  }, [isEdit, isView]);

  // When seller, buyer, or financialYear changes in CREATE mode, fetch the next contract number
  useEffect(() => {
    if (!isEdit && !isView) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchContractNumberPreview(form.sellerId, form.buyerId, form.financialYear);
    }
  }, [form.sellerId, form.buyerId, form.financialYear, isEdit, isView, fetchContractNumberPreview]);

  // Auto-fill from Enquiry (Create mode only)
  useEffect(() => {
    if (!enquiryId || isEdit || isView) return;

    const fillFromEnquiry = async () => {
      try {
        const res = await enquiryApi.getOne(enquiryId);
        const eq = res.data;
        if (!eq) return;

        // Resolve the seller using enquiry data first, then the active workspace.
        let matchedSellerId = null;
        const sellerId = eq.sellerId || eq.seller?.id;
        const sellers = masters.sellers || [];
        if (sellerId) {
          matchedSellerId = Number(sellerId);
        } else {
          const sellerNames = [
            eq.sellerCompany,
            eq.company?.legalName,
            eq.company?.name,
            activeCompany?.legalName,
            activeCompany?.name,
          ]
            .filter(Boolean)
            .map(name => name.trim().toLowerCase());
          const foundSeller =
            sellerNames
              .map(name => sellers.find(
                seller => seller.entityName?.trim().toLowerCase() === name
              ))
              .find(Boolean) ||
            sellerNames
              .map(name => sellers.find((seller) => {
                const entityName = seller.entityName?.trim().toLowerCase();
                return entityName && (entityName.startsWith(name) || name.startsWith(entityName));
              }))
              .find(Boolean);
          if (foundSeller) matchedSellerId = foundSeller.id;
        }

        const matchedBrokerId = eq.brokerId || eq.broker?.id || null;

        // Auto-match Shipment Type (Incoterms) by name or code from Enquiry's Transport Details or fields
        let matchedShipmentTypeId = "";
        const enquiryIncotermCandidate =
          eq.transportDetails?.[0]?.incoterm ||
          eq.incoterm ||
          eq.shipmentTerms ||
          eq.shipmentType ||
          "";

        if (enquiryIncotermCandidate && masters.shipmentTypes) {
          const cand = enquiryIncotermCandidate.trim().toLowerCase();
          const foundSt = masters.shipmentTypes.find(
            (st) =>
              (st.code && st.code.toLowerCase() === cand) ||
              (st.name && st.name.toLowerCase() === cand) ||
              (st.code && cand.includes(st.code.toLowerCase())) ||
              (st.name && cand.includes(st.name.toLowerCase()))
          );
          if (foundSt) matchedShipmentTypeId = foundSt.id;
        }

        // Auto-match Payment Terms by name
        let matchedPaymentTermId = "";
        if (eq.paymentTerms && masters.paymentTerms) {
          const ptLower = eq.paymentTerms.trim().toLowerCase();
          const foundPt = masters.paymentTerms.find(
            pt => pt.name && pt.name.toLowerCase() === ptLower
          );
          if (foundPt) matchedPaymentTermId = foundPt.id;
        }

        // Currency from Enquiry
        const enquiryCurrency = eq.currency || "";

        // Contract Date: default to today
        const todayStr = new Date().toISOString().split("T")[0];

        // Map product items from Enquiry
        let mappedItems = [];
        if (eq.items && eq.items.length > 0) {
          mappedItems = eq.items.map(item => {
            let matchedBagTypeId = "";
            if (item.bagType && masters.bagTypes) {
              const btLower = item.bagType.trim().toLowerCase();
              const foundBt = masters.bagTypes.find(
                b => b.name && b.name.toLowerCase() === btLower
              );
              if (foundBt) matchedBagTypeId = foundBt.id;
            }

            let matchedPackingTypeId = "";
            if (item.packingType && masters.packingTypes) {
              const ptLower = item.packingType.trim().toLowerCase();
              const foundPt = masters.packingTypes.find(
                p => p.name && p.name.toLowerCase() === ptLower
              );
              if (foundPt) matchedPackingTypeId = foundPt.id;
            }

            const itemQty = parseFloat(item.quantity) || 0;
            const itemRate = parseFloat(item.targetPrice) || 0;
            const itemAmount = parseFloat((itemQty * itemRate).toFixed(2));

            // Default qtyPerCount to product-level container capacity or fallback to itemQty
            const matchedProduct = masters.products?.find(p => p.id === (item.productId ? Number(item.productId) : null));
            const defaultQtyPerCount = parseFloat(matchedProduct?.qty20ftContainer) || parseFloat(matchedProduct?.qty40ftContainer) || itemQty || "";

            return {
              productId: item.productId ? Number(item.productId) : "",
              origin: item.countryOfOrigin || eq.originCountry || "",
              quality: [item.qualitySubType, item.specification].filter(Boolean).join(" - ") || "",
              marking: "",
              bagTypeId: matchedBagTypeId,
              packingTypeId: matchedPackingTypeId,
              bagSpecificationId: null,
              qtyPerCount: cleanNumberValue(defaultQtyPerCount),
              containerType: item.containerType || "40 FT",
              quantity: cleanNumberValue(itemQty),
              unitPrice: cleanNumberValue(itemRate),
              amount: cleanNumberValue(itemAmount) || 0,
              remarks: item.remarks || "",
            };
          });
        }

        // Multi-Modal transport mode mapping from Enquiry
        const mappedOriginMode = eq.shipmentMode === "ROAD" ? "road"
          : eq.shipmentMode === "AIR" ? "air"
            : eq.shipmentMode === "RAIL" ? "rail"
              : "sea";
        const mappedDestMode = eq.shipmentMode === "ROAD" ? "road"
          : eq.shipmentMode === "AIR" ? "air"
            : eq.shipmentMode === "RAIL" ? "rail"
              : "sea";

        const savedEnquiryDestinations = await enquiriesApi.getDestinations(enquiryId);
        const resolvedEnquiryDestination = getEnquiryDestination(eq, savedEnquiryDestinations);

        setForm(f => ({
          ...f,
          enquiryId: eq.id || enquiryId,
          businessReference: eq.businessReference || f.businessReference,
          contractDate: todayStr,
          financialYear: getFinancialYearForDate(todayStr),
          buyerId:
            eq.buyerId ||
            eq.buyer?.id ||
            eq.partnerId ||
            eq.partner?.id ||
            f.buyerId,
          buyer: eq.buyer || eq.partner || f.buyer,
          sellerId: matchedSellerId || f.sellerId,
          brokerId: matchedBrokerId || f.brokerId,
          currencyCode: enquiryCurrency || f.currencyCode,
          shipmentTypeId: matchedShipmentTypeId || f.shipmentTypeId,
          paymentTermId: matchedPaymentTermId || f.paymentTermId,
          originCountry: eq.originCountry || f.originCountry,
          destinationCountry: eq.destinationCountry || f.destinationCountry,
          destinationSelectionMode: "enquiry",
          enquiryDestination: resolvedEnquiryDestination,
          // Multi-Modal Transport Routing
          originTransportMode: mappedOriginMode,
          destinationTransportMode: mappedDestMode,
          originLocationName: eq.portOfLoading || eq.polPort || "",
          destinationLocationName: "",
          // Legacy port fields
          portOfLoading: eq.portOfLoading || eq.polPort || "",
          portOfDischarge: eq.destinationPort || eq.podPort || "",
          transportDetails: eq.transportDetails && eq.transportDetails.length > 0
            ? eq.transportDetails.map((r, i) => {
              const matchedSt = masters.shipmentTypes?.find(st => st.id === (matchedShipmentTypeId || f.shipmentTypeId));
              const defaultIncoterm = matchedSt ? (matchedSt.code || matchedSt.name) : "";
              return {
                sequence: i + 1,
                origin: r.origin || "",
                incoterm: r.incoterm || defaultIncoterm || "",
                destination: r.destination || "",
              };
            })
            : (matchedShipmentTypeId
              ? [{
                sequence: 1,
                origin: eq.originPort || eq.originCity || eq.originCountryId || "",
                incoterm: masters.shipmentTypes?.find(st => st.id === matchedShipmentTypeId)?.code || "",
                destination: resolvedEnquiryDestination || eq.destinationCountry || "",
              }]
              : f.transportDetails || []),
          items: mappedItems.length > 0 ? mappedItems : f.items,
        }));
      } catch (err) {
        console.error("Failed to prefill contract from Enquiry", err);
      }
    };

    fillFromEnquiry();
  }, [enquiryId, isEdit, isView, masters, activeCompany]);

  const handleSave = async (asDraft = false) => {
    setPageError(null);
    const errs = validate(form, isAutoNumber);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please resolve all validation errors before proceeding.");
      return;
    }

    setSaving(true);
    const validItems = (form.items || []).filter(i => i.productId);
    const validShipments = (form.shipments || []).filter(s => s.shipmentDate && parseFloat(s.quantity) > 0);
    const totalQuantity = validItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
    const totalAmount = validItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

    const updatedPrintOverrides = { ...(form.printOverrides || {}) };
    validItems.forEach((item, idx) => {
      if (item.quality && String(item.quality).trim() !== "") {
        updatedPrintOverrides[`quality_${idx}`] = String(item.quality).trim();
        if (idx === 0) {
          updatedPrintOverrides.quality_0 = String(item.quality).trim();
        }
      }
      if (item.marking && String(item.marking).trim() !== "") {
        updatedPrintOverrides[`marking_${idx}`] = String(item.marking).trim();
        if (idx === 0) {
          updatedPrintOverrides.marking_0 = String(item.marking).trim();
        }
      }
    });

    const payload = {
      enquiryId: form.enquiryId || null,
      financialYear: form.financialYear,
      ...(!isAutoNumber && form.contractNumber?.trim()
        ? { contractNumber: form.contractNumber.trim() }
        : {}),
      contractDate: form.contractDate,
      contractType: form.contractType || "Export",
      buyerId: Number(form.buyerId),
      sellerId: form.sellerId ? Number(form.sellerId) : null,
      brokerId: form.brokerId ? Number(form.brokerId) : null,
      currencyCode: form.currencyCode,
      shipmentTypeId: Number(form.shipmentTypeId),
      paymentTermId: Number(form.paymentTermId),
      originCountry: form.originCountry,
      destinationCountry: form.destinationCountry,
      destinationSelectionMode: form.destinationSelectionMode || "enquiry",
      enquiryDestination: form.enquiryDestination || null,
      // Multi-Modal Transport fields
      originTransportMode: form.originTransportMode || "sea",
      destinationTransportMode: form.destinationTransportMode || "sea",
      originLocationName: form.originLocationName || null,
      destinationLocationName: form.destinationLocationName || null,

      // Legacy port fields: keep in sync for backward compat
      portOfLoading: (form.originTransportMode === "sea" || !form.originTransportMode)
        ? (form.originLocationName || null)
        : null,
      portOfDischarge: (form.destinationTransportMode === "sea" || !form.destinationTransportMode)
        ? (form.destinationLocationName || null)
        : null,
      remarks: form.remarks || null,
      terms: form.terms || [],
      otherConditions: form.otherConditions || [],
      disputeResolution: form.disputeResolution || null,
      forceMajeure: form.forceMajeure || null,
      sellerCompanyName: form.sellerCompanyName || null,
      sellerAuthorizedSignatory: form.sellerAuthorizedSignatory || null,
      sellerSignature: form.sellerSignature || null,
      sellerCompanySeal: form.sellerCompanySeal || null,
      buyerCompanyName: form.buyerCompanyName || null,
      buyerAuthorizedSignatory: form.buyerAuthorizedSignatory || null,
      buyerSignature: form.buyerSignature || null,
      buyerCompanySeal: form.buyerCompanySeal || null,
      totalQuantity,
      totalAmount,
      status: asDraft ? "Draft" : "Active",
      items: validItems.map(i => ({
        ...(i.id ? { id: Number(i.id) } : {}),
        productId: Number(i.productId),
        origin: i.origin || i.originCountry || null,
        quality: i.quality && String(i.quality).trim() ? String(i.quality).trim() : null,
        marking: i.marking || null,
        bagTypeId: Number(i.bagTypeId),
        packingTypeId: Number(i.packingTypeId),
        bagSpecificationId: i.bagSpecificationId ? Number(i.bagSpecificationId) : null,
        qtyPerCount: i.qtyPerCount !== "" && i.qtyPerCount !== null && i.qtyPerCount !== undefined ? parseFloat(i.qtyPerCount) : null,
        containerType: i.containerType || "40 FT",
        quantity: parseFloat(i.quantity) || 0,
        unitPrice: parseFloat(i.unitPrice) || 0,
        amount: parseFloat(i.amount) || 0,
        remarks: i.remarks || null,
      })),
      shipments: validShipments.map(s => ({
        ...(s.id ? { id: Number(s.id) } : {}),
        shipmentNo: s.shipmentNo ? Number(s.shipmentNo) : undefined,
        shipmentDate: s.shipmentDate,
        quantity: parseFloat(s.quantity) || 0,
        noOfContainers: s.noOfContainers !== "" && s.noOfContainers !== null && s.noOfContainers !== undefined ? Math.max(1, parseInt(s.noOfContainers, 10)) : 1,
        ratePerMt: s.ratePerMt !== "" && s.ratePerMt !== null && s.ratePerMt !== undefined ? parseFloat(s.ratePerMt) : null,
        purchaseRate: s.purchaseRate !== "" && s.purchaseRate !== null && s.purchaseRate !== undefined ? parseFloat(s.purchaseRate) : null,
        forex: s.forex !== "" && s.forex !== null && s.forex !== undefined ? parseFloat(s.forex) : null,
        freight: s.freight !== "" && s.freight !== null && s.freight !== undefined ? parseFloat(s.freight) : null,
        remarks: s.remarks || null,
      })),
      documents: (form.documents || []).map(d => ({
        ...(d.id ? { id: Number(d.id) } : {}),
        tradeDocumentId: Number(d.tradeDocumentId),
        isMandatory: !!d.isMandatory,
        remarks: d.remarks || null,
      })),
      transportDetails: (form.transportDetails || [])
        .filter(r => (r.origin && r.origin.trim()) || (r.incoterm && r.incoterm.trim()) || (r.destination && r.destination.trim()))
        .map((r, i) => ({
          sequence: i + 1,
          origin: (r.origin || "").trim(),
          incoterm: (r.incoterm || "").trim(),
          destination: (r.destination || "").trim(),
        })),
      printOverrides: updatedPrintOverrides,
    };


    try {
      if (isEdit) {
        await salesContractApi.update(contractId, payload);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("sales-contract-changed"));
        }
        if (!asDraft) {
          router.push("/sales-contracts");
        }
      } else {
        const res = await salesContractApi.create(payload);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("sales-contract-changed"));
        }
        if (asDraft) {
          router.replace(`/sales-contracts/${res.data.id}/edit`);
        } else {
          router.push("/sales-contracts");
        }
      }
    } catch (err) {
      console.error("Save Contract Error:", err);
      const rawMsg = err.response?.data?.message;
      let serverMsg = "Failed to save contract.";
      if (Array.isArray(rawMsg)) {
        serverMsg = rawMsg.join(" · ");
      } else if (typeof rawMsg === "string") {
        serverMsg = rawMsg;
      } else if (err.message) {
        serverMsg = err.message;
      }
      setErrors(prev => ({
        ...prev,
        apiError: serverMsg
      }));
      setPageError(serverMsg);
    } finally {
      setSaving(false);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;
  const productItems = form.items || [];
  const totalProductQty = productItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
  const totalShipmentQty = (form.shipments || []).reduce((sum, s) => sum + (parseFloat(s.quantity) || 0), 0);
  const hasDivisibilityError = productItems.some(
    (item) =>
      parseFloat(item.quantity) > 0 &&
      parseFloat(item.qtyPerCount) > 0 &&
      !isDivisible(item.quantity, item.qtyPerCount)
  );
  const isTotalMismatched =
    totalProductQty > 0 && Math.abs(totalShipmentQty - totalProductQty) > 0.001;
  const isFormBlocked = loadingContract || mastersLoading || saving || isTotalMismatched || hasDivisibilityError;
  const numberOfShipments = Math.max(1, parseInt(form.numShipments, 10) || 1);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Sticky Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs mb-5">
        <div className="px-6 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/sales-contracts")}
              className="h-8 w-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-gray-900">
                  {isView ? "View Contract" : isEdit ? "Edit Sales Contract" : "New Sales Contract"}
                </h1>
                {form.contractNumber && (
                  <span className="font-mono text-xs font-semibold text-[#007aff] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                    {form.contractNumber}
                  </span>
                )}
                {form.businessReference && (
                  <BusinessReference
                    reference={form.businessReference}
                    className="rounded-lg border border-indigo-100 bg-indigo-50 px-2 py-0.5"
                  />
                )}
              </div>
              <p className="text-[11px] text-gray-400">
                {isView ? "Review contract specifications and terms" : "Fill in contract specifications, terms, and shipment schedule"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {!isView && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push("/sales-contracts")}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={isFormBlocked}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Save Draft
              </button>
              <button
                onClick={() => handleSave(false)}
                disabled={isFormBlocked}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#007aff] rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-500/20 cursor-pointer"
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {isEdit ? "Update" : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>{/* end sticky header wrapper */}

      <div className="px-6 md:px-8 space-y-5">
        {/* Validation Summary */}
        {hasErrors && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-red-700">Please fix the following errors before saving:</p>
              <ul className="mt-1 space-y-0.5">
                {Object.entries(errors).map(([key, msg], i) => (
                  <li key={i} className="text-[11px] text-red-600">
                    {key === "activation" || key === "apiError" ? <pre className="font-sans whitespace-pre-wrap">{msg}</pre> : `• ${msg}`}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Form Sections */}
        <HeaderSection
          form={form}
          setForm={setForm}
          errors={errors}
          masters={masters}
          isView={isView}
          contractNumberPreview={isAutoNumber ? contractNumberPreview : undefined}
          isLoadingContractNumber={isLoadingContractNumber}
          onContractDateChange={handleContractDateChange}
        />
        <PartySection form={form} setForm={setForm} errors={errors} masters={masters} isView={isView} />
        <ItemsTable form={form} setForm={setForm} errors={errors} masters={masters} isView={isView} />
        <CommercialSection form={form} setForm={setForm} errors={errors} masters={masters} isView={isView} />
        <ShipmentTable
          form={form}
          setForm={setForm}
          errors={errors}
          masters={masters}
          isView={isView}
          isEdit={isEdit}
          totalProductQty={totalProductQty}
          numberOfShipments={numberOfShipments}
          productItems={productItems}
        />
        <DocumentSection form={form} setForm={setForm} masters={masters} isView={isView} uploadedDocIds={uploadedDocIds} />
        <RemarksSection form={form} setForm={setForm} isView={isView} />
        <TermsSection form={form} setForm={setForm} isView={isView} />
        <OtherConditionsSection form={form} setForm={setForm} isView={isView} />
        <DisputeResolutionSection form={form} setForm={setForm} isView={isView} />
        <ForceMajeureSection form={form} setForm={setForm} isView={isView} />
        <ContractAcceptanceSection form={form} setForm={setForm} isView={isView} masters={masters} />

        {/* Bottom Action Bar */}
        {!isView && (
          <div className="sticky bottom-4 flex justify-end gap-2.5">
            <div className="cursor-pointer bg-white border border-gray-200 rounded-2xl shadow-lg px-4 py-2.5 flex items-center gap-2.5">
              <button
                onClick={() => router.push("/sales-contracts")}
                className="cursor-pointer px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={isFormBlocked}
                className="cursor-pointer px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {saving && <Loader2 className="h-3 w-3 animate-spin" />}
                Save Draft
              </button>
              <button
                onClick={() => handleSave(false)}
                disabled={isFormBlocked}
                className="cursor-pointer px-4 py-1.5 text-xs font-semibold text-white bg-[#007aff] rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-500/20 cursor-pointer"
              >
                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                {isEdit ? "Update" : "Save & Activate"}
              </button>
            </div>
          </div>
        )}
      </div>{/* end content wrapper */}
    </div>
  );
}
