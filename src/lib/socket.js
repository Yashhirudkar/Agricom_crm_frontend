import { io } from "socket.io-client";
import { getBackendUrl } from "./axios";

// ─── Singleton socket instance ────────────────────────────────────────────────
// Only ONE Socket.IO client ever exists at a time.
// connectSocket() is the sole place that creates a new client.
let socket = null;

// ─── Diagnostics (dev-only) ───────────────────────────────────────────────────
let _connectCount = 0;

const _logDiagnostics = (label) => {
  if (process.env.NODE_ENV !== "development") return;
  const listenerMap = socket ? socket.listeners?.bind(socket) : null;
  const eventNames = socket?._callbacks ? Object.keys(socket._callbacks) : [];
  console.log(
    `[Socket:Diagnostics] ${label} | connectCount=${_connectCount} | socket=${socket ? "ALIVE" : "NULL"} | events=[${eventNames.join(",")}]`
  );
};

// Named module-level handlers so they can be precisely removed on each teardown.
// These are re-assigned each connectSocket() call to the new socket so they
// always reference the correct socket in their closure.
let _handleConnect = null;
let _handleDisconnect = null;
let _handleConnectError = null;

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Create (or recreate) the global Socket.IO connection.
 * Called ONCE by ChatSocketProvider when the user + companyId are ready.
 *
 * Returns the raw socket.io-client instance so callers can call
 * socket.on() / socket.off() directly.
 */
export const connectSocket = (companyId) => {
  if (typeof window === "undefined") return null;

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

  socket = io(getBackendUrl(), {
    auth: (cb) => {
      const currentToken = localStorage.getItem("accessToken");
      cb({
        token: currentToken || "",
        companyId: companyId ? companyId.toString() : "",
      });
    },
    transports: ["websocket"],
    autoConnect: true,
  });

  // Assign new named handler closures bound to this socket's context.
  _handleConnect = () => {
    console.log("[Socket] Connected.");
    _logDiagnostics("connect");
  };
  _handleDisconnect = (reason) => {
    console.log(`[Socket] Disconnected: ${reason}`);
    _logDiagnostics("disconnect");
  };
  _handleConnectError = (error) => {
    console.warn(`[Socket] Connection error: ${error.message}`);
  };

  socket.on("connect", _handleConnect);
  socket.on("disconnect", _handleDisconnect);
  socket.on("connect_error", _handleConnectError);

  _logDiagnostics("connectSocket done");
  return socket;
};

/**
 * Disconnect and destroy the socket.
 * Should only be called by ChatSocketProvider (the sole socket owner) on unmount.
 */
export const disconnectSocket = () => {
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

/**
 * Get the current raw socket instance. Returns null if not yet connected.
 * All consumers (AppShell, ChatPage, corrections page, etc.) call this.
 */
export const getSocketInstance = () => socket;

// ─── Legacy compat shims ──────────────────────────────────────────────────────
// These forward directly to the raw socket.
// The old custom listeners{} pub-sub map has been removed — these now delegate
// straight to socket.io-client's own event system which GCs correctly.

export const subscribeToSocketEvent = (event, callback) => {
  if (socket) {
    socket.on(event, callback);
  } else {
    console.warn(`[Socket] subscribeToSocketEvent("${event}") called before socket is ready.`);
  }
};

export const unsubscribeFromSocketEvent = (event, callback) => {
  if (!socket) return;
  if (callback === undefined) {
    socket.removeAllListeners(event);
  } else {
    socket.off(event, callback);
  }
};
