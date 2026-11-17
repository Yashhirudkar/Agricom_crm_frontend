"use client";

import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "@/lib/axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Modal from "@/components/modals/Modal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { Plus, Edit2, Trash2, Folder, Layout, Check, AlertCircle, GripVertical, Palette, Eye, EyeOff, ChevronDown } from "lucide-react";
import { getDynamicIcon } from "@/components/layout/sidebar-components/icons";
import EditSidebarFolderModal from "./components/EditSidebarFolderModal";
import EditSidebarItemModal from "./components/EditSidebarItemModal";
import SidebarBuilderSkeleton from "./components/SidebarSkeleton";

export default function SidebarBuilderPage() {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const isFirstLoad = useRef(true);

  const fetchTree = async () => {
    // On first load (empty tree): show skeleton. On re-fetches: keep stale tree visible.
    if (isFirstLoad.current) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    try {
      const res = await axiosInstance.get(`/system/sidebar/tree?include_inactive=true&t=${Date.now()}`);
      setTree(res.data);
    } catch (err) {
      showToast("Failed to load sidebar tree", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
      isFirstLoad.current = false;
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

  const handleToggleCollapsible = async (folder) => {
    const newValue = !folder.is_collapsible;
    try {
      await axiosInstance.patch(`/system/sidebar/folder/${folder.id}`, {
        is_collapsible: newValue,
      });
      showToast(`Folder is now ${newValue ? "collapsible (accordion)" : "standard (static)"}`);
      fetchTree();
      window.dispatchEvent(new Event("sidebar-updated"));
    } catch (err) {
      showToast("Failed to update folder mode", "error");
    }
  };

  const handleToggleActive = async (folder) => {
    const newValue = folder.is_active === false ? true : false;
    try {
      await axiosInstance.patch(`/system/sidebar/folder/${folder.id}`, {
        is_active: newValue,
      });
      showToast(`Folder is now ${newValue ? "visible in sidebar (ON)" : "hidden from sidebar (OFF)"}`);
      fetchTree();
      window.dispatchEvent(new Event("sidebar-updated"));
    } catch (err) {
      showToast("Failed to update folder visibility", "error");
    }
  };

  const handleToggleItemActive = async (item) => {
    const newValue = item.is_active === false ? true : false;
    try {
      await axiosInstance.patch(`/system/sidebar/item/${item.id}`, {
        is_active: newValue,
      });
      showToast(`Item "${item.name}" is now ${newValue ? "visible" : "hidden"}`);
      fetchTree();
      window.dispatchEvent(new Event("sidebar-updated"));
    } catch (err) {
      showToast("Failed to update item visibility", "error");
    }
  };

  // First-load skeleton only — never blank the screen on re-fetches
  if (loading && tree.length === 0) {
    return <SidebarBuilderSkeleton />;
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

      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        {/* Hairline progress bar — visible only during silent background refresh */}
        <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl overflow-hidden transition-opacity duration-300 ${refreshing ? "opacity-100" : "opacity-0"}`}>
          <div className="h-full bg-[#007aff] animate-[slide-in_0.6s_ease-out_forwards]" style={{ animation: refreshing ? "slideIn 0.6s ease-out forwards" : "none" }} />
        </div>
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(-100%); }
            to   { transform: translateX(0); }
          }
        `}</style>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="root-folders" type="folder">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {tree.map((folder, folderIndex) => (
                  <Draggable key={`folder-${folder.id}`} draggableId={`folder-${folder.id}`} index={folderIndex}>
                    {(prov) => (
                      <div ref={prov.innerRef} {...prov.draggableProps} className={`rounded-xl border overflow-hidden transition-all ${folder.is_active === false ? "bg-gray-100/70 border-dashed border-gray-300 opacity-80" : "bg-gray-50 border-gray-200"}`}>
                        <div className={`flex items-center justify-between p-3 border-b transition-colors ${folder.is_active === false ? "bg-gray-200/50 border-gray-200" : "bg-gray-100/50 border-gray-200"}`}>
                          <div className="flex items-center gap-3">
                            <div {...prov.dragHandleProps} className="p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                              <GripVertical className="h-4 w-4" />
                            </div>
                            <Folder className="h-4 w-4" style={folder.icon_color ? { color: folder.icon_color } : { color: "#007aff" }} />
                            <span className={`text-sm font-bold uppercase tracking-wider ${folder.is_active === false ? "text-gray-500 line-through" : "text-gray-700"}`}>{folder.name}</span>
                            {folder.is_active === false && (
                              <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-200 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Hidden (OFF)
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {folder.id !== 0 && (
                              <>
                                <button
                                  className="p-1 text-gray-400 hover:text-indigo-500 transition-colors"
                                  title="Folder color configuration"
                                >
                                  <Palette className="h-4 w-4" />
                                </button>

                                {/* Visibility Toggle — ON / OFF (Hides completely from everyone including admin) */}
                                <button
                                  onClick={() => handleToggleActive(folder)}
                                  title={folder.is_active !== false ? "Visible in sidebar — click to turn OFF (hide completely from everyone including admin)" : "Hidden from sidebar — click to turn ON (make visible in sidebar)"}
                                  className={`
                                    inline-flex items-center justify-center gap-1.5
                                    px-2.5 py-0.5
                                    rounded-md
                                    border
                                    text-[10px] font-bold tracking-widest uppercase
                                    select-none cursor-pointer
                                    transition-all duration-150
                                    active:scale-95
                                    focus:outline-none
                                    ${folder.is_active !== false
                                      ? "bg-emerald-600 border-emerald-700 text-white shadow-sm hover:bg-emerald-700"
                                      : "bg-gray-100 border-gray-300 text-gray-400 shadow-[inset_0_2px_3px_rgba(0,0,0,0.08)] hover:bg-gray-200 hover:text-gray-600"
                                    }
                                  `}
                                >
                                  {folder.is_active !== false ? (
                                    <>
                                      <Eye className="h-3 w-3" />
                                      <span>ON</span>
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff className="h-3 w-3" />
                                      <span>OFF</span>
                                    </>
                                  )}
                                </button>

                                {/* Collapsible Toggle */}
                                <button
                                  onClick={() => handleToggleCollapsible(folder)}
                                  title={folder.is_collapsible ? "Collapsible ON (Accordion) — click to make static" : "Collapsible OFF (Static) — click to make accordion"}
                                  className={`
                                    inline-flex items-center gap-1
                                    px-2 py-0.5
                                    rounded-md
                                    border
                                    text-[10px] font-semibold
                                    select-none cursor-pointer
                                    transition-all
                                    ${folder.is_collapsible
                                      ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                                      : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100"
                                    }
                                  `}
                                >
                                  <ChevronDown className={`h-3 w-3 transition-transform ${folder.is_collapsible ? "rotate-180" : ""}`} />
                                  <span>{folder.is_collapsible ? "Accordion" : "Static"}</span>
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
                              </>
                            )}
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
                                      <div ref={dragProv.innerRef} {...dragProv.draggableProps} className={`flex items-center justify-between p-3 rounded-lg border shadow-sm transition-all ${item.is_active === false ? "bg-gray-50/80 border-gray-200 opacity-60" : "bg-white border-gray-100 hover:border-blue-200"}`}>
                                        <div className="flex items-center gap-3">
                                          <div {...dragProv.dragHandleProps} className="p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                                            <GripVertical className="h-4 w-4" />
                                          </div>
                                          <ItemIcon className="h-4 w-4" style={{ color: activeColor }} />
                                          <div className="flex items-center gap-2">
                                            <span className={`text-sm font-semibold ${item.is_active === false ? "text-gray-400 line-through" : "text-gray-700"}`}>{item.name}</span>
                                            {item.is_active === false && (
                                              <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-200 font-semibold px-1.5 py-0.5 rounded">
                                                Hidden
                                              </span>
                                            )}
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
                                          {/* Item Visibility Toggle */}
                                          <button
                                            onClick={() => handleToggleItemActive(item)}
                                            title={item.is_active !== false ? "Visible in sidebar — click to hide" : "Hidden from sidebar — click to show"}
                                            className={`
                                              p-1.5 rounded-md border text-xs font-bold transition-all cursor-pointer
                                              ${item.is_active !== false
                                                ? "text-emerald-600 hover:bg-emerald-50 border-transparent hover:border-emerald-200"
                                                : "text-rose-500 bg-rose-50 border-rose-200 hover:bg-rose-100"
                                              }
                                            `}
                                          >
                                            {item.is_active !== false ? (
                                              <Eye className="h-3.5 w-3.5" />
                                            ) : (
                                              <EyeOff className="h-3.5 w-3.5" />
                                            )}
                                          </button>
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
