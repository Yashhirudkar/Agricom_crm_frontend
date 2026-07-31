"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/lib/axios";
import { useSelector } from "react-redux";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
import { Tree, TreeNode } from "react-organizational-chart";
import { Users, Search, RefreshCw } from "lucide-react";
import SearchableSelect from "@/components/common/SearchableSelect";

export default function OrgChartPage() {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("full"); // full, my-team, chain
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [selectedEmp, setSelectedEmp] = useState(null);

  const activeCompanyId = useSelector(selectActiveCompanyId) || "";

  useEffect(() => {
    fetchChartData();
  }, [viewMode, selectedEmpId, activeCompanyId]);

  const fetchChartData = async () => {
    try {
      setIsLoading(true);
      if (!activeCompanyId) {
        setIsLoading(false);
        return;
      }

      let url = "/employees/org-chart/full";
      if (viewMode === "my-team") {
         if (selectedEmp) url = `/employees/${selectedEmp.value}/all-subordinates`;
         else url = "/employees/org-chart/full";
      }
      else if (viewMode === "chain" && selectedEmp) url = `/employees/${selectedEmp.value}/reporting-chain`;

      const res = await axiosClient.get(url);
      
      if (viewMode === "chain") {
        // Build nested tree from array [employee, manager, director...]
        let root = null;
        let current = null;
        const chain = res.data.reverse(); // Now [director, manager, employee]
        chain.forEach(node => {
           const formatted = { ...node, children: [] };
           if (!root) {
             root = formatted;
             current = root;
           } else {
             current.children.push(formatted);
             current = formatted;
           }
        });
        setChartData(root);
      } else {
        // the response is an array of roots (often just 1 root if there is 1 CEO)
        // If multiple roots exist, we might wrap them in a pseudo-root.
        if (Array.isArray(res.data)) {
          if (res.data.length === 1) {
            setChartData(res.data[0]);
          } else {
            setChartData({ firstName: "Company", lastName: "Board", children: res.data });
          }
        } else {
          setChartData(res.data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const StyledNode = ({ node }) => (
    <div className="inline-block px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-xs hover:shadow-md transition-shadow min-w-[160px]">
      <div className="font-bold text-gray-800 text-xs">
        {node.firstName} {node.lastName}
      </div>
      <div className="text-[10px] text-gray-500 font-medium mt-1">
        {node.designation?.name || "Employee"}
      </div>
      {node.department && (
        <div className="mt-2 text-[9px] font-bold px-2 py-0.5 bg-blue-50 text-[#007aff] rounded inline-block">
          {node.department.name}
        </div>
      )}
    </div>
  );

  const renderTree = (node) => (
    <TreeNode key={node.id || Math.random()} label={<StyledNode node={node} />}>
      {node.children && node.children.map(child => renderTree(child))}
    </TreeNode>
  );

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-[#007aff]" />
            Organization Chart
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Visual representation of your company's reporting hierarchy.
          </p>
        </div>
        
        <div className="flex gap-2">
          <select 
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-white"
          >
            <option value="full">Full Company Hierarchy</option>
            <option value="my-team">My Team</option>
            <option value="chain">Specific Reporting Chain</option>
          </select>
          
          {(viewMode === "chain" || viewMode === "my-team") && (
            <div className="w-[200px]">
              <SearchableSelect
                endpoint="/employees/options"
                value={selectedEmp}
                onChange={(val) => {
                  setSelectedEmp(val);
                  setSelectedEmpId(val ? val.value : "");
                }}
                placeholder="Search Employee..."
              />
            </div>
          )}

          <button onClick={fetchChartData} className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-[#007aff] transition-colors">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 min-h-[600px] overflow-auto flex justify-center items-start">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
            <p className="text-xs font-semibold text-gray-400">Rendering Chart...</p>
          </div>
        ) : !chartData ? (
           <div className="text-sm font-semibold text-gray-400 mt-20">No hierarchy data available for this view.</div>
        ) : (
          <Tree
            lineWidth="2px"
            lineColor="#e5e7eb"
            lineBorderRadius="10px"
            label={<StyledNode node={chartData} />}
          >
            {chartData.children && chartData.children.map(child => renderTree(child))}
          </Tree>
        )}
      </div>
    </div>
  );
}
