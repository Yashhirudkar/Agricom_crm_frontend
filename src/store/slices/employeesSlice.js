import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const fetchEmployees = createAsyncThunk("employees/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/employees", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch employees");
  }
});

export const fetchEmployeeById = createAsyncThunk("employees/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get(`/employees/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch employee");
  }
});

export const createEmployee = createAsyncThunk("employees/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/employees", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create employee");
  }
});

export const updateEmployee = createAsyncThunk("employees/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put(`/employees/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update employee");
  }
});

export const deleteEmployee = createAsyncThunk("employees/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/employees/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete employee");
  }
});

// Documents
export const fetchEmployeeDocuments = createAsyncThunk("employees/fetchDocuments", async (employeeId, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get(`/employees/${employeeId}/documents`);
    return res.data; // array of documents
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch documents");
  }
});

export const addEmployeeDocument = createAsyncThunk("employees/addDocument", async ({ employeeId, data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post(`/employees/${employeeId}/documents`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to add document");
  }
});

export const deleteEmployeeDocument = createAsyncThunk("employees/deleteDocument", async ({ employeeId, documentId }, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/employees/${employeeId}/documents/${documentId}`);
    return documentId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete document");
  }
});

const employeesSlice = createSlice({
  name: "employees",
  initialState: {
    data: { data: [], total: 0, page: 1, limit: 10, totalPages: 0 },
    current: null,
    documents: [],
    isLoading: false,
    isDocumentsLoading: false,
    error: null,
  },
  reducers: {
    clearEmployeesError(state) { state.error = null; },
    clearCurrentEmployee(state) { 
      state.current = null;
      state.documents = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchEmployees.fulfilled, (state, action) => { state.isLoading = false; state.data = action.payload; })
      .addCase(fetchEmployees.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(fetchEmployeeById.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => { state.isLoading = false; state.current = action.payload; })
      .addCase(fetchEmployeeById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createEmployee.fulfilled, (state, action) => {
        if (state.data?.data) {
          state.data.data.unshift(action.payload);
        }
      })
      .addCase(createEmployee.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateEmployee.fulfilled, (state, action) => {
        if (state.data?.data) {
          const idx = state.data.data.findIndex((e) => e.id === action.payload.id);
          if (idx !== -1) state.data.data[idx] = { ...state.data.data[idx], ...action.payload };
        }
        if (state.current?.id === action.payload.id) {
          state.current = { ...state.current, ...action.payload };
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteEmployee.fulfilled, (state, action) => {
        if (state.data?.data) {
          state.data.data = state.data.data.filter((e) => e.id !== action.payload);
        }
      })
      .addCase(deleteEmployee.rejected, (state, action) => { state.error = action.payload; })

      // Documents
      .addCase(fetchEmployeeDocuments.pending, (state) => { state.isDocumentsLoading = true; })
      .addCase(fetchEmployeeDocuments.fulfilled, (state, action) => { state.isDocumentsLoading = false; state.documents = action.payload; })
      .addCase(fetchEmployeeDocuments.rejected, (state, action) => { state.isDocumentsLoading = false; state.error = action.payload; })

      .addCase(addEmployeeDocument.fulfilled, (state, action) => { state.documents.unshift(action.payload); })
      .addCase(deleteEmployeeDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter((d) => d.id !== action.payload);
      });
  },
});

export const { clearEmployeesError, clearCurrentEmployee } = employeesSlice.actions;

export const selectEmployeesData = (state) => state.employees.data;
export const selectCurrentEmployee = (state) => state.employees.current;
export const selectEmployeeDocuments = (state) => state.employees.documents;
export const selectEmployeesLoading = (state) => state.employees.isLoading;
export const selectEmployeesError = (state) => state.employees.error;

export default employeesSlice.reducer;
