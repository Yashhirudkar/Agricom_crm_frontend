"use client";
import { useState } from "react";
import { User, Edit2, Save, X, Lock } from "lucide-react";
import api from "@/lib/axios";

export default function PersonalInfoCard({ employee, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: employee?.firstName || "",
    lastName: employee?.lastName || "",
    mobile: employee?.mobile || "",
    personalEmail: employee?.personalEmail || "",
    dob: employee?.dob ? employee.dob.split('T')[0] : "",
    gender: employee?.gender || "",
    address: employee?.address || "",
    city: employee?.city || "",
    state: employee?.state || "",
    country: employee?.country || "",
  });

  const [emergencyData, setEmergencyData] = useState({
    emergencyContactName: employee?.emergencyContactName || "",
    emergencyContactNumber: employee?.emergencyContactNumber || "",
    emergencyContactRelation: employee?.emergencyContactRelation || "",
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await api.put('/profile/update-personal', {
        ...formData,
        dob: formData.dob || null,
        updatedAt: employee.updatedAt,
      });

      const newUpdatedAt = res.data?.updatedAt || employee.updatedAt;

      await api.put('/profile/update-emergency-contact', {
        ...emergencyData,
        updatedAt: newUpdatedAt,
      });

      setIsEditing(false);
      onUpdate();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update personal info");
    } finally {
      setSaving(false);
    }
  };

  const InputField = ({ label, value, onChange, disabled = false, locked = false, type = "text", options }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
        {label} {locked && <Lock className="h-3 w-3 text-slate-300" />}
      </label>
      {isEditing && !locked ? (
        type === 'select' && options ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all bg-white"
          >
            <option value="" disabled>Select {label}</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt.value || opt}>{opt.label || opt}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
          />
        )
      ) : (
        <p className="text-sm font-semibold text-slate-800 py-2 border border-transparent">
          {value || <span className="text-slate-300 italic">Not provided</span>}
        </p>
      )}
    </div>
  );

  const SectionHeader = ({ children }) => (
    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4 pb-3 border-b border-slate-100">
      {children}
    </h4>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500 delay-100">
      <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl text-[#007aff]">
            <User className="h-5 w-5" />
          </div>
          Personal & Contact Information
        </h3>

        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="text-sm font-bold text-[#007aff] hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all flex items-center gap-2">
            <Edit2 className="h-4 w-4" /> Edit Details
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={() => setIsEditing(false)} className="text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl transition-all flex items-center gap-2">
              <X className="h-4 w-4" /> Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="text-sm font-bold text-white bg-[#007aff] hover:bg-blue-600 px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50">
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div className="p-6 md:p-8 space-y-8">

        {/* Personal Details */}
        <div>
          <SectionHeader>Basic Details</SectionHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputField label="First Name" value={formData.firstName} onChange={v => setFormData({ ...formData, firstName: v })} />
            <InputField label="Last Name" value={formData.lastName} onChange={v => setFormData({ ...formData, lastName: v })} />
            <InputField label="Date of Birth" value={formData.dob} onChange={v => setFormData({ ...formData, dob: v })} type="date" />
            <InputField label="Gender" value={formData.gender} onChange={v => setFormData({ ...formData, gender: v })} type="select" options={['Male', 'Female', 'Other']} />
            <InputField label="Employee Code" value={employee?.employeeCode} locked={true} />
            <InputField label="Employment Type" value={employee?.employmentType?.replace('_', ' ')?.toLowerCase()?.replace(/\b\w/g, c => c.toUpperCase())} locked={true} />
            <InputField label="Joining Date" value={employee?.joiningDate ? employee.joiningDate.split('T')[0] : ''} locked={true} />
            <InputField label="Branch" value={employee?.branch?.branchName} locked={true} />
            <InputField label="Manager" value={employee?.manager ? `${employee.manager.firstName} ${employee.manager.lastName}` : ''} locked={true} />
          </div>
        </div>

        {/* Contact Details */}
        <div>
          <SectionHeader>Contact Details</SectionHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputField label="Mobile Number" value={formData.mobile} onChange={v => setFormData({ ...formData, mobile: v })} />
            <InputField label="Personal Email" value={formData.personalEmail} onChange={v => setFormData({ ...formData, personalEmail: v })} />
            <InputField label="Address" value={formData.address} onChange={v => setFormData({ ...formData, address: v })} />
            <InputField label="City" value={formData.city} onChange={v => setFormData({ ...formData, city: v })} />
            <InputField label="State" value={formData.state} onChange={v => setFormData({ ...formData, state: v })} />
            <InputField label="Country" value={formData.country} onChange={v => setFormData({ ...formData, country: v })} />
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <SectionHeader>Emergency Contact</SectionHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputField label="Contact Name" value={emergencyData.emergencyContactName} onChange={v => setEmergencyData({ ...emergencyData, emergencyContactName: v })} />
            <InputField label="Contact Number" value={emergencyData.emergencyContactNumber} onChange={v => setEmergencyData({ ...emergencyData, emergencyContactNumber: v })} />
            <InputField label="Relation" value={emergencyData.emergencyContactRelation} onChange={v => setEmergencyData({ ...emergencyData, emergencyContactRelation: v })} />
          </div>
        </div>

      </div>
    </div>
  );
}