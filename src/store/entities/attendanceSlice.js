import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const attendanceAdapter = createEntityAdapter();

export const checkIn = createAsyncThunk("entities/attendance/checkIn", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/attendance/check-in", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Check-in failed");
  }
});

export const checkOut = createAsyncThunk("entities/attendance/checkOut", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/attendance/check-out", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Check-out failed");
  }
});



export const fetchMyAttendance = createAsyncThunk("entities/attendance/fetchMy", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/attendance/me", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch my attendance");
  }
});

export const fetchCompanyAttendance = createAsyncThunk("entities/attendance/fetchCompany", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/attendance/company", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch company attendance");
  }
});

export const fetchCorrections = createAsyncThunk("entities/attendance/fetchCorrections", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/attendance/corrections");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch corrections");
  }
});

export const requestCorrection = createAsyncThunk("entities/attendance/requestCorrection", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/attendance/request-regularization", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to request correction");
  }
});

export const approveCorrection = createAsyncThunk("entities/attendance/approveCorrection", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put(`/attendance/admin/approve-regularization/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to approve correction");
  }
});

export const rejectCorrection = createAsyncThunk("entities/attendance/rejectCorrection", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put(`/attendance/admin/reject-regularization/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to reject correction");
  }
});

export const manualAttendance = createAsyncThunk("entities/attendance/manualAttendance", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/attendance/admin/manual-attendance", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to mark manual attendance");
  }
});

export const overrideAttendance = createAsyncThunk("entities/attendance/override", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put(`/attendance/${id}/override`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to override attendance");
  }
});

export const fetchMonthlyReport = createAsyncThunk("entities/attendance/fetchMonthlyReport", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/attendance/report/monthly", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch monthly report");
  }
});

export const assignShift = createAsyncThunk("entities/attendance/assignShift", async ({ employeeId, data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post(`/attendance/assign-shift/${employeeId}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to assign shift");
  }
});

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: attendanceAdapter.getInitialState({
    myAttendance: [],
    companyAttendance: [],
    corrections: [],
    monthlyReport: [],
    isLoading: false,
    error: null,
    successMessage: null,
  }),
  reducers: {
    clearAttendanceError(state) {
      state.error = null;
    },
    clearAttendanceSuccessMessage(state) {
      state.successMessage = null;
    },
    handleSocketBatchUpdate(state, action) {
      const updates = action.payload;
      if (!Array.isArray(updates)) return;

      updates.forEach(payload => {
        const { employeeId, date, attendanceState, attendanceStatus, checkInTime, checkOutTime } = payload;

        // 1. Update myAttendance
        const myIdx = state.myAttendance.findIndex(r => r.employeeId === employeeId && r.date === date);
        if (myIdx >= 0) {
          const currentRecord = state.myAttendance[myIdx];
          state.myAttendance[myIdx] = {
            ...currentRecord,
            checkInTime: checkInTime !== undefined ? checkInTime : currentRecord.checkInTime,
            checkOutTime: checkOutTime !== undefined ? checkOutTime : currentRecord.checkOutTime,
            attendanceState: attendanceState !== undefined ? attendanceState : currentRecord.attendanceState,
            attendanceStatus: attendanceStatus !== undefined ? attendanceStatus : currentRecord.attendanceStatus,
          };
          
          if (!state.myAttendance[myIdx].logs) state.myAttendance[myIdx].logs = [];
          
          if (payload.action === 'checked_in') {
            const hasLog = state.myAttendance[myIdx].logs.some(l => l.actionType === 'CHECK_IN' && l.timestamp === payload.timestamp);
            if (!hasLog) {
              state.myAttendance[myIdx].logs.push({
                actionType: 'CHECK_IN',
                timestamp: payload.timestamp || new Date().toISOString(),
                metadata: { verificationMethod: 'WEB' }
              });
            }
          } else if (payload.action === 'checked_out') {
            const hasLog = state.myAttendance[myIdx].logs.some(l => l.actionType === 'CHECK_OUT' && l.timestamp === payload.timestamp);
            if (!hasLog) {
              state.myAttendance[myIdx].logs.push({
                actionType: 'CHECK_OUT',
                timestamp: payload.timestamp || new Date().toISOString(),
                metadata: { verificationMethod: 'WEB' }
              });
            }
          }
        }

        // 2. Update companyAttendance
        const compIdx = state.companyAttendance.findIndex(r => r.employeeId === employeeId && r.date === date);
        if (compIdx >= 0) {
          const currentRecord = state.companyAttendance[compIdx];
          state.companyAttendance[compIdx] = {
            ...currentRecord,
            checkInTime: checkInTime !== undefined ? checkInTime : currentRecord.checkInTime,
            checkOutTime: checkOutTime !== undefined ? checkOutTime : currentRecord.checkOutTime,
            attendanceState: attendanceState !== undefined ? attendanceState : currentRecord.attendanceState,
            attendanceStatus: attendanceStatus !== undefined ? attendanceStatus : currentRecord.attendanceStatus,
          };
        }

        // 3. Update monthlyReport
        if (Array.isArray(state.monthlyReport)) {
          state.monthlyReport.forEach(report => {
            if (report.employeeId === employeeId) {
              const dayIdx = report.days?.findIndex(d => d.date === date);
              if (dayIdx >= 0) {
                const dayRecord = report.days[dayIdx];
                report.days[dayIdx] = {
                  ...dayRecord,
                  checkIn: checkInTime !== undefined ? checkInTime : dayRecord.checkIn,
                  checkOut: checkOutTime !== undefined ? checkOutTime : dayRecord.checkOut,
                  status: attendanceStatus !== undefined ? attendanceStatus : dayRecord.status,
                  attendanceState: attendanceState !== undefined ? attendanceState : dayRecord.attendanceState,
                  workHours: (checkInTime && checkOutTime) 
                    ? parseFloat(((new Date(checkOutTime) - new Date(checkInTime) - 60 * 60 * 1000) / (1000 * 60 * 60)).toFixed(2))
                    : dayRecord.workHours
                };
              }
            }
          });
        }
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkIn.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = "Checked in successfully";
        // Optimistically update today's record in myAttendance
        if (action.payload) {
          const idx = state.myAttendance.findIndex(r => r.id === action.payload.id || r.date === action.payload.date);
          if (idx >= 0) state.myAttendance[idx] = action.payload;
          else state.myAttendance = [...state.myAttendance, action.payload];
        }
      })
      .addCase(checkIn.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      .addCase(checkOut.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = "Checked out successfully";
        // Optimistically update today's record in myAttendance
        if (action.payload) {
          const idx = state.myAttendance.findIndex(r => r.id === action.payload.id || r.date === action.payload.date);
          if (idx >= 0) state.myAttendance[idx] = action.payload;
          else state.myAttendance = [...state.myAttendance, action.payload];
        }
      })
      .addCase(checkOut.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })



      .addCase(fetchMyAttendance.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchMyAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle both array and paginated { data: [] } shapes
        state.myAttendance = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
      })
      .addCase(fetchMyAttendance.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(fetchCompanyAttendance.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchCompanyAttendance.fulfilled, (state, action) => { state.isLoading = false; state.companyAttendance = action.payload; })
      .addCase(fetchCompanyAttendance.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(fetchCorrections.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchCorrections.fulfilled, (state, action) => { state.isLoading = false; state.corrections = action.payload; })
      .addCase(fetchCorrections.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(requestCorrection.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(requestCorrection.fulfilled, (state, action) => { state.isLoading = false; state.successMessage = "Correction requested successfully"; })
      .addCase(requestCorrection.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(approveCorrection.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(approveCorrection.fulfilled, (state, action) => { state.isLoading = false; state.successMessage = "Correction approved"; })
      .addCase(approveCorrection.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(rejectCorrection.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(rejectCorrection.fulfilled, (state, action) => { state.isLoading = false; state.successMessage = "Correction rejected"; })
      .addCase(rejectCorrection.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(fetchMonthlyReport.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchMonthlyReport.fulfilled, (state, action) => { state.isLoading = false; state.monthlyReport = action.payload; })
      .addCase(fetchMonthlyReport.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(overrideAttendance.fulfilled, (state, action) => { state.successMessage = "Attendance overridden successfully"; })
      .addCase(overrideAttendance.rejected, (state, action) => { state.error = action.payload; })
      
      .addCase(assignShift.fulfilled, (state, action) => { state.successMessage = "Shift assigned successfully"; })
      .addCase(assignShift.rejected, (state, action) => { state.error = action.payload; })
      
      .addCase(manualAttendance.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(manualAttendance.fulfilled, (state, action) => { state.isLoading = false; state.successMessage = "Attendance marked successfully"; })
      .addCase(manualAttendance.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export const { clearAttendanceError, clearAttendanceSuccessMessage, handleSocketBatchUpdate } = attendanceSlice.actions;

export const selectMyAttendance = (state) => state.entities.attendance.myAttendance;
export const selectCompanyAttendance = (state) => state.entities.attendance.companyAttendance;
export const selectCorrections = (state) => state.entities.attendance.corrections;
export const selectMonthlyReport = (state) => state.entities.attendance.monthlyReport;
export const selectAttendanceLoading = (state) => state.entities.attendance.isLoading;
export const selectAttendanceError = (state) => state.entities.attendance.error;
export const selectAttendanceSuccess = (state) => state.entities.attendance.successMessage;

export default attendanceSlice.reducer;
