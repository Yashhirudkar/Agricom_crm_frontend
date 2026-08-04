import axiosClient from "@/lib/axios";

export const ChatAPI = {
  // Conversations
  getConversations: async (filters = {}) => {
    const res = await axiosClient.get("/conversations", { params: filters });
    return res.data;
  },

  getConversationById: async (id) => {
    const res = await axiosClient.get(`/conversations/${id}`);
    return res.data;
  },

  createConversation: async (dto) => {
    const res = await axiosClient.post("/conversations", dto);
    return res.data;
  },

  updateConversation: async (id, dto) => {
    const res = await axiosClient.put(`/conversations/${id}`, dto);
    return res.data;
  },

  archiveConversation: async (id) => {
    const res = await axiosClient.delete(`/conversations/${id}`);
    return res.data;
  },

  lockConversation: async (id) => {
    const res = await axiosClient.post(`/conversations/${id}/lock`);
    return res.data;
  },

  unlockConversation: async (id) => {
    const res = await axiosClient.post(`/conversations/${id}/unlock`);
    return res.data;
  },

  // Members
  getMembers: async (conversationId) => {
    const res = await axiosClient.get(`/conversations/${conversationId}/members`);
    return res.data;
  },

  addMember: async (conversationId, userId) => {
    const res = await axiosClient.post(`/conversations/${conversationId}/members`, { userId });
    return res.data;
  },

  removeMember: async (conversationId, userId) => {
    const res = await axiosClient.delete(`/conversations/${conversationId}/members/${userId}`);
    return res.data;
  },

  updateMemberRole: async (conversationId, userId, role) => {
    const res = await axiosClient.put(`/conversations/${conversationId}/members/${userId}/role`, { role });
    return res.data;
  },

  muteMember: async (conversationId, userId, dto) => {
    const res = await axiosClient.post(`/conversations/${conversationId}/members/${userId}/mute`, dto);
    return res.data;
  },

  // Messages & Editing & Deleting
  sendMessage: async (conversationId, dto) => {
    const res = await axiosClient.post(`/conversations/${conversationId}/messages`, dto);
    return res.data;
  },

  editMessage: async (conversationId, messageId, content) => {
    const res = await axiosClient.put(`/conversations/${conversationId}/messages/${messageId}`, { content });
    return res.data;
  },

  deleteMessage: async (conversationId, messageId, mode) => {
    const res = await axiosClient.delete(`/conversations/${conversationId}/messages/${messageId}`, {
      params: { mode },
    });
    return res.data;
  },

  reactToMessage: async (conversationId, messageId, reaction) => {
    const res = await axiosClient.post(`/conversations/${conversationId}/messages/${messageId}/react`, { reaction });
    return res.data;
  },

  markRead: async (conversationId, lastMessageId) => {
    const res = await axiosClient.post(`/conversations/${conversationId}/messages/read`, { lastMessageId });
    return res.data;
  },

  getMessageHistory: async (conversationId, params = {}) => {
    const res = await axiosClient.get(`/conversations/${conversationId}/messages/history`, { params });
    return res.data;
  },

  getMessageVersions: async (conversationId, messageId) => {
    const res = await axiosClient.get(`/conversations/${conversationId}/messages/${messageId}/versions`);
    return res.data;
  },

  // Threads
  getThreads: async (conversationId, parentId) => {
    const res = await axiosClient.get(`/chat/conversations/${conversationId}/threads/${parentId}`);
    return res.data;
  },

  replyToThread: async (conversationId, parentId, dto) => {
    const res = await axiosClient.post(`/chat/conversations/${conversationId}/threads/${parentId}`, dto);
    return res.data;
  },

  // Polls
  createPoll: async (conversationId, dto) => {
    const res = await axiosClient.post(`/chat/conversations/${conversationId}/polls`, dto);
    return res.data;
  },

  votePoll: async (pollId, optionIds) => {
    const res = await axiosClient.post(`/chat/polls/${pollId}/vote`, { optionIds });
    return res.data;
  },

  closePoll: async (pollId) => {
    const res = await axiosClient.post(`/chat/polls/${pollId}/close`);
    return res.data;
  },

  // Extra features (Pins & Star/Bookmarks & Drafts)
  pinMessage: async (conversationId, messageId) => {
    const res = await axiosClient.post(`/chat/conversations/${conversationId}/messages/${messageId}/pin`);
    return res.data;
  },

  unpinMessage: async (conversationId, messageId) => {
    const res = await axiosClient.delete(`/chat/conversations/${conversationId}/messages/${messageId}/pin`);
    return res.data;
  },

  getPinnedMessages: async (conversationId) => {
    const res = await axiosClient.get(`/chat/conversations/${conversationId}/pins`);
    return res.data;
  },

  getStarredMessages: async () => {
    const res = await axiosClient.get("/chat/starred-messages");
    return res.data;
  },

  toggleStarMessage: async (messageId) => {
    const res = await axiosClient.post(`/chat/messages/${messageId}/star`);
    return res.data;
  },

  unstarMessage: async (messageId) => {
    const res = await axiosClient.delete(`/chat/messages/${messageId}/star`);
    return res.data;
  },

  saveDraft: async (conversationId, draftContent) => {
    const res = await axiosClient.post(`/chat/conversations/${conversationId}/drafts`, { draftContent });
    return res.data;
  },

  // ERP Context Discussions
  getOrCreateErpDiscussion: async (dto) => {
    const res = await axiosClient.post("/chat/erp-discussions/get-or-create", dto);
    return res.data;
  },

  getErpDiscussionByContext: async (entityType, entityId) => {
    const res = await axiosClient.get(`/chat/erp-discussions/${entityType}/${entityId}`);
    return res.data;
  },

  // Scheduled Messages
  getScheduledMessages: async (conversationId) => {
    const res = await axiosClient.get(`/chat/conversations/${conversationId}/scheduled-messages`);
    return res.data;
  },

  scheduleMessage: async (conversationId, dto) => {
    const res = await axiosClient.post(`/chat/conversations/${conversationId}/scheduled-messages`, dto);
    return res.data;
  },

  cancelScheduledMessage: async (scheduledId) => {
    const res = await axiosClient.delete(`/chat/scheduled-messages/${scheduledId}`);
    return res.data;
  },

  // Search
  searchMessages: async (params) => {
    const res = await axiosClient.get("/chat/search", { params });
    return res.data;
  },

  // Admin Policies & Feature Flags
  getPolicy: async () => {
    const res = await axiosClient.get("/chat/policies");
    return res.data;
  },

  updatePolicy: async (dto) => {
    const res = await axiosClient.put("/chat/policies", dto);
    return res.data;
  },

  // Labels
  getLabels: async () => {
    const res = await axiosClient.get("/chat/labels");
    return res.data;
  },

  createLabel: async (dto) => {
    const res = await axiosClient.post("/chat/labels", dto);
    return res.data;
  },

  assignLabel: async (conversationId, labelId) => {
    const res = await axiosClient.post(`/chat/conversations/${conversationId}/labels`, { labelId });
    return res.data;
  },

  removeLabel: async (conversationId, labelId) => {
    const res = await axiosClient.delete(`/chat/conversations/${conversationId}/labels/${labelId}`);
    return res.data;
  },

  // Analytics
  getOverviewAnalytics: async (days) => {
    const res = await axiosClient.get("/chat/analytics/overview", { params: { days } });
    return res.data;
  },

  // Compliance
  exportConversationTranscript: async (conversationId) => {
    const res = await axiosClient.get(`/chat/compliance/export/${conversationId}`);
    return res.data;
  },
};
