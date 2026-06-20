import React from "react";
import { Tree, TreeNode } from "react-organizational-chart";

export default function DesignationsTree({
  designationTree,
  handleOpenDrawer,
}) {
  if (designationTree.length === 0) {
    return (
      <div className="text-gray-400 font-semibold text-xs mt-10">
        No tree data available
      </div>
    );
  }

  const renderDesigNode = (node) => (
    <TreeNode
      key={node.id}
      label={
        <div
          className="inline-block px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-xs hover:shadow-md transition-shadow min-w-[140px] cursor-pointer"
          onClick={() => handleOpenDrawer(node)}
        >
          <div className="font-bold text-gray-800 text-xs">{node.name}</div>
          {node.department && (
            <div className="text-[9px] text-gray-500 mt-0.5">{node.department.name}</div>
          )}
          <div
            className={`mt-1 text-[9px] font-bold px-2 py-0.5 rounded inline-block ${
              node.status === "Active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            }`}
          >
            {node.status}
          </div>
        </div>
      }
    >
      {node.children && node.children.map((child) => renderDesigNode(child))}
    </TreeNode>
  );

  return (
    <Tree
      lineWidth="2px"
      lineColor="#e5e7eb"
      lineBorderRadius="10px"
      label={
        <div className="inline-block px-4 py-2 bg-[#007aff] text-white font-bold text-xs rounded-xl shadow-md">
          Company Root
        </div>
      }
    >
      {designationTree.map((desig) => renderDesigNode(desig))}
    </Tree>
  );
}
