import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import HasPermission from "@/components/rbac/HasPermission";

export default function CountriesTable({ countries, openEditModal, setDeleteTarget }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">ISO Codes</th>
            <th className="px-6 py-4">Phone / Currency</th>
            <th className="px-6 py-4">Region</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {countries.length > 0 ? (
            countries.map((country) => (
              <tr key={country.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-800">{country.name}</div>
                </td>
                <td className="px-6 py-4 text-gray-600 font-mono text-[10px]">
                  <div>2: {country.iso2Code}</div>
                  <div>3: {country.iso3Code}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <div>{country.phoneCode ? `+${country.phoneCode}` : "-"}</div>
                  <div>{country.currencyCode || "-"}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {country.region || "-"}
                </td>
                <td className="px-6 py-4">
                  {country.isActive ? (
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-100 rounded text-[10px] font-bold">Active</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[10px] font-bold">Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <HasPermission permission="country:update">
                    <button
                      onClick={() => openEditModal(country)}
                      className="p-1 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4 inline" />
                    </button>
                  </HasPermission>
                  <HasPermission permission="country:delete">
                    <button
                      onClick={() => setDeleteTarget(country)}
                      className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 inline" />
                    </button>
                  </HasPermission>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-semibold">
                No countries found. Click "Create Country" to add one.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
