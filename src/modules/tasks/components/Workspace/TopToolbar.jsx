import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTaskStore } from "../../store/taskStore";
import { useDebounce } from "../../hooks/useDebounce";
import { 
  Search, 
  Plus, 
  RefreshCcw, 
  Download, 
  SlidersHorizontal, 
  Columns, 
  Bookmark,
  ChevronDown,
  Archive,
  Trash2,
  UserPlus,
  Tag,
  CalendarDays,
  Flag,
  Activity
} from "lucide-react";
import { TaskViewService } from "../../services/taskView.service";
import { toast } from "sonner";
import { 
  useBulkArchiveTaskMutation,
  useBulkDeleteTaskMutation,
  useBulkChangeTaskStatusMutation 
} from "../../mutations/tasks.mutation";
import ViewsDropdown from "./ViewsDropdown";

import { usePermissions } from "@/hooks/usePermissions";

export default function TopToolbar({ userType, allCompanies, selectedCompanyId, handleCompanyChange }) {
  const router = useRouter();
  const { 
    filters, 
    setFilters, 
    toggleFilterDrawer, 
    selectedRowIds,
    activeView,
    setActiveView,
    openCreateTaskDrawer
  } = useTaskStore();

  const { hasPermission } = usePermissions();
  const canCreate = hasPermission("task:create");

  const [searchInput, setSearchInput] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchInput, 300);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isSaveViewOpen, setIsSaveViewOpen] = useState(false);
  const [viewName, setViewName] = useState("");
  const bulkRef = useRef(null);
  const saveViewRef = useRef(null);

  const selectedIds = Object.keys(selectedRowIds).filter(k => selectedRowIds[k]);
  const selectedCount = selectedIds.length;

  const bulkArchive = useBulkArchiveTaskMutation();
  const bulkDelete = useBulkDeleteTaskMutation();
  const bulkChangeStatus = useBulkChangeTaskStatusMutation();

  // Sync debounced search to global filters
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch, filters.search, setFilters]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (bulkRef.current && !bulkRef.current.contains(event.target)) {
        setIsBulkOpen(false);
      }
      if (saveViewRef.current && !saveViewRef.current.contains(event.target)) {
        setIsSaveViewOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col border-b border-gray-200 bg-white shrink-0">
      <div className="h-14 px-4 flex items-center justify-between gap-2">
        
        {/* Left Side: Search & Bulk Actions */}
        <div className="flex items-center gap-2 md:gap-4 flex-1">
          {/* Global Search */}
          <div className="relative w-full max-w-[160px] md:max-w-[256px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="task-global-search"
              type="text"
              placeholder="Search tasks... (Press /)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>

          <button 
            onClick={() => canCreate && openCreateTaskDrawer()}
            disabled={!canCreate}
            className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 text-sm font-medium rounded-lg shadow-sm transition-colors shrink-0 ${
              canCreate 
                ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            }`}
            title={canCreate ? "Create Task" : "Insufficient permissions to create tasks"}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Create Task</span>
          </button>

          <ViewsDropdown />

          {/* Bulk Actions Dropdown */}
          {selectedCount > 0 && (
            <div className="relative" ref={bulkRef}>
              <button 
                onClick={() => setIsBulkOpen(!isBulkOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                {selectedCount} Selected <ChevronDown className="w-4 h-4" />
              </button>
              
              {isBulkOpen && (
                <div className="absolute top-full mt-1 left-0 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-1 z-50">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bulk Actions</div>
                  <button 
                    onClick={() => {
                      bulkArchive.mutate({ ids: selectedIds, isArchived: true });
                      setIsBulkOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Archive className="w-4 h-4" /> Archive
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><UserPlus className="w-4 h-4" /> Assign Users</button>
                  <button 
                    onClick={() => {
                      // For now, hardcode to "Done" (statusId: 4) as an example of bulk status change
                      bulkChangeStatus.mutate({ ids: selectedIds, payload: { statusId: 4 } });
                      setIsBulkOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Activity className="w-4 h-4" /> Mark as Done
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Flag className="w-4 h-4" /> Change Priority</button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Change Due Date</button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Tag className="w-4 h-4" /> Manage Labels</button>
                  <div className="my-1 border-t border-gray-100"></div>
                  <button 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to permanently delete these tasks?")) {
                        bulkDelete.mutate({ ids: selectedIds });
                        setIsBulkOpen(false);
                      }
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Permanently
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Tools & Actions */}
        <div className="flex items-center gap-1 md:gap-2 overflow-x-auto custom-scrollbar">
          
          {/* Company Context Dropdown Header for Super Admin */}
          {userType === "super_admin" && (
            <div className="flex items-center gap-2 mr-2 border-r border-gray-200 pr-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:inline">Super Admin Context</span>
              <select
                value={selectedCompanyId || ""}
                onChange={handleCompanyChange}
                className="border border-gray-200 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-white min-w-[140px]"
              >
                <option value="">-- Select Company Context --</option>
                {allCompanies?.map((c, idx) => (
                  <option key={`company-${c.id || idx}-${idx}`} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* View Modes (List / Kanban / Calendar) */}
          <div className="hidden sm:flex items-center bg-gray-100 p-0.5 rounded-lg mr-2 border border-gray-200">
            <button 
              onClick={() => setActiveView('list')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${activeView === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              List
            </button>
            <button 
              onClick={() => setActiveView('kanban')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${activeView === 'kanban' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Kanban
            </button>
            <button 
              onClick={() => setActiveView('calendar')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${activeView === 'calendar' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Calendar
            </button>
          </div>

          <div className="hidden sm:block h-6 w-px bg-gray-200 mx-1"></div>

          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block" title="Refresh">
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block" title="Export">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block" title="Columns">
            <Columns className="w-4 h-4" />
          </button>
          <div className="relative" ref={saveViewRef}>
            <button 
              onClick={() => setIsSaveViewOpen(!isSaveViewOpen)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" 
              title="Save View"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            {isSaveViewOpen && (
              <div className="absolute top-full mt-1 right-0 w-64 bg-white border border-gray-100 shadow-xl rounded-xl p-3 z-50">
                <div className="text-sm font-semibold text-gray-800 mb-2">Save Current View</div>
                <input 
                  type="text" 
                  placeholder="View Name (e.g. My Urgent Tasks)" 
                  value={viewName}
                  onChange={(e) => setViewName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-3"
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setIsSaveViewOpen(false)} className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button 
                    onClick={async () => {
                      if (!viewName.trim()) return;
                      await TaskViewService.saveTaskView({
                        id: `custom_${Date.now()}`,
                        label: viewName,
                        icon: "Bookmark",
                        filters: { ...filters }
                      });
                      toast.success("View saved successfully");
                      setIsSaveViewOpen(false);
                      setViewName("");
                      // We need to trigger an event to update sidebar, or use a context/store for custom views
                      window.dispatchEvent(new Event("taskViewsUpdated"));
                    }}
                    className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={toggleFilterDrawer}
            className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-lg md:ml-2 transition-colors shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden md:inline">Filters</span>
          </button>


        </div>
      </div>
    </div>
  );
}
