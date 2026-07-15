"use client";
import React from "react";
import { MessageSquare } from "lucide-react";

export default function RemarksSection({ form, setForm, isView }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="h-3.5 w-3.5 text-gray-500" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">Remarks</h2>
          <p className="text-[10px] text-gray-400">Additional notes or contract conditions</p>
        </div>
      </div>
      <div className="p-5">
        <textarea
          rows={4}
          value={form.remarks || ""}
          onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
          disabled={isView}
          placeholder="Enter any additional remarks, special terms, or conditions..."
          className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white resize-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
        />
      </div>
    </div>
  );
}
