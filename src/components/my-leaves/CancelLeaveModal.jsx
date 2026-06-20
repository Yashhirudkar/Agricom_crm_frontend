import React from "react";
import Modal from "@/components/modals/Modal";
import { format, parseISO } from "date-fns";

export default function CancelLeaveModal({
  cancelTarget,
  setCancelTarget,
  cancelReason,
  setCancelReason,
  handleCancelLeave,
  isSubmitting,
}) {
  if (!cancelTarget) return null;

  return (
    <Modal
      isOpen={true}
      onClose={() => setCancelTarget(null)}
      title="Cancel Leave Request"
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-xs text-gray-600">
          Are you sure you want to cancel your leave request for{" "}
          <span className="font-bold">{cancelTarget.leaveType?.name}</span> from{" "}
          <span className="font-bold">
            {format(parseISO(cancelTarget.fromDate), "MMM dd")}
          </span>
          ?
        </p>
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Cancellation Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Why are you cancelling?"
            rows={2}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-700 resize-none"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCancelTarget(null)}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-semibold cursor-pointer"
          >
            Keep Leave
          </button>
          <button
            onClick={handleCancelLeave}
            disabled={isSubmitting}
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 text-xs font-semibold disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Cancelling..." : "Cancel Request"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
