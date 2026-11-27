import axiosClient from "@/lib/axios";
import { normalizeCountryName } from "@/lib/countryUtils";

export const DNB_IMPORT_ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "pdf"];
export const DNB_IMPORT_ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "application/pdf",
];
export const DNB_IMPORT_MAX_BYTES = 10 * 1024 * 1024;

export function validateDnbImportFile(file) {
  if (!file) {
    return "No file selected. Please choose or paste a D&B report image or PDF.";
  }

  const fileName = String(file.name || "").toLowerCase();
  const ext = fileName.includes(".") ? fileName.split(".").pop() : "";
  const mime = String(file.type || "").toLowerCase();

  const validMime = DNB_IMPORT_ALLOWED_MIME_TYPES.includes(mime);
  const validExt = DNB_IMPORT_ALLOWED_EXTENSIONS.includes(ext);

  if (!validMime && !validExt) {
    return "Unsupported file format. Please use PNG, JPG, JPEG, WEBP, or PDF.";
  }

  if (file.size === 0) {
    return "The selected file is empty. Please choose a valid D&B report.";
  }

  if (file.size > DNB_IMPORT_MAX_BYTES) {
    return "File size exceeds maximum allowed limit of 10MB.";
  }

  return null;
}

export function extractClipboardImportFile(clipboardData) {
  if (!clipboardData) return null;

  const items = Array.from(clipboardData.items || []);
  for (const item of items) {
    if (item.kind === "file") {
      const blob = item.getAsFile();
      if (blob && (blob.type.startsWith("image/") || blob.type === "application/pdf")) {
        const ext = blob.type === "application/pdf"
          ? "pdf"
          : blob.type.split("/")[1]?.replace("jpeg", "jpg") || "png";
        const fileName = blob.name && blob.name !== "image.png"
          ? blob.name
          : `pasted-dnb-report-${Date.now()}.${ext}`;
        return new File([blob], fileName, {
          type: blob.type || "image/png",
          lastModified: Date.now(),
        });
      }
    }
  }

  const files = Array.from(clipboardData.files || []);
  if (files.length > 0) {
    return files[0];
  }

  return null;
}

export function formatInrPreview(amount) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) {
    return "₹0";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

export function formatExchangeRatePreview(rate, currency) {
  if (!rate || !currency) return null;
  const formattedRate = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(Number(rate));
  return `1 ${currency} = ₹${formattedRate}`;
}

export async function extractDnbAnnualSales(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosClient.post(
    "/masters/partners/dnb-import/extract-annual-sales",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      skipToast: true,
      timeout: 60000,
    }
  );

  return response.data;
}

export async function extractDnbFullReport(file, excludePartnerId = null) {
  const formData = new FormData();
  formData.append("file", file);

  const query = excludePartnerId
    ? `?excludePartnerId=${encodeURIComponent(excludePartnerId)}`
    : "";

  const response = await axiosClient.post(
    `/masters/partners/dnb-import/extract-report${query}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      skipToast: true,
      timeout: 90000,
    }
  );

  return response.data;
}

const RISK_CLASS_DEFAULT_SCORE = {
  LOW: 82,
  MODERATE: 50,
  HIGH: 30,
};

export const DNB_CONFIDENCE_REVIEW_THRESHOLD = 80;

export function isFieldAutoFillReady(field) {
  if (!field || typeof field !== "object") return false;
  const hasVal =
    field.value !== null &&
    field.value !== undefined &&
    String(field.value).trim() !== "";
  if (!hasVal) return false;
  return (
    Number(field.confidence ?? 0) >= DNB_CONFIDENCE_REVIEW_THRESHOLD &&
    !field.needsReview
  );
}

function verifiedVal(field) {
  return isFieldAutoFillReady(field) ? field.value : null;
}

export function collectSuggestedFields(report) {
  if (!report) return [];
  const specs = [
    { section: "companyInfo", key: "companyName", label: "Company Name" },
    { section: "companyInfo", key: "dunsNumber", label: "D-U-N-S" },
    { section: "companyInfo", key: "vatNumber", label: "VAT / Tax ID" },
    { section: "companyInfo", key: "registrationNumber", label: "Registration No" },
    { section: "address", key: "fullAddress", label: "Full Address" },
    { section: "address", key: "street", label: "Street" },
    { section: "address", key: "postalCode", label: "Postal Code" },
    { section: "address", key: "city", label: "City" },
    { section: "address", key: "stateProvince", label: "State / Province" },
    { section: "address", key: "country", label: "Country" },
    { section: "contact", key: "phone", label: "Phone" },
    { section: "contact", key: "email", label: "Email" },
    { section: "contact", key: "website", label: "Website" },
    { section: "business", key: "industry", label: "Industry" },
    { section: "business", key: "lineOfBusiness", label: "Line of Business" },
    { section: "financial", key: "annualSalesOriginal", label: "Annual Sales" },
    { section: "financial", key: "originalCurrency", label: "Original Currency" },
    { section: "financial", key: "latestFinancialDate", label: "Financial Date" },
    { section: "employees", key: "employeeCount", label: "Employees" },
    { section: "companyAge", key: "yearEstablished", label: "Year Established" },
    { section: "risk", key: "dnbRating", label: "D&B Rating" },
    { section: "risk", key: "creditLimitOriginal", label: "Credit Limit" },
    { section: "risk", key: "paydex", label: "PAYDEX Score" },
    { section: "risk", key: "failureScore", label: "Failure Score" },
    { section: "risk", key: "riskClass", label: "Risk Class" },
  ];

  return specs
    .map((spec) => {
      const f = report[spec.section]?.[spec.key];
      const hasVal =
        f &&
        f.value !== null &&
        f.value !== undefined &&
        String(f.value).trim() !== "";
      if (!hasVal || isFieldAutoFillReady(f)) return null;
      return {
        ...spec,
        value: f.value,
        confidence: Number(f.confidence ?? 0),
      };
    })
    .filter(Boolean);
}

export function buildDnbReferenceNotes(report, existingNotes = "") {
  if (!report) return existingNotes || "";

  const lines = [];
  const pushVal = (label, val) => {
    if (val !== null && val !== undefined && String(val).trim() !== "") {
      lines.push(`${label}: ${String(val).trim()}`);
    }
  };
  const pushField = (label, field) => {
    if (isFieldAutoFillReady(field)) {
      pushVal(label, field.value);
    }
  };

  pushField("D-U-N-S", report.companyInfo?.dunsNumber);
  pushField("Trade Name", report.companyInfo?.tradeName);
  pushField("Registration No", report.companyInfo?.registrationNumber);
  pushField("VAT / Tax ID", report.companyInfo?.vatNumber);
  pushField("Legal Form", report.companyInfo?.legalForm);
  pushField("Ownership", report.companyInfo?.ownership);
  pushField("Company Status", report.companyInfo?.companyStatus);
  pushField("Headquarters", report.companyInfo?.headquarters);
  pushField("Branch Indicator", report.companyInfo?.branchIndicator);
  pushField("Street", report.address?.street);
  pushField("Postal Code", report.address?.postalCode);

  if (
    isFieldAutoFillReady(report.financial?.annualSalesOriginal) &&
    isFieldAutoFillReady(report.financial?.originalCurrency)
  ) {
    const origCur = report.financial.originalCurrency.value;
    pushVal(
      "Original Annual Sales",
      `${report.financial.annualSalesOriginal.value} ${origCur}`
    );
    pushVal("Original Currency", origCur);
  }
  if (report.financial?.exchangeRate && isFieldAutoFillReady(report.financial?.annualSalesInr)) {
    pushVal(
      "FX Rate Used",
      `1 ${report.financial?.originalCurrency?.value || ""} = INR ${report.financial.exchangeRate} (${report.financial.exchangeRateDate || ""})`
    );
  }

  pushField("Employees", report.employees?.employeeCount);
  pushField("Industry", report.business?.industry);
  pushField("Line of Business", report.business?.lineOfBusiness);
  pushField("SIC Code", report.business?.sicCode);
  pushField("NAICS Code", report.business?.naicsCode);
  pushField("Business Description", report.business?.businessDescription);
  pushField("Parent Company", report.parent?.parentCompany);
  pushField("Global Parent", report.parent?.globalParent);
  pushField("Ultimate Parent", report.parent?.ultimateParent);

  if (Array.isArray(report.directors) && report.directors.length > 0) {
    const verifiedDirectors = report.directors.filter(
      (d) => Number(d.confidence ?? 0) >= DNB_CONFIDENCE_REVIEW_THRESHOLD
    );
    if (verifiedDirectors.length > 0) {
      pushVal(
        "Directors / Principals",
        verifiedDirectors.map((d) => (d.role ? `${d.name} (${d.role})` : d.name)).join("; ")
      );
    }
  }

  pushField("Delinquency Score", report.risk?.delinquencyScore);
  pushField("Financial Stress Score", report.risk?.financialStressScore);
  pushField("Risk Recommendation", report.risk?.riskRecommendation);
  pushField("Import / Export", report.additional?.importExportStatus);
  pushField("Public / Private", report.additional?.publicPrivate);
  pushField("Branches", report.additional?.numberOfBranches);
  pushField("Legal Events", report.additional?.legalEvents);
  pushField("Bankruptcy Status", report.additional?.bankruptcyStatus);
  pushField("Business Activity", report.additional?.businessActivity);

  if (lines.length === 0) return existingNotes || "";

  const refBlock = `[D&B Report Reference]\n${lines.join("\n")}\n[/D&B Report Reference]`;
  const cleanExisting = String(existingNotes || "")
    .replace(/\[D&B Report Reference\][\s\S]*?\[\/D&B Report Reference\]/g, "")
    .trim();

  return cleanExisting ? `${cleanExisting}\n\n${refBlock}` : refBlock;
}

export function mapReportToCrmFields(report) {
  if (!report) {
    return { dnbFields: {}, partnerFields: {}, suggestedFields: [] };
  }

  const todayIso = new Date().toISOString().split("T")[0];
  const rawReportDate = verifiedVal(report.financial?.latestFinancialDate);
  const safeReportDate =
    rawReportDate && /^\d{4}-\d{2}-\d{2}$/.test(rawReportDate) && rawReportDate <= todayIso
      ? rawReportDate
      : null;

  const yearEst = verifiedVal(report.companyAge?.yearEstablished);
  const incDate = verifiedVal(report.companyAge?.incorporationDate);

  const salesReady =
    isFieldAutoFillReady(report.financial?.annualSalesOriginal) &&
    isFieldAutoFillReady(report.financial?.originalCurrency) &&
    isFieldAutoFillReady(report.financial?.annualSalesInr);
  const salesInr = salesReady ? report.financial.annualSalesInr.value : null;

  const creditInrReady = isFieldAutoFillReady(report.risk?.creditLimitInr);
  const creditInrDirectReady =
    report.risk?.creditLimitCurrency?.value === "INR" &&
    isFieldAutoFillReady(report.risk?.creditLimitOriginal);
  const creditInr = creditInrReady
    ? report.risk.creditLimitInr.value
    : creditInrDirectReady
      ? report.risk.creditLimitOriginal.value
      : null;

  let failureScore = verifiedVal(report.risk?.failureScore);
  if (failureScore === null && isFieldAutoFillReady(report.risk?.riskClass)) {
    failureScore = RISK_CLASS_DEFAULT_SCORE[report.risk.riskClass.value] ?? null;
  }

  const dnbRatingVal = verifiedVal(report.risk?.dnbRating);
  const paydexVal = verifiedVal(report.risk?.paydex);

  const dnbFields = {
    yearOfEstablishment: yearEst !== null ? String(yearEst) : null,
    establishmentDate:
      incDate && /^\d{4}-\d{2}-\d{2}$/.test(incDate)
        ? incDate
        : yearEst
          ? `${yearEst}-01-01`
          : null,
    reportDate: safeReportDate,
    dnbRating: dnbRatingVal ? String(dnbRatingVal).toUpperCase().trim() : null,
    annualTurnover:
      salesInr !== null && Number.isFinite(Number(salesInr))
        ? String(Math.round(Number(salesInr) * 100) / 100)
        : null,
    creditLimit:
      creditInr !== null && Number.isFinite(Number(creditInr))
        ? String(Math.round(Number(creditInr) * 100) / 100)
        : null,
    paydex: paydexVal !== null ? String(paydexVal) : null,
    failureScore: failureScore !== null ? String(failureScore) : null,
  };

  const rawCountry = verifiedVal(report.address?.country);
  const normalizedCountry = rawCountry ? normalizeCountryName(rawCountry) : null;

  const fullAddr = verifiedVal(report.address?.fullAddress);
  const verifiedStreet = verifiedVal(report.address?.street);
  const verifiedPostal = verifiedVal(report.address?.postalCode);
  const verifiedCity = verifiedVal(report.address?.city);
  const composedAddr =
    fullAddr ||
    (verifiedStreet || verifiedPostal || verifiedCity
      ? [verifiedStreet, verifiedPostal, verifiedCity, normalizedCountry].filter(Boolean).join(", ")
      : null);

  const verifiedDirectors = Array.isArray(report.directors)
    ? report.directors.filter((d) => Number(d.confidence ?? 0) >= DNB_CONFIDENCE_REVIEW_THRESHOLD)
    : [];

  const partnerFields = {
    entityName: verifiedVal(report.companyInfo?.companyName),
    country: normalizedCountry,
    city: verifiedCity,
    address: composedAddr,
    street: verifiedStreet,
    postalCode: verifiedPostal,
    website: verifiedVal(report.contact?.website),
    contactEmail: verifiedVal(report.contact?.email),
    taxId:
      verifiedVal(report.companyInfo?.vatNumber) ||
      verifiedVal(report.companyInfo?.registrationNumber) ||
      null,
    yearOfEstablishment: yearEst !== null ? String(yearEst) : null,
    annualTurnover: dnbFields.annualTurnover,
    phone:
      verifiedVal(report.contact?.phone) ||
      verifiedVal(report.contact?.mobile) ||
      null,
    directors: verifiedDirectors,
    report,
  };

  return {
    dnbFields,
    partnerFields,
    suggestedFields: collectSuggestedFields(report),
  };
}
