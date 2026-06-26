import React from "react";
import { Settings, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Drawer from "@/components/common/Drawer";
import DynamicFieldRenderer from "@/components/common/DynamicFieldRenderer";
import { ALLOWED_TYPES } from "./utils";

export default function EditFieldDrawer({
  isOpen,
  onClose,
  editingField,
  setEditingFieldKey,
  editActiveTab,
  setEditActiveTab,
  activeRuleOption,
  setActiveRuleOption,
  isEditAdvancedOpen,
  setIsEditAdvancedOpen,
  handleUpdateFieldProperty,
  handleAddOption,
  handleRemoveOption,
  handleAddChildField,
  handleUpdateChildProperty,
  handleDeleteChildField,
  previewValues,
  setPreviewValues
}) {
  if (!editingField) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Configure Field: ${editingField.label}`}
      widthClass="w-full sm:w-[500px]"
    >
      <div className="flex flex-col h-full bg-white divide-y divide-gray-100 font-sans">
        {/* Drawer Tabs */}
        <div className="bg-slate-50 px-6 shrink-0 flex gap-5 border-b border-gray-100">
          <button
            type="button"
            onClick={() => setEditActiveTab("basic")}
            className={`py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-[1px] ${editActiveTab === "basic"
                ? "border-[#007aff] text-[#007aff]"
                : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
          >
            Basic
          </button>
          {["select", "multiselect"].includes(editingField.type) && (
            <>
              <button
                type="button"
                onClick={() => setEditActiveTab("choices")}
                className={`py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-[1px] ${editActiveTab === "choices"
                    ? "border-[#007aff] text-[#007aff]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
              >
                Choices
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditActiveTab("rules");
                  if (!activeRuleOption && editingField.options && editingField.options.length > 0) {
                    setActiveRuleOption(editingField.options[0]);
                  }
                }}
                className={`py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-[1px] ${editActiveTab === "rules"
                    ? "border-[#007aff] text-[#007aff]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
              >
                Business Rules
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setEditActiveTab("preview")}
            className={`py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-[1px] ${editActiveTab === "preview"
                ? "border-[#007aff] text-[#007aff]"
                : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
          >
            Preview
          </button>
        </div>

        {/* Tab Panels */}
        <div className="flex-1 p-6 overflow-y-auto">
          {editActiveTab === "basic" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Field Name / Label
                </label>
                <input
                  type="text"
                  value={editingField.label}
                  onChange={(e) => handleUpdateFieldProperty(editingField.key, "label", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 focus:border-[#007aff] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Field Type
                </label>
                <select
                  value={editingField.type}
                  onChange={(e) => handleUpdateFieldProperty(editingField.key, "type", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-700 bg-white focus:border-[#007aff] outline-none"
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
                  onClick={() => handleUpdateFieldProperty(editingField.key, "required", !editingField.required)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${editingField.required ? "bg-[#007aff]" : "bg-gray-200"
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editingField.required ? "translate-x-6" : "translate-x-1"
                      }`}
                  />
                </button>
              </div>

              {/* Advanced Settings Collapsible */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsEditAdvancedOpen(!isEditAdvancedOpen)}
                  className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/70 transition-colors flex items-center justify-between text-xs font-bold text-gray-750"
                >
                  <span className="flex items-center gap-1.5">
                    <Settings className="h-4 w-4 text-gray-455" />
                    Advanced Settings (Optional)
                  </span>
                  <span className="text-gray-400 text-xs font-normal">
                    {isEditAdvancedOpen ? "▼ Hide" : "▶ Show"}
                  </span>
                </button>
                {isEditAdvancedOpen && (
                  <div className="p-4 bg-white border-t border-gray-200 space-y-4 animate-in fade-in duration-150">
                    <div>
                      <label className="block text-[9px] font-extrabold text-gray-455 uppercase tracking-wider mb-1">
                        System Key (Read Only)
                      </label>
                      <div className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-xs text-gray-400 font-mono select-all">
                        {editingField.key}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-extrabold text-gray-455 uppercase tracking-wider mb-1">
                        Placeholder Text
                      </label>
                      <input
                        type="text"
                        value={editingField.placeholder || ""}
                        onChange={(e) => handleUpdateFieldProperty(editingField.key, "placeholder", e.target.value)}
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
                        value={editingField.helpText || ""}
                        onChange={(e) => handleUpdateFieldProperty(editingField.key, "helpText", e.target.value)}
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
          )}

          {editActiveTab === "choices" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Add Options/Choices
              </div>

              {/* Add option form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  id={`drawer-opt-add-${editingField.key}`}
                  placeholder="e.g. Cold Storage"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddOption(editingField.key, e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-700 focus:border-[#007aff] outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById(`drawer-opt-add-${editingField.key}`);
                    if (el) {
                      handleAddOption(editingField.key, el.value);
                      el.value = "";
                    }
                  }}
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Add Option
                </button>
              </div>

              {/* Options List */}
              <div className="flex flex-wrap gap-2 pt-2">
                {Array.isArray(editingField.options) && editingField.options.map((opt) => (
                  <span
                    key={opt}
                    className="inline-flex items-center gap-1.5 bg-slate-50 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs"
                  >
                    {opt}
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(editingField.key, opt)}
                      className="text-gray-400 hover:text-red-500 text-sm font-bold ml-1 focus:outline-none cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                {(!editingField.options || editingField.options.length === 0) && (
                  <span className="text-gray-400 italic text-[11px] py-4">No choices configured yet.</span>
                )}
              </div>
            </div>
          )}

          {editActiveTab === "rules" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100">
                Business Rules & Dependent Fields
              </div>

              {(!editingField.options || editingField.options.length === 0) ? (
                <div className="text-center py-6 text-gray-400 text-xs italic">
                  Please add options/choices first under the &quot;Choices&quot; tab.
                </div>
              ) : (
                <div className="grid grid-cols-12 gap-4 items-start min-h-[300px]">
                  {/* Left Column Choice List */}
                  <div className="col-span-4 bg-slate-50 border border-gray-200 rounded-xl overflow-hidden flex flex-col divide-y divide-gray-100 shadow-xs">
                    {editingField.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setActiveRuleOption(opt)}
                        className={`px-3 py-2.5 text-left text-xs font-bold transition-all ${activeRuleOption === opt
                            ? "bg-white border-l-4 border-[#007aff] text-[#007aff] shadow-xs"
                            : "text-gray-600 hover:bg-slate-100/50"
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {/* Right Column Child Field Editor */}
                  <div className="col-span-8 space-y-4 border border-gray-100 rounded-xl p-4 bg-white shadow-xs">
                    <div className="text-xs font-bold text-gray-800 pb-2 border-b border-gray-100">
                      When <span className="bg-blue-50 text-[#007aff] px-2 py-0.5 rounded border border-blue-150 font-bold">{activeRuleOption || "(none)"}</span> is selected:
                    </div>

                    {activeRuleOption && (
                      <>
                        {/* Existing Dependent Fields List */}
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                          {((editingField.children && editingField.children[activeRuleOption]) || []).map((child) => (
                            <div
                              key={child.key}
                              className="flex items-center justify-between border border-gray-100 bg-slate-50/50 rounded-lg p-2 gap-2 text-xs"
                            >
                              <div className="min-w-0">
                                <div className="font-bold text-gray-800 truncate">{child.label}</div>
                                <div className="text-[9px] text-gray-400 font-mono mt-0.5 truncate">
                                  Key: {child.key} ({child.type})
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateChildProperty(editingField.key, activeRuleOption, child.key, "required", !child.required)}
                                  className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${child.required ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-slate-100 text-gray-400 border border-gray-200"
                                    }`}
                                >
                                  {child.required ? "Req" : "Opt"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteChildField(editingField.key, activeRuleOption, child.key)}
                                  className="text-gray-450 hover:text-red-500 p-0.5 rounded transition-colors cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                          {(!editingField.children || !editingField.children[activeRuleOption] || editingField.children[activeRuleOption].length === 0) && (
                            <div className="text-gray-400 text-[10px] italic py-2 text-center">
                              No dependent fields defined for this option.
                            </div>
                          )}
                        </div>

                        {/* Add Dependent Field form */}
                        <div className="border-t border-gray-100 pt-3 space-y-3 bg-slate-50/30 p-3 rounded-lg border border-dashed border-gray-200">
                          <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                            Add Dependent Field
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              id={`dep-name-${editingField.key}-${activeRuleOption}`}
                              placeholder="Field Name"
                              className="border border-gray-200 rounded-lg px-2.5 py-1 text-xs outline-none bg-white focus:border-[#007aff]"
                            />
                            <select
                              id={`dep-type-${editingField.key}-${activeRuleOption}`}
                              className="border border-gray-200 rounded-lg px-2.5 py-1 text-xs bg-white text-gray-700 outline-none focus:border-[#007aff]"
                            >
                              <option value="text">Short Text</option>
                              <option value="textarea">Long Text</option>
                              <option value="number">Number Field</option>
                              <option value="email">Email Address</option>
                              <option value="date">Date Picker</option>
                              <option value="checkbox">Single Checkbox</option>
                            </select>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                const nameEl = document.getElementById(`dep-name-${editingField.key}-${activeRuleOption}`);
                                const typeEl = document.getElementById(`dep-type-${editingField.key}-${activeRuleOption}`);
                                if (nameEl && typeEl && nameEl.value.trim()) {
                                  handleAddChildField(editingField.key, activeRuleOption, nameEl.value, typeEl.value);
                                  nameEl.value = "";
                                } else {
                                  toast.warning("Please enter a name for the dependent field.");
                                }
                              }}
                              className="px-3 py-1 bg-gray-900 hover:bg-black text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              Add Field
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

              {editActiveTab === "preview" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100">
                    Interactive Field Sandbox
                  </div>

                  <div className="bg-slate-50/50 p-4 border border-gray-200 rounded-xl space-y-4">
                    <DynamicFieldRenderer
                      schema={{ fields: [editingField] }}
                      values={previewValues}
                      onChange={setPreviewValues}
                      isReadOnly={false}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
          <div className="p-4 bg-slate-50 shrink-0 flex items-center justify-end">
            <button
              type="button"
              onClick={() => setEditingFieldKey(null)}
              className="px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Done Editing
            </button>
          </div>
        </div>
    </Drawer>
  );
}
