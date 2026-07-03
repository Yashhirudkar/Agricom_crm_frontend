export default function EmployeePersonalTab({ empDetails }) {
  if (!empDetails) return null;

  const InfoRow = ({ label, value, className = "" }) => (
    <div className="grid grid-cols-[300px_1fr] gap-x-6 items-start">
      <span className="text-gray-400 font-medium">{label}</span>
      <span className={`font-semibold text-gray-600 break-words ${className}`}>
        {value || "-"}
      </span>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-50 bg-gray-50/20 text-xs font-bold text-gray-800">
        Personal Information
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 text-xs">
        <InfoRow label="Email" value={empDetails.email} />

        <InfoRow
          label="Mobile"
          value={empDetails.mobile}
        />

        <InfoRow
          label="DOB"
          value={empDetails.dob ? empDetails.dob.split("T")[0] : "-"}
        />

        <InfoRow
          label="Gender"
          value={empDetails.gender}
        />

        <InfoRow
          label="Address"
          value={empDetails.address}
        />

        <hr className="my-2 border-dashed border-gray-300" />

        <InfoRow
          label="Emergency Contact"
          value={empDetails.emergencyContactName}
        />

        <InfoRow
          label="Emergency Number"
          value={empDetails.emergencyContactNumber}
        />

        <InfoRow
          label="Relation"
          value={empDetails.emergencyContactRelation}
        />
      </div>
    </div>
  );
}