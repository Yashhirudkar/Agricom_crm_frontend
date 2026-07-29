import React from "react";
import { AlertCircle, X } from "lucide-react";

const parse24hTime = (timeStr) => {
  if (!timeStr) return { hour: "", minute: "", period: "" };
  const [hStr, mStr] = timeStr.split(":");
  let hour = parseInt(hStr, 10);
  const minute = mStr || "00";
  let period = "AM";
  if (hour >= 12) {
    period = "PM";
    if (hour > 12) hour -= 12;
  }
  if (hour === 0) {
    hour = 12;
  }
  return { hour: String(hour), minute, period };
};

const formatTo24hTime = (hour, minute, period) => {
  if (!hour || !minute || !period) return "";
  let h = parseInt(hour, 10);
  if (period === "PM" && h < 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${minute}`;
};

function TimePicker12h({ value, onChange, disabled }) {
  const { hour, minute, period } = parse24hTime(value);

  const handleHourChange = (newHour) => {
    if (newHour === "") {
      onChange("");
    } else {
      onChange(formatTo24hTime(newHour, minute || "00", period || "AM"));
    }
  };

  const handleMinuteChange = (newMinute) => {
    if (newMinute === "") {
      onChange("");
    } else {
      onChange(formatTo24hTime(hour || "12", newMinute, period || "AM"));
    }
  };

  const handlePeriodChange = (newPeriod) => {
    if (newPeriod === "") {
      onChange("");
    } else {
      onChange(formatTo24hTime(hour || "12", minute || "00", newPeriod));
    }
  };

  return (
    <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1 bg-white focus-within:border-[#007aff] focus-within:ring-1 focus-within:ring-[#007aff] transition-shadow w-full">
      {/* Hour select */}
      <select
        disabled={disabled}
        value={hour}
        onChange={(e) => handleHourChange(e.target.value)}
        className="bg-transparent text-gray-800 text-sm outline-none px-1 py-1 cursor-pointer border-none focus:ring-0 w-full text-center appearance-none"
      >
        <option value="">Hour</option>
        {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((h) => (
          <option key={h} value={h}>
            {h.padStart(2, "0")}
          </option>
        ))}
      </select>
      
      <span className="text-gray-400 font-bold">:</span>
      
      {/* Minute select */}
      <select
        disabled={disabled}
        value={minute}
        onChange={(e) => handleMinuteChange(e.target.value)}
        className="bg-transparent text-gray-800 text-sm outline-none px-1 py-1 cursor-pointer border-none focus:ring-0 w-full text-center appearance-none"
      >
        <option value="">Min</option>
        {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")).map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      
      {/* AM/PM select */}
      <select
        disabled={disabled}
        value={period}
        onChange={(e) => handlePeriodChange(e.target.value)}
        className="bg-gray-50 border border-gray-200 text-gray-800 text-xs font-semibold rounded-md px-1.5 py-1 cursor-pointer outline-none focus:ring-0 ml-1"
      >
        <option value="">--</option>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}


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
              <TimePicker12h
                disabled={isLoading}
                value={correctionForm.expectedCheckIn}
                onChange={(val) =>
                  setCorrectionForm({
                    ...correctionForm,
                    expectedCheckIn: val,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Out
              </label>
              <TimePicker12h
                disabled={isLoading}
                value={correctionForm.expectedCheckOut}
                onChange={(val) =>
                  setCorrectionForm({
                    ...correctionForm,
                    expectedCheckOut: val,
                  })
                }
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
