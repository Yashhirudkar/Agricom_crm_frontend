"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { 
  X, 
  Search, 
  Users, 
  Sparkles, 
  ChevronLeft, 
  Check, 
  MessageSquare,
  Loader2 
} from "lucide-react";
import { toast } from "sonner";
import axiosClient from "@/lib/axios";
import { useCreateConversationMutation } from "@/modules/chat/mutations/chat.mutations";
import { setActiveConversationId } from "@/modules/chat/store/chatSlice";
import usePermissions from "@/hooks/usePermissions";

export default function CreateConversationModal({ isOpen, onClose, currentUser, companyId }) {
  const dispatch = useDispatch();
  const createConversationMutation = useCreateConversationMutation();

  // Modal Step: "SELECT_CONTACT", "CREATE_GROUP", "CREATE_CHANNEL"
  const [step, setStep] = useState("SELECT_CONTACT");
  
  // List of loaded employees
  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  // Common Search query for filtering employees
  const [searchQuery, setSearchQuery] = useState("");

  // Group / Channel forms state
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check permissions to load full employee list vs fallback options
  const { hasPermission } = usePermissions();
  const canReadEmployees = hasPermission("employees:read");
  const canReadDepartments = hasPermission("departments:read");
  const canReadDesignations = hasPermission("designations:read");

  // Fetch employees on mount / open
  useEffect(() => {
    if (!isOpen) return;
    
    const loadEmployees = async () => {
      setIsLoadingEmployees(true);
      if (!canReadEmployees) {
        // Fallback directly to avoid 403 console errors for unauthorized users
        try {
          // Fallback: Fetch assignable list
          const assignableRes = await axiosClient.get("/v1/tasks/employees/assignable");
          const assignableList = assignableRes.data?.data || [];
          
          // Load departments and designations maps to resolve names
          let depts = [];
          let desigs = [];
          if (canReadDepartments) {
            try {
              const dRes = await axiosClient.get("/departments/options", { params: { limit: 250 } });
              depts = dRes.data?.data || dRes.data || [];
            } catch (e) {}
          }
          if (canReadDesignations) {
            try {
              const dsRes = await axiosClient.get("/designations/options", { params: { limit: 250 } });
              desigs = dsRes.data?.data || dsRes.data || [];
            } catch (e) {}
          }
          
          const deptMap = Object.fromEntries(depts.map(d => [d.value, d.label]));
          const desigMap = Object.fromEntries(desigs.map(d => [d.value, d.label]));
          
          const mappedFallback = assignableList.map(emp => {
            const userObj = emp.user || {};
            return {
              id: emp.id,
              userId: emp.userId,
              name: `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || userObj.name || emp.email,
              email: emp.email || userObj.email,
              department: deptMap[emp.departmentId] || "Staff",
              designation: desigMap[emp.designationId] || "Employee",
              avatarUrl: userObj.avatarUrl || null
            };
          }).filter(e => e.userId && e.userId !== currentUser?.id);
          
          setEmployees(mappedFallback);
        } catch (fallbackErr) {
          console.error("Assignable employees fallback failed", fallbackErr);
          toast.error("Failed to load employee list.");
        } finally {
          setIsLoadingEmployees(false);
        }
        return;
      }

      try {
        // Try the populated /employees list first
        const res = await axiosClient.get("/employees", { params: { limit: 500 } });
        const list = res.data?.data || res.data || [];
        
        // Map and filter (ensure they have userId, and are not the current user)
        const mapped = list.map(emp => ({
          id: emp.id,
          userId: emp.userId,
          name: `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || emp.email,
          email: emp.email,
          department: emp.department?.name || "Staff",
          designation: emp.designation?.name || "Employee",
          avatarUrl: emp.avatarUrl || null
        })).filter(e => e.userId && e.userId !== currentUser?.id);
        
        setEmployees(mapped);
      } catch (err) {
        console.warn("Direct employees fetch failed, attempting assignable fallback...", err);
        try {
          // Fallback: Fetch assignable list
          const assignableRes = await axiosClient.get("/v1/tasks/employees/assignable");
          const assignableList = assignableRes.data?.data || [];
          
          // Load departments and designations maps to resolve names
          let depts = [];
          let desigs = [];
          if (canReadDepartments) {
            try {
              const dRes = await axiosClient.get("/departments/options", { params: { limit: 250 } });
              depts = dRes.data?.data || dRes.data || [];
            } catch (e) {}
          }
          if (canReadDesignations) {
            try {
              const dsRes = await axiosClient.get("/designations/options", { params: { limit: 250 } });
              desigs = dsRes.data?.data || dsRes.data || [];
            } catch (e) {}
          }
          
          const deptMap = Object.fromEntries(depts.map(d => [d.value, d.label]));
          const desigMap = Object.fromEntries(desigs.map(d => [d.value, d.label]));
          
          const mappedFallback = assignableList.map(emp => {
            const userObj = emp.user || {};
            return {
              id: emp.id,
              userId: emp.userId,
              name: `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || userObj.name || emp.email,
              email: emp.email || userObj.email,
              department: deptMap[emp.departmentId] || "Staff",
              designation: desigMap[emp.designationId] || "Employee",
              avatarUrl: userObj.avatarUrl || null
            };
          }).filter(e => e.userId && e.userId !== currentUser?.id);
          
          setEmployees(mappedFallback);
        } catch (fallbackErr) {
          console.error("Assignable employees fallback failed", fallbackErr);
          toast.error("Failed to load employee list.");
        }
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    loadEmployees();
  }, [isOpen, currentUser, canReadEmployees, canReadDepartments, canReadDesignations]);

  // Reset form when modal closes or step changes
  useEffect(() => {
    if (!isOpen) {
      setStep("SELECT_CONTACT");
      setSearchQuery("");
      setFormName("");
      setFormDesc("");
      setSelectedMemberIds([]);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Filtered employees list based on search bar
  const filteredEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return employees;
    return employees.filter(emp => 
      emp.name.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.department.toLowerCase().includes(query) ||
      emp.designation.toLowerCase().includes(query)
    );
  }, [employees, searchQuery]);

  // Map of selected members lookup
  const selectedMembersMap = useMemo(() => {
    return new Set(selectedMemberIds);
  }, [selectedMemberIds]);

  const selectedEmployeesList = useMemo(() => {
    return employees.filter(emp => selectedMembersMap.has(emp.userId));
  }, [employees, selectedMembersMap]);

  // Deterministic colorful avatar generator
  const getAvatarStyle = (name) => {
    const colors = [
      "bg-rose-100 text-rose-700 border-rose-200",
      "bg-sky-100 text-sky-700 border-sky-200",
      "bg-emerald-100 text-emerald-700 border-emerald-200",
      "bg-amber-100 text-amber-700 border-amber-200",
      "bg-purple-100 text-purple-700 border-purple-200",
      "bg-pink-100 text-pink-700 border-pink-200",
      "bg-indigo-100 text-indigo-700 border-indigo-200",
      "bg-teal-100 text-teal-700 border-teal-200",
    ];
    let hash = 0;
    const cleanName = name || "Staff Member";
    for (let i = 0; i < cleanName.length; i++) {
      hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (name) => {
    if (!name) return "EE";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Toggle member selection
  const toggleMember = (userId) => {
    setSelectedMemberIds(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Start DIRECT MESSAGE conversation
  const handleStartDM = async (recipientUserId, recipientName) => {
    try {
      setIsSubmitting(true);
      const conversation = await createConversationMutation.mutateAsync({
        type: "DIRECT",
        memberUserIds: [recipientUserId],
      });
      
      dispatch(setActiveConversationId(conversation.id));
      toast.success(`Direct Message started with ${recipientName}`);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to start Direct Message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create GROUP / CHANNEL conversation
  const handleCreateGroupOrChannel = async (type) => {
    if (!formName.trim()) {
      toast.error("Name is required");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const conversation = await createConversationMutation.mutateAsync({
        name: formName.trim(),
        type: type,
        description: formDesc.trim() || undefined,
        memberUserIds: selectedMemberIds,
      });

      dispatch(setActiveConversationId(conversation.id));
      toast.success(`${type === "GROUP" ? "Private Group" : "Public Channel"} created successfully!`);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create conversation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 shadow-2xl rounded-xl w-full max-w-md h-[80vh] max-h-[600px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200/80 bg-slate-50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            {step !== "SELECT_CONTACT" && (
              <button 
                onClick={() => {
                  setStep("SELECT_CONTACT");
                  setSearchQuery("");
                }}
                className="p-1 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            <h3 className="font-bold text-slate-900 text-sm">
              {step === "SELECT_CONTACT" && "New Chat"}
              {step === "CREATE_GROUP" && "New Group"}
              {step === "CREATE_CHANNEL" && "New Channel"}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* STEP 1: SELECT CONTACT */}
        {step === "SELECT_CONTACT" && (
          <>
            {/* Search inputs */}
            <div className="p-3 bg-white border-b border-slate-100 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search employee, email, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Actions (only show when not searching) */}
            {!searchQuery && (
              <div className="p-2 bg-slate-50/50 border-b border-slate-100 flex-shrink-0 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setStep("CREATE_GROUP")}
                  className="flex items-center justify-center gap-2 p-2 hover:bg-white border border-slate-200 hover:border-blue-400 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all cursor-pointer shadow-xs"
                >
                  <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Users className="h-3.5 w-3.5" />
                  </div>
                  New Group
                </button>
                <button
                  onClick={() => setStep("CREATE_CHANNEL")}
                  className="flex items-center justify-center gap-2 p-2 hover:bg-white border border-slate-200 hover:border-amber-400 rounded-lg text-xs font-semibold text-slate-700 hover:text-amber-600 transition-all cursor-pointer shadow-xs"
                >
                  <div className="h-6 w-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  New Channel
                </button>
              </div>
            )}

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto min-h-0 bg-white">
              <div className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                Contacts Directory ({filteredEmployees.length})
              </div>

              {isLoadingEmployees ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  <span className="text-xs font-medium">Loading phonebook...</span>
                </div>
              ) : filteredEmployees.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-450 text-center px-4">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mb-2 border border-slate-200">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">No assignable employees found</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Ensure roles & departments are configured.</span>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredEmployees.map((emp) => {
                    const avatarStyle = getAvatarStyle(emp.name);
                    return (
                      <div
                        key={`emp-dm-${emp.userId}`}
                        onClick={() => handleStartDM(emp.userId, emp.name)}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        {/* Avatar */}
                        {emp.avatarUrl ? (
                          <img
                            src={emp.avatarUrl}
                            alt={emp.name}
                            className="h-9 w-9 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className={`h-9 w-9 rounded-full border flex items-center justify-center text-xs font-bold ${avatarStyle}`}>
                            {getInitials(emp.name)}
                          </div>
                        )}

                        {/* Text description */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-xs truncate leading-snug">{emp.name}</p>
                          <p className="text-[10px] text-slate-450 text-slate-400 font-medium truncate mt-0.5">
                            {emp.designation} • {emp.department}
                          </p>
                        </div>

                        {/* Quick DM indicator */}
                        <MessageSquare className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-500 transition-colors mr-1" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* STEP 2: CREATE GROUP */}
        {step === "CREATE_GROUP" && (
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            {/* Form details */}
            <div className="p-4 border-b border-slate-100 space-y-3 flex-shrink-0 bg-slate-50/50">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Group Name</label>
                <input
                  type="text"
                  placeholder="e.g. Finance Hub"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  maxLength={50}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description (Optional)</label>
                <textarea
                  placeholder="Group description..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none h-16"
                  maxLength={150}
                />
              </div>
            </div>

            {/* Selected Members Pills container */}
            {selectedEmployeesList.length > 0 && (
              <div className="px-4 py-2 border-b border-slate-100 bg-white flex-shrink-0 flex items-center gap-1.5 overflow-x-auto min-h-[46px]">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 mr-1">Added:</span>
                <div className="flex items-center gap-1.5 pb-0.5">
                  {selectedEmployeesList.map(emp => (
                    <div 
                      key={`pill-${emp.userId}`}
                      onClick={() => toggleMember(emp.userId)}
                      className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 hover:bg-red-50 hover:border-red-100 text-blue-700 hover:text-red-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shrink-0"
                      title="Remove member"
                    >
                      {emp.name.split(" ")[0]}
                      <X className="h-2.5 w-2.5" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Member search */}
            <div className="px-4 py-2 border-b border-slate-100 flex-shrink-0 flex items-center">
              <Search className="h-3.5 w-3.5 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search member to add..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X className="h-3 w-3 text-slate-400" />
                </button>
              )}
            </div>

            {/* Select Members checkbox list */}
            <div className="flex-1 overflow-y-auto min-h-0 bg-white">
              <div className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                Select Members ({filteredEmployees.length})
              </div>

              {filteredEmployees.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No matching employees.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredEmployees.map((emp) => {
                    const isSelected = selectedMembersMap.has(emp.userId);
                    const avatarStyle = getAvatarStyle(emp.name);
                    return (
                      <div
                        key={`select-group-${emp.userId}`}
                        onClick={() => toggleMember(emp.userId)}
                        className={`flex items-center gap-3 p-3 transition-colors cursor-pointer ${
                          isSelected ? "bg-blue-50/30" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => {}} // Handled by parent div onClick
                            className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </div>

                        {/* Avatar */}
                        {emp.avatarUrl ? (
                          <img
                            src={emp.avatarUrl}
                            alt={emp.name}
                            className="h-8 w-8 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className={`h-8 w-8 rounded-full border flex items-center justify-center text-[10px] font-bold ${avatarStyle}`}>
                            {getInitials(emp.name)}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-xs truncate leading-snug">{emp.name}</p>
                          <p className="text-[9px] text-slate-400 font-medium truncate mt-0.5">
                            {emp.designation} • {emp.department}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer action button */}
            <div className="p-4 border-t border-slate-200/80 bg-slate-50 flex-shrink-0">
              <button
                onClick={() => handleCreateGroupOrChannel("GROUP")}
                disabled={!formName.trim() || isSubmitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Creating Group...
                  </>
                ) : (
                  "Create Group"
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CREATE CHANNEL */}
        {step === "CREATE_CHANNEL" && (
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            {/* Form details */}
            <div className="p-4 border-b border-slate-100 space-y-3 flex-shrink-0 bg-slate-50/50">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Channel Name</label>
                <input
                  type="text"
                  placeholder="e.g. announcements"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  maxLength={50}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description (Optional)</label>
                <textarea
                  placeholder="Channel description..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none h-16"
                  maxLength={150}
                />
              </div>
            </div>

            {/* Selected Members Pills container */}
            {selectedEmployeesList.length > 0 && (
              <div className="px-4 py-2 border-b border-slate-100 bg-white flex-shrink-0 flex items-center gap-1.5 overflow-x-auto min-h-[46px]">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 mr-1">Pre-added:</span>
                <div className="flex items-center gap-1.5 pb-0.5">
                  {selectedEmployeesList.map(emp => (
                    <div 
                      key={`pill-chan-${emp.userId}`}
                      onClick={() => toggleMember(emp.userId)}
                      className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 hover:bg-red-50 hover:border-red-100 text-amber-700 hover:text-red-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shrink-0"
                      title="Remove member"
                    >
                      {emp.name.split(" ")[0]}
                      <X className="h-2.5 w-2.5" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Member search */}
            <div className="px-4 py-2 border-b border-slate-100 flex-shrink-0 flex items-center">
              <Search className="h-3.5 w-3.5 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search member to pre-add..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X className="h-3 w-3 text-slate-400" />
                </button>
              )}
            </div>

            {/* Select Members checkbox list */}
            <div className="flex-1 overflow-y-auto min-h-0 bg-white">
              <div className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                Pre-add Members ({filteredEmployees.length})
              </div>

              {filteredEmployees.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No matching employees.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredEmployees.map((emp) => {
                    const isSelected = selectedMembersMap.has(emp.userId);
                    const avatarStyle = getAvatarStyle(emp.name);
                    return (
                      <div
                        key={`select-channel-${emp.userId}`}
                        onClick={() => toggleMember(emp.userId)}
                        className={`flex items-center gap-3 p-3 transition-colors cursor-pointer ${
                          isSelected ? "bg-amber-50/20" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => {}} // Handled by parent div onClick
                            className="h-3.5 w-3.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                          />
                        </div>

                        {/* Avatar */}
                        {emp.avatarUrl ? (
                          <img
                            src={emp.avatarUrl}
                            alt={emp.name}
                            className="h-8 w-8 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className={`h-8 w-8 rounded-full border flex items-center justify-center text-[10px] font-bold ${avatarStyle}`}>
                            {getInitials(emp.name)}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-xs truncate leading-snug">{emp.name}</p>
                          <p className="text-[9px] text-slate-400 font-medium truncate mt-0.5">
                            {emp.designation} • {emp.department}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer action button */}
            <div className="p-4 border-t border-slate-200/80 bg-slate-50 flex-shrink-0">
              <button
                onClick={() => handleCreateGroupOrChannel("CHANNEL")}
                disabled={!formName.trim() || isSubmitting}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Creating Channel...
                  </>
                ) : (
                  "Create Channel"
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
