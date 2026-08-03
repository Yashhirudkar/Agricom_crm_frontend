import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeConversationId: null,
  activeThreadId: null,
  composerDrafts: {}, // Record<conversationId, string>
  socketStatus: "DISCONNECTED", // 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING'
  typingState: {}, // Record<conversationId, Array<{ userId: number, name: string }>>
  sidebarCollapsed: false,
  rightPanelTab: null, // 'INFO' | 'MEMBERS' | 'SETTINGS' | 'GALLERY' | null
  
  // Real-time Upload Queue (Attachment Upload Queue)
  uploadQueue: {}, // Record<fileId, { fileName: string, progress: number, status: 'UPLOADING'|'PAUSED'|'FAILED'|'SUCCESS', error?: string }>
  
  // Real-time Message Optimistic Queue (Optimistic Queue Manager)
  optimisticQueue: {}, // Record<clientMessageId, { conversationId: number, content: string, status: 'PENDING'|'FAILED'|'SENT', error?: string }>
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversationId(state, action) {
      state.activeConversationId = action.payload;
    },
    setActiveThreadId(state, action) {
      state.activeThreadId = action.payload;
    },
    setComposerDraft(state, action) {
      const { conversationId, draft } = action.payload;
      state.composerDrafts[conversationId] = draft;
    },
    setSocketStatus(state, action) {
      state.socketStatus = action.payload;
    },
    setTypingUsers(state, action) {
      const { conversationId, users } = action.payload;
      state.typingState[conversationId] = users;
    },
    setSidebarCollapsed(state, action) {
      state.sidebarCollapsed = action.payload;
    },
    setRightPanelTab(state, action) {
      state.rightPanelTab = action.payload;
    },

    // Upload Queue actions
    addToUploadQueue(state, action) {
      const { fileId, fileName } = action.payload;
      state.uploadQueue[fileId] = {
        fileName,
        progress: 0,
        status: "UPLOADING",
      };
    },
    updateUploadProgress(state, action) {
      const { fileId, progress } = action.payload;
      if (state.uploadQueue[fileId]) {
        state.uploadQueue[fileId].progress = progress;
      }
    },
    setUploadStatus(state, action) {
      const { fileId, status, error } = action.payload;
      if (state.uploadQueue[fileId]) {
        state.uploadQueue[fileId].status = status;
        if (error) {
          state.uploadQueue[fileId].error = error;
        }
      }
    },
    removeFromUploadQueue(state, action) {
      const fileId = action.payload;
      delete state.uploadQueue[fileId];
    },

    // Optimistic Message Queue actions
    addToOptimisticQueue(state, action) {
      const { clientMessageId, conversationId, content } = action.payload;
      state.optimisticQueue[clientMessageId] = {
        conversationId,
        content,
        status: "PENDING",
      };
    },
    setOptimisticStatus(state, action) {
      const { clientMessageId, status, error } = action.payload;
      if (state.optimisticQueue[clientMessageId]) {
        state.optimisticQueue[clientMessageId].status = status;
        if (error) {
          state.optimisticQueue[clientMessageId].error = error;
        }
      }
    },
    removeFromOptimisticQueue(state, action) {
      const clientMessageId = action.payload;
      delete state.optimisticQueue[clientMessageId];
    },
  },
});

export const {
  setActiveConversationId,
  setActiveThreadId,
  setComposerDraft,
  setSocketStatus,
  setTypingUsers,
  setSidebarCollapsed,
  setRightPanelTab,
  addToUploadQueue,
  updateUploadProgress,
  setUploadStatus,
  removeFromUploadQueue,
  addToOptimisticQueue,
  setOptimisticStatus,
  removeFromOptimisticQueue,
} = chatSlice.actions;

export const selectActiveConversationId = (state) => state.chat.activeConversationId;
export const selectActiveThreadId = (state) => state.chat.activeThreadId;
export const selectComposerDrafts = (state) => state.chat.composerDrafts;
export const selectSocketStatus = (state) => state.chat.socketStatus;
export const selectTypingState = (state) => state.chat.typingState;
export const selectSidebarCollapsed = (state) => state.chat.sidebarCollapsed;
export const selectRightPanelTab = (state) => state.chat.rightPanelTab;
export const selectUploadQueue = (state) => state.chat.uploadQueue;
export const selectOptimisticQueue = (state) => state.chat.optimisticQueue;

export default chatSlice.reducer;
