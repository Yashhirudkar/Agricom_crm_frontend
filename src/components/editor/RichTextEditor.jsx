'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Mention from '@tiptap/extension-mention';
import { Maximize2, Minimize2 } from 'lucide-react';

// Simple toolbar for the editor
const MenuBar = ({ editor, isFullscreen, toggleFullscreen }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
      <div className="flex flex-wrap items-center gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-2 py-1 text-sm rounded ${editor.isActive('bold') ? 'bg-gray-200 text-gray-900 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-2 py-1 text-sm rounded ${editor.isActive('italic') ? 'bg-gray-200 text-gray-900 italic' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`px-2 py-1 text-sm rounded ${editor.isActive('strike') ? 'bg-gray-200 text-gray-900 line-through' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Strike
        </button>
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 text-sm rounded ${editor.isActive('bulletList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Bullet List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 text-sm rounded ${editor.isActive('orderedList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Ordered List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 text-sm rounded ${editor.isActive('blockquote') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Quote
        </button>
      </div>
      <button
        onClick={toggleFullscreen}
        type="button"
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded"
      >
        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </button>
    </div>
  );
};

export default function RichTextEditor({ value, onChange, editable = true, placeholder = 'Add a description...', outputFormat = 'html' }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false }),
      Underline,
    ],
    // Handle both HTML string (legacy tasks) and JSON object (new contracts)
    content: value || '',
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (!onChange) return;
      if (outputFormat === 'json') {
        onChange(editor.getJSON());
      } else {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[150px] p-4 text-sm',
      },
    },
  });

  // Sync value if changed from outside
  useEffect(() => {
    if (!editor || !value) return;
    const currentContent = outputFormat === 'json' ? editor.getJSON() : editor.getHTML();
    
    // Deep equality check for JSON is expensive, but we can do a simple stringify comparison
    // or just rely on TipTap's internal checks. 
    // To prevent cursor jumping, we only set content if it's vastly different.
    if (outputFormat === 'html' && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    } else if (outputFormat === 'json' && JSON.stringify(value) !== JSON.stringify(editor.getJSON())) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor, outputFormat]);

  // Fullscreen styling wrappers
  const containerStyle = isFullscreen
    ? 'fixed inset-0 z-[9999] p-4 md:p-8 bg-gray-900/60 backdrop-blur-sm flex flex-col'
    : `border rounded-lg overflow-hidden bg-white ${editable ? 'border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500' : 'border-transparent'}`;

  const innerStyle = isFullscreen
    ? 'bg-white rounded-xl shadow-2xl flex-1 flex flex-col overflow-hidden max-w-5xl mx-auto w-full'
    : 'flex flex-col h-full';

  return (
    <div className={containerStyle}>
      <div className={innerStyle}>
        {editable && <MenuBar editor={editor} isFullscreen={isFullscreen} toggleFullscreen={() => setIsFullscreen(!isFullscreen)} />}
        <div className={`flex-1 overflow-y-auto ${editable ? '' : 'pointer-events-none'}`}>
          <EditorContent editor={editor} />
        </div>
        {editable && (
          <div className="px-3 py-1.5 text-[10px] text-gray-400 border-t border-gray-100 text-right bg-gray-50 flex-shrink-0">
            {editor?.getText().length || 0} characters
          </div>
        )}
      </div>
    </div>
  );
}
