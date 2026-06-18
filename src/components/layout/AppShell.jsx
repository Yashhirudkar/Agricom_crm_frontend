"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/store/slices/authSlice";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import CommandPalette from "@/components/CommandPalette";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { handleSocketBatchUpdate } from "@/store/entities/attendanceSlice";

const PUBLIC_ROUTES = ["/login", "/accept-invitation", "/select-company"];

export default function AppShellClient({ children }) {
  const pathname = usePathname();
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
    const socket = connectSocket(parseInt(activeCompanyId, 10));
    if (!socket) return;

    const events = [
      "attendance-checkin",
      "attendance-checkout",
    ];

    events.forEach(event => {
      socket.off(event);
      socket.on(event, (payload) => {
        dispatch(handleSocketBatchUpdate([payload]));
      });
    });

    return () => {
      events.forEach(event => socket.off(event));
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
