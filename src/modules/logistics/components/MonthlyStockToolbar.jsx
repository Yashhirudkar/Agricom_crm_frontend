"use client";

import React, { useState } from "react";
import {
  Plus,
  Save,
  CheckCircle2,
  Download,
  Printer,
  Sparkles,
  FileSpreadsheet,
} from "lucide-react";

const TEMPLATE_OPTIONS = [
  {
    key: "indian",
    title: "Indian Stock",
    columns: ["SR", "PLACE", "QTY", "RATE", "AMOUNT", "PAYMENT STATUS"],
    desc: "Standard domestic stock template with rates & payment status.",
  },
  {
    key: "russia",
    title: "Russia Stock",
    columns: ["SR", "ITEM", "STOCK", "RATE", "VALUE", "PLACE"],
    desc: "Import stock tracking template with item breakdown.",
  },
  {
    key: "summary",
    title: "Indian Summary",
    columns: ["SR", "COMMODITY", "OPENING", "PURCHASE", "SALES", "CLOSING"],
    desc: "Consolidated opening & closing summary layout.",
  },
  {
    key: "kazak",
    title: "Kazak Stock",
    columns: ["SR", "CONTAINER NO", "VESSEL", "PORT", "QTY MT", "STATUS"],
    desc: "Container shipment & vessel logistics template.",
  },
  {
    key: "empty",
    title: "Empty Section",
    columns: ["SR"],
    desc: "Blank section starting with standard SR column.",
  },
];

export default function MonthlyStockToolbar({
  onAddSection,
  onSaveAll,
  onPublish,
  onExportExcel,
  onExportCSV,
  onPrint,
  isDirty = false,
  savingAll = false,
  isReadOnly = false,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [selectedTemplateKey, setSelectedTemplateKey] = useState("indian");

  const handleCreateSection = () => {
    if (!sectionTitle || !sectionTitle.trim()) return;
    const selectedTemplate = TEMPLATE_OPTIONS.find((t) => t.key === selectedTemplateKey);

    onAddSection({
      sectionName: sectionTitle.trim(),
      presetColumns: selectedTemplate ? selectedTemplate.columns : ["SR"],
    });

    setSectionTitle("");
    setModalOpen(false);
  };

  if (isReadOnly) return null;

  return (
    <>
      <div className="bg-white p-4 md:px-6 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-2">
          {!isReadOnly && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-4 py-2.5 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Section
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {!isReadOnly && (
            <>
              <button
                type="button"
                onClick={onSaveAll}
                disabled={savingAll || !isDirty}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isDirty
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {savingAll ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save All Sections
              </button>

              <button
                type="button"
                onClick={onPublish}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                Publish Report
              </button>
            </>
          )}

          <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

          <button
            type="button"
            onClick={onExportExcel}
            className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            title="Export Excel (.xlsx)"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Excel
          </button>

          <button
            type="button"
            onClick={onExportCSV}
            className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            title="Export CSV"
          >
            <Download className="h-4 w-4 text-blue-600" />
            CSV
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            title="Print A4 Landscape"
          >
            <Printer className="h-4 w-4 text-gray-600" />
            Print
          </button>
        </div>
      </div>

      {/* Add Section Modal with Template Presets */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-5">
            <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#007aff]" />
              Create Section & Select Template
            </h4>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Section Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateSection()}
                placeholder="e.g. Yellow Millet, Import Mumbai, Russia Stock..."
                autoFocus
                className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#007aff] font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Preset Column Template
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                {TEMPLATE_OPTIONS.map((tmpl) => (
                  <div
                    key={tmpl.key}
                    onClick={() => setSelectedTemplateKey(tmpl.key)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      selectedTemplateKey === tmpl.key
                        ? "border-[#007aff] bg-blue-50/50 shadow-2xs"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="template"
                      checked={selectedTemplateKey === tmpl.key}
                      onChange={() => setSelectedTemplateKey(tmpl.key)}
                      className="mt-0.5"
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-900">{tmpl.title}</div>
                      <div className="text-[11px] text-gray-500 font-medium">{tmpl.desc}</div>
                      <div className="text-[10px] text-blue-600 font-mono mt-1">
                        Columns: {tmpl.columns.join(", ")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateSection}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl shadow-xs cursor-pointer"
              >
                Create Section
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
