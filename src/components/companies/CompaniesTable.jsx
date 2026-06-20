import React from "react";
import { Trash2 } from "lucide-react";

export default function CompaniesTable({
  paginatedCompanies,
  selectedCompany,
  sortField,
  sortOrder,
  handleSort,
  handleOpenDrawer,
  toggleActiveInline,
  setDeleteTarget,
  userType,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
            <th
              onClick={() => handleSort("name")}
              className="px-6 py-4 cursor-pointer hover:text-gray-900 transition-colors"
            >
              Workspace Name {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th
              onClick={() => handleSort("clientId")}
              className="px-6 py-4 cursor-pointer hover:text-gray-900 transition-colors"
            >
              Tenant Client ID {sortField === "clientId" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th
              onClick={() => handleSort("isActive")}
              className="px-6 py-4 cursor-pointer hover:text-gray-900 transition-colors"
            >
              Status {sortField === "isActive" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {paginatedCompanies.map((company) => {
            const isSelected = selectedCompany?.id === company.id;
            return (
              <tr
                key={company.id}
                onClick={() => handleOpenDrawer(company)}
                className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${
                  isSelected ? "bg-blue-50/40" : ""
                }`}
              >
                <td className="px-6 py-4 font-bold text-gray-800">
                  {company.name?.charAt(0).toUpperCase() + company.name?.slice(1)}
                </td>

                <td className="px-6 py-4 text-gray-500 font-medium">
                  Client #{company.clientId}
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleActiveInline(company);
                    }}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-full border transition-colors cursor-pointer ${
                      company.isActive
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {company.isActive ? "Active" : "Disabled"}
                  </button>
                </td>

                <td
                  className="px-6 py-4 text-right space-x-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(userType === "super_admin" || userType === "client_admin") && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(company);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer rounded-lg hover:bg-red-50 inline-flex items-center justify-center"
                      title="Delete Workspace"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}

          {paginatedCompanies.length === 0 && (
            <tr>
              <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-semibold">
                No matching companies found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
