"use client";

import React, { useState } from "react";
import axiosInstance from "@/lib/axios";
import Modal from "@/components/modals/Modal";
import { Plus, Check, AlertCircle, LayoutTemplate } from "lucide-react";

export default function MatrixBuilderPage() {
  const [toast, setToast] = useState(null);

  // Modals
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  // Form State
  const [moduleForm, setModuleForm] = useState({ name: "", sort_order: "" });
  const [resourceForm, setResourceForm] = useState({ name: "", display_name: "", module_id: "", sort_order: "" });
  const [actionForm, setActionForm] = useState({ name: "", display_name: "", resource_id: "", sort_order: "" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveModule = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/system/matrix/module", {
        ...moduleForm,
        sort_order: parseInt(moduleForm.sort_order || 0, 10),
      });
      showToast("Module created successfully");
      setIsModuleModalOpen(false);
      setModuleForm({ name: "", sort_order: "" });
    } catch (err) {
      showToast("Failed to create module", "error");
    }
  };

  const handleSaveResource = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/system/matrix/resource", {
        ...resourceForm,
        module_id: parseInt(resourceForm.module_id, 10),
        sort_order: parseInt(resourceForm.sort_order || 0, 10),
      });
      showToast("Resource created successfully");
      setIsResourceModalOpen(false);
      setResourceForm({ name: "", display_name: "", module_id: "", sort_order: "" });
    } catch (err) {
      showToast("Failed to create resource", "error");
    }
  };

  const handleSaveAction = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/system/matrix/action", {
        ...actionForm,
        resource_id: parseInt(actionForm.resource_id, 10),
        sort_order: parseInt(actionForm.sort_order || 0, 10),
      });
      showToast("Action created successfully");
      setIsActionModalOpen(false);
      setActionForm({ name: "", display_name: "", resource_id: "", sort_order: "" });
    } catch (err) {
      showToast("Failed to create action", "error");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutTemplate className="h-6 w-6 text-[#007aff]" /> Permission Matrix Builder
          </h1>
          <p className="text-xs text-gray-500 mt-1">Configure Enterprise modules, resources, and granular RBAC actions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module Builder */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">Modules</h2>
            <p className="text-xs text-gray-500 mt-2">Create top-level application modules (e.g., Attendance, HRMS).</p>
          </div>
          <button onClick={() => setIsModuleModalOpen(true)} className="mt-6 w-full px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" /> Create Module
          </button>
        </div>

        {/* Resource Builder */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">Resources</h2>
            <p className="text-xs text-gray-500 mt-2">Create sub-components within a module (e.g., attendance_dashboard).</p>
          </div>
          <button onClick={() => setIsResourceModalOpen(true)} className="mt-6 w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" /> Create Resource
          </button>
        </div>

        {/* Action Builder */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">Actions</h2>
            <p className="text-xs text-gray-500 mt-2">Define granular permissions for a resource (e.g., create, override).</p>
          </div>
          <button onClick={() => setIsActionModalOpen(true)} className="mt-6 w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" /> Create Action
          </button>
        </div>
      </div>

      <Modal isOpen={isModuleModalOpen} onClose={() => setIsModuleModalOpen(false)} title="Create Module">
        <form onSubmit={handleSaveModule} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Module Name</label>
            <input required type="text" value={moduleForm.name} onChange={e => setModuleForm({ ...moduleForm, name: e.target.value })} className="w-full border border-dashed border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#007aff]" placeholder="e.g. Attendance" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sort Order</label>
            <input type="number" value={moduleForm.sort_order} onChange={e => setModuleForm({ ...moduleForm, sort_order: e.target.value })} className="w-full border border-dashed border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#007aff]" />
          </div>
          <button type="submit" className="w-full py-2 bg-[#007aff] text-white rounded-xl text-xs font-bold mt-4">Save</button>
        </form>
      </Modal>

      <Modal isOpen={isResourceModalOpen} onClose={() => setIsResourceModalOpen(false)} title="Create Resource">
        <form onSubmit={handleSaveResource} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Resource Name (Key)</label>
            <input required type="text" value={resourceForm.name} onChange={e => setResourceForm({ ...resourceForm, name: e.target.value })} className="w-full border border-dashed border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" placeholder="e.g. attendance_dashboard" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Display Name</label>
            <input type="text" value={resourceForm.display_name} onChange={e => setResourceForm({ ...resourceForm, display_name: e.target.value })} className="w-full border border-dashed border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" placeholder="e.g. Attendance Dashboard" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Module ID</label>
            <input required type="number" value={resourceForm.module_id} onChange={e => setResourceForm({ ...resourceForm, module_id: e.target.value })} className="w-full border border-dashed border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" placeholder="e.g. 1" />
          </div>
          <button type="submit" className="w-full py-2 bg-indigo-500 text-white rounded-xl text-xs font-bold mt-4">Save</button>
        </form>
      </Modal>

      <Modal isOpen={isActionModalOpen} onClose={() => setIsActionModalOpen(false)} title="Create Action">
        <form onSubmit={handleSaveAction} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Action Name (Key)</label>
            <input required type="text" value={actionForm.name} onChange={e => setActionForm({ ...actionForm, name: e.target.value })} className="w-full border border-dashed border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500" placeholder="e.g. override" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Resource ID</label>
            <input required type="number" value={actionForm.resource_id} onChange={e => setActionForm({ ...actionForm, resource_id: e.target.value })} className="w-full border border-dashed border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500" placeholder="e.g. 5" />
          </div>
          <button type="submit" className="w-full py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold mt-4">Save</button>
        </form>
      </Modal>
    </div>
  );
}
