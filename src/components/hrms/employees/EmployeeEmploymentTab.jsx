export default function EmployeeEmploymentTab({ empDetails }) {
  if (!empDetails) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden">
      <div className="p-4 border-b border-gray-50 bg-gray-50/20 text-xs font-bold text-gray-800">
        Employment Details
      </div>
      <div className="p-4 space-y-3.5 text-xs">
        <div className="flex justify-between"><span className="text-gray-400 font-medium">Joining Date</span><span className="font-bold text-gray-800">{empDetails.joiningDate || "-"}</span></div>
        <div className="flex justify-between"><span className="text-gray-400 font-medium">Type</span><span className="font-bold text-gray-800">{empDetails.employmentType}</span></div>
      </div>
    </div>
  );
}
