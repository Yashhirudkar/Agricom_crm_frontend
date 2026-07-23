"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { 
  ShieldAlert, 
  Check, 
  AlertCircle, 
  Save, 
  ArrowLeft, 
  Folder, 
  Layout, 
  Settings, 
  Key, 
  CheckSquare, 
  Square,
  Lock,
  Globe,
  Plus,
  Minus
} from "lucide-react";
import Link from "next/link";

export default function ClientAccessConfigPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id;

  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Options fetched from DB
  const [client, setClient] = useState(null);
  const [sidebarTree, setSidebarTree] = useState([]);
  const [matrixRegistry, setMatrixRegistry] = useState([]);

  // Selections
  const [selectedFolderIds, setSelectedFolderIds] = useState(new Set());
  const [selectedItemIds, setSelectedItemIds] = useState(new Set());
  const [selectedModuleIds, setSelectedModuleIds] = useState(new Set());
  const [selectedActionIds, setSelectedActionIds] = useState(new Set());

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [clientRes, sidebarRes, matrixRes] = await Promise.all([
          axiosInstance.get(`/clients/${clientId}/access-config`),
          axiosInstance.get("/system/sidebar/tree"),
          axiosInstance.get("/system/matrix/registry"),
        ]);

        const currentClient = clientRes.data;
        if (currentClient) {
          setClient(currentClient);
          setSelectedFolderIds(new Set((currentClient.folderAccess || []).map(f => f.folder_id)));
          setSelectedItemIds(new Set((currentClient.itemAccess || []).map(i => i.item_id)));
          setSelectedModuleIds(new Set((currentClient.moduleAccess || []).map(m => m.module_id)));
          setSelectedActionIds(new Set((currentClient.actionAccess || []).map(a => a.resource_action_id)));
        } else {
          showToast("Client not found", "error");
        }

        setSidebarTree(sidebarRes.data || []);
        setMatrixRegistry(matrixRes.data || []);
      } catch (err) {
        console.error("Failed to load access config data", err);
        showToast("Failed to load configuration data", "error");
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      loadData();
    }
  }, [clientId]);

  // Toggle helpers
  const handleToggleFolder = (id) => {
    setSelectedFolderIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleItem = (id) => {
    setSelectedItemIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleModule = (id) => {
    setSelectedModuleIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleAction = (id) => {
    setSelectedActionIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Select all helpers
  const toggleAllFolders = (checked) => {
    if (checked) {
      setSelectedFolderIds(new Set(sidebarTree.map(f => f.id)));
    } else {
      setSelectedFolderIds(new Set());
    }
  };

  const toggleAllItems = (checked) => {
    if (checked) {
      const allItemIds = sidebarTree.flatMap(f => (f.items || []).map(i => i.id));
      setSelectedItemIds(new Set(allItemIds));
    } else {
      setSelectedItemIds(new Set());
    }
  };

  const toggleAllModules = (checked) => {
    if (checked) {
      setSelectedModuleIds(new Set(matrixRegistry.map(m => m.module_id)));
    } else {
      setSelectedModuleIds(new Set());
    }
  };

  const toggleAllActions = (checked) => {
    if (checked) {
      const allActionIds = matrixRegistry.flatMap(m => 
        (m.resources || []).flatMap(r => 
          (r.actions || []).map(a => a.action_id)
        )
      );
      setSelectedActionIds(new Set(allActionIds));
    } else {
      setSelectedActionIds(new Set());
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axiosInstance.post(`/clients/${clientId}/access-config`, {
        folder_ids: Array.from(selectedFolderIds),
        item_ids: Array.from(selectedItemIds),
        module_ids: Array.from(selectedModuleIds),
        action_ids: Array.from(selectedActionIds),
      });
      showToast("Access boundary configured successfully!");
    } catch (err) {
      showToast("Failed to save access boundary", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading Client Configuration...</p>
      </div>
    );
  }

  const allItemIds = sidebarTree.flatMap(f => (f.items || []).map(i => i.id));
  const allActionIds = matrixRegistry.flatMap(m => (m.resources || []).flatMap(r => (r.actions || []).map(a => a.action_id)));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" /> Tenant Access Boundary Configuration
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Restrict folders, items, modules, and API actions allowed for client: <span className="font-bold text-gray-800">{client?.name || `Client #${clientId}`}</span> ({client?.email})
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          {saving ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Applying Config..." : "Save Scoping Boundary"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: SIDEBAR CONTROLS */}
        <div className="space-y-6">
          {/* SECTION A: SIDEBAR FOLDERS */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Folder className="h-4 w-4 text-[#007aff]" /> Section A: Sidebar Folders
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleAllFolders(true)}
                  className="px-2 py-1 text-[10px] bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-bold transition-colors"
                >
                  Select All
                </button>
                <button 
                  onClick={() => toggleAllFolders(false)}
                  className="px-2 py-1 text-[10px] bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg font-bold transition-colors"
                >
                  Deselect All
                </button>
              </div>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {sidebarTree.map((folder) => {
                const isChecked = selectedFolderIds.has(folder.id);
                return (
                  <label 
                    key={folder.id} 
                    className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors ${isChecked ? 'bg-blue-50/20 border-blue-200' : 'bg-white border-gray-200'}`}
                  >
                    <input 
                      type="checkbox"
                      className="rounded text-[#007aff] focus:ring-[#007aff] h-4 w-4"
                      checked={isChecked}
                      onChange={() => handleToggleFolder(folder.id)}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">{folder.name}</span>
                      <span className="text-[10px] text-gray-400">ID: {folder.id}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* SECTION B: SIDEBAR ITEMS */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Layout className="h-4 w-4 text-emerald-500" /> Section B: Sidebar Items
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleAllItems(true)}
                  className="px-2 py-1 text-[10px] bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg font-bold transition-colors"
                >
                  Select All
                </button>
                <button 
                  onClick={() => toggleAllItems(false)}
                  className="px-2 py-1 text-[10px] bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg font-bold transition-colors"
                >
                  Deselect All
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4 max-h-[420px] overflow-y-auto">
              {sidebarTree.map((folder) => {
                const folderItems = folder.items || [];
                if (folderItems.length === 0) return null;
                return (
                  <div key={folder.id} className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b pb-1">{folder.name}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {folderItems.map((item) => {
                        const isChecked = selectedItemIds.has(item.id);
                        return (
                          <label 
                            key={item.id} 
                            className={`flex items-center gap-3 p-2.5 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${isChecked ? 'bg-emerald-50/20 border-emerald-200' : 'bg-white border-gray-100'}`}
                          >
                            <input 
                              type="checkbox"
                              className="rounded text-emerald-500 focus:ring-emerald-500 h-3.5 w-3.5"
                              checked={isChecked}
                              onChange={() => handleToggleItem(item.id)}
                            />
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-gray-700">{item.name}</span>
                              <span className="text-[9px] text-gray-400 font-mono">{item.route}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MODULES & GRANULAR ACTIONS */}
        <div className="space-y-6">
          {/* SECTION C: APP MODULES */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Settings className="h-4 w-4 text-purple-500" /> Section C: App Modules
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleAllModules(true)}
                  className="px-2 py-1 text-[10px] bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg font-bold transition-colors"
                >
                  Select All
                </button>
                <button 
                  onClick={() => toggleAllModules(false)}
                  className="px-2 py-1 text-[10px] bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg font-bold transition-colors"
                >
                  Deselect All
                </button>
              </div>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {matrixRegistry.map((mod) => {
                const isChecked = selectedModuleIds.has(mod.module_id);
                return (
                  <label 
                    key={mod.module_id} 
                    className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors ${isChecked ? 'bg-purple-50/20 border-purple-200' : 'bg-white border-gray-200'}`}
                  >
                    <input 
                      type="checkbox"
                      className="rounded text-purple-500 focus:ring-purple-500 h-4 w-4"
                      checked={isChecked}
                      onChange={() => handleToggleModule(mod.module_id)}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">{mod.module_name}</span>
                      <span className="text-[10px] text-gray-400">ID: {mod.module_id}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* SECTION D: GRANULAR ACTIONS */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Key className="h-4 w-4 text-amber-500" /> Section D: Scoped API Actions
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleAllActions(true)}
                  className="px-2 py-1 text-[10px] bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg font-bold transition-colors"
                >
                  Select All
                </button>
                <button 
                  onClick={() => toggleAllActions(false)}
                  className="px-2 py-1 text-[10px] bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg font-bold transition-colors"
                >
                  Deselect All
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4 max-h-[420px] overflow-y-auto">
              {matrixRegistry.map((mod) => {
                const resources = mod.resources || [];
                const hasActions = resources.some(r => (r.actions || []).length > 0);
                if (!hasActions) return null;

                return (
                  <div key={mod.module_id} className="space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b pb-1">{mod.module_name}</p>
                    
                    {resources.map((res) => {
                      const actions = res.actions || [];
                      if (actions.length === 0) return null;

                      return (
                        <div key={res.resource_id} className="space-y-1.5 pl-2">
                          <p className="text-[10px] font-bold text-gray-500 font-mono">{res.resource_name}</p>
                          <div className="flex flex-wrap gap-2">
                            {actions.map((act) => {
                              const isChecked = selectedActionIds.has(act.action_id);
                              return (
                                <label 
                                  key={act.action_id} 
                                  className={`inline-flex items-center gap-1.5 border px-2 py-1 rounded-lg text-[10px] font-semibold cursor-pointer transition-colors ${
                                    isChecked 
                                    ? 'bg-amber-50 border-amber-200 text-amber-700' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                  }`}
                                >
                                  <input 
                                    type="checkbox"
                                    className="rounded text-amber-500 focus:ring-amber-500 h-3 w-3"
                                    checked={isChecked}
                                    onChange={() => handleToggleAction(act.action_id)}
                                  />
                                  {act.action_name}
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
