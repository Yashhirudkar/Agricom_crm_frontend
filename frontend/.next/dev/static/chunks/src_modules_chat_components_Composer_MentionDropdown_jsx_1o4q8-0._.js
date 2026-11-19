(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/modules/chat/components/Composer/MentionDropdown.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$virtual$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-virtual/dist/esm/index.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
;
;
// Decoupled virtualized Suggestion List component for @mentions
const MentionList = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ items = [], command }, ref)=>{
    _s();
    const [selectedIndex, setSelectedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const parentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Virtualizer setup for scrolling through large directories (5000+ employees)
    const rowVirtualizer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$virtual$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useVirtualizer"])({
        count: items.length,
        getScrollElement: {
            "MentionList.useVirtualizer[rowVirtualizer]": ()=>parentRef.current
        }["MentionList.useVirtualizer[rowVirtualizer]"],
        estimateSize: {
            "MentionList.useVirtualizer[rowVirtualizer]": ()=>36
        }["MentionList.useVirtualizer[rowVirtualizer]"],
        overscan: 5
    });
    const selectItem = (index)=>{
        const item = items[index];
        if (item) {
            command({
                id: item.id || item.userId,
                label: item.name
            });
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImperativeHandle"])(ref, {
        "MentionList.useImperativeHandle": ()=>({
                onKeyDown: ({
                    "MentionList.useImperativeHandle": ({ event })=>{
                        if (event.key === "ArrowUp") {
                            setSelectedIndex({
                                "MentionList.useImperativeHandle": (i)=>{
                                    const next = i <= 0 ? items.length - 1 : i - 1;
                                    rowVirtualizer.scrollToIndex(next, {
                                        align: "auto"
                                    });
                                    return next;
                                }
                            }["MentionList.useImperativeHandle"]);
                            return true;
                        }
                        if (event.key === "ArrowDown") {
                            setSelectedIndex({
                                "MentionList.useImperativeHandle": (i)=>{
                                    const next = i >= items.length - 1 ? 0 : i + 1;
                                    rowVirtualizer.scrollToIndex(next, {
                                        align: "auto"
                                    });
                                    return next;
                                }
                            }["MentionList.useImperativeHandle"]);
                            return true;
                        }
                        if (event.key === "Enter") {
                            selectItem(selectedIndex);
                            return true;
                        }
                        return false;
                    }
                })["MentionList.useImperativeHandle"]
            })
    }["MentionList.useImperativeHandle"]);
    // Auto-reset selection index when matches change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MentionList.useEffect": ()=>{
            setSelectedIndex(0);
        }
    }["MentionList.useEffect"], [
        items
    ]);
    if (items.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-xs text-slate-400 select-none",
            children: "No matching employees."
        }, void 0, false, {
            fileName: "[project]/src/modules/chat/components/Composer/MentionDropdown.jsx",
            lineNumber: 57,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    const virtualItems = rowVirtualizer.getVirtualItems();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: parentRef,
        className: "max-h-48 w-56 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-2xl p-1 z-[9999] outline-none select-none",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full relative",
            style: {
                height: `${rowVirtualizer.getTotalSize()}px`
            },
            children: virtualItems.map((virtualRow)=>{
                const item = items[virtualRow.index];
                const isSelected = virtualRow.index === selectedIndex;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onClick: ()=>selectItem(virtualRow.index),
                    className: `absolute left-0 w-full px-3 py-2 text-xs font-semibold cursor-pointer transition-colors rounded-lg flex items-center gap-2
                ${isSelected ? "bg-blue-500 text-white" : "text-slate-700 hover:bg-slate-50"}`,
                    style: {
                        top: 0,
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `h-5.5 w-5.5 rounded-full flex items-center justify-center font-bold text-[8px] shrink-0
                  ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`,
                            children: item.name ? item.name.slice(0, 2).toUpperCase() : "?"
                        }, void 0, false, {
                            fileName: "[project]/src/modules/chat/components/Composer/MentionDropdown.jsx",
                            lineNumber: 88,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "truncate",
                            children: item.name
                        }, void 0, false, {
                            fileName: "[project]/src/modules/chat/components/Composer/MentionDropdown.jsx",
                            lineNumber: 94,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, virtualRow.key, true, {
                    fileName: "[project]/src/modules/chat/components/Composer/MentionDropdown.jsx",
                    lineNumber: 76,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0));
            })
        }, void 0, false, {
            fileName: "[project]/src/modules/chat/components/Composer/MentionDropdown.jsx",
            lineNumber: 70,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/modules/chat/components/Composer/MentionDropdown.jsx",
        lineNumber: 66,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "gAVi6bv1CEm7I/9Qwrps+uE7IvU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$virtual$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useVirtualizer"]
    ];
})), "gAVi6bv1CEm7I/9Qwrps+uE7IvU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$virtual$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useVirtualizer"]
    ];
});
_c1 = MentionList;
MentionList.displayName = "MentionList";
const __TURBOPACK__default__export__ = MentionList;
var _c, _c1;
__turbopack_context__.k.register(_c, "MentionList$forwardRef");
__turbopack_context__.k.register(_c1, "MentionList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/chat/components/Composer/MentionDropdown.jsx [app-client] (ecmascript, next/dynamic entry)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/src/modules/chat/components/Composer/MentionDropdown.jsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_modules_chat_components_Composer_MentionDropdown_jsx_1o4q8-0._.js.map