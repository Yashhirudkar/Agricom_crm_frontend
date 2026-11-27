"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  FileText,
  Upload,
  Image as ImageIcon,
  ClipboardPaste,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  Paperclip,
  Building2,
  ChevronDown,
  ChevronUp,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import {
  extractClipboardImportFile,
  formatInrPreview,
  formatExchangeRatePreview,
} from "./dnbImportApi";

function ConfidenceBadge({ confidence, needsReview }) {
  if (!confidence) return null;
  const isLow = Boolean(needsReview || confidence < 80);
  const style = isLow
    ? "bg-amber-100 text-amber-800 border-amber-300"
    : confidence >= 90
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : "bg-blue-100 text-blue-800 border-blue-200";

  return (
    <span
      className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold border whitespace-nowrap ${style}`}
      title={
        isLow
          ? "Confidence below 80% — Suggested only (not auto-filled). Review or edit before applying."
          : "High confidence — auto-filled into CRM"
      }
    >
      {confidence}%{isLow ? " Review" : ""}
    </span>
  );
}

function EditablePreviewField({
  label,
  field,
  type = "text",
  onChange,
  onAcceptSuggestion,
  displayOverride = null,
  readOnly = false,
  className = "",
}) {
  if (!field || field.value === null || field.value === undefined || field.value === "") {
    return null;
  }

  const isLowConf = Boolean(field.needsReview || Number(field.confidence ?? 0) < 80);

  return (
    <div
      className={`rounded-lg p-2.5 border transition-colors ${className} ${
        isLowConf
          ? "bg-amber-50/90 border-amber-300"
          : "bg-white border-emerald-100"
      }`}
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">
          {label}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <ConfidenceBadge
            confidence={field.confidence}
            needsReview={field.needsReview}
          />
          {isLowConf && typeof onAcceptSuggestion === "function" && (
            <button
              type="button"
              onClick={onAcceptSuggestion}
              className="px-1.5 py-0.5 rounded bg-amber-600 hover:bg-amber-700 text-white text-[9px] font-bold transition-colors cursor-pointer"
              title="Accept suggestion and auto-fill into CRM form"
            >
              Apply
            </button>
          )}
        </div>
      </div>
      {readOnly || !onChange ? (
        <span className="text-xs font-extrabold text-gray-800 block break-words" title={String(displayOverride ?? field.value)}>
          {displayOverride ?? field.value}
        </span>
      ) : (
        <input
          type={type}
          step={type === "number" ? "any" : undefined}
          value={field.value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-xs font-bold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-[#007aff] focus:outline-none py-0.5"
        />
      )}
      {isLowConf && (
        <p className="text-[9px] font-semibold text-amber-700 mt-1">
          Suggested only (&lt;80% confidence) — edit or click Apply to fill CRM.
        </p>
      )}
    </div>
  );
}

export default function DnbReportImportBox({
  importState,
  isProcessing,
  onFileSelected,
  onReset,
  onUpdateField,
  onAcceptSuggestion,
  onAcceptAllSuggestions,
  onDuplicateUpdateExisting,
  onDuplicateCreateNew,
  canAttachAsReportFile = false,
  onAttachAsReportFile,
}) {
  const dropZoneRef = useRef(null);
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pasteHint, setPasteHint] = useState("");
  const [showAllDetails, setShowAllDetails] = useState(false);

  const handleFiles = useCallback(
    (fileList) => {
      if (isProcessing) return;
      const file = fileList?.[0];
      if (file) {
        setPasteHint("");
        onFileSelected(file);
      }
    },
    [isProcessing, onFileSelected]
  );

  // Support Ctrl+V anywhere inside the active D&B form when not typing inside another input
  useEffect(() => {
    const handleWindowPaste = (e) => {
      if (isProcessing) return;
      const target = e.target;
      const isTextField =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable) &&
        target !== dropZoneRef.current;

      const pastedFile = extractClipboardImportFile(e.clipboardData);
      if (!pastedFile) return;

      if (!isTextField || target.type === "file") {
        e.preventDefault();
        setPasteHint("");
        onFileSelected(pastedFile);
      }
    };

    window.addEventListener("paste", handleWindowPaste);
    return () => window.removeEventListener("paste", handleWindowPaste);
  }, [isProcessing, onFileSelected]);

  const handleZonePaste = (e) => {
    if (isProcessing) return;
    const pastedFile = extractClipboardImportFile(e.clipboardData);
    if (pastedFile) {
      e.preventDefault();
      e.stopPropagation();
      setPasteHint("");
      onFileSelected(pastedFile);
    } else {
      setPasteHint("No image or PDF found in clipboard. Copy a screenshot and press Ctrl+V.");
    }
  };

  const handlePasteButtonClick = async () => {
    if (isProcessing) return;
    setPasteHint("");

    if (typeof navigator !== "undefined" && navigator.clipboard?.read) {
      try {
        const clipboardItems = await navigator.clipboard.read();
        for (const item of clipboardItems) {
          const imageType = item.types.find((t) => t.startsWith("image/"));
          if (imageType) {
            const blob = await item.getType(imageType);
            const ext = imageType.split("/")[1]?.replace("jpeg", "jpg") || "png";
            const file = new File(
              [blob],
              `pasted-dnb-screenshot-${Date.now()}.${ext}`,
              { type: imageType, lastModified: Date.now() }
            );
            onFileSelected(file);
            return;
          }
        }
        setPasteHint("Clipboard has no image. Copy a D&B screenshot first, then click or press Ctrl+V.");
      } catch {
        dropZoneRef.current?.focus();
        setPasteHint("Focus set on import box — press Ctrl+V to paste your screenshot.");
      }
    } else {
      dropZoneRef.current?.focus();
      setPasteHint("Focus set on import box — press Ctrl+V to paste your screenshot.");
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing) setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing && !isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isProcessing) return;
    handleFiles(e.dataTransfer?.files);
  };

  const report = importState.report;
  const fin = report?.financial;
  const rateText = formatExchangeRatePreview(
    fin?.exchangeRate,
    fin?.originalCurrency?.value
  );

  const duplicate = importState.duplicateMatch;
  const showDuplicateAlert =
    duplicate?.found && duplicate?.partner && !importState.duplicateDismissed;

  const suggestedFields = importState.suggestedFields || [];
  const lowConfidenceCount = suggestedFields.length;

  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-slate-50/80 via-white to-blue-50/40 p-4 space-y-3 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#007aff]/10 text-[#007aff] flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              AI D&amp;B Report Import (Screenshot + PDF + Paste)
            </h4>
            <p className="text-[10px] text-gray-500 font-medium">
              Auto-extracts company details, address, contacts, financials, risk scores &amp; converts to INR (₹)
            </p>
          </div>
        </div>

        {importState.status !== "idle" && !isProcessing && (
          <button
            type="button"
            onClick={() => {
              setPasteHint("");
              onReset();
            }}
            className="text-[10px] font-bold text-gray-400 hover:text-gray-600 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="h-3 w-3" /> Clear Import
          </button>
        )}
      </div>

      {/* Drop / Paste Zone */}
      <div
        ref={dropZoneRef}
        tabIndex={0}
        onPaste={handleZonePaste}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-label="Import D&B Report drop and paste area"
        className={`relative rounded-xl border-2 border-dashed p-4 transition-all outline-none ${
          isProcessing
            ? "border-blue-300 bg-blue-50/40 cursor-wait opacity-80"
            : isDragging
              ? "border-[#007aff] bg-blue-50/70 ring-2 ring-[#007aff]/20"
              : "border-gray-200 bg-white/80 hover:border-blue-300 focus:border-[#007aff] focus:ring-2 focus:ring-[#007aff]/15"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.pdf,image/png,image/jpeg,image/webp,application/pdf"
          disabled={isProcessing}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />
        <input
          ref={pdfInputRef}
          type="file"
          accept=".pdf,application/pdf"
          disabled={isProcessing}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />

        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-3 text-center space-y-2">
            <Loader2 className="h-6 w-6 text-[#007aff] animate-spin" />
            <div>
              <p className="text-xs font-bold text-gray-800">
                Scanning {importState.fileName || "D&B Report"}...
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Extracting company, financial, contact &amp; risk fields across all pages
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-2.5">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePasteButtonClick}
                className="px-3 py-1.5 rounded-lg bg-[#007aff] hover:bg-blue-600 text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                <ClipboardPaste className="h-3.5 w-3.5" />
                Paste Screenshot (Ctrl+V)
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <ImageIcon className="h-3.5 w-3.5 text-[#007aff]" />
                Upload Image
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => pdfInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <FileText className="h-3.5 w-3.5 text-rose-500" />
                Upload PDF
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
              <Upload className="h-3.5 w-3.5 text-gray-400" />
              <span>
                Drag &amp; Drop here or press <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-gray-100 border border-gray-200 rounded">Ctrl+V</kbd>
              </span>
            </div>

            <p className="text-[10px] font-semibold text-gray-400 tracking-wide">
              PNG &bull; JPG &bull; JPEG &bull; WEBP &bull; PDF (Single &amp; Multi-Page, Max 10MB)
            </p>
          </div>
        )}
      </div>

      {pasteHint && (
        <p className="text-[11px] font-medium text-blue-600 px-1">{pasteHint}</p>
      )}

      {/* Duplicate Detection Banner */}
      {showDuplicateAlert && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3.5 space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <Building2 className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-amber-900">
                Existing Company Found
              </p>
              <p className="text-[11px] font-medium text-amber-800 mt-0.5">
                Matched <span className="font-bold">{duplicate.partner.entityName}</span>
                {duplicate.partner.country ? ` (${duplicate.partner.country})` : ""} via{" "}
                <span className="font-bold">
                  {duplicate.matchType === "DUNS"
                    ? `D-U-N-S ${duplicate.matchedValue}`
                    : duplicate.matchType === "VAT_TAX_ID"
                      ? `VAT / Tax ID ${duplicate.matchedValue}`
                      : `Company Name`}
                </span>
                .
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pl-6">
            {typeof onDuplicateUpdateExisting === "function" && (
              <button
                type="button"
                onClick={() => onDuplicateUpdateExisting(duplicate.partner.id, report)}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" /> Update Existing
              </button>
            )}
            <button
              type="button"
              onClick={onDuplicateCreateNew}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-100/70 text-amber-900 border border-amber-300 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserCheck className="h-3 w-3" /> Create New
            </button>
            <button
              type="button"
              onClick={() => {
                setPasteHint("");
                onReset();
              }}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-600 border border-gray-200 text-[11px] font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rich OCR Preview Panel — Success */}
      {importState.status === "success" && report && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-extrabold">
                ✅ {importState.message || "OCR Completed Successfully"}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-800 border border-emerald-200">
                {importState.extractedCount} Fields &bull; {importState.pageCount} Page{importState.pageCount > 1 ? "s" : ""}
              </span>
              {lowConfidenceCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {lowConfidenceCount} Need Review
                </span>
              )}
              {importState.manuallyOverridden && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  Manual Override Active
                </span>
              )}
            </div>
            {importState.fileName && (
              <span className="text-[10px] font-semibold text-emerald-700 truncate max-w-[200px]" title={importState.fileName}>
                {importState.fileName}
              </span>
            )}
          </div>

          {/* Primary Financial Conversion Summary */}
          {fin?.annualSalesOriginal?.value !== null && fin?.annualSalesOriginal?.value !== undefined && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white/95 rounded-lg p-2.5 border border-emerald-200">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Original Sales
                  </span>
                  <ConfidenceBadge
                    confidence={fin.annualSalesOriginal.confidence}
                    needsReview={fin.annualSalesOriginal.needsReview}
                  />
                </div>
                <span className="text-xs font-extrabold text-gray-800 mt-0.5 block">
                  {fin.detectedValueDisplay || fin.annualSalesOriginal.value}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Currency
                  </span>
                  <ConfidenceBadge
                    confidence={fin.originalCurrency?.confidence}
                    needsReview={fin.originalCurrency?.needsReview}
                  />
                </div>
                <span className="text-xs font-extrabold text-gray-800 mt-0.5 block">
                  {fin.originalCurrency?.value || "Not Detected"}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Exchange Rate
                </span>
                <span className="text-xs font-bold text-gray-700 mt-0.5 block">
                  {rateText || (fin.originalCurrency?.value === "INR" ? "1 INR = ₹1.00" : "-")}
                </span>
                {fin.exchangeRateDate && (
                  <span className="text-[9px] text-gray-400 block">
                    {fin.exchangeRateDate}
                  </span>
                )}
              </div>

              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Converted (INR)
                </span>
                <span className="text-xs font-extrabold text-emerald-700 mt-0.5 block">
                  {fin.annualSalesInr?.value !== null && fin.annualSalesInr?.value !== undefined
                    ? `${formatInrPreview(fin.annualSalesInr.value)} INR`
                    : "Enter Manually"}
                </span>
              </div>
            </div>
          )}

          {/* Low-Confidence Suggested Fields (< 80% — Not Auto-Filled Yet) */}
          {suggestedFields.length > 0 && (
            <div className="rounded-lg border border-amber-300 bg-amber-50/90 p-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="text-[11px] font-semibold text-amber-900">
                <span className="font-extrabold">
                  {suggestedFields.length} field{suggestedFields.length > 1 ? "s" : ""} below 80% confidence:
                </span>{" "}
                Shown as suggestions only and <span className="underline">not auto-filled</span>. Review, edit, or click Apply.
              </div>
              {typeof onAcceptAllSuggestions === "function" && (
                <button
                  type="button"
                  onClick={onAcceptAllSuggestions}
                  className="px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold transition-colors cursor-pointer"
                >
                  Apply All Reviewed
                </button>
              )}
            </div>
          )}

          {/* Key Extracted CRM & D&B Fields (Editable Inline) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <EditablePreviewField
              label="Company Name"
              field={report.companyInfo?.companyName}
              onChange={(v) => onUpdateField?.("companyInfo", "companyName", v)}
              onAcceptSuggestion={() => onAcceptSuggestion?.("companyInfo", "companyName")}
              className="col-span-2 sm:col-span-2"
            />
            <EditablePreviewField
              label="D-U-N-S"
              field={report.companyInfo?.dunsNumber}
              onChange={(v) => onUpdateField?.("companyInfo", "dunsNumber", v)}
              onAcceptSuggestion={() => onAcceptSuggestion?.("companyInfo", "dunsNumber")}
            />
            <EditablePreviewField
              label="Address"
              field={report.address?.fullAddress}
              onChange={(v) => onUpdateField?.("address", "fullAddress", v)}
              onAcceptSuggestion={() => onAcceptSuggestion?.("address", "fullAddress")}
              className="col-span-2 sm:col-span-3"
            />
            <EditablePreviewField
              label="Street"
              field={report.address?.street}
              onChange={(v) => onUpdateField?.("address", "street", v)}
              onAcceptSuggestion={() => onAcceptSuggestion?.("address", "street")}
            />
            <EditablePreviewField
              label="Postal Code"
              field={report.address?.postalCode}
              onChange={(v) => onUpdateField?.("address", "postalCode", v)}
              onAcceptSuggestion={() => onAcceptSuggestion?.("address", "postalCode")}
            />
            <EditablePreviewField
              label="City"
              field={report.address?.city}
              onChange={(v) => onUpdateField?.("address", "city", v)}
              onAcceptSuggestion={() => onAcceptSuggestion?.("address", "city")}
            />
            <EditablePreviewField
              label="Country"
              field={report.address?.country}
              onChange={(v) => onUpdateField?.("address", "country", v)}
              onAcceptSuggestion={() => onAcceptSuggestion?.("address", "country")}
            />
            <EditablePreviewField
              label="Phone"
              field={report.contact?.phone}
              onChange={(v) => onUpdateField?.("contact", "phone", v)}
              onAcceptSuggestion={() => onAcceptSuggestion?.("contact", "phone")}
            />
            <EditablePreviewField
              label="Email"
              field={report.contact?.email}
              onChange={(v) => onUpdateField?.("contact", "email", v)}
              onAcceptSuggestion={() => onAcceptSuggestion?.("contact", "email")}
            />
            <EditablePreviewField
              label="Website"
              field={report.contact?.website}
              onChange={(v) => onUpdateField?.("contact", "website", v)}
              onAcceptSuggestion={() => onAcceptSuggestion?.("contact", "website")}
            />
            <EditablePreviewField
              label="Employees"
              type="number"
              field={report.employees?.employeeCount}
              onChange={(v) => onUpdateField?.("employees", "employeeCount", v)}
              onAcceptSuggestion={() => onAcceptSuggestion?.("employees", "employeeCount")}
            />
            <EditablePreviewField
              label="Year Established"
              type="number"
              field={report.companyAge?.yearEstablished}
              onChange={(v) => onUpdateField?.("companyAge", "yearEstablished", v)}
              onAcceptSuggestion={() => onAcceptSuggestion?.("companyAge", "yearEstablished")}
            />
            <EditablePreviewField
              label="Financial Date"
              field={report.financial?.latestFinancialDate}
              onChange={(v) => onUpdateField?.("financial", "latestFinancialDate", v)}
              onAcceptSuggestion={() => onAcceptSuggestion?.("financial", "latestFinancialDate")}
            />
            <EditablePreviewField
              label="D&B Rating"
              field={report.risk?.dnbRating}
              onChange={(v) => onUpdateField?.("risk", "dnbRating", v)}
              onAcceptSuggestion={() => onAcceptSuggestion?.("risk", "dnbRating")}
            />
            <EditablePreviewField
              label="Credit Limit (INR)"
              field={report.risk?.creditLimitInr?.value !== null ? report.risk?.creditLimitInr : report.risk?.creditLimitOriginal}
              displayOverride={
                report.risk?.creditLimitInr?.value !== null
                  ? formatInrPreview(report.risk.creditLimitInr.value)
                  : report.risk?.creditLimitOriginal?.value !== null
                    ? `${report.risk.creditLimitOriginal.value} ${report.risk.creditLimitCurrency?.value || ""}`
                    : null
              }
              onAcceptSuggestion={() => onAcceptSuggestion?.("risk", report.risk?.creditLimitInr?.value !== null ? "creditLimitInr" : "creditLimitOriginal")}
              readOnly
            />
            <EditablePreviewField
              label="PAYDEX Score"
              type="number"
              field={report.risk?.paydex}
              onChange={(v) => onUpdateField?.("risk", "paydex", v)}
              onAcceptSuggestion={() => onAcceptSuggestion?.("risk", "paydex")}
            />
            <EditablePreviewField
              label="Failure Score"
              type="number"
              field={report.risk?.failureScore}
              onChange={(v) => onUpdateField?.("risk", "failureScore", v)}
              onAcceptSuggestion={() => onAcceptSuggestion?.("risk", "failureScore")}
            />
            <EditablePreviewField
              label="Risk Class"
              field={report.risk?.riskClass}
              onChange={(v) => onUpdateField?.("risk", "riskClass", v)}
              onAcceptSuggestion={() => onAcceptSuggestion?.("risk", "riskClass")}
            />
            <EditablePreviewField
              label="Industry"
              field={report.business?.industry}
              onChange={(v) => onUpdateField?.("business", "industry", v)}
              onAcceptSuggestion={() => onAcceptSuggestion?.("business", "industry")}
              className="col-span-2 sm:col-span-2"
            />
            <EditablePreviewField
              label="VAT / Reg No"
              field={report.companyInfo?.vatNumber?.value ? report.companyInfo?.vatNumber : report.companyInfo?.registrationNumber}
              onChange={(v) =>
                onUpdateField?.(
                  "companyInfo",
                  report.companyInfo?.vatNumber?.value ? "vatNumber" : "registrationNumber",
                  v
                )
              }
              onAcceptSuggestion={() =>
                onAcceptSuggestion?.(
                  "companyInfo",
                  report.companyInfo?.vatNumber?.value ? "vatNumber" : "registrationNumber"
                )
              }
            />
          </div>

          {/* Expandable Full Details Section */}
          <div>
            <button
              type="button"
              onClick={() => setShowAllDetails((s) => !s)}
              className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
            >
              {showAllDetails ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" /> Hide Extended D&amp;B Fields (Parent, Directors, Business &amp; Additional Info)
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" /> Show Extended D&amp;B Fields (Parent, Directors, Business &amp; Additional Info)
                </>
              )}
            </button>

            {showAllDetails && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                <EditablePreviewField label="Trade Name" field={report.companyInfo?.tradeName} onChange={(v) => onUpdateField?.("companyInfo", "tradeName", v)} />
                <EditablePreviewField label="Legal Form" field={report.companyInfo?.legalForm} onChange={(v) => onUpdateField?.("companyInfo", "legalForm", v)} />
                <EditablePreviewField label="Ownership" field={report.companyInfo?.ownership} onChange={(v) => onUpdateField?.("companyInfo", "ownership", v)} />
                <EditablePreviewField label="Company Status" field={report.companyInfo?.companyStatus} onChange={(v) => onUpdateField?.("companyInfo", "companyStatus", v)} />
                <EditablePreviewField label="Headquarters" field={report.companyInfo?.headquarters} onChange={(v) => onUpdateField?.("companyInfo", "headquarters", v)} />
                <EditablePreviewField label="Branch Indicator" field={report.companyInfo?.branchIndicator} onChange={(v) => onUpdateField?.("companyInfo", "branchIndicator", v)} />
                <EditablePreviewField label="Street" field={report.address?.street} onChange={(v) => onUpdateField?.("address", "street", v)} />
                <EditablePreviewField label="State / Province" field={report.address?.stateProvince} onChange={(v) => onUpdateField?.("address", "stateProvince", v)} />
                <EditablePreviewField label="Postal Code" field={report.address?.postalCode} onChange={(v) => onUpdateField?.("address", "postalCode", v)} />
                <EditablePreviewField label="Mobile" field={report.contact?.mobile} onChange={(v) => onUpdateField?.("contact", "mobile", v)} />
                <EditablePreviewField label="Fax" field={report.contact?.fax} onChange={(v) => onUpdateField?.("contact", "fax", v)} />
                <EditablePreviewField label="Line of Business" field={report.business?.lineOfBusiness} onChange={(v) => onUpdateField?.("business", "lineOfBusiness", v)} />
                <EditablePreviewField label="SIC Code" field={report.business?.sicCode} onChange={(v) => onUpdateField?.("business", "sicCode", v)} />
                <EditablePreviewField label="NAICS Code" field={report.business?.naicsCode} onChange={(v) => onUpdateField?.("business", "naicsCode", v)} />
                <EditablePreviewField label="Business Description" field={report.business?.businessDescription} onChange={(v) => onUpdateField?.("business", "businessDescription", v)} />
                <EditablePreviewField label="Delinquency Score" type="number" field={report.risk?.delinquencyScore} onChange={(v) => onUpdateField?.("risk", "delinquencyScore", v)} />
                <EditablePreviewField label="Stress Score" type="number" field={report.risk?.financialStressScore} onChange={(v) => onUpdateField?.("risk", "financialStressScore", v)} />
                <EditablePreviewField label="Risk Recommendation" field={report.risk?.riskRecommendation} onChange={(v) => onUpdateField?.("risk", "riskRecommendation", v)} />
                <EditablePreviewField label="Parent Company" field={report.parent?.parentCompany} onChange={(v) => onUpdateField?.("parent", "parentCompany", v)} />
                <EditablePreviewField label="Global Parent" field={report.parent?.globalParent} onChange={(v) => onUpdateField?.("parent", "globalParent", v)} />
                <EditablePreviewField label="Ultimate Parent" field={report.parent?.ultimateParent} onChange={(v) => onUpdateField?.("parent", "ultimateParent", v)} />
                <EditablePreviewField label="Import / Export" field={report.additional?.importExportStatus} onChange={(v) => onUpdateField?.("additional", "importExportStatus", v)} />
                <EditablePreviewField label="Public / Private" field={report.additional?.publicPrivate} onChange={(v) => onUpdateField?.("additional", "publicPrivate", v)} />
                <EditablePreviewField label="Branches" type="number" field={report.additional?.numberOfBranches} onChange={(v) => onUpdateField?.("additional", "numberOfBranches", v)} />
                <EditablePreviewField label="Legal Events" field={report.additional?.legalEvents} onChange={(v) => onUpdateField?.("additional", "legalEvents", v)} />
                <EditablePreviewField label="Bankruptcy Status" field={report.additional?.bankruptcyStatus} onChange={(v) => onUpdateField?.("additional", "bankruptcyStatus", v)} />
                <EditablePreviewField label="Business Activity" field={report.additional?.businessActivity} onChange={(v) => onUpdateField?.("additional", "businessActivity", v)} />

                {Array.isArray(report.directors) && report.directors.length > 0 && (
                  <div className="col-span-2 sm:col-span-3 rounded-lg p-2.5 bg-white border border-emerald-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Directors / Key Principals
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {report.directors.map((d, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-gray-800 text-[11px] font-semibold"
                        >
                          {d.name}
                          {d.role ? ` (${d.role})` : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Warnings & Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
            <div className="space-y-0.5">
              {importState.warnings?.map((w, idx) => (
                <p key={idx} className="text-amber-700 font-semibold">
                  {w}
                </p>
              ))}
              {(!importState.warnings || importState.warnings.length === 0) && (
                <span className="text-emerald-700 font-medium">
                  All detected CRM &amp; D&amp;B fields were auto-mapped. Review or edit any field before saving.
                </span>
              )}
            </div>

            {canAttachAsReportFile && typeof onAttachAsReportFile === "function" && (
              <button
                type="button"
                onClick={() => onAttachAsReportFile(importState.rawFile)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-100/60 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Paperclip className="h-3 w-3" /> Also attach to Report Upload (#7)
              </button>
            )}
          </div>
        </div>
      )}

      {/* OCR Preview Panel — Warning / Extraction Failure */}
      {(importState.status === "warning" || importState.status === "error") && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 space-y-1.5 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <p className="font-bold text-amber-900">
                {importState.message || "Unable to detect D&B fields."}
              </p>
              <p className="text-[11px] font-medium text-amber-800">
                {importState.errorMessage ||
                  importState.warnings?.[0] ||
                  "Please enter the values manually."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
