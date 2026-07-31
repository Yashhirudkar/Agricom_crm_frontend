import { io } from "socket.io-client";
import { getBackendUrl } from "./axios";

let socket = null;
const listeners = {};

export const subscribeToSocketEvent = (event, callback) => {
  if (!listeners[event]) {
    listeners[event] = [];
  }
  listeners[event].push(callback);
};

export const unsubscribeFromSocketEvent = (event, callback) => {
  if (!listeners[event]) return;
  listeners[event] = listeners[event].filter(cb => cb !== callback);
};

const triggerListeners = (event, payload) => {
  if (listeners[event]) {
    listeners[event].forEach(callback => {
      try {
        callback(payload);
      } catch (err) {
        console.error(`Error in socket listener callback for ${event}:`, err);
      }
    });
  }
};

export const connectSocket = (companyId) => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.warn("[Socket] Cannot connect: No JWT access token found.");
    return null;
  }

  if (socket) {
    socket.disconnect();
  }

  socket = io(getBackendUrl(), {
    auth: {
      token,
      companyId: companyId ? companyId.toString() : "",
    },
    transports: ["websocket"],
    autoConnect: true,
  });

  socket.onAny((event, payload) => {
    triggerListeners(event, payload);
  });

  socket.on("connect", () => {
    console.log("[Socket] Socket connected.");
    triggerListeners("connect", null);
  });

  socket.on("disconnect", (reason) => {
    console.log(`[Socket] Socket disconnected: ${reason}`);
    triggerListeners("disconnect", reason);
  });

  socket.on("connect_error", (error) => {
    console.warn(`[Socket] Socket connection error: ${error.message}`);
    triggerListeners("connect_error", error);
  });

  return {
    on: (event, callback) => subscribeToSocketEvent(event, callback),
    off: (event, callback) => unsubscribeFromSocketEvent(event, callback),
    emit: (event, data) => {
      if (socket && socket.connected) {
        socket.emit(event, data);
      }
    },
    connected: socket ? socket.connected : false,
  };
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  // Clear all registered event listeners to prevent memory leaks
  for (const key of Object.keys(listeners)) {
    delete listeners[key];
  }
};

export const getSocketInstance = () => socket;
