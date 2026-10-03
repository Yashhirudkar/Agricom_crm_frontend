"use client";
import React, { useState, useEffect } from "react";
import { AlertCircle, ArrowLeft, Save, CheckCircle, X, Pencil } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  usePurchaseContractDetail,
  usePurchaseContractSummary,
  usePurchaseContractShipments,
  useUpdatePurchaseContractStatus,
  usePurchaseContractAttachments,
  useUploadPurchaseContractAttachment,
  useDeletePurchaseContractAttachment,
} from "../hooks/usePurchaseContracts";
import { useSalesMasters } from "@/modules/sales-contracts/hooks/useSalesContracts";
import { purchaseContractApi } from "../services/purchaseContractApi";

import PurchaseContractInformationSection from "../components/PurchaseContractInformationSection";
import PurchaseCommercialInformationSection from "../components/PurchaseCommercialInformationSection";
import AgainstShipmentSection from "../components/AgainstShipmentSection";
import PurchaseShipmentSection from "../components/PurchaseShipmentSection";
import TermsSection from "@/modules/sales-contracts/components/TermsSection";
import PurchaseAttachmentsSection from "../components/PurchaseAttachmentsSection";
import PurchaseFinancialSummary from "../components/PurchaseFinancialSummary";

export default function PurchaseContractWorkspacePage({ contractId, isNew = false }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetShipmentIdParam = searchParams?.get("shipmentId");
  const isViewMode = searchParams?.get("mode") === "view";
  const id = contractId ? Number(contractId) : null;

  // Queries (only execute if not isNew)
  const {
    data: contract,
    isLoading: loadingDetail,
    isError: errorDetail,
    refetch: refetchDetail,
  } = usePurchaseContractDetail(isNew ? null : id);

  const {
    data: summary,
    isLoading: loadingSummary,
    refetch: refetchSummary,
  } = usePurchaseContractSummary(isNew ? null : id);

  const {
    data: shipments,
    isLoading: loadingShipments,
    refetch: refetchShipments,
  } = usePurchaseContractShipments(isNew ? null : id);

  const {
    data: attachmentsData,
  } = usePurchaseContractAttachments(isNew ? null : id);

  const { masters } = useSalesMasters();

  // Mutations
  const { mutate: updateStatus } = useUpdatePurchaseContractStatus(id);
  const { mutate: uploadAttachment } = useUploadPurchaseContractAttachment(id);
  const { mutate: deleteAttachment } = useDeletePurchaseContractAttachment(id);

  // Determine if manual mode
  const isManual = isNew || contract?.purchaseType === "MTT" || !contract?.salesContractId;

  // Form State
  const [form, setForm] = useState({
    purchaseType: isNew ? "MTT" : "SC",
    contractDate: new Date().toISOString().split("T")[0],
    contractNumber: "",
    buyerId: null,
    buyerName: "",
    sellerId: null,
    supplierName: "",
    sellerContractNo: "",
    productId: null,
    productName: "",
    quantity: "",
    productQuality: "",
    packing: "",
    bagType: "",
    bagSpec: "",
    stitching: "",
    marking: "",
    deliveryPlace: "",
    deliveryDate: "",
    deliveryToDate: "",
    unloadingDate: "",
    currencyCode: "",
    ratePerMt: "",
    paymentTermId: null,
    paymentTermName: "",
    paymentTermsText: "",
    advancePercent: "",
    balancePercent: "",
    penaltyPercent: "",
    paymentDueDate: "",
    brokerId: null,
    brokerName: "",
    brokerCommission: "",
    notes: "",
    terms: [],
    attachments: [],
    items: [],
  });

  const [selectedShipmentIds, setSelectedShipmentIds] = useState([]);
  const [shipmentAllocations, setShipmentAllocations] = useState([]);
  const [isShipmentsInitialized, setIsShipmentsInitialized] = useState(false);
  const [shipmentScheduleData, setShipmentScheduleData] = useState({});
  const [saving, setSaving] = useState(false);

  const allAvailableShipments = contract?.salesContract?.shipments || [];

  // Sync initial state from contract & summary when contract loads
  useEffect(() => {
    if (contract && !isNew) {
      const salesContract = contract.salesContract || {};
      const itemsList = contract.items?.length > 0
        ? contract.items
        : (salesContract.items?.length > 0 ? salesContract.items : []);

      const firstItem = itemsList[0] || {};
      const totalQuantity = itemsList.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) || "";

      let pObj = firstItem.product;
      if (!pObj && masters?.products?.length > 0) {
        pObj = masters.products.find(p => p.id === firstItem.productId);
      }

      const scQuality = [
        pObj?.qualitySubType,
        pObj?.specification || firstItem.quality
      ].filter(Boolean).join(" - ") || "";

      const scFirstItem = salesContract.items?.[0] || {};
      const printOverrides = salesContract.printOverrides || {};
      const overridenQuality = printOverrides['quality_0'];
      const quality = contract.productQuality || firstItem.productQuality || overridenQuality || scQuality || firstItem.remarks || scFirstItem.remarks || "";

      const packing = contract.packing || firstItem.packingType?.name || (typeof firstItem.packingType === "string" ? firstItem.packingType : "");
      const bagType = contract.bagType || firstItem.bagType?.name || (typeof firstItem.bagType === "string" ? firstItem.bagType : "");

      const bs = firstItem.bagSpecification;
      let bagSpec = contract.bagSpec || "";
      if (!bagSpec && bs) {
        if (typeof bs === "string") {
          bagSpec = bs;
        } else if (bs.width && bs.length) {
          bagSpec = `${bs.width}x${bs.length}` + (bs.emptyBagWeight ? ` - ${bs.emptyBagWeight}g` : "");
        } else if (bs.name) {
          bagSpec = bs.name;
        }
      }

      setForm((f) => ({
        ...f,
        purchaseType: contract.purchaseType || "SC",
        contractNumber: contract.contractNumber || "",
        buyerId: salesContract.sellerId || contract.buyerId || f.buyerId || null,
        buyerName: salesContract.seller?.entityName || contract.buyer?.entityName || f.buyerName || "",
        sellerId: contract.sellerId || f.sellerId || null,
        supplierName: contract.seller?.entityName || f.supplierName || "",
        brokerId: contract.brokerId || salesContract.brokerId || f.brokerId || null,
        brokerName: contract.broker?.entityName || salesContract.broker?.entityName || f.brokerName || "",
        brokerCommission: contract.brokerCommission || f.brokerCommission || "",
        sellerContractNo: contract.sellerContractNo || f.sellerContractNo || "",
        productId: firstItem.productId || f.productId || null,
        productName: firstItem.product?.name || firstItem.productName || f.productName || "",
        quantity: contract.quantity || f.quantity || (totalQuantity ? String(totalQuantity) : ""),
        productQuality: quality,
        packing: packing,
        bagType: bagType,
        bagSpec: bagSpec,
        stitching: contract.stitching || f.stitching || "",
        marking: contract.marking || firstItem.marking || f.marking || "",
        notes: contract.notes || f.notes || "",
        currencyCode: contract.currencyCode || salesContract.currencyCode || f.currencyCode || "",
        ratePerMt: firstItem.ratePerMt || f.ratePerMt || "",
        deliveryPlace: contract.deliveryPlace || salesContract.portOfLoading || f.deliveryPlace || "",
        deliveryDate: contract.dispatchDate || f.deliveryDate || "",
        deliveryToDate: contract.dispatchToDate || f.deliveryToDate || "",
        paymentTermId: contract.paymentTermId || salesContract.paymentTermId || f.paymentTermId || null,
        paymentTermName: contract.paymentTerm?.name || salesContract.paymentTerm?.name || f.paymentTermName || "",
        paymentTermsText: contract.paymentTermsText || f.paymentTermsText || "",
        advancePercent: contract.advancePercent ?? f.advancePercent ?? "",
        balancePercent: contract.advancePercent != null ? Math.max(0, 100 - Number(contract.advancePercent)) : (f.balancePercent ?? ""),
        penaltyPercent: contract.penaltyPercent ?? f.penaltyPercent ?? "",
        paymentDueDate: contract.paymentDueDate ? contract.paymentDueDate.split("T")[0] : (f.paymentDueDate || ""),
        unloadingDate: contract.unloadingDate ? contract.unloadingDate.split("T")[0] : (f.unloadingDate || ""),
        terms: (contract.terms && contract.terms.length > 0) ? contract.terms : (salesContract.terms || []),
        items: itemsList.map((it) => ({
          id: it.id,
          productId: it.productId,
          productName: it.product?.name || it.productName || "",
          quantity: Number(it.quantity) || 0,
          productQuality: it.productQuality || quality,
          packing: it.packing || packing,
          ratePerMt: Number(it.ratePerMt) || 0,
        })),
      }));

      // Initialize shipment allocations from backend links
      if (contract.shipmentLinks && contract.shipmentLinks.length > 0) {
        const allocs = contract.shipmentLinks.map((link) => ({
          shipmentId: link.shipmentId,
          purchaseContractItemId: link.purchaseContractItemId || null,
          allocatedQuantity: Number(link.allocatedQuantity) || Number(link.shipment?.quantity) || 0,
          shipment: link.shipment,
        }));
        setShipmentAllocations(allocs);
        setSelectedShipmentIds(allocs.map((a) => a.shipmentId));
      }
    }
  }, [contract, isNew]);

  useEffect(() => {
    if (isNew || isShipmentsInitialized) return;

    if (allAvailableShipments && allAvailableShipments.length > 0) {
      const availableIds = allAvailableShipments.map((s) => s.id);
      const targetShipmentIdsParam = searchParams?.get("shipmentIds");
      let targetIds = [];

      if (targetShipmentIdsParam) {
        targetIds = targetShipmentIdsParam
          .split(",")
          .map(Number)
          .filter((n) => !isNaN(n) && availableIds.includes(n));
      } else if (targetShipmentIdParam) {
        const paramId = Number(targetShipmentIdParam);
        if (availableIds.includes(paramId)) {
          targetIds = [paramId];
        }
      }

      if (targetIds.length > 0) {
        setSelectedShipmentIds(targetIds);
        setIsShipmentsInitialized(true);
        return;
      }

      if (shipments && shipments.length > 0) {
        const linkedIds = shipments
          .map((s) => s.shipmentId || s.id)
          .filter((id) => availableIds.includes(id));

        if (linkedIds.length > 0) {
          setSelectedShipmentIds(linkedIds);
          setIsShipmentsInitialized(true);
          return;
        }
      }

      if (shipments !== undefined) {
        setSelectedShipmentIds(availableIds.length > 0 ? [availableIds[0]] : []);
        setIsShipmentsInitialized(true);
      }
    }
  }, [shipments, allAvailableShipments, isShipmentsInitialized, targetShipmentIdParam, searchParams, isNew]);

  const handleToggleShipment = (shipmentId) => {
    setSelectedShipmentIds((prev) =>
      prev.includes(shipmentId)
        ? prev.filter((id) => id !== shipmentId)
        : [...prev, shipmentId]
    );
  };

  // Perform Save Draft or Save & Activate
  const handleSaveContract = async (targetStatus = null) => {
    setSaving(true);
    try {
      const formattedItems = (form.items && form.items.length > 0)
        ? form.items.map((it, idx) => {
            const isFirst = idx === 0;
            return {
              productId: isFirst ? (form.productId || it.productId || null) : (it.productId || form.productId || null),
              productName: isFirst ? (form.productName || it.productName || null) : (it.productName || form.productName || null),
              quantity: isFirst ? (Number(form.quantity) || Number(it.quantity) || 0) : (Number(it.quantity) || Number(form.quantity) || 0),
              productQuality: isFirst ? (form.productQuality || null) : (it.productQuality || form.productQuality || null),
              packing: isFirst ? (form.packing || null) : (it.packing || form.packing || null),
              bagType: isFirst ? (form.bagType || null) : (it.bagType || form.bagType || null),
              bagSpec: isFirst ? (form.bagSpec || null) : (it.bagSpec || form.bagSpec || null),
              stitching: isFirst ? (form.stitching || null) : (it.stitching || form.stitching || null),
              marking: isFirst ? (form.marking || null) : (it.marking || form.marking || null),
              ratePerMt: isFirst ? (form.ratePerMt || null) : (it.ratePerMt || form.ratePerMt || null),
            };
          })
        : (form.productId || form.quantity ? [{
            productId: form.productId || null,
            productName: form.productName || null,
            quantity: Number(form.quantity) || 0,
            productQuality: form.productQuality || null,
            packing: form.packing || null,
            bagType: form.bagType || null,
            bagSpec: form.bagSpec || null,
            stitching: form.stitching || null,
            marking: form.marking || null,
            ratePerMt: form.ratePerMt || null,
          }] : []);

      const formattedAllocations = shipmentAllocations.length > 0
        ? shipmentAllocations.map((a) => ({
            shipmentId: Number(a.shipmentId),
            purchaseContractItemId: a.purchaseContractItemId || null,
            allocatedQuantity: Number(a.allocatedQuantity || 0),
          }))
        : selectedShipmentIds.map((sId) => ({
            shipmentId: Number(sId),
            allocatedQuantity: 0,
          }));

      const payload = {
        purchaseType: form.purchaseType || (isManual ? "MTT" : "SC"),
        contractNumber: form.contractNumber || null,
        buyerId: form.buyerId || null,
        sellerId: form.sellerId || null,
        sellerContractNo: form.sellerContractNo || null,
        paymentTermId: form.paymentTermId || null,
        paymentTermsText: form.paymentTermsText || null,
        advancePercent: form.advancePercent !== "" && form.advancePercent != null ? parseFloat(form.advancePercent) : null,
        balancePercent: form.balancePercent !== "" && form.balancePercent != null ? parseFloat(form.balancePercent) : null,
        penaltyPercent: form.penaltyPercent !== "" && form.penaltyPercent != null ? parseFloat(form.penaltyPercent) : null,
        paymentDueDate: form.paymentDueDate || null,
        unloadingDate: form.unloadingDate || null,
        brokerId: form.brokerId || null,
        brokerCommission: form.brokerCommission || null,
        deliveryPlace: form.deliveryPlace || null,
        dispatchDate: form.deliveryDate || null,
        dispatchToDate: form.deliveryToDate || null,
        notes: form.notes || null,
        terms: Array.isArray(form.terms) ? form.terms : [],
        quantity: form.quantity ? String(form.quantity) : null,
        productQuality: form.productQuality || null,
        packing: form.packing || null,
        bagType: form.bagType || null,
        bagSpec: form.bagSpec || null,
        stitching: form.stitching || null,
        marking: form.marking || null,
        currencyCode: form.currencyCode || null,
        items: formattedItems,
        shipmentAllocations: formattedAllocations,
        shipmentIds: (selectedShipmentIds || []).map(Number).filter((n) => !isNaN(n)),
        shipmentScheduleData: shipmentScheduleData || {},
      };

      if (isNew) {
        const res = await purchaseContractApi.create(payload);
        const createdContract = res.data?.data || res.data || res;
        const newId = createdContract.id;

        if (targetStatus && targetStatus !== "Draft" && newId) {
          await purchaseContractApi.updateStatus(newId, targetStatus);
        }

        toast.success("Purchase Contract created successfully!");
        router.push(`/sales/purchase-contracts/${newId}`);
      } else {
        await purchaseContractApi.update(id, payload);

        if (targetStatus && targetStatus !== contract?.status) {
          await updateStatus(targetStatus);
        }

        toast.success(
          targetStatus === "In Progress"
            ? "Purchase Contract saved & activated successfully!"
            : "Purchase Contract draft saved successfully!"
        );

        refetchDetail();
        refetchSummary();
        refetchShipments();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save contract");
    } fontFinally: {
      setSaving(false);
    }
  };

  // Derive allocation summary
  const backendAllocation = summary?.allocationSummary || contract?.allocationSummary || {};
  const formQty = Number(form.quantity);
  const salesContractQty = !isNaN(formQty) && formQty > 0 ? formQty : Number(backendAllocation.salesContractQty ?? 0);
  const alreadyAllocatedQty = Number(backendAllocation.alreadyAllocatedQty ?? 0);

  const liveCurrentPurchaseQty = React.useMemo(() => {
    if (shipmentAllocations.length > 0) {
      return shipmentAllocations.reduce((sum, a) => sum + (Number(a.allocatedQuantity) || 0), 0);
    }
    return allAvailableShipments
      .filter((s) => selectedShipmentIds.includes(s.id))
      .reduce((sum, s) => {
        const customQty = shipmentScheduleData[s.id]?.quantity;
        const qty = customQty !== undefined && customQty !== "" ? Number(customQty) : Number(s.quantity || 0);
        return sum + (isNaN(qty) ? 0 : qty);
      }, 0);
  }, [allAvailableShipments, selectedShipmentIds, shipmentScheduleData, shipmentAllocations]);

  const liveAllocationSummary = React.useMemo(() => {
    const rawAvailable = salesContractQty - alreadyAllocatedQty;
    const availableBalanceQty = Math.max(0, rawAvailable);
    const isOverAllocated = liveCurrentPurchaseQty > availableBalanceQty;
    const overAllocatedQty = isOverAllocated ? liveCurrentPurchaseQty - availableBalanceQty : 0;
    const remainingBalance = isOverAllocated ? 0 : Math.max(0, availableBalanceQty - liveCurrentPurchaseQty);

    return {
      salesContractQty,
      alreadyAllocatedQty,
      availableBalanceQty,
      currentPurchaseQty: liveCurrentPurchaseQty,
      remainingBalance,
      overAllocatedQty,
      isOverAllocated,
    };
  }, [salesContractQty, alreadyAllocatedQty, liveCurrentPurchaseQty]);

  if (!isNew && (loadingDetail || loadingSummary)) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 space-y-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 animate-pulse h-20" />
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 animate-pulse h-64" />
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 animate-pulse h-64" />
      </div>
    );
  }

  if (!isNew && (errorDetail || !contract)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="text-base font-bold text-gray-900">Purchase Contract Not Found</h2>
          <p className="text-xs text-gray-500">
            The requested contract #{id} does not exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/sales/purchase-contracts")}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Purchase Contracts
          </button>
        </div>
      </div>
    );
  }

  const contractDisplayNo = isNew
    ? "New Manual MTT Contract"
    : (contract?.contractNumber || (contract?.salesContract?.contractNumber ? `PC-${contract.salesContract.contractNumber}` : `PC-${id}`));

  /* ─────────────── VIEW MODE: Clean Read-Only Layout ─────────────── */
  if (isViewMode && contract) {
    const sc = contract.salesContract || {};
    const buyerName = form.buyerName || sc.buyer?.entityName || "—";
    const sellerName = form.supplierName || sc.seller?.entityName || "—";
    const brokerName = form.brokerName || "—";
    const STATUS_COLORS = {
      Draft: "bg-gray-100 text-gray-700 border-gray-200",
      "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
      Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    const statusClass = STATUS_COLORS[contract.status] || "bg-gray-100 text-gray-700 border-gray-200";

    const Field = ({ label, value }) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</span>
        <span className="text-sm font-semibold text-gray-800">{value || "—"}</span>
      </div>
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pb-16">

        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100 shadow-xs">
          <div className="w-full max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/sales/purchase-contracts")}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-gray-900">Purchase Contract</h1>
                  <span className="font-mono font-extrabold text-[#007aff] text-xs bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                    {contractDisplayNo}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusClass}`}>
                    {contract.status}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {isManual ? "Merchant Trading (MTT Manual)" : `Linked SC: SC-${sc.contractNumber}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push(`/sales/purchase-contracts/${id}`)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl transition-colors shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit Contract</span>
            </button>
          </div>
        </div>

        <div className="w-full max-w-[1400px] mx-auto px-6 py-8 space-y-6">

          {/* Section 1 — Contract Parties */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-purple-50/60 to-white flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-purple-400" />
              <h2 className="text-sm font-bold text-gray-800">Contract Parties & Identification</h2>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <Field label="Contract Number" value={contractDisplayNo} />
              <Field label="Status" value={contract.status} />
              <Field label="Purchase Type" value={contract.purchaseType} />
              <Field label="Seller Contract No." value={form.sellerContractNo} />
              <Field label="Buyer" value={buyerName} />
              <Field label="Seller / Supplier" value={sellerName} />
              <Field label="Broker / Agent" value={brokerName} />
              <Field label="Broker Commission" value={form.brokerCommission ? `${form.brokerCommission}%` : "—"} />
            </div>
          </div>

          {/* Section 2 — Commercial Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-blue-50/60 to-white flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-blue-400" />
              <h2 className="text-sm font-bold text-gray-800">Commercial & Product Details</h2>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <Field label="Product" value={form.productName} />
              <Field label="Quantity" value={form.quantity ? `${form.quantity} MT` : "—"} />
              <Field label="Price" value={form.ratePerMt ? `${form.ratePerMt}` : "—"} />
              <Field label="Currency" value={form.currencyCode} />
              <Field label="Product Quality" value={form.productQuality} />
              <Field label="Packing" value={form.packing} />
              <Field label="Bag Type" value={form.bagType} />
              <Field label="Bag Spec" value={form.bagSpec} />
              <Field label="Stitching" value={form.stitching} />
              <Field label="Marking" value={form.marking} />
              <Field label="Delivery Place" value={form.deliveryPlace} />
              <Field label="Dispatch Date (From)" value={form.deliveryDate} />
              <Field label="Dispatch Date (To)" value={form.deliveryToDate} />
            </div>
          </div>

          {/* Section 3 — Payment Terms */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-emerald-50/60 to-white flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full bg-emerald-400" />
              <h2 className="text-sm font-bold text-gray-800">Payment Terms</h2>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <Field label="Payment Term" value={form.paymentTermName} />
              <Field label="Advance (%)" value={form.advancePercent ? `${form.advancePercent}%` : "—"} />
              <Field label="Balance (%)" value={form.balancePercent ? `${form.balancePercent}%` : "—"} />
              <div className="col-span-2 md:col-span-4">
                <Field label="Payment Terms Text" value={form.paymentTermsText} />
              </div>
              <Field label="Payment Due Date (Tentative)" value={form.paymentDueDate} />
              <Field label="Unloading Date" value={form.unloadingDate} />
            </div>
          </div>

          {/* Section 4 — Shipment Schedule */}
          {shipments && shipments.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-indigo-50/60 to-white flex items-center gap-2">
                <div className="w-1.5 h-5 rounded-full bg-indigo-400" />
                <h2 className="text-sm font-bold text-gray-800">Shipment Schedule</h2>
                <span className="ml-auto text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                  {shipments.length} Shipment{shipments.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider text-[9px]">
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">Shipment Ref</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-right">Containers</th>
                      <th className="px-4 py-3 text-left">Currency</th>
                      <th className="px-4 py-3 text-right">Purchase Rate</th>
                      <th className="px-4 py-3 text-right">Forex</th>
                      <th className="px-4 py-3 text-right">Freight</th>
                      <th className="px-4 py-3 text-right">Qty (MT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {shipments.map((s, idx) => (
                      <tr key={s.id || idx} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 text-gray-400 font-mono">{idx + 1}</td>
                        <td className="px-4 py-3 font-mono font-bold text-indigo-700">{s.shipmentReference || s.shipment?.shipmentReference || "—"}</td>
                        <td className="px-4 py-3 text-gray-600">{s.shipmentDate || s.shipment?.shipmentDate || "—"}</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-800">{s.containers ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-600">{s.currency || "INR"}</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-800">{s.purchaseRate ?? "—"}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{s.forexRate ?? "—"}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{s.freightCost ?? "—"}</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-800">{Number(s.allocatedQuantity || s.quantity || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 5 — Terms & Conditions */}
          {form.terms && form.terms.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-amber-50/60 to-white flex items-center gap-2">
                <div className="w-1.5 h-5 rounded-full bg-amber-400" />
                <h2 className="text-sm font-bold text-gray-800">Terms & Conditions</h2>
                <span className="ml-auto text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                  {form.terms.length} Condition{form.terms.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="p-6 space-y-2">
                {form.terms.map((t, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-sm text-gray-700">{typeof t === "string" ? t : t.text || t.description || JSON.stringify(t)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6 — Notes */}
          {form.notes && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
                <div className="w-1.5 h-5 rounded-full bg-gray-300" />
                <h2 className="text-sm font-bold text-gray-800">Notes & Additional Remarks</h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{form.notes}</p>
              </div>
            </div>
          )}

          {/* Section 7 — Financial Summary */}
          {summary && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-green-50/60 to-white flex items-center gap-2">
                <div className="w-1.5 h-5 rounded-full bg-green-400" />
                <h2 className="text-sm font-bold text-gray-800">Financial Summary</h2>
              </div>
              <PurchaseFinancialSummary summary={summary} loading={loadingSummary} />
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 space-y-6 pb-28">

      {/* Main Page Header */}
      <div className="px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between max-w-7xl mx-auto bg-white border border-gray-100 rounded-xl p-2 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/sales/purchase-contracts")}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <span>Purchase Contract Workspace</span>
                <span className="text-xs font-mono font-extrabold text-[#007aff] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                  {contractDisplayNo}
                </span>
              </h1>
              <p className="text-xs text-gray-500">
                {isManual ? (
                  <span>Type: <strong className="text-purple-700 font-semibold">Merchant Trading (MTT Manual)</strong></span>
                ) : (
                  <span>Linked Sales Contract: <strong className="font-mono text-[#007aff]">SC-{contract?.salesContract?.contractNumber}</strong></span>
                )}
                {" • Status: "}
                <span className="font-semibold text-gray-800">{isNew ? "New Draft" : contract?.status}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isViewMode ? (
              <button
                onClick={() => router.push(`/sales/purchase-contracts/${id}`)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl transition-colors shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => router.push("/sales/purchase-contracts")}
                  className="px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveContract(null)}
                  disabled={saving}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Draft</span>
                </button>
                <button
                  onClick={() => handleSaveContract("In Progress")}
                  disabled={saving}
                  className="px-4.5 py-2 text-xs font-semibold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl transition-colors shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Save & Activate</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Form Flow Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">

        {/* 1. Contract Information */}
        <PurchaseContractInformationSection
          contract={contract}
          summary={summary}
          form={form}
          setForm={setForm}
          masters={masters}
          isView={isViewMode}
        />

        {/* 2. Commercial Information */}
        <PurchaseCommercialInformationSection
          contract={contract}
          summary={summary}
          form={form}
          setForm={setForm}
          masters={masters}
          isView={isViewMode}
        />

        {/* 3. Against Shipment (Product-wise & Partial Allocations) */}
        <AgainstShipmentSection
          isManual={isManual}
          productItems={form.items && form.items.length > 0 ? form.items : [
            {
              id: form.items?.[0]?.id || null,
              productId: form.productId,
              productName: form.productName || "Primary Commodity",
              quantity: Number(form.quantity) || 0,
            }
          ]}
          contractBuyerId={form.buyerId}
          shipmentAllocations={shipmentAllocations}
          onUpdateAllocations={(updatedAllocs) => {
            setShipmentAllocations(updatedAllocs);
            setSelectedShipmentIds(updatedAllocs.map((a) => a.shipmentId));
          }}
          allAvailableShipments={allAvailableShipments}
          selectedShipmentIds={selectedShipmentIds}
          onToggleShipment={handleToggleShipment}
        />

        {/* 4. Shipment Schedule Table */}
        <PurchaseShipmentSection
          shipments={
            shipmentAllocations.length > 0
              ? shipmentAllocations.map((a) => ({
                  id: a.shipmentId,
                  shipmentId: a.shipmentId,
                  shipmentReference: a.shipment?.shipmentReference || `Shipment #${a.shipmentId}`,
                  quantity: a.allocatedQuantity,
                  ...a.shipment,
                }))
              : allAvailableShipments.filter((s) => selectedShipmentIds.includes(s.id))
          }
          allocationSummary={liveAllocationSummary}
          shipmentScheduleData={shipmentScheduleData}
          onUpdateShipmentSchedule={(shipmentId, field, val) => {
            setShipmentScheduleData((prev) => ({
              ...prev,
              [shipmentId]: {
                ...(prev[shipmentId] || {}),
                [field]: val,
              },
            }));
          }}
          loading={loadingShipments}
        />

        {/* 5. Notes Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">Notes &amp; Additional Remarks</h2>
            <p className="text-[10px] text-gray-400">Enter additional contract conditions, special remarks, or instructions</p>
          </div>
          <div className="p-5">
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Enter any additional remarks, special terms, or conditions..."
              disabled={isViewMode}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white resize-none disabled:opacity-75 disabled:bg-gray-50"
            />
          </div>
        </div>

        {/* 6. Terms & Conditions */}
        <TermsSection
          form={form}
          setForm={setForm}
          isView={isViewMode}
        />

        {/* 7. Attachments Section */}
        {!isNew && (
          <PurchaseAttachmentsSection
            attachments={attachmentsData || contract?.attachments || form.attachments || []}
            onUploadAttachment={(formData) => {
              uploadAttachment(formData);
            }}
            onDeleteAttachment={(attId) => {
              deleteAttachment(attId);
            }}
          />
        )}

        {/* 8. Financial Summary (Totals Section) */}
        {!isNew && (
          <PurchaseFinancialSummary
            summary={summary}
            loading={loadingSummary}
          />
        )}

        {!isViewMode && (
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => router.push("/sales/purchase-contracts")}
              className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveContract(null)}
              disabled={saving}
              className="px-5 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Draft</span>
            </button>
            <button
              onClick={() => handleSaveContract("In Progress")}
              disabled={saving}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl transition-colors shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Save &amp; Activate</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
