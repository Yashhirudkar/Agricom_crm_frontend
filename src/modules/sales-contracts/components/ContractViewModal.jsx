"use client";
import React, { useState, useEffect } from "react";
import { X, Printer, Loader2, AlertCircle } from "lucide-react";
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
  <div className={`flex mb-4 ${className}`}>
    <div className="w-[18%] font-bold uppercase pr-4 flex-shrink-0">{label}</div>
    <div className="w-[82%] uppercase leading-snug">{children}</div>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────

export default function ContractViewModal({ contractId, onClose }) {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const shipmentLine =
    contract.shipments?.length > 0
      ? contract.shipments.map((s) => `${formatDate(s.shipmentDate)} SHIPMENT`).join(", ")
      : "—";

  const documentLine =
    contract.documents?.length > 0
      ? contract.documents.map((d) => d.tradeDocument?.name).filter(Boolean).join(", ")
      : "";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-start bg-slate-200/90 overflow-y-auto print:bg-transparent print:overflow-visible print:static print:block">

      {/* Print page rules */}
      <style jsx global>{`
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
        <button
          onClick={() => window.print()}
          className="h-10 w-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 text-[#007aff] transition-colors"
          title="Print / PDF Export"
        >
          <Printer className="h-5 w-5" />
        </button>
        <button
          onClick={onClose}
          className="h-10 w-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-700 transition-colors"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* A4 Paper */}
      <div
        id="contract-print-area"
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
                          <p className="font-bold uppercase text-[11px]">{sellerName}</p>

                          <div className="relative h-16 w-full my-1 flex items-center justify-center">
                            {contract.sellerCompanySeal && (
                              <img
                                src={contract.sellerCompanySeal}
                                alt="Seller Seal"
                                className="absolute inset-0 m-auto max-h-16 max-w-[140px] object-contain opacity-85 pointer-events-none"
                                style={{ mixBlendMode: "multiply" }}
                              />
                            )}
                            {contract.sellerSignature && (
                              <img
                                src={contract.sellerSignature}
                                alt="Seller Signature"
                                className="absolute inset-0 m-auto max-h-14 max-w-[140px] object-contain z-10 pointer-events-none"
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
                    <p className="text-[11px] text-gray-500 font-medium font-sans">www.agricomimpex.com</p>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>

          <tbody>
            <tr>
              <td>
                <div className="p-8 md:p-10 print:p-0 text-slate-900 font-sans">

                  {/* ── LETTERHEAD ───────────────────────────────────────── */}
                  <div className="flex justify-between items-center print-avoid-break">
                    <div>
                      <img src="/agri_logo.png" alt="Agricom Impex" className="h-30 object-contain" />
                    </div>
                    <div className="text-right text-[10px] text-gray-600 leading-tight">
                      <h1 className="text-base font-bold text-gray-500 uppercase mb-0.5">Agricom Impex</h1>
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
                            <td className="pr-2 text-slate-500 font-semibold uppercase">Reference No:</td>
                            <td className="font-bold text-slate-900 uppercase">{contract.contractNumber || "—"}</td>
                          </tr>
                          <tr>
                            <td className="pr-2 text-slate-500 font-semibold uppercase">Contract Date:</td>
                            <td className="font-bold text-slate-900">{formatDate(contract.contractDate)}</td>
                          </tr>
                          <tr>
                            <td className="pr-2 text-slate-500 font-semibold uppercase">Financial Year:</td>
                            <td className="font-bold text-slate-900 uppercase">{contract.financialYear || "—"}</td>
                          </tr>
                          <tr>
                            <td className="pr-2 text-slate-500 font-semibold uppercase">Created On:</td>
                            <td className="font-bold text-slate-900">{formatDate(contract.createdAt)}</td>
                          </tr>
                          {contract.status && (
                            <tr>
                              <td className="pr-2 text-slate-500 font-semibold uppercase">Status:</td>
                              <td className="font-bold text-slate-900 uppercase">{contract.status}</td>
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
                        {contract.seller ? partnerAddress(contract.seller) : contract.sellerCompanyName?.toUpperCase()}
                      </Row>
                    )}

                    {/* BUYER */}
                    {hasBuyer && (
                      <Row label="Buyer">
                        {contract.buyer ? partnerAddress(contract.buyer) : contract.buyerCompanyName?.toUpperCase()}
                      </Row>
                    )}

                    {/* BROKER */}
                    {hasBroker && (
                      <Row label="Broker" className="mb-8">
                        {partnerAddress(contract.broker)}
                      </Row>
                    )}

                    <div className={hasBroker ? "" : "mb-4"} />

                    {/* ORIGIN */}
                    {(contract.originLocationName || contract.portOfLoading) && (
                      <Row label="Origin Port">
                        {(contract.originLocationName || contract.portOfLoading).toUpperCase()}
                        {contract.originCountry?.name ? `   ${contract.originCountry.name.toUpperCase()}` : ""}
                      </Row>
                    )}

                    {/* DESTINATION */}
                    {(contract.destinationLocationName || contract.portOfDischarge) && (
                      <Row label="Dest. Port">
                        {(contract.destinationLocationName || contract.portOfDischarge).toUpperCase()}
                        {contract.destinationCountry?.name ? ` ${contract.destinationCountry.name.toUpperCase()}` : ""}
                      </Row>
                    )}

                    {/* SHIPMENT TYPE */}
                    {contract.shipmentType?.name && (
                      <Row label="Shipment Type">
                        {contract.shipmentType.name.toUpperCase()}
                      </Row>
                    )}

                    <div className="mb-4" />

                    {/* ── PRODUCT ITEMS ───────────────────────────────────── */}
                    {contract.items?.map((item, idx) => (
                      <React.Fragment key={item.id || idx}>
                        <Row label="Product">
                          {item.product?.name || "—"}
                        </Row>

                        <Row label="Quality">
                          {[
                            item.product?.qualitySubType,
                            item.product?.specification || item.quality,
                          ].filter(Boolean).join(" - ") || "—"}
                        </Row>

                        <Row label="Quantity">
                          {Number(item.quantity).toLocaleString("en-IN")} MT +/- 5%
                        </Row>

                        <Row label="Packing">
                          {[
                            item.packingType?.name,
                            item.bagType?.name ? `OF EACH ${item.bagType.name}` : null,
                            item.bagSpecification?.name ? `(${item.bagSpecification.name})` : null,
                          ].filter(Boolean).join(" ") || "—"}
                        </Row>

                        <Row label="Marking">
                          {item.marking || "NONE"}
                        </Row>

                        <Row label="Price">
                          {contract.currencyCode}{" "}
                          {Number(item.unitPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })} PER MT{" "}
                          {incotermLabel(contract)}
                        </Row>
                      </React.Fragment>
                    ))}

                    {/* PAYMENT */}
                    <Row label="Payment">
                      <div>{contract.paymentTerm?.name || "—"}</div>
                      <div className="mt-3">
                        IN THE EVENT OF DELAY IN PAYMENT FOR THE GOODS BEYOND THE TERMS SPECIFIED IN THIS CONTRACT, THE BUYER SHALL BE ENTITLED TO A PENALTY, WHICH SHALL BE CALCULATED AT 0.1% OF THE VALUE OF THE COMMERCIAL INVOICE FOR EACH DAY OF DELAY
                      </div>
                    </Row>

                    {/* SHIPMENT */}
                    <Row label="Shipment">
                      {shipmentLine}
                    </Row>

                    {/* DOCUMENTS */}
                    {contract.documents?.length > 0 && (
                      <Row label="Documents" className="leading-relaxed">
                        {documentLine}
                      </Row>
                    )}

                    {/* NOTE / REMARKS */}
                    {contract.remarks && (
                      <Row label="Note" className="mb-6">
                        <span className="whitespace-pre-wrap leading-relaxed">{contract.remarks}</span>
                      </Row>
                    )}

                    {/* ══ PAGE BREAK AFTER NOTE — Terms etc. go to page 2 ══ */}
                    {(contract.terms?.length > 0 ||
                      contract.otherConditions?.length > 0 ||
                      contract.disputeResolution ||
                      contract.forceMajeure) && (
                        <div className="print-page-break-before" />
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
                            <p className="font-bold uppercase text-[11px]">{sellerName}</p>

                            <div className="relative h-16 w-full my-1 flex items-center justify-center">
                              {contract.sellerCompanySeal && (
                                <img
                                  src={contract.sellerCompanySeal}
                                  alt="Seller Seal"
                                  className="absolute inset-0 m-auto max-h-16 max-w-[140px] object-contain opacity-85 pointer-events-none"
                                  style={{ mixBlendMode: "multiply" }}
                                />
                              )}
                              {contract.sellerSignature && (
                                <img
                                  src={contract.sellerSignature}
                                  alt="Seller Signature"
                                  className="absolute inset-0 m-auto max-h-14 max-w-[140px] object-contain z-10 pointer-events-none"
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
                      <p className="text-[11px] text-gray-500 font-medium font-sans">www.agricomimpex.com</p>
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