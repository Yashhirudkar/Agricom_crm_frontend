"use client";
import React from "react";
import { FileCheck2 } from "lucide-react";

export default function DocumentSection({ form, setForm, masters, isView, uploadedDocIds = [] }) {
  const selected = form.documents || [];

  const toggle = (doc) => {
    if (isView) return;
    const exists = selected.find(d => d.tradeDocumentId === doc.id);
    if (exists) {
      // Do not allow deselection if a file is already uploaded
      if (uploadedDocIds.includes(doc.id)) return;
      setForm(f => ({ ...f, documents: (f.documents || []).filter(d => d.tradeDocumentId !== doc.id) }));
    } else {
      setForm(f => ({
        ...f,
        documents: [...(f.documents || []), {
          tradeDocumentId: doc.id,
          isMandatory: doc.mandatoryByDefault || false,
          remarks: "",
        }],
      }));
    }
  };

  const isSelected = (docId) => selected.some(d => d.tradeDocumentId === docId);
  const isUploaded = (docId) => uploadedDocIds.includes(docId);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <FileCheck2 className="h-3.5 w-3.5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">Trade Documents</h2>
          <p className="text-[10px] text-gray-400">Select required documents for this contract · {selected.length} selected</p>
        </div>
      </div>

      <div className="p-5">
        {masters.tradeDocuments.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No trade documents found in master data.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {masters.tradeDocuments.map(doc => {
              const checked = isSelected(doc.id);
              const hasFile = isUploaded(doc.id);
              return (
                <label
                  key={doc.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                    isView || hasFile ? "cursor-not-allowed opacity-75" : "cursor-pointer"
                  } ${
                    checked
                      ? "bg-blue-50 border-[#007aff]/30 shadow-xs"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  title={hasFile ? "Delete the uploaded file below first to deselect this document" : ""}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(doc)}
                    disabled={isView || hasFile}
                    className="mt-0.5 h-3.5 w-3.5 rounded accent-[#007aff] flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold leading-tight ${checked ? "text-[#007aff]" : "text-gray-700"}`}>
                      {doc.name}
                    </p>
                    {doc.description && (
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{doc.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      {doc.mandatoryByDefault && (
                        <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-100">
                          Mandatory
                        </span>
                      )}
                      {hasFile && (
                        <span className="text-[9px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-150">
                          File Uploaded
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
