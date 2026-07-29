'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '@/lib/axios';
import PageLoader from '../../../../../modules/tasks/components/common/PageLoader';
import ErrorState from '../../../../../modules/tasks/components/common/ErrorState';

export default function EditTaskRoute() {
  const params = useParams();
  const router = useRouter();
  
  const taskId = parseInt(params.id, 10);

  const { data: task, isLoading, isError } = useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const res = await axiosClient.get(`/v1/tasks/${taskId}`);
      return res.data.data;
    },
    enabled: !!taskId,
  });

  if (isLoading) return <PageLoader message="Loading task data for edit..." />;
  if (isError || !task) return <ErrorState title="Error" message="Could not load task to edit." />;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Edit Task: {task.title}</h1>
      <p className="text-gray-500 mt-2">Enterprise edit form goes here.</p>
      <button 
        onClick={() => router.push(`/tasks/${taskId}`)}
        className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}
