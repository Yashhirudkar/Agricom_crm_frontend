"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments, selectDepartmentsData } from "@/store/slices/departmentsSlice";
import { fetchDesignations, selectDesignationsData } from "@/store/slices/designationsSlice";
import { updateEmployee } from "@/store/slices/employeesSlice";
import { ChevronLeft, Save, Shield, Check, AlertCircle } from "lucide-react";
import axiosClient from "@/lib/axios";

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const empId = params.id;

  const { data: departmentsObj } = useSelector(selectDepartmentsData) || { data: [] };
  const departments = departmentsObj?.data || departmentsObj || [];

  const { data: designationsObj } = useSelector(selectDesignationsData) || { data: [] };
  const designations = designationsObj?.data || designationsObj || [];

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    employeeCode: "",
    email: "",
    mobile: "",
    address: "",
    gender: "Male",
    dob: "",
    departmentId: "",
    designationId: "",
    employmentType: "Full-time",
    joiningDate: "",
    status: "Active",
    emergencyContactName: "",
    emergencyContactNumber: "",
    emergencyContactRelation: "",
    createLogin: false,
    roleId: "",
    newPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const companyId = localStorage.getItem("activeCompanyId");
        if (!companyId) return;

        dispatch(fetchDepartments({ limit: 1000 }));
        dispatch(fetchDesignations({ limit: 1000 }));

        const [rolesRes, empRes] = await Promise.all([
          axiosClient.get("/GetRoles", { headers: { "x-company-id": companyId } }).catch(() => ({ data: [] })),
          axiosClient.get(`/employees/${empId}`, { headers: { "x-company-id": companyId } })
        ]);

        setRoles(rolesRes.data || []);
        
        const emp = empRes.data;
        setForm({
          firstName: emp.firstName || "",
          lastName: emp.lastName || "",
          employeeCode: emp.employeeCode || "",
          email: emp.email || "",
          mobile: emp.mobile || "",
          address: emp.address || "",
          gender: emp.gender || "Male",
          dob: emp.dob || "",
          departmentId: emp.departmentId || "",
          designationId: emp.designationId || "",
          employmentType: emp.employmentType || "Full-time",
          joiningDate: emp.joiningDate || "",
          status: emp.status || "Active",
          emergencyContactName: emp.emergencyContactName || "",
          emergencyContactNumber: emp.emergencyContactNumber || "",
          emergencyContactRelation: emp.emergencyContactRelation || "",
          createLogin: !!emp.user,
          roleId: emp.user?.userCompanies?.[0]?.roleId || "",
          newPassword: "",
        });

      } catch (err) {
        console.error("Failed to load form data", err);
        showToast("Failed to load employee details", "error");
      } finally {
        setIsLoading(false);
      }
    };
    if (empId) fetchFormData();
  }, [dispatch, empId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { 
        ...form,
        departmentId: form.departmentId ? Number(form.departmentId) : null,
        designationId: form.designationId ? Number(form.designationId) : null,
      };
      if (payload.createLogin && payload.roleId) {
        payload.roleId = Number(payload.roleId);
      } else {
        delete payload.roleId;
      }
      
      await dispatch(updateEmployee({ id: empId, data: payload })).unwrap();
      
      showToast("Employee updated successfully!");
      setTimeout(() => router.push("/employees"), 1500);
    } catch (err) {
      showToast(err || "Failed to update employee", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-xs font-semibold text-gray-500">Loading details...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/employees")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Employee</h1>
            <p className="text-xs text-gray-400 font-medium mt-1">Update employee information.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">First Name *</label>
              <input type="text" required name="firstName" value={form.firstName} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Last Name *</label>
              <input type="text" required name="lastName" value={form.lastName} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Employee Code *</label>
              <input type="text" required name="employeeCode" value={form.employeeCode} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Date of Birth</label>
              <input type="date" name="dob" value={form.dob} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Contact Information */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Email *</label>
              <input type="email" required name="email" value={form.email} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Mobile</label>
              <input type="text" name="mobile" value={form.mobile} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Address</label>
              <textarea name="address" rows="2" value={form.address} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"></textarea>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Emergency Contact Name</label>
              <input type="text" name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Emergency Contact Number</label>
              <input type="text" name="emergencyContactNumber" value={form.emergencyContactNumber} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Emergency Contact Relation</label>
              <input type="text" name="emergencyContactRelation" value={form.emergencyContactRelation} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700" />
            </div>
          </div>
        </div>

        {/* Section 3: Employment Information */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Employment Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Department</label>
              <select name="departmentId" value={form.departmentId} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700">
                <option value="">-- Select Department --</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Designation</label>
              <select name="designationId" value={form.designationId} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700">
                <option value="">-- Select Designation --</option>
                {designations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Employment Type</label>
              <select name="employmentType" value={form.employmentType} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Joining Date</label>
              <input type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Account Access */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <h2 className="text-sm font-bold text-gray-800">Account Access</h2>
          </div>
          
          <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
            <input type="checkbox" name="createLogin" checked={form.createLogin} onChange={handleChange} className="h-4 w-4 text-[#007aff] rounded border-gray-300" />
            <div>
              <p className="text-xs font-bold text-gray-800">Has Login Account</p>
              <p className="text-[10px] text-gray-500">Enable or disable system access for this employee.</p>
            </div>
          </label>

          {form.createLogin && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 p-4 bg-blue-50/50 rounded-xl border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1">Assign System Role *</label>
                <select required name="roleId" value={form.roleId} onChange={handleChange} className="w-full border border-blue-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-gray-700 bg-white">
                  <option value="">-- Select Role --</option>
                  {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1">Change Password (Optional)</label>
                <input type="text" name="newPassword" value={form.newPassword} onChange={handleChange} placeholder="Enter new password to reset" className="w-full border border-blue-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-gray-700" />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={() => router.push("/employees")} className="px-5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold cursor-pointer">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-[#007aff] hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
