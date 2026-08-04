import React, { useState, useMemo } from "react";
import { Smile } from "lucide-react";

const EMOJI_CATEGORIES = {
  Smileys: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥸", "🤩", "🥳"],
  Gestures: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "✋", "🤚", "🖐️", "🖖", "👋", "✍️", "👏", "🙌", "🙏", "🤝", "💪", "✊", "👊", "🤛", "🤜", "🖐️", "👁️", "👀"],
  Hearts: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "☀️", "⭐", "🔥", "✨", "🎈", "🎉", "🏆", "💥", "💭", "💤"]
};

const EmojiPicker = React.memo(({ onSelect, onClose }) => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Smileys");

  const filteredEmojis = useMemo(() => {
    if (!search.trim()) return EMOJI_CATEGORIES[activeTab] || [];
    // Flatten and search across all categories
    return Object.values(EMOJI_CATEGORIES)
      .flat()
      .filter(e => e.includes(search.trim()));
  }, [search, activeTab]);

  return (
    <div className="w-64 h-72 bg-white border border-slate-200 rounded-xl shadow-xl flex flex-col p-3 z-30 select-none animate-in fade-in slide-in-from-bottom-2 duration-150">
      {/* Search Input */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search emojis..."
        className="w-full text-[11px] font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 mb-2 bg-slate-50"
      />

      {/* Tabs headers */}
      {!search && (
        <div className="flex gap-2 border-b border-slate-100 pb-1.5 mb-2">
          {Object.keys(EMOJI_CATEGORIES).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded cursor-pointer transition-colors
                ${activeTab === cat ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Scrollable emoji list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-0.5">
        <div className="grid grid-cols-7 gap-1">
          {filteredEmojis.map((e, idx) => (
            <button
              key={`${e}-${idx}`}
              onClick={() => { onSelect(e); }}
              className="text-lg hover:scale-125 transition-transform p-1 rounded hover:bg-slate-50 cursor-pointer flex items-center justify-center h-8 w-8"
            >
              {e}
            </button>
          ))}
          {filteredEmojis.length === 0 && (
            <div className="col-span-7 text-center text-[10px] text-slate-400 py-6">
              No matching emojis found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

EmojiPicker.displayName = "EmojiPicker";

export default EmojiPicker;
