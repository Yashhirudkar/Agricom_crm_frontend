import React from 'react';
import { 
  EllipsisHorizontalIcon, 
  ShareIcon, 
  StarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

export default function TaskDetailHeader({ task }) {
  // In a real app, you would have state for isFavorite, etc.
  const isFavorite = false;

  return (
    <div className="flex items-start justify-between mb-8">
      <div className="flex-1 pr-8">
        <div className="flex items-center space-x-3 mb-2">
          <button className="flex items-center text-sm text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500 transition-colors group">
            <CheckCircleIcon className="w-5 h-5 mr-1.5 group-hover:bg-green-50 rounded-full" />
            Mark Complete
          </button>
        </div>
        
        {/* Title Editor (simplified for now, full form integration later) */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
          {task.title}
        </h1>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        <button className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          {isFavorite ? <StarSolid className="w-5 h-5 text-yellow-500" /> : <StarIcon className="w-5 h-5" />}
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white rounded-lg transition-colors">
          <ShareIcon className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white rounded-lg transition-colors">
          <EllipsisHorizontalIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
