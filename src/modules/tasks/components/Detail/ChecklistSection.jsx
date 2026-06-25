import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Bars3Icon, TrashIcon, CheckCircleIcon as CheckSolid } from '@heroicons/react/24/solid';
import { CheckCircleIcon as CheckOutline, PlusIcon } from '@heroicons/react/24/outline';

export default function ChecklistSection({ task }) {
  // Temporary state for UI, usually managed by React Query mutations
  const [items, setItems] = useState([
    { id: '1', title: 'Design Database Schema', completed: true },
    { id: '2', title: 'Implement Backend APIs', completed: false },
    { id: '3', title: 'Build Frontend UI', completed: false },
  ]);
  const [newItemTitle, setNewItemTitle] = useState('');

  const completedCount = items.filter(i => i.completed).length;
  const progress = items.length === 0 ? 0 : Math.round((completedCount / items.length) * 100);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setItems(reordered);
    // Real app: fire mutation to update displayOrder backend
  };

  const toggleItem = (id) => {
    setItems(items.map(i => i.id === id ? { ...i, completed: !i.completed } : i));
  };

  const deleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;
    setItems([...items, { id: Date.now().toString(), title: newItemTitle, completed: false }]);
    setNewItemTitle('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Checklist</h3>
        <span className="text-sm text-gray-500 font-medium">{progress}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mb-4 overflow-hidden">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="checklist">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="space-y-1 mb-4"
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center group p-2 rounded-lg border ${snapshot.isDragging ? 'bg-white dark:bg-gray-800 border-blue-300 shadow-md' : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                    >
                      <div 
                        {...provided.dragHandleProps}
                        className="mr-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Bars3Icon className="w-4 h-4" />
                      </div>
                      
                      <button 
                        onClick={() => toggleItem(item.id)}
                        className="mr-3 text-gray-400 hover:text-green-500 transition-colors focus:outline-none"
                      >
                        {item.completed ? (
                          <CheckSolid className="w-5 h-5 text-green-500" />
                        ) : (
                          <CheckOutline className="w-5 h-5" />
                        )}
                      </button>

                      <span className={`flex-1 text-sm ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                        {item.title}
                      </span>

                      <button 
                        onClick={() => deleteItem(item.id)}
                        className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add New Item */}
      <form onSubmit={handleAdd} className="flex items-center pl-8 mt-2">
        <PlusIcon className="w-4 h-4 text-gray-400 mr-2" />
        <input 
          type="text" 
          placeholder="Add an item..." 
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          className="flex-1 bg-transparent border-none text-sm focus:ring-0 p-0 text-gray-900 dark:text-white placeholder-gray-400"
        />
      </form>
    </div>
  );
}
