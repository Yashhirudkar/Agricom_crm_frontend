import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'sonner';

import Drawer from '../../../../components/drawers/Drawer';
import RichTextEditor from '../../components/common/RichTextEditor';
import { TaskAPI, ChecklistAPI, TaskAttachmentAPI } from '../../api';
import { useTaskStore } from '../../store/taskStore';
import axiosClient from "../../../../lib/axios";

// Status and Priority will be fetched from API

// Premium Custom Styles for react-select matching Zoho/Jira enterprise look
const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '38px',
    borderRadius: '0.5rem', // rounded-lg
    borderColor: state.isFocused ? '#2563eb' : '#d1d5db', // focus:border-blue-500
    boxShadow: state.isFocused ? '0 0 0 1px #2563eb' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#2563eb' : '#9ca3af'
    },
    fontSize: '0.875rem', // text-sm
    backgroundColor: '#f9fafb', // bg-gray-50
    cursor: 'pointer'
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#eff6ff', // bg-blue-50
    borderRadius: '0.375rem',
    border: '1px solid #bfdbfe', // border-blue-250
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#1e40af', // text-blue-800
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
    fontSize: '0.875rem',
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
    zIndex: 50,
    borderRadius: '0.5rem',
    overflow: 'hidden'
  })
};

export default function TaskCreateDrawer() {
  const queryClient = useQueryClient();
  const { isCreateTaskDrawerOpen, closeCreateTaskDrawer } = useTaskStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redux state
  const user = useSelector(state => state.auth.user);
  const isSuperAdmin = user?.type === 'SUPER_ADMIN';

  const { register, handleSubmit, control, formState: { errors }, reset, watch, setValue } = useForm({
    defaultValues: {
      title: '',
      description: '',
      checklists: [], 
      subtasks: [],
      dependencyId: '',
      attachments: [],
      
      ownerId: '',   // Single Select Owner (user.id)
      associatedTeamIds: [], // Multiselect Assignees (array of user.id)
      
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

  // Determine target company for employee fetch
  const targetCompanyId = isSuperAdmin ? selectedCompanyId : user?.companyId;

  // Fetch Employees belonging to selected company (Without Department/Team filter to get all)
  const { data: employeesRes } = useQuery({
    queryKey: ['tasks', 'company-employees', targetCompanyId || 'all'],
    queryFn: async () => {
      const headers = targetCompanyId ? { 'x-company-id': targetCompanyId } : {};
      const { data } = await axiosClient.get("/v1/tasks/employees/assignable", { headers });
      return data.data || [];
    }
  });
  const employees = employeesRes || [];

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

  // Checklists and Subtasks array helpers
  const { fields: checklistFields, append: appendChecklist, remove: removeChecklist } = useFieldArray({
    control,
    name: "checklists"
  });

  const { fields: subtaskFields, append: appendSubtask, remove: removeSubtask } = useFieldArray({
    control,
    name: "subtasks"
  });

  // Map employees to react-select options, allowing those without explicit userId to map to their employee id as a fallback for the UI to at least show them. 
  // However, tasks require actual users, so we should map value to emp.userId || emp.id.
  const employeeOptions = employees
    .map(emp => ({
      value: emp.userId || emp.id,
      label: `${emp.firstName || ''} ${emp.lastName || ''}`.trim()
    }));

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const selectedStatus = statusOptions.find(s => s.id === parseInt(data.statusId));
      const selectedPriority = priorityOptions.find(p => p.id === parseInt(data.priorityId));

      // Associated Team: Must filter out the Owner to prevent duplication
      const teamUserIds = data.associatedTeamIds || [];
      const ownerUserId = parseInt(data.ownerId);
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
        ownerId: ownerUserId,
        assigneeIds: filteredTeamUserIds
      };

      // If Super Admin, pass target company in request header
      const headers = isSuperAdmin && selectedCompanyId ? { 'x-company-id': selectedCompanyId } : {};

      const createdTask = await axiosClient.post("/v1/tasks", payload, {
        headers: {
          ...headers,
          'Idempotency-Key': crypto.randomUUID()
        }
      }).then(res => res.data.data);

      const taskId = createdTask.id;

      // Create Checklists if any — backend API creates ONE item per POST
      if (data.checklists && data.checklists.length > 0) {
        for (let i = 0; i < data.checklists.length; i++) {
          await ChecklistAPI.createChecklist(taskId, {
            title: data.checklists[i].title,
            orderIndex: i
          }).catch(e => console.error('Checklist creation error:', e));
        }
      }

      // Create Subtasks if any
      if (data.subtasks && data.subtasks.length > 0) {
        for (const sub of data.subtasks) {
           await axiosClient.post(`/v1/tasks/${taskId}/subtasks`, {
             title: sub.title,
             statusId: payload.statusId,
             statusName: payload.statusName
           }, { headers }).catch(e => console.error(e));
        }
      }

      // Upload Attachments if any
      if (data.attachments && data.attachments.length > 0) {
        const formData = new FormData();
        Array.from(data.attachments).forEach(file => {
           formData.append('files', file);
        });
        await TaskAttachmentAPI.uploadAttachment(taskId, formData).catch(e => console.error(e));
      }

      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully!');
      reset();
      closeCreateTaskDrawer();
    } catch (err) {
      console.error("Task creation failed", err);
      const message = err?.response?.data?.message || 'Failed to create task. Please try again.';
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
        {isSubmitting ? 'Creating...' : 'Create Task'}
      </button>
    </div>
  );

  return (
    <Drawer
      isOpen={isCreateTaskDrawerOpen}
      onClose={closeCreateTaskDrawer}
      title="Create Task"
      subtitle="Define task details and assignments"
      footer={footer}
    >
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/30">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-semibold text-gray-700">Subtasks</label>
                  <button 
                    type="button" 
                    onClick={() => appendSubtask({ title: '' })} 
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    + Add Subtask
                  </button>
                </div>
                {subtaskFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2 mb-2">
                    <input 
                      type="text" 
                      placeholder={`Subtask title ${index + 1}`} 
                      {...register(`subtasks.${index}.title`)} 
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded bg-white outline-none" 
                    />
                    <button type="button" onClick={() => removeSubtask(index)} className="text-red-500 hover:text-red-750 cursor-pointer">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Attachments</label>
                <input type="file" multiple {...register('attachments')} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg bg-gray-50 text-xs cursor-pointer outline-none" />
              </div>
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
                    setValue('ownerId', ''); // Reset owner
                    setValue('associatedTeamIds', []); // Reset team
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
                      {...field}
                      options={employeeOptions}
                      placeholder="Select Owner..."
                      isClearable={false}
                      styles={selectStyles}
                      isDisabled={isSuperAdmin && !selectedCompanyId}
                      value={employeeOptions.find(opt => opt.value === field.value) || null}
                      onChange={(val) => field.onChange(val ? val.value : '')}
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
                      {...field}
                      options={employeeOptions}
                      isMulti
                      placeholder="Select team members..."
                      styles={selectStyles}
                      isDisabled={isSuperAdmin && !selectedCompanyId}
                      value={employeeOptions.filter(opt => field.value?.includes(opt.value))}
                      onChange={(val) => field.onChange(val ? val.map(v => v.value) : [])}
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
              <select {...register('priorityId', { required: 'Priority is required' })} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm outline-none">
                <option value="">-- Select Priority --</option>
                {priorityOptions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
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

      </form>
    </Drawer>
  );
}
