import EmployeeTimeline from "./EmployeeTimeline";

export default function EmployeeLifecycleTab({ empDetails, onRefresh }) {
  if (!empDetails) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden">
      <div className="p-4 border-b border-gray-50 bg-gray-50/20 text-xs font-bold text-gray-800">
        Lifecycle Management
      </div>
      <div className="p-2">
        <EmployeeTimeline
          empDetails={empDetails}
          onRefresh={onRefresh}
        />
      </div>
    </div>
  );
}
