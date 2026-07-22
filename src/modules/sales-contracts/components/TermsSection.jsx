"use client";
import React, { useState } from "react";
import { ScrollText, Plus, Trash2, GripVertical, AlertCircle } from "lucide-react";

const DEFAULT_TERMS = [
  "Goods once dispatched cannot be cancelled.",
  "Subject to Nagpur jurisdiction.",
  "Payment shall follow agreed payment terms.",
  "Quality disputes must be reported within agreed timeline.",
  "All export documents shall be issued after payment compliance.",
];

export default function TermsSection({ form, setForm, isView }) {
  const terms = form.terms ?? DEFAULT_TERMS;
  const [newTerm, setNewTerm] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editValue, setEditValue] = useState("");

  const updateTerms = (updated) => setForm((f) => ({ ...f, terms: updated }));

  const handleAdd = () => {
    const trimmed = newTerm.trim();
    if (!trimmed) return;
    updateTerms([...terms, trimmed]);
    setNewTerm("");
  };

  const handleDelete = (idx) => {
    updateTerms(terms.filter((_, i) => i !== idx));
    if (editIdx === idx) { setEditIdx(null); setEditValue(""); }
  };

  const handleStartEdit = (idx) => {
    setEditIdx(idx);
    setEditValue(terms[idx]);
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) return;
    const updated = terms.map((t, i) => (i === editIdx ? editValue.trim() : t));
    updateTerms(updated);
    setEditIdx(null);
    setEditValue("");
  };

  const handleCancelEdit = () => { setEditIdx(null); setEditValue(""); };

  const handleKeyDown = (e, action) => {
    if (e.key === "Enter") { e.preventDefault(); action(); }
    if (e.key === "Escape") handleCancelEdit();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
          <ScrollText className="h-3.5 w-3.5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">Terms &amp; Conditions</h2>
          <p className="text-[10px] text-gray-400">
            {isView
              ? `${terms.length} condition${terms.length !== 1 ? "s" : ""} applied to this contract`
              : "Add, edit or remove the conditions for this contract"}
          </p>
        </div>
        {!isView && (
          <span className="ml-auto text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
            {terms.length} item{terms.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="p-5 space-y-2">
        {/* Empty state */}
        {terms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-center gap-2">
            <AlertCircle className="h-6 w-6 text-gray-300" />
            <p className="text-xs text-gray-400">No terms added yet.</p>
            {!isView && <p className="text-[10px] text-gray-300">Use the field below to add your first term.</p>}
          </div>
        )}

        {/* Terms list */}
        {terms.map((term, idx) => (
          <div
            key={idx}
            className={`group flex items-start gap-2.5 rounded-xl border px-3 py-2.5 transition-all ${
              editIdx === idx
                ? "border-[#007aff]/40 bg-blue-50/50"
                : "border-gray-100 bg-gray-50/50 hover:border-gray-200"
            }`}
          >
            {/* Bullet / index */}
            <span className="mt-0.5 flex-shrink-0 h-4.5 w-4.5 rounded-full bg-[#007aff]/10 text-[#007aff] text-[9px] font-bold flex items-center justify-center">
              {idx + 1}
            </span>

            {/* Edit mode vs read mode */}
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
                {term}
              </p>
            )}

            {/* Actions */}
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

        {/* Add new term input */}
        {!isView && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
            <input
              type="text"
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, handleAdd)}
              placeholder="Type a new term and press Enter or click Add..."
              className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white transition-all"
            />
            <button
              onClick={handleAdd}
              disabled={!newTerm.trim()}
              className="px-3 py-2 text-xs font-semibold text-white bg-[#007aff] rounded-xl hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
