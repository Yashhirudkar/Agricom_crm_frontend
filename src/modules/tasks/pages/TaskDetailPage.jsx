import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { TaskAPI } from '../api';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// Components
import TaskDetailHeader from '../components/Detail/TaskDetailHeader';
import TaskDetailMain from '../components/Detail/TaskDetailMain';
import TaskDetailSidebar from '../components/Detail/TaskDetailSidebar';
import PageLoader from '../components/common/PageLoader';
import ErrorState from '../components/common/ErrorState';

export default function TaskDetailPage({ taskId }) {
  // Fetch primary task details
  const { data: task, isLoading, isError, error } = useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const res = await TaskAPI.getTaskById(taskId);
      return res; // Assuming TaskAPI.getTaskById unwraps .data.data
    },
    staleTime: 60000,
  });

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <PageLoader message="Loading task details..." />
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ErrorState 
          title="Task not found" 
          message={error?.message || "The task you're looking for doesn't exist or you don't have permission to view it."}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-900 overflow-hidden">
      {/* Top Breadcrumb & Actions Header */}
      <div className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center px-6 shrink-0 bg-gray-50 dark:bg-gray-900/50">
        <Link 
          href="/tasks?preset=my_tasks" 
          className="flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Workspace
        </Link>
        <div className="ml-auto flex items-center space-x-3">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
            {task.taskCode}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
        {/* Main Content Area (70%) */}
        <div className="flex-1 lg:w-[70%] h-full overflow-y-auto custom-scrollbar border-r border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto p-8 pb-32">
            <TaskDetailHeader task={task} />
            <TaskDetailMain task={task} />
          </div>
        </div>

        {/* Right Sidebar Area (30%) */}
        <div className="w-full lg:w-[350px] xl:w-[400px] shrink-0 h-full overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900">
          <div className="p-6 pb-32 space-y-8">
            <TaskDetailSidebar task={task} />
          </div>
        </div>
      </div>
    </div>
  );
}
