import React, { useState, useEffect } from "react";
import Modal from "@/components/modals/Modal";
import IconPickerModal from "./IconPickerModal";
import { SidebarDynamicIcon } from "@/components/layout/sidebar-components/SidebarDynamicIcon";
import { ChevronDown } from "lucide-react";

export default function EditSidebarItemModal({ isOpen, onClose, onSave, item, tree }) {
  const [name, setName] = useState("");
  const [route, setRoute] = useState("");
  const [folderId, setFolderId] = useState("");
  const [permissionLink, setPermissionLink] = useState("");
  const [iconName, setIconName] = useState("");
  const [useFolderColor, setUseFolderColor] = useState(true);
  const [iconColor, setIconColor] = useState("#000000");
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setRoute(item.route || "");
      setFolderId(item.folder_id || "");
      setPermissionLink(item.permission_link || "");
      setIconName(item.icon_name || "");
      setUseFolderColor(item.use_folder_color !== undefined ? item.use_folder_color : true);
      setIconColor(item.icon_color || "#000000");
    } else {
      setName("");
      setRoute("");
      setFolderId(tree?.[0]?.id || "");
      setPermissionLink("");
      setIconName("");
      setUseFolderColor(true);
      setIconColor("#000000");
    }
  }, [item, isOpen, tree]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      route,
      folder_id: folderId,
      permission_link: permissionLink,
      icon_name: iconName,
      use_folder_color: useFolderColor,
      icon_color: useFolderColor ? null : iconColor,
    });
  };

  const selectedFolder = tree?.find((f) => f.id.toString() === folderId.toString());
  const displayColor = useFolderColor ? (selectedFolder?.icon_color || "#6b7280") : iconColor;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={item ? "Edit Sidebar Item" : "Create Sidebar Item"} maxWidth="max-w-lg">
        <div className="flex flex-col">
          {/* Custom Header Subtitle */}
          <div className="mb-5 -mt-2">
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Configure the route, permissions, and appearance of this navigation item.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            
            {/* General Information Group */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">General</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Item Name</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-9 border border-gray-200 rounded-lg px-3 text-[13px] text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow shadow-sm"
                    placeholder="e.g. Employee List"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Route Path</label>
                  <input
                    required
                    type="text"
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    className="w-full h-9 border border-gray-200 rounded-lg px-3 text-[13px] font-mono text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow shadow-sm"
                    placeholder="/employees"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5 flex justify-between">
                    Permission Link <span className="text-gray-400 font-normal">Optional</span>
                  </label>
                  <input
                    type="text"
                    value={permissionLink}
                    onChange={(e) => setPermissionLink(e.target.value)}
                    className="w-full h-9 border border-gray-200 rounded-lg px-3 text-[13px] font-mono text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow shadow-sm"
                    placeholder="e.g. employees:read"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Parent Folder</label>
                  <select
                    value={folderId}
                    onChange={(e) => setFolderId(e.target.value)}
                    className="w-full h-9 border border-gray-200 rounded-lg px-3 text-[13px] text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow shadow-sm cursor-pointer appearance-none bg-white"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px top 50%', backgroundSize: '10px auto' }}
                  >
                    <option value="">No Folder (Root Level)</option>
                    {tree?.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Appearance Group */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Appearance</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Icon Selection */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Item Icon</label>
                  <div 
                    onClick={() => setIsIconPickerOpen(true)}
                    className="w-full h-[60px] rounded-lg border border-gray-200 bg-white shadow-sm flex items-center justify-between px-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center">
                        <SidebarDynamicIcon iconName={iconName || "Circle"} className="h-4 w-4 text-gray-700 transition-colors" style={{ color: displayColor }} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-medium text-gray-900 truncate max-w-[100px]">
                          {iconName || "Select Icon"}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-blue-500" />
                  </div>
                </div>

                {/* Color Behavior */}
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Color Behavior</label>
                  
                  {/* Toggle */}
                  <div 
                    onClick={() => setUseFolderColor(!useFolderColor)}
                    className="w-full h-[30px] flex items-center justify-between px-2 rounded border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-[11px] font-medium text-gray-600">Inherit Folder</span>
                    <div className={`w-7 h-4 rounded-full transition-colors relative flex-shrink-0 ${useFolderColor ? "bg-black" : "bg-gray-200"}`}>
                      <div className={`absolute top-[2px] left-[2px] w-3 h-3 rounded-full bg-white transition-transform shadow-sm ${useFolderColor ? "translate-x-3" : "translate-x-0"}`} />
                    </div>
                  </div>

                  {/* Custom Color Input - conditionally rendered */}
                  {!useFolderColor && (
                    <div className="w-full h-[26px] rounded border border-gray-200 flex items-center justify-between px-2 relative overflow-hidden group animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-sm shadow-inner border border-black/10" style={{ backgroundColor: iconColor }} />
                        <span className="text-[11px] font-mono text-gray-700">{iconColor}</span>
                      </div>
                      <input
                        type="color"
                        value={iconColor}
                        onChange={(e) => setIconColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Group */}
            <div className="pt-2">
              <label className="block text-[13px] font-semibold text-gray-700 mb-2">Live Preview</label>
              <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                <div className="w-full bg-gray-50/50 rounded-md border border-gray-100 p-2">
                  
                  {/* Parent Context */}
                  {selectedFolder && (
                    <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md mb-1 opacity-60">
                      <SidebarDynamicIcon
                        iconName={selectedFolder.icon_name || "Folder"}
                        className="h-3.5 w-3.5"
                        style={{ color: selectedFolder.icon_color || "#6b7280" }}
                      />
                      <span className="text-[12px] font-medium text-gray-600">{selectedFolder.name}</span>
                    </div>
                  )}

                  {/* The Item Itself */}
                  <div className={`flex items-center gap-2.5 px-2 py-2 rounded-md bg-white border border-gray-200 shadow-sm ${selectedFolder ? 'ml-6' : ''}`}>
                    <SidebarDynamicIcon
                      iconName={iconName || "Circle"}
                      className="h-4 w-4"
                      style={{ color: displayColor }}
                    />
                    <span className="text-[13px] font-medium" style={{ color: displayColor }}>
                      {name || "Item Name"}
                    </span>
                  </div>

                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 mt-2 flex justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 h-9 bg-white border border-gray-200 text-gray-700 text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 h-9 bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-black transition-colors shadow-sm"
              >
                Save Item
              </button>
            </div>

          </form>
        </div>
      </Modal>

      <IconPickerModal
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        onSelect={(icon) => setIconName(icon)}
      />
    </>
  );
}
