"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, fetchCurrentUser } from "@/store/slices/authSlice";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import CommandPalette from "@/components/CommandPalette";
import FollowUpHeaderDrawer from "@/modules/follow-ups/components/FollowUpHeaderDrawer";
import { getSocketInstance } from "@/lib/socket";
import { handleSocketBatchUpdate, fetchCorrections } from "@/store/entities/attendanceSlice";
import { fetchNotifications, addSocketNotification } from "@/store/slices/notificationsSlice";
import { useQueryClient } from "@tanstack/react-query";
import { fetchCompanies, selectCompanies } from "@/store/slices/companiesSlice";
import axiosClient from "@/lib/axios";
import { TASK_QUERY_KEYS } from "@/modules/tasks/constants/query-keys";
import { CHAT_QUERY_KEYS } from "@/modules/chat/constants/query-keys";
import {
  selectActiveCompanyId,
  selectCompanyContextLoading,
  switchCompanyContext,
  setActiveCompany
} from "@/store/slices/companyContextSlice";
import { resolveNotificationUrl } from "@/lib/notificationRouter";
import { toast } from "sonner";
import ChatSocketProvider from "@/modules/chat/components/ChatSocketProvider";
import FloatingChatLauncher from "@/modules/chat/components/Common/FloatingChatLauncher";

const PUBLIC_ROUTES = ["/login", "/accept-invitation", "/select-company"];

export default function AppShellClient({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  const activeCompanyId = useSelector(selectActiveCompanyId);
  const [isFollowUpsOpen, setIsFollowUpsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsFollowUpsOpen(true);
    window.addEventListener("open-followups", handleOpen);
    return () => window.removeEventListener("open-followups", handleOpen);
  }, []);
  const isSwitching = useSelector(selectCompanyContextLoading);
  const companies = useSelector(selectCompanies) || [];
  const queryClient = useQueryClient();


  // Stable ref so the socket notification handler always uses the latest router
  // without causing the socket effect to re-run on every navigation.
  const routerRef = useRef(router);
  useEffect(() => { routerRef.current = router; }, [router]);

  // 1. Fetch companies list if Super Admin
  useEffect(() => {
    if (user && user.type === "super_admin") {
      dispatch(fetchCompanies());
    }
  }, [user, dispatch]);

  // 2. Multi-Tenant Auto-Selection and Redux Synchronization
  useEffect(() => {
    // Register Service Worker for Mobile push notifications
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js")
        .then((reg) => console.log("[AppShell] Service Worker registered for notifications:", reg.scope))
        .catch((err) => console.error("[AppShell] Service Worker registration failed:", err));
    }

    if (isPublic || !user) return;

    if (user.type === "super_admin") {
      if (companies.length > 0) {
        const stored = localStorage.getItem("activeCompanyId");
        const isValid = stored && companies.some(c => c.id.toString() === stored.toString());
        if (!isValid) {
          const firstCompanyId = companies[0].id.toString();
          dispatch(switchCompanyContext(firstCompanyId));
        } else if (activeCompanyId !== stored) {
          dispatch(setActiveCompany(companies.find(c => c.id.toString() === stored.toString()) || stored));
        }
      }
    } else {
      const workspaces = user.workspaces || [];
      const stored = localStorage.getItem("activeCompanyId");
      const isValid = stored && workspaces.some(w => w.id.toString() === stored.toString());
      if (!isValid) {
        if (workspaces.length > 0) {
          const firstWorkspaceId = workspaces[0].id.toString();
          dispatch(switchCompanyContext(firstWorkspaceId));
        } else if (user.companyId) {
          dispatch(switchCompanyContext(user.companyId.toString()));
        }
      } else if (activeCompanyId !== stored) {
        dispatch(setActiveCompany(workspaces.find(w => w.id.toString() === stored.toString()) || stored));
      }
    }
  }, [user, companies, activeCompanyId, isPublic, dispatch]);

  // 3. Company-context React Query invalidation
  // Uses actual root query keys from each module so only relevant cache entries
  // are invalidated — not the entire cache (which was the previous bug).
  const prevCompanyIdRef = useRef(null);
  useEffect(() => {
    if (!activeCompanyId) return;
    const prev = prevCompanyIdRef.current;
    prevCompanyIdRef.current = activeCompanyId;

    if (prev && prev !== activeCompanyId) {
      console.log(`[AppShell] Company switched: ${prev} → ${activeCompanyId}. Invalidating scoped queries.`);
    } else if (!prev) {
      console.log(`[AppShell] Initial company context: ${activeCompanyId}. Invalidating scoped queries.`);
    }

    // Invalidate using the actual registered query key roots from each module
    queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });
    queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.all });
    queryClient.invalidateQueries({ queryKey: ['follow-ups'] });
    queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
    queryClient.invalidateQueries({ queryKey: ['leaves'] });
  }, [activeCompanyId, queryClient]);

  // 4. Socket subscriptions — Notifications + Attendance real-time events
  // NOTE: AppShell is NOT the socket owner. ChatSocketProvider (which wraps
  // AppShell's rendered output) creates and destroys the socket.
  // Because React runs child effects BEFORE parent effects, ChatSocketProvider's
  // useEffect runs first, creating the socket. Then AppShell's effect runs here
  // and getSocketInstance() returns the already-connected socket.
  useEffect(() => {
    if (isPublic || !user || !activeCompanyId) return;

    const employeeId = user.employeeId;
    const isAdmin = user.type === "super_admin" || user.type === "client_admin";
    if (!employeeId && !isAdmin) return;

    // ChatSocketProvider already created the socket — get it, don't recreate it.
    const socket = getSocketInstance();
    if (!socket) {
      console.warn("[AppShell] Socket not available yet — ChatSocketProvider may not have initialized.");
      return;
    }

    console.log("[AppShell] Attaching notification + attendance listeners to existing socket.");

    // Fetch initial notifications once.
    dispatch(fetchNotifications());

    // Request OS notification permission.
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    // ── Notification handler (named so it can be precisely removed) ──
    const handleSocketNotification = (payload) => {
      console.log("[AppShell] Received socket notification payload:", payload);

      dispatch(addSocketNotification(payload));

      const bodyMessage = payload.payload?.message || (payload.payload?.taskName ? `${payload.payload.taskName} - ${payload.payload.status || ""}` : "");

      const targetUrl = resolveNotificationUrl(payload);

      const entityType = (payload?.entityType || payload?.type || payload?.referenceType || '').toUpperCase();
      if (entityType === 'TASK' || entityType.includes('TASK')) {
        queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      } else if (entityType.includes('LEAVE')) {
        queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
        queryClient.invalidateQueries({ queryKey: ['leaves'] });
      } else if (entityType.includes('ATTENDANCE')) {
        queryClient.invalidateQueries({ queryKey: ['attendance'] });
      }

      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        try {
          if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
              registration.showNotification(payload.title, {
                body: bodyMessage,
                icon: '/agri_logo.png',
                badge: '/maple-leaf.png',
                vibrate: [200, 100, 200],
                data: { url: targetUrl }
              });
            }).catch(() => {
              new Notification(payload.title, { body: bodyMessage, icon: '/agri_logo.png' });
            });
          } else {
            const osNotification = new Notification(payload.title, {
              body: bodyMessage,
              icon: '/agri_logo.png',
            });
            osNotification.onclick = () => {
              window.focus();
              if (targetUrl && targetUrl !== "/") routerRef.current.push(targetUrl);
              osNotification.close();
            };
          }
        } catch (err) {
          console.error("[AppShell] Error creating Notification:", err);
        }
      }
    };

    // ── Attendance handlers (named for precise removal) ──
    const handleAttendanceBatchUpdate = (payload) => {
      dispatch(handleSocketBatchUpdate(payload));
    };
    const handleAttendanceSingleUpdate = (payload) => {
      if (payload && typeof payload === 'object' && payload.id) {
        dispatch(handleSocketBatchUpdate([payload]));
      }
    };
    const handleRegularizationUpdate = (payload) => {
      if (payload && typeof payload === 'object' && payload.id) {
        dispatch(handleSocketBatchUpdate([payload]));
      }
      dispatch(fetchCorrections());
    };
    const handleAttendanceUpdate = (payload) => {
      if (payload && typeof payload === 'object' && payload.id) {
        dispatch(handleSocketBatchUpdate([payload]));
      }
      dispatch(fetchCorrections());
    };

    socket.on("notification",            handleSocketNotification);
    socket.on("attendance-batch-update", handleAttendanceBatchUpdate);
    socket.on("attendance-checkin",      handleAttendanceSingleUpdate);
    socket.on("attendance-checkout",     handleAttendanceSingleUpdate);
    socket.on("attendance-update",       handleAttendanceUpdate);
    socket.on("regularization-update",  handleRegularizationUpdate);

    return () => {
      // Remove only AppShell's named handlers — do NOT call disconnectSocket().
      // ChatSocketProvider owns the socket and disconnects it when IT unmounts.
      socket.off("notification",            handleSocketNotification);
      socket.off("attendance-batch-update", handleAttendanceBatchUpdate);
      socket.off("attendance-checkin",      handleAttendanceSingleUpdate);
      socket.off("attendance-checkout",     handleAttendanceSingleUpdate);
      socket.off("attendance-update",       handleAttendanceUpdate);
      socket.off("regularization-update",  handleRegularizationUpdate);
    };
    // NOTE: `router` intentionally excluded — see routerRef above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isPublic, dispatch, activeCompanyId, queryClient]);

  if (isPublic) {
    return <>{children}</>;
  }

  return (
    <ChatSocketProvider>
      {isSwitching && (
        <div className="fixed inset-0 z-[9999] bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center animate-in fade-in duration-200">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-900 text-sm font-bold tracking-tight">Switching Company Context...</p>
          <p className="text-gray-500 text-xs mt-1">Please wait while we refresh your workspace permissions and data.</p>
        </div>
      )}
      <Header />
      <div className="flex-1 flex overflow-hidden h-full">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto h-full">{children}</main>
      </div>
      <CommandPalette />
      <FollowUpHeaderDrawer isOpen={isFollowUpsOpen} onClose={() => setIsFollowUpsOpen(false)} />
      <FloatingChatLauncher />
    </ChatSocketProvider>
  );
}
