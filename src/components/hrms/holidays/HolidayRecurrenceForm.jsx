import React from "react";

export default function HolidayRecurrenceForm({
  formData,
  handleChange,
  handleDayToggle,
  handleWeekToggle,
}) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Days of the Week *
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Sunday", value: 0 },
            { label: "Monday", value: 1 },
            { label: "Tuesday", value: 2 },
            { label: "Wednesday", value: 3 },
            { label: "Thursday", value: 4 },
            { label: "Friday", value: 5 },
            { label: "Saturday", value: 6 },
          ].map((day) => {
            const isSelected = formData.selectedDays.includes(day.value);
            return (
              <button
                key={day.value}
                type="button"
                onClick={() => handleDayToggle(day.value)}
                className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                  isSelected
                    ? "bg-blue-50 border-blue-200 text-blue-700 font-bold"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {day.label.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Occurrences in Month *
        </label>
        <div className="grid grid-cols-5 gap-2">
          {[
            { label: "1st Week", value: 1 },
            { label: "2nd Week", value: 2 },
            { label: "3rd Week", value: 3 },
            { label: "4th Week", value: 4 },
            { label: "5th Week", value: 5 },
          ].map((wk) => {
            const isSelected = formData.selectedWeeks.includes(wk.value);
            return (
              <button
                key={wk.value}
                type="button"
                onClick={() => handleWeekToggle(wk.value)}
                className={`py-2 text-[10px] font-semibold rounded-lg border text-center transition-all ${
                  isSelected
                    ? "bg-blue-50 border-blue-200 text-blue-700 font-bold"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {wk.label.split(" ")[0]}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-gray-400 mt-1">
          Select weeks of the month to apply (e.g. check 2nd & 4th Saturday).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date *
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </>
  );
}
