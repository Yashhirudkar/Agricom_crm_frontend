import React from "react";
import Drawer from "@/components/drawers/Drawer";
import { Info } from "lucide-react";

export default function DesignationDetailsDrawer({
  drawerOpen,
  setDrawerOpen,
  selectedDesig,
  activeTab,
  setActiveTab,
}) {
  return (
    <Drawer
      isOpen={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      title={selectedDesig?.name || "Designation Details"}
      subtitle={selectedDesig?.description}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={[{ id: "overview", label: "Overview" }]}
    >
      <div className="space-y-6">
        {activeTab === "overview" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-gray-50/20 text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <Info className="h-4 w-4 text-gray-400" />
              Designation Info
            </div>
            <div className="p-4 space-y-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Department</span>
                <span className="font-bold text-gray-800">
                  {selectedDesig?.department?.name || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Status</span>
                <span
                  className={`font-bold ${
                    selectedDesig?.status === "Active" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {selectedDesig?.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Total Employees</span>
                <span className="font-bold text-gray-800">
                  {selectedDesig?.employeeCount || 0}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
