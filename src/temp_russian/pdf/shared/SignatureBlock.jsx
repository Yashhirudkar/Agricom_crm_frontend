import React from "react";

/**
 * SignatureBlock — Seller / Broker / Buyer signature + seal
 *
 * Props:
 *  - contract: the full contract object
 *  - variant: 'standard' | 'russian'
 *    - 'standard': shows "Accepted By Seller" / "Accepted By Buyer" labels (existing layout)
 *    - 'russian':  shows "ПРОДАВЕЦ / SELLER" / "ПОКУПАТЕЛЬ / BUYER" bilingual labels
 */
export default function SignatureBlock({ contract, variant = "standard" }) {
  const sellerName = (contract.sellerCompanyName || contract.seller?.entityName || "").toUpperCase();
  const buyerName = (contract.buyerCompanyName || contract.buyer?.entityName || "").toUpperCase();
  const brokerName = contract.broker?.entityName?.toUpperCase() || "";

  const hasSeller = !!(contract.seller || contract.sellerCompanyName);
  const hasBuyer = !!(contract.buyer || contract.buyerCompanyName);
  const hasBroker = !!contract.broker;

  if (!hasSeller && !hasBuyer && !hasBroker) return null;

  const sellerLabel =
    variant === "russian" ? (
      <>
        <span className="text-[10px] block">ПРОДАВЕЦ</span>
        <span className="text-[10px] block">SELLER</span>
      </>
    ) : (
      <span className="text-[11px]">Accepted By Seller</span>
    );

  const buyerLabel =
    variant === "russian" ? (
      <>
        <span className="text-[10px] block">ПОКУПАТЕЛЬ</span>
        <span className="text-[10px] block">BUYER</span>
      </>
    ) : (
      <span className="text-[11px]">Accepted By Buyer</span>
    );

  return (
    <div
      className="flex items-start justify-between"
      style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
    >
      {/* SELLER */}
      {hasSeller && (
        <div className="text-center w-64 relative">
          <p className="font-bold uppercase mb-1">{sellerLabel}</p>
          {variant !== "russian" && (
            <p className="font-bold uppercase text-[11px]">{sellerName}</p>
          )}
          <div
            className="relative w-full my-1 flex items-center justify-center h-36"
            style={{ background: "transparent", isolation: "isolate" }}
          >
            {contract.sellerCompanySeal ? (
              <>
                <img
                  src={contract.sellerCompanySeal}
                  alt="Seller Seal"
                  className="absolute inset-0 m-auto max-h-36 max-w-[250px] object-contain opacity-100 pointer-events-none"
                  style={{ mixBlendMode: "multiply", filter: "contrast(1.5) brightness(1.0) saturate(1.3)" }}
                />
                {contract.sellerSignature && (
                  <img
                    src={contract.sellerSignature}
                    alt="Seller Signature"
                    className="absolute inset-0 m-auto max-h-36 max-w-[250px] object-contain z-10 pointer-events-none"
                    style={{ mixBlendMode: "multiply", filter: "contrast(1.5) brightness(1.0)" }}
                  />
                )}
              </>
            ) : contract.sellerSignature ? (
              <img
                src={contract.sellerSignature}
                alt="Seller Signature"
                className="absolute inset-0 m-auto max-h-36 max-w-[250px] object-contain z-10 pointer-events-none"
                style={{ mixBlendMode: "multiply", filter: "contrast(1.5) brightness(1.0)" }}
              />
            ) : null}
          </div>
          {contract.sellerAuthorizedSignatory && (
            <p className="uppercase text-[10px]">({contract.sellerAuthorizedSignatory})</p>
          )}
          {variant !== "russian" && (
            <div className="border-t border-black mt-1 pt-1 text-[10px] text-gray-500 uppercase">
              Authorized Signatory
            </div>
          )}
        </div>
      )}

      {/* BROKER */}
      {hasBroker && (
        <div className="text-center w-64 relative">
          <p className="font-bold uppercase mb-1 text-[11px]">Broker</p>
          <p className="font-bold uppercase text-[11px]">{brokerName}</p>
          <div className="h-28" />
          {variant !== "russian" && (
            <div className="border-t border-black mt-1 pt-1 text-[10px] text-gray-500 uppercase">
              Authorized Signatory
            </div>
          )}
        </div>
      )}

      {/* BUYER */}
      {hasBuyer && (
        <div className="text-center w-64 relative">
          <p className="font-bold uppercase mb-1">{buyerLabel}</p>
          {variant !== "russian" && (
            <p className="font-bold uppercase text-[11px]">{buyerName}</p>
          )}
          <div
            className="relative w-full my-1 flex items-center justify-center h-36"
            style={{ background: "transparent", isolation: "isolate" }}
          >
            {contract.buyerCompanySeal ? (
              <>
                <img
                  src={contract.buyerCompanySeal}
                  alt="Buyer Seal"
                  className="absolute inset-0 m-auto max-h-36 max-w-[250px] object-contain opacity-100 pointer-events-none"
                  style={{ mixBlendMode: "multiply", filter: "contrast(1.5) brightness(1.0) saturate(1.3)" }}
                />
                {contract.buyerSignature && (
                  <img
                    src={contract.buyerSignature}
                    alt="Buyer Signature"
                    className="absolute inset-0 m-auto max-h-36 max-w-[250px] object-contain z-10 pointer-events-none"
                    style={{ mixBlendMode: "multiply", filter: "contrast(1.5) brightness(1.0)" }}
                  />
                )}
              </>
            ) : contract.buyerSignature ? (
              <img
                src={contract.buyerSignature}
                alt="Buyer Signature"
                className="absolute inset-0 m-auto max-h-36 max-w-[250px] object-contain z-10 pointer-events-none"
                style={{ mixBlendMode: "multiply", filter: "contrast(1.5) brightness(1.0)" }}
              />
            ) : null}
          </div>
          {contract.buyerAuthorizedSignatory && (
            <p className="uppercase text-[10px]">({contract.buyerAuthorizedSignatory})</p>
          )}
          {variant !== "russian" && (
            <div className="border-t border-black mt-1 pt-1 text-[10px] text-gray-500 uppercase">
              Authorized Signatory
            </div>
          )}
        </div>
      )}
    </div>
  );
}
