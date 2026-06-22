"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Modal from "@/components/modals/Modal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { Plus, Edit2, Trash2, Folder, Layout, Check, AlertCircle, GripVertical, Palette } from "lucide-react";
import { getDynamicIcon } from "@/components/layout/sidebar-components/icons";
import EditSidebarFolderModal from "./components/EditSidebarFolderModal";
import EditSidebarItemModal from "./components/EditSidebarItemModal";

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
        window.dispatchEvent(new Event("sidebar-updated"));
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
        window.dispatchEvent(new Event("sidebar-updated"));
      }
    } catch (err) {
      showToast("Reorder failed, reverting.", "error");
      fetchTree();
    }
  };

  const openCreateFolder = () => {
    setEditingFolder(null);
    setIsFolderModalOpen(true);
  };

  const openEditFolder = (folder) => {
    setEditingFolder(folder);
    setIsFolderModalOpen(true);
  };

  const openCreateItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const openEditItem = (item) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleSaveFolder = async (data) => {
    try {
      if (editingFolder) {
        await axiosInstance.patch(`/system/sidebar/folder/${editingFolder.id}`, data);
        showToast("Folder updated");
      } else {
        await axiosInstance.post("/system/sidebar/folder", data);
        showToast("Folder created");
      }
      setIsFolderModalOpen(false);
      fetchTree();
      window.dispatchEvent(new Event("sidebar-updated"));
    } catch (err) {
      showToast("Failed to save folder", "error");
    }
  };

  const handleSaveItem = async (data) => {
    try {
      const payload = {
        ...data,
        folder_id: data.folder_id ? parseInt(data.folder_id, 10) : null,
      };
      if (editingItem) {
        await axiosInstance.patch(`/system/sidebar/item/${editingItem.id}`, payload);
        showToast("Item updated");
      } else {
        await axiosInstance.post("/system/sidebar/item", payload);
        showToast("Item created");
      }
      setIsItemModalOpen(false);
      fetchTree();
      window.dispatchEvent(new Event("sidebar-updated"));
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
      window.dispatchEvent(new Event("sidebar-updated"));
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
                            <Folder className="h-4 w-4" style={folder.icon_color ? { color: folder.icon_color } : { color: "#007aff" }} />
                            <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">{folder.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              className="p-1 text-gray-400 hover:text-indigo-500 transition-colors"
                              title="Folder color configuration"
                            >
                              <Palette className="h-4 w-4" />
                            </button>
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
                                const isInheriting = item.use_folder_color !== false;
                                const activeColor = isInheriting ? (folder.icon_color || "#6b7280") : (item.icon_color || "#6b7280");
                                return (
                                  <Draggable key={`item-${item.id}`} draggableId={`item-${item.id}`} index={itemIndex}>
                                    {(dragProv) => (
                                      <div ref={dragProv.innerRef} {...dragProv.draggableProps} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
                                        <div className="flex items-center gap-3">
                                          <div {...dragProv.dragHandleProps} className="p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                                            <GripVertical className="h-4 w-4" />
                                          </div>
                                          <ItemIcon className="h-4 w-4" style={{ color: activeColor }} />
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                                            {!isInheriting && (
                                              <span className="text-[10px] bg-gray-100 text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded font-medium">Custom</span>
                                            )}
                                          </div>
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
      <EditSidebarFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onSave={handleSaveFolder}
        folder={editingFolder}
      />

      {/* Item Modal */}
      <EditSidebarItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        item={editingItem}
        tree={tree}
      />

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
