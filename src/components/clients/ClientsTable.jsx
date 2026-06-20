import React from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Edit2, Trash2 } from "lucide-react";

export default function ClientsTable({
  paginatedClients,
  selectedClient,
  sortField,
  sortOrder,
  handleSort,
  handleOpenDrawer,
  openModal,
  setDeleteConfirmId,
}) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
            <th
              onClick={() => handleSort("name")}
              className="px-6 py-4 cursor-pointer hover:text-gray-900 transition-colors"
            >
              Client Name {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th
              onClick={() => handleSort("email")}
              className="px-6 py-4 cursor-pointer hover:text-gray-900 transition-colors"
            >
              Admin Email {sortField === "email" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th
              onClick={() => handleSort("allowedCompanies")}
              className="px-6 py-4 cursor-pointer hover:text-gray-900 transition-colors"
            >
              Workspaces Limit {sortField === "allowedCompanies" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th
              onClick={() => handleSort("allowedUsers")}
              className="px-6 py-4 cursor-pointer hover:text-gray-900 transition-colors"
            >
              Users Limit {sortField === "allowedUsers" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {paginatedClients.map((client) => {
            const isSelected = selectedClient?.id === client.id;
            return (
              <tr
                key={client.id}
                onClick={() => handleOpenDrawer(client)}
                className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${
                  isSelected ? "bg-blue-50/40" : ""
                }`}
              >
                <td className="px-6 py-4 font-bold text-gray-800">{client.name}</td>
                <td className="px-6 py-4 text-gray-500 font-medium">{client.email}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md font-bold bg-blue-50 text-blue-700 border border-blue-100">
                    {client.allowedCompanies} Max
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md font-bold bg-purple-50 text-purple-700 border border-purple-100">
                    {client.allowedUsers} Max
                  </span>
                </td>
                <td
                  className="px-6 py-4 text-right space-x-2"
                  onClick={(e) => e.stopPropagation()} // Stop drawer from opening when clicking action icons
                >
                  <button
                    onClick={() => router.push(`/clients/${client.id}/access`)}
                    className="p-1 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Access Config"
                  >
                    <ShieldAlert className="h-4 w-4 inline" />
                  </button>
                  <button
                    onClick={() => openModal(client)}
                    className="p-1 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Edit limits"
                  >
                    <Edit2 className="h-4 w-4 inline" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(client.id)}
                    className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete client cascade"
                  >
                    <Trash2 className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            );
          })}

          {paginatedClients.length === 0 && (
            <tr>
              <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-semibold">
                No matching tenants found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
