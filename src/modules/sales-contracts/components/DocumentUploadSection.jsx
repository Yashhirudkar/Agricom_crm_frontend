"use client";
import React, { useState, useEffect, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, Trash2, RefreshCw, Download, Eye, AlertCircle, Loader2 } from "lucide-react";
import { salesContractApi } from "../services/salesContractApi";
import axiosClient from "@/lib/axios";
import { toast } from "sonner";

export default function DocumentUploadSection({ contractId, isView, selectedDocuments = [], tradeDocumentsMaster = [], onUploadedChange }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({});
  const [error, setError] = useState(null);
  
  // Create hidden file inputs for each document dynamically using refs
  const fileInputRefs = useRef({});

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await salesContractApi.getDocuments(contractId);
      setDocuments(res.data);
      if (onUploadedChange) {
        const uploadedIds = res.data
          .filter(d => d.uploaded)
          .map(d => d.tradeDocument.id);
        onUploadedChange(uploadedIds);
      }
      setError(null);
    } catch (err) {
      setError("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  const getRenderedDocuments = () => {
    if (selectedDocuments && selectedDocuments.length > 0) {
      return selectedDocuments.map(selDoc => {
        const docId = selDoc.tradeDocumentId;
        const masterDoc = tradeDocumentsMaster?.find(d => d.id === docId);
        const backendDoc = documents.find(d => d.tradeDocument?.id === docId);
        
        return {
          tradeDocument: {
            id: docId,
            name: masterDoc?.name || backendDoc?.tradeDocument?.name || `Document #${docId}`,
            mandatoryByDefault: masterDoc?.mandatoryByDefault ?? selDoc.isMandatory ?? backendDoc?.tradeDocument?.mandatoryByDefault ?? false,
          },
          uploaded: backendDoc ? backendDoc.uploaded : false,
          attachment: backendDoc ? backendDoc.attachment : null,
        };
      });
    }
    return documents;
  };

  useEffect(() => {
    if (contractId) {
      fetchDocuments();
    }
  }, [contractId]);

  const handleUploadClick = (tradeDocumentId) => {
    if (fileInputRefs.current[tradeDocumentId]) {
      fileInputRefs.current[tradeDocumentId].click();
    }
  };

  const onFileChange = async (e, tradeDocumentId) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset input so the same file can be selected again if needed
    e.target.value = null;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setProgress(prev => ({ ...prev, [tradeDocumentId]: 1 }));
      await salesContractApi.uploadDocument(contractId, tradeDocumentId, formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(prev => ({ ...prev, [tradeDocumentId]: percentCompleted }));
      });
      // Clear progress after success
      setProgress(prev => ({ ...prev, [tradeDocumentId]: null }));
      // Refetch
      fetchDocuments();
    } catch (err) {
      setProgress(prev => ({ ...prev, [tradeDocumentId]: null }));
      toast.error(`Upload failed for ${file.name}`);
    }
  };

  const handleDelete = async (tradeDocumentId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await salesContractApi.deleteDocument(contractId, tradeDocumentId);
      toast.success("Document deleted successfully");
      fetchDocuments();
    } catch (err) {
      toast.error("Failed to delete document.");
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDownload = async (url, filename, view = false) => {
    try {
      const response = await axiosClient.get(url, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
      
      if (view) {
        window.open(blobUrl, '_blank');
      } else {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }
      
      // Cleanup blob url after a delay
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    } catch (error) {
      toast.error("Failed to retrieve file.");
    }
  };

  if (loading && documents.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6 flex justify-center">
        <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
      </div>
    );
  }

  const renderedDocs = getRenderedDocuments();

  if (renderedDocs.length === 0) {
    return null; // Don't show the section if no documents are mapped to this contract
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden mt-4">
      <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2">
          <UploadCloud className="h-4 w-4 text-gray-500" />
          <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Document Uploads</h2>
        </div>
        <p className="text-[10px] text-gray-400">Manage required files for this contract</p>
      </div>

      <div className="p-1">
        {error && <p className="text-xs text-red-500 p-3 pb-1">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-2 w-1/3">Document Name</th>
                <th className="px-4 py-2 w-28 text-center">Status</th>
                <th className="px-4 py-2">File Details</th>
                <th className="px-4 py-2 w-48 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {renderedDocs.map((docMapping) => {
                const { tradeDocument, uploaded, attachment } = docMapping;
                const uploadProgress = progress[tradeDocument.id];
                const isUploading = uploadProgress !== undefined && uploadProgress !== null;

                return (
                  <tr key={tradeDocument.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Document Name */}
                    <td className="px-4 py-2 font-medium text-gray-700">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="truncate" title={tradeDocument.name}>{tradeDocument.name}</span>
                        {tradeDocument.mandatoryByDefault && (
                          <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1 py-0.2 rounded border border-red-100 flex-shrink-0">
                            Required
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-2 text-center whitespace-nowrap">
                      {isUploading ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] text-[#007aff] font-bold">
                          <Loader2 className="h-3 w-3 animate-spin text-[#007aff]" />
                          <span>{uploadProgress}%</span>
                        </span>
                      ) : uploaded ? (
                        <span className="inline-flex items-center gap-1 text-[9px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded-md border border-green-100">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          Uploaded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] text-gray-500 font-semibold bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-100">
                          <AlertCircle className="h-3 w-3 text-gray-400" />
                          Pending
                        </span>
                      )}
                    </td>

                    {/* File Details */}
                    <td className="px-4 py-2">
                      {isUploading ? (
                        <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#007aff] transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      ) : uploaded ? (
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-600 max-w-[280px]">
                          <FileText className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate font-medium text-gray-650">{attachment?.originalName || "file"}</span>
                          {attachment && (
                            <span className="text-[9px] text-gray-400 font-normal flex-shrink-0">
                              ({formatSize(attachment.fileSize)})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[10px] italic">No file uploaded</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-2 text-right">
                      {uploaded ? (
                        <div className="flex items-center justify-end gap-1">
                          {attachment && (
                            <>
                              <button 
                                onClick={() => handleDownload(attachment.downloadUrl, attachment.originalName, true)}
                                className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-1 h-6"
                                title="View document"
                              >
                                <Eye className="h-2.5 w-2.5" /> View
                              </button>
                              <button 
                                onClick={() => handleDownload(attachment.downloadUrl, attachment.originalName, false)}
                                className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-1 h-6"
                                title="Download file"
                              >
                                <Download className="h-2.5 w-2.5" /> Save
                              </button>
                            </>
                          )}
                          {!isView && (
                            <>
                              <button
                                onClick={() => handleUploadClick(tradeDocument.id)}
                                className="px-2 py-1 bg-white border border-blue-200 text-[#007aff] hover:bg-blue-50 rounded text-[10px] font-semibold transition-colors flex items-center gap-1 h-6"
                                title="Replace file"
                              >
                                <RefreshCw className="h-2.5 w-2.5" /> Replace
                              </button>
                              <button
                                onClick={() => handleDelete(tradeDocument.id)}
                                className="p-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded transition-colors flex items-center justify-center h-6 w-6"
                                title="Delete file"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <div>
                          {isView ? (
                            <span className="text-[10px] text-gray-400 font-semibold italic">Missing File</span>
                          ) : (
                            <button
                              onClick={() => handleUploadClick(tradeDocument.id)}
                              className="px-2.5 py-1 border border-dashed border-gray-300 rounded text-[10px] font-semibold text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center gap-1 ml-auto h-[26px]"
                            >
                              <UploadCloud className="h-3 w-3 text-gray-400" />
                              Choose File
                            </button>
                          )}
                        </div>
                      )}

                      {/* Hidden Input */}
                      {!isView && (
                        <input
                          type="file"
                          ref={el => fileInputRefs.current[tradeDocument.id] = el}
                          style={{ display: "none" }}
                          onChange={(e) => onFileChange(e, tradeDocument.id)}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
