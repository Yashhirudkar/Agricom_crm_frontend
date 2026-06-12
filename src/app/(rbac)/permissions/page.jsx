"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPermissions, createPermission, updatePermission, deletePermission,
  selectPermissions, selectPermissionsLoading, selectPermissionsError, clearPermissionsError,
} from "@/store/slices/permissionsSlice";
import Modal from "@/components/modals/Modal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { Plus, Pencil, Trash2, Key, Check, AlertCircle } from "lucide-react";

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input className="w-full px-3.5 py-2.5 text-sm text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" {...props} />
    </div>
  );
}

const RESOURCE_COLORS = {
  roles: "bg-purple-50 text-purple-700",
  permissions: "bg-blue-50 text-blue-700",
  users: "bg-amber-50 text-amber-700",
  companies: "bg-green-50 text-green-700",
  products: "bg-rose-50 text-rose-700",
};

export default function PermissionsPage() {
  const dispatch = useDispatch();
  const permissions = useSelector(selectPermissions);
  const isLoading = useSelector(selectPermissionsLoading);
  const error = useSelector(selectPermissionsError);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ name: "", resource: "", action: "", description: "" });

  useEffect(() => { dispatch(fetchPermissions()); }, [dispatch]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openCreate = () => { setForm({ name: "", resource: "", action: "", description: "" }); setIsCreateOpen(true); };
  const openEdit = (p) => { setForm({ name: p.name, resource: p.resource, action: p.action, description: p.description || "" }); setEditTarget(p); };
  const closeModals = () => { setIsCreateOpen(false); setEditTarget(null); setDeleteTarget(null); dispatch(clearPermissionsError()); };

  // Auto-generate name from resource:action
  const handleResourceAction = (field, val) => {
    const updated = { ...form, [field]: val };
    if (updated.resource && updated.action) updated.name = `${updated.resource}:${updated.action}`;
    setForm(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editTarget) {
        await dispatch(updatePermission({ id: editTarget.id, ...form })).unwrap();
        showToast("Permission updated");
      } else {
        await dispatch(createPermission(form)).unwrap();
        showToast("Permission created");
      }
      closeModals();
    } catch (err) { showToast(err || "Error", "error"); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deletePermission(deleteTarget.id)).unwrap();
      showToast("Permission deleted");
      closeModals();
    } catch (err) { showToast(err || "Delete failed", "error"); }
    finally { setIsDeleting(false); }
  };

  // Group by resource
  const grouped = permissions.reduce((acc, p) => {
    (acc[p.resource] = acc[p.resource] || []).push(p);
    return acc;
  }, {});

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Key className="h-6 w-6 text-[#007aff]" /> Permissions Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Define fine-grained permissions in resource:action format.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#007aff] text-white text-sm font-semibold rounded-xl hover:bg-blue-600 transition-colors shadow-sm shadow-blue-500/20">
          <Plus className="h-4 w-4" /> Create Permission
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: permissions.length },
          { label: "Active", value: permissions.filter((p) => p.isActive).length },
          { label: "Resources", value: Object.keys(grouped).length },
          { label: "Actions", value: new Set(permissions.map((p) => p.action)).size },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Resource</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">Loading permissions...</td></tr>
              ) : permissions.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No permissions yet.</td></tr>
              ) : (
                permissions.map((perm) => {
                  const colorClass = RESOURCE_COLORS[perm.resource] || "bg-gray-100 text-gray-600";
                  return (
                    <tr key={perm.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 text-gray-400 font-mono text-xs">#{perm.id}</td>
                      <td className="px-5 py-4 font-semibold text-gray-900">{perm.name}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorClass}`}>{perm.resource}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">{perm.action}</span>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{perm.description || <span className="text-gray-300 italic">—</span>}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(perm)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => setDeleteTarget(perm)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isCreateOpen || !!editTarget} onClose={closeModals} title={editTarget ? "Edit Permission" : "Create Permission"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Resource *" value={form.resource} onChange={(e) => handleResourceAction("resource", e.target.value)} placeholder="e.g. products" required />
            <Field label="Action *" value={form.action} onChange={(e) => handleResourceAction("action", e.target.value)} placeholder="e.g. create" required />
          </div>
          <Field label="Permission Name (auto-filled)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="resource:action" required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What does this permission allow?" className="w-full px-3.5 py-2.5 text-sm text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModals} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-semibold text-white bg-[#007aff] rounded-xl hover:bg-blue-600 disabled:opacity-60 flex items-center gap-2">
              {isSaving && <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {editTarget ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={closeModals}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Permission"
        message={`Delete permission "${deleteTarget?.name}"? Roles using this permission will lose access.`}
      />
    </div>
  );
}
