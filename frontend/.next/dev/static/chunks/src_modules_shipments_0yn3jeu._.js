(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/modules/shipments/pages/ShipmentListPage.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShipmentListPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ship$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ship$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ship.mjs [app-client] (ecmascript) <export default as Ship>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.mjs [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$boxes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Boxes$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/boxes.mjs [app-client] (ecmascript) <export default as Boxes>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.mjs [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$services$2f$shipmentsApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shipments/services/shipmentsApi.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$purchase$2d$contracts$2f$services$2f$purchaseContractApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/purchase-contracts/services/purchaseContractApi.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$components$2f$ShipmentsFilter$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shipments/components/ShipmentsFilter.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$components$2f$ShipmentsTable$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shipments/components/ShipmentsTable.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$components$2f$ShipmentDetailsDrawer$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shipments/components/ShipmentDetailsDrawer.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$components$2f$ShipmentEditModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shipments/components/ShipmentEditModal.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$sales$2d$contracts$2f$components$2f$ContractViewModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/sales-contracts/components/ContractViewModal.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$sales$2d$contracts$2f$components$2f$DocumentUploadDrawer$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/sales-contracts/components/DocumentUploadDrawer.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$Pagination$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/Pagination.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$cargo$2d$availability$2f$components$2f$CargoAvailabilityDrawer$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/cargo-availability/components/CargoAvailabilityDrawer.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$cargo$2d$availability$2f$components$2f$ShipmentAllocationModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/cargo-availability/components/ShipmentAllocationModal.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$cargo$2d$availability$2f$components$2f$MttReadinessFormModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/cargo-availability/components/MttReadinessFormModal.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$cargo$2d$availability$2f$services$2f$cargoAvailabilityApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/cargo-availability/services/cargoAvailabilityApi.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$components$2f$FreightAllocationDrawer$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shipments/components/FreightAllocationDrawer.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$utils$2f$freightRuleEngine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/shipments/utils/freightRuleEngine.js [app-client] (ecmascript)");
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
function ShipmentListPage({ preSelectedShipmentId, preOpenCargo, preOpenFreight, contextContractNo }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Active Tab: "pending" | "executed"
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("pending");
    // Per-tab pagination and sorting state
    const [tabParams, setTabParams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        pending: {
            page: 1,
            limit: 10,
            sortBy: "shipmentDate",
            sortOrder: "ASC"
        },
        executed: {
            page: 1,
            limit: 10,
            sortBy: "shipmentDate",
            sortOrder: "DESC"
        }
    });
    // Common filters shared across tabs
    const [commonFilters, setCommonFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        search: contextContractNo || "",
        businessReference: "",
        status: "",
        timeline: "",
        buyerId: "",
        sellerId: "",
        productId: "",
        country: "",
        portOfLoading: "",
        portOfDischarge: "",
        currency: "",
        financialYear: "",
        shipmentMonth: "",
        shipmentYear: "",
        shipmentDateFrom: "",
        shipmentDateTo: ""
    });
    // Tab counts from backend
    const [tabCounts, setTabCounts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        pending: 0,
        executed: 0
    });
    // Combined filters for subcomponents
    const filters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ShipmentListPage.useMemo[filters]": ()=>{
            const currentTabParams = tabParams[activeTab] || {
                page: 1,
                limit: 10,
                sortBy: "shipmentDate",
                sortOrder: "ASC"
            };
            return {
                ...commonFilters,
                page: currentTabParams.page,
                limit: currentTabParams.limit,
                sortBy: currentTabParams.sortBy,
                sortOrder: currentTabParams.sortOrder,
                tab: activeTab,
                status: commonFilters.status || activeTab
            };
        }
    }["ShipmentListPage.useMemo[filters]"], [
        commonFilters,
        tabParams,
        activeTab
    ]);
    // Toast state (matches existing project pattern)
    const [toastMsg, setToastMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const showToast = (msg, type = "success")=>{
        setToastMsg({
            msg,
            type
        });
        setTimeout(()=>setToastMsg(null), 3000);
    };
    const isMttShipment = (s, targetCargo = null)=>{
        const contract = s?.salesContract || {};
        const contractType = String(contract.contractType || s?.contractType || "").trim().toUpperCase();
        const shipmentType = String(contract.shipmentType?.name || contract.shipmentType || s?.shipmentType || "").trim().toUpperCase();
        const purchaseType = String(s?.purchaseContract?.purchaseType || s?.purchaseType || "").trim().toUpperCase();
        // Explicit MTT markings
        if (contractType === "MTT" || shipmentType === "MTT" || purchaseType === "MTT") return true;
        if (Array.isArray(s?.purchaseContracts) && s.purchaseContracts.some((pc)=>String(pc.purchaseType || "").toUpperCase() === "MTT")) return true;
        if (targetCargo?.cargoType === "MTT" || String(targetCargo?.purchaseContract?.purchaseType || "").toUpperCase() === "MTT") return true;
        // Non-export contract types are MTT domestic workflows
        if (contractType && contractType !== "EXPORT" && contractType !== "IMPORT") return true;
        // Even if contractType is "Export", if there are NO sea ports and NO containers, or transport is truck/road, it is MTT (Domestic Truck Loading)
        const hasSeaPorts = Boolean(contract.portOfLoading || contract.port_of_loading || contract.portOfDischarge || contract.port_of_discharge || s?.originPortId || s?.destinationPortId);
        const hasContainers = Boolean(Number(s?.noOfContainers || s?.no_of_containers || 0) > 0);
        const isTruckTransport = String(contract.originTransportMode || contract.origin_transport_mode || "").toLowerCase() === "truck" || String(contract.originTransportMode || contract.origin_transport_mode || "").toLowerCase() === "road";
        if (!hasSeaPorts && !hasContainers) return true;
        if (isTruckTransport) return true;
        return false;
    };
    const handleOpenCargoAllocation = async (s)=>{
        console.log("[ShipmentListPage] handleOpenCargoAllocation invoked for shipment:", {
            id: s.id,
            ref: s.shipmentReference,
            cargoReady: s.cargoReady,
            contractType: s.salesContract?.contractType
        });
        try {
            setLoadingAllocation(true);
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$cargo$2d$availability$2f$services$2f$cargoAvailabilityApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cargoAvailabilityApi"].getByShipmentId(s.id);
            const data = res?.data || res || {};
            const cargoRecords = data.cargoAvailabilityRecords || [];
            const allocations = data.allocations || [];
            const targetCargo = cargoRecords[0] || allocations[0]?.cargoAvailability || null;
            const isMtt = isMttShipment(s, targetCargo);
            console.log("[ShipmentListPage] isMtt evaluation:", isMtt, "for shipment:", s.id);
            if (isMtt) {
                // MTT WORKFLOW: Open MTT Cargo Readiness Modal directly on current page (/sales/shipments)
                // DO NOT open Cargo Execution Workspace!
                // DO NOT mount CargoAvailabilityDrawer!
                // DO NOT navigate away or change URL!
                let mttCargo = targetCargo;
                if (!mttCargo) {
                    const listRes = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$cargo$2d$availability$2f$services$2f$cargoAvailabilityApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cargoAvailabilityApi"].getCargoAvailabilityList({
                        limit: 20,
                        productId: s.products?.[0]?.id || s.salesContract?.items?.[0]?.productId
                    });
                    const listData = listRes?.data?.data || listRes?.data || [];
                    mttCargo = listData.find((c)=>c.purchaseContract?.purchaseType === "MTT" || c.purchaseContract?.salesContract?.contractType === "MTT" || c.cargoType === "MTT") || listData[0];
                }
                if (!mttCargo) {
                    mttCargo = {
                        id: null,
                        purchaseContractId: s.purchaseContract?.id || null,
                        purchaseContract: s.purchaseContract || {
                            contractNumber: s.salesContract?.contractNumber || `SHIP-${s.id}`,
                            seller: s.salesContract?.seller || {
                                entityName: "Vendor / Warehouse"
                            },
                            businessReference: s.businessReference || s.businessTransaction?.businessReference
                        },
                        product: s.products?.[0] || {
                            name: "Product"
                        },
                        purchaseQty: s.quantity || 0,
                        availableQty: s.quantity || 0,
                        allocatedQty: s.cargoReady ? s.quantity || 0 : 0,
                        status: s.cargoReady ? "Ready" : "Not Ready",
                        isReady: s.cargoReady
                    };
                }
                console.log("[ShipmentListPage] Opening MttReadinessFormModal with cargo:", mttCargo.id || "provisioned");
                setMttReadinessCargoRecord({
                    ...mttCargo,
                    isReady: s.cargoReady,
                    status: s.cargoReady ? "Ready" : mttCargo.status || "Not Ready",
                    currentShipment: s
                });
            } else {
                // Export Cargo: Keep separate and independent. Open Cargo Availability Drawer on the current page
                console.log("[ShipmentListPage] Opening Export Cargo Execution Workspace for shipment:", s.id);
                setCargoShipment(s);
            }
        } catch (err) {
            console.error("[ShipmentListPage] Error preparing cargo readiness:", err);
            showToast("Failed to load cargo readiness details.", "error");
        } finally{
            setLoadingAllocation(false);
        }
    };
    const handleReadinessSuccess = ()=>{
        setMttReadinessCargoRecord(null);
        fetchShipments();
        fetchStats();
        showToast("Cargo readiness updated successfully.", "success");
    };
    // Data States
    const [shipments, setShipments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [total, setTotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [totalPages, setTotalPages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [exporting, setExporting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Stats State
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        total: 0,
        today: 0,
        upcoming: 0,
        delayed: 0,
        inTransit: 0,
        pendingDocuments: 0,
        totalContainers: 0,
        totalQuantity: 0
    });
    // Modal / Drawer Active States
    const [activeShipment, setActiveShipment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // Detail drawer target
    const [cargoShipment, setCargoShipment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // Cargo availability drawer target
    const [freightShipment, setFreightShipment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // Freight allocation drawer target
    const [editShipment, setEditShipment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // Edit modal target
    const [viewContractId, setViewContractId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // Contract modal target
    const [docContract, setDocContract] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // Document drawer target
    const [selectedShipments, setSelectedShipments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // Bulk actions checkbox tracker
    // MTT Cargo Allocation & Readiness Workflow State
    const [allocationCargoRecord, setAllocationCargoRecord] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [allocationTargetShipment, setAllocationTargetShipment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mttReadinessCargoRecord, setMttReadinessCargoRecord] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loadingAllocation, setLoadingAllocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Tab change handler
    const handleTabChange = (newTab)=>{
        if (newTab === activeTab) return;
        setActiveTab(newTab);
        setSelectedShipments([]);
    };
    // Filter update handler preserving tab pagination & shared filters
    const handleSetFilters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShipmentListPage.useCallback[handleSetFilters]": (updater)=>{
            const currentTabParams = tabParams[activeTab] || {
                page: 1,
                limit: 10,
                sortBy: "shipmentDate",
                sortOrder: "ASC"
            };
            const currentCombined = {
                ...commonFilters,
                page: currentTabParams.page,
                limit: currentTabParams.limit,
                sortBy: currentTabParams.sortBy,
                sortOrder: currentTabParams.sortOrder,
                tab: activeTab
            };
            const next = typeof updater === "function" ? updater(currentCombined) : updater;
            const nextCommon = {
                ...commonFilters
            };
            const nextTabParams = {
                ...tabParams
            };
            let tabParamChanged = false;
            [
                "page",
                "limit",
                "sortBy",
                "sortOrder"
            ].forEach({
                "ShipmentListPage.useCallback[handleSetFilters]": (field)=>{
                    if (next[field] !== undefined && next[field] !== currentTabParams[field]) {
                        nextTabParams[activeTab] = {
                            ...nextTabParams[activeTab],
                            [field]: next[field]
                        };
                        tabParamChanged = true;
                    }
                }
            }["ShipmentListPage.useCallback[handleSetFilters]"]);
            let commonChanged = false;
            Object.keys(next).forEach({
                "ShipmentListPage.useCallback[handleSetFilters]": (key)=>{
                    if (![
                        "page",
                        "limit",
                        "sortBy",
                        "sortOrder",
                        "tab"
                    ].includes(key)) {
                        if (next[key] !== nextCommon[key]) {
                            nextCommon[key] = next[key];
                            commonChanged = true;
                        }
                    }
                }
            }["ShipmentListPage.useCallback[handleSetFilters]"]);
            if (commonChanged) {
                nextTabParams[activeTab] = {
                    ...nextTabParams[activeTab],
                    page: 1
                };
                setCommonFilters(nextCommon);
                setTabParams(nextTabParams);
            } else if (tabParamChanged) {
                setTabParams(nextTabParams);
            }
        }
    }["ShipmentListPage.useCallback[handleSetFilters]"], [
        activeTab,
        commonFilters,
        tabParams
    ]);
    // API Fetches
    const fetchShipments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShipmentListPage.useCallback[fetchShipments]": async (opts = {})=>{
            if (!opts?.silent) {
                setLoading(true);
            }
            try {
                const currentTabParams = tabParams[activeTab] || {
                    page: 1,
                    limit: 10,
                    sortBy: "shipmentDate",
                    sortOrder: "ASC"
                };
                const queryParams = {
                    ...commonFilters,
                    page: currentTabParams.page,
                    limit: currentTabParams.limit,
                    sortBy: currentTabParams.sortBy,
                    sortOrder: currentTabParams.sortOrder,
                    tab: activeTab,
                    status: commonFilters.status || activeTab
                };
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$services$2f$shipmentsApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shipmentsApi"].getShipments(queryParams);
                if (res?.data) {
                    setShipments(res.data.data || []);
                    setTotal(res.data.total || 0);
                    setTotalPages(res.data.totalPages || 0);
                    if (res.data.pendingCount !== undefined && res.data.executedCount !== undefined) {
                        setTabCounts({
                            pending: res.data.pendingCount,
                            executed: res.data.executedCount
                        });
                    }
                }
            } catch (err) {
                console.error(err);
                showToast("Failed to load shipments registry", "error");
            } finally{
                if (!opts?.silent) {
                    setLoading(false);
                }
            }
        }
    }["ShipmentListPage.useCallback[fetchShipments]"], [
        activeTab,
        tabParams,
        commonFilters
    ]);
    const handleExportExcel = async ()=>{
        setExporting(true);
        try {
            const currentTabConfig = tabParams[activeTab] || {
                sortBy: "shipmentDate",
                sortOrder: "ASC"
            };
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$services$2f$shipmentsApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shipmentsApi"].exportExcel({
                ...commonFilters,
                tab: activeTab,
                status: commonFilters.status || activeTab,
                sortBy: currentTabConfig.sortBy,
                sortOrder: currentTabConfig.sortOrder
            });
            const url = URL.createObjectURL(response.data);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${activeTab}-shipments.xlsx`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export shipments", error);
            showToast("Failed to export shipments", "error");
        } finally{
            setExporting(false);
        }
    };
    const fetchStats = async ()=>{
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$services$2f$shipmentsApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shipmentsApi"].getStats(commonFilters);
            if (res?.data) {
                setStats(res.data);
                if (res.data.pendingCount !== undefined && res.data.executedCount !== undefined) {
                    setTabCounts((prev)=>({
                            pending: res.data.pendingCount ?? prev.pending,
                            executed: res.data.executedCount ?? prev.executed
                        }));
                }
            }
        } catch (err) {
            console.error(err);
        }
    };
    // Handle successful execution with automatic movement between tabs
    const handleShipmentExecuted = (executedShipment)=>{
        if (activeTab === "pending") {
            setShipments((prev)=>prev.filter((s)=>s.id !== executedShipment.id));
            setTotal((prev)=>Math.max(0, prev - 1));
        }
        setTabCounts((prev)=>({
                pending: Math.max(0, prev.pending - 1),
                executed: prev.executed + 1
            }));
        setStats((prev)=>({
                ...prev,
                pendingCount: Math.max(0, (prev.pendingCount || 1) - 1),
                executedCount: (prev.executedCount || 0) + 1
            }));
        fetchShipments({
            silent: true
        });
        fetchStats();
    };
    // Listen for custom shipment-executed event
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShipmentListPage.useEffect": ()=>{
            const handleCustomExecuted = {
                "ShipmentListPage.useEffect.handleCustomExecuted": (e)=>{
                    const executedId = e.detail?.shipmentId;
                    if (executedId) {
                        if (activeTab === "pending") {
                            setShipments({
                                "ShipmentListPage.useEffect.handleCustomExecuted": (prev)=>prev.filter({
                                        "ShipmentListPage.useEffect.handleCustomExecuted": (s)=>s.id !== executedId
                                    }["ShipmentListPage.useEffect.handleCustomExecuted"])
                            }["ShipmentListPage.useEffect.handleCustomExecuted"]);
                            setTotal({
                                "ShipmentListPage.useEffect.handleCustomExecuted": (prev)=>Math.max(0, prev - 1)
                            }["ShipmentListPage.useEffect.handleCustomExecuted"]);
                        }
                        setTabCounts({
                            "ShipmentListPage.useEffect.handleCustomExecuted": (prev)=>({
                                    pending: Math.max(0, prev.pending - 1),
                                    executed: prev.executed + 1
                                })
                        }["ShipmentListPage.useEffect.handleCustomExecuted"]);
                        fetchShipments({
                            silent: true
                        });
                        fetchStats();
                    }
                }
            }["ShipmentListPage.useEffect.handleCustomExecuted"];
            window.addEventListener("shipment-executed", handleCustomExecuted);
            return ({
                "ShipmentListPage.useEffect": ()=>{
                    window.removeEventListener("shipment-executed", handleCustomExecuted);
                }
            })["ShipmentListPage.useEffect"];
        }
    }["ShipmentListPage.useEffect"], [
        activeTab,
        fetchShipments
    ]);
    // Trigger loading list and stats
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShipmentListPage.useEffect": ()=>{
            fetchShipments();
            fetchStats();
        }
    }["ShipmentListPage.useEffect"], [
        fetchShipments
    ]);
    // Deep Link Selection Handler (supports ?shipmentId=X&openCargo=true)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShipmentListPage.useEffect": ()=>{
            if (preSelectedShipmentId) {
                const loadPreselected = {
                    "ShipmentListPage.useEffect.loadPreselected": async ()=>{
                        try {
                            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$services$2f$shipmentsApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shipmentsApi"].getShipments({
                                limit: 100,
                                page: 1,
                                tab: "all"
                            });
                            if (res?.data?.data) {
                                const match = res.data.data.find({
                                    "ShipmentListPage.useEffect.loadPreselected.match": (s)=>String(s.id) === String(preSelectedShipmentId)
                                }["ShipmentListPage.useEffect.loadPreselected.match"]);
                                if (match) {
                                    const timelineRes = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$services$2f$shipmentsApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shipmentsApi"].getShipments({
                                        search: match.shipmentReference,
                                        tab: "all"
                                    });
                                    const resolved = timelineRes?.data?.data?.[0] || match;
                                    if (preOpenCargo) {
                                        // Delegate to handleOpenCargoAllocation to ensure MTT opens modal, not workspace
                                        handleOpenCargoAllocation(resolved);
                                    } else if (preOpenFreight) {
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$utils$2f$freightRuleEngine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openShipmentFreightWorkflow"])(resolved, router, setFreightShipment);
                                    } else {
                                        // Default: open ShipmentDetailsDrawer
                                        setActiveShipment(resolved);
                                    }
                                }
                            }
                        } catch (e) {
                            console.error("Failed to auto-open deep linked shipment", e);
                        }
                    }
                }["ShipmentListPage.useEffect.loadPreselected"];
                loadPreselected();
            }
        }
    }["ShipmentListPage.useEffect"], [
        preSelectedShipmentId,
        preOpenCargo,
        preOpenFreight,
        router
    ]);
    // Reset Filters Handler
    const handleResetFilters = ()=>{
        setCommonFilters({
            search: "",
            status: "",
            timeline: "",
            buyerId: "",
            sellerId: "",
            productId: "",
            country: "",
            portOfLoading: "",
            portOfDischarge: "",
            currency: "",
            financialYear: "",
            shipmentMonth: "",
            shipmentYear: "",
            shipmentDateFrom: "",
            shipmentDateTo: "",
            businessReference: ""
        });
        setTabParams({
            pending: {
                page: 1,
                limit: 10,
                sortBy: "shipmentDate",
                sortOrder: "ASC"
            },
            executed: {
                page: 1,
                limit: 10,
                sortBy: "shipmentDate",
                sortOrder: "DESC"
            }
        });
        setSelectedShipments([]);
        showToast("Filters cleared successfully");
    };
    const handlePrintSingleShipment = (shipment)=>{
        showToast(`Preparing print layout for ${shipment.shipmentReference}...`);
        // Direct browser print logic or window focus print
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
      <html>
        <head>
          <title>Shipment Print - ${shipment.shipmentReference}</title>
          <style>
            body { font-family: monospace; padding: 20px; line-height: 1.6; }
            h2 { border-bottom: 2px solid #000; padding-bottom: 10px; }
            .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-top: 20px; }
            .item { font-size: 14px; margin-bottom: 8px; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body onload="window.print();window.close();">
          <h2>SHIPMENT DETAILED VOUCHER</h2>
          <div class="item"><span class="bold">Reference:</span> ${shipment.shipmentReference}</div>
          <div class="item"><span class="bold">Business Ref No.:</span> ${shipment.businessReference || shipment.businessTransaction?.businessReference || "—"}</div>
          <div class="item"><span class="bold">Shipment Date:</span> ${new Date(shipment.shipmentDate).toLocaleDateString()}</div>
          <div class="item"><span class="bold">Workflow Status:</span> ${shipment.status}</div>
          
          <div class="grid">
            <div>
              <h3>Commercial Info</h3>
              <div class="item"><span class="bold">Contract:</span> ${shipment.salesContract?.contractNumber}</div>
              <div class="item"><span class="bold">Buyer:</span> ${shipment.salesContract?.buyer?.entityName}</div>
              <div class="item"><span class="bold">Selling Rate:</span> ${shipment.ratePerMt} ${shipment.salesContract?.currencyCode}</div>
              <div class="item"><span class="bold">Purchase Rate:</span> ${shipment.purchaseRate} ${shipment.salesContract?.currencyCode}</div>
            </div>
            <div>
              <h3>Cargo Load</h3>
              <div class="item"><span class="bold">Quantity (MT):</span> ${shipment.quantity}</div>
              <div class="item"><span class="bold">Containers count:</span> ${shipment.noOfContainers}</div>
              <div class="item"><span class="bold">Port of Loading:</span> ${shipment.salesContract?.portOfLoading || "—"}</div>
              <div class="item"><span class="bold">Port of Discharge:</span> ${shipment.salesContract?.portOfDischarge || "—"}</div>
            </div>
          </div>
          <div class="item" style="margin-top: 40px;"><span class="bold">Remarks:</span> ${shipment.remarks || "—"}</div>
        </body>
      </html>
    `);
        printWindow.document.close();
    };
    // Stat Card Display Setup
    const statsConfig = [
        {
            label: "Total Shipments",
            value: stats.total,
            badgeColor: "bg-[#007aff]"
        },
        {
            label: "Delayed",
            value: stats.delayed,
            badgeColor: "bg-red-500"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden p-3 sm:p-4 lg:p-5 xl:p-6 max-w-[1700px] mx-auto space-y-2 lg:space-y-3 print:p-0 print:shadow-none",
        children: [
            toastMsg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `fixed top-5 right-5 z-[500] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${toastMsg.type === "error" ? "bg-red-500" : "bg-green-500"}`,
                children: [
                    toastMsg.type === "error" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                        lineNumber: 567,
                        columnNumber: 15
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        className: "h-4 w-4 hidden"
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                        lineNumber: 568,
                        columnNumber: 15
                    }, this),
                    toastMsg.msg
                ]
            }, void 0, true, {
                fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                lineNumber: 564,
                columnNumber: 9
            }, this),
            (preSelectedShipmentId || contextContractNo) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2.5 bg-indigo-50/80 border border-indigo-100 rounded-xl text-xs font-semibold text-indigo-700 print:hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$boxes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Boxes$3e$__["Boxes"], {
                        className: "h-3.5 w-3.5 text-indigo-500 flex-shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                        lineNumber: 576,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/sales/cargo-availability",
                        className: "hover:underline text-indigo-600",
                        children: "Cargo Availability"
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                        lineNumber: 577,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                        className: "h-3 w-3 text-indigo-400"
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                        lineNumber: 578,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-indigo-800",
                        children: "Shipments Registry"
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                        lineNumber: 579,
                        columnNumber: 11
                    }, this),
                    contextContractNo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                className: "h-3 w-3 text-indigo-400"
                            }, void 0, false, {
                                fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                                lineNumber: 582,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-indigo-900 font-bold",
                                children: contextContractNo
                            }, void 0, false, {
                                fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                                lineNumber: 583,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                        lineNumber: 581,
                        columnNumber: 13
                    }, this),
                    preOpenCargo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200",
                        children: "🚚 Auto-Opening Cargo"
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                        lineNumber: 587,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                lineNumber: 575,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col lg:flex-row lg:items-center justify-between gap-2 print:hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-xl max-sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ship$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ship$3e$__["Ship"], {
                                        className: "h-5.5 w-5.5 text-[#007aff]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                                        lineNumber: 596,
                                        columnNumber: 13
                                    }, this),
                                    "Shipments Management"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                                lineNumber: 595,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-400 font-medium mt-0.5 max-w-3xl",
                                children: "Track and monitor shipment timeline states, documentation completeness, and operational workflow statuses."
                            }, void 0, false, {
                                fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                                lineNumber: 599,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                        lineNumber: 594,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex w-full lg:w-auto items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleExportExcel,
                                disabled: exporting,
                                className: "flex-1 lg:flex-none max-sm:flex-none max-sm:w-8 max-sm:px-0 justify-center px-3 py-1.5 min-h-[32px] sm:min-h-[36px] border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg lg:rounded-xl flex items-center gap-1.5 text-[12px] sm:text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                        className: "h-3.5 w-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                                        lineNumber: 609,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline",
                                        children: exporting ? "Exporting..." : "Export Excel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                                        lineNumber: 610,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                                lineNumber: 604,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>fetchShipments(),
                                className: "flex-1 lg:flex-none max-sm:flex-none max-sm:w-8 max-sm:px-0 justify-center px-3 py-1.5 min-h-[32px] sm:min-h-[36px] border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg lg:rounded-xl flex items-center gap-1.5 text-[12px] sm:text-xs font-semibold cursor-pointer transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                        className: "h-3.5 w-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                                        lineNumber: 616,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline",
                                        children: "Refresh Registry"
                                    }, void 0, false, {
                                        fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                                        lineNumber: 617,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                                lineNumber: 612,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                        lineNumber: 603,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                lineNumber: 593,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex min-h-0 flex-1 flex-col bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden print:border-none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b border-gray-200 px-3 sm:px-5 bg-white flex items-center justify-between print:hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1 sm:gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleTabChange("pending"),
                                    className: `relative py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer ${activeTab === "pending" ? "text-[#007aff] font-bold" : "text-gray-500 hover:text-gray-900"}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Pending"
                                        }, void 0, false, {
                                            fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                                            lineNumber: 636,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `px-2 py-0.5 text-[11px] sm:text-xs rounded-full font-bold transition-all duration-200 ${activeTab === "pending" ? "bg-blue-50 text-[#007aff] ring-1 ring-blue-500/20" : "bg-gray-100 text-gray-600"}`,
                                            children: tabCounts.pending
                                        }, void 0, false, {
                                            fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                                            lineNumber: 637,
                                            columnNumber: 15
                                        }, this),
                                        activeTab === "pending" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#007aff] rounded-t-full transition-all duration-200"
                                        }, void 0, false, {
                                            fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                                            lineNumber: 647,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                                    lineNumber: 627,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleTabChange("executed"),
                                    className: `relative py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer ${activeTab === "executed" ? "text-[#007aff] font-bold" : "text-gray-500 hover:text-gray-900"}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Stuffed / Executed"
                                        }, void 0, false, {
                                            fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                                            lineNumber: 660,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `px-2 py-0.5 text-[11px] sm:text-xs rounded-full font-bold transition-all duration-200 ${activeTab === "executed" ? "bg-blue-50 text-[#007aff] ring-1 ring-blue-500/20" : "bg-gray-100 text-gray-600"}`,
                                            children: tabCounts.executed
                                        }, void 0, false, {
                                            fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                                            lineNumber: 661,
                                            columnNumber: 15
                                        }, this),
                                        activeTab === "executed" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#007aff] rounded-t-full transition-all duration-200"
                                        }, void 0, false, {
                                            fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                                            lineNumber: 671,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                                    lineNumber: 651,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                            lineNumber: 626,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                        lineNumber: 625,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "print:hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$components$2f$ShipmentsFilter$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            filters: filters,
                            setFilters: handleSetFilters,
                            activeTab: activeTab,
                            statsConfig: statsConfig,
                            onReset: handleResetFilters,
                            total: total,
                            selectedShipments: selectedShipments,
                            onDeselect: ()=>setSelectedShipments([]),
                            onExecuteBulk: async ()=>{
                                try {
                                    const selectedObjs = shipments.filter((s)=>selectedShipments.includes(s.id));
                                    const unreadyShipments = selectedObjs.filter((s)=>!s.readyForShipment);
                                    if (unreadyShipments.length > 0) {
                                        showToast("Cannot execute: Selected shipment(s) pending Cargo or Freight allocation.", "error");
                                        return;
                                    }
                                    const salesContractId = selectedObjs[0]?.salesContractId || selectedObjs[0]?.salesContract?.id;
                                    if (!salesContractId) {
                                        showToast("Could not determine Sales Contract for selected shipments", "error");
                                        return;
                                    }
                                    const selectedContractIds = new Set(selectedObjs.map((shipment)=>Number(shipment.salesContractId || shipment.salesContract?.id)));
                                    if (selectedContractIds.size !== 1) {
                                        showToast("Execute Workspace can only include shipments from one Sales Contract.", "error");
                                        return;
                                    }
                                    const targetIds = selectedShipments.map(Number);
                                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$purchase$2d$contracts$2f$services$2f$purchaseContractApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["purchaseContractApi"].create({
                                        salesContractId: Number(salesContractId),
                                        shipmentIds: targetIds
                                    });
                                    await Promise.all(targetIds.map((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$services$2f$shipmentsApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shipmentsApi"].updateShipment(id, {
                                            status: "Executed"
                                        })));
                                    showToast("Shipments executed successfully", "success");
                                    // Immediately remove executed rows from Pending view
                                    setShipments((prev)=>prev.filter((s)=>!targetIds.includes(s.id)));
                                    setTotal((prev)=>Math.max(0, prev - targetIds.length));
                                    setTabCounts((prev)=>({
                                            pending: Math.max(0, prev.pending - targetIds.length),
                                            executed: prev.executed + targetIds.length
                                        }));
                                    setSelectedShipments([]);
                                    fetchShipments({
                                        silent: true
                                    });
                                    fetchStats();
                                } catch (err) {
                                    console.error("Failed bulk purchase contract execution", err);
                                    showToast("Failed to execute shipments", "error");
                                }
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                            lineNumber: 678,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                        lineNumber: 677,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$components$2f$ShipmentsTable$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onRefresh: fetchShipments,
                        onShipmentExecuted: handleShipmentExecuted,
                        activeTab: activeTab,
                        shipments: shipments,
                        onSortBusinessReference: ()=>setTabParams((current)=>({
                                    ...current,
                                    [activeTab]: {
                                        ...current[activeTab],
                                        sortBy: "businessReference",
                                        sortOrder: current[activeTab]?.sortOrder === "ASC" ? "DESC" : "ASC",
                                        page: 1
                                    }
                                })),
                        loading: loading,
                        selectedShipments: selectedShipments,
                        setSelectedShipments: setSelectedShipments,
                        onRowClick: (s)=>setActiveShipment(s),
                        onViewContract: (id)=>setViewContractId(id),
                        onEditShipment: (s)=>setEditShipment(s),
                        onManageDocuments: (contractObj)=>setDocContract(contractObj),
                        onPrintShipment: handlePrintSingleShipment,
                        onOpenCargoDrawer: handleOpenCargoAllocation,
                        onOpenFreightDrawer: (s)=>{
                            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$utils$2f$freightRuleEngine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFreightRequiredForShipment"])(s) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$utils$2f$freightRuleEngine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFreightAllocatedForShipment"])(s)) {
                                setFreightShipment(s);
                            }
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                        lineNumber: 736,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "print:hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$Pagination$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            currentPage: tabParams[activeTab]?.page || 1,
                            totalPages: totalPages,
                            onPageChange: (p)=>setTabParams((prev)=>({
                                        ...prev,
                                        [activeTab]: {
                                            ...prev[activeTab],
                                            page: p
                                        }
                                    })),
                            totalItems: total,
                            itemsPerPage: tabParams[activeTab]?.limit || 10,
                            onLimitChange: (newLimit)=>setTabParams((prev)=>({
                                        ...prev,
                                        [activeTab]: {
                                            ...prev[activeTab],
                                            limit: newLimit,
                                            page: 1
                                        }
                                    })),
                            itemName: "shipments"
                        }, void 0, false, {
                            fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                            lineNumber: 767,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                        lineNumber: 766,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                lineNumber: 623,
                columnNumber: 7
            }, this),
            activeShipment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$components$2f$ShipmentDetailsDrawer$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                shipment: activeShipment,
                onClose: ()=>setActiveShipment(null),
                onViewContract: (id)=>setViewContractId(id),
                onOpenCargoDrawer: handleOpenCargoAllocation,
                onOpenFreightDrawer: (s)=>{
                    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$utils$2f$freightRuleEngine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFreightRequiredForShipment"])(s) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$utils$2f$freightRuleEngine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFreightAllocatedForShipment"])(s)) return;
                    setFreightShipment(s);
                }
            }, void 0, false, {
                fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                lineNumber: 787,
                columnNumber: 9
            }, this),
            cargoShipment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$cargo$2d$availability$2f$components$2f$CargoAvailabilityDrawer$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                shipment: cargoShipment,
                onClose: ()=>setCargoShipment(null)
            }, void 0, false, {
                fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                lineNumber: 801,
                columnNumber: 9
            }, this),
            freightShipment && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$utils$2f$freightRuleEngine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFreightRequiredForShipment"])(freightShipment) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$utils$2f$freightRuleEngine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFreightAllocatedForShipment"])(freightShipment) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$components$2f$FreightAllocationDrawer$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                shipment: freightShipment,
                onClose: ()=>setFreightShipment(null),
                onEditShipment: (s)=>setEditShipment(s)
            }, void 0, false, {
                fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                lineNumber: 811,
                columnNumber: 9
            }, this),
            editShipment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$shipments$2f$components$2f$ShipmentEditModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                shipment: editShipment,
                isOpen: editShipment !== null,
                onClose: ()=>setEditShipment(null),
                onSaveSuccess: ()=>{
                    fetchShipments();
                    fetchStats();
                }
            }, void 0, false, {
                fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                lineNumber: 820,
                columnNumber: 9
            }, this),
            viewContractId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$sales$2d$contracts$2f$components$2f$ContractViewModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                contractId: viewContractId,
                onClose: ()=>setViewContractId(null)
            }, void 0, false, {
                fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                lineNumber: 833,
                columnNumber: 9
            }, this),
            docContract && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$sales$2d$contracts$2f$components$2f$DocumentUploadDrawer$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                contract: docContract,
                onClose: ()=>setDocContract(null),
                onRefreshList: ()=>{
                    fetchShipments();
                    fetchStats();
                }
            }, void 0, false, {
                fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                lineNumber: 841,
                columnNumber: 9
            }, this),
            allocationCargoRecord && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$cargo$2d$availability$2f$components$2f$ShipmentAllocationModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                cargoRecord: allocationCargoRecord,
                targetShipment: allocationTargetShipment,
                defaultShipmentId: allocationTargetShipment?.id,
                onClose: ()=>{
                    setAllocationCargoRecord(null);
                    setAllocationTargetShipment(null);
                },
                onSuccess: handleAllocationSuccess
            }, void 0, false, {
                fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                lineNumber: 853,
                columnNumber: 9
            }, this),
            mttReadinessCargoRecord && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$cargo$2d$availability$2f$components$2f$MttReadinessFormModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                cargoRecord: mttReadinessCargoRecord,
                shipment: mttReadinessCargoRecord.currentShipment,
                onClose: ()=>setMttReadinessCargoRecord(null),
                onSuccess: handleReadinessSuccess
            }, void 0, false, {
                fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
                lineNumber: 867,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/modules/shipments/pages/ShipmentListPage.jsx",
        lineNumber: 560,
        columnNumber: 5
    }, this);
}
_s(ShipmentListPage, "XhlvMq5wi8/0ACJ3bKpZAMgtego=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ShipmentListPage;
var _c;
__turbopack_context__.k.register(_c, "ShipmentListPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/shipments/services/shipmentsApi.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "shipmentsApi",
    ()=>shipmentsApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
const shipmentsApi = {
    getShipments: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/sales-contracts/shipments", {
            params
        }),
    getShipment: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/sales-contracts/shipments/${id}`),
    getStats: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/sales-contracts/shipments/stats", {
            params
        }),
    updateShipment: (id, data)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/sales-contracts/shipments/${id}`, data),
    updateManualReadiness: (id, data)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/sales-contracts/shipments/${id}/manual-readiness`, data),
    getExportExcelUrl: (params)=>{
        const query = new URLSearchParams(params).toString();
        const baseURL = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaults.baseURL || "";
        return `${baseURL}/sales-contracts/shipments/export/excel?${query}`;
    },
    exportExcel: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/sales-contracts/shipments/export/excel", {
            params,
            responseType: "blob"
        }),
    getStuffingExecution: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/sales-contracts/shipments/${id}/stuffing-execution`),
    saveStuffingExecution: (id, data)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/sales-contracts/shipments/${id}/stuffing-execution`, data),
    uploadStuffingAttachment: (id, formData)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/sales-contracts/shipments/${id}/stuffing-execution/attachments`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/shipments/utils/freightRuleEngine.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FREIGHT_COMPATIBILITY_MATRIX",
    ()=>FREIGHT_COMPATIBILITY_MATRIX,
    "SUPPORTED_INCOTERMS",
    ()=>SUPPORTED_INCOTERMS,
    "evaluateFreightRequired",
    ()=>evaluateFreightRequired,
    "extractIncotermCode",
    ()=>extractIncotermCode,
    "isFreightAllocatedForShipment",
    ()=>isFreightAllocatedForShipment,
    "isFreightRequiredForContracts",
    ()=>isFreightRequiredForContracts,
    "isFreightRequiredForShipment",
    ()=>isFreightRequiredForShipment,
    "lookupFreightMatrix",
    ()=>lookupFreightMatrix,
    "openShipmentFreightWorkflow",
    ()=>openShipmentFreightWorkflow
]);
const SUPPORTED_INCOTERMS = [];
const FREIGHT_COMPATIBILITY_MATRIX = {};
function extractIncotermCode() {
    return "";
}
function lookupFreightMatrix() {
    return null;
}
function evaluateFreightRequired() {
    return {
        matrixResult: null,
        freightRequired: false,
        salesIncoterm: "",
        purchaseIncoterm: "",
        reason: "Freight compatibility is evaluated by the backend."
    };
}
function isFreightRequiredForShipment(shipment) {
    if (!shipment) return false;
    if (typeof shipment.freightRequired === "boolean") return shipment.freightRequired;
    if (typeof shipment.isFreightRequired === "boolean") return shipment.isFreightRequired;
    return false;
}
function isFreightAllocatedForShipment(shipment) {
    if (!isFreightRequiredForShipment(shipment)) return false;
    if (typeof shipment.freightReady === "boolean") return shipment.freightReady;
    return String(shipment.freightAllocationStatus || "").trim().toLowerCase() === "yes";
}
function openShipmentFreightWorkflow(shipment, router, onAllocated) {
    if (!shipment?.id || !isFreightRequiredForShipment(shipment)) return;
    if (isFreightAllocatedForShipment(shipment)) {
        onAllocated?.(shipment);
        return;
    }
    const params = new URLSearchParams({
        from: "shipments"
    });
    if (shipment.shipmentReference) params.set("shipmentRef", shipment.shipmentReference);
    router.push(`/logistics/transport-workspace/${String(shipment.id)}?${params.toString()}`);
}
function isFreightRequiredForContracts() {
    return false;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/modules/shipments/utils/mtWeight.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatMtWeightInput",
    ()=>formatMtWeightInput,
    "isValidMtWeightInput",
    ()=>isValidMtWeightInput
]);
const MT_WEIGHT_INPUT_PATTERN = /^\d{0,3}(?:\.\d{0,3})?$/;
function isValidMtWeightInput(value) {
    return MT_WEIGHT_INPUT_PATTERN.test(value);
}
function formatMtWeightInput(value) {
    const input = value === null || value === undefined ? "" : String(value).trim();
    if (input === "") return "";
    if (!isValidMtWeightInput(input)) {
        const numericValue = Number(input);
        if (!Number.isFinite(numericValue) || numericValue < 0 || numericValue > 999.999) {
            return "";
        }
        return numericValue.toFixed(3);
    }
    const [integerPart = "", fractionalPart = ""] = input.split(".");
    return `${integerPart || "0"}.${fractionalPart.padEnd(3, "0")}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_modules_shipments_0yn3jeu._.js.map