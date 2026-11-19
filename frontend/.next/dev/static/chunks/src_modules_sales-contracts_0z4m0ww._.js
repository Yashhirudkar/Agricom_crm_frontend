(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/modules/sales-contracts/components/ContractViewModal.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ContractViewModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.mjs [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen-line.mjs [app-client] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$sales$2d$contracts$2f$services$2f$salesContractApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/sales-contracts/services/salesContractApi.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$editor$2f$RichTextEditor$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/editor/RichTextEditor.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$sales$2d$contracts$2f$utils$2f$formatUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/sales-contracts/utils/formatUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$sales$2d$contracts$2f$utils$2f$quantityUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/sales-contracts/utils/quantityUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEscapeKey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useEscapeKey.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
// ─── helpers ────────────────────────────────────────────────────────────────
const COMPANY_CONFIG = {
    "AGRICOM IMPEX": {
        name: "AGRICOM IMPEX",
        logo: "/agricom impex.png",
        logoClass: "h-20 object-contain",
        address: "202, Amaltas Apartment, Rajnagar",
        city: "Nagpur (MH), India 440013",
        phone: "+91 712 2591130 / 34",
        email: "info@agricomimpex.com"
    },
    "AGRICOM IMPEX PRIVATE LIMITED": {
        name: "AGRICOM IMPEX PVT LTD",
        logo: "/agri_logo.png",
        logoClass: "h-20 object-contain scale-[1.7] origin-left",
        address: "202, Amaltas Apartment, Rajnagar",
        city: "Nagpur (MH), India 440013",
        phone: "+91 712 2591130 / 34",
        email: "info@agricomimpex.com"
    }
};
const formatDate = (dateString)=>{
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).toUpperCase();
};
/** Build a one-line address string from a Partner object */ const partnerAddress = (p)=>{
    if (!p) return "—";
    const parts = [
        p.entityName,
        p.address,
        p.city,
        p.country?.name
    ].filter(Boolean);
    return parts.join(", ").toUpperCase() || "—";
};
const destinationLabel = (contract)=>contract.destinationSelectionMode === "enquiry" ? contract.enquiryDestination || contract.destinationLocationName || contract.portOfDischarge || "" : contract.destinationLocationName || contract.portOfDischarge || "";
const incotermLabel = (contract)=>{
    const incoterm = contract.shipmentType?.code || contract.incoterm || contract.incoterms || "";
    const loc = destinationLabel(contract);
    if (incoterm) return loc ? `${incoterm} ${loc}` : incoterm;
    return loc || "—";
};
// ─── Row component ───────────────────────────────────────────────────────────
const Row = ({ label, children, className = "" })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex mb-4 print-avoid-break ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-[18%] font-bold uppercase pr-4 flex-shrink-0",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                lineNumber: 62,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-[82%] uppercase leading-snug",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                lineNumber: 63,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
        lineNumber: 61,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c = Row;
function ContractViewModal({ contractId, onClose }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [contract, setContract] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Document custom text overrides states
    const [printOverrides, setPrintOverrides] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [isCustomizing, setIsCustomizing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [savingOverrides, setSavingOverrides] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ContractViewModal.useEffect": ()=>{
            if (contract) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setPrintOverrides(contract.printOverrides || {});
            }
        }
    }["ContractViewModal.useEffect"], [
        contract
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEscapeKey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEscapeKey"])(onClose);
    const handleSaveCustomOverrides = async ()=>{
        setSavingOverrides(true);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$sales$2d$contracts$2f$services$2f$salesContractApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["salesContractApi"].update(contract.id, {
                printOverrides
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Document customizations saved successfully!");
            setContract((prev)=>({
                    ...prev,
                    printOverrides
                }));
            setIsCustomizing(false);
        } catch (err) {
            console.error("Failed to save overrides:", err);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to save customizations.");
        } finally{
            setSavingOverrides(false);
        }
    };
    const renderValue = (key, defaultValue)=>{
        const override = printOverrides[key];
        const hasOverride = override !== undefined && override !== null && String(override).trim() !== "";
        const value = hasOverride ? override : defaultValue;
        if (isCustomizing) {
            const isMultiLine = value && String(value).includes("\n");
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                value: value || "",
                onChange: (e)=>setPrintOverrides((prev)=>({
                            ...prev,
                            [key]: e.target.value
                        })),
                className: "w-full text-xs font-sans p-1.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-blue-50/20 resize-y uppercase font-medium print:bg-transparent print:border-none print:p-0",
                rows: isMultiLine ? 2 : 1,
                placeholder: "Type custom override text..."
            }, void 0, false, {
                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                lineNumber: 114,
                columnNumber: 9
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "whitespace-pre-line",
            children: value || "—"
        }, void 0, false, {
            fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
            lineNumber: 124,
            columnNumber: 12
        }, this);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ContractViewModal.useEffect": ()=>{
            if (!contractId) return;
            const loadContract = {
                "ContractViewModal.useEffect.loadContract": async ()=>{
                    setLoading(true);
                    setError(null);
                    try {
                        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$sales$2d$contracts$2f$services$2f$salesContractApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["salesContractApi"].getOne(contractId);
                        setContract(res.data);
                    } catch (err) {
                        console.error("Failed to load contract details", err);
                        setError("Could not load the contract document. Please try again.");
                    } finally{
                        setLoading(false);
                    }
                }
            }["ContractViewModal.useEffect.loadContract"];
            loadContract();
            document.body.style.overflow = "hidden";
            return ({
                "ContractViewModal.useEffect": ()=>{
                    document.body.style.overflow = "unset";
                }
            })["ContractViewModal.useEffect"];
        }
    }["ContractViewModal.useEffect"], [
        contractId
    ]);
    // ── Loading state ──────────────────────────────────────────────────────────
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-[100] flex items-center justify-center bg-slate-200/80",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "h-8 w-8 text-[#007aff] animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                        lineNumber: 154,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-semibold text-slate-800",
                        children: "Loading Document..."
                    }, void 0, false, {
                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                        lineNumber: 155,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                lineNumber: 153,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
            lineNumber: 152,
            columnNumber: 7
        }, this);
    }
    // ── Error state ────────────────────────────────────────────────────────────
    if (error || !contract) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-[100] flex items-center justify-center bg-slate-200/80",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-4 max-w-sm text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        className: "h-10 w-10 text-[#007aff]"
                    }, void 0, false, {
                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                        lineNumber: 166,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-bold text-slate-900",
                        children: "Failed to Load"
                    }, void 0, false, {
                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                        lineNumber: 167,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-slate-600",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                        lineNumber: 168,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        className: "mt-4 px-6 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold",
                        children: "Close"
                    }, void 0, false, {
                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                        lineNumber: 169,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                lineNumber: 165,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
            lineNumber: 164,
            columnNumber: 7
        }, this);
    }
    // ── Derived values ─────────────────────────────────────────────────────────
    const hasBroker = !!contract.broker;
    const hasSeller = !!(contract.seller || contract.sellerCompanyName);
    const hasBuyer = !!(contract.buyer || contract.buyerCompanyName);
    const sellerName = (contract.sellerCompanyName || contract.seller?.entityName || "").toUpperCase();
    const buyerName = (contract.buyerCompanyName || contract.buyer?.entityName || "").toUpperCase();
    const brokerName = contract.broker?.entityName?.toUpperCase() || "";
    const getShipmentPeriodText = (shipments)=>{
        if (!shipments || shipments.length === 0) return "—";
        const dates = shipments.map((s)=>s.shipmentDate ? new Date(s.shipmentDate) : null).filter((d)=>d && !isNaN(d.getTime()));
        if (dates.length === 0) return "—";
        dates.sort((a, b)=>a.getTime() - b.getTime());
        const startDate = dates[0];
        const lastDate = dates[dates.length - 1];
        const standardMonthNames = [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC"
        ];
        const startOfFirstMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        const startOfLastMonth = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);
        const startOfFirstMonthPlusOne = new Date(startOfFirstMonth);
        startOfFirstMonthPlusOne.setMonth(startOfFirstMonthPlusOne.getMonth() + 1);
        let endMonthDate;
        if (startOfLastMonth.getTime() > startOfFirstMonthPlusOne.getTime()) {
            endMonthDate = startOfLastMonth;
        } else {
            endMonthDate = startOfFirstMonthPlusOne;
        }
        const firstMonth = standardMonthNames[startDate.getMonth()];
        const firstYear = startDate.getFullYear();
        const lastMonth = standardMonthNames[endMonthDate.getMonth()];
        const lastYear = endMonthDate.getFullYear();
        if (firstYear === lastYear) {
            return `${firstMonth} – ${lastMonth} ${firstYear} SHIPMENT`;
        } else {
            return `${firstMonth} ${firstYear} –  ${lastMonth} ${lastYear} SHIPMENT`;
        }
    };
    const shipmentPeriod = getShipmentPeriodText(contract.shipments);
    const documentLine = contract.documents?.length > 0 ? contract.documents.map((d)=>d.tradeDocument?.name).filter(Boolean).join(", ") : "";
    const sellerNameForHeader = (contract?.sellerCompanyName || contract?.seller?.entityName || "").toUpperCase();
    let selectedCompanyKey = "AGRICOM IMPEX";
    if (sellerNameForHeader.includes("PRIVATE LIMITED") || sellerNameForHeader.includes("PVT LTD") || sellerNameForHeader.includes("PVT. LTD.")) {
        selectedCompanyKey = "AGRICOM IMPEX PRIVATE LIMITED";
    } else if (sellerNameForHeader.includes("AGRICOM IMPEX")) {
        selectedCompanyKey = "AGRICOM IMPEX";
    }
    const selectedCompany = COMPANY_CONFIG[selectedCompanyKey] ?? COMPANY_CONFIG["AGRICOM IMPEX"];
    const handlePrint = ()=>{
        const originalTitle = document.title;
        document.title = contract?.contractNumber ? `Contract_${contract.contractNumber}` : "Sales_Contract";
        window.print();
        setTimeout(()=>{
            document.title = originalTitle;
        }, 1000);
    };
    // ── Render ─────────────────────────────────────────────────────────────────
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        id: "contract-modal-backdrop",
        className: "jsx-9f2d96ee569272f" + " " + "fixed inset-0 z-[100] flex justify-center items-start bg-slate-200/90 overflow-y-auto print:bg-white print:overflow-visible print:static print:block",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "9f2d96ee569272f",
                children: "@media print{@page{size:A4;margin:10mm 14mm 14mm;@top-left{content:none}@top-center{content:none}@top-right{content:none}@bottom-left{content:none}@bottom-center{content:none}@bottom-right{content:none}}html,body{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;background:#fff!important;height:auto!important;margin:0!important;padding:0!important}#contract-modal-backdrop{background:#fff!important;margin:0!important;padding:0!important;position:static!important}body *{visibility:hidden}#contract-print-area,#contract-print-area *{visibility:visible;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;font-family:Times New Roman,Times,serif!important}#contract-print-area{top:0;left:0;width:100%!important;min-height:100%!important;box-shadow:none!important;box-sizing:border-box!important;background:#fff!important;border-radius:0!important;margin:0!important;padding:0!important;position:absolute!important}#contract-print-table{border-collapse:collapse;width:100%}#contract-print-table thead{display:table-header-group}#contract-print-table thead td{border:none;padding:0}#contract-print-table tfoot{display:table-footer-group}#contract-print-table tfoot td{border:none;padding:0}#contract-print-area .contract-print-footer{transform:translateY(5px)}#contract-print-area .contract-print-website-footer{transform:translateY(4px)}.print-avoid-break{break-inside:avoid!important;page-break-inside:avoid!important}.print-page-break-before{break-before:page!important;page-break-before:always!important}}"
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-9f2d96ee569272f" + " " + "fixed top-6 right-6 flex flex-col gap-2 z-[110] print:hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsCustomizing(!isCustomizing),
                        title: isCustomizing ? "Exit Customizing" : "Customize Document Text",
                        className: "jsx-9f2d96ee569272f" + " " + `h-10 w-10 flex items-center justify-center rounded-xl border shadow-sm transition-colors cursor-pointer ${isCustomizing ? "bg-amber-500 border-amber-600 text-white hover:bg-amber-600" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                            className: "h-4.5 w-4.5"
                        }, void 0, false, {
                            fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                            lineNumber: 358,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                        lineNumber: 350,
                        columnNumber: 9
                    }, this),
                    isCustomizing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleSaveCustomOverrides,
                        disabled: savingOverrides,
                        title: "Save Customizations",
                        className: "jsx-9f2d96ee569272f" + " " + "h-10 w-10 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm cursor-pointer transition-colors",
                        children: savingOverrides ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            className: "h-4.5 w-4.5 animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                            lineNumber: 370,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                            className: "h-4.5 w-4.5"
                        }, void 0, false, {
                            fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                            lineNumber: 372,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                        lineNumber: 363,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handlePrint,
                        title: "Print / PDF Export",
                        className: "jsx-9f2d96ee569272f" + " " + "h-10 w-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 text-[#007aff] transition-colors cursor-pointer",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                            className: "h-5 w-5"
                        }, void 0, false, {
                            fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                            lineNumber: 389,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                        lineNumber: 384,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        title: "Close",
                        className: "jsx-9f2d96ee569272f" + " " + "h-10 w-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "h-5 w-5"
                        }, void 0, false, {
                            fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                            lineNumber: 396,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                        lineNumber: 391,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                lineNumber: 348,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "contract-print-area",
                style: {
                    fontFamily: "'Times New Roman', Times, serif"
                },
                className: "jsx-9f2d96ee569272f" + " " + "my-8 bg-white w-full max-w-[1024px] h-fit rounded-2xl shadow-2xl print:my-0 print:shadow-none print:max-w-none print:w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    id: "contract-print-table",
                    style: {
                        width: "100%",
                        borderCollapse: "collapse"
                    },
                    className: "jsx-9f2d96ee569272f",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "jsx-9f2d96ee569272f",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                className: "jsx-9f2d96ee569272f",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    style: {
                                        padding: 0,
                                        border: "none"
                                    },
                                    className: "jsx-9f2d96ee569272f",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-9f2d96ee569272f" + " " + "px-8 md:px-10 pt-8 md:pt-10 print:px-0 print:pt-0 text-slate-900 mb-8",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-9f2d96ee569272f" + " " + "flex justify-between items-center print-avoid-break",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-9f2d96ee569272f",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: selectedCompany.logo,
                                                            alt: selectedCompany.name,
                                                            className: "jsx-9f2d96ee569272f" + " " + (selectedCompany.logoClass || "")
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                            lineNumber: 417,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 416,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-9f2d96ee569272f" + " " + "text-right text-[12px] text-gray-900 leading-tight",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "text-base font-bold text-gray-900 uppercase mb-0.5 ",
                                                                children: selectedCompany.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 420,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-9f2d96ee569272f",
                                                                children: selectedCompany.address
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 421,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-9f2d96ee569272f",
                                                                children: selectedCompany.city
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 422,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-9f2d96ee569272f",
                                                                children: selectedCompany.phone
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 423,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-9f2d96ee569272f",
                                                                children: selectedCompany.email
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 424,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 419,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                lineNumber: 415,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-9f2d96ee569272f" + " " + "flex items-center mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-9f2d96ee569272f" + " " + "text-[10px] text-gray-600 uppercase whitespace-nowrap leading-none",
                                                        children: "EXPORT & IMPORT OF AGRICULTURAL COMMODITIES"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 428,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-9f2d96ee569272f" + " " + "flex-1 border-b border-gray-300 ml-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 432,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                lineNumber: 427,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                        lineNumber: 414,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                    lineNumber: 412,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                lineNumber: 411,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                            lineNumber: 410,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tfoot", {
                            className: "jsx-9f2d96ee569272f",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                className: "jsx-9f2d96ee569272f",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    className: "jsx-9f2d96ee569272f",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-9f2d96ee569272f" + " " + "contract-print-footer font-serif text-[13px] text-black",
                                        children: [
                                            (hasSeller || hasBroker || hasBuyer) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-9f2d96ee569272f" + " " + "flex items-start justify-between px-8 md:px-10 pt-6 pb-2 print:px-0 print:pt-4",
                                                children: [
                                                    hasSeller && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-9f2d96ee569272f" + " " + "text-center w-56 relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "font-bold uppercase mb-1 text-[11px]",
                                                                children: "Accepted By Seller"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 450,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "font-bold uppercase text-[11px] mb-8",
                                                                children: sellerName
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 451,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "relative h-16 w-full my-1 flex items-center justify-center",
                                                                children: [
                                                                    contract.sellerCompanySeal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                        src: contract.sellerCompanySeal,
                                                                        alt: "Seller Seal",
                                                                        style: {
                                                                            mixBlendMode: "multiply"
                                                                        },
                                                                        className: "jsx-9f2d96ee569272f" + " " + "absolute inset-0 m-auto max-h-55 pb-8 max-w-[180px] object-contain opacity-85 pointer-events-none "
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 455,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    contract.sellerSignature && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                        src: contract.sellerSignature,
                                                                        alt: "Seller Signature",
                                                                        style: {
                                                                            mixBlendMode: "multiply"
                                                                        },
                                                                        className: "jsx-9f2d96ee569272f" + " " + "absolute inset-0 m-auto max-h-65 max-w-[140px] object-contain z-10 pointer-events-none"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 463,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 453,
                                                                columnNumber: 27
                                                            }, this),
                                                            contract.sellerAuthorizedSignatory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "uppercase text-[10px]",
                                                                children: [
                                                                    "(",
                                                                    contract.sellerAuthorizedSignatory,
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 473,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "border-t border-black mt-1 pt-1 text-[10px] text-gray-500 uppercase",
                                                                children: "Authorized Signatory"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 475,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 449,
                                                        columnNumber: 25
                                                    }, this),
                                                    hasBroker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-9f2d96ee569272f" + " " + "text-center w-56 relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "font-bold uppercase mb-1 text-[11px]",
                                                                children: "Broker"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 484,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "font-bold uppercase text-[11px]",
                                                                children: brokerName
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 485,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "h-16"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 486,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "border-t border-black mt-1 pt-1 text-[10px] text-gray-500 uppercase",
                                                                children: "Authorized Signatory"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 487,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 483,
                                                        columnNumber: 25
                                                    }, this),
                                                    hasBuyer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-9f2d96ee569272f" + " " + "text-center w-56 relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "font-bold uppercase mb-1 text-[11px]",
                                                                children: "Accepted By Buyer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 496,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "font-bold uppercase text-[11px]",
                                                                children: buyerName
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 497,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "relative h-16 w-full my-1 flex items-center justify-center",
                                                                children: [
                                                                    contract.buyerCompanySeal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                        src: contract.buyerCompanySeal,
                                                                        alt: "Buyer Seal",
                                                                        style: {
                                                                            mixBlendMode: "multiply"
                                                                        },
                                                                        className: "jsx-9f2d96ee569272f" + " " + "absolute inset-0 m-auto max-h-16 max-w-[140px] object-contain opacity-85 pointer-events-none"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 501,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    contract.buyerSignature && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                        src: contract.buyerSignature,
                                                                        alt: "Buyer Signature",
                                                                        style: {
                                                                            mixBlendMode: "multiply"
                                                                        },
                                                                        className: "jsx-9f2d96ee569272f" + " " + "absolute inset-0 m-auto max-h-14 max-w-[140px] object-contain z-10 pointer-events-none"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 509,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 499,
                                                                columnNumber: 27
                                                            }, this),
                                                            contract.buyerAuthorizedSignatory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "uppercase text-[10px]",
                                                                children: [
                                                                    "(",
                                                                    contract.buyerAuthorizedSignatory,
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 519,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "border-t border-black mt-1 pt-1 text-[10px] text-gray-500 uppercase",
                                                                children: "Authorized Signatory"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 521,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 495,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                lineNumber: 445,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-9f2d96ee569272f" + " " + "contract-print-website-footer mx-8 md:mx-10 mt-3 mb-4 pt-2 border-t-2 border-[#8dc63f] text-center print:mx-0 print:mb-1",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "jsx-9f2d96ee569272f" + " " + "text-[11px] text-gray-500 font-medium",
                                                    children: "www.agricomimpex.com"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                    lineNumber: 531,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                lineNumber: 530,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                        lineNumber: 442,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                    lineNumber: 440,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                lineNumber: 439,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                            lineNumber: 438,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            className: "jsx-9f2d96ee569272f",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                className: "jsx-9f2d96ee569272f",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    className: "jsx-9f2d96ee569272f",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-9f2d96ee569272f" + " " + "px-8 md:px-10 pb-8 md:pb-10 print:px-0 print:pb-0 print:pt-0 text-slate-900",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-9f2d96ee569272f" + " " + "flex justify-between items-start mb-4 print:mb-2 print-avoid-break",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-9f2d96ee569272f" + " " + "w-1/4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 545,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-9f2d96ee569272f" + " " + "text-center w-2/4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: "jsx-9f2d96ee569272f" + " " + "text-lg font-bold uppercase tracking-widest mb-1 text-slate-900",
                                                            children: "Sales Contract"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                            lineNumber: 547,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 546,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-9f2d96ee569272f" + " " + "w-1/4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 551,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                lineNumber: 544,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-9f2d96ee569272f" + " " + "font-serif text-[13px] leading-snug text-black mt-8 print:mt-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-9f2d96ee569272f" + " " + "text-[13px] mb-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "jsx-9f2d96ee569272f" + " " + "font-bold uppercase",
                                                                        children: "DATE :"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 559,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "jsx-9f2d96ee569272f" + " " + "font-bold",
                                                                        children: formatDate(contract.contractDate)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 560,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 558,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "flex items-center gap-2 mt-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "jsx-9f2d96ee569272f" + " " + "font-bold uppercase",
                                                                        children: "CONTRACT NO :"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 566,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "jsx-9f2d96ee569272f" + " " + "font-bold uppercase",
                                                                        children: contract.contractNumber || "—"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 567,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 565,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 557,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-9f2d96ee569272f" + " " + "font-bold uppercase mb-4 print:mb-2",
                                                        children: "We Herewith Confirm The Following Transaction Between Following:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 573,
                                                        columnNumber: 21
                                                    }, this),
                                                    hasSeller && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                                        label: "Seller",
                                                        children: renderValue("seller", contract.seller ? partnerAddress(contract.seller) : contract.sellerCompanyName?.toUpperCase())
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 579,
                                                        columnNumber: 23
                                                    }, this),
                                                    hasBuyer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                                        label: "Buyer",
                                                        children: renderValue("buyer", contract.buyer ? partnerAddress(contract.buyer) : contract.buyerCompanyName?.toUpperCase())
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 586,
                                                        columnNumber: 23
                                                    }, this),
                                                    hasBroker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                                        label: "Broker",
                                                        className: "mb-4",
                                                        children: renderValue("broker", partnerAddress(contract.broker))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 593,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-9f2d96ee569272f" + " " + ((hasBroker ? "" : "mb-4") || "")
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 598,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-9f2d96ee569272f" + " " + "mb-4 print:mb-1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 639,
                                                        columnNumber: 21
                                                    }, this),
                                                    contract.items?.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                                                    label: "Product",
                                                                    children: renderValue(`product_${idx}`, item.product?.name?.toUpperCase() || "—")
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                    lineNumber: 644,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                                                    label: "Quality",
                                                                    children: renderValue(`quality_${idx}`, (item.quality || (idx === 0 ? printOverrides['quality_0'] : null) || [
                                                                        item.product?.qualitySubType,
                                                                        item.product?.specification
                                                                    ].filter(Boolean).join(" - "))?.toUpperCase() || "—")
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                    lineNumber: 648,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                                                    label: "Quantity",
                                                                    children: (()=>{
                                                                        const calculatedQty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$sales$2d$contracts$2f$utils$2f$quantityUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getContractItemQuantityDescription"])(contract, item);
                                                                        // Backward-compatible check for legacy split prefix/suffix overrides
                                                                        const hasLegacyOverride = printOverrides[`quantityPrefix_${idx}`] !== undefined;
                                                                        const legacyDefault = hasLegacyOverride ? `${printOverrides[`quantityPrefix_${idx}`] ? `${printOverrides[`quantityPrefix_${idx}`]} ` : ""}${Number(item.quantity).toLocaleString("en-IN")} MT${printOverrides[`quantitySuffix_${idx}`] !== undefined ? ` ${printOverrides[`quantitySuffix_${idx}`]}` : " +/- 5%"}` : null;
                                                                        const override = printOverrides[`quantity_${idx}`];
                                                                        const isOldFormat = override && (override.includes("OF APPROX.") || override.includes("\n") || override.includes("(40 FT)") || override.includes("(20 FT)") || override.includes(" . "));
                                                                        const currentOverride = isOldFormat ? undefined : override;
                                                                        const effectiveValue = legacyDefault || currentOverride || calculatedQty;
                                                                        if (isCustomizing) {
                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                                value: effectiveValue || "",
                                                                                onChange: (e)=>setPrintOverrides((prev)=>({
                                                                                            ...prev,
                                                                                            [`quantity_${idx}`]: e.target.value
                                                                                        })),
                                                                                rows: 1,
                                                                                placeholder: "Type custom override text...",
                                                                                className: "jsx-9f2d96ee569272f" + " " + "w-full text-xs font-sans p-1.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-blue-50/20 resize-y uppercase font-medium print:bg-transparent print:border-none print:p-0"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                                lineNumber: 682,
                                                                                columnNumber: 33
                                                                            }, this);
                                                                        }
                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-9f2d96ee569272f" + " " + "whitespace-pre-line",
                                                                            children: effectiveValue || "—"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                            lineNumber: 692,
                                                                            columnNumber: 36
                                                                        }, this);
                                                                    })()
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                    lineNumber: 658,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                                                    label: "Packing",
                                                                    children: renderValue(`packing_${idx}`, [
                                                                        item.packingType?.name,
                                                                        item.bagType?.name ? `OF EACH ${item.bagType.name}` : null,
                                                                        item.bagSpecification?.name ? `(${item.bagSpecification.name})` : null
                                                                    ].filter(Boolean).join(" ")?.toUpperCase() || "—")
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                    lineNumber: 696,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                                                    label: "Marking",
                                                                    children: renderValue(`marking_${idx}`, item.marking?.toUpperCase() || "NONE")
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                    lineNumber: 704,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                                                    label: "Price",
                                                                    children: (()=>{
                                                                        const baseIncoterm = contract.shipmentType?.code || contract.incoterm || contract.incoterms || "";
                                                                        const loc = destinationLabel(contract);
                                                                        const incotermSuffix = baseIncoterm ? ` ${baseIncoterm}` : "";
                                                                        const defaultPart1 = `${contract.currencyCode} ${Number(item.unitPrice).toLocaleString("en-IN", {
                                                                            minimumFractionDigits: 2
                                                                        })} PER MT${incotermSuffix}`.toUpperCase();
                                                                        const defaultPart2 = loc.toUpperCase();
                                                                        const p1 = printOverrides[`pricePart1_${idx}`] !== undefined ? printOverrides[`pricePart1_${idx}`] : defaultPart1;
                                                                        const p2 = printOverrides[`pricePart2_${idx}`] !== undefined ? printOverrides[`pricePart2_${idx}`] : defaultPart2;
                                                                        if (isCustomizing) {
                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-9f2d96ee569272f" + " " + "flex items-center gap-2 w-full",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                                        value: p1,
                                                                                        onChange: (e)=>setPrintOverrides((prev)=>({
                                                                                                    ...prev,
                                                                                                    [`pricePart1_${idx}`]: e.target.value
                                                                                                })),
                                                                                        rows: 1,
                                                                                        placeholder: "Part 1 (e.g. USD 490.00 PER MT CIF)",
                                                                                        className: "jsx-9f2d96ee569272f" + " " + "w-1/2 text-xs font-sans p-1.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-blue-50/20 resize-y uppercase font-medium"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                                        lineNumber: 723,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                                        value: p2,
                                                                                        onChange: (e)=>setPrintOverrides((prev)=>({
                                                                                                    ...prev,
                                                                                                    [`pricePart2_${idx}`]: e.target.value
                                                                                                })),
                                                                                        rows: 1,
                                                                                        placeholder: "Part 2 (e.g. PORT NAME)",
                                                                                        className: "jsx-9f2d96ee569272f" + " " + "w-1/2 text-xs font-sans p-1.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-blue-50/20 resize-y uppercase font-medium"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                                        lineNumber: 730,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                                lineNumber: 722,
                                                                                columnNumber: 33
                                                                            }, this);
                                                                        }
                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-9f2d96ee569272f",
                                                                            children: [
                                                                                p1,
                                                                                " ",
                                                                                p2
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                            lineNumber: 740,
                                                                            columnNumber: 36
                                                                        }, this);
                                                                    })()
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                    lineNumber: 708,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, item.id || idx, true, {
                                                            fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                            lineNumber: 643,
                                                            columnNumber: 23
                                                        }, this)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                                        label: "Payment",
                                                        children: [
                                                            renderValue("payment", contract.paymentTerm?.name?.toUpperCase() || "—"),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "mt-3 print:mt-1 text-[13px] text-black font-serif leading-snug",
                                                                children: "IN THE EVENT OF DELAY IN PAYMENT FOR THE GOODS BEYOND THE TERMS SPECIFIED IN THIS CONTRACT, THE BUYER SHALL BE ENTITLED TO A PENALTY, WHICH SHALL BE CALCULATED AT 0.5 % OF THE VALUE OF THE COMMERCIAL INVOICE FOR EACH DAY OF DELAY. THE PROPERTY RIGHT TO A CARGO PASSES FROM THE SELLER TO THE BUYER AFTER 100% PAYMENT OF CARGO"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 749,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 747,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                                        label: "Shipment",
                                                        children: renderValue("shipment_period", shipmentPeriod.toUpperCase())
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 755,
                                                        columnNumber: 21
                                                    }, this),
                                                    contract.documents?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                                        label: "Documents",
                                                        className: "leading-relaxed",
                                                        children: renderValue("documents", documentLine?.toUpperCase())
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 761,
                                                        columnNumber: 23
                                                    }, this),
                                                    contract.remarks && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Row, {
                                                        label: "Note",
                                                        className: "mb-6 print:mb-1",
                                                        children: renderValue("note", contract.remarks?.toUpperCase())
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 768,
                                                        columnNumber: 23
                                                    }, this),
                                                    contract.terms?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-9f2d96ee569272f" + " " + "mb-6 mt-4 print:mb-2 print:mt-0 print-avoid-break",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "font-bold uppercase mb-3",
                                                                children: "Terms & Conditions"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 778,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "list-disc pl-5 space-y-1",
                                                                children: contract.terms.map((term, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        className: "jsx-9f2d96ee569272f" + " " + "uppercase",
                                                                        children: term
                                                                    }, idx, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 781,
                                                                        columnNumber: 29
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 779,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 777,
                                                        columnNumber: 23
                                                    }, this),
                                                    contract.otherConditions?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-9f2d96ee569272f" + " " + "mb-6 print:mb-2 print-avoid-break",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "font-bold uppercase mb-3",
                                                                children: "Other Conditions"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 790,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "list-disc pl-5 space-y-1",
                                                                children: contract.otherConditions.map((cond, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        className: "jsx-9f2d96ee569272f" + " " + "uppercase",
                                                                        children: cond
                                                                    }, idx, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 793,
                                                                        columnNumber: 29
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 791,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 789,
                                                        columnNumber: 23
                                                    }, this),
                                                    contract.disputeResolution && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-9f2d96ee569272f" + " " + "mb-6 print:mb-2 print-avoid-break",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "font-bold uppercase mb-3",
                                                                children: "Dispute Resolution"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 802,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "uppercase -mx-4 -mt-2",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$editor$2f$RichTextEditor$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    value: contract.disputeResolution,
                                                                    editable: false,
                                                                    outputFormat: "json"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                    lineNumber: 804,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 803,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 801,
                                                        columnNumber: 23
                                                    }, this),
                                                    contract.forceMajeure && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-9f2d96ee569272f" + " " + "mb-10 print:mb-3 print-avoid-break",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "font-bold uppercase mb-3",
                                                                children: "Force Majeure"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 812,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "uppercase -mx-4 -mt-2",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$editor$2f$RichTextEditor$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    value: contract.forceMajeure,
                                                                    editable: false,
                                                                    outputFormat: "json"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                    lineNumber: 814,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 813,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 811,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                lineNumber: 555,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-9f2d96ee569272f" + " " + "print:hidden",
                                                children: [
                                                    (hasSeller || hasBroker || hasBuyer) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-9f2d96ee569272f" + " " + "mt-16 flex items-start justify-between font-serif text-[13px]",
                                                        children: [
                                                            hasSeller && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "text-center w-56 relative",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-9f2d96ee569272f" + " " + "font-bold uppercase mb-1 text-[11px]",
                                                                        children: "Accepted By Seller"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 827,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-9f2d96ee569272f" + " " + "font-bold uppercase text-[11px] mb-8",
                                                                        children: sellerName
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 828,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-9f2d96ee569272f" + " " + "relative h-16 w-full my-1 flex items-center justify-center",
                                                                        children: [
                                                                            contract.sellerCompanySeal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                                src: contract.sellerCompanySeal,
                                                                                alt: "Seller Seal",
                                                                                style: {
                                                                                    mixBlendMode: "multiply"
                                                                                },
                                                                                className: "jsx-9f2d96ee569272f" + " " + "absolute inset-0 m-auto max-h-55 pb-8 max-w-[180px] object-contain opacity-85 pointer-events-none"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                                lineNumber: 832,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            contract.sellerSignature && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                                src: contract.sellerSignature,
                                                                                alt: "Seller Signature",
                                                                                style: {
                                                                                    mixBlendMode: "multiply"
                                                                                },
                                                                                className: "jsx-9f2d96ee569272f" + " " + "absolute inset-0 m-auto max-h-65 max-w-[140px] object-contain z-10 pointer-events-none"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                                lineNumber: 840,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 830,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    contract.sellerAuthorizedSignatory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-9f2d96ee569272f" + " " + "uppercase text-[10px]",
                                                                        children: [
                                                                            "(",
                                                                            contract.sellerAuthorizedSignatory,
                                                                            ")"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 850,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-9f2d96ee569272f" + " " + "border-t border-black mt-1 pt-1 text-[10px] text-gray-500 uppercase",
                                                                        children: "Authorized Signatory"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 852,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 826,
                                                                columnNumber: 27
                                                            }, this),
                                                            hasBroker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "text-center w-56 relative",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-9f2d96ee569272f" + " " + "font-bold uppercase mb-1 text-[11px]",
                                                                        children: "Broker"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 859,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-9f2d96ee569272f" + " " + "font-bold uppercase text-[11px]",
                                                                        children: brokerName
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 860,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-9f2d96ee569272f" + " " + "h-16"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 861,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-9f2d96ee569272f" + " " + "border-t border-black mt-1 pt-1 text-[10px] text-gray-500 uppercase",
                                                                        children: "Authorized Signatory"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 862,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 858,
                                                                columnNumber: 27
                                                            }, this),
                                                            hasBuyer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-9f2d96ee569272f" + " " + "text-center w-56 relative",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-9f2d96ee569272f" + " " + "font-bold uppercase mb-1 text-[11px]",
                                                                        children: "Accepted By Buyer"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 869,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-9f2d96ee569272f" + " " + "font-bold uppercase text-[11px]",
                                                                        children: buyerName
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 870,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-9f2d96ee569272f" + " " + "relative h-16 w-full my-1 flex items-center justify-center",
                                                                        children: [
                                                                            contract.buyerCompanySeal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                                src: contract.buyerCompanySeal,
                                                                                alt: "Buyer Seal",
                                                                                style: {
                                                                                    mixBlendMode: "multiply"
                                                                                },
                                                                                className: "jsx-9f2d96ee569272f" + " " + "absolute inset-0 m-auto max-h-16 max-w-[140px] object-contain opacity-85 pointer-events-none"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                                lineNumber: 874,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            contract.buyerSignature && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                                src: contract.buyerSignature,
                                                                                alt: "Buyer Signature",
                                                                                style: {
                                                                                    mixBlendMode: "multiply"
                                                                                },
                                                                                className: "jsx-9f2d96ee569272f" + " " + "absolute inset-0 m-auto max-h-14 max-w-[140px] object-contain z-10 pointer-events-none"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                                lineNumber: 882,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 872,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    contract.buyerAuthorizedSignatory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-9f2d96ee569272f" + " " + "uppercase text-[10px]",
                                                                        children: [
                                                                            "(",
                                                                            contract.buyerAuthorizedSignatory,
                                                                            ")"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 892,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-9f2d96ee569272f" + " " + "border-t border-black mt-1 pt-1 text-[10px] text-gray-500 uppercase",
                                                                        children: "Authorized Signatory"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                        lineNumber: 894,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                                lineNumber: 868,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 824,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-9f2d96ee569272f" + " " + "mt-6 pt-2 border-t-2 border-[#8dc63f] text-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-9f2d96ee569272f" + " " + "text-[11px] text-gray-500 font-medium",
                                                            children: "www.agricomimpex.com"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                            lineNumber: 902,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                        lineNumber: 901,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                                lineNumber: 822,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                        lineNumber: 541,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                    lineNumber: 540,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                                lineNumber: 539,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                            lineNumber: 538,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                    lineNumber: 409,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
                lineNumber: 401,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/modules/sales-contracts/components/ContractViewModal.jsx",
        lineNumber: 257,
        columnNumber: 5
    }, this);
}
_s(ContractViewModal, "DrDH+x3mQakkpcyAmoD85MqUssA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEscapeKey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEscapeKey"]
    ];
});
_c1 = ContractViewModal;
var _c, _c1;
__turbopack_context__.k.register(_c, "Row");
__turbopack_context__.k.register(_c1, "ContractViewModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DocumentUploadDrawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$upload$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UploadCloud$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-upload.mjs [app-client] (ecmascript) <export default as UploadCloud>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.mjs [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.mjs [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.mjs [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-open.mjs [app-client] (ecmascript) <export default as FolderOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$sales$2d$contracts$2f$services$2f$salesContractApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/sales-contracts/services/salesContractApi.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEscapeKey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useEscapeKey.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
// ─── Tooltip ─────────────────────────────────────────────────────────────────
function Tip({ label, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative group/t inline-flex",
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-semibold text-white shadow-lg opacity-0 scale-95 transition-all duration-150 group-hover/t:opacity-100 group-hover/t:scale-100 z-[200]",
                children: [
                    label,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"
                    }, void 0, false, {
                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                lineNumber: 26,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_c = Tip;
// ─── Icon action button ───────────────────────────────────────────────────────
function ActionBtn({ onClick, title, colorClass, icon, disabled = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tip, {
        label: title,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onClick,
            disabled: disabled,
            className: `p-1.5 rounded-lg transition-colors text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed ${colorClass}`,
            children: icon
        }, void 0, false, {
            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
            lineNumber: 38,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_c1 = ActionBtn;
// ─── Confirm delete dialog ────────────────────────────────────────────────────
function ConfirmDialog({ open, docName, onConfirm, onCancel }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEscapeKey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEscapeKey"])(onCancel, open);
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute inset-0 z-[300] flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-xl shadow-2xl border border-gray-100 p-5 max-w-xs w-full mx-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start gap-3 mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-shrink-0 w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                className: "h-3.5 w-3.5 text-red-500"
                            }, void 0, false, {
                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                lineNumber: 59,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-semibold text-gray-900",
                                    children: "Delete File"
                                }, void 0, false, {
                                    fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                    lineNumber: 62,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-500 mt-0.5",
                                    children: [
                                        "Delete ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-gray-700",
                                            children: [
                                                '"',
                                                docName,
                                                '"'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                            lineNumber: 64,
                                            columnNumber: 22
                                        }, this),
                                        "? This cannot be undone."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                    lineNumber: 63,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onCancel,
                            className: "px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onConfirm,
                            className: "px-3 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors",
                            children: "Delete"
                        }, void 0, false, {
                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                            lineNumber: 72,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
            lineNumber: 56,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_s(ConfirmDialog, "Kd5TflhK+d5IdYSr0ox+sEB3c54=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEscapeKey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEscapeKey"]
    ];
});
_c2 = ConfirmDialog;
function DocumentUploadDrawer({ contract, onClose, onRefreshList }) {
    _s1();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEscapeKey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEscapeKey"])(onClose, Boolean(contract));
    const [documents, setDocuments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [deleteTarget, setDeleteTarget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fileInputRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    // ── Fetch ──────────────────────────────────────────────────────────────────
    const fetchDocuments = async ()=>{
        try {
            setLoading(true);
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$sales$2d$contracts$2f$services$2f$salesContractApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["salesContractApi"].getDocuments(contract.id);
            setDocuments(res.data);
            setError(null);
        } catch  {
            setError("Failed to load documents.");
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DocumentUploadDrawer.useEffect": ()=>{
            if (contract?.id) fetchDocuments();
        }
    }["DocumentUploadDrawer.useEffect"], [
        contract?.id
    ]);
    // ── Upload ─────────────────────────────────────────────────────────────────
    const handleUploadClick = (tradeDocumentId)=>{
        fileInputRefs.current[tradeDocumentId]?.click();
    };
    const onFileChange = async (e, tradeDocumentId)=>{
        const file = e.target.files[0];
        if (!file) return;
        e.target.value = null;
        const formData = new FormData();
        formData.append("file", file);
        try {
            setProgress((prev)=>({
                    ...prev,
                    [tradeDocumentId]: 1
                }));
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$sales$2d$contracts$2f$services$2f$salesContractApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["salesContractApi"].uploadDocument(contract.id, tradeDocumentId, formData, (ev)=>{
                const pct = Math.round(ev.loaded * 100 / ev.total);
                setProgress((prev)=>({
                        ...prev,
                        [tradeDocumentId]: pct
                    }));
            });
            setProgress((prev)=>({
                    ...prev,
                    [tradeDocumentId]: null
                }));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Document uploaded successfully");
            fetchDocuments();
            onRefreshList?.();
        } catch  {
            setProgress((prev)=>({
                    ...prev,
                    [tradeDocumentId]: null
                }));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Upload failed for ${file.name}`);
        }
    };
    // ── Delete ─────────────────────────────────────────────────────────────────
    const confirmDelete = async ()=>{
        if (!deleteTarget) return;
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$sales$2d$contracts$2f$services$2f$salesContractApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["salesContractApi"].deleteDocument(contract.id, deleteTarget.tradeDocumentId);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Document deleted");
            setDeleteTarget(null);
            fetchDocuments();
            onRefreshList?.();
        } catch  {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to delete document.");
        }
    };
    // ── Download / View ────────────────────────────────────────────────────────
    const handleDownload = async (url, filename, view = false)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(url, {
                responseType: "blob"
            });
            const blobUrl = window.URL.createObjectURL(new Blob([
                response.data
            ], {
                type: response.headers["content-type"]
            }));
            if (view) {
                window.open(blobUrl, "_blank");
            } else {
                const link = document.createElement("a");
                link.href = blobUrl;
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            }
            setTimeout(()=>window.URL.revokeObjectURL(blobUrl), 10000);
        } catch  {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to retrieve file.");
        }
    };
    // ── Helpers ────────────────────────────────────────────────────────────────
    const formatSize = (bytes)=>{
        if (!bytes) return "";
        const k = 1024;
        const sizes = [
            "B",
            "KB",
            "MB",
            "GB"
        ];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };
    const formatDate = (dateStr)=>{
        if (!dateStr) return null;
        try {
            return new Date(dateStr).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
        } catch  {
            return null;
        }
    };
    const uploadedCount = documents.filter((d)=>d.uploaded).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[150] bg-black/30 backdrop-blur-sm",
                onClick: onClose
            }, void 0, false, {
                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                lineNumber: 197,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed right-0 top-0 bottom-0 z-[160] w-full max-w-2xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative flex flex-col h-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ConfirmDialog, {
                            open: !!deleteTarget,
                            docName: deleteTarget?.name,
                            onConfirm: confirmDelete,
                            onCancel: ()=>setDeleteTarget(null)
                        }, void 0, false, {
                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                            lineNumber: 206,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex-shrink-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__["FolderOpen"], {
                                                className: "h-4.5 w-4.5 text-[#007aff]"
                                            }, void 0, false, {
                                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                lineNumber: 217,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                            lineNumber: 216,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: "text-sm font-bold text-gray-900",
                                                            children: "Document Uploads"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                            lineNumber: 221,
                                                            columnNumber: 19
                                                        }, this),
                                                        !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${uploadedCount === documents.length && documents.length > 0 ? "bg-green-50 text-green-600 border-green-200" : "bg-amber-50 text-amber-600 border-amber-200"}`,
                                                            children: [
                                                                uploadedCount,
                                                                " / ",
                                                                documents.length,
                                                                " uploaded"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                            lineNumber: 223,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                    lineNumber: 220,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[11px] text-gray-400 mt-0.5",
                                                    children: [
                                                        "Contract ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-bold text-gray-600",
                                                            children: contract?.contractNumber
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                            lineNumber: 233,
                                                            columnNumber: 28
                                                        }, this),
                                                        contract?.shipments?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                " · ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-gray-500 underline decoration-dotted cursor-help",
                                                                    title: contract.shipments.map((s)=>s.shipmentReference || "—").join('\n'),
                                                                    children: [
                                                                        "Shipments: ",
                                                                        contract.shipments.length
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                    lineNumber: 235,
                                                                    columnNumber: 26
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                            lineNumber: 235,
                                                            columnNumber: 21
                                                        }, this),
                                                        contract?.buyer?.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                " · ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-gray-500",
                                                                    children: contract.buyer.name || contract.buyer.entityName
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                    lineNumber: 238,
                                                                    columnNumber: 26
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                            lineNumber: 238,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                    lineNumber: 232,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                            lineNumber: 219,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                    lineNumber: 215,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onClose,
                                    className: "p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                        lineNumber: 247,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                    lineNumber: 243,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                            lineNumber: 214,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto",
                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center py-20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    className: "h-6 w-6 text-gray-300 animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                    lineNumber: 255,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                lineNumber: 254,
                                columnNumber: 15
                            }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center justify-center py-16 text-center px-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                        className: "h-8 w-8 text-red-300 mb-3"
                                    }, void 0, false, {
                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                        lineNumber: 259,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-semibold text-gray-600",
                                        children: error
                                    }, void 0, false, {
                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                        lineNumber: 260,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: fetchDocuments,
                                        className: "mt-3 text-xs text-[#007aff] font-semibold hover:underline",
                                        children: "Try again"
                                    }, void 0, false, {
                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                        lineNumber: 261,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                lineNumber: 258,
                                columnNumber: 15
                            }, this) : documents.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center justify-center py-16 text-center px-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__["FolderOpen"], {
                                            className: "h-7 w-7 text-gray-300"
                                        }, void 0, false, {
                                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                            lineNumber: 268,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                        lineNumber: 267,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-semibold text-gray-600",
                                        children: "No documents assigned"
                                    }, void 0, false, {
                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                        lineNumber: 270,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-400 mt-1",
                                        children: "This contract has no trade documents configured."
                                    }, void 0, false, {
                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                        lineNumber: 271,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                lineNumber: 266,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "divide-y divide-gray-50",
                                children: documents.map((docMapping)=>{
                                    const { tradeDocument, uploaded, attachment } = docMapping;
                                    const uploadProgress = progress[tradeDocument.id];
                                    const isUploading = uploadProgress !== undefined && uploadProgress !== null;
                                    const uploadDate = formatDate(attachment?.createdAt) || formatDate(attachment?.uploadedAt) || formatDate(attachment?.created_at);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-5 py-4 hover:bg-gray-50/60 transition-colors group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start gap-3 min-w-0",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center border ${uploaded ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100"}`,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                    className: `h-4 w-4 ${uploaded ? "text-green-500" : "text-gray-300"}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                    lineNumber: 298,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                lineNumber: 293,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-1.5 flex-wrap",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs font-semibold text-gray-800 truncate max-w-[260px]",
                                                                                title: tradeDocument.name,
                                                                                children: tradeDocument.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                                lineNumber: 304,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            tradeDocument.mandatoryByDefault && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[9px] font-bold text-red-600 bg-red-50 px-1 py-0.5 rounded border border-red-100 flex-shrink-0",
                                                                                children: "Required"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                                lineNumber: 308,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                        lineNumber: 303,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    isUploading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mt-1.5 flex items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "h-1 w-28 bg-gray-100 rounded-full overflow-hidden",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "h-full bg-[#007aff] transition-all duration-300",
                                                                                    style: {
                                                                                        width: `${uploadProgress}%`
                                                                                    }
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                                    lineNumber: 318,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                                lineNumber: 317,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[10px] text-[#007aff] font-bold",
                                                                                children: [
                                                                                    uploadProgress,
                                                                                    "%"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                                lineNumber: 323,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                        lineNumber: 316,
                                                                        columnNumber: 31
                                                                    }, this) : uploaded && attachment ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mt-1 flex items-center gap-1.5 text-[10px] text-gray-400",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-medium text-gray-600 truncate max-w-[200px]",
                                                                                children: attachment.originalName
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                                lineNumber: 327,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            attachment.fileSize && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-gray-300",
                                                                                        children: "·"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                                        lineNumber: 331,
                                                                                        columnNumber: 37
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        children: formatSize(attachment.fileSize)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                                        lineNumber: 331,
                                                                                        columnNumber: 77
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                                lineNumber: 331,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            uploadDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-gray-300",
                                                                                        children: "·"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                                        lineNumber: 334,
                                                                                        columnNumber: 37
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        children: [
                                                                                            "Uploaded ",
                                                                                            uploadDate
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                                        lineNumber: 334,
                                                                                        columnNumber: 77
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                                lineNumber: 334,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                        lineNumber: 326,
                                                                        columnNumber: 31
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "mt-1 text-[10px] text-gray-400 italic",
                                                                        children: "No file uploaded"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                        lineNumber: 338,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                lineNumber: 302,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                        lineNumber: 291,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3 flex-shrink-0",
                                                        children: [
                                                            isUploading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "inline-flex items-center gap-1 text-[10px] text-[#007aff] font-bold",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                        className: "h-3 w-3 animate-spin"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                        lineNumber: 348,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    "Uploading"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                lineNumber: 347,
                                                                columnNumber: 29
                                                            }, this) : uploaded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "inline-flex items-center gap-1 text-[9px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded-md border border-green-100 whitespace-nowrap",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                        className: "h-3 w-3"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                        lineNumber: 353,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    "Uploaded"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                lineNumber: 352,
                                                                columnNumber: 29
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "inline-flex items-center gap-1 text-[9px] text-gray-500 font-semibold bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-100 whitespace-nowrap",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                                        className: "h-3 w-3 text-gray-400"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                        lineNumber: 358,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    "Pending"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                lineNumber: 357,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-0.5",
                                                                children: [
                                                                    uploaded && attachment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionBtn, {
                                                                        title: "View",
                                                                        colorClass: "hover:text-[#007aff] hover:bg-blue-50",
                                                                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                            className: "h-3.5 w-3.5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                            lineNumber: 370,
                                                                            columnNumber: 39
                                                                        }, this),
                                                                        onClick: ()=>handleDownload(attachment.downloadUrl, attachment.originalName, true)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                        lineNumber: 367,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    uploaded && attachment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionBtn, {
                                                                        title: "Download",
                                                                        colorClass: "hover:text-emerald-600 hover:bg-emerald-50",
                                                                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                            className: "h-3.5 w-3.5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                            lineNumber: 379,
                                                                            columnNumber: 39
                                                                        }, this),
                                                                        onClick: ()=>handleDownload(attachment.downloadUrl, attachment.originalName, false)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                        lineNumber: 376,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionBtn, {
                                                                        title: uploaded ? "Replace" : "Upload",
                                                                        colorClass: uploaded ? "hover:text-amber-600 hover:bg-amber-50" : "hover:text-[#007aff] hover:bg-blue-50",
                                                                        icon: uploaded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                                            className: "h-3.5 w-3.5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                            lineNumber: 387,
                                                                            columnNumber: 48
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$upload$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UploadCloud$3e$__["UploadCloud"], {
                                                                            className: "h-3.5 w-3.5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                            lineNumber: 387,
                                                                            columnNumber: 88
                                                                        }, this),
                                                                        onClick: ()=>handleUploadClick(tradeDocument.id)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                        lineNumber: 384,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    uploaded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionBtn, {
                                                                        title: "Delete",
                                                                        colorClass: "hover:text-red-500 hover:bg-red-50",
                                                                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                            className: "h-3.5 w-3.5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                            lineNumber: 395,
                                                                            columnNumber: 39
                                                                        }, this),
                                                                        onClick: ()=>setDeleteTarget({
                                                                                tradeDocumentId: tradeDocument.id,
                                                                                name: attachment?.originalName || tradeDocument.name
                                                                            })
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                        lineNumber: 392,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                                lineNumber: 364,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                        lineNumber: 344,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                lineNumber: 289,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "file",
                                                ref: (el)=>fileInputRefs.current[tradeDocument.id] = el,
                                                style: {
                                                    display: "none"
                                                },
                                                onChange: (e)=>onFileChange(e, tradeDocument.id)
                                            }, void 0, false, {
                                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                                lineNumber: 409,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, tradeDocument.id, true, {
                                        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                        lineNumber: 285,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                lineNumber: 274,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                            lineNumber: 252,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-shrink-0 px-5 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] text-gray-400",
                                    children: !loading && `${uploadedCount} of ${documents.length} documents uploaded`
                                }, void 0, false, {
                                    fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                    lineNumber: 424,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onClose,
                                    className: "px-4 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors",
                                    children: "Close"
                                }, void 0, false, {
                                    fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                                    lineNumber: 427,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                            lineNumber: 423,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                    lineNumber: 205,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
                lineNumber: 203,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx",
        lineNumber: 195,
        columnNumber: 5
    }, this);
}
_s1(DocumentUploadDrawer, "XfTCh/lISfyqwpmw1Hg6kazMFwg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEscapeKey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEscapeKey"]
    ];
});
_c3 = DocumentUploadDrawer;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "Tip");
__turbopack_context__.k.register(_c1, "ActionBtn");
__turbopack_context__.k.register(_c2, "ConfirmDialog");
__turbopack_context__.k.register(_c3, "DocumentUploadDrawer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/sales-contracts/services/salesContractApi.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mastersApi",
    ()=>mastersApi,
    "salesContractApi",
    ()=>salesContractApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
const salesContractApi = {
    getAll: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/sales-contracts", {
            params
        }),
    getOne: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/sales-contracts/${id}`),
    create: (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/sales-contracts", data),
    update: (id, data)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/sales-contracts/${id}`, data),
    updateStatus: (id, status)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/sales-contracts/${id}/status`, {
            status
        }),
    remove: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/sales-contracts/${id}`),
    // Preview the next auto-generated contract number (Agricom sellers only).
    // Prefix = <BuyerInitial><SellerCode>  — both buyer and seller are required.
    // Returns { contractNo: string | null }
    getNextContractNumber: (sellerId, buyerId, financialYear)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/sales-contracts/next-number", {
            params: {
                sellerId,
                buyerId,
                financialYear
            }
        }),
    // Document Endpoints
    getDocuments: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/sales-contracts/${id}/documents`),
    uploadDocument: (id, tradeDocumentId, data, onUploadProgress)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/sales-contracts/${id}/documents/${tradeDocumentId}/upload`, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress
        }),
    deleteDocument: (id, tradeDocumentId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/sales-contracts/${id}/documents/${tradeDocumentId}`),
    // Returns distinct financial years stored in the database for list filtering
    getFilterFinancialYears: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/sales-contracts/financial-years")
};
const mastersApi = {
    getShipmentTypes: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/shipment-types", {
            params
        }),
    getPaymentTerms: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/payment-terms", {
            params
        }),
    getTradeDocuments: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/trade-documents", {
            params
        }),
    getPartnerRoles: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/partner-roles", {
            params
        }),
    getPartners: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/partners", {
            params
        }),
    getPartnersOptions: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/partners/options", {
            params
        }),
    getProducts: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/products", {
            params
        }),
    getProductsOptions: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/products/options", {
            params
        }),
    getCountries: (params)=>Promise.resolve({
            data: {
                data: []
            }
        }),
    // bag-types and packing-types use isActive (boolean), not status
    getBagTypes: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/bag-types", {
            params: {
                isActive: true
            }
        }),
    getPackingTypes: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/packing-types", {
            params: {
                isActive: true
            }
        }),
    // bag-specifications uses isActive param
    getBagSpecs: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/bag-specifications", {
            params: {
                isActive: true,
                limit: 100
            }
        }),
    getStitchingTypes: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/stitching-types").catch(()=>({
                data: []
            })),
    getMarkingTypes: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/marking-types").catch(()=>({
                data: []
            })),
    getCurrencies: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/currencies", {
            params
        }),
    createCurrency: (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/masters/currencies", data),
    updateCurrency: (id, data)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/masters/currencies/${id}`, data),
    toggleCurrency: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/masters/currencies/${id}/toggle`),
    deleteCurrency: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/masters/currencies/${id}`)
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/sales-contracts/utils/formatUtils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Utility functions for clean number formatting in Sales Contracts.
 */ /**
 * Strips redundant trailing zero decimals from numbers or strings.
 * e.g. "88.00" -> 88, "22.00" -> 22, "1936.00" -> 1936, "22.50" -> 22.5, null -> ""
 */ __turbopack_context__.s([
    "INCOTERM_SHORT_FORMS",
    ()=>INCOTERM_SHORT_FORMS,
    "cleanNumberValue",
    ()=>cleanNumberValue,
    "formatInputVal",
    ()=>formatInputVal,
    "formatNumberDisplay",
    ()=>formatNumberDisplay,
    "getShipmentTypeShortForm",
    ()=>getShipmentTypeShortForm
]);
const cleanNumberValue = (val)=>{
    if (val === null || val === undefined || val === "") return "";
    const num = Number(val);
    return isNaN(num) ? val : num;
};
const formatInputVal = (val)=>{
    if (val === null || val === undefined || val === "") return "";
    if (typeof val === "string" && val.endsWith(".00")) {
        const num = Number(val);
        return isNaN(num) ? val : num;
    }
    return val;
};
const formatNumberDisplay = (val, maxDecimals = 2)=>{
    if (val === null || val === undefined || val === "") return "0";
    const num = Number(val);
    if (isNaN(num)) return String(val);
    return num.toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: maxDecimals
    });
};
const INCOTERM_SHORT_FORMS = {
    "DELIVERY AT PLACE": "DAP",
    "DELIVERED AT PLACE": "DAP",
    "COST INSURANCE AND FREIGHT": "CIF",
    "COST INSURANCE & FREIGHT": "CIF",
    "COST AND FREIGHT": "CFR",
    "COST & FREIGHT": "CFR",
    "FREE ONBOARD": "FOB",
    "FREE ON BOARD": "FOB",
    "FREE CARRIER ALONGSIDE": "FAS",
    "FREE ALONGSIDE SHIP": "FAS",
    "FREE CARRIER": "FCA",
    "EX WORKS": "EXW",
    "CARRIAGE PAID TO": "CPT",
    "CARRIAGE AND INSURANCE PAID TO": "CIP",
    "DELIVERED AT TERMINAL": "DAT",
    "DELIVERED AT PLACE UNLOADED": "DPU",
    "DELIVERED DUTY PAID": "DDP"
};
const getShipmentTypeShortForm = (item)=>{
    if (!item) return "";
    if (typeof item === "string") {
        const trimmed = item.trim();
        const upper = trimmed.toUpperCase();
        if (INCOTERM_SHORT_FORMS[upper]) return INCOTERM_SHORT_FORMS[upper];
        if (trimmed.length <= 5 && !trimmed.includes(" ")) return upper;
        return trimmed;
    }
    const code = typeof item.code === "string" ? item.code.trim().toUpperCase() : "";
    const name = typeof item.name === "string" ? item.name.trim() : "";
    const nameUpper = name.toUpperCase();
    if (code && code.length <= 6) {
        return code;
    }
    if (nameUpper && INCOTERM_SHORT_FORMS[nameUpper]) {
        return INCOTERM_SHORT_FORMS[nameUpper];
    }
    return code || name || "";
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/sales-contracts/utils/quantityUtils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Utility functions for generating dynamic Quantity descriptions for Sales Contracts
 * following international trade documentation standards.
 */ /**
 * Normalizes transport mode to standard enum keys: 'ROAD', 'SEA', 'BULK', 'RAIL', 'AIR'
 */ __turbopack_context__.s([
    "formatContainerType",
    ()=>formatContainerType,
    "formatQuantityNumber",
    ()=>formatQuantityNumber,
    "formatTolerancePercentage",
    ()=>formatTolerancePercentage,
    "generateQuantityDescription",
    ()=>generateQuantityDescription,
    "getContractItemQuantityDescription",
    ()=>getContractItemQuantityDescription,
    "getContractTransportMode",
    ()=>getContractTransportMode,
    "getTransportUnitName",
    ()=>getTransportUnitName,
    "normalizeTransportMode",
    ()=>normalizeTransportMode
]);
function normalizeTransportMode(mode) {
    if (!mode) return "SEA";
    const m = String(mode).trim().toLowerCase();
    if (m.includes("bulk")) return "BULK";
    if (m.includes("road") || m.includes("truck")) return "ROAD";
    if (m.includes("sea") || m.includes("ocean") || m.includes("fcl") || m.includes("container") || m.includes("ship")) {
        return "SEA";
    }
    if (m.includes("rail") || m.includes("wagon")) return "RAIL";
    if (m.includes("air") || m.includes("flight")) return "AIR";
    return "OTHER";
}
function getContractTransportMode(contract = {}) {
    return normalizeTransportMode(contract.originTransportMode || contract.destinationTransportMode || contract.transportMode || "SEA");
}
function formatContainerType(containerType) {
    if (!containerType) return "40 FEET";
    const raw = String(containerType).trim().toUpperCase();
    if (raw.includes("20")) return "20 FEET";
    if (raw.includes("40") && (raw.includes("HC") || raw.includes("HIGH"))) return "40 HC FEET";
    if (raw.includes("40")) return "40 FEET";
    return raw;
}
function formatQuantityNumber(val) {
    if (val == null || val === "") return "0";
    const num = typeof val === "number" ? val : parseFloat(String(val));
    if (isNaN(num)) return "0";
    if (num % 1 === 0) {
        return String(Math.round(num));
    }
    return num.toFixed(2);
}
function formatTolerancePercentage(tol) {
    if (tol == null || tol === "") return "5%";
    const num = typeof tol === "number" ? tol : parseFloat(String(tol));
    if (isNaN(num)) return "5%";
    return num % 1 === 0 ? `${Math.round(num)}%` : `${num.toFixed(2)}%`;
}
function getTransportUnitName(transportMode, isPlural = false) {
    const mode = normalizeTransportMode(transportMode);
    switch(mode){
        case "ROAD":
            return isPlural ? "Trucks" : "Truck";
        case "SEA":
            return isPlural ? "Containers" : "Container";
        case "BULK":
            return isPlural ? "Holds" : "Hold";
        case "RAIL":
            return isPlural ? "Wagons" : "Wagon";
        case "AIR":
            return isPlural ? "Shipments" : "Shipment";
        default:
            return isPlural ? "Units" : "Unit";
    }
}
function generateQuantityDescription({ transportMode, unitCount, containerType, qtyPerUnit, totalQuantity, tolerancePercentage } = {}) {
    const totalQty = typeof totalQuantity === "number" ? totalQuantity : parseFloat(String(totalQuantity ?? 0)) || 0;
    const unitQty = typeof qtyPerUnit === "number" ? qtyPerUnit : parseFloat(String(qtyPerUnit ?? 0)) || 0;
    let uCount = unitCount != null && unitCount !== "" ? typeof unitCount === "number" ? unitCount : parseFloat(String(unitCount)) || 0 : 0;
    // Auto-calculate unit count if not provided but total and per-unit exist
    if (!uCount && totalQty > 0 && unitQty > 0) {
        uCount = Math.round(totalQty / unitQty);
    }
    const mode = normalizeTransportMode(transportMode);
    const totalStr = formatQuantityNumber(totalQty);
    const tolStr = formatTolerancePercentage(tolerancePercentage);
    // 1. Bulk Vessel
    if (mode === "BULK") {
        return `TOTAL ABOUT ${totalStr} MT +/- ${tolStr} IN BULK`;
    }
    const unitQtyStr = formatQuantityNumber(unitQty);
    // 2. Road Transport
    if (mode === "ROAD") {
        if (uCount > 0 && unitQty > 0) {
            const truckLabel = uCount === 1 ? "TRUCK" : "TRUCKS";
            return `${uCount} ${truckLabel} OF ${unitQtyStr} MT EACH, TOTAL ABOUT ${totalStr} MT +/- ${tolStr}`;
        }
        return `TOTAL ABOUT ${totalStr} MT +/- ${tolStr}`;
    }
    // 3. Sea Shipment (FCL)
    if (mode === "SEA") {
        const contType = formatContainerType(containerType);
        if (uCount > 0 && unitQty > 0) {
            return `${uCount} FCL OF ${contType}, ${unitQtyStr} MT EACH, TOTAL ABOUT ${totalStr} MT +/- ${tolStr}`;
        }
        return `TOTAL ABOUT ${totalStr} MT +/- ${tolStr}`;
    }
    // 4. Rail Freight / Wagon
    if (mode === "RAIL") {
        if (uCount > 0 && unitQty > 0) {
            const wagonLabel = uCount === 1 ? "WAGON" : "WAGONS";
            return `${uCount} ${wagonLabel} OF ${unitQtyStr} MT EACH, TOTAL ABOUT ${totalStr} MT +/- ${tolStr}`;
        }
        return `TOTAL ABOUT ${totalStr} MT +/- ${tolStr}`;
    }
    // 5. Air Freight
    if (mode === "AIR") {
        if (uCount > 0 && unitQty > 0) {
            const airLabel = uCount === 1 ? "AIR SHIPMENT" : "AIR SHIPMENTS";
            return `${uCount} ${airLabel} OF ${unitQtyStr} MT EACH, TOTAL ABOUT ${totalStr} MT +/- ${tolStr}`;
        }
        return `TOTAL ABOUT ${totalStr} MT +/- ${tolStr}`;
    }
    // Fallback
    if (uCount > 0 && unitQty > 0) {
        const unitLabel = uCount === 1 ? "UNIT" : "UNITS";
        return `${uCount} ${unitLabel} OF ${unitQtyStr} MT EACH, TOTAL ABOUT ${totalStr} MT +/- ${tolStr}`;
    }
    return `TOTAL ABOUT ${totalStr} MT +/- ${tolStr}`;
}
function getContractItemQuantityDescription(contract = {}, item = {}) {
    const mode = getContractTransportMode({
        ...contract,
        transportMode: contract.originTransportMode || contract.destinationTransportMode || contract.transportMode || item.transportMode
    });
    const totalQuantity = parseFloat(item.quantity) || (contract.shipments || []).reduce((sum, s)=>sum + (parseFloat(s.quantity) || 0), 0) || parseFloat(contract.totalQuantity) || 0;
    const shipments = contract.shipments || [];
    const shipmentCount = shipments.length;
    const totalContainers = shipments.reduce((sum, s)=>sum + (parseInt(s.noOfContainers, 10) || 0), 0);
    const firstShipmentQty = parseFloat(shipments[0]?.quantity) || 0;
    const itemQtyPerCount = parseFloat(item.qtyPerCount) || 0;
    let unitCount = 0;
    let qtyPerUnit = 0;
    if (mode === "ROAD") {
        // ROAD TRANSPORT:
        // Number of Shipments = Number of Trucks
        // Qty (MT) = Quantity per Truck
        if (shipmentCount > 0) {
            unitCount = totalContainers > shipmentCount ? totalContainers : shipmentCount;
            qtyPerUnit = firstShipmentQty > 0 ? firstShipmentQty : itemQtyPerCount > 0 ? itemQtyPerCount : totalQuantity / unitCount;
        } else if (totalQuantity > 0 && itemQtyPerCount > 0) {
            unitCount = Math.round(totalQuantity / itemQtyPerCount);
            qtyPerUnit = itemQtyPerCount;
        } else {
            unitCount = parseInt(item.unitCount, 10) || 1;
            qtyPerUnit = itemQtyPerCount > 0 ? itemQtyPerCount : totalQuantity;
        }
    } else if (mode === "SEA") {
        // SEA (FCL):
        // Container count from Shipment Schedule, Container Type, Qty Per Shipment
        if (shipmentCount > 0) {
            unitCount = totalContainers > 0 ? totalContainers : shipmentCount;
            qtyPerUnit = firstShipmentQty > 0 ? firstShipmentQty : itemQtyPerCount > 0 ? itemQtyPerCount : totalQuantity / unitCount;
        } else if (totalQuantity > 0 && itemQtyPerCount > 0) {
            unitCount = Math.round(totalQuantity / itemQtyPerCount);
            qtyPerUnit = itemQtyPerCount;
        } else {
            unitCount = parseInt(item.unitCount, 10) || 1;
            qtyPerUnit = itemQtyPerCount > 0 ? itemQtyPerCount : totalQuantity;
        }
    } else if (mode === "BULK") {
        unitCount = shipmentCount > 0 ? shipmentCount : 1;
        qtyPerUnit = totalQuantity;
    } else {
        // Rail / Air / Other
        if (shipmentCount > 0) {
            unitCount = totalContainers > 0 ? totalContainers : shipmentCount;
            qtyPerUnit = firstShipmentQty > 0 ? firstShipmentQty : itemQtyPerCount > 0 ? itemQtyPerCount : totalQuantity / unitCount;
        } else if (totalQuantity > 0 && itemQtyPerCount > 0) {
            unitCount = Math.round(totalQuantity / itemQtyPerCount);
            qtyPerUnit = itemQtyPerCount;
        } else {
            unitCount = parseInt(item.unitCount, 10) || 1;
            qtyPerUnit = itemQtyPerCount > 0 ? itemQtyPerCount : totalQuantity;
        }
    }
    // Container Type (only for Sea)
    let containerType = item.containerType || contract.containerType;
    if (!containerType) {
        const p = item.product || {};
        const pCont = p.containerType || p.containerSize;
        if (pCont) {
            containerType = pCont;
        } else if (p.qty20ftContainer && Math.abs(qtyPerUnit - parseFloat(p.qty20ftContainer)) < 0.5) {
            containerType = "20 FEET";
        } else if (p.qty40ftContainer && Math.abs(qtyPerUnit - parseFloat(p.qty40ftContainer)) < 0.5) {
            containerType = "40 FEET";
        } else {
            containerType = "40 FEET";
        }
    }
    const tolerancePercentage = item.tolerancePercentage !== undefined && item.tolerancePercentage !== null ? item.tolerancePercentage : contract.tolerancePercentage ?? 5;
    return generateQuantityDescription({
        transportMode: mode,
        unitCount,
        containerType,
        qtyPerUnit,
        totalQuantity,
        tolerancePercentage
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_modules_sales-contracts_0z4m0ww._.js.map