(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/store/entities/attendanceSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "approveCorrection",
    ()=>approveCorrection,
    "assignShift",
    ()=>assignShift,
    "attendanceAdapter",
    ()=>attendanceAdapter,
    "checkIn",
    ()=>checkIn,
    "checkOut",
    ()=>checkOut,
    "clearAttendanceError",
    ()=>clearAttendanceError,
    "clearAttendanceSuccessMessage",
    ()=>clearAttendanceSuccessMessage,
    "default",
    ()=>__TURBOPACK__default__export__,
    "fetchCompanyAttendance",
    ()=>fetchCompanyAttendance,
    "fetchConflicts",
    ()=>fetchConflicts,
    "fetchCorrections",
    ()=>fetchCorrections,
    "fetchMonthlyReport",
    ()=>fetchMonthlyReport,
    "fetchMyAttendance",
    ()=>fetchMyAttendance,
    "fetchRegularizationHistory",
    ()=>fetchRegularizationHistory,
    "handleSocketBatchUpdate",
    ()=>handleSocketBatchUpdate,
    "manualAttendance",
    ()=>manualAttendance,
    "overrideAttendance",
    ()=>overrideAttendance,
    "rejectCorrection",
    ()=>rejectCorrection,
    "requestCorrection",
    ()=>requestCorrection,
    "resolveConflict",
    ()=>resolveConflict,
    "selectAttendanceError",
    ()=>selectAttendanceError,
    "selectAttendanceLoading",
    ()=>selectAttendanceLoading,
    "selectAttendanceSuccess",
    ()=>selectAttendanceSuccess,
    "selectCompanyAttendance",
    ()=>selectCompanyAttendance,
    "selectCompanySummary",
    ()=>selectCompanySummary,
    "selectConflicts",
    ()=>selectConflicts,
    "selectCorrections",
    ()=>selectCorrections,
    "selectMonthlyReport",
    ()=>selectMonthlyReport,
    "selectMyAttendance",
    ()=>selectMyAttendance,
    "selectRegularizationHistory",
    ()=>selectRegularizationHistory,
    "startReviewConflict",
    ()=>startReviewConflict
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const attendanceAdapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createEntityAdapter"])();
const checkIn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/attendance/checkIn", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/attendance/check-in", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Check-in failed");
    }
});
const checkOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/attendance/checkOut", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/attendance/check-out", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Check-out failed");
    }
});
const fetchMyAttendance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/attendance/fetchMy", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/attendance/me", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch my attendance");
    }
});
const fetchCompanyAttendance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/attendance/fetchCompany", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/attendance/company", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch company attendance");
    }
});
const fetchCorrections = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/attendance/fetchCorrections", async (_, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/attendance/corrections");
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch corrections");
    }
});
const fetchRegularizationHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/attendance/fetchRegularizationHistory", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/attendance/admin/regularization-history", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch regularization history");
    }
});
const requestCorrection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/attendance/requestCorrection", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/attendance/request-regularization", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to request correction");
    }
});
const approveCorrection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/attendance/approveCorrection", async ({ id, data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/attendance/admin/approve-regularization/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to approve correction");
    }
});
const rejectCorrection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/attendance/rejectCorrection", async ({ id, data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/attendance/admin/reject-regularization/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to reject correction");
    }
});
const manualAttendance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/attendance/manualAttendance", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/attendance/admin/manual-attendance", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to mark manual attendance");
    }
});
const overrideAttendance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/attendance/override", async ({ id, data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/attendance/${id}/override`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to override attendance");
    }
});
const fetchMonthlyReport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/attendance/fetchMonthlyReport", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/attendance/report/monthly", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch monthly report");
    }
});
const assignShift = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/attendance/assignShift", async ({ employeeId, data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/attendance/assign-shift/${employeeId}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to assign shift");
    }
});
const fetchConflicts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/attendance/fetchConflicts", async (_, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/attendance/exceptions/conflicts");
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch conflicts");
    }
});
const startReviewConflict = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/attendance/startReviewConflict", async (id, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/attendance/exceptions/conflicts/${id}/review`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to start review");
    }
});
const resolveConflict = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/attendance/resolveConflict", async ({ id, data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/attendance/exceptions/conflicts/${id}/resolve`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to resolve conflict");
    }
});
const attendanceSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "attendance",
    initialState: attendanceAdapter.getInitialState({
        myAttendance: [],
        companyAttendance: [],
        companySummary: null,
        corrections: [],
        conflicts: [],
        history: {
            data: [],
            page: 1,
            totalPages: 1,
            totalCount: 0
        },
        monthlyReport: [],
        isLoading: false,
        error: null,
        successMessage: null
    }),
    reducers: {
        clearAttendanceError (state) {
            state.error = null;
        },
        clearAttendanceSuccessMessage (state) {
            state.successMessage = null;
        },
        handleSocketBatchUpdate (state, action) {
            const updates = action.payload;
            if (!Array.isArray(updates)) return;
            updates.forEach((payload)=>{
                const item = payload.version === 1 ? payload.record : payload;
                const summary = payload.version === 1 ? payload.summary : null;
                const payloadAction = payload.action;
                if (!item) return;
                const { id, employeeId, date, attendanceState, attendanceStatus, checkInTime, checkOutTime, totalHours, overtimeHours } = item;
                // 1. Update myAttendance
                const myIdx = state.myAttendance.findIndex((r)=>r.id === id);
                if (myIdx >= 0) {
                    const currentRecord = state.myAttendance[myIdx];
                    state.myAttendance[myIdx] = {
                        ...currentRecord,
                        checkInTime: checkInTime !== undefined ? checkInTime : currentRecord.checkInTime,
                        checkOutTime: checkOutTime !== undefined ? checkOutTime : currentRecord.checkOutTime,
                        attendanceState: attendanceState !== undefined ? attendanceState : currentRecord.attendanceState,
                        attendanceStatus: attendanceStatus !== undefined ? attendanceStatus : currentRecord.attendanceStatus,
                        totalHours: totalHours !== undefined ? totalHours : currentRecord.totalHours,
                        overtimeHours: overtimeHours !== undefined ? overtimeHours : currentRecord.overtimeHours
                    };
                    if (!state.myAttendance[myIdx].logs) state.myAttendance[myIdx].logs = [];
                    if (payloadAction === 'checked_in') {
                        const hasLog = state.myAttendance[myIdx].logs.some((l)=>l.actionType === 'CHECK_IN' && l.timestamp === payload.timestamp);
                        if (!hasLog) {
                            state.myAttendance[myIdx].logs.push({
                                actionType: 'CHECK_IN',
                                timestamp: payload.timestamp || new Date().toISOString(),
                                metadata: {
                                    verificationMethod: 'WEB'
                                }
                            });
                        }
                    } else if (payloadAction === 'checked_out') {
                        const hasLog = state.myAttendance[myIdx].logs.some((l)=>l.actionType === 'CHECK_OUT' && l.timestamp === payload.timestamp);
                        if (!hasLog) {
                            state.myAttendance[myIdx].logs.push({
                                actionType: 'CHECK_OUT',
                                timestamp: payload.timestamp || new Date().toISOString(),
                                metadata: {
                                    verificationMethod: 'WEB'
                                }
                            });
                        }
                    } else if (payloadAction === 'regularization_approved') {
                        // Reconstruct logs so the timeline updates instantly
                        state.myAttendance[myIdx].logs = [];
                        if (item.checkInTime) {
                            state.myAttendance[myIdx].logs.push({
                                actionType: 'CHECK_IN',
                                timestamp: item.checkInTime
                            });
                        }
                        if (item.checkOutTime) {
                            state.myAttendance[myIdx].logs.push({
                                actionType: 'CHECK_OUT',
                                timestamp: item.checkOutTime
                            });
                        }
                    }
                } else {
                    state.myAttendance.push({
                        id,
                        employeeId,
                        date,
                        checkInTime,
                        checkOutTime,
                        attendanceState,
                        attendanceStatus,
                        totalHours,
                        overtimeHours
                    });
                }
                // 2. Update companyAttendance
                const compIdx = state.companyAttendance.findIndex((r)=>r.id === id);
                if (compIdx >= 0) {
                    const currentRecord = state.companyAttendance[compIdx];
                    state.companyAttendance[compIdx] = {
                        ...currentRecord,
                        checkInTime: checkInTime !== undefined ? checkInTime : currentRecord.checkInTime,
                        checkOutTime: checkOutTime !== undefined ? checkOutTime : currentRecord.checkOutTime,
                        attendanceState: attendanceState !== undefined ? attendanceState : currentRecord.attendanceState,
                        attendanceStatus: attendanceStatus !== undefined ? attendanceStatus : currentRecord.attendanceStatus,
                        totalHours: totalHours !== undefined ? totalHours : currentRecord.totalHours,
                        overtimeHours: overtimeHours !== undefined ? overtimeHours : currentRecord.overtimeHours
                    };
                } else {
                    state.companyAttendance.push({
                        id,
                        employeeId,
                        date,
                        checkInTime,
                        checkOutTime,
                        attendanceState,
                        attendanceStatus,
                        totalHours,
                        overtimeHours,
                        employee: item.employee
                    });
                }
                // 3. Update monthlyReport
                if (Array.isArray(state.monthlyReport)) {
                    state.monthlyReport.forEach((report)=>{
                        if (report.employeeId === employeeId) {
                            const dayIdx = report.days?.findIndex((d)=>d.date === date);
                            if (dayIdx >= 0) {
                                const dayRecord = report.days[dayIdx];
                                report.days[dayIdx] = {
                                    ...dayRecord,
                                    checkIn: checkInTime !== undefined ? checkInTime : dayRecord.checkIn,
                                    checkOut: checkOutTime !== undefined ? checkOutTime : dayRecord.checkOut,
                                    status: attendanceStatus !== undefined ? attendanceStatus : dayRecord.status,
                                    attendanceState: attendanceState !== undefined ? attendanceState : dayRecord.attendanceState,
                                    workHours: totalHours !== undefined ? totalHours : dayRecord.workHours,
                                    overtimeHours: overtimeHours !== undefined ? overtimeHours : dayRecord.overtimeHours
                                };
                                if (summary) {
                                    report.summary = summary;
                                }
                            }
                        }
                    });
                }
            });
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(checkIn.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(checkIn.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.successMessage = "Checked in successfully";
            if (action.payload) {
                const idx = state.myAttendance.findIndex((r)=>r.id === action.payload.id || r.date === action.payload.date);
                if (idx >= 0) state.myAttendance[idx] = action.payload;
                else state.myAttendance = [
                    ...state.myAttendance,
                    action.payload
                ];
            }
        }).addCase(checkIn.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(checkOut.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(checkOut.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.successMessage = "Checked out successfully";
            if (action.payload) {
                const idx = state.myAttendance.findIndex((r)=>r.id === action.payload.id || r.date === action.payload.date);
                if (idx >= 0) state.myAttendance[idx] = action.payload;
                else state.myAttendance = [
                    ...state.myAttendance,
                    action.payload
                ];
            }
        }).addCase(checkOut.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(fetchMyAttendance.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchMyAttendance.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.myAttendance = Array.isArray(action.payload) ? action.payload : action.payload?.data || [];
        }).addCase(fetchMyAttendance.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(fetchCompanyAttendance.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchCompanyAttendance.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.companyAttendance = action.payload?.records || [];
            state.companySummary = action.payload?.summary || null;
        }).addCase(fetchCompanyAttendance.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(fetchCorrections.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchCorrections.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.corrections = action.payload;
        }).addCase(fetchCorrections.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(fetchRegularizationHistory.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchRegularizationHistory.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.history = action.payload;
        }).addCase(fetchRegularizationHistory.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(requestCorrection.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(requestCorrection.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.successMessage = "Correction requested successfully";
        }).addCase(requestCorrection.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(approveCorrection.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(approveCorrection.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.successMessage = "Correction approved";
        }).addCase(approveCorrection.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(rejectCorrection.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(rejectCorrection.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.successMessage = "Correction rejected";
        }).addCase(rejectCorrection.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(fetchMonthlyReport.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchMonthlyReport.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.monthlyReport = action.payload;
        }).addCase(fetchMonthlyReport.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(overrideAttendance.fulfilled, (state, action)=>{
            state.successMessage = "Attendance overridden successfully";
        }).addCase(overrideAttendance.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(assignShift.fulfilled, (state, action)=>{
            state.successMessage = "Shift assigned successfully";
        }).addCase(assignShift.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(manualAttendance.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(manualAttendance.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.successMessage = "Attendance marked successfully";
        }).addCase(manualAttendance.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(fetchConflicts.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchConflicts.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.conflicts = action.payload;
        }).addCase(fetchConflicts.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(startReviewConflict.fulfilled, (state, action)=>{
            state.successMessage = "Review started successfully";
            const idx = state.conflicts.findIndex((c)=>c.id === action.payload.id);
            if (idx >= 0) state.conflicts[idx] = action.payload;
        }).addCase(startReviewConflict.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(resolveConflict.fulfilled, (state, action)=>{
            state.successMessage = "Conflict resolved successfully";
            const idx = state.conflicts.findIndex((c)=>c.id === action.payload.id);
            if (idx >= 0) state.conflicts[idx] = action.payload;
        }).addCase(resolveConflict.rejected, (state, action)=>{
            state.error = action.payload;
        });
    }
});
const { clearAttendanceError, clearAttendanceSuccessMessage, handleSocketBatchUpdate } = attendanceSlice.actions;
const selectMyAttendance = (state)=>state.entities.attendance.myAttendance;
const selectCompanyAttendance = (state)=>state.entities.attendance.companyAttendance;
const selectCompanySummary = (state)=>state.entities.attendance.companySummary;
const selectCorrections = (state)=>state.entities.attendance.corrections;
const selectConflicts = (state)=>state.entities.attendance.conflicts;
const selectRegularizationHistory = (state)=>state.entities.attendance.history;
const selectMonthlyReport = (state)=>state.entities.attendance.monthlyReport;
const selectAttendanceLoading = (state)=>state.entities.attendance.isLoading;
const selectAttendanceError = (state)=>state.entities.attendance.error;
const selectAttendanceSuccess = (state)=>state.entities.attendance.successMessage;
const __TURBOPACK__default__export__ = attendanceSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/entities/bagSpecsSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assignProductPackaging",
    ()=>assignProductPackaging,
    "clearBagSpecsError",
    ()=>clearBagSpecsError,
    "createBagSpec",
    ()=>createBagSpec,
    "createBagType",
    ()=>createBagType,
    "createPackingType",
    ()=>createPackingType,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteBagSpec",
    ()=>deleteBagSpec,
    "deleteBagType",
    ()=>deleteBagType,
    "deletePackingType",
    ()=>deletePackingType,
    "fetchBagSpecs",
    ()=>fetchBagSpecs,
    "fetchBagTypes",
    ()=>fetchBagTypes,
    "fetchPackingTypes",
    ()=>fetchPackingTypes,
    "fetchProductPackaging",
    ()=>fetchProductPackaging,
    "selectBagSpecs",
    ()=>selectBagSpecs,
    "selectBagSpecsError",
    ()=>selectBagSpecsError,
    "selectBagSpecsLoading",
    ()=>selectBagSpecsLoading,
    "selectBagSpecsTotalCount",
    ()=>selectBagSpecsTotalCount,
    "selectBagSpecsTotalPages",
    ()=>selectBagSpecsTotalPages,
    "selectBagTypes",
    ()=>selectBagTypes,
    "selectPackingTypes",
    ()=>selectPackingTypes,
    "selectProductPackaging",
    ()=>selectProductPackaging,
    "updateBagSpec",
    ()=>updateBagSpec,
    "updateBagType",
    ()=>updateBagType,
    "updatePackingType",
    ()=>updatePackingType
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const fetchBagTypes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("bagSpecs/fetchBagTypes", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/bag-types", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch bag types");
    }
});
const createBagType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("bagSpecs/createBagType", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/masters/bag-types", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create bag type");
    }
});
const updateBagType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("bagSpecs/updateBagType", async ({ id, ...data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/masters/bag-types/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update bag type");
    }
});
const deleteBagType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("bagSpecs/deleteBagType", async (id, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/masters/bag-types/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete bag type");
    }
});
const fetchPackingTypes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("bagSpecs/fetchPackingTypes", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/packing-types", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch packing types");
    }
});
const createPackingType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("bagSpecs/createPackingType", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/masters/packing-types", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create packing type");
    }
});
const updatePackingType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("bagSpecs/updatePackingType", async ({ id, ...data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/masters/packing-types/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update packing type");
    }
});
const deletePackingType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("bagSpecs/deletePackingType", async (id, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/masters/packing-types/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete packing type");
    }
});
const fetchBagSpecs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("bagSpecs/fetchAll", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/bag-specifications", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch bag specifications");
    }
});
const createBagSpec = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("bagSpecs/create", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/masters/bag-specifications", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create bag specification");
    }
});
const updateBagSpec = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("bagSpecs/update", async ({ id, ...data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/masters/bag-specifications/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update bag specification");
    }
});
const deleteBagSpec = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("bagSpecs/delete", async (id, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/masters/bag-specifications/${id}`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete bag specification");
    }
});
const fetchProductPackaging = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("bagSpecs/fetchProductPackaging", async (productId, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/masters/products/${productId}/packaging`);
        return {
            productId,
            specs: res.data
        };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch product packaging");
    }
});
const assignProductPackaging = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("bagSpecs/assignProductPackaging", async ({ productId, bagSpecificationIds }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/masters/products/${productId}/packaging`, {
            bagSpecificationIds
        });
        return {
            productId,
            specs: res.data
        };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to assign packaging");
    }
});
// ─── SLICE ────────────────────────────────────────────────────────────────────
const bagSpecsSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "bagSpecs",
    initialState: {
        // Bag Types
        bagTypes: [],
        bagTypesLoading: false,
        bagTypesError: null,
        // Packing Types
        packingTypes: [],
        packingTypesLoading: false,
        packingTypesError: null,
        // Bag Specifications
        list: [],
        totalCount: 0,
        totalPages: 1,
        currentPage: 1,
        isLoading: false,
        error: null,
        // Product Packaging map: { [productId]: BagSpec[] }
        productPackaging: {}
    },
    reducers: {
        clearBagSpecsError (state) {
            state.error = null;
        }
    },
    extraReducers: (builder)=>{
        // Bag Types
        builder.addCase(fetchBagTypes.pending, (state)=>{
            state.bagTypesLoading = true;
            state.bagTypesError = null;
        }).addCase(fetchBagTypes.fulfilled, (state, action)=>{
            state.bagTypesLoading = false;
            state.bagTypes = action.payload;
        }).addCase(fetchBagTypes.rejected, (state, action)=>{
            state.bagTypesLoading = false;
            state.bagTypesError = action.payload;
        }).addCase(createBagType.fulfilled, (state, action)=>{
            state.bagTypes.push(action.payload);
            state.bagTypes.sort((a, b)=>a.name.localeCompare(b.name));
        }).addCase(updateBagType.fulfilled, (state, action)=>{
            const idx = state.bagTypes.findIndex((t)=>t.id === action.payload.id);
            if (idx !== -1) state.bagTypes[idx] = action.payload;
        }).addCase(deleteBagType.fulfilled, (state, action)=>{
            state.bagTypes = state.bagTypes.filter((t)=>t.id !== action.payload);
        });
        // Packing Types
        builder.addCase(fetchPackingTypes.pending, (state)=>{
            state.packingTypesLoading = true;
            state.packingTypesError = null;
        }).addCase(fetchPackingTypes.fulfilled, (state, action)=>{
            state.packingTypesLoading = false;
            state.packingTypes = action.payload;
        }).addCase(fetchPackingTypes.rejected, (state, action)=>{
            state.packingTypesLoading = false;
            state.packingTypesError = action.payload;
        }).addCase(createPackingType.fulfilled, (state, action)=>{
            state.packingTypes.push(action.payload);
            state.packingTypes.sort((a, b)=>a.name.localeCompare(b.name));
        }).addCase(updatePackingType.fulfilled, (state, action)=>{
            const idx = state.packingTypes.findIndex((t)=>t.id === action.payload.id);
            if (idx !== -1) state.packingTypes[idx] = action.payload;
        }).addCase(deletePackingType.fulfilled, (state, action)=>{
            state.packingTypes = state.packingTypes.filter((t)=>t.id !== action.payload);
        });
        // Bag Specifications
        builder.addCase(fetchBagSpecs.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchBagSpecs.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.list = action.payload.data || [];
            state.totalCount = action.payload.total || 0;
            state.totalPages = action.payload.totalPages || 1;
            state.currentPage = action.payload.page || 1;
        }).addCase(fetchBagSpecs.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(createBagSpec.fulfilled, (state, action)=>{
            state.list.unshift(action.payload);
            state.totalCount += 1;
        }).addCase(updateBagSpec.fulfilled, (state, action)=>{
            const idx = state.list.findIndex((s)=>s.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        }).addCase(deleteBagSpec.fulfilled, (state, action)=>{
            const idx = state.list.findIndex((s)=>s.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        });
        // Product Packaging
        builder.addCase(fetchProductPackaging.fulfilled, (state, action)=>{
            state.productPackaging[action.payload.productId] = action.payload.specs;
        }).addCase(assignProductPackaging.fulfilled, (state, action)=>{
            state.productPackaging[action.payload.productId] = action.payload.specs;
        });
    }
});
const { clearBagSpecsError } = bagSpecsSlice.actions;
const selectBagTypes = (state)=>state.entities.bagSpecs.bagTypes;
const selectPackingTypes = (state)=>state.entities.bagSpecs.packingTypes;
const selectBagSpecs = (state)=>state.entities.bagSpecs.list;
const selectBagSpecsTotalCount = (state)=>state.entities.bagSpecs.totalCount;
const selectBagSpecsTotalPages = (state)=>state.entities.bagSpecs.totalPages;
const selectBagSpecsLoading = (state)=>state.entities.bagSpecs.isLoading;
const selectBagSpecsError = (state)=>state.entities.bagSpecs.error;
const selectProductPackaging = (productId)=>(state)=>state.entities.bagSpecs.productPackaging[productId] || [];
const __TURBOPACK__default__export__ = bagSpecsSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/entities/branchesSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "branchesAdapter",
    ()=>branchesAdapter,
    "clearBranchesError",
    ()=>clearBranchesError,
    "clearCurrentBranch",
    ()=>clearCurrentBranch,
    "createBranch",
    ()=>createBranch,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteBranch",
    ()=>deleteBranch,
    "fetchBranchById",
    ()=>fetchBranchById,
    "fetchBranches",
    ()=>fetchBranches,
    "selectAllBranches",
    ()=>selectAllBranches,
    "selectBranchById",
    ()=>selectBranchById,
    "selectBranchesData",
    ()=>selectBranchesData,
    "selectBranchesError",
    ()=>selectBranchesError,
    "selectBranchesLoading",
    ()=>selectBranchesLoading,
    "selectCurrentBranch",
    ()=>selectCurrentBranch,
    "updateBranch",
    ()=>updateBranch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/reselect/dist/reselect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const branchesAdapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createEntityAdapter"])();
const fetchBranches = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/branches/fetchAll", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/branches", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch branches");
    }
});
const fetchBranchById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/branches/fetchById", async (id, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/branches/${id}`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch branch");
    }
});
const createBranch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/branches/create", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/branches", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create branch");
    }
});
const updateBranch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/branches/update", async ({ id, data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/branches/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update branch");
    }
});
const deleteBranch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/branches/delete", async (id, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/branches/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete branch");
    }
});
const branchesSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "branches",
    initialState: branchesAdapter.getInitialState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        current: null,
        isLoading: false,
        error: null
    }),
    reducers: {
        clearBranchesError (state) {
            state.error = null;
        },
        clearCurrentBranch (state) {
            state.current = null;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchBranches.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchBranches.fulfilled, (state, action)=>{
            state.isLoading = false;
            branchesAdapter.setAll(state, action.payload.data || action.payload);
            state.total = action.payload.total || action.payload.length;
            state.page = action.payload.page || 1;
            state.limit = action.payload.limit || 10;
            state.totalPages = action.payload.totalPages || 1;
        }).addCase(fetchBranches.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(fetchBranchById.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchBranchById.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.current = action.payload;
            branchesAdapter.upsertOne(state, action.payload);
        }).addCase(fetchBranchById.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(createBranch.fulfilled, (state, action)=>{
            branchesAdapter.addOne(state, action.payload);
        }).addCase(createBranch.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(updateBranch.fulfilled, (state, action)=>{
            branchesAdapter.upsertOne(state, action.payload);
            if (state.current?.id === action.payload.id) {
                state.current = {
                    ...state.current,
                    ...action.payload
                };
            }
        }).addCase(updateBranch.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(deleteBranch.fulfilled, (state, action)=>{
            branchesAdapter.removeOne(state, action.payload);
        }).addCase(deleteBranch.rejected, (state, action)=>{
            state.error = action.payload;
        });
    }
});
const { clearBranchesError, clearCurrentBranch } = branchesSlice.actions;
const { selectAll: selectAllBranches, selectById: selectBranchById } = branchesAdapter.getSelectors((state)=>state.entities.branches);
const selectBranchesData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSelector"])([
    selectAllBranches,
    (state)=>state.entities.branches.total,
    (state)=>state.entities.branches.page,
    (state)=>state.entities.branches.limit,
    (state)=>state.entities.branches.totalPages
], (data, total, page, limit, totalPages)=>({
        data,
        total,
        page,
        limit,
        totalPages
    }));
const selectCurrentBranch = (state)=>state.entities.branches.current;
const selectBranchesLoading = (state)=>state.entities.branches.isLoading;
const selectBranchesError = (state)=>state.entities.branches.error;
const __TURBOPACK__default__export__ = branchesSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/entities/categoriesSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearCategoriesError",
    ()=>clearCategoriesError,
    "createCategory",
    ()=>createCategory,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteCategory",
    ()=>deleteCategory,
    "fetchCategories",
    ()=>fetchCategories,
    "permanentDeleteCategory",
    ()=>permanentDeleteCategory,
    "restoreCategory",
    ()=>restoreCategory,
    "selectCategories",
    ()=>selectCategories,
    "selectCategoriesError",
    ()=>selectCategoriesError,
    "selectCategoriesLoading",
    ()=>selectCategoriesLoading,
    "selectCategoriesTotalCount",
    ()=>selectCategoriesTotalCount,
    "selectCategoriesTotalPages",
    ()=>selectCategoriesTotalPages,
    "updateCategory",
    ()=>updateCategory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const fetchCategories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("categories/fetchAll", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/categories", {
            params
        });
        // Assuming NestJS backend returns data directly or inside .data
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch categories");
    }
});
const createCategory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("categories/create", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/masters/categories", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create category");
    }
});
const updateCategory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("categories/update", async ({ id, ...data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/masters/categories/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update category");
    }
});
const deleteCategory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("categories/delete", async (arg, { rejectWithValue })=>{
    try {
        const id = typeof arg === "object" ? arg.id : arg;
        const reason = typeof arg === "object" ? arg.reason : undefined;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/masters/categories/${id}`, {
            params: {
                reason
            }
        });
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete category");
    }
});
const restoreCategory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("categories/restore", async (id, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/masters/categories/${id}/restore`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to restore category");
    }
});
const permanentDeleteCategory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("categories/permanentDelete", async (arg, { rejectWithValue })=>{
    try {
        const id = typeof arg === "object" ? arg.id : arg;
        const reason = typeof arg === "object" ? arg.reason : undefined;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/masters/categories/${id}/permanent`, {
            params: {
                reason
            }
        });
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to permanently delete category");
    }
});
const categoriesSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "categories",
    initialState: {
        list: [],
        totalCount: 0,
        totalPages: 1,
        currentPage: 1,
        isLoading: false,
        error: null
    },
    reducers: {
        clearCategoriesError (state) {
            state.error = null;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchCategories.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchCategories.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.list = action.payload.data || action.payload || [];
            state.totalCount = action.payload.total || (action.payload.data ? action.payload.data.length : state.list.length);
            state.totalPages = action.payload.totalPages || 1;
            state.currentPage = action.payload.page || 1;
        }).addCase(fetchCategories.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(createCategory.fulfilled, (state, action)=>{
            state.list.unshift(action.payload);
            state.totalCount += 1;
        }).addCase(createCategory.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(updateCategory.fulfilled, (state, action)=>{
            const idx = state.list.findIndex((c)=>c.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        }).addCase(updateCategory.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(deleteCategory.fulfilled, (state, action)=>{
            state.list = state.list.filter((c)=>c.id !== action.payload);
            state.totalCount -= 1;
        }).addCase(deleteCategory.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(restoreCategory.fulfilled, (state, action)=>{
            const idx = state.list.findIndex((c)=>c.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        }).addCase(restoreCategory.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(permanentDeleteCategory.fulfilled, (state, action)=>{
            state.list = state.list.filter((c)=>c.id !== action.payload);
            state.totalCount -= 1;
        }).addCase(permanentDeleteCategory.rejected, (state, action)=>{
            state.error = action.payload;
        });
    }
});
const { clearCategoriesError } = categoriesSlice.actions;
const selectCategories = (state)=>state.entities.categories.list;
const selectCategoriesTotalCount = (state)=>state.entities.categories.totalCount;
const selectCategoriesTotalPages = (state)=>state.entities.categories.totalPages;
const selectCategoriesLoading = (state)=>state.entities.categories.isLoading;
const selectCategoriesError = (state)=>state.entities.categories.error;
const __TURBOPACK__default__export__ = categoriesSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/entities/companyHrPoliciesSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearCompanyHrPoliciesError",
    ()=>clearCompanyHrPoliciesError,
    "companyHrPoliciesAdapter",
    ()=>companyHrPoliciesAdapter,
    "default",
    ()=>__TURBOPACK__default__export__,
    "fetchAttendancePolicy",
    ()=>fetchAttendancePolicy,
    "fetchCompanyHrPolicies",
    ()=>fetchCompanyHrPolicies,
    "fetchCompanyHrPolicyHistory",
    ()=>fetchCompanyHrPolicyHistory,
    "fetchCompanyHrPolicyImpact",
    ()=>fetchCompanyHrPolicyImpact,
    "fetchCompanyHrPolicyPreview",
    ()=>fetchCompanyHrPolicyPreview,
    "selectCurrentHrPolicy",
    ()=>selectCurrentHrPolicy,
    "selectHrPoliciesError",
    ()=>selectHrPoliciesError,
    "selectHrPoliciesLoading",
    ()=>selectHrPoliciesLoading,
    "selectHrPolicyHistory",
    ()=>selectHrPolicyHistory,
    "selectHrPolicyImpact",
    ()=>selectHrPolicyImpact,
    "selectHrPolicyPreview",
    ()=>selectHrPolicyPreview,
    "upsertCompanyHrPolicies",
    ()=>upsertCompanyHrPolicies
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const companyHrPoliciesAdapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createEntityAdapter"])();
const fetchCompanyHrPolicies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/companyHrPolicies/fetchAll", async (_, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/company/hr-policies");
        return res.data?.data || res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch company HR policies");
    }
});
const fetchAttendancePolicy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/companyHrPolicies/fetchAttendancePolicy", async (_, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/attendance/policy");
        return res.data?.data || res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch attendance policy");
    }
});
const fetchCompanyHrPolicyPreview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/companyHrPolicies/fetchPreview", async (formData, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/company/hr-policies/preview", formData);
        return res.data?.data || res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch policy preview");
    }
});
const fetchCompanyHrPolicyHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/companyHrPolicies/fetchHistory", async (_, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/company/hr-policies/history");
        return res.data?.data || res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch policy history");
    }
});
const fetchCompanyHrPolicyImpact = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/companyHrPolicies/fetchImpact", async (_, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/company/hr-policies/impact");
        return res.data?.data || res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch policy impact");
    }
});
const upsertCompanyHrPolicies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/companyHrPolicies/upsert", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put("/company/hr-policies", data);
        return res.data?.data || res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to upsert company HR policies");
    }
});
const companyHrPoliciesSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "companyHrPolicies",
    initialState: companyHrPoliciesAdapter.getInitialState({
        currentPolicy: null,
        preview: null,
        history: [],
        impact: null,
        isLoading: false,
        error: null
    }),
    reducers: {
        clearCompanyHrPoliciesError (state) {
            state.error = null;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchCompanyHrPolicies.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchCompanyHrPolicies.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.currentPolicy = action.payload;
            if (action.payload?.id) {
                companyHrPoliciesAdapter.upsertOne(state, action.payload);
            }
        }).addCase(fetchCompanyHrPolicies.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(fetchAttendancePolicy.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchAttendancePolicy.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.currentPolicy = action.payload;
            if (action.payload?.id) {
                companyHrPoliciesAdapter.upsertOne(state, action.payload);
            }
        }).addCase(fetchAttendancePolicy.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(fetchCompanyHrPolicyPreview.fulfilled, (state, action)=>{
            state.preview = action.payload;
        }).addCase(fetchCompanyHrPolicyHistory.fulfilled, (state, action)=>{
            state.history = action.payload || [];
        }).addCase(fetchCompanyHrPolicyImpact.fulfilled, (state, action)=>{
            state.impact = action.payload;
        }).addCase(upsertCompanyHrPolicies.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(upsertCompanyHrPolicies.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.currentPolicy = action.payload;
            companyHrPoliciesAdapter.upsertOne(state, action.payload);
        }).addCase(upsertCompanyHrPolicies.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        });
    }
});
const { clearCompanyHrPoliciesError } = companyHrPoliciesSlice.actions;
const selectCurrentHrPolicy = (state)=>state.entities.companyHrPolicies.currentPolicy;
const selectHrPolicyPreview = (state)=>state.entities.companyHrPolicies.preview;
const selectHrPolicyHistory = (state)=>state.entities.companyHrPolicies.history;
const selectHrPolicyImpact = (state)=>state.entities.companyHrPolicies.impact;
const selectHrPoliciesLoading = (state)=>state.entities.companyHrPolicies.isLoading;
const selectHrPoliciesError = (state)=>state.entities.companyHrPolicies.error;
const __TURBOPACK__default__export__ = companyHrPoliciesSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/entities/departmentsSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearCurrentDepartment",
    ()=>clearCurrentDepartment,
    "clearDepartmentsError",
    ()=>clearDepartmentsError,
    "createDepartment",
    ()=>createDepartment,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteDepartment",
    ()=>deleteDepartment,
    "departmentsAdapter",
    ()=>departmentsAdapter,
    "fetchDepartmentById",
    ()=>fetchDepartmentById,
    "fetchDepartmentTree",
    ()=>fetchDepartmentTree,
    "fetchDepartments",
    ()=>fetchDepartments,
    "selectAllDepartments",
    ()=>selectAllDepartments,
    "selectCurrentDepartment",
    ()=>selectCurrentDepartment,
    "selectDepartmentById",
    ()=>selectDepartmentById,
    "selectDepartmentTree",
    ()=>selectDepartmentTree,
    "selectDepartmentsData",
    ()=>selectDepartmentsData,
    "selectDepartmentsError",
    ()=>selectDepartmentsError,
    "selectDepartmentsLoading",
    ()=>selectDepartmentsLoading,
    "updateDepartment",
    ()=>updateDepartment
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/reselect/dist/reselect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const departmentsAdapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createEntityAdapter"])();
const fetchDepartments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/departments/fetchAll", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/departments", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch departments");
    }
});
const fetchDepartmentTree = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/departments/fetchTree", async (_, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/departments/tree");
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch department tree");
    }
});
const fetchDepartmentById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/departments/fetchById", async (id, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/departments/${id}`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch department");
    }
});
const createDepartment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/departments/create", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/departments", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create department");
    }
});
const updateDepartment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/departments/update", async ({ id, data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/departments/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update department");
    }
});
const deleteDepartment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/departments/delete", async (id, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/departments/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete department");
    }
});
const departmentsSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "departments",
    initialState: departmentsAdapter.getInitialState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        current: null,
        treeData: [],
        isLoading: false,
        isTreeLoading: false,
        error: null
    }),
    reducers: {
        clearDepartmentsError (state) {
            state.error = null;
        },
        clearCurrentDepartment (state) {
            state.current = null;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchDepartments.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchDepartments.fulfilled, (state, action)=>{
            state.isLoading = false;
            departmentsAdapter.setAll(state, action.payload.data);
            state.total = action.payload.total;
            state.page = action.payload.page;
            state.limit = action.payload.limit;
            state.totalPages = action.payload.totalPages;
        }).addCase(fetchDepartments.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(fetchDepartmentTree.pending, (state)=>{
            state.isTreeLoading = true;
        }).addCase(fetchDepartmentTree.fulfilled, (state, action)=>{
            state.isTreeLoading = false;
            state.treeData = action.payload;
        }).addCase(fetchDepartmentTree.rejected, (state, action)=>{
            state.isTreeLoading = false;
            state.error = action.payload;
        }).addCase(fetchDepartmentById.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchDepartmentById.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.current = action.payload;
            departmentsAdapter.upsertOne(state, action.payload);
        }).addCase(fetchDepartmentById.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(createDepartment.fulfilled, (state, action)=>{
            departmentsAdapter.addOne(state, action.payload);
        }).addCase(createDepartment.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(updateDepartment.fulfilled, (state, action)=>{
            departmentsAdapter.upsertOne(state, action.payload);
            if (state.current?.id === action.payload.id) {
                state.current = {
                    ...state.current,
                    ...action.payload
                };
            }
        }).addCase(updateDepartment.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(deleteDepartment.fulfilled, (state, action)=>{
            departmentsAdapter.removeOne(state, action.payload);
        }).addCase(deleteDepartment.rejected, (state, action)=>{
            state.error = action.payload;
        });
    }
});
const { clearDepartmentsError, clearCurrentDepartment } = departmentsSlice.actions;
const { selectAll: selectAllDepartments, selectById: selectDepartmentById } = departmentsAdapter.getSelectors((state)=>state.entities.departments);
const selectDepartmentsData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSelector"])([
    selectAllDepartments,
    (state)=>state.entities.departments.total,
    (state)=>state.entities.departments.page,
    (state)=>state.entities.departments.limit,
    (state)=>state.entities.departments.totalPages
], (data, total, page, limit, totalPages)=>({
        data,
        total,
        page,
        limit,
        totalPages
    }));
const selectDepartmentTree = (state)=>state.entities.departments.treeData;
const selectCurrentDepartment = (state)=>state.entities.departments.current;
const selectDepartmentsLoading = (state)=>state.entities.departments.isLoading;
const selectDepartmentsError = (state)=>state.entities.departments.error;
const __TURBOPACK__default__export__ = departmentsSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/entities/designationsSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearCurrentDesignation",
    ()=>clearCurrentDesignation,
    "clearDesignationsError",
    ()=>clearDesignationsError,
    "createDesignation",
    ()=>createDesignation,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteDesignation",
    ()=>deleteDesignation,
    "designationsAdapter",
    ()=>designationsAdapter,
    "fetchDesignationById",
    ()=>fetchDesignationById,
    "fetchDesignationHierarchy",
    ()=>fetchDesignationHierarchy,
    "fetchDesignations",
    ()=>fetchDesignations,
    "selectAllDesignations",
    ()=>selectAllDesignations,
    "selectCurrentDesignation",
    ()=>selectCurrentDesignation,
    "selectDesignationById",
    ()=>selectDesignationById,
    "selectDesignationHierarchy",
    ()=>selectDesignationHierarchy,
    "selectDesignationsData",
    ()=>selectDesignationsData,
    "selectDesignationsError",
    ()=>selectDesignationsError,
    "selectDesignationsLoading",
    ()=>selectDesignationsLoading,
    "updateDesignation",
    ()=>updateDesignation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/reselect/dist/reselect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const designationsAdapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createEntityAdapter"])();
const fetchDesignations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/designations/fetchAll", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/designations", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch designations");
    }
});
const fetchDesignationHierarchy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/designations/fetchHierarchy", async (_, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/designations/hierarchy");
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch designation hierarchy");
    }
});
const fetchDesignationById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/designations/fetchById", async (id, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/designations/${id}`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch designation");
    }
});
const createDesignation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/designations/create", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/designations", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create designation");
    }
});
const updateDesignation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/designations/update", async ({ id, data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/designations/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update designation");
    }
});
const deleteDesignation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/designations/delete", async (id, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/designations/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete designation");
    }
});
const designationsSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "designations",
    initialState: designationsAdapter.getInitialState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        current: null,
        hierarchyData: [],
        isLoading: false,
        isHierarchyLoading: false,
        error: null
    }),
    reducers: {
        clearDesignationsError (state) {
            state.error = null;
        },
        clearCurrentDesignation (state) {
            state.current = null;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchDesignations.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchDesignations.fulfilled, (state, action)=>{
            state.isLoading = false;
            designationsAdapter.setAll(state, action.payload.data);
            state.total = action.payload.total;
            state.page = action.payload.page;
            state.limit = action.payload.limit;
            state.totalPages = action.payload.totalPages;
        }).addCase(fetchDesignations.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(fetchDesignationHierarchy.pending, (state)=>{
            state.isHierarchyLoading = true;
        }).addCase(fetchDesignationHierarchy.fulfilled, (state, action)=>{
            state.isHierarchyLoading = false;
            state.hierarchyData = action.payload;
        }).addCase(fetchDesignationHierarchy.rejected, (state, action)=>{
            state.isHierarchyLoading = false;
            state.error = action.payload;
        }).addCase(fetchDesignationById.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchDesignationById.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.current = action.payload;
            designationsAdapter.upsertOne(state, action.payload);
        }).addCase(fetchDesignationById.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(createDesignation.fulfilled, (state, action)=>{
            designationsAdapter.addOne(state, action.payload);
        }).addCase(createDesignation.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(updateDesignation.fulfilled, (state, action)=>{
            designationsAdapter.upsertOne(state, action.payload);
            if (state.current?.id === action.payload.id) {
                state.current = {
                    ...state.current,
                    ...action.payload
                };
            }
        }).addCase(updateDesignation.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(deleteDesignation.fulfilled, (state, action)=>{
            designationsAdapter.removeOne(state, action.payload);
        }).addCase(deleteDesignation.rejected, (state, action)=>{
            state.error = action.payload;
        });
    }
});
const { clearDesignationsError, clearCurrentDesignation } = designationsSlice.actions;
const { selectAll: selectAllDesignations, selectById: selectDesignationById } = designationsAdapter.getSelectors((state)=>state.entities.designations);
const selectDesignationsData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSelector"])([
    selectAllDesignations,
    (state)=>state.entities.designations.total,
    (state)=>state.entities.designations.page,
    (state)=>state.entities.designations.limit,
    (state)=>state.entities.designations.totalPages
], (data, total, page, limit, totalPages)=>({
        data,
        total,
        page,
        limit,
        totalPages
    }));
const selectDesignationHierarchy = (state)=>state.entities.designations.hierarchyData;
const selectCurrentDesignation = (state)=>state.entities.designations.current;
const selectDesignationsLoading = (state)=>state.entities.designations.isLoading;
const selectDesignationsError = (state)=>state.entities.designations.error;
const __TURBOPACK__default__export__ = designationsSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/entities/employeesSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addEmployeeDocument",
    ()=>addEmployeeDocument,
    "clearCurrentEmployee",
    ()=>clearCurrentEmployee,
    "clearEmployeesError",
    ()=>clearEmployeesError,
    "createEmployee",
    ()=>createEmployee,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteEmployee",
    ()=>deleteEmployee,
    "deleteEmployeeDocument",
    ()=>deleteEmployeeDocument,
    "employeesAdapter",
    ()=>employeesAdapter,
    "fetchEmployeeById",
    ()=>fetchEmployeeById,
    "fetchEmployeeDocuments",
    ()=>fetchEmployeeDocuments,
    "fetchEmployees",
    ()=>fetchEmployees,
    "selectAllEmployees",
    ()=>selectAllEmployees,
    "selectCurrentEmployee",
    ()=>selectCurrentEmployee,
    "selectEmployeeById",
    ()=>selectEmployeeById,
    "selectEmployeeDocuments",
    ()=>selectEmployeeDocuments,
    "selectEmployeeEntities",
    ()=>selectEmployeeEntities,
    "selectEmployeesData",
    ()=>selectEmployeesData,
    "selectEmployeesError",
    ()=>selectEmployeesError,
    "selectEmployeesLoading",
    ()=>selectEmployeesLoading,
    "transitionEmployeeLifecycle",
    ()=>transitionEmployeeLifecycle,
    "updateEmployee",
    ()=>updateEmployee,
    "verifyEmployeeDocument",
    ()=>verifyEmployeeDocument
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/reselect/dist/reselect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const employeesAdapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createEntityAdapter"])();
const fetchEmployees = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/employees/fetchAll", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/employees", {
            params
        });
        return res.data; // { data: [], total, page, limit, totalPages }
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch employees");
    }
});
const fetchEmployeeById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/employees/fetchById", async (id, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/employees/${id}`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch employee");
    }
});
const createEmployee = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/employees/create", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/employees", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create employee");
    }
});
const updateEmployee = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/employees/update", async ({ id, data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/employees/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update employee");
    }
});
const deleteEmployee = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/employees/delete", async (id, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/employees/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete employee");
    }
});
const transitionEmployeeLifecycle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/employees/transition", async ({ id, transition, data }, { rejectWithValue })=>{
    try {
        let res;
        if (transition === 'start-onboarding') {
            res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/employees/${id}/start-onboarding`, data);
        } else {
            res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/employees/${id}/${transition}`, data);
        }
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to transition employee");
    }
});
const fetchEmployeeDocuments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/employees/fetchDocuments", async (employeeId, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/employees/${employeeId}/documents`);
        return res.data; // array of documents
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch documents");
    }
});
const addEmployeeDocument = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/employees/addDocument", async ({ employeeId, data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/employees/${employeeId}/documents`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to add document");
    }
});
const verifyEmployeeDocument = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/employees/verifyDocument", async ({ employeeId, documentId, data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/employees/${employeeId}/documents/${documentId}/verify`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to verify document");
    }
});
const deleteEmployeeDocument = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/employees/deleteDocument", async ({ employeeId, documentId }, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/employees/${employeeId}/documents/${documentId}`);
        return documentId;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete document");
    }
});
const employeesSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "employees",
    initialState: employeesAdapter.getInitialState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        current: null,
        documents: [],
        isLoading: false,
        isDocumentsLoading: false,
        error: null
    }),
    reducers: {
        clearEmployeesError (state) {
            state.error = null;
        },
        clearCurrentEmployee (state) {
            state.current = null;
            state.documents = [];
        }
    },
    extraReducers: (builder)=>{
        builder// Fetch List
        .addCase(fetchEmployees.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchEmployees.fulfilled, (state, action)=>{
            state.isLoading = false;
            employeesAdapter.setAll(state, action.payload.data);
            state.total = action.payload.total;
            state.page = action.payload.page;
            state.limit = action.payload.limit;
            state.totalPages = action.payload.totalPages;
        }).addCase(fetchEmployees.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        })// Fetch Single
        .addCase(fetchEmployeeById.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchEmployeeById.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.current = action.payload;
            employeesAdapter.upsertOne(state, action.payload);
        }).addCase(fetchEmployeeById.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        })// Create
        .addCase(createEmployee.fulfilled, (state, action)=>{
            employeesAdapter.addOne(state, action.payload);
        }).addCase(createEmployee.rejected, (state, action)=>{
            state.error = action.payload;
        })// Update
        .addCase(updateEmployee.fulfilled, (state, action)=>{
            employeesAdapter.upsertOne(state, action.payload);
            if (state.current?.id === action.payload.id) {
                state.current = {
                    ...state.current,
                    ...action.payload
                };
            }
        }).addCase(updateEmployee.rejected, (state, action)=>{
            state.error = action.payload;
        })// Lifecycle Transition
        .addCase(transitionEmployeeLifecycle.fulfilled, (state, action)=>{
            employeesAdapter.upsertOne(state, action.payload);
            if (state.current?.id === action.payload.id) {
                state.current = {
                    ...state.current,
                    ...action.payload
                };
            }
        }).addCase(transitionEmployeeLifecycle.rejected, (state, action)=>{
            state.error = action.payload;
        })// Delete
        .addCase(deleteEmployee.fulfilled, (state, action)=>{
            employeesAdapter.removeOne(state, action.payload);
        }).addCase(deleteEmployee.rejected, (state, action)=>{
            state.error = action.payload;
        })// Documents
        .addCase(fetchEmployeeDocuments.pending, (state)=>{
            state.isDocumentsLoading = true;
        }).addCase(fetchEmployeeDocuments.fulfilled, (state, action)=>{
            state.isDocumentsLoading = false;
            state.documents = action.payload;
        }).addCase(fetchEmployeeDocuments.rejected, (state, action)=>{
            state.isDocumentsLoading = false;
            state.error = action.payload;
        }).addCase(addEmployeeDocument.fulfilled, (state, action)=>{
            state.documents.unshift(action.payload);
        }).addCase(verifyEmployeeDocument.fulfilled, (state, action)=>{
            const idx = state.documents.findIndex((d)=>d.id === action.payload.id);
            if (idx !== -1) {
                state.documents[idx] = action.payload;
            }
        }).addCase(deleteEmployeeDocument.fulfilled, (state, action)=>{
            state.documents = state.documents.filter((d)=>d.id !== action.payload);
        });
    }
});
const { clearEmployeesError, clearCurrentEmployee } = employeesSlice.actions;
const { selectAll: selectAllEmployees, selectById: selectEmployeeById, selectEntities: selectEmployeeEntities } = employeesAdapter.getSelectors((state)=>state.entities.employees);
const selectEmployeesData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSelector"])([
    selectAllEmployees,
    (state)=>state.entities.employees.total,
    (state)=>state.entities.employees.page,
    (state)=>state.entities.employees.limit,
    (state)=>state.entities.employees.totalPages
], (data, total, page, limit, totalPages)=>({
        data,
        total,
        page,
        limit,
        totalPages
    }));
const selectCurrentEmployee = (state)=>state.entities.employees.current;
const selectEmployeeDocuments = (state)=>state.entities.employees.documents;
const selectEmployeesLoading = (state)=>state.entities.employees.isLoading;
const selectEmployeesError = (state)=>state.entities.employees.error;
const __TURBOPACK__default__export__ = employeesSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/entities/holidaysSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearCurrentHoliday",
    ()=>clearCurrentHoliday,
    "clearHolidaysError",
    ()=>clearHolidaysError,
    "createHoliday",
    ()=>createHoliday,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteHoliday",
    ()=>deleteHoliday,
    "fetchHolidayById",
    ()=>fetchHolidayById,
    "fetchHolidays",
    ()=>fetchHolidays,
    "holidaysAdapter",
    ()=>holidaysAdapter,
    "selectAllHolidays",
    ()=>selectAllHolidays,
    "selectCurrentHoliday",
    ()=>selectCurrentHoliday,
    "selectHolidayById",
    ()=>selectHolidayById,
    "selectHolidaysData",
    ()=>selectHolidaysData,
    "selectHolidaysError",
    ()=>selectHolidaysError,
    "selectHolidaysLoading",
    ()=>selectHolidaysLoading,
    "updateHoliday",
    ()=>updateHoliday
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/reselect/dist/reselect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const holidaysAdapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createEntityAdapter"])();
const fetchHolidays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/holidays/fetchAll", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/holidays", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch holidays");
    }
});
const fetchHolidayById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/holidays/fetchById", async (id, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/holidays/${id}`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch holiday");
    }
});
const createHoliday = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/holidays/create", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/holidays", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create holiday");
    }
});
const updateHoliday = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/holidays/update", async ({ id, data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/holidays/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update holiday");
    }
});
const deleteHoliday = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/holidays/delete", async (id, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/holidays/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete holiday");
    }
});
const holidaysSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "holidays",
    initialState: holidaysAdapter.getInitialState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        current: null,
        isLoading: false,
        error: null
    }),
    reducers: {
        clearHolidaysError (state) {
            state.error = null;
        },
        clearCurrentHoliday (state) {
            state.current = null;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchHolidays.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchHolidays.fulfilled, (state, action)=>{
            state.isLoading = false;
            holidaysAdapter.setAll(state, action.payload.data || action.payload);
            state.total = action.payload.total || action.payload.length;
            state.page = action.payload.page || 1;
            state.limit = action.payload.limit || 10;
            state.totalPages = action.payload.totalPages || 1;
        }).addCase(fetchHolidays.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(fetchHolidayById.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchHolidayById.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.current = action.payload;
            holidaysAdapter.upsertOne(state, action.payload);
        }).addCase(fetchHolidayById.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(createHoliday.fulfilled, (state, action)=>{
            holidaysAdapter.addOne(state, action.payload);
        }).addCase(createHoliday.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(updateHoliday.fulfilled, (state, action)=>{
            holidaysAdapter.upsertOne(state, action.payload);
            if (state.current?.id === action.payload.id) {
                state.current = {
                    ...state.current,
                    ...action.payload
                };
            }
        }).addCase(updateHoliday.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(deleteHoliday.fulfilled, (state, action)=>{
            holidaysAdapter.removeOne(state, action.payload);
        }).addCase(deleteHoliday.rejected, (state, action)=>{
            state.error = action.payload;
        });
    }
});
const { clearHolidaysError, clearCurrentHoliday } = holidaysSlice.actions;
const { selectAll: selectAllHolidays, selectById: selectHolidayById } = holidaysAdapter.getSelectors((state)=>state.entities.holidays);
const selectHolidaysData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSelector"])([
    selectAllHolidays,
    (state)=>state.entities.holidays.total,
    (state)=>state.entities.holidays.page,
    (state)=>state.entities.holidays.limit,
    (state)=>state.entities.holidays.totalPages
], (data, total, page, limit, totalPages)=>({
        data,
        total,
        page,
        limit,
        totalPages
    }));
const selectCurrentHoliday = (state)=>state.entities.holidays.current;
const selectHolidaysLoading = (state)=>state.entities.holidays.isLoading;
const selectHolidaysError = (state)=>state.entities.holidays.error;
const __TURBOPACK__default__export__ = holidaysSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/entities/leaveBalancesSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearLeaveBalancesError",
    ()=>clearLeaveBalancesError,
    "default",
    ()=>__TURBOPACK__default__export__,
    "fetchLeaveBalances",
    ()=>fetchLeaveBalances,
    "selectLeaveBalancesData",
    ()=>selectLeaveBalancesData,
    "selectLeaveBalancesError",
    ()=>selectLeaveBalancesError,
    "selectLeaveBalancesLoading",
    ()=>selectLeaveBalancesLoading
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const fetchLeaveBalances = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/leaveBalances/fetchForEmployee", async ({ employeeId, year }, { rejectWithValue })=>{
    try {
        const params = year ? {
            year
        } : {};
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/leave-balances/employee/${employeeId}`, {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch leave balances");
    }
});
const leaveBalancesSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "leaveBalances",
    initialState: {
        data: [],
        isLoading: false,
        error: null
    },
    reducers: {
        clearLeaveBalancesError (state) {
            state.error = null;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchLeaveBalances.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchLeaveBalances.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.data = action.payload;
        }).addCase(fetchLeaveBalances.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        });
    }
});
const { clearLeaveBalancesError } = leaveBalancesSlice.actions;
const selectLeaveBalancesData = (state)=>state.entities.leaveBalances.data;
const selectLeaveBalancesLoading = (state)=>state.entities.leaveBalances.isLoading;
const selectLeaveBalancesError = (state)=>state.entities.leaveBalances.error;
const __TURBOPACK__default__export__ = leaveBalancesSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/entities/leaveRequestsSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "applyLeave",
    ()=>applyLeave,
    "approveLeave",
    ()=>approveLeave,
    "cancelApprovedLeave",
    ()=>cancelApprovedLeave,
    "cancelLeave",
    ()=>cancelLeave,
    "clearLeaveRequestsError",
    ()=>clearLeaveRequestsError,
    "default",
    ()=>__TURBOPACK__default__export__,
    "fetchLeaveDashboardSummary",
    ()=>fetchLeaveDashboardSummary,
    "fetchLeaveRequests",
    ()=>fetchLeaveRequests,
    "fetchMonthlyLeaveSummary",
    ()=>fetchMonthlyLeaveSummary,
    "fetchMyLeaves",
    ()=>fetchMyLeaves,
    "leaveRequestsAdapter",
    ()=>leaveRequestsAdapter,
    "rejectLeave",
    ()=>rejectLeave,
    "selectAllLeaveRequests",
    ()=>selectAllLeaveRequests,
    "selectLeaveRequestById",
    ()=>selectLeaveRequestById,
    "selectLeaveRequestsData",
    ()=>selectLeaveRequestsData,
    "selectLeaveRequestsError",
    ()=>selectLeaveRequestsError,
    "selectLeaveRequestsLoading",
    ()=>selectLeaveRequestsLoading,
    "selectMonthlyLeaveSummary",
    ()=>selectMonthlyLeaveSummary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/reselect/dist/reselect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const leaveRequestsAdapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createEntityAdapter"])();
const applyLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/leaveRequests/apply", async (formData, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/leave-requests/apply", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to apply leave");
    }
});
const fetchLeaveRequests = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/leaveRequests/fetchAll", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/leave-requests", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch leave requests");
    }
});
const fetchMyLeaves = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/leaveRequests/fetchMy", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/leave-requests/my-leaves", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch my leaves");
    }
});
const fetchLeaveDashboardSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/leaveRequests/fetchSummary", async (_, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/leave-requests/dashboard/summary");
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch dashboard summary");
    }
});
const fetchMonthlyLeaveSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/leaveRequests/fetchMonthlySummary", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/leave-requests/monthly-summary", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch monthly summary");
    }
});
const approveLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/leaveRequests/approve", async ({ id, remarks }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/leave-requests/${id}/approve`, {
            remarks
        });
        return {
            id,
            ...res.data
        };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to approve leave");
    }
});
const rejectLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/leaveRequests/reject", async ({ id, remarks }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/leave-requests/${id}/reject`, {
            reason: remarks
        });
        return {
            id,
            ...res.data
        };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to reject leave");
    }
});
const cancelApprovedLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/leaveRequests/cancelApproved", async ({ id, reason }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/leave-requests/${id}/cancel-approved`, {
            reason
        });
        return {
            id,
            ...res.data
        };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to cancel approved leave");
    }
});
const cancelLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/leaveRequests/cancel", async ({ id, reason }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/leave-requests/${id}/cancel`, {
            reason
        });
        return {
            id,
            ...res.data
        };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to cancel leave");
    }
});
const leaveRequestsSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "leaveRequests",
    initialState: leaveRequestsAdapter.getInitialState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        dashboardSummary: null,
        monthlySummary: null,
        isLoading: false,
        error: null
    }),
    reducers: {
        clearLeaveRequestsError (state) {
            state.error = null;
        }
    },
    extraReducers: (builder)=>{
        builder// Fetch All (Company)
        .addCase(fetchLeaveRequests.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchLeaveRequests.fulfilled, (state, action)=>{
            state.isLoading = false;
            const payload = action.payload;
            const data = payload.data || payload;
            const meta = payload.meta || {};
            leaveRequestsAdapter.setAll(state, data);
            state.total = meta.total ?? payload.total ?? (Array.isArray(data) ? data.length : 0);
            state.page = meta.page ?? payload.page ?? 1;
            state.limit = meta.limit ?? payload.limit ?? 10;
            state.totalPages = meta.totalPages ?? payload.totalPages ?? 1;
        }).addCase(fetchLeaveRequests.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        })// Fetch My Leaves
        .addCase(fetchMyLeaves.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchMyLeaves.fulfilled, (state, action)=>{
            state.isLoading = false;
            const payload = action.payload;
            const data = payload.data || payload;
            const meta = payload.meta || {};
            leaveRequestsAdapter.setAll(state, data);
            state.total = meta.total ?? payload.total ?? (Array.isArray(data) ? data.length : 0);
            state.page = meta.page ?? payload.page ?? 1;
            state.limit = meta.limit ?? payload.limit ?? 10;
            state.totalPages = meta.totalPages ?? payload.totalPages ?? 1;
        }).addCase(fetchMyLeaves.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        })// Apply Leave
        .addCase(applyLeave.fulfilled, (state, action)=>{
            leaveRequestsAdapter.addOne(state, action.payload);
        }).addCase(applyLeave.rejected, (state, action)=>{
            state.error = action.payload;
        })// Dashboard Summary
        .addCase(fetchLeaveDashboardSummary.fulfilled, (state, action)=>{
            state.dashboardSummary = action.payload;
        })// Monthly Summary
        .addCase(fetchMonthlyLeaveSummary.fulfilled, (state, action)=>{
            state.monthlySummary = action.payload;
        })// Status updates (Approve, Reject, Cancel)
        .addCase(approveLeave.fulfilled, (state, action)=>{
            if (action.payload?.id) {
                leaveRequestsAdapter.upsertOne(state, action.payload);
            } else {
                leaveRequestsAdapter.removeOne(state, action.meta.arg.id);
            }
        }).addCase(rejectLeave.fulfilled, (state, action)=>{
            if (action.payload?.id) {
                leaveRequestsAdapter.upsertOne(state, action.payload);
            } else {
                leaveRequestsAdapter.removeOne(state, action.meta.arg.id);
            }
        }).addCase(cancelApprovedLeave.fulfilled, (state, action)=>{
            if (action.payload?.id) {
                leaveRequestsAdapter.upsertOne(state, action.payload);
            } else {
                leaveRequestsAdapter.removeOne(state, action.meta.arg.id);
            }
        }).addCase(cancelLeave.fulfilled, (state, action)=>{
            if (action.payload?.id) {
                leaveRequestsAdapter.upsertOne(state, action.payload);
            } else {
                leaveRequestsAdapter.removeOne(state, action.meta.arg.id);
            }
        });
    }
});
const { clearLeaveRequestsError } = leaveRequestsSlice.actions;
const { selectAll: selectAllLeaveRequests, selectById: selectLeaveRequestById } = leaveRequestsAdapter.getSelectors((state)=>state.entities.leaveRequests);
const selectLeaveRequestsData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSelector"])([
    selectAllLeaveRequests,
    (state)=>state.entities.leaveRequests.total,
    (state)=>state.entities.leaveRequests.page,
    (state)=>state.entities.leaveRequests.limit,
    (state)=>state.entities.leaveRequests.totalPages,
    (state)=>state.entities.leaveRequests.dashboardSummary
], (data, total, page, limit, totalPages, dashboardSummary)=>({
        data,
        total,
        page,
        limit,
        totalPages,
        dashboardSummary
    }));
const selectMonthlyLeaveSummary = (state)=>state.entities.leaveRequests.monthlySummary;
const selectLeaveRequestsLoading = (state)=>state.entities.leaveRequests.isLoading;
const selectLeaveRequestsError = (state)=>state.entities.leaveRequests.error;
const __TURBOPACK__default__export__ = leaveRequestsSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/entities/leaveTypesSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearCurrentLeaveType",
    ()=>clearCurrentLeaveType,
    "clearLeaveTypesError",
    ()=>clearLeaveTypesError,
    "createLeaveType",
    ()=>createLeaveType,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteLeaveType",
    ()=>deleteLeaveType,
    "fetchLeaveTypeById",
    ()=>fetchLeaveTypeById,
    "fetchLeaveTypes",
    ()=>fetchLeaveTypes,
    "fetchLeaveTypesForApply",
    ()=>fetchLeaveTypesForApply,
    "leaveTypesAdapter",
    ()=>leaveTypesAdapter,
    "selectAllLeaveTypes",
    ()=>selectAllLeaveTypes,
    "selectCurrentLeaveType",
    ()=>selectCurrentLeaveType,
    "selectLeaveTypeById",
    ()=>selectLeaveTypeById,
    "selectLeaveTypesData",
    ()=>selectLeaveTypesData,
    "selectLeaveTypesError",
    ()=>selectLeaveTypesError,
    "selectLeaveTypesLoading",
    ()=>selectLeaveTypesLoading,
    "updateLeaveType",
    ()=>updateLeaveType
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/reselect/dist/reselect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const leaveTypesAdapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createEntityAdapter"])();
const fetchLeaveTypes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/leaveTypes/fetchAll", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/leave-types", {
            params
        });
        return res.data;
    } catch (err) {
        if (err.response?.status === 403) {
            try {
                const fallbackRes = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/leave-types/for-apply", {
                    params
                });
                return fallbackRes.data;
            } catch (fallbackErr) {
                return rejectWithValue(err.response?.data?.message || "Failed to fetch leave types");
            }
        }
        return rejectWithValue(err.response?.data?.message || "Failed to fetch leave types");
    }
});
const fetchLeaveTypesForApply = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/leaveTypes/fetchForApply", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/leave-types/for-apply", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch leave types");
    }
});
const fetchLeaveTypeById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/leaveTypes/fetchById", async (id, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/leave-types/${id}`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch leave type");
    }
});
const createLeaveType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/leaveTypes/create", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/leave-types", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create leave type");
    }
});
const updateLeaveType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/leaveTypes/update", async ({ id, data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/leave-types/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update leave type");
    }
});
const deleteLeaveType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/leaveTypes/delete", async (id, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/leave-types/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete leave type");
    }
});
const leaveTypesSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "leaveTypes",
    initialState: leaveTypesAdapter.getInitialState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        current: null,
        isLoading: false,
        error: null
    }),
    reducers: {
        clearLeaveTypesError (state) {
            state.error = null;
        },
        clearCurrentLeaveType (state) {
            state.current = null;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchLeaveTypes.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchLeaveTypes.fulfilled, (state, action)=>{
            state.isLoading = false;
            leaveTypesAdapter.setAll(state, action.payload.data || action.payload);
            state.total = action.payload.total || action.payload.length;
            state.page = action.payload.page || 1;
            state.limit = action.payload.limit || 10;
            state.totalPages = action.payload.totalPages || 1;
        }).addCase(fetchLeaveTypes.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(fetchLeaveTypesForApply.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchLeaveTypesForApply.fulfilled, (state, action)=>{
            state.isLoading = false;
            leaveTypesAdapter.setAll(state, action.payload.data || action.payload);
            state.total = action.payload.total || action.payload.length;
            state.page = action.payload.page || 1;
            state.limit = action.payload.limit || 10;
            state.totalPages = action.payload.totalPages || 1;
        }).addCase(fetchLeaveTypesForApply.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(fetchLeaveTypeById.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchLeaveTypeById.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.current = action.payload;
            leaveTypesAdapter.upsertOne(state, action.payload);
        }).addCase(fetchLeaveTypeById.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(createLeaveType.fulfilled, (state, action)=>{
            leaveTypesAdapter.addOne(state, action.payload);
        }).addCase(createLeaveType.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(updateLeaveType.fulfilled, (state, action)=>{
            leaveTypesAdapter.upsertOne(state, action.payload);
            if (state.current?.id === action.payload.id) {
                state.current = {
                    ...state.current,
                    ...action.payload
                };
            }
        }).addCase(updateLeaveType.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(deleteLeaveType.fulfilled, (state, action)=>{
            leaveTypesAdapter.removeOne(state, action.payload);
        }).addCase(deleteLeaveType.rejected, (state, action)=>{
            state.error = action.payload;
        });
    }
});
const { clearLeaveTypesError, clearCurrentLeaveType } = leaveTypesSlice.actions;
const { selectAll: selectAllLeaveTypes, selectById: selectLeaveTypeById } = leaveTypesAdapter.getSelectors((state)=>state.entities.leaveTypes);
const selectLeaveTypesData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSelector"])([
    selectAllLeaveTypes,
    (state)=>state.entities.leaveTypes.total,
    (state)=>state.entities.leaveTypes.page,
    (state)=>state.entities.leaveTypes.limit,
    (state)=>state.entities.leaveTypes.totalPages
], (data, total, page, limit, totalPages)=>({
        data,
        total,
        page,
        limit,
        totalPages
    }));
const selectCurrentLeaveType = (state)=>state.entities.leaveTypes.current;
const selectLeaveTypesLoading = (state)=>state.entities.leaveTypes.isLoading;
const selectLeaveTypesError = (state)=>state.entities.leaveTypes.error;
const __TURBOPACK__default__export__ = leaveTypesSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/entities/partnerRoleSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearPartnerRolesError",
    ()=>clearPartnerRolesError,
    "createPartnerRole",
    ()=>createPartnerRole,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deletePartnerRole",
    ()=>deletePartnerRole,
    "fetchPartnerRoles",
    ()=>fetchPartnerRoles,
    "permanentDeletePartnerRole",
    ()=>permanentDeletePartnerRole,
    "restorePartnerRole",
    ()=>restorePartnerRole,
    "selectPartnerRoles",
    ()=>selectPartnerRoles,
    "selectPartnerRolesError",
    ()=>selectPartnerRolesError,
    "selectPartnerRolesLoading",
    ()=>selectPartnerRolesLoading,
    "selectPartnerRolesTotalCount",
    ()=>selectPartnerRolesTotalCount,
    "selectPartnerRolesTotalPages",
    ()=>selectPartnerRolesTotalPages,
    "updatePartnerRole",
    ()=>updatePartnerRole
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const fetchPartnerRoles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("partnerRoles/fetchAll", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/partner-roles", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch partner roles");
    }
});
const createPartnerRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("partnerRoles/create", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/masters/partner-roles", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create partner role");
    }
});
const updatePartnerRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("partnerRoles/update", async ({ id, ...data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/masters/partner-roles/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update partner role");
    }
});
const deletePartnerRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("partnerRoles/delete", async (arg, { rejectWithValue })=>{
    try {
        const id = typeof arg === "object" ? arg.id : arg;
        const reason = typeof arg === "object" ? arg.reason : undefined;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/masters/partner-roles/${id}`, {
            params: {
                reason
            }
        });
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete partner role");
    }
});
const restorePartnerRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("partnerRoles/restore", async (id, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/masters/partner-roles/${id}/restore`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to restore partner role");
    }
});
const permanentDeletePartnerRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("partnerRoles/permanentDelete", async (arg, { rejectWithValue })=>{
    try {
        const id = typeof arg === "object" ? arg.id : arg;
        const reason = typeof arg === "object" ? arg.reason : undefined;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/masters/partner-roles/${id}/permanent`, {
            params: {
                reason
            }
        });
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to permanently delete partner role");
    }
});
const partnerRoleSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "partnerRoles",
    initialState: {
        list: [],
        totalCount: 0,
        totalPages: 1,
        currentPage: 1,
        isLoading: false,
        error: null
    },
    reducers: {
        clearPartnerRolesError (state) {
            state.error = null;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchPartnerRoles.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchPartnerRoles.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.list = action.payload.data || [];
            state.totalCount = action.payload.total || 0;
            state.totalPages = action.payload.totalPages || 1;
            state.currentPage = action.payload.page || 1;
        }).addCase(fetchPartnerRoles.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(createPartnerRole.fulfilled, (state, action)=>{
            state.list.unshift(action.payload);
            state.totalCount += 1;
        }).addCase(createPartnerRole.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(updatePartnerRole.fulfilled, (state, action)=>{
            const idx = state.list.findIndex((r)=>r.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        }).addCase(updatePartnerRole.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(deletePartnerRole.fulfilled, (state, action)=>{
            state.list = state.list.filter((r)=>r.id !== action.payload);
            state.totalCount -= 1;
        }).addCase(deletePartnerRole.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(restorePartnerRole.fulfilled, (state, action)=>{
            const idx = state.list.findIndex((r)=>r.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        }).addCase(restorePartnerRole.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(permanentDeletePartnerRole.fulfilled, (state, action)=>{
            state.list = state.list.filter((r)=>r.id !== action.payload);
            state.totalCount -= 1;
        }).addCase(permanentDeletePartnerRole.rejected, (state, action)=>{
            state.error = action.payload;
        });
    }
});
const { clearPartnerRolesError } = partnerRoleSlice.actions;
const selectPartnerRoles = (state)=>state.entities.partnerRoles.list;
const selectPartnerRolesTotalCount = (state)=>state.entities.partnerRoles.totalCount;
const selectPartnerRolesTotalPages = (state)=>state.entities.partnerRoles.totalPages;
const selectPartnerRolesLoading = (state)=>state.entities.partnerRoles.isLoading;
const selectPartnerRolesError = (state)=>state.entities.partnerRoles.error;
const __TURBOPACK__default__export__ = partnerRoleSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/entities/partnerSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearPartnersError",
    ()=>clearPartnersError,
    "createPartner",
    ()=>createPartner,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deletePartner",
    ()=>deletePartner,
    "fetchPartners",
    ()=>fetchPartners,
    "permanentDeletePartner",
    ()=>permanentDeletePartner,
    "restorePartner",
    ()=>restorePartner,
    "selectPartners",
    ()=>selectPartners,
    "selectPartnersError",
    ()=>selectPartnersError,
    "selectPartnersLoading",
    ()=>selectPartnersLoading,
    "selectPartnersTotalCount",
    ()=>selectPartnersTotalCount,
    "selectPartnersTotalPages",
    ()=>selectPartnersTotalPages,
    "updatePartner",
    ()=>updatePartner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const fetchPartners = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("partners/fetchAll", async (params, { rejectWithValue, signal })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/partners", {
            params,
            signal
        });
        return res.data;
    } catch (err) {
        if (err.name === 'CanceledError' || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isCancel?.(err)) {
            return rejectWithValue("canceled");
        }
        return rejectWithValue(err.response?.data?.message || "Failed to fetch partners");
    }
});
const createPartner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("partners/create", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/masters/partners", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create partner");
    }
});
const updatePartner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("partners/update", async ({ id, ...data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/masters/partners/${id}`, data);
        return res.data;
    } catch (err) {
        if (err.response?.status === 404) {
            try {
                const createRes = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/masters/partners", data);
                return createRes.data;
            } catch (createErr) {
                return rejectWithValue(createErr.response?.data?.message || "Failed to save partner");
            }
        }
        return rejectWithValue(err.response?.data?.message || "Failed to update partner");
    }
});
const deletePartner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("partners/delete", async (arg, { rejectWithValue })=>{
    try {
        const id = typeof arg === "object" ? arg.id : arg;
        const reason = typeof arg === "object" ? arg.reason : undefined;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/masters/partners/${id}`, {
            params: {
                reason
            }
        });
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete partner");
    }
});
const restorePartner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("partners/restore", async (id, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/masters/partners/${id}/restore`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to restore partner");
    }
});
const permanentDeletePartner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("partners/permanentDelete", async (arg, { rejectWithValue })=>{
    try {
        const id = typeof arg === "object" ? arg.id : arg;
        const reason = typeof arg === "object" ? arg.reason : undefined;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/masters/partners/${id}/permanent`, {
            params: {
                reason
            }
        });
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to permanently delete partner");
    }
});
const partnerSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "partners",
    initialState: {
        list: [],
        totalCount: 0,
        totalPages: 1,
        currentPage: 1,
        isLoading: false,
        error: null
    },
    reducers: {
        clearPartnersError (state) {
            state.error = null;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchPartners.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchPartners.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.list = action.payload.data || [];
            state.totalCount = action.payload.total || 0;
            state.totalPages = action.payload.totalPages || 1;
            state.currentPage = action.payload.page || 1;
        }).addCase(fetchPartners.rejected, (state, action)=>{
            if (action.meta.aborted) {
                return;
            }
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(createPartner.fulfilled, (state, action)=>{
            state.list.unshift(action.payload);
            state.totalCount += 1;
        }).addCase(createPartner.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(updatePartner.fulfilled, (state, action)=>{
            const idx = state.list.findIndex((c)=>c.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        }).addCase(updatePartner.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(deletePartner.fulfilled, (state, action)=>{
            state.list = state.list.filter((c)=>c.id !== action.payload);
            state.totalCount -= 1;
        }).addCase(deletePartner.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(restorePartner.fulfilled, (state, action)=>{
            const idx = state.list.findIndex((c)=>c.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        }).addCase(restorePartner.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(permanentDeletePartner.fulfilled, (state, action)=>{
            state.list = state.list.filter((c)=>c.id !== action.payload);
            state.totalCount -= 1;
        }).addCase(permanentDeletePartner.rejected, (state, action)=>{
            state.error = action.payload;
        });
    }
});
const { clearPartnersError } = partnerSlice.actions;
const selectPartners = (state)=>state.entities.partners.list;
const selectPartnersTotalCount = (state)=>state.entities.partners.totalCount;
const selectPartnersTotalPages = (state)=>state.entities.partners.totalPages;
const selectPartnersLoading = (state)=>state.entities.partners.isLoading;
const selectPartnersError = (state)=>state.entities.partners.error;
const __TURBOPACK__default__export__ = partnerSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/entities/paymentTermSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearPaymentTermsError",
    ()=>clearPaymentTermsError,
    "createPaymentTerm",
    ()=>createPaymentTerm,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deletePaymentTerm",
    ()=>deletePaymentTerm,
    "fetchPaymentTerms",
    ()=>fetchPaymentTerms,
    "permanentDeletePaymentTerm",
    ()=>permanentDeletePaymentTerm,
    "restorePaymentTerm",
    ()=>restorePaymentTerm,
    "selectPaymentTerms",
    ()=>selectPaymentTerms,
    "selectPaymentTermsError",
    ()=>selectPaymentTermsError,
    "selectPaymentTermsLoading",
    ()=>selectPaymentTermsLoading,
    "selectPaymentTermsTotalCount",
    ()=>selectPaymentTermsTotalCount,
    "selectPaymentTermsTotalPages",
    ()=>selectPaymentTermsTotalPages,
    "updatePaymentTerm",
    ()=>updatePaymentTerm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const fetchPaymentTerms = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("paymentTerms/fetchAll", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/payment-terms", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch payment terms");
    }
});
const createPaymentTerm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("paymentTerms/create", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/masters/payment-terms", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create payment term");
    }
});
const updatePaymentTerm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("paymentTerms/update", async ({ id, ...data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/masters/payment-terms/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update payment term");
    }
});
const deletePaymentTerm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("paymentTerms/delete", async (arg, { rejectWithValue })=>{
    try {
        const id = typeof arg === "object" ? arg.id : arg;
        const reason = typeof arg === "object" ? arg.reason : undefined;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/masters/payment-terms/${id}`, {
            params: {
                reason
            }
        });
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete payment term");
    }
});
const restorePaymentTerm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("paymentTerms/restore", async (id, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/masters/payment-terms/${id}/restore`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to restore payment term");
    }
});
const permanentDeletePaymentTerm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("paymentTerms/permanentDelete", async (arg, { rejectWithValue })=>{
    try {
        const id = typeof arg === "object" ? arg.id : arg;
        const reason = typeof arg === "object" ? arg.reason : undefined;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/masters/payment-terms/${id}/permanent`, {
            params: {
                reason
            }
        });
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to permanently delete payment term");
    }
});
const paymentTermSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "paymentTerms",
    initialState: {
        list: [],
        totalCount: 0,
        totalPages: 1,
        currentPage: 1,
        isLoading: false,
        error: null
    },
    reducers: {
        clearPaymentTermsError (state) {
            state.error = null;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchPaymentTerms.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchPaymentTerms.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.list = action.payload.data || [];
            state.totalCount = action.payload.total || 0;
            state.totalPages = action.payload.totalPages || 1;
            state.currentPage = action.payload.page || 1;
        }).addCase(fetchPaymentTerms.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(createPaymentTerm.fulfilled, (state, action)=>{
            state.list.unshift(action.payload);
            state.totalCount += 1;
        }).addCase(createPaymentTerm.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(updatePaymentTerm.fulfilled, (state, action)=>{
            const idx = state.list.findIndex((c)=>c.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        }).addCase(updatePaymentTerm.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(deletePaymentTerm.fulfilled, (state, action)=>{
            state.list = state.list.filter((c)=>c.id !== action.payload);
            state.totalCount -= 1;
        }).addCase(deletePaymentTerm.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(restorePaymentTerm.fulfilled, (state, action)=>{
            const idx = state.list.findIndex((c)=>c.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        }).addCase(restorePaymentTerm.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(permanentDeletePaymentTerm.fulfilled, (state, action)=>{
            state.list = state.list.filter((c)=>c.id !== action.payload);
            state.totalCount -= 1;
        }).addCase(permanentDeletePaymentTerm.rejected, (state, action)=>{
            state.error = action.payload;
        });
    }
});
const { clearPaymentTermsError } = paymentTermSlice.actions;
const selectPaymentTerms = (state)=>state.entities.paymentTerms.list;
const selectPaymentTermsTotalCount = (state)=>state.entities.paymentTerms.totalCount;
const selectPaymentTermsTotalPages = (state)=>state.entities.paymentTerms.totalPages;
const selectPaymentTermsLoading = (state)=>state.entities.paymentTerms.isLoading;
const selectPaymentTermsError = (state)=>state.entities.paymentTerms.error;
const __TURBOPACK__default__export__ = paymentTermSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/entities/productSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearProductsError",
    ()=>clearProductsError,
    "createProduct",
    ()=>createProduct,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteProduct",
    ()=>deleteProduct,
    "fetchProducts",
    ()=>fetchProducts,
    "permanentDeleteProduct",
    ()=>permanentDeleteProduct,
    "restoreProduct",
    ()=>restoreProduct,
    "selectProducts",
    ()=>selectProducts,
    "selectProductsError",
    ()=>selectProductsError,
    "selectProductsLoading",
    ()=>selectProductsLoading,
    "selectProductsTotalCount",
    ()=>selectProductsTotalCount,
    "selectProductsTotalPages",
    ()=>selectProductsTotalPages,
    "updateProduct",
    ()=>updateProduct
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const fetchProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("products/fetchAll", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/products", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
    }
});
const createProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("products/create", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/masters/products", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create product");
    }
});
const updateProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("products/update", async ({ id, ...data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/masters/products/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update product");
    }
});
const deleteProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("products/delete", async (arg, { rejectWithValue })=>{
    try {
        const id = typeof arg === "object" ? arg.id : arg;
        const reason = typeof arg === "object" ? arg.reason : undefined;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/masters/products/${id}`, {
            params: {
                reason
            }
        });
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete product");
    }
});
const restoreProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("products/restore", async (id, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/masters/products/${id}/restore`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to restore product");
    }
});
const permanentDeleteProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("products/permanentDelete", async (arg, { rejectWithValue })=>{
    try {
        const id = typeof arg === "object" ? arg.id : arg;
        const reason = typeof arg === "object" ? arg.reason : undefined;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/masters/products/${id}/permanent`, {
            params: {
                reason
            }
        });
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to permanently delete product");
    }
});
const productSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "products",
    initialState: {
        list: [],
        totalCount: 0,
        totalPages: 1,
        currentPage: 1,
        isLoading: false,
        error: null
    },
    reducers: {
        clearProductsError (state) {
            state.error = null;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchProducts.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchProducts.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.list = action.payload.data || [];
            state.totalCount = action.payload.total || 0;
            state.totalPages = action.payload.totalPages || 1;
            state.currentPage = action.payload.page || 1;
        }).addCase(fetchProducts.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(createProduct.fulfilled, (state, action)=>{
            state.list.unshift(action.payload);
            state.totalCount += 1;
        }).addCase(createProduct.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(updateProduct.fulfilled, (state, action)=>{
            const idx = state.list.findIndex((c)=>c.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        }).addCase(updateProduct.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(deleteProduct.fulfilled, (state, action)=>{
            state.list = state.list.filter((c)=>c.id !== action.payload);
            state.totalCount -= 1;
        }).addCase(deleteProduct.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(restoreProduct.fulfilled, (state, action)=>{
            const idx = state.list.findIndex((c)=>c.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        }).addCase(restoreProduct.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(permanentDeleteProduct.fulfilled, (state, action)=>{
            state.list = state.list.filter((c)=>c.id !== action.payload);
            state.totalCount -= 1;
        }).addCase(permanentDeleteProduct.rejected, (state, action)=>{
            state.error = action.payload;
        });
    }
});
const { clearProductsError } = productSlice.actions;
const selectProducts = (state)=>state.entities.products.list;
const selectProductsTotalCount = (state)=>state.entities.products.totalCount;
const selectProductsTotalPages = (state)=>state.entities.products.totalPages;
const selectProductsLoading = (state)=>state.entities.products.isLoading;
const selectProductsError = (state)=>state.entities.products.error;
const __TURBOPACK__default__export__ = productSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/entities/shiftsSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearShiftsError",
    ()=>clearShiftsError,
    "createShift",
    ()=>createShift,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteShift",
    ()=>deleteShift,
    "fetchShiftById",
    ()=>fetchShiftById,
    "fetchShifts",
    ()=>fetchShifts,
    "selectAllShifts",
    ()=>selectAllShifts,
    "selectShiftById",
    ()=>selectShiftById,
    "selectShiftsError",
    ()=>selectShiftsError,
    "selectShiftsLoading",
    ()=>selectShiftsLoading,
    "shiftsAdapter",
    ()=>shiftsAdapter,
    "updateShift",
    ()=>updateShift
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const shiftsAdapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createEntityAdapter"])();
const fetchShifts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/shifts/fetchAll", async (_, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/shifts");
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch shifts");
    }
});
const fetchShiftById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/shifts/fetchById", async (id, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/shifts/${id}`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch shift");
    }
});
const createShift = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/shifts/create", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/shifts", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create shift");
    }
});
const updateShift = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/shifts/update", async ({ id, data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/shifts/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update shift");
    }
});
const deleteShift = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/shifts/delete", async (id, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/shifts/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete shift");
    }
});
const shiftsSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "shifts",
    initialState: shiftsAdapter.getInitialState({
        isLoading: false,
        error: null
    }),
    reducers: {
        clearShiftsError (state) {
            state.error = null;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchShifts.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchShifts.fulfilled, (state, action)=>{
            state.isLoading = false;
            shiftsAdapter.setAll(state, action.payload);
        }).addCase(fetchShifts.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(fetchShiftById.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchShiftById.fulfilled, (state, action)=>{
            state.isLoading = false;
            shiftsAdapter.upsertOne(state, action.payload);
        }).addCase(fetchShiftById.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(createShift.fulfilled, (state, action)=>{
            shiftsAdapter.addOne(state, action.payload);
        }).addCase(createShift.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(updateShift.fulfilled, (state, action)=>{
            shiftsAdapter.upsertOne(state, action.payload);
        }).addCase(updateShift.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(deleteShift.fulfilled, (state, action)=>{
            shiftsAdapter.removeOne(state, action.payload);
        }).addCase(deleteShift.rejected, (state, action)=>{
            state.error = action.payload;
        });
    }
});
const { clearShiftsError } = shiftsSlice.actions;
const { selectAll: selectAllShifts, selectById: selectShiftById } = shiftsAdapter.getSelectors((state)=>state.entities.shifts);
const selectShiftsLoading = (state)=>state.entities.shifts.isLoading;
const selectShiftsError = (state)=>state.entities.shifts.error;
const __TURBOPACK__default__export__ = shiftsSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/entities/shipmentTypeSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearShipmentTypesError",
    ()=>clearShipmentTypesError,
    "createShipmentType",
    ()=>createShipmentType,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteShipmentType",
    ()=>deleteShipmentType,
    "fetchShipmentTypes",
    ()=>fetchShipmentTypes,
    "permanentDeleteShipmentType",
    ()=>permanentDeleteShipmentType,
    "restoreShipmentType",
    ()=>restoreShipmentType,
    "selectShipmentTypes",
    ()=>selectShipmentTypes,
    "selectShipmentTypesError",
    ()=>selectShipmentTypesError,
    "selectShipmentTypesLoading",
    ()=>selectShipmentTypesLoading,
    "selectShipmentTypesTotalCount",
    ()=>selectShipmentTypesTotalCount,
    "selectShipmentTypesTotalPages",
    ()=>selectShipmentTypesTotalPages,
    "updateShipmentType",
    ()=>updateShipmentType
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const fetchShipmentTypes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("shipmentTypes/fetchAll", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/shipment-types", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch shipment types");
    }
});
const createShipmentType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("shipmentTypes/create", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/masters/shipment-types", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create shipment type");
    }
});
const updateShipmentType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("shipmentTypes/update", async ({ id, ...data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/masters/shipment-types/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update shipment type");
    }
});
const deleteShipmentType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("shipmentTypes/delete", async (arg, { rejectWithValue })=>{
    try {
        const id = typeof arg === "object" ? arg.id : arg;
        const reason = typeof arg === "object" ? arg.reason : undefined;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/masters/shipment-types/${id}`, {
            params: {
                reason
            }
        });
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete shipment type");
    }
});
const restoreShipmentType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("shipmentTypes/restore", async (id, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/masters/shipment-types/${id}/restore`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to restore shipment type");
    }
});
const permanentDeleteShipmentType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("shipmentTypes/permanentDelete", async (arg, { rejectWithValue })=>{
    try {
        const id = typeof arg === "object" ? arg.id : arg;
        const reason = typeof arg === "object" ? arg.reason : undefined;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/masters/shipment-types/${id}/permanent`, {
            params: {
                reason
            }
        });
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to permanently delete shipment type");
    }
});
const shipmentTypeSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "shipmentTypes",
    initialState: {
        list: [],
        totalCount: 0,
        totalPages: 1,
        currentPage: 1,
        isLoading: false,
        error: null
    },
    reducers: {
        clearShipmentTypesError (state) {
            state.error = null;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchShipmentTypes.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchShipmentTypes.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.list = action.payload.data || [];
            state.totalCount = action.payload.total || 0;
            state.totalPages = action.payload.totalPages || 1;
            state.currentPage = action.payload.page || 1;
        }).addCase(fetchShipmentTypes.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(createShipmentType.fulfilled, (state, action)=>{
            state.list.unshift(action.payload);
            state.totalCount += 1;
        }).addCase(createShipmentType.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(updateShipmentType.fulfilled, (state, action)=>{
            const idx = state.list.findIndex((c)=>c.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        }).addCase(updateShipmentType.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(deleteShipmentType.fulfilled, (state, action)=>{
            state.list = state.list.filter((c)=>c.id !== action.payload);
            state.totalCount -= 1;
        }).addCase(deleteShipmentType.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(restoreShipmentType.fulfilled, (state, action)=>{
            const idx = state.list.findIndex((c)=>c.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        }).addCase(restoreShipmentType.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(permanentDeleteShipmentType.fulfilled, (state, action)=>{
            state.list = state.list.filter((c)=>c.id !== action.payload);
            state.totalCount -= 1;
        }).addCase(permanentDeleteShipmentType.rejected, (state, action)=>{
            state.error = action.payload;
        });
    }
});
const { clearShipmentTypesError } = shipmentTypeSlice.actions;
const selectShipmentTypes = (state)=>state.entities.shipmentTypes.list;
const selectShipmentTypesTotalCount = (state)=>state.entities.shipmentTypes.totalCount;
const selectShipmentTypesTotalPages = (state)=>state.entities.shipmentTypes.totalPages;
const selectShipmentTypesLoading = (state)=>state.entities.shipmentTypes.isLoading;
const selectShipmentTypesError = (state)=>state.entities.shipmentTypes.error;
const __TURBOPACK__default__export__ = shipmentTypeSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/entities/taskSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "archiveTask",
    ()=>archiveTask,
    "clearCurrentTask",
    ()=>clearCurrentTask,
    "clearTasksError",
    ()=>clearTasksError,
    "createTask",
    ()=>createTask,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteTask",
    ()=>deleteTask,
    "fetchTaskById",
    ()=>fetchTaskById,
    "fetchTasks",
    ()=>fetchTasks,
    "selectAllTasks",
    ()=>selectAllTasks,
    "selectCurrentTask",
    ()=>selectCurrentTask,
    "selectTaskById",
    ()=>selectTaskById,
    "selectTasksData",
    ()=>selectTasksData,
    "selectTasksError",
    ()=>selectTasksError,
    "selectTasksLoading",
    ()=>selectTasksLoading,
    "tasksAdapter",
    ()=>tasksAdapter,
    "updateTask",
    ()=>updateTask
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/reselect/dist/reselect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$tasks$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/tasks.api.js [app-client] (ecmascript)");
;
;
const tasksAdapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createEntityAdapter"])();
const fetchTasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/tasks/fetchAll", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$tasks$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].getAll(params);
        return res;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch tasks");
    }
});
const fetchTaskById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/tasks/fetchById", async (id, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$tasks$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].getById(id);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch task");
    }
});
const createTask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/tasks/create", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$tasks$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].create(data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create task");
    }
});
const updateTask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/tasks/update", async ({ id, data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$tasks$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].update(id, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update task");
    }
});
const archiveTask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/tasks/archive", async ({ id, isArchived }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$tasks$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].archive(id, isArchived);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to archive task");
    }
});
const deleteTask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("entities/tasks/delete", async (id, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$tasks$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tasksApi"].delete(id);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete task");
    }
});
const taskSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "tasks",
    initialState: tasksAdapter.getInitialState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        current: null,
        isLoading: false,
        error: null
    }),
    reducers: {
        clearTasksError (state) {
            state.error = null;
        },
        clearCurrentTask (state) {
            state.current = null;
        }
    },
    extraReducers: (builder)=>{
        builder// Fetch All
        .addCase(fetchTasks.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchTasks.fulfilled, (state, action)=>{
            state.isLoading = false;
            tasksAdapter.setAll(state, action.payload.data || action.payload);
            state.total = action.payload.meta?.total || action.payload.length || 0;
            state.page = action.payload.meta?.page || 1;
            state.limit = action.payload.meta?.limit || 10;
            state.totalPages = action.payload.meta?.totalPages || 1;
        }).addCase(fetchTasks.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        })// Fetch By Id
        .addCase(fetchTaskById.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchTaskById.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.current = action.payload;
            tasksAdapter.upsertOne(state, action.payload);
        }).addCase(fetchTaskById.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        })// Create
        .addCase(createTask.fulfilled, (state, action)=>{
            tasksAdapter.addOne(state, action.payload);
        }).addCase(createTask.rejected, (state, action)=>{
            state.error = action.payload;
        })// Update
        .addCase(updateTask.fulfilled, (state, action)=>{
            tasksAdapter.upsertOne(state, action.payload);
            if (state.current?.id === action.payload.id) {
                state.current = {
                    ...state.current,
                    ...action.payload
                };
            }
        }).addCase(updateTask.rejected, (state, action)=>{
            state.error = action.payload;
        })// Archive
        .addCase(archiveTask.fulfilled, (state, action)=>{
            tasksAdapter.upsertOne(state, action.payload);
            if (state.current?.id === action.payload.id) {
                state.current = {
                    ...state.current,
                    ...action.payload
                };
            }
        }).addCase(archiveTask.rejected, (state, action)=>{
            state.error = action.payload;
        })// Delete
        .addCase(deleteTask.fulfilled, (state, action)=>{
            tasksAdapter.removeOne(state, action.payload);
        }).addCase(deleteTask.rejected, (state, action)=>{
            state.error = action.payload;
        });
    }
});
const { clearTasksError, clearCurrentTask } = taskSlice.actions;
const { selectAll: selectAllTasks, selectById: selectTaskById } = tasksAdapter.getSelectors((state)=>state.entities.tasks);
const selectTasksData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSelector"])([
    selectAllTasks,
    (state)=>state.entities.tasks.total,
    (state)=>state.entities.tasks.page,
    (state)=>state.entities.tasks.limit,
    (state)=>state.entities.tasks.totalPages
], (data, total, page, limit, totalPages)=>({
        data,
        total,
        page,
        limit,
        totalPages
    }));
const selectCurrentTask = (state)=>state.entities.tasks.current;
const selectTasksLoading = (state)=>state.entities.tasks.isLoading;
const selectTasksError = (state)=>state.entities.tasks.error;
const __TURBOPACK__default__export__ = taskSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/entities/tradeDocumentSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearTradeDocumentsError",
    ()=>clearTradeDocumentsError,
    "createTradeDocument",
    ()=>createTradeDocument,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteTradeDocument",
    ()=>deleteTradeDocument,
    "fetchTradeDocuments",
    ()=>fetchTradeDocuments,
    "permanentDeleteTradeDocument",
    ()=>permanentDeleteTradeDocument,
    "restoreTradeDocument",
    ()=>restoreTradeDocument,
    "selectTradeDocuments",
    ()=>selectTradeDocuments,
    "selectTradeDocumentsError",
    ()=>selectTradeDocumentsError,
    "selectTradeDocumentsLoading",
    ()=>selectTradeDocumentsLoading,
    "selectTradeDocumentsTotalCount",
    ()=>selectTradeDocumentsTotalCount,
    "selectTradeDocumentsTotalPages",
    ()=>selectTradeDocumentsTotalPages,
    "updateTradeDocument",
    ()=>updateTradeDocument
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const fetchTradeDocuments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("tradeDocuments/fetchAll", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/masters/trade-documents", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch trade documents");
    }
});
const createTradeDocument = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("tradeDocuments/create", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/masters/trade-documents", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create trade document");
    }
});
const updateTradeDocument = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("tradeDocuments/update", async ({ id, ...data }, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/masters/trade-documents/${id}`, data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update trade document");
    }
});
const deleteTradeDocument = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("tradeDocuments/delete", async (arg, { rejectWithValue })=>{
    try {
        const id = typeof arg === "object" ? arg.id : arg;
        const reason = typeof arg === "object" ? arg.reason : undefined;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/masters/trade-documents/${id}`, {
            params: {
                reason
            }
        });
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete trade document");
    }
});
const restoreTradeDocument = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("tradeDocuments/restore", async (id, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/masters/trade-documents/${id}/restore`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to restore trade document");
    }
});
const permanentDeleteTradeDocument = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("tradeDocuments/permanentDelete", async (arg, { rejectWithValue })=>{
    try {
        const id = typeof arg === "object" ? arg.id : arg;
        const reason = typeof arg === "object" ? arg.reason : undefined;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/masters/trade-documents/${id}/permanent`, {
            params: {
                reason
            }
        });
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to permanently delete trade document");
    }
});
const tradeDocumentSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "tradeDocuments",
    initialState: {
        list: [],
        totalCount: 0,
        totalPages: 1,
        currentPage: 1,
        isLoading: false,
        error: null
    },
    reducers: {
        clearTradeDocumentsError (state) {
            state.error = null;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchTradeDocuments.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchTradeDocuments.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.list = action.payload.data || [];
            state.totalCount = action.payload.total || 0;
            state.totalPages = action.payload.totalPages || 1;
            state.currentPage = action.payload.page || 1;
        }).addCase(fetchTradeDocuments.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(createTradeDocument.fulfilled, (state, action)=>{
            state.list.unshift(action.payload);
            state.totalCount += 1;
        }).addCase(createTradeDocument.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(updateTradeDocument.fulfilled, (state, action)=>{
            const idx = state.list.findIndex((c)=>c.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        }).addCase(updateTradeDocument.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(deleteTradeDocument.fulfilled, (state, action)=>{
            state.list = state.list.filter((c)=>c.id !== action.payload);
            state.totalCount -= 1;
        }).addCase(deleteTradeDocument.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(restoreTradeDocument.fulfilled, (state, action)=>{
            const idx = state.list.findIndex((c)=>c.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        }).addCase(restoreTradeDocument.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(permanentDeleteTradeDocument.fulfilled, (state, action)=>{
            state.list = state.list.filter((c)=>c.id !== action.payload);
            state.totalCount -= 1;
        }).addCase(permanentDeleteTradeDocument.rejected, (state, action)=>{
            state.error = action.payload;
        });
    }
});
const { clearTradeDocumentsError } = tradeDocumentSlice.actions;
const selectTradeDocuments = (state)=>state.entities.tradeDocuments.list;
const selectTradeDocumentsTotalCount = (state)=>state.entities.tradeDocuments.totalCount;
const selectTradeDocumentsTotalPages = (state)=>state.entities.tradeDocuments.totalPages;
const selectTradeDocumentsLoading = (state)=>state.entities.tradeDocuments.isLoading;
const selectTradeDocumentsError = (state)=>state.entities.tradeDocuments.error;
const __TURBOPACK__default__export__ = tradeDocumentSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/slices/authSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearError",
    ()=>clearError,
    "default",
    ()=>__TURBOPACK__default__export__,
    "fetchCurrentUser",
    ()=>fetchCurrentUser,
    "loginUser",
    ()=>loginUser,
    "logoutUser",
    ()=>logoutUser,
    "rehydrateToken",
    ()=>rehydrateToken,
    "selectAuthError",
    ()=>selectAuthError,
    "selectAuthLoading",
    ()=>selectAuthLoading,
    "selectIsAuthenticated",
    ()=>selectIsAuthenticated,
    "selectIsInitialized",
    ()=>selectIsInitialized,
    "selectUser",
    ()=>selectUser,
    "selectUserPermissions",
    ()=>selectUserPermissions,
    "selectUserType",
    ()=>selectUserType,
    "setInitialized",
    ()=>setInitialized
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const loginUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("auth/login", async ({ email, password }, { rejectWithValue })=>{
    try {
        // Step 1: Login to get tokens
        const loginRes = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/auth/login", {
            email,
            password
        });
        const { accessToken, refreshToken } = loginRes.data;
        // Step 2: Save tokens to localStorage so interceptor can use them immediately
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
        }
        // Step 3: Fetch current user profile
        const meRes = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/auth/me");
        return {
            accessToken,
            user: meRes.data
        };
    } catch (err) {
        console.error(`[Frontend Login] Login failed:`, err.response?.data || err.message);
        return rejectWithValue(err.response?.data?.message || "Login failed. Check your credentials.");
    }
});
const fetchCurrentUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("auth/fetchCurrentUser", async (_, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/auth/me");
        return res.data;
    } catch (err) {
        return rejectWithValue("Session expired");
    }
});
const logoutUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("auth/logout", async (_, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/auth/logout");
    } catch (_) {
    // Even if the API call fails, we still clear local session
    } finally{
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }
});
// ─── Slice ────────────────────────────────────────────────────────────────────
const authSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "auth",
    initialState: {
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: false,
        error: null
    },
    reducers: {
        clearError (state) {
            state.error = null;
        },
        // Called on app boot to rehydrate token from localStorage
        rehydrateToken (state) {
            if ("TURBOPACK compile-time truthy", 1) {
                const token = localStorage.getItem("accessToken");
                if (token) {
                    state.accessToken = token;
                }
            }
        },
        setInitialized (state) {
            state.isInitialized = true;
        }
    },
    extraReducers: (builder)=>{
        // ── Login
        builder.addCase(loginUser.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(loginUser.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.isInitialized = true;
        }).addCase(loginUser.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        });
        // ── Fetch Current User (on app boot)
        builder.addCase(fetchCurrentUser.pending, (state)=>{
            state.isLoading = true;
        }).addCase(fetchCurrentUser.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isInitialized = true;
        }).addCase(fetchCurrentUser.rejected, (state)=>{
            state.isLoading = false;
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.isInitialized = true;
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
        });
        // ── Logout
        builder.addCase(logoutUser.fulfilled, (state)=>{
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
        }).addCase(logoutUser.rejected, (state)=>{
            // Force local clear even on API error
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
        });
    }
});
const { clearError, rehydrateToken, setInitialized } = authSlice.actions;
// ─── Selectors ────────────────────────────────────────────────────────────────
const EMPTY_ARRAY = [];
const selectUser = (state)=>state.auth.user;
const selectIsAuthenticated = (state)=>state.auth.isAuthenticated;
const selectAuthLoading = (state)=>state.auth.isLoading;
const selectAuthError = (state)=>state.auth.error;
const selectIsInitialized = (state)=>state.auth.isInitialized;
const selectUserType = (state)=>state.auth.user?.type;
const selectUserPermissions = (state)=>state.auth.user?.permissions || EMPTY_ARRAY;
const __TURBOPACK__default__export__ = authSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/slices/clientsSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearClientsError",
    ()=>clearClientsError,
    "createClient",
    ()=>createClient,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteClient",
    ()=>deleteClient,
    "fetchClients",
    ()=>fetchClients,
    "selectClients",
    ()=>selectClients,
    "selectClientsError",
    ()=>selectClientsError,
    "selectClientsLoading",
    ()=>selectClientsLoading,
    "selectClientsMeta",
    ()=>selectClientsMeta,
    "updateClient",
    ()=>updateClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const fetchClients = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("clients/fetchAll", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/clients/GetClients", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch clients");
    }
});
const createClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("clients/create", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/clients/CreateClient", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create client");
    }
});
const updateClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("clients/update", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/clients/UpdateClient", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update client");
    }
});
const deleteClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("clients/delete", async (id, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/clients/DeleteClient", {
            id
        });
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete client");
    }
});
const clientsSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "clients",
    initialState: {
        list: [],
        meta: null,
        isLoading: false,
        error: null
    },
    reducers: {
        clearClientsError (state) {
            state.error = null;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchClients.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchClients.fulfilled, (state, action)=>{
            state.isLoading = false;
            if (action.payload && action.payload.data !== undefined) {
                state.list = action.payload.data;
                state.meta = action.payload.meta;
            } else {
                state.list = action.payload || [];
                state.meta = null;
            }
        }).addCase(fetchClients.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(createClient.fulfilled, (state, action)=>{
            state.list.unshift(action.payload);
        }).addCase(createClient.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(updateClient.fulfilled, (state, action)=>{
            const idx = state.list.findIndex((c)=>c.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        }).addCase(updateClient.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(deleteClient.fulfilled, (state, action)=>{
            state.list = state.list.filter((c)=>c.id !== action.payload);
        }).addCase(deleteClient.rejected, (state, action)=>{
            state.error = action.payload;
        });
    }
});
const { clearClientsError } = clientsSlice.actions;
const selectClients = (state)=>state.clients.list;
const selectClientsMeta = (state)=>state.clients.meta;
const selectClientsLoading = (state)=>state.clients.isLoading;
const selectClientsError = (state)=>state.clients.error;
const __TURBOPACK__default__export__ = clientsSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/slices/companiesSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearCompaniesError",
    ()=>clearCompaniesError,
    "createCompany",
    ()=>createCompany,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteCompany",
    ()=>deleteCompany,
    "fetchCompanies",
    ()=>fetchCompanies,
    "selectCompanies",
    ()=>selectCompanies,
    "selectCompaniesError",
    ()=>selectCompaniesError,
    "selectCompaniesLoading",
    ()=>selectCompaniesLoading,
    "selectCompaniesMetadata",
    ()=>selectCompaniesMetadata,
    "updateCompany",
    ()=>updateCompany
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/reselect/dist/reselect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const fetchCompanies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("companies/fetchAll", async (params = {}, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/GetCompanies", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch companies");
    }
});
const createCompany = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("companies/create", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/CreateCompany", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create company");
    }
});
const updateCompany = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("companies/update", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/UpdateCompany", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update company");
    }
});
const deleteCompany = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("companies/delete", async (id, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/DeleteCompany", {
            id
        });
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete company");
    }
});
const companiesSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "companies",
    initialState: {
        list: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        isLoading: false,
        error: null
    },
    reducers: {
        clearCompaniesError (state) {
            state.error = null;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchCompanies.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchCompanies.fulfilled, (state, action)=>{
            state.isLoading = false;
            if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
                state.list = action.payload.data || [];
                state.total = action.payload.total || 0;
                state.page = action.payload.page || 1;
                state.limit = action.payload.limit || 10;
                state.totalPages = action.payload.totalPages || 1;
            } else {
                state.list = action.payload || [];
            }
        }).addCase(fetchCompanies.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(createCompany.fulfilled, (state, action)=>{
            state.list.unshift(action.payload);
        }).addCase(createCompany.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(updateCompany.fulfilled, (state, action)=>{
            const idx = state.list.findIndex((c)=>c.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        }).addCase(updateCompany.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(deleteCompany.fulfilled, (state, action)=>{
            state.list = state.list.filter((c)=>c.id !== action.payload);
        }).addCase(deleteCompany.rejected, (state, action)=>{
            state.error = action.payload;
        });
    }
});
const { clearCompaniesError } = companiesSlice.actions;
const selectCompanies = (state)=>state.companies.list;
const selectCompaniesMetadata = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$reselect$2f$dist$2f$reselect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSelector"])((state)=>state.companies.total, (state)=>state.companies.page, (state)=>state.companies.limit, (state)=>state.companies.totalPages, (total, page, limit, totalPages)=>({
        total,
        page,
        limit,
        totalPages
    }));
const selectCompaniesLoading = (state)=>state.companies.isLoading;
const selectCompaniesError = (state)=>state.companies.error;
const __TURBOPACK__default__export__ = companiesSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/slices/companyContextSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "selectActiveCompany",
    ()=>selectActiveCompany,
    "selectActiveCompanyId",
    ()=>selectActiveCompanyId,
    "selectCompanyContextInitialized",
    ()=>selectCompanyContextInitialized,
    "selectCompanyContextLoading",
    ()=>selectCompanyContextLoading,
    "setActiveCompany",
    ()=>setActiveCompany,
    "setInitialized",
    ()=>setInitialized,
    "switchCompanyContext",
    ()=>switchCompanyContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$authSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/slices/authSlice.js [app-client] (ecmascript)");
;
;
;
const switchCompanyContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("companyContext/switch", async (companyId, { dispatch, rejectWithValue })=>{
    try {
        // 1. Post to switch-workspace API
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/auth/switch-workspace", {
            companyId: Number(companyId)
        });
        // 2. Set in localStorage for non-React/initial bootstrap access
        localStorage.setItem("activeCompanyId", companyId.toString());
        // 3. Sync profile, workspace roles, and permissions
        const userResult = await dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$authSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchCurrentUser"])()).unwrap();
        // 4. Trigger sidebar and route rebuild
        if ("TURBOPACK compile-time truthy", 1) {
            window.dispatchEvent(new Event("sidebar-updated"));
        }
        return {
            companyId: companyId.toString(),
            company: userResult.company
        };
    } catch (err) {
        console.error("Failed to switch company context:", err);
        return rejectWithValue(err.response?.data?.message || "Failed to switch workspace context");
    }
});
const companyContextSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "companyContext",
    initialState: {
        activeCompanyId: ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("activeCompanyId") : "TURBOPACK unreachable",
        activeCompany: null,
        isLoading: false,
        isInitialized: false
    },
    reducers: {
        setActiveCompany (state, action) {
            const companyId = action.payload?.id || action.payload;
            if (companyId) {
                state.activeCompanyId = companyId.toString();
                if (action.payload?.name) {
                    state.activeCompany = action.payload;
                }
                if ("TURBOPACK compile-time truthy", 1) {
                    localStorage.setItem("activeCompanyId", companyId.toString());
                }
            } else {
                state.activeCompanyId = null;
                state.activeCompany = null;
                if ("TURBOPACK compile-time truthy", 1) {
                    localStorage.removeItem("activeCompanyId");
                }
            }
        },
        setInitialized (state, action) {
            state.isInitialized = action.payload;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(switchCompanyContext.pending, (state)=>{
            state.isLoading = true;
        }).addCase(switchCompanyContext.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.activeCompanyId = action.payload.companyId;
            state.activeCompany = action.payload.company;
            state.isInitialized = true;
        }).addCase(switchCompanyContext.rejected, (state)=>{
            state.isLoading = false;
        })// Matchers to sync whenever user logs in or profile is fetched
        .addMatcher((action)=>action.type === "auth/fetchCurrentUser/fulfilled" || action.type === "auth/login/fulfilled", (state, action)=>{
            const user = action.payload.user || action.payload;
            if (user?.company) {
                if (action.type === "auth/login/fulfilled" || !state.activeCompanyId) {
                    state.activeCompany = user.company;
                    state.activeCompanyId = user.company.id?.toString() || null;
                    if (state.activeCompanyId && ("TURBOPACK compile-time value", "object") !== "undefined") {
                        localStorage.setItem("activeCompanyId", state.activeCompanyId);
                    }
                } else if (state.activeCompanyId === user.company.id?.toString()) {
                    state.activeCompany = user.company;
                }
            }
            state.isInitialized = true;
        })// Matchers to clear context on logout
        .addMatcher((action)=>action.type === "auth/logout/fulfilled" || action.type === "auth/logout/rejected", (state)=>{
            state.activeCompanyId = null;
            state.activeCompany = null;
            state.isInitialized = false;
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.removeItem("activeCompanyId");
            }
        });
    }
});
const { setActiveCompany, setInitialized } = companyContextSlice.actions;
const selectActiveCompanyId = (state)=>state.companyContext.activeCompanyId;
const selectActiveCompany = (state)=>state.companyContext.activeCompany;
const selectCompanyContextLoading = (state)=>state.companyContext.isLoading;
const selectCompanyContextInitialized = (state)=>state.companyContext.isInitialized;
const __TURBOPACK__default__export__ = companyContextSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/slices/notificationsSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addSocketNotification",
    ()=>addSocketNotification,
    "clearNotificationsError",
    ()=>clearNotificationsError,
    "default",
    ()=>__TURBOPACK__default__export__,
    "fetchNotifications",
    ()=>fetchNotifications,
    "markAllNotificationsRead",
    ()=>markAllNotificationsRead,
    "markNotificationRead",
    ()=>markNotificationRead,
    "selectLatestTransportUpdate",
    ()=>selectLatestTransportUpdate,
    "selectNotifications",
    ()=>selectNotifications,
    "selectNotificationsError",
    ()=>selectNotificationsError,
    "selectNotificationsLoading",
    ()=>selectNotificationsLoading,
    "selectPendingTransportEnquiryId",
    ()=>selectPendingTransportEnquiryId,
    "selectUnreadCount",
    ()=>selectUnreadCount,
    "setLatestTransportUpdate",
    ()=>setLatestTransportUpdate,
    "setPendingTransportEnquiryId",
    ()=>setPendingTransportEnquiryId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const fetchNotifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("notifications/fetchAll", async (_, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/v1/notifications");
        return res.data.data; // Array of notifications
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch notifications");
    }
});
const markNotificationRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("notifications/markRead", async (id, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/v1/notifications/${id}/read`);
        return res.data.data; // Updated notification object
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to mark notification as read");
    }
});
const markAllNotificationsRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("notifications/markAllRead", async (_, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/v1/notifications/mark-all-read");
        return true;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to mark all notifications as read");
    }
});
const notificationsSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "notifications",
    initialState: {
        list: [],
        unreadCount: 0,
        isLoading: false,
        error: null,
        pendingTransportEnquiryId: null,
        latestTransportUpdate: null
    },
    reducers: {
        clearNotificationsError (state) {
            state.error = null;
        },
        addSocketNotification (state, action) {
            const exists = state.list.some((n)=>n.id === action.payload.id);
            if (!exists) {
                state.list.unshift(action.payload);
                if (!action.payload.isRead) {
                    state.unreadCount += 1;
                }
                // Trim to last 100 notifications to prevent unbounded memory growth
                if (state.list.length > 100) {
                    state.list = state.list.slice(0, 100);
                }
            }
        },
        setPendingTransportEnquiryId (state, action) {
            state.pendingTransportEnquiryId = action.payload;
        },
        setLatestTransportUpdate (state, action) {
            state.latestTransportUpdate = action.payload;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchNotifications.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchNotifications.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.list = action.payload || [];
            state.unreadCount = (action.payload || []).filter((n)=>!n.isRead).length;
        }).addCase(fetchNotifications.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(markNotificationRead.fulfilled, (state, action)=>{
            const updated = action.payload;
            const idx = state.list.findIndex((n)=>n.id === updated.id);
            if (idx !== -1) {
                const wasUnread = !state.list[idx].isRead;
                state.list[idx] = updated;
                if (wasUnread && updated.isRead) {
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            }
        }).addCase(markAllNotificationsRead.fulfilled, (state)=>{
            state.list = state.list.map((n)=>({
                    ...n,
                    isRead: true
                }));
            state.unreadCount = 0;
        });
    }
});
const { clearNotificationsError, addSocketNotification, setPendingTransportEnquiryId, setLatestTransportUpdate } = notificationsSlice.actions;
const selectNotifications = (state)=>state.notifications.list;
const selectUnreadCount = (state)=>state.notifications.unreadCount;
const selectNotificationsLoading = (state)=>state.notifications.isLoading;
const selectNotificationsError = (state)=>state.notifications.error;
const selectPendingTransportEnquiryId = (state)=>state.notifications.pendingTransportEnquiryId;
const selectLatestTransportUpdate = (state)=>state.notifications.latestTransportUpdate;
const __TURBOPACK__default__export__ = notificationsSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/slices/rolesSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearRolesError",
    ()=>clearRolesError,
    "createRole",
    ()=>createRole,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteRole",
    ()=>deleteRole,
    "fetchRolePermissions",
    ()=>fetchRolePermissions,
    "fetchRoles",
    ()=>fetchRoles,
    "selectRoles",
    ()=>selectRoles,
    "selectRolesError",
    ()=>selectRolesError,
    "selectRolesLoading",
    ()=>selectRolesLoading,
    "selectRolesMeta",
    ()=>selectRolesMeta,
    "updateRole",
    ()=>updateRole
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const fetchRoles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("roles/fetchAll", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/GetRoles", {
            params
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch roles");
    }
});
const createRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("roles/create", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/CreateRole", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create role");
    }
});
const updateRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("roles/update", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/UpdateRole", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update role");
    }
});
const deleteRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("roles/delete", async (id, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/DeleteRole", {
            id
        });
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete role");
    }
});
const fetchRolePermissions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("roles/fetchPermissions", async (roleId, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/GetRolePermissions?roleId=${roleId}`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch role permissions");
    }
});
// ─── Slice ────────────────────────────────────────────────────────────────────
const rolesSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "roles",
    initialState: {
        list: [],
        meta: null,
        isLoading: false,
        error: null
    },
    reducers: {
        clearRolesError (state) {
            state.error = null;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchRoles.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchRoles.fulfilled, (state, action)=>{
            state.isLoading = false;
            if (action.payload && action.payload.data !== undefined) {
                state.list = action.payload.data;
                state.meta = action.payload.meta;
            } else {
                state.list = action.payload || [];
                state.meta = null;
            }
        }).addCase(fetchRoles.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(createRole.fulfilled, (state, action)=>{
            state.list.unshift(action.payload);
        }).addCase(createRole.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(updateRole.fulfilled, (state, action)=>{
            const idx = state.list.findIndex((r)=>r.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        }).addCase(updateRole.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(deleteRole.fulfilled, (state, action)=>{
            state.list = state.list.filter((r)=>r.id !== action.payload);
        }).addCase(deleteRole.rejected, (state, action)=>{
            state.error = action.payload;
        });
    }
});
const { clearRolesError } = rolesSlice.actions;
const selectRoles = (state)=>state.roles.list;
const selectRolesMeta = (state)=>state.roles.meta;
const selectRolesLoading = (state)=>state.roles.isLoading;
const selectRolesError = (state)=>state.roles.error;
const __TURBOPACK__default__export__ = rolesSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/slices/usersSlice.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearUsersError",
    ()=>clearUsersError,
    "createUser",
    ()=>createUser,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteUser",
    ()=>deleteUser,
    "fetchUsers",
    ()=>fetchUsers,
    "selectUsers",
    ()=>selectUsers,
    "selectUsersError",
    ()=>selectUsersError,
    "selectUsersLoading",
    ()=>selectUsersLoading,
    "selectUsersMeta",
    ()=>selectUsersMeta,
    "updateUser",
    ()=>updateUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
const fetchUsers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("users/fetchAll", async (params, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/GetUsers", {
            params
        });
        return res.data; // { users: [], meta: { maxUsers, currentUsers, canAddMore, ... } | null }
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
    }
});
const createUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("users/create", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/CreateUser", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create user");
    }
});
const updateUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("users/update", async (data, { rejectWithValue })=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/UpdateUser", data);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update user");
    }
});
const deleteUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("users/delete", async (id, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/DeleteUser", {
            id
        });
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete user");
    }
});
const usersSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "users",
    initialState: {
        list: [],
        meta: null,
        isLoading: false,
        error: null
    },
    reducers: {
        clearUsersError (state) {
            state.error = null;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchUsers.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(fetchUsers.fulfilled, (state, action)=>{
            state.isLoading = false;
            // Check if backend returned { users, meta } or just []
            if (action.payload && action.payload.users !== undefined) {
                state.list = action.payload.users;
                state.meta = action.payload.meta;
            } else {
                state.list = action.payload || [];
                state.meta = null;
            }
        }).addCase(fetchUsers.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        }).addCase(createUser.fulfilled, (state, action)=>{
            state.list.unshift(action.payload);
            if (state.meta) {
                state.meta.currentUsers += 1;
                state.meta.canAddMore = state.meta.currentUsers < state.meta.maxUsers;
            }
        }).addCase(createUser.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(updateUser.fulfilled, (state, action)=>{
            const idx = state.list.findIndex((u)=>u.id === action.payload.id);
            if (idx !== -1) state.list[idx] = action.payload;
        }).addCase(updateUser.rejected, (state, action)=>{
            state.error = action.payload;
        }).addCase(deleteUser.fulfilled, (state, action)=>{
            state.list = state.list.filter((u)=>u.id !== action.payload);
            if (state.meta) {
                state.meta.currentUsers -= 1;
                state.meta.canAddMore = state.meta.currentUsers < state.meta.maxUsers;
            }
        }).addCase(deleteUser.rejected, (state, action)=>{
            state.error = action.payload;
        });
    }
});
const { clearUsersError } = usersSlice.actions;
const selectUsers = (state)=>state.users.list;
const selectUsersMeta = (state)=>state.users.meta;
const selectUsersLoading = (state)=>state.users.isLoading;
const selectUsersError = (state)=>state.users.error;
const __TURBOPACK__default__export__ = usersSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/store.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "store",
    ()=>store
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2f$dist$2f$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/redux/dist/redux.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$authSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/slices/authSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$rolesSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/slices/rolesSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$companiesSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/slices/companiesSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$usersSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/slices/usersSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$clientsSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/slices/clientsSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$notificationsSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/slices/notificationsSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$companyContextSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/slices/companyContextSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/store/chatSlice.js [app-client] (ecmascript)");
// Entity reducers
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$departmentsSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/entities/departmentsSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$designationsSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/entities/designationsSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$employeesSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/entities/employeesSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$branchesSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/entities/branchesSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$companyHrPoliciesSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/entities/companyHrPoliciesSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$holidaysSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/entities/holidaysSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$leaveTypesSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/entities/leaveTypesSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$leaveRequestsSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/entities/leaveRequestsSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$leaveBalancesSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/entities/leaveBalancesSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$attendanceSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/entities/attendanceSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$shiftsSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/entities/shiftsSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$categoriesSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/entities/categoriesSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$partnerRoleSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/entities/partnerRoleSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$productSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/entities/productSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$partnerSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/entities/partnerSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$taskSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/entities/taskSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$bagSpecsSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/entities/bagSpecsSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$shipmentTypeSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/entities/shipmentTypeSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$paymentTermSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/entities/paymentTermSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$tradeDocumentSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/entities/tradeDocumentSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
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
;
;
;
;
;
;
;
;
;
const entitiesReducer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2f$dist$2f$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["combineReducers"])({
    departments: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$departmentsSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    designations: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$designationsSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    employees: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$employeesSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    branches: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$branchesSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    companyHrPolicies: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$companyHrPoliciesSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    holidays: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$holidaysSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    leaveTypes: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$leaveTypesSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    leaveRequests: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$leaveRequestsSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    leaveBalances: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$leaveBalancesSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    attendance: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$attendanceSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    shifts: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$shiftsSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    categories: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$categoriesSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    partnerRoles: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$partnerRoleSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    products: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$productSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    partners: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$partnerSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    tasks: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$taskSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    bagSpecs: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$bagSpecsSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    shipmentTypes: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$shipmentTypeSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    paymentTerms: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$paymentTermSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    tradeDocuments: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$entities$2f$tradeDocumentSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
});
const rootEntitiesReducer = (state, action)=>{
    if (action.type === 'companyContext/switch/fulfilled') {
        state = undefined;
    }
    return entitiesReducer(state, action);
};
const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["configureStore"])({
    reducer: {
        auth: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$authSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        companyContext: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$companyContextSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        roles: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$rolesSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        companies: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$companiesSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        users: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$usersSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        clients: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$clientsSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        notifications: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$notificationsSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        entities: rootEntitiesReducer,
        chat: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$store$2f$chatSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    },
    devTools: false
});
(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["injectStore"])(store);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_store_14c345a._.js.map