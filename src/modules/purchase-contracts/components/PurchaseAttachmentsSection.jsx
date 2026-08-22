import React, { useState } from "react";
import { Paperclip, Upload, FileText, Download, Trash2, Eye } from "lucide-react";
import axiosClient from "@/lib/axios";
import { toast } from "sonner";

export default function PurchaseAttachmentsSection({
  attachments = [],
  onUploadAttachment,
  onDeleteAttachment,
  isView = false,
}) {
  const [fileCategory, setFileCategory] = useState("Contract PDF");
  const [selectedFile, setSelectedFile] = useState(null);

  const categories = [
    "Attach Contract PDF",
    "Attach Invoice",
    "Attach Supplier Quote",
    "Other Document",
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile || !onUploadAttachment) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("category", fileCategory);

    onUploadAttachment(formData);
    setSelectedFile(null);
  };

  const handleDownload = async (attId, filename, view = false) => {
    try {
      const url = `/attachments/${attId}/download`;
      const response = await axiosClient.get(url, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));

      if (view) {
        window.open(blobUrl, '_blank');
      } else {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', filename || 'attachment');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }

      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    } catch (error) {
      toast.error("Failed to retrieve file.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
            <Paperclip className="h-3.5 w-3.5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Contract Attachments</h2>
            <p className="text-[10px] text-gray-400">
              Attach Contract PDF, Supplier Invoices, and Quotes
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded">
          {attachments.length} File{attachments.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Upload bar */}
        {!isView && (
          <form
            onSubmit={handleUploadSubmit}
            className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row items-center gap-3"
          >
            <select
              value={fileCategory}
              onChange={(e) => setFileCategory(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx"
              className="flex-1 text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer border border-gray-200 rounded-xl p-1 bg-white cursor-pointer"
              required
            />

            <button
              type="submit"
              disabled={!selectedFile}
              className="cursor-pointer px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors disabled:opacity-40 flex items-center gap-1.5 flex-shrink-0"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Attach File</span>
            </button>
          </form>
        )}

        {/* Files List */}
        <div className="space-y-2">
          {attachments.map((att, idx) => (
            <div
              key={att.id || idx}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-all text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 truncate">
                    {att.originalName || att.name || "Attachment"}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {att.category || "Document"} • {(att.fileSize ? att.fileSize / 1024 : 0).toFixed(1)} KB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {att.id && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleDownload(att.id, att.originalName || att.name, true)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 font-semibold text-[11px]"
                      title="View document"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(att.id, att.originalName || att.name, false)}
                      className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-1 font-semibold text-[11px]"
                      title="Download file"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </button>
                  </>
                )}
                {!isView && onDeleteAttachment && (
                  <button
                    type="button"
                    onClick={() => onDeleteAttachment(att.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete attachment"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {attachments.length === 0 && (
            <div className="text-center py-6 text-gray-400 text-xs italic">
              No files attached to this contract yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
