'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import TaskDetailPage from '../../../../modules/tasks/pages/TaskDetailPage';

export default function TaskDetailRoute() {
  const params = useParams();
  
  if (!params.id) return null;
  
  return <TaskDetailPage taskId={parseInt(params.id, 10)} />;
}
