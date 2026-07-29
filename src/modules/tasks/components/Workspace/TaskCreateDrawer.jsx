import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import Drawer from '../../../../components/drawers/Drawer';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { TaskAPI, ChecklistAPI, TaskAttachmentAPI } from '../../api';
import { useTaskStore } from '../../store/taskStore';
import { useTaskDetailQuery, useSubtasksQuery } from '../../queries/tasks.query';
import { useUpdateTaskMutation } from '../../mutations/tasks.mutation';
import axiosClient from "../../../../lib/axios";

const generateUUID = () => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const priorityStyles = {
  low: "text-green-500",
  medium: "text-yellow-500",
  high: "text-red-500"
};

// Premium Custom Styles for react-select matching Zoho/Jira enterprise look
const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '36px',
    borderRadius: '0.5rem',
    borderColor: state.isFocused ? '#2563eb' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 1px #2563eb' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#2563eb' : '#9ca3af'
    },
    fontSize: '0.8125rem',
    backgroundColor: '#f9fafb',
    cursor: 'pointer'
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#eff6ff',
    borderRadius: '0.375rem',
    border: '1px solid #bfdbfe',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#1e40af',
    fontWeight: '500',
    fontSize: '0.75rem',
    padding: '1px 6px',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#3b82f6',
    borderRadius: '0.375rem',
    '&:hover': {
      backgroundColor: '#dbeafe',
      color: '#1d4ed8',
    },
  }),
  option: (base, state) => ({
    ...base,
    fontSize: '0.8125rem',
    backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#f3f4f6' : 'transparent',
    color: state.isSelected ? 'white' : '#374151',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#2563eb',
      color: 'white'
    }
  }),
  menu: (base) => ({
    ...base,
    zIndex: 99999,
    borderRadius: '0.5rem',
    overflow: 'hidden'
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 99999,
  }),
};


// Fixed status options for subtasks
const SUBTASK_STATUS_OPTIONS = [
  { value: 'Open', label: 'Open' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Hold', label: 'Hold' },
];

// Fixed priority options for subtasks
const SUBTASK_PRIORITY_OPTIONS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

const subtaskStatusColors = {
  'Open': 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  'Completed': 'bg-green-100 text-green-700',
  'Hold': 'bg-gray-100 text-gray-600',
};

// ─── Enterprise Subtask Card Component ──────────────────────────────────────
function SubtaskCard({ index, control, register, remove, onDelete, employeeOptions, statusOptions, priorityOptions }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const { fields: checklistFields, append: appendChecklist, remove: removeChecklist } = useFieldArray({
    control,
    name: `subtasks.${index}.checklists`
  });

  return (
    <div className="border border-indigo-100 rounded-xl bg-gradient-to-b from-indigo-50/40 to-white shadow-sm overflow-hidden">
      {/* Subtask Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 cursor-pointer select-none border-b border-indigo-100"
        onClick={() => setIsExpanded(v => !v)}
      >
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-sm">
            {index + 1}
          </span>
          <span className="text-sm font-semibold text-indigo-900">Subtask {index + 1}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={async (e) => { 
              e.stopPropagation(); 
              setIsDeleting(true);
              try {
                await onDelete(index);
              } finally {
                setIsDeleting(false);
              }
            }}
            className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Remove subtask"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrashIcon className="w-4 h-4" />}
          </button>
          {isExpanded
            ? <ChevronUpIcon className="w-4 h-4 text-indigo-400" />
            : <ChevronDownIcon className="w-4 h-4 text-indigo-400" />
          }
        </div>
      </div>

      {/* Subtask Body */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Row 1: Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder={`Subtask ${index + 1} title`}
              {...register(`subtasks.${index}.title`, { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Row 2: Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Brief description of this subtask..."
              {...register(`subtasks.${index}.description`)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            />
          </div>

          {/* Row 3: Owner + Associated Team */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Owner</label>
              <Controller
                name={`subtasks.${index}.ownerId`}
                control={control}
                render={({ field }) => (
                  <Select
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    options={employeeOptions}
                    placeholder="Select owner..."
                    isClearable
                    styles={selectStyles}
                    value={employeeOptions.find(opt => opt.value === field.value) || null}
                    onChange={(val) => field.onChange(val ? val.value : null)}
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                    menuPosition="fixed"
                  />
                )}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Associated Team</label>
              <Controller
                name={`subtasks.${index}.assigneeIds`}
                control={control}
                render={({ field }) => (
                  <Select
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    options={employeeOptions}
                    isMulti
                    placeholder="Select team members..."
                    styles={selectStyles}
                    value={employeeOptions.filter(opt => (field.value || []).includes(opt.value))}
                    onChange={(selectedOptions) => {
                      // Replace entirely — never merge with previous selection
                      field.onChange(selectedOptions ? selectedOptions.map(v => v.value) : []);
                    }}
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                    menuPosition="fixed"
                  />
                )}
              />
            </div>
          </div>

          {/* Row 4: Status + Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
              <select
                {...register(`subtasks.${index}.statusName`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">-- Select Status --</option>
                {statusOptions.length > 0
                  ? statusOptions.map(s => <option key={s.id} value={s.name}>{s.name}</option>)
                  : SUBTASK_STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)
                }
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Priority</label>
              <select
                {...register(`subtasks.${index}.priorityName`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">-- Select Priority --</option>
                {priorityOptions.length > 0
                  ? priorityOptions.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))
                  : SUBTASK_PRIORITY_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)
                }
              </select>
            </div>
          </div>

          {/* Row 5: Start Date + Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                {...register(`subtasks.${index}.startDate`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                {...register(`subtasks.${index}.dueDate`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Row 6: Estimated Duration */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Estimated Duration (minutes)</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 60"
              {...register(`subtasks.${index}.estimatedMinutes`)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Row 7: Checklist */}
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/40">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-700">Checklist</label>
              <button
                type="button"
                onClick={() => appendChecklist({ title: '' })}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                + Add Item
              </button>
            </div>
            {checklistFields.length === 0 && (
              <p className="text-xs text-gray-400 italic">No checklist items yet.</p>
            )}
            {checklistFields.map((item, ci) => (
              <div key={item.id} className="flex items-center gap-2 mb-1.5">
                <input
                  type="checkbox"
                  disabled
                  className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 cursor-not-allowed opacity-50"
                />
                <input
                  type="text"
                  placeholder={`Item ${ci + 1}`}
                  {...register(`subtasks.${index}.checklists.${ci}.title`)}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded bg-white outline-none focus:ring-1 focus:ring-indigo-400"
                />
                <button
                  type="button"
                  onClick={() => removeChecklist(ci)}
                  className="text-red-400 hover:text-red-600 cursor-pointer"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Row 8: Attachments */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Attachments</label>
            <input
              type="file"
              multiple
              {...register(`subtasks.${index}.attachments`)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-xs cursor-pointer outline-none file:mr-3 file:py-1 file:px-2 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 file:border file:border-indigo-200 file:rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function TaskCreateDrawer() {
  const queryClient = useQueryClient();
  const { isCreateTaskDrawerOpen, closeCreateTaskDrawer, createDrawerMode, createDrawerTaskId } = useTaskStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = createDrawerMode === 'edit' && !!createDrawerTaskId;

  // Queries & Mutations for Edit Mode
  const { data: editTask, isLoading: isEditLoading } = useTaskDetailQuery(isEditMode ? createDrawerTaskId : null);
  const { data: editSubtasks = [], isLoading: isSubtasksLoading } = useSubtasksQuery(isEditMode ? createDrawerTaskId : null);
  const updateTaskMutation = useUpdateTaskMutation();

  const user = useSelector(state => state.auth.user);
  const isSuperAdmin = user?.type === 'SUPER_ADMIN';

  const { register, handleSubmit, control, formState: { errors }, reset, watch, setValue, getValues } = useForm({
    defaultValues: {
      title: '',
      description: '',
      checklists: [],
      subtasks: [],
      attachments: [],
      ownerId: '',
      associatedTeamIds: [],
      statusId: '',
      priorityId: '',
      startDate: '',
      dueDate: '',
      estimatedMinutes: ''
    }
  });

  const selectedCompanyId = watch('companyId');

  // Fetch Companies if Super Admin
  const { data: companiesRes } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const res = await axiosClient.get("/GetCompanies");
      return res.data;
    },
    enabled: isSuperAdmin
  });
  const companies = companiesRes?.data || (Array.isArray(companiesRes) ? companiesRes : []);

  const targetCompanyId = isSuperAdmin ? selectedCompanyId : user?.companyId;

  // Fetch Employees
  const { data: employeesRes } = useQuery({
    queryKey: ['tasks', 'company-employees', targetCompanyId || 'all'],
    queryFn: async () => {
      const headers = targetCompanyId ? { 'x-company-id': targetCompanyId } : {};
      const { data } = await axiosClient.get("/v1/tasks/employees/assignable", { headers });
      return data.data || [];
    }
  });
  const employees = employeesRes || [];

  // ─── PREFILL LOGIC (EDIT MODE) ──────────────────────────────────────────────
  const isFormInitialized = React.useRef(false);

  useEffect(() => {
    if (!isCreateTaskDrawerOpen) {
      isFormInitialized.current = false;
      return;
    }

    if (isEditMode) {
      if (editTask && !isEditLoading && !isSubtasksLoading && !isFormInitialized.current) {
        reset({
          companyId: editTask.companyId || '',
          title: editTask.title || '',
          description: editTask.description || '',
          statusId: editTask.statusId?.toString() || '',
          priorityId: editTask.priorityId?.toString() || '',
          ownerId: editTask.ownerId || '',
          associatedTeamIds: editTask.assignees?.map(a => a.userId || a.user?.id) || [],
          startDate: editTask.startDate ? editTask.startDate.split('T')[0] : '',
          dueDate: editTask.dueDate ? editTask.dueDate.split('T')[0] : '',
          estimatedMinutes: editTask.estimatedMinutes || '',
          checklists: editTask.checklists?.map(c => ({ title: c.title, id: c.id })) || [],
          subtasks: editSubtasks.map(sub => ({
            id: sub.id,
            title: sub.title || '',
            description: sub.description || '',
            ownerId: sub.ownerId || '',
            assigneeIds: sub.assignees?.map(a => a.userId || a.user?.id) || [],
            statusName: sub.status?.name || '',
            priorityName: sub.priority?.name || '',
            startDate: sub.startDate ? sub.startDate.split('T')[0] : '',
            dueDate: sub.dueDate ? sub.dueDate.split('T')[0] : '',
            estimatedMinutes: sub.estimatedMinutes || '',
            checklists: sub.checklists?.map(c => ({ title: c.title, id: c.id })) || [],
            attachments: []
          }))
        });
        isFormInitialized.current = true;
      }
    } else {
      if (!isFormInitialized.current) {
        reset({
          companyId: '',
          title: '',
          description: '',
          statusId: '',
          priorityId: '',
          ownerId: '',
          associatedTeamIds: [],
          startDate: '',
          dueDate: '',
          estimatedMinutes: '',
          checklists: [],
          subtasks: [],
          attachments: []
        });
        isFormInitialized.current = true;
      }
    }
  }, [isCreateTaskDrawerOpen, isEditMode, editTask, editSubtasks, isEditLoading, isSubtasksLoading, reset]);

  // Fetch Statuses
  const { data: statusesRes } = useQuery({
    queryKey: ['task-statuses'],
    queryFn: async () => {
      const res = await axiosClient.get("/v1/tasks/meta/statuses");
      return res.data;
    }
  });
  const statusOptions = statusesRes?.data || [];

  // Fetch Priorities
  const { data: prioritiesRes } = useQuery({
    queryKey: ['task-priorities'],
    queryFn: async () => {
      const res = await axiosClient.get("/v1/tasks/meta/priorities");
      return res.data;
    }
  });
  const priorityOptions = prioritiesRes?.data || [];

  // Checklists for main task
  const { fields: checklistFields, append: appendChecklist, remove: removeChecklist } = useFieldArray({
    control,
    name: "checklists"
  });

  // Subtasks array
  const { fields: subtaskFields, append: appendSubtask, remove: removeSubtask } = useFieldArray({
    control,
    name: "subtasks"
  });

  const employeeOptions = useMemo(() => {
    const seen = new Set();
    return employees
      .filter(emp => {
        const id = emp.userId || emp.id;
        if (!id || seen.has(id)) return false;
        seen.add(id);
        return true;
      })
      .map(emp => ({
        value: emp.userId || emp.id,
        label: `${emp.firstName || ''} ${emp.lastName || ''}`.trim()
      }));
  }, [employees]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const selectedStatus = statusOptions.find(s => s.id === parseInt(data.statusId));
      const selectedPriority = priorityOptions.find(p => p.id === parseInt(data.priorityId));

      const teamUserIds = data.associatedTeamIds || [];
      const ownerUserId = data.ownerId ? parseInt(data.ownerId) : undefined;
      const filteredTeamUserIds = teamUserIds.filter(id => id !== ownerUserId);

      const payload = {
        title: data.title,
        description: data.description,
        statusId: selectedStatus ? selectedStatus.id : undefined,
        statusName: selectedStatus ? selectedStatus.name : undefined,
        priorityId: selectedPriority ? selectedPriority.id : undefined,
        priorityName: selectedPriority ? selectedPriority.name : undefined,
        estimatedMinutes: data.estimatedMinutes ? parseInt(data.estimatedMinutes) : undefined,
        startDate: data.startDate || undefined,
        dueDate: data.dueDate || undefined,
        ownerId: ownerUserId || undefined,
        assigneeIds: filteredTeamUserIds,
        companyId: isSuperAdmin && selectedCompanyId ? selectedCompanyId : undefined
      };

      const headers = isSuperAdmin && selectedCompanyId ? { 'x-company-id': selectedCompanyId } : {};

      // ─── EDIT MODE ───────────────────────────────────────────────────────────
      if (isEditMode) {
        const { statusName, priorityName, companyId, ...editPayload } = payload;
        
        // Step 1: Update Main Task
        await updateTaskMutation.mutateAsync({
          id: createDrawerTaskId,
          payload: { ...editPayload, version: editTask.version }
        });

        const taskId = createDrawerTaskId;

        // Step 2: Handle Attachments
        if (data.attachments && data.attachments.length > 0) {
          const formData = new FormData();
          Array.from(data.attachments).forEach(file => {
            formData.append('files', file);
          });
          await TaskAttachmentAPI.uploadAttachment(taskId, formData).catch(e => console.error(e));
        }

        // Note: For full enterprise edits, checklists and subtasks in edit mode 
        // require diffing (create, update, delete). To keep it safe and functional
        // based on existing APIs, we handle the main task fields here. New subtasks 
        // added during edit mode will be created.
        if (data.subtasks && data.subtasks.length > 0) {
          for (let si = 0; si < data.subtasks.length; si++) {
            const sub = data.subtasks[si];
            if (sub.id) continue; // Skip already existing subtasks (updates require specific endpoints)
            if (!sub.title?.trim()) continue;

            const subOwnerUserId = sub.ownerId ? parseInt(sub.ownerId) : undefined;
            const subAssigneeIds = (sub.assigneeIds || []).filter(id => id !== subOwnerUserId);

            const subtaskPayload = {
              title: sub.title.trim(),
              description: sub.description || undefined,
              statusName: sub.statusName || undefined,
              priorityName: sub.priorityName || undefined,
              startDate: sub.startDate || undefined,
              dueDate: sub.dueDate || undefined,
              estimatedMinutes: sub.estimatedMinutes ? parseInt(sub.estimatedMinutes) : undefined,
              ownerId: subOwnerUserId || undefined,
              assigneeIds: subAssigneeIds.length > 0 ? subAssigneeIds : undefined,
            };

            await axiosClient.post(`/v1/tasks/${taskId}/subtasks`, subtaskPayload, { headers })
              .catch(e => console.error(`Subtask creation failed:`, e));
          }
        }

        toast.success('Task updated successfully!');
        reset();
        closeCreateTaskDrawer();
        return; // Exit edit mode execution
      }

      // ─── CREATE MODE ─────────────────────────────────────────────────────────
      // Step 1: Create Main Task
      const createdTask = await axiosClient.post("/v1/tasks", payload, {
        headers: {
          ...headers,
          'Idempotency-Key': generateUUID()
        }
      }).then(res => res.data.data);

      const taskId = createdTask.id;

      // Step 2: Create main task checklists
      if (data.checklists && data.checklists.length > 0) {
        for (let i = 0; i < data.checklists.length; i++) {
          await ChecklistAPI.createChecklist(taskId, {
            title: data.checklists[i].title,
            orderIndex: i
          }).catch(e => console.error('Checklist creation error:', e));
        }
      }

      // Step 3: Upload main task attachments
      if (data.attachments && data.attachments.length > 0) {
        const formData = new FormData();
        Array.from(data.attachments).forEach(file => {
          formData.append('files', file);
        });
        await TaskAttachmentAPI.uploadAttachment(taskId, formData).catch(e => console.error(e));
      }

      // Step 4: Create Subtasks — each as a full child task
      if (data.subtasks && data.subtasks.length > 0) {
        for (let si = 0; si < data.subtasks.length; si++) {
          const sub = data.subtasks[si];
          if (!sub.title?.trim()) continue; // Skip untitled subtasks

          // Build subtask payload
          const subOwnerUserId = sub.ownerId ? parseInt(sub.ownerId) : undefined;
          const subAssigneeIds = (sub.assigneeIds || []).filter(id => id !== subOwnerUserId);

          const subtaskPayload = {
            title: sub.title.trim(),
            description: sub.description || undefined,
            statusName: sub.statusName || undefined,
            priorityName: sub.priorityName || undefined,
            startDate: sub.startDate || undefined,
            dueDate: sub.dueDate || undefined,
            estimatedMinutes: sub.estimatedMinutes ? parseInt(sub.estimatedMinutes) : undefined,
            ownerId: subOwnerUserId || undefined,
            assigneeIds: subAssigneeIds.length > 0 ? subAssigneeIds : undefined,
          };

          let createdSubtask;
          try {
            const subtaskRes = await axiosClient.post(
              `/v1/tasks/${taskId}/subtasks`,
              subtaskPayload,
              { headers }
            );
            createdSubtask = subtaskRes.data?.data;
          } catch (e) {
            console.error(`Subtask ${si + 1} creation failed:`, e);
            continue;
          }

          if (!createdSubtask?.id) continue;

          // Create subtask checklists
          if (sub.checklists && sub.checklists.length > 0) {
            for (let ci = 0; ci < sub.checklists.length; ci++) {
              if (!sub.checklists[ci]?.title?.trim()) continue;
              await ChecklistAPI.createChecklist(createdSubtask.id, {
                title: sub.checklists[ci].title.trim(),
                orderIndex: ci
              }).catch(e => console.error('Subtask checklist error:', e));
            }
          }

          // Upload subtask attachments
          if (sub.attachments && sub.attachments.length > 0) {
            const subFormData = new FormData();
            Array.from(sub.attachments).forEach(file => {
              subFormData.append('files', file);
            });
            await TaskAttachmentAPI.uploadAttachment(createdSubtask.id, subFormData)
              .catch(e => console.error('Subtask attachment error:', e));
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully!');
      reset();
      closeCreateTaskDrawer();
    } catch (err) {
      console.error(isEditMode ? "Task update failed" : "Task creation failed", err);
      const message = err?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} task. Please try again.`;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const footer = (
    <div className="flex justify-end space-x-3 w-full">
      <button
        type="button"
        onClick={closeCreateTaskDrawer}
        className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-sm cursor-pointer"
      >
        {isSubmitting ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Task')}
      </button>
    </div>
  );

  return (
    <Drawer
      isOpen={isCreateTaskDrawerOpen}
      onClose={closeCreateTaskDrawer}
      title={isEditMode ? "Edit Task" : "Create Task"}
      subtitle={isEditMode ? "Update task details and assignments" : "Define task details and assignments"}
      footer={footer}
    >
      {isEditMode && isEditLoading ? (
        <div className="flex items-center justify-center p-12 text-indigo-500">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-6 text-gray-800">

          {/* SECTION 1: Basic Information */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-150 pb-2">
              Section 1: Task Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter task name"
                  {...register('title', { required: 'Title is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>

              {/* Main Task Checklist */}
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/30">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-semibold text-gray-700">Checklist Items</label>
                  <button
                    type="button"
                    onClick={() => appendChecklist({ title: '' })}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    + Add Item
                  </button>
                </div>
                {checklistFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder={`Checklist item ${index + 1}`}
                      {...register(`checklists.${index}.title`)}
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded bg-white outline-none"
                    />
                    <button type="button" onClick={() => removeChecklist(index)} className="text-red-500 hover:text-red-750 cursor-pointer">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Main Task Attachments */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Attachments</label>
                <input
                  type="file"
                  multiple
                  {...register('attachments')}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg bg-gray-50 text-xs cursor-pointer outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Company & Assignment */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-150 pb-2">
              Section 2: Team & Assignment
            </h3>
            <div className="space-y-4">
              {isSuperAdmin && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('companyId', { required: isSuperAdmin ? 'Company is required' : false })}
                    onChange={(e) => {
                      setValue('companyId', e.target.value);
                      setValue('ownerId', '');
                      setValue('associatedTeamIds', []);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm outline-none"
                  >
                    <option value="">-- Select Company --</option>
                    {companies?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {errors.companyId && <p className="text-red-500 text-xs mt-1">{errors.companyId.message}</p>}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Owner <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="ownerId"
                    control={control}
                    rules={{ required: 'Owner is required' }}
                    render={({ field }) => (
                  <Select
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        options={employeeOptions}
                        placeholder="Select Owner..."
                        isClearable={false}
                        styles={selectStyles}
                        isDisabled={isSuperAdmin && !selectedCompanyId}
                        value={employeeOptions.find(opt => opt.value === field.value) || null}
                        onChange={(val) => field.onChange(val ? val.value : '')}
                        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                        menuPosition="fixed"
                      />
                    )}
                  />
                  {errors.ownerId && <p className="text-red-500 text-xs mt-1">{errors.ownerId.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Associated Team</label>
                  <Controller
                    name="associatedTeamIds"
                    control={control}
                    render={({ field }) => (
                  <Select
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        options={employeeOptions}
                        isMulti
                        placeholder="Select team members..."
                        styles={selectStyles}
                        isDisabled={isSuperAdmin && !selectedCompanyId}
                        value={employeeOptions.filter(opt => (field.value || []).includes(opt.value))}
                        onChange={(selectedOptions) => {
                          // Replace entirely — never merge with previous selection
                          field.onChange(selectedOptions ? selectedOptions.map(v => v.value) : []);
                        }}
                        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                        menuPosition="fixed"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Scheduling */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-150 pb-2">
              Section 3: Scheduling
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select {...register('statusId', { required: 'Status is required' })} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm outline-none">
                  <option value="">-- Select Status --</option>
                  {statusOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                {errors.statusId && <p className="text-red-500 text-xs mt-1">{errors.statusId.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Priority <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="priorityId"
                  control={control}
                  rules={{ required: 'Priority is required' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={priorityOptions.map(p => ({ value: p.id, label: p.name }))}
                      placeholder="Select Priority..."
                      isClearable={false}
                      styles={selectStyles}
                      value={priorityOptions.map(p => ({ value: p.id, label: p.name })).find(opt => opt.value === parseInt(field.value)) || null}
                      onChange={(val) => field.onChange(val ? val.value.toString() : '')}
                      menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                      menuPosition="fixed"
                      formatOptionLabel={({ label }) => {
                        const priorityKey = label.toLowerCase();
                        const priorityColor = priorityStyles[priorityKey] || "text-gray-400";
                        return (
                          <span className="flex items-center gap-1.5 text-gray-800">
                            <span className={`${priorityColor} font-bold shrink-0`}>!</span>
                            <span className="text-gray-800">{label}</span>
                          </span>
                        );
                      }}
                    />
                  )}
                />
                {errors.priorityId && <p className="text-red-500 text-xs mt-1">{errors.priorityId.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Start Date</label>
                <input type="date" {...register('startDate')} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm outline-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Due Date</label>
                <input type="date" {...register('dueDate')} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm outline-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Estimated Effort</label>
                <input type="text" {...register('estimatedMinutes')} placeholder="e.g. 120 (in minutes)" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm outline-none" />
              </div>
            </div>
          </div>

          {/* SECTION 4: Enterprise Subtasks */}
          <div className="bg-white p-5 rounded-xl border border-indigo-200 shadow-xs">
            <div className="border-b border-indigo-100 pb-3 mb-4">

              {/* Heading + Badge */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">
                  Section 4: Subtasks
                </h3>

                {subtaskFields.length > 0 && (
                  <span className="text-xs font-semibold  text-indigo-700 px-1 py-0.5 rounded-full">
                    {subtaskFields.length} subtask{subtaskFields.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 mt-0.5">
                Each subtask is a full child task with its own assignments, schedule, checklist, and files.
              </p>

            </div>
            {/* Subtask Cards */}
            <div className="space-y-3">
              {subtaskFields.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-indigo-100 rounded-xl">
                  <div className="text-3xl mb-2">📋</div>
                  <p className="text-sm text-gray-500 font-medium">No subtasks yet</p>
                  <p className="text-xs text-gray-400 mt-1">Break this task into smaller pieces</p>
                </div>
              )}

              {subtaskFields.map((field, index) => (
                <SubtaskCard
                  key={field.id}
                  index={index}
                  control={control}
                  register={register}
                  remove={removeSubtask}
                  onDelete={async (idx) => {
                    const subtask = getValues('subtasks')[idx];
                    // If it's an existing saved subtask (has a real backend id)
                    if (subtask?.id && isEditMode && createDrawerTaskId) {
                      if (!window.confirm(`Delete subtask "${subtask.title || `Subtask ${idx + 1}`}"? This cannot be undone.`)) return;
                      try {
                        await axiosClient.delete(`/v1/tasks/${createDrawerTaskId}/subtasks/${subtask.id}`);
                        toast.success('Subtask deleted');
                      } catch (e) {
                        toast.error(e?.response?.data?.message || 'Failed to delete subtask');
                        return; // Don't remove from form if API failed
                      }
                    }
                    removeSubtask(idx);
                  }}
                  employeeOptions={employeeOptions}
                  statusOptions={statusOptions}
                  priorityOptions={priorityOptions}
                />
              ))}
            </div>

            {/* Add Subtask Button */}
            <button
              type="button"
              onClick={() => appendSubtask({
                title: '',
                description: '',
                ownerId: null,
                assigneeIds: [],
                statusName: '',
                priorityName: '',
                startDate: '',
                dueDate: '',
                estimatedMinutes: '',
                checklists: [],
                attachments: []
              })}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all text-sm font-semibold cursor-pointer"
            >
              <PlusIcon className="w-4 h-4" />
              Add Another Subtask
            </button>
          </div>

        </form>
      )}
    </Drawer>
  );
}
