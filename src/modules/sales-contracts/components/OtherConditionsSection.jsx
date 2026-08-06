"use client";
import React, { useState } from "react";
import { ListChecks, Plus, Trash2, AlertCircle, ChevronDown, ChevronUp, Copy, RotateCcw } from "lucide-react";

export const DEFAULT_OTHER_CONDITIONS = [
  "WEIGHT DIFFERENCE OF +/- 150 KGS PER TRUCK WILL BE CONSIDERABLE AFTER FINAL UNLOADING. NO CLAIM FOR LESS WEIGHT AND VICE VERSA.",
  "THE ACTUAL TIME OF ARRIVAL OF THE VEHICLE FOR UNLOADING IS 08:00-10:00AM LOCAL TIME. IF THE CAR ARRIVES AFTER THE SPECIFIED TIME, THERE IS A RISK OF REMAINING NOT UNLOADED UNTIL THE NEXT MORNING",
  "ABNORMAL IDLE TIME OF THE VEHICLE AT THE UNLOADING POINT (THE STANDARD UNLOADING IN EU IS 24 HOURS FROM THE DATE OF THE VEHICLE ARRIVAL) IS PAID BY THE BUYER AT THE RATE OF 100 € FOR EVERY DAY IDLE.",
  "IN THE EVENT THAT THE CLEARANCE OF TRUCK IS DELAYED DUE TO THE UNAVAILABILITY OF ANY REQUIRED INFORMATION OR DOCUMENTS FROM THE BUYER'S SIDE, THE BUYER SHALL BE LIABLE FOR ANY TRUCK DOWNTIME COSTS INCURRED",
  "QUALITY CLAIM TO BE MADE WITHIN 24 HOURS FROM THE TIME ARRIVAL OF CARGO AT BUYERS WAREHOUSE. ANY DELAY IN QUALITY CLAIM AFTER THE MENTIONED TIME WILL NOT BE ACCEPTED",
  "IN THE EVENT THAT THE BUYER'S INTERNAL LABORATORY IDENTIFIES ANY QUALITY DISCREPANCY OR NON-CONFORMITY, BOTH PARTIES SHALL JOINTLY APPOINT AN INDEPENDENT THIRD-PARTY INSPECTION AGENCY TO PERFORM TESTING. THE RESULTS OF THE THIRD-PARTY LABORATORY SHALL BE FINAL AND BINDING ON BOTH PARTIES, AND ANY SETTLEMENT OR CLAIM SHALL BE MADE STRICTLY ON THE BASIS OF THE THIRD-PARTY TEST REPORT.",
  "THE SELLER RESERVES THE FULL RIGHT TO WITHHOLD SHIPMENT IF ANY PREVIOUS INVOICES REMAIN UNPAID. SHIPMENT WILL BE LOADED ONLY UPON FULL CLEARANCE OF OUTSTANDING PREVIOUS DUES",
];

export default function OtherConditionsSection({ form, setForm, isView }) {
  const conditions = form.otherConditions ?? DEFAULT_OTHER_CONDITIONS;
  const [newCondition, setNewCondition] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  const updateConditions = (updated) => setForm((f) => ({ ...f, otherConditions: updated }));

  const handleAdd = () => {
    const trimmed = newCondition.trim();
    if (!trimmed) return;
    updateConditions([...conditions, trimmed]);
    setNewCondition("");
  };

  const handleDelete = (idx) => {
    updateConditions(conditions.filter((_, i) => i !== idx));
    if (editIdx === idx) { setEditIdx(null); setEditValue(""); }
  };

  const handleStartEdit = (idx) => {
    setEditIdx(idx);
    setEditValue(conditions[idx]);
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) return;
    const updated = conditions.map((c, i) => (i === editIdx ? editValue.trim() : c));
    updateConditions(updated);
    setEditIdx(null);
    setEditValue("");
  };

  const handleCancelEdit = () => { setEditIdx(null); setEditValue(""); };

  const handleKeyDown = (e, action) => {
    if (e.key === "Enter") { e.preventDefault(); action(); }
    if (e.key === "Escape") handleCancelEdit();
  };

  const handleResetToDefault = () => {
    updateConditions(DEFAULT_OTHER_CONDITIONS);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Header */}
      <div 
        className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <ListChecks className="h-3.5 w-3.5 text-indigo-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-gray-900">Other Conditions</h2>
          <p className="text-[10px] text-gray-400">
            {isView
              ? `${conditions.length} condition${conditions.length !== 1 ? "s" : ""} applied`
              : "Special commercial conditions (Delivery Notes, Quality Claims, etc.)"}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {!isView && (
            <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              {conditions.length} item{conditions.length !== 1 ? "s" : ""}
            </span>
          )}
          {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 space-y-2">
          {/* Toolbar */}
          {!isView && (
            <div className="flex justify-end gap-2 mb-3">
               <button 
                onClick={handleResetToDefault}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                title="Reset to Company Default Template"
               >
                 <RotateCcw className="h-3 w-3" /> Default Template
               </button>
            </div>
          )}

          {/* Empty state */}
          {conditions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-6 text-center gap-2">
              <AlertCircle className="h-6 w-6 text-gray-300" />
              <p className="text-xs text-gray-400">No other conditions added yet.</p>
              {!isView && <p className="text-[10px] text-gray-300">Use the field below to add your first condition.</p>}
            </div>
          )}

          {/* List */}
          {conditions.map((cond, idx) => (
            <div
              key={idx}
              className={`group flex items-start gap-2.5 rounded-xl border px-3 py-2.5 transition-all ${
                editIdx === idx
                  ? "border-[#007aff]/40 bg-blue-50/50"
                  : "border-gray-100 bg-gray-50/50 hover:border-gray-200"
              }`}
            >
              <span className="mt-0.5 flex-shrink-0 h-4.5 w-4.5 rounded-full bg-indigo-50 text-indigo-600 text-[9px] font-bold flex items-center justify-center">
                {idx + 1}
              </span>

              {editIdx === idx ? (
                <div className="flex-1 flex flex-col gap-2">
                  <textarea
                    autoFocus
                    rows={2}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, handleSaveEdit)}
                    className="w-full text-xs px-2.5 py-1.5 border border-[#007aff]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white resize-none transition-all"
                  />
                  <div className="flex gap-1.5 justify-end">
                    <button
                      onClick={handleCancelEdit}
                      className="px-2.5 py-1 text-[10px] font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={!editValue.trim()}
                      className="px-2.5 py-1 text-[10px] font-semibold text-white bg-[#007aff] rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p
                  className={`flex-1 text-xs text-gray-700 leading-relaxed ${!isView ? "cursor-pointer hover:text-gray-900" : ""}`}
                  onClick={!isView ? () => handleStartEdit(idx) : undefined}
                  title={!isView ? "Click to edit" : undefined}
                >
                  {cond}
                </p>
              )}

              {!isView && editIdx !== idx && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => handleStartEdit(idx)}
                    className="h-6 w-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors"
                    title="Edit"
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(idx)}
                    className="h-6 w-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          ))}

          {!isView && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleAdd)}
                placeholder="Type a new condition and press Enter..."
                className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white transition-all"
              />
              <button
                onClick={handleAdd}
                disabled={!newCondition.trim()}
                className="px-3 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 flex-shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
