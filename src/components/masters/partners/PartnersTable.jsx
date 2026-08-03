import React from "react";
import { Edit2, Trash2, RefreshCcw, ShieldAlert, Ban, Eye, MessageCircle } from "lucide-react";
import HasPermission from "@/components/rbac/HasPermission";

export default function PartnersTable({
  partners,
  openViewDrawer,
  openEditModal,
  openFollowUpDrawer,
  setDeleteTarget,
  setRestoreTarget,
  setPermanentDeleteTarget,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse ">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
            <th className="px-6 py-4">Entity / Role</th>
            <th className="px-6 py-4">Contact Detail</th>
            <th className="px-6 py-4">Country</th>
            <th className="px-6 py-4">Associations</th>
            <th className="px-6 py-4">Follow Ups</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {partners.length > 0 ? (
            partners.map((item) => {
              const today = new Date().toLocaleDateString("en-CA");
              const dueTodayCount = item.followUps?.filter(f => {
                if (!f.nextFollowupDate) return false;
                const localNextDate = new Date(f.nextFollowupDate).toLocaleDateString("en-CA");
                return localNextDate <= today && !['Confirmed', 'Closed', 'Deal Finalized', 'Completed'].includes(f.status);
              }).length || 0;
              const upcomingCount = item.followUps?.filter(f => {
                if (!f.nextFollowupDate) return false;
                const localNextDate = new Date(f.nextFollowupDate).toLocaleDateString("en-CA");
                return localNextDate > today && !['Confirmed', 'Closed', 'Deal Finalized', 'Completed'].includes(f.status);
              }).length || 0;
              const completedCount = item.followUps?.filter(f =>
                ['Confirmed', 'Closed', 'Deal Finalized', 'Completed'].includes(f.status)
              ).length || 0;

              return (
              <tr
                key={item.id}
                onClick={() => openViewDrawer(item)}
                className="hover:bg-gray-50/75 transition-colors cursor-pointer group/row"
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-800 group-hover/row:text-[#007aff] transition-colors">
                    {item.entityName}
                  </div>
                  <div className="text-[11px] text-[#007aff] font-medium mt-0.5">
                    {item.partnerRole?.name || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <div className="truncate max-w-[200px]">{item.contactEmail || "-"}</div>
                  {item.city && <div className="text-[10px] text-gray-400">{item.city}</div>}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {item.country || "-"}
                </td>
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[10px] font-bold">
                      {item.contacts?.length || 0} Contacts
                    </span>
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-600 border border-purple-100 rounded text-[10px] font-bold">
                      {item.products?.length || 0} Products
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-col gap-1.5">
                    {dueTodayCount > 0 && <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded w-max">🔴 {dueTodayCount} Due Today</span>}
                    {upcomingCount > 0 && <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-700 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded w-max">🟡 {upcomingCount} Upcoming</span>}
                    {completedCount > 0 && <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded w-max">🟢 {completedCount} Completed</span>}
                    {dueTodayCount === 0 && upcomingCount === 0 && completedCount === 0 && <span className="text-[10px] text-gray-400 font-semibold">-</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {item.isActive ? (
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-100 rounded text-[10px] font-bold">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 rounded text-[10px] font-bold">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => openViewDrawer(item)}
                    className="p-1 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors cursor-pointer"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4 inline" />
                  </button>

                  <HasPermission permission="follow_up:create">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (typeof openFollowUpDrawer === 'function') openFollowUpDrawer(item);
                      }}
                      className="p-1 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                      title="Follow Up"
                    >
                      <MessageCircle className="h-4 w-4 inline" />
                    </button>
                  </HasPermission>

                  {item.isActive ? (
                    <>
                      <HasPermission permission="partner:update">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4 inline" />
                        </button>
                      </HasPermission>
                      <HasPermission permission="partner:delete">
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-1 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors cursor-pointer"
                          title="Deactivate"
                        >
                          <Ban className="h-4 w-4 inline" />
                        </button>
                      </HasPermission>
                    </>
                  ) : (
                    <>
                      <HasPermission permission="partner:update">
                        <button
                          onClick={() => setRestoreTarget(item)}
                          className="p-1 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
                          title="Restore"
                        >
                          <RefreshCcw className="h-4 w-4 inline" />
                        </button>
                      </HasPermission>
                      <HasPermission permission="partner:force_delete">
                        <button
                          onClick={() => setPermanentDeleteTarget(item)}
                          className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Permanent Delete"
                        >
                          <ShieldAlert className="h-4 w-4 inline" />
                        </button>
                      </HasPermission>
                    </>
                  )}
                </td>
              </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-semibold">
                No partners found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

