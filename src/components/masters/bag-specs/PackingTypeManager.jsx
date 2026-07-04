"use client";

import React, { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";

export default function PackingTypeManager({ packingTypes, onAdd, onDelete, isLoading }) {
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    setError("");
    try {
      await onAdd({ name: newName.trim() });
      setNewName("");
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to add");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          id="new-packing-type-input"
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="e.g. 25 KG"
          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none text-gray-700 uppercase bg-white shadow-sm"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={saving || !newName.trim()}
          id="add-packing-type-btn"
          className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 disabled:opacity-60 cursor-pointer hover:bg-emerald-700 transition-colors"
        >
          {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
          Add
        </button>
      </div>
      {error && <p className="text-red-500 text-[11px]">{error}</p>}
      <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
        {packingTypes.map((pt) => (
          <span
            key={pt.id}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[11px] font-semibold"
          >
            {pt.name}
            <button
              type="button"
              onClick={() => onDelete(pt.id)}
              className="text-emerald-400 hover:text-red-500 transition-colors ml-0.5 cursor-pointer"
              title="Delete"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {packingTypes.length === 0 && !isLoading && (
          <span className="text-[11px] text-gray-400 italic">No packing types yet</span>
        )}
      </div>
    </div>
  );
}
