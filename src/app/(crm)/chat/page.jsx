"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
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
  Paperclip
} from "lucide-react";
import { toast } from "sonner";
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
import CreateConversationModal from "@/modules/chat/components/Common/CreateConversationModal";
import axiosClient from "@/lib/axios";
import { getConversationDisplay } from "@/modules/chat/utils/getConversationDisplay";
import { useRef } from "react";
import usePermissions from "@/hooks/usePermissions";

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

  // New channel dialog state
  const [showCreateModal, setShowCreateModal] = useState(false);

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
    subscribeToSocketEvent("presence_changed", handlePresenceChanged);
    subscribeToSocketEvent("typing", handleTyping);

    return () => {
      unsubscribeFromSocketEvent("message_created", handleMessageCreated);
      unsubscribeFromSocketEvent("message_updated", handleMessageUpdated);
      unsubscribeFromSocketEvent("message_deleted", handleMessageDeleted);
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


  const {
    data: messagesData,
  } = useMessagesQuery(activeConversationId);

  const messagesList = useMemo(() => {
    if (!messagesData) return [];
    // Backend getHistory() already reverses to ASC (oldest → newest) before responding.
    // Pages from useInfiniteQuery accumulate oldest-page-first (page[0]=oldest batch, page[N]=newest batch).
    // flatMap preserves that chronological order — do NOT reverse again.
    return messagesData.pages.flatMap((page) => page.data || []);
  }, [messagesData]);

  // Resolve timeline header details for selected DM or channel
  const activeDetails = useMemo(() => {
    return getConversationDisplay(activeConversation, user, presenceMap, typingUsersMap);
  }, [activeConversation, user, presenceMap, typingUsersMap]);

  // Mutations
  const createConversationMutation = useCreateConversationMutation();
  const sendMessageMutation = useSendMessageMutation();
  const editMessageMutation = useEditMessageMutation();
  const deleteMessageMutation = useDeleteMessageMutation();
  const reactMessageMutation = useReactMessageMutation();
  const pinMessageMutation = usePinMessageMutation();
  const unpinMessageMutation = useUnpinMessageMutation();

  // Send message handler with optimistic queueing
  const handleSend = async (textToSend) => {
    if (!textToSend.trim() || !activeConversationId) return;

    const clientMsgId = `client-${Date.now()}`;

    // Add optimistically to Redux queue
    dispatch(addToOptimisticQueue({
      clientMessageId: clientMsgId,
      conversationId: activeConversationId,
      content: textToSend,
    }));

    try {
      await sendMessageMutation.mutateAsync({
        conversationId: activeConversationId,
        dto: { content: textToSend, type: "TEXT" }
      });
      dispatch(removeFromOptimisticQueue(clientMsgId));
    } catch (err) {
      dispatch(setOptimisticStatus({ clientMessageId: clientMsgId, status: "FAILED", error: err.message }));
      toast.error("Failed to send message.");
    }
  };

  // Simulated File Upload trigger
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileId = `file-${Date.now()}`;
    dispatch(addToUploadQueue({ fileId, fileName: file.name }));

    let prog = 0;
    const interval = setInterval(() => {
      prog += 25;
      dispatch(updateUploadProgress({ fileId, progress: prog }));
      if (prog >= 100) {
        clearInterval(interval);
        dispatch(setUploadStatus({ fileId, status: "SUCCESS" }));

        sendMessageMutation.mutate({
          conversationId: activeConversationId,
          dto: { content: `📎 Uploaded file: ${file.name}`, type: "FILE" }
        });
        setTimeout(() => dispatch(removeFromUploadQueue(fileId)), 1000);
      }
    }, 200);
  };

  // Voice recorder handler
  const handleSendVoice = (audioBlob) => {
    sendMessageMutation.mutate({
      conversationId: activeConversationId,
      dto: { content: "🎤 Voice Message", type: "VOICE" }
    });
    toast.success("Voice message sent.");
  };

  // Modal creation handled by CreateConversationModal

  return (
    <div className="w-full h-full flex flex-row bg-white overflow-hidden shadow-2xl">

      {/* ── COLUMN 1: SIDEBAR ── */}
      <aside className="w-[280px] flex-shrink-0 flex flex-col bg-slate-50 text-slate-700 border-r border-slate-200/80 h-full overflow-hidden">

        {/* Workspace Brand */}
        <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              AG
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm leading-none">Agricom CRM</h2>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Enterprise Hub</span>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-slate-850 rounded-lg transition-colors"
            title="Create Channel or Group"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="p-3 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-450 text-slate-400" />
            <input
              id="sidebar-search"
              type="text"
              placeholder="Search (Ctrl + K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-450 placeholder-slate-400 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Dynamic Category filter toggles */}
        <div className="px-3 pt-3 flex gap-1 text-[10px] font-bold text-slate-500">
          <button onClick={() => setFilterType("ALL")} className={`px-2 py-1 rounded cursor-pointer ${filterType === "ALL" ? "bg-slate-200 text-slate-800" : "hover:bg-slate-100"}`}>ALL</button>
          <button onClick={() => setFilterType("CHANNELS")} className={`px-2 py-1 rounded cursor-pointer ${filterType === "CHANNELS" ? "bg-slate-200 text-slate-800" : "hover:bg-slate-100"}`}>CHANNELS</button>
          <button onClick={() => setFilterType("DMS")} className={`px-2 py-1 rounded cursor-pointer ${filterType === "DMS" ? "bg-slate-200 text-slate-800" : "hover:bg-slate-100"}`}>DMS</button>
        </div>

        {/* Scroll list */}
        <div className="flex-1 overflow-y-auto p-3">
          <ConversationList
            conversations={conversations}
            filterType={filterType}
            searchQuery={searchQuery}
            currentUser={user}
            presenceMap={presenceMap}
          />
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Connected</span>
          </div>
          <span>v1.2.0</span>
        </div>
      </aside>

      {/* ── COLUMN 2: FEED TIMELINE & COMPOSER ── */}
      <main className="flex-1 min-w-0 flex flex-col h-full bg-white overflow-hidden">
        {!activeConversationId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-white">
            <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 shadow-xs">
              <MessageSquare className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">No Chat Selected</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Select a public channel, private group, or direct message from the sidebar to begin.
            </p>
          </div>
        ) : (
          <>
            {/* Top Header */}
            <header className="h-16 px-6 border-b border-slate-200/80 bg-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {activeConversation?.type === "DIRECT" && (
                  <div className="relative flex-shrink-0">
                    {activeDetails?.avatar ? (
                      <img
                        src={activeDetails.avatar}
                        alt={activeDetails.title}
                        className="h-10 w-10 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className={`h-10 w-10 rounded-full border flex items-center justify-center text-xs font-bold ${activeDetails?.avatarClass || "bg-slate-100 text-slate-700"}`}>
                        {activeDetails?.initials}
                      </div>
                    )}
                    <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${activeDetails?.presence === "ONLINE" ? "bg-emerald-500" :
                        activeDetails?.presence === "AWAY" ? "bg-amber-500" :
                          activeDetails?.presence === "BUSY" ? "bg-red-500" :
                            "bg-slate-400"
                      }`} />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="font-bold text-slate-900 text-sm md:text-base truncate">{activeDetails?.title}</h1>
                    {activeConversation?.isLocked && <Lock className="h-3.5 w-3.5 text-amber-500" />}
                  </div>
                  {activeDetails?.isTyping ? (
                    <p className="text-[11px] text-emerald-600 font-medium animate-pulse">{activeDetails.typingText}</p>
                  ) : (
                    <p className="text-[11px] text-slate-500 truncate max-w-[300px] md:max-w-[500px]">
                      {activeDetails?.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                {activeConversation?.type === "DIRECT" && (
                  <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200/50 rounded-full text-[10px] font-bold text-slate-500">
                    <span className={`h-1.5 w-1.5 rounded-full ${activeDetails?.presence === "ONLINE" ? "bg-emerald-500" :
                        activeDetails?.presence === "AWAY" ? "bg-amber-500" :
                          activeDetails?.presence === "BUSY" ? "bg-red-500" :
                            "bg-slate-400"
                      }`} />
                    {activeDetails?.presence === "ONLINE" ? "Online" :
                      activeDetails?.presence === "AWAY" ? "Away" :
                        activeDetails?.presence === "BUSY" ? "Busy" :
                          activeDetails?.lastSeenText}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch(setRightPanelTab(rightPanelTab === "INFO" ? null : "INFO"))}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${rightPanelTab === "INFO" ? "bg-slate-100 text-slate-800" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}
                  title="ERP Discussions"
                >
                  <LinkIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => dispatch(setRightPanelTab(rightPanelTab === "SETTINGS" ? null : "SETTINGS"))}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${rightPanelTab === "SETTINGS" ? "bg-slate-100 text-slate-800" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}
                  title="Policies"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </header>

            {/* Message timeline list */}
            <MessageTimeline
              messages={messagesList}
              currentUser={user}
              conversation={activeConversation}
              typingUsers={typingUsersMap[activeConversationId] || []}
              activeConversationId={activeConversationId}
              onReact={(messageId, reaction) => reactMessageMutation.mutate({ conversationId: activeConversationId, messageId, reaction })}
              onPin={(messageId) => pinMessageMutation.mutate({ conversationId: activeConversationId, messageId })}
              onUnpin={(messageId) => unpinMessageMutation.mutate({ conversationId: activeConversationId, messageId })}
            />

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
            <footer className="px-6 py-3.5 bg-slate-100 border-t border-slate-200/80 flex items-center gap-3 flex-shrink-0">
              {/* Left accessories */}
              <div className="flex items-center gap-2 text-slate-500 flex-shrink-0">
                <label className="cursor-pointer p-2 hover:bg-slate-200 hover:text-slate-800 rounded-full transition-colors" title="Attach File">
                  <Paperclip className="h-5 w-5" />
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
                <VoiceRecorder onSendVoice={handleSendVoice} />
              </div>

              {/* Capsule editor & Send button */}
              <RichComposer
                value={composerInput}
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
            </footer>
          </>
        )}
      </main>

      {/* ── COLUMN 3: RIGHT COLLAPSIBLE CONTEXT DRAWER ── */}
      <aside className={`border-l border-slate-200 flex flex-col bg-white overflow-hidden transition-all duration-300 flex-shrink-0 ${rightPanelTab ? "w-[360px]" : "w-0 border-l-0"
        }`}>
        {rightPanelTab === "INFO" && (
          <div className="w-[360px] h-full flex flex-col text-slate-700">
            <header className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-blue-500" />
                <span>ERP Context Discussions</span>
              </h3>
              <button onClick={() => dispatch(setRightPanelTab(null))} className="p-1 hover:bg-slate-200 rounded">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest block mb-1">Context Reference</span>
                <h4 className="font-bold text-slate-800 text-xs">[LEAD] Yash Hirudkar Consultancy</h4>
                <p className="text-[10px] text-slate-500 mt-1">Lead ID: #44901</p>
              </div>
            </div>
          </div>
        )}

        {rightPanelTab === "SETTINGS" && (
          <AdminSettingsPanel
            companyId={companyId}
            onClose={() => dispatch(setRightPanelTab(null))}
          />
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
