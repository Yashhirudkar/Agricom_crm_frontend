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
        <div className="px-4 py-3 bg-white border border-slate-100 rounded-[18px] rounded-bl-[4px] shadow-sm">
          <div className="flex items-center gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-slate-400"
                style={{
                  animation: `typing-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

TypingIndicator.displayName = "TypingIndicator";

export default TypingIndicator;
