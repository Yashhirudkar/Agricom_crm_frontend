import React from "react";
import Modal from "@/components/modals/Modal";

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  isSaving,
  error,
  isEditMode,
  categories,
  countries,
  hscodes,
}) {
  const handleDecimalChange = (field, val) => {
    // If empty, set to null. Otherwise parse float to maintain valid DTO contract.
    setForm({ ...form, [field]: val === "" ? null : parseFloat(val) });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Product" : "New Product"} maxWidth="max-w-4xl">
      <form onSubmit={onSubmit} className="space-y-6">
        
        {/* General Overview Section */}
        <div className="bg-gray-50/40 p-5 rounded-xl border border-gray-100">
          <p className="text-[11px] font-bold text-gray-700 mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-gray-200 pb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#007aff]"></span>
            Product Classification
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={150}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 uppercase bg-white shadow-sm transition-all"
                placeholder="e.g. ORGANIC SOYBEANS"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: parseInt(e.target.value, 10) || "" })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-white shadow-sm transition-all"
              >
                <option value="">Select...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Origin Country <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.countryId}
                onChange={(e) => setForm({ ...form, countryId: parseInt(e.target.value, 10) || "" })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-white shadow-sm transition-all"
              >
                <option value="">Select...</option>
                {countries.map((con) => (
                  <option key={con.id} value={con.id}>{con.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                HS Code <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.hsCodeId}
                onChange={(e) => setForm({ ...form, hsCodeId: parseInt(e.target.value, 10) || "" })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-white shadow-sm transition-all"
              >
                <option value="">Select...</option>
                {hscodes.map((hs) => (
                  <option key={hs.id} value={hs.id}>{hs.code}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Quality Sub-type
              </label>
              <input
                type="text"
                maxLength={100}
                value={form.qualitySubType}
                onChange={(e) => setForm({ ...form, qualitySubType: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-white shadow-sm transition-all"
                placeholder="e.g. Grade A"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Specification
              </label>
              <input
                type="text"
                maxLength={1000}
                value={form.specification}
                onChange={(e) => setForm({ ...form, specification: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-white shadow-sm transition-all"
                placeholder="Technical specifications, moisture content..."
              />
            </div>
          </div>
        </div>

        {/* Logistics Capacities */}
        <div className="bg-[#f8f9fc] p-5 rounded-xl border border-gray-100/80">
          <p className="text-[11px] font-bold text-gray-700 mb-4 uppercase tracking-wider flex items-center gap-2 border-b border-gray-200 pb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#007aff]"></span>
            Logistics Base Capacities (Optional)
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">20ft Cont.</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.qty20ftContainer ?? ""}
                onChange={(e) => handleDecimalChange("qty20ftContainer", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 font-mono shadow-sm bg-white"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">40ft Cont.</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.qty40ftContainer ?? ""}
                onChange={(e) => handleDecimalChange("qty40ftContainer", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 font-mono shadow-sm bg-white"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">40HC Cont.</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.qty40hcContainer ?? ""}
                onChange={(e) => handleDecimalChange("qty40hcContainer", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 font-mono shadow-sm bg-white"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Truck Cap.</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.truckCapacity ?? ""}
                onChange={(e) => handleDecimalChange("truckCapacity", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 font-mono shadow-sm bg-white"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Wagon Cap.</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.wagonCapacity ?? ""}
                onChange={(e) => handleDecimalChange("wagonCapacity", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-0 text-gray-700 font-mono shadow-sm bg-white"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {isEditMode && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <input
              type="checkbox"
              id="isActiveProduct"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#007aff] focus:ring-[#007aff]"
            />
            <label htmlFor="isActiveProduct" className="text-xs font-semibold text-gray-700">
              Active Status
            </label>
          </div>
        )}

        {error && <p className="text-red-500 text-xs font-semibold mt-2">{error}</p>}

        <div className="flex justify-end gap-3 pt-5 border-t border-gray-100 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-md shadow-blue-500/20"
          >
            {isSaving && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isEditMode ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
