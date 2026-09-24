"use client";
import React from "react";
import { X, Boxes, ChevronRight, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ShipmentAllocationSelectorModal({
  shipment,
  allocations = [],
  onClose,
}) {
  const router = useRouter();

  if (!shipment) return null;

  const handleSelectAllocation = (cargoAvailabilityId) => {
    router.push(
      `/sales/cargo-availability?shipmentId=${shipment.id}&cargoAvailabilityId=${cargoAvailabilityId}`
    );
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-xs animate-in fade-in duration-200" onClick={onClose} />
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-cyan-50/60 border-b border-cyan-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-100 border border-cyan-200 flex items-center justify-center">
                <Boxes className="h-4.5 w-4.5 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Select Cargo Allocation</h2>
                <p className="text-[11px] text-cyan-800 font-medium mt-0.5">
                  Shipment {shipment.shipmentReference || `#${shipment.id}`} &bull; Multi-Contract Linked
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* List of Allocations */}
          <div className="p-5 space-y-2.5 max-h-[60vh] overflow-y-auto">
            {allocations.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-xs">
                No specific cargo allocation records found. Directing to overall Cargo Availability...
                <div className="mt-3">
                  <button
                    onClick={() => {
                      router.push(`/sales/cargo-availability?shipmentId=${shipment.id}`);
                      onClose();
                    }}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-cyan-700 transition-colors"
                  >
                    Open Cargo Availability
                  </button>
                </div>
              </div>
            ) : (
              allocations.map((alloc) => {
                const cargo = alloc.cargoAvailability || {};
                const contract = cargo.purchaseContract || {};
                const supplier = contract.seller?.entityName || "—";
                const contractNo = contract.contractNumber || `PC-${contract.id || cargo.purchaseContractId}`;

                return (
                  <div
                    key={alloc.id || cargo.id}
                    onClick={() => handleSelectAllocation(cargo.id || alloc.cargoAvailabilityId)}
                    className="bg-gray-50/80 hover:bg-cyan-50/50 border border-gray-200 hover:border-cyan-300 rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-gray-900 group-hover:text-cyan-700 text-xs">
                        <FileText className="h-3.5 w-3.5 text-cyan-600" />
                        <span>{contractNo}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 font-medium">
                        Supplier: <span className="text-gray-800 font-semibold">{supplier}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono">
                        Allocated: <span className="text-purple-700 font-bold">{alloc.allocatedQty || cargo.allocatedQty || 0} MT</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {cargo.status || "Ready Pool"}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-[10px] text-gray-400">1-Click Direct ERP Navigation</span>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
