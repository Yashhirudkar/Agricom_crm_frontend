export default function EmployeeAccessTab({ empDetails }) {
  if (!empDetails) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden">
      <div className="p-4 border-b border-gray-50 bg-gray-50/20 text-xs font-bold text-gray-800">
        System Access
      </div>
      <div className="p-4 space-y-3.5 text-xs">
        {empDetails.user ? (
          <>
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Linked User Email</span>
              <span className="font-bold text-[#007aff]">{empDetails.user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-medium">Account Status</span>
              <span className="font-bold text-gray-800">{empDetails.user.status}</span>
            </div>
          </>
        ) : (
          <div className="text-gray-400 italic text-center py-4">No login account created for this employee.</div>
        )}
      </div>
    </div>
  );
}
