(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/lucide-react/dist/esm/icons/vote.mjs [app-client] (ecmascript) <export default as Vote>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Vote",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$vote$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$vote$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/vote.mjs [app-client] (ecmascript)");
}),
"[project]/src/modules/chat/components/Polls/PollCard.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PollCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$vote$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Vote$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/vote.mjs [app-client] (ecmascript) <export default as Vote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.mjs [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/mutations/chat.mutations.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEscapeKey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useEscapeKey.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
// Error Boundary wrapper around Poll Card rendering
class PollErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Component {
    state = {
        hasError: false
    };
    static getDerivedStateFromError() {
        return {
            hasError: true
        };
    }
    componentDidCatch(error, errorInfo) {
        console.error("PollCard render crash:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 bg-red-50 text-red-655 text-xs border border-red-200 rounded-lg",
                children: "Failed to load interactive poll."
            }, void 0, false, {
                fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                lineNumber: 14,
                columnNumber: 9
            }, this);
        }
        return this.props.children;
    }
}
const PollCardInner = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].memo(_s(({ msg, conversation, currentUser })=>{
    _s();
    const poll = msg.poll;
    if (!poll) return null;
    const currentUserId = currentUser?.id || currentUser?.userId;
    const isCreator = Number(msg.senderId) === Number(currentUserId);
    const isClosed = !!poll.isClosed;
    // Confirmation modal state
    const [confirmOpen, setConfirmOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // React Query mutations
    const voteMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useVotePollMutation"])();
    const closeMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClosePollMutation"])();
    // Parse votes count and percentages
    const totalVotesCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PollCardInner.useMemo[totalVotesCount]": ()=>{
            return poll.options.reduce({
                "PollCardInner.useMemo[totalVotesCount]": (sum, opt)=>sum + (opt.votes?.length || 0)
            }["PollCardInner.useMemo[totalVotesCount]"], 0);
        }
    }["PollCardInner.useMemo[totalVotesCount]"], [
        poll.options
    ]);
    // Determine current user's cast votes
    const mySelectedOptionIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PollCardInner.useMemo[mySelectedOptionIds]": ()=>{
            return poll.options.filter({
                "PollCardInner.useMemo[mySelectedOptionIds]": (opt)=>opt.votes?.some({
                        "PollCardInner.useMemo[mySelectedOptionIds]": (v)=>Number(v.userId) === Number(currentUserId)
                    }["PollCardInner.useMemo[mySelectedOptionIds]"])
            }["PollCardInner.useMemo[mySelectedOptionIds]"]).map({
                "PollCardInner.useMemo[mySelectedOptionIds]": (opt)=>opt.id
            }["PollCardInner.useMemo[mySelectedOptionIds]"]);
        }
    }["PollCardInner.useMemo[mySelectedOptionIds]"], [
        poll.options,
        currentUserId
    ]);
    const handleVote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PollCardInner.useCallback[handleVote]": (optionId)=>{
            if (isClosed) return;
            let nextOptionIds = [];
            if (poll.allowMultiple) {
                if (mySelectedOptionIds.includes(optionId)) {
                    nextOptionIds = mySelectedOptionIds.filter({
                        "PollCardInner.useCallback[handleVote]": (id)=>id !== optionId
                    }["PollCardInner.useCallback[handleVote]"]);
                } else {
                    nextOptionIds = [
                        ...mySelectedOptionIds,
                        optionId
                    ];
                }
            } else {
                if (mySelectedOptionIds.includes(optionId)) {
                    nextOptionIds = []; // clear vote
                } else {
                    nextOptionIds = [
                        optionId
                    ];
                }
            }
            voteMutation.mutate({
                pollId: poll.id,
                optionIds: nextOptionIds,
                conversationId: msg.conversationId
            });
        }
    }["PollCardInner.useCallback[handleVote]"], [
        poll.id,
        poll.allowMultiple,
        mySelectedOptionIds,
        isClosed,
        voteMutation,
        msg.conversationId
    ]);
    const handleClose = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PollCardInner.useCallback[handleClose]": ()=>{
            setConfirmOpen(true);
        }
    }["PollCardInner.useCallback[handleClose]"], []);
    const handleConfirmClose = ()=>{
        closeMutation.mutate({
            pollId: poll.id,
            conversationId: msg.conversationId
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-80 bg-white border border-slate-100 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.03)] p-4 select-none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-2 mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-wider",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$vote$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Vote$3e$__["Vote"], {
                                className: "h-3.5 w-3.5"
                            }, void 0, false, {
                                fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: isClosed ? "Poll Closed" : "Active Poll"
                            }, void 0, false, {
                                fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    !isClosed && isCreator && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleClose,
                        className: "text-[9px] font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100/60 px-2 py-1 rounded-md transition-colors cursor-pointer",
                        children: "Close Poll"
                    }, void 0, false, {
                        fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                        lineNumber: 95,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                lineNumber: 89,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "text-sm font-bold text-slate-800 leading-snug mb-3",
                children: poll.question
            }, void 0, false, {
                fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                lineNumber: 104,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2.5",
                children: poll.options.map((opt)=>{
                    const voteCount = opt.votes?.length || 0;
                    const pct = totalVotesCount > 0 ? Math.round(voteCount / totalVotesCount * 100) : 0;
                    const isVotedByMe = mySelectedOptionIds.includes(opt.id);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: ()=>handleVote(opt.id),
                        className: `group relative p-2.5 rounded-lg border text-xs font-semibold select-none transition-all duration-150 cursor-pointer overflow-hidden
                ${isClosed ? "cursor-not-allowed opacity-85" : "hover:border-indigo-200"}
                ${isVotedByMe ? "bg-indigo-50/20 border-indigo-300/80 text-indigo-800" : "bg-slate-50/40 border-slate-100 text-slate-700 hover:bg-slate-50/80"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `absolute left-0 top-0 h-full transition-all duration-500 ease-out -z-10
                  ${isVotedByMe ? "bg-indigo-100/40" : "bg-slate-200/30"}`,
                                style: {
                                    width: `${pct}%`
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                                lineNumber: 127,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between relative z-10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 pr-4 min-w-0",
                                        children: [
                                            isVotedByMe && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                className: "h-3.5 w-3.5 text-indigo-600 flex-shrink-0"
                                            }, void 0, false, {
                                                fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                                                lineNumber: 135,
                                                columnNumber: 35
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "truncate",
                                                children: opt.optionText
                                            }, void 0, false, {
                                                fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                                                lineNumber: 136,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                                        lineNumber: 134,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-slate-500 font-bold shrink-0",
                                        children: [
                                            pct,
                                            "% (",
                                            voteCount,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                                        lineNumber: 138,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                                lineNumber: 133,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            !poll.isAnonymous && opt.votes?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-0.5 mt-2 flex-wrap pl-1 relative z-10 animate-in fade-in-10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                        className: "h-2.5 w-2.5 text-slate-400 mr-1 flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                                        lineNumber: 146,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    opt.votes.slice(0, 5).map((v, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-4 w-4 rounded-full bg-slate-200 border border-white text-[7px] font-bold flex items-center justify-center text-slate-600 select-none flex-shrink-0",
                                            title: v.user?.name || "Voter",
                                            children: v.user?.name ? v.user.name.slice(0, 1).toUpperCase() : "?"
                                        }, v.id || i, false, {
                                            fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                                            lineNumber: 148,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))),
                                    opt.votes.length > 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[8px] text-slate-400 font-bold ml-0.5",
                                        children: [
                                            "+",
                                            opt.votes.length - 5
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                                        lineNumber: 157,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                                lineNumber: 145,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, opt.id, true, {
                        fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                        lineNumber: 116,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0));
                })
            }, void 0, false, {
                fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                lineNumber: 109,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-3.5 pt-2.5 border-t border-slate-100/60",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-1",
                        children: [
                            poll.allowMultiple ? "Multiple choice" : "Single choice",
                            poll.isAnonymous && " • Anonymous"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            "Total Votes: ",
                            totalVotesCount
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                lineNumber: 169,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            confirmOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ConfirmModal, {
                isOpen: confirmOpen,
                onClose: ()=>setConfirmOpen(false),
                title: "Close Interactive Poll",
                message: "Are you sure you want to close this poll? Nobody else will be able to vote after it is closed.",
                confirmLabel: "Close Poll",
                cancelLabel: "Cancel",
                isDestructive: true,
                onConfirm: handleConfirmClose
            }, void 0, false, {
                fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                lineNumber: 178,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
        lineNumber: 87,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "FTnnhLs8j6TL4nwsbbA/75LOzHw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useVotePollMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClosePollMutation"]
    ];
}), (prev, next)=>{
    // Memoize heavily: only update if message data changes
    return prev.msg.id === next.msg.id && prev.msg.poll?.isClosed === next.msg.poll?.isClosed && JSON.stringify(prev.msg.poll?.options) === JSON.stringify(next.msg.poll?.options) && prev.currentUser?.id === next.currentUser?.id;
});
_c = PollCardInner;
PollCardInner.displayName = "PollCardInner";
function PollCard(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PollErrorBoundary, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PollCardInner, {
            ...props
        }, void 0, false, {
            fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
            lineNumber: 206,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
        lineNumber: 205,
        columnNumber: 5
    }, this);
}
_c1 = PollCard;
// ── Custom Confirmation Modal ──
function ConfirmModal({ isOpen, onClose, title, message, confirmLabel, cancelLabel, onConfirm, isDestructive }) {
    _s1();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEscapeKey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEscapeKey"])(onClose, isOpen);
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white border border-slate-200/80 shadow-2xl rounded-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 text-left",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-slate-900 font-bold text-[13px] mb-1.5",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                            lineNumber: 221,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-slate-500 text-[11px] leading-relaxed",
                            children: message
                        }, void 0, false, {
                            fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                            lineNumber: 222,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                    lineNumber: 220,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-700 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors",
                            children: cancelLabel || "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                            lineNumber: 225,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                onConfirm();
                                onClose();
                            },
                            className: `px-3 py-1.5 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors text-white
              ${isDestructive ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`,
                            children: confirmLabel || "Confirm"
                        }, void 0, false, {
                            fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                            lineNumber: 231,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
                    lineNumber: 224,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
            lineNumber: 219,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/modules/chat/components/Polls/PollCard.jsx",
        lineNumber: 218,
        columnNumber: 5
    }, this);
}
_s1(ConfirmModal, "Kd5TflhK+d5IdYSr0ox+sEB3c54=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEscapeKey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEscapeKey"]
    ];
});
_c2 = ConfirmModal;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "PollCardInner");
__turbopack_context__.k.register(_c1, "PollCard");
__turbopack_context__.k.register(_c2, "ConfirmModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/chat/components/Polls/PollCard.jsx [app-client] (ecmascript, next/dynamic entry)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/src/modules/chat/components/Polls/PollCard.jsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_1jkzu0x._.js.map