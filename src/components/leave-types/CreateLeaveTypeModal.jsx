import React from "react";
import Modal from "@/components/modals/Modal";

export default function CreateLeaveTypeModal({
  isModalOpen,
  setIsModalOpen,
  isEditMode,
  handleSubmit,
  formData,
  handleChange,
  isSubmitting,
}) {
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={isEditMode ? "Edit Leave Type" : "Create Leave Type"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Leave Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sick Leave"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] text-gray-700"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Leave Code <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="code"
              required
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. SL"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] text-gray-700 uppercase"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] text-gray-700 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Days Per Year <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="daysPerYear"
              required
              min="0"
              step="0.5"
              value={formData.daysPerYear}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] text-gray-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Minimum Service Days</label>
            <input
              type="number"
              name="minimumServiceDays"
              min="0"
              value={formData.minimumServiceDays}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] text-gray-700"
            />
          </div>
        </div>

        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-4 mt-4">
          <h4 className="text-xs font-bold text-gray-700 border-b border-gray-200 pb-2">Rules & Attributes</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                name="applicableAfterProbation"
                checked={formData.applicableAfterProbation}
                onChange={handleChange}
                className="w-4 h-4 rounded text-[#007aff] focus:ring-[#007aff] border-gray-300"
              />
              <span className="text-xs text-gray-600 group-hover:text-gray-900 font-medium">Applicable After Probation</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                name="requiresApproval"
                checked={formData.requiresApproval}
                onChange={handleChange}
                className="w-4 h-4 rounded text-[#007aff] focus:ring-[#007aff] border-gray-300"
              />
              <span className="text-xs text-gray-600 group-hover:text-gray-900 font-medium">Requires Approval</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                name="isPaid"
                checked={formData.isPaid}
                onChange={handleChange}
                className="w-4 h-4 rounded text-[#007aff] focus:ring-[#007aff] border-gray-300"
              />
              <span className="text-xs text-gray-600 group-hover:text-gray-900 font-medium">Is Paid Leave</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                name="allowHalfDay"
                checked={formData.allowHalfDay}
                onChange={handleChange}
                className="w-4 h-4 rounded text-[#007aff] focus:ring-[#007aff] border-gray-300"
              />
              <span className="text-xs text-gray-600 group-hover:text-gray-900 font-medium">Allow Half Day</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                name="encashable"
                checked={formData.encashable}
                onChange={handleChange}
                className="w-4 h-4 rounded text-[#007aff] focus:ring-[#007aff] border-gray-300"
              />
              <span className="text-xs text-gray-600 group-hover:text-gray-900 font-medium">Encashable</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 rounded text-[#007aff] focus:ring-[#007aff] border-gray-300"
              />
              <span className="text-xs text-gray-600 group-hover:text-gray-900 font-medium">Is Active</span>
            </label>
          </div>
        </div>

        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-4">
          <h4 className="text-xs font-bold text-gray-700 border-b border-gray-200 pb-2">Carry Forward Rules</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                name="carryForwardAllowed"
                checked={formData.carryForwardAllowed}
                onChange={handleChange}
                className="w-4 h-4 rounded text-[#007aff] focus:ring-[#007aff] border-gray-300"
              />
              <span className="text-xs text-gray-600 group-hover:text-gray-900 font-medium">Allow Carry Forward</span>
            </label>

            {formData.carryForwardAllowed && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Max Carry Forward Days</label>
                <input
                  type="number"
                  name="maxCarryForwardDays"
                  min="0"
                  step="0.5"
                  value={formData.maxCarryForwardDays}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] text-gray-700"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#007aff] text-white rounded-xl hover:bg-blue-600 text-xs font-semibold disabled:opacity-50 transition-colors shadow-sm shadow-blue-500/20"
          >
            {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
