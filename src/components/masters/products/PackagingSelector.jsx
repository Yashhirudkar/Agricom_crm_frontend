"use client";

import React, { useState, useMemo } from "react";
import { Search, Package2, Check, Box } from "lucide-react";

function formatSpecLabel(spec) {
  const parts = [
    spec.bagType?.name,
    spec.packingType?.name,
    spec.width && spec.length ? `${spec.width}×${spec.length}` : null,
    spec.emptyBagWeight ? `${spec.emptyBagWeight}GM` : null,
  ].filter(Boolean);
  return parts.join(" | ");
}

export default function PackagingSelector({
  allSpecs,
  selectedIds,
  onChange,
  isEditMode,
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return allSpecs;
    const q = search.toLowerCase();
    return allSpecs.filter((s) =>
      [s.bagType?.name, s.packingType?.name]
        .filter(Boolean)
        .some((val) => val.toLowerCase().includes(q))
    );
  }, [allSpecs, search]);

  const toggleSpec = (id) => {
    if (!isEditMode) return;
    const next = selectedIds.includes(id)
      ? selectedIds.filter((sid) => sid !== id)
      : [...selectedIds, id];
    onChange(next);
  };

  const selectedSpecs = allSpecs.filter((s) => selectedIds.includes(s.id));
  const unselectedFiltered = filtered.filter((s) => !selectedIds.includes(s.id));
  const selectedFiltered = filtered.filter((s) => selectedIds.includes(s.id));

  if (!isEditMode) {
    // View mode — show assigned specs as styled cards
    return (
      <div className="space-y-3">
        {selectedSpecs.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <Box className="h-8 w-8 text-gray-200 mb-2" />
            <p className="text-xs text-gray-400 font-semibold">No packaging assigned</p>
            <p className="text-[11px] text-gray-300 mt-1">Edit the product to assign packaging options.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedSpecs.map((spec) => (
              <div
                key={spec.id}
                className="flex items-start gap-3 p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl"
              >
                <div className="h-8 w-8 rounded-lg bg-[#007aff] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Package2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-800">
                    {spec.bagType?.name}
                    {spec.packingType?.name && (
                      <span className="ml-1.5 px-1.5 py-0.5 bg-white border border-blue-100 rounded text-[10px] font-bold text-[#007aff]">
                        {spec.packingType.name}
                      </span>
                    )}
                  </div>
                  {(spec.width || spec.emptyBagWeight || spec.cost) && (
                    <div className="text-[10px] text-gray-500 mt-1 font-mono space-x-2">
                      {spec.width && spec.length && <span>{spec.width}×{spec.length} in</span>}
                      {spec.emptyBagWeight && <span>{spec.emptyBagWeight} GM</span>}
                      {spec.cost && <span className="text-emerald-600">₹{Number(spec.cost).toFixed(2)}</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Edit mode — searchable multi-select
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        <input
          id="packaging-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bag type or packing..."
          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none text-gray-600 bg-white shadow-sm"
        />
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between text-[11px] text-gray-400">
        <span>{selectedIds.length} selected</span>
        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-red-400 hover:text-red-600 font-semibold transition-colors cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Spec list */}
      <div className="border border-gray-100 rounded-xl overflow-hidden max-h-72 overflow-y-auto divide-y divide-gray-50">
        {/* Selected items first */}
        {selectedFiltered.map((spec) => (
          <div
            key={spec.id}
            id={`pkg-spec-${spec.id}`}
            onClick={() => toggleSpec(spec.id)}
            className="flex items-center gap-3 px-4 py-3 bg-blue-50/70 hover:bg-blue-50 cursor-pointer transition-colors"
          >
            <div className="h-5 w-5 rounded border-2 border-[#007aff] bg-[#007aff] flex items-center justify-center flex-shrink-0">
              <Check className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                {spec.bagType?.name}
                {spec.packingType?.name && (
                  <span className="px-1.5 py-0.5 bg-[#007aff]/10 text-[#007aff] rounded text-[10px] font-bold">
                    {spec.packingType.name}
                  </span>
                )}
              </div>
              {(spec.width || spec.emptyBagWeight) && (
                <div className="text-[10px] text-gray-400 font-mono mt-0.5 space-x-2">
                  {spec.width && spec.length && <span>{spec.width}×{spec.length} in</span>}
                  {spec.emptyBagWeight && <span>{spec.emptyBagWeight} GM</span>}
                  {spec.cost && <span className="text-emerald-600">₹{Number(spec.cost).toFixed(2)}</span>}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Unselected items */}
        {unselectedFiltered.map((spec) => (
          <div
            key={spec.id}
            id={`pkg-spec-${spec.id}`}
            onClick={() => toggleSpec(spec.id)}
            className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="h-5 w-5 rounded border-2 border-gray-200 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                {spec.bagType?.name}
                {spec.packingType?.name && (
                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-semibold">
                    {spec.packingType.name}
                  </span>
                )}
              </div>
              {(spec.width || spec.emptyBagWeight) && (
                <div className="text-[10px] text-gray-400 font-mono mt-0.5 space-x-2">
                  {spec.width && spec.length && <span>{spec.width}×{spec.length} in</span>}
                  {spec.emptyBagWeight && <span>{spec.emptyBagWeight} GM</span>}
                  {spec.cost && <span className="text-emerald-600">₹{Number(spec.cost).toFixed(2)}</span>}
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center">
            <Package2 className="h-6 w-6 text-gray-200 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No specifications found</p>
          </div>
        )}
      </div>
    </div>
  );
}
