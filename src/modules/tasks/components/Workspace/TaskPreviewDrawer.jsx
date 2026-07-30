import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTaskStore } from "../../store/taskStore";
import { useTaskDetailQuery, useTaskStatusesQuery, useSubtasksQuery } from "../../queries/tasks.query";
import {
  useChangeTaskStatusMutation,
  useArchiveTaskMutation,
  useUpdateTaskMutation,
  useCreateSubtaskMutation,
  useDeleteSubtaskMutation,
} from "../../mutations/tasks.mutation";
import Drawer from "../../../../components/common/Drawer";
import {
  Edit, Archive, UserPlus, Send, CheckSquare,
  Paperclip, MessageSquare, Activity, Calendar, FileText,
  User, Flag, Clock, Plus, Trash2, ChevronDown, ChevronRight,
  GitBranch, Loader2, X,
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
const priorityStyles = {
  low: "text-green-500",
  medium: "text-yellow-500",
  high: "text-red-500"
};

const STATUS_CHIP_COLORS = {
  'Open': 'bg-blue-100 text-blue-700 border-blue-200',
  'In Progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Completed': 'bg-green-100 text-green-700 border-green-200',
  'Hold': 'bg-gray-100 text-gray-600 border-gray-200',
  'Closed': 'bg-purple-100 text-purple-700 border-purple-200',
};

function getStatusChipClass(statusName) {
  return STATUS_CHIP_COLORS[statusName] || 'bg-gray-100 text-gray-600 border-gray-200';
}

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

// ─── Subtask Quick-Add Form ───────────────────────────────────────────────────
function SubtaskQuickAddForm({ parentTaskId, statuses, onCancel }) {
  const [title, setTitle] = useState('');
  const [statusName, setStatusName] = useState('');
  const [priorityName, setPriorityName] = useState('');
  const createMutation = useCreateSubtaskMutation(parentTaskId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Subtask title is required');
      return;
    }

    const payload = {
      title: title.trim(),
      statusName: statusName || undefined,
      priorityName: priorityName || undefined,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        setTitle('');
        setStatusName('');
        setPriorityName('');
        onCancel();
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-3 animate-in slide-in-from-top-2 duration-200"
    >
      <div className="flex items-center gap-2 mb-1">
        <GitBranch className="w-3.5 h-3.5 text-indigo-500" />
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">New Subtask</span>
      </div>

      {/* Title */}
      <input
        type="text"
        autoFocus
        placeholder="Subtask title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Escape') onCancel(); }}
        className="w-full px-3 py-2 border border-indigo-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
      />

      {/* Status + Priority row */}
      <div className="grid grid-cols-2 gap-2">
        <select
          value={statusName}
          onChange={(e) => setStatusName(e.target.value)}
          className="w-full px-2 py-1.5 border border-indigo-200 rounded-lg bg-white text-xs focus:ring-1 focus:ring-indigo-400 outline-none"
        >
          <option value="">Status (optional)</option>
          {statuses.length > 0
            ? statuses.map(s => <option key={s.id} value={s.name}>{s.name}</option>)
            : (
              <>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Hold">Hold</option>
              </>
            )
          }
        </select>
        <select
          value={priorityName}
          onChange={(e) => setPriorityName(e.target.value)}
          className="w-full px-2 py-1.5 border border-indigo-200 rounded-lg bg-white text-xs focus:ring-1 focus:ring-indigo-400 outline-none"
        >
          <option value="">Priority (optional)</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={createMutation.isPending || !title.trim()}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {createMutation.isPending
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating...</>
            : <><Plus className="w-3.5 h-3.5" /> Create Subtask</>
          }
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Single Subtask Row ───────────────────────────────────────────────────────
function SubtaskRow({ subtask, parentTaskId, index }) {
  const deleteMutation = useDeleteSubtaskMutation(parentTaskId);
  const statusName = subtask.status?.name || '';
  const priorityName = subtask.priority?.name || '';
  const isCompleted = subtask.status?.isCompleted;

  return (
    <div className={`flex items-center gap-3 py-2.5 px-3 rounded-lg border transition-all group ${
      isCompleted
        ? 'bg-green-50/50 border-green-100 opacity-80'
        : 'bg-white border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30'
    }`}>
      {/* Tree connector line visual */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-3.5 h-px bg-gray-300" />
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
          isCompleted ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-white'
        }`}>
          {isCompleted && (
            <div className="w-2 h-2 rounded-full bg-green-500" />
          )}
        </div>
      </div>

      {/* Subtask index badge */}
      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-bold shrink-0">
        {index + 1}
      </span>

      {/* Title */}
      <span className={`flex-1 text-sm font-medium truncate ${
        isCompleted ? 'line-through text-gray-400' : 'text-gray-800'
      }`} title={subtask.title}>
        {subtask.title}
      </span>

      {/* Status chip */}
      {statusName && (
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${getStatusChipClass(statusName)}`}>
          {statusName}
        </span>
      )}

      {/* Priority */}
      {priorityName && (
        <span className={`text-[11px] font-bold shrink-0 ${priorityStyles[priorityName.toLowerCase()] || 'text-gray-400'}`} title={priorityName}>
          !
        </span>
      )}

      {/* Task code */}
      {subtask.taskCode && (
        <span className="text-[11px] font-mono text-gray-400 shrink-0 hidden group-hover:block">
          {subtask.taskCode}
        </span>
      )}

      {/* Delete */}
      <button
        type="button"
        onClick={() => {
          if (window.confirm(`Delete subtask "${subtask.title}"?`)) {
            deleteMutation.mutate(subtask.id);
          }
        }}
        disabled={deleteMutation.isPending}
        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all p-1 rounded cursor-pointer shrink-0 disabled:opacity-30"
        title="Delete subtask"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Subtasks Panel ───────────────────────────────────────────────────────────
function SubtasksPanel({ taskId, statuses }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: subtasks = [], isLoading } = useSubtasksQuery(taskId);

  const completedCount = subtasks.filter(s => s.status?.isCompleted).length;
  const progressPct = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;

  return (
    <div className="space-y-2">
      {/* Panel header */}
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setIsExpanded(v => !v)}
      >
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-bold text-gray-900">Subtasks</h3>
          {subtasks.length > 0 && (
            <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
              {completedCount}/{subtasks.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {!showAddForm && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIsExpanded(true); setShowAddForm(true); }}
              className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Subtask
            </button>
          )}
          {isExpanded
            ? <ChevronDown className="w-4 h-4 text-gray-400" />
            : <ChevronRight className="w-4 h-4 text-gray-400" />
          }
        </div>
      </div>

      {/* Progress bar (when has subtasks) */}
      {subtasks.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-500 shrink-0">{progressPct}%</span>
        </div>
      )}

      {isExpanded && (
        <div>
          {/* Loading */}
          {isLoading && (
            <div className="flex items-center gap-2 py-4 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading subtasks...</span>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && subtasks.length === 0 && !showAddForm && (
            <div
              className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-indigo-100 rounded-xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors"
              onClick={() => setShowAddForm(true)}
            >
              <GitBranch className="w-8 h-8 text-indigo-200 mb-2" />
              <p className="text-sm text-gray-500 font-medium">No subtasks yet</p>
              <p className="text-xs text-indigo-400 mt-1">Click to add the first subtask</p>
            </div>
          )}

          {/* Subtask list */}
          {!isLoading && subtasks.length > 0 && (
            <div className="space-y-1.5 pl-2 border-l-2 border-indigo-100 ml-2">
              {subtasks.map((sub, idx) => (
                <SubtaskRow
                  key={sub.id}
                  subtask={sub}
                  parentTaskId={taskId}
                  index={idx}
                />
              ))}
            </div>
          )}

          {/* Quick add form */}
          {showAddForm && (
            <SubtaskQuickAddForm
              parentTaskId={taskId}
              statuses={statuses}
              onCancel={() => setShowAddForm(false)}
            />
          )}

          {/* Add another button when list is not empty */}
          {!isLoading && subtasks.length > 0 && !showAddForm && (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-2 border-2 border-dashed border-indigo-200 text-indigo-500 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Another Subtask
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TaskPreviewDrawer() {
  const { closeTaskDrawer, isTaskDrawerOpen, selectedTaskId, openCreateTaskDrawer } = useTaskStore();
  
  const { data: task, isLoading, isError } = useTaskDetailQuery(selectedTaskId);
  const { data: statuses = [] } = useTaskStatusesQuery();

  const user = useSelector(state => state.auth.user);
  const loggedInUserId = user?.userId || user?.id;
  const isOwner = task?.ownerId === loggedInUserId;
  const hasAssignees = task?.assignees && task?.assignees.length > 0;

  const archiveMutation = useArchiveTaskMutation();
  const changeStatusMutation = useChangeTaskStatusMutation();

  const isStatusDisabled = changeStatusMutation.isPending || (isOwner && hasAssignees);

  const handleStatusChange = (newStatusId) => {
    if (!task) return;
    changeStatusMutation.mutate({
      taskId: task.id,
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
                className="text-sm font-medium border border-gray-300 rounded-lg bg-white py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                value={task.statusId || ""}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isStatusDisabled}
              >
                <option value="" disabled>Select Status</option>
                {statuses.length > 0
                  ? statuses.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))
                  : (
                    task.status && <option value={task.statusId}>{task.status.name}</option>
                  )
                }
              </select>
              <button
                title="Edit Task"
                onClick={() => {
                  closeTaskDrawer();
                  openCreateTaskDrawer(task.id);
                }}
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1.5 font-medium text-sm"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
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
                    <span className="flex items-center gap-1 text-sm font-medium">
                      <span className={`${priorityStyles[task.priority.name?.toLowerCase()] || 'text-gray-400'} font-bold shrink-0`}>!</span>
                      <span className="text-gray-800">{task.priority.name}</span>
                    </span>
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

            {/* ── SUBTASKS PANEL ────────────────────────────────────────── */}
            {/* Only show for parent tasks (not subtasks themselves) */}
            {!task.parentTaskId && (
              <div className="bg-gradient-to-b from-indigo-50/40 to-white border border-indigo-100 rounded-xl p-4">
                <SubtasksPanel taskId={task.id} statuses={statuses} />
              </div>
            )}

            {/* Stats Row */}
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
