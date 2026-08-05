"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { ChatAPI } from "@/api/chat.api";
import { getSocketInstance, subscribeToSocketEvent, unsubscribeFromSocketEvent } from "@/lib/socket";
import { selectUser } from "@/store/slices/authSlice";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
import { CHAT_QUERY_KEYS } from "@/modules/chat/constants/query-keys";
import {
  useConversationsQuery,
  useConversationDetailQuery,
  useMessagesQuery,
} from "@/modules/chat/queries/chat.queries";
import {
  useCreateConversationMutation,
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useReactMessageMutation,
  usePinMessageMutation,
  useUnpinMessageMutation,
  useStarMessageMutation,
  useUnstarMessageMutation,
} from "@/modules/chat/mutations/chat.mutations";
import {
  setActiveConversationId,
  setActiveThreadId,
  setComposerDraft,
  setRightPanelTab,
  setTypingUsers,
  addToUploadQueue,
  updateUploadProgress,
  setUploadStatus,
  removeFromUploadQueue,
  addToOptimisticQueue,
  setOptimisticStatus,
  removeFromOptimisticQueue,
  selectActiveConversationId,
  selectActiveThreadId,
  selectComposerDrafts,
  selectRightPanelTab,
  selectOptimisticQueue,
  selectUploadQueue,
  selectSocketStatus,
} from "@/modules/chat/store/chatSlice";

import axiosClient from "@/lib/axios";
import { getConversationDisplay } from "@/modules/chat/utils/getConversationDisplay";
import usePermissions from "@/hooks/usePermissions";
import CreateConversationModal from "@/modules/chat/components/Common/CreateConversationModal";
import { getChannelHeaderSuffix } from "@/modules/chat/utils/channelPosting";

// Sub-components (same chat folder)
import ChatSidebar from "./ChatSidebar";
import ChatMainPanel from "./ChatMainPanel";
import ChatRightPanel from "./ChatRightPanel";

export default function ChatPage() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // Selectors
  const user = useSelector(selectUser);
  const companyId = useSelector(selectActiveCompanyId);
  const activeConversationId = useSelector(selectActiveConversationId);
  const activeThreadId = useSelector(selectActiveThreadId);
  const rightPanelTab = useSelector(selectRightPanelTab);
  const socketStatus = useSelector(selectSocketStatus);
  const optimisticQueue = useSelector(selectOptimisticQueue);
  const uploadQueue = useSelector(selectUploadQueue);
  const composerDrafts = useSelector(selectComposerDrafts);

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [composerInput, setComposerInput] = useState("");
  const [employeeLookup, setEmployeeLookup] = useState({});
  const [presenceMap, setPresenceMap] = useState({});
  const [typingUsersMap, setTypingUsersMap] = useState({});
  const employeeLookupRef = useRef(employeeLookup);
  const typingTimeoutRef = useRef(null);
  const activeUploadControllers = useRef(new Map());
  const [showSidebarMobile, setShowSidebarMobile] = useState(true);
  const [editingMessage, setEditingMessage] = useState(null);
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [loadingPinned, setLoadingPinned] = useState(false);
  const [starredMessages, setStarredMessages] = useState([]);
  const [loadingStarred, setLoadingStarred] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [erpDetail, setErpDetail] = useState(null);
  const [loadingErp, setLoadingErp] = useState(false);
  // Sticky pinned banner — latest pinned message for the active conversation
  const [activePinnedMessage, setActivePinnedMessage] = useState(null);

  // Sync mobile view on active chat changes
  useEffect(() => {
    if (activeConversationId) {
      setShowSidebarMobile(false);
    } else {
      setShowSidebarMobile(true);
    }
  }, [activeConversationId]);

  // Clean up composer input, editing state, replying state, and right panel tab on conversation switch/deletion
  useEffect(() => {
    setComposerInput("");
    setEditingMessage(null);
    setReplyingToMessage(null);
    dispatch(setRightPanelTab(null));
  }, [activeConversationId, dispatch]);

  // Abort active uploads and typing timeouts on conversation switch/unmount
  useEffect(() => {
    return () => {
      activeUploadControllers.current.forEach((controller) => {
        controller.abort();
      });
      activeUploadControllers.current.clear();

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [activeConversationId]);

  // ESC keypress listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setEditingMessage(null);
        setReplyingToMessage(null);
        dispatch(setRightPanelTab(null));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  // ── Fetch pinned banner message whenever the active conversation changes ──
  // (separate from the right-panel pins list which loads on panel open)
  const fetchActivePinned = async (convId) => {
    if (!convId) { setActivePinnedMessage(null); return; }
    try {
      const res = await ChatAPI.getPinnedMessages(convId);
      const pins = res || [];
      // Show the most recently pinned message (last in array)
      setActivePinnedMessage(pins.length > 0 ? pins[pins.length - 1] : null);
    } catch (err) {
      console.error("Failed to fetch active pinned message", err);
      setActivePinnedMessage(null);
    }
  };

  useEffect(() => {
    fetchActivePinned(activeConversationId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversationId]);

  // Fetch pinned messages when Pinned tab opens (right panel)
  useEffect(() => {
    if (rightPanelTab !== "PINNED_MESSAGES" || !activeConversationId) {
      setPinnedMessages([]);
      return;
    }
    const loadPins = async () => {
      setLoadingPinned(true);
      try {
        const res = await ChatAPI.getPinnedMessages(activeConversationId);
        setPinnedMessages(res || []);
      } catch (err) {
        console.error("Failed to load pinned messages", err);
      } finally {
        setLoadingPinned(false);
      }
    };
    loadPins();
  }, [rightPanelTab, activeConversationId]);

  // Fetch starred messages when Starred tab opens
  useEffect(() => {
    if (rightPanelTab !== "STARRED_MESSAGES") {
      setStarredMessages([]);
      return;
    }
    const loadStars = async () => {
      setLoadingStarred(true);
      try {
        const res = await ChatAPI.getStarredMessages();
        setStarredMessages(res || []);
      } catch (err) {
        console.error("Failed to load starred messages", err);
      } finally {
        setLoadingStarred(false);
      }
    };
    loadStars();
  }, [rightPanelTab]);

  // Check permissions
  const { hasPermission, checkChannelPostPermission } = usePermissions();
  const canReadEmployees = hasPermission("employees:read");
  const canReadDepartments = hasPermission("departments:read");
  const canReadDesignations = hasPermission("designations:read");

  // Load employee details lookup
  useEffect(() => {
    const fetchLookup = async () => {
      if (!canReadEmployees) {
        try {
          const assignableRes = await axiosClient.get("/v1/tasks/employees/assignable");
          const assignableList = assignableRes.data?.data || [];

          let depts = [];
          let desigs = [];
          if (canReadDepartments) {
            try {
              const dRes = await axiosClient.get("/departments/options", { params: { limit: 250 } });
              depts = dRes.data?.data || dRes.data || [];
            } catch (e) {}
          }
          if (canReadDesignations) {
            try {
              const dsRes = await axiosClient.get("/designations/options", { params: { limit: 250 } });
              desigs = dsRes.data?.data || dsRes.data || [];
            } catch (e) {}
          }

          const deptMap = Object.fromEntries(depts.map(d => [d.value, d.label]));
          const desigMap = Object.fromEntries(desigs.map(d => [d.value, d.label]));

          const map = {};
          assignableList.forEach(emp => {
            if (emp.userId) {
              map[emp.userId] = {
                name: `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || emp.user?.name,
                department: deptMap[emp.departmentId] || "Staff",
                designation: desigMap[emp.designationId] || "Employee"
              };
            }
          });
          setEmployeeLookup(map);
        } catch (e) {
          console.error("Fallback lookup failed", e);
        }
        return;
      }

      try {
        const res = await axiosClient.get("/employees", { params: { limit: 500 } });
        const list = res.data?.data || res.data || [];
        const map = {};
        list.forEach(emp => {
          if (emp.userId) {
            map[emp.userId] = {
              name: `${emp.firstName || ""} ${emp.lastName || ""}`.trim(),
              department: emp.department?.name || "Staff",
              designation: emp.designation?.name || "Employee"
            };
          }
        });
        setEmployeeLookup(map);
      } catch (err) {
        console.warn("Lookup build failed, trying assignable fallback...", err);
        try {
          const assignableRes = await axiosClient.get("/v1/tasks/employees/assignable");
          const assignableList = assignableRes.data?.data || [];

          let depts = [];
          let desigs = [];
          if (canReadDepartments) {
            try {
              const dRes = await axiosClient.get("/departments/options", { params: { limit: 250 } });
              depts = dRes.data?.data || dRes.data || [];
            } catch (e) {}
          }
          if (canReadDesignations) {
            try {
              const dsRes = await axiosClient.get("/designations/options", { params: { limit: 250 } });
              desigs = dsRes.data?.data || dsRes.data || [];
            } catch (e) {}
          }

          const deptMap = Object.fromEntries(depts.map(d => [d.value, d.label]));
          const desigMap = Object.fromEntries(desigs.map(d => [d.value, d.label]));

          const map = {};
          assignableList.forEach(emp => {
            if (emp.userId) {
              map[emp.userId] = {
                name: `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || emp.user?.name,
                department: deptMap[emp.departmentId] || "Staff",
                designation: desigMap[emp.designationId] || "Employee"
              };
            }
          });
          setEmployeeLookup(map);
        } catch (e) {
          console.error("Fallback lookup failed", e);
        }
      }
    };
    fetchLookup();
  }, [canReadEmployees, canReadDepartments, canReadDesignations]);

  useEffect(() => {
    employeeLookupRef.current = employeeLookup;
  }, [employeeLookup]);

  const activeConversationIdRef = useRef(activeConversationId);
  const userRef = useRef(user);

  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Real-time socket event listeners
  useEffect(() => {
    const handleMessageCreated = (payload) => {
      if (payload?.conversationId) {
        queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(payload.conversationId) });
        queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
      }
    };

    const handleMessageUpdated = (payload) => {
      if (payload?.conversationId) {
        queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(payload.conversationId) });
      }
    };

    const handleMessageDeleted = (payload) => {
      if (payload?.conversationId) {
        queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(payload.conversationId) });
        queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
      }
    };

    const handleMessagePinned = (payload) => {
      if (payload?.conversationId) {
        queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(payload.conversationId) });
      }
    };

    const handlePresenceChanged = (payload) => {
      if (payload?.userId) {
        setPresenceMap(prev => ({
          ...prev,
          [payload.userId]: {
            status: payload.status,
            lastSeen: payload.lastSeen
          }
        }));
      }
    };

    const handleTyping = (payload) => {
      const { conversationId, userId, isTyping } = payload;
      if (!conversationId || !userId) return;

      setTypingUsersMap(prev => {
        const list = prev[conversationId] || [];
        let newList = [...list];
        if (isTyping) {
          if (!newList.some(u => u.userId === userId)) {
            const emp = employeeLookupRef.current[userId] || {};
            newList.push({ userId, name: emp.name || "Someone" });
          }
        } else {
          newList = newList.filter(u => u.userId !== userId);
        }

        Promise.resolve().then(() => {
          dispatch(setTypingUsers({ conversationId, users: newList }));
        });

        return {
          ...prev,
          [conversationId]: newList,
        };
      });
    };

    const handleConversationCreated = (payload) => {
      const newConv = payload?.conversation;
      if (!newConv) return;

      const currentUserId = userRef.current?.id || userRef.current?.userId;
      const isMember = newConv.members?.some(m => Number(m.userId) === Number(currentUserId));
      const isPublicChannel = newConv.type === "CHANNEL";

      if (isMember || isPublicChannel) {
        queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
      }
    };

    const handleMemberAdded = (payload) => {
      const currentUserId = userRef.current?.id || userRef.current?.userId;
      if (payload?.member?.userId && Number(payload.member.userId) === Number(currentUserId)) {
        queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
      } else {
        if (payload?.conversationId) {
          queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversationDetail(Number(payload.conversationId)) });
          queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
        }
      }
    };

    const handleMemberRemoved = (payload) => {
      const currentUserId = userRef.current?.id || userRef.current?.userId;
      if (payload?.userId && Number(payload.userId) === Number(currentUserId)) {
        queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
        if (Number(activeConversationIdRef.current) === Number(payload.conversationId)) {
          dispatch(setActiveConversationId(null));
        }
      } else {
        if (payload?.conversationId) {
          queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversationDetail(Number(payload.conversationId)) });
          queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
        }
      }
    };

    const handleMessageReacted = (payload) => {
      if (payload?.conversationId) {
        queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(payload.conversationId) });
      }
    };

    const handleConversationUpdated = (payload) => {
      if (payload?.conversationId) {
        queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
        if (Number(activeConversationIdRef.current) === Number(payload.conversationId)) {
          queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversationDetail(payload.conversationId) });
        }
      }
    };

    const handleConversationArchived = (payload) => {
      if (payload?.conversationId) {
        queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
        if (Number(activeConversationIdRef.current) === Number(payload.conversationId)) {
          dispatch(setActiveConversationId(null));
        }
      }
    };

    subscribeToSocketEvent("message_created", handleMessageCreated);
    subscribeToSocketEvent("message_updated", handleMessageUpdated);
    subscribeToSocketEvent("message_deleted", handleMessageDeleted);
    subscribeToSocketEvent("message_reacted", handleMessageReacted);
    subscribeToSocketEvent("message_pinned", handleMessagePinned);
    subscribeToSocketEvent("presence_changed", handlePresenceChanged);
    subscribeToSocketEvent("typing", handleTyping);
    subscribeToSocketEvent("conversation_created", handleConversationCreated);
    subscribeToSocketEvent("member_added", handleMemberAdded);
    subscribeToSocketEvent("member_removed", handleMemberRemoved);
    subscribeToSocketEvent("conversation_updated", handleConversationUpdated);
    subscribeToSocketEvent("conversation_archived", handleConversationArchived);

    return () => {
      unsubscribeFromSocketEvent("message_created", handleMessageCreated);
      unsubscribeFromSocketEvent("message_updated", handleMessageUpdated);
      unsubscribeFromSocketEvent("message_deleted", handleMessageDeleted);
      unsubscribeFromSocketEvent("message_reacted", handleMessageReacted);
      unsubscribeFromSocketEvent("message_pinned", handleMessagePinned);
      unsubscribeFromSocketEvent("presence_changed", handlePresenceChanged);
      unsubscribeFromSocketEvent("typing", handleTyping);
      unsubscribeFromSocketEvent("conversation_created", handleConversationCreated);
      unsubscribeFromSocketEvent("member_added", handleMemberAdded);
      unsubscribeFromSocketEvent("member_removed", handleMemberRemoved);
      unsubscribeFromSocketEvent("conversation_updated", handleConversationUpdated);
      unsubscribeFromSocketEvent("conversation_archived", handleConversationArchived);
    };
  }, [dispatch, queryClient]);

  // Queries
  const showArchived = filterType === "ARCHIVED";
  const { data: conversationsData, isLoading: isLoadingConversations } = useConversationsQuery({
    companyId,
    archived: showArchived
  });
  const conversations = conversationsData?.data || [];

  const { data: activeConvDetail } = useConversationDetailQuery(activeConversationId);
  const activeConversation = activeConvDetail?.data || activeConvDetail || conversations.find(c => c.id === activeConversationId);

  // Channel posting permission
  const canPost = useMemo(() => {
    return checkChannelPostPermission(activeConversation);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversation, user]);

  // Subscribe to socket room
  useEffect(() => {
    const socket = getSocketInstance();
    if (!socket || !activeConversationId) return;

    socket.emit("subscribe", { conversationId: activeConversationId });

    if (activeConversation?.members?.length) {
      const memberUserIds = activeConversation.members
        .map(m => m.user?.id || m.userId)
        .filter(Boolean);

      if (memberUserIds.length) {
        socket.emit("get_presence", { userIds: memberUserIds }, (response) => {
          if (response?.status === "SUCCESS" && response.data) {
            setPresenceMap(prev => {
              const updated = { ...prev };
              Object.entries(response.data).forEach(([uid, presenceData]) => {
                updated[Number(uid)] = presenceData;
              });
              return updated;
            });
          }
        });
      }
    }

    return () => {
      socket.emit("unsubscribe", { conversationId: activeConversationId });
    };
  }, [activeConversationId, activeConversation]);

  // ERP context
  useEffect(() => {
    if (rightPanelTab !== "INFO" || !activeConversation?.entityType || !activeConversation?.entityId) {
      setErpDetail(null);
      return;
    }

    const loadErp = async () => {
      setLoadingErp(true);
      try {
        const res = await ChatAPI.getErpDiscussionByContext(
          activeConversation.entityType,
          activeConversation.entityId
        );
        setErpDetail(res.data || res);
      } catch (err) {
        console.error("Failed to load ERP context detail", err);
      } finally {
        setLoadingErp(false);
      }
    };
    loadErp();
  }, [rightPanelTab, activeConversation?.entityType, activeConversation?.entityId]);

  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingMessages,
  } = useMessagesQuery(activeConversationId);

  const messagesList = useMemo(() => {
    if (!messagesData) return [];
    return messagesData.pages.flatMap((page) => page.data || []);
  }, [messagesData]);

  const mergedMessagesList = useMemo(() => {
    const dbMessages = messagesList;
    if (!activeConversationId) return dbMessages;

    const activeOptimistic = Object.entries(optimisticQueue)
      .filter(([_, item]) => item.conversationId === activeConversationId)
      .map(([clientMessageId, item]) => ({
        id: clientMessageId,
        clientMessageId,
        conversationId: item.conversationId,
        senderId: user?.id || user?.userId,
        sender: {
          id: user?.id || user?.userId,
          name: user?.name || "Me",
          avatarUrl: user?.avatarUrl,
        },
        content: item.content,
        type: "TEXT",
        createdAt: item.createdAt || new Date().toISOString(),
        status: item.status || "PENDING",
        isOptimistic: true,
        parentId: item.parentId || null,
        parentMessage: item.parentMessage || null,
      }));

    if (activeOptimistic.length === 0) return dbMessages;

    const filteredOptimistic = activeOptimistic.filter((opt) => {
      const isDuplicate = dbMessages.some((dbMsg) => {
        if (dbMsg.content !== opt.content) return false;
        const dbSenderId = dbMsg.senderId || dbMsg.sender?.id;
        const optSenderId = opt.senderId;
        if (Number(dbSenderId) !== Number(optSenderId)) return false;
        const dbTime = new Date(dbMsg.createdAt).getTime();
        const optTime = new Date(opt.createdAt).getTime();
        return Math.abs(dbTime - optTime) < 15000;
      });
      return !isDuplicate;
    });

    return [...dbMessages, ...filteredOptimistic];
  }, [messagesList, optimisticQueue, activeConversationId, user]);

  const activeDetails = useMemo(() => {
    return getConversationDisplay(activeConversation, user, presenceMap, typingUsersMap);
  }, [activeConversation, user, presenceMap, typingUsersMap]);

  const headerSubtitle = useMemo(() => {
    if (!activeConversation) return "";
    if (activeConversation.type === "DIRECT") {
      return activeDetails?.presence === "ONLINE" ? "Online" :
             activeDetails?.presence === "AWAY" ? "Away" :
             activeDetails?.presence === "BUSY" ? "Busy" :
             activeDetails?.lastSeenText || "Offline";
    } else {
      const membersList = activeConversation.members || [];
      const totalCount = membersList.length;
      const onlineCount = membersList.filter(m => {
        const mUserId = m.userId || m.user?.id;
        const presenceObj = presenceMap[mUserId];
        if (presenceObj?.status) {
          return ["ONLINE", "AWAY", "BUSY"].includes(presenceObj.status.toUpperCase());
        }
        return m.user?.presence && ["ONLINE", "AWAY", "BUSY"].includes(m.user.presence.toUpperCase());
      }).length;

      const parts = [];
      if (totalCount > 0) parts.push(`${totalCount} ${totalCount === 1 ? "member" : "members"}`);
      if (onlineCount > 0) parts.push(`${onlineCount} online`);

      const channelSuffix = getChannelHeaderSuffix(activeConversation);
      if (channelSuffix) parts.push(channelSuffix);

      return parts.join(" • ") || activeDetails?.subtitle || "No description set";
    }
  }, [activeConversation, activeDetails, presenceMap]);

  // Mutations
  const createConversationMutation = useCreateConversationMutation();
  const sendMessageMutation = useSendMessageMutation();
  const editMessageMutation = useEditMessageMutation();
  const deleteMessageMutation = useDeleteMessageMutation();
  const reactMessageMutation = useReactMessageMutation();
  const pinMessageMutation = usePinMessageMutation();
  const unpinMessageMutation = useUnpinMessageMutation();
  const starMessageMutation = useStarMessageMutation();
  const unstarMessageMutation = useUnstarMessageMutation();

  // ── HANDLERS ──

  const handleSend = async (textToSend) => {
    if (!textToSend.trim() || !activeConversationId) return;

    if (editingMessage) {
      try {
        await editMessageMutation.mutateAsync({
          conversationId: activeConversationId,
          messageId: editingMessage.id,
          content: textToSend
        });
        toast.success("Message updated.");
        setEditingMessage(null);
        setComposerInput("");
      } catch (err) {
        toast.error("Failed to edit message.");
      }
      return;
    }

    const clientMsgId = `client-${Date.now()}`;
    const currentReplyingTo = replyingToMessage;

    dispatch(addToOptimisticQueue({
      clientMessageId: clientMsgId,
      conversationId: activeConversationId,
      content: textToSend,
      parentId: currentReplyingTo?.id || null,
      parentMessage: currentReplyingTo || null,
    }));

    setReplyingToMessage(null);

    try {
      await sendMessageMutation.mutateAsync({
        conversationId: activeConversationId,
        dto: {
          content: textToSend,
          type: "TEXT",
          parentId: currentReplyingTo?.id || undefined
        }
      });
      dispatch(removeFromOptimisticQueue(clientMsgId));
    } catch (err) {
      dispatch(setOptimisticStatus({ clientMessageId: clientMsgId, status: "FAILED", error: err.message }));
      toast.error("Failed to send message.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileId = `file-${Date.now()}`;
    dispatch(addToUploadQueue({ fileId, fileName: file.name }));

    const formData = new FormData();
    formData.append("file", file);

    const controller = new AbortController();
    activeUploadControllers.current.set(fileId, controller);

    try {
      const activeCompanyId = companyId || 1;
      const res = await axiosClient.post("/attachments/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-company-id": activeCompanyId,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          dispatch(updateUploadProgress({ fileId, progress }));
        },
        signal: controller.signal,
      });

      dispatch(setUploadStatus({ fileId, status: "SUCCESS" }));

      let type = "FILE";
      if (file.type.startsWith("image/")) type = "IMAGE";
      else if (file.type.startsWith("video/")) type = "VIDEO";
      else if (file.type === "application/pdf") type = "PDF";
      else if (file.type.startsWith("audio/")) type = "AUDIO";

      await sendMessageMutation.mutateAsync({
        conversationId: activeConversationId,
        dto: {
          content: file.name,
          type,
          payload: {
            filePath: res.data.fileUrl,
            fileName: file.name,
            fileSize: file.size,
          },
        },
      });

      setTimeout(() => dispatch(removeFromUploadQueue(fileId)), 1000);
    } catch (err) {
      if (axios.isCancel(err)) {
        toast.info("Upload cancelled.");
      } else {
        dispatch(setUploadStatus({ fileId, status: "FAILED" }));
        toast.error("File upload failed.");
      }
    } finally {
      activeUploadControllers.current.delete(fileId);
    }
  };

  const handleSendVoice = (audioBlob) => {
    sendMessageMutation.mutate({
      conversationId: activeConversationId,
      dto: { content: "🎤 Voice Message", type: "VOICE" }
    });
    toast.success("Voice message sent.");
  };

  const handleComposerChange = (val) => {
    setComposerInput(val);
    dispatch(setComposerDraft({ conversationId: activeConversationId, draft: val }));

    const socket = getSocketInstance();
    if (socket && socket.connected && activeConversationId) {
      socket.emit("typing_start", { conversationId: activeConversationId });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing_stop", { conversationId: activeConversationId });
      }, 3000);
    }
  };

  const handleComposerSubmit = () => {
    const socket = getSocketInstance();
    if (socket && socket.connected && activeConversationId) {
      socket.emit("typing_stop", { conversationId: activeConversationId });
    }
  };

  const handleTogglePanel = (tab) => {
    dispatch(setRightPanelTab(rightPanelTab === tab ? null : tab));
  };

  const handlePin = (messageId) => {
    pinMessageMutation.mutate(
      { conversationId: activeConversationId, messageId },
      {
        onSuccess: () => {
          // Re-fetch so banner updates immediately after pinning
          fetchActivePinned(activeConversationId);
          // Also refresh right panel if open
          if (rightPanelTab === "PINNED_MESSAGES") {
            ChatAPI.getPinnedMessages(activeConversationId)
              .then(res => setPinnedMessages(res || []))
              .catch(() => {});
          }
        }
      }
    );
  };

  const handleUnpin = async (pin, m) => {
    try {
      await unpinMessageMutation.mutateAsync({ conversationId: activeConversationId, messageId: m.id });
      setPinnedMessages(prev => prev.filter(p => p.id !== pin.id));
      // Update banner
      await fetchActivePinned(activeConversationId);
      toast.success("Message unpinned.");
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(activeConversationId) });
    } catch (e) {
      toast.error("Failed to unpin message.");
    }
  };

  // Unpin directly from banner (no pin object, just messageId)
  const handleBannerUnpin = async (messageId) => {
    try {
      await unpinMessageMutation.mutateAsync({ conversationId: activeConversationId, messageId });
      setPinnedMessages(prev => prev.filter(p => p.message?.id !== messageId));
      await fetchActivePinned(activeConversationId);
      toast.success("Message unpinned.");
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(activeConversationId) });
    } catch (e) {
      toast.error("Failed to unpin message.");
    }
  };

  const handleUnstar = async (m) => {
    try {
      await unstarMessageMutation.mutateAsync(m.id);
      setStarredMessages(prev => prev.filter(sm => sm.id !== m.id));
      toast.success("Message unstarred.");
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(activeConversationId) });
    } catch (e) {
      toast.error("Failed to unstar message.");
    }
  };

  // ── RENDER ──
  return (
    <div className="w-full h-full flex flex-row bg-white overflow-hidden shadow-2xl relative">

      {/* ── COLUMN 1: SIDEBAR ── */}
      <ChatSidebar
        showSidebarMobile={showSidebarMobile}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
        onCreateClick={() => setShowCreateModal(true)}
        conversations={conversations}
        isLoadingConversations={isLoadingConversations}
        user={user}
        presenceMap={presenceMap}
      />

      {/* ── COLUMN 2: FEED TIMELINE & COMPOSER ── */}
      <ChatMainPanel
        showSidebarMobile={showSidebarMobile}
        activeConversationId={activeConversationId}
        activeConversation={activeConversation}
        activeDetails={activeDetails}
        headerSubtitle={headerSubtitle}
        rightPanelTab={rightPanelTab}
        isLoadingMessages={isLoadingMessages}
        mergedMessagesList={mergedMessagesList}
        user={user}
        typingUsersMap={typingUsersMap}
        uploadQueue={uploadQueue}
        composerInput={composerInput}
        setComposerInput={setComposerInput}
        employeeLookup={employeeLookup}
        editingMessage={editingMessage}
        setEditingMessage={setEditingMessage}
        replyingToMessage={replyingToMessage}
        setReplyingToMessage={setReplyingToMessage}
        canPost={canPost}
        presenceMap={presenceMap}
        onSetShowSidebarMobile={setShowSidebarMobile}
        onTogglePanel={handleTogglePanel}
        onSend={handleSend}
        onFileUpload={handleFileUpload}
        onSendVoice={handleSendVoice}
        onComposerChange={handleComposerChange}
        onComposerSubmit={handleComposerSubmit}
        onReact={(messageId, reaction) => reactMessageMutation.mutate({ conversationId: activeConversationId, messageId, reaction })}
        onPin={handlePin}
        onUnpin={(messageId) => unpinMessageMutation.mutate({ conversationId: activeConversationId, messageId })}
        activePinnedMessage={activePinnedMessage}
        onBannerUnpin={handleBannerUnpin}
        onOpenPinnedPanel={() => handleTogglePanel("PINNED_MESSAGES")}
        onStar={(messageId) => {
          starMessageMutation.mutate(messageId, {
            onSuccess: () => toast.success("Message starred/bookmarked."),
            onError: () => toast.error("Failed to star message.")
          });
        }}
        onDelete={(msgId) => {
          deleteMessageMutation.mutate({ conversationId: activeConversationId, messageId: msgId, mode: "everyone" }, {
            onSuccess: () => toast.success("Message deleted.")
          });
        }}
        onReply={(msg) => {
          setReplyingToMessage(msg);
          setEditingMessage(null);
        }}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />

      {/* ── COLUMN 3: RIGHT CONTEXT DRAWER ── */}
      <ChatRightPanel
        rightPanelTab={rightPanelTab}
        onClose={() => dispatch(setRightPanelTab(null))}
        loadingErp={loadingErp}
        erpDetail={erpDetail}
        activeConversation={activeConversation}
        loadingPinned={loadingPinned}
        pinnedMessages={pinnedMessages}
        onUnpin={handleUnpin}
        setPinnedMessages={setPinnedMessages}
        loadingStarred={loadingStarred}
        starredMessages={starredMessages}
        onUnstar={handleUnstar}
        setStarredMessages={setStarredMessages}
        companyId={companyId}
        user={user}
        onUpdateConversation={(action) => {
          queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
          if (action === "delete" || action === "leave" || action === "archive") {
            dispatch(setActiveConversationId(null));
          } else if (activeConversationId) {
            queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversationDetail(Number(activeConversationId)) });
          }
        }}
      />

      {/* ── CREATE CHANNEL DIALOG MODAL ── */}
      <CreateConversationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        currentUser={user}
        companyId={companyId}
      />
    </div>
  );
}
