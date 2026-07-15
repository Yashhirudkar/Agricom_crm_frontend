"use client";

import React, { useEffect, useState } from "react";
import { useKeyboardShortcuts } from "../hooks";
import TopToolbar from "../components/Workspace/TopToolbar";
import FilterDrawer from "../components/Workspace/FilterDrawer";
import TaskTable from "../components/TaskTable/TaskTable";
import TaskCreateDrawer from "../components/Workspace/TaskCreateDrawer";
import { useDispatch, useSelector } from "react-redux";
import { selectUserType } from "@/store/slices/authSlice";
import { fetchCompanies, selectCompanies } from "@/store/slices/companiesSlice";
import { CalendarDays } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function TaskListWorkspace() {
  // Initialize global keyboard shortcuts (/, Esc, Shift+F)
  useKeyboardShortcuts();

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const userType = useSelector(selectUserType);
  const allCompanies = useSelector(selectCompanies) || [];

  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("activeCompanyId");
      if (stored) setSelectedCompanyId(stored);
    }
  }, []);

  useEffect(() => {
    if (userType === "super_admin") {
      dispatch(fetchCompanies());
    }
  }, [dispatch, userType]);

  const handleCompanyChange = (e) => {
    const val = e.target.value;
    setSelectedCompanyId(val);
    if (val) {
      localStorage.setItem("activeCompanyId", val);
    } else {
      localStorage.removeItem("activeCompanyId");
    }
    // Invalidate task queries so they re-fetch for the newly selected company
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-[#f8f9fc]">
      {/* Top Toolbar (Always rendered, contains the Super Admin context selector) */}
      <TopToolbar 
        userType={userType}
        allCompanies={allCompanies}
        selectedCompanyId={selectedCompanyId}
        handleCompanyChange={handleCompanyChange}
      />

      {/* Main Content Area */}
      {userType === "super_admin" && !selectedCompanyId ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center max-w-md w-full shadow-sm">
            <CalendarDays className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <h2 className="text-sm font-bold text-gray-700 mb-1">Company Context Required</h2>
            <p className="text-xs text-gray-500">
              Please select a company from the dropdown in the toolbar to view and manage tasks.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
          
          {/* Table Area (Flex-1, manages its own virtual scroll) */}
          <div className="flex-1 overflow-hidden p-2 sm:p-4 bg-[#f8f9fc]">
            <TaskTable />
          </div>
          
          {/* Drawers (Absolute or Fixed positioned within the portal/app) */}
          <FilterDrawer />
          <TaskCreateDrawer />
        </div>
      )}
    </div>
  );
}
