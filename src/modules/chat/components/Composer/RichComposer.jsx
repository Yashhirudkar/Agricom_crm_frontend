"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import { Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon, List, Mic } from "lucide-react";

export default function RichComposer({ value, onChange, placeholder, onSubmit }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || "Type a message...",
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention bg-blue-100 text-blue-800 rounded px-1 py-0.5 font-bold",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "focus:outline-none outline-none text-sm text-slate-800 w-full min-h-[20px] max-h-[80px]",
      },
      handleKeyDown: (view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          const txt = view.state.doc.textContent.trim();
          if (txt && onSubmit) {
            onSubmit(txt);
            // Clear editor after submit
            view.dispatch(
              view.state.tr.delete(0, view.state.doc.content.size)
            );
          }
          return true; // mark event as handled
        }
        return false; // let Tiptap handle everything else
      },
    },
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getText());
    },
  });

  // Synchronize editor text if value changes externally
  useEffect(() => {
    if (editor && value !== editor.getText()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="flex-1 flex items-center gap-3">
      {/* Capsule input bar */}
      <div className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2 min-h-[40px] max-h-[96px] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all flex items-center overflow-hidden">
        <div className="flex-1 overflow-y-auto max-h-[80px] w-full">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Sleek round send button */}
      <button
        type="button"
        onClick={() => {
          const txt = editor.getText();
          if (txt.trim()) {
            onSubmit(txt);
            editor.commands.clearContent();
          }
        }}
        disabled={!value.trim()}
        className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition-all shrink-0 hover:scale-105 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
        title="Send Message"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 translate-x-[1px]">
          <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
        </svg>
      </button>
    </div>
  );
}
