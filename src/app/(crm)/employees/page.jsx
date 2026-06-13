"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectUserType } from "@/store/slices/authSlice";
import { fetchCompanies, selectCompanies } from "@/store/slices/companiesSlice";
import {
  fetchEmployees,
  deleteEmployee,
  selectEmployeesData,
  selectEmployeesLoading,
  selectEmployeesError,
} from "@/store/slices/employeesSlice";
import Drawer from "@/components/drawers/Drawer";
import ConfirmModal from "@/components/modals/ConfirmModal";
import HasPermission from "@/components/rbac/HasPermission";
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  Check,
  AlertCircle,
  Info,
  Search,
  ChevronLeft,
  ChevronRight,
  Building2,
  Shield,
  Mail,
  FileText,
  UploadCloud,
  Download,
  Eye,
  Activity,
  User as UserIcon
} from "lucide-react";
import axiosClient from "@/lib/axios";

function EmployeesContent() {
  const dispatch = useDispatch();
  const router = useRouter();

  const userType = useSelector(selectUserType);
  const allCompanies = useSelector(selectCompanies) || [];

  const { data: employees, total, page, totalPages } = useSelector(selectEmployeesData) || { data: [], total: 0, page: 1, totalPages: 0 };
  const isLoading = useSelector(selectEmployeesLoading);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("activeCompanyId");
      if (stored) setSelectedCompanyId(stored);
    }
  }, []);

  // Main Employee Drawer
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [empDetails, setEmpDetails] = useState(null);

  const [docDrawerOpen, setDocDrawerOpen] = useState(false);
  const [empDocuments, setEmpDocuments] = useState([]);
  const [pendingDocs, setPendingDocs] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Delete Target
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Query states
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (userType === "super_admin") {
      dispatch(fetchCompanies());
    }
  }, [dispatch, userType]);

  useEffect(() => {
    if (selectedCompanyId) {
      dispatch(fetchEmployees({ page: currentPage, limit: itemsPerPage, search }));
    }
  }, [dispatch, currentPage, search, selectedCompanyId]);

  const handleCompanyChange = (e) => {
    const val = e.target.value;
    setSelectedCompanyId(val);
    if (val) {
      localStorage.setItem("activeCompanyId", val);
    } else {
      localStorage.removeItem("activeCompanyId");
    }
    setCurrentPage(1);
  };

  const loadFullEmployeeDetails = async (empId) => {
    try {
      const res = await axiosClient.get(`/employees/${empId}`, {
        headers: { "x-company-id": selectedCompanyId }
      });
      setEmpDetails(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load details", "error");
    }
  };

  const handleOpenDrawer = (emp) => {
    setSelectedEmp(emp);
    setDrawerOpen(true);
    setActiveTab("overview");
    loadFullEmployeeDetails(emp.id);
  };

  const loadDocuments = async (empId) => {
    try {
      const res = await axiosClient.get(`/employees/${empId}/documents`, {
        headers: { "x-company-id": selectedCompanyId }
      });
      setEmpDocuments(res.data);
    } catch (err) {
      showToast("Failed to load documents", "error");
    }
  };

  const handleOpenDocDrawer = (e, emp) => {
    e.stopPropagation();
    setSelectedEmp(emp);
    setPendingDocs([]);
    setDocDrawerOpen(true);
    loadDocuments(emp.id);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteEmployee(deleteTarget.id)).unwrap();
      showToast("Employee deleted successfully");
      if (selectedEmp?.id === deleteTarget.id) {
        setDrawerOpen(false);
      }
      setDeleteTarget(null);
    } catch (err) {
      showToast(err || "Delete failed", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({
        fileObj: f,
        documentType: "OTHER"
      }));
      setPendingDocs(prev => [...prev, ...newFiles]);
    }
    e.target.value = null;
  };

  const handlePendingDocTypeChange = (index, value) => {
    setPendingDocs(prev => prev.map((f, i) => i === index ? { ...f, documentType: value } : f));
  };

  const handleRemovePendingDoc = (index) => {
    setPendingDocs(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfirmUpload = async () => {
    if (pendingDocs.length === 0) return;
    setIsUploading(true);

    try {
      for (const item of pendingDocs) {
        const formData = new FormData();
        formData.append("file", item.fileObj);
        
        const uploadRes = await axiosClient.post("/attachments/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-company-id": selectedCompanyId,
          },
        });

        const fileUrl = uploadRes.data.fileUrl;
        
        await axiosClient.post(`/employees/${selectedEmp.id}/documents`, {
          documentType: item.documentType,
          fileName: item.fileObj.name,
          fileUrl: fileUrl,
        }, {
          headers: { "x-company-id": selectedCompanyId }
        });
      }
      showToast("Documents uploaded successfully");
      setPendingDocs([]);
      loadDocuments(selectedEmp.id);
    } catch (err) {
      showToast("Failed to upload document", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      await axiosClient.delete(`/employees/${selectedEmp.id}/documents/${docId}`, {
        headers: { "x-company-id": selectedCompanyId }
      });
      showToast("Document deleted");
      loadDocuments(selectedEmp.id);
    } catch(err) {
      showToast("Failed to delete", "error");
    }
  }

  if (isLoading && employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading Employees...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-[#007aff]" />
            Employees
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Manage your organization's workforce and personnel records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {userType === "super_admin" && (
            <select
              value={selectedCompanyId}
              onChange={handleCompanyChange}
              className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-white"
            >
              <option value="">-- Select Company Context --</option>
              {allCompanies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
          <HasPermission permission="employees:create">
            <button
              onClick={() => router.push("/employees/create")}
              disabled={!selectedCompanyId}
              className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" /> Add Employee
            </button>
          </HasPermission>
        </div>
      </div>

      {!selectedCompanyId ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <h2 className="text-sm font-bold text-gray-700 mb-1">Company Context Required</h2>
          <p className="text-xs text-gray-500">
            {userType === "super_admin" 
              ? "Please select a company from the dropdown above to manage its employees."
              : "You do not have an active company selected. Please select or create a company first."}
          </p>
        </div>
      ) : (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/20 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] text-gray-600 transition-colors"
              placeholder="Search by name, email or code..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Total {total} Employees
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Role & Dept</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Documents</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {employees.map((emp) => {
                const isSelected = selectedEmp?.id === emp.id;
                return (
                  <tr
                    key={emp.id}
                    onClick={() => handleOpenDrawer(emp)}
                    className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${isSelected ? "bg-blue-50/40" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800">{emp.firstName} {emp.lastName}</span>
                        <span className="text-[10px] text-gray-400 font-mono mt-0.5">{emp.employeeCode}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-gray-500">
                        <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-gray-400"/> {emp.email}</div>
                        {emp.mobile && <div className="text-[10px] text-gray-400">{emp.mobile}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-gray-500">
                        <div className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-gray-400"/> {emp.designation?.name || <span className="text-gray-300 italic">No Designation</span>}</div>
                        <div className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-gray-400"/> {emp.department?.name || <span className="text-gray-300 italic">No Dept</span>}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        emp.status === 'Active' ? 'bg-green-50 text-green-600 border border-green-100' : 
                        emp.status === 'On Leave' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <HasPermission permission="documents:read">
                        <button 
                          onClick={(e) => handleOpenDocDrawer(e, emp)}
                          className="flex items-center gap-1 text-[#007aff] hover:underline font-semibold"
                        >
                          <FileText className="h-4 w-4" /> Manage
                        </button>
                      </HasPermission>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                      <HasPermission permission="employees:update">
                        <button
                          onClick={() => router.push(`/employees/${emp.id}/edit`)}
                          className="p-1 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Edit details"
                        >
                          <Edit2 className="h-4 w-4 inline" />
                        </button>
                      </HasPermission>
                      <HasPermission permission="employees:delete">
                        <button
                          onClick={() => setDeleteTarget(emp)}
                          className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete employee"
                        >
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      </HasPermission>
                    </td>
                  </tr>
                );
              })}
              {employees.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400 font-semibold">
                    No matching employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-50 bg-gray-50/20 flex items-center justify-between text-xs font-semibold text-gray-500">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-opacity cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-opacity cursor-pointer flex items-center gap-1"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
      )}

      {/* Main Employee Details Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={`${selectedEmp?.firstName || ""} ${selectedEmp?.lastName || ""}`}
        subtitle={selectedEmp?.employeeCode}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "personal", label: "Personal" },
          { id: "employment", label: "Employment" },
          { id: "access", label: "Access" },
          { id: "activity", label: "Activity" }
        ]}
      >
        <div className="space-y-6">
          {/* Overvew Tab */}
          {activeTab === "overview" && empDetails && (
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
                  <span className="text-gray-400 font-medium">Status</span>
                  <span className={`font-bold ${empDetails.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                    {empDetails.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Personal Tab */}
          {activeTab === "personal" && empDetails && (
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
          )}

          {/* Employment Tab */}
          {activeTab === "employment" && empDetails && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden">
               <div className="p-4 border-b border-gray-50 bg-gray-50/20 text-xs font-bold text-gray-800">Employment Details</div>
               <div className="p-4 space-y-3.5 text-xs">
                <div className="flex justify-between"><span className="text-gray-400 font-medium">Joining Date</span><span className="font-bold text-gray-800">{empDetails.joiningDate || "-"}</span></div>
                <div className="flex justify-between"><span className="text-gray-400 font-medium">Type</span><span className="font-bold text-gray-800">{empDetails.employmentType}</span></div>
               </div>
            </div>
          )}

          {/* Access Tab */}
          {activeTab === "access" && empDetails && (
             <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden">
               <div className="p-4 border-b border-gray-50 bg-gray-50/20 text-xs font-bold text-gray-800">System Access</div>
               <div className="p-4 space-y-3.5 text-xs">
                  {empDetails.user ? (
                    <>
                      <div className="flex justify-between"><span className="text-gray-400 font-medium">Linked User Email</span><span className="font-bold text-[#007aff]">{empDetails.user.email}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400 font-medium">Account Status</span><span className="font-bold text-gray-800">{empDetails.user.status}</span></div>
                    </>
                  ) : (
                    <div className="text-gray-400 italic text-center py-4">No login account created for this employee.</div>
                  )}
               </div>
             </div>
          )}
          
          {/* Activity Tab */}
          {activeTab === "activity" && (
            <div className="text-center py-10 text-gray-400 text-xs">
              <Activity className="h-6 w-6 mx-auto mb-2 text-gray-300" />
              Audit log integration pending...
            </div>
          )}
        </div>
      </Drawer>

      {/* Documents Drawer */}
      <Drawer
        isOpen={docDrawerOpen}
        onClose={() => setDocDrawerOpen(false)}
        title={`Documents: ${selectedEmp?.firstName || ""}`}
        subtitle="Manage employee records, KYC, and attachments."
        activeTab="docs"
        onTabChange={() => {}}
        tabs={[{ id: "docs", label: "Documents List" }]}
      >
         <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative overflow-hidden">
              <input type="file" multiple id="docUpload" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileSelect} disabled={isUploading} />
              <div className="flex flex-col items-center gap-2">
                <UploadCloud className="h-6 w-6 text-gray-400" />
                <span className="text-sm font-bold text-[#007aff]">
                  Click or drag to select files
                </span>
              </div>
            </div>

            {pendingDocs.length > 0 && (
              <div className="space-y-3 border border-blue-100 bg-blue-50/30 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-800">Pending Uploads ({pendingDocs.length})</h3>
                  <button onClick={handleConfirmUpload} disabled={isUploading} className="px-3 py-1.5 bg-[#007aff] text-white text-[10px] font-bold rounded-lg hover:bg-blue-600 disabled:opacity-50">
                    {isUploading ? "Uploading..." : "Confirm Upload"}
                  </button>
                </div>
                {pendingDocs.map((doc, i) => (
                  <div key={i} className="flex justify-between items-center text-xs p-2 bg-white border border-blue-100 rounded-lg shadow-sm">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-700 truncate max-w-[150px]">{doc.fileObj.name}</span>
                      <span className="text-gray-400 text-[10px]">{(doc.fileObj.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select value={doc.documentType} onChange={(e) => handlePendingDocTypeChange(i, e.target.value)} className="border border-gray-200 rounded text-[10px] px-1 py-1 outline-none focus:border-[#007aff] bg-gray-50 text-gray-600">
                        <option value="PROFILE_PHOTO">Profile Photo</option>
                        <option value="AADHAAR">Aadhaar</option>
                        <option value="PAN">PAN</option>
                        <option value="RESUME">Resume</option>
                        <option value="OFFER_LETTER">Offer Letter</option>
                        <option value="OTHER">Other</option>
                      </select>
                      <button type="button" onClick={() => handleRemovePendingDoc(i)} className="text-red-500 hover:bg-red-50 p-1 rounded font-bold">X</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              {empDocuments.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs font-medium border border-gray-100 rounded-xl">
                  No documents found.
                </div>
              ) : (
                empDocuments.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-white shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{doc.fileName}</p>
                        <p className="text-[10px] font-bold text-gray-400">{doc.documentType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={`http://localhost:5000${doc.fileUrl}`} target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-[#007aff] hover:bg-blue-50 rounded-lg cursor-pointer">
                        <Eye className="h-4 w-4" />
                      </a>
                      <a href={`http://localhost:5000${doc.fileUrl}`} download className="p-1.5 text-gray-400 hover:text-[#007aff] hover:bg-blue-50 rounded-lg cursor-pointer">
                        <Download className="h-4 w-4" />
                      </a>
                      <button onClick={() => handleDeleteDocument(doc.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
         </div>
      </Drawer>

      {/* Delete Cascading Confirmation Dialog */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
      />
    </div>
  );
}

export default function EmployeesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading...</p>
      </div>
    }>
      <EmployeesContent />
    </Suspense>
  );
}
