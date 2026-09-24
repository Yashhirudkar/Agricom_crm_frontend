import React from "react";
import ContractHeader from "../../shared/ContractHeader";
import SignatureBlock from "../../shared/SignatureBlock";
import { formatDate, partnerAddress, incotermLabel, getShipmentPeriodText } from "../../shared/helpers";
import RichTextEditor from "@/components/editor/RichTextEditor";

// ─── Row component ────────────────────────────────────────────────────────────
const Row = ({ label, children, className = "" }) => (
  <div className={`flex mb-4 print-avoid-break ${className}`}>
    <div className="w-[18%] font-bold uppercase pr-4 flex-shrink-0">{label}</div>
    <div className="w-[82%] uppercase leading-snug">{children}</div>
  </div>
);

// ─── StandardContract ─────────────────────────────────────────────────────────
/**
 * India Standard contract template.
 * This is the original layout — zero visual changes from before the template system.
 *
 * Props:
 *  - contract: full contract object from the API
 *  - renderValue(key, defaultValue): handles printOverrides / isCustomizing mode
 */
export default function StandardContract({ contract, renderValue, isCustomizing }) {
  const hasBroker = !!contract.broker;
  const hasSeller = !!(contract.seller || contract.sellerCompanyName);
  const hasBuyer = !!(contract.buyer || contract.buyerCompanyName);

  const sellerName = (contract.sellerCompanyName || contract.seller?.entityName || "").toUpperCase();
  const buyerName = (contract.buyerCompanyName || contract.buyer?.entityName || "").toUpperCase();
  const brokerName = contract.broker?.entityName?.toUpperCase() || "";

  const shipmentPeriod = getShipmentPeriodText(contract.shipments);
  const documentLine =
    contract.documents?.length > 0
      ? contract.documents.map((d) => d.tradeDocument?.name).filter(Boolean).join(", ")
      : "";

  return (
    <>
      {/* ── LETTERHEAD ───────────────────────────────────────── */}
      <ContractHeader />
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
                (typeof contract.originCountry === "object"
                  ? contract.originCountry?.name
                  : contract.originCountry
                )?.trim().toUpperCase(),
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
                (typeof contract.destinationCountry === "object"
                  ? contract.destinationCountry?.name
                  : contract.destinationCountry
                )?.trim().toUpperCase(),
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

        {/* ── PRODUCT ITEMS ──────────────────────────────── */}
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
              {renderValue(
                `price_${idx}`,
                `${contract.currencyCode} ${Number(item.unitPrice).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })} PER MT ${incotermLabel(contract)}`.toUpperCase()
              )}
            </Row>
          </React.Fragment>
        ))}

        {/* PAYMENT */}
        <Row label="Payment">
          {renderValue("payment", contract.paymentTerm?.name?.toUpperCase() || "—")}
          <div className="mt-3 text-[13px] text-black font-serif leading-snug">
            IN THE EVENT OF DELAY IN PAYMENT FOR THE GOODS BEYOND THE TERMS SPECIFIED IN THIS
            CONTRACT, THE BUYER SHALL BE ENTITLED TO A PENALTY, WHICH SHALL BE CALCULATED AT 0.1%
            OF THE VALUE OF THE COMMERCIAL INVOICE FOR EACH DAY OF DELAY
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
        <Row label="Note" className="mb-6">
          {renderValue("note", contract.remarks?.toUpperCase())}
        </Row>

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

        {/* ── ON-SCREEN Signature (hidden on print — tfoot handles print) ── */}
        <div className="print:hidden mt-16">
          <SignatureBlock contract={contract} variant="standard" />
          <div className="mt-6 pt-2 border-t-2 border-[#8dc63f] text-center">
            <p className="text-[11px] text-gray-500 font-medium">www.agricomimpex.com</p>
          </div>
        </div>
      </div>
    </>
  );
}
