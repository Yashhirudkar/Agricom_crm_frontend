import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

// Decoupled virtualized Suggestion List component for @mentions
const MentionList = forwardRef(({ items = [], command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const parentRef = useRef(null);

  // Virtualizer setup for scrolling through large directories (5000+ employees)
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    overscan: 5,
  });

  const selectItem = (index) => {
    const item = items[index];
    if (item) {
      command({ id: item.id || item.userId, label: item.name });
    }
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        setSelectedIndex((i) => {
          const next = i <= 0 ? items.length - 1 : i - 1;
          rowVirtualizer.scrollToIndex(next, { align: "auto" });
          return next;
        });
        return true;
      }
      if (event.key === "ArrowDown") {
        setSelectedIndex((i) => {
          const next = i >= items.length - 1 ? 0 : i + 1;
          rowVirtualizer.scrollToIndex(next, { align: "auto" });
          return next;
        });
        return true;
      }
      if (event.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  // Auto-reset selection index when matches change
  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-xs text-slate-400 select-none">
        No matching employees.
      </div>
    );
  }

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="max-h-48 w-56 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-2xl p-1 z-[9999] outline-none select-none"
    >
      <div className="w-full relative" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        {virtualItems.map((virtualRow) => {
          const item = items[virtualRow.index];
          const isSelected = virtualRow.index === selectedIndex;

          return (
            <div
              key={virtualRow.key}
              onClick={() => selectItem(virtualRow.index)}
              className={`absolute left-0 w-full px-3 py-2 text-xs font-semibold cursor-pointer transition-colors rounded-lg flex items-center gap-2
                ${isSelected ? "bg-blue-500 text-white" : "text-slate-700 hover:bg-slate-50"}`}
              style={{
                top: 0,
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {/* Initials avatar circle */}
              <div
                className={`h-5.5 w-5.5 rounded-full flex items-center justify-center font-bold text-[8px] shrink-0
                  ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                {item.name ? item.name.slice(0, 2).toUpperCase() : "?"}
              </div>
              <span className="truncate">{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

MentionList.displayName = "MentionList";

export default MentionList;
