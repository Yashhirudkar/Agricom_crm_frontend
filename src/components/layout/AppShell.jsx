"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, fetchCurrentUser } from "@/store/slices/authSlice";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import CommandPalette from "@/components/CommandPalette";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { handleSocketBatchUpdate } from "@/store/entities/attendanceSlice";
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

const PUBLIC_ROUTES = ["/login", "/accept-invitation", "/select-company"];

export default function AppShellClient({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  const activeCompanyId = useSelector(selectActiveCompanyId);
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
      // Step 1: Push into Redux — Header bell re-renders instantly
      dispatch(addSocketNotification(payload));

      // Step 2: Entity-type-specific cache invalidation
      // Each entityType maps to the correct cache layer so the relevant
      // page updates in real-time without a browser refresh.
      const entityType = (payload?.entityType || '').toUpperCase();
      if (entityType === 'TASK') {
        // Invalidate the tasks infinite-query list so TanStack Query refetches
        // in the background. All recipients on the Tasks page will see the
        // new / updated task appear immediately.
        queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      }

      // Step 3: Resolve canonical route
      const targetUrl = resolveNotificationUrl(payload);

      // Step 4: Desktop notification (only when page is backgrounded or on a different route)
      const isDifferentPage = window.location.pathname !== targetUrl;
      const isBackgrounded = document.visibilityState === "hidden";

      if (isBackgrounded || isDifferentPage) {
        if (typeof window !== "undefined" && "Notification" in window) {
          if (Notification.permission === "granted") {
            const bodyMessage = payload.payload?.message || (payload.payload?.taskName ? `${payload.payload.taskName} - ${payload.payload.status || ""}` : "");
            const notif = new Notification(payload.title, {
              body: bodyMessage,
              icon: "/agri_logo.png",
            });
            // Use resolveNotificationUrl — single source of truth for all routing
            notif.onclick = (e) => {
              e.preventDefault();
              window.focus();
              routerRef.current.push(targetUrl);
            };
          }
        }
      }
    };
    socket.on("notification", handleSocketNotification);

    const events = [
      "attendance-checkin",
      "attendance-checkout",
      "attendance-update",
      "attendance-batch-update",
    ];

    events.forEach(event => {
      socket.off(event);
      socket.on(event, (payload) => {
        if (event === "attendance-batch-update") {
          dispatch(handleSocketBatchUpdate(payload));
        } else {
          dispatch(handleSocketBatchUpdate([payload]));
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
    </>
  );
}
