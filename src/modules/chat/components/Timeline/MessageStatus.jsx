import React from "react";
import { Check, CheckCheck, Clock, AlertCircle } from "lucide-react";

const MessageStatus = React.memo(({ msg, isOutgoing, isRead }) => {
  if (!isOutgoing) return null;

  return (
    <div className="flex items-center ml-0.5 select-none">
      {msg.isOptimistic ? (
        msg.status === "FAILED" ? (
          <AlertCircle
            className="h-3 w-3 text-red-400 flex-shrink-0 cursor-pointer hover:text-red-500 transition-colors"
            title="Failed to send. Click to retry"
          />
        ) : (
          <Clock className="h-2.5 w-2.5 text-white/50 animate-pulse flex-shrink-0" />
        )
      ) : isRead ? (
        <CheckCheck className="h-3 w-3 text-sky-200 flex-shrink-0 animate-in fade-in-20" />
      ) : (
        <Check className="h-3 w-3 text-white/70 flex-shrink-0" />
      )}
    </div>
  );
});

MessageStatus.displayName = "MessageStatus";

export default MessageStatus;
