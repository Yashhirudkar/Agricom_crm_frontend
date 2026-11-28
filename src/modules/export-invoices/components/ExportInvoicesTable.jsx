"use client";
import React from "react";
import { Eye, Edit2, Trash2, FileText, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { copyToClipboard } from "@/utils/clipboard";

export default function ExportInvoicesTable({
  invoices = [],
  loading = false,
  onPreview,
  onDelete,
}) {
  const router = useRouter();

  const handleCopyRef = async (e, ref) => {
    e.stopPropagation();
    if (!ref || ref === "—") return;
    try {
      await copyToClipboard(ref);
      toast.success("Business Ref No. copied");
    } catch (err) {
      console.error("Failed to copy business reference", err);
      toast.error("Failed to copy reference number");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500 gap-3 bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span className="text-sm font-medium">Loading export invoices...</span>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3 bg-white">
        <FileText className="h-12 w-12 text-gray-300 stroke-[1.5]" />
        <span className="text-sm font-medium text-gray-700">No export invoices found</span>
        <span className="text-xs text-gray-400 max-w-sm text-center">
          Invoices are generated automatically from completed shipments and stuffing executions.
        </span>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "issued":
        return "bg-green-50 text-green-700 border-green-200";
      case "paid":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/80 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <th className="p-3">Invoice No.</th>
            <th className="p-3">Business Ref No.</th>
            <th className="p-3">Date</th>
            <th className="p-3">Contract / Order</th>
            <th className="p-3">Buyer (Consignee)</th>
            <th className="p-3 text-right">Quantity (MT)</th>
            <th className="p-3 text-right">Total Amount</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {invoices.map((inv) => {
            const buyer = inv.consigneeDetails || {};
            const businessRef =
              inv.businessReference ||
              inv.metadata?.businessReference ||
              inv.shipment?.businessTransaction?.businessReference ||
              inv.salesContract?.businessTransaction?.businessReference ||
              inv.shipment?.shipmentReference ||
              "—";
            return (
              <tr
                key={inv.id}
                onClick={() => router.push(`/documents/export-invoices/${inv.id}`)}
                className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
              >
                {/* Invoice No */}
                <td className="p-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span>{inv.invoiceNumber}</span>
                    {(inv.isMultiShipment ||
                      inv.stuffingGroupId ||
                      (Array.isArray(inv.shipmentIds) && inv.shipmentIds.length > 1)) && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-sans font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Grouped ({inv.shipmentIds?.length || inv.goodsItems?.length || 2})
                      </span>
                    )}
                  </div>
                </td>

                {/* Business Ref No */}
                <td className="p-3 font-mono font-medium text-blue-600 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="hover:underline cursor-pointer">{businessRef}</span>
                    {businessRef && businessRef !== "—" && (
                      <button
                        type="button"
                        onClick={(e) => handleCopyRef(e, businessRef)}
                        className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors cursor-pointer"
                        title="Copy Business Reference"
                        aria-label="Copy Business Reference"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </td>

                {/* Date */}
                <td className="p-3 text-gray-600 whitespace-nowrap">
                  {inv.invoiceDate
                    ? new Date(inv.invoiceDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </td>

                {/* Contract No */}
                <td className="p-3 font-mono text-gray-800 whitespace-nowrap">
                  {inv.sellerOrderNo || "—"}
                </td>

                {/* Buyer */}
                <td className="p-3 text-gray-900 font-medium max-w-[200px] truncate">
                  {buyer.name || "—"}
                </td>

                {/* Quantity */}
                <td className="p-3 text-right font-medium text-gray-900 whitespace-nowrap">
                  {Number(inv.totalQuantity || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 3,
                  })}
                </td>

                {/* Total Amount */}
                <td className="p-3 text-right font-bold text-gray-900 whitespace-nowrap">
                  {inv.currency}{" "}
                  {Number(inv.totalAmount || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </td>

                {/* Status */}
                <td className="p-3 text-center whitespace-nowrap">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                      inv.status
                    )}`}
                  >
                    {inv.status || "Draft"}
                  </span>
                </td>

                {/* Actions */}
                <td
                  className="p-3 text-right whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      title="Preview A4 Document"
                      onClick={() => onPreview && onPreview(inv)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      title="Edit Invoice"
                      onClick={() => router.push(`/documents/export-invoices/${inv.id}/edit`)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    {onDelete && (
                      <button
                        type="button"
                        title="Delete Invoice"
                        onClick={() => onDelete(inv)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
