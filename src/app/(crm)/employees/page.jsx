"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectUserType } from "@/store/slices/authSlice";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
import {
  fetchEmployees,
  deleteEmployee,
  selectEmployeesData,
  selectEmployeesLoading,
  selectEmployeesError,
} from "@/store/entities/employeesSlice";
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
import EmployeeOverviewTab from "@/components/hrms/employees/EmployeeOverviewTab";
import EmployeePersonalTab from "@/components/hrms/employees/EmployeePersonalTab";
import EmployeeEmploymentTab from "@/components/hrms/employees/EmployeeEmploymentTab";
import EmployeeAccessTab from "@/components/hrms/employees/EmployeeAccessTab";
import EmployeeLifecycleTab from "@/components/hrms/employees/EmployeeLifecycleTab";
import EmployeeDocumentsTab from "@/components/hrms/employees/EmployeeDocumentsTab";
import useDebounce from "@/hooks/useDebounce";

function EmployeesContent() {
  const dispatch = useDispatch();
  const router = useRouter();

  const userType = useSelector(selectUserType);
  const activeCompanyId = useSelector(selectActiveCompanyId) || "";


  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [departments, setDepartments] = useState([]);

  const { data: employees, total, page, totalPages } = useSelector(selectEmployeesData) || { data: [], total: 0, page: 1, totalPages: 0 };
  const isLoading = useSelector(selectEmployeesLoading);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

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
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadDepartments = async () => {
      if (activeCompanyId) {
        try {
          const res = await axiosClient.get("/departments/options", {
            params: { limit: 100 },
          });
          setDepartments(res.data?.data || res.data || []);
        } catch (err) {
          console.error("Failed to load departments options", err);
        }
      } else {
        setDepartments([]);
      }
    };
    loadDepartments();
  }, [activeCompanyId]);

  useEffect(() => {
    if (activeCompanyId) {
      dispatch(fetchEmployees({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
        departmentId: selectedDeptId || undefined
      }));
    }
  }, [dispatch, currentPage, debouncedSearch, activeCompanyId, selectedDeptId]);

  const loadFullEmployeeDetails = async (empId) => {
    try {
      const res = await axiosClient.get(`/employees/${empId}`);
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
      const res = await axiosClient.get(`/employees/${empId}/documents`);
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
          <HasPermission permission="employees:create">
            <button
              onClick={() => router.push("/employees/create")}
              className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" /> Add Employee
            </button>
          </HasPermission>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/20 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
            <div className="relative w-full sm:w-64">
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
            <select
              value={selectedDeptId}
              onChange={(e) => {
                setSelectedDeptId(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-white cursor-pointer transition-colors"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
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
              {employees.length > 0 ? (
                employees.map((emp, idx) => {
                  const isSelected = selectedEmp?.id === emp.id;
                  return (
                    <tr
                      key={`employee-${emp.id || idx}-${idx}`}
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
                        {(() => {
                          const statusConfig = {
                            DRAFT: { label: "Draft", className: "bg-gray-50 text-gray-600 border border-gray-100" },
                            ONBOARDING: { label: "Onboarding", className: "bg-blue-50 text-[#007aff] border border-blue-100" },
                            PROBATION: { label: "Probation", className: "bg-purple-50 text-purple-600 border border-purple-100" },
                            ACTIVE: { label: "Active", className: "bg-green-50 text-green-600 border border-green-100" },
                            CONFIRMED: { label: "Confirmed", className: "bg-emerald-50 text-emerald-600 border border-emerald-100" },
                            NOTICE_PERIOD: { label: "Notice Period", className: "bg-amber-50 text-amber-600 border border-amber-100" },
                            RESIGNED: { label: "Resigned", className: "bg-rose-50 text-rose-600 border border-rose-100" },
                            TERMINATED: { label: "Terminated", className: "bg-red-50 text-red-600 border border-red-100" }
                          };
                          const cfg = statusConfig[emp.status] || { label: emp.status, className: "bg-gray-50 text-gray-500 border border-gray-100" };
                          return (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cfg.className}`}>
                              {cfg.label}
                            </span>
                          );
                        })()}
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
                            className="p-1.5 rounded-lg text-[#007aff] hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Edit details"
                          >
                            <Edit2 className="h-4 w-4 inline" />
                          </button>
                        </HasPermission>
                        <HasPermission permission="employees:delete">
                          <button
                            onClick={() => setDeleteTarget(emp)}
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete employee"
                          >
                            <Trash2 className="h-4 w-4 inline" />
                          </button>
                        </HasPermission>
                      </td>
                    </tr>
                  );
                })
              ) : (
                !isLoading && (
                  <tr key="no-data">
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400 font-semibold">
                      No matching employees found.
                    </td>
                  </tr>
                )
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
          { id: "lifecycle", label: "Lifecycle" },
          { id: "access", label: "Access" },
          { id: "activity", label: "Activity" }
        ]}
      >
        <div className="space-y-6">
          {activeTab === "overview" && <EmployeeOverviewTab empDetails={empDetails} />}
          {activeTab === "personal" && <EmployeePersonalTab empDetails={empDetails} />}
          {activeTab === "employment" && <EmployeeEmploymentTab empDetails={empDetails} />}
          {activeTab === "lifecycle" && (
            <EmployeeLifecycleTab 
              empDetails={empDetails} 
              onRefresh={() => {
                loadFullEmployeeDetails(selectedEmp.id);
                dispatch(fetchEmployees({ page: currentPage, limit: itemsPerPage, search: debouncedSearch }));
              }} 
            />
          )}
          {activeTab === "access" && <EmployeeAccessTab empDetails={empDetails} />}
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
        <EmployeeDocumentsTab 
          selectedEmp={selectedEmp}
          selectedCompanyId={activeCompanyId}
          empDocuments={empDocuments}
          loadDocuments={loadDocuments}
        />
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
