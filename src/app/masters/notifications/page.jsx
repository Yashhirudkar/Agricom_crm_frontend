"use client";

import { useEffect, useState, Suspense } from "react";
import axiosClient from "@/lib/axios";
import { 
  BellRing, 
  Search, 
  Settings, 
  VolumeX, 
  Volume2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Inbox,
  Filter
} from "lucide-react";

function NotificationMasterContent() {
  const [activeTab, setActiveTab] = useState("logs"); // "logs" | "settings"
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL"); // "ALL" | "READ" | "UNREAD"
  const [toast, setToast] = useState(null);
  const [togglingUserId, setTogglingUserId] = useState(null);
  const [isAdminCopyEnabled, setIsAdminCopyEnabled] = useState(true);
  const [usersLimit, setUsersLimit] = useState(10);
  const [logsPage, setLogsPage] = useState(1);
  const [logsTotal, setLogsTotal] = useState(0);
  const [hasMoreLogs, setHasMoreLogs] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < 60) {
      if (activeTab === "logs") {
        if (hasMoreLogs && !isFetchingMore && !isLoading) {
          fetchLogs(logsPage + 1, true);
        }
      } else {
        if (usersLimit < filteredUsers.length) {
          setUsersLimit(prev => prev + 10);
        }
      }
    }
  };

  const fetchCopySetting = async () => {
    try {
      const res = await axiosClient.get("/v1/notifications/admin/copy-setting");
      if (res.data?.success) {
        setIsAdminCopyEnabled(res.data.enabled);
      }
    } catch (err) {
      console.error("Failed to fetch copy setting:", err);
    }
  };

  const handleToggleAdminCopy = async () => {
    const nextVal = !isAdminCopyEnabled;
    setIsAdminCopyEnabled(nextVal);
    try {
      const res = await axiosClient.post("/v1/notifications/admin/copy-setting", {
        enabled: nextVal
      });
      if (res.data?.success) {
        showToast(
          nextVal 
            ? "Global admin notification copying enabled" 
            : "Global admin notification copying disabled",
          "success"
        );
      }
    } catch (err) {
      console.error("Failed to toggle admin copy setting:", err);
      setIsAdminCopyEnabled(!nextVal); // revert
      showToast("Failed to update settings", "error");
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchLogs = async (pageNum = 1, append = false) => {
    if (pageNum === 1) {
      setIsLoading(true);
    } else {
      setIsFetchingMore(true);
    }
    try {
      const res = await axiosClient.get("/v1/notifications/admin/logs", {
        params: {
          page: pageNum,
          limit: 15,
          search: searchQuery,
          type: typeFilter,
          status: statusFilter,
        }
      });
      if (res.data?.success) {
        const rows = res.data.data.rows || [];
        const count = res.data.data.count || 0;
        setLogs(prev => append ? [...prev, ...rows] : rows);
        setLogsTotal(count);
        setHasMoreLogs(rows.length === 15);
        setLogsPage(pageNum);
      }
    } catch (err) {
      console.error("Failed to fetch notification logs:", err);
      showToast("Failed to load notification logs", "error");
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get("/v1/notifications/admin/users");
      if (res.data?.success) {
        setUsers(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch user notification settings:", err);
      showToast("Failed to load user settings", "error");
    }
  };

  useEffect(() => {
    if (activeTab === "logs") {
      fetchLogs(1, false);
    } else {
      setUsersLimit(10);
      fetchUsers();
    }
  }, [searchQuery, typeFilter, statusFilter, activeTab]);

  useEffect(() => {
    fetchCopySetting();
  }, []);

  const handleToggleMute = async (userId, currentPushNotifications) => {
    setTogglingUserId(userId);
    const targetMute = currentPushNotifications !== false;
    try {
      const res = await axiosClient.post("/v1/notifications/admin/toggle-mute", {
        userId,
        mute: targetMute,
      });
      if (res.data?.success) {
        const updatedPush = res.data.data.pushNotifications;
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === userId ? { ...u, pushNotifications: updatedPush } : u
          )
        );
        showToast(
          updatedPush 
            ? "Notifications enabled for this user" 
            : "Notifications muted for this user", 
          "success"
        );
      }
    } catch (err) {
      console.error("Failed to toggle mute state:", err);
      showToast("Failed to update notification settings", "error");
    } finally {
      setTogglingUserId(null);
    }
  };

  // Filter logs are handled server-side
  const filteredLogs = logs;

  // Filter users in memory
  const filteredUsers = users.filter(u => {
    const textToMatch = `${u.name} ${u.email}`.toLowerCase();
    return textToMatch.includes(searchQuery.toLowerCase());
  });

  const getRelativeTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <BellRing className="h-6 w-6 text-[#FF9500]" />
            Notification Master
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Oversee generated notifications and toggle user notification alerts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl self-start sm:self-auto border border-gray-200">
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveTab("logs");
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "logs"
                ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Inbox className="h-3.5 w-3.5" /> Notification Logs
          </button>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveTab("settings");
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Settings className="h-3.5 w-3.5" /> User Settings
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Filters Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === "logs" ? "Search notifications, titles, employees..." : "Search employees by name or email..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-xs"
            />
          </div>

          {activeTab === "logs" && (
            <div className="flex flex-wrap gap-2.5 items-center">
              {/* Type Filter */}
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-white border border-gray-300 text-xs rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium"
                >
                  <option value="ALL">All Types</option>
                  <option value="TASK">Tasks</option>
                  <option value="ENQUIRY">Enquiries</option>
                  <option value="CHAT">Chat</option>
                  <option value="CONTRACT">Contracts</option>
                  <option value="HR">HR Alerts</option>
                </select>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-gray-300 text-xs rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 font-medium"
              >
                <option value="ALL">All Status</option>
                <option value="READ">Read</option>
                <option value="UNREAD">Unread</option>
              </select>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="flex items-center gap-3 bg-orange-50/50 border border-orange-100/50 px-3.5 py-1.5 rounded-xl">
              <span className="text-xs font-semibold text-gray-700">Copy Employee Notifications to Admin:</span>
              <button
                onClick={handleToggleAdminCopy}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                  isAdminCopyEnabled ? "bg-[#FF9500]" : "bg-gray-200"
                } cursor-pointer`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    isAdminCopyEnabled ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        {/* Content Display */}
        <div 
          className="overflow-x-auto max-h-[600px] overflow-y-auto"
          onScroll={handleScroll}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-8 w-8 rounded-full border-2 border-[#FF9500] border-t-transparent animate-spin mb-3" />
              <p className="text-xs font-semibold text-gray-400">Loading data...</p>
            </div>
          ) : activeTab === "logs" ? (
            /* --- LOGS TAB --- */
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-3">Recipient</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Title & Summary</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Sent Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredLogs.map((log) => {
                  const initials = log.user?.name
                    ? log.user.name.slice(0, 2).toUpperCase()
                    : "??";
                  return (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Recipient User Info */}
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          {log.user?.avatarUrl ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${log.user.avatarUrl}`}
                              alt={log.user.name}
                              className="h-8 w-8 rounded-full object-cover border border-gray-100"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-xs">
                              {initials}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-gray-900">{log.user?.name || `User #${log.userId}`}</div>
                            <div className="text-[10px] font-medium text-gray-500">{log.user?.email || "-"}</div>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          log.type === 'TASK' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                          log.type === 'ENQUIRY' ? 'bg-cyan-50 text-cyan-700 border border-cyan-100' :
                          log.type === 'CHAT' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          'bg-gray-50 text-gray-600 border border-gray-100'
                        }`}>
                          {log.type}
                        </span>
                      </td>

                      {/* Title and Payload Details */}
                      <td className="px-6 py-3 max-w-sm truncate">
                        <div className="font-bold text-gray-800">{log.title}</div>
                        <div className="text-[10px] text-gray-400 font-medium truncate mt-0.5">
                          {log.payload?.taskName || log.payload?.message || JSON.stringify(log.payload)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          log.isRead 
                            ? 'bg-gray-100 text-gray-500' 
                            : 'bg-orange-50 text-orange-600 border border-orange-100 animate-pulse'
                        }`}>
                          {log.isRead ? "Read" : "Unread"}
                        </span>
                      </td>

                      {/* Sent Time */}
                      <td className="px-6 py-3 text-right text-gray-400 font-medium">
                        <div className="flex items-center justify-end gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-300" />
                          {getRelativeTime(log.createdAt)}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-400">
                      <Inbox className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                      <span className="font-bold text-xs">No notifications logged</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            /* --- SETTINGS TAB --- */
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-3">Employee</th>
                  <th className="px-6 py-3">Workspace Status</th>
                  <th className="px-6 py-3">Notification Alert State</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredUsers.slice(0, usersLimit).map((u) => {
                  const initials = u.name ? u.name.slice(0, 2).toUpperCase() : "??";
                  const isMuted = u.pushNotifications === false;
                  const isToggling = togglingUserId === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* User Info */}
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          {u.avatarUrl ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${u.avatarUrl}`}
                              alt={u.name}
                              className="h-8 w-8 rounded-full object-cover border border-gray-100"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-xs">
                              {initials}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-gray-900">{u.name}</div>
                            <div className="text-[10px] font-medium text-gray-500">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          u.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {u.status}
                        </span>
                      </td>

                      {/* Notification Alert State */}
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          {isMuted ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                              <VolumeX className="w-3.5 h-3.5" /> Muted
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                              <Volume2 className="w-3.5 h-3.5" /> Active
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions (Toggle Switch) */}
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end">
                          <button
                            disabled={isToggling}
                            onClick={() => handleToggleMute(u.id, u.pushNotifications)}
                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                              isMuted ? "bg-gray-200" : "bg-[#FF9500]"
                            } ${isToggling ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            <span
                              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                isMuted ? "translate-x-1" : "translate-x-5"
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-400">
                      <User className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                      <span className="font-bold text-xs">No employees found</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {activeTab === "logs" && (
          <div className="p-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-[11px] font-semibold text-gray-400">
            <span>Showing {logs.length} of {logsTotal} logs</span>
            {hasMoreLogs && <span>Scroll down to auto-load more</span>}
            {isFetchingMore && <span className="text-[#FF9500] animate-pulse">Loading more...</span>}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="p-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-[11px] font-semibold text-gray-400">
            <span>Showing {Math.min(usersLimit, filteredUsers.length)} of {filteredUsers.length} employees</span>
            {filteredUsers.length > usersLimit && <span>Scroll down to auto-load more</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function NotificationMasterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 rounded-full border-2 border-[#FF9500] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-gray-400">Loading...</p>
        </div>
      }
    >
      <NotificationMasterContent />
    </Suspense>
  );
}
