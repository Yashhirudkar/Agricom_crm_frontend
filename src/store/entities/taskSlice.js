import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { tasksApi } from "@/api/tasks.api";

export const tasksAdapter = createEntityAdapter();

export const fetchTasks = createAsyncThunk("entities/tasks/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await tasksApi.getAll(params);
    return res;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch tasks");
  }
});

export const fetchTaskById = createAsyncThunk("entities/tasks/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await tasksApi.getById(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch task");
  }
});

export const createTask = createAsyncThunk("entities/tasks/create", async (data, { rejectWithValue }) => {
  try {
    const res = await tasksApi.create(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create task");
  }
});

export const updateTask = createAsyncThunk("entities/tasks/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await tasksApi.update(id, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update task");
  }
});

export const archiveTask = createAsyncThunk("entities/tasks/archive", async ({ id, isArchived }, { rejectWithValue }) => {
  try {
    const res = await tasksApi.archive(id, isArchived);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to archive task");
  }
});

export const deleteTask = createAsyncThunk("entities/tasks/delete", async (id, { rejectWithValue }) => {
  try {
    await tasksApi.delete(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete task");
  }
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: tasksAdapter.getInitialState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    current: null,
    isLoading: false,
    error: null,
  }),
  reducers: {
    clearTasksError(state) { state.error = null; },
    clearCurrentTask(state) { state.current = null; }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchTasks.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchTasks.fulfilled, (state, action) => { 
        state.isLoading = false; 
        tasksAdapter.setAll(state, action.payload.data || action.payload);
        state.total = action.payload.meta?.total || action.payload.length || 0;
        state.page = action.payload.meta?.page || 1;
        state.limit = action.payload.meta?.limit || 10;
        state.totalPages = action.payload.meta?.totalPages || 1;
      })
      .addCase(fetchTasks.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      // Fetch By Id
      .addCase(fetchTaskById.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchTaskById.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.current = action.payload; 
        tasksAdapter.upsertOne(state, action.payload);
      })
      .addCase(fetchTaskById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      // Create
      .addCase(createTask.fulfilled, (state, action) => {
        tasksAdapter.addOne(state, action.payload);
      })
      .addCase(createTask.rejected, (state, action) => { state.error = action.payload; })

      // Update
      .addCase(updateTask.fulfilled, (state, action) => {
        tasksAdapter.upsertOne(state, action.payload);
        if (state.current?.id === action.payload.id) {
          state.current = { ...state.current, ...action.payload };
        }
      })
      .addCase(updateTask.rejected, (state, action) => { state.error = action.payload; })

      // Archive
      .addCase(archiveTask.fulfilled, (state, action) => {
        tasksAdapter.upsertOne(state, action.payload);
        if (state.current?.id === action.payload.id) {
          state.current = { ...state.current, ...action.payload };
        }
      })
      .addCase(archiveTask.rejected, (state, action) => { state.error = action.payload; })

      // Delete
      .addCase(deleteTask.fulfilled, (state, action) => {
        tasksAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearTasksError, clearCurrentTask } = taskSlice.actions;

export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById
} = tasksAdapter.getSelectors(state => state.entities.tasks);

export const selectTasksData = createSelector(
  [
    selectAllTasks,
    (state) => state.entities.tasks.total,
    (state) => state.entities.tasks.page,
    (state) => state.entities.tasks.limit,
    (state) => state.entities.tasks.totalPages
  ],
  (data, total, page, limit, totalPages) => ({
    data,
    total,
    page,
    limit,
    totalPages
  })
);

export const selectCurrentTask = (state) => state.entities.tasks.current;
export const selectTasksLoading = (state) => state.entities.tasks.isLoading;
export const selectTasksError = (state) => state.entities.tasks.error;

export default taskSlice.reducer;
