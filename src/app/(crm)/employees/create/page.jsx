"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments, selectDepartmentsData } from "@/store/slices/departmentsSlice";
import { fetchDesignations, selectDesignationsData } from "@/store/slices/designationsSlice";
import { createEmployee } from "@/store/slices/employeesSlice";
import { ChevronLeft, Save, UploadCloud, Shield, Check, AlertCircle } from "lucide-react";
import axiosClient from "@/lib/axios";

export default function CreateEmployeePage() {
  const router = useRouter();
  const dispatch = useDispatch();

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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const companyId = localStorage.getItem("activeCompanyId");
        if (!companyId) return;

        dispatch(fetchDepartments({ limit: 1000 }));
        dispatch(fetchDesignations({ limit: 1000 }));

        const [rolesRes] = await Promise.all([
          axiosClient.get("/GetRoles", { headers: { "x-company-id": companyId } }).catch(() => ({ data: [] }))
        ]);

        setRoles(rolesRes.data || []);
      } catch (err) {
        console.error("Failed to load form data", err);
      }
    };
    fetchFormData();
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({
        fileObj: f,
        documentType: "OTHER"
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDocTypeChange = (index, value) => {
    setFiles(prev => prev.map((f, i) => i === index ? { ...f, documentType: value } : f));
  };

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Create Employee
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
      console.log("[Frontend Create] Sending payload to backend:", payload);
      
      const res = await dispatch(createEmployee(payload)).unwrap();
      const employeeId = res.id;

      // 2. Upload Documents if any
      const companyId = localStorage.getItem("activeCompanyId");
      if (files.length > 0 && companyId && employeeId) {
        for (const item of files) {
          const formData = new FormData();
          formData.append("file", item.fileObj);
          
          const uploadRes = await axiosClient.post("/attachments/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              "x-company-id": companyId,
            },
          });

          const fileUrl = uploadRes.data.fileUrl;
          const docType = item.documentType;

          await axiosClient.post(`/employees/${employeeId}/documents`, {
            documentType: docType,
            fileName: item.fileObj.name,
            fileUrl: fileUrl,
          }, {
            headers: { "x-company-id": companyId }
          });
        }
      }

      showToast("Employee created successfully!");
      setTimeout(() => router.push("/employees"), 1500);
    } catch (err) {
      showToast(err || "Failed to create employee", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add New Employee</h1>
            <p className="text-xs text-gray-400 font-medium mt-1">Complete the form below to register a new employee record.</p>
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
              <p className="text-xs font-bold text-gray-800">Create Login Account</p>
              <p className="text-[10px] text-gray-500">If checked, an account will be created so the employee can log in.</p>
            </div>
          </label>

          {form.createLogin && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 p-4 bg-blue-50/50 rounded-xl border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1">Password *</label>
                <input type="text" required name="password" value={form.password || ""} onChange={handleChange} placeholder="Enter login password" className="w-full border border-blue-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-gray-700 bg-white" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1">Assign System Role *</label>
                <select required name="roleId" value={form.roleId} onChange={handleChange} className="w-full border border-blue-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-gray-700 bg-white">
                  <option value="">-- Select Role --</option>
                  {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Documents */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
            <UploadCloud className="h-4 w-4 text-purple-500" />
            <h2 className="text-sm font-bold text-gray-800">Documents & Profile Photo</h2>
          </div>
          
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors">
            <input type="file" multiple id="fileUpload" className="hidden" onChange={handleFileChange} />
            <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center gap-2">
              <UploadCloud className="h-8 w-8 text-gray-400" />
              <span className="text-sm font-bold text-[#007aff]">Click to upload documents</span>
              <span className="text-[10px] text-gray-400">Profile Photo, Aadhaar, PAN, Resume (Max 10MB per file)</span>
            </label>
          </div>
          
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-bold text-gray-700">Selected Files:</p>
              {files.map((f, i) => (
                <div key={i} className="flex justify-between items-center text-xs p-2 bg-gray-50 border border-gray-100 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-700">{f.fileObj.name}</span>
                    <span className="text-gray-400 text-[10px]">{(f.fileObj.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={f.documentType} onChange={(e) => handleDocTypeChange(i, e.target.value)} className="border border-gray-200 rounded text-[10px] px-2 py-1 outline-none focus:border-[#007aff] bg-white text-gray-600">
                      <option value="PROFILE_PHOTO">Profile Photo</option>
                      <option value="AADHAAR">Aadhaar</option>
                      <option value="PAN">PAN</option>
                      <option value="RESUME">Resume</option>
                      <option value="OFFER_LETTER">Offer Letter</option>
                      <option value="OTHER">Other</option>
                    </select>
                    <button type="button" onClick={() => handleRemoveFile(i)} className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors font-bold">X</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={() => router.push("/employees")} className="px-5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold cursor-pointer">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-[#007aff] hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}
