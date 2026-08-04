"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  MessageSquare,
  Search,
  Users,
  Settings,
  MoreVertical,
  Plus,
  X,
  FileText,
  Link as LinkIcon,
  Sparkles,
  Lock,
  Paperclip,
  Phone,
  Video,
  Pin,
  Star
} from "lucide-react";
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

// Components
import ConversationList from "@/modules/chat/components/Sidebar/ConversationList";
import RichComposer from "@/modules/chat/components/Composer/RichComposer";
import MessageTimeline from "@/modules/chat/components/Timeline/MessageTimeline";
import VoiceRecorder from "@/modules/chat/components/Voice/VoiceRecorder";
import AdminSettingsPanel from "@/modules/chat/components/Admin/AdminSettingsPanel";
import GroupSettingsPanel from "@/modules/chat/components/Admin/GroupSettingsPanel";
import CreateConversationModal from "@/modules/chat/components/Common/CreateConversationModal";
import axiosClient from "@/lib/axios";
import { getConversationDisplay } from "@/modules/chat/utils/getConversationDisplay";
import usePermissions from "@/hooks/usePermissions";
import { ArrowLeft } from "lucide-react";
import ErrorBoundary from "@/modules/chat/components/Common/ErrorBoundary";
import { SidebarSkeleton, MessagesSkeleton, HeaderSkeleton } from "@/modules/chat/components/Common/SkeletonLoading";

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
  const [filterType, setFilterType] = useState("ALL"); // ALL, CHANNELS, DMS, GROUPS
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

  // Sync mobile view on active chat changes
  useEffect(() => {
    if (activeConversationId) {
      setShowSidebarMobile(false);
    } else {
      setShowSidebarMobile(true);
    }
  }, [activeConversationId]);

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

  // New channel dialog state
  const [showCreateModal, setShowCreateModal] = useState(false);

  // ESC keypress listener to close context windows/editing/replying states
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

  // Fetch pinned messages when Pinned tab opens
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

  // ERP Context Details lazy state
  const [erpDetail, setErpDetail] = useState(null);
  const [loadingErp, setLoadingErp] = useState(false);

  // Check permissions to load full employee list vs fallback options
  const { hasPermission } = usePermissions();
  const canReadEmployees = hasPermission("employees:read");
  const canReadDepartments = hasPermission("departments:read");
  const canReadDesignations = hasPermission("designations:read");

  // Load employee details lookup for DM recipient display mapping
  useEffect(() => {
    const fetchLookup = async () => {
      if (!canReadEmployees) {
        // Fallback: Fetch assignable list directly to avoid 403 console errors
        try {
          const assignableRes = await axiosClient.get("/v1/tasks/employees/assignable");
          const assignableList = assignableRes.data?.data || [];

          let depts = [];
          let desigs = [];
          if (canReadDepartments) {
            try {
              const dRes = await axiosClient.get("/departments/options", { params: { limit: 250 } });
              depts = dRes.data?.data || dRes.data || [];
            } catch (e) { }
          }
          if (canReadDesignations) {
            try {
              const dsRes = await axiosClient.get("/designations/options", { params: { limit: 250 } });
              desigs = dsRes.data?.data || dsRes.data || [];
            } catch (e) { }
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
            } catch (e) { }
          }
          if (canReadDesignations) {
            try {
              const dsRes = await axiosClient.get("/designations/options", { params: { limit: 250 } });
              desigs = dsRes.data?.data || dsRes.data || [];
            } catch (e) { }
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

      // Compute the new typing list outside any state updater so we can
      // dispatch to Redux and update local state as separate, safe operations.
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

        // Dispatch AFTER computing — schedule it as a microtask so it runs
        // outside the React state-updater function (avoids "setState in render").
        Promise.resolve().then(() => {
          dispatch(setTypingUsers({ conversationId, users: newList }));
        });

        return {
          ...prev,
          [conversationId]: newList,
        };
      });
    };

    subscribeToSocketEvent("message_created", handleMessageCreated);
    subscribeToSocketEvent("message_updated", handleMessageUpdated);
    subscribeToSocketEvent("message_deleted", handleMessageDeleted);
    subscribeToSocketEvent("message_pinned", handleMessagePinned);
    subscribeToSocketEvent("presence_changed", handlePresenceChanged);
    subscribeToSocketEvent("typing", handleTyping);

    return () => {
      unsubscribeFromSocketEvent("message_created", handleMessageCreated);
      unsubscribeFromSocketEvent("message_updated", handleMessageUpdated);
      unsubscribeFromSocketEvent("message_deleted", handleMessageDeleted);
      unsubscribeFromSocketEvent("message_pinned", handleMessagePinned);
      unsubscribeFromSocketEvent("presence_changed", handlePresenceChanged);
      unsubscribeFromSocketEvent("typing", handleTyping);
    };
  }, [dispatch, queryClient]);

  // Queries
  const { data: conversationsData, isLoading: isLoadingConversations } = useConversationsQuery({
    companyId,
  });
  const conversations = conversationsData?.data || [];

  const { data: activeConvDetail } = useConversationDetailQuery(activeConversationId);
  const activeConversation = activeConvDetail?.data || conversations.find(c => c.id === activeConversationId);

  // Subscribe/unsubscribe from active conversation socket room.
  // Placed AFTER activeConversation is declared to avoid temporal dead zone ReferenceError.
  // Also queries current presence for conversation members on open (catches users
  // who were already online before we subscribed to presence_changed events).
  useEffect(() => {
    const socket = getSocketInstance();
    if (!socket || !activeConversationId) return;

    socket.emit("subscribe", { conversationId: activeConversationId });

    // Hydrate presence for members of this conversation
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

  // Fetch ERP discussion context parameters only when the drawer is active
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
    // Backend getHistory() already reverses to ASC (oldest → newest) before responding.
    // Pages from useInfiniteQuery accumulate oldest-page-first (page[0]=oldest batch, page[N]=newest batch).
    // flatMap preserves that chronological order — do NOT reverse again.
    return messagesData.pages.flatMap((page) => page.data || []);
  }, [messagesData]);

  // Construct dynamic mergedMessagesList by merging server messages with Redux optimistic queue
  const mergedMessagesList = useMemo(() => {
    const dbMessages = messagesList;
    if (!activeConversationId) return dbMessages;

    // Filter optimistic items for this conversation
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
        status: item.status || "PENDING", // 'PENDING' | 'FAILED'
        isOptimistic: true,
        parentId: item.parentId || null,
        parentMessage: item.parentMessage || null,
      }));

    if (activeOptimistic.length === 0) return dbMessages;

    // Deduplicate: check content equivalence, sender, and time proximity
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

  // Resolve timeline header details for selected DM or channel
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
      if (totalCount > 0) parts.push(`${totalCount} ${totalCount === 1 ? 'member' : 'members'}`);
      if (onlineCount > 0) parts.push(`${onlineCount} online`);
      
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

  // Send message handler with optimistic queueing or editing
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
    const currentReplyingTo = replyingToMessage; // capture current reply message

    // Add optimistically to Redux queue
    dispatch(addToOptimisticQueue({
      clientMessageId: clientMsgId,
      conversationId: activeConversationId,
      content: textToSend,
      parentId: currentReplyingTo?.id || null,
      parentMessage: currentReplyingTo || null,
    }));

    // Clear replying state early for better responsiveness
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

  // Real File Upload trigger supporting progress, type resolution, and abort controller
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
      // We target the general /api/attachments/upload route
      const res = await axios.post("/api/attachments/upload", formData, {
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

      // Resolve message types based on MIME
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

  // Voice recorder handler
  const handleSendVoice = (audioBlob) => {
    sendMessageMutation.mutate({
      conversationId: activeConversationId,
      dto: { content: "🎤 Voice Message", type: "VOICE" }
    });
    toast.success("Voice message sent.");
  };

  return (
    <div className="w-full h-full flex flex-row bg-white overflow-hidden shadow-2xl relative">

      {/* ── COLUMN 1: SIDEBAR ── */}
      <aside className={`w-[270px] flex-shrink-0 flex flex-col bg-[#F7F8FA] text-slate-700 border-r border-slate-200/60 h-full overflow-hidden transition-all duration-200
        ${showSidebarMobile ? "flex w-full md:w-[270px]" : "hidden md:flex"}`}
      >
        {/* Workspace Brand */}
        <div className="h-[56px] px-3.5 border-b border-slate-200/70 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#3B82F6] flex items-center justify-center text-white text-xs font-extrabold tracking-tight shadow-sm">
              AG
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-[13.5px] leading-none">Agricom CRM</h2>
              <span className="text-[9.5px] text-slate-400 font-semibold uppercase tracking-wider">Enterprise Hub</span>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-1.5 hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Create Channel or Group"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="px-3 py-2 border-b border-slate-200/60">
          <div className="relative">
            <Search className="absolute left-2.5 top-[7px] h-3 w-3 text-slate-400" />
            <input
              id="sidebar-search"
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-200/80 text-[12px] text-slate-800 placeholder-slate-400 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 transition-all"
            />
          </div>
        </div>

        {/* Dynamic Category filter toggles */}
        <div className="px-3 pt-2 pb-1 flex gap-0.5 text-[10px] font-bold text-slate-500 select-none">
          <button onClick={() => setFilterType("ALL")} className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${filterType === "ALL" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-200/60"}`}>All</button>
          <button onClick={() => setFilterType("GROUPS")} className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${filterType === "GROUPS" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-200/60"}`}>Groups</button>
          <button onClick={() => setFilterType("CHANNELS")} className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${filterType === "CHANNELS" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-200/60"}`}>Channels</button>
          <button onClick={() => setFilterType("DMS")} className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${filterType === "DMS" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-200/60"}`}>DMs</button>
        </div>

        {/* Scroll list */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoadingConversations ? (
            <SidebarSkeleton />
          ) : (
            <ErrorBoundary title="Sidebar List Error">
              <ConversationList
                conversations={conversations}
                filterType={filterType}
                searchQuery={searchQuery}
                currentUser={user}
                presenceMap={presenceMap}
              />
            </ErrorBoundary>
          )}
        </div>

        <div className="px-3.5 py-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 select-none">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span className="font-medium">Connected</span>
          </div>
          <span>v1.2.0</span>
        </div>
      </aside>

      {/* ── COLUMN 2: FEED TIMELINE & COMPOSER ── */}
      <main className={`flex-1 min-w-0 flex flex-col h-full bg-white overflow-hidden transition-all duration-200
        ${showSidebarMobile ? "hidden md:flex" : "flex w-full"}`}
      >
        {!activeConversationId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-white">
            <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 shadow-xs">
              <MessageSquare className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-850 text-sm">No Chat Selected</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Select a public channel, private group, or direct message from the sidebar to begin.
            </p>
          </div>
        ) : isLoadingMessages ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <HeaderSkeleton />
            <MessagesSkeleton />
          </div>
        ) : (
          <>
            {/* Top Header */}
            <header className="h-[60px] px-4 border-b border-slate-200/60 bg-white flex items-center justify-between flex-shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.01)] select-none">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Mobile Back button */}
                <button
                  onClick={() => setShowSidebarMobile(true)}
                  className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg md:hidden transition-colors cursor-pointer mr-0.5"
                  title="Back to list"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                {activeConversation?.type !== "DIRECT" ? (
                  <div className="relative flex-shrink-0">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      activeConversation?.type === "CHANNEL" 
                        ? "bg-blue-50 text-blue-600 border border-blue-100" 
                        : "bg-slate-100 text-slate-700 border border-slate-250"
                    }`}>
                      {activeConversation?.type === "CHANNEL" ? "#" : activeDetails?.initials || "G"}
                    </div>
                  </div>
                ) : (
                  <div className="relative flex-shrink-0">
                    {activeDetails?.avatar ? (
                      <img
                        src={activeDetails.avatar}
                        alt={activeDetails.title}
                        className="h-10 w-10 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className={`h-10 w-10 rounded-full border flex items-center justify-center text-sm font-bold ${activeDetails?.avatarClass || "bg-slate-100 text-slate-700"}`}>
                        {activeDetails?.initials}
                      </div>
                    )}
                    <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                      activeDetails?.presence === "ONLINE" ? "bg-emerald-500" :
                      activeDetails?.presence === "AWAY" ? "bg-amber-500" :
                      activeDetails?.presence === "BUSY" ? "bg-red-500" :
                      "bg-slate-400"
                    }`} />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-bold text-slate-900 text-sm md:text-[14.5px] truncate leading-none">{activeDetails?.title}</h1>
                    {activeConversation?.isLocked && <Lock className="h-3 w-3 text-amber-500" />}
                  </div>
                  {activeDetails?.isTyping ? (
                    <p className="text-[10px] text-emerald-600 font-semibold animate-pulse mt-1">{activeDetails.typingText}</p>
                  ) : (
                    <p className="text-[10.5px] text-slate-400 font-medium truncate max-w-[280px] md:max-w-[450px] mt-1 select-text">
                      {headerSubtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0 select-none">
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer" title="Search conversation">
                  <Search className="h-4 w-4" />
                </button>

                <button
                  onClick={() => dispatch(setRightPanelTab(rightPanelTab === "PINNED_MESSAGES" ? null : "PINNED_MESSAGES"))}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${rightPanelTab === "PINNED_MESSAGES" ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}
                  title="Pinned messages"
                >
                  <Pin className="h-4 w-4 rotate-45" />
                </button>

                <button
                  onClick={() => dispatch(setRightPanelTab(rightPanelTab === "STARRED_MESSAGES" ? null : "STARRED_MESSAGES"))}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${rightPanelTab === "STARRED_MESSAGES" ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}
                  title="Starred messages"
                >
                  <Star className="h-4 w-4" />
                </button>
                <button
                  onClick={() => dispatch(setRightPanelTab(rightPanelTab === "INFO" ? null : "INFO"))}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${rightPanelTab === "INFO" ? "bg-slate-100 text-slate-800" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}
                  title="ERP Context Info"
                >
                  <LinkIcon className="h-4 w-4" />
                </button>
                {activeConversation?.type !== "DIRECT" ? (
                  <button
                    onClick={() => dispatch(setRightPanelTab(rightPanelTab === "GROUP_SETTINGS" ? null : "GROUP_SETTINGS"))}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${rightPanelTab === "GROUP_SETTINGS" ? "bg-slate-100 text-slate-800 animate-in duration-100" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}
                    title="Group Settings"
                  >
                    <Settings className="h-4 w-4 hover:rotate-45 transition-transform duration-200" />
                  </button>
                ) : (
                  <button
                    onClick={() => dispatch(setRightPanelTab(rightPanelTab === "SETTINGS" ? null : "SETTINGS"))}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${rightPanelTab === "SETTINGS" ? "bg-slate-100 text-slate-800" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}
                    title="Governance Policies"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                )}
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer" title="More options">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </header>

            {/* Message timeline list */}
            <ErrorBoundary title="Message Timeline Error">
              <MessageTimeline
                messages={mergedMessagesList}
                currentUser={user}
                conversation={activeConversation}
                typingUsers={typingUsersMap[activeConversationId] || []}
                activeConversationId={activeConversationId}
                onReact={(messageId, reaction) => reactMessageMutation.mutate({ conversationId: activeConversationId, messageId, reaction })}
                onPin={(messageId) => pinMessageMutation.mutate({ conversationId: activeConversationId, messageId })}
                onUnpin={(messageId) => unpinMessageMutation.mutate({ conversationId: activeConversationId, messageId })}
                onStar={(messageId) => {
                  starMessageMutation.mutate(messageId, {
                    onSuccess: () => {
                      toast.success("Message starred/bookmarked.");
                    },
                    onError: () => {
                      toast.error("Failed to star message.");
                    }
                  });
                }}
                onEdit={(msg) => {
                  setEditingMessage(msg);
                  setComposerInput(msg.content);
                  setReplyingToMessage(null);
                }}
                onDelete={(msgId) => {
                  deleteMessageMutation.mutate({ conversationId: activeConversationId, messageId: msgId, mode: "everyone" }, {
                    onSuccess: () => {
                      toast.success("Message deleted.");
                    }
                  });
                }}
                onReply={(msg) => {
                  setReplyingToMessage(msg);
                  setEditingMessage(null);
                }}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                presenceMap={presenceMap}
              />
            </ErrorBoundary>

            {/* Active upload progress overlays */}
            {Object.entries(uploadQueue).map(([id, item]) => (
              <div key={id} className="mx-6 my-2 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3 max-w-sm shadow-md animate-in slide-in-from-bottom-2">
                <FileText className="h-7 w-7 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-slate-800 truncate">{item.fileName}</p>
                  <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-1.5">
                    <div className="bg-blue-600 h-full" style={{ width: `${item.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}

            {/* Tiptap-based Rich Text Composer Footer */}
            <footer className="px-3 py-2 bg-white border-t border-slate-200/60 flex flex-col gap-1 flex-shrink-0">
              {editingMessage && (
                <div className="bg-blue-50/80 border-l-[3px] border-blue-500 rounded-md px-2.5 py-1.5 flex items-center justify-between text-[11px] animate-in slide-in-from-bottom-1 duration-100 mb-0.5 select-none">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="font-bold text-blue-700 text-[10px] leading-none mb-0.5">Editing message</div>
                    <div className="text-slate-500 truncate text-[11px]">
                      {editingMessage.content}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEditingMessage(null);
                      setComposerInput("");
                    }}
                    className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {replyingToMessage && (
                <div className="bg-slate-50 border-l-[3px] border-blue-500 rounded-md px-2.5 py-1.5 flex items-center justify-between text-[11px] animate-in slide-in-from-bottom-1 duration-100 mb-0.5 select-none">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="font-bold text-blue-600 text-[10px] leading-none mb-0.5">
                      Replying to {replyingToMessage.sender?.name || "Teammate"}
                    </div>
                    <div className="text-slate-500 truncate text-[11px]">
                      {replyingToMessage.content}
                    </div>
                  </div>
                  <button
                    onClick={() => setReplyingToMessage(null)}
                    className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <ErrorBoundary title="Composer Input Error">
                <RichComposer
                  value={composerInput}
                  employees={Object.entries(employeeLookup).map(([id, emp]) => ({ id, name: emp.name }))}
                  onSendVoice={handleSendVoice}
                  onSendFile={handleFileUpload}
                  onChange={(val) => {
                    setComposerInput(val);
                    dispatch(setComposerDraft({ conversationId: activeConversationId, draft: val }));

                    // Emit typing_start event to socket with auto-stop timer
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
                  }}
                  placeholder="Type a message..."
                  onSubmit={(text) => {
                    handleSend(text);
                    const socket = getSocketInstance();
                    if (socket && socket.connected && activeConversationId) {
                      socket.emit("typing_stop", { conversationId: activeConversationId });
                    }
                  }}
                />
              </ErrorBoundary>
            </footer>
          </>
        )}
      </main>

      {/* ── COLUMN 3: RIGHT COLLAPSIBLE CONTEXT DRAWER ── */}
      <aside className={`border-l border-slate-200 flex flex-col bg-white overflow-hidden transition-all duration-300 flex-shrink-0
        ${rightPanelTab ? "w-full md:w-[360px] fixed md:relative right-0 top-0 bottom-0 h-full z-50 md:z-auto" : "w-0 border-l-0"}`}>
        {rightPanelTab === "INFO" && (
          <div className="w-full md:w-[360px] h-full flex flex-col text-slate-700">
            <header className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-blue-500" />
                <span>ERP Context Discussions</span>
              </h3>
              <button onClick={() => dispatch(setRightPanelTab(null))} className="p-1 hover:bg-slate-200 rounded cursor-pointer">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingErp ? (
                <div className="p-3 text-center text-xs text-slate-400 animate-pulse">
                  Loading ERP context reference...
                </div>
              ) : erpDetail ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-2 animate-in fade-in duration-100">
                  <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest block">
                    Context Reference
                  </span>
                  <h4 className="font-bold text-slate-800 text-xs">
                    [{activeConversation.entityType}] {erpDetail.entityName || erpDetail.title || "Linked Discussion"}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Entity ID: #{activeConversation.entityId}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 italic leading-relaxed">
                    All messages in this channel are linked polymorphic entries associated with this active ERP document context.
                  </p>
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-slate-400">
                  No active ERP document linked to this conversation channel.
                </div>
              )}
            </div>
          </div>
        )}

        {rightPanelTab === "PINNED_MESSAGES" && (
          <div className="w-full md:w-[360px] h-full flex flex-col text-slate-700">
            <header className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <Pin className="h-4 w-4 text-blue-500 rotate-45" />
                <span>Pinned Messages</span>
              </h3>
              <button onClick={() => dispatch(setRightPanelTab(null))} className="p-1 hover:bg-slate-200 rounded cursor-pointer">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFBFD]">
              {loadingPinned ? (
                <div className="p-3 text-center text-xs text-slate-400 animate-pulse">
                  Loading pinned messages...
                </div>
              ) : pinnedMessages.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">📌</span>
                  <span>No pinned messages in this chat.</span>
                </div>
              ) : (
                pinnedMessages.map((pin) => {
                  const m = pin.message;
                  if (!m) return null;
                  return (
                    <div key={pin.id} className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-xs flex flex-col gap-1.5 hover:border-slate-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-800">
                          {m.sender?.name || "Unknown"}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-slate-600 break-words leading-relaxed select-text">
                        {m.content}
                      </p>
                      <div className="flex justify-end pt-1 border-t border-slate-50">
                        <button
                          onClick={async () => {
                            try {
                              await unpinMessageMutation.mutateAsync({ conversationId: activeConversationId, messageId: m.id });
                              setPinnedMessages(prev => prev.filter(p => p.id !== pin.id));
                              toast.success("Message unpinned.");
                              // Invalidate queries so that timeline also updates
                              queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(activeConversationId) });
                            } catch (e) {
                              toast.error("Failed to unpin message.");
                            }
                          }}
                          className="text-[9.5px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer bg-red-50 px-2 py-1 rounded-md hover:bg-red-100 transition-colors"
                        >
                          Unpin
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {rightPanelTab === "STARRED_MESSAGES" && (
          <div className="w-full md:w-[360px] h-full flex flex-col text-slate-700">
            <header className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span>Starred Messages</span>
              </h3>
              <button onClick={() => dispatch(setRightPanelTab(null))} className="p-1 hover:bg-slate-200 rounded cursor-pointer">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFBFD]">
              {loadingStarred ? (
                <div className="p-3 text-center text-xs text-slate-400 animate-pulse">
                  Loading starred messages...
                </div>
              ) : starredMessages.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span>No starred messages.</span>
                </div>
              ) : (
                starredMessages.map((m) => {
                  if (!m) return null;
                  return (
                    <div key={m.id} className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-xs flex flex-col gap-1.5 hover:border-slate-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-800">
                          {m.sender?.name || "Unknown"}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-slate-600 break-words leading-relaxed select-text">
                        {m.content}
                      </p>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-50">
                        <span className="text-[8px] font-medium text-slate-400 uppercase tracking-wider">
                          In: {m.conversation?.name || "Chat"}
                        </span>
                        <button
                          onClick={async () => {
                            try {
                              await unstarMessageMutation.mutateAsync(m.id);
                              setStarredMessages(prev => prev.filter(sm => sm.id !== m.id));
                              toast.success("Message unstarred.");
                              // Invalidate queries so that timeline also updates
                              queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(activeConversationId) });
                            } catch (e) {
                              toast.error("Failed to unstar message.");
                            }
                          }}
                          className="text-[9.5px] font-bold text-slate-500 hover:text-red-650 flex items-center gap-1 cursor-pointer bg-slate-50 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                        >
                          Unstar
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {rightPanelTab === "SETTINGS" && (
          <ErrorBoundary title="Settings Panel Error">
            <AdminSettingsPanel
              companyId={companyId}
              onClose={() => dispatch(setRightPanelTab(null))}
            />
          </ErrorBoundary>
        )}

        {rightPanelTab === "GROUP_SETTINGS" && (
          <ErrorBoundary title="Group Settings Panel Error">
            <GroupSettingsPanel
              conversation={activeConversation}
              currentUser={user}
              onClose={() => dispatch(setRightPanelTab(null))}
              onUpdateConversation={() => {
                queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
              }}
            />
          </ErrorBoundary>
        )}
      </aside>

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
