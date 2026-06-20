import React from "react";
import Modal from "@/components/modals/Modal";
import { UploadCloud, FileText } from "lucide-react";

export default function ApplyLeaveModal({
  isApplyModalOpen,
  setIsApplyModalOpen,
  submitApplyLeave,
  applyForm,
  handleApplyChange,
  leaveTypes,
  isSubmitting,
}) {
  return (
    <Modal
      isOpen={isApplyModalOpen}
      onClose={() => setIsApplyModalOpen(false)}
      title="Apply Leave"
      size="md"
    >
      <form onSubmit={submitApplyLeave} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Leave Type <span className="text-red-500">*</span>
          </label>
          <select
            name="leaveTypeId"
            required
            value={applyForm.leaveTypeId}
            onChange={handleApplyChange}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] text-gray-700"
          >
            <option value="">Select Leave Type</option>
            {leaveTypes
              .filter((lt) => lt.isActive)
              .map((lt) => (
                <option key={lt.id} value={lt.id}>
                  {lt.name}
                </option>
              ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              From Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="fromDate"
              required
              value={applyForm.fromDate}
              onChange={handleApplyChange}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] text-gray-700"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              To Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="toDate"
              required
              value={applyForm.toDate}
              min={applyForm.fromDate}
              onChange={handleApplyChange}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] text-gray-700"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isHalfDay"
            name="isHalfDay"
            checked={applyForm.isHalfDay}
            onChange={handleApplyChange}
            className="w-4 h-4 rounded text-[#007aff] focus:ring-[#007aff] border-gray-300"
          />
          <label
            htmlFor="isHalfDay"
            className="text-xs font-medium text-gray-700 cursor-pointer"
          >
            This is a Half Day leave
          </label>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            name="reason"
            required
            rows={3}
            value={applyForm.reason}
            onChange={handleApplyChange}
            placeholder="State your reason for leave..."
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] text-gray-700 resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Attachment (Optional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
            <div className="space-y-1 text-center">
              <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
              <div className="flex text-xs text-gray-600 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-transparent rounded-md font-medium text-[#007aff] hover:underline focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file"
                    type="file"
                    className="sr-only"
                    onChange={handleApplyChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-[10px] text-gray-400">PDF, PNG, JPG up to 10MB</p>
              {applyForm.file && (
                <div className="text-xs font-bold text-green-600 mt-2 flex items-center justify-center gap-1">
                  <FileText className="h-3 w-3" /> {applyForm.file.name}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setIsApplyModalOpen(false)}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#007aff] text-white rounded-xl hover:bg-blue-600 text-xs font-semibold disabled:opacity-50 transition-colors shadow-sm shadow-blue-500/20 cursor-pointer"
          >
            {isSubmitting ? "Applying..." : "Submit Request"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
