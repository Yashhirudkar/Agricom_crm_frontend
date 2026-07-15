"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { useSalesMasters } from "../hooks/useSalesContracts";
import { salesContractApi } from "../services/salesContractApi";
import { enquiryApi } from "@/modules/enquiries/services/enquiryApi";
import HeaderSection from "../components/HeaderSection";
import PartySection from "../components/PartySection";
import CommercialSection from "../components/CommercialSection";
import ItemsTable from "../components/ItemsTable";
import ShipmentTable from "../components/ShipmentTable";
import DocumentSection from "../components/DocumentSection";
import DocumentUploadSection from "../components/DocumentUploadSection";
import RemarksSection from "../components/RemarksSection";

const defaultForm = () => ({
  financialYearId: "",
  contractNumber: "",
  contractDate: "",
  contractType: "Export",
  buyerId: "",
  sellerId: null,
  brokerId: null,
  currencyCode: "",
  shipmentTypeId: "",
  paymentTermId: "",
  originCountryId: "",
  destinationCountryId: "",
  portOfLoading: "",
  portOfDischarge: "",
  remarks: "",
  numShipments: 3,
  items: [],
  shipments: [],
  documents: [],
});

function validate(form) {
  const e = {};
  if (!form.financialYearId) e.financialYearId = "Financial Year is required";
  if (!form.contractNumber?.trim()) e.contractNumber = "Contract No. is required";
  if (!form.contractDate) e.contractDate = "Contract Date is required";
  if (!form.buyerId) e.buyerId = "Buyer is required";
  if (!form.currencyCode) e.currencyCode = "Currency is required";
  if (!form.shipmentTypeId) e.shipmentTypeId = "Shipment Type is required";
  if (!form.paymentTermId) e.paymentTermId = "Payment Terms are required";
  if (!form.originCountryId) e.originCountryId = "Origin country is required";
  if (!form.destinationCountryId) e.destinationCountryId = "Destination country is required";
  if (!form.items || form.items.length === 0) {
    e.items = "At least one product item is required";
  } else {
    // Validate each item row for required fields
    const itemErrors = [];
    form.items.forEach((item, idx) => {
      const rowErrors = [];
      if (!item.productId)      rowErrors.push("Product");
      if (!item.bagTypeId)      rowErrors.push("Bag Type");
      if (!item.packingTypeId)  rowErrors.push("Packing Type");
      if (!item.quantity || parseFloat(item.quantity) <= 0) rowErrors.push("Quantity");
      if (!item.unitPrice || parseFloat(item.unitPrice) <= 0) rowErrors.push("Unit Price");
      if (rowErrors.length > 0) itemErrors.push(`Item ${idx + 1}: ${rowErrors.join(", ")} required`);
    });
    if (itemErrors.length > 0) e.items = itemErrors.join(" · ");
  }
  if (!form.shipments || form.shipments.length === 0 || !form.shipments.some(s => s.shipmentDate && s.quantity)) {
    e.shipments = "At least one shipment with a date and quantity is required";
  }
  return e;
}

export default function ContractFormPage({ editId, viewId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const enquiryId = searchParams ? searchParams.get("enquiryId") : null;
  const { masters, loading: mastersLoading } = useSalesMasters();
  const [form, setForm] = useState(defaultForm());
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loadingContract, setLoadingContract] = useState(false);
  const [pageError, setPageError] = useState(null);
  const [uploadedDocIds, setUploadedDocIds] = useState([]);

  const isEdit = !!editId;
  const isView = !!viewId && !editId;
  const contractId = editId || viewId;

  useEffect(() => {
    if (!contractId) return;
    const load = async () => {
      setLoadingContract(true);
      try {
        const res = await salesContractApi.getOne(contractId);
        const c = res.data;
        setForm({
          financialYearId: c.financialYearId || "",
          contractNumber: c.contractNumber || "",
          contractDate: c.contractDate ? c.contractDate.split("T")[0] : "",
          contractType: c.contractType || "Export",
          buyerId: c.buyerId || "",
          sellerId: c.sellerId || null,
          brokerId: c.brokerId || null,
          currencyCode: c.currencyCode || "",
          shipmentTypeId: c.shipmentTypeId || "",
          paymentTermId: c.paymentTermId || "",
          originCountryId: c.originCountryId || "",
          destinationCountryId: c.destinationCountryId || "",
          portOfLoading: c.portOfLoading || "",
          portOfDischarge: c.portOfDischarge || "",
          remarks: c.remarks || "",
          numShipments: c.shipments?.length || 3,
          items: (c.items || []).map(item => ({
            productId: item.productId || "",
            bagTypeId: item.bagTypeId || "",
            packingTypeId: item.packingTypeId || "",
            bagSpecificationId: item.bagSpecificationId || null,
            quantity: item.quantity || "",
            unitPrice: item.unitPrice || "",
            amount: item.amount || 0,
            marking: item.marking || "",
            remarks: item.remarks || "",
          })),
          shipments: (c.shipments || []).map((s, i) => ({
            shipmentNo: i + 1,
            shipmentDate: s.shipmentDate ? s.shipmentDate.split("T")[0] : "",
            quantity: s.quantity || "",
            noOfContainers: s.noOfContainers || "",
            ratePerMt: s.ratePerMt || "",
            currencyCode: s.currencyCode || "",
            purchaseRate: s.purchaseRate || "",
            forex: s.forex || "",
            freight: s.freight || "",
            remarks: s.remarks || "",
          })),
          documents: (c.documents || []).map(d => ({
            tradeDocumentId: d.tradeDocumentId,
            isMandatory: d.isMandatory || false,
            remarks: d.remarks || "",
          })),
        });
      } catch (err) {
        setPageError("Failed to load contract details.");
      } finally {
        setLoadingContract(false);
      }
    };
    load();
  }, [contractId]);

  useEffect(() => {
    if (!enquiryId || isEdit || isView || mastersLoading) return;
    const loadEnquiry = async () => {
      setLoadingContract(true);
      try {
        const res = await enquiryApi.getOne(enquiryId);
        const eq = res.data;
        if (!eq) return;

        let activeFyId = "";
        if (masters.financialYears && masters.financialYears.length > 0) {
          activeFyId = masters.financialYears[0].id;
        }

        const matchedShipmentType = masters?.shipmentTypes?.find(
          s => s.name?.toLowerCase() === eq.shipmentType?.toLowerCase()
        );
        const shipmentTypeId = matchedShipmentType ? matchedShipmentType.id : "";

        setForm({
          financialYearId: activeFyId,
          contractNumber: "",
          contractDate: new Date().toISOString().split("T")[0],
          contractType: "Export",
          buyerId: eq.partnerId || "",
          sellerId: null,
          brokerId: null,
          currencyCode: "USD",
          shipmentTypeId: shipmentTypeId,
          paymentTermId: "",
          originCountryId: eq.originCountryId || "",
          destinationCountryId: "",
          portOfLoading: "",
          portOfDischarge: eq.podPort || "",
          remarks: `Created from Enquiry ${eq.enquiryNo || ""}`,
          numShipments: eq.shipmentDate ? 1 : 3,
          items: [{
            productId: eq.productId || "",
            bagTypeId: "",
            packingTypeId: eq.packingTypeId || "",
            bagSpecificationId: null,
            quantity: eq.quantity || "",
            unitPrice: eq.buyingInterest || "",
            amount: parseFloat(((eq.quantity || 0) * (eq.buyingInterest || 0)).toFixed(2)) || 0,
            marking: "",
            remarks: "",
          }],
          shipments: eq.shipmentDate ? [{
            shipmentNo: 1,
            shipmentDate: eq.shipmentDate ? eq.shipmentDate.split("T")[0] : "",
            quantity: eq.quantity || "",
            noOfContainers: "",
            ratePerMt: "",
            currencyCode: "",
            purchaseRate: "",
            forex: "",
            freight: "",
            remarks: "",
          }] : [],
          documents: [],
        });
      } catch (err) {
        console.error("Failed to load enquiry details:", err);
      } finally {
        setLoadingContract(false);
      }
    };
    loadEnquiry();
  }, [enquiryId, isEdit, isView, mastersLoading, masters]);

  const handleSave = async (asDraft = false) => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrors({});
    setSaving(true);

    const validItems = form.items.filter(i => i.productId);
    const validShipments = form.shipments.filter(s => s.shipmentDate && s.quantity);
    const totalQuantity = validItems.reduce((s, i) => s + (parseFloat(i.quantity) || 0), 0);
    const totalAmount = validItems.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);

    const payload = {
      financialYearId: Number(form.financialYearId),
      contractNumber: form.contractNumber.trim(),
      contractDate: form.contractDate,
      buyerId: Number(form.buyerId),
      brokerId: form.brokerId ? Number(form.brokerId) : null,
      currencyCode: form.currencyCode,
      shipmentTypeId: Number(form.shipmentTypeId),
      paymentTermId: Number(form.paymentTermId),
      originCountryId: Number(form.originCountryId),
      destinationCountryId: Number(form.destinationCountryId),
      portOfLoading: form.portOfLoading || null,
      portOfDischarge: form.portOfDischarge || null,
      remarks: form.remarks || null,
      totalQuantity,
      totalAmount,
      status: asDraft ? "Draft" : "Active",
      items: validItems.map(i => ({
        productId: Number(i.productId),
        // bagTypeId and packingTypeId are NOT NULL in DB and @IsNotEmpty() in DTO
        bagTypeId: Number(i.bagTypeId),
        packingTypeId: Number(i.packingTypeId),
        bagSpecificationId: i.bagSpecificationId ? Number(i.bagSpecificationId) : null,
        quantity: parseFloat(i.quantity) || 0,
        unitPrice: parseFloat(i.unitPrice) || 0,
        amount: parseFloat(i.amount) || 0,
        // backend DTO has single 'remarks' field - merge marking into it
        remarks: [i.marking, i.remarks].filter(Boolean).join(' | ') || null,
      })),
      // Backend CreateSalesContractShipmentDto only has: shipmentDate, quantity, remarks
      shipments: validShipments.map(s => ({
        shipmentDate: s.shipmentDate,
        quantity: parseFloat(s.quantity) || 0,
        remarks: s.remarks || null,
      })),
      documents: (form.documents || []).map(d => ({
        tradeDocumentId: Number(d.tradeDocumentId),
        isMandatory: !!d.isMandatory,
        remarks: d.remarks || null,
      })),
    };

    try {
      if (isEdit) {
        await salesContractApi.update(contractId, payload);
        if (asDraft) {
          // Stay on page
        } else {
          router.push("/sales-contracts");
        }
      } else {
        const res = await salesContractApi.create(payload);
        if (asDraft) {
          router.replace(`/sales-contracts/${res.data.id}/edit`);
        } else {
          router.push("/sales-contracts");
        }
      }
    } catch (err) {
      if (err.response?.data?.message && err.response.data.message.includes('Cannot activate contract')) {
         setErrors({ activation: err.response.data.message });
         window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } finally {
      setSaving(false);
    }
  };

  if (mastersLoading || loadingContract) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin" />
        <p className="text-xs text-gray-400 font-semibold">Loading...</p>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="p-8 flex flex-col items-center gap-4">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-sm font-semibold text-gray-700">{pageError}</p>
        <button onClick={() => router.back()} className="text-xs text-[#007aff] underline">Go Back</button>
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/sales-contracts")}
            className="h-8 w-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isView ? "View Contract" : isEdit ? "Edit Contract" : "New Sales Contract"}
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {isView ? form.contractNumber : isEdit ? `Editing ${form.contractNumber || "..."}` : "Create a new export/import contract"}
            </p>
          </div>
        </div>

        {!isView && (
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => router.push("/sales-contracts")}
              className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save Draft
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#007aff] rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {isEdit ? "Update" : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* Validation Summary */}
      {hasErrors && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-red-700">Please fix the following errors before saving:</p>
            <ul className="mt-1 space-y-0.5">
              {Object.entries(errors).map(([key, msg], i) => (
                <li key={i} className="text-[11px] text-red-600">
                   {key === 'activation' ? <pre className="font-sans whitespace-pre-wrap">{msg}</pre> : `• ${msg}`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Form Sections */}
      <HeaderSection form={form} setForm={setForm} errors={errors} masters={masters} isView={isView} />
      <PartySection form={form} setForm={setForm} errors={errors} masters={masters} isView={isView} />
      <CommercialSection form={form} setForm={setForm} errors={errors} masters={masters} isView={isView} />
      <ItemsTable form={form} setForm={setForm} errors={errors} masters={masters} isView={isView} />
      <ShipmentTable form={form} setForm={setForm} errors={errors} masters={masters} isView={isView} />
      <DocumentSection form={form} setForm={setForm} masters={masters} isView={isView} uploadedDocIds={uploadedDocIds} />
      {contractId && (
        <DocumentUploadSection
          contractId={contractId}
          isView={isView}
          selectedDocuments={form.documents}
          tradeDocumentsMaster={masters.tradeDocuments}
          onUploadedChange={setUploadedDocIds}
        />
      )}
      <RemarksSection form={form} setForm={setForm} isView={isView} />

      {/* Bottom Action Bar */}
      {!isView && (
        <div className="sticky bottom-4 flex justify-end gap-2.5">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg px-4 py-2.5 flex items-center gap-2.5">
            <button
              onClick={() => router.push("/sales-contracts")}
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              {saving && <Loader2 className="h-3 w-3 animate-spin" />}
              Save Draft
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#007aff] rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
            >
              {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
              {isEdit ? "Update" : "Save & Activate"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
