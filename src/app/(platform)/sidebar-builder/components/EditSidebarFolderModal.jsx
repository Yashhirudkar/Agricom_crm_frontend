import React, { useState, useEffect } from "react";
import Modal from "@/components/modals/Modal";
import IconPickerModal from "./IconPickerModal";
import { SidebarDynamicIcon } from "@/components/layout/sidebar-components/SidebarDynamicIcon";
import { ChevronDown, FolderOpen } from "lucide-react";

export default function EditSidebarFolderModal({ isOpen, onClose, onSave, folder }) {
  const [name, setName] = useState("");
  const [iconName, setIconName] = useState("");
  const [iconColor, setIconColor] = useState("#000000");
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  useEffect(() => {
    if (folder) {
      setName(folder.name || "");
      setIconName(folder.icon_name || "");
      setIconColor(folder.icon_color || "#000000");
    } else {
      setName("");
      setIconName("");
      setIconColor("#000000");
    }
  }, [folder, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      icon_name: iconName,
      icon_color: iconColor,
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={folder ? "Edit Sidebar Folder" : "Create Sidebar Folder"} maxWidth="max-w-lg">
        <div className="flex flex-col">
          {/* Custom Header Subtitle */}
          <div className="mb-6 -mt-2">
            <p className="text-[13px] text-gray-500">
              Customize the appearance and behavior of this sidebar group.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            
            {/* Input Section */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Folder Name
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 border border-gray-200 rounded-lg px-3 text-[13px] text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow bg-white shadow-sm"
                placeholder="e.g. Leave Management"
              />
            </div>

            {/* Grid for Icon and Color to save space */}
            <div className="grid grid-cols-2 gap-4">
              {/* Icon Section */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  Folder Icon
                </label>
                <div 
                  onClick={() => setIsIconPickerOpen(true)}
                  className="w-full h-[68px] rounded-lg border border-gray-200 bg-white shadow-sm flex items-center justify-between px-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-white transition-colors">
                      <SidebarDynamicIcon iconName={iconName || "Folder"} className="h-4 w-4 text-gray-700" style={{ color: iconColor }} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium text-gray-900 leading-tight">
                        {iconName || "Select Icon"}
                      </span>
                      <span className="text-[11px] text-gray-500">Click to browse</span>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>

              {/* Color Section */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  Theme Color
                </label>
                <div className="w-full h-[68px] rounded-lg border border-gray-200 bg-white shadow-sm flex items-center justify-between px-4 relative overflow-hidden group hover:border-blue-400 transition-all">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-8 w-8 rounded-md shadow-inner border border-black/5"
                      style={{ backgroundColor: iconColor }}
                    />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium text-gray-900 leading-tight uppercase font-mono">
                        {iconColor}
                      </span>
                      <span className="text-[11px] text-gray-500">Click to change</span>
                    </div>
                  </div>
                  <input
                    type="color"
                    value={iconColor}
                    onChange={(e) => setIconColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="pt-2">
              <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                Live Preview
              </label>
              <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                {/* Simulated Sidebar Layout */}
                <div className="w-full bg-gray-50/50 rounded-md border border-gray-100 p-2 space-y-1">
                  
                  {/* Parent Folder Line */}
                  <div className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-100/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <SidebarDynamicIcon
                        iconName={iconName || "Folder"}
                        className="h-4 w-4"
                        style={{ color: iconColor }}
                      />
                      <span className="text-[13px] font-medium text-gray-700 select-none">
                        {name || "Folder Name"}
                      </span>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                  </div>

                  {/* Child Items */}
                  <div className="pl-6 space-y-1">
                    <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md bg-white border border-gray-200 shadow-sm">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: iconColor }} />
                      <span className="text-[13px] font-medium" style={{ color: iconColor }}>Active Item</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-gray-100/50 transition-colors">
                      <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                      <span className="text-[13px] font-medium text-gray-600">Child Item</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-5 mt-2 flex justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 h-9 bg-white border border-gray-200 text-gray-700 text-[13px] font-medium rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 h-9 bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-black transition-colors shadow-sm"
              >
                Save Folder
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
