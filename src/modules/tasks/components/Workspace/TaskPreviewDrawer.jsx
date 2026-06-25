import React, { useState } from "react";
import { useTaskStore } from "../../store/taskStore";
import { useTaskDetailQuery, useTaskStatusesQuery } from "../../queries/tasks.query";
import { 
  useChangeTaskStatusMutation, 
  useArchiveTaskMutation,
  useUpdateTaskMutation,
} from "../../mutations/tasks.mutation";
import Drawer from "../../../../components/common/Drawer";
import { 
  Edit, Archive, UserPlus, Send, CheckSquare, 
  Paperclip, MessageSquare, Activity, Calendar, FileText,
  User, Flag, Clock
} from "lucide-react";
import { toast } from "sonner";

// Health status badge color mapping
const HEALTH_COLORS = {
  HEALTHY: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  AT_RISK: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
  DELAYED: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
  BLOCKED: { bg: 'bg-gray-900', text: 'text-white', dot: 'bg-gray-400' },
  COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
};

// Priority color mapping
const PRIORITY_COLORS = {
  Low: 'text-blue-600',
  Medium: 'text-yellow-600',
  High: 'text-orange-600',
  Urgent: 'text-red-600',
};

function UserAvatar({ name, size = "sm" }) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';
  const sizeClass = size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";
  return (
    <div className={`${sizeClass} rounded-full bg-blue-100 border-2 border-white flex items-center justify-center font-bold text-blue-700`}>
      {initials}
    </div>
  );
}

export default function TaskPreviewDrawer() {
  const { isTaskDrawerOpen, closeTaskDrawer, selectedTaskId } = useTaskStore();
  const { data: task, isLoading, isError } = useTaskDetailQuery(selectedTaskId);
  const { data: statuses = [] } = useTaskStatusesQuery();
  
  const changeStatusMutation = useChangeTaskStatusMutation();
  const archiveMutation = useArchiveTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();

  const [commentInput, setCommentInput] = useState("");

  if (!selectedTaskId) return null;

  const handleStatusChange = (newStatusId) => {
    if (!task) return;
    // Use the dedicated status endpoint — it requires version for the underlying update
    // We pass the current task version to satisfy optimistic locking
    changeStatusMutation.mutate({ 
      id: task.id, 
      payload: { 
        statusId: parseInt(newStatusId),
        version: task.version ?? 0
      }
    });
  };

  return (
    <Drawer
      isOpen={isTaskDrawerOpen}
      onClose={closeTaskDrawer}
      title="Task Preview"
      widthClass="w-full sm:w-[600px] md:w-[720px]"
    >
      {isLoading ? (
        <div className="p-6 space-y-4 animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 rounded w-full mt-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mt-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      ) : isError || !task ? (
        <div className="p-12 flex flex-col items-center justify-center h-full text-center space-y-4">
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold">!</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Failed to load task</h3>
            <p className="text-sm text-gray-500 mt-1">There was an error loading the task details, or it might have been deleted.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full bg-white relative">
          
          {/* Sticky Action Header */}
          <div className="px-6 py-3 bg-gray-50/80 backdrop-blur-sm border-b border-gray-100 flex flex-wrap gap-2 items-center justify-between sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-2">
              {/* Dynamic Status Selector from API */}
              <select 
                className="text-sm font-medium border border-gray-300 rounded-lg bg-white py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                value={task.statusId || ""}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={changeStatusMutation.isPending}
              >
                <option value="" disabled>Select Status</option>
                {statuses.length > 0
                  ? statuses.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))
                  : (
                    // Fallback to current status name if statuses not loaded
                    task.status && <option value={task.statusId}>{task.status.name}</option>
                  )
                }
              </select>
              <button 
                title="Quick Assign"
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <UserPlus className="w-4 h-4" />
              </button>
              <button 
                title={task.isArchived ? "Unarchive Task" : "Archive Task"}
                onClick={() => archiveMutation.mutate({ id: task.id, isArchived: !task.isArchived })}
                disabled={archiveMutation.isPending}
                className={`p-1.5 rounded-lg transition-colors ${
                  task.isArchived 
                    ? 'text-orange-600 bg-orange-50 hover:bg-orange-100' 
                    : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <Archive className="w-4 h-4" />
              </button>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              <Edit className="w-4 h-4" />
              Full Edit
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            
            {/* Title & Code */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded mt-1 shrink-0">{task.taskCode}</span>
                <h2 className="text-xl font-bold text-gray-900 leading-tight">{task.title}</h2>
              </div>
              {task.isArchived && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">
                  <Archive className="w-3 h-3" /> Archived
                </span>
              )}
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {/* Priority */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Flag className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Priority</div>
                  {task.priority ? (
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: task.priority.colorCode || task.priority.color || '#888' }}></span>
                      <span className={PRIORITY_COLORS[task.priority.name] || 'text-gray-700'}>{task.priority.name}</span>
                    </div>
                  ) : <span className="text-gray-400">Not set</span>}
                </div>
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Due Date</div>
                  {task.dueDate ? (
                    <div className="font-medium text-gray-800">{new Date(task.dueDate).toLocaleDateString()}</div>
                  ) : <span className="text-gray-400">No due date</span>}
                </div>
              </div>

              {/* Owner */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <User className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Owner</div>
                  {task.owner ? (
                    <div className="flex items-center gap-1.5">
                      <UserAvatar name={task.owner.name} />
                      <span className="font-medium text-gray-800 truncate">{task.owner.name}</span>
                    </div>
                  ) : <span className="text-gray-400">Unassigned</span>}
                </div>
              </div>

              {/* Health Status */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Activity className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Health</div>
                  {task.healthStatus ? (
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${HEALTH_COLORS[task.healthStatus]?.bg || 'bg-gray-100'} ${HEALTH_COLORS[task.healthStatus]?.text || 'text-gray-800'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${HEALTH_COLORS[task.healthStatus]?.dot || 'bg-gray-400'}`}></span>
                      {task.healthStatus}
                    </span>
                  ) : <span className="text-gray-400">N/A</span>}
                </div>
              </div>
            </div>

            {/* Associated Team (Assignees) */}
            {task.assignees?.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-900">Associated Team</h3>
                <div className="flex flex-wrap gap-2">
                  {task.assignees.map((assignee, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
                      <UserAvatar name={assignee.user?.name} />
                      <span className="text-xs font-medium text-blue-800">{assignee.user?.name || `User ${assignee.userId}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" /> Description
              </h3>
              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg leading-relaxed whitespace-pre-wrap border border-gray-100">
                {task.description || <span className="italic text-gray-400">No description provided.</span>}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-gray-400" /> Progress
                </h3>
                <span className="font-semibold text-blue-600">{task.completionPercentage || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${task.completionPercentage || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Stats Row — commentsCount / attachmentsCount from list API */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center justify-center border border-gray-100">
                <Paperclip className="w-4 h-4 text-gray-400 mb-1" />
                <span className="text-lg font-bold text-gray-900">{task.attachmentsCount ?? task.attachments?.length ?? 0}</span>
                <span className="text-xs text-gray-500">Attachments</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center justify-center border border-gray-100">
                <MessageSquare className="w-4 h-4 text-gray-400 mb-1" />
                <span className="text-lg font-bold text-gray-900">{task.commentsCount ?? task.comments?.length ?? 0}</span>
                <span className="text-xs text-gray-500">Comments</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center justify-center border border-gray-100">
                <Clock className="w-4 h-4 text-gray-400 mb-1" />
                <span className="text-lg font-bold text-gray-900">{task.estimatedMinutes ? `${task.estimatedMinutes}m` : '-'}</span>
                <span className="text-xs text-gray-500">Estimated</span>
              </div>
            </div>

            {/* Quick Comment */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Add a Comment</h3>
              <div className="relative">
                <textarea 
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] pr-14 resize-none outline-none bg-gray-50 transition-colors"
                  placeholder="Type your comment here..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                ></textarea>
                <button 
                  onClick={() => {
                    if (commentInput.trim()) {
                      toast.info("Comment API coming soon — full edit mode recommended.");
                      setCommentInput("");
                    }
                  }}
                  className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </Drawer>
  );
}
