import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';

export default function KanbanCard({ task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-grab active:cursor-grabbing`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {task.taskCode || `TSK-${task.id}`}
        </span>
      </div>
      
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
        {task.title}
      </h4>

      <div className="flex items-center justify-between mt-4">
        {/* Placeholder for assignee avatar */}
        <div className="flex -space-x-2">
           <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white dark:border-gray-800 text-[10px] font-bold text-blue-800 flex items-center justify-center">
             A
           </div>
        </div>
        
        <Link 
          href={`/tasks/${task.id}`}
          onClick={(e) => e.stopPropagation()} 
          className="text-xs text-blue-600 hover:underline"
        >
          View
        </Link>
      </div>
    </div>
  );
}
