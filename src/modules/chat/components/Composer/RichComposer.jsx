"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Mention from "@tiptap/extension-mention";
import { Smile, Image as ImageIcon, Mic, Paperclip, AlertCircle, Type, Send } from "lucide-react";
import dynamic from "next/dynamic";

// Import toolbar
import ComposerToolbar from "./ComposerToolbar";

// Lazy load heavy Emoji and suggestions pickers to optimize bundle size
const EmojiPicker = dynamic(() => import("./EmojiPicker"), { ssr: false });
const VoiceRecorder = dynamic(() => import("./VoiceRecorder"), { ssr: false });
const MentionDropdown = dynamic(() => import("./MentionDropdown"), { ssr: false });

export default function RichComposer({
  value,
  onChange,
  placeholder,
  onSubmit,
  onSendVoice,
  onSendFile,
  employees = []
}) {
  const [showEmoji, setShowEmoji] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);

  // Mention Suggestions local state
  const [mentionQuery, setMentionQuery] = useState(null);
  const [mentionPosition, setMentionPosition] = useState(null);

  // Drag and drop local state
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const mentionRef = useRef(null);
  const dropdownContainerRef = useRef(null);

  // Keep track of the last value we reported to the parent to prevent cursor jumps when typing
  const lastReportedValue = useRef(value);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // Block default enter node breaking
        blockquote: false,
        link: {
          openOnClick: false,
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Type a message...",
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention bg-blue-50 text-blue-700 rounded-md px-1.5 py-0.5 font-bold text-xs inline-flex select-all border border-blue-100",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "focus:outline-none outline-none text-sm text-slate-850 w-full min-h-[22px] max-h-[120px] select-text pr-2",
      },
      handleKeyDown: (view, event) => {
        // Intercept keys when Mention dropdown list is active
        if (mentionQuery !== null && mentionRef.current) {
          const handled = mentionRef.current.onKeyDown({ event });
          if (handled) return true;
        }

        // Submits text on Enter, shifts on Shift+Enter
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          const txt = editor.getText().trim();
          if (txt && onSubmit) {
            onSubmit(txt);
            editor.commands.clearContent();
          }
          return true;
        }
        return false;
      },
    },
    content: value,
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      lastReportedValue.current = text;
      onChange(text);

      // Pure React mentions character matching query scanner
      const selection = editor.state.selection;
      const cursor = selection.$from.parentOffset;
      const textBeforeCursor = selection.$from.parent.textBetween(0, cursor);
      const match = textBeforeCursor.match(/@(\w*)$/);

      if (match) {
        const query = match[1];
        setMentionQuery(query);
        // Map cursor coordinates to screen positions
        const coords = editor.view.coordsAtPos(selection.$from.pos);
        setMentionPosition({
          top: coords.bottom + window.scrollY,
          left: coords.left + window.scrollX,
        });
      } else {
        setMentionQuery(null);
      }
    },
  });

  // Synchronize editor text if value changes externally
  useEffect(() => {
    if (editor && value !== lastReportedValue.current) {
      editor.commands.setContent(value);
      lastReportedValue.current = value;
    }
  }, [value, editor]);

  // Handle outside clicks to close picker panels
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(e.target)) {
        setShowEmoji(false);
        setMentionQuery(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Handle paste files
  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1 || items[i].type.indexOf("file") !== -1 || items[i].kind === "file") {
        const file = items[i].getAsFile();
        if (file && onSendFile) {
          e.preventDefault();
          const fakeEvent = { target: { files: [file] } };
          onSendFile(fakeEvent);
        }
      }
    }
  }, [onSendFile]);

  // Drag over / drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (onSendFile) {
        onSendFile({ target: { files: e.dataTransfer.files } });
      }
      e.dataTransfer.clearData();
    }
  };

  const handleEmojiSelect = useCallback((emoji) => {
    editor.chain().focus().insertContent(emoji).run();
  }, [editor]);

  const handleSelectMention = useCallback((item) => {
    if (!editor) return;
    const selection = editor.state.selection;
    editor.chain().focus()
      .deleteRange({
        from: selection.$from.pos - (mentionQuery.length + 1),
        to: selection.$from.pos
      })
      .insertContent({
        type: "mention",
        attrs: { id: item.id, label: item.label }
      })
      .insertContent(" ") // add a spacing pad
      .run();
    setMentionQuery(null);
  }, [editor, mentionQuery]);

  const filteredEmployees = useMemo(() => {
    if (mentionQuery === null) return [];
    return employees
      .filter(emp => emp.name.toLowerCase().startsWith(mentionQuery.toLowerCase()))
      .slice(0, 15);
  }, [mentionQuery, employees]);

  if (!editor) return null;

  return (
    <div
      className="flex-1 flex flex-col gap-2 relative"
      ref={dropdownContainerRef}
      onDragEnter={handleDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onPaste={handlePaste}
    >
      {/* Mention Suggestions List Overlay */}
      {mentionQuery !== null && mentionPosition && (
        <div
          className="fixed z-[9999]"
          style={{
            top: `${mentionPosition.top + 8}px`,
            left: `${mentionPosition.left}px`
          }}
        >
          <MentionDropdown
            ref={mentionRef}
            items={filteredEmployees}
            command={handleSelectMention}
          />
        </div>
      )}

      {/* Floating drag and drop file overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-50/90 border-2 border-dashed border-blue-500 rounded-2xl flex flex-col items-center justify-center gap-2 z-40 pointer-events-none animate-in fade-in duration-150">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600 animate-bounce">
            <Paperclip className="h-6 w-6" />
          </div>
          <span className="text-xs font-bold text-blue-700">Drop files here to upload</span>
        </div>
      )}

      {/* Floating popups pickers absolute panels */}
      {showEmoji && (
        <div className="absolute bottom-full mb-3 left-0 z-30">
          <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmoji(false)} />
        </div>
      )}

      {showVoice && (
        <div className="absolute bottom-full mb-3 left-8 z-30">
          <VoiceRecorder onSend={onSendVoice} onClose={() => setShowVoice(false)} />
        </div>
      )}

      {/* Composer Input capsule row */}
      <div className="flex items-end gap-2 px-1 pb-0.5 select-none h-auto">
        {/* Left actions: Smiley, Paperclip */}
        <div className="flex items-center gap-1 shrink-0 pb-1">
          <button
            type="button"
            onClick={() => { setShowEmoji(v => !v); }}
            className={`p-1.5 rounded-full hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer ${showEmoji ? "bg-slate-200 text-blue-600" : ""}`}
            title="Add Emoji"
          >
            <Smile className="h-4.5 w-4.5" />
          </button>

          {/* Custom file input trigger */}
          <label className="p-1.5 rounded-full hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer flex items-center justify-center shrink-0">
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                if (onSendFile) onSendFile(e);
                e.target.value = null; // reset to allow same upload
              }}
            />
            <Paperclip className="h-4.5 w-4.5" />
          </label>
        </div>

        {/* Text Input Pill */}
        <div className="flex-1 flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all duration-200 shadow-xs focus-within:shadow-[0_4px_12px_rgba(37,99,235,0.04)]">
          {showFormatting && <ComposerToolbar editor={editor} />}
          
          <div className="px-3.5 py-2 max-h-[110px] overflow-y-auto w-full text-slate-800 leading-normal text-[14px]">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Right actions: Formatting [Aa], Mic or Send button */}
        <div className="flex items-center gap-1 shrink-0 pb-1">
          <button
            type="button"
            onClick={() => setShowFormatting(v => !v)}
            className={`p-1.5 rounded-full hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer ${showFormatting ? "bg-blue-50 text-blue-600 font-bold" : ""}`}
            title="Formatting toolbar"
          >
            <Type className="h-4.5 w-4.5" />
          </button>

          {editor && editor.getText().trim() !== "" ? (
            <button
              type="button"
              onClick={() => {
                const txt = editor.getText().trim();
                if (onSubmit) {
                  onSubmit(txt);
                  editor.commands.clearContent();
                }
              }}
              className="h-8.5 w-8.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition-all duration-150 active:scale-90 animate-in zoom-in-75 cursor-pointer shrink-0"
              title="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { setShowVoice(v => !v); }}
              className={`p-1.5 rounded-full hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer ${showVoice ? "bg-slate-200 text-blue-600 animate-pulse" : ""}`}
              title="Voice Message"
            >
              <Mic className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
