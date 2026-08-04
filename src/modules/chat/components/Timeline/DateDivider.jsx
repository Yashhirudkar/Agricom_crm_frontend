import React from "react";

const DateDivider = React.memo(({ label }) => {
  return (
    <div className="flex items-center justify-center my-3.5 select-none">
      <span className="px-2.5 py-0.5 bg-slate-100/60 backdrop-blur-xs text-slate-500 text-[9px] font-bold rounded-full border border-slate-200/30 shadow-[0_1px_1.5px_rgba(0,0,0,0.01)] tracking-wide">
        {label}
      </span>
    </div>
  );
});

DateDivider.displayName = "DateDivider";

export default DateDivider;
