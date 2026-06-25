"use client";

import { useMemo, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Calendar, Clock, MoreHorizontal, AlertCircle } from "lucide-react";
import { format } from "date-fns";

const COLUMNS = [
  { id: "PENDING", label: "To Do", color: "bg-amber-50", borderColor: "border-amber-200", textColor: "text-amber-700" },
  { id: "IN_PROGRESS", label: "In Progress", color: "bg-blue-50", borderColor: "border-blue-200", textColor: "text-blue-700" },
  { id: "COMPLETED", label: "Completed", color: "bg-green-50", borderColor: "border-green-200", textColor: "text-green-700" },
];

const priorityColors = {
  LOW: "text-gray-500 bg-gray-50 border-gray-100",
  MEDIUM: "text-blue-500 bg-blue-50 border-blue-100",
  HIGH: "text-orange-500 bg-orange-50 border-orange-100",
  URGENT: "text-red-500 bg-red-50 border-red-100",
};

export default function TaskKanban({ tasks, onStatusChange, onView }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const boardData = useMemo(() => {
    const data = {
      PENDING: [],
      IN_PROGRESS: [],
      COMPLETED: [],
    };
    if (!tasks) return data;
    
    tasks.forEach(task => {
      const statusName = task.status?.name || "PENDING";
      if (data[statusName]) {
        data[statusName].push(task);
      } else {
        data["PENDING"].push(task); // Fallback
      }
    });
    return data;
  }, [tasks]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceCol = result.source.droppableId;
    const destCol = result.destination.droppableId;
    const taskId = result.draggableId;

    if (sourceCol !== destCol) {
      onStatusChange(taskId, destCol);
    }
  };

  if (!isMounted) return null; // Prevent hydration error with react-beautiful-dnd / pangea

  if (!tasks || tasks.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center border-t border-gray-50">
        <AlertCircle className="h-10 w-10 text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium text-sm">No tasks found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50/50 overflow-x-auto min-h-[500px]">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 items-start h-full">
          {COLUMNS.map((col) => {
            const colTasks = boardData[col.id] || [];
            
            return (
              <div key={col.id} className="flex-shrink-0 w-80 flex flex-col bg-gray-100/50 rounded-2xl border border-gray-200 max-h-[80vh] overflow-hidden">
                <div className={`px-4 py-3 border-b flex justify-between items-center ${col.borderColor}`}>
                  <h3 className={`text-sm font-bold tracking-wide flex items-center gap-2 ${col.textColor}`}>
                    {col.label}
                    <span className="bg-white/60 px-2 py-0.5 rounded-full text-[10px]">{colTasks.length}</span>
                  </h3>
                </div>
                
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto p-3 space-y-3 transition-colors ${snapshot.isDraggingOver ? col.color : ""}`}
                    >
                      {colTasks.map((task, index) => (
                        <Draggable key={String(task.id)} draggableId={String(task.id)} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-4 rounded-xl border shadow-sm transition-all cursor-pointer hover:border-[#007aff] hover:shadow-md ${snapshot.isDragging ? "shadow-lg scale-[1.02] rotate-1 z-50 border-[#007aff]" : "border-gray-200"}`}
                              onClick={() => onView(task)}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${priorityColors[task.priority?.name || 'MEDIUM'] || priorityColors.MEDIUM}`}>
                                  {task.priority?.name || 'MEDIUM'}
                                </span>
                                <button className="text-gray-300 hover:text-gray-500 p-0.5"><MoreHorizontal className="h-4 w-4" /></button>
                              </div>
                              
                              <h4 className="font-bold text-gray-800 text-sm leading-tight mb-3 line-clamp-2">
                                {task.title}
                              </h4>
                              
                              <div className="flex items-center justify-between text-[10px] font-medium text-gray-400">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {task.dueDate ? format(new Date(task.dueDate), "MMM dd") : "No Due Date"}
                                </div>
                                <span className="font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                  {task.taskCode || `TSK-${task.id}`}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
