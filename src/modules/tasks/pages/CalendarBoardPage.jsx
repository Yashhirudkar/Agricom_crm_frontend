import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { TaskAPI } from '../api';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useRouter } from 'next/navigation';
import PageLoader from '../components/common/PageLoader';
import ErrorState from '../components/common/ErrorState';

export default function CalendarBoardPage() {
  const router = useRouter();

  const { data: events, isLoading, isError } = useQuery({
    queryKey: ['tasks', 'calendar'],
    queryFn: async () => {
      const res = await TaskAPI.getTasks();
      const tasks = res.data || res || [];
      // Map tasks to FullCalendar event format
      return tasks
        .filter(task => task.dueDate) // Only show tasks with a due date
        .map(task => ({
          id: task.id.toString(),
          title: task.title,
          start: task.dueDate,
          // Optional: handle duration or estimated minutes here
          allDay: true, 
          backgroundColor: task.status?.color || '#3B82F6',
          borderColor: task.status?.color || '#3B82F6',
          extendedProps: {
            status: task.status?.name,
            priority: task.priority?.name
          }
        }));
    }
  });

  const handleEventClick = (info) => {
    // Navigate to the task detail page
    router.push(`/tasks/${info.event.id}`);
  };

  const handleEventDrop = async (info) => {
    // Info contains event, oldEvent, delta
    const newDate = info.event.start;
    // In a real app, fire a mutation to update the task dueDate in the backend
    console.log(`Task ${info.event.id} moved to ${newDate}`);
  };

  if (isLoading) return <PageLoader message="Loading Calendar..." />;
  if (isError) return <ErrorState title="Error" message="Failed to load tasks for calendar." />;

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-900 p-8 overflow-y-auto custom-scrollbar">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Calendar</h1>
        <p className="text-sm text-gray-500 mt-1">Schedule and manage your upcoming deadlines.</p>
      </div>
      
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {/* FullCalendar styles natively handle most of the layout, but some CSS overrides are needed for Dark Mode in globals.css */}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events || []}
          editable={true} // Enables dragging
          selectable={true}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          height="auto"
          themeSystem="standard"
        />
      </div>
    </div>
  );
}
