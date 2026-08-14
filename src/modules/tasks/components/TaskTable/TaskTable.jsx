import React, { useMemo, useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTaskStore } from "../../store/taskStore";
import { useTasksQuery, useTaskStatusesQuery, useTaskPrioritiesQuery } from "../../queries/tasks.query";
import { TaskTableFoundation } from "./TaskTableFoundation";
import { Archive, CheckCircle2, MinusSquare, PlusSquare, Pencil } from "lucide-react";
import { useChangeTaskStatusMutation, useArchiveTaskMutation, useUpdateTaskMutation } from "../../mutations/tasks.mutation";
import { useQuery } from '@tanstack/react-query';
import axiosClient from "../../../../lib/axios";
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { createPortal } from 'react-dom';
import { usePermissions } from "@/hooks/usePermissions";

// ---------------------------------------------------------------------------
// Design tokens / helpers
// ---------------------------------------------------------------------------

function getAvatarColor(name = "") {
  const AVATAR_PALETTE = [
    { bg: "bg-blue-100", text: "text-blue-700" },
    { bg: "bg-green-100", text: "text-green-700" },
    { bg: "bg-yellow-100", text: "text-yellow-700" },
    { bg: "bg-purple-100", text: "text-purple-700" },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatRelativeDate(dueDate) {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return <span className="text-[#d94b4b] ml-1">({Math.abs(diffDays)}d ago)</span>;
  else if (diffDays > 0) return <span className="text-[#4db571] ml-1">({diffDays}d to go)</span>;
  return <span className="text-amber-600 ml-1">(Today)</span>;
}

function ColHeader({ children, icon: Icon }) {
  return (
    <div className="flex items-center gap-1.5 text-[12px] font-normal text-gray-500 capitalize whitespace-nowrap">
      {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline Editable Cell Components
// ---------------------------------------------------------------------------

function EditableTextCell({ value, onSave, disabled }) {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(value || "");

  useEffect(() => setVal(value || ""), [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (val !== (value || "")) {
      onSave(val);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleBlur();
    if (e.key === "Escape") {
      setVal(value || "");
      setIsEditing(false);
    }
  };

  if (isEditing && !disabled) {
    return (
      <input
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className="w-full h-full px-2 py-1 text-[13px] border border-blue-500 rounded outline-none"
      />
    );
  }

  return (
    <div
      onClick={(e) => {
        if (disabled) return;
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={`w-full min-h-[24px] text-[13px] text-gray-800 truncate flex items-center px-2 -mx-2 hover:bg-gray-50 rounded ${disabled ? "cursor-not-allowed opacity-90" : "hover:text-blue-600 cursor-pointer"}`}
      title={value}
    >
      {value || "-"}
    </div>
  );
}

function EditableNumberCell({ value, onSave, disabled }) {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(value || "");

  useEffect(() => setVal(value || ""), [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (val !== (value || "")) {
      onSave(val === "" ? null : Number(val));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleBlur();
    if (e.key === "Escape") {
      setVal(value || "");
      setIsEditing(false);
    }
  };

  if (isEditing && !disabled) {
    return (
      <input
        type="number"
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className="w-full h-full px-2 py-1 text-[13px] border border-blue-500 rounded outline-none"
      />
    );
  }

  return (
    <div
      onClick={(e) => {
        if (disabled) return;
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={`w-full min-h-[24px] text-[13px] text-gray-800 truncate flex items-center px-2 -mx-2 hover:bg-gray-50 rounded ${disabled ? "cursor-not-allowed opacity-90" : "hover:text-blue-600 cursor-pointer"}`}
    >
      {value ? `${value}m` : "-"}
    </div>
  );
}

function EditableDateCell({ value, onSave, disabled }) {
  const [isEditing, setIsEditing] = useState(false);

  const formattedForInput = value ? new Date(value).toISOString().split('T')[0] : "";
  const [val, setVal] = useState(formattedForInput);

  useEffect(() => {
    setVal(value ? new Date(value).toISOString().split('T')[0] : "");
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (val !== formattedForInput) {
      onSave(val ? new Date(val).toISOString() : null);
    }
  };

  if (isEditing && !disabled) {
    return (
      <input
        type="date"
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={handleBlur}
        onClick={(e) => e.stopPropagation()}
        className="w-full h-full px-1 py-1 text-[13px] border border-blue-500 rounded outline-none"
      />
    );
  }

  return (
    <div
      onClick={(e) => {
        if (disabled) return;
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={`w-full min-h-[24px] text-[13px] text-gray-700 truncate flex items-center gap-1 px-2 -mx-2 hover:bg-gray-50 rounded ${disabled ? "cursor-not-allowed opacity-90" : "cursor-pointer"}`}
    >
      {value ? (
        <>
          {new Date(value).toLocaleDateString("en-GB").replace(/\//g, "-")}
          {formatRelativeDate(value)}
        </>
      ) : (
        <span className="text-gray-400">-</span>
      )}
    </div>
  );
}

const priorityStyles = {
  low: "text-green-500",
  medium: "text-yellow-500",
  high: "text-red-500"
};

function EditableSelectCell({ value, options, onSave, renderValue, isOwner, isMulti, isPriority, disabled }) {
  const [isEditing, setIsEditing] = useState(false);
  const [rect, setRect] = useState(null);
  const wrapperRef = useRef(null);

  const startEdit = (e) => {
    e.stopPropagation();
    if (disabled) return;
    if (wrapperRef.current) {
      setRect(wrapperRef.current.getBoundingClientRect());
    }
    setIsEditing(true);
  };

  if (isEditing && !disabled) {
    const editor = (
      <div
        onClick={e => e.stopPropagation()}
        onBlur={() => setTimeout(() => setIsEditing(false), 150)}
        style={{
          position: 'fixed',
          top: rect ? rect.top - 4 : 0,
          left: rect ? rect.left - 4 : 0,
          width: rect ? Math.max(rect.width + 8, 200) : 200,
          zIndex: 999999,
        }}
      >
        <Select
          autoFocus
          menuIsOpen
          isMulti={isMulti}
          options={options}
          value={
            isMulti
              ? options.filter(o => (value || []).includes(o.value))
              : options.find(o => o.value === value) || null
          }
          onChange={(val) => {
            if (isMulti) {
              const newValues = val ? val.map(v => v.value) : [];
              onSave(newValues);
            } else {
              if (val && val.value !== value) onSave(val.value);
              setIsEditing(false);
            }
          }}
          onMenuClose={() => setIsEditing(false)}
          menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
          menuPosition="fixed"
          formatOptionLabel={({ label, color }) => {
            if (isPriority) {
              const priorityKey = label.toLowerCase();
              const priorityColor = priorityStyles[priorityKey] || "text-gray-400";
              return (
                <span className="flex items-center gap-1.5 text-gray-800">
                  <span className={`${priorityColor} font-bold shrink-0`}>!</span>
                  <span>{label}</span>
                </span>
              );
            }
            if (color) {
              return (
                <span className="flex items-center gap-1.5 text-gray-800">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span>{label}</span>
                </span>
              );
            }
            return <span>{label}</span>;
          }}
          styles={{
            control: base => ({
              ...base,
              minHeight: '28px',
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
            }),
            menu: base => ({ ...base, zIndex: 9999 }),
            menuPortal: base => ({ ...base, zIndex: 9999 }),
            option: base => ({ ...base, fontSize: '12px', padding: '6px 10px' })
          }}
        />
      </div>
    );

    return (
      <>
        <div ref={wrapperRef} className="w-full min-h-[24px]" />
        {typeof document !== 'undefined' ? createPortal(editor, document.body) : editor}
      </>
    );
  }

  return (
    <div
      onClick={startEdit}
      ref={wrapperRef}
      className={`w-full min-h-[24px] flex items-center px-2 -mx-2 hover:bg-gray-50 rounded ${disabled ? "cursor-not-allowed opacity-90" : "cursor-pointer"}`}
    >
      {renderValue(value)}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Task Table Component
// ---------------------------------------------------------------------------
export default function TaskTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const {
    filters,
    setFilters,
    selectedRowIds,
    setSelectedRowIds,
    isSelectAllActive,
    setIsSelectAllActive,
    setSelectedTask,
    openCreateTaskDrawer,
    preset,
    setPreset,
  } = useTaskStore();

  const { hasPermission } = usePermissions();
  const canUpdate = hasPermission("task:update");

  // Collapsed parent task IDs
  const [collapsedTaskIds, setCollapsedTaskIds] = useState(new Set());

  const toggleExpand = (taskId, e) => {
    e.stopPropagation();
    setCollapsedTaskIds(prev => {
      const next = new Set(prev);
      next.has(taskId) ? next.delete(taskId) : next.add(taskId);
      return next;
    });
  };

  const user = useSelector(state => state.auth.user);
  const targetCompanyId = user?.companyId;

  const { data: statusesData } = useTaskStatusesQuery(targetCompanyId);
  const statuses = statusesData || [];

  const { data: prioritiesData } = useTaskPrioritiesQuery(targetCompanyId);
  const priorities = prioritiesData || [];

  const { data: employeesData } = useQuery({
    queryKey: ['tasks', 'company-employees', targetCompanyId || 'all'],
    queryFn: async () => {
      const headers = targetCompanyId ? { 'x-company-id': targetCompanyId } : {};
      const { data } = await axiosClient.get("/v1/tasks/employees/assignable", { headers });
      return data.data || [];
    }
  });
  const employees = employeesData || [];
  const employeeOptions = employees.map(emp => ({
    value: emp.userId || emp.id,
    label: `${emp.firstName || ''} ${emp.lastName || ''}`.trim()
  }));

  const updateTaskMutation = useUpdateTaskMutation();
  const changeStatusMutation = useChangeTaskStatusMutation();

  // Sync Next.js query parameters on mount to hydrate filter state
  useEffect(() => {
    const urlFilters = {};
    const search = searchParams.get('search');
    if (search !== null) urlFilters.search = search;

    const status = searchParams.get('status');
    if (status) urlFilters.statusIds = status.split(',').map(Number);

    const priority = searchParams.get('priority');
    if (priority) urlFilters.priorityIds = priority.split(',').map(Number);

    const assignees = searchParams.get('assignee');
    if (assignees) urlFilters.assigneeIds = assignees.split(',').map(Number);

    const presetParam = searchParams.get('preset');
    if (presetParam) setPreset(presetParam);

    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
  }, []);

  // Sync filters back to Next.js query parameters on changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.statusIds?.length > 0) params.set('status', filters.statusIds.join(','));
    if (filters.priorityIds?.length > 0) params.set('priority', filters.priorityIds.join(','));
    if (filters.assigneeIds?.length > 0) params.set('assignee', filters.assigneeIds.join(','));
    if (preset) params.set('preset', preset);

    const qs = params.toString();
    const targetUrl = qs ? `${pathname}?${qs}` : pathname;
    router.replace(targetUrl, { scroll: false });
  }, [filters, preset, pathname, router]);

  // Query infinite pages of tasks
  const {
    data: response,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    refetch
  } = useTasksQuery({
    ...filters,
    preset,
    limit: 30, // Standard batch loading limit
  });

  // Extract raw data from API response pages, deduplicating to avoid visual glitches
  const rawData = useMemo(() => {
    const allTasks = response?.pages?.flatMap(page => page.items || page.data || []) || [];
    const seen = new Set();
    return allTasks.filter(task => {
      if (seen.has(task.id)) return false;
      seen.add(task.id);
      return true;
    });
  }, [response]);

  // Group subtasks under parents, honoring collapsed parent nodes
  const data = useMemo(() => {
    const result = [];
    const parents = rawData.filter(task => !task.parentTaskId);
    const subtasks = rawData.filter(task => task.parentTaskId);

    parents.forEach(parent => {
      result.push(parent);
      if (!collapsedTaskIds.has(parent.id)) {
        const children = subtasks.filter(sub => sub.parentTaskId === parent.id);
        result.push(...children);
      }
    });

    return result;
  }, [rawData, collapsedTaskIds]);

  const [columnVisibility, setColumnVisibility] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("agricom_zoho_task_columns");
    if (saved) {
      try {
        setColumnVisibility(JSON.parse(saved));
      } catch (e) { }
    }
  }, []);

  const handleColumnVisibilityChange = (updaterOrValue) => {
    setColumnVisibility((old) => {
      const newVal = typeof updaterOrValue === "function" ? updaterOrValue(old) : updaterOrValue;
      localStorage.setItem("agricom_zoho_task_columns", JSON.stringify(newVal));
      return newVal;
    });
  };

  const handleUpdate = (taskId, version, payload) => {
    updateTaskMutation.mutate({ id: taskId, payload: { ...payload, version: version || 0 } });
  };

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: () => (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              className="w-3.5 h-3.5 rounded-sm border-gray-300 text-blue-500 focus:ring-blue-500/30 cursor-pointer"
              checked={
                isSelectAllActive
                  ? selectedRowIds.size === 0
                  : rawData.length > 0 && rawData.every(task => selectedRowIds.has(task.id))
              }
              ref={input => {
                if (input) {
                  if (isSelectAllActive) {
                    input.indeterminate = selectedRowIds.size > 0;
                  } else {
                    const selectedCount = rawData.filter(task => selectedRowIds.has(task.id)).length;
                    input.indeterminate = selectedCount > 0 && selectedCount < rawData.length;
                  }
                }
              }}
              onChange={(e) => {
                const checked = e.target.checked;
                if (checked) {
                  setIsSelectAllActive(true);
                  setSelectedRowIds(new Set()); // Empty blacklist => select all
                } else {
                  setIsSelectAllActive(false);
                  setSelectedRowIds(new Set()); // Empty whitelist => select none
                }
              }}
            />
          </div>
        ),
        cell: ({ row }) => {
          const isSelected = isSelectAllActive
            ? !selectedRowIds.has(row.original.id)
            : selectedRowIds.has(row.original.id);
          return (
            <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded-sm border-gray-300 text-blue-500 focus:ring-blue-500/30 cursor-pointer"
                checked={isSelected}
                onClick={(e) => {
                  // Support Shift + Click range check selections
                  if (e.shiftKey && window.lastClickedRowIndex !== undefined) {
                    e.preventDefault();
                    const start = Math.min(window.lastClickedRowIndex, row.index);
                    const end = Math.max(window.lastClickedRowIndex, row.index);
                    const rangeRows = data.slice(start, end + 1);
                    const targetState = isSelectAllActive
                      ? selectedRowIds.has(row.original.id) // invert state
                      : !selectedRowIds.has(row.original.id);

                    setSelectedRowIds(prev => {
                      const next = new Set(prev);
                      rangeRows.forEach(r => {
                        if (isSelectAllActive) {
                          if (targetState) next.add(r.id);
                          else next.delete(r.id);
                        } else {
                          if (targetState) next.add(r.id);
                          else next.delete(r.id);
                        }
                      });
                      return next;
                    });
                  }
                }}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setSelectedRowIds(prev => {
                    const next = new Set(prev);
                    if (isSelectAllActive) {
                      // In blacklist mode, check removes from blacklist
                      if (checked) next.delete(row.original.id);
                      else next.add(row.original.id);
                    } else {
                      // In whitelist mode, check adds to whitelist
                      if (checked) next.add(row.original.id);
                      else next.delete(row.original.id);
                    }
                    return next;
                  });
                  window.lastClickedRowIndex = row.index;
                }}
              />
            </div>
          );
        },
        size: 40,
      },
      {
        accessorKey: "taskCode",
        header: () => <ColHeader>ID</ColHeader>,
        size: 90,
        cell: (info) => (
          <span className="text-[13px] text-gray-600 font-normal block w-full truncate" title={info.getValue() || "-"}>
            {info.getValue() || "-"}
          </span>
        ),
      },
      {
        accessorKey: "title",
        header: () => <ColHeader>Task Name</ColHeader>,
        size: 350,
        cell: ({ row }) => {
          const isSubtask = !!row.original.parentTaskId;
          const hasSubtasks = rawData.some(t => t.parentTaskId === row.original.id);
          const isExpanded = !collapsedTaskIds.has(row.original.id);

          return (
            <div className="flex items-center gap-1.5 w-full overflow-hidden">
              {isSubtask && (
                <div className="flex items-center justify-end w-5 shrink-0 pl-1">
                  <span className="text-gray-400 text-[14px]">↳</span>
                </div>
              )}

              {!isSubtask && hasSubtasks && (
                <button
                  onClick={(e) => toggleExpand(row.original.id, e)}
                  className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 font-normal cursor-pointer"
                >
                  {isExpanded ? <MinusSquare className="w-3.5 h-3.5" /> : <PlusSquare className="w-3.5 h-3.5" />}
                </button>
              )}

              {!isSubtask && !hasSubtasks && (
                <div className="w-4 h-4 shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <EditableTextCell
                  value={row.original.title}
                  disabled={!canUpdate}
                  onSave={(val) => handleUpdate(row.original.id, row.original.version, { title: val })}
                />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "ownerId",
        header: () => <ColHeader>Owner</ColHeader>,
        size: 180,
        cell: ({ row }) => {
          return (
            <EditableSelectCell
              isOwner
              value={row.original.ownerId}
              options={employeeOptions}
              disabled={!canUpdate}
              onSave={(val) => handleUpdate(row.original.id, row.original.version, { ownerId: val })}
              renderValue={() => {
                const ownerName = row.original.owner?.name || "Unassigned";
                const { bg, text } = getAvatarColor(ownerName);
                if (!row.original.ownerId) return <span className="text-gray-400 text-[13px]">Unassigned</span>;
                return (
                  <div className="flex items-center gap-2 w-full" title={ownerName}>
                    <div className={`w-5 h-5 rounded-full ${bg} flex items-center justify-center text-[9px] font-medium ${text} shrink-0`}>
                      {getInitials(ownerName)}
                    </div>
                    <span className="text-[13px] text-gray-700 truncate">{ownerName}</span>
                  </div>
                );
              }}
            />
          );
        },
      },
      {
        id: "associates",
        header: () => <ColHeader>Associates</ColHeader>,
        size: 160,
        cell: ({ row }) => {
          const assignees = row.original.assignees || [];
          return (
            <EditableSelectCell
              isMulti
              value={assignees.map(a => a.userId || a.user?.id)}
              options={employeeOptions}
              disabled={!canUpdate}
              onSave={(val) => handleUpdate(row.original.id, row.original.version, { assigneeIds: val })}
              renderValue={() => {
                if (assignees.length === 0) return <span className="text-gray-400 text-[13px]">Unassigned</span>;
                if (assignees.length === 1) {
                  const user = assignees[0].user || assignees[0];
                  const userName = user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Unknown");
                  const { bg, text } = getAvatarColor(userName);
                  return (
                    <div className="flex items-center gap-2 w-full truncate" title={userName}>
                      <div className={`w-5 h-5 rounded-full ${bg} flex items-center justify-center text-[9px] font-medium ${text} shrink-0`}>
                        {getInitials(userName)}
                      </div>
                      <span className="text-[13px] text-gray-700 truncate">{userName}</span>
                    </div>
                  );
                }
                return (
                  <div className="flex items-center -space-x-1 p-1 px-2 w-full truncate">
                    {assignees.slice(0, 3).map((assignee, idx) => {
                      const user = assignee.user || assignee;
                      const userName = user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Unknown");
                      const { bg, text } = getAvatarColor(userName);
                      return (
                        <div
                          key={user?.id || idx}
                          className={`w-6 h-6 rounded-full border border-white ${bg} flex items-center justify-center text-[9px] font-medium ${text}`}
                          title={userName}
                        >
                          {getInitials(userName)}
                        </div>
                      );
                    })}
                    {assignees.length > 3 && (
                      <div className="w-6 h-6 rounded-full border border-white bg-gray-100 flex items-center justify-center text-[9px] font-medium text-gray-600 z-10">
                        +{assignees.length - 3}
                      </div>
                    )}
                  </div>
                );
              }}
            />
          );
        },
      },
      {
        accessorKey: "statusId",
        header: () => <ColHeader>Status</ColHeader>,
        size: 130,
        cell: ({ row }) => {
          const loggedInUserId = user?.userId || user?.id;
          const isOwner = row.original.ownerId === loggedInUserId;
          const hasAssignees = row.original.assignees && row.original.assignees.length > 0;
          const isStatusDisabled = !canUpdate || (isOwner && hasAssignees);
          return (
            <EditableSelectCell
              value={row.original.statusId}
              options={statuses.map(s => ({ value: s.id, label: s.name, color: s.color }))}
              disabled={isStatusDisabled}
              onSave={(val) => changeStatusMutation.mutate({ id: row.original.id, payload: { statusId: val, version: row.original.version || 0 } })}
              renderValue={() => {
                const statusName = row.original.status?.name || "Open";
                const statusColor = row.original.status?.color || "#71d289";
                return (
                  <span
                    className="text-white px-3 py-0.5 rounded-[3px] text-[12px] font-medium w-full text-center truncate"
                    style={{ backgroundColor: statusColor }}
                  >
                    {statusName}
                  </span>
                );
              }}
            />
          );
        },
      },
      {
        accessorKey: "startDate",
        header: () => <ColHeader>Start Date</ColHeader>,
        size: 180,
        cell: ({ row }) => (
          <EditableDateCell
            value={row.original.startDate}
            disabled={!canUpdate}
            onSave={(val) => handleUpdate(row.original.id, row.original.version, { startDate: val })}
          />
        ),
      },
      {
        accessorKey: "dueDate",
        header: () => <ColHeader>Due Date</ColHeader>,
        size: 180,
        cell: ({ row }) => (
          <EditableDateCell
            value={row.original.dueDate}
            disabled={!canUpdate}
            onSave={(val) => handleUpdate(row.original.id, row.original.version, { dueDate: val })}
          />
        ),
      },
      {
        accessorKey: "estimatedMinutes",
        header: () => <ColHeader>Duration</ColHeader>,
        size: 90,
        cell: ({ row }) => (
          <EditableNumberCell
            value={row.original.estimatedMinutes}
            disabled={!canUpdate}
            onSave={(val) => handleUpdate(row.original.id, row.original.version, { estimatedMinutes: val })}
          />
        ),
      },
      {
        accessorKey: "priorityId",
        header: () => <ColHeader>Priority</ColHeader>,
        size: 150,
        cell: ({ row }) => {
          return (
            <EditableSelectCell
              isPriority
              value={row.original.priorityId}
              options={priorities.map(p => ({ value: p.id, label: p.name }))}
              disabled={!canUpdate}
              onSave={(val) => handleUpdate(row.original.id, row.original.version, { priorityId: val })}
              renderValue={() => {
                const priorityName = row.original.priority?.name || "None";
                if (!row.original.priorityId) return <span className="text-gray-400 text-[13px]">-</span>;
                const priorityKey = priorityName.toLowerCase();
                const priorityColor = priorityStyles[priorityKey] || "text-gray-400";
                return (
                  <span className="flex items-center gap-1 text-[13px] w-full truncate" title={priorityName}>
                    <span className={`${priorityColor} font-bold shrink-0`}>!</span>
                    <span className="text-gray-800 truncate">{priorityName}</span>
                  </span>
                );
              }}
            />
          );
        },
      },
      {
        id: "actions",
        size: 80,
        header: () => <ColHeader>Updates</ColHeader>,
        cell: ({ row }) => (
          <div className="flex items-center gap-1 justify-center pr-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (canUpdate) {
                  openCreateTaskDrawer(row.original.id);
                }
              }}
              disabled={!canUpdate}
              className={`p-1 rounded bg-gray-50 border border-gray-100 shadow-sm transition-colors ${canUpdate
                  ? "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                  : "text-gray-350 cursor-not-allowed opacity-50"
                }`}
              title={canUpdate ? "Edit Task" : "Insufficient permissions to edit tasks"}
            >
              <Pencil className="w-3 h-3" />
            </button>
          </div>
        ),
      },
    ],
    [setSelectedTask, selectedRowIds, statuses, priorities, employeeOptions, changeStatusMutation, updateTaskMutation, collapsedTaskIds, rawData, canUpdate, user, isSelectAllActive, data]
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <TaskTableFoundation
        data={data}
        columns={columns}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isError={isError}
        refetch={refetch}
        rowSelection={selectedRowIds}
        onRowSelectionChange={setSelectedRowIds}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        onRowClick={(row) => {
          setSelectedTask(row.original.id);
        }}
      />
    </div>
  );
}