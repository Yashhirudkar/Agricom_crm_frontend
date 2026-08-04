import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search, X, Calendar, User, FileText, Pin, Star } from "lucide-react";
import { ChatAPI } from "@/api/chat.api";

const GlobalSearch = ({ activeConversationId, onClose, onJumpToMessage }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters state
  const [filterSenderId, setFilterSenderId] = useState("");
  const [filterType, setFilterType] = useState(""); // TEXT, IMAGE, PDF, FILE, POLL
  const [filterPinned, setFilterPinned] = useState(false);
  const [filterStarred, setFilterStarred] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // 300ms Input Search Debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const delay = setTimeout(async () => {
      try {
        const res = await ChatAPI.searchMessages({
          conversationId: activeConversationId,
          query: query.trim(),
          senderId: filterSenderId || undefined,
          type: filterType || undefined,
          isPinned: filterPinned || undefined,
          isStarred: filterStarred || undefined,
        });

        // Backend returns matched message list
        setResults(res.data || res || []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query, activeConversationId, filterSenderId, filterType, filterPinned, filterStarred]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Highlight matches function
  const renderHighlightedSnippet = (text = "", match = "") => {
    if (!match.trim() || !text) return text;
    const parts = text.split(new RegExp(`(${match.trim()})`, "gi"));
    return (
      <span>
        {parts.map((p, i) =>
          p.toLowerCase() === match.trim().toLowerCase() ? (
            <mark key={i} className="bg-yellow-100 text-yellow-800 rounded font-bold px-0.5">
              {p}
            </mark>
          ) : (
            p
          )
        )}
      </span>
    );
  };

  const handleResultClick = useCallback((msgId) => {
    if (onJumpToMessage) {
      onJumpToMessage(msgId);
    }
    onClose();
  }, [onJumpToMessage, onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 z-[999] flex items-start justify-center p-4 pt-[10vh] backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div
        ref={containerRef}
        className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh] animate-in slide-in-from-top-4 duration-150"
      >
        {/* Search header box */}
        <div className="relative border-b border-slate-100 shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages, files, and links (Ctrl+K)..."
            className="w-full text-sm font-semibold border-none pl-11 pr-10 py-4 focus:outline-none focus:ring-0 bg-white text-slate-800"
          />
          <Search className="absolute left-4 top-4.5 h-4.5 w-4.5 text-slate-400" />
          <button
            onClick={onClose}
            className="absolute right-3.5 top-4 p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Filters checklist Tray */}
        <div className="px-4 py-2 border-b border-slate-100/60 bg-slate-50/50 flex items-center gap-2 flex-wrap shrink-0">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-[10px] font-bold border border-slate-200 bg-white rounded-lg px-2 py-1 text-slate-500 cursor-pointer"
          >
            <option value="">All Formats</option>
            <option value="TEXT">Text Only</option>
            <option value="IMAGE">Images</option>
            <option value="VIDEO">Videos</option>
            <option value="PDF">PDFs</option>
            <option value="FILE">Attachments</option>
            <option value="POLL">Polls</option>
          </select>

          <button
            onClick={() => setFilterPinned(p => !p)}
            className={`text-[10px] font-bold border rounded-lg px-2 py-1 flex items-center gap-1 transition-colors cursor-pointer
              ${filterPinned ? "bg-amber-50 border-amber-200 text-amber-600 font-bold" : "bg-white border-slate-200 text-slate-500"}`}
          >
            <Pin className="h-3 w-3" /> Pinned
          </button>

          <button
            onClick={() => setFilterStarred(s => !s)}
            className={`text-[10px] font-bold border rounded-lg px-2 py-1 flex items-center gap-1 transition-colors cursor-pointer
              ${filterStarred ? "bg-amber-50 border-amber-200 text-amber-600 font-bold" : "bg-white border-slate-200 text-slate-500"}`}
          >
            <Star className="h-3 w-3" /> Starred
          </button>
        </div>

        {/* Results view screen */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col gap-3">
              {[0, 1, 2].map(i => (
                <div key={i} className="h-14 bg-slate-50 border border-slate-100 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-2">
              {results.map((res) => (
                <div
                  key={res.id}
                  onClick={() => handleResultClick(res.id)}
                  className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50/80 cursor-pointer transition-colors flex flex-col gap-1 text-left"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span className="text-slate-600">{res.sender?.name || "Employee"}</span>
                    <span>{new Date(res.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-normal line-clamp-2">
                    {renderHighlightedSnippet(res.content, query)}
                  </p>
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="text-center text-xs text-slate-400 py-10">
              No matching messages found. Try another query or filters.
            </div>
          ) : (
            <div className="text-center text-xs text-slate-400 py-10">
              Start typing to search conversation history...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
