(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/(crm)/chat/ChatMainPanel.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatMainPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.mjs [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link.mjs [app-client] (ecmascript) <export default as Link>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.mjs [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pin.mjs [app-client] (ecmascript) <export default as Pin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.mjs [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.mjs [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Timeline$2f$MessageTimeline$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/components/Timeline/MessageTimeline.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Composer$2f$RichComposer$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/components/Composer/RichComposer.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Common$2f$ErrorBoundary$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/components/Common/ErrorBoundary.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Common$2f$SkeletonLoading$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/components/Common/SkeletonLoading.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Common$2f$UserProfileModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/components/Common/UserProfileModal.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
function ChatMainPanel({ showSidebarMobile, activeConversationId, activeConversation, activeDetails, headerSubtitle, rightPanelTab, isLoadingMessages, mergedMessagesList, user, typingUsersMap, uploadQueue, composerInput, setComposerInput, employeeLookup, editingMessage, setEditingMessage, replyingToMessage, setReplyingToMessage, canPost, presenceMap, onSetShowSidebarMobile, onTogglePanel, onSend, onFileUpload, onSendVoice, onComposerChange, onComposerSubmit, onReact, onPin, onUnpin, onStar, onDelete, onReply, fetchNextPage, hasNextPage, isFetchingNextPage, // Pinned banner
activePinnedMessage, onBannerUnpin, onOpenPinnedPanel }) {
    _s();
    const [headerProfileModalOpen, setHeaderProfileModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: `flex-1 min-w-0 flex flex-col h-full bg-white overflow-hidden transition-all duration-200
        ${showSidebarMobile ? "hidden md:flex" : "flex w-full"}`,
        children: !activeConversationId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-white",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 shadow-xs",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                        className: "h-8 w-8 text-slate-400"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                        lineNumber: 76,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                    lineNumber: 75,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "font-bold text-slate-850 text-sm",
                    children: "No Chat Selected"
                }, void 0, false, {
                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                    lineNumber: 78,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-slate-400 max-w-sm mt-1",
                    children: "Select a public channel, private group, or direct message from the sidebar to begin."
                }, void 0, false, {
                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                    lineNumber: 79,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
            lineNumber: 74,
            columnNumber: 9
        }, this) : isLoadingMessages ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 flex flex-col h-full overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Common$2f$SkeletonLoading$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HeaderSkeleton"], {}, void 0, false, {
                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                    lineNumber: 85,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Common$2f$SkeletonLoading$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessagesSkeleton"], {}, void 0, false, {
                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                    lineNumber: 86,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
            lineNumber: 84,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "h-[60px] px-4 border-b border-slate-200/60 bg-white flex items-center justify-between flex-shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.01)] select-none",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 min-w-0 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>onSetShowSidebarMobile(true),
                                    className: "p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg md:hidden transition-colors cursor-pointer mr-0.5",
                                    title: "Back to list",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                        lineNumber: 99,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                    lineNumber: 94,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    onClick: ()=>setHeaderProfileModalOpen(true),
                                    className: "relative flex-shrink-0 cursor-pointer group",
                                    title: "View Image",
                                    children: [
                                        activeDetails?.avatar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvatarUrl"])(activeDetails.avatar),
                                            alt: activeDetails.title,
                                            className: "h-10 w-10 rounded-full object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                            lineNumber: 108,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `h-10 w-10 rounded-full border flex items-center justify-center text-sm font-bold group-hover:scale-105 transition-transform ${activeConversation?.type === "CHANNEL" ? "bg-blue-50 text-blue-600 border border-blue-100" : activeConversation?.type === "GROUP" ? "bg-slate-100 text-slate-700 border border-slate-250" : activeDetails?.avatarClass || "bg-slate-100 text-slate-700"}`,
                                            children: activeConversation?.type === "CHANNEL" ? "#" : activeDetails?.initials || "G"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                            lineNumber: 114,
                                            columnNumber: 19
                                        }, this),
                                        activeConversation?.type === "DIRECT" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${activeDetails?.presence === "ONLINE" ? "bg-emerald-500" : activeDetails?.presence === "AWAY" ? "bg-amber-500" : activeDetails?.presence === "BUSY" ? "bg-red-500" : "bg-slate-400"}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                            lineNumber: 125,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                    lineNumber: 102,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0 cursor-pointer",
                                    onClick: ()=>setHeaderProfileModalOpen(true),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                    className: "font-bold text-slate-900 text-sm md:text-[14.5px] truncate leading-none hover:text-blue-600 transition-colors",
                                                    children: activeDetails?.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                                    lineNumber: 139,
                                                    columnNumber: 19
                                                }, this),
                                                activeConversation?.isLocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                    className: "h-3 w-3 text-amber-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                                    lineNumber: 140,
                                                    columnNumber: 52
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                            lineNumber: 138,
                                            columnNumber: 17
                                        }, this),
                                        activeDetails?.isTyping ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] text-emerald-600 font-semibold animate-pulse mt-1",
                                            children: activeDetails.typingText
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                            lineNumber: 143,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10.5px] text-slate-400 font-medium truncate max-w-[280px] md:max-w-[450px] mt-1 select-text",
                                            children: headerSubtitle
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                            lineNumber: 145,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                    lineNumber: 134,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                            lineNumber: 92,
                            columnNumber: 13
                        }, this),
                        headerProfileModalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Common$2f$UserProfileModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            user: {
                                name: activeDetails?.title,
                                avatarUrl: activeDetails?.avatar,
                                presence: activeDetails?.presence,
                                role: activeConversation?.type === "CHANNEL" ? "Channel" : activeConversation?.type === "GROUP" ? "Group Chat" : "Team Member"
                            },
                            isOpen: headerProfileModalOpen,
                            onClose: ()=>setHeaderProfileModalOpen(false)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                            lineNumber: 153,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1.5 flex-shrink-0 select-none",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>onTogglePanel("PINNED_MESSAGES"),
                                    className: `p-2 rounded-lg transition-colors cursor-pointer ${rightPanelTab === "PINNED_MESSAGES" ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`,
                                    title: "Pinned messages",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pin$3e$__["Pin"], {
                                        className: "h-4 w-4 rotate-45"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                        lineNumber: 171,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                    lineNumber: 166,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>onTogglePanel("STARRED_MESSAGES"),
                                    className: `p-2 rounded-lg transition-colors cursor-pointer ${rightPanelTab === "STARRED_MESSAGES" ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`,
                                    title: "Starred messages",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                        lineNumber: 179,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                    lineNumber: 174,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>onTogglePanel("INFO"),
                                    className: `p-2 rounded-lg transition-colors cursor-pointer ${rightPanelTab === "INFO" ? "bg-slate-100 text-slate-800" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`,
                                    title: "ERP Context Info",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                        lineNumber: 187,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                    lineNumber: 182,
                                    columnNumber: 15
                                }, this),
                                activeConversation?.type !== "DIRECT" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>onTogglePanel("GROUP_SETTINGS"),
                                    className: `p-2 rounded-lg transition-colors cursor-pointer ${rightPanelTab === "GROUP_SETTINGS" ? "bg-slate-100 text-slate-800 animate-in duration-100" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`,
                                    title: "Group Settings",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                        className: "h-4 w-4 hover:rotate-45 transition-transform duration-200"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                        lineNumber: 196,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                    lineNumber: 191,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>onTogglePanel("SETTINGS"),
                                    className: `p-2 rounded-lg transition-colors cursor-pointer ${rightPanelTab === "SETTINGS" ? "bg-slate-100 text-slate-800" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`,
                                    title: "Governance Policies",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                        lineNumber: 204,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                    lineNumber: 199,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                            lineNumber: 165,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                    lineNumber: 91,
                    columnNumber: 11
                }, this),
                activePinnedMessage?.message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onClick: onOpenPinnedPanel,
                    className: "flex items-center gap-2.5 px-4 py-2 bg-blue-50/70 border-b border-blue-100 cursor-pointer hover:bg-blue-50 transition-colors select-none group flex-shrink-0",
                    title: "Click to see all pinned messages",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-shrink-0 text-blue-500",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pin$3e$__["Pin"], {
                                className: "h-3.5 w-3.5 rotate-45"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                lineNumber: 218,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                            lineNumber: 217,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 min-w-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[9.5px] font-bold text-blue-600 uppercase tracking-wider leading-none mb-0.5",
                                    children: [
                                        "Pinned — ",
                                        activePinnedMessage.message.sender?.name || "Unknown"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                    lineNumber: 221,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11px] text-slate-600 truncate leading-tight",
                                    children: activePinnedMessage.message.content
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                    lineNumber: 224,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                            lineNumber: 220,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: (e)=>{
                                e.stopPropagation();
                                onBannerUnpin(activePinnedMessage.message.id);
                            },
                            className: "flex-shrink-0 p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer",
                            title: "Unpin message",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-3 w-3"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                lineNumber: 236,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                            lineNumber: 228,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                    lineNumber: 212,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Common$2f$ErrorBoundary$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    title: "Message Timeline Error",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Timeline$2f$MessageTimeline$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        messages: mergedMessagesList,
                        currentUser: user,
                        conversation: activeConversation,
                        typingUsers: typingUsersMap[activeConversationId] || [],
                        activeConversationId: activeConversationId,
                        onReact: onReact,
                        onPin: onPin,
                        onUnpin: onUnpin,
                        onStar: onStar,
                        onEdit: (msg)=>{
                            setEditingMessage(msg);
                            setComposerInput(msg.content);
                            setReplyingToMessage(null);
                        },
                        onDelete: onDelete,
                        onReply: (msg)=>{
                            setReplyingToMessage(msg);
                            setEditingMessage(null);
                        },
                        fetchNextPage: fetchNextPage,
                        hasNextPage: hasNextPage,
                        isFetchingNextPage: isFetchingNextPage,
                        presenceMap: presenceMap
                    }, void 0, false, {
                        fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                        lineNumber: 243,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                    lineNumber: 242,
                    columnNumber: 11
                }, this),
                Object.entries(uploadQueue).map(([id, item])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-6 my-2 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3 max-w-sm shadow-md animate-in slide-in-from-bottom-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                className: "h-7 w-7 text-blue-500 flex-shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                lineNumber: 273,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11px] font-semibold text-slate-800 truncate",
                                        children: item.fileName
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                        lineNumber: 275,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-1.5",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-blue-600 h-full",
                                            style: {
                                                width: `${item.progress}%`
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                            lineNumber: 277,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                        lineNumber: 276,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                lineNumber: 274,
                                columnNumber: 15
                            }, this)
                        ]
                    }, id, true, {
                        fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                        lineNumber: 272,
                        columnNumber: 13
                    }, this)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                    className: "px-3 py-2 bg-white border-t border-slate-200/60 flex flex-col gap-1 flex-shrink-0",
                    children: !canPost ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-center text-[11px] text-slate-400 py-2 select-none",
                        children: "Only admin can send messages."
                    }, void 0, false, {
                        fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                        lineNumber: 287,
                        columnNumber: 15
                    }, this) : // ── NORMAL COMPOSER ──
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            editingMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-blue-50/80 border-l-[3px] border-blue-500 rounded-md px-2.5 py-1.5 flex items-center justify-between text-[11px] animate-in slide-in-from-bottom-1 duration-100 mb-0.5 select-none",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-w-0 pr-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "font-bold text-blue-700 text-[10px] leading-none mb-0.5",
                                                children: "Editing message"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                                lineNumber: 296,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-slate-500 truncate text-[11px]",
                                                children: editingMessage.content
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                                lineNumber: 297,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                        lineNumber: 295,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setEditingMessage(null);
                                            setComposerInput("");
                                        },
                                        className: "text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "h-3 w-3"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                            lineNumber: 308,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                        lineNumber: 301,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                lineNumber: 294,
                                columnNumber: 19
                            }, this),
                            replyingToMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-slate-50 border-l-[3px] border-blue-500 rounded-md px-2.5 py-1.5 flex items-center justify-between text-[11px] animate-in slide-in-from-bottom-1 duration-100 mb-0.5 select-none",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-w-0 pr-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "font-bold text-blue-600 text-[10px] leading-none mb-0.5",
                                                children: [
                                                    "Replying to ",
                                                    replyingToMessage.sender?.name || "Teammate"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                                lineNumber: 315,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-slate-500 truncate text-[11px]",
                                                children: replyingToMessage.content
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                                lineNumber: 318,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                        lineNumber: 314,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setReplyingToMessage(null),
                                        className: "text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "h-3 w-3"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                            lineNumber: 326,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                        lineNumber: 322,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                lineNumber: 313,
                                columnNumber: 19
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Common$2f$ErrorBoundary$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                title: "Composer Input Error",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Composer$2f$RichComposer$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    value: composerInput,
                                    employees: Object.entries(employeeLookup).map(([id, emp])=>({
                                            id,
                                            name: emp.name
                                        })),
                                    onSendVoice: onSendVoice,
                                    onSendFile: onFileUpload,
                                    onChange: onComposerChange,
                                    placeholder: "Type a message...",
                                    onSubmit: (text)=>{
                                        onSend(text);
                                        onComposerSubmit();
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                    lineNumber: 331,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                                lineNumber: 330,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                        lineNumber: 292,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
                    lineNumber: 284,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
            lineNumber: 89,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(crm)/chat/ChatMainPanel.jsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
_s(ChatMainPanel, "v7cDGfc8rY/Bi1gjPbRD8IlVOjs=");
_c = ChatMainPanel;
var _c;
__turbopack_context__.k.register(_c, "ChatMainPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(crm)/chat/ChatRightPanel.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatRightPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link.mjs [app-client] (ecmascript) <export default as Link>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pin.mjs [app-client] (ecmascript) <export default as Pin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.mjs [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Common$2f$ErrorBoundary$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/components/Common/ErrorBoundary.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Admin$2f$AdminSettingsPanel$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/components/Admin/AdminSettingsPanel.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Admin$2f$GroupSettingsPanel$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/components/Admin/GroupSettingsPanel.jsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
function ChatRightPanel({ rightPanelTab, onClose, // INFO panel
loadingErp, erpDetail, activeConversation, // PINNED panel
loadingPinned, pinnedMessages, onUnpin, setPinnedMessages, // STARRED panel
loadingStarred, starredMessages, onUnstar, setStarredMessages, // SETTINGS panel
companyId, // GROUP_SETTINGS panel
user, onUpdateConversation }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: `border-l border-slate-200 flex flex-col bg-white overflow-hidden transition-all duration-300 flex-shrink-0
        ${rightPanelTab ? "w-full md:w-[360px] fixed md:relative right-0 top-0 bottom-0 h-full z-50 md:z-auto" : "w-0 border-l-0"}`,
        children: [
            rightPanelTab === "INFO" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full md:w-[360px] h-full flex flex-col text-slate-700",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-bold text-slate-900 text-xs flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                                        className: "h-4 w-4 text-blue-500"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                        lineNumber: 42,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "ERP Context Discussions"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                        lineNumber: 43,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                lineNumber: 41,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "p-1 hover:bg-slate-200 rounded cursor-pointer",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-4 w-4 text-slate-500"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                    lineNumber: 46,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                lineNumber: 45,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                        lineNumber: 40,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto p-4 space-y-4",
                        children: loadingErp ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 text-center text-xs text-slate-400 animate-pulse",
                            children: "Loading ERP context reference..."
                        }, void 0, false, {
                            fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                            lineNumber: 52,
                            columnNumber: 15
                        }, this) : erpDetail ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-2 animate-in fade-in duration-100",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[9px] font-bold text-blue-600 uppercase tracking-widest block",
                                    children: "Context Reference"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                    lineNumber: 57,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-bold text-slate-800 text-xs",
                                    children: [
                                        "[",
                                        activeConversation?.entityType,
                                        "] ",
                                        erpDetail.entityName || erpDetail.title || "Linked Discussion"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                    lineNumber: 60,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] text-slate-500 font-medium",
                                    children: [
                                        "Entity ID: #",
                                        activeConversation?.entityId
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                    lineNumber: 63,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] text-slate-400 mt-1 italic leading-relaxed",
                                    children: "All messages in this channel are linked polymorphic entries associated with this active ERP document context."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                    lineNumber: 66,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                            lineNumber: 56,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 text-center text-xs text-slate-400",
                            children: "No active ERP document linked to this conversation channel."
                        }, void 0, false, {
                            fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                            lineNumber: 71,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                        lineNumber: 50,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                lineNumber: 39,
                columnNumber: 9
            }, this),
            rightPanelTab === "PINNED_MESSAGES" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full md:w-[360px] h-full flex flex-col text-slate-700",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-bold text-slate-900 text-xs flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pin$3e$__["Pin"], {
                                        className: "h-4 w-4 text-blue-500 rotate-45"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                        lineNumber: 84,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Pinned Messages"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                        lineNumber: 85,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                lineNumber: 83,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "p-1 hover:bg-slate-200 rounded cursor-pointer",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-4 w-4 text-slate-500"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                    lineNumber: 88,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                lineNumber: 87,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                        lineNumber: 82,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFBFD]",
                        children: loadingPinned ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 text-center text-xs text-slate-400 animate-pulse",
                            children: "Loading pinned messages..."
                        }, void 0, false, {
                            fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                            lineNumber: 94,
                            columnNumber: 15
                        }, this) : pinnedMessages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-2xl",
                                    children: "📌"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                    lineNumber: 99,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "No pinned messages in this chat."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                    lineNumber: 100,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                            lineNumber: 98,
                            columnNumber: 15
                        }, this) : pinnedMessages.map((pin)=>{
                            const m = pin.message;
                            if (!m) return null;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 bg-white border border-slate-200/80 rounded-xl shadow-xs flex flex-col gap-1.5 hover:border-slate-300 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[11px] font-bold text-slate-800",
                                                children: m.sender?.name || "Unknown"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                                lineNumber: 109,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[9px] text-slate-400",
                                                children: new Date(m.createdAt).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                                lineNumber: 112,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                        lineNumber: 108,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11.5px] text-slate-600 break-words leading-relaxed select-text",
                                        children: m.content
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                        lineNumber: 116,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-end pt-1 border-t border-slate-50",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>onUnpin(pin, m),
                                            className: "text-[9.5px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer bg-red-50 px-2 py-1 rounded-md hover:bg-red-100 transition-colors",
                                            children: "Unpin"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                            lineNumber: 120,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                        lineNumber: 119,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, pin.id, true, {
                                fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                lineNumber: 107,
                                columnNumber: 19
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                        lineNumber: 92,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                lineNumber: 81,
                columnNumber: 9
            }, this),
            rightPanelTab === "STARRED_MESSAGES" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full md:w-[360px] h-full flex flex-col text-slate-700",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-bold text-slate-900 text-xs flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                        className: "h-4 w-4 text-amber-500 fill-amber-500"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                        lineNumber: 140,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Starred Messages"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                        lineNumber: 141,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                lineNumber: 139,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "p-1 hover:bg-slate-200 rounded cursor-pointer",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-4 w-4 text-slate-500"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                    lineNumber: 144,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                lineNumber: 143,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                        lineNumber: 138,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFBFD]",
                        children: loadingStarred ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 text-center text-xs text-slate-400 animate-pulse",
                            children: "Loading starred messages..."
                        }, void 0, false, {
                            fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                            lineNumber: 150,
                            columnNumber: 15
                        }, this) : starredMessages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-2xl",
                                    children: "⭐"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                    lineNumber: 155,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "No starred messages."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                    lineNumber: 156,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                            lineNumber: 154,
                            columnNumber: 15
                        }, this) : starredMessages.map((m)=>{
                            if (!m) return null;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 bg-white border border-slate-200/80 rounded-xl shadow-xs flex flex-col gap-1.5 hover:border-slate-300 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[11px] font-bold text-slate-800",
                                                children: m.sender?.name || "Unknown"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                                lineNumber: 164,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[9px] text-slate-400",
                                                children: new Date(m.createdAt).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                                lineNumber: 167,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                        lineNumber: 163,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11.5px] text-slate-600 break-words leading-relaxed select-text",
                                        children: m.content
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                        lineNumber: 171,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center pt-1 border-t border-slate-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[8px] font-medium text-slate-400 uppercase tracking-wider",
                                                children: [
                                                    "In: ",
                                                    m.conversation?.name || "Chat"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                                lineNumber: 175,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>onUnstar(m),
                                                className: "text-[9.5px] font-bold text-slate-500 hover:text-red-650 flex items-center gap-1 cursor-pointer bg-slate-50 hover:bg-red-50 px-2 py-1 rounded-md transition-colors",
                                                children: "Unstar"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                                lineNumber: 178,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                        lineNumber: 174,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, m.id, true, {
                                fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                                lineNumber: 162,
                                columnNumber: 19
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                        lineNumber: 148,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                lineNumber: 137,
                columnNumber: 9
            }, this),
            rightPanelTab === "SETTINGS" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Common$2f$ErrorBoundary$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: "Settings Panel Error",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Admin$2f$AdminSettingsPanel$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    companyId: companyId,
                    onClose: onClose
                }, void 0, false, {
                    fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                    lineNumber: 196,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                lineNumber: 195,
                columnNumber: 9
            }, this),
            rightPanelTab === "GROUP_SETTINGS" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Common$2f$ErrorBoundary$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: "Group Settings Panel Error",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Admin$2f$GroupSettingsPanel$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    conversation: activeConversation,
                    currentUser: user,
                    onClose: onClose,
                    onUpdateConversation: onUpdateConversation
                }, void 0, false, {
                    fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                    lineNumber: 206,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
                lineNumber: 205,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(crm)/chat/ChatRightPanel.jsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c = ChatRightPanel;
var _c;
__turbopack_context__.k.register(_c, "ChatRightPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(crm)/chat/ChatSidebar.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Sidebar$2f$ConversationList$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/components/Sidebar/ConversationList.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Common$2f$ErrorBoundary$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/components/Common/ErrorBoundary.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Common$2f$SkeletonLoading$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/components/Common/SkeletonLoading.jsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
function ChatSidebar({ showSidebarMobile, searchQuery, setSearchQuery, filterType, setFilterType, onCreateClick, conversations, isLoadingConversations, user, presenceMap }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: `w-[280px] flex-shrink-0 flex flex-col bg-[#F7F8FA] text-slate-700 border-r border-slate-200/60 h-full overflow-hidden transition-all duration-200
        ${showSidebarMobile ? "flex w-full md:w-[295px]" : "hidden md:flex"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-[56px] px-3.5 border-b border-slate-200/70 flex items-center justify-between select-none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-8 w-8 rounded-lg bg-[#3B82F6] flex items-center justify-center text-white text-xs font-extrabold tracking-tight shadow-sm",
                                children: "AG"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                                lineNumber: 29,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "font-bold text-slate-900 text-[13.5px] leading-none",
                                        children: "Agricom CRM"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                                        lineNumber: 33,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[9.5px] text-slate-400 font-semibold uppercase tracking-wider",
                                        children: "Enterprise Hub"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                                        lineNumber: 34,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                                lineNumber: 32,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onCreateClick,
                        className: "p-1.5 hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer",
                        title: "Create Channel or Group",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "h-3.5 w-3.5"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 py-2 border-b border-slate-200/60",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                            className: "absolute left-2.5 top-[7px] h-3 w-3 text-slate-400"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "sidebar-search",
                            type: "text",
                            placeholder: "Search...",
                            value: searchQuery,
                            onChange: (e)=>setSearchQuery(e.target.value),
                            className: "w-full pl-7 pr-3 py-1.5 bg-white border border-slate-200/80 text-[12px] text-slate-800 placeholder-slate-400 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 transition-all"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                            lineNumber: 50,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-1.5 pt-2 pb-1 flex gap-0.3 text-[10px] font-bold border-r border-slate-200/60 border-l border-slate-200 border-b border-slate-200 text-slate-500 select-none overflow-x-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setFilterType("ALL"),
                        className: `px-2.5 py-1 rounded-full cursor-pointer transition-colors shrink-0 ${filterType === "ALL" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-200/60"}`,
                        children: "All"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setFilterType("GROUPS"),
                        className: `px-2.5 py-1 rounded-full cursor-pointer transition-colors shrink-0 ${filterType === "GROUPS" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-200/60"}`,
                        children: "Groups"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setFilterType("CHANNELS"),
                        className: `px-2.5 py-1 rounded-full cursor-pointer transition-colors shrink-0 ${filterType === "CHANNELS" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-200/60"}`,
                        children: "Channels"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setFilterType("DMS"),
                        className: `px-2.5 py-1 rounded-full cursor-pointer transition-colors shrink-0 ${filterType === "DMS" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-200/60"}`,
                        children: "DMs"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setFilterType("ARCHIVED"),
                        className: `px-2.5 py-1 rounded-full cursor-pointer transition-colors shrink-0 ${filterType === "ARCHIVED" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-200/60"}`,
                        children: "Archived"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto p-2",
                children: isLoadingConversations ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Common$2f$SkeletonLoading$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarSkeleton"], {}, void 0, false, {
                    fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                    lineNumber: 73,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Common$2f$ErrorBoundary$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    title: "Sidebar List Error",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Sidebar$2f$ConversationList$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        conversations: conversations,
                        filterType: filterType,
                        searchQuery: searchQuery,
                        currentUser: user,
                        presenceMap: presenceMap
                    }, void 0, false, {
                        fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                        lineNumber: 76,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                    lineNumber: 75,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3.5 py-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 select-none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "h-1.5 w-1.5 rounded-full bg-emerald-500"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: "Connected"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "v1.2.0"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
                lineNumber: 87,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(crm)/chat/ChatSidebar.jsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_c = ChatSidebar;
var _c;
__turbopack_context__.k.register(_c, "ChatSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(crm)/chat/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$chat$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/chat.api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/socket.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$authSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/slices/authSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$companyContextSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/slices/companyContextSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/constants/query-keys.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$queries$2f$chat$2e$queries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/queries/chat.queries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/mutations/chat.mutations.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/store/chatSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$utils$2f$getConversationDisplay$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/utils/getConversationDisplay.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/usePermissions.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Common$2f$CreateConversationModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/components/Common/CreateConversationModal.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$utils$2f$channelPosting$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/utils/channelPosting.js [app-client] (ecmascript)");
// Sub-components (same chat folder)
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$crm$292f$chat$2f$ChatSidebar$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(crm)/chat/ChatSidebar.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$crm$292f$chat$2f$ChatMainPanel$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(crm)/chat/ChatMainPanel.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$crm$292f$chat$2f$ChatRightPanel$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/(crm)/chat/ChatRightPanel.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function ChatPage() {
    _s();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"])();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    // Selectors
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$authSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectUser"]);
    const companyId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$companyContextSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectActiveCompanyId"]);
    const activeConversationId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectActiveConversationId"]);
    const activeThreadId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectActiveThreadId"]);
    const rightPanelTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectRightPanelTab"]);
    const socketStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectSocketStatus"]);
    const optimisticQueue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectOptimisticQueue"]);
    const uploadQueue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectUploadQueue"]);
    const composerDrafts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectComposerDrafts"]);
    // Local state
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [filterType, setFilterType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("ALL");
    const [composerInput, setComposerInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [employeeLookup, setEmployeeLookup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [presenceMap, setPresenceMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [typingUsersMap, setTypingUsersMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const employeeLookupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(employeeLookup);
    const typingTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const activeUploadControllers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const [showSidebarMobile, setShowSidebarMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [editingMessage, setEditingMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [replyingToMessage, setReplyingToMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pinnedMessages, setPinnedMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingPinned, setLoadingPinned] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [starredMessages, setStarredMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingStarred, setLoadingStarred] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showCreateModal, setShowCreateModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [erpDetail, setErpDetail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loadingErp, setLoadingErp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Sticky pinned banner — latest pinned message for the active conversation
    const [activePinnedMessage, setActivePinnedMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Sync mobile view on active chat changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            if (activeConversationId) {
                setShowSidebarMobile(false);
            } else {
                setShowSidebarMobile(true);
            }
        }
    }["ChatPage.useEffect"], [
        activeConversationId
    ]);
    // Clean up composer input, editing state, replying state, and right panel tab on conversation switch/deletion
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            setComposerInput("");
            setEditingMessage(null);
            setReplyingToMessage(null);
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setRightPanelTab"])(null));
        }
    }["ChatPage.useEffect"], [
        activeConversationId,
        dispatch
    ]);
    // Abort active uploads and typing timeouts on conversation switch/unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            return ({
                "ChatPage.useEffect": ()=>{
                    activeUploadControllers.current.forEach({
                        "ChatPage.useEffect": (controller)=>{
                            controller.abort();
                        }
                    }["ChatPage.useEffect"]);
                    activeUploadControllers.current.clear();
                    if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                    }
                }
            })["ChatPage.useEffect"];
        }
    }["ChatPage.useEffect"], [
        activeConversationId
    ]);
    // ESC keypress listener
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            const handleKeyDown = {
                "ChatPage.useEffect.handleKeyDown": (e)=>{
                    if (e.key === "Escape") {
                        setEditingMessage(null);
                        setReplyingToMessage(null);
                        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setRightPanelTab"])(null));
                    }
                }
            }["ChatPage.useEffect.handleKeyDown"];
            window.addEventListener("keydown", handleKeyDown);
            return ({
                "ChatPage.useEffect": ()=>window.removeEventListener("keydown", handleKeyDown)
            })["ChatPage.useEffect"];
        }
    }["ChatPage.useEffect"], [
        dispatch
    ]);
    // ── Fetch pinned banner message whenever the active conversation changes ──
    // (separate from the right-panel pins list which loads on panel open)
    const fetchActivePinned = async (convId)=>{
        if (!convId) {
            setActivePinnedMessage(null);
            return;
        }
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$chat$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatAPI"].getPinnedMessages(convId);
            const pins = res || [];
            // Show the most recently pinned message (last in array)
            setActivePinnedMessage(pins.length > 0 ? pins[pins.length - 1] : null);
        } catch (err) {
            console.error("Failed to fetch active pinned message", err);
            setActivePinnedMessage(null);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            fetchActivePinned(activeConversationId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["ChatPage.useEffect"], [
        activeConversationId
    ]);
    // Fetch pinned messages when Pinned tab opens (right panel)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            if (rightPanelTab !== "PINNED_MESSAGES" || !activeConversationId) {
                setPinnedMessages([]);
                return;
            }
            const loadPins = {
                "ChatPage.useEffect.loadPins": async ()=>{
                    setLoadingPinned(true);
                    try {
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$chat$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatAPI"].getPinnedMessages(activeConversationId);
                        setPinnedMessages(res || []);
                    } catch (err) {
                        console.error("Failed to load pinned messages", err);
                    } finally{
                        setLoadingPinned(false);
                    }
                }
            }["ChatPage.useEffect.loadPins"];
            loadPins();
        }
    }["ChatPage.useEffect"], [
        rightPanelTab,
        activeConversationId
    ]);
    // Fetch starred messages when Starred tab opens
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            if (rightPanelTab !== "STARRED_MESSAGES") {
                setStarredMessages([]);
                return;
            }
            const loadStars = {
                "ChatPage.useEffect.loadStars": async ()=>{
                    setLoadingStarred(true);
                    try {
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$chat$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatAPI"].getStarredMessages();
                        setStarredMessages(res || []);
                    } catch (err) {
                        console.error("Failed to load starred messages", err);
                    } finally{
                        setLoadingStarred(false);
                    }
                }
            }["ChatPage.useEffect.loadStars"];
            loadStars();
        }
    }["ChatPage.useEffect"], [
        rightPanelTab
    ]);
    // Check permissions
    const { hasPermission, checkChannelPostPermission } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])();
    const canReadEmployees = hasPermission("employees:read");
    const canReadDepartments = hasPermission("departments:read");
    const canReadDesignations = hasPermission("designations:read");
    // Load employee details lookup
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            const fetchLookup = {
                "ChatPage.useEffect.fetchLookup": async ()=>{
                    if (!canReadEmployees) {
                        try {
                            const assignableRes = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/v1/tasks/employees/assignable");
                            const assignableList = assignableRes.data?.data || [];
                            let depts = [];
                            let desigs = [];
                            if (canReadDepartments) {
                                try {
                                    const dRes = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/departments/options", {
                                        params: {
                                            limit: 250
                                        }
                                    });
                                    depts = dRes.data?.data || dRes.data || [];
                                } catch (e) {}
                            }
                            if (canReadDesignations) {
                                try {
                                    const dsRes = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/designations/options", {
                                        params: {
                                            limit: 250
                                        }
                                    });
                                    desigs = dsRes.data?.data || dsRes.data || [];
                                } catch (e) {}
                            }
                            const deptMap = Object.fromEntries(depts.map({
                                "ChatPage.useEffect.fetchLookup.deptMap": (d)=>[
                                        d.value,
                                        d.label
                                    ]
                            }["ChatPage.useEffect.fetchLookup.deptMap"]));
                            const desigMap = Object.fromEntries(desigs.map({
                                "ChatPage.useEffect.fetchLookup.desigMap": (d)=>[
                                        d.value,
                                        d.label
                                    ]
                            }["ChatPage.useEffect.fetchLookup.desigMap"]));
                            const map = {};
                            assignableList.forEach({
                                "ChatPage.useEffect.fetchLookup": (emp)=>{
                                    if (emp.userId) {
                                        map[emp.userId] = {
                                            name: `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || emp.user?.name,
                                            department: deptMap[emp.departmentId] || "Staff",
                                            designation: desigMap[emp.designationId] || "Employee"
                                        };
                                    }
                                }
                            }["ChatPage.useEffect.fetchLookup"]);
                            setEmployeeLookup(map);
                        } catch (e) {
                            console.error("Fallback lookup failed", e);
                        }
                        return;
                    }
                    try {
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/employees", {
                            params: {
                                limit: 500
                            }
                        });
                        const list = res.data?.data || res.data || [];
                        const map = {};
                        list.forEach({
                            "ChatPage.useEffect.fetchLookup": (emp)=>{
                                if (emp.userId) {
                                    map[emp.userId] = {
                                        name: `${emp.firstName || ""} ${emp.lastName || ""}`.trim(),
                                        department: emp.department?.name || "Staff",
                                        designation: emp.designation?.name || "Employee"
                                    };
                                }
                            }
                        }["ChatPage.useEffect.fetchLookup"]);
                        setEmployeeLookup(map);
                    } catch (err) {
                        console.warn("Lookup build failed, trying assignable fallback...", err);
                        try {
                            const assignableRes = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/v1/tasks/employees/assignable");
                            const assignableList = assignableRes.data?.data || [];
                            let depts = [];
                            let desigs = [];
                            if (canReadDepartments) {
                                try {
                                    const dRes = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/departments/options", {
                                        params: {
                                            limit: 250
                                        }
                                    });
                                    depts = dRes.data?.data || dRes.data || [];
                                } catch (e) {}
                            }
                            if (canReadDesignations) {
                                try {
                                    const dsRes = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/designations/options", {
                                        params: {
                                            limit: 250
                                        }
                                    });
                                    desigs = dsRes.data?.data || dsRes.data || [];
                                } catch (e) {}
                            }
                            const deptMap = Object.fromEntries(depts.map({
                                "ChatPage.useEffect.fetchLookup.deptMap": (d)=>[
                                        d.value,
                                        d.label
                                    ]
                            }["ChatPage.useEffect.fetchLookup.deptMap"]));
                            const desigMap = Object.fromEntries(desigs.map({
                                "ChatPage.useEffect.fetchLookup.desigMap": (d)=>[
                                        d.value,
                                        d.label
                                    ]
                            }["ChatPage.useEffect.fetchLookup.desigMap"]));
                            const map = {};
                            assignableList.forEach({
                                "ChatPage.useEffect.fetchLookup": (emp)=>{
                                    if (emp.userId) {
                                        map[emp.userId] = {
                                            name: `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || emp.user?.name,
                                            department: deptMap[emp.departmentId] || "Staff",
                                            designation: desigMap[emp.designationId] || "Employee"
                                        };
                                    }
                                }
                            }["ChatPage.useEffect.fetchLookup"]);
                            setEmployeeLookup(map);
                        } catch (e) {
                            console.error("Fallback lookup failed", e);
                        }
                    }
                }
            }["ChatPage.useEffect.fetchLookup"];
            fetchLookup();
        }
    }["ChatPage.useEffect"], [
        canReadEmployees,
        canReadDepartments,
        canReadDesignations
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            employeeLookupRef.current = employeeLookup;
        }
    }["ChatPage.useEffect"], [
        employeeLookup
    ]);
    const activeConversationIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(activeConversationId);
    const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(user);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            activeConversationIdRef.current = activeConversationId;
        }
    }["ChatPage.useEffect"], [
        activeConversationId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            userRef.current = user;
        }
    }["ChatPage.useEffect"], [
        user
    ]);
    // Real-time socket event listeners
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            const handleMessageCreated = {
                "ChatPage.useEffect.handleMessageCreated": (payload)=>{
                    if (payload?.conversationId) {
                        queryClient.invalidateQueries({
                            queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].messages(payload.conversationId)
                        });
                        const currentUserId = userRef.current?.id || userRef.current?.userId;
                        const msgSenderId = payload.message?.senderId || payload.message?.sender?.id;
                        const isFromOther = Number(msgSenderId) !== Number(currentUserId);
                        const isActiveConv = Number(activeConversationIdRef.current) === Number(payload.conversationId);
                        if (isActiveConv && isFromOther && payload.message?.id) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$chat$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatAPI"].markRead(payload.conversationId, payload.message.id).catch({
                                "ChatPage.useEffect.handleMessageCreated": ()=>{}
                            }["ChatPage.useEffect.handleMessageCreated"]);
                        }
                        queryClient.invalidateQueries({
                            queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].conversations()
                        });
                    }
                }
            }["ChatPage.useEffect.handleMessageCreated"];
            const handleMessageUpdated = {
                "ChatPage.useEffect.handleMessageUpdated": (payload)=>{
                    if (payload?.conversationId) {
                        queryClient.invalidateQueries({
                            queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].messages(payload.conversationId)
                        });
                    }
                }
            }["ChatPage.useEffect.handleMessageUpdated"];
            const handleMessageDeleted = {
                "ChatPage.useEffect.handleMessageDeleted": (payload)=>{
                    if (payload?.conversationId) {
                        queryClient.invalidateQueries({
                            queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].messages(payload.conversationId)
                        });
                        queryClient.invalidateQueries({
                            queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].conversations()
                        });
                    }
                }
            }["ChatPage.useEffect.handleMessageDeleted"];
            const handleMessagePinned = {
                "ChatPage.useEffect.handleMessagePinned": (payload)=>{
                    if (payload?.conversationId) {
                        queryClient.invalidateQueries({
                            queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].messages(payload.conversationId)
                        });
                    }
                }
            }["ChatPage.useEffect.handleMessagePinned"];
            const handlePresenceChanged = {
                "ChatPage.useEffect.handlePresenceChanged": (payload)=>{
                    if (payload?.userId) {
                        setPresenceMap({
                            "ChatPage.useEffect.handlePresenceChanged": (prev)=>({
                                    ...prev,
                                    [payload.userId]: {
                                        status: payload.status,
                                        lastSeen: payload.lastSeen
                                    }
                                })
                        }["ChatPage.useEffect.handlePresenceChanged"]);
                    }
                }
            }["ChatPage.useEffect.handlePresenceChanged"];
            const handleTyping = {
                "ChatPage.useEffect.handleTyping": (payload)=>{
                    const { conversationId, userId, isTyping } = payload;
                    if (!conversationId || !userId) return;
                    setTypingUsersMap({
                        "ChatPage.useEffect.handleTyping": (prev)=>{
                            const list = prev[conversationId] || [];
                            let newList = [
                                ...list
                            ];
                            if (isTyping) {
                                if (!newList.some({
                                    "ChatPage.useEffect.handleTyping": (u)=>u.userId === userId
                                }["ChatPage.useEffect.handleTyping"])) {
                                    const emp = employeeLookupRef.current[userId] || {};
                                    newList.push({
                                        userId,
                                        name: emp.name || "Someone"
                                    });
                                }
                            } else {
                                newList = newList.filter({
                                    "ChatPage.useEffect.handleTyping": (u)=>u.userId !== userId
                                }["ChatPage.useEffect.handleTyping"]);
                            }
                            Promise.resolve().then({
                                "ChatPage.useEffect.handleTyping": ()=>{
                                    dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setTypingUsers"])({
                                        conversationId,
                                        users: newList
                                    }));
                                }
                            }["ChatPage.useEffect.handleTyping"]);
                            return {
                                ...prev,
                                [conversationId]: newList
                            };
                        }
                    }["ChatPage.useEffect.handleTyping"]);
                }
            }["ChatPage.useEffect.handleTyping"];
            const handleConversationCreated = {
                "ChatPage.useEffect.handleConversationCreated": (payload)=>{
                    const newConv = payload?.conversation;
                    if (!newConv) return;
                    const currentUserId = userRef.current?.id || userRef.current?.userId;
                    const isMember = newConv.members?.some({
                        "ChatPage.useEffect.handleConversationCreated": (m)=>Number(m.userId) === Number(currentUserId)
                    }["ChatPage.useEffect.handleConversationCreated"]);
                    const isPublicChannel = newConv.type === "CHANNEL";
                    if (isMember || isPublicChannel) {
                        queryClient.invalidateQueries({
                            queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].conversations()
                        });
                    }
                }
            }["ChatPage.useEffect.handleConversationCreated"];
            const handleMemberAdded = {
                "ChatPage.useEffect.handleMemberAdded": (payload)=>{
                    const currentUserId = userRef.current?.id || userRef.current?.userId;
                    if (payload?.member?.userId && Number(payload.member.userId) === Number(currentUserId)) {
                        queryClient.invalidateQueries({
                            queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].conversations()
                        });
                    } else {
                        if (payload?.conversationId) {
                            queryClient.invalidateQueries({
                                queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].conversationDetail(Number(payload.conversationId))
                            });
                            queryClient.invalidateQueries({
                                queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].conversations()
                            });
                        }
                    }
                }
            }["ChatPage.useEffect.handleMemberAdded"];
            const handleMemberRemoved = {
                "ChatPage.useEffect.handleMemberRemoved": (payload)=>{
                    const currentUserId = userRef.current?.id || userRef.current?.userId;
                    if (payload?.userId && Number(payload.userId) === Number(currentUserId)) {
                        queryClient.invalidateQueries({
                            queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].conversations()
                        });
                        if (Number(activeConversationIdRef.current) === Number(payload.conversationId)) {
                            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setActiveConversationId"])(null));
                        }
                    } else {
                        if (payload?.conversationId) {
                            queryClient.invalidateQueries({
                                queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].conversationDetail(Number(payload.conversationId))
                            });
                            queryClient.invalidateQueries({
                                queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].conversations()
                            });
                        }
                    }
                }
            }["ChatPage.useEffect.handleMemberRemoved"];
            const handleMessageReacted = {
                "ChatPage.useEffect.handleMessageReacted": (payload)=>{
                    if (payload?.conversationId) {
                        queryClient.invalidateQueries({
                            queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].messages(payload.conversationId)
                        });
                    }
                }
            }["ChatPage.useEffect.handleMessageReacted"];
            const handleConversationUpdated = {
                "ChatPage.useEffect.handleConversationUpdated": (payload)=>{
                    if (payload?.conversationId) {
                        queryClient.invalidateQueries({
                            queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].conversations()
                        });
                        if (Number(activeConversationIdRef.current) === Number(payload.conversationId)) {
                            queryClient.invalidateQueries({
                                queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].conversationDetail(payload.conversationId)
                            });
                        }
                    }
                }
            }["ChatPage.useEffect.handleConversationUpdated"];
            const handleConversationArchived = {
                "ChatPage.useEffect.handleConversationArchived": (payload)=>{
                    if (payload?.conversationId) {
                        queryClient.invalidateQueries({
                            queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].conversations()
                        });
                        if (Number(activeConversationIdRef.current) === Number(payload.conversationId)) {
                            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setActiveConversationId"])(null));
                        }
                    }
                }
            }["ChatPage.useEffect.handleConversationArchived"];
            const handleConversationVisibilityChanged = {
                "ChatPage.useEffect.handleConversationVisibilityChanged": (payload)=>{
                    queryClient.invalidateQueries({
                        queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].conversations()
                    });
                }
            }["ChatPage.useEffect.handleConversationVisibilityChanged"];
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToSocketEvent"])("message_created", handleMessageCreated);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToSocketEvent"])("message_updated", handleMessageUpdated);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToSocketEvent"])("message_deleted", handleMessageDeleted);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToSocketEvent"])("message_reacted", handleMessageReacted);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToSocketEvent"])("message_pinned", handleMessagePinned);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToSocketEvent"])("presence_changed", handlePresenceChanged);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToSocketEvent"])("typing", handleTyping);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToSocketEvent"])("conversation_created", handleConversationCreated);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToSocketEvent"])("member_added", handleMemberAdded);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToSocketEvent"])("member_removed", handleMemberRemoved);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToSocketEvent"])("conversation_updated", handleConversationUpdated);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToSocketEvent"])("conversation_archived", handleConversationArchived);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToSocketEvent"])("CONVERSATION_VISIBILITY_CHANGED", handleConversationVisibilityChanged);
            return ({
                "ChatPage.useEffect": ()=>{
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unsubscribeFromSocketEvent"])("message_created", handleMessageCreated);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unsubscribeFromSocketEvent"])("message_updated", handleMessageUpdated);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unsubscribeFromSocketEvent"])("message_deleted", handleMessageDeleted);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unsubscribeFromSocketEvent"])("message_reacted", handleMessageReacted);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unsubscribeFromSocketEvent"])("message_pinned", handleMessagePinned);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unsubscribeFromSocketEvent"])("presence_changed", handlePresenceChanged);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unsubscribeFromSocketEvent"])("typing", handleTyping);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unsubscribeFromSocketEvent"])("conversation_created", handleConversationCreated);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unsubscribeFromSocketEvent"])("member_added", handleMemberAdded);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unsubscribeFromSocketEvent"])("member_removed", handleMemberRemoved);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unsubscribeFromSocketEvent"])("conversation_updated", handleConversationUpdated);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unsubscribeFromSocketEvent"])("conversation_archived", handleConversationArchived);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unsubscribeFromSocketEvent"])("CONVERSATION_VISIBILITY_CHANGED", handleConversationVisibilityChanged);
                }
            })["ChatPage.useEffect"];
        }
    }["ChatPage.useEffect"], [
        dispatch,
        queryClient
    ]);
    // Queries
    const showArchived = filterType === "ARCHIVED";
    const { data: conversationsData, isLoading: isLoadingConversations } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$queries$2f$chat$2e$queries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConversationsQuery"])({
        companyId,
        archived: showArchived
    });
    const conversations = conversationsData?.data || [];
    const { data: activeConvDetail, error: activeConvError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$queries$2f$chat$2e$queries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConversationDetailQuery"])(activeConversationId);
    const activeConversation = activeConvDetail?.data || activeConvDetail || conversations.find((c)=>c.id === activeConversationId);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            if (activeConvError && (activeConvError.response?.status === 403 || activeConvError.status === 403)) {
                dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setActiveConversationId"])(null));
                queryClient.removeQueries({
                    queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].conversationDetail(Number(activeConversationId))
                });
            }
        }
    }["ChatPage.useEffect"], [
        activeConvError,
        activeConversationId,
        dispatch,
        queryClient
    ]);
    // Channel posting permission
    const canPost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ChatPage.useMemo[canPost]": ()=>{
            return checkChannelPostPermission(activeConversation);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["ChatPage.useMemo[canPost]"], [
        activeConversation,
        user
    ]);
    // Subscribe to socket room
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            const socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSocketInstance"])();
            if (!socket || !activeConversationId) return;
            socket.emit("subscribe", {
                conversationId: activeConversationId
            });
            if (activeConversation?.members?.length) {
                const memberUserIds = activeConversation.members.map({
                    "ChatPage.useEffect.memberUserIds": (m)=>m.user?.id || m.userId
                }["ChatPage.useEffect.memberUserIds"]).filter(Boolean);
                if (memberUserIds.length) {
                    socket.emit("get_presence", {
                        userIds: memberUserIds
                    }, {
                        "ChatPage.useEffect": (response)=>{
                            if (response?.status === "SUCCESS" && response.data) {
                                setPresenceMap({
                                    "ChatPage.useEffect": (prev)=>{
                                        const updated = {
                                            ...prev
                                        };
                                        Object.entries(response.data).forEach({
                                            "ChatPage.useEffect": ([uid, presenceData])=>{
                                                updated[Number(uid)] = presenceData;
                                            }
                                        }["ChatPage.useEffect"]);
                                        return updated;
                                    }
                                }["ChatPage.useEffect"]);
                            }
                        }
                    }["ChatPage.useEffect"]);
                }
            }
            return ({
                "ChatPage.useEffect": ()=>{
                    socket.emit("unsubscribe", {
                        conversationId: activeConversationId
                    });
                }
            })["ChatPage.useEffect"];
        }
    }["ChatPage.useEffect"], [
        activeConversationId,
        activeConversation
    ]);
    // ERP context
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            if (rightPanelTab !== "INFO" || !activeConversation?.entityType || !activeConversation?.entityId) {
                setErpDetail(null);
                return;
            }
            const loadErp = {
                "ChatPage.useEffect.loadErp": async ()=>{
                    setLoadingErp(true);
                    try {
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$chat$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatAPI"].getErpDiscussionByContext(activeConversation.entityType, activeConversation.entityId);
                        setErpDetail(res.data || res);
                    } catch (err) {
                        console.error("Failed to load ERP context detail", err);
                    } finally{
                        setLoadingErp(false);
                    }
                }
            }["ChatPage.useEffect.loadErp"];
            loadErp();
        }
    }["ChatPage.useEffect"], [
        rightPanelTab,
        activeConversation?.entityType,
        activeConversation?.entityId
    ]);
    const { data: messagesData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: isLoadingMessages } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$queries$2f$chat$2e$queries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMessagesQuery"])(activeConversationId);
    const messagesList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ChatPage.useMemo[messagesList]": ()=>{
            if (!messagesData) return [];
            return messagesData.pages.flatMap({
                "ChatPage.useMemo[messagesList]": (page)=>page.data || []
            }["ChatPage.useMemo[messagesList]"]);
        }
    }["ChatPage.useMemo[messagesList]"], [
        messagesData
    ]);
    // Auto-mark conversation as read when opened or when messages update while active
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            if (!activeConversationId) return;
            const lastMsg = messagesList.length > 0 ? messagesList[messagesList.length - 1] : activeConversation?.lastMessage;
            const lastMsgId = lastMsg?.id;
            if (lastMsgId) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$chat$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatAPI"].markRead(activeConversationId, lastMsgId).then({
                    "ChatPage.useEffect": ()=>{
                        queryClient.setQueriesData({
                            queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].conversations()
                        }, {
                            "ChatPage.useEffect": (oldData)=>{
                                if (!oldData?.data) return oldData;
                                return {
                                    ...oldData,
                                    data: oldData.data.map({
                                        "ChatPage.useEffect": (c)=>{
                                            if (c.id === activeConversationId) {
                                                return {
                                                    ...c,
                                                    unreadCount: 0,
                                                    members: c.members?.map({
                                                        "ChatPage.useEffect": (m)=>Number(m.userId) === Number(user?.id || user?.userId) ? {
                                                                ...m,
                                                                unreadMessagesCount: 0
                                                            } : m
                                                    }["ChatPage.useEffect"])
                                                };
                                            }
                                            return c;
                                        }
                                    }["ChatPage.useEffect"])
                                };
                            }
                        }["ChatPage.useEffect"]);
                    }
                }["ChatPage.useEffect"]).catch({
                    "ChatPage.useEffect": ()=>{}
                }["ChatPage.useEffect"]);
            }
        }
    }["ChatPage.useEffect"], [
        activeConversationId,
        messagesList,
        activeConversation?.lastMessage?.id,
        queryClient,
        user
    ]);
    const mergedMessagesList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ChatPage.useMemo[mergedMessagesList]": ()=>{
            const dbMessages = messagesList;
            if (!activeConversationId) return dbMessages;
            const activeOptimistic = Object.entries(optimisticQueue).filter({
                "ChatPage.useMemo[mergedMessagesList].activeOptimistic": ([_, item])=>item.conversationId === activeConversationId
            }["ChatPage.useMemo[mergedMessagesList].activeOptimistic"]).map({
                "ChatPage.useMemo[mergedMessagesList].activeOptimistic": ([clientMessageId, item])=>({
                        id: clientMessageId,
                        clientMessageId,
                        conversationId: item.conversationId,
                        senderId: user?.id || user?.userId,
                        sender: {
                            id: user?.id || user?.userId,
                            name: user?.name || "Me",
                            avatarUrl: user?.avatarUrl
                        },
                        content: item.content,
                        type: "TEXT",
                        createdAt: item.createdAt || new Date().toISOString(),
                        status: item.status || "PENDING",
                        isOptimistic: true,
                        parentId: item.parentId || null,
                        parentMessage: item.parentMessage || null
                    })
            }["ChatPage.useMemo[mergedMessagesList].activeOptimistic"]);
            if (activeOptimistic.length === 0) return dbMessages;
            const filteredOptimistic = activeOptimistic.filter({
                "ChatPage.useMemo[mergedMessagesList].filteredOptimistic": (opt)=>{
                    const isDuplicate = dbMessages.some({
                        "ChatPage.useMemo[mergedMessagesList].filteredOptimistic.isDuplicate": (dbMsg)=>{
                            if (dbMsg.content !== opt.content) return false;
                            const dbSenderId = dbMsg.senderId || dbMsg.sender?.id;
                            const optSenderId = opt.senderId;
                            if (Number(dbSenderId) !== Number(optSenderId)) return false;
                            const dbTime = new Date(dbMsg.createdAt).getTime();
                            const optTime = new Date(opt.createdAt).getTime();
                            return Math.abs(dbTime - optTime) < 15000;
                        }
                    }["ChatPage.useMemo[mergedMessagesList].filteredOptimistic.isDuplicate"]);
                    return !isDuplicate;
                }
            }["ChatPage.useMemo[mergedMessagesList].filteredOptimistic"]);
            return [
                ...dbMessages,
                ...filteredOptimistic
            ];
        }
    }["ChatPage.useMemo[mergedMessagesList]"], [
        messagesList,
        optimisticQueue,
        activeConversationId,
        user
    ]);
    const activeDetails = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ChatPage.useMemo[activeDetails]": ()=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$utils$2f$getConversationDisplay$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConversationDisplay"])(activeConversation, user, presenceMap, typingUsersMap);
        }
    }["ChatPage.useMemo[activeDetails]"], [
        activeConversation,
        user,
        presenceMap,
        typingUsersMap
    ]);
    const headerSubtitle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ChatPage.useMemo[headerSubtitle]": ()=>{
            if (!activeConversation) return "";
            if (activeConversation.type === "DIRECT") {
                return activeDetails?.presence === "ONLINE" ? "Online" : activeDetails?.presence === "AWAY" ? "Away" : activeDetails?.presence === "BUSY" ? "Busy" : activeDetails?.lastSeenText || "Offline";
            } else {
                const membersList = activeConversation.members || [];
                const totalCount = membersList.length;
                const onlineCount = membersList.filter({
                    "ChatPage.useMemo[headerSubtitle]": (m)=>{
                        const mUserId = m.userId || m.user?.id;
                        const presenceObj = presenceMap[mUserId];
                        if (presenceObj?.status) {
                            return [
                                "ONLINE",
                                "AWAY",
                                "BUSY"
                            ].includes(presenceObj.status.toUpperCase());
                        }
                        return m.user?.presence && [
                            "ONLINE",
                            "AWAY",
                            "BUSY"
                        ].includes(m.user.presence.toUpperCase());
                    }
                }["ChatPage.useMemo[headerSubtitle]"]).length;
                const parts = [];
                if (totalCount > 0) parts.push(`${totalCount} ${totalCount === 1 ? "member" : "members"}`);
                if (onlineCount > 0) parts.push(`${onlineCount} online`);
                const channelSuffix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$utils$2f$channelPosting$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChannelHeaderSuffix"])(activeConversation);
                if (channelSuffix) parts.push(channelSuffix);
                return parts.join(" • ") || activeDetails?.subtitle || "No description set";
            }
        }
    }["ChatPage.useMemo[headerSubtitle]"], [
        activeConversation,
        activeDetails,
        presenceMap
    ]);
    // Mutations
    const createConversationMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreateConversationMutation"])();
    const sendMessageMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSendMessageMutation"])();
    const editMessageMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEditMessageMutation"])();
    const deleteMessageMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeleteMessageMutation"])();
    const reactMessageMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReactMessageMutation"])();
    const pinMessageMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePinMessageMutation"])();
    const unpinMessageMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnpinMessageMutation"])();
    const starMessageMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStarMessageMutation"])();
    const unstarMessageMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnstarMessageMutation"])();
    // ── HANDLERS ──
    const handleSend = async (textToSend)=>{
        if (!textToSend.trim() || !activeConversationId) return;
        if (editingMessage) {
            try {
                await editMessageMutation.mutateAsync({
                    conversationId: activeConversationId,
                    messageId: editingMessage.id,
                    content: textToSend
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Message updated.");
                setEditingMessage(null);
                setComposerInput("");
            } catch (err) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to edit message.");
            }
            return;
        }
        const clientMsgId = `client-${Date.now()}`;
        const currentReplyingTo = replyingToMessage;
        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addToOptimisticQueue"])({
            clientMessageId: clientMsgId,
            conversationId: activeConversationId,
            content: textToSend,
            parentId: currentReplyingTo?.id || null,
            parentMessage: currentReplyingTo || null
        }));
        setReplyingToMessage(null);
        try {
            await sendMessageMutation.mutateAsync({
                conversationId: activeConversationId,
                dto: {
                    content: textToSend,
                    type: "TEXT",
                    parentId: currentReplyingTo?.id || undefined
                }
            });
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeFromOptimisticQueue"])(clientMsgId));
        } catch (err) {
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setOptimisticStatus"])({
                clientMessageId: clientMsgId,
                status: "FAILED",
                error: err.message
            }));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to send message.");
        }
    };
    const handleFileUpload = async (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        const fileId = `file-${Date.now()}`;
        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addToUploadQueue"])({
            fileId,
            fileName: file.name
        }));
        const formData = new FormData();
        formData.append("file", file);
        const controller = new AbortController();
        activeUploadControllers.current.set(fileId, controller);
        try {
            const activeCompanyId = companyId || 1;
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/attachments/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "x-company-id": activeCompanyId
                },
                onUploadProgress: (progressEvent)=>{
                    const progress = Math.round(progressEvent.loaded * 100 / (progressEvent.total || 1));
                    dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateUploadProgress"])({
                        fileId,
                        progress
                    }));
                },
                signal: controller.signal
            });
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setUploadStatus"])({
                fileId,
                status: "SUCCESS"
            }));
            let type = "FILE";
            if (file.type.startsWith("image/")) type = "IMAGE";
            else if (file.type.startsWith("video/")) type = "VIDEO";
            else if (file.type === "application/pdf") type = "PDF";
            else if (file.type.startsWith("audio/")) type = "AUDIO";
            await sendMessageMutation.mutateAsync({
                conversationId: activeConversationId,
                dto: {
                    content: file.name,
                    type,
                    payload: {
                        filePath: res.data.fileUrl,
                        fileName: file.name,
                        fileSize: file.size
                    }
                }
            });
            setTimeout(()=>dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeFromUploadQueue"])(fileId)), 1000);
        } catch (err) {
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isCancel(err)) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info("Upload cancelled.");
            } else {
                dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setUploadStatus"])({
                    fileId,
                    status: "FAILED"
                }));
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("File upload failed.");
            }
        } finally{
            activeUploadControllers.current.delete(fileId);
        }
    };
    const handleSendVoice = (audioBlob)=>{
        sendMessageMutation.mutate({
            conversationId: activeConversationId,
            dto: {
                content: "🎤 Voice Message",
                type: "VOICE"
            }
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Voice message sent.");
    };
    const handleComposerChange = (val)=>{
        setComposerInput(val);
        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setComposerDraft"])({
            conversationId: activeConversationId,
            draft: val
        }));
        const socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSocketInstance"])();
        if (socket && socket.connected && activeConversationId) {
            socket.emit("typing_start", {
                conversationId: activeConversationId
            });
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(()=>{
                socket.emit("typing_stop", {
                    conversationId: activeConversationId
                });
            }, 3000);
        }
    };
    const handleComposerSubmit = ()=>{
        const socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSocketInstance"])();
        if (socket && socket.connected && activeConversationId) {
            socket.emit("typing_stop", {
                conversationId: activeConversationId
            });
        }
    };
    const handleTogglePanel = (tab)=>{
        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setRightPanelTab"])(rightPanelTab === tab ? null : tab));
    };
    const handlePin = (messageId)=>{
        pinMessageMutation.mutate({
            conversationId: activeConversationId,
            messageId
        }, {
            onSuccess: ()=>{
                // Re-fetch so banner updates immediately after pinning
                fetchActivePinned(activeConversationId);
                // Also refresh right panel if open
                if (rightPanelTab === "PINNED_MESSAGES") {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$chat$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatAPI"].getPinnedMessages(activeConversationId).then((res)=>setPinnedMessages(res || [])).catch(()=>{});
                }
            }
        });
    };
    const handleUnpin = async (pin, m)=>{
        try {
            await unpinMessageMutation.mutateAsync({
                conversationId: activeConversationId,
                messageId: m.id
            });
            setPinnedMessages((prev)=>prev.filter((p)=>p.id !== pin.id));
            // Update banner
            await fetchActivePinned(activeConversationId);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Message unpinned.");
            queryClient.invalidateQueries({
                queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].messages(activeConversationId)
            });
        } catch (e) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to unpin message.");
        }
    };
    // Unpin directly from banner (no pin object, just messageId)
    const handleBannerUnpin = async (messageId)=>{
        try {
            await unpinMessageMutation.mutateAsync({
                conversationId: activeConversationId,
                messageId
            });
            setPinnedMessages((prev)=>prev.filter((p)=>p.message?.id !== messageId));
            await fetchActivePinned(activeConversationId);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Message unpinned.");
            queryClient.invalidateQueries({
                queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].messages(activeConversationId)
            });
        } catch (e) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to unpin message.");
        }
    };
    const handleUnstar = async (m)=>{
        try {
            await unstarMessageMutation.mutateAsync(m.id);
            setStarredMessages((prev)=>prev.filter((sm)=>sm.id !== m.id));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Message unstarred.");
            queryClient.invalidateQueries({
                queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].messages(activeConversationId)
            });
        } catch (e) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to unstar message.");
        }
    };
    // ── RENDER ──
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full flex flex-row bg-white overflow-hidden shadow-2xl relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$crm$292f$chat$2f$ChatSidebar$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                showSidebarMobile: showSidebarMobile,
                searchQuery: searchQuery,
                setSearchQuery: setSearchQuery,
                filterType: filterType,
                setFilterType: setFilterType,
                onCreateClick: ()=>setShowCreateModal(true),
                conversations: conversations,
                isLoadingConversations: isLoadingConversations,
                user: user,
                presenceMap: presenceMap
            }, void 0, false, {
                fileName: "[project]/src/app/(crm)/chat/page.jsx",
                lineNumber: 925,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$crm$292f$chat$2f$ChatMainPanel$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                showSidebarMobile: showSidebarMobile,
                activeConversationId: activeConversationId,
                activeConversation: activeConversation,
                activeDetails: activeDetails,
                headerSubtitle: headerSubtitle,
                rightPanelTab: rightPanelTab,
                isLoadingMessages: isLoadingMessages,
                mergedMessagesList: mergedMessagesList,
                user: user,
                typingUsersMap: typingUsersMap,
                uploadQueue: uploadQueue,
                composerInput: composerInput,
                setComposerInput: setComposerInput,
                employeeLookup: employeeLookup,
                editingMessage: editingMessage,
                setEditingMessage: setEditingMessage,
                replyingToMessage: replyingToMessage,
                setReplyingToMessage: setReplyingToMessage,
                canPost: canPost,
                presenceMap: presenceMap,
                onSetShowSidebarMobile: setShowSidebarMobile,
                onTogglePanel: handleTogglePanel,
                onSend: handleSend,
                onFileUpload: handleFileUpload,
                onSendVoice: handleSendVoice,
                onComposerChange: handleComposerChange,
                onComposerSubmit: handleComposerSubmit,
                onReact: (messageId, reaction)=>reactMessageMutation.mutate({
                        conversationId: activeConversationId,
                        messageId,
                        reaction
                    }),
                onPin: handlePin,
                onUnpin: (messageId)=>unpinMessageMutation.mutate({
                        conversationId: activeConversationId,
                        messageId
                    }),
                activePinnedMessage: activePinnedMessage,
                onBannerUnpin: handleBannerUnpin,
                onOpenPinnedPanel: ()=>handleTogglePanel("PINNED_MESSAGES"),
                onStar: (messageId)=>{
                    starMessageMutation.mutate(messageId, {
                        onSuccess: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Message starred/bookmarked."),
                        onError: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to star message.")
                    });
                },
                onDelete: (msgId)=>{
                    deleteMessageMutation.mutate({
                        conversationId: activeConversationId,
                        messageId: msgId,
                        mode: "everyone"
                    }, {
                        onSuccess: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Message deleted.")
                    });
                },
                onReply: (msg)=>{
                    setReplyingToMessage(msg);
                    setEditingMessage(null);
                },
                fetchNextPage: fetchNextPage,
                hasNextPage: hasNextPage,
                isFetchingNextPage: isFetchingNextPage
            }, void 0, false, {
                fileName: "[project]/src/app/(crm)/chat/page.jsx",
                lineNumber: 939,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$crm$292f$chat$2f$ChatRightPanel$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                rightPanelTab: rightPanelTab,
                onClose: ()=>dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setRightPanelTab"])(null)),
                loadingErp: loadingErp,
                erpDetail: erpDetail,
                activeConversation: activeConversation,
                loadingPinned: loadingPinned,
                pinnedMessages: pinnedMessages,
                onUnpin: handleUnpin,
                setPinnedMessages: setPinnedMessages,
                loadingStarred: loadingStarred,
                starredMessages: starredMessages,
                onUnstar: handleUnstar,
                setStarredMessages: setStarredMessages,
                companyId: companyId,
                user: user,
                onUpdateConversation: (action)=>{
                    queryClient.invalidateQueries({
                        queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].conversations()
                    });
                    if (action === "delete" || action === "leave" || action === "archive") {
                        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setActiveConversationId"])(null));
                    } else if (activeConversationId) {
                        queryClient.invalidateQueries({
                            queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$constants$2f$query$2d$keys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAT_QUERY_KEYS"].conversationDetail(Number(activeConversationId))
                        });
                    }
                }
            }, void 0, false, {
                fileName: "[project]/src/app/(crm)/chat/page.jsx",
                lineNumber: 994,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$components$2f$Common$2f$CreateConversationModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: showCreateModal,
                onClose: ()=>setShowCreateModal(false),
                currentUser: user,
                companyId: companyId
            }, void 0, false, {
                fileName: "[project]/src/app/(crm)/chat/page.jsx",
                lineNumber: 1021,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(crm)/chat/page.jsx",
        lineNumber: 922,
        columnNumber: 5
    }, this);
}
_s(ChatPage, "s2LTWd2CYbDZKID2nOmG8FEUCgA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePermissions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$queries$2f$chat$2e$queries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConversationsQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$queries$2f$chat$2e$queries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConversationDetailQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$queries$2f$chat$2e$queries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMessagesQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreateConversationMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSendMessageMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEditMessageMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeleteMessageMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReactMessageMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePinMessageMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnpinMessageMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStarMessageMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$mutations$2f$chat$2e$mutations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnstarMessageMutation"]
    ];
});
_c = ChatPage;
var _c;
__turbopack_context__.k.register(_c, "ChatPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_%28crm%29_chat_0u1d_jp._.js.map