import React from "react";
import { ChevronUp, ChevronDown, Trash2, Plus } from "lucide-react";
import { getFieldTypeInfo } from "./utils";

export default function ConfiguredFieldsTable({
  fields,
  onAddFieldClick,
  moveField,
  setEditingFieldKey,
  setEditActiveTab,
  setActiveRuleOption,
  handleDeleteField
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Configured Fields ({fields.length})
        </h3>
        <button
          type="button"
          onClick={onAddFieldClick}
          className="px-3.5 py-1.5 bg-[#007aff] hover:bg-blue-650 text-white rounded-xl flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Field
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="py-12 px-6 text-center text-gray-400 font-medium text-xs italic">
          No fields added to this Custom Form yet. Start by clicking &quot;+ Add Field&quot;.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100 text-[10px] uppercase font-bold tracking-wider text-gray-400">
                <th className="px-6 py-3.5">Field Name</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Required</th>
                <th className="px-6 py-3.5">Linked Rules</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {fields.map((field, index) => {
                const typeInfo = getFieldTypeInfo(field.type);
                const isRequired = !!field.required;

                // Calculate linked dependent fields count
                const ruleCount = field.children
                  ? Object.values(field.children).reduce((acc, curr) => acc + (curr?.length || 0), 0)
                  : 0;

                return (
                  <tr key={field.key} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{field.label}</div>
                      <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                        Key: {field.key}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-gray-200 rounded-lg">
                        {typeInfo.icon}
                        <span className="font-medium text-gray-600 text-[11px]">{typeInfo.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isRequired ? (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-[10px] font-bold">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-50 text-gray-400 border border-gray-200 rounded-full text-[10px] font-medium">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {ruleCount > 0 ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-bold">
                          {ruleCount} {ruleCount === 1 ? "Rule" : "Rules"}
                        </span>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveField(index, "up")}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-slate-100 disabled:opacity-30 transition-colors cursor-pointer"
                          title="Move Up"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveField(index, "down")}
                          disabled={index === fields.length - 1}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-slate-100 disabled:opacity-30 transition-colors cursor-pointer"
                          title="Move Down"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFieldKey(field.key);
                            setEditActiveTab("basic");
                            if (field.options && field.options.length > 0) {
                              setActiveRuleOption(field.options[0]);
                            } else {
                              setActiveRuleOption("");
                            }
                          }}
                          className="px-2.5 py-1 text-xs text-gray-500 hover:text-[#007aff] hover:bg-blue-50 border border-gray-200 rounded-lg transition-colors cursor-pointer font-bold"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteField(field.key)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove Field"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
