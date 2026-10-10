"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
import { ChevronLeft, FileCheck, Check, AlertCircle } from "lucide-react";
import { useEnquiries, useEnquiriesMasters } from "@/modules/enquiries/hooks/useEnquiries";
import EnquiriesTable from "@/modules/enquiries/components/EnquiriesTable";
import EnquiriesFilter from "@/modules/enquiries/components/EnquiriesFilter";
import Pagination from "@/components/common/Pagination";
import { purchaseContractApi } from "@/modules/purchase-contracts/services/purchaseContractApi";
import EnquiryDrawer from "@/modules/enquiries/components/EnquiryDrawer";
import LoadingPointsDrawer from "@/modules/enquiries/components/LoadingPointsDrawer";
import TransportDrawer from "@/modules/logistics/components/TransportDrawer";

export default function ConfirmedOrdersPage() {
  const router = useRouter();
  const activeCompanyId = useSelector(selectActiveCompanyId) || "";

  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("SALES"); // "SALES" | "PURCHASE"
  const [createdBy, setCreatedBy] = useState("");
  const [productId, setProductId] = useState("");

  // Form Drawer states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editEnquiry, setEditEnquiry] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  // Transport & Loading Points Drawer states
  const [transportEnquiry, setTransportEnquiry] = useState(null);
  const [loadingPointsEnquiry, setLoadingPointsEnquiry] = useState(null);

  // The Purchase Contract tab requires an existing Sales Contract and no linked Purchase Contract.
  const isSalesTab = activeTab === "SALES";
  const confirmedQuery = useEnquiries(
    activeCompanyId,
    "CONFIRMED",
    search,
    isSalesTab, // withoutSalesContract
    !isSalesTab, // withoutPurchaseContract
    createdBy,
    productId,
  );
  const { masters } = useEnquiriesMasters();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleExecute = async (enquiry) => {
    if (isSalesTab) {
      router.push(`/sales-contracts/new?enquiryId=${enquiry.id}`);
      return;
    }

    if (!enquiry.salesContractId) {
      showToast("This enquiry has no linked Sales Contract for Purchase Contract creation.", "error");
      return;
    }

    try {
      const response = await purchaseContractApi.create({
        salesContractId: enquiry.salesContractId,
      });
      const purchaseContract = response.data?.data || response.data;
      await confirmedQuery.fetchEnquiries();
      if (!purchaseContract?.id) {
        showToast("Purchase Contract was created but its workspace could not be opened.", "error");
        return;
      }
      router.push(`/sales/purchase-contracts/${purchaseContract.id}`);
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Failed to create Purchase Contract",
        "error",
      );
      await confirmedQuery.fetchEnquiries();
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}>
          {toast.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/sales-contracts")}
            className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FileCheck className="h-6 w-6 text-[#007aff]" />
              Confirmed Orders
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-1">
              View confirmed orders that are waiting to be converted into contracts.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-100 flex gap-6 px-6 bg-gray-50/50">
          <button
            onClick={() => setActiveTab("SALES")}
            className={`pb-4 pt-5 text-sm font-semibold transition-colors relative ${activeTab === "SALES"
                ? "text-[#007aff]"
                : "text-gray-500 hover:text-gray-900"
              }`}
          >
            Sales Contract
            {activeTab === "SALES" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#007aff] rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("PURCHASE")}
            className={`pb-4 pt-5 text-sm font-semibold transition-colors relative ${activeTab === "PURCHASE"
                ? "text-[#007aff]"
                : "text-gray-500 hover:text-gray-900"
              }`}
          >
            Purchase Contract
            {activeTab === "PURCHASE" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#007aff] rounded-t-full" />
            )}
          </button>
        </div>

        {/* Filters */}
        <EnquiriesFilter
          search={search}
          setSearch={setSearch}
          createdBy={createdBy}
          setCreatedBy={setCreatedBy}
          productId={productId}
          setProductId={setProductId}
          masters={masters}
          setPage={confirmedQuery.setPage}
          total={confirmedQuery.total}
        />

        <EnquiriesTable
          isOrderMode={true}
          enquiries={confirmedQuery.enquiries}
          loading={confirmedQuery.loading}
          onFollowUp={() => { }}
          onOpenTransport={(e) => setTransportEnquiry(e)}
          onOpenLoadingPoints={(e) => setLoadingPointsEnquiry(e)}
          onExecute={handleExecute}
          onView={(e) => {
            setEditEnquiry(e);
            setIsViewMode(true);
            setIsFormOpen(true);
          }}
          onEdit={(e) => {
            setEditEnquiry(e);
            setIsViewMode(false);
            setIsFormOpen(true);
          }}
        />

        <Pagination
          currentPage={confirmedQuery.page}
          totalPages={confirmedQuery.totalPages}
          onPageChange={confirmedQuery.setPage}
        />
      </div>

      {/* Enquiry View/Edit Drawer */}
      <EnquiryDrawer
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditEnquiry(null);
        }}
        editData={editEnquiry}
        isViewMode={isViewMode}
        onSaveSuccess={() => {
          confirmedQuery.fetchEnquiries();
          showToast("Order updated successfully");
        }}
      />

      {/* Transport Drawer (View Only Mode) */}
      <TransportDrawer
        isOpen={transportEnquiry !== null}
        onClose={() => setTransportEnquiry(null)}
        enquiry={transportEnquiry}
        isReadOnly={true}
      />

      {/* Loading Points Drawer */}
      <LoadingPointsDrawer
        isOpen={loadingPointsEnquiry !== null}
        onClose={() => setLoadingPointsEnquiry(null)}
        enquiry={loadingPointsEnquiry}
      />
    </div>
  );
}
