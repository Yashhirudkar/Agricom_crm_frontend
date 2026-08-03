import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatAPI } from "@/api/chat.api";
import { CHAT_QUERY_KEYS } from "../constants/query-keys";

// Create a new conversation channel/DM
export const useCreateConversationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto) => ChatAPI.createConversation(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
    },
  });
};

// Send message mutation (designed to run optimistically)
export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, dto }) => ChatAPI.sendMessage(conversationId, dto),
    onSuccess: (data, { conversationId }) => {
      // Invalidate queries so history refreshes with correct database ID
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(conversationId) });
    },
  });
};

// Edit message mutation
export const useEditMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, messageId, content }) =>
      ChatAPI.editMessage(conversationId, messageId, content),
    onSuccess: (data, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(conversationId) });
    },
  });
};

// Delete message mutation
export const useDeleteMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, messageId, mode }) =>
      ChatAPI.deleteMessage(conversationId, messageId, mode),
    onSuccess: (data, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(conversationId) });
    },
  });
};

// React to message mutation
export const useReactMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, messageId, reaction }) =>
      ChatAPI.reactToMessage(conversationId, messageId, reaction),
    onSuccess: (data, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(conversationId) });
    },
  });
};

// Vote on a poll
export const useVotePollMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pollId, optionIds }) => ChatAPI.votePoll(pollId, optionIds),
    onSuccess: (data, { conversationId }) => {
      if (conversationId) {
        queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(conversationId) });
      }
    },
  });
};

// Pin message
export const usePinMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, messageId }) => ChatAPI.pinMessage(conversationId, messageId),
    onSuccess: (data, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(conversationId) });
    },
  });
};

// Unpin message
export const useUnpinMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, messageId }) => ChatAPI.unpinMessage(conversationId, messageId),
    onSuccess: (data, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(conversationId) });
    },
  });
};

// Save local conversation draft to server (throttled/autosaved)
export const useSaveDraftMutation = () => {
  return useMutation({
    mutationFn: ({ conversationId, draftContent }) => ChatAPI.saveDraft(conversationId, draftContent),
  });
};
