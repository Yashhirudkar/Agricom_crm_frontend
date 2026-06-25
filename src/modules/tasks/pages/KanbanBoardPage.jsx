import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TaskAPI } from '../api';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import PageLoader from '../components/common/PageLoader';
import ErrorState from '../components/common/ErrorState';
import KanbanColumn from '../components/Kanban/KanbanColumn';

export default function KanbanBoardPage() {
  const [columns, setColumns] = useState({});

  const { data: tasks, isLoading, isError } = useQuery({
    queryKey: ['tasks', 'kanban'],
    queryFn: async () => {
      const res = await TaskAPI.getTasks();
      // Depending on the return structure of TaskAPI, if it returns data.data or just data
      return res.data || res;
    },
    // Organize tasks into columns dynamically once data is fetched
    select: (data) => {
      const grouped = data.reduce((acc, task) => {
        const status = task.status?.name || 'Open';
        if (!acc[status]) acc[status] = [];
        acc[status].push(task);
        return acc;
      }, {
        'Open': [],
        'In Progress': [],
        'Done': []
      });
      return grouped;
    }
  });

  // Effect to sync grouped data to local state for optimistic UI drag-drop
  React.useEffect(() => {
    if (tasks) setColumns(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = active.data.current?.sortable?.containerId;
    const overContainer = over.data.current?.sortable?.containerId || over.id;

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return; // Reordering within the same column (add array-move logic if needed)
    }

    setColumns((prev) => {
      const activeItems = [...prev[activeContainer]];
      const overItems = [...prev[overContainer]];

      const activeIndex = activeItems.findIndex(i => i.id === active.id);
      const [removed] = activeItems.splice(activeIndex, 1);
      
      // Basic insert at end for cross-column drag
      overItems.push(removed);

      return {
        ...prev,
        [activeContainer]: activeItems,
        [overContainer]: overItems,
      };
    });

    // Fire API mutation to update task status
    // axios.patch(\`http://localhost:4000/v1/tasks/\${active.id}\`, { statusName: overContainer })
  };

  if (isLoading) return <PageLoader message="Loading Kanban Board..." />;
  if (isError) return <ErrorState title="Error" message="Failed to load tasks for the board." />;

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-900 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
        <p className="text-sm text-gray-500 mt-1">Drag and drop tasks to update their status.</p>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-8 custom-scrollbar">
        <div className="flex space-x-6 h-full items-start">
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCorners} 
            onDragEnd={handleDragEnd}
          >
            {Object.keys(columns).map(columnId => (
              <KanbanColumn 
                key={columnId} 
                id={columnId} 
                title={columnId} 
                tasks={columns[columnId]} 
              />
            ))}
          </DndContext>
        </div>
      </div>
    </div>
  );
}
