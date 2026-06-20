import React from "react";

export default function HolidayBasicDetails({ formData, handleChange, mode }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {mode === "bulk" ? "Holiday/Off Name *" : "Holiday Name *"}
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={mode === "bulk" ? "e.g. Sunday Weekly Off" : "e.g. Independence Day"}
        />
      </div>

      {mode === "single" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            name="holidayDate"
            value={formData.holidayDate}
            onChange={handleChange}
            required={mode === "single"}
            className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
        <select
          name="holidayType"
          value={formData.holidayType}
          onChange={handleChange}
          required
          className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="PUBLIC">Public Holiday</option>
          <option value="COMPANY">Company Holiday</option>
          <option value="SHUTDOWN">Office Shutdown</option>
          <option value="FESTIVAL">Festival Holiday</option>
          <option value="REGIONAL">Regional Holiday</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Optional description..."
        ></textarea>
      </div>

      <div className="flex items-center">
        <input
          id="isOptional"
          type="checkbox"
          name="isOptional"
          checked={formData.isOptional}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="isOptional" className="ml-2 block text-sm text-gray-700">
          Mark as Optional Holiday
        </label>
      </div>

      {/* Half Day Option */}
      <div className="border-t border-gray-150 pt-4 space-y-4">
        <div className="flex items-center">
          <input
            id="isHalfDay"
            type="checkbox"
            name="isHalfDay"
            checked={formData.isHalfDay}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="isHalfDay" className="ml-2 block text-sm font-medium text-gray-700">
            Is Half Day?
          </label>
        </div>

        {formData.isHalfDay && (
          <div className="grid grid-cols-2 gap-4 pl-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required={formData.isHalfDay}
                className="w-full text-gray-700 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required={formData.isHalfDay}
                className="w-full text-gray-700 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
