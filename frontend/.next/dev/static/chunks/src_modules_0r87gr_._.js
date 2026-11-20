(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/modules/logistics/services/logisticsApi.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "logisticsApi",
    ()=>logisticsApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
const logisticsApi = {
    getAll: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/logistics", {
            params
        }),
    hideEnquiry: (enquiryId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/logistics/enquiry/${enquiryId}/hide`),
    unhideEnquiry: (enquiryId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/logistics/enquiry/${enquiryId}/hide`),
    getAllFreightQuotes: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/logistics/quotes", {
            params
        }),
    getDetails: (enquiryId, shipmentId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/logistics/enquiry/${enquiryId}`, {
            params: shipmentId ? {
                shipmentId
            } : {}
        }),
    getShipmentWorkspace: (shipmentId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/logistics/shipments/${shipmentId}/workspace`),
    addFreightQuote: (id, data)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/logistics/${id}/quotes`, data),
    addDirectFreightQuote: (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/logistics/direct-quotes`, data),
    updateDirectFreightQuote: (quoteId, data)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/logistics/direct-quotes/${quoteId}`, data),
    deleteDirectFreightQuote: (quoteId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/logistics/direct-quotes/${quoteId}`),
    updateFreightQuote: (id, quoteId, data)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/logistics/${id}/quotes/${quoteId}`, data),
    deleteFreightQuote: (id, quoteId, shipmentId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/logistics/${id}/quotes/${quoteId}`, {
            params: shipmentId ? {
                shipmentId
            } : {}
        }),
    setPreferredQuote: (id, quoteId, shipmentId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/logistics/${id}/quotes/${quoteId}/preferred`, {}, {
            params: shipmentId ? {
                shipmentId
            } : {}
        }),
    updateStatus: (id, data)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/logistics/${id}/status`, data),
    executeShipment: (shipmentId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/logistics/shipments/${shipmentId}/execute`),
    generateShipment: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/logistics/${id}/generate-shipment`),
    // Polymorphic Attachments
    getAttachments: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/logistics/${id}/attachments`),
    uploadAttachment: (id, formData, companyId = 1)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/logistics/${id}/attachments`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "x-company-id": companyId.toString()
            }
        }),
    deleteAttachment: (id, attachmentId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/logistics/${id}/attachments/${attachmentId}`),
    // Timeline Activities
    getActivities: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/logistics/${id}/activity`)
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/logistics/utils/truckCapacity.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_TRUCK_CAPACITIES",
    ()=>DEFAULT_TRUCK_CAPACITIES,
    "canonicalCapacityKey",
    ()=>canonicalCapacityKey,
    "extractCapacityNumber",
    ()=>extractCapacityNumber,
    "normalizeAndDeduplicateCapacities",
    ()=>normalizeAndDeduplicateCapacities,
    "normalizeTruckCapacity",
    ()=>normalizeTruckCapacity
]);
const DEFAULT_TRUCK_CAPACITIES = [
    "1 MT",
    "2 MT",
    "3 MT",
    "5 MT",
    "7 MT",
    "9 MT",
    "10 MT",
    "12 MT",
    "15 MT",
    "18 MT",
    "20 MT",
    "25 MT",
    "30 MT",
    "35 MT",
    "40 MT"
];
function normalizeTruckCapacity(val) {
    if (val === null || val === undefined) return "";
    const str = String(val).trim();
    if (!str) return "";
    // 1. Direct regex for number optionally followed by unit
    const match = str.match(/^([\d.]+)\s*(?:mt|m\.t\.|metric\s*tons?|tonnes?|tons?)?\.?$/i);
    if (match) {
        const num = parseFloat(match[1]);
        if (!isNaN(num) && num > 0) {
            const formattedNum = Number.isInteger(num) ? String(num) : String(parseFloat(num.toFixed(2)));
            return `${formattedNum} MT`;
        }
    }
    // 2. Regex for prefix unit like 'MT 22' or 'Ton 22'
    const altMatch = str.match(/(?:mt|tons?|tonnes?)?\s*([\d.]+)/i);
    if (altMatch) {
        const num = parseFloat(altMatch[1]);
        if (!isNaN(num) && num > 0) {
            const formattedNum = Number.isInteger(num) ? String(num) : String(parseFloat(num.toFixed(2)));
            return `${formattedNum} MT`;
        }
    }
    // 3. If it ends with MT in some variation, ensure standard format
    if (/mt$/i.test(str)) {
        return str.replace(/mt$/i, "MT").replace(/\s+/g, " ").trim();
    }
    // 4. Default fallback: append MT if purely numeric or general string
    return `${str} MT`;
}
function extractCapacityNumber(val) {
    if (!val) return 0;
    const match = String(val).match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
}
function canonicalCapacityKey(val) {
    const norm = normalizeTruckCapacity(val);
    return norm.toLowerCase().replace(/[\s.]+/g, "");
}
function normalizeAndDeduplicateCapacities(list = []) {
    const seen = new Set();
    const result = [];
    for (const item of list){
        const norm = normalizeTruckCapacity(item);
        if (!norm) continue;
        const key = canonicalCapacityKey(norm);
        if (!seen.has(key)) {
            seen.add(key);
            result.push(norm);
        }
    }
    return result.sort((a, b)=>extractCapacityNumber(a) - extractCapacityNumber(b));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/purchase-contracts/services/purchaseContractApi.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "purchaseContractApi",
    ()=>purchaseContractApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
const purchaseContractApi = {
    getDashboard: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/purchase-contracts/dashboard"),
    getAll: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/purchase-contracts", {
            params
        }),
    create: (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/purchase-contracts", data),
    getOne: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/purchase-contracts/${id}`),
    getSummary: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/purchase-contracts/${id}/summary`),
    getTimeline: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/purchase-contracts/${id}/timeline`),
    update: (id, data)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/purchase-contracts/${id}`, data),
    updateStatus: (id, status)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/purchase-contracts/${id}/status`, {
            status
        }),
    remove: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/purchase-contracts/${id}`),
    clearDrafts: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/purchase-contracts/clear-drafts`),
    // Shipments
    getShipments: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/purchase-contracts/${id}/shipments`),
    addShipment: (id, shipmentId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/purchase-contracts/${id}/shipments`, {
            shipmentId
        }),
    removeShipment: (id, shipmentId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/purchase-contracts/${id}/shipments/${shipmentId}`),
    // Documents
    getDocuments: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/purchase-contracts/${id}/documents`),
    addRequiredDocument: (id, tradeDocumentId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/purchase-contracts/${id}/documents`, {
            tradeDocumentId
        }),
    uploadDocument: (id, tradeDocumentId, formData, companyId = 1)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/purchase-contracts/${id}/documents/${tradeDocumentId}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "x-company-id": companyId.toString()
            }
        }),
    deleteDocument: (id, tradeDocumentId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/purchase-contracts/${id}/documents/${tradeDocumentId}`),
    // Activity Log
    getActivity: (id, params)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/purchase-contracts/${id}/activity`, {
            params
        }),
    // Attachments
    getAttachments: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/purchase-contracts/${id}/attachments`),
    uploadAttachment: (id, formData, companyId = 1)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/purchase-contracts/${id}/attachments`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "x-company-id": companyId.toString()
            }
        }),
    deleteAttachment: (id, attachmentId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/purchase-contracts/${id}/attachments/${attachmentId}`)
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_modules_0r87gr_._.js.map