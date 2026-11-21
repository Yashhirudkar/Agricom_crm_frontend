"use client";
/* eslint-disable @next/next/no-img-element */
import React from "react";

const COMPANY_CONFIG = {
  "AGRICOM IMPEX": {
    name: "AGRICOM IMPEX",
    logo: "/agricom impex.png",
    logoClass: "h-16 md:h-18 object-contain",
    address: "202, Amaltas Apartment, Rajnagar",
    city: "Nagpur (MH), India 440013",
    phone: "+91 712 2591130 / 34",
    email: "info@agricomimpex.com",
    website: "www.agricomimpex.com",
  },
  "AGRICOM IMPEX PRIVATE LIMITED": {
    name: "AGRICOM IMPEX PVT LTD",
    logo: "/agri_logo.png",
    logoClass: "h-16 md:h-18 object-contain scale-[1.5] origin-left",
    address: "202, Amaltas Apartment, Rajnagar",
    city: "Nagpur (MH), India 440013",
    phone: "+91 712 2591130 / 34",
    email: "info@agricomimpex.com",
    website: "www.agricomimpex.com",
  },
};

const resolveBackendUrl = (url) => {
  if (!url) return null;
  const str = String(url).trim();
  if (!str) return null;
  if (
    str.startsWith("http://") ||
    str.startsWith("https://") ||
    str.startsWith("data:") ||
    str.startsWith("blob:")
  ) {
    return str;
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const backendBase = apiUrl.replace(/\/api\/?$/, "");
  const cleanPath = str.startsWith("/") ? str : `/${str}`;
  return `${backendBase}${cleanPath}`;
};

export default function ExportInvoicePrintDocument({
  invoice,
  id = "export-invoice-print-area",
}) {
  const [stampFailed, setStampFailed] = React.useState(false);
  const [signatureFailed, setSignatureFailed] = React.useState(false);

  if (!invoice) return null;

  const seller = invoice.sellerDetails || {};
  const consignee = invoice.consigneeDetails || {};
  const notifyParty = invoice.notifyPartyDetails || consignee;
  const buyerOther = invoice.buyerOtherThanConsignee || {};
  const bank = invoice.bankDetails || {};
  const goods = Array.isArray(invoice.goodsItems) ? invoice.goodsItems : [];
  const trucks = Array.isArray(invoice.truckNumbers) ? invoice.truckNumbers : [];

  // Match company config from seller
  const sellerNameForHeader = (
    seller.name ||
    invoice.sellerName ||
    "AGRICOM IMPEX"
  ).toUpperCase();

  let selectedCompanyKey = "AGRICOM IMPEX";
  if (
    sellerNameForHeader.includes("PVT") ||
    sellerNameForHeader.includes("PRIVATE")
  ) {
    selectedCompanyKey = "AGRICOM IMPEX PRIVATE LIMITED";
  } else if (sellerNameForHeader.includes("AGRICOM IMPEX")) {
    selectedCompanyKey = "AGRICOM IMPEX";
  }

  const selectedCompany =
    COMPANY_CONFIG[selectedCompanyKey] ?? COMPANY_CONFIG["AGRICOM IMPEX"];

  const resolvedStampUrl = resolveBackendUrl(invoice.stampUrl);
  const resolvedSignatureUrl = resolveBackendUrl(invoice.signatureUrl);

  // Currency label matching physical paper ("EURO", "USD", "INR", etc.)
  const rawCurrency = (invoice.currency || "EURO").toUpperCase().trim();
  const currencyLabel =
    rawCurrency === "EUR" || rawCurrency === "EURO" ? "EURO" : rawCurrency;

  // Format date as DD.MM.YYYY matching the physical invoice
  const formatDateWithDots = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}.${month}.${year}`;
    } catch {
      return dateStr;
    }
  };

  // Physical sheet uses plain numbers with .00 (no commas in 14300.00)
  const formatNumber = (val, decimals = 2, useCommas = false) => {
    const num = Number(val || 0);
    if (!useCommas) {
      return num.toFixed(decimals);
    }
    return num.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const trucksStr =
    trucks.length > 0
      ? trucks.join(" / ")
      : invoice.truckNo || invoice.truckNumber || "";

  // Dynamic Bank Details generator strictly from Database & Snapshot
  const renderBankDetails = () => {
    // 1. Resolve structured bank details from snapshot or top-level bank object
    const domestic =
      bank.domesticBank ||
      (bank.domesticBankName || bank.bankName
        ? {
          bankName: bank.domesticBankName || bank.bankName,
          accountNumber: bank.domesticAccountNumber || bank.accountNumber,
          swiftCode: bank.domesticSwiftCode || bank.swiftCode,
          bankAddress:
            bank.domesticBankAddress ||
            bank.branchAddress ||
            bank.branch ||
            bank.address ||
            "",
          accountName:
            bank.accountName ||
            bank.beneficiaryName ||
            seller.legalName ||
            seller.name ||
            "AGRICOM IMPEX PVT LTD",
        }
        : null);

    const nostro =
      bank.nostroBank ||
      (bank.nostroBankName
        ? {
          bankName: bank.nostroBankName,
          accountName: bank.nostroAccountName,
          accountNumber: bank.nostroAccountNumber || bank.nostroAccountNo,
          swiftCode: bank.nostroSwiftCode,
          bankAddress: bank.nostroBankAddress || bank.nostroAddress,
        }
        : null);

    const benef =
      domestic?.accountName ||
      bank.accountName ||
      bank.beneficiaryName ||
      seller.legalName ||
      seller.name ||
      "AGRICOM IMPEX PVT LTD";

    const formatAddressInlineTwoLines = (addr) => {
      if (!addr || !String(addr).trim()) return "";
      const parts = String(addr)
        .split(/\r?\n/)
        .map((l) => l.trim().replace(/,+$/, ""))
        .filter(Boolean);

      if (parts.length <= 2) {
        return `ADDRESS : ${parts.join(", ")}`;
      }

      // Split evenly into 2 lines so it doesn't overflow the table boundary
      const mid = Math.ceil(parts.length / 2);
      const line1 = parts.slice(0, mid).join(", ") + ",";
      const line2 = parts.slice(mid).join(", ");
      return `ADDRESS : ${line1}\n          ${line2}`;
    };

    const domesticAddrBlock = formatAddressInlineTwoLines(domestic?.bankAddress);

    // Case 1: Linked Nostro exists -> Tight continuous block with NO gap
    if (nostro && (nostro.bankName || nostro.accountNumber)) {
      const lines = [
        "NOSTRO BANK DETAILS ",
        nostro.bankName || "",
        `ACCOUNT NO. : ${nostro.accountNumber || ""}`,
        `SWIFT CODE  : ${nostro.swiftCode || ""}`,
        `BENEFICIARY NAME : ${benef}`,
        `BANK NAME        : ${domestic?.bankName || ""}`,
        `ACCOUNT NO.      : ${domestic?.accountNumber || ""}`,
        `SWIFT CODE       : ${domestic?.swiftCode || ""}`,
      ];

      if (domesticAddrBlock) {
        lines.push(domesticAddrBlock);
      }

      return lines.join("\n");
    }

    // Case 2: No Nostro -> Domestic Beneficiary only with NO gap
    if (domestic && (domestic.bankName || domestic.accountNumber)) {
      const lines = [
        "BANK DETAILS :",
        `BENEFICIARY NAME : ${benef}`,
        `BANK NAME        : ${domestic?.bankName || ""}`,
        `ACCOUNT NO.      : ${domestic?.accountNumber || ""}`,
        `SWIFT CODE       : ${domestic?.swiftCode || ""}`,
      ];

      if (domesticAddrBlock) {
        lines.push(domesticAddrBlock);
      }

      return lines.join("\n");
    }

    // Fallback: If legacy formattedText or custom text exists
    if (bank.formattedText || bank.bankDetailsText || bank.additionalDetails) {
      return bank.formattedText || bank.bankDetailsText || bank.additionalDetails;
    }

    return "";
  };

  // Format Amount Chargeable (matches "EURO 14300" without decimals if whole)
  const chargeableAmount = invoice.amountChargeable ?? invoice.totalAmount ?? 0;
  const isWholeChargeable = Number(chargeableAmount) % 1 === 0;
  const chargeableDisplay = isWholeChargeable
    ? String(Number(chargeableAmount))
    : formatNumber(chargeableAmount, 2);

  // Format Amount In Words
  const formatWordsDisplay = () => {
    if (!invoice.amountInWords) return "—";
    let w = invoice.amountInWords.trim().toUpperCase();
    if (!w.startsWith(currencyLabel) && !w.startsWith(rawCurrency)) {
      w = `${currencyLabel} ${w}`;
    }
    if (!w.endsWith(".")) {
      w = `${w}.`;
    }
    return w;
  };

  // Dynamic Origin Certificate
  const originCountry = (invoice.countryOfOrigin || "KAZAKHSTAN").toUpperCase();
  const certificationText =
    invoice.declaration ||
    `WE HEREBY CERTIFY THAT THE GOODS SUPPLIED ARE OF 100% ${originCountry} ORIGIN.`;

  // Format Seller Address cleanly in uppercase lines matching user specification
  const formatSellerAddress = (rawAddress) => {
    if (!rawAddress) {
      return "202, 2ND FLOOR,\nAMALTAS APPT, RAJNAGAR,\nNAGPUR, MAHARASHTRA 440013\nMAHARASHTRA , INDIA";
    }
    const str = String(rawAddress).trim();
    if (
      str.toUpperCase().includes("AMALTAS") ||
      str.toUpperCase().includes("RAJNAGAR")
    ) {
      return "202, 2ND FLOOR,\nAMALTAS APPT, RAJNAGAR,\nNAGPUR, MAHARASHTRA 440013\nMAHARASHTRA , INDIA";
    }
    return str.toUpperCase();
  };

  return (
    <div
      id={id}
      className="export-invoice-a4 bg-white text-black mx-auto w-full max-w-[210mm] min-h-[297mm] px-[10mm] py-[8mm] box-border text-[11px] leading-[1.25] font-sans flex flex-col justify-between print:p-0 print:m-0 print:max-w-none print:w-full print:min-h-[280mm]"
      style={{
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        fontFamily: "Tahoma, Calibri, Arial, Helvetica, sans-serif",
      }}
    >
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm 8mm 10mm;
          }
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: Tahoma, Calibri, Arial, Helvetica, sans-serif;
          }

          /* Hide CRM navigation, header, sidebar, toolbars, buttons, toaster */
          header,
          aside,
          nav,
          .no-print,
          .print-hidden,
          button,
          [role="navigation"],
          .sonner-toaster,
          [data-sonner-toaster] {
            display: none !important;
          }

          /* Neutralize modal backdrop if printing directly from modal */
          #invoice-preview-backdrop {
            position: static !important;
            inset: auto !important;
            background: transparent !important;
            background-color: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            display: block !important;
            width: 100% !important;
            height: auto !important;
          }

          /* Reset all Next.js layout wrappers to allow normal print flow */
          #__next,
          main,
          div[class*="flex-1"] {
            overflow: visible !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            display: block !important;
          }

          /* Ensure the A4 invoice is visible and neatly formatted */
          #${id},
          .export-invoice-a4 {
            width: 100% !important;
            max-width: 210mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            visibility: visible !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            min-height: 280mm !important;
          }

          .page-break-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* ========================================================= */}
      {/* SALES CONTRACT EXACT LETTERHEAD HEADER                    */}
      {/* ========================================================= */}
      <div
        className="mb-2.5 text-slate-900 page-break-avoid"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        <div className="flex justify-between items-center">
          <div>
            <img
              src={selectedCompany.logo}
              alt={selectedCompany.name}
              className={selectedCompany.logoClass}
            />
          </div>
          <div className="text-right text-[12px] text-gray-900 leading-tight">
            <h1 className="text-base font-bold text-gray-900 uppercase mb-0.5">
              {selectedCompany.name}
            </h1>
            <p>{selectedCompany.address}</p>
            <p>{selectedCompany.city}</p>
            <p>{selectedCompany.phone}</p>
            <p>{selectedCompany.email}</p>
          </div>
        </div>
        <div className="flex items-center mt-1 mb-3">
          <span className="text-[10px] text-gray-600 uppercase whitespace-nowrap leading-none font-medium">
            EXPORT &amp; IMPORT OF AGRICULTURAL COMMODITIES
          </span>
          <div className="flex-1 border-b border-gray-300 ml-3" />
        </div>
      </div>

      {/* ========================================================= */}
      {/* TOP TITLE OUTSIDE THE BORDER BOX (EXACT LIKE PAPER)       */}
      {/* ========================================================= */}
      <div className="text-center font-bold text-[14px] tracking-wide uppercase text-black mt-7 mb-3">
        INVOICE
      </div>

      {/* Main Outer Box */}
      <div className="border border-black w-full flex flex-col bg-white">
        {/* ========================================================= */}
        {/* SECTION 1: SELLER (LEFT) & INVOICE / EXPORTER / ORDER (RIGHT) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-12 border-b border-black">
          {/* ---------------- LEFT HALF: SELLER (6 COLS) ---------------- */}
          <div className="col-span-6 border-r border-black px-1.5 py-1 flex flex-col justify-start">
            <div className="font-normal text-[10.5px] uppercase text-black">
              SELLER:
            </div>
            <div className="font-bold text-[11.5px] uppercase text-black">
              {seller.name || "AGRICOM IMPEX"}
            </div>
            <div className="whitespace-pre-line text-[11px] uppercase text-black leading-[1.25]">
              {formatSellerAddress(seller.address)}
            </div>
          </div>

          {/* ---------------- RIGHT HALF: 2 ROWS (6 COLS) ---------------- */}
          <div className="col-span-6 flex flex-col justify-between">
            {/* Row 1: Invoice No. & Date (Left) | EXPORTER REF (Right) */}
            <div className="grid grid-cols-12 border-b border-black min-h-[34px]">
              <div className="col-span-7 px-1.5 py-0.5 flex flex-col justify-between">
                <div className="flex justify-between text-[10px] text-black">
                  <span>Invoice No.</span>
                  <span className="pr-2">Invoice Date</span>
                </div>
                <div className="flex justify-between text-[11px] text-black font-normal">
                  <span>{invoice.invoiceNumber || "—"}</span>
                  <span className="pr-1">
                    {formatDateWithDots(invoice.invoiceDate)}
                  </span>
                </div>
              </div>
              <div className="col-span-5 px-1.5 py-0.5 flex flex-col justify-between">
                <div className="text-[10px] uppercase text-black">
                  EXPORTER REF:
                </div>
                <div className="text-[11px] uppercase text-black font-normal">
                  {invoice.exporterRef || "I.E.C. NO.0307027422"}
                </div>
              </div>
            </div>

            {/* Row 2: Seller's Order No. & Date (flex-1 so extra space falls below, aligning line with SELLER address) */}
            <div className="px-1.5 py-1 flex-1 flex flex-col justify-start">
              <div className="text-[11px] text-black">
                Seller&apos;s Order No.&amp; Date
              </div>
              <div className="flex justify-between text-[11px] text-black mt-0.5 font-normal">
                <span>{invoice.sellerOrderNo || "—"}</span>
                <span className="pr-6">
                  {invoice.sellerOrderDate
                    ? `DATE : ${formatDateWithDots(invoice.sellerOrderDate)}`
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: CONSIGNEE/TRANSPORT (LEFT) & OTHER/BUYER/TERMS (RIGHT) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-12 border-b border-black">
          {/* ---------------- LEFT HALF (6 COLS) ---------------- */}
          <div className="col-span-6 border-r border-black flex flex-col justify-between">
            {/* 2. CONSIGNEE & NOTIFY PARTY */}
            <div className="px-1.5 py-1.5 border-b border-black flex-1 flex flex-col justify-start min-h-[140px] space-y-2.5">
              {/* Consignee Row */}
              <div className="grid grid-cols-12 gap-1">
                <div className="col-span-4 font-normal text-[11px] text-black">
                  Consignee:
                </div>
                <div className="col-span-8 text-[11px] text-black leading-[1.25]">
                  <div className="font-normal uppercase">
                    {consignee.name || "—"}
                  </div>
                  {consignee.address && (
                    <div className="whitespace-pre-line uppercase">
                      {consignee.address}
                    </div>
                  )}
                  {consignee.taxId && (
                    <div className="uppercase">{consignee.taxId}</div>
                  )}
                </div>
              </div>

              {/* Notify Party Row */}
              <div className="grid grid-cols-12 gap-1 pb-1">
                <div className="col-span-4 font-normal text-[11px] text-black">
                  Notify Party:
                </div>
                <div className="col-span-8 text-[11px] text-black leading-[1.25]">
                  <div className="font-normal uppercase">
                    {notifyParty.name || consignee.name || "—"}
                  </div>
                  {(notifyParty.address || consignee.address) && (
                    <div className="whitespace-pre-line uppercase">
                      {notifyParty.address || consignee.address}
                    </div>
                  )}
                  {(notifyParty.taxId || consignee.taxId) && (
                    <div className="uppercase">
                      {notifyParty.taxId || consignee.taxId}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. TRANSPORT SUB-GRID (Inside Left Half, 2 columns) */}
            <div className="grid grid-cols-12 text-[11px]">
              {/* Row A: Carriage By | Place of Rec.by Pre-carrier */}
              <div className="col-span-5 px-1.5 py-0.5 border-r border-b border-black min-h-[28px]">
                <div className="text-[10px] text-black">Carriage By:</div>
                <div className="uppercase text-black">
                  {invoice.carriageBy || "ROAD"}
                </div>
              </div>
              <div className="col-span-7 px-1.5 py-0.5 border-b border-black min-h-[28px]">
                <div className="text-[10px] text-black">
                  Place of Rec.by Pre-carrier:
                </div>
                <div className="uppercase text-black">
                  {invoice.placeOfReceiptByPreCarrier ||
                    invoice.metadata?.placeOfReceiptByPreCarrier ||
                    invoice.metadata?.placeOfReceipt ||
                    ""}
                </div>
              </div>

              {/* Row B: TRUCK NO | Place of Loading */}
              <div className="col-span-5 px-1.5 py-0.5 border-r border-b border-black min-h-[28px]">
                <div className="text-[10px] uppercase text-black">TRUCK NO:</div>
                <div className="uppercase text-black">
                  {invoice.headerTruckNo || ""}
                </div>
              </div>
              <div className="col-span-7 px-1.5 py-0.5 border-b border-black min-h-[28px]">
                <div className="text-[10px] text-black">Place of Loading:</div>
                <div className="uppercase text-black">
                  {invoice.placeOfLoading || "—"}
                </div>
              </div>

              {/* Row C: Place of Unloading | Final Destination */}
              <div className="col-span-5 px-1.5 py-0.5 border-r border-black min-h-[28px]">
                <div className="text-[10px] text-black">Place of Unloading</div>
                <div className="uppercase text-black">
                  {invoice.placeOfUnloading || "—"}
                </div>
              </div>
              <div className="col-span-7 px-1.5 py-0.5 min-h-[28px]">
                <div className="text-[10px] text-black">Final Destination</div>
                <div className="uppercase text-black">
                  {invoice.finalDestination || "—"}
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- RIGHT HALF (6 COLS) ---------------- */}
          <div className="col-span-6 flex flex-col justify-between">
            {/* Other Ref. */}
            <div className="px-1.5 py-0.5 border-b border-black min-h-[26px]">
              <div className="text-[10px] text-black">Other Ref.</div>
              <div className="text-[11px] text-black">
                {invoice.otherRef || ""}
              </div>
            </div>

            {/* Row 4: Buyer if other than consignee: */}
            <div className="px-1.5 py-0.5 border-b border-black min-h-[55px]">
              <div className="text-[10px] text-black">
                Buyer if other than consignee:
              </div>
              <div className="text-[11px] text-black mt-0.5 whitespace-pre-line">
                {buyerOther.name
                  ? `${buyerOther.name}${buyerOther.address ? `\n${buyerOther.address}` : ""
                  }`
                  : ""}
              </div>
            </div>

            {/* Row 5: Country of Origin of Goods */}
            <div className="px-1.5 py-0.5 border-b border-black min-h-[28px]">
              <div className="text-[10px] text-black">
                Country of Origin of Goods
              </div>
              <div className="text-[11px] uppercase text-black">
                {invoice.countryOfOrigin || "KAZAKHSTAN"}
              </div>
            </div>

            {/* Row 6: Country of Final Destination */}
            <div className="px-1.5 py-0.5 border-b border-black min-h-[28px]">
              <div className="text-[10px] text-black">
                Country of Final Destination
              </div>
              <div className="text-[11px] uppercase text-black">
                {invoice.countryOfFinalDestination || "—"}
              </div>
            </div>

            {/* Row 7: Terms of Delivery & Payments */}
            <div className="px-1.5 py-1 flex-1 flex flex-col justify-between min-h-[84px]">
              <div className="text-[10px] text-black">
                Terms of Delivery &amp; Payments
              </div>
              <div className="text-[11px] uppercase text-black whitespace-pre-line leading-[1.35] my-auto py-1">
                {invoice.termsOfDeliveryPayment || "—"}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 3: GOODS, SPACER STRIP, BANK & TOTAL TABLE        */}
        {/* ========================================================= */}
        <div>
          <table className="w-full text-left border-collapse table-fixed">
            {/* Column widths locked via colgroup so spacer strip & columns align 100% */}
            <colgroup>
              <col className="w-[20.833%]" />
              <col className="w-[15.167%]" />
              <col className="w-[32%]" />
              <col className="w-[10%]" />
              <col className="w-[11%]" />
              <col className="w-[11%]" />
            </colgroup>
            <thead>
              {/* 1. EXACT DOUBLE-LINE SPACER STRIP (Image 2 match) */}
              <tr className="h-[10px]">
                {/* First column width = 20.833% (matches 5/12 of Left Half exactly!) */}
                <th
                  colSpan={1}
                  className="p-0 border-b border-r border-black h-[10px]"
                  style={{
                    borderBottom: "1px solid #000",
                    borderRight: "1px solid #000",
                  }}
                ></th>
                <th
                  colSpan={5}
                  className="p-0 border-b border-black h-[10px]"
                  style={{
                    borderBottom: "1px solid #000",
                  }}
                ></th>
              </tr>

              {/* 2. GOODS TABLE HEADER ROW */}
              <tr className="text-[10.5px] font-normal text-black">
                <th
                  className="px-1.5 py-1 align-top font-normal border-b border-black"
                  style={{ borderBottom: "1px solid #000" }}
                >
                  Mark &amp; Nos./
                  <br />
                  Container No.
                </th>
                <th
                  className="px-1.5 py-1 align-top font-normal border-b border-black"
                  style={{ borderBottom: "1px solid #000" }}
                >
                  No.&amp; kind of Pkgs.
                </th>
                <th
                  className="px-1.5 py-1 align-top font-normal border-r border-b border-black"
                  style={{
                    borderRight: "1px solid #000",
                    borderBottom: "1px solid #000",
                  }}
                >
                  Description of Goods
                </th>
                <th
                  className="px-1 py-1 text-center align-top font-normal border-r border-b border-black"
                  style={{
                    borderRight: "1px solid #000",
                    borderBottom: "1px solid #000",
                  }}
                >
                  Quantity
                  <br />
                  in MT
                </th>
                <th
                  className="px-1 py-1 text-center align-top font-normal border-r border-b border-black"
                  style={{
                    borderRight: "1px solid #000",
                    borderBottom: "1px solid #000",
                  }}
                >
                  Rate in
                  <br />
                  {currencyLabel} per MT
                </th>
                <th
                  className="px-1.5 py-1 text-center align-top font-normal border-b border-black"
                  style={{ borderBottom: "1px solid #000" }}
                >
                  Amount
                  <br />
                  in {currencyLabel}
                </th>
              </tr>
            </thead>

            <tbody>
              {/* Goods Item Rows */}
              {goods.map((item, idx) => (
                <tr key={item.id || idx} className="text-[11px]">
                  {/* Col 1: Marks & Nos + Truck No underneath on first row */}
                  <td className="px-1.5 pt-2 pb-1 align-top whitespace-pre-line leading-[1.25]">
                    <div>{item.marksAndNos || "BIG BAGS"}</div>
                    {idx === 0 && trucksStr && (
                      <div className="mt-4">
                        <div className="font-bold uppercase">TRUCK NO:</div>
                        <div className="uppercase">{trucksStr}</div>
                      </div>
                    )}
                  </td>

                  {/* Col 2: No. & kind of Pkgs */}
                  <td className="px-1.5 pt-2 pb-1 align-top whitespace-pre-line leading-[1.25] uppercase">
                    {item.noAndKindOfPackages || "22 BAGS\nPACKING:\nBIG BAGS"}
                  </td>

                  {/* Col 3: Description of Goods */}
                  <td
                    className="px-1.5 pt-2 pb-1 border-r border-black align-top whitespace-pre-line leading-[1.25] uppercase"
                    style={{ borderRight: "1px solid #000" }}
                  >
                    {item.descriptionOfGoods || "COMMODITY"}
                  </td>

                  {/* Col 4: Quantity */}
                  <td
                    className="px-1.5 pt-2 pb-1 border-r border-black align-top text-center whitespace-nowrap"
                    style={{ borderRight: "1px solid #000" }}
                  >
                    {formatNumber(item.quantity, 0)}
                  </td>

                  {/* Col 5: Rate */}
                  <td
                    className="px-1.5 pt-2 pb-1 border-r border-black align-top text-center whitespace-nowrap"
                    style={{ borderRight: "1px solid #000" }}
                  >
                    {formatNumber(item.rate, 2)}
                  </td>

                  {/* Col 6: Amount */}
                  <td className="px-1.5 pt-2 pb-1 align-top text-right whitespace-nowrap">
                    {formatNumber(item.amount, 2)}
                  </td>
                </tr>
              ))}

              {/* Bank Details Row inside the Goods table */}
              <tr className="text-[10px]">
                <td
                  colSpan={3}
                  className="px-1.5 pt-3 pb-2 border-r border-black align-bottom"
                  style={{
                    minHeight: "135px",
                    height: "135px",
                    borderRight: "1px solid #000",
                  }}
                >
                  <div className="whitespace-pre-line text-black leading-[1.28]">
                    {renderBankDetails()}
                  </div>
                </td>
                <td
                  className="border-r border-black"
                  style={{ borderRight: "1px solid #000" }}
                ></td>
                <td
                  className="border-r border-black"
                  style={{ borderRight: "1px solid #000" }}
                ></td>
                <td></td>
              </tr>

              {/* ========================================================= */}
              {/* EXACT TOTAL INVOICE AMOUNT ROW (Image 1 match)            */}
              {/* Explicit top & bottom borders on EVERY td so line shows!  */}
              {/* ========================================================= */}
              <tr className="font-bold text-[11px] leading-tight">
                <td
                  colSpan={3}
                  className="px-1.5 py-0.5 border-t border-b border-r border-black uppercase text-black"
                  style={{
                    borderTop: "1px solid #000",
                    borderBottom: "1px solid #000",
                    borderRight: "1px solid #000",
                  }}
                >
                  TOTAL INVOICE AMOUNT
                </td>
                {/* Empty cell under Quantity column with top, bottom & right border */}
                <td
                  className="px-1 py-0.5 border-t border-b border-r border-black"
                  style={{
                    borderTop: "1px solid #000",
                    borderBottom: "1px solid #000",
                    borderRight: "1px solid #000",
                  }}
                ></td>
                {/* Total Currency cell under Rate column with top, bottom & right border */}
                <td
                  className="px-1 py-0.5 border-t border-b border-r border-black text-center text-black whitespace-nowrap"
                  style={{
                    borderTop: "1px solid #000",
                    borderBottom: "1px solid #000",
                    borderRight: "1px solid #000",
                  }}
                >
                  Total {currencyLabel}
                </td>
                {/* Final Total Amount cell with top & bottom border */}
                <td
                  className="px-1.5 py-0.5 border-t border-b border-black text-right text-black whitespace-nowrap"
                  style={{
                    borderTop: "1px solid #000",
                    borderBottom: "1px solid #000",
                  }}
                >
                  {formatNumber(invoice.totalAmount ?? chargeableAmount, 2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ========================================================= */}
        {/* SECTION 4: OPEN BOTTOM BOX (WORDS, CERT, STAMP, FOOTER)   */}
        {/* ========================================================= */}
        <div className="px-1.5 pt-2 pb-2 flex flex-col justify-between min-h-[190px] page-break-avoid">
          {/* Upper Content: Chargeable + Words + Cert on Left, Round Stamp on Right */}
          <div className="grid grid-cols-12 items-start">
            <div className="col-span-8 space-y-2 pr-2">
              <div className="text-[11px] uppercase text-black">
                AMOUNT CHARGEABLE: {currencyLabel} {chargeableDisplay}
              </div>

              <div className="text-[11px] uppercase text-black">
                IN WORDS: {formatWordsDisplay()}
              </div>

              <div className="text-[11px] uppercase text-black pt-1">
                {certificationText}
              </div>
            </div>

            {/* Stamp & Signature Overlay Area (Blend Mode) */}
            <div className="col-span-4 relative h-32 w-full flex items-center justify-center select-none pt-1">
              {/* Stamp (Base Layer) */}
              {resolvedStampUrl && !stampFailed ? (
                <img
                  src={resolvedStampUrl}
                  alt="Company Stamp"
                  className="absolute inset-0 m-auto max-h-40 max-w-[155px] object-contain pointer-events-none"
                  style={{ mixBlendMode: "multiply" }}
                  onError={() => setStampFailed(true)}
                />
              ) : (
                <div
                  className="absolute inset-0 m-auto flex items-center justify-center pointer-events-none"
                  style={{ mixBlendMode: "multiply" }}
                >
                  <svg
                    width="125"
                    height="125"
                    viewBox="0 0 120 120"
                    className="mx-auto select-none"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="55"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="2.2"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="43"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="1.2"
                    />
                    <defs>
                      <path
                        id="stampTopArc"
                        d="M 21,60 A 39,39 0 1,1 99,60"
                        fill="none"
                      />
                      <path
                        id="stampBottomArc"
                        d="M 99,60 A 39,39 0 0,1 21,60"
                        fill="none"
                      />
                    </defs>
                    <text
                      fill="#1e293b"
                      fontSize="9.5"
                      fontWeight="800"
                      letterSpacing="2.2"
                    >
                      <textPath
                        href="#stampTopArc"
                        startOffset="50%"
                        textAnchor="middle"
                      >
                        AGRICOM IMPEX
                      </textPath>
                    </text>
                    <text
                      fill="#1e293b"
                      fontSize="9"
                      fontWeight="800"
                      letterSpacing="3"
                    >
                      <textPath
                        href="#stampBottomArc"
                        startOffset="50%"
                        textAnchor="middle"
                      >
                        * NAGPUR *
                      </textPath>
                    </text>
                    <g transform="rotate(-8 60 60)">
                      <text
                        x="60"
                        y="63"
                        fill="#1e293b"
                        fontSize="19"
                        fontFamily="'Brush Script MT', 'Dancing Script', cursive, serif"
                        fontStyle="italic"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        Spadia
                      </text>
                      <path
                        d="M 35,68 Q 60,72 85,65"
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="1.1"
                      />
                    </g>
                  </svg>
                </div>
              )}

              {/* Signature (Overlaid directly on top with mix-blend-mode: multiply) */}
              {resolvedSignatureUrl && !signatureFailed && (
                <img
                  src={resolvedSignatureUrl}
                  alt="Signature"
                  className="absolute inset-0 m-auto max-h-30 max-w-[195px] object-contain z-10 pointer-events-none"
                  style={{ mixBlendMode: "multiply" }}
                  onError={() => setSignatureFailed(true)}
                />
              )}
            </div>
          </div>

          {/* Bottom Row: Declaration on Left, Single (AUTHORISED SIGNATORY) on Right */}
          <div className="grid grid-cols-12 items-end pt-3">
            <div className="col-span-8 text-[11px] text-black leading-[1.25]">
              DECLARATION: We declare that this Invoice shows the actual price
              <br />
              of the goods described and that all particulars are true and
              correct.
            </div>
            <div className="col-span-4 text-center font-bold text-[11px] uppercase text-black">
              (AUTHORISED SIGNATORY)
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SALES CONTRACT EXACT LETTERHEAD FOOTER (GREEN LINE)       */}
      {/* ========================================================= */}
      <div
        className="mt-auto pt-2 border-t-2 border-[#8dc63f] text-center print:mx-0 print:mb-1 page-break-avoid"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        <p className="text-[11px] text-gray-500 font-medium">
          {selectedCompany.website || "www.agricomimpex.com"}
        </p>
      </div>
    </div>
  );
}