"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import TransportDrawer from "@/modules/logistics/components/TransportDrawer";
import { logisticsApi } from "@/modules/logistics/services/logisticsApi";
import { shipmentsApi } from "@/modules/shipments/services/shipmentsApi";

export default function ShipmentTransportWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const shipmentId = String(params?.shipmentId || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workspace, setWorkspace] = useState(null);
  const [shipment, setShipment] = useState(null);

  useEffect(() => {
    if (!shipmentId) return;

    let cancelled = false;
    const initialize = async () => {
      setLoading(true);
      setError("");
      try {
        const [workspaceRes, shipmentRes] = await Promise.all([
          logisticsApi.getShipmentWorkspace(shipmentId),
          shipmentsApi.getShipment(shipmentId),
        ]);
        if (cancelled) return;
        setWorkspace(workspaceRes?.data || null);
        setShipment(shipmentRes?.data || null);
      } catch (err) {
        if (cancelled) return;
        setError(err?.response?.data?.message || "Failed to open the Transport Workspace.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initialize();
    return () => {
      cancelled = true;
    };
  }, [shipmentId]);

  const handleClose = () => {
    router.push("/sales/shipments");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-sm font-medium text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        Loading Transport Workspace...
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md text-center">
          <p className="text-sm font-semibold text-gray-900">Transport Workspace unavailable</p>
          <p className="mt-1 text-xs text-gray-500">{error || `Shipment #${shipmentId} could not be loaded.`}</p>
          <button
            type="button"
            onClick={handleClose}
            className="mt-4 rounded-md border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700"
          >
            Back to Shipments
          </button>
        </div>
      </div>
    );
  }

  const enquiry = {
    ...(workspace.enquiry || {}),
    ...(workspace.purchaseContract ? { purchaseContract: workspace.purchaseContract } : {}),
    ...(workspace.salesContract ? { salesContract: workspace.salesContract } : {}),
    id: workspace.enquiry?.id || workspace.enquiryId,
    enquiryId: workspace.enquiry?.id || workspace.enquiryId,
  };

  return (
    <TransportDrawer
      isOpen
      onClose={handleClose}
      enquiry={enquiry}
      targetShipmentId={shipmentId}
      fromSource="shipments"
      shipment={shipment}
    />
  );
}
