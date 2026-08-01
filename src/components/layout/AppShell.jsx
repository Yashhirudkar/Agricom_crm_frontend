"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, fetchCurrentUser } from "@/store/slices/authSlice";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import CommandPalette from "@/components/CommandPalette";
import FollowUpHeaderDrawer from "@/modules/follow-ups/components/FollowUpHeaderDrawer";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { handleSocketBatchUpdate, fetchCorrections } from "@/store/entities/attendanceSlice";
import { fetchNotifications, addSocketNotification } from "@/store/slices/notificationsSlice";
import { useQueryClient } from "@tanstack/react-query";
import { fetchCompanies, selectCompanies } from "@/store/slices/companiesSlice";
import axiosClient from "@/lib/axios";
import { TASK_QUERY_KEYS } from "@/modules/tasks/constants/query-keys";
import {
  selectActiveCompanyId,
  selectCompanyContextLoading,
  switchCompanyContext,
  setActiveCompany
} from "@/store/slices/companyContextSlice";
import { resolveNotificationUrl } from "@/lib/notificationRouter";
import { toast } from "sonner";

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

  // 3. Global React Query Invalidation Engine
  useEffect(() => {
    if (activeCompanyId) {
      console.log("[AppShell] Invalidating all queries reactively for company ID:", activeCompanyId);
      queryClient.invalidateQueries();
    }
  }, [activeCompanyId, queryClient]);

  // 4. Socket and Notifications Sync
  useEffect(() => {
    if (isPublic || !user || !activeCompanyId) {
      return;
    }

    const employeeId = user.employeeId;
    const isAdmin = user.type === "super_admin" || user.type === "client_admin";

    if (!employeeId && !isAdmin) {
      return;
    }

    // Connect global socket
    console.log("[AppShell] Connecting socket with company ID:", activeCompanyId);
    const socket = connectSocket(parseInt(activeCompanyId, 10));
    if (!socket) {
      console.warn("[AppShell] Socket connection failed or connectSocket returned null");
      return;
    }

    // Fetch initial notifications
    console.log("[AppShell] Fetching initial notifications list...");
    dispatch(fetchNotifications());

    // Notification permission request
    if (typeof window !== "undefined" && "Notification" in window) {
      console.log("[AppShell] Notification permission status:", Notification.permission);
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    // Register notification socket listener.
    // IMPORTANT: Always pass the handler reference to socket.off() — never call
    // socket.off("notification") with no callback, because that wipes ALL listeners
    // for the event (including those registered by individual pages like leave-approvals).
    const handleSocketNotification = (payload) => {
      console.log("[AppShell] Received socket notification payload:", payload);

      // Step 1: Push into Redux — Header bell re-renders instantly
      dispatch(addSocketNotification(payload));

      const bodyMessage = payload.payload?.message || (payload.payload?.taskName ? `${payload.payload.taskName} - ${payload.payload.status || ""}` : "");
      console.log("[AppShell] Extracted body message:", bodyMessage);

      // Step 2: Resolve canonical route BEFORE using it in toast
      const targetUrl = resolveNotificationUrl(payload);
      console.log("[AppShell] Resolved target URL:", targetUrl);

      // Step 3: Entity-type-specific cache invalidation
      const entityType = (payload?.entityType || payload?.type || payload?.referenceType || '').toUpperCase();
      console.log("[AppShell] Entity Type for invalidation:", entityType);
      if (entityType === 'TASK' || entityType.includes('TASK')) {
        queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      } else if (entityType.includes('LEAVE')) {
        queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
        queryClient.invalidateQueries({ queryKey: ['leaves'] });
      } else if (entityType.includes('ATTENDANCE')) {
        queryClient.invalidateQueries({ queryKey: ['attendance'] });
      }


      // Step 5: Show Desktop (OS) Notification
      console.log("[AppShell] Checking window & Notification support:", {
        hasWindow: typeof window !== "undefined",
        hasNotification: typeof window !== "undefined" && "Notification" in window
      });

      if (typeof window !== "undefined" && "Notification" in window) {
        console.log("[AppShell] Current Notification.permission:", Notification.permission);
        if (Notification.permission === "granted") {
          console.log("[AppShell] Permission granted. Triggering new Notification...");
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
                console.log("[AppShell] Notification sent via Service Worker");
              }).catch(err => {
                console.error("[AppShell] SW ready failed, falling back to Notification API", err);
                fallbackNotification();
              });
            } else {
              fallbackNotification();
            }

            function fallbackNotification() {
              const osNotification = new Notification(payload.title, {
                body: bodyMessage,
                icon: '/agri_logo.png',
                badge: '/maple-leaf.png',
              });
              console.log("[AppShell] osNotification created successfully:", osNotification);

              osNotification.onclick = () => {
                console.log("[AppShell] OS Notification clicked. Focusing window and navigating to:", targetUrl);
                window.focus();
                if (targetUrl && targetUrl !== "/") {
                  routerRef.current.push(targetUrl);
                }
                osNotification.close();
              };
            }
          } catch (err) {
            console.error("[AppShell] Error creating Notification:", err);
          }
        } else {
          console.warn("[AppShell] Cannot show OS notification. Permission is not granted:", Notification.permission);
        }
      } else {
        console.warn("[AppShell] Window or Notification API is not available.");
      }
    };
    socket.on("notification", handleSocketNotification);

    const events = [
      "attendance-checkin",
      "attendance-checkout",
      "attendance-update",
      "attendance-batch-update",
      "regularization-update",
    ];

    events.forEach(event => {
      socket.off(event);
      socket.on(event, (payload) => {
        if (event === "attendance-batch-update") {
          dispatch(handleSocketBatchUpdate(payload));
        } else if (payload && typeof payload === 'object' && payload.id) {
          dispatch(handleSocketBatchUpdate([payload]));
        }

        if (event === "regularization-update" || event === "attendance-update") {
          dispatch(fetchCorrections());
        }
      });
    });

    return () => {
      events.forEach(event => socket.off(event));
      // Pass the specific handler ref so only AppShell's listener is removed;
      // page-level listeners (leave-approvals, etc.) remain intact.
      socket.off("notification", handleSocketNotification);
      disconnectSocket();
    };
    // NOTE: `router` is intentionally excluded from deps — it changes on every
    // navigation and would cause the socket to disconnect/reconnect on every page
    // change, losing in-flight events. routerRef keeps the handler up-to-date.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isPublic, dispatch, activeCompanyId]);

  if (isPublic) {
    return <>{children}</>;
  }

  return (
    <>
      {isSwitching && (
        <div className="fixed inset-0 z-[9999] bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center animate-in fade-in duration-200">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-900 text-sm font-bold tracking-tight">Switching Company Context...</p>
          <p className="text-gray-500 text-xs mt-1">Please wait while we refresh your workspace permissions and data.</p>
        </div>
      )}
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <CommandPalette />
      <FollowUpHeaderDrawer isOpen={isFollowUpsOpen} onClose={() => setIsFollowUpsOpen(false)} />
    </>
  );
}
