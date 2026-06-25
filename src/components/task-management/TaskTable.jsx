"use client";

import { Edit2, Trash2, Eye, Calendar, Clock, AlertCircle } from "lucide-react";
import HasPermission from "@/components/rbac/HasPermission";
import { format } from "date-fns";

const statusColors = {
  PENDING: "bg-amber-50 text-amber-600 border border-amber-100",
  IN_PROGRESS: "bg-blue-50 text-blue-600 border border-blue-100",
  COMPLETED: "bg-green-50 text-green-600 border border-green-100",
};

const priorityColors = {
  LOW: "text-gray-500 bg-gray-50 border-gray-100",
  MEDIUM: "text-blue-500 bg-blue-50 border-blue-100",
  HIGH: "text-orange-500 bg-orange-50 border-orange-100",
  URGENT: "text-red-500 bg-red-50 border-red-100",
};

export default function TaskTable({ tasks, onEdit, onDelete, onView }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center border-t border-gray-50">
        <AlertCircle className="h-10 w-10 text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium text-sm">No tasks found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
            <th className="px-6 py-4">Task Info</th>
            <th className="px-6 py-4">Status & Priority</th>
            <th className="px-6 py-4">Timeline</th>
            <th className="px-6 py-4">Progress</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 text-xs">
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="hover:bg-blue-50/20 transition-colors group cursor-pointer"
              onClick={() => onView(task)}
            >
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800 text-sm group-hover:text-[#007aff] transition-colors">{task.title}</span>
                  <span className="text-[10px] text-gray-400 font-mono mt-0.5">{task.taskCode || `TSK-${task.id}`}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-2 items-start">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${statusColors[task.status?.name || 'PENDING'] || statusColors.PENDING}`}>
                    {task.status?.name || 'PENDING'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${priorityColors[task.priority?.name || 'MEDIUM'] || priorityColors.MEDIUM}`}>
                    {task.priority?.name || 'MEDIUM'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1.5 text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    {task.dueDate ? format(new Date(task.dueDate), "MMM dd, yyyy") : "No Due Date"}
                  </div>
                  {task.estimatedMinutes > 0 && (
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <Clock className="h-3 w-3 text-gray-300" />
                      {task.estimatedMinutes} mins est.
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1 w-32">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
                    <span>{task.completionPercentage || 0}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${task.completionPercentage === 100 ? 'bg-green-500' : 'bg-[#007aff]'}`}
                      style={{ width: `${task.completionPercentage || 0}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                <HasPermission permission="tasks:update">
                  <button
                    onClick={() => onEdit(task)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors"
                    title="Edit Task"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </HasPermission>
                <HasPermission permission="tasks:delete">
                  <button
                    onClick={() => onDelete(task)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </HasPermission>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
