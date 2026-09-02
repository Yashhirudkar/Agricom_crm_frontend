"use client";
import React, { useState, useEffect } from "react";
import { X, Save, PlusCircle, AlertCircle } from "lucide-react";
import axiosClient from "@/lib/axios";

const CATEGORY_NAMES = {
  TRUCK_TYPE: "Truck Type",
  TRUCK_CAPACITY: "Truck Capacity",
  CONTAINER_TYPE: "Container Type",
  CONTAINER_SIZE: "Container Size",
  WAGON_TYPE: "Wagon Type",
  WAGON_CAPACITY: "Wagon Capacity",
};

export default function AddEquipmentOptionModal({
  isOpen,
  onClose,
  category = "TRUCK_TYPE",
  onSaveSuccess,
}) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setValue("");
      setError("");
    }
  }, [isOpen, category]);

  if (!isOpen) return null;

  const categoryLabel = CATEGORY_NAMES[category] || category;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value || !value.trim()) {
      setError("Please enter a valid option value.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axiosClient.post("/masters/equipment-options", {
        category,
        value: value.trim(),
      });
      const created = response.data?.data || response.data;
      if (onSaveSuccess) {
        onSaveSuccess(created);
      }
      onClose();
    } catch (err) {
      console.error("Failed to add equipment option:", err);
      setError(
        err.response?.data?.message || "Failed to create equipment option."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[90] bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <PlusCircle className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-extrabold tracking-tight">
                Add New {categoryLabel}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {categoryLabel} Value <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`e.g. 22 FT Refrigerated Truck`}
                maxLength={100}
                autoFocus
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-600 text-xs shadow-xs"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                This value will be added to {categoryLabel} master options.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" /> Save Option
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
