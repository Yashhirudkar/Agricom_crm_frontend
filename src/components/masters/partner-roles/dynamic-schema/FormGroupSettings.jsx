import React from "react";
import { Info } from "lucide-react";

export default function FormGroupSettings({ configName, setConfigName, changeNote, setChangeNote }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-1">
        <Info className="h-3.5 w-3.5 text-gray-400" />
        Form Group Settings
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Section Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={configName}
            onChange={(e) => setConfigName(e.target.value)}
            placeholder="e.g. Warehouse Setup"
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-700 bg-white placeholder-gray-400 focus:border-[#007aff] outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Change Notes
          </label>
          <input
            type="text"
            value={changeNote}
            onChange={(e) => setChangeNote(e.target.value)}
            placeholder="Explain what changes are being published in this layout"
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-700 bg-white placeholder-gray-400 focus:border-[#007aff] outline-none"
          />
        </div>
      </div>
    </div>
  );
}
