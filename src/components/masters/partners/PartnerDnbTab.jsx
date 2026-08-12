"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  Lock,
  Plus,
  Upload,
  FileText,
  ExternalLink,
  Download,
  ShieldCheck,
  AlertTriangle,
  Award,
  CheckCircle2,
  Calendar,
  CreditCard,
  Building2,
  Layers,
  Eye,
} from "lucide-react";
import axiosClient from "@/lib/axios";
import { toast } from "@/lib/toast";

const RISK_FACTOR_STYLES = {
  LOW: {
    label: "🟢 Low Risk",
    bg: "bg-[#DCFCE7]",
    text: "text-[#15803D]",
    border: "border-[#86EFAC]",
    activeRing: "ring-2 ring-emerald-500",
  },
  MODERATE: {
    label: "🟡 Moderate Risk",
    bg: "bg-[#FEF3C7]",
    text: "text-[#B45309]",
    border: "border-[#FDE68A]",
    activeRing: "ring-2 ring-amber-500",
  },
  HIGH: {
    label: "🔴 High Risk",
    bg: "bg-[#FEE2E2]",
    text: "text-[#B91C1C]",
    border: "border-[#FCA5A5]",
    activeRing: "ring-2 ring-red-500",
  },
};

export const FAILURE_SCORE_MAPPINGS = [
  {
    rangeStr: "90 – 100",
    min: 90,
    max: 100,
    key: "VERY_LOW",
    label: "🟢 Very Low",
    riskLevel: "Very Low Risk",
    riskFactor: "LOW",
    meaning: "Strong buyer",
    action: "Credit can be considered",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
    cardClass: "bg-emerald-50/90 border-emerald-300 text-emerald-950",
  },
  {
    rangeStr: "75 – 89",
    min: 75,
    max: 89,
    key: "LOW",
    label: "🟢 Low",
    riskLevel: "Low Risk",
    riskFactor: "LOW",
    meaning: "Good buyer",
    action: "Normal due diligence",
    badgeClass: "bg-green-100 text-green-800 border-green-300",
    cardClass: "bg-green-50/90 border-green-300 text-green-950",
  },
  {
    rangeStr: "60 – 74",
    min: 60,
    max: 74,
    key: "MODERATE_LOW",
    label: "🟡 Moderate-Low",
    riskLevel: "Moderate-Low Risk",
    riskFactor: "MODERATE",
    meaning: "Acceptable buyer",
    action: "Control credit exposure",
    badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-300",
    cardClass: "bg-yellow-50/90 border-yellow-300 text-yellow-950",
  },
  {
    rangeStr: "40 – 59",
    min: 40,
    max: 59,
    key: "MODERATE",
    label: "🟠 Moderate",
    riskLevel: "Moderate Risk",
    riskFactor: "MODERATE",
    meaning: "Average risk",
    action: "Prefer Advance / CAD or limited credit",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
    cardClass: "bg-amber-50/90 border-amber-300 text-amber-950",
  },
  {
    rangeStr: "20 – 39",
    min: 20,
    max: 39,
    key: "HIGH",
    label: "🔴 High",
    riskLevel: "High Risk",
    riskFactor: "HIGH",
    meaning: "High default risk",
    action: "Avoid significant unsecured credit",
    badgeClass: "bg-red-100 text-red-800 border-red-300",
    cardClass: "bg-red-50/90 border-red-300 text-red-950",
  },
  {
    rangeStr: "1 – 19",
    min: 1,
    max: 19,
    key: "VERY_HIGH",
    label: "🔴 Very High",
    riskLevel: "Very High Risk",
    riskFactor: "HIGH",
    meaning: "Extremely high default risk",
    action: "Do not give open credit",
    badgeClass: "bg-rose-900 text-white border-rose-950",
    cardClass: "bg-rose-100/90 border-rose-300 text-rose-950",
  },
  {
    rangeStr: "0 / No Score",
    min: 0,
    max: 0,
    key: "UNKNOWN",
    label: "⚪ Unknown",
    riskLevel: "Unknown Risk",
    riskFactor: "MODERATE",
    meaning: "Insufficient data",
    action: "Manual assessment required",
    badgeClass: "bg-gray-100 text-gray-700 border-gray-300",
    cardClass: "bg-gray-50 border-gray-200 text-gray-800",
  },
];

export const getFailureScoreMapping = (scoreVal) => {
  if (scoreVal === null || scoreVal === undefined || scoreVal === "") return FAILURE_SCORE_MAPPINGS[6];
  const num = parseInt(scoreVal, 10);
  if (isNaN(num)) {
    const found = FAILURE_SCORE_MAPPINGS.find((m) => m.key === String(scoreVal).toUpperCase());
    if (found) return found;
    return FAILURE_SCORE_MAPPINGS[6];
  }
  if (num >= 90) return FAILURE_SCORE_MAPPINGS[0];
  if (num >= 75) return FAILURE_SCORE_MAPPINGS[1];
  if (num >= 60) return FAILURE_SCORE_MAPPINGS[2];
  if (num >= 40) return FAILURE_SCORE_MAPPINGS[3];
  if (num >= 20) return FAILURE_SCORE_MAPPINGS[4];
  if (num >= 1) return FAILURE_SCORE_MAPPINGS[5];
  return FAILURE_SCORE_MAPPINGS[6];
};

export default function PartnerDnbTab({
  partnerId,
  isEditMode,
  dnbDraft,
  onDnbDraftChange,
}) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(dnbDraft?.selectedFile || null);
  const [fileError, setFileError] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      yearOfEstablishment: dnbDraft?.yearOfEstablishment || "",
      reportDate: dnbDraft?.reportDate || new Date().toISOString().split("T")[0],
      riskFactor: dnbDraft?.riskFactor || "LOW",
      creditLimit: dnbDraft?.creditLimit || "",
      failureScore: dnbDraft?.failureScore || "MODERATE",
      paydex: dnbDraft?.paydex || "",
      dnbRating: dnbDraft?.dnbRating || "",
    },
  });

  const watchAllFields = watch();
  const watchFailureScore = watch("failureScore");
  const mappedScore = getFailureScoreMapping(watchFailureScore);

  // Auto-sync derived overall riskFactor (LOW / MODERATE / HIGH) from Failure Score mapping
  useEffect(() => {
    if (mappedScore?.riskFactor) {
      setValue("riskFactor", mappedScore.riskFactor, { shouldValidate: true });
    }
  }, [watchFailureScore, mappedScore?.riskFactor, setValue]);

  // Sync draft up to parent whenever fields change in Create Mode (!partnerId)
  useEffect(() => {
    if (!partnerId && onDnbDraftChange) {
      onDnbDraftChange({
        ...watchAllFields,
        selectedFile,
      });
    }
  }, [
    partnerId,
    watchAllFields.yearOfEstablishment,
    watchAllFields.reportDate,
    watchAllFields.riskFactor,
    watchAllFields.creditLimit,
    watchAllFields.failureScore,
    watchAllFields.paydex,
    watchAllFields.dnbRating,
    selectedFile,
  ]);

  const [partnerYearOfEst, setPartnerYearOfEst] = useState("");

  const loadReports = useCallback(async () => {
    if (!partnerId) return;
    setLoading(true);
    try {
      const [res, partnerRes] = await Promise.all([
        axiosClient.get(`/masters/partners/${partnerId}/dnb-reports`),
        axiosClient.get(`/masters/partners/${partnerId}`).catch(() => null),
      ]);
      const fetchedReports = res.data || [];
      setReports(fetchedReports);

      const estYear =
        partnerRes?.data?.yearOfEstablishment ||
        fetchedReports[0]?.partner?.yearOfEstablishment ||
        "";
      if (estYear) {
        setPartnerYearOfEst(String(estYear));
        setValue("yearOfEstablishment", String(estYear));
      }

      if (fetchedReports.length === 0) {
        setIsCreatingNew(true);
      } else {
        setIsCreatingNew(false);
      }
    } catch (err) {
      console.error("Failed to fetch D&B reports", err);
      toast.error("Failed to load D&B assessment history.");
    } finally {
      setLoading(false);
    }
  }, [partnerId, setValue]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileError("");
    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    const ext = file.name.split(".").pop().toLowerCase();
    const allowedExts = ["pdf", "jpg", "jpeg", "png"];

    if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
      setFileError("Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed.");
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError("File size exceeds maximum allowed limit of 10MB.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleCreateNewClick = () => {
    reset({
      reportDate: new Date().toISOString().split("T")[0],
      riskFactor: "LOW",
      creditLimit: "",
      failureScore: "MODERATE",
      paydex: "",
      dnbRating: "",
    });
    setSelectedFile(null);
    setFileError("");
    setIsCreatingNew(true);
  };

  const handleDownloadReport = async (report) => {
    try {
      const response = await axiosClient.get(
        `/masters/partners/dnb-reports/${report.id}/download`,
        { responseType: "blob" }
      );
      const blobUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: response.headers["content-type"] })
      );
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute(
        "download",
        report.originalFileName || `dnb_report_${report.id}`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error(err);
      toast.error("Failed to download report file.");
    }
  };

  const handleViewReport = async (report) => {
    try {
      const response = await axiosClient.get(
        `/masters/partners/dnb-reports/${report.id}/download`,
        { responseType: "blob" }
      );
      const mimeType = response.headers["content-type"] || report.mimeType || "application/pdf";
      const blobUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: mimeType })
      );
      window.open(blobUrl, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 30000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to view report document.");
    }
  };

  const compressImageFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return file;
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 1920;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.82
        );
      };
      img.onerror = () => resolve(file);
      img.src = URL.createObjectURL(file);
    });
  };

  const onFormSubmit = async (data) => {
    if (!selectedFile) {
      setFileError("Please upload a D&B Report file.");
      return;
    }

    // Validate Report Date <= Today
    const selectedDate = new Date(data.reportDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (selectedDate > today) {
      toast.error("Report Date cannot be a future date.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fileToUpload = await compressImageFile(selectedFile);
      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("reportDate", data.reportDate);
      formData.append("riskFactor", data.riskFactor);
      formData.append("creditLimit", data.creditLimit);
      formData.append("failureScore", data.failureScore);
      formData.append("paydex", data.paydex);
      formData.append("dnbRating", data.dnbRating.toUpperCase().trim());

      await axiosClient.post(`/masters/partners/${partnerId}/dnb-reports`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.yearOfEstablishment) {
        try {
          await axiosClient.patch(`/masters/partners/${partnerId}`, {
            yearOfEstablishment: parseInt(data.yearOfEstablishment, 10),
          });
        } catch (e) {
          // ignore minor sync error
        }
      }

      toast.success("✔ D&B Report Saved Successfully");
      setIsCreatingNew(false);
      setSelectedFile(null);
      await loadReports();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save D&B report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format INR Currency
  const formatCurrency = (val) => {
    if (val === null || val === undefined || isNaN(val)) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header bar when reports exist */}
      {reports.length > 0 && !isCreatingNew && (
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Recorded Assessments ({reports.length})
            </span>
          </div>
          <button
            type="button"
            onClick={handleCreateNewClick}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
          >
            <Plus className="h-4 w-4" /> Add New D&B Report
          </button>
        </div>
      )}

      {/* D&B Assessment Form (Active when creating new report) */}
      {isCreatingNew && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-xs relative">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <Award className="h-4 w-4 text-[#007aff]" /> Section: D&B Information
            </h3>
            {reports.length > 0 && (
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="text-xs text-gray-400 hover:text-gray-600 font-semibold"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 1. Year of Establishment */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  1. Year of Establishment <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={
                    watchAllFields.establishmentDate ||
                    (watchAllFields.yearOfEstablishment ? `${watchAllFields.yearOfEstablishment}-01-01` : "")
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setValue("establishmentDate", val);
                    if (val) {
                      const year = new Date(val).getFullYear();
                      if (!isNaN(year)) setValue("yearOfEstablishment", year);
                    }
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-gray-50/30 font-semibold"
                />
                {watchAllFields.yearOfEstablishment ? (
                  <p className="text-[10px] text-gray-500 mt-1 font-semibold flex items-center gap-1">
                    Selected Year: <span className="text-[#007aff] font-extrabold">{watchAllFields.yearOfEstablishment}</span>
                  </p>
                ) : errors.yearOfEstablishment ? (
                  <p className="text-red-500 text-[10px] mt-1 font-semibold">
                    {errors.yearOfEstablishment.message}
                  </p>
                ) : null}
              </div>
              {/* 1. Report Date */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  2. Report Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  {...register("reportDate", { required: "Report Date is required" })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-0 text-gray-700 bg-gray-50/30"
                />
                {errors.reportDate && (
                  <p className="text-red-500 text-[10px] mt-1 font-semibold">
                    {errors.reportDate.message}
                  </p>
                )}
              </div>

              {/* 3. D&B Rating */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  3. D&B Rating <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("dnbRating", { required: "D&B Rating is required", maxLength: 50 })}
                  placeholder="e.g. EE1"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-0 text-gray-700 uppercase bg-gray-50/30 font-semibold"
                />
                {errors.dnbRating && (
                  <p className="text-red-500 text-[10px] mt-1 font-semibold">
                    {errors.dnbRating.message}
                  </p>
                )}
              </div>

              {/* 4. Credit Limit */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  4. Credit Limit <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("creditLimit", {
                      required: "Credit Limit is required",
                      min: { value: 0, message: "Credit limit must be positive" },
                    })}
                    placeholder="5303520"
                    className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-xs focus:outline-none focus:ring-0 text-gray-700 font-semibold bg-gray-50/30"
                  />
                </div>
                {errors.creditLimit && (
                  <p className="text-red-500 text-[10px] mt-1 font-semibold">
                    {errors.creditLimit.message}
                  </p>
                )}
              </div>

              {/* 5. PAYDEX Score */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  5. PAYDEX Score (0 - 100) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  {...register("paydex", {
                    required: "PAYDEX is required",
                    min: { value: 0, message: "PAYDEX must be >= 0" },
                    max: { value: 100, message: "PAYDEX must be <= 100" },
                  })}
                  placeholder="e.g. 80"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-0 text-gray-700 font-semibold bg-gray-50/30"
                />
                {errors.paydex && (
                  <p className="text-red-500 text-[10px] mt-1 font-semibold">
                    {errors.paydex.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  6. Failure Score & Risk Factor (0 - 100)
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  {...register("failureScore", {
                    required: "Failure Score is required",
                    min: { value: 0, message: "Score must be >= 0" },
                    max: { value: 100, message: "Score must be <= 100" },
                  })}
                  placeholder="e.g. 82"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-0 text-gray-800 font-extrabold bg-white"
                />
                {errors.failureScore && (
                  <p className="text-red-500 text-[10px] mt-1 font-semibold">
                    {errors.failureScore.message}
                  </p>
                )}
              </div>
            </div>
            {/* Quick Select Preset Buttons (Outside Card Box) */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Quick Select Risk Tier:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {FAILURE_SCORE_MAPPINGS.map((m) => {
                  const isSelected = mappedScore.key === m.key;
                  return (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setValue("failureScore", m.min > 0 ? Math.round((m.min + m.max) / 2) : 0)}
                      className={`px-2.5 py-2 gap-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${isSelected ? m.badgeClass + " ring-2 ring-blue-500 font-extrabold" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                    >
                      {m.label} ({m.rangeStr})
                    </button>
                  );
                })}
              </div>
            </div>
            {(() => {
              const riskStyle = RISK_FACTOR_STYLES[mappedScore.riskFactor] || RISK_FACTOR_STYLES.MODERATE;
              return (
                <div className="space-y-4">
                  {/* Real-Time Auto-Mapped Business Meaning Card */}
                  <div className={`p-4 rounded-2xl border text-xs shadow-xs transition-all ${mappedScore.cardClass}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2 font-bold border-b border-black/10 pb-2 mb-2">
                      <span className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold border ${mappedScore.badgeClass}`}>
                          {mappedScore.label} ({mappedScore.rangeStr})
                        </span>
                        <span className="font-extrabold">Risk Level: {mappedScore.riskLevel}</span>
                      </span>
                      <span className="font-bold uppercase tracking-wider">{mappedScore.meaning}</span>
                    </div>
                    <div className="text-xs font-medium">
                      💡 <span className="font-bold">Recommended Action:</span> {mappedScore.action}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 7. Upload D&B Report File */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                7. Upload D&B Report <span className="text-red-500">*</span> (PDF, JPG, JPEG, PNG - Max 10MB)
              </label>

              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 text-center bg-gray-50/50 hover:border-blue-400 transition-colors relative">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="h-10 w-10 rounded-full bg-blue-50 text-[#007aff] flex items-center justify-center">
                    <Upload className="h-5 w-5" />
                  </div>
                  {selectedFile ? (
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-gray-800">{selectedFile.name}</p>
                      <p className="text-[10px] text-gray-400">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold text-gray-700">
                        Click or drag report file to upload
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Single file only</p>
                    </div>
                  )}
                </div>
              </div>
              {fileError && <p className="text-red-500 text-[10px] font-semibold">{fileError}</p>}
            </div>

            {/* Submit Button / Create Mode Note */}
            <div className="flex justify-end pt-3 border-t border-gray-100">
              {!partnerId ? (
                <div className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-100 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#007aff]" />
                  This D&B report will be automatically saved when you click &quot;Create Partner&quot;.
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit(onFormSubmit)}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-blue-500/20"
                >
                  {isSubmitting && (
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  Save D&B Report
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* D&B Assessment History Section */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#007aff]" /> Assessment History
        </h4>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-xs font-semibold text-gray-400">
              No D&B report assessments created yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => {
              const riskStyle = RISK_FACTOR_STYLES[report.riskFactor] || RISK_FACTOR_STYLES.LOW;
              const formattedDate = new Date(report.reportDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={report.id}
                  className={`bg-white rounded-2xl p-5 border transition-all shadow-xs relative ${report.isLatest
                    ? "border-emerald-300 ring-2 ring-emerald-500/20 bg-emerald-50/10"
                    : "border-gray-200"
                    }`}
                >
                  {/* LATEST Badge */}
                  {report.isLatest && (
                    <div className="absolute -top-3 left-5 px-2.5 py-0.5 bg-emerald-600 text-white text-[9px] font-extrabold uppercase tracking-widest rounded-full shadow-xs flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> LATEST ASSESSMENT
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3 mb-4 mt-1">
                    <div className="flex items-center gap-3">
                      <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-gray-400" /> {formattedDate}
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${riskStyle.bg} ${riskStyle.text} ${riskStyle.border}`}
                      >
                        {riskStyle.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewReport(report)}
                        className="px-3 py-1.5 bg-[#007aff]/10 hover:bg-[#007aff]/20 text-[#007aff] rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" /> View Report
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadReport(report)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" /> Download Report
                      </button>
                    </div>
                  </div>

                  {/* Uploaded Report Document Banner */}
                  {report.originalFileName && (
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-4 bg-gray-50/80 p-2.5 rounded-xl border border-gray-150">
                      <FileText className="h-4 w-4 text-[#007aff] shrink-0" />
                      <span className="font-bold text-gray-800 truncate" title={report.originalFileName}>
                        {report.originalFileName}
                      </span>
                      {report.fileSize && (
                        <span className="text-[10px] text-gray-400 font-semibold ml-auto shrink-0">
                          ({(report.fileSize / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Grid details (5 Columns) */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Establishment Year
                      </span>
                      <span className="text-xs font-extrabold text-gray-900 mt-0.5 block">
                        {report.partner?.yearOfEstablishment || partnerYearOfEst || watchAllFields.yearOfEstablishment || "-"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Credit Limit
                      </span>
                      <span className="text-xs font-extrabold text-gray-900 mt-0.5 block">
                        {formatCurrency(report.creditLimit)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Failure Score
                      </span>
                      {(() => {
                        const fsMap = getFailureScoreMapping(report.failureScore);
                        return (
                          <div className="mt-0.5 space-y-0.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold border ${fsMap.badgeClass}`}>
                              {fsMap.label} ({report.failureScore})
                            </span>
                            <span className="text-[10px] text-gray-500 block truncate" title={`${fsMap.meaning} — Action: ${fsMap.action}`}>
                              {fsMap.meaning}
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        PAYDEX Score
                      </span>
                      <span className="text-xs font-extrabold text-gray-900 mt-0.5 block">
                        {report.paydex} / 100
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        D&B Rating
                      </span>
                      <span className="text-xs font-extrabold text-[#007aff] mt-0.5 block uppercase">
                        {report.dnbRating}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
