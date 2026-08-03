"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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

export default function ChatSocketProvider({ children }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user = useSelector(selectUser);
  const companyId = useSelector(selectActiveCompanyId);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectBanner, setReconnectBanner] = useState(false);

  useEffect(() => {
    if (!companyId || !user) return;

    console.log("[ChatSocketProvider] Initializing socket connection for company:", companyId);
    const socket = connectSocket(parseInt(companyId, 10));

    if (socket) {
      setIsConnected(socket.connected);
      dispatch(setSocketStatus(socket.connected ? "CONNECTED" : "DISCONNECTED"));

      socket.on("connect", () => {
        setIsConnected(true);
        setReconnectBanner(false);
        dispatch(setSocketStatus("CONNECTED"));
        toast.success("Chat connection restored.");
        
        // Sync missed data after a reconnect event
        queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
      });

      socket.on("disconnect", (reason) => {
        setIsConnected(false);
        dispatch(setSocketStatus("DISCONNECTED"));
        if (reason === "io server disconnect" || reason === "transport close") {
          setReconnectBanner(true);
        }
      });

      socket.on("connect_error", () => {
        setIsConnected(false);
        dispatch(setSocketStatus("RECONNECTING"));
        setReconnectBanner(true);
      });
    }

    return () => {
      console.log("[ChatSocketProvider] Cleaning up socket connection");
      disconnectSocket();
      setIsConnected(false);
      setReconnectBanner(false);
      dispatch(setSocketStatus("DISCONNECTED"));
    };
  }, [companyId, user, dispatch, queryClient]);

  const value = {
    isConnected,
    socket: getSocketInstance(),
    emitEvent: (event, data) => {
      const instance = getSocketInstance();
      if (instance && instance.connected) {
        instance.emit(event, data);
      } else {
        console.warn("[ChatSocketProvider] Attempted emit on disconnected socket:", event);
      }
    }
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
