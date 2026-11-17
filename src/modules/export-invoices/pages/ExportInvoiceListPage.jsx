"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  RefreshCw,
  Receipt,
} from "lucide-react";
import { exportInvoicesApi } from "../services/exportInvoicesApi";
import ExportInvoicesTable from "../components/ExportInvoicesTable";
import ExportInvoicesFilter from "../components/ExportInvoicesFilter";
import ExportInvoicePreviewModal from "../components/ExportInvoicePreviewModal";
import Pagination from "@/components/common/Pagination";

export default function ExportInvoiceListPage() {
  const router = useRouter();

  const [invoices, setInvoices] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Pagination & Filter state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    currency: "",
    invoiceDateFrom: "",
    invoiceDateTo: "",
  });

  // Preview Modal target
  const [previewInvoice, setPreviewInvoice] = useState(null);

  // Reload trigger
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    exportInvoicesApi
      .getInvoices({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
      })
      .then((res) => {
        if (!ignore && res?.data) {
          setInvoices(res.data.data || []);
          setTotal(res.data.total || 0);
          setTotalPages(res.data.totalPages || 0);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error(err);
          toast.error("Failed to load export invoices");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [filters, pagination, reloadKey]);

  const handleRefresh = () => {
    setLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  const handleDelete = async (invoice) => {
    if (!confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
      return;
    }
    try {
      await exportInvoicesApi.deleteInvoice(invoice.id);
      toast.success(`Invoice ${invoice.invoiceNumber} deleted`);
      handleRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete invoice");
    }
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "",
      currency: "",
      invoiceDateFrom: "",
      invoiceDateTo: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden p-3 sm:p-4 lg:p-5 xl:p-6 max-w-[1700px] mx-auto space-y-3 print:p-0">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Receipt className="h-6 w-6 text-blue-600" />
            Export Invoices
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Auto-generated commercial export invoices from ERP sales contracts, shipments, and stuffing executions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="px-3 py-1.5 min-h-[36px] border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => router.push("/documents/export-invoices/new")}
            className="px-3.5 py-1.5 min-h-[36px] bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-1.5 text-xs font-semibold shadow-sm cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="flex min-h-0 flex-1 flex-col bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden print:hidden">
        <ExportInvoicesFilter
          filters={filters}
          setFilters={setFilters}
          onReset={handleResetFilters}
          total={total}
        />

        <div className="flex-1 overflow-auto">
          <ExportInvoicesTable
            invoices={invoices}
            loading={loading}
            onPreview={(inv) => setPreviewInvoice(inv)}
            onDelete={handleDelete}
          />
        </div>

        <div className="border-t border-gray-100 print:hidden">
          <Pagination
            currentPage={pagination.page}
            totalPages={totalPages}
            onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
            totalItems={total}
            itemsPerPage={pagination.limit}
            onLimitChange={(newLimit) =>
              setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }))
            }
            itemName="invoices"
          />
        </div>
      </div>

      {/* A4 Document Preview Modal */}
      {previewInvoice && (
        <ExportInvoicePreviewModal
          isOpen={!!previewInvoice}
          invoice={previewInvoice}
          onClose={() => setPreviewInvoice(null)}
        />
      )}
    </div>
  );
}
