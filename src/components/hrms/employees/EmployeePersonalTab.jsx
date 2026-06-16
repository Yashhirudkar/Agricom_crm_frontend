export default function EmployeePersonalTab({ empDetails }) {
  if (!empDetails) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden">
      <div className="p-4 border-b border-gray-50 bg-gray-50/20 text-xs font-bold text-gray-800">
        Personal Information
      </div>
      <div className="p-4 space-y-3.5 text-xs">
        <div className="flex justify-between"><span className="text-gray-400 font-medium">Email</span><span className="font-bold text-gray-800">{empDetails.email}</span></div>
        <div className="flex justify-between"><span className="text-gray-400 font-medium">Mobile</span><span className="font-bold text-gray-800">{empDetails.mobile || "-"}</span></div>
        <div className="flex justify-between"><span className="text-gray-400 font-medium">DOB</span><span className="font-bold text-gray-800">{empDetails.dob || "-"}</span></div>
        <div className="flex justify-between"><span className="text-gray-400 font-medium">Gender</span><span className="font-bold text-gray-800">{empDetails.gender || "-"}</span></div>
        <div className="flex justify-between"><span className="text-gray-400 font-medium">Address</span><span className="font-bold text-gray-800 max-w-[200px] text-right">{empDetails.address || "-"}</span></div>
        <hr className="my-2" />
        <div className="flex justify-between"><span className="text-gray-400 font-medium">Emergency Contact</span><span className="font-bold text-gray-800">{empDetails.emergencyContactName || "-"}</span></div>
        <div className="flex justify-between"><span className="text-gray-400 font-medium">Emergency Number</span><span className="font-bold text-gray-800">{empDetails.emergencyContactNumber || "-"}</span></div>
        <div className="flex justify-between"><span className="text-gray-400 font-medium">Relation</span><span className="font-bold text-gray-800">{empDetails.emergencyContactRelation || "-"}</span></div>
      </div>
    </div>
  );
}
