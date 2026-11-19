(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/sales/shipments/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$pages$2f$ShipmentListPage$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shipments/pages/ShipmentListPage.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ShipmentsPageContent() {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const shipmentId = searchParams.get("shipmentId") || null;
    const openCargo = searchParams.get("openCargo") === "true";
    const openFreight = searchParams.get("openFreight") === "true";
    const contractNo = searchParams.get("contractNo") || null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$pages$2f$ShipmentListPage$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        preSelectedShipmentId: shipmentId,
        preOpenCargo: openCargo,
        preOpenFreight: openFreight,
        contextContractNo: contractNo
    }, void 0, false, {
        fileName: "[project]/src/app/sales/shipments/page.jsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_s(ShipmentsPageContent, "a+DZx9DY26Zf8FVy1bxe3vp9l1w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = ShipmentsPageContent;
function Page() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-[400px]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs font-semibold text-gray-400",
                children: "Loading shipments..."
            }, void 0, false, {
                fileName: "[project]/src/app/sales/shipments/page.jsx",
                lineNumber: 29,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/sales/shipments/page.jsx",
            lineNumber: 28,
            columnNumber: 9
        }, this),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ShipmentsPageContent, {}, void 0, false, {
            fileName: "[project]/src/app/sales/shipments/page.jsx",
            lineNumber: 33,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/sales/shipments/page.jsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_c1 = Page;
var _c, _c1;
__turbopack_context__.k.register(_c, "ShipmentsPageContent");
__turbopack_context__.k.register(_c1, "Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/common/BusinessReference.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BusinessReference
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.mjs [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$clipboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/clipboard.js [app-client] (ecmascript)");
"use client";
;
;
;
;
;
function BusinessReference({ reference, className = "" }) {
    if (!reference) return null;
    const handleCopy = async ()=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$clipboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["copyToClipboard"])(reference);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Reference No. copied");
        } catch (error) {
            console.error("Failed to copy reference number", error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Unable to copy reference number");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-center gap-2 min-w-0 ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[15px] font-semibold text-[#007aff] truncate",
                children: reference
            }, void 0, false, {
                fileName: "[project]/src/components/common/BusinessReference.jsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: handleCopy,
                className: "shrink-0 p-0.5 text-[#007aff] hover:text-blue-700 transition-colors cursor-pointer",
                title: "Copy Reference No.",
                "aria-label": "Copy Reference No.",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/common/BusinessReference.jsx",
                    lineNumber: 32,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/common/BusinessReference.jsx",
                lineNumber: 25,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/common/BusinessReference.jsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_c = BusinessReference;
var _c;
__turbopack_context__.k.register(_c, "BusinessReference");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/common/CountrySelect.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CountrySelect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$creatable$2f$dist$2f$react$2d$select$2d$creatable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-select/creatable/dist/react-select-creatable.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$countryUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/countryUtils.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function CountrySelect({ value, onChange, error, className, placeholder = "Search country..." }) {
    _s();
    const [inputValue, setInputValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [customCountries, setCustomCountries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Load custom countries from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CountrySelect.useEffect": ()=>{
            try {
                const local = localStorage.getItem("customCountries");
                if (local) {
                    setCustomCountries(JSON.parse(local));
                }
            } catch (e) {}
        }
    }["CountrySelect.useEffect"], []);
    // 1. Generate sorted country options combining base and custom
    const countryOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CountrySelect.useMemo[countryOptions]": ()=>{
            const base = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$countryUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAllCountryOptions"])();
            const seen = new Set(base.map({
                "CountrySelect.useMemo[countryOptions]": (o)=>o.label.toLowerCase()
            }["CountrySelect.useMemo[countryOptions]"]));
            const extras = customCountries.filter({
                "CountrySelect.useMemo[countryOptions].extras": (o)=>!seen.has(o.label.toLowerCase())
            }["CountrySelect.useMemo[countryOptions].extras"]);
            return [
                ...base,
                ...extras
            ].sort({
                "CountrySelect.useMemo[countryOptions]": (a, b)=>a.label.localeCompare(b.label)
            }["CountrySelect.useMemo[countryOptions]"]);
        }
    }["CountrySelect.useMemo[countryOptions]"], [
        customCountries
    ]);
    // 2. Dynamically filter & rank options based on search query so prefix & ISO matches come first
    const filteredOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CountrySelect.useMemo[filteredOptions]": ()=>{
            if (!inputValue || !inputValue.trim()) return countryOptions;
            const q = inputValue.toLowerCase().trim();
            const getOptionRank = {
                "CountrySelect.useMemo[filteredOptions].getOptionRank": (opt)=>{
                    const label = opt.label.toLowerCase();
                    const alpha2 = (opt.alpha2 || "").toLowerCase();
                    const alpha3 = (opt.alpha3 || "").toLowerCase();
                    // Rank 1: Exact ISO code match or exact country name
                    if (alpha2 === q || alpha3 === q || label === q) return 1;
                    // Rank 2: Starts with query (e.g. "China", "India", "Indonesia")
                    if (label.startsWith(q)) return 2;
                    // Rank 2: Common country aliases (e.g., "uk", "usa", "uae", "prc", "china")
                    const aliasedCode = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$countryUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COUNTRY_ALIASES"][q];
                    if (aliasedCode && aliasedCode.toLowerCase() === alpha2) return 2;
                    if (q === "china" && alpha2 === "cn") return 2;
                    if (q === "prc" && alpha2 === "cn") return 2;
                    if (q === "uk" && (alpha2 === "gb" || label.includes("united kingdom"))) return 2;
                    if (q === "usa" && (alpha2 === "us" || label.includes("united states"))) return 2;
                    if (q === "uae" && (alpha2 === "ae" || label.includes("united arab emirates"))) return 2;
                    // Rank 3: Word boundary prefix match (e.g. "Emirates" in "United Arab Emirates")
                    const words = label.split(/[\s,()]+/);
                    if (words.some({
                        "CountrySelect.useMemo[filteredOptions].getOptionRank": (w)=>w.startsWith(q)
                    }["CountrySelect.useMemo[filteredOptions].getOptionRank"])) return 3;
                    // Rank 4: General substring match (e.g. "Argentina" for "in")
                    if (label.includes(q)) return 4;
                    return 0; // No match
                }
            }["CountrySelect.useMemo[filteredOptions].getOptionRank"];
            const scored = [];
            for (const opt of countryOptions){
                const rank = getOptionRank(opt);
                if (rank > 0) {
                    scored.push({
                        opt,
                        rank
                    });
                }
            }
            scored.sort({
                "CountrySelect.useMemo[filteredOptions]": (a, b)=>{
                    if (a.rank !== b.rank) return a.rank - b.rank;
                    return a.opt.label.localeCompare(b.opt.label);
                }
            }["CountrySelect.useMemo[filteredOptions]"]);
            return scored.map({
                "CountrySelect.useMemo[filteredOptions]": (item)=>item.opt
            }["CountrySelect.useMemo[filteredOptions]"]);
        }
    }["CountrySelect.useMemo[filteredOptions]"], [
        countryOptions,
        inputValue
    ]);
    // 3. Map current string or object value from parent state to select option object
    const selectedOption = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CountrySelect.useMemo[selectedOption]": ()=>{
            const rawVal = typeof value === "object" && value !== null ? value.name : value;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$countryUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findCountryOption"])(rawVal, countryOptions);
        }
    }["CountrySelect.useMemo[selectedOption]"], [
        value,
        countryOptions
    ]);
    // 4. Handle selection change
    const handleChange = (selected)=>{
        if (!selected) {
            onChange({
                name: "",
                iso2Code: "",
                iso3Code: "",
                isCustom: false
            });
            return;
        }
        if (selected.__isNew__ || selected.isCustom) {
            // Custom country - clears ISO codes
            onChange({
                name: selected.value,
                iso2Code: "",
                iso3Code: "",
                isCustom: true
            });
        } else {
            // Standard country - auto-populates correct ISO codes
            onChange({
                name: selected.label,
                iso2Code: selected.alpha2,
                iso3Code: selected.alpha3,
                isCustom: false
            });
        }
    };
    const handleCreate = async (val)=>{
        const name = val.trim();
        if (!name) return;
        const newOpt = {
            label: name,
            value: name,
            alpha2: "",
            alpha3: "",
            isCustom: true
        };
        setCustomCountries((prev)=>{
            const next = [
                ...prev,
                newOpt
            ];
            localStorage.setItem("customCountries", JSON.stringify(next));
            return next;
        });
        onChange({
            name: name,
            iso2Code: "",
            iso3Code: "",
            isCustom: true
        });
    };
    const handleInputChange = (val, { action })=>{
        if (action === "input-change") {
            setInputValue(val);
        } else if (action === "input-blur" || action === "menu-close") {
            setInputValue("");
        }
    };
    // 5. Premium theme styles matching existing tailwind input elements
    const customStyles = {
        control: (base, state)=>({
                ...base,
                borderColor: error ? "#ef4444" : state.isFocused ? "#007aff" : "#e2e8f0",
                borderRadius: "0.75rem",
                fontSize: "12px",
                boxShadow: "none",
                minHeight: "38px",
                "&:hover": {
                    borderColor: error ? "#ef4444" : state.isFocused ? "#007aff" : "#cbd5e1"
                }
            }),
        option: (base, state)=>({
                ...base,
                backgroundColor: state.isSelected ? "#007aff" : state.isFocused ? "#f8fafc" : "white",
                color: state.isSelected ? "white" : "#334155",
                fontSize: "12px",
                cursor: "pointer"
            }),
        menuPortal: (base)=>({
                ...base,
                zIndex: 9999
            })
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$creatable$2f$dist$2f$react$2d$select$2d$creatable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
        isClearable: true,
        options: filteredOptions,
        value: selectedOption,
        onChange: handleChange,
        onCreateOption: handleCreate,
        onInputChange: handleInputChange,
        inputValue: inputValue,
        filterOption: ()=>true,
        menuPortalTarget: typeof document !== "undefined" ? document.body : null,
        menuPosition: "fixed",
        styles: customStyles,
        placeholder: placeholder,
        formatCreateLabel: (val)=>`+ Add "${val}"`,
        className: className
    }, void 0, false, {
        fileName: "[project]/src/components/common/CountrySelect.jsx",
        lineNumber: 163,
        columnNumber: 5
    }, this);
}
_s(CountrySelect, "OK/lu0kntKU3nzMKbiozgxG40xk=");
_c = CountrySelect;
var _c;
__turbopack_context__.k.register(_c, "CountrySelect");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/common/Pagination.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Pagination
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.mjs [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-left.mjs [app-client] (ecmascript) <export default as ChevronsLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-right.mjs [app-client] (ecmascript) <export default as ChevronsRight>");
;
;
;
function Pagination({ currentPage = 1, totalPages = 1, onPageChange, totalItems, itemsPerPage = 10, onLimitChange, itemName = "items", limitOptions = [
    10,
    20,
    50,
    100
] }) {
    const total = typeof totalItems === "number" ? totalItems : null;
    const page = Math.max(1, Number(currentPage) || 1);
    const pages = Math.max(1, Number(totalPages) || 1);
    const limit = Number(itemsPerPage) || 10;
    // Calculate range text
    let rangeText = "";
    if (total !== null) {
        if (total === 0) {
            rangeText = `0 ${itemName}`;
        } else {
            const start = (page - 1) * limit + 1;
            const end = Math.min(page * limit, total);
            rangeText = `Showing ${start}–${end} of ${total} ${itemName}`;
        }
    } else {
        rangeText = `Page ${page} of ${pages}`;
    }
    // Generate visible page numbers algorithm
    const getPageNumbers = ()=>{
        const delta = 1;
        const range = [];
        const rangeWithDots = [];
        let l;
        for(let i = 1; i <= pages; i++){
            if (i === 1 || i === pages || i >= page - delta && i <= page + delta) {
                range.push(i);
            }
        }
        for (let i of range){
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push("...");
                }
            }
            rangeWithDots.push(i);
            l = i;
        }
        return rangeWithDots;
    };
    const pageNumbers = getPageNumbers();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-w-0 px-3 sm:px-5 py-3 border-t border-gray-100 bg-gray-50/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 font-medium select-none",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0 max-w-full flex items-center gap-3 sm:gap-4 flex-wrap",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "max-w-full truncate text-gray-600 font-semibold",
                        children: rangeText
                    }, void 0, false, {
                        fileName: "[project]/src/components/common/Pagination.jsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    onLimitChange && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 text-[11px] text-gray-400",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Show:"
                            }, void 0, false, {
                                fileName: "[project]/src/components/common/Pagination.jsx",
                                lineNumber: 71,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: limit,
                                onChange: (e)=>onLimitChange(Number(e.target.value)),
                                className: "bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] cursor-pointer",
                                children: limitOptions.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: opt,
                                        children: [
                                            opt,
                                            " / page"
                                        ]
                                    }, opt, true, {
                                        fileName: "[project]/src/components/common/Pagination.jsx",
                                        lineNumber: 78,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/common/Pagination.jsx",
                                lineNumber: 72,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/common/Pagination.jsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/common/Pagination.jsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-full flex items-center justify-center gap-1 flex-wrap",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        disabled: page <= 1,
                        onClick: ()=>onPageChange(1),
                        className: "p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed",
                        title: "First Page",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsLeft$3e$__["ChevronsLeft"], {
                            className: "h-3.5 w-3.5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/common/Pagination.jsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/common/Pagination.jsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        disabled: page <= 1,
                        onClick: ()=>onPageChange(Math.max(page - 1, 1)),
                        className: "px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-1 font-semibold text-[11px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                className: "h-3.5 w-3.5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/common/Pagination.jsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Prev"
                            }, void 0, false, {
                                fileName: "[project]/src/components/common/Pagination.jsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/common/Pagination.jsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1 mx-1",
                        children: pageNumbers.map((p, idx)=>{
                            if (p === "...") {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "px-1.5 text-gray-400 font-bold",
                                    children: "..."
                                }, `dots-${idx}`, false, {
                                    fileName: "[project]/src/components/common/Pagination.jsx",
                                    lineNumber: 114,
                                    columnNumber: 17
                                }, this);
                            }
                            const isCurrent = p === page;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onPageChange(p),
                                className: `min-w-[28px] h-7 px-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center ${isCurrent ? "bg-[#007aff] text-white shadow-xs" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`,
                                children: p
                            }, p, false, {
                                fileName: "[project]/src/components/common/Pagination.jsx",
                                lineNumber: 121,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/common/Pagination.jsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        disabled: page >= pages,
                        onClick: ()=>onPageChange(Math.min(page + 1, pages)),
                        className: "px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-1 font-semibold text-[11px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Next"
                            }, void 0, false, {
                                fileName: "[project]/src/components/common/Pagination.jsx",
                                lineNumber: 142,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                className: "h-3.5 w-3.5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/common/Pagination.jsx",
                                lineNumber: 143,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/common/Pagination.jsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        disabled: page >= pages,
                        onClick: ()=>onPageChange(pages),
                        className: "p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed",
                        title: "Last Page",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsRight$3e$__["ChevronsRight"], {
                            className: "h-3.5 w-3.5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/common/Pagination.jsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/common/Pagination.jsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/common/Pagination.jsx",
                lineNumber: 88,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/common/Pagination.jsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
_c = Pagination;
var _c;
__turbopack_context__.k.register(_c, "Pagination");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/editor/RichTextEditor.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RichTextEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/react/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$starter$2d$kit$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/starter-kit/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$placeholder$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-placeholder/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$mention$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tiptap/extension-mention/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/maximize-2.mjs [app-client] (ecmascript) <export default as Maximize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minimize-2.mjs [app-client] (ecmascript) <export default as Minimize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEscapeKey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useEscapeKey.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
// Simple toolbar for the editor
const MenuBar = ({ editor, isFullscreen, toggleFullscreen })=>{
    if (!editor) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-wrap items-center justify-between gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center gap-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>editor.chain().focus().toggleBold().run(),
                        disabled: !editor.can().chain().focus().toggleBold().run(),
                        className: `px-2 py-1 text-sm rounded ${editor.isActive('bold') ? 'bg-gray-200 text-gray-900 font-bold' : 'text-gray-600 hover:bg-gray-100'}`,
                        children: "Bold"
                    }, void 0, false, {
                        fileName: "[project]/src/components/editor/RichTextEditor.jsx",
                        lineNumber: 20,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>editor.chain().focus().toggleItalic().run(),
                        disabled: !editor.can().chain().focus().toggleItalic().run(),
                        className: `px-2 py-1 text-sm rounded ${editor.isActive('italic') ? 'bg-gray-200 text-gray-900 italic' : 'text-gray-600 hover:bg-gray-100'}`,
                        children: "Italic"
                    }, void 0, false, {
                        fileName: "[project]/src/components/editor/RichTextEditor.jsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>editor.chain().focus().toggleStrike().run(),
                        disabled: !editor.can().chain().focus().toggleStrike().run(),
                        className: `px-2 py-1 text-sm rounded ${editor.isActive('strike') ? 'bg-gray-200 text-gray-900 line-through' : 'text-gray-600 hover:bg-gray-100'}`,
                        children: "Strike"
                    }, void 0, false, {
                        fileName: "[project]/src/components/editor/RichTextEditor.jsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-px h-4 bg-gray-300 mx-1"
                    }, void 0, false, {
                        fileName: "[project]/src/components/editor/RichTextEditor.jsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>editor.chain().focus().toggleBulletList().run(),
                        className: `px-2 py-1 text-sm rounded ${editor.isActive('bulletList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`,
                        children: "Bullet List"
                    }, void 0, false, {
                        fileName: "[project]/src/components/editor/RichTextEditor.jsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>editor.chain().focus().toggleOrderedList().run(),
                        className: `px-2 py-1 text-sm rounded ${editor.isActive('orderedList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`,
                        children: "Ordered List"
                    }, void 0, false, {
                        fileName: "[project]/src/components/editor/RichTextEditor.jsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>editor.chain().focus().toggleBlockquote().run(),
                        className: `px-2 py-1 text-sm rounded ${editor.isActive('blockquote') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`,
                        children: "Quote"
                    }, void 0, false, {
                        fileName: "[project]/src/components/editor/RichTextEditor.jsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/editor/RichTextEditor.jsx",
                lineNumber: 19,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: toggleFullscreen,
                type: "button",
                title: isFullscreen ? "Exit Fullscreen" : "Fullscreen",
                className: "p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded",
                children: isFullscreen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__["Minimize2"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/editor/RichTextEditor.jsx",
                    lineNumber: 67,
                    columnNumber: 25
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__["Maximize2"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/editor/RichTextEditor.jsx",
                    lineNumber: 67,
                    columnNumber: 61
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/editor/RichTextEditor.jsx",
                lineNumber: 61,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/editor/RichTextEditor.jsx",
        lineNumber: 18,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = MenuBar;
function RichTextEditor({ value, onChange, editable = true, placeholder = 'Add a description...', outputFormat = 'html' }) {
    _s();
    const [isFullscreen, setIsFullscreen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEscapeKey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEscapeKey"])({
        "RichTextEditor.useEscapeKey": ()=>setIsFullscreen(false)
    }["RichTextEditor.useEscapeKey"], isFullscreen);
    const editor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEditor"])({
        extensions: [
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$starter$2d$kit$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].configure({
                link: {
                    openOnClick: false
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$extension$2d$placeholder$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].configure({
                placeholder
            })
        ],
        // Handle both HTML string (legacy tasks) and JSON object (new contracts)
        content: value || '',
        editable,
        immediatelyRender: false,
        onUpdate: {
            "RichTextEditor.useEditor[editor]": ({ editor })=>{
                if (!onChange) return;
                if (outputFormat === 'json') {
                    onChange(editor.getJSON());
                } else {
                    onChange(editor.getHTML());
                }
            }
        }["RichTextEditor.useEditor[editor]"],
        editorProps: {
            attributes: {
                class: 'prose max-w-none focus:outline-none min-h-[150px] p-4 text-sm'
            }
        }
    });
    // Sync value if changed from outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RichTextEditor.useEffect": ()=>{
            if (!editor || !value) return;
            const currentContent = outputFormat === 'json' ? editor.getJSON() : editor.getHTML();
            // Deep equality check for JSON is expensive, but we can do a simple stringify comparison
            // or just rely on TipTap's internal checks. 
            // To prevent cursor jumping, we only set content if it's vastly different.
            if (outputFormat === 'html' && value !== editor.getHTML()) {
                editor.commands.setContent(value || '');
            } else if (outputFormat === 'json' && JSON.stringify(value) !== JSON.stringify(editor.getJSON())) {
                editor.commands.setContent(value || '');
            }
        }
    }["RichTextEditor.useEffect"], [
        value,
        editor,
        outputFormat
    ]);
    // Fullscreen styling wrappers
    const containerStyle = isFullscreen ? 'fixed inset-0 z-[9999] p-4 md:p-8 bg-gray-900/60 backdrop-blur-sm flex flex-col' : `border rounded-lg overflow-hidden bg-white ${editable ? 'border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500' : 'border-transparent'}`;
    const innerStyle = isFullscreen ? 'bg-white rounded-xl shadow-2xl flex-1 flex flex-col overflow-hidden max-w-5xl mx-auto w-full' : 'flex flex-col h-full';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: containerStyle,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: innerStyle,
            children: [
                editable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MenuBar, {
                    editor: editor,
                    isFullscreen: isFullscreen,
                    toggleFullscreen: ()=>setIsFullscreen(!isFullscreen)
                }, void 0, false, {
                    fileName: "[project]/src/components/editor/RichTextEditor.jsx",
                    lineNumber: 132,
                    columnNumber: 22
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `flex-1 overflow-y-auto ${editable ? '' : 'pointer-events-none'}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["EditorContent"], {
                        editor: editor
                    }, void 0, false, {
                        fileName: "[project]/src/components/editor/RichTextEditor.jsx",
                        lineNumber: 134,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/editor/RichTextEditor.jsx",
                    lineNumber: 133,
                    columnNumber: 9
                }, this),
                editable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-3 py-1.5 text-[10px] text-gray-400 border-t border-gray-100 text-right bg-gray-50 flex-shrink-0",
                    children: [
                        editor?.getText().length || 0,
                        " characters"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/editor/RichTextEditor.jsx",
                    lineNumber: 137,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/editor/RichTextEditor.jsx",
            lineNumber: 131,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/editor/RichTextEditor.jsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
_s(RichTextEditor, "qOMhm0VMi+x4FzmGe6zH4hEi9gc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useEscapeKey$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEscapeKey"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tiptap$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEditor"]
    ];
});
_c1 = RichTextEditor;
var _c, _c1;
__turbopack_context__.k.register(_c, "MenuBar");
__turbopack_context__.k.register(_c1, "RichTextEditor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/countryUtils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COUNTRY_ALIASES",
    ()=>COUNTRY_ALIASES,
    "COUNTRY_NAME_OVERRIDES",
    ()=>COUNTRY_NAME_OVERRIDES,
    "default",
    ()=>__TURBOPACK__default__export__,
    "findCountryOption",
    ()=>findCountryOption,
    "getAllCountryOptions",
    ()=>getAllCountryOptions,
    "getAlpha2Code",
    ()=>getAlpha2Code,
    "getAlpha3Code",
    ()=>getAlpha3Code,
    "getCountryNameList",
    ()=>getCountryNameList,
    "normalizeCountryName",
    ()=>normalizeCountryName
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18n$2d$iso$2d$countries$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/i18n-iso-countries/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18n$2d$iso$2d$countries$2f$langs$2f$en$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/i18n-iso-countries/langs/en.json.[json].cjs [app-client] (ecmascript)");
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18n$2d$iso$2d$countries$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].registerLocale(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18n$2d$iso$2d$countries$2f$langs$2f$en$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const COUNTRY_NAME_OVERRIDES = {
    CN: "China",
    TW: "Taiwan",
    RU: "Russia",
    US: "United States",
    GB: "United Kingdom",
    KR: "South Korea",
    KP: "North Korea",
    VN: "Vietnam",
    SY: "Syria",
    IR: "Iran",
    LA: "Laos",
    BO: "Bolivia",
    VE: "Venezuela",
    TZ: "Tanzania",
    MD: "Moldova",
    CD: "Democratic Republic of the Congo",
    CG: "Republic of the Congo",
    CZ: "Czech Republic"
};
const COUNTRY_ALIASES = {
    "people's republic of china": "CN",
    "peoples republic of china": "CN",
    "prc": "CN",
    "china": "CN",
    "taiwan": "TW",
    "taiwan, province of china": "TW",
    "usa": "US",
    "united states of america": "US",
    "united states": "US",
    "uk": "GB",
    "united kingdom": "GB",
    "great britain": "GB",
    "uae": "AE",
    "united arab emirates": "AE",
    "russia": "RU",
    "russian federation": "RU",
    "vietnam": "VN",
    "viet nam": "VN",
    "south korea": "KR",
    "korea, republic of": "KR",
    "north korea": "KP",
    "korea, democratic people's republic of": "KP",
    "czech republic": "CZ",
    "czechia": "CZ"
};
function getAllCountryOptions() {
    const rawNames = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18n$2d$iso$2d$countries$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getNames("en");
    const options = Object.entries(rawNames).map(([alpha2, defaultName])=>{
        const name = COUNTRY_NAME_OVERRIDES[alpha2] || defaultName;
        return {
            label: name,
            value: name,
            alpha2: alpha2,
            alpha3: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18n$2d$iso$2d$countries$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].alpha2ToAlpha3(alpha2) || ""
        };
    });
    return options.sort((a, b)=>a.label.localeCompare(b.label));
}
function getCountryNameList() {
    return getAllCountryOptions().map((c)=>c.value);
}
function getAlpha2Code(val) {
    if (!val || typeof val !== "string") return "";
    const clean = val.trim().toLowerCase();
    if (COUNTRY_ALIASES[clean]) return COUNTRY_ALIASES[clean];
    const direct = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18n$2d$iso$2d$countries$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getAlpha2Code(val, "en");
    if (direct) return direct;
    return "";
}
function getAlpha3Code(val) {
    const alpha2 = getAlpha2Code(val);
    if (alpha2) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18n$2d$iso$2d$countries$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].alpha2ToAlpha3(alpha2) || "";
    }
    return "";
}
function normalizeCountryName(val) {
    if (!val || typeof val !== "string") return "";
    const alpha2 = getAlpha2Code(val);
    if (alpha2) {
        return COUNTRY_NAME_OVERRIDES[alpha2] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18n$2d$iso$2d$countries$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getName(alpha2, "en") || val;
    }
    return val;
}
function findCountryOption(val, options = null) {
    if (!val) return null;
    const rawString = typeof val === "object" && val !== null ? val.name || "" : String(val);
    if (!rawString || !rawString.trim()) return null;
    const opts = options || getAllCountryOptions();
    const vLower = rawString.trim().toLowerCase();
    // 1. Direct label match
    let matched = opts.find((opt)=>opt.label.toLowerCase() === vLower || opt.value.toLowerCase() === vLower);
    if (matched) return matched;
    // 2. Alias or ISO matching
    const alpha2 = getAlpha2Code(val);
    if (alpha2) {
        matched = opts.find((opt)=>opt.alpha2.toUpperCase() === alpha2.toUpperCase());
        if (matched) return matched;
    }
    // 3. Fallback custom option
    return {
        label: val,
        value: val,
        isCustom: true
    };
}
const __TURBOPACK__default__export__ = {
    getAllCountryOptions,
    getCountryNameList,
    getAlpha2Code,
    getAlpha3Code,
    normalizeCountryName,
    findCountryOption
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_1ke9_lr._.js.map