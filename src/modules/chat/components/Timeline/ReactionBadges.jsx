import React from "react";

const ReactionBadges = React.memo(({ reactions, isOutgoing, onReact, messageId }) => {
  if (!reactions || reactions.length === 0) return null;

  const grouped = reactions.reduce((acc, r) => {
    acc[r.reaction] = (acc[r.reaction] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className={`flex flex-wrap gap-1 mt-1.5 ${isOutgoing ? "justify-end" : "justify-start"}`}>
      {Object.entries(grouped).map(([emoji, count]) => (
        <button
          key={emoji}
          onClick={() => onReact(messageId, emoji)}
          className="flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-slate-200 rounded-full text-[11px] shadow-xs hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer select-none"
        >
          <span>{emoji}</span>
          {count > 1 && <span className="text-slate-500 text-[9px] font-bold">{count}</span>}
        </button>
      ))}
    </div>
  );
});

ReactionBadges.displayName = "ReactionBadges";

export default ReactionBadges;
