"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
import { biometricApi } from "@/api/biometric.api";
import axiosClient from "@/lib/axios";
import {
  Cpu,
  Plus,
  Edit2,
  Trash2,
  Key,
  Copy,
  Check,
  AlertCircle,
  Clock,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Database,
  Link2,
  Wifi,
  WifiOff,
  UserCheck,
  Eye,
  EyeOff,
  Sparkles,
  BarChart4,
  Flame,
  Hourglass,
  CheckCircle2,
  Radio,
} from "lucide-react";

export default function BiometricAdminPage() {
  const activeCompanyId = useSelector(selectActiveCompanyId);

  // Core tabs: 'devices', 'unmapped', 'logs'
  const [activeTab, setActiveTab] = useState("devices");
  const [toast, setToast] = useState(null);

  // Telemetry metrics
  const [metrics, setMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(false);

  // States
  const [devices, setDevices] = useState([]);
  const [devicesLoading, setDevicesLoading] = useState(true);

  const [unmappedUsers, setUnmappedUsers] = useState([]);
  const [unmappedLoading, setUnmappedLoading] = useState(false);

  const [logs, setLogs] = useState([]);
  const [logsCount, setLogsCount] = useState(0);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logPage, setLogPage] = useState(1);
  const [logStatusFilter, setLogStatusFilter] = useState("");
  const [logUserSearch, setLogUserSearch] = useState("");

  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);

  // Modals / Forms
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceForm, setDeviceForm] = useState({
    name: "",
    ipAddress: "",
    port: 4370,
    serialNumber: "",
    branchId: "",
    timeOffset: 0,
    maintenanceMode: false,
  });

  // Copy/Reveal/Regen States
  const [copiedKey, setCopiedKey] = useState(null);
  const [revealedKeys, setRevealedKeys] = useState({}); // deviceId -> boolean
  const [regeneratingId, setRegeneratingId] = useState(null);
  const [probingId, setProbingId] = useState(null);
  const [syncingId, setSyncingId] = useState(null);

  // User mapping state
  const [mappingTargets, setMappingTargets] = useState({}); // biometricUserId -> employeeId
  const [selectedUnmapped, setSelectedUnmapped] = useState({}); // biometricUserId -> boolean
  const [bulkEmployeeTarget, setBulkEmployeeTarget] = useState("");
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch branches options
  const fetchBranches = async () => {
    try {
      const res = await axiosClient.get("/branches/options");
      setBranches(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to load branches", err);
    }
  };

  // Fetch employee options for dropdown
  const fetchEmployeesList = async () => {
    try {
      const res = await axiosClient.get("/employees/options");
      setEmployees(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to load employees list", err);
    }
  };

  // Load Devices
  const loadDevices = async () => {
    setDevicesLoading(true);
    try {
      const data = await biometricApi.getDevices();
      setDevices(data || []);
    } catch (err) {
      showToast("Failed to fetch biometric devices", "error");
    } finally {
      setDevicesLoading(false);
    }
  };

  // Load Unmapped Users
  const loadUnmappedUsers = async () => {
    setUnmappedLoading(true);
    try {
      const data = await biometricApi.getUnknownUsers();
      setUnmappedUsers(data || []);
      // Reset selected states
      setSelectedUnmapped({});
    } catch (err) {
      showToast("Failed to fetch unmapped biometric users", "error");
    } finally {
      setUnmappedLoading(false);
    }
  };

  // Load Punch Logs
  const loadPunchLogs = async () => {
    setLogsLoading(true);
    try {
      const limit = 15;
      const offset = (logPage - 1) * limit;
      const params = {
        limit,
        offset,
        status: logStatusFilter || undefined,
        biometricUserId: logUserSearch || undefined,
      };
      const res = await biometricApi.getPunchLogs(params);
      setLogs(res.rows || []);
      setLogsCount(res.count || 0);
    } catch (err) {
      showToast("Failed to fetch punch logs", "error");
    } finally {
      setLogsLoading(false);
    }
  };

  // Load Telemetry Metrics
  const loadMetrics = async () => {
    setMetricsLoading(true);
    try {
      const data = await biometricApi.getMetrics();
      setMetrics(data);
    } catch (err) {
      console.error("Failed to load metrics telemetry", err);
    } finally {
      setMetricsLoading(false);
    }
  };

  useEffect(() => {
    if (activeCompanyId) {
      fetchBranches();
      fetchEmployeesList();
      if (activeTab === "devices") {
        loadDevices();
        loadMetrics();
      }
      if (activeTab === "unmapped") loadUnmappedUsers();
      if (activeTab === "logs") {
        loadPunchLogs();
        loadMetrics();
      }
    }
  }, [activeCompanyId, activeTab, logPage, logStatusFilter, logUserSearch]);

  // Handle Save Device
  const handleSaveDevice = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...deviceForm,
        port: Number(deviceForm.port) || 4370,
        branchId: deviceForm.branchId ? Number(deviceForm.branchId) : null,
        timeOffset: Number(deviceForm.timeOffset) || 0,
        maintenanceMode: deviceForm.maintenanceMode,
      };

      if (selectedDevice) {
        await biometricApi.updateDevice(selectedDevice.id, payload);
        showToast("Device configuration updated successfully");
      } else {
        await biometricApi.registerDevice(payload);
        showToast("New biometric device registered successfully");
      }
      setIsDeviceModalOpen(false);
      loadDevices();
      loadMetrics();
    } catch (err) {
      const responseData = err.response?.data;
      let errorMsg = "Failed to save device details";

      if (responseData) {
        if (typeof responseData.message === "string") {
          errorMsg = responseData.message;
        } else if (Array.isArray(responseData.message)) {
          errorMsg = responseData.message.join(", ");
        } else if (responseData.error && typeof responseData.error === "string") {
          errorMsg = responseData.error;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }

      showToast(errorMsg, "error");
    }
  };

  const handleOpenRegister = () => {
    setSelectedDevice(null);
    setDeviceForm({
      name: "",
      ipAddress: "",
      port: 4370,
      serialNumber: "",
      branchId: "",
      timeOffset: 0,
      maintenanceMode: false,
    });
    setIsDeviceModalOpen(true);
  };

  const handleOpenEdit = (dev) => {
    setSelectedDevice(dev);
    setDeviceForm({
      name: dev.name,
      ipAddress: dev.ipAddress,
      port: dev.port,
      serialNumber: dev.serialNumber,
      branchId: dev.branchId || "",
      timeOffset: dev.timeOffset || 0,
      maintenanceMode: dev.maintenanceMode || false,
    });
    setIsDeviceModalOpen(true);
  };

  const handleProbeDevice = async (id) => {
    setProbingId(id);
    try {
      const res = await biometricApi.probeDevice(id);
      if (res.status === 'ONLINE') {
        showToast(`✅ Device is ONLINE. Heartbeat updated.`);
      } else {
        showToast(`⚠️ Device is OFFLINE. TCP connection failed.`, 'error');
      }
      loadDevices();
      loadMetrics();
    } catch (err) {
      showToast('Probe request failed', 'error');
    } finally {
      setProbingId(null);
    }
  };

  const handleSyncDevice = async (id, deviceName) => {
    setSyncingId(id);
    showToast(`⏳ Sync started for ${deviceName}...`, "info");
    try {
      const res = await biometricApi.syncDevice(id);

      const recordsImported = res.recordsImported || res.recordsRead || 0;
      if (recordsImported > 0) {
        showToast(`✅ ${recordsImported} attendance records imported.`);
      } else {
        showToast("ℹ️ No new attendance found.", "info");
      }

      if (res.unknownUsers && res.unknownUsers > 0) {
        setTimeout(() => {
          showToast(`⚠️ Unknown users: ${res.unknownUsers}`, "error");
        }, 1200);
      }

      // Auto-refresh all sections
      loadDevices();
      loadMetrics();
      loadUnmappedUsers();
      if (activeTab === "logs") loadPunchLogs();
    } catch (err) {
      showToast(err.response?.data?.message || "Manual sync request failed", "error");
    } finally {
      setSyncingId(null);
    }
  };

  const handleDeleteDevice = async (id) => {
    if (window.confirm("Are you sure you want to delete this biometric device? All logs will be retained for audit logs verification.")) {
      try {
        await biometricApi.deleteDevice(id);
        showToast("Device soft-deleted successfully");
        loadDevices();
        loadMetrics();
      } catch (err) {
        showToast("Failed to delete biometric device", "error");
      }
    }
  };

  // Copy / Toggle Reveal HMAC Key
  const handleCopyKey = (key, id) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    showToast("HMAC security secret token copied");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleRevealKey = (id) => {
    setRevealedKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRegenerateKey = async (id) => {
    if (window.confirm("CRITICAL: Regenerating the HMAC key will break current Sync Agent communication until the new key is configured in the agent config. Proceed?")) {
      setRegeneratingId(id);
      try {
        const res = await biometricApi.regenerateKey(id);
        showToast("HMAC key regenerated successfully. configVersion bumped.");
        loadDevices();
      } catch (err) {
        showToast("Failed to regenerate key", "error");
      } finally {
        setRegeneratingId(null);
      }
    }
  };

  // Single User Mapping
  const handleMapUser = async (biometricUserId) => {
    const employeeId = mappingTargets[biometricUserId];
    if (!employeeId) {
      showToast("Please select an employee to map", "error");
      return;
    }
    try {
      await biometricApi.mapUser(biometricUserId, Number(employeeId));
      showToast(`User mapped. Ingestion logs re-queued.`);
      setUnmappedUsers((prev) => prev.filter((u) => u.biometricUserId !== biometricUserId));
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Mapping failed";
      showToast(errMsg, "error");
    }
  };

  // Bulk User Mapping
  const handleBulkMapUsers = async () => {
    const idsToMap = Object.keys(selectedUnmapped).filter(id => selectedUnmapped[id]);
    if (idsToMap.length === 0) {
      showToast("Please select at least one unmapped user check box", "error");
      return;
    }
    if (!bulkEmployeeTarget) {
      showToast("Please select the target employee for bulk assignment", "error");
      return;
    }

    setBulkActionLoading(true);
    try {
      const mappings = idsToMap.map(biometricUserId => ({
        biometricUserId,
        employeeId: Number(bulkEmployeeTarget),
      }));

      const res = await biometricApi.mapUserBulk(mappings);
      showToast(`Bulk mapped successfully. Re-queued ${res.totalUpdatedLogs} logs.`);
      loadUnmappedUsers();
      setBulkEmployeeTarget("");
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Bulk mapping request failed";
      showToast(errMsg, "error");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleSelectAllUnmapped = (e) => {
    const checked = e.target.checked;
    const newSelected = {};
    if (checked) {
      unmappedUsers.forEach(u => {
        newSelected[u.biometricUserId] = true;
      });
    }
    setSelectedUnmapped(newSelected);
  };

  // Retry processing handlers
  const handleRetryPunch = async (id) => {
    try {
      await biometricApi.retryFailed(id);
      showToast("Punch log reset to PENDING with HIGH priority.");
      loadPunchLogs();
      loadMetrics();
    } catch (err) {
      showToast("Failed to retry punch", "error");
    }
  };

  const handleRetryAllFailed = async () => {
    if (window.confirm("Are you sure you want to requeue all failed punches in the company?")) {
      try {
        const res = await biometricApi.retryAllFailed();
        showToast(`Successfully requeued ${res.updatedCount} punches at HIGH priority.`);
        loadPunchLogs();
        loadMetrics();
      } catch (err) {
        showToast("Failed to bulk-requeue logs", "error");
      }
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Toast Notification Floating Banner */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200 ${
          toast.type === "error"
            ? "bg-rose-50 border-rose-200 text-rose-700"
            : toast.type === "info"
            ? "bg-blue-50 border-blue-200 text-blue-700"
            : "bg-green-50 border-green-200 text-green-700"
        }`}>
          {toast.type === "error" ? (
            <AlertCircle className="h-4 w-4 text-rose-500 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Cpu className="h-6 w-6 text-[#007aff]" />
            Enterprise Biometric Integration
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Configure LAN Sync Agents, manage priority queues, map employee profiles in bulk, and monitor real-time queue latency performance.
          </p>
        </div>
        {activeTab === "devices" && (
          <button
            onClick={handleOpenRegister}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" /> Register Device
          </button>
        )}
      </div>

      {/* Telemetry Metrics Dashboard (Visible on logs and devices tabs) */}
      {metrics && (activeTab === "devices" || activeTab === "logs") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center gap-4 relative overflow-hidden">
            <div className="p-3 bg-blue-50 text-[#007aff] rounded-xl">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Devices Connected</span>
              <span className="text-xl font-black text-gray-800 mt-1 block">
                {metrics.devices.online} / {metrics.devices.total}
              </span>
              {metrics.devices.inMaintenance > 0 && (
                <span className="text-[9px] text-amber-500 font-bold block mt-0.5">⚠️ {metrics.devices.inMaintenance} in maintenance</span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Hourglass className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Current Queue Size</span>
              <span className="text-xl font-black text-gray-800 mt-1 block">
                {metrics.queue.currentQueueSize} pending
              </span>
              {metrics.queue.oldestPendingPunchDelaySeconds > 0 && (
                <span className="text-[9px] text-red-500 font-bold block mt-0.5">
                  Oldest log: {Math.round(metrics.queue.oldestPendingPunchDelaySeconds / 60)} mins ago
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Avg Processing Delay</span>
              <span className="text-xl font-black text-gray-800 mt-1 block">
                {metrics.queue.averageQueueDelayMs ? `${(metrics.queue.averageQueueDelayMs / 1000).toFixed(2)}s` : "0.00s"}
              </span>
              <span className="text-[9px] text-gray-400 font-bold block mt-0.5">
                Rate: {metrics.queue.processingRatePerSecond} punches/sec
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-500 rounded-xl">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Queue Success Rate</span>
              <span className="text-xl font-black text-gray-800 mt-1 block">
                {metrics.queue.successRate}%
              </span>
              <span className="text-[9px] text-rose-400 font-bold block mt-0.5">
                Failed: {metrics.queue.failedPercentage}% | Unresolved: {metrics.queue.unknownPercentage}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("devices")}
          className={`px-6 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeTab === "devices" ? "border-[#007aff] text-[#007aff]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
        >
          Biometric Devices ({devices.length})
        </button>
        <button
          onClick={() => setActiveTab("unmapped")}
          className={`px-6 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeTab === "unmapped" ? "border-[#007aff] text-[#007aff]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
        >
          Unmapped Users ({unmappedUsers.length})
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`px-6 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeTab === "logs" ? "border-[#007aff] text-[#007aff]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
        >
          Sync Logs & Audit Queue
        </button>
      </div>

      {/* DEVICES TAB */}
      {activeTab === "devices" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devicesLoading ? (
            <div className="col-span-full py-20 flex flex-col items-center">
              <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
              <span className="text-xs text-gray-400 font-semibold">Loading biometric devices...</span>
            </div>
          ) : devices.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 font-semibold">
              <Cpu className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              No biometric devices registered yet. Click "Register Device" to add one.
            </div>
          ) : (
            devices.map((device) => {
              const isOnline = device.status === "ONLINE";
              const lastHb = device.lastHeartbeat ? new Date(device.lastHeartbeat).toLocaleString() : "Never";
              const isRevealed = revealedKeys[device.id] || false;

              return (
                <div key={device.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col justify-between transition-all ${device.maintenanceMode ? "border-amber-300 ring-2 ring-amber-100 bg-amber-50/[0.02]" : "border-gray-200"}`}>
                  <div className="p-6 space-y-4">
                    {/* Title and Badge */}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-800 text-sm">{device.name}</h3>
                          {device.maintenanceMode && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[8px] font-black uppercase">
                              Maintenance
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">SN: {device.serialNumber}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 border ${isOnline ? "bg-green-50 text-green-600 border-green-100" : "bg-gray-50 text-gray-400 border-gray-100"}`}>
                        {isOnline ? (
                          <>
                            <Wifi className="h-3 w-3 text-green-500" /> ONLINE
                          </>
                        ) : (
                          <>
                            <WifiOff className="h-3 w-3 text-gray-400" /> OFFLINE
                          </>
                        )}
                      </span>
                    </div>

                    {/* Network details */}
                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 py-3 border-t border-b border-gray-100 bg-gray-50/50 rounded-xl px-4">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">IP Address</span>
                        <p className="font-semibold text-gray-700 mt-0.5">{device.ipAddress || "Dynamic"}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Port</span>
                        <p className="font-semibold text-gray-700 mt-0.5">{device.port}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Branch</span>
                        <p className="font-semibold text-gray-700 mt-0.5">{branches.find(b => Number(b.value) === device.branchId)?.label || "HQ / Default"}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Config Version</span>
                        <p className="font-semibold text-[#007aff] mt-0.5">v{device.configVersion || 1}</p>
                      </div>
                    </div>

                    {/* Key token visualization with Masking & Revealing */}
                    <div className="bg-slate-900 rounded-xl p-3 flex justify-between items-center">
                      <div className="flex items-center gap-2 overflow-hidden w-full mr-2">
                        <Key className="h-4 w-4 text-[#007aff] flex-shrink-0" />
                        <div className="overflow-hidden w-full">
                          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-extrabold block">HMAC Secret Token</span>
                          <p className="text-white text-xs font-mono truncate">
                            {isRevealed ? device.secretKey : `************${device.secretKey.substr(-4)}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => toggleRevealKey(device.id)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title={isRevealed ? "Hide Secret Key" : "Reveal Secret Key"}
                        >
                          {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          onClick={() => handleCopyKey(device.secretKey, device.id)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Copy Token"
                        >
                          {copiedKey === device.id ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1 text-[10px] text-gray-400">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-gray-300" />
                          <span>Last Heartbeat: <b>{lastHb}</b></span>
                        </div>
                        <span>Time Offset: <b>{device.timeOffset || 0} mins</b></span>
                      </div>
                      {device.lastSyncTime && (
                        <div className="flex items-center gap-1 text-[9px] text-[#007aff] font-semibold">
                          <RefreshCw className="h-3 w-3" />
                          <span>Last Sync: <b>{new Date(device.lastSyncTime).toLocaleString()}</b></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRegenerateKey(device.id)}
                        disabled={regeneratingId === device.id}
                        className="text-amber-600 hover:text-amber-700 text-xs font-bold flex items-center gap-1 disabled:opacity-40 cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        {regeneratingId === device.id ? "Regenerating..." : "Regen HMAC"}
                      </button>
                      <button
                        onClick={() => handleProbeDevice(device.id)}
                        disabled={probingId === device.id}
                        className="text-green-600 hover:text-green-700 text-xs font-bold flex items-center gap-1 disabled:opacity-40 cursor-pointer"
                        title="Probe device TCP connection now"
                      >
                        <Radio className="h-3.5 w-3.5" />
                        {probingId === device.id ? "Probing..." : "Probe Now"}
                      </button>
                      <button
                        onClick={() => handleSyncDevice(device.id, device.name)}
                        disabled={syncingId === device.id}
                        className="text-[#007aff] hover:text-blue-700 text-xs font-bold flex items-center gap-1 disabled:opacity-40 cursor-pointer"
                        title="Manual Sync Now - Read & Process Attendance"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${syncingId === device.id ? "animate-spin" : ""}`} />
                        {syncingId === device.id ? "Syncing..." : "Sync Now"}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEdit(device)}
                        className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-[#007aff] hover:border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
                      >
                        <Edit2 className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDevice(device.id)}
                        className="p-1.5 bg-white border border-gray-200 rounded-lg text-red-500 hover:bg-red-50 hover:border-red-100 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* UNMAPPED USERS TAB (Supports Bulk User Mapping) */}
      {activeTab === "unmapped" && (
        <div className="space-y-4">
          {/* Bulk Action Panel */}
          {unmappedUsers.length > 0 && (
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-xs text-amber-800 font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span>
                  Bulk actions: selected <b>{Object.values(selectedUnmapped).filter(Boolean).length}</b> biometric users. Select employee on right and map them.
                </span>
              </div>
              <div className="flex gap-3 w-full md:w-auto items-center">
                <select
                  value={bulkEmployeeTarget}
                  onChange={(e) => setBulkEmployeeTarget(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-[#007aff] text-gray-700 bg-white cursor-pointer w-60"
                >
                  <option value="">Select Target Employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.value} value={emp.value}>
                      {emp.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleBulkMapUsers}
                  disabled={bulkActionLoading || !bulkEmployeeTarget || Object.values(selectedUnmapped).filter(Boolean).length === 0}
                  className="px-4 py-1.5 bg-[#007aff] hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex-shrink-0"
                >
                  {bulkActionLoading ? "Bulk Mapping..." : "Bulk Map & Requeue"}
                </button>
              </div>
            </div>
          )}

          {/* Unmapped Users Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/20 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
                    <th className="px-6 py-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={unmappedUsers.length > 0 && Object.values(selectedUnmapped).filter(Boolean).length === unmappedUsers.length}
                        onChange={handleSelectAllUnmapped}
                        className="rounded border-gray-300 text-[#007aff] focus:ring-[#007aff] cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4">Biometric User ID</th>
                    <th className="px-6 py-4">Logs Count</th>
                    <th className="px-6 py-4">Last Punch Date</th>
                    <th className="px-6 py-4">Map to CRM Employee Profile</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {unmappedLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="h-6 w-6 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mx-auto mb-2" />
                        <span className="text-xs text-gray-400 font-semibold">Loading unmapped biometric users...</span>
                      </td>
                    </tr>
                  ) : unmappedUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-semibold">
                        <UserCheck className="h-8 w-8 mx-auto mb-2 text-green-400" />
                        Awesome! All biometric IDs have been mapped successfully.
                      </td>
                    </tr>
                  ) : (
                    unmappedUsers.map((u) => (
                      <tr key={u.biometricUserId} className="hover:bg-gray-50/40">
                        <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={!!selectedUnmapped[u.biometricUserId]}
                            onChange={(e) => setSelectedUnmapped(prev => ({ ...prev, [u.biometricUserId]: e.target.checked }))}
                            className="rounded border-gray-300 text-[#007aff] focus:ring-[#007aff] cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-800 font-mono">{u.biometricUserId}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200 font-bold text-gray-600">
                            {u.punchCount} punches
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{new Date(u.lastPunchTime).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <select
                            value={mappingTargets[u.biometricUserId] || ""}
                            onChange={(e) => setMappingTargets(prev => ({ ...prev, [u.biometricUserId]: e.target.value }))}
                            className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-[#007aff] text-gray-700 bg-white cursor-pointer w-64 transition-colors"
                          >
                            <option value="">Select Employee...</option>
                            {employees.map((emp) => (
                              <option key={emp.value} value={emp.value}>
                                {emp.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleMapUser(u.biometricUserId)}
                            disabled={!mappingTargets[u.biometricUserId]}
                            className="px-3.5 py-1.5 bg-[#007aff] hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            Save & Process
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SYNC LOGS TAB (With metrics telemetry card and bulk retry controls) */}
      {activeTab === "logs" && (
        <div className="space-y-4">
          {/* Filters & Bulk Recovery card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
              <div className="relative w-full sm:w-60">
                <input
                  type="text"
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] text-gray-600 transition-colors"
                  placeholder="Search Biometric User ID..."
                  value={logUserSearch}
                  onChange={(e) => {
                    setLogUserSearch(e.target.value);
                    setLogPage(1);
                  }}
                />
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
              </div>
              <select
                value={logStatusFilter}
                onChange={(e) => {
                  setLogStatusFilter(e.target.value);
                  setLogPage(1);
                }}
                className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-white cursor-pointer transition-colors"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="FAILED">FAILED</option>
                <option value="UNKNOWN_USER">UNKNOWN USER</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRetryAllFailed}
                className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold cursor-pointer transition-all"
              >
                Retry All Failed
              </button>
              <button
                onClick={loadPunchLogs}
                className="px-3.5 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Refresh logs
              </button>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/20 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
                    <th className="px-6 py-4">Log ID</th>
                    <th className="px-6 py-4">Correlation ID</th>
                    <th className="px-6 py-4">Biometric ID</th>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Punch Time</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Processing Details</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {logsLoading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center">
                        <div className="h-6 w-6 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mx-auto mb-2" />
                        <span className="text-xs text-gray-400 font-semibold">Loading logs...</span>
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-400 font-semibold">
                        <Database className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        No punch logs found matching the selected filters.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => {
                      const punchTime = new Date(log.timestamp).toLocaleString();
                      const resolvedEmployee = log.processedRecord?.employee;

                      // Status styles
                      const statusConfig = {
                        PENDING: "bg-amber-50 text-amber-600 border-amber-100",
                        PROCESSING: "bg-indigo-50 text-indigo-600 border-indigo-100 animate-pulse",
                        SUCCESS: "bg-green-50 text-green-600 border-green-100",
                        FAILED: "bg-rose-50 text-rose-600 border-rose-100",
                        UNKNOWN_USER: "bg-purple-50 text-purple-600 border-purple-100",
                      };
                      const statusClass = statusConfig[log.status] || "bg-gray-50 text-gray-500 border-gray-100";

                      return (
                        <tr key={log.id} className="hover:bg-gray-50/40">
                          <td className="px-6 py-4 font-mono text-gray-400">#{log.id}</td>
                          <td className="px-6 py-4 font-mono text-[9px] text-gray-400 max-w-[100px] truncate" title={log.correlationId}>
                            {log.correlationId || "N/A"}
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-gray-800">{log.biometricUserId}</td>
                          <td className="px-6 py-4">
                            {resolvedEmployee ? (
                              <span className="font-bold text-slate-800">
                                {resolvedEmployee.firstName} {resolvedEmployee.lastName} ({resolvedEmployee.employeeCode})
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">Unresolved</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-500">{punchTime}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusClass}`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 max-w-sm truncate text-gray-500" title={log.lastError}>
                            {log.status === "FAILED" ? (
                              <span className="text-rose-500 flex items-center gap-1">
                                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                                {log.lastError}
                              </span>
                            ) : log.status === "SUCCESS" ? (
                              <span className="text-gray-400">Processed into record #{log.processedRecordId}</span>
                            ) : (
                              <span className="text-gray-400">Requeue processing priority (Retry: {log.retryCount}/5)</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {log.status === "FAILED" && (
                              <button
                                onClick={() => handleRetryPunch(log.id)}
                                className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-gray-200 text-slate-600 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer animate-in fade-in duration-300"
                              >
                                Retry Punch
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            {logsCount > 15 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50/20 flex items-center justify-between text-xs font-semibold text-gray-500">
                <button
                  disabled={logPage === 1}
                  onClick={() => setLogPage((p) => Math.max(p - 1, 1))}
                  className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-opacity cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </button>
                <span>Page {logPage} of {Math.ceil(logsCount / 15)} (Total {logsCount} logs)</span>
                <button
                  disabled={logPage === Math.ceil(logsCount / 15)}
                  onClick={() => setLogPage((p) => Math.min(p + 1, Math.ceil(logsCount / 15)))}
                  className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-opacity cursor-pointer flex items-center gap-1"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* REGISTER / EDIT DEVICE MODAL */}
      {isDeviceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-sm font-sans">
                {selectedDevice ? "Edit Biometric Device" : "Register Biometric Device"}
              </h3>
              <button
                onClick={() => setIsDeviceModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDevice} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Device Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Factory Main Gate"
                  value={deviceForm.name}
                  onChange={(e) => setDeviceForm({ ...deviceForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Serial Number (Unique)</label>
                <input
                  type="text"
                  required
                  disabled={!!selectedDevice}
                  placeholder="e.g. B8A1234567"
                  value={deviceForm.serialNumber}
                  onChange={(e) => setDeviceForm({ ...deviceForm, serialNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">IP Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 192.168.1.201"
                    value={deviceForm.ipAddress}
                    onChange={(e) => setDeviceForm({ ...deviceForm, ipAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Port</label>
                  <input
                    type="number"
                    required
                    value={deviceForm.port}
                    onChange={(e) => setDeviceForm({ ...deviceForm, port: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Branch Location</label>
                  <select
                    value={deviceForm.branchId}
                    onChange={(e) => setDeviceForm({ ...deviceForm, branchId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] bg-white cursor-pointer"
                  >
                    <option value="">HQ / Default</option>
                    {branches.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1" title="Time offset drift to correct (in minutes)">
                    Time Drift Offset (mins)
                  </label>
                  <input
                    type="number"
                    value={deviceForm.timeOffset}
                    onChange={(e) => setDeviceForm({ ...deviceForm, timeOffset: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  checked={deviceForm.maintenanceMode}
                  onChange={(e) => setDeviceForm({ ...deviceForm, maintenanceMode: e.target.checked })}
                  className="rounded border-gray-300 text-[#007aff] focus:ring-[#007aff] cursor-pointer"
                />
                <label htmlFor="maintenanceMode" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Activate Maintenance Mode (Suppress alerts and heartbeat checks)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsDeviceModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Save Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
