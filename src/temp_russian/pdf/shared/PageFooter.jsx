import React from "react";

/**
 * PageFooter — Repeating footer for every printable contract page.
 * Shows Seller / Buyer label, stamp (if uploaded), signature (if uploaded),
 * underline, and company name.
 *
 * Props:
 *  - contract: the full contract object
 *  - variant: 'standard' | 'russian'
 *  - positionStyle: override the position CSS
 */
export default function PageFooter({ contract, variant = "standard", positionStyle }) {
  const sellerName = (contract.sellerCompanyName || contract.seller?.entityName || "").toUpperCase();
  const buyerName = (contract.buyerCompanyName || contract.buyer?.entityName || "").toUpperCase();

  const hasSeller = !!(contract.seller || contract.sellerCompanyName);
  const hasBuyer = !!(contract.buyer || contract.buyerCompanyName);

  if (!hasSeller && !hasBuyer) return null;

  const sellerLabel = variant === "russian"
    ? <span className="block">Продавец / Seller:</span>
    : <span className="block">Seller:</span>;

  const buyerLabel = variant === "russian"
    ? <span className="block">Покупатель / Buyer:</span>
    : <span className="block">Buyer:</span>;

  const resolvedPositionStyle = positionStyle ?? {};

  /** Renders a stamp+signature block that overlaps the line below */
  const SealBlock = ({ seal, signature, name, label }) => (
    <div className="w-[45%]">
      <p className="font-bold mb-1" style={{ fontSize: "10px" }}>
        {label}
      </p>

      {/* Stamp + Signature container — overlaps the line via negative marginBottom */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: "250px",
          height: "140px",
          marginBottom: "-22px",
          background: "transparent",
          isolation: "isolate",
          zIndex: 2,
          position: "relative",
        }}
      >
        {seal && (
          <img
            src={seal}
            alt="Seal"
            className="absolute object-contain"
            style={{
              width: "250px",
              height: "140px",
              zIndex: 1,
              mixBlendMode: "multiply",
              filter: "contrast(1.5) brightness(1.0) saturate(1.3)",
            }}
          />
        )}
        {signature && (
          <img
            src={signature}
            alt="Signature"
            className="absolute object-contain"
            style={{
              width: "250px",
              height: "140px",
              bottom: "0px",
              zIndex: 3,
              mixBlendMode: "multiply",
              filter: "contrast(1.5) brightness(1.0)",
            }}
          />
        )}
      </div>

      {/* Signature underline — always visible above stamp */}
      <div style={{ borderTop: "1px solid #000", width: "100%", marginBottom: "2px", position: "relative", zIndex: 10 }} />
      <p className="uppercase font-medium" style={{ fontSize: "9px", position: "relative", zIndex: 10 }}>
        {name}
      </p>
    </div>
  );

  return (
    <div
      className="flex justify-between items-start w-full mt-auto pt-5"
      style={{
        ...resolvedPositionStyle,
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      {hasSeller && (
        <SealBlock
          seal={contract.sellerCompanySeal}
          signature={contract.sellerSignature}
          name={sellerName}
          label={sellerLabel}
        />
      )}
      {hasBuyer && (
        <SealBlock
          seal={contract.buyerCompanySeal}
          signature={contract.buyerSignature}
          name={buyerName}
          label={buyerLabel}
        />
      )}
    </div>
  );
}
