import React, { useMemo } from "react";
import Modal from "@/components/modals/Modal";
import CountrySelect from "@/components/common/CountrySelect";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

export default function CountryModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  isSaving,
  error,
  isEditMode,
}) {
  // Determine dynamically if the selected country name is a standard i18n country
  const isStandardCountry = useMemo(() => {
    if (!form.name) return false;
    return Object.values(countries.getNames("en")).some(
      (n) => n.toLowerCase() === form.name.toLowerCase()
    );
  }, [form.name]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Country" : "New Country"}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Country Name
          </label>
          <CountrySelect
            value={form.name}
            onChange={(countryData) =>
              setForm({
                ...form,
                name: countryData.name,
                iso2Code: countryData.iso2Code,
                iso3Code: countryData.iso3Code,
              })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              ISO-2 Code
            </label>
            <input
              type="text"
              required
              maxLength={2}
              value={form.iso2Code}
              onChange={(e) => setForm({ ...form, iso2Code: e.target.value.toUpperCase() })}
              readOnly={isStandardCountry}
              className={`w-full border rounded-xl px-3 py-2 text-xs outline-none uppercase transition-colors ${
                isStandardCountry
                  ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed font-medium"
                  : "border-gray-200 text-gray-700 focus:ring-1 focus:ring-[#007aff]"
              }`}
              placeholder="IN"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              ISO-3 Code
            </label>
            <input
              type="text"
              required
              maxLength={3}
              value={form.iso3Code}
              onChange={(e) => setForm({ ...form, iso3Code: e.target.value.toUpperCase() })}
              readOnly={isStandardCountry}
              className={`w-full border rounded-xl px-3 py-2 text-xs outline-none uppercase transition-colors ${
                isStandardCountry
                  ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed font-medium"
                  : "border-gray-200 text-gray-700 focus:ring-1 focus:ring-[#007aff]"
              }`}
              placeholder="IND"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Phone Code
            </label>
            <input
              type="text"
              value={form.phoneCode}
              onChange={(e) => setForm({ ...form, phoneCode: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
              placeholder="e.g. 91"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Currency Code
            </label>
            <input
              type="text"
              value={form.currencyCode}
              onChange={(e) => setForm({ ...form, currencyCode: e.target.value.toUpperCase() })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 uppercase"
              placeholder="INR"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Region
          </label>
          <input
            type="text"
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
            placeholder="e.g. Asia"
          />
        </div>

        {isEditMode && (
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="isActiveCountry"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#007aff] focus:ring-[#007aff]"
            />
            <label htmlFor="isActiveCountry" className="text-xs font-semibold text-gray-700">
              Active Status
            </label>
          </div>
        )}

        {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            {isSaving && (
              <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isEditMode ? "Save Changes" : "Create Country"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
