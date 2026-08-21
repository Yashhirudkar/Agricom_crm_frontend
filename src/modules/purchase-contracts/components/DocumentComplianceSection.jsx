import React, { useState } from "react";
import {
  FileCheck,
  FileText,
  Upload,
  Download,
  Trash2,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Eye,
} from "lucide-react";
import axiosClient from "@/lib/axios";
import { toast } from "sonner";

export default function DocumentComplianceSection({
  documents = [],
  loading,
  onUploadDocument,
  onDeleteDocument,
  onAddRequiredDocument,
  masterDocuments = [],
  uploading,
}) {
  const [selectedDocForUpload, setSelectedDocForUpload] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [selectedTradeDocId, setSelectedTradeDocId] = useState("");

  const handleDownload = async (attachmentId, filename, view = false) => {
    try {
      const url = `/attachments/${attachmentId}/download`;
      const response = await axiosClient.get(url, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));

      if (view) {
        window.open(blobUrl, '_blank');
      } else {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', filename || 'document');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }

      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    } catch (error) {
      toast.error("Failed to retrieve file.");
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center animate-pulse">
        <FileCheck className="h-8 w-8 text-teal-500 mx-auto mb-2 animate-bounce" />
        <span className="text-xs font-semibold text-gray-500">Loading customs & document compliance matrix...</span>
      </div>
    );
  }

  const uploadedCount = documents.filter((d) => d.uploaded).length;
  const totalCount = documents.length;
  const completionPct = totalCount > 0 ? Math.round((uploadedCount / totalCount) * 100) : 100;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedDocForUpload || !selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    onUploadDocument({
      tradeDocumentId: selectedDocForUpload.tradeDocument.id,
      formData,
      companyId: 1,
    });

    setSelectedDocForUpload(null);
    setSelectedFile(null);
  };

  const handleAddRequiredSubmit = (e) => {
    e.preventDefault();
    if (!selectedTradeDocId) return;
    onAddRequiredDocument(Number(selectedTradeDocId));
    setShowAddDocModal(false);
    setSelectedTradeDocId("");
  };

  const availableMasterDocs = masterDocuments.filter(
    (m) => !documents.some((d) => d.tradeDocument?.id === m.id)
  );

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Banner & Compliance Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-teal-600" />
            Customs & Trade Document Compliance ({uploadedCount}/{totalCount} Completed)
          </h3>
          <p className="text-[11px] text-gray-500">
            Operational trade documents checklist required for customs dispatch & bank negotiation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100 font-mono">
            {completionPct}% Compliant
          </span>
          {availableMasterDocs.length > 0 && (
            <button
              onClick={() => setShowAddDocModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Required Slot
            </button>
          )}
        </div>
      </div>

      {/* Visual Compliance Meter */}
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="bg-teal-500 h-full transition-all duration-500 rounded-full"
          style={{ width: `${completionPct}%` }}
        />
      </div>

      {/* Compliance Matrix Table */}
      <div className="border border-gray-200/90 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[9px]">
                <th className="px-4 py-3">Document Type</th>
                <th className="px-4 py-3">Compliance Status</th>
                <th className="px-4 py-3">Attached File</th>
                <th className="px-4 py-3">Upload Timestamp</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {documents.map((doc) => {
                const tdName = doc.tradeDocument?.name || "Trade Document";
                const isMandatory = doc.tradeDocument?.mandatoryByDefault;
                const isUploaded = doc.uploaded;
                const attachment = doc.attachment;

                return (
                  <tr key={doc.id} className="hover:bg-teal-50/30 transition-colors">
                    {/* Document Name */}
                    <td className="px-4 py-3.5 font-semibold text-gray-800">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span>{tdName}</span>
                        {isMandatory && (
                          <span className="text-[9px] font-bold uppercase text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.2 rounded">
                            Mandatory
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {isUploaded ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle2 className="h-3 w-3" />
                          Compliant
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle className="h-3 w-3" />
                          Pending File
                        </span>
                      )}
                    </td>

                    {/* File name */}
                    <td className="px-4 py-3 font-mono text-gray-600 max-w-[200px] truncate">
                      {attachment ? (
                        <span title={attachment.originalName} className="font-semibold text-gray-800">
                          {attachment.originalName}
                        </span>
                      ) : (
                        <span className="text-gray-300 italic">No file attached</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {doc.uploadedAt
                        ? new Date(doc.uploadedAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {isUploaded && attachment ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleDownload(attachment.id, attachment.originalName, true)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 font-semibold text-[11px]"
                              title="View Document"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>View</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownload(attachment.id, attachment.originalName, false)}
                              className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors flex items-center gap-1 font-semibold text-[11px]"
                              title="Download File"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>Download</span>
                            </button>
                            <button
                              onClick={() => onDeleteDocument(doc.tradeDocument.id)}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove File"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setSelectedDocForUpload(doc)}
                            className="px-3 py-1 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                          >
                            <Upload className="h-3.5 w-3.5" />
                            <span>Upload File</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {documents.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    <FileCheck className="h-8 w-8 mx-auto mb-2 text-gray-300 stroke-[1.2]" />
                    <p className="text-xs font-semibold text-gray-600">No trade document slots added</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Click "Add Required Slot" to attach customs checklist requirements.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload File Modal */}
      {selectedDocForUpload && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Upload className="h-4 w-4 text-teal-600" />
              Upload File: {selectedDocForUpload.tradeDocument?.name}
            </h3>
            <p className="text-xs text-gray-500">
              Select a PDF, PNG, JPG, or DOCX file (max 10MB).
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx"
                onChange={handleFileChange}
                className="w-full text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer border border-gray-200 rounded-xl p-1"
                required
              />

              {selectedFile && (
                <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <span className="font-bold text-gray-800">Selected:</span> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDocForUpload(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || uploading}
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {uploading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Upload File</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Required Document Modal */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Plus className="h-4 w-4 text-teal-600" />
              Add Required Trade Document Slot
            </h3>
            <p className="text-xs text-gray-500">
              Select a trade document type from master list.
            </p>

            <form onSubmit={handleAddRequiredSubmit} className="space-y-4">
              <select
                value={selectedTradeDocId}
                onChange={(e) => setSelectedTradeDocId(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium text-gray-800 focus:ring-2 focus:ring-teal-400 focus:outline-hidden"
                required
              >
                <option value="">-- Select Master Document --</option>
                {availableMasterDocs.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.mandatoryByDefault ? "(Mandatory)" : ""}
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedTradeDocId}
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors disabled:opacity-50"
                >
                  Add Document Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
