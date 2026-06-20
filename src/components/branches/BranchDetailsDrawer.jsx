import React from "react";
import Drawer from "@/components/drawers/Drawer";
import { Info } from "lucide-react";

export default function BranchDetailsDrawer({
  drawerOpen,
  setDrawerOpen,
  selectedBranch,
  activeTab,
  setActiveTab,
}) {
  return (
    <Drawer
      isOpen={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      title={selectedBranch?.branchName || "Branch Details"}
      subtitle={selectedBranch?.branchCode}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={[{ id: "overview", label: "Overview" }]}
    >
      <div className="space-y-6">
        {activeTab === "overview" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-gray-50/20 text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <Info className="h-4 w-4 text-gray-400" />
              Branch Info
            </div>
            <div className="p-4 space-y-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Head Office</span>
                <span
                  className={`font-bold ${
                    selectedBranch?.isHeadOffice ? "text-[#007aff]" : "text-gray-800"
                  }`}
                >
                  {selectedBranch?.isHeadOffice ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Timezone</span>
                <span className="font-bold text-gray-800">
                  {selectedBranch?.timezone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Address</span>
                <span className="font-bold text-gray-800 max-w-[200px] text-right">
                  {selectedBranch?.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Location</span>
                <span className="font-bold text-gray-800">
                  {selectedBranch?.city}, {selectedBranch?.state} {selectedBranch?.pincode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Country</span>
                <span className="font-bold text-gray-800">
                  {selectedBranch?.country}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
