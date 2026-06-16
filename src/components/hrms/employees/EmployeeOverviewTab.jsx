import { Info } from "lucide-react";

export default function EmployeeOverviewTab({ empDetails }) {
  if (!empDetails) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden">
      <div className="p-4 border-b border-gray-50 bg-gray-50/20 text-xs font-bold text-gray-800 flex items-center gap-1.5">
        <Info className="h-4 w-4 text-gray-400" />
        Employee Profile Snapshot
      </div>
      <div className="p-4 space-y-3.5 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400 font-medium">Department</span>
          <span className="font-bold text-gray-800">{empDetails.department?.name || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 font-medium">Designation</span>
          <span className="font-bold text-gray-800">{empDetails.designation?.name || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 font-medium">Branch</span>
          <span className="font-bold text-gray-800">{empDetails.branch?.name || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 font-medium">Reporting Manager</span>
          <span className="font-bold text-[#007aff]">
            {empDetails.manager ? `${empDetails.manager.firstName} ${empDetails.manager.lastName}` : "Self"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 font-medium">Status</span>
          <span className={`font-bold ${
            ['ACTIVE', 'CONFIRMED', 'PROBATION', 'ONBOARDING'].includes(empDetails.status)
              ? 'text-green-600'
              : ['RESIGNED', 'TERMINATED'].includes(empDetails.status)
                ? 'text-rose-600'
                : 'text-amber-600'
          }`}>
            {(() => {
              const statusLabels = {
                DRAFT: "Draft",
                ONBOARDING: "Onboarding",
                PROBATION: "Probation",
                ACTIVE: "Active",
                CONFIRMED: "Confirmed",
                NOTICE_PERIOD: "Notice Period",
                RESIGNED: "Resigned",
                TERMINATED: "Terminated"
              };
              return statusLabels[empDetails.status] || empDetails.status;
            })()}
          </span>
        </div>
      </div>
    </div>
  );
}
