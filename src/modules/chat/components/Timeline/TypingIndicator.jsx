import React from "react";

const TypingIndicator = React.memo(({ names = [] }) => {
  const label = names.length === 1
    ? `${names[0]} is typing`
    : names.length === 2
      ? `${names[0]} and ${names[1]} are typing`
      : "Several people are typing";

  return (
    <div className="flex items-end gap-2 animate-in fade-in slide-in-from-bottom-1 duration-200">
      <div className="w-9 flex-shrink-0" />
      <div className="flex flex-col items-start">
        <span className="text-[10px] text-slate-400 mb-1 pl-1">{label}</span>
      </div>
    </div>
  );
});

TypingIndicator.displayName = "TypingIndicator";

export default TypingIndicator;
