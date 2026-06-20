import React, { useState, useEffect } from "react";
import Modal from "@/components/modals/Modal";

export default function PermanentDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  title = "Permanent Delete",
  message = "Warning: Permanent delete cannot be undone.",
}) {
  const [deleteText, setDeleteText] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setDeleteText("");
      setReason("");
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (deleteText === "DELETE") {
      onConfirm(reason);
    }
  };

  const handleClose = () => {
    setDeleteText("");
    setReason("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-4">
          <p className="text-sm font-semibold text-red-700">{message}</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Reason (Optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-red-500 outline-none text-gray-700"
            placeholder="Why are you permanently deleting this?"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Type DELETE to confirm
          </label>
          <input
            type="text"
            required
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-red-500 outline-none text-gray-700 font-mono"
            placeholder="DELETE"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isDeleting || deleteText !== "DELETE"}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs ${
              deleteText === "DELETE" && !isDeleting
                ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                : "bg-red-300 text-white cursor-not-allowed"
            }`}
          >
            {isDeleting && (
              <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Permanent Delete
          </button>
        </div>
      </form>
    </Modal>
  );
}
