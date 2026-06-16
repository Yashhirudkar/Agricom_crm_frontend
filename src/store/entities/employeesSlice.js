import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

// Normalize state using EntityAdapter
export const employeesAdapter = createEntityAdapter();

export const fetchEmployees = createAsyncThunk("entities/employees/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/employees", { params });
    return res.data; // { data: [], total, page, limit, totalPages }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch employees");
  }
});

export const fetchEmployeeById = createAsyncThunk("entities/employees/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get(`/employees/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch employee");
  }
});

export const createEmployee = createAsyncThunk("entities/employees/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/employees", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create employee");
  }
});

export const updateEmployee = createAsyncThunk("entities/employees/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put(`/employees/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update employee");
  }
});

export const deleteEmployee = createAsyncThunk("entities/employees/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/employees/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete employee");
  }
});

// Lifecycle Transitions
export const transitionEmployeeLifecycle = createAsyncThunk("entities/employees/transition", async ({ id, transition, data }, { rejectWithValue }) => {
  try {
    let res;
    if (transition === 'start-onboarding') {
      res = await axiosClient.post(`/employees/${id}/start-onboarding`, data);
    } else {
      res = await axiosClient.put(`/employees/${id}/${transition}`, data);
    }
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to transition employee");
  }
});

// Documents
export const fetchEmployeeDocuments = createAsyncThunk("entities/employees/fetchDocuments", async (employeeId, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get(`/employees/${employeeId}/documents`);
    return res.data; // array of documents
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch documents");
  }
});

export const addEmployeeDocument = createAsyncThunk("entities/employees/addDocument", async ({ employeeId, data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post(`/employees/${employeeId}/documents`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to add document");
  }
});

export const verifyEmployeeDocument = createAsyncThunk("entities/employees/verifyDocument", async ({ employeeId, documentId, data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put(`/employees/${employeeId}/documents/${documentId}/verify`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to verify document");
  }
});

export const deleteEmployeeDocument = createAsyncThunk("entities/employees/deleteDocument", async ({ employeeId, documentId }, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/employees/${employeeId}/documents/${documentId}`);
    return documentId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete document");
  }
});

const employeesSlice = createSlice({
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
    error: null,
  }),
  reducers: {
    clearEmployeesError(state) { state.error = null; },
    clearCurrentEmployee(state) { 
      state.current = null;
      state.documents = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchEmployees.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchEmployees.fulfilled, (state, action) => { 
        state.isLoading = false; 
        employeesAdapter.setAll(state, action.payload.data);
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchEmployees.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      // Fetch Single
      .addCase(fetchEmployeeById.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.current = action.payload; 
        employeesAdapter.upsertOne(state, action.payload);
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      // Create
      .addCase(createEmployee.fulfilled, (state, action) => {
        employeesAdapter.addOne(state, action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => { state.error = action.payload; })

      // Update
      .addCase(updateEmployee.fulfilled, (state, action) => {
        employeesAdapter.upsertOne(state, action.payload);
        if (state.current?.id === action.payload.id) {
          state.current = { ...state.current, ...action.payload };
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => { state.error = action.payload; })

      // Lifecycle Transition
      .addCase(transitionEmployeeLifecycle.fulfilled, (state, action) => {
        employeesAdapter.upsertOne(state, action.payload);
        if (state.current?.id === action.payload.id) {
          state.current = { ...state.current, ...action.payload };
        }
      })
      .addCase(transitionEmployeeLifecycle.rejected, (state, action) => { state.error = action.payload; })

      // Delete
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        employeesAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteEmployee.rejected, (state, action) => { state.error = action.payload; })

      // Documents
      .addCase(fetchEmployeeDocuments.pending, (state) => { state.isDocumentsLoading = true; })
      .addCase(fetchEmployeeDocuments.fulfilled, (state, action) => { state.isDocumentsLoading = false; state.documents = action.payload; })
      .addCase(fetchEmployeeDocuments.rejected, (state, action) => { state.isDocumentsLoading = false; state.error = action.payload; })

      .addCase(addEmployeeDocument.fulfilled, (state, action) => { state.documents.unshift(action.payload); })
      .addCase(verifyEmployeeDocument.fulfilled, (state, action) => {
        const idx = state.documents.findIndex(d => d.id === action.payload.id);
        if (idx !== -1) {
          state.documents[idx] = action.payload;
        }
      })
      .addCase(deleteEmployeeDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter((d) => d.id !== action.payload);
      });
  },
});

export const { clearEmployeesError, clearCurrentEmployee } = employeesSlice.actions;

// Selectors
export const { 
  selectAll: selectAllEmployees, 
  selectById: selectEmployeeById,
  selectEntities: selectEmployeeEntities 
} = employeesAdapter.getSelectors(state => state.entities.employees);

// Legacy compat selector
export const selectEmployeesData = createSelector(
  [
    selectAllEmployees,
    (state) => state.entities.employees.total,
    (state) => state.entities.employees.page,
    (state) => state.entities.employees.limit,
    (state) => state.entities.employees.totalPages
  ],
  (data, total, page, limit, totalPages) => ({
    data,
    total,
    page,
    limit,
    totalPages
  })
);

export const selectCurrentEmployee = (state) => state.entities.employees.current;
export const selectEmployeeDocuments = (state) => state.entities.employees.documents;
export const selectEmployeesLoading = (state) => state.entities.employees.isLoading;
export const selectEmployeesError = (state) => state.entities.employees.error;

export default employeesSlice.reducer;
