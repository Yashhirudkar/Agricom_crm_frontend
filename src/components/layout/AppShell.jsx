"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/authSlice";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import CommandPalette from "@/components/CommandPalette";

const PUBLIC_ROUTES = ["/login", "/accept-invitation", "/select-company"];

export default function AppShellClient({ children }) {
  const pathname = usePathname();
  const user = useSelector(selectUser);
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (user && user.type !== "super_admin") {
      const workspaces = user.workspaces || [];
      if (workspaces.length === 1) {
        localStorage.setItem("activeCompanyId", workspaces[0].id.toString());
      } else if (workspaces.length > 1) {
        // Multiple workspaces: do not auto-set activeCompanyId on login
        // to force them to go through the select-company screen
      }
    }
  }, [user]);

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
