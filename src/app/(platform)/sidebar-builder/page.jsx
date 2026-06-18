"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Modal from "@/components/modals/Modal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { Plus, Edit2, Trash2, Folder, Layout, Check, AlertCircle, GripVertical } from "lucide-react";
import { getDynamicIcon } from "@/components/layout/sidebar-components/icons";

export default function SidebarBuilderPage() {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Modals
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form State
  const [editingFolder, setEditingFolder] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const [folderForm, setFolderForm] = useState({ name: "", icon_name: "" });
  const [itemForm, setItemForm] = useState({ name: "", route: "", folder_id: "", permission_link: "", icon_name: "" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTree = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/system/sidebar/tree");
      setTree(res.data);
    } catch (err) {
      showToast("Failed to load sidebar tree", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

  // Handlers
  const handleDragEnd = async (result) => {
    const { source, destination, type, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    try {
      if (type === "folder") {
        const newTree = Array.from(tree);
        const [removed] = newTree.splice(source.index, 1);
        newTree.splice(destination.index, 0, removed);
        setTree(newTree);
        const updates = newTree.map((f, i) => ({ id: f.id, type: "FOLDER", sort_order: i + 1 }));
        await axiosInstance.patch("/system/sidebar/reorder", { updates });
        showToast("Folders reordered");
      } else if (type === "item") {
        const sourceFolderId = parseInt(source.droppableId.split("-")[1], 10);
        const destFolderId = parseInt(destination.droppableId.split("-")[1], 10);
        const itemId = parseInt(draggableId.split("-")[1], 10);

        const newTree = JSON.parse(JSON.stringify(tree));
        const sFolder = newTree.find((f) => f.id === sourceFolderId);
        const dFolder = newTree.find((f) => f.id === destFolderId);

        const [removed] = sFolder.items.splice(source.index, 1);
        dFolder.items.splice(destination.index, 0, removed);
        setTree(newTree);

        if (sourceFolderId !== destFolderId) {
          await axiosInstance.patch(`/system/sidebar/item/${itemId}/move`, { folder_id: destFolderId });
        }

        const updates = dFolder.items.map((it, i) => ({ id: it.id, type: "ITEM", sort_order: i + 1 }));
        await axiosInstance.patch("/system/sidebar/reorder", { updates });
        showToast("Items reordered");
      }
    } catch (err) {
      showToast("Reorder failed, reverting.", "error");
      fetchTree();
    }
  };

  const openCreateFolder = () => {
    setFolderForm({ name: "", icon_name: "" });
    setEditingFolder(null);
    setIsFolderModalOpen(true);
  };

  const openEditFolder = (folder) => {
    setFolderForm({ name: folder.name, icon_name: folder.icon_name || "" });
    setEditingFolder(folder);
    setIsFolderModalOpen(true);
  };

  const openCreateItem = () => {
    setItemForm({ name: "", route: "", folder_id: tree[0]?.id || "", permission_link: "", icon_name: "" });
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const openEditItem = (item) => {
    setItemForm({
      name: item.name,
      route: item.route || "",
      folder_id: item.folder_id || "",
      permission_link: item.permission_link || "",
      icon_name: item.icon_name || ""
    });
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleSaveFolder = async (e) => {
    e.preventDefault();
    try {
      if (editingFolder) {
        await axiosInstance.patch(`/system/sidebar/folder/${editingFolder.id}`, folderForm);
        showToast("Folder updated");
      } else {
        await axiosInstance.post("/system/sidebar/folder", folderForm);
        showToast("Folder created");
      }
      setIsFolderModalOpen(false);
      fetchTree();
    } catch (err) {
      showToast("Failed to save folder", "error");
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axiosInstance.patch(`/system/sidebar/item/${editingItem.id}`, {
          ...itemForm,
          folder_id: itemForm.folder_id ? parseInt(itemForm.folder_id, 10) : null,
        });
        showToast("Item updated");
      } else {
        await axiosInstance.post("/system/sidebar/item", {
          ...itemForm,
          folder_id: itemForm.folder_id ? parseInt(itemForm.folder_id, 10) : null,
        });
        showToast("Item created");
      }
      setIsItemModalOpen(false);
      fetchTree();
    } catch (err) {
      showToast("Failed to save item", "error");
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteTarget.type === "FOLDER") {
        await axiosInstance.delete(`/system/sidebar/folder/${deleteTarget.id}`);
      } else {
        await axiosInstance.delete(`/system/sidebar/item/${deleteTarget.id}`);
      }
      showToast(`${deleteTarget.type} deleted`);
      setDeleteTarget(null);
      fetchTree();
    } catch (err) {
      showToast("Failed to delete", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading Sidebar Config...</p>
      </div>
    );
  }

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
            <Layout className="h-6 w-6 text-[#007aff]" /> Dynamic Sidebar Builder
          </h1>
          <p className="text-xs text-gray-500 mt-1">Drag and drop to rearrange. Click pencil to rename.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={openCreateFolder} className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors">
            <Plus className="h-4 w-4" /> New Folder
          </button>
          <button onClick={openCreateItem} className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors">
            <Plus className="h-4 w-4" /> New Item
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="root-folders" type="folder">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {tree.map((folder, folderIndex) => (
                  <Draggable key={`folder-${folder.id}`} draggableId={`folder-${folder.id}`} index={folderIndex}>
                    {(prov) => (
                      <div ref={prov.innerRef} {...prov.draggableProps} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between p-3 bg-gray-100/50 border-b border-gray-200">
                          <div className="flex items-center gap-3">
                            <div {...prov.dragHandleProps} className="p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                              <GripVertical className="h-4 w-4" />
                            </div>
                            <Folder className="h-4 w-4 text-[#007aff]" />
                            <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">{folder.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditFolder(folder)}
                              className="p-1 text-gray-400 hover:text-[#007aff] transition-colors"
                              title="Rename folder"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ type: "FOLDER", id: folder.id, name: folder.name })}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete folder"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <Droppable droppableId={`folderItems-${folder.id}`} type="item">
                          {(dropProv, snap) => (
                            <div {...dropProv.droppableProps} ref={dropProv.innerRef} className={`p-2 min-h-[40px] space-y-2 ${snap.isDraggingOver ? 'bg-blue-50/50' : ''}`}>
                              {folder.items.map((item, itemIndex) => {
                                const ItemIcon = getDynamicIcon(item.name, item.route, item.icon_name);
                                return (
                                  <Draggable key={`item-${item.id}`} draggableId={`item-${item.id}`} index={itemIndex}>
                                    {(dragProv) => (
                                      <div ref={dragProv.innerRef} {...dragProv.draggableProps} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
                                        <div className="flex items-center gap-3">
                                          <div {...dragProv.dragHandleProps} className="p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                                            <GripVertical className="h-4 w-4" />
                                          </div>
                                          <ItemIcon className="h-4 w-4 text-gray-500" />
                                          <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                                          <span className="text-xs text-gray-400 font-mono ml-4 bg-gray-50 px-2 py-0.5 rounded">{item.route}</span>
                                          {item.permission_link && (
                                            <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-100 font-bold ml-2">
                                              {item.permission_link}
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <button
                                            onClick={() => openEditItem(item)}
                                            className="p-1 text-gray-400 hover:text-[#007aff] transition-colors"
                                            title="Edit item"
                                          >
                                            <Edit2 className="h-4 w-4" />
                                          </button>
                                          <button
                                            onClick={() => setDeleteTarget({ type: "ITEM", id: item.id, name: item.name })}
                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Delete item"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {dropProv.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Folder Modal */}
      <Modal isOpen={isFolderModalOpen} onClose={() => setIsFolderModalOpen(false)} title={editingFolder ? "Edit Folder" : "Create Folder"}>
        <form onSubmit={handleSaveFolder} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Folder Name</label>
            <input
              required
              type="text"
              value={folderForm.name}
              onChange={e => setFolderForm({ ...folderForm, name: e.target.value })}
              className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#007aff]"
              placeholder="e.g. CRM Management"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Icon Name (Optional)</label>
            <input
              type="text"
              value={folderForm.icon_name}
              onChange={e => setFolderForm({ ...folderForm, icon_name: e.target.value })}
              className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#007aff]"
              placeholder="e.g. Users, Building, Shield"
            />
          </div>
          <button type="submit" className="w-full py-2 bg-[#007aff] text-white rounded-xl text-xs font-bold mt-4 cursor-pointer hover:bg-blue-600 transition-colors">
            {editingFolder ? "Update Folder" : "Create Folder"}
          </button>
        </form>
      </Modal>

      {/* Item Modal */}
      <Modal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} title={editingItem ? "Edit Item" : "Create Item"}>
        <form onSubmit={handleSaveItem} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Item Name</label>
            <input
              required
              type="text"
              value={itemForm.name}
              onChange={e => setItemForm({ ...itemForm, name: e.target.value })}
              className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#007aff]"
              placeholder="e.g. Employee List"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Route</label>
            <input
              required
              type="text"
              value={itemForm.route}
              onChange={e => setItemForm({ ...itemForm, route: e.target.value })}
              className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#007aff]"
              placeholder="e.g. /employees"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Permission Link (Optional)</label>
            <input
              type="text"
              value={itemForm.permission_link}
              onChange={e => setItemForm({ ...itemForm, permission_link: e.target.value })}
              className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#007aff]"
              placeholder="e.g. employees:read"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Parent Folder</label>
            <select
              value={itemForm.folder_id}
              onChange={e => setItemForm({ ...itemForm, folder_id: e.target.value })}
              className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#007aff]"
            >
              <option value="">No Folder (Root)</option>
              {tree.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full py-2 bg-[#007aff] text-white rounded-xl text-xs font-bold mt-4 cursor-pointer hover:bg-blue-600 transition-colors">
            {editingItem ? "Update Item" : "Create Item"}
          </button>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete ${deleteTarget?.type === "FOLDER" ? "Folder" : "Item"}`}
        message={`Are you sure you want to delete "${deleteTarget?.name}"?${deleteTarget?.type === "FOLDER" ? " All items inside will also be deleted." : ""}`}
      />
    </div>
  );
}
