import React from "react";
import { useTaskStore } from "../../store/taskStore";
import Drawer from "../../../../components/common/Drawer";
import { useTaskStatusesQuery, useTaskPrioritiesQuery } from "../../queries/tasks.query";

export default function FilterDrawer() {
  const { isFilterDrawerOpen, closeFilterDrawer, filters, setFilters, clearFilters } = useTaskStore();
  
  const { data: statusesData } = useTaskStatusesQuery();
  const { data: prioritiesData } = useTaskPrioritiesQuery();
  const statuses = statusesData || [];
  const priorities = prioritiesData || [];

  const handleApply = (e) => {
    e.preventDefault();
    // Filters are actually synced onChange directly via setFilters for immediate feedback usually,
    // or we can apply them on submit. Since Zustand is fast, we'll sync immediately on change.
    closeFilterDrawer();
  };

  return (
    <Drawer 
      isOpen={isFilterDrawerOpen} 
      onClose={closeFilterDrawer} 
      title="Advanced Filters"
      widthClass="w-full sm:w-[400px]"
    >
      <div className="p-6 flex-1 overflow-y-auto">
        <form id="filter-form" onSubmit={handleApply} className="space-y-6">
          
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select 
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
              value={filters.statusIds[0] || ""}
              onChange={(e) => setFilters({ statusIds: e.target.value ? [parseInt(e.target.value)] : [] })}
            >
              <option value="">Any Status</option>
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
            <select 
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
              value={filters.priorityIds[0] || ""}
              onChange={(e) => setFilters({ priorityIds: e.target.value ? [parseInt(e.target.value)] : [] })}
            >
              <option value="">Any Priority</option>
              {priorities.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Due After</label>
              <input 
                type="date"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                value={filters.dueDateStart || ""}
                onChange={(e) => setFilters({ dueDateStart: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Due Before</label>
              <input 
                type="date"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                value={filters.dueDateEnd || ""}
                onChange={(e) => setFilters({ dueDateEnd: e.target.value })}
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                checked={filters.isCompleted}
                onChange={(e) => setFilters({ isCompleted: e.target.checked })}
              />
              <span className="text-sm font-medium text-gray-700">Show Completed Tasks</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                checked={filters.isArchived}
                onChange={(e) => setFilters({ isArchived: e.target.checked })}
              />
              <span className="text-sm font-medium text-gray-700">Show Archived Tasks</span>
            </label>
          </div>
        </form>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
        <button 
          onClick={() => {
            clearFilters();
            closeFilterDrawer();
          }}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Clear All
        </button>
        <button 
          type="submit"
          form="filter-form"
          className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          Apply Filters
        </button>
      </div>
    </Drawer>
  );
}
