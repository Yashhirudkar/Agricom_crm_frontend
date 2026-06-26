import React from "react";
import { Settings } from "lucide-react";
import Drawer from "@/components/common/Drawer";
import { ALLOWED_TYPES } from "./utils";

export default function AddFieldDrawer({
  isOpen,
  onClose,
  addFieldName,
  setAddFieldName,
  addFieldKey,
  setAddFieldKey,
  addFieldType,
  setAddFieldType,
  addFieldRequired,
  setAddFieldRequired,
  addFieldPlaceholder,
  setAddFieldPlaceholder,
  addFieldHelpText,
  setAddFieldHelpText,
  isAddAdvancedOpen,
  setIsAddAdvancedOpen,
  handleSaveNewField
}) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Add Custom Field"
      widthClass="w-full sm:w-[500px]"
    >
      <form onSubmit={handleSaveNewField} className="flex flex-col h-full bg-white divide-y divide-gray-100 font-sans">
        <div className="flex-1 p-6 space-y-5 overflow-y-auto">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Field Name / Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={addFieldName}
              onChange={(e) => {
                setAddFieldName(e.target.value);
                const generatedKey = e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "_")
                  .replace(/^_+|_+$/g, "");
                if (!addFieldKey || addFieldKey === generatedKey) {
                  setAddFieldKey(generatedKey);
                }
              }}
              placeholder="e.g. Warehouse Address"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:border-[#007aff] outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Field Type
            </label>
            <select
              value={addFieldType}
              onChange={(e) => setAddFieldType(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-700 bg-white focus:border-[#007aff] outline-none"
            >
              {ALLOWED_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between py-2.5 border-y border-gray-100">
            <div>
              <span className="text-xs font-bold text-gray-700">Mandatory / Required Field</span>
              <p className="text-[10px] text-gray-400">Make this field mandatory for partner profiles</p>
            </div>
            <button
              type="button"
              onClick={() => setAddFieldRequired(!addFieldRequired)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                addFieldRequired ? "bg-[#007aff]" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  addFieldRequired ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Advanced Settings Collapsible */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setIsAddAdvancedOpen(!isAddAdvancedOpen)}
              className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/70 transition-colors flex items-center justify-between text-xs font-bold text-gray-750"
            >
              <span className="flex items-center gap-1.5">
                <Settings className="h-4 w-4 text-gray-455" />
                Advanced Settings (Optional)
              </span>
              <span className="text-gray-400 text-xs font-normal">
                {isAddAdvancedOpen ? "▼ Hide" : "▶ Show"}
              </span>
            </button>
            {isAddAdvancedOpen && (
              <div className="p-4 bg-white border-t border-gray-200 space-y-4 animate-in fade-in duration-150">
                <div>
                  <label className="block text-[9px] font-extrabold text-gray-455 uppercase tracking-wider mb-1">
                    System Key (Read Only)
                  </label>
                  <div className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-xs text-gray-400 font-mono select-all">
                    {addFieldKey || "(auto-generated)"}
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-extrabold text-gray-455 uppercase tracking-wider mb-1">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={addFieldPlaceholder}
                    onChange={(e) => setAddFieldPlaceholder(e.target.value)}
                    placeholder="e.g. Select warehouse service"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 focus:border-[#007aff] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-extrabold text-gray-455 uppercase tracking-wider mb-1">
                    Help Message
                  </label>
                  <input
                    type="text"
                    value={addFieldHelpText}
                    onChange={(e) => setAddFieldHelpText(e.target.value)}
                    placeholder="e.g. Choose services currently offered by this warehouse"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 focus:border-[#007aff] outline-none"
                  />
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <p className="text-[10px] text-gray-400 font-medium">
                    These settings improve the user experience while filling partner forms.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-50 shrink-0 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-[#007aff] hover:bg-blue-650 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            Save Field
          </button>
        </div>
      </form>
    </Drawer>
  );
}
