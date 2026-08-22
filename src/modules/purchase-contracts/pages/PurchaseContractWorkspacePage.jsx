"use client";
import React, { useState, useEffect } from "react";
import { AlertCircle, ArrowLeft, Save, CheckCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
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

export default function PurchaseContractWorkspacePage({ contractId }) {
  const router = useRouter();
  const id = Number(contractId);

  // Queries
  const {
    data: contract,
    isLoading: loadingDetail,
    isError: errorDetail,
    refetch: refetchDetail,
  } = usePurchaseContractDetail(id);

  const {
    data: summary,
    isLoading: loadingSummary,
    refetch: refetchSummary,
  } = usePurchaseContractSummary(id);

  const {
    data: shipments,
    isLoading: loadingShipments,
    refetch: refetchShipments,
  } = usePurchaseContractShipments(id);

  const {
    data: attachmentsData,
  } = usePurchaseContractAttachments(id);

  const { masters } = useSalesMasters();

  // Mutations
  const { mutate: updateStatus } = useUpdatePurchaseContractStatus(id);
  const { mutate: uploadAttachment } = useUploadPurchaseContractAttachment(id);
  const { mutate: deleteAttachment } = useDeletePurchaseContractAttachment(id);


  // Form State — ZERO hardcoded default business values
  const [form, setForm] = useState({
    contractDate: new Date().toISOString().split("T")[0],
    supplierName: "",
    brokerName: "",
    sellerContractNo: "",
    brokerCommission: "",
    quantity: "",
    productQuality: "",
    packing: "",
    bagType: "",
    bagSpec: "",
    stitching: "",
    marking: "",
    incoterm: "",
    deliveryPlace: "",
    deliveryDate: "",
    notes: "",
    terms: [],
    attachments: [],
  });

  const [selectedShipmentIds, setSelectedShipmentIds] = useState([]);
  const [isShipmentsInitialized, setIsShipmentsInitialized] = useState(false);
  const [shipmentScheduleData, setShipmentScheduleData] = useState({});
  const [saving, setSaving] = useState(false);

  const allAvailableShipments = contract?.salesContract?.shipments || [];

  // Sync initial state from contract & shipments
  useEffect(() => {
    if (contract) {
      const salesContract = contract.salesContract || {};
      const firstItem = salesContract.items?.[0] || {};
      const totalSCQuantity = salesContract.items?.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) || "";

      const scQuality = firstItem.remarks || firstItem.productQuality || "";
      const scPacking = firstItem.packingType?.name || (typeof firstItem.packingType === "string" ? firstItem.packingType : "");
      const scBagType = firstItem.bagType?.name || (typeof firstItem.bagType === "string" ? firstItem.bagType : "");

      const bs = firstItem.bagSpecification;
      let scBagSpec = "";
      if (bs) {
        if (typeof bs === "string") {
          scBagSpec = bs;
        } else if (bs.width && bs.length) {
          scBagSpec = `${bs.width}x${bs.length}` + (bs.emptyBagWeight ? ` - ${bs.emptyBagWeight}g` : "");
        } else if (bs.name) {
          scBagSpec = bs.name;
        }
      }

      const scMarking = firstItem.marking || "";

      setForm((f) => ({
        ...f,
        supplierName: salesContract.seller?.entityName || salesContract.seller?.name || f.supplierName || "",
        brokerName: salesContract.broker?.entityName || salesContract.broker?.name || f.brokerName || "",
        sellerContractNo: contract.sellerContractNo || f.sellerContractNo || "",
        quantity: contract.quantity || f.quantity || totalSCQuantity,
        productQuality: contract.productQuality || scQuality || f.productQuality || "",
        packing: contract.packing || scPacking || f.packing || "",
        bagType: contract.bagType || scBagType || f.bagType || "",
        bagSpec: contract.bagSpec || scBagSpec || f.bagSpec || "",
        stitching: contract.stitching || f.stitching || "",
        marking: contract.marking || scMarking || f.marking || "",
        notes: contract.notes || f.notes || "",
        incoterm: contract.incoterm || salesContract.shipmentType?.name || salesContract.shipmentType?.code || f.incoterm || "",
        deliveryPlace: contract.deliveryPlace || salesContract.portOfLoading || salesContract.originLocationName || f.deliveryPlace || "",
        terms: (contract.terms && contract.terms.length > 0) ? contract.terms : (salesContract.terms && salesContract.terms.length > 0) ? salesContract.terms : (f.terms && f.terms.length > 0) ? f.terms : [],
      }));
    }
  }, [contract]);

  useEffect(() => {
    if (isShipmentsInitialized) return;

    if (allAvailableShipments && allAvailableShipments.length > 0) {
      const availableIds = allAvailableShipments.map((s) => s.id);
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
        setSelectedShipmentIds(availableIds);
        setIsShipmentsInitialized(true);
      }
    }
  }, [shipments, allAvailableShipments, isShipmentsInitialized]);

  // Toggle single shipment selection in Against Shipment
  const handleToggleShipment = (shipmentId) => {
    setSelectedShipmentIds((prev) =>
      prev.includes(shipmentId)
        ? prev.filter((id) => id !== shipmentId)
        : [...prev, shipmentId]
    );
  };

  // Perform Save with optional target status
  const handleSaveContract = async (targetStatus = null) => {
    if (selectedShipmentIds.length === 0) {
      toast.error("Please select at least 1 shipment in Against Shipment.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        purchaseType: form.purchaseType || null,
        sellerContractNo: form.sellerContractNo || null,
        notes: form.notes || null,
        terms: Array.isArray(form.terms) ? form.terms : [],
        quantity: form.quantity != null ? String(form.quantity) : null,
        productQuality: form.productQuality || null,
        packing: form.packing || null,
        bagType: form.bagType || null,
        bagSpec: form.bagSpec || null,
        stitching: form.stitching || null,
        marking: form.marking || null,
        incoterm: form.incoterm || null,
        deliveryPlace: form.deliveryPlace || null,
        shipmentIds: (selectedShipmentIds || []).map(Number).filter((n) => !isNaN(n)),
        shipmentScheduleData: shipmentScheduleData || {},
      };

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
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save contract");
    } finally {
      setSaving(false);
    }
  };

  // Backend Single Source of Truth for allocation base figures (overridden live by form.quantity if edited)
  const backendAllocation = summary?.allocationSummary || contract?.allocationSummary || {};
  const formQty = Number(form.quantity);
  const salesContractQty = !isNaN(formQty) && formQty > 0 ? formQty : Number(backendAllocation.salesContractQty ?? 0);
  const alreadyAllocatedQty = Number(backendAllocation.alreadyAllocatedQty ?? 0);

  // Compute live currentPurchaseQty based on currently selected shipments and live quantity edits
  const liveCurrentPurchaseQty = React.useMemo(() => {
    return allAvailableShipments
      .filter((s) => selectedShipmentIds.includes(s.id))
      .reduce((sum, s) => {
        const customQty = shipmentScheduleData[s.id]?.quantity;
        const qty = customQty !== undefined && customQty !== "" ? Number(customQty) : Number(s.quantity || 0);
        return sum + (isNaN(qty) ? 0 : qty);
      }, 0);
  }, [allAvailableShipments, selectedShipmentIds, shipmentScheduleData]);

  // Derive live allocation state using salesContractQty & alreadyAllocatedQty
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

  if (loadingDetail || loadingSummary) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 space-y-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 animate-pulse h-20" />
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 animate-pulse h-64" />
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 animate-pulse h-64" />
      </div>
    );
  }

  if (errorDetail || !contract) {
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
            onClick={() => router.push("/sales-contracts")}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sales Contracts
          </button>
        </div>
      </div>
    );
  }

  // Filter shipments to show ONLY selected ones in the Shipment Schedule table
  const displayedShipments = (shipments || []).filter((s) =>
    selectedShipmentIds.includes(s.shipmentId || s.id)
  );


  return (
    <div className="min-h-screen bg-gray-50/50 space-y-6 pb-28">

      {/* Main Page Header */}
      <div className="px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between max-w-7xl mx-auto bg-white border border-gray-100 rounded-xl p-2">
          <div className="flex items-center gap-3 ">
            <button
              onClick={() => router.push("/sales-contracts")}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-gray-900 tracking-tight">
                Purchase Contract — PC-{contract?.salesContract?.contractNumber || id}
              </h1>
              <p className="text-xs text-gray-500">
                Linked Sales Contract: <span className="font-mono font-bold text-[#007aff]">SC-{contract?.salesContract?.contractNumber}</span> • Status: <span className="font-semibold text-gray-800">{contract?.status}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/sales-contracts")}
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
        />

        {/* 2. Commercial Information */}
        <PurchaseCommercialInformationSection
          contract={contract}
          summary={summary}
          form={form}
          setForm={setForm}
          masters={masters}
        />

        {/* 3. Against Shipment (Multi Select) */}
        <AgainstShipmentSection
          allAvailableShipments={allAvailableShipments}
          selectedShipmentIds={selectedShipmentIds}
          onToggleShipment={handleToggleShipment}
        />

        {/* 4. Shipment Schedule (Selected Shipments Table with Readonly Stock Balance Column) */}
        <PurchaseShipmentSection
          shipments={allAvailableShipments.filter((s) => selectedShipmentIds.includes(s.id))}
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


        {/* 6. Notes Section */}
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
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white resize-none"
            />
          </div>
        </div>

        {/* 7. Terms & Conditions */}
        <TermsSection
          form={form}
          setForm={setForm}
          isView={false}
        />

        {/* 8. Attachments Section */}
        <PurchaseAttachmentsSection
          attachments={attachmentsData || contract?.attachments || form.attachments || []}
          onUploadAttachment={(formData) => {
            uploadAttachment(formData);
          }}
          onDeleteAttachment={(attId) => {
            deleteAttachment(attId);
          }}
        />


        {/* 9. Financial Summary (Totals Section) */}
        <PurchaseFinancialSummary
          summary={summary}
          loading={loadingSummary}
        />

        {/* Page Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => router.push("/sales-contracts")}
            className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSaveContract(null)}
            disabled={saving}
            className="px-5 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={() => handleSaveContract("In Progress")}
            disabled={saving}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl transition-colors shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Save &amp; Activate</span>
          </button>
        </div>

      </div>
    </div>
  );
}
