"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/store/slices/authSlice";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import CommandPalette from "@/components/CommandPalette";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { handleSocketBatchUpdate } from "@/store/entities/attendanceSlice";
import { fetchNotifications, addSocketNotification } from "@/store/slices/notificationsSlice";

const PUBLIC_ROUTES = ["/login", "/accept-invitation", "/select-company"];

export default function AppShellClient({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (user && user.type !== "super_admin") {
      const workspaces = user.workspaces || [];
      if (workspaces.length === 1) {
        localStorage.setItem("activeCompanyId", workspaces[0].id.toString());
      }
    }
  }, [user]);

  useEffect(() => {
    if (isPublic || !user) {
      return;
    }

    const activeCompanyId = localStorage.getItem("activeCompanyId") || user.lastCompanyId || user.companyId;
    const employeeId = user.employeeId;

    if (!activeCompanyId || !employeeId) {
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

    // Register notification socket listener
    socket.off("notification");
    socket.on("notification", (payload) => {
      console.log("[AppShell] Socket notification event received:", payload);
      dispatch(addSocketNotification(payload));

      const isDifferentPage = window.location.pathname !== payload.payload?.url;
      const isBackgrounded = document.visibilityState === "hidden";
      console.log("[AppShell] Popup check: isBackgrounded =", isBackgrounded, ", isDifferentPage =", isDifferentPage);

      if (isBackgrounded || isDifferentPage) {
        if (typeof window !== "undefined" && "Notification" in window) {
          if (Notification.permission === "granted") {
            const notif = new Notification(payload.title, {
              body: `${payload.payload?.taskName || ""} - ${payload.payload?.status || ""}`,
              icon: "/agri_logo.png",
            });
            notif.onclick = (e) => {
              e.preventDefault();
              window.focus();
              router.push("/tasks");
            };
          }
        }
      }
    });

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
      socket.off("notification");
      disconnectSocket();
    };
  }, [user, isPublic, dispatch]);

  if (isPublic) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <CommandPalette />
    </>
  );
}
