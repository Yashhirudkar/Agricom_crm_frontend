import React from "react";
import { Bold, Italic, Underline as UnderlineIcon, List, Code, Quote } from "lucide-react";

const ComposerToolbar = React.memo(({ editor }) => {
  if (!editor) return null;

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleCode = () => editor.chain().focus().toggleCode().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();

  return (
    <div className="flex items-center gap-1.5 p-1 border-b border-slate-100 bg-slate-50/50 select-none">
      <button
        type="button"
        onClick={toggleBold}
        className={`p-1.5 rounded hover:bg-slate-200 transition-colors cursor-pointer text-slate-500
          ${editor.isActive("bold") ? "bg-slate-200 text-slate-900" : ""}`}
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={toggleItalic}
        className={`p-1.5 rounded hover:bg-slate-200 transition-colors cursor-pointer text-slate-500
          ${editor.isActive("italic") ? "bg-slate-200 text-slate-900" : ""}`}
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={toggleUnderline}
        className={`p-1.5 rounded hover:bg-slate-200 transition-colors cursor-pointer text-slate-500
          ${editor.isActive("underline") ? "bg-slate-200 text-slate-900" : ""}`}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={toggleCode}
        className={`p-1.5 rounded hover:bg-slate-200 transition-colors cursor-pointer text-slate-500
          ${editor.isActive("code") ? "bg-slate-200 text-slate-900" : ""}`}
        title="Code Block"
      >
        <Code className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={toggleBlockquote}
        className={`p-1.5 rounded hover:bg-slate-200 transition-colors cursor-pointer text-slate-500
          ${editor.isActive("blockquote") ? "bg-slate-200 text-slate-900" : ""}`}
        title="Blockquote"
      >
        <Quote className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={toggleBulletList}
        className={`p-1.5 rounded hover:bg-slate-200 transition-colors cursor-pointer text-slate-500
          ${editor.isActive("bulletList") ? "bg-slate-200 text-slate-900" : ""}`}
        title="Bullet List"
      >
        <List className="h-3.5 w-3.5" />
      </button>
    </div>
  );
});

ComposerToolbar.displayName = "ComposerToolbar";

export default ComposerToolbar;
