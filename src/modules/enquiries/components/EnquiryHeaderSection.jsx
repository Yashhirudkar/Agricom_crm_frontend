"use client";
import React from "react";
import { FileText, AlignLeft } from "lucide-react";

export default function EnquiryHeaderSection({ form, setForm, errors, isView }) {
  const inp = "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white transition-all";
  const lbl = "block text-[11px] font-semibold text-gray-600 mb-1.5";
  const err = "text-[10px] text-red-500 mt-1";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
          <FileText className="h-3.5 w-3.5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">Basic Information</h2>
          <p className="text-[10px] text-gray-400">Enquiry identification and dates</p>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className={lbl}>Enquiry No. <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={form.enquiryNo}
            disabled
            placeholder="Auto-generated"
            className={`${inp} bg-gray-50 text-gray-500 font-medium`}
          />
        </div>
        
        <div>
          <label className={lbl}>Enquiry Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            value={form.enquiryDate}
            onChange={e => setForm(f => ({ ...f, enquiryDate: e.target.value }))}
            disabled={isView}
            className={`${inp} ${errors.enquiryDate ? "border-red-300" : ""}`}
          />
          {errors.enquiryDate && <p className={err}>{errors.enquiryDate}</p>}
        </div>


        

      </div>
    </div>
  );
}
