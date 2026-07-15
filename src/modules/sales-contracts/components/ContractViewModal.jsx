"use client";
import React, { useState, useEffect } from "react";
import { X, Printer, Loader2, AlertCircle } from "lucide-react";
import { salesContractApi } from "../services/salesContractApi";
import { currencies } from "@/constants/currenciesData";

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
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [contractId]);

  const handlePrint = () => {
    window.print();
  };

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

  const currencySymbol = currencies[contract.currencyCode]?.symbol || contract.currencyCode;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });
  };

  const PartyDetails = ({ title, party, isSeller = false }) => {
    if (!party && !isSeller) return null;
    const name = party?.entityName || party?.name || "Agricom Enterprise Ltd.";
    const address = party?.address || "123 Business Avenue, Suite 100";
    const city = party?.city || "Mumbai";
    const country = party?.country?.name || "India";
    const email = party?.contactEmail || party?.contacts?.[0]?.email || "contact@agricom.com";
    const phone = party?.contacts?.[0]?.phone || "+91 9876543210";
    const gst = party?.taxId || "27AADCA1234E1Z5";
    const iec = party?.panNo || "0389012345";

    return (
      <div className="flex flex-col text-sm">
        <h4 className="font-bold uppercase tracking-wide mb-1.5 text-[#007aff] text-xs border-b border-[#007aff]/30 pb-1">{title}</h4>
        <div className="text-slate-700 leading-tight space-y-0.5">
          <p className="font-bold text-sm text-slate-900">{name}</p>
          <p className="text-xs">{address}</p>
          <p className="text-xs">{city}, {country}</p>
          <p className="mt-1.5 text-xs"><span className="font-semibold text-slate-900">Phone:</span> {phone}</p>
          <p className="text-xs"><span className="font-semibold text-slate-900">Email:</span> {email}</p>
          <div className="flex gap-4 mt-1.5 pt-1.5 border-t border-slate-200 text-xs">
            <p><span className="font-semibold text-slate-900">GSTIN:</span> {gst}</p>
            <p><span className="font-semibold text-slate-900">IEC:</span> {iec}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-start bg-slate-200/90 overflow-y-auto print:bg-transparent print:overflow-visible print:static print:block">

      {/* Print-only page rules — controls physical page size & margins */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden;
          }
          #contract-print-area, #contract-print-area * {
            visibility: visible;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #contract-print-area {
            position: absolute !important;
            left: 0;
            top: 0;
            width: 100% !important;
            min-height: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
          }
          .print-avoid-break {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          table {
            break-inside: auto;
          }
          tr {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }
        }
      `}</style>

      {/* Floating Action Buttons - Hidden on Print */}
      <div className="fixed top-6 right-6 flex flex-col gap-2 z-[110] print:hidden">
        <button
          onClick={handlePrint}
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

      {/* A4 Paper Container */}
      <div id="contract-print-area" className="my-8 bg-white w-full max-w-[1024px] min-h-[1448px] h-fit rounded-2xl shadow-2xl print:my-0 print:shadow-none print:max-w-none print:w-full">
        <div className="p-8 md:p-10 print:p-0 text-slate-900 font-sans">

          {/* LETTERHEAD — original brand colors, not the blue accent */}
          <div className="flex justify-between items-center  print-avoid-break">
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
          <div className="border-b border-gray-300 mb-4"></div>

          {/* TITLE & META */}
          <div className="flex justify-between items-start mb-4 print-avoid-break">
            <div className="w-1/4"></div>
            <div className="text-center w-2/4">
              <h2 className="text-lg font-bold uppercase tracking-widest mb-1 text-slate-900">Sales Contract</h2>
              <div className="flex items-center justify-center gap-2">
                {/* <p className="text-base font-bold text-[#007aff]">{contract.contractNumber}</p> */}
                {/* <span className="px-1.5 py-0.5 rounded-md border border-[#007aff] text-[#007aff] text-[9px] font-bold uppercase">{contract.status}</span> */}
              </div>
            </div>
            <div className="text-right text-[10px] w-1/4">
              <table className="ml-auto">
                <tbody>
                  <tr>
                    <td className="pr-2 text-slate-500  font-semibold">Reference Number:</td>
                    <td className="font-bold text-slate-900 justify-items-start">{contract.contractNumber || "—"}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 text-slate-500  font-semibold">Contract Date:</td>
                    <td className="font-bold text-slate-900 text-right">{formatDate(contract.contractDate)}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 text-slate-500 font-semibold">Financial Year:</td>
                    <td className="font-bold text-slate-900">{contract.financialYear?.year || contract.financialYear?.displayName || "—"}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 text-slate-500 font-semibold">Created On:</td>
                    <td className="font-bold text-slate-900">{formatDate(contract.createdAt)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* PARTIES */}
          <div className="grid grid-cols-2 gap-10 mb-6 print-avoid-break">
            <PartyDetails title="Buyer" party={contract.buyer} />
            <PartyDetails title="Seller" party={contract.seller} isSeller={true} />
          </div>

          {contract.broker && (
            <div className="mb-6 p-3 rounded-xl border border-slate-200 bg-slate-50/60 print-avoid-break">
              <PartyDetails title="Broker" party={contract.broker} />
            </div>
          )}

          {/* COMMERCIAL TERMS */}
          <div className="mb-6 print-avoid-break">
            <h3 className="text-xs font-bold bg-[#007aff] text-white py-1.5 px-3 rounded-t-lg uppercase tracking-wider">Commercial Terms</h3>
            <table className="w-full text-xs border-collapse border border-slate-200 rounded-b-lg overflow-hidden">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="w-1/4 p-1.5 bg-slate-50 font-semibold border-r border-slate-200 text-slate-600">Contract Type</td>
                  <td className="w-1/4 p-1.5 border-r border-slate-200">{contract.contractType || "Export"}</td>
                  <td className="w-1/4 p-1.5 bg-slate-50 font-semibold border-r border-slate-200 text-slate-600">Currency</td>
                  <td className="w-1/4 p-1.5">{contract.currencyCode || "—"}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="w-1/4 p-1.5 bg-slate-50 font-semibold border-r border-slate-200 text-slate-600">Origin Country</td>
                  <td className="w-1/4 p-1.5 border-r border-slate-200">{contract.originCountry?.name || "—"}</td>
                  <td className="w-1/4 p-1.5 bg-slate-50 font-semibold border-r border-slate-200 text-slate-600">Destination Country</td>
                  <td className="w-1/4 p-1.5">{contract.destinationCountry?.name || "—"}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="w-1/4 p-1.5 bg-slate-50 font-semibold border-r border-slate-200 text-slate-600">Port of Loading</td>
                  <td className="w-1/4 p-1.5 border-r border-slate-200">{contract.portOfLoading || "—"}</td>
                  <td className="w-1/4 p-1.5 bg-slate-50 font-semibold border-r border-slate-200 text-slate-600">Port of Discharge</td>
                  <td className="w-1/4 p-1.5">{contract.portOfDischarge || "—"}</td>
                </tr>
                <tr>
                  <td className="w-1/4 p-1.5 bg-slate-50 font-semibold border-r border-slate-200 text-slate-600">Shipment Type</td>
                  <td className="w-1/4 p-1.5 border-r border-slate-200">{contract.shipmentType?.name || "—"}</td>
                  <td className="w-1/4 p-1.5 bg-slate-50 font-semibold border-r border-slate-200 text-slate-600">Payment Terms</td>
                  <td className="w-1/4 p-1.5 font-bold text-[#007aff]">{contract.paymentTerm?.name || "—"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PRODUCTS */}
          <div className="mb-6">
            <h3 className="text-xs font-bold bg-[#007aff] text-white py-1.5 px-3 rounded-t-lg uppercase tracking-wider">Product Details</h3>
            <table className="w-full text-xs border-collapse border border-slate-200 rounded-b-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-300">
                  <th className="p-1.5 border-r border-slate-200 text-center w-10 text-slate-600">#</th>
                  <th className="p-1.5 border-r border-slate-200 text-left text-slate-600">Product</th>
                  <th className="p-1.5 border-r border-slate-200 text-left text-slate-600">Packing</th>
                  <th className="p-1.5 border-r border-slate-200 text-left text-slate-600">Bag Type</th>
                  <th className="p-1.5 border-r border-slate-200 text-right w-20 text-slate-600">Qty (MT)</th>
                  <th className="p-1.5 border-r border-slate-200 text-right w-28 text-slate-600">Unit Price</th>
                  <th className="p-1.5 border-r border-slate-200 text-right w-32 text-slate-600">Amount</th>
                  <th className="p-1.5 text-left text-slate-600">Marking</th>
                </tr>
              </thead>
              <tbody>
                {contract.items?.map((item, idx) => (
                  <tr key={item.id || idx} className="border-b border-slate-200 last:border-b-0 even:bg-slate-50/60">
                    <td className="p-1.5 border-r border-slate-200 text-center">{idx + 1}</td>
                    <td className="p-1.5 border-r border-slate-200 font-bold text-slate-900">{item.product?.name || "—"}</td>
                    <td className="p-1.5 border-r border-slate-200">{item.packingType?.name || "—"}</td>
                    <td className="p-1.5 border-r border-slate-200 text-[10px]">{item.bagType?.name || "—"}</td>
                    <td className="p-1.5 border-r border-slate-200 text-right font-semibold">{Number(item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td className="p-1.5 border-r border-slate-200 text-right">{currencySymbol} {Number(item.unitPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td className="p-1.5 border-r border-slate-200 text-right font-bold text-[#007aff]">{currencySymbol} {Number(item.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td className="p-1.5 text-[10px] truncate max-w-[120px]">{item.remarks || "—"}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 bg-slate-50">
                  <td colSpan={4} className="p-1.5 border-r border-slate-200 text-right font-bold uppercase text-slate-600">Grand Total</td>
                  <td className="p-1.5 border-r border-slate-200 text-right font-black">{Number(contract.totalQuantity || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  <td className="p-1.5 border-r border-slate-200 text-right"></td>
                  <td className="p-1.5 border-r border-slate-200 text-right font-black text-sm text-[#007aff]">{currencySymbol} {Number(contract.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  <td className="p-1.5"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* SHIPMENT SCHEDULE */}
          {contract.shipments && contract.shipments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold bg-[#007aff] text-white py-1.5 px-3 rounded-t-lg uppercase tracking-wider">Shipment Schedule</h3>
              <table className="w-full text-xs border-collapse border border-slate-200 rounded-b-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300">
                    <th className="p-1.5 border-r border-slate-200 text-left w-20 text-slate-600">Shipment</th>
                    <th className="p-1.5 border-r border-slate-200 text-left text-slate-600">Date</th>
                    <th className="p-1.5 border-r border-slate-200 text-right text-slate-600">Qty (MT)</th>
                    <th className="p-1.5 border-r border-slate-200 text-right text-slate-600">Containers</th>
                    <th className="p-1.5 border-r border-slate-200 text-right text-slate-600">Rate/MT</th>
                    <th className="p-1.5 border-r border-slate-200 text-right text-slate-600">Freight</th>
                    <th className="p-1.5 text-left text-slate-600">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {contract.shipments.map((s, idx) => (
                    <tr key={s.id || idx} className="border-b border-slate-200 last:border-b-0 even:bg-slate-50/60">
                      <td className="p-1.5 border-r border-slate-200 font-semibold text-[#007aff]">#{idx + 1}</td>
                      <td className="p-1.5 border-r border-slate-200">{formatDate(s.shipmentDate)}</td>
                      <td className="p-1.5 border-r border-slate-200 text-right font-semibold">{Number(s.quantity).toLocaleString("en-IN")}</td>
                      <td className="p-1.5 border-r border-slate-200 text-right">{s.noOfContainers || "—"}</td>
                      <td className="p-1.5 border-r border-slate-200 text-right">{s.ratePerMt ? `${s.currencyCode || currencySymbol} ${s.ratePerMt}` : "—"}</td>
                      <td className="p-1.5 border-r border-slate-200 text-right">{s.freight || "—"}</td>
                      <td className="p-1.5 text-[10px]">{s.remarks || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TRADE DOCUMENTS */}
          {contract.documents && contract.documents.length > 0 && (
            <div className="mb-6 print-avoid-break">
              <h3 className="text-xs font-bold bg-[#007aff] text-white py-1.5 px-3 rounded-t-lg uppercase tracking-wider">Required Trade Documents</h3>
              <div className="border border-slate-200 rounded-b-lg p-3 grid grid-cols-2 gap-y-1.5">
                {contract.documents.map((doc, idx) => (
                  <div key={doc.id || idx} className="flex items-center gap-2 text-xs font-semibold">
                    <span className="text-[#007aff]">✓</span>
                    <span>{doc.tradeDocument?.name || "Document"}</span>
                    {doc.isMandatory && <span className="ml-2 text-[9px] bg-[#007aff] text-white px-1.5 py-0.5 rounded-full uppercase">Mandatory</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REMARKS */}
          {contract.remarks && (
            <div className="mb-10 print-avoid-break">
              <h3 className="text-xs font-bold bg-[#007aff] text-white py-1.5 px-3 rounded-t-lg uppercase tracking-wider">Remarks / Conditions</h3>
              <div className="border border-slate-200 rounded-b-lg p-3 min-h-[70px] text-xs whitespace-pre-wrap">
                {contract.remarks}
              </div>
            </div>
          )}

          {/* TERMS & CONDITIONS */}
          <div className="mb-8 print-avoid-break">
            <h3 className="text-xs font-bold bg-[#007aff] text-white py-1.5 px-3 rounded-t-lg uppercase tracking-wider">Terms & Conditions</h3>
            <ul className="list-disc pl-5 mt-3 text-[11px] text-slate-700 space-y-1">
              <li>Goods once dispatched cannot be cancelled.</li>
              <li>Subject to Nagpur jurisdiction.</li>
              <li>Payment shall follow agreed payment terms.</li>
              <li>Quality disputes must be reported within agreed timeline.</li>
              <li>All export documents shall be issued after payment compliance.</li>
            </ul>
          </div>

          {/* SIGNATURES */}
          <div className="mt-12 pt-6 flex justify-between items-end print-avoid-break">
            <div className="text-center w-44">
              <div className="border-b border-slate-300 mb-1.5"></div>
              <p className="text-xs font-bold uppercase text-slate-700">Prepared By</p>
            </div>
            <div className="text-center w-44">
              <div className="border-b border-slate-300 mb-1.5"></div>
              <p className="text-xs font-bold uppercase text-slate-700">Verified By</p>
            </div>
            <div className="text-center w-56">
              <div className="border-b border-slate-300 mb-1.5"></div>
              <p className="text-xs font-bold uppercase text-[#007aff]">Authorized Signatory</p>
              <p className="text-[10px] text-slate-500 mt-0.5">For Agricom Impex</p>
            </div>
          </div>

          {/* FOOTER — original letterhead green, restored */}
          <div className="mt-12 pt-3 border-t-2 border-[#8dc63f] text-center print-avoid-break">
            <p className="text-[11px] text-gray-500 font-medium">www.agricomimpex.com</p>
          </div>

        </div>
      </div>
    </div>
  );
}