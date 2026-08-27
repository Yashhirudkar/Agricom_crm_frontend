import React from "react";
import { Trash2, Building2, MapPin, Mail, Phone, ExternalLink, Edit2, Eye, MoreVertical } from "lucide-react";
import { getAvatarUrl } from "@/lib/axios";

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
  openEdit,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
            <th className="px-6 py-4">Company</th>
            <th 
              onClick={() => handleSort("companyType")}
              className="px-6 py-4 cursor-pointer hover:text-gray-900 transition-colors"
            >
              Type {sortField === "companyType" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th 
              onClick={() => handleSort("industryType")}
              className="px-6 py-4 cursor-pointer hover:text-gray-900 transition-colors"
            >
              Industry {sortField === "industryType" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th className="px-6 py-4">Contact</th>
            <th className="px-6 py-4">Location</th>
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
                {/* COMPANY INFO & LOGO */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {company.logoUrl ? (
                      <img 
                        src={getAvatarUrl(company.logoUrl)} 
                        alt="Logo" 
                        className="h-9 w-9 rounded-lg object-cover border border-gray-100 shadow-xs" 
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?background=random&color=fff&name=" + (company.name?.charAt(0).toUpperCase() || 'C') }} 
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100 shadow-xs">
                        {company.name?.charAt(0).toUpperCase() || <Building2 className="h-4 w-4" />}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900 text-[13px]">{company.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-gray-400 font-bold tracking-wider">{company.companyCode || `ID: #${company.id}`}</span>
                        {company.website && (
                          <a href={company.website} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-[#007aff] hover:underline flex items-center gap-0.5 text-[10px]">
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* TYPE */}
                <td className="px-6 py-4">
                  <span className={`font-semibold ${company.companyType ? 'text-gray-700' : 'text-gray-400 italic'}`}>
                    {company.companyType || "Not Set"}
                  </span>
                </td>

                {/* INDUSTRY */}
                <td className="px-6 py-4">
                  <span className={`font-semibold ${company.industryType ? 'text-gray-700' : 'text-gray-400 italic'}`}>
                    {company.industryType || "Not Set"}
                  </span>
                </td>

                {/* CONTACT */}
                <td className="px-6 py-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <span className={`truncate max-w-[140px] ${!company.email && 'text-gray-400 italic font-medium'}`}>
                        {company.email || "Not Set"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <span className={`truncate max-w-[140px] ${!company.phone && 'text-gray-400 italic font-medium'}`}>
                        {company.phone || "Not Set"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* LOCATION */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span className={!(company.city || company.state) ? 'text-gray-400 italic' : ''}>
                      {company.city && company.state ? `${company.city}, ${company.state}` : (company.city || company.state || "Not Set")}
                    </span>
                  </div>
                </td>

                {/* STATUS */}
                <td className="px-6 py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleActiveInline(company);
                    }}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md border transition-colors cursor-pointer ${
                      company.isActive
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {company.isActive ? "Active" : "Disabled"}
                  </button>
                </td>

                {/* ACTIONS */}
                <td
                  className="px-6 py-4 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDrawer(company);
                      }}
                      className="p-1.5 text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors cursor-pointer rounded-lg inline-flex items-center justify-center"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {(userType === "super_admin" || userType === "client_admin") && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(company);
                          }}
                          className="p-1.5 text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors cursor-pointer rounded-lg inline-flex items-center justify-center"
                          title="Edit Workspace"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(company);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer rounded-lg inline-flex items-center justify-center"
                          title="Delete Workspace"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}

          {paginatedCompanies.length === 0 && (
            <tr>
              <td colSpan="7" className="px-6 py-16 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 mb-2">
                    <Building2 className="h-6 w-6 text-gray-300" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">No Workspaces Found</h3>
                  <p className="text-xs text-gray-500 max-w-[250px] mx-auto">Get started by creating a new enterprise workspace to manage your data.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
