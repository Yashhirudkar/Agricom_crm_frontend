import React from 'react';
import { 
  CalendarIcon, 
  UserGroupIcon, 
  FlagIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const priorityStyles = {
  low: "text-green-500",
  medium: "text-yellow-500",
  high: "text-red-500"
};

export default function TaskDetailSidebar({ task }) {
  return (
    <div className="space-y-8">
      
      {/* Status & Priority */}
      <section className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Status</label>
          <div className="flex items-center">
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {task.status?.name || 'Open'}
            </span>
          </div>
        </div>
        
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Priority</label>
          {task.priority ? (
            <span className="flex items-center gap-1 text-sm font-medium">
              <span className={`${priorityStyles[task.priority.name?.toLowerCase()] || 'text-gray-400'} font-bold shrink-0`}>!</span>
              <span className="text-gray-800 dark:text-white">{task.priority.name}</span>
            </span>
          ) : (
            <span className="text-sm text-gray-400">Not set</span>
          )}
        </div>
      </section>

      {/* Assignees & Followers */}
      <section className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
            <UserGroupIcon className="w-4 h-4 mr-1.5" /> Assignees
          </label>
          <div className="flex -space-x-2 overflow-hidden">
             {/* Render assignee avatars here */}
             <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs font-medium text-gray-700">
               +
             </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Followers</label>
          <p className="text-sm text-gray-500">No followers yet</p>
        </div>
      </section>

      {/* Dates & Estimates */}
      <section className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
            <CalendarIcon className="w-4 h-4 mr-1.5" /> Due Date
          </label>
          <p className="text-sm text-gray-900 dark:text-white">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
            <ClockIcon className="w-4 h-4 mr-1.5" /> Time Tracking
          </label>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
            <div className="text-2xl font-mono text-gray-900 dark:text-white text-center mb-2">00:00:00</div>
            <button className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors">
              Start Timer
            </button>
          </div>
        </div>
      </section>

      {/* Custom Fields Placeholder */}
      <section>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
          <TagIcon className="w-4 h-4 mr-1.5" /> Custom Fields
        </label>
        <div className="space-y-3 mt-3">
           <p className="text-sm text-gray-500 italic">No custom fields applied.</p>
        </div>
      </section>

    </div>
  );
}
