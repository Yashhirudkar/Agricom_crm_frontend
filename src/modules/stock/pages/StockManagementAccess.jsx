"use client";

import StockManagementPage from "./StockManagementPage";
import { usePermissions } from "@/hooks/usePermissions";

export default function StockManagementAccess() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("stock_management:view")) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">403 Access Denied</h1>
          <p className="mt-2 text-sm text-slate-500">
            You do not have permission to view Stock Management.
          </p>
        </div>
      </div>
    );
  }

  return <StockManagementPage />;
}
