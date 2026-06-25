import React from 'react';
import RichTextEditor from '../common/RichTextEditor';
import ChecklistSection from './ChecklistSection';

export default function TaskDetailMain({ task }) {
  const [isEditingDesc, setIsEditingDesc] = React.useState(false);
  const [descHtml, setDescHtml] = React.useState(task?.description || '');

  return (
    <div className="space-y-10">
      
      {/* Tiptap Description Section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Description</h3>
          {!isEditingDesc && (
            <button 
              onClick={() => setIsEditingDesc(true)}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Edit
            </button>
          )}
        </div>
        
        {isEditingDesc ? (
          <div className="space-y-3">
            <RichTextEditor 
              value={descHtml} 
              onChange={setDescHtml} 
              editable={true} 
            />
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setIsEditingDesc(false)}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // In real app: call API to save
                  setIsEditingDesc(false);
                }}
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setIsEditingDesc(true)}
            className="cursor-pointer group relative rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 p-1 -m-1 transition-colors"
          >
            <RichTextEditor 
              value={task?.description || ''} 
              editable={false} 
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm px-2 py-1 text-xs text-gray-500">
              Click to edit
            </div>
          </div>
        )}
      </section>

      {/* Checklists Section */}
      <section>
        <ChecklistSection task={task} />
      </section>

      {/* Subtasks Section Placeholder */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Subtasks</h3>
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center">
          <p className="text-sm text-gray-500">Recursive Subtask tree implementation goes here</p>
        </div>
      </section>

      {/* Attachments Section Placeholder */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Attachments</h3>
        <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
          <p className="text-sm text-gray-500">Drag and drop files here to attach</p>
        </div>
      </section>

      {/* Activity Timeline Placeholder */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Activity</h3>
        <div className="border-l-2 border-gray-200 dark:border-gray-800 ml-2 pl-4 py-2 space-y-4">
          <p className="text-sm text-gray-500">Activity timeline diff history will render here</p>
        </div>
      </section>

    </div>
  );
}
