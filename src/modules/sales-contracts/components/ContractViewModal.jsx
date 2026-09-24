import React, { useState, useEffect } from "react";
import { X, Printer, Loader2, AlertCircle, Pencil, Edit3, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { salesContractApi } from "../services/salesContractApi";
import RichTextEditor from "@/components/editor/RichTextEditor";

// ─── helpers ────────────────────────────────────────────────────────────────

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString)
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
};

/** Build a one-line address string from a Partner object */
const partnerAddress = (p) => {
  if (!p) return "—";
  const parts = [p.entityName, p.address, p.city, p.country?.name].filter(Boolean);
  return parts.join(", ").toUpperCase() || "—";
};

const incotermLabel = (contract) => {
  const mode = contract.destinationTransportMode || "sea";
  const loc = contract.destinationLocationName || contract.portOfDischarge || "";
  if (mode === "sea" || mode === "air") return loc ? `CIF ${loc}` : "CIF";
  return loc ? `DAP ${loc}` : "DAP";
};

// ─── Row component ───────────────────────────────────────────────────────────
const Row = ({ label, children, className = "" }) => (
  <div className={`flex mb-4 print-avoid-break ${className}`}>
    <div className="w-[18%] font-bold uppercase pr-4 flex-shrink-0">{label}</div>
    <div className="w-[82%] uppercase leading-snug">{children}</div>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────

export default function ContractViewModal({ contractId, onClose }) {
  const router = useRouter();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Document custom text overrides states
  const [printOverrides, setPrintOverrides] = useState({});
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [savingOverrides, setSavingOverrides] = useState(false);

  useEffect(() => {
    if (contract) {
      setPrintOverrides(contract.printOverrides || {});
    }
  }, [contract]);

  const handleSaveCustomOverrides = async () => {
    setSavingOverrides(true);
    try {
      await salesContractApi.update(contract.id, {
        printOverrides,
      });
      toast.success("Document customizations saved successfully!");
      setContract((prev) => ({ ...prev, printOverrides }));
      setIsCustomizing(false);
    } catch (err) {
      console.error("Failed to save overrides:", err);
      toast.error("Failed to save customizations.");
    } finally {
      setSavingOverrides(false);
    }
  };

  const renderValue = (key, defaultValue) => {
    const value = printOverrides[key] !== undefined ? printOverrides[key] : defaultValue;

    if (isCustomizing) {
      return (
        <textarea
          value={value || ""}
          onChange={(e) => setPrintOverrides(prev => ({ ...prev, [key]: e.target.value }))}
          className="w-full text-xs font-sans p-1.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-blue-50/20 resize-y uppercase font-medium print:bg-transparent print:border-none print:p-0"
          rows={1}
          placeholder="Type custom override text..."
        />
      );
    }

    return <span>{value || "—"}</span>;
  };

  useEffect(() => {
    if (!contractId) return;

    const loadContract = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await salesContractApi.getOne(contractId);
        setContract(res.data);
      } catch (err) {
        console.error("Failed to load contract details", err);
        setError("Could not load the contract document. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadContract();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, [contractId]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-200/80">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-[#007aff] animate-spin" />
          <p className="text-sm font-semibold text-slate-800">Loading Document...</p>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error || !contract) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-200/80">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-4 max-w-sm text-center">
          <AlertCircle className="h-10 w-10 text-[#007aff]" />
          <h3 className="text-lg font-bold text-slate-900">Failed to Load</h3>
          <p className="text-sm text-slate-600">{error}</p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // ── Derived values ─────────────────────────────────────────────────────────
  const hasBroker = !!contract.broker;
  const hasSeller = !!(contract.seller || contract.sellerCompanyName);
  const hasBuyer = !!(contract.buyer || contract.buyerCompanyName);

  const sellerName = (contract.sellerCompanyName || contract.seller?.entityName || "").toUpperCase();
  const buyerName = (contract.buyerCompanyName || contract.buyer?.entityName || "").toUpperCase();
  const brokerName = contract.broker?.entityName?.toUpperCase() || "";

  const getShipmentPeriodText = (shipments) => {
    if (!shipments || shipments.length === 0) return "—";
    const dates = shipments
      .map((s) => s.shipmentDate ? new Date(s.shipmentDate) : null)
      .filter((d) => d && !isNaN(d.getTime()));
    if (dates.length === 0) return "—";
    dates.sort((a, b) => a.getTime() - b.getTime());
    const startDate = dates[0];
    const lastDate = dates[dates.length - 1];
    const standardMonthNames = [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    const startOfFirstMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const startOfLastMonth = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);

    const startOfFirstMonthPlusOne = new Date(startOfFirstMonth);
    startOfFirstMonthPlusOne.setMonth(startOfFirstMonthPlusOne.getMonth() + 1);

    let endMonthDate;
    if (startOfLastMonth.getTime() > startOfFirstMonthPlusOne.getTime()) {
      endMonthDate = startOfLastMonth;
    } else {
      endMonthDate = startOfFirstMonthPlusOne;
    }

    const firstMonth = standardMonthNames[startDate.getMonth()];
    const firstYear = startDate.getFullYear();
    const lastMonth = standardMonthNames[endMonthDate.getMonth()];
    const lastYear = endMonthDate.getFullYear();

    if (firstYear === lastYear) {
      return `${firstMonth} – ${lastMonth} ${firstYear} SHIPMENT`;
    } else {
      return `${firstMonth} ${firstYear} –  ${lastMonth} ${lastYear} SHIPMENT`;
    }
  };

  const shipmentPeriod = getShipmentPeriodText(contract.shipments);

  const documentLine =
    contract.documents?.length > 0
      ? contract.documents.map((d) => d.tradeDocument?.name).filter(Boolean).join(", ")
      : "";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-start bg-slate-200/90 overflow-y-auto print:bg-transparent print:overflow-visible print:static print:block">

      {/* Print page rules */}
      <style jsx global>{`
        #contract-print-area, #contract-print-area * {
          font-family: "Times New Roman", Times, serif !important;
        }
        @media print {
          @page { size: A4; margin: 12mm 12mm 0mm 12mm; }
          html, body {
            margin: 0 !important; padding: 0 !important;
            height: auto !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * { visibility: hidden; }
          #contract-print-area, #contract-print-area * {
            visibility: visible;
            font-family: "Times New Roman", Times, serif !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #contract-print-area {
            position: absolute !important; left: 0; top: 0;
            width: 100% !important; min-height: 0 !important;
            box-shadow: none !important; border-radius: 0 !important;
            margin: 0 !important; padding: 0 !important;
          }
          /* Table-based repeating footer */
          #contract-print-table {
            width: 100%;
            border-collapse: collapse;
          }
          #contract-print-table tfoot {
            display: table-footer-group;
          }
          #contract-print-table tfoot td {
            padding: 0;
          }
          .print-avoid-break { break-inside: avoid !important; page-break-inside: avoid !important; }
          .print-page-break-before { break-before: page !important; page-break-before: always !important; }
        }
      `}</style>

      {/* Floating buttons */}
      <div className="fixed top-6 right-6 flex flex-col gap-2 z-[110] print:hidden">
        {/* Toggle Customize Text Mode */}
        <button
          onClick={() => setIsCustomizing(!isCustomizing)}
          className={`h-10 w-10 flex items-center justify-center rounded-xl border shadow-sm transition-colors cursor-pointer ${isCustomizing
            ? "bg-amber-500 border-amber-600 text-white hover:bg-amber-600"
            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          title={isCustomizing ? "Exit Customizing" : "Customize Document Text"}
        >
          <Edit3 className="h-4.5 w-4.5" />
        </button>

        {/* Save Overrides Button (Visible only in Customizing mode) */}
        {isCustomizing && (
          <button
            onClick={handleSaveCustomOverrides}
            disabled={savingOverrides}
            className="h-10 w-10 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm cursor-pointer transition-colors"
            title="Save Customizations"
          >
            {savingOverrides ? (
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
            ) : (
              <Check className="h-4.5 w-4.5" />
            )}
          </button>
        )}

        {/* <button
          onClick={() => router.push(`/sales-contracts/${contractId}/edit`)}
          className="h-10 w-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 text-[#007aff] transition-colors cursor-pointer"
          title="Edit Contract"
        >
          <Pencil className="h-4.5 w-4.5" />
        </button> */}
        <button
          onClick={() => window.print()}
          className="h-10 w-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 text-[#007aff] transition-colors cursor-pointer"
          title="Print / PDF Export"
        >
          <Printer className="h-5 w-5" />
        </button>
        <button
          onClick={onClose}
          className="h-10 w-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* A4 Paper */}
      <div
        id="contract-print-area"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
        className="my-8 bg-white w-full max-w-[1024px] h-fit rounded-2xl shadow-2xl print:my-0 print:shadow-none print:max-w-none print:w-full"
      >
        {/*
          TABLE TRICK: tfoot repeats on every printed page automatically.
          thead could repeat at top too, but we only want footer here.
        */}
        <table id="contract-print-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <tfoot>
            <tr>
              <td>
                {/* ── REPEATING PAGE FOOTER ──────────────────────────── */}
                <div className="font-serif text-[13px] text-black">
                  {/* Signature row */}
                  {(hasSeller || hasBroker || hasBuyer) && (
                    <div className="flex items-start justify-between px-8 md:px-10 pt-6 pb-2 print:px-0 print:pt-4">

                      {/* SELLER */}
                      {hasSeller && (
                        <div className="text-center w-56 relative">
                          <p className="font-bold uppercase mb-1 text-[11px]">Accepted By Seller</p>
                          <p className="font-bold uppercase text-[11px] mb-8">{sellerName}</p>

                          <div className="relative h-16 w-full my-1 flex items-center justify-center">
                            {contract.sellerCompanySeal && (
                              <img
                                src={contract.sellerCompanySeal}
                                alt="Seller Seal"
                                className="absolute inset-0 m-auto max-h-55 pb-8 max-w-[180px] object-contain opacity-85 pointer-events-none "
                                style={{ mixBlendMode: "multiply" }}
                              />
                            )}
                            {contract.sellerSignature && (
                              <img
                                src={contract.sellerSignature}
                                alt="Seller Signature"
                                className="absolute inset-0 m-auto max-h-15 max-w-[140px] object-contain z-10 pointer-events-none"
                                style={{ mixBlendMode: "multiply" }}
                              />
                            )}
                          </div>

                          {contract.sellerAuthorizedSignatory && (
                            <p className="uppercase text-[10px]">({contract.sellerAuthorizedSignatory})</p>
                          )}
                          <div className="border-t border-black mt-1 pt-1 text-[10px] text-gray-500 uppercase">
                            Authorized Signatory
                          </div>
                        </div>
                      )}

                      {/* BROKER */}
                      {hasBroker && (
                        <div className="text-center w-56 relative">
                          <p className="font-bold uppercase mb-1 text-[11px]">Broker</p>
                          <p className="font-bold uppercase text-[11px]">{brokerName}</p>
                          <div className="h-16" />
                          <div className="border-t border-black mt-1 pt-1 text-[10px] text-gray-500 uppercase">
                            Authorized Signatory
                          </div>
                        </div>
                      )}

                      {/* BUYER */}
                      {hasBuyer && (
                        <div className="text-center w-56 relative">
                          <p className="font-bold uppercase mb-1 text-[11px]">Accepted By Buyer</p>
                          <p className="font-bold uppercase text-[11px]">{buyerName}</p>

                          <div className="relative h-16 w-full my-1 flex items-center justify-center">
                            {contract.buyerCompanySeal && (
                              <img
                                src={contract.buyerCompanySeal}
                                alt="Buyer Seal"
                                className="absolute inset-0 m-auto max-h-16 max-w-[140px] object-contain opacity-85 pointer-events-none"
                                style={{ mixBlendMode: "multiply" }}
                              />
                            )}
                            {contract.buyerSignature && (
                              <img
                                src={contract.buyerSignature}
                                alt="Buyer Signature"
                                className="absolute inset-0 m-auto max-h-14 max-w-[140px] object-contain z-10 pointer-events-none"
                                style={{ mixBlendMode: "multiply" }}
                              />
                            )}
                          </div>

                          {contract.buyerAuthorizedSignatory && (
                            <p className="uppercase text-[10px]">({contract.buyerAuthorizedSignatory})</p>
                          )}
                          <div className="border-t border-black mt-1 pt-1 text-[10px] text-gray-500 uppercase">
                            Authorized Signatory
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Website footer line */}
                  <div className="mx-8 md:mx-10 mt-3 mb-4 pt-2 border-t-2 border-[#8dc63f] text-center print:mx-0">
                    <p className="text-[11px] text-gray-500 font-medium">www.agricomimpex.com</p>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>

          <tbody>
            <tr>
              <td>
                <div className="p-8 md:p-10 print:p-0 text-slate-900">

                  {/* ── LETTERHEAD ───────────────────────────────────────── */}
                  <div className="flex justify-between items-center print-avoid-break">
                    <div>
                      <img src="/agri_logo.png" alt="Agricom Impex" className="h-32 object-contain" />
                    </div>
                    <div className="text-right text-[10px] text-gray-900 leading-tight">
                      <h1 className="text-base font-bold text-gray-900 uppercase mb-0.5 ">Agricom Impex</h1>
                      <p>202, Amaltas apartment, Rajnagar</p>
                      <p>Nagpur (MH), India 440013</p>
                      <p>+91 712 2591130 / 34</p>
                      <p>info@agricomimpex.com</p>
                    </div>
                  </div>
                  <div className="border-b border-gray-300 mb-4" />

                  {/* ── TITLE & META ─────────────────────────────────────── */}
                  <div className="flex justify-between items-start mb-6 print-avoid-break">
                    <div className="w-1/4" />
                    <div className="text-center w-2/4">
                      <h2 className="text-lg font-bold uppercase tracking-widest mb-1 text-slate-900">
                        Sales Contract
                      </h2>
                    </div>
                    <div className="text-right text-[10px] w-1/4">
                      <table className="ml-auto">
                        <tbody>
                          <tr>
                            <td className="pr-2 text-slate-900 font-semibold uppercase">Reference No :</td>
                            <td className="font-bold text-slate-900 uppercase text-left">{contract.contractNumber || "—"}</td>
                          </tr>
                          <tr>
                            <td className="pr-2 text-slate-900 font-semibold uppercase">Contract Date :</td>
                            <td className="font-bold text-slate-900 text-left">{formatDate(contract.contractDate)}</td>
                          </tr>
                          <tr>
                            <td className="pr-2 text-slate-900 font-semibold uppercase">Financial Year :</td>
                            <td className="font-bold text-slate-900 uppercase text-left">{contract.financialYear || "—"}</td>
                          </tr>
                          <tr>
                            <td className="pr-2 text-slate-900 font-semibold uppercase">Created On :</td>
                            <td className="font-bold text-slate-900 text-left">{formatDate(contract.createdAt)}</td>
                          </tr>
                          {contract.status && (
                            <tr>
                              <td className="pr-2 text-slate-900 font-semibold uppercase">Status :</td>
                              <td className="font-bold text-slate-900 uppercase text-left">{contract.status}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* ── BODY ─────────────────────────────────────────────── */}
                  <div className="font-serif text-[13px] leading-snug text-black mt-8">

                    <p className="font-bold uppercase mb-6">
                      We Herewith Confirm The Following Transaction Between Following:
                    </p>

                    {/* SELLER */}
                    {hasSeller && (
                      <Row label="Seller">
                        {renderValue("seller", contract.seller ? partnerAddress(contract.seller) : contract.sellerCompanyName?.toUpperCase())}
                      </Row>
                    )}

                    {/* BUYER */}
                    {hasBuyer && (
                      <Row label="Buyer">
                        {renderValue("buyer", contract.buyer ? partnerAddress(contract.buyer) : contract.buyerCompanyName?.toUpperCase())}
                      </Row>
                    )}

                    {/* BROKER */}
                    {hasBroker && (
                      <Row label="Broker" className="mb-8">
                        {renderValue("broker", partnerAddress(contract.broker))}
                      </Row>
                    )}

                    <div className={hasBroker ? "" : "mb-4"} />

                    {/* ORIGIN */}
                    {(contract.originLocationName || contract.portOfLoading || contract.originCountry) && (
                      <Row label="Origin Port">
                        {renderValue(
                          "originPort",
                          [
                            (contract.originLocationName || contract.portOfLoading || "").trim().toUpperCase(),
                            (typeof contract.originCountry === "object" ? contract.originCountry?.name : contract.originCountry)?.trim().toUpperCase(),
                          ]
                            .filter(Boolean)
                            .join(", ")
                        )}
                      </Row>
                    )}

                    {/* DESTINATION */}
                    {(contract.destinationLocationName || contract.portOfDischarge || contract.destinationCountry) && (
                      <Row label="Dest. Port">
                        {renderValue(
                          "destPort",
                          [
                            (contract.destinationLocationName || contract.portOfDischarge || "").trim().toUpperCase(),
                            (typeof contract.destinationCountry === "object" ? contract.destinationCountry?.name : contract.destinationCountry)?.trim().toUpperCase(),
                          ]
                            .filter(Boolean)
                            .join(", ")
                        )}
                      </Row>
                    )}

                    {/* SHIPMENT TYPE */}
                    {contract.shipmentType?.name && (
                      <Row label="Shipment Type">
                        {renderValue("shipmentType", contract.shipmentType.name.toUpperCase())}
                      </Row>
                    )}

                    <div className="mb-4" />

                    {/* ── PRODUCT ITEMS ──────────────────────────────────────────────────────────────────────────────────── */}
                    {contract.items?.map((item, idx) => (
                      <React.Fragment key={item.id || idx}>
                        <Row label="Product">
                          {renderValue(`product_${idx}`, item.product?.name?.toUpperCase() || "—")}
                        </Row>

                        <Row label="Quality">
                          {renderValue(`quality_${idx}`, [
                            item.product?.qualitySubType,
                            item.product?.specification || item.quality,
                          ].filter(Boolean).join(" - ")?.toUpperCase() || "—")}
                        </Row>

                        <Row label="Quantity">
                          {renderValue(`quantity_${idx}`, `${Number(item.quantity).toLocaleString("en-IN")} MT +/- 5%`)}
                        </Row>

                        <Row label="Packing">
                          {renderValue(`packing_${idx}`, [
                            item.packingType?.name,
                            item.bagType?.name ? `OF EACH ${item.bagType.name}` : null,
                            item.bagSpecification?.name ? `(${item.bagSpecification.name})` : null,
                          ].filter(Boolean).join(" ")?.toUpperCase() || "—")}
                        </Row>

                        <Row label="Marking">
                          {renderValue(`marking_${idx}`, item.marking?.toUpperCase() || "NONE")}
                        </Row>

                        <Row label="Price">
                          {renderValue(`price_${idx}`, `${contract.currencyCode} ${Number(item.unitPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })} PER MT ${incotermLabel(contract)}`.toUpperCase())}
                        </Row>
                      </React.Fragment>
                    ))}

                    {/* PAYMENT */}
                    <Row label="Payment">
                      {renderValue("payment", contract.paymentTerm?.name?.toUpperCase() || "—")}
                      <div className="mt-3 text-[13px] text-black font-serif leading-snug">
                        IN THE EVENT OF DELAY IN PAYMENT FOR THE GOODS BEYOND THE TERMS SPECIFIED IN THIS CONTRACT, THE BUYER SHALL BE ENTITLED TO A PENALTY, WHICH SHALL BE CALCULATED AT 0.1% OF THE VALUE OF THE COMMERCIAL INVOICE FOR EACH DAY OF DELAY
                      </div>
                    </Row>

                    {/* SHIPMENT */}
                    <Row label="Shipment">
                      {renderValue("shipment_period", shipmentPeriod.toUpperCase())}
                    </Row>

                    {/* DOCUMENTS */}
                    {contract.documents?.length > 0 && (
                      <Row label="Documents" className="leading-relaxed">
                        {renderValue("documents", documentLine?.toUpperCase())}
                      </Row>
                    )}

                    {/* NOTE / REMARKS */}
                    {contract.remarks && (
                      <Row label="Note" className="mb-6">
                        {renderValue("note", contract.remarks?.toUpperCase())}
                      </Row>
                    )}



                    {/* ── TERMS & CONDITIONS ──────────────────────────────── */}
                    {contract.terms?.length > 0 && (
                      <div className="mb-6 mt-4 print:mt-0 print-avoid-break">
                        <h4 className="font-bold uppercase mb-3">Terms &amp; Conditions</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {contract.terms.map((term, idx) => (
                            <li key={idx} className="uppercase">{term}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* OTHER CONDITIONS */}
                    {contract.otherConditions?.length > 0 && (
                      <div className="mb-6 print-avoid-break">
                        <h4 className="font-bold uppercase mb-3">Other Conditions</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {contract.otherConditions.map((cond, idx) => (
                            <li key={idx} className="uppercase">{cond}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* DISPUTE RESOLUTION */}
                    {contract.disputeResolution && (
                      <div className="mb-6 print-avoid-break">
                        <h4 className="font-bold uppercase mb-3">Dispute Resolution</h4>
                        <div className="uppercase -mx-4 -mt-2">
                          <RichTextEditor value={contract.disputeResolution} editable={false} outputFormat="json" />
                        </div>
                      </div>
                    )}

                    {/* FORCE MAJEURE */}
                    {contract.forceMajeure && (
                      <div className="mb-10 print-avoid-break">
                        <h4 className="font-bold uppercase mb-3">Force Majeure</h4>
                        <div className="uppercase -mx-4 -mt-2">
                          <RichTextEditor value={contract.forceMajeure} editable={false} outputFormat="json" />
                        </div>
                      </div>
                    )}

                  </div>

                  {/* ── ON-SCREEN ONLY footer preview (hidden on print, tfoot handles print) ── */}
                  <div className="print:hidden">
                    {(hasSeller || hasBroker || hasBuyer) && (
                      <div className="mt-16 flex items-start justify-between font-serif text-[13px]">
                        {hasSeller && (
                          <div className="text-center w-56 relative">
                            <p className="font-bold uppercase mb-1 text-[11px]">Accepted By Seller</p>
                            <p className="font-bold uppercase text-[11px] mb-8">{sellerName}</p>

                            <div className="relative h-16 w-full my-1 flex items-center justify-center">
                              {contract.sellerCompanySeal && (
                                <img
                                  src={contract.sellerCompanySeal}
                                  alt="Seller Seal"
                                  className="absolute inset-0 m-auto max-h-55 pb-8 max-w-[180px] object-contain opacity-85 pointer-events-none"
                                  style={{ mixBlendMode: "multiply" }}
                                />
                              )}
                              {contract.sellerSignature && (
                                <img
                                  src={contract.sellerSignature}
                                  alt="Seller Signature"
                                  className="absolute inset-0 m-auto max-h-15 max-w-[140px] object-contain z-10 pointer-events-none"
                                  style={{ mixBlendMode: "multiply" }}
                                />
                              )}
                            </div>

                            {contract.sellerAuthorizedSignatory && (
                              <p className="uppercase text-[10px]">({contract.sellerAuthorizedSignatory})</p>
                            )}
                            <div className="border-t border-black mt-1 pt-1 text-[10px] text-gray-500 uppercase">
                              Authorized Signatory
                            </div>
                          </div>
                        )}
                        {hasBroker && (
                          <div className="text-center w-56 relative">
                            <p className="font-bold uppercase mb-1 text-[11px]">Broker</p>
                            <p className="font-bold uppercase text-[11px]">{brokerName}</p>
                            <div className="h-16" />
                            <div className="border-t border-black mt-1 pt-1 text-[10px] text-gray-500 uppercase">
                              Authorized Signatory
                            </div>
                          </div>
                        )}
                        {hasBuyer && (
                          <div className="text-center w-56 relative">
                            <p className="font-bold uppercase mb-1 text-[11px]">Accepted By Buyer</p>
                            <p className="font-bold uppercase text-[11px]">{buyerName}</p>

                            <div className="relative h-16 w-full my-1 flex items-center justify-center">
                              {contract.buyerCompanySeal && (
                                <img
                                  src={contract.buyerCompanySeal}
                                  alt="Buyer Seal"
                                  className="absolute inset-0 m-auto max-h-16 max-w-[140px] object-contain opacity-85 pointer-events-none"
                                  style={{ mixBlendMode: "multiply" }}
                                />
                              )}
                              {contract.buyerSignature && (
                                <img
                                  src={contract.buyerSignature}
                                  alt="Buyer Signature"
                                  className="absolute inset-0 m-auto max-h-14 max-w-[140px] object-contain z-10 pointer-events-none"
                                  style={{ mixBlendMode: "multiply" }}
                                />
                              )}
                            </div>

                            {contract.buyerAuthorizedSignatory && (
                              <p className="uppercase text-[10px]">({contract.buyerAuthorizedSignatory})</p>
                            )}
                            <div className="border-t border-black mt-1 pt-1 text-[10px] text-gray-500 uppercase">
                              Authorized Signatory
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="mt-6 pt-2 border-t-2 border-[#8dc63f] text-center">
                      <p className="text-[11px] text-gray-500 font-medium">www.agricomimpex.com</p>
                    </div>
                  </div>

                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}