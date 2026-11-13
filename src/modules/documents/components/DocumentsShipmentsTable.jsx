import React, { useRef } from "react";
import {
  User,
  Loader2,
  Package,
  Copy,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ShipmentRefTooltip from "@/modules/shipments/components/ShipmentRefTooltip";
import { copyToClipboard } from "@/utils/clipboard";

export default function DocumentsShipmentsTable({
  shipments = [],
  loading = false,
  onRowClick,
  onSortBusinessReference,
  onOpenDocument,
  selectedShipments = [],
  setSelectedShipments,
}) {
  const router = useRouter();
  const tableScrollRef = useRef(null);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedShipments(shipments.map((s) => s.id));
    } else {
      setSelectedShipments([]);
    }
  };

  const handleSelectOne = (e, id) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedShipments((prev) => [...prev, id]);
    } else {
      setSelectedShipments((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleCopyBusinessReference = async (e, reference) => {
    e.stopPropagation();
    if (!reference || reference === "—") return;

    try {
      await copyToClipboard(reference);
      toast.success("Business reference copied");
    } catch (error) {
      console.error("Failed to copy business reference", error);
      toast.error("Unable to copy business reference");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500 gap-3 bg-white">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <span className="text-sm font-medium">Loading completed shipments...</span>
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3 bg-white">
        <FileText className="h-12 w-12 text-gray-300 stroke-[1.5]" />
        <span className="text-sm font-medium text-gray-700">
          No completed shipments found
        </span>
        <span className="text-sm text-gray-500 max-w-sm text-center">
          No shipments have completed stuffing/execution yet.
        </span>
      </div>
    );
  }

  return (
    <div className="shipment-table-shell flex min-h-0 flex-1 w-full min-w-0 flex-col">
      <div
        ref={tableScrollRef}
        className="shipment-table-wrapper min-h-0 flex-1 w-full min-w-0 overflow-x-auto overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "thin" }}
      >
        <table className="shipment-table w-full table-auto whitespace-nowrap text-sm text-left border-collapse">
          <colgroup>
            <col style={{ width: "40px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "90px" }} />
            <col style={{ width: "130px" }} />
          </colgroup>
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3 w-12 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={shipments.length > 0 && selectedShipments.length === shipments.length}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                />
              </th>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3 whitespace-nowrap">
                {onSortBusinessReference ? (
                  <button
                    type="button"
                    onClick={onSortBusinessReference}
                    className="hover:text-blue-600 font-medium"
                  >
                    Business Ref No.
                  </button>
                ) : (
                  "Business Ref No."
                )}
              </th>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3 whitespace-nowrap">
                Shipment Date
              </th>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3 whitespace-nowrap">
                Buyer
              </th>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3 whitespace-nowrap">
                Supplier
              </th>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3 whitespace-nowrap">
                Commodity
              </th>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3 text-center whitespace-nowrap">
                Qty (MT)
              </th>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3 text-right whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {shipments.map((s) => {
              const contract = s.salesContract || {};
              const buyer = contract.buyer || {};
              const seller = contract.seller || {};

              const productsList = s.products || [];
              const primaryProduct = productsList[0]?.name || "—";
              const productDisplay =
                productsList.length > 1
                  ? `${primaryProduct} + ${productsList.length - 1} more`
                  : primaryProduct;

              const isSelected = selectedShipments.includes(s.id);

              return (
                <tr
                  key={s.id}
                  onClick={() => onRowClick && onRowClick(s)}
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                    isSelected ? "bg-blue-50/50" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <td
                    className="px-3 py-3 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectOne(e, s.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                    />
                  </td>

                  {/* Business Ref */}
                  <td className="px-3 py-3 font-medium text-blue-600 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <ShipmentRefTooltip shipment={s}>
                        <span className="hover:underline cursor-pointer">
                          {s.businessReference ||
                            s.businessTransaction?.businessReference ||
                            "—"}
                        </span>
                      </ShipmentRefTooltip>
                      {(s.businessReference ||
                        s.businessTransaction?.businessReference) && (
                        <button
                          type="button"
                          onClick={(e) =>
                            handleCopyBusinessReference(
                              e,
                              s.businessReference ||
                                s.businessTransaction?.businessReference,
                            )
                          }
                          className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Copy business reference"
                          aria-label="Copy business reference"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Shipment Date */}
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">
                    {s.shipmentDate
                      ? new Date(s.shipmentDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>

                  {/* Buyer */}
                  <td
                    className="px-3 py-3 whitespace-nowrap text-gray-900 font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {buyer.entityName ? (
                      buyer.id ? (
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/masters/partners?partnerId=${buyer.id}`)
                          }
                          className="group relative max-w-full hover:text-blue-600 hover:underline flex items-center gap-1.5"
                        >
                          <User className="h-4 w-4 text-gray-400 shrink-0" />
                          <span className="min-w-0 max-w-[140px] truncate">
                            {buyer.entityName}
                          </span>
                          <span className="pointer-events-none invisible absolute left-0 top-full z-30 mt-1 max-w-xs whitespace-normal rounded-md bg-white px-2.5 py-1.5 text-xs font-normal text-gray-700 opacity-0 shadow-lg ring-1 ring-gray-200 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 [transition-delay:200ms]">
                            {buyer.entityName}
                          </span>
                        </button>
                      ) : (
                        <span className="group relative flex max-w-full items-center gap-1.5 text-gray-900">
                          <User className="h-4 w-4 text-gray-400 shrink-0" />
                          <span className="min-w-0 max-w-[140px] truncate">
                            {buyer.entityName}
                          </span>
                          <span className="pointer-events-none invisible absolute left-0 top-full z-30 mt-1 max-w-xs whitespace-normal rounded-md bg-white px-2.5 py-1.5 text-xs font-normal text-gray-700 opacity-0 shadow-lg ring-1 ring-gray-200 transition-opacity group-hover:visible group-hover:opacity-100 [transition-delay:200ms]">
                            {buyer.entityName}
                          </span>
                        </span>
                      )
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Supplier */}
                  <td className="group relative px-3 py-3 whitespace-nowrap text-gray-600">
                    <span className="block max-w-[140px] truncate">
                      {seller.entityName || "—"}
                    </span>
                    {seller.entityName && (
                      <span className="pointer-events-none invisible absolute left-3 top-full z-30 mt-1 max-w-xs whitespace-normal rounded-md bg-white px-2.5 py-1.5 text-xs text-gray-700 opacity-0 shadow-lg ring-1 ring-gray-200 transition-opacity group-hover:visible group-hover:opacity-100 [transition-delay:200ms]">
                        {seller.entityName}
                      </span>
                    )}
                  </td>

                  {/* Commodity */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    {productsList.length > 0 ? (
                      <div
                        className="flex items-center gap-2 text-gray-700"
                        title={primaryProduct}
                      >
                        <Package className="h-4 w-4 text-gray-400" />
                        <span>{productDisplay}</span>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Qty (MT) */}
                  <td className="px-3 py-3 text-center font-medium text-gray-900 whitespace-nowrap">
                    {s.quantity
                      ? Number.isInteger(Number(s.quantity))
                        ? Number(s.quantity).toLocaleString("en-US")
                        : Number(s.quantity).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })
                      : "0"}
                  </td>

                  {/* Action Column: Document button */}
                  <td
                    className="px-3 py-3 whitespace-nowrap text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        title="Open Shipment Stuffing Execution Document"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenDocument) onOpenDocument(s);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer transition-colors"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Document</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

