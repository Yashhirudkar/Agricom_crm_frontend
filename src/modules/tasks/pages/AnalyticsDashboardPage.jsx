import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { TaskAPI } from '../api';
import PageLoader from '../components/common/PageLoader';
import ErrorState from '../components/common/ErrorState';

export default function AnalyticsDashboardPage() {
  const { data: analytics, isLoading, isError } = useQuery({
    queryKey: ['tasks', 'analytics'],
    queryFn: async () => {
      const res = await TaskAPI.getTasks();
      const tasks = res.data || res || [];
      
      const total = tasks.length;
      const completed = tasks.filter(t => t.status?.isCompleted || t.status?.name === 'Done').length;
      const inProgress = tasks.filter(t => !t.status?.isCompleted && t.status?.name === 'In Progress').length;
      const open = tasks.filter(t => t.status?.name === 'Open').length;
      
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return { total, completed, inProgress, open, completionRate };
    }
  });

  if (isLoading) return <PageLoader message="Loading Analytics..." />;
  if (isError) return <ErrorState title="Error" message="Failed to load analytics data." />;

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 dark:bg-gray-900 p-8 overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Analytics Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">High level overview of enterprise task metrics.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Metric Cards */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Tasks</p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{analytics.total}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Completed</p>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">{analytics.completed}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">In Progress</p>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{analytics.inProgress}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Completion Rate</p>
          <div className="flex items-end">
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{analytics.completionRate}%</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Status Distribution</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-medium mb-1">
              <span className="text-gray-700 dark:text-gray-300">Open</span>
              <span className="text-gray-900 dark:text-white">{analytics.open}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gray-500 h-2 rounded-full" style={{ width: `${analytics.total ? (analytics.open/analytics.total)*100 : 0}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium mb-1">
              <span className="text-gray-700 dark:text-gray-300">In Progress</span>
              <span className="text-gray-900 dark:text-white">{analytics.inProgress}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${analytics.total ? (analytics.inProgress/analytics.total)*100 : 0}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm font-medium mb-1">
              <span className="text-gray-700 dark:text-gray-300">Done</span>
              <span className="text-gray-900 dark:text-white">{analytics.completed}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${analytics.total ? (analytics.completed/analytics.total)*100 : 0}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
