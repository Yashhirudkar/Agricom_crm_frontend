import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/v1/notifications");
      return res.data.data; // Array of notifications
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch notifications");
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/v1/notifications/${id}/read`);
      return res.data.data; // Updated notification object
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to mark notification as read");
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post("/v1/notifications/mark-all-read");
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to mark all notifications as read");
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearNotificationsError(state) {
      state.error = null;
    },
    addSocketNotification(state, action) {
      const exists = state.list.some((n) => n.id === action.payload.id);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload || [];
        state.unreadCount = (action.payload || []).filter((n) => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.list.findIndex((n) => n.id === updated.id);
        if (idx !== -1) {
          const wasUnread = !state.list[idx].isRead;
          state.list[idx] = updated;
          if (wasUnread && updated.isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
      })

      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.list = state.list.map((n) => ({ ...n, isRead: true }));
        state.unreadCount = 0;
      });
  },
});

export const { clearNotificationsError, addSocketNotification } = notificationsSlice.actions;

export const selectNotifications = (state) => state.notifications.list;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectNotificationsLoading = (state) => state.notifications.isLoading;
export const selectNotificationsError = (state) => state.notifications.error;

export default notificationsSlice.reducer;
