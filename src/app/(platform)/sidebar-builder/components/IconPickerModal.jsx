import React, { useState, useMemo } from "react";
import Modal from "@/components/modals/Modal";
import * as LucideIcons from "lucide-react";

// Get all icon names from Lucide that start with a capital letter
const allIconNames = Object.keys(LucideIcons).filter(
  (key) => key.charAt(0) === key.charAt(0).toUpperCase() && typeof LucideIcons[key] === "object" || typeof LucideIcons[key] === "function"
);

export default function IconPickerModal({ isOpen, onClose, onSelect }) {
  const [search, setSearch] = useState("");

  const filteredIcons = useMemo(() => {
    if (!search) return allIconNames.slice(0, 200); // limit to 200 for performance when no search
    return allIconNames.filter((name) =>
      name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 200);
  }, [search]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Icon">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 border border-gray-200 rounded-xl px-4 text-[13px] outline-none focus:border-gray-300 transition-colors bg-gray-50/50"
        />

        <div className="grid grid-cols-6 gap-2 max-h-[350px] overflow-y-auto p-1 mt-4">
          {filteredIcons.map((iconName) => {
            const IconComponent = LucideIcons[iconName];
            if (!IconComponent) return null;
            return (
              <button
                key={iconName}
                onClick={() => {
                  onSelect(iconName);
                  onClose();
                }}
                className="group flex flex-col items-center justify-center p-3 rounded-xl border border-transparent bg-white hover:border-gray-200 hover:bg-gray-50 cursor-pointer transition-all h-20"
                title={iconName}
              >
                <IconComponent className="h-[22px] w-[22px] text-gray-500 group-hover:text-gray-900 mb-2 transition-colors" strokeWidth={1.5} />
                <span className="text-[10px] font-medium text-gray-400 group-hover:text-gray-700 truncate w-full text-center">
                  {iconName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
