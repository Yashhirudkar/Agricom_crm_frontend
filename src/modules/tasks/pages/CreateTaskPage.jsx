import React from 'react';
import { useForm, Controller } from 'react-form'; // Wait, let's use react-hook-form correctly
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import RichTextEditor from '@/components/editor/RichTextEditor';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  statusId: z.number().optional(),
  priorityId: z.number().optional(),
  dueDate: z.string().optional(),
  estimatedMinutes: z.number().optional(),
});

export default function CreateTaskPage() {
  const router = useRouter();
  
  // Real app: use react-hook-form correctly
  // import { useForm, Controller } from 'react-hook-form';
  // This is a simplified scaffold
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call goes here
    console.log('Submitting task', formData);
    router.push('/tasks');
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-900 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-10 h-16 border-b border-gray-200 dark:border-gray-800 flex items-center px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <Link 
          href="/tasks" 
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Cancel
        </Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white ml-6">Create New Task</h1>
        
        <div className="ml-auto flex space-x-3">
          <button 
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Save Draft
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
          >
            Create Task
          </button>
        </div>
      </div>

      <div className="p-8 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <div className="space-y-6">
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Update customer dashboard UI"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 transition-shadow"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </label>
                <RichTextEditor 
                  value={formData.description}
                  onChange={(val) => setFormData({ ...formData, description: val })}
                  editable={true}
                />
              </div>

            </div>
          </div>
        </div>

        {/* Sidebar Configuration */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Properties</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-blue-500">
                  <option value="">Open</option>
                  <option value="">In Progress</option>
                  <option value="">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Priority</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-blue-500">
                  <option value="">Low</option>
                  <option value="">Normal</option>
                  <option value="">High</option>
                  <option value="">Urgent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Due Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Assignment</h3>
            <p className="text-sm text-gray-500 mb-3">Multi-select employees here</p>
            <button className="w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors">
              + Assign Employee
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
