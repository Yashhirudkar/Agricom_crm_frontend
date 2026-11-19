(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/api/chat.api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatAPI",
    ()=>ChatAPI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
const ChatAPI = {
    // Conversations
    getConversations: async (filters = {})=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/conversations", {
            params: filters
        });
        return res.data;
    },
    getConversationById: async (id)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/conversations/${id}`);
        return res.data;
    },
    createConversation: async (dto)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/conversations", dto);
        return res.data;
    },
    updateConversation: async (id, dto)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/conversations/${id}`, dto);
        return res.data;
    },
    /**
   * Update the posting policy of a CHANNEL conversation.
   * Requires: chat_channel:update_posting_policy permission on backend.
   *
   * dto shape:
   *   {
   *     postingPolicy: "EVERYONE" | "ADMINS" | "OWNER" | "SELECTED_ROLES" | "SELECTED_USERS",
   *     allowedPosters?: number[],   // userIds for SELECTED_USERS
   *     allowedRoles?: string[],     // role names for SELECTED_ROLES
   *   }
   */ updatePostingPolicy: async (conversationId, dto)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/conversations/${conversationId}/posting-policy`, dto);
        return res.data;
    },
    deleteConversation: async (id)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/conversations/${id}`);
        return res.data;
    },
    archiveConversation: async (id)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/conversations/${id}/archive`);
        return res.data;
    },
    unarchiveConversation: async (id)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/conversations/${id}/unarchive`);
        return res.data;
    },
    lockConversation: async (id)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/conversations/${id}/lock`);
        return res.data;
    },
    unlockConversation: async (id)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/conversations/${id}/unlock`);
        return res.data;
    },
    // Members
    getMembers: async (conversationId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/conversations/${conversationId}/members`);
        return res.data;
    },
    addMember: async (conversationId, userId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/conversations/${conversationId}/members`, {
            userId
        });
        return res.data;
    },
    removeMember: async (conversationId, userId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/conversations/${conversationId}/members/${userId}`);
        return res.data;
    },
    updateMemberRole: async (conversationId, userId, role)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/conversations/${conversationId}/members/${userId}/role`, {
            role
        });
        return res.data;
    },
    muteMember: async (conversationId, userId, dto)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/conversations/${conversationId}/members/${userId}/mute`, dto);
        return res.data;
    },
    pinConversation: async (conversationId, userId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/conversations/${conversationId}/members/${userId}/pin`);
        return res.data;
    },
    unpinConversation: async (conversationId, userId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/conversations/${conversationId}/members/${userId}/pin`);
        return res.data;
    },
    muteConversationSelf: async (conversationId, userId, mute)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/conversations/${conversationId}/members/${userId}/mute-self`, {
            mute
        });
        return res.data;
    },
    favoriteConversation: async (conversationId, userId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/conversations/${conversationId}/members/${userId}/favorite`);
        return res.data;
    },
    unfavoriteConversation: async (conversationId, userId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/conversations/${conversationId}/members/${userId}/favorite`);
        return res.data;
    },
    // Messages & Editing & Deleting
    sendMessage: async (conversationId, dto)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/conversations/${conversationId}/messages`, dto);
        return res.data;
    },
    editMessage: async (conversationId, messageId, content)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/conversations/${conversationId}/messages/${messageId}`, {
            content
        });
        return res.data;
    },
    deleteMessage: async (conversationId, messageId, mode)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/conversations/${conversationId}/messages/${messageId}`, {
            params: {
                mode
            }
        });
        return res.data;
    },
    clearChat: async (conversationId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/conversations/${conversationId}/messages/clear`);
        return res.data;
    },
    reactToMessage: async (conversationId, messageId, reaction)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/conversations/${conversationId}/messages/${messageId}/react`, {
            reaction
        });
        return res.data;
    },
    markRead: async (conversationId, lastMessageId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/conversations/${conversationId}/messages/read`, {
            lastMessageId
        });
        return res.data;
    },
    getMessageHistory: async (conversationId, params = {})=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/conversations/${conversationId}/messages/history`, {
            params
        });
        return res.data;
    },
    getMessageVersions: async (conversationId, messageId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/conversations/${conversationId}/messages/${messageId}/versions`);
        return res.data;
    },
    // Threads
    getThreads: async (conversationId, parentId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/chat/conversations/${conversationId}/threads/${parentId}`);
        return res.data;
    },
    replyToThread: async (conversationId, parentId, dto)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/chat/conversations/${conversationId}/threads/${parentId}`, dto);
        return res.data;
    },
    // Polls
    createPoll: async (conversationId, dto)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/chat/conversations/${conversationId}/polls`, dto);
        return res.data;
    },
    votePoll: async (pollId, optionIds)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/chat/polls/${pollId}/vote`, {
            optionIds
        });
        return res.data;
    },
    closePoll: async (pollId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/chat/polls/${pollId}/close`);
        return res.data;
    },
    // Extra features (Pins & Star/Bookmarks & Drafts)
    pinMessage: async (conversationId, messageId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/chat/conversations/${conversationId}/messages/${messageId}/pin`);
        return res.data;
    },
    unpinMessage: async (conversationId, messageId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/chat/conversations/${conversationId}/messages/${messageId}/pin`);
        return res.data;
    },
    getPinnedMessages: async (conversationId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/chat/conversations/${conversationId}/pins`);
        return res.data;
    },
    getStarredMessages: async ()=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/chat/starred-messages");
        return res.data;
    },
    toggleStarMessage: async (messageId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/chat/messages/${messageId}/star`);
        return res.data;
    },
    unstarMessage: async (messageId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/chat/messages/${messageId}/star`);
        return res.data;
    },
    saveDraft: async (conversationId, draftContent)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/chat/conversations/${conversationId}/drafts`, {
            draftContent
        });
        return res.data;
    },
    // ERP Context Discussions
    getOrCreateErpDiscussion: async (dto)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/chat/erp-discussions/get-or-create", dto);
        return res.data;
    },
    getErpDiscussionByContext: async (entityType, entityId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/chat/erp-discussions/${entityType}/${entityId}`);
        return res.data;
    },
    // Scheduled Messages
    getScheduledMessages: async (conversationId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/chat/conversations/${conversationId}/scheduled-messages`);
        return res.data;
    },
    scheduleMessage: async (conversationId, dto)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/chat/conversations/${conversationId}/scheduled-messages`, dto);
        return res.data;
    },
    cancelScheduledMessage: async (scheduledId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/chat/scheduled-messages/${scheduledId}`);
        return res.data;
    },
    // Search
    searchMessages: async (params)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/chat/search", {
            params
        });
        return res.data;
    },
    // Admin Policies & Feature Flags
    getPolicy: async ()=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/chat/policies");
        return res.data;
    },
    updatePolicy: async (dto)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put("/chat/policies", dto);
        return res.data;
    },
    // Labels
    getLabels: async ()=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/chat/labels");
        return res.data;
    },
    createLabel: async (dto)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/chat/labels", dto);
        return res.data;
    },
    assignLabel: async (conversationId, labelId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/chat/conversations/${conversationId}/labels`, {
            labelId
        });
        return res.data;
    },
    removeLabel: async (conversationId, labelId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/chat/conversations/${conversationId}/labels/${labelId}`);
        return res.data;
    },
    // Analytics
    getOverviewAnalytics: async (days)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/chat/analytics/overview", {
            params: {
                days
            }
        });
        return res.data;
    },
    // Compliance
    exportConversationTranscript: async (conversationId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/chat/compliance/export/${conversationId}`);
        return res.data;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/monthlyTarget.api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "monthlyTargetApi",
    ()=>monthlyTargetApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
const monthlyTargetApi = {
    getCurrent: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/monthly-targets/current", {
            params
        }),
    create: (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/monthly-targets", data),
    getHistory: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/monthly-targets/history")
};
const __TURBOPACK__default__export__ = monthlyTargetApi;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/tasks.api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tasksApi",
    ()=>tasksApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
const tasksApi = {
    /**
   * Fetch paginated list of tasks.
   * @param {Object} params - Query params (e.g. statusId, priorityId, search)
   */ getAll: async (params = {})=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/v1/tasks", {
            params
        });
        return response.data;
    },
    /**
   * Fetch a single task by ID.
   * @param {number|string} id
   */ getById: async (id)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/v1/tasks/${id}`);
        return response.data;
    },
    /**
   * Create a new task.
   * @param {import("../types/task.types").CreateTaskDto} data
   */ create: async (data)=>{
        // Generate an idempotency key for safe retries
        const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/v1/tasks", data, {
            headers: {
                "Idempotency-Key": idempotencyKey
            }
        });
        return response.data;
    },
    /**
   * Update a task. Note: requires version for optimistic locking.
   * @param {number|string} id
   * @param {import("../types/task.types").UpdateTaskDto} data
   */ update: async (id, data)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/v1/tasks/${id}`, data);
        return response.data;
    },
    /**
   * Archive or unarchive a task.
   * @param {number|string} id
   * @param {boolean} isArchived
   */ archive: async (id, isArchived)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/v1/tasks/${id}/archive`, {
            isArchived
        });
        return response.data;
    },
    /**
   * Soft delete a task.
   * @param {number|string} id
   */ delete: async (id)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/v1/tasks/${id}`);
        return response.data;
    },
    /**
   * Restore a soft deleted task.
   * @param {number|string} id
   */ restore: async (id)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/v1/tasks/${id}/restore`);
        return response.data;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useEscapeKey.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useEscapeKey",
    ()=>useEscapeKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const escapeHandlers = [];
const handleKeyDown = (event)=>{
    if (event.key !== "Escape" || event.defaultPrevented || escapeHandlers.length === 0) {
        return;
    }
    const topHandler = escapeHandlers[escapeHandlers.length - 1];
    event.preventDefault();
    event.stopImmediatePropagation();
    topHandler();
};
function useEscapeKey(onEscape, enabled = true) {
    _s();
    const onEscapeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onEscape);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useEscapeKey.useEffect": ()=>{
            onEscapeRef.current = onEscape;
        }
    }["useEscapeKey.useEffect"], [
        onEscape
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useEscapeKey.useEffect": ()=>{
            if (!enabled) return;
            const handler = {
                "useEscapeKey.useEffect.handler": ()=>onEscapeRef.current?.()
            }["useEscapeKey.useEffect.handler"];
            escapeHandlers.push(handler);
            if (escapeHandlers.length === 1) {
                document.addEventListener("keydown", handleKeyDown);
            }
            return ({
                "useEscapeKey.useEffect": ()=>{
                    const handlerIndex = escapeHandlers.indexOf(handler);
                    if (handlerIndex !== -1) escapeHandlers.splice(handlerIndex, 1);
                    if (escapeHandlers.length === 0) {
                        document.removeEventListener("keydown", handleKeyDown);
                    }
                }
            })["useEscapeKey.useEffect"];
        }
    }["useEscapeKey.useEffect"], [
        enabled
    ]);
}
_s(useEscapeKey, "mKA418e/+oB9+rVFdgoUoBjdkdI=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useMonthlySalesTarget.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MONTHLY_TARGET_QUERY_KEY",
    ()=>MONTHLY_TARGET_QUERY_KEY,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useMonthlySalesTarget",
    ()=>useMonthlySalesTarget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$monthlyTarget$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/monthlyTarget.api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSalesRole$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSalesRole.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/socket.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const MONTHLY_TARGET_QUERY_KEY = [
    "monthly-sales-target"
];
function useMonthlySalesTarget() {
    _s();
    const { isSales, user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSalesRole$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSalesRole"])();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    // 1. Fetch current monthly target and real-time dynamically calculated stats
    const { data, isLoading, isFetching, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: MONTHLY_TARGET_QUERY_KEY,
        queryFn: {
            "useMonthlySalesTarget.useQuery": async ()=>{
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$monthlyTarget$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["monthlyTargetApi"].getCurrent();
                return res.data;
            }
        }["useMonthlySalesTarget.useQuery"],
        enabled: !!isSales && !!user,
        staleTime: 1000 * 30,
        refetchOnWindowFocus: true
    });
    // 2. Real-time Socket & Window Event Subscriptions
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useMonthlySalesTarget.useEffect": ()=>{
            if (!isSales || !user) return;
            const socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$socket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSocketInstance"])();
            const handleTargetUpdated = {
                "useMonthlySalesTarget.useEffect.handleTargetUpdated": (payload)=>{
                    console.log("[useMonthlySalesTarget] Target updated event received:", payload);
                    queryClient.invalidateQueries({
                        queryKey: MONTHLY_TARGET_QUERY_KEY
                    });
                }
            }["useMonthlySalesTarget.useEffect.handleTargetUpdated"];
            if (socket) {
                socket.on("sales-target:updated", handleTargetUpdated);
            }
            // Custom window event for local tab instantaneous synchronization
            const handleLocalContractChange = {
                "useMonthlySalesTarget.useEffect.handleLocalContractChange": ()=>{
                    console.log("[useMonthlySalesTarget] Local sales contract changed, refreshing target stats");
                    queryClient.invalidateQueries({
                        queryKey: MONTHLY_TARGET_QUERY_KEY
                    });
                }
            }["useMonthlySalesTarget.useEffect.handleLocalContractChange"];
            window.addEventListener("sales-contract-changed", handleLocalContractChange);
            return ({
                "useMonthlySalesTarget.useEffect": ()=>{
                    if (socket) {
                        socket.off("sales-target:updated", handleTargetUpdated);
                    }
                    window.removeEventListener("sales-contract-changed", handleLocalContractChange);
                }
            })["useMonthlySalesTarget.useEffect"];
        }
    }["useMonthlySalesTarget.useEffect"], [
        isSales,
        user,
        queryClient
    ]);
    // 3. Mutation to set target once (Locked permanently after save)
    const setTargetMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useMonthlySalesTarget.useMutation[setTargetMutation]": async ({ targetMT, month, year })=>{
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$monthlyTarget$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["monthlyTargetApi"].create({
                    targetMT,
                    month,
                    year
                });
                return res.data;
            }
        }["useMonthlySalesTarget.useMutation[setTargetMutation]"],
        onSuccess: {
            "useMonthlySalesTarget.useMutation[setTargetMutation]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: MONTHLY_TARGET_QUERY_KEY
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Monthly Target of ${data?.stats?.targetMT || ""} MT locked for ${data?.stats?.monthName || "this month"}.`);
            }
        }["useMonthlySalesTarget.useMutation[setTargetMutation]"],
        onError: {
            "useMonthlySalesTarget.useMutation[setTargetMutation]": (err)=>{
                const msg = err?.response?.data?.message || err?.message || "Failed to set monthly target.";
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(msg);
            }
        }["useMonthlySalesTarget.useMutation[setTargetMutation]"]
    });
    return {
        isSales,
        targetData: data?.target || null,
        stats: data?.stats || null,
        hasTarget: !!data?.hasTarget,
        isLoading: isLoading && isSales,
        isFetching,
        error,
        refetch,
        setTarget: setTargetMutation.mutateAsync,
        isSaving: setTargetMutation.isPending
    };
}
_s(useMonthlySalesTarget, "oADSa2/YDTS3u6vkDdQELbrmxA8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSalesRole$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSalesRole"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const __TURBOPACK__default__export__ = useMonthlySalesTarget;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/usePermissions.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "usePermissions",
    ()=>usePermissions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$authSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/slices/authSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$utils$2f$channelPosting$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/chat/utils/channelPosting.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
const normalizePermission = (permKey)=>{
    if (!permKey) return "";
    let perm = permKey.toLowerCase().trim();
    // Normalize dot-separated permissions (e.g. chat.group.rename -> chat_group:rename)
    if (perm.includes('.')) {
        perm = perm.replace(/\./g, ':');
    }
    if (perm.startsWith('chat:group:')) {
        perm = perm.replace('chat:group:', 'chat_group:');
    }
    let [resource, action] = perm.split(':');
    if (resource === 'tasks') {
        resource = 'task';
    }
    if (resource === 'categories') {
        resource = 'category';
    }
    if (resource === 'products') {
        resource = 'product';
    }
    if ([
        'partner_roles',
        'partnerroles',
        'partner-role',
        'partner_role'
    ].includes(resource)) {
        resource = 'partnerrole';
    }
    if ([
        'bag_specifications',
        'bag_specification',
        'bagspecs',
        'bagspec'
    ].includes(resource)) {
        resource = 'bagspec';
    }
    if (resource === 'partners') {
        resource = 'partner';
    }
    if (resource === 'enquiries') {
        resource = 'enquiry';
    }
    if ([
        'financialyear',
        'financial_year',
        'financial-years',
        'financial_years'
    ].includes(resource)) {
        resource = 'financial-year';
    }
    if ([
        'shipping-lines',
        'shippingline',
        'shipping_line'
    ].includes(resource)) {
        resource = 'shipping_lines';
    }
    if (resource === 'port') {
        resource = 'ports';
    }
    if ([
        'confirmed_order',
        'confirmed-order',
        'confirmed-orders'
    ].includes(resource)) {
        resource = 'confirmed_orders';
    }
    if (resource === 'sales-report') {
        resource = 'sales_report';
    }
    if (action === 'view') {
        action = 'read';
    }
    if (action === 'edit') {
        action = 'update';
    }
    if (resource === 'sales_contracts' || resource === 'sales_contract') {
        resource = 'sales-contract';
    }
    if (resource === 'follow-up' || resource === 'follow_ups') {
        resource = 'follow_up';
    }
    if (resource === 'manager' && action === 'approve_leave') {
        resource = 'leave';
        action = 'approve';
    }
    if (resource === 'employees') {
        if ([
            'upload_document',
            'upload'
        ].includes(action)) {
            resource = 'employee_documents';
            action = 'upload';
        } else if ([
            'view_document',
            'read_document'
        ].includes(action)) {
            resource = 'employee_documents';
            action = 'read';
        } else if ([
            'verify_document',
            'verify'
        ].includes(action)) {
            resource = 'employee_documents';
            action = 'verify';
        } else if ([
            'download_document',
            'download'
        ].includes(action)) {
            resource = 'employee_documents';
            action = 'download';
        } else if ([
            'delete_document'
        ].includes(action)) {
            resource = 'employee_documents';
            action = 'delete';
        } else if ([
            'assign_manager',
            'change_manager',
            'view_team',
            'view_hierarchy'
        ].includes(action)) {
            resource = 'employee_hierarchy';
        } else if ([
            'manage_lifecycle',
            'manage'
        ].includes(action)) {
            resource = 'employee_lifecycle';
            action = 'manage';
        }
    }
    return `${resource}:${action}`;
};
function usePermissions() {
    _s();
    const permissions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$authSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectUserPermissions"]);
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"])({
        "usePermissions.useSelector[user]": (state)=>state.auth.user
    }["usePermissions.useSelector[user]"]);
    const userType = user?.type;
    const normalizedUserPermissions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePermissions.useMemo[normalizedUserPermissions]": ()=>{
            return permissions?.map({
                "usePermissions.useMemo[normalizedUserPermissions]": (p)=>normalizePermission(p)
            }["usePermissions.useMemo[normalizedUserPermissions]"]) || [];
        }
    }["usePermissions.useMemo[normalizedUserPermissions]"], [
        permissions
    ]);
    const checkIsAdmin = ()=>{
        // 1. Check global userType
        if (userType) {
            const type = String(userType).toLowerCase().trim();
            if (type === "super_admin" || type === "client_admin" || type === "admin") return true;
        }
        // 2. Check workspace-level roles
        if (user?.workspaces && Array.isArray(user.workspaces)) {
            return user.workspaces.some((ws)=>{
                if (!ws.role || !ws.role.name) return false;
                const roleName = String(ws.role.name).toLowerCase().trim();
                return roleName === "client admin" || roleName === "admin" || roleName === "super admin";
            });
        }
        return false;
    };
    /**
   * Check if the user has a specific permission (e.g., 'employees:create')
   */ const hasPermission = (requiredPermission)=>{
        if (!requiredPermission) return true;
        if (checkIsAdmin()) return true;
        return normalizedUserPermissions.includes(normalizePermission(requiredPermission));
    };
    /**
   * Check if the user has ANY of the given permissions
   */ const hasAnyPermission = (requiredPermissions = [])=>{
        if (requiredPermissions.length === 0) return true;
        if (checkIsAdmin()) return true;
        return requiredPermissions.some((p)=>normalizedUserPermissions.includes(normalizePermission(p)));
    };
    /**
   * Check if the user has ALL of the given permissions
   */ const hasAllPermissions = (requiredPermissions = [])=>{
        if (requiredPermissions.length === 0) return true;
        if (checkIsAdmin()) return true;
        return requiredPermissions.every((p)=>normalizedUserPermissions.includes(normalizePermission(p)));
    };
    /**
   * Multi-layer validation for chat group actions
   * combines: general RBAC + conversation membership + conversation states + group role hierarchy
   */ const checkGroupPermission = (action, conversation, currentUser)=>{
        if (!conversation) return false;
        // Super/Client Admins bypass restrictions
        if (checkIsAdmin()) return true;
        // Check 1: User has general RBAC permission
        const permissionKey = action.includes(':') || action.includes('.') ? action : `chat_group:${action}`;
        if (!hasPermission(permissionKey)) return false;
        // DMs bypass group membership role rules, only check general RBAC
        if (conversation.type === "DIRECT") return true;
        // Check 2: Check if user is a member of the conversation group
        const members = conversation.members || [];
        const currentUserId = currentUser?.id || currentUser?.userId;
        const memberObj = members.find((m)=>{
            const mId = m.userId || m.user?.id;
            return Number(mId) === Number(currentUserId);
        });
        if (!memberObj) return false;
        // Check 3: Check conversation policies (frozen/archived status)
        const isFrozen = conversation.isLocked || conversation.isFrozen;
        const isArchived = conversation.isArchived;
        if ((isFrozen || isArchived) && [
            'rename',
            'change_photo',
            'change_description',
            'add_members',
            'remove_members',
            'promote_admin',
            'demote_admin',
            'delete',
            'manage_permissions',
            'manage_invite_link'
        ].includes(action)) {
            const userRole = memberObj.role;
            if (userRole !== 'OWNER' && userRole !== 'ADMIN') {
                return false;
            }
        }
        // Check 4: Check group role permission level (Owner, Admin, Moderator, Member, Guest)
        const userRole = memberObj.role || 'MEMBER';
        if (userRole === 'OWNER') return true;
        if (userRole === 'ADMIN') {
            if (action === 'delete') return false; // Only Owner can delete the entire group
            return true;
        }
        if (userRole === 'MODERATOR') {
            // Moderators can edit details, invite users, and remove members
            if ([
                'rename',
                'change_photo',
                'change_description',
                'add_members',
                'remove_members',
                'manage_invite_link'
            ].includes(action)) {
                return true;
            }
            return false;
        }
        if (userRole === 'MEMBER') {
            // Normal members can only leave the group
            if (action === 'leave') return true;
            return false;
        }
        if (userRole === 'GUEST') {
            return false; // Guests cannot perform any group edits or leave/add
        }
        return false;
    };
    /**
   * Check if the current user can post in a channel conversation.
   * Dual-layer: global RBAC (chat:create) + channel postingPolicy.
   *
   * @param {object} conversation — active conversation object
   * @returns {boolean}
   */ const checkChannelPostPermission = (conversation)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$chat$2f$utils$2f$channelPosting$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canUserPost"])(conversation, user, hasPermission);
    };
    return {
        permissions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        checkGroupPermission,
        checkChannelPostPermission
    };
}
_s(usePermissions, "onh7JK4wPJhq7V1a3lYjaoYz48I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"]
    ];
});
const __TURBOPACK__default__export__ = usePermissions;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useSalesRole.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useSalesRole",
    ()=>useSalesRole
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$authSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/slices/authSlice.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function useSalesRole() {
    _s();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$authSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectUser"]);
    const userType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$slices$2f$authSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectUserType"]);
    const isSales = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSalesRole.useMemo[isSales]": ()=>{
            if (!user) return false;
            // 1. Explicit admin user types are excluded
            const normalizedType = String(userType || user.type || "").toLowerCase().trim();
            if (normalizedType === "super_admin" || normalizedType === "client_admin" || normalizedType === "admin") {
                return false;
            }
            // 2. Check active workspace role
            const activeCompanyId = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("activeCompanyId") : "TURBOPACK unreachable";
            const workspaces = user.workspaces || [];
            const activeWorkspace = workspaces.find({
                "useSalesRole.useMemo[isSales]": (w)=>w.id?.toString() === activeCompanyId?.toString()
            }["useSalesRole.useMemo[isSales]"]) || workspaces[0];
            const activeRoleName = String(activeWorkspace?.role?.name || "").toLowerCase().trim();
            if (activeRoleName) {
                // Must strictly be sales
                return activeRoleName === "sales";
            }
            // 3. Fallback to user roles list
            const roles = user.roles || [];
            const hasSalesRole = roles.some({
                "useSalesRole.useMemo[isSales].hasSalesRole": (r)=>String(r.name || "").toLowerCase().trim() === "sales"
            }["useSalesRole.useMemo[isSales].hasSalesRole"]);
            const hasExcludedRole = roles.some({
                "useSalesRole.useMemo[isSales].hasExcludedRole": (r)=>{
                    const name = String(r.name || "").toLowerCase().trim();
                    return name === "admin" || name === "client admin" || name === "logistics" || name === "operations";
                }
            }["useSalesRole.useMemo[isSales].hasExcludedRole"]);
            return hasSalesRole && !hasExcludedRole;
        }
    }["useSalesRole.useMemo[isSales]"], [
        user,
        userType
    ]);
    return {
        isSales,
        user
    };
}
_s(useSalesRole, "v7qSMY0lVzaumm14Ptad8GbU02k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSelector"]
    ];
});
const __TURBOPACK__default__export__ = useSalesRole;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/axios.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "getAvatarUrl",
    ()=>getAvatarUrl,
    "getBackendUrl",
    ()=>getBackendUrl,
    "injectStore",
    ()=>injectStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$toast$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/toast.js [app-client] (ecmascript)");
;
let store;
const injectStore = (_store)=>{
    store = _store;
};
const getBackendUrl = ()=>{
    if ("TURBOPACK compile-time truthy", 1) {
        return ("TURBOPACK compile-time value", "http://localhost:5000/api").replace(/\/api\/?$/, "");
    }
    //TURBOPACK unreachable
    ;
};
const getAvatarUrl = (url)=>{
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) return url;
    const baseUrl = getBackendUrl();
    let path = url.startsWith("/") ? url : "/" + url;
    if (path.startsWith("/attachments/") && !path.startsWith("/api/")) {
        path = "/api" + path;
    }
    if (path.includes("/attachments/")) {
        const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("accessToken") : "TURBOPACK unreachable";
        if (token) {
            const separator = path.includes("?") ? "&" : "?";
            path = `${path}${separator}token=${encodeURIComponent(token)}`;
        }
    }
    return `${baseUrl}${path}`;
};
const BASE_URL = ("TURBOPACK compile-time value", "http://localhost:5000/api") || "http://localhost:5000/api";
const axiosClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    paramsSerializer: {
        serialize: function(params) {
            const searchParams = new URLSearchParams();
            for (const key of Object.keys(params)){
                const val = params[key];
                if (Array.isArray(val)) {
                    val.forEach((v)=>searchParams.append(key, v));
                } else if (val !== undefined && val !== null) {
                    searchParams.append(key, val);
                }
            }
            return searchParams.toString();
        }
    }
});
// Request interceptor — attach Bearer token and activeCompanyId
axiosClient.interceptors.request.use((config)=>{
    if ("TURBOPACK compile-time truthy", 1) {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        let activeCompanyId = null;
        if ("TURBOPACK compile-time truthy", 1) {
            activeCompanyId = localStorage.getItem("activeCompanyId");
        }
        if (!activeCompanyId && store) {
            activeCompanyId = store.getState().companyContext?.activeCompanyId;
        }
        if (store) {
            const state = store.getState();
            const user = state.auth?.user;
            // Fallback: if no activeCompanyId in localStorage, try user's own companyId
            if (!activeCompanyId && user?.lastCompanyId) {
                activeCompanyId = user.lastCompanyId.toString();
            }
            if (!activeCompanyId && user?.companyId) {
                activeCompanyId = user.companyId.toString();
            }
            // If we have an ID and user is NOT super_admin, validate workspace access
            if (activeCompanyId && user && user.type !== "super_admin") {
                const workspaces = user.workspaces || [];
                const hasAccess = workspaces.some((w)=>w.id.toString() === activeCompanyId.toString());
                if (!hasAccess) {
                    if (workspaces.length > 0) {
                        activeCompanyId = workspaces[0].id.toString();
                        localStorage.setItem("activeCompanyId", activeCompanyId);
                    } else {
                        activeCompanyId = null;
                        localStorage.removeItem("activeCompanyId");
                    }
                }
            }
        }
        if (activeCompanyId) {
            config.headers["x-company-id"] = activeCompanyId;
        }
    }
    return config;
}, (error)=>Promise.reject(error));
;
// Silent Refresh state variables
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null)=>{
    failedQueue.forEach((prom)=>{
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};
// Response interceptor — on 401, perform silent refresh with refresh token
axiosClient.interceptors.response.use((response)=>response, async (error)=>{
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isCancel(error)) {
        return Promise.reject(error);
    }
    const originalRequest = error.config;
    const isBackgroundPolling = originalRequest?.url?.includes("/chat/unread/total");
    const isRefreshable401 = error.response?.status === 401 && !originalRequest?._retry && !originalRequest?.url?.includes("/auth/login") && !originalRequest?.url?.includes("/auth/refresh");
    // Distinguish handled business rule responses (e.g. Freight Required = NO) from system errors
    const rawErrorMsg = error.response?.data?.message || error.response?.data?.error || "";
    const errorMsgStr = (Array.isArray(rawErrorMsg) ? rawErrorMsg.join(" ") : String(rawErrorMsg)).toLowerCase();
    const isHandledBusinessRule = Boolean(originalRequest?.isHandledBusinessRule) || error.response?.status === 400 && (errorMsgStr.includes("freight is not required") || errorMsgStr.includes("freight required = no") || errorMsgStr.includes("freight not required") || errorMsgStr.includes("transport management is not available for shipment") || errorMsgStr.includes("transport not available because freight"));
    const shouldLogConsole = !isRefreshable401 && !isBackgroundPolling && !isHandledBusinessRule && !originalRequest?.suppressErrorLog && error.response?.status !== 404;
    if (shouldLogConsole) {
        if (error.response) {
            console.error("[Axios Error]", originalRequest?.url, error.response.status, error.response.data);
        } else if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isCancel(error)) {
            console.error("[Axios Error]", originalRequest?.url, error.message || error);
        }
    }
    // Gracefully handle expected business rule responses without throwing Axios runtime error
    if (isHandledBusinessRule) {
        return Promise.resolve({
            data: {
                success: false,
                isBusinessRule: true,
                freightRequired: false,
                message: Array.isArray(rawErrorMsg) ? rawErrorMsg.join(" ") : String(rawErrorMsg || "Freight is not required for this shipment."),
                statusCode: error.response?.status || 400,
                originalError: error
            },
            status: 200,
            statusText: "OK",
            headers: error.response?.headers || {},
            config: originalRequest
        });
    }
    if ("TURBOPACK compile-time truthy", 1) {
        if (error.response?.status === 401 && !originalRequest?._retry && !originalRequest?.url?.includes("/auth/login")) {
            // Prevent infinite loop if refresh endpoint itself returns 401
            if (originalRequest.url?.includes("/auth/refresh")) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
                return Promise.reject(error);
            }
            if (isRefreshing) {
                return new Promise((resolve, reject)=>{
                    failedQueue.push({
                        resolve,
                        reject
                    });
                }).then((token)=>{
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axiosClient(originalRequest);
                }).catch((err)=>{
                    return Promise.reject(err);
                });
            }
            originalRequest._retry = true;
            isRefreshing = true;
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
                isRefreshing = false;
                return Promise.reject(error);
            }
            try {
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${originalRequest.baseURL || BASE_URL}/auth/refresh`, {
                    refreshToken
                });
                const { accessToken, refreshToken: newRefreshToken } = res.data;
                localStorage.setItem("accessToken", accessToken);
                if (newRefreshToken) {
                    localStorage.setItem("refreshToken", newRefreshToken);
                }
                axiosClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
                originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
                processQueue(null, accessToken);
                isRefreshing = false;
                return axiosClient(originalRequest);
            } catch (err) {
                processQueue(err, null);
                isRefreshing = false;
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }
        // Extract error message from standard backend DTO or fallback
        const message = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred.";
        const isConversations403 = error.response?.status === 403 && originalRequest?.url?.includes("/conversations");
        // Don't toast 404s globally if they are expected (optional), but for enterprise usually we toast 4xx and 5xx
        // Also ignore 401s here to prevent displaying error messages to users when silent refresh is about to occur
        if (error.response?.status >= 400 && error.response?.status !== 404 && error.response?.status !== 401 && !isConversations403) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$toast$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(message);
        } else if (error.message === "Network Error" && !isBackgroundPolling) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$toast$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Network connection lost. Please check your internet connection.");
        }
    }
    return Promise.reject(error);
});
const __TURBOPACK__default__export__ = axiosClient;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/notificationRouter.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Centralized Notification Router
 * ================================
 * Owns ALL routing logic for notification deep-links.
 * Backend only sends: referenceType, referenceId, entityType, entityId, payload.
 * This file decides where to navigate.
 *
 * Adding a new notification type?
 *  → Add a single entry to ROUTE_MAPPERS below. That's it.
 */ /**
 * Route mapper: entityType → function(notification) → URL string
 *
 * Each function receives the full notification object so it can use
 * entityId, payload.tab, payload.highlight, etc.
 *
 * Rules:
 *  - Keep routes as close to existing Next.js pages as possible.
 *  - Use query params to pass context (requestId, partnerId, enquiryId).
 *  - Never generate absolute URLs — always relative paths.
 */ __turbopack_context__.s([
    "ROUTE_MAPPERS",
    ()=>ROUTE_MAPPERS,
    "createNotificationClickHandler",
    ()=>createNotificationClickHandler,
    "resolveNotificationUrl",
    ()=>resolveNotificationUrl
]);
const ROUTE_MAPPERS = {
    // ── Leave Notifications ──────────────────────────────────────────────────
    /**
   * Leave request submitted by an employee → goes to approvals page
   * (Managers / HR see this)
   */ LEAVE_REQUEST: (notif)=>{
        const id = notif.entityId;
        // If referenceType is leave_approved or leave_rejected or leave_cancelled,
        // the employee should see their own leaves, not the approvals list.
        const rt = (notif.referenceType || '').toLowerCase();
        if (rt === 'leave_approved' || rt === 'leave_rejected' || rt === 'leave_cancelled') {
            return id ? `/my-leaves?requestId=${id}` : '/my-leaves';
        }
        // leave_applied → approvals page for the approver
        return id ? `/leave-approvals?requestId=${id}` : '/leave-approvals';
    },
    // ── Task Notifications ────────────────────────────────────────────────────
    /** Task assigned / updated / completed → task detail page */ TASK: (notif)=>{
        const id = notif.entityId;
        return id ? `/tasks?preset=my_tasks&taskId=${id}` : '/tasks?preset=my_tasks';
    },
    // ── Holiday Notifications ─────────────────────────────────────────────────
    /** Holiday announced → holidays calendar page */ HOLIDAY: ()=>'/holidays',
    // ── Attendance Notifications ──────────────────────────────────────────────
    /** Check-in / check-out reminder → attendance page */ ATTENDANCE_REMINDER: ()=>'/attendance',
    /** Attendance conflict (e.g., checked in on a leave day) → attendance page */ ATTENDANCE_CONFLICT: ()=>'/attendance',
    // ── Chat / Message Notifications ───────────────────────────────────────────
    /** New chat message received → navigate to chat page or open active conversation */ MESSAGE: (notif)=>{
        const id = notif.entityId || notif.payload?.conversationId;
        return id ? `/chat?conversationId=${id}` : '/chat';
    },
    CHAT_MESSAGE: (notif)=>{
        const id = notif.entityId || notif.payload?.conversationId;
        return id ? `/chat?conversationId=${id}` : '/chat';
    },
    CHAT: (notif)=>{
        const id = notif.entityId || notif.payload?.conversationId;
        return id ? `/chat?conversationId=${id}` : '/chat';
    },
    // ── Chat / Follow-up Notifications ───────────────────────────────────────
    /**
   * New follow-up added on an enquiry → enquiries list with drawer auto-open.
   * The EnquiriesListPage reads `enquiryId` from query and auto-opens the drawer.
   */ ENQUIRY_CHAT: (notif)=>{
        const id = notif.entityId;
        return id ? `/enquiries?enquiryId=${id}` : '/enquiries';
    },
    /**
   * New follow-up added on a partner → partners list with drawer auto-open.
   * The PartnersPage reads `partnerId` from query and auto-opens the drawer.
   */ PARTNER_CHAT: (notif)=>{
        const id = notif.entityId;
        return id ? `/masters/partners?partnerId=${id}` : '/masters/partners';
    },
    // ── Transport Notifications ───────────────────────────────────────────────
    TRANSPORT_NEW_ENQUIRY: (notif)=>{
        const id = notif.payload?.enquiryId || notif.entityId;
        return id && id !== 0 ? `/logistics/transport-management?enquiryId=${id}` : `/logistics/transport-management`;
    }
};
function resolveNotificationUrl(notification) {
    const entityType = notification.entityType?.toUpperCase?.() || '';
    const mapper = ROUTE_MAPPERS[entityType];
    if (!mapper) {
        console.warn(`[notificationRouter] No route mapper found for entityType: "${entityType}". Falling back to "/".`);
        // Graceful fallback: if payload has a url, use it (legacy support)
        return notification.payload?.url || '/';
    }
    try {
        return mapper(notification);
    } catch (err) {
        console.error(`[notificationRouter] Error resolving route for entityType: "${entityType}"`, err);
        return '/';
    }
}
function createNotificationClickHandler(dispatch, router, markNotificationRead, onClose) {
    return async function handleNotificationClick(notification) {
        // Step 1: Mark as read (fire-and-forget; don't block navigation)
        if (!notification.isRead) {
            dispatch(markNotificationRead(notification.id));
        }
        // Step 2: Resolve target URL
        const url = resolveNotificationUrl(notification);
        // Step 3: Close the dropdown first (better UX)
        if (typeof onClose === 'function') {
            onClose();
        }
        // Step 4: Navigate
        router.push(url);
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/socket.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectSocket",
    ()=>connectSocket,
    "disconnectSocket",
    ()=>disconnectSocket,
    "getSocketInstance",
    ()=>getSocketInstance,
    "subscribeToSocketEvent",
    ()=>subscribeToSocketEvent,
    "unsubscribeFromSocketEvent",
    ()=>unsubscribeFromSocketEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/socket.io-client/build/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.js [app-client] (ecmascript)");
;
;
// ─── Singleton socket instance ────────────────────────────────────────────────
// Only ONE Socket.IO client ever exists at a time.
// connectSocket() is the sole place that creates a new client.
let socket = null;
// ─── Diagnostics (dev-only) ───────────────────────────────────────────────────
let _connectCount = 0;
const _logDiagnostics = (label)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const listenerMap = socket ? socket.listeners?.bind(socket) : null;
    const eventNames = socket?._callbacks ? Object.keys(socket._callbacks) : [];
    console.log(`[Socket:Diagnostics] ${label} | connectCount=${_connectCount} | socket=${socket ? "ALIVE" : "NULL"} | events=[${eventNames.join(",")}]`);
};
// Named module-level handlers so they can be precisely removed on each teardown.
// These are re-assigned each connectSocket() call to the new socket so they
// always reference the correct socket in their closure.
let _handleConnect = null;
let _handleDisconnect = null;
let _handleConnectError = null;
const connectSocket = (companyId)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Tear down previous connection cleanly.
    if (socket) {
        // Remove the module-level handlers we added on the PREVIOUS socket instance.
        if (_handleConnect) socket.off("connect", _handleConnect);
        if (_handleDisconnect) socket.off("disconnect", _handleDisconnect);
        if (_handleConnectError) socket.off("connect_error", _handleConnectError);
        socket.disconnect();
        socket = null;
    }
    _connectCount++;
    console.log(`[Socket] Creating connection #${_connectCount} for companyId=${companyId}`);
    socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBackendUrl"])(), {
        auth: (cb)=>{
            const currentToken = localStorage.getItem("accessToken");
            cb({
                token: currentToken || "",
                companyId: companyId ? companyId.toString() : ""
            });
        },
        transports: [
            "websocket"
        ],
        autoConnect: true
    });
    // Assign new named handler closures bound to this socket's context.
    _handleConnect = ()=>{
        console.log("[Socket] Connected.");
        _logDiagnostics("connect");
    };
    _handleDisconnect = (reason)=>{
        console.log(`[Socket] Disconnected: ${reason}`);
        _logDiagnostics("disconnect");
    };
    _handleConnectError = (error)=>{
        console.warn(`[Socket] Connection error: ${error.message}`);
    };
    socket.on("connect", _handleConnect);
    socket.on("disconnect", _handleDisconnect);
    socket.on("connect_error", _handleConnectError);
    _logDiagnostics("connectSocket done");
    return socket;
};
const disconnectSocket = ()=>{
    if (!socket) return;
    console.log(`[Socket] Disconnecting socket #${_connectCount}`);
    // Remove the module-level handlers before disconnect so they don't fire during teardown.
    if (_handleConnect) socket.off("connect", _handleConnect);
    if (_handleDisconnect) socket.off("disconnect", _handleDisconnect);
    if (_handleConnectError) socket.off("connect_error", _handleConnectError);
    _handleConnect = null;
    _handleDisconnect = null;
    _handleConnectError = null;
    // removeAllListeners() ensures any consumer-registered handlers that missed
    // their own cleanup are not retained as GC roots.
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    _logDiagnostics("disconnectSocket done");
};
const getSocketInstance = ()=>socket;
const subscribeToSocketEvent = (event, callback)=>{
    if (socket) {
        socket.on(event, callback);
    } else {
        console.warn(`[Socket] subscribeToSocketEvent("${event}") called before socket is ready.`);
    }
};
const unsubscribeFromSocketEvent = (event, callback)=>{
    if (!socket) return;
    if (callback === undefined) {
        socket.removeAllListeners(event);
    } else {
        socket.off(event, callback);
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/toast.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "toast",
    ()=>toast
]);
"use client";
function getSonnerToast() {
    if ("TURBOPACK compile-time truthy", 1) {
        try {
            return __turbopack_context__.r("[project]/node_modules/sonner/dist/index.js [app-client] (ecmascript)").toast;
        } catch (e) {
            return null;
        }
    }
    return null;
}
const toast = {
    success: (msg, opts)=>{
        const st = getSonnerToast();
        if (st) return st.success(msg, opts);
        console.log("✔ [Toast Success]", msg);
    },
    error: (msg, opts)=>{
        const st = getSonnerToast();
        if (st) return st.error(msg, opts);
        console.error("✖ [Toast Error]", msg);
    },
    info: (msg, opts)=>{
        const st = getSonnerToast();
        if (st) return st.info(msg, opts);
        console.info("ℹ [Toast Info]", msg);
    },
    warning: (msg, opts)=>{
        const st = getSonnerToast();
        if (st) return st.warning(msg, opts);
        console.warn("⚠️ [Toast Warning]", msg);
    }
};
const __TURBOPACK__default__export__ = toast;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/clipboard.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Cross-environment clipboard copy utility.
 * Falls back to execCommand for HTTP (non-secure) contexts where
 * the navigator.clipboard API is unavailable.
 *
 * @param {string} text - The text to copy to the clipboard.
 * @returns {Promise<void>}
 */ __turbopack_context__.s([
    "copyToClipboard",
    ()=>copyToClipboard
]);
async function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
    } else {
        // Fallback for non-secure contexts (HTTP) or unsupported browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const success = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!success) throw new Error("execCommand copy failed");
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_1b-jbpn._.js.map