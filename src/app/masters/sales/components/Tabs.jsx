"use client";

import React from "react";

export default function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex gap-2 border-b border-gray-100 pb-2 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 whitespace-nowrap ${
              isActive
                ? "bg-[#007aff] text-white shadow-md shadow-blue-500/20"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
