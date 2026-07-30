import React, { useState, useEffect, useRef } from "react";
import { useTaskStore } from "../../store/taskStore";
import { TaskViewService } from "../../services/taskView.service";
import { 
  List,
  Inbox, 
  UserCircle, 
  Send, 
  Eye, 
  AlertCircle, 
  CheckCircle2, 
  Flame, 
  Clock, 
  Users, 
  Archive,
  Bookmark,
  Trash2,
  ChevronDown
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

const PRESETS = [
  { id: "all_tasks", label: "All Tasks", icon: List },
  { id: "my_tasks", label: "My Tasks", icon: Inbox },
  { id: "completed_tasks", label: "Completed", icon: CheckCircle2, color: "text-green-500" },
  { id: "overdue_tasks", label: "Overdue", icon: AlertCircle, color: "text-red-500" },
  { id: "archived_tasks", label: "Archived", icon: Archive },
];


export default function ViewsDropdown() {
  const { preset, setPreset, setFilters, clearFilters } = useTaskStore();
  const { hasPermission } = usePermissions();
  const [customViews, setCustomViews] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchViews = async () => {
      const views = await TaskViewService.getTaskViews();
      setCustomViews(views);
    };
    fetchViews();

    const handleUpdate = () => fetchViews();
    window.addEventListener("taskViewsUpdated", handleUpdate);
    return () => window.removeEventListener("taskViewsUpdated", handleUpdate);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayPresets = PRESETS.filter(item => {
    if (item.id === "all_tasks") {
      return hasPermission("task:view_all");
    }
    return true;
  });

  const activePresetItem = displayPresets.find(p => p.id === preset) || customViews.find(v => v.id === preset);
  const ActiveIcon = activePresetItem?.icon || Bookmark;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors text-gray-700 whitespace-nowrap shrink-0 cursor-pointer"
      >
        <ActiveIcon className={`w-4 h-4 ${activePresetItem?.color || "text-gray-500"} shrink-0`} />
        <span className="hidden sm:inline whitespace-nowrap">{activePresetItem?.label || "Select View"}</span>
        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 md:right-auto md:left-0 w-64 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-50 max-h-96 overflow-y-auto custom-scrollbar">
          <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Views</div>
          
          <div className="space-y-0.5">
            {displayPresets.map((item) => {
              const Icon = item.icon;
              const isActive = preset === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setPreset(item.id);
                    clearFilters();
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : (item.color || "text-gray-400")}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {customViews.length > 0 && (
            <>
              <div className="px-3 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-t border-gray-100 mt-2">Saved Views</div>
              <div className="space-y-0.5">
                {customViews.map((item) => {
                  const isActive = preset === item.id;
                  
                  return (
                    <div key={item.id} className="group flex items-center relative hover:bg-gray-50">
                      <button
                        onClick={() => {
                          setPreset(item.id);
                          setFilters(item.filters);
                          setIsOpen(false);
                        }}
                        className={`flex-1 flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${
                          isActive 
                            ? "bg-blue-50 text-blue-700" 
                            : "text-gray-700"
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                        <span className="truncate">{item.label}</span>
                      </button>
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          await TaskViewService.deleteTaskView(item.id);
                          window.dispatchEvent(new Event("taskViewsUpdated"));
                        }}
                        className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
