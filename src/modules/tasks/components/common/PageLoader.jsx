import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
      <ArrowPathIcon className="w-8 h-8 animate-spin mb-4 text-blue-500" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
