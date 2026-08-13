"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Download,
  Eye,
  AlertCircle,
  Loader2,
  X,
  FolderOpen,
} from "lucide-react";
import { salesContractApi } from "../services/salesContractApi";
import axiosClient from "@/lib/axios";
import { toast } from "sonner";

// ─── Tooltip ─────────────────────────────────────────────────────────────────
function Tip({ label, children }) {
  return (
    <div className="relative group/t inline-flex">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-semibold text-white shadow-lg opacity-0 scale-95 transition-all duration-150 group-hover/t:opacity-100 group-hover/t:scale-100 z-[200]">
        {label}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}

// ─── Icon action button ───────────────────────────────────────────────────────
function ActionBtn({ onClick, title, colorClass, icon, disabled = false }) {
  return (
    <Tip label={title}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`p-1.5 rounded-lg transition-colors text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed ${colorClass}`}
      >
        {icon}
      </button>
    </Tip>
  );
}

// ─── Confirm delete dialog ────────────────────────────────────────────────────
function ConfirmDialog({ open, docName, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-[300] flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-5 max-w-xs w-full mx-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
            <Trash2 className="h-3.5 w-3.5 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Delete File</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Delete <span className="font-semibold text-gray-700">"{docName}"</span>? This cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-3 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Drawer ──────────────────────────────────────────────────────────────
export default function DocumentUploadDrawer({ contract, onClose, onRefreshList }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({});
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const fileInputRefs = useRef({});

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await salesContractApi.getDocuments(contract.id);
      setDocuments(res.data);
      setError(null);
    } catch {
      setError("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract?.id) fetchDocuments();
  }, [contract?.id]);

  // ── Upload ─────────────────────────────────────────────────────────────────
  const handleUploadClick = (tradeDocumentId) => {
    fileInputRefs.current[tradeDocumentId]?.click();
  };

  const onFileChange = async (e, tradeDocumentId) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = null;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setProgress((prev) => ({ ...prev, [tradeDocumentId]: 1 }));
      await salesContractApi.uploadDocument(contract.id, tradeDocumentId, formData, (ev) => {
        const pct = Math.round((ev.loaded * 100) / ev.total);
        setProgress((prev) => ({ ...prev, [tradeDocumentId]: pct }));
      });
      setProgress((prev) => ({ ...prev, [tradeDocumentId]: null }));
      toast.success("Document uploaded successfully");
      fetchDocuments();
      onRefreshList?.();
    } catch {
      setProgress((prev) => ({ ...prev, [tradeDocumentId]: null }));
      toast.error(`Upload failed for ${file.name}`);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await salesContractApi.deleteDocument(contract.id, deleteTarget.tradeDocumentId);
      toast.success("Document deleted");
      setDeleteTarget(null);
      fetchDocuments();
      onRefreshList?.();
    } catch {
      toast.error("Failed to delete document.");
    }
  };

  // ── Download / View ────────────────────────────────────────────────────────
  const handleDownload = async (url, filename, view = false) => {
    try {
      const response = await axiosClient.get(url, { responseType: "blob" });
      const blobUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: response.headers["content-type"] })
      );
      if (view) {
        window.open(blobUrl, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    } catch {
      toast.error("Failed to retrieve file.");
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const formatSize = (bytes) => {
    if (!bytes) return "";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
      });
    } catch { return null; }
  };

  const uploadedCount = documents.filter((d) => d.uploaded).length;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[150] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-[160] w-full max-w-2xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Confirm dialog overlay */}
        <div className="relative flex flex-col h-full">
          <ConfirmDialog
            open={!!deleteTarget}
            docName={deleteTarget?.name}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <FolderOpen className="h-4.5 w-4.5 text-[#007aff]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-gray-900">Document Uploads</h2>
                  {!loading && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
                      uploadedCount === documents.length && documents.length > 0
                        ? "bg-green-50 text-green-600 border-green-200"
                        : "bg-amber-50 text-amber-600 border-amber-200"
                    }`}>
                      {uploadedCount} / {documents.length} uploaded
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Contract <span className="font-bold text-gray-600">{contract?.contractNumber}</span>
                  {contract?.shipments?.length > 0 && (
                    <> · <span className="text-gray-500 underline decoration-dotted cursor-help" title={contract.shipments.map(s => s.shipmentReference || "—").join('\n')}>Shipments: {contract.shipments.length}</span></>
                  )}
                  {contract?.buyer?.name && (
                    <> · <span className="text-gray-500">{contract.buyer.name || contract.buyer.entityName}</span></>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 text-gray-300 animate-spin" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <AlertCircle className="h-8 w-8 text-red-300 mb-3" />
                <p className="text-sm font-semibold text-gray-600">{error}</p>
                <button onClick={fetchDocuments} className="mt-3 text-xs text-[#007aff] font-semibold hover:underline">
                  Try again
                </button>
              </div>
            ) : documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                  <FolderOpen className="h-7 w-7 text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-600">No documents assigned</p>
                <p className="text-xs text-gray-400 mt-1">This contract has no trade documents configured.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {documents.map((docMapping) => {
                  const { tradeDocument, uploaded, attachment } = docMapping;
                  const uploadProgress = progress[tradeDocument.id];
                  const isUploading = uploadProgress !== undefined && uploadProgress !== null;
                  const uploadDate =
                    formatDate(attachment?.createdAt) ||
                    formatDate(attachment?.uploadedAt) ||
                    formatDate(attachment?.created_at);

                  return (
                    <div
                      key={tradeDocument.id}
                      className="px-5 py-4 hover:bg-gray-50/60 transition-colors group"
                    >
                      <div className="flex items-center justify-between gap-4">
                        {/* Left — doc info */}
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Icon */}
                          <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center border ${
                            uploaded
                              ? "bg-green-50 border-green-100"
                              : "bg-gray-50 border-gray-100"
                          }`}>
                            <FileText className={`h-4 w-4 ${uploaded ? "text-green-500" : "text-gray-300"}`} />
                          </div>

                          {/* Details */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-semibold text-gray-800 truncate max-w-[260px]" title={tradeDocument.name}>
                                {tradeDocument.name}
                              </span>
                              {tradeDocument.mandatoryByDefault && (
                                <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1 py-0.5 rounded border border-red-100 flex-shrink-0">
                                  Required
                                </span>
                              )}
                            </div>

                            {/* Status line */}
                            {isUploading ? (
                              <div className="mt-1.5 flex items-center gap-2">
                                <div className="h-1 w-28 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#007aff] transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                  />
                                </div>
                                <span className="text-[10px] text-[#007aff] font-bold">{uploadProgress}%</span>
                              </div>
                            ) : uploaded && attachment ? (
                              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-gray-400">
                                <span className="font-medium text-gray-600 truncate max-w-[200px]">
                                  {attachment.originalName}
                                </span>
                                {attachment.fileSize && (
                                  <><span className="text-gray-300">·</span><span>{formatSize(attachment.fileSize)}</span></>
                                )}
                                {uploadDate && (
                                  <><span className="text-gray-300">·</span><span>Uploaded {uploadDate}</span></>
                                )}
                              </div>
                            ) : (
                              <p className="mt-1 text-[10px] text-gray-400 italic">No file uploaded</p>
                            )}
                          </div>
                        </div>

                        {/* Right — status + actions */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {/* Status badge */}
                          {isUploading ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-[#007aff] font-bold">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Uploading
                            </span>
                          ) : uploaded ? (
                            <span className="inline-flex items-center gap-1 text-[9px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded-md border border-green-100 whitespace-nowrap">
                              <CheckCircle2 className="h-3 w-3" />
                              Uploaded
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] text-gray-500 font-semibold bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-100 whitespace-nowrap">
                              <AlertCircle className="h-3 w-3 text-gray-400" />
                              Pending
                            </span>
                          )}

                          {/* Action icons */}
                          <div className="flex items-center gap-0.5">
                            {/* View */}
                            {uploaded && attachment && (
                              <ActionBtn
                                title="View"
                                colorClass="hover:text-[#007aff] hover:bg-blue-50"
                                icon={<Eye className="h-3.5 w-3.5" />}
                                onClick={() => handleDownload(attachment.downloadUrl, attachment.originalName, true)}
                              />
                            )}
                            {/* Download */}
                            {uploaded && attachment && (
                              <ActionBtn
                                title="Download"
                                colorClass="hover:text-emerald-600 hover:bg-emerald-50"
                                icon={<Download className="h-3.5 w-3.5" />}
                                onClick={() => handleDownload(attachment.downloadUrl, attachment.originalName, false)}
                              />
                            )}
                            {/* Upload / Replace */}
                            <ActionBtn
                              title={uploaded ? "Replace" : "Upload"}
                              colorClass={uploaded ? "hover:text-amber-600 hover:bg-amber-50" : "hover:text-[#007aff] hover:bg-blue-50"}
                              icon={uploaded ? <RefreshCw className="h-3.5 w-3.5" /> : <UploadCloud className="h-3.5 w-3.5" />}
                              onClick={() => handleUploadClick(tradeDocument.id)}
                            />
                            {/* Delete */}
                            {uploaded && (
                              <ActionBtn
                                title="Delete"
                                colorClass="hover:text-red-500 hover:bg-red-50"
                                icon={<Trash2 className="h-3.5 w-3.5" />}
                                onClick={() =>
                                  setDeleteTarget({
                                    tradeDocumentId: tradeDocument.id,
                                    name: attachment?.originalName || tradeDocument.name,
                                  })
                                }
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Hidden file input */}
                      <input
                        type="file"
                        ref={(el) => (fileInputRefs.current[tradeDocument.id] = el)}
                        style={{ display: "none" }}
                        onChange={(e) => onFileChange(e, tradeDocument.id)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 px-5 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between">
            <p className="text-[10px] text-gray-400">
              {!loading && `${uploadedCount} of ${documents.length} documents uploaded`}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
