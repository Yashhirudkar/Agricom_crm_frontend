import React from "react";
import { Building2, CreditCard, Users2, Package, User } from "lucide-react";
import Drawer from "@/components/common/Drawer";
import DynamicFieldRenderer from "@/components/common/DynamicFieldRenderer";

export default function ReplicaPreviewDrawer({
  isOpen,
  onClose,
  role,
  configName,
  fields,
  previewActiveTab,
  setPreviewActiveTab,
  previewValues,
  setPreviewValues
}) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Production Replica Preview"
      widthClass="w-full sm:w-[500px] md:w-[650px] lg:w-[750px]"
    >
      <div className="flex flex-col h-full bg-slate-50/50">
        {/* Replica CRM Info Summary Bar */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0 font-sans">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#007aff] font-extrabold text-sm uppercase">
              {role?.name?.substring(0, 2) || "PT"}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                  {role?.name || "Partner"} Profile
                </span>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-200">
                  Active
                </span>
              </div>
              <div className="text-sm font-bold text-gray-800 flex items-center gap-1 mt-0.5">
                ACME Logistics Corp
                <span className="text-gray-400 font-normal text-xs">(Mock Partner)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled
              className="px-3.5 py-1.5 bg-white border border-gray-200 text-gray-450 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-not-allowed opacity-60"
            >
              Edit Partner
            </button>
          </div>
        </div>

        {/* Replica Tabs Bar */}
        <div className="bg-white border-b border-gray-200 px-6 shrink-0 flex items-center justify-start overflow-x-auto gap-6 font-sans">
          {[
            { id: "overview", label: "Overview" },
            { id: "general", label: "General Information" },
            { id: "financial", label: "Financial Details" },
            { id: "contacts", label: "Contacts" },
            { id: "products", label: "Products" },
            { id: "additional", label: configName || "Extra Details" }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPreviewActiveTab(tab.id)}
              className={`py-3.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 -mb-[1px] ${
                previewActiveTab === tab.id
                  ? "border-[#007aff] text-[#007aff]"
                  : "border-transparent text-gray-550 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Preview Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col font-sans">
          {previewActiveTab === "additional" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-xs animate-in fade-in duration-200">
              <div className="border-b border-gray-100 pb-2 mb-2">
                <h3 className="text-xs font-bold text-[#007aff] uppercase tracking-wider">
                  {configName || "Extra Details"}
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Please configure the following attributes according to operations.
                </p>
              </div>

              <DynamicFieldRenderer
                schema={{ fields }}
                values={previewValues}
                onChange={setPreviewValues}
                isReadOnly={false}
              />
            </div>
          )}

          {previewActiveTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Role & Classification
                  </span>
                  <span className="text-xs font-bold text-gray-800 mt-2 flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-[#007aff]" />
                    {role?.name || "-"}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Financial Status
                  </span>
                  <span className="text-xs font-bold text-gray-850 mt-2 flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-emerald-500" />
                    Approved
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Associations Summary
                  </span>
                  <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-gray-650">
                    <span className="flex items-center gap-1 bg-blue-50 text-[#007aff] px-2 py-0.5 rounded">
                      <Users2 className="h-3.5 w-3.5" />
                      2 Contacts
                    </span>
                    <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                      <Package className="h-3.5 w-3.5" />
                      3 Products
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
                <h3 className="text-xs font-bold text-gray-850 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-[#007aff]" />
                  Primary Contact Representative
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Name</div>
                    <div className="text-xs font-bold text-gray-800 mt-0.5">John Doe</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Designation</div>
                    <div className="text-xs text-gray-750 mt-0.5">Operations Manager</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</div>
                    <a href="mailto:john@acme.com" className="text-xs text-[#007aff] hover:underline font-semibold mt-0.5 block">
                      john@acme.com
                    </a>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone</div>
                    <div className="text-xs text-gray-700 font-medium mt-0.5">+1 555 0199</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {previewActiveTab === "general" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-xs animate-in fade-in duration-200 text-xs">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Entity Name</div>
                  <div className="text-sm font-bold text-gray-850 mt-1 uppercase">ACME Logistics Corp</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Partner Role</div>
                  <div className="text-sm font-bold text-gray-850 mt-1">{role?.name || "-"}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Country</div>
                  <div className="text-xs font-bold text-gray-850 mt-1">United States</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">City</div>
                  <div className="text-xs font-bold text-gray-850 mt-1">New York</div>
                </div>
                <div className="col-span-2">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Address</div>
                  <div className="text-xs text-gray-700 mt-1 font-medium leading-relaxed">
                    100 Port Boulevard, Suite 500, New York, NY
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Website</div>
                  <a href="https://acmelogistics.com" target="_blank" rel="noreferrer" className="text-xs text-[#007aff] hover:underline font-bold block mt-1">
                    https://acmelogistics.com
                  </a>
                </div>
              </div>
            </div>
          )}

          {previewActiveTab === "financial" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-xs animate-in fade-in duration-200">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Primary Email</div>
                  <div className="text-xs font-bold text-gray-850 mt-1">billing@acme.com</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tax ID / VAT</div>
                  <div className="text-xs font-mono font-bold text-gray-800 mt-1">US-987654321</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">PAN No</div>
                  <div className="text-xs font-mono font-bold text-gray-450 mt-1">N/A</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">INN No</div>
                  <div className="text-xs font-mono font-bold text-gray-450 mt-1">N/A</div>
                </div>
              </div>
            </div>
          )}

          {previewActiveTab === "contacts" && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-200">
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-xs relative">
                <span className="absolute top-4 right-4 bg-blue-50 border border-blue-200 text-[#007aff] text-[9px] font-bold px-2 py-0.5 rounded">
                  Primary
                </span>
                <div className="font-bold text-gray-855 text-xs">John Doe</div>
                <div className="text-[10px] text-gray-400 font-semibold mt-0.5">Operations Manager</div>
                <div className="mt-3 space-y-1 text-xs text-gray-650">
                  <div>Email: john@acme.com</div>
                  <div>Phone: +1 555 0199</div>
                </div>
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-xs">
                <div className="font-bold text-gray-850 text-xs">Jane Smith</div>
                <div className="text-[10px] text-gray-400 font-semibold mt-0.5">Finance Manager</div>
                <div className="mt-3 space-y-1 text-xs text-gray-650">
                  <div>Email: jane@acme.com</div>
                  <div>Phone: +1 555 0200</div>
                </div>
              </div>
            </div>
          )}

          {previewActiveTab === "products" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs animate-in fade-in duration-200">
              <div className="flex flex-wrap gap-2">
                {["Dry Container Logistics", "Cold Chain Transport", "Port Clearance Services"].map((p) => (
                  <span key={p} className="px-3 py-1 bg-slate-50 border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold shadow-xs">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white shrink-0 border-t border-gray-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </Drawer>
  );
}
