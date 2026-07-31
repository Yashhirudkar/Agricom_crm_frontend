"use client";

import React, { useEffect, useState } from "react";
import { useKeyboardShortcuts } from "../hooks";
import TopToolbar from "../components/Workspace/TopToolbar";
import FilterDrawer from "../components/Workspace/FilterDrawer";
import TaskTable from "../components/TaskTable/TaskTable";
import TaskCreateDrawer from "../components/Workspace/TaskCreateDrawer";
import { useDispatch, useSelector } from "react-redux";
import { selectUserType } from "@/store/slices/authSlice";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
import { CalendarDays } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function TaskListWorkspace() {
  // Initialize global keyboard shortcuts (/, Esc, Shift+F)
  useKeyboardShortcuts();

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const userType = useSelector(selectUserType);
  const activeCompanyId = useSelector(selectActiveCompanyId) || "";

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-[#f8f9fc]">
      {/* Top Toolbar */}
      <TopToolbar
        userType={userType}
        activeCompanyId={activeCompanyId}
      />

      {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">

          {/* Table Area (Flex-1, manages its own virtual scroll) */}
          <div className="flex-1 overflow-hidden p-2 sm:p-4 bg-[#f8f9fc]">
            <TaskTable />
          </div>

          {/* Drawers (Absolute or Fixed positioned within the portal/app) */}
          <FilterDrawer />
          <TaskCreateDrawer />
        </div>
    </div>
  );
}
