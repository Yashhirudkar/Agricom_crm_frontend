"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, FileText, Check, AlertCircle } from "lucide-react";
import { useSalesContracts } from "../hooks/useSalesContracts";
import { salesContractApi } from "../services/salesContractApi";
import ContractsTable from "../components/ContractsTable";
import ContractsFilter from "../components/ContractsFilter";
import ContractViewModal from "../components/ContractViewModal";
import DocumentUploadDrawer from "../components/DocumentUploadDrawer";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/modals/ConfirmModal";

export default function SalesContractListPage() {
  const router = useRouter();
  const {
    contracts, loading, total, totalPages, page, setPage,
    search, setSearch,
    statusFilter, setStatusFilter,
    financialYearFilter, setFinancialYearFilter,
    fetchContracts,
  } = useSalesContracts();

  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewContractId, setViewContractId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [docContract, setDocContract] = useState(null); // contract object for document drawer

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await salesContractApi.remove(deleteTarget.id);
      showToast("Contract cancelled successfully");
      setDeleteTarget(null);
      fetchContracts();
    } catch (e) {
      showToast("Failed to cancel contract", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
          toast.type === "error" ? "bg-red-500" : "bg-green-500"
        }`}>
          {toast.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#007aff]" />
            Sales Contracts
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Manage export, import, and MTT trade contracts.
          </p>
        </div>
        <button
          onClick={() => router.push("/sales-contracts/new")}
          className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> New Contract
        </button>
      </div>

      {/* List Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <ContractsFilter
          search={search}
          setSearch={setSearch}
          status={statusFilter}
          setStatus={setStatusFilter}
          financialYearFilter={financialYearFilter}
          setFinancialYearFilter={setFinancialYearFilter}
          setPage={setPage}
          total={total}
        />

        <ContractsTable
          contracts={contracts}
          loading={loading}
          onView={(c) => setViewContractId(c.id)}
          onEdit={(c) => router.push(`/sales-contracts/${c.id}/edit`)}
          onDelete={(c) => setDeleteTarget(c)}
          onDocuments={(c) => setDocContract(c)}
        />

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Cancel Contract"
        message={`Are you sure you want to cancel contract "${deleteTarget?.contractNumber}"? This action will change its status to Cancelled.`}
      />

      {/* Contract View Modal */}
      {viewContractId && (
        <ContractViewModal
          contractId={viewContractId}
          onClose={() => setViewContractId(null)}
        />
      )}

      {/* Document Upload Drawer */}
      {docContract && (
        <DocumentUploadDrawer
          contract={docContract}
          onClose={() => setDocContract(null)}
          onRefreshList={fetchContracts}
        />
      )}
    </div>
  );
}
