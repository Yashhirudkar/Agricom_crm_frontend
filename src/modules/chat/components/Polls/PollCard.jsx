import React, { useMemo, useCallback } from "react";
import { Vote, Lock, Users, Check } from "lucide-react";
import { useVotePollMutation, useClosePollMutation } from "../../mutations/chat.mutations";

// Error Boundary wrapper around Poll Card rendering
class PollErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("PollCard render crash:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-3 bg-red-50 text-red-650 text-xs border border-red-200 rounded-lg">
          Failed to load interactive poll.
        </div>
      );
    }
    return this.props.children;
  }
}

const PollCardInner = React.memo(({ msg, conversation, currentUser }) => {
  const poll = msg.poll;
  if (!poll) return null;

  const currentUserId = currentUser?.id || currentUser?.userId;
  const isCreator = Number(msg.senderId) === Number(currentUserId);
  const isClosed = !!poll.isClosed;

  // React Query mutations
  const voteMutation = useVotePollMutation();
  const closeMutation = useClosePollMutation();

  // Parse votes count and percentages
  const totalVotesCount = useMemo(() => {
    return poll.options.reduce((sum, opt) => sum + (opt.votes?.length || 0), 0);
  }, [poll.options]);

  // Determine current user's cast votes
  const mySelectedOptionIds = useMemo(() => {
    return poll.options
      .filter(opt => opt.votes?.some(v => Number(v.userId) === Number(currentUserId)))
      .map(opt => opt.id);
  }, [poll.options, currentUserId]);

  const handleVote = useCallback((optionId) => {
    if (isClosed) return;

    let nextOptionIds = [];
    if (poll.allowMultiple) {
      if (mySelectedOptionIds.includes(optionId)) {
        nextOptionIds = mySelectedOptionIds.filter(id => id !== optionId);
      } else {
        nextOptionIds = [...mySelectedOptionIds, optionId];
      }
    } else {
      if (mySelectedOptionIds.includes(optionId)) {
        nextOptionIds = []; // clear vote
      } else {
        nextOptionIds = [optionId];
      }
    }

    voteMutation.mutate({
      pollId: poll.id,
      optionIds: nextOptionIds,
      conversationId: msg.conversationId,
    });
  }, [poll.id, poll.allowMultiple, mySelectedOptionIds, isClosed, voteMutation, msg.conversationId]);

  const handleClose = useCallback(() => {
    if (window.confirm("Are you sure you want to close this poll? Nobody else will be able to vote.")) {
      closeMutation.mutate({
        pollId: poll.id,
        conversationId: msg.conversationId,
      });
    }
  }, [poll.id, closeMutation, msg.conversationId]);

  return (
    <div className="w-80 bg-white border border-slate-100 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.03)] p-4 select-none">
      {/* Poll Header info */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
          <Vote className="h-3.5 w-3.5" />
          <span>{isClosed ? "Poll Closed" : "Active Poll"}</span>
        </div>
        {!isClosed && isCreator && (
          <button
            onClick={handleClose}
            className="text-[9px] font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100/60 px-2 py-1 rounded-md transition-colors cursor-pointer"
          >
            Close Poll
          </button>
        )}
      </div>

      <h4 className="text-sm font-bold text-slate-800 leading-snug mb-3">
        {poll.question}
      </h4>

      {/* Options Stack */}
      <div className="flex flex-col gap-2.5">
        {poll.options.map(opt => {
          const voteCount = opt.votes?.length || 0;
          const pct = totalVotesCount > 0 ? Math.round((voteCount / totalVotesCount) * 100) : 0;
          const isVotedByMe = mySelectedOptionIds.includes(opt.id);

          return (
            <div
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              className={`group relative p-2.5 rounded-lg border text-xs font-semibold select-none transition-all duration-150 cursor-pointer overflow-hidden
                ${isClosed ? "cursor-not-allowed opacity-85" : "hover:border-indigo-200"}
                ${isVotedByMe
                  ? "bg-indigo-50/20 border-indigo-300/80 text-indigo-800"
                  : "bg-slate-50/40 border-slate-100 text-slate-700 hover:bg-slate-50/80"
                }`}
            >
              {/* Colored progress bar layout element */}
              <div
                className={`absolute left-0 top-0 h-full transition-all duration-500 ease-out -z-10
                  ${isVotedByMe ? "bg-indigo-100/40" : "bg-slate-200/30"}`}
                style={{ width: `${pct}%` }}
              />

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2 pr-4 min-w-0">
                  {isVotedByMe && <Check className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0" />}
                  <span className="truncate">{opt.optionText}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold shrink-0">
                  {pct}% ({voteCount})
                </span>
              </div>

              {/* Voter Avatars Strip (Unless Anonymous) */}
              {!poll.isAnonymous && opt.votes?.length > 0 && (
                <div className="flex items-center gap-0.5 mt-2 flex-wrap pl-1 relative z-10 animate-in fade-in-10">
                  <Users className="h-2.5 w-2.5 text-slate-400 mr-1 flex-shrink-0" />
                  {opt.votes.slice(0, 5).map((v, i) => (
                    <div
                      key={v.id || i}
                      className="h-4 w-4 rounded-full bg-slate-200 border border-white text-[7px] font-bold flex items-center justify-center text-slate-600 select-none flex-shrink-0"
                      title={v.user?.name || "Voter"}
                    >
                      {v.user?.name ? v.user.name.slice(0, 1).toUpperCase() : "?"}
                    </div>
                  ))}
                  {opt.votes.length > 5 && (
                    <span className="text-[8px] text-slate-400 font-bold ml-0.5">
                      +{opt.votes.length - 5}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer statistics summary */}
      <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-3.5 pt-2.5 border-t border-slate-100/60">
        <span className="flex items-center gap-1">
          {poll.allowMultiple ? "Multiple choice" : "Single choice"}
          {poll.isAnonymous && " • Anonymous"}
        </span>
        <span>Total Votes: {totalVotesCount}</span>
      </div>
    </div>
  );
}, (prev, next) => {
  // Memoize heavily: only update if message data changes
  return (
    prev.msg.id === next.msg.id &&
    prev.msg.poll?.isClosed === next.msg.poll?.isClosed &&
    JSON.stringify(prev.msg.poll?.options) === JSON.stringify(next.msg.poll?.options) &&
    prev.currentUser?.id === next.currentUser?.id
  );
});

PollCardInner.displayName = "PollCardInner";

export default function PollCard(props) {
  return (
    <PollErrorBoundary>
      <PollCardInner {...props} />
    </PollErrorBoundary>
  );
}
