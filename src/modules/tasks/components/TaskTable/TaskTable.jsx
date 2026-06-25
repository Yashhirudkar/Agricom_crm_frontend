import React, { useMemo, useState, useEffect, useRef } from "react";
import { useTaskStore } from "../../store/taskStore";
import { useTasksQuery, useTaskStatusesQuery, useTaskPrioritiesQuery } from "../../queries/tasks.query";
import { TaskTableFoundation } from "./TaskTableFoundation";
import { Archive, CheckCircle2 } from "lucide-react";
import { useChangeTaskStatusMutation, useArchiveTaskMutation, useUpdateTaskMutation } from "../../mutations/tasks.mutation";
import { useQuery } from '@tanstack/react-query';
import axiosClient from "../../../../lib/axios";
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { createPortal } from 'react-dom';

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

function EditableTextCell({ value, onSave }) {
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

  if (isEditing) {
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
      onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
      className="w-full min-h-[24px] text-[13px] text-gray-800 hover:text-blue-600 cursor-pointer truncate flex items-center px-2 -mx-2 hover:bg-gray-50 rounded"
      title={value}
    >
      {value || "-"}
    </div>
  );
}

function EditableNumberCell({ value, onSave }) {
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

  if (isEditing) {
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
      onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
      className="w-full min-h-[24px] text-[13px] text-gray-800 hover:text-blue-600 cursor-pointer truncate flex items-center px-2 -mx-2 hover:bg-gray-50 rounded"
    >
      {value ? `${value}m` : "-"}
    </div>
  );
}

function EditableDateCell({ value, onSave }) {
  const [isEditing, setIsEditing] = useState(false);

  // Format YYYY-MM-DD for the input type="date"
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

  if (isEditing) {
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
      onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
      className="w-full min-h-[24px] text-[13px] text-gray-700 cursor-pointer truncate flex items-center gap-1 px-2 -mx-2 hover:bg-gray-50 rounded"
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

function EditableSelectCell({ value, options, onSave, renderValue, isOwner, isMulti }) {
  const [isEditing, setIsEditing] = useState(false);
  const [rect, setRect] = useState(null);
  const wrapperRef = useRef(null);

  const startEdit = (e) => {
    e.stopPropagation();
    if (wrapperRef.current) {
      setRect(wrapperRef.current.getBoundingClientRect());
    }
    setIsEditing(true);
  };

  if (isEditing) {
    if (isOwner || isMulti) {
      // Searchable react-select for Owner or Assignees using portal to escape overflow-hidden
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
      <select
        autoFocus
        value={value || ""}
        onChange={(e) => {
          onSave(e.target.value ? Number(e.target.value) : null);
          setIsEditing(false);
        }}
        onBlur={() => setIsEditing(false)}
        onClick={(e) => e.stopPropagation()}
        className="w-full h-full px-1 py-1 text-[13px] border border-blue-500 rounded outline-none bg-white"
      >
        <option value="" disabled>Select...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }

  return (
    <div
      ref={wrapperRef}
      onClick={startEdit}
      className="w-full min-h-[24px] cursor-pointer flex items-center px-2 -mx-2 hover:bg-gray-50 rounded"
    >
      {renderValue(value)}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Task Table Component
// ---------------------------------------------------------------------------
export default function TaskTable() {
  const {
    filters,
    pagination,
    setPagination,
    selectedRowIds,
    setSelectedRowIds,
    setSelectedTask,
    preset,
  } = useTaskStore();

  const user = useSelector(state => state.auth.user);
  const isSuperAdmin = user?.type === 'SUPER_ADMIN';
  const targetCompanyId = user?.companyId; // Simplified for table context

  const { data: statusesData } = useTaskStatusesQuery();
  const statuses = statusesData || [];

  const { data: prioritiesData } = useTaskPrioritiesQuery();
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

  const { data: response, isLoading } = useTasksQuery({
    ...filters,
    preset,
    page: pagination.page,
    limit: pagination.limit,
  });

  const data = response?.data || [];
  const meta = response?.meta || { totalCount: 0 };

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
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              className="w-3.5 h-3.5 rounded-sm border-gray-300 text-blue-500 focus:ring-blue-500/30 cursor-pointer"
              checked={table.getIsAllPageRowsSelected()}
              onChange={table.getToggleAllPageRowsSelectedHandler()}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              className="w-3.5 h-3.5 rounded-sm border-gray-300 text-blue-500 focus:ring-blue-500/30 cursor-pointer"
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </div>
        ),
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
        cell: ({ row }) => (
          <EditableTextCell
            value={row.original.title}
            onSave={(val) => handleUpdate(row.original.id, row.original.version, { title: val })}
          />
        ),
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
              onSave={(val) => handleUpdate(row.original.id, row.original.version, { assigneeIds: val })}
              renderValue={() => {
                if (assignees.length === 0) return <span className="text-gray-400 text-[13px]">Unassigned</span>;
                return (
                  <div className="flex items-center -space-x-1 p-1 px-2 w-full truncate">
                    {assignees.slice(0, 3).map((assignee, idx) => {
                      const user = assignee.user || assignee; // Fallback just in case
                      const { bg, text } = getAvatarColor(user?.name || "");
                      return (
                        <div 
                          key={user?.id || idx} 
                          className={`w-6 h-6 rounded-full border border-white ${bg} flex items-center justify-center text-[9px] font-medium ${text}`} 
                          title={user?.name || "Unknown"}
                        >
                          {getInitials(user?.name || "")}
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
          return (
            <EditableSelectCell
              value={row.original.statusId}
              options={statuses.map(s => ({ value: s.id, label: s.name }))}
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
              value={row.original.priorityId}
              options={priorities.map(p => ({ value: p.id, label: p.name }))}
              onSave={(val) => handleUpdate(row.original.id, row.original.version, { priorityId: val })}
              renderValue={() => {
                const priorityName = row.original.priority?.name || "None";
                const color = row.original.priority?.color || "#9ca3af";
                if (!row.original.priorityId) return <span className="text-gray-400 text-[13px]">-</span>;
                return (
                  <div className="flex items-center gap-1.5 text-[13px] text-gray-700 w-full truncate" title={priorityName}>
                    <span className="font-bold shrink-0" style={{ color }}>!</span>
                    <span className="truncate">{priorityName}</span>
                  </div>
                );
              }}
            />
          );
        },
      },
      {
        id: "actions",
        size: 60,
        header: () => null,
        cell: () => null,
      },
    ],
    [setSelectedTask, selectedRowIds, statuses, priorities, employeeOptions, changeStatusMutation, updateTaskMutation]
  );

  const handlePaginationChange = (updater) => {
    const newState = typeof updater === "function" ? updater({ pageIndex: pagination.page - 1, pageSize: pagination.limit }) : updater;
    setPagination({ page: newState.pageIndex + 1, limit: newState.pageSize });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <TaskTableFoundation
        data={data}
        columns={columns}
        totalCount={meta.totalCount}
        isLoading={isLoading}
        pagination={{ pageIndex: pagination.page - 1, pageSize: pagination.limit }}
        onPaginationChange={handlePaginationChange}
        rowSelection={selectedRowIds}
        onRowSelectionChange={setSelectedRowIds}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        onRowClick={() => { }} // Disabled preview drawer
      />
    </div>
  );
}