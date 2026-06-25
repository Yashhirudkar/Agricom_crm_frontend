import React from "react";
import { Inbox, AlertCircle, UserX, SearchX } from "lucide-react";

export default function EmptyState({ variant = "no_tasks", onClearFilters }) {
  const variants = {
    no_tasks: {
      icon: Inbox,
      title: "No tasks found",
      description: "It looks like there are no tasks here yet. Create a new task to get started.",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    no_overdue: {
      icon: AlertCircle,
      title: "You're all caught up!",
      description: "There are no overdue tasks at the moment. Great job!",
      color: "text-green-500",
      bg: "bg-green-50",
    },
    no_assigned: {
      icon: UserX,
      title: "No tasks assigned",
      description: "You don't have any tasks assigned to you in this view.",
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    no_filtered: {
      icon: SearchX,
      title: "No results found",
      description: "We couldn't find any tasks matching your current filters.",
      color: "text-gray-500",
      bg: "bg-gray-100",
      action: onClearFilters && (
        <button 
          onClick={onClearFilters}
          className="mt-4 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          Clear Filters
        </button>
      )
    }
  };

  const current = variants[variant] || variants.no_tasks;
  const Icon = current.icon;

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${current.bg}`}>
        <Icon className={`w-10 h-10 ${current.color}`} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{current.title}</h3>
      <p className="text-sm text-gray-500 max-w-sm">{current.description}</p>
      {current.action}
    </div>
  );
}
