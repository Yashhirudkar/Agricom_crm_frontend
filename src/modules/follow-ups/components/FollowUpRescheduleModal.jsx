"use client";

import React, { useState, useEffect } from "react";
import ReusableModal from "@/components/modals/Modal";
import { useRescheduleFollowUpMutation } from "../mutations/follow-ups.mutation";

export default function FollowUpRescheduleModal({ isOpen, onClose, followUp }) {
  const [nextFollowupDate, setNextFollowupDate] = useState("");
  const [ourResponse, setOurResponse] = useState("");

  const rescheduleMutation = useRescheduleFollowUpMutation();

  useEffect(() => {
    if (isOpen) {
      // Default to tomorrow's date formatted as YYYY-MM-DD
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setNextFollowupDate(tomorrow.toLocaleDateString("en-CA"));
      setOurResponse("");
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!followUp || !nextFollowupDate) return;

    rescheduleMutation.mutate(
      { id: followUp.id, nextFollowupDate, ourResponse },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <ReusableModal isOpen={isOpen} onClose={onClose} title="Reschedule Follow-up" maxWidth="max-w-md">
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
            Next Follow-up Date
          </label>
          <input
            type="date"
            value={nextFollowupDate}
            onChange={(e) => setNextFollowupDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
            required
            min={new Date().toLocaleDateString("en-CA")}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            Reason / Response Notes
          </label>
          <textarea
            value={ourResponse}
            onChange={(e) => setOurResponse(e.target.value)}
            placeholder="Type reason or notes..."
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
            disabled={rescheduleMutation.isPending || !nextFollowupDate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm disabled:opacity-50 transition-colors flex items-center gap-1.5"
          >
            {rescheduleMutation.isPending ? (
              <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : null}
            Save
          </button>
        </div>
      </form>
    </ReusableModal>
  );
}
