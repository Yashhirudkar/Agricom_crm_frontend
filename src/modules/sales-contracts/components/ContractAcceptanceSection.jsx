"use client";
import React, { useRef } from "react";
import { PenTool, Upload, Trash2 } from "lucide-react";

function ImageUploadBox({ label, value, onChange, disabled }) {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, etc.)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onChange(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      onClick={() => !disabled && !value && inputRef.current?.click()}
      className={`relative h-20 border-2 border-dashed rounded-xl flex items-center justify-center transition-all overflow-hidden ${
        value
          ? "border-emerald-300 bg-emerald-50/20"
          : disabled
          ? "border-gray-200 bg-gray-50/50 cursor-not-allowed"
          : "border-gray-200 bg-white hover:border-[#007aff] hover:bg-blue-50/20 cursor-pointer"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {value ? (
        <div className="relative w-full h-full p-2 flex items-center justify-center group">
          <img
            src={value}
            alt={label}
            className="max-h-full max-w-full object-contain"
            style={{ mixBlendMode: "multiply" }}
          />
          {!disabled && (
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="px-2 py-1 text-[10px] font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 shadow-sm"
              >
                Change
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
                className="px-2 py-1 text-[10px] font-semibold text-white bg-red-600 rounded hover:bg-red-700 shadow-sm flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" /> Clear
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1 text-center p-2">
          <Upload className="h-4 w-4 text-gray-400" />
          <span className="text-[10px] font-bold text-gray-600 uppercase">{label}</span>
          <span className="text-[8px] text-gray-400">Click to upload PNG / Image</span>
        </div>
      )}
    </div>
  );
}

export default function ContractAcceptanceSection({ form, setForm, isView }) {
  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const inputClass = isView 
    ? "w-full px-3 py-2 text-xs border border-transparent bg-transparent text-gray-900 font-medium" 
    : "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white transition-all";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <PenTool className="h-3.5 w-3.5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">Contract Acceptance</h2>
          <p className="text-[10px] text-gray-400">
            Signatures and execution details for Buyer and Seller
          </p>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seller Block */}
        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-4">
          <h3 className="text-xs font-bold text-gray-800 border-b border-gray-100 pb-2 mb-3">Accepted by Seller</h3>
          
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-gray-500">Company Name</label>
            <input 
              type="text" 
              value={form.sellerCompanyName || ""} 
              onChange={(e) => handleChange("sellerCompanyName", e.target.value)}
              disabled={isView}
              placeholder="e.g. Agricom International"
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-gray-500">Authorized Signatory</label>
            <input 
              type="text" 
              value={form.sellerAuthorizedSignatory || ""} 
              onChange={(e) => handleChange("sellerAuthorizedSignatory", e.target.value)}
              disabled={isView}
              placeholder="Full Name"
              className={inputClass}
            />
          </div>
          
          {/* Digital signature / seal uploads */}
          <div className="pt-4 mt-2 border-t border-gray-100/60 grid grid-cols-2 gap-3">
             <ImageUploadBox
               label="Signature Area"
               value={form.sellerSignature || ""}
               onChange={(val) => handleChange("sellerSignature", val)}
               disabled={isView}
             />
             <ImageUploadBox
               label="Company Seal"
               value={form.sellerCompanySeal || ""}
               onChange={(val) => handleChange("sellerCompanySeal", val)}
               disabled={isView}
             />
          </div>
        </div>

        {/* Buyer Block */}
        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-4">
          <h3 className="text-xs font-bold text-gray-800 border-b border-gray-100 pb-2 mb-3">Accepted by Buyer</h3>
          
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-gray-500">Company Name</label>
            <input 
              type="text" 
              value={form.buyerCompanyName || ""} 
              onChange={(e) => handleChange("buyerCompanyName", e.target.value)}
              disabled={isView}
              placeholder="Buyer Company Name"
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-gray-500">Authorized Signatory</label>
            <input 
              type="text" 
              value={form.buyerAuthorizedSignatory || ""} 
              onChange={(e) => handleChange("buyerAuthorizedSignatory", e.target.value)}
              disabled={isView}
              placeholder="Full Name"
              className={inputClass}
            />
          </div>

          {/* Digital signature / seal uploads */}
          <div className="pt-4 mt-2 border-t border-gray-100/60 grid grid-cols-2 gap-3">
             <ImageUploadBox
               label="Signature Area"
               value={form.buyerSignature || ""}
               onChange={(val) => handleChange("buyerSignature", val)}
               disabled={isView}
             />
             <ImageUploadBox
               label="Company Seal"
               value={form.buyerCompanySeal || ""}
               onChange={(val) => handleChange("buyerCompanySeal", val)}
               disabled={isView}
             />
          </div>
        </div>
      </div>
    </div>
  );
}
