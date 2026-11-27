"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  extractDnbFullReport,
  mapReportToCrmFields,
  validateDnbImportFile,
} from "./dnbImportApi";

const INITIAL_STATE = {
  status: "idle", // 'idle' | 'processing' | 'success' | 'warning' | 'error'
  fileName: "",
  fileSize: 0,
  fileType: "",
  previewUrl: null,
  rawFile: null,
  ocrEngine: null,
  pageCount: 1,
  extractedCount: 0,
  report: null,
  suggestedFields: [],
  duplicateMatch: null,
  duplicateDismissed: false,
  warnings: [],
  message: "",
  errorMessage: "",
  manuallyOverridden: false,
};

export function useDnbAnnualSalesAutoFill({
  partnerId = null,
  onAutoFillDnbFields,
  onAutoFillPartnerFields,
}) {
  const [state, setState] = useState(INITIAL_STATE);
  const isProcessingRef = useRef(false);
  const previewUrlRef = useRef(null);
  const lastAutoFilledTurnoverRef = useRef(null);

  const revokeCurrentPreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      revokeCurrentPreview();
    };
  }, [revokeCurrentPreview]);

  const applyMappedReport = useCallback(
    (report, includePartnerFields = true) => {
      if (!report) return { suggestedFields: [] };
      const { dnbFields, partnerFields, suggestedFields } = mapReportToCrmFields(report);
      if (dnbFields.annualTurnover !== null) {
        lastAutoFilledTurnoverRef.current = String(dnbFields.annualTurnover);
      }
      if (typeof onAutoFillDnbFields === "function") {
        onAutoFillDnbFields(dnbFields, report);
      }
      if (includePartnerFields && typeof onAutoFillPartnerFields === "function") {
        onAutoFillPartnerFields(partnerFields, report);
      }
      return { suggestedFields: suggestedFields || [] };
    },
    [onAutoFillDnbFields, onAutoFillPartnerFields]
  );

  const resetImport = useCallback(() => {
    isProcessingRef.current = false;
    lastAutoFilledTurnoverRef.current = null;
    revokeCurrentPreview();
    setState(INITIAL_STATE);
  }, [revokeCurrentPreview]);

  const syncManualEditCheck = useCallback((currentFieldValue) => {
    if (lastAutoFilledTurnoverRef.current === null) return;
    const isDifferent =
      String(currentFieldValue ?? "").trim() !==
      String(lastAutoFilledTurnoverRef.current).trim();
    setState((prev) => {
      if (prev.status !== "success" || prev.manuallyOverridden === isDifferent) {
        return prev;
      }
      return { ...prev, manuallyOverridden: isDifferent };
    });
  }, []);

  const updateExtractedField = useCallback(
    (section, key, nextValue) => {
      setState((prev) => {
        if (!prev.report || !prev.report[section]) return prev;
        const currentField = prev.report[section][key];
        if (!currentField || typeof currentField !== "object") return prev;

        const parsedVal =
          typeof currentField.value === "number" && nextValue !== "" && nextValue !== null
            ? Number(nextValue)
            : nextValue === ""
              ? null
              : nextValue;

        const finalVal =
          typeof currentField.value === "number" && Number.isNaN(parsedVal)
            ? null
            : parsedVal;

        const updatedReport = {
          ...prev.report,
          [section]: {
            ...prev.report[section],
            [key]: {
              ...currentField,
              value: finalVal,
              confidence: finalVal !== null && finalVal !== "" ? 100 : 0,
              needsReview: false,
            },
          },
        };

        const { dnbFields, partnerFields, suggestedFields } =
          mapReportToCrmFields(updatedReport);
        if (typeof onAutoFillDnbFields === "function") {
          onAutoFillDnbFields(dnbFields, updatedReport);
        }
        if (typeof onAutoFillPartnerFields === "function") {
          onAutoFillPartnerFields(partnerFields, updatedReport);
        }

        return {
          ...prev,
          report: updatedReport,
          suggestedFields: suggestedFields || [],
        };
      });
    },
    [onAutoFillDnbFields, onAutoFillPartnerFields]
  );

  const acceptSuggestedField = useCallback(
    (section, key) => {
      setState((prev) => {
        if (!prev.report || !prev.report[section]) return prev;
        const currentField = prev.report[section][key];
        if (!currentField || typeof currentField !== "object") return prev;

        const updatedReport = {
          ...prev.report,
          [section]: {
            ...prev.report[section],
            [key]: {
              ...currentField,
              confidence: Math.max(85, Number(currentField.confidence || 0)),
              needsReview: false,
            },
          },
        };

        const { dnbFields, partnerFields, suggestedFields } =
          mapReportToCrmFields(updatedReport);
        if (typeof onAutoFillDnbFields === "function") {
          onAutoFillDnbFields(dnbFields, updatedReport);
        }
        if (typeof onAutoFillPartnerFields === "function") {
          onAutoFillPartnerFields(partnerFields, updatedReport);
        }

        return {
          ...prev,
          report: updatedReport,
          suggestedFields: suggestedFields || [],
        };
      });
    },
    [onAutoFillDnbFields, onAutoFillPartnerFields]
  );

  const acceptAllSuggestions = useCallback(() => {
    setState((prev) => {
      if (!prev.report || !prev.suggestedFields?.length) return prev;
      const updatedReport = { ...prev.report };
      for (const item of prev.suggestedFields) {
        if (!updatedReport[item.section]?.[item.key]) continue;
        updatedReport[item.section] = {
          ...updatedReport[item.section],
          [item.key]: {
            ...updatedReport[item.section][item.key],
            confidence: Math.max(85, Number(updatedReport[item.section][item.key].confidence || 0)),
            needsReview: false,
          },
        };
      }
      if (
        updatedReport.financial?.annualSalesOriginal?.value !== null &&
        updatedReport.financial?.originalCurrency?.value &&
        updatedReport.financial?.annualSalesInr?.value !== null
      ) {
        updatedReport.financial = {
          ...updatedReport.financial,
          annualSalesInr: {
            ...updatedReport.financial.annualSalesInr,
            confidence: Math.max(85, Number(updatedReport.financial.annualSalesInr.confidence || 0)),
            needsReview: false,
          },
        };
      }

      const { dnbFields, partnerFields, suggestedFields } =
        mapReportToCrmFields(updatedReport);
      if (typeof onAutoFillDnbFields === "function") {
        onAutoFillDnbFields(dnbFields, updatedReport);
      }
      if (typeof onAutoFillPartnerFields === "function") {
        onAutoFillPartnerFields(partnerFields, updatedReport);
      }

      return {
        ...prev,
        report: updatedReport,
        suggestedFields: suggestedFields || [],
      };
    });
  }, [onAutoFillDnbFields, onAutoFillPartnerFields]);

  const dismissDuplicateAsCreateNew = useCallback(() => {
    setState((prev) => {
      if (prev.report) {
        applyMappedReport(prev.report, true);
      }
      return {
        ...prev,
        duplicateDismissed: true,
      };
    });
  }, [applyMappedReport]);

  const processFile = useCallback(
    async (file) => {
      if (isProcessingRef.current) return;

      const validationError = validateDnbImportFile(file);
      if (validationError) {
        setState({
          ...INITIAL_STATE,
          fileName: file?.name || "",
          fileSize: file?.size || 0,
          status: "error",
          message: "Invalid D&B Report File",
          errorMessage: validationError,
          warnings: [validationError],
        });
        return;
      }

      isProcessingRef.current = true;
      revokeCurrentPreview();

      const nextPreviewUrl = file.type?.startsWith("image/")
        ? URL.createObjectURL(file)
        : null;
      previewUrlRef.current = nextPreviewUrl;

      setState({
        ...INITIAL_STATE,
        status: "processing",
        fileName: file.name || "dnb-report",
        fileSize: file.size || 0,
        fileType: file.type || "",
        previewUrl: nextPreviewUrl,
        rawFile: file,
        message: "Scanning D&B report & extracting fields...",
      });

      try {
        const result = await extractDnbFullReport(file, partnerId);

        if (result?.success && result?.report) {
          const hasDuplicate = Boolean(result.duplicateMatch?.found);
          const { suggestedFields } = applyMappedReport(result.report, !hasDuplicate);

          setState((prev) => ({
            ...prev,
            status: "success",
            ocrEngine: result.ocrEngine,
            pageCount: result.pageCount || 1,
            extractedCount: result.extractedCount || 0,
            report: result.report,
            suggestedFields,
            duplicateMatch: result.duplicateMatch || null,
            duplicateDismissed: false,
            warnings: result.warnings || [],
            message: result.message || "OCR Completed Successfully",
            errorMessage: "",
            manuallyOverridden: false,
          }));
          return;
        }

        lastAutoFilledTurnoverRef.current = null;
        setState((prev) => ({
          ...prev,
          status: "warning",
          ocrEngine: result?.ocrEngine || null,
          pageCount: result?.pageCount || 1,
          extractedCount: 0,
          report: result?.report || null,
          suggestedFields: [],
          warnings: result?.warnings || ["Please enter the values manually."],
          message: result?.message || "Unable to detect Annual Sales.",
          errorMessage: "",
        }));
      } catch (err) {
        lastAutoFilledTurnoverRef.current = null;
        const backendMessage =
          err?.response?.data?.message ||
          err?.message ||
          "OCR processing failed. Please enter the values manually.";

        setState((prev) => ({
          ...prev,
          status: "error",
          message: "Unable to process D&B report.",
          errorMessage:
            typeof backendMessage === "string"
              ? backendMessage
              : "Please enter the values manually.",
          warnings: [
            typeof backendMessage === "string"
              ? backendMessage
              : "Please enter the values manually.",
          ],
        }));
      } finally {
        isProcessingRef.current = false;
      }
    },
    [partnerId, applyMappedReport, revokeCurrentPreview]
  );

  return {
    importState: state,
    isProcessing: state.status === "processing",
    processFile,
    resetImport,
    syncManualEditCheck,
    updateExtractedField,
    acceptSuggestedField,
    acceptAllSuggestions,
    dismissDuplicateAsCreateNew,
    getMappedFieldsForReport: mapReportToCrmFields,
  };
}
