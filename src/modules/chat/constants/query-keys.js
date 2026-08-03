export const CHAT_QUERY_KEYS = {
  all: ["chat"],
  conversations: () => [...CHAT_QUERY_KEYS.all, "conversations"],
  conversationList: (filters) => [...CHAT_QUERY_KEYS.conversations(), "list", filters],
  conversationDetail: (id) => [...CHAT_QUERY_KEYS.conversations(), "detail", id],
  messages: (conversationId) => [...CHAT_QUERY_KEYS.all, "messages", conversationId],
  threads: (parentId) => [...CHAT_QUERY_KEYS.all, "threads", parentId],
  scheduledMessages: (conversationId) => [...CHAT_QUERY_KEYS.all, "scheduled", conversationId],
  labels: () => [...CHAT_QUERY_KEYS.all, "labels"],
  policy: () => [...CHAT_QUERY_KEYS.all, "policy"],
};
