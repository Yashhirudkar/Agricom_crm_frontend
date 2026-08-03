import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { ChatAPI } from "@/api/chat.api";
import { CHAT_QUERY_KEYS } from "../constants/query-keys";

// Fetch list of conversations
export const useConversationsQuery = (filters) => {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.conversationList(filters),
    queryFn: () => ChatAPI.getConversations(filters),
    staleTime: 1000 * 10, // 10s stale time
  });
};

// Fetch specific conversation details
export const useConversationDetailQuery = (conversationId) => {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.conversationDetail(conversationId),
    queryFn: () => ChatAPI.getConversationById(conversationId),
    enabled: !!conversationId,
  });
};

// Fetch messages with infinite scrolling (cursor-based pagination matching backend)
export const useMessagesQuery = (conversationId, limit = 50) => {
  return useInfiniteQuery({
    queryKey: CHAT_QUERY_KEYS.messages(conversationId),
    queryFn: ({ pageParam }) =>
      ChatAPI.getMessageHistory(conversationId, { cursor: pageParam, limit }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      // Backend returns: { data: [...], meta: { nextCursor, hasMore } }
      // nextCursor is the oldest message ID in this batch (used to fetch the page BEFORE it)
      const meta = lastPage?.meta;
      return meta?.hasMore ? meta?.nextCursor : null;
    },
    enabled: !!conversationId,
    staleTime: Infinity, // Keep messages stale in memory; real-time socket updates maintain accuracy
  });
};

// Fetch scheduled messages
export const useScheduledMessagesQuery = (conversationId) => {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.scheduledMessages(conversationId),
    queryFn: () => ChatAPI.getScheduledMessages(conversationId),
    enabled: !!conversationId,
  });
};

// Fetch policy settings
export const useChatPolicyQuery = () => {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.policy(),
    queryFn: () => ChatAPI.getPolicy(),
    staleTime: 1000 * 60 * 60, // 1 hour cached policy
  });
};

// Fetch labels list
export const useChatLabelsQuery = () => {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.labels(),
    queryFn: () => ChatAPI.getLabels(),
    staleTime: 1000 * 60 * 5, // 5 minutes cached labels
  });
};
