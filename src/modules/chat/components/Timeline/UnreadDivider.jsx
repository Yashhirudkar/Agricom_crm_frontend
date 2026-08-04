import React from "react";

const UnreadDivider = React.memo(() => {
  return (
    <div className="flex items-center justify-center my-3.5 select-none animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex-grow border-t border-red-200/60"></div>
      <span className="mx-3 px-2 py-0.5 bg-red-50 text-red-500 text-[9px] font-bold rounded-md border border-red-100/50 shadow-[0_1px_1.5px_rgba(239,68,68,0.04)] uppercase tracking-wider">
        New Messages
      </span>
      <div className="flex-grow border-t border-red-200/60"></div>
    </div>
  );
});

UnreadDivider.displayName = "UnreadDivider";

export default UnreadDivider;
