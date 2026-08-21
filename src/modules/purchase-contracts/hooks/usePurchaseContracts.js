"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseContractApi } from "../services/purchaseContractApi";
import { toast } from "sonner";

export function usePurchaseContractDashboard() {
  return useQuery({
    queryKey: ["purchase-contracts", "dashboard"],
    queryFn: async () => {
      const res = await purchaseContractApi.getDashboard();
      return res.data;
    },
    staleTime: 30000,
  });
}

export function usePurchaseContractsList(params = {}) {
  return useQuery({
    queryKey: ["purchase-contracts", "list", params],
    queryFn: async () => {
      const res = await purchaseContractApi.getAll(params);
      return res.data;
    },
    staleTime: 15000,
  });
}

export function usePurchaseContractDetail(id) {
  return useQuery({
    queryKey: ["purchase-contracts", id, "detail"],
    queryFn: async () => {
      if (!id) return null;
      const res = await purchaseContractApi.getOne(id);
      return res.data;
    },
    enabled: !!id,
    staleTime: 10000,
  });
}

export function usePurchaseContractSummary(id) {
  return useQuery({
    queryKey: ["purchase-contracts", id, "summary"],
    queryFn: async () => {
      if (!id) return null;
      const res = await purchaseContractApi.getSummary(id);
      return res.data;
    },
    enabled: !!id,
    staleTime: 10000,
  });
}

export function usePurchaseContractTimeline(id) {
  return useQuery({
    queryKey: ["purchase-contracts", id, "timeline"],
    queryFn: async () => {
      if (!id) return [];
      const res = await purchaseContractApi.getTimeline(id);
      return res.data || [];
    },
    enabled: !!id,
    staleTime: 10000,
  });
}

export function usePurchaseContractShipments(id) {
  return useQuery({
    queryKey: ["purchase-contracts", id, "shipments"],
    queryFn: async () => {
      if (!id) return [];
      const res = await purchaseContractApi.getShipments(id);
      return res.data || [];
    },
    enabled: !!id,
    staleTime: 10000,
  });
}

export function usePurchaseContractDocuments(id) {
  return useQuery({
    queryKey: ["purchase-contracts", id, "documents"],
    queryFn: async () => {
      if (!id) return [];
      const res = await purchaseContractApi.getDocuments(id);
      return res.data || [];
    },
    enabled: !!id,
    staleTime: 10000,
  });
}

export function usePurchaseContractActivity(id, page = 1) {
  return useQuery({
    queryKey: ["purchase-contracts", id, "activity", page],
    queryFn: async () => {
      if (!id) return { data: [], total: 0 };
      const res = await purchaseContractApi.getActivity(id, { page, limit: 20 });
      return res.data;
    },
    enabled: !!id,
    staleTime: 10000,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// MUTATIONS
// ─────────────────────────────────────────────────────────────────────────────

export function useCreatePurchaseContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => purchaseContractApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-contracts"] });
      toast.success("Purchase Contract operational workspace ready");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to initialize Purchase Contract workspace");
    },
  });
}

export function useUpdatePurchaseContractStatus(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status) => purchaseContractApi.updateStatus(id, status),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["purchase-contracts", id] });
      queryClient.invalidateQueries({ queryKey: ["purchase-contracts", "list"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-contracts", "dashboard"] });
      toast.success(`Purchase contract status updated to "${res.data?.status || 'updated'}"`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update status");
    },
  });
}

export function useAddPurchaseContractShipment(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shipmentId) => purchaseContractApi.addShipment(id, shipmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-contracts", id] });
      toast.success("Shipment linked to Purchase Contract successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to link shipment");
    },
  });
}

export function useRemovePurchaseContractShipment(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shipmentId) => purchaseContractApi.removeShipment(id, shipmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-contracts", id] });
      toast.success("Shipment unlinked from Purchase Contract");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to unlink shipment");
    },
  });
}

export function useAddRequiredDocument(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tradeDocumentId) => purchaseContractApi.addRequiredDocument(id, tradeDocumentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-contracts", id, "documents"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-contracts", id, "summary"] });
      toast.success("Required document added to checklist");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add required document");
    },
  });
}

export function useUploadPurchaseContractDocument(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tradeDocumentId, formData, companyId }) =>
      purchaseContractApi.uploadDocument(id, tradeDocumentId, formData, companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-contracts", id] });
      toast.success("Document uploaded successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to upload document");
    },
  });
}

export function useDeletePurchaseContractDocument(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tradeDocumentId) => purchaseContractApi.deleteDocument(id, tradeDocumentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-contracts", id] });
      toast.success("Document upload removed");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to remove document");
    },
  });
}

export function usePurchaseContractAttachments(id) {
  return useQuery({
    queryKey: ["purchase-contracts", id, "attachments"],
    queryFn: async () => {
      if (!id) return [];
      const res = await purchaseContractApi.getAttachments(id);
      return res.data || [];
    },
    enabled: !!id,
    staleTime: 10000,
  });
}

export function useUploadPurchaseContractAttachment(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => purchaseContractApi.uploadAttachment(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-contracts", id, "attachments"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-contracts", id, "detail"] });
      toast.success("Attachment uploaded successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to upload attachment");
    },
  });
}

export function useDeletePurchaseContractAttachment(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attachmentId) => purchaseContractApi.deleteAttachment(id, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-contracts", id, "attachments"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-contracts", id, "detail"] });
      toast.success("Attachment removed successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to remove attachment");
    },
  });
}

