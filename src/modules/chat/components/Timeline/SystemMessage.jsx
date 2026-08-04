import React from "react";

const SystemMessage = React.memo(({ content }) => {
  return (
    <div className="flex justify-center my-2">
      <span className="px-3 py-1 bg-slate-100/80 text-slate-500 text-[10px] font-medium rounded-full border border-slate-200/60 max-w-xs text-center">
        {content}
      </span>
    </div>
  );
});

SystemMessage.displayName = "SystemMessage";

export default SystemMessage;
