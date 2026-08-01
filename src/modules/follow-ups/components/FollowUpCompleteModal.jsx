"use client";

import React, { useState, useEffect } from "react";
import { useCompleteFollowUpMutation } from "../mutations/follow-ups.mutation";

// Let's use the local file or alias fallback
import ReusableModal from "@/components/modals/Modal";

export default function FollowUpCompleteModal({ isOpen, onClose, followUp }) {
  const [status, setStatus] = useState("Confirmed");
  const [ourResponse, setOurResponse] = useState("");

  const completeMutation = useCompleteFollowUpMutation();

  useEffect(() => {
    if (isOpen) {
      setStatus("Confirmed");
      setOurResponse("");
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!followUp) return;

    completeMutation.mutate(
      { id: followUp.id, status, ourResponse },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <ReusableModal isOpen={isOpen} onClose={onClose} title="Complete Follow-up" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4 font-sans">
        {followUp && (
          <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl text-xs space-y-1">
            <p className="text-gray-500 font-medium">Follow-up Target:</p>
            <p className="text-gray-900 font-bold text-[13px]">{followUp.partner?.entityName}</p>
            <p className="text-gray-600 italic">"{followUp.title}"</p>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            Completion Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
            required
          >
            <option value="Confirmed">Confirmed</option>
            <option value="Closed">Closed</option>
            <option value="Deal Finalized">Deal Finalized</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            Response Notes (Optional)
          </label>
          <textarea
            value={ourResponse}
            onChange={(e) => setOurResponse(e.target.value)}
            placeholder="Log outcome of this interaction..."
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 min-h-[80px] resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={completeMutation.isPending}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm disabled:opacity-50 transition-colors flex items-center gap-1.5"
          >
            {completeMutation.isPending ? (
              <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : null}
            Complete
          </button>
        </div>
      </form>
    </ReusableModal>
  );
}
