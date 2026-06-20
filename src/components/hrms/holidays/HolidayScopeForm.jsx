import React from "react";

export default function HolidayScopeForm({ formData, handleChange, companies, handleCompanyChange }) {
  return (
    <div className="pt-4 border-t border-gray-200">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Scope</h4>
      <div className="space-y-3">
        <div className="flex items-center">
          <input
            id="appliesAll"
            name="appliesTo"
            type="radio"
            value="all"
            checked={formData.appliesTo === "all"}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300"
          />
          <label htmlFor="appliesAll" className="ml-3 block text-sm font-medium text-gray-700">
            Entire Client
            <p className="text-xs text-gray-500 font-normal mt-0.5">Applies to all companies</p>
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="appliesSelected"
            name="appliesTo"
            type="radio"
            value="selected"
            checked={formData.appliesTo === "selected"}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300"
          />
          <label htmlFor="appliesSelected" className="ml-3 block text-sm font-medium text-gray-700">
            Selected Companies
            <p className="text-xs text-gray-500 font-normal mt-0.5">Applies only to specific offices</p>
          </label>
        </div>
      </div>

      {formData.appliesTo === "selected" && (
        <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50 max-h-48 overflow-y-auto">
          {companies.length === 0 ? (
            <p className="text-sm text-gray-500">No companies found.</p>
          ) : (
            <div className="space-y-2">
              {companies.map((company) => (
                <div key={company.id} className="flex items-center">
                  <input
                    id={`company-${company.id}`}
                    type="checkbox"
                    checked={formData.companyIds.includes(company.id)}
                    onChange={() => handleCompanyChange(company.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor={`company-${company.id}`} className="ml-2 block text-sm text-gray-700">
                    {company.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
