"use client";
import React, { useState, useEffect, useCallback } from "react";
import { X, Plus, Trash2, MapPin, Loader2, Check, AlertCircle, Navigation } from "lucide-react";
import { enquiriesApi } from "../services/enquiriesApi";

/** Reusable repeatable list section */
function RepeatableList({ label, items, onAdd, onChange, onDelete, placeholder, addLabel, loading }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
        {label}
      </label>

      {loading ? (
        <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-xs font-medium">Loading...</span>
        </div>
      ) : (
        <>
          <div className="space-y-2.5">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => onChange(idx, e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 px-3 py-2.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#007aff] transition-all placeholder:text-gray-300"
                />
                <button
                  onClick={() => onDelete(idx)}
                  disabled={items.length === 1 && item === ""}
                  className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                  title="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={onAdd}
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#007aff] hover:text-blue-700 transition-colors cursor-pointer group"
          >
            <div className="h-5 w-5 rounded-md bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <Plus className="h-3 w-3" />
            </div>
            {addLabel}
          </button>
        </>
      )}
    </div>
  );
}

/** Derive the destination string already stored on the enquiry record */
function getEnquiryDestination(e) {
  if (!e) return "";
  if (e.shipmentMode === "SHIP") {
    return e.destinationPort || e.podName || "";
  }
  if (e.shipmentMode === "ROAD" || e.shipmentMode === "RAIL") {
    const parts = [e.destinationCity, e.destinationState, e.destinationCountry].filter(Boolean);
    return parts.join(", ");
  }
  // No mode set — try any destination field
  return e.destinationPort || e.destinationCity || e.podName || "";
}

export default function LoadingPointsDrawer({ isOpen, onClose, enquiry, onSaveSuccess }) {
  const [destinations, setDestinations] = useState([""]);
  const [points, setPoints] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    if (!enquiry?.id) return;
    setLoading(true);
    try {
      const [dests, pts] = await Promise.all([
        enquiriesApi.getDestinations(enquiry.id),
        enquiriesApi.getLoadingPoints(enquiry.id),
      ]);

      // If no destinations saved yet → fall back to the existing enquiry destination field
      if (Array.isArray(dests) && dests.length > 0) {
        setDestinations(dests);
      } else {
        const fallback = getEnquiryDestination(enquiry);
        setDestinations(fallback ? [fallback] : [""]);
      }

      setPoints(Array.isArray(pts) && pts.length > 0 ? pts : [""]);
    } catch {
      setDestinations([""]);
      setPoints([""]);
    } finally {
      setLoading(false);
    }
  }, [enquiry?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isOpen) {
      fetchAll();
    } else {
      setDestinations([""]);
      setPoints([""]);
      setToast(null);
    }
  }, [isOpen, fetchAll]);

  // ── Destination handlers ──────────────────────────────────────────────────
  const addDest = () => setDestinations((p) => [...p, ""]);
  const changeDest = (idx, val) => setDestinations((p) => p.map((d, i) => (i === idx ? val : d)));
  const deleteDest = (idx) =>
    setDestinations((p) => {
      const n = p.filter((_, i) => i !== idx);
      return n.length === 0 ? [""] : n;
    });

  // ── Loading point handlers ────────────────────────────────────────────────
  const addPoint = () => setPoints((p) => [...p, ""]);
  const changePoint = (idx, val) => setPoints((p) => p.map((d, i) => (i === idx ? val : d)));
  const deletePoint = (idx) =>
    setPoints((p) => {
      const n = p.filter((_, i) => i !== idx);
      return n.length === 0 ? [""] : n;
    });

  const handleSave = async () => {
    if (!enquiry?.id) return;
    setSaving(true);
    try {
      await Promise.all([
        enquiriesApi.updateDestinations(enquiry.id, destinations),
        enquiriesApi.updateLoadingPoints(enquiry.id, points),
      ]);
      showToast("Saved successfully");
      await fetchAll();
      onSaveSuccess?.();
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 z-50 h-full w-[420px] max-w-[100vw] bg-white shadow-2xl flex flex-col"
        style={{ borderLeft: "1px solid #e5e7eb" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-[#007aff]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 leading-tight">Loading Points</h2>
              {enquiry?.enquiryNo && (
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">{enquiry.enquiryNo}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`mx-5 mt-4 flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-white transition-all ${
              toast.type === "error" ? "bg-red-500" : "bg-emerald-500"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <Check className="h-3.5 w-3.5 shrink-0" />
            )}
            {toast.msg}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Destinations */}
          <RepeatableList
            label="Destinations"
            items={destinations}
            onAdd={addDest}
            onChange={changeDest}
            onDelete={deleteDest}
            placeholder="e.g. Warsaw, Poland"
            addLabel="Add Destination"
            loading={loading}
          />

          <div className="border-t border-gray-100" />

          {/* Loading Points */}
          <RepeatableList
            label="Loading Points"
            items={points}
            onAdd={addPoint}
            onChange={changePoint}
            onDelete={deletePoint}
            placeholder="e.g. Indore Warehouse"
            addLabel="Add Loading Point"
            loading={loading}
          />
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-gray-100 bg-white flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#007aff] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-colors cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" />
                Save
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
