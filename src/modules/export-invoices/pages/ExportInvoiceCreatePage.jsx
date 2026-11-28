"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { exportInvoicesApi } from "../services/exportInvoicesApi";
import ExportInvoiceForm from "../components/ExportInvoiceForm";

export default function ExportInvoiceCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shipmentId = searchParams.get("shipmentId");
  const stuffingGroupId = searchParams.get("stuffingGroupId");
  const shipmentIdsParam = searchParams.get("shipmentIds");

  const hasInitTarget = Boolean(stuffingGroupId || shipmentIdsParam || shipmentId);
  const [loading, setLoading] = useState(hasInitTarget);
  const [initData, setInitData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadInit = stuffingGroupId
      ? exportInvoicesApi.getInitDataFromGroup(stuffingGroupId)
      : shipmentIdsParam
        ? exportInvoicesApi.getInitDataFromShipments(shipmentIdsParam)
        : shipmentId
          ? exportInvoicesApi.getInitData(shipmentId)
          : null;

    if (loadInit) {
      loadInit
        .then((res) => {
          if (!isMounted) return;
          if (res?.data?.existingInvoiceId) {
            toast.info(
              `Opening existing combined invoice ${res.data.existingInvoiceNumber || ""}`.trim(),
            );
            router.replace(`/documents/export-invoices/${res.data.existingInvoiceId}`);
            return;
          }
          if (res?.data) {
            setInitData(res.data);
          }
        })
        .catch((err) => {
          if (!isMounted) return;
          console.error("Failed to initialize invoice", err);
          const msg =
            err.response?.data?.message ||
            (stuffingGroupId
              ? "Failed to load ERP mapping data for stuffing group #" + stuffingGroupId
              : shipmentIdsParam
                ? "Failed to load ERP mapping data for selected shipments"
                : "Failed to load ERP mapping data for shipment #" + shipmentId);
          setError(msg);
          toast.error(msg);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [shipmentId, stuffingGroupId, shipmentIdsParam, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <span className="text-sm font-medium text-gray-600">
          Auto-mapping ERP data (Contract ➔ Purchase ➔ Shipment ➔ Stuffing Execution)...
        </span>
      </div>
    );
  }

  if (error && !initData) {
    return (
      <div className="p-6 max-w-xl mx-auto mt-12 bg-white rounded-2xl border border-red-200 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
        <h2 className="text-base font-bold text-gray-900">Failed to Generate Invoice</h2>
        <p className="text-xs text-gray-600">{error}</p>
        <button
          type="button"
          onClick={() => router.push("/documents/export-invoices")}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Invoices</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-[1600px] mx-auto">
      <div className="mb-3">
        <button
          type="button"
          onClick={() => router.push("/documents/export-invoices")}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Invoices List</span>
        </button>
      </div>

      <ExportInvoiceForm initialData={initData} isEdit={false} />
    </div>
  );
}
