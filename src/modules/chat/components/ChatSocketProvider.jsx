"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { connectSocket, disconnectSocket, getSocketInstance } from "@/lib/socket";
import { selectUser } from "@/store/slices/authSlice";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
import { setSocketStatus } from "@/modules/chat/store/chatSlice";
import { CHAT_QUERY_KEYS } from "@/modules/chat/constants/query-keys";
import { toast } from "sonner";

const ChatSocketContext = createContext(null);

export const useChatSocket = () => useContext(ChatSocketContext);

// Dev diagnostic: detect duplicate provider instances.
let _mountCount = 0;

/**
 * ChatSocketProvider — the SOLE owner of the Socket.IO lifecycle.
 *
 * Ownership rules:
 *  • connectSocket() is called here and NOWHERE else.
 *  • disconnectSocket() is called here and NOWHERE else.
 *  • AppShell and all other components get the socket via getSocketInstance().
 *
 * Timing note: React runs child effects BEFORE parent effects. Because
 * ChatSocketProvider wraps AppShell (i.e., ChatSocketProvider IS the parent
 * in the render tree), its effect runs AFTER AppShell's child-effects.
 * Wait — actually ChatSocketProvider renders INSIDE AppShell's JSX:
 *
 *   AppShell return (
 *     <ChatSocketProvider>          ← child of AppShell in the JSX tree
 *       <Header /><Sidebar />...
 *     </ChatSocketProvider>
 *   )
 *
 * This means ChatSocketProvider is a child component of AppShell, so React
 * runs ChatSocketProvider's useEffect BEFORE AppShell's useEffect.
 * → ChatSocketProvider must create the socket, not AppShell.
 * → AppShell must consume it via getSocketInstance() called AFTER the socket
 *   is created (which happens because AppShell's effect runs after ChatSocketProvider's).
 *
 * Socket re-creation: when companyId or user changes, we cleanly tear down
 * the old socket (removeAllListeners + disconnect) and build a new one.
 */
export default function ChatSocketProvider({ children }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user = useSelector(selectUser);
  const companyId = useSelector(selectActiveCompanyId);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectBanner, setReconnectBanner] = useState(false);
  // Ref to always hold current state setters — used inside socket callbacks
  // so they don't become stale closures.
  const stateRef = useRef({ dispatch, queryClient });
  useEffect(() => { stateRef.current = { dispatch, queryClient }; });

  // ── Mount diagnostic ──
  useEffect(() => {
    _mountCount++;
    console.log(`[ChatSocketProvider] MOUNTED (concurrent instances: ${_mountCount})`);
    if (_mountCount > 1) {
      console.error(`[ChatSocketProvider] BUG: ${_mountCount} instances mounted simultaneously! Socket lifecycle will be corrupted.`);
    }
    return () => {
      _mountCount--;
      console.log(`[ChatSocketProvider] UNMOUNTED (remaining instances: ${_mountCount})`);
    };
  }, []);

  useEffect(() => {
    if (!companyId || !user) return;

    console.log("[ChatSocketProvider] Creating socket for company:", companyId);

    // connectSocket() calls removeAllListeners() + disconnect() on any previous
    // socket before creating a new one, so there is no listener accumulation.
    const socket = connectSocket(parseInt(companyId, 10));

    if (!socket) {
      console.warn("[ChatSocketProvider] connectSocket returned null.");
      return;
    }

    // Named handlers — REQUIRED so socket.off(event, handler) works correctly.
    // Anonymous functions can never be removed by reference.
    const handleConnect = () => {
      setIsConnected(true);
      setReconnectBanner(false);
      stateRef.current.dispatch(setSocketStatus("CONNECTED"));
      toast.success("Chat connection restored.");
      stateRef.current.queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.conversations(),
      });
    };

    const handleDisconnect = (reason) => {
      setIsConnected(false);
      stateRef.current.dispatch(setSocketStatus("DISCONNECTED"));
      if (reason === "io server disconnect" || reason === "transport close") {
        setReconnectBanner(true);
      }
    };

    const handleConnectError = () => {
      setIsConnected(false);
      stateRef.current.dispatch(setSocketStatus("RECONNECTING"));
      setReconnectBanner(true);
    };

    // Sync state immediately with whatever the socket's current status is.
    setIsConnected(socket.connected);
    dispatch(setSocketStatus(socket.connected ? "CONNECTED" : "DISCONNECTED"));

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      console.log("[ChatSocketProvider] Destroying socket for company:", companyId);
      // Remove our specific handlers from this socket instance before
      // disconnectSocket() calls removeAllListeners() — belt-and-suspenders.
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);

      // disconnectSocket() = removeAllListeners() + disconnect() + socket = null
      // This ensures AppShell's cleanup (which runs after ours because it is the
      // parent) finds getSocketInstance() === null and does not double-disconnect.
      disconnectSocket();

      setIsConnected(false);
      setReconnectBanner(false);
      dispatch(setSocketStatus("DISCONNECTED"));
    };
  // queryClient and dispatch are stable references — safe in deps.
  }, [companyId, user, dispatch, queryClient]);

  const value = {
    isConnected,
    // Expose the raw socket instance so consumers can call emit() directly.
    socket: getSocketInstance(),
    emitEvent: (event, data) => {
      const instance = getSocketInstance();
      if (instance && instance.connected) {
        instance.emit(event, data);
      } else {
        console.warn("[ChatSocketProvider] Attempted emit on disconnected socket:", event);
      }
    },
  };

  return (
    <ChatSocketContext.Provider value={value}>
      {reconnectBanner && (
        <div className="w-full bg-amber-500 text-slate-900 text-xs font-bold py-1.5 px-4 flex items-center justify-center gap-2 animate-in slide-in-from-top duration-200">
          <span className="h-2 w-2 rounded-full bg-slate-900 animate-ping"></span>
          <span>Connection lost. Attempting to reconnect...</span>
        </div>
      )}
      {children}
    </ChatSocketContext.Provider>
  );
}
