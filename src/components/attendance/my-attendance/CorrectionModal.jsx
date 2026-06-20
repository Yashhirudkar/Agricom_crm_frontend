import React from "react";
import { AlertCircle, X } from "lucide-react";

export default function CorrectionModal({
  showCorrectionModal,
  setShowCorrectionModal,
  handleCorrectionSubmit,
  correctionError,
  correctionForm,
  setCorrectionForm,
  isLoading,
}) {
  if (!showCorrectionModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900">Request Regularization</h3>
          <button
            onClick={() => setShowCorrectionModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCorrectionSubmit} className="p-6 space-y-4">
          {correctionError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-xs font-medium text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {correctionError}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              required
              value={correctionForm.date}
              onChange={(e) =>
                setCorrectionForm({ ...correctionForm, date: e.target.value })
              }
              className="w-full px-3 py-2 border text-gray-800 border-gray-300 rounded-lg focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] outline-none transition-shadow"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected In
              </label>
              <input
                type="datetime-local"
                value={correctionForm.expectedCheckIn}
                onChange={(e) =>
                  setCorrectionForm({
                    ...correctionForm,
                    expectedCheckIn: e.target.value,
                  })
                }
                className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] outline-none transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Out
              </label>
              <input
                type="datetime-local"
                value={correctionForm.expectedCheckOut}
                onChange={(e) =>
                  setCorrectionForm({
                    ...correctionForm,
                    expectedCheckOut: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border text-gray-800 border-gray-300 rounded-lg focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] outline-none transition-shadow"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason *
            </label>
            <textarea
              required
              rows="3"
              placeholder="Explain why..."
              value={correctionForm.reason}
              onChange={(e) =>
                setCorrectionForm({ ...correctionForm, reason: e.target.value })
              }
              className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] outline-none resize-none transition-shadow"
            ></textarea>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setShowCorrectionModal(false)}
              className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 bg-[#007aff] hover:bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              {isLoading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
