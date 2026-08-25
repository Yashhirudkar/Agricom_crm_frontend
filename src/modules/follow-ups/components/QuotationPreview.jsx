import React from 'react';

/**
 * QuotationPreview
 *
 * PURE DISPLAY COMPONENT — no state, no API calls, no mutations.
 * Receives a fully-loaded quotation object and renders a data-driven HTML document.
 * Compatible with PDF, Print, and Email template rendering.
 *
 * @param {object} quotation - Fully-loaded quotation object
 */
const QuotationPreview = React.forwardRef(function QuotationPreview({ quotation }, ref) {
  if (!quotation) return null;

  // ─── Data Extraction & Fallback Binding ─────────────────────────────────────

  const rawItems = quotation.items || quotation.QuotationItems || quotation.quotationItems || quotation.item || [];
  const itemsList = Array.isArray(rawItems) ? rawItems : [rawItems];
  const item = itemsList[0] || quotation.quotationItem || {};

  const buyer = quotation.buyer || quotation.partner || {};
  const importer = quotation.importer || null;
  const product = item.product || quotation.product || {};
  const packaging = item.bagSpecification || quotation.bagSpecification || null;
  const packingType = item.packingType || packaging?.packingType || quotation.packingType || null;
  const bagType = packaging?.bagType || null;

  // 1. Partner Role & Names
  const partnerRole =
    buyer?.partnerRole?.name ||
    buyer?.role?.name ||
    buyer?.partnerRoleName ||
    buyer?.roleName ||
    quotation?.partnerRoleName ||
    'Not Specified';

  const buyerName =
    buyer?.entityName ||
    buyer?.name ||
    (typeof quotation.buyer === 'string' ? quotation.buyer : null) ||
    quotation.buyerName ||
    quotation.partner?.entityName ||
    quotation.partnerName ||
    'Not Specified';

  const importerName =
    importer?.entityName ||
    importer?.name ||
    (typeof quotation.importer === 'string' ? quotation.importer : null) ||
    quotation.importerName ||
    null;

  const destinationCountry = quotation.destinationCountry || buyer.country || 'Not Specified';

  // 2. Product Information
  const productName = product?.name || item.productName || quotation.productName || 'Not Specified';
  const subTypeSpec = item.subTypeSpec || product?.qualitySubType || 'Not Specified';

  let packingTypeDisplay = 'Not Specified';
  if (packaging) {
    const parts = [
      bagType?.name,
      packaging.netWeight ? `${packaging.netWeight} KG Net` : null,
      packaging.grossWeight ? `${packaging.grossWeight} KG Gross` : null,
    ].filter(Boolean);
    if (parts.length > 0) {
      packingTypeDisplay = parts.join(' / ');
    }
  }
  if (packingTypeDisplay === 'Not Specified') {
    if (packingType?.name) {
      packingTypeDisplay = packingType.name;
    } else if (item.packingTypeName) {
      packingTypeDisplay = item.packingTypeName;
    } else if (item.packingType && typeof item.packingType === 'string') {
      packingTypeDisplay = item.packingType;
    }
  }

  // Purity
  let purityDisplay = 'Not Specified';
  if (item.purity) {
    const pStr = String(item.purity).trim();
    purityDisplay = pStr.endsWith('%') ? pStr : `${pStr}%`;
  }

  // 3. Pricing
  const rawPrice = item.offeredPrice ?? quotation.offeredPrice ?? quotation.price;
  const parsedPrice = parseFloat(rawPrice);
  const formattedPrice = isNaN(parsedPrice)
    ? '0.00'
    : parsedPrice.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  const currencyCode = quotation.currencyCode || item.currencyCode || 'USD';
  const priceDisplay = `${formattedPrice} ${currencyCode} / MT`;

  // 4. Header Date
  const formattedDate = quotation.generatedAt
    ? new Date(quotation.generatedAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : new Date(quotation.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div ref={ref} className="quotation-preview-root">
      <div
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          maxWidth: '680px',
          margin: '0 auto',
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}
      >
        {/* Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)',
            padding: '24px 28px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div
              style={{
                color: '#60a5fa',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              Agricom Impex
            </div>
            <div style={{ color: '#ffffff', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Price Quotation
            </div>
            <div style={{ color: '#93c5fd', fontSize: '11px', marginTop: '4px' }}>
              Valid for 7 days from date of issue
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                background: 'rgba(96,165,250,0.15)',
                border: '1px solid rgba(96,165,250,0.3)',
                borderRadius: '10px',
                padding: '10px 16px',
              }}
            >
              <div
                style={{
                  color: '#93c5fd',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                Quotation No.
              </div>
              <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: 800, marginTop: '2px', letterSpacing: '0.5px' }}>
                {quotation.quotationNumber || 'AQ-000000-000000'}
              </div>
            </div>
            <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '8px' }}>
              Date: {formattedDate}
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div style={{ padding: '0 28px 28px' }}>

          {/* Section 1: Party Details */}
          <Section title="PARTY DETAILS">
            <Row label="Partner Role" value={partnerRole} />
            <Row label="Buyer" value={buyerName} bold />
            {importerName && <Row label="Importer" value={importerName} />}
            <Row label="Destination" value={destinationCountry} />
          </Section>

          <Divider />

          {/* Section 2: Product Details */}
          <Section title="PRODUCT DETAILS">
            <Row label="Product" value={productName} bold />
            <Row label="Sub Type / Spec" value={subTypeSpec} />
            <Row label="Packing Type" value={packingTypeDisplay} />
            <Row label="Purity" value={purityDisplay} />
          </Section>

          <Divider />

          {/* Section 3: Pricing */}
          <Section title="PRICING">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 700 }}>Price We Offer</div>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.5px',
                }}
              >
                {priceDisplay}
              </div>
            </div>
          </Section>

          {/* Footer & Authorized Signatory */}
          <div
            style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              This quotation is subject to availability and market conditions.
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  borderTop: '1.5px solid #0f172a',
                  paddingTop: '6px',
                  marginTop: '32px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#0f172a',
                  letterSpacing: '0.5px',
                }}
              >
                Authorized Signatory
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                Agricom Impex
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
});

// ─── Pure Layout Sub-components ───────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div style={{ paddingTop: '20px', paddingBottom: '6px' }}>
      <div
        style={{
          fontSize: '11px',
          fontWeight: 800,
          color: '#4f46e5',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>{title}</span>
        <div style={{ flex: 1, height: '1px', background: '#e0e7ff' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, bold = false }) {
  const isNotSpecified = value === 'Not Specified';
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        paddingBottom: '2px',
      }}
    >
      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, minWidth: '150px' }}>
        {label}
      </span>
      <span
        style={{
          fontSize: '12px',
          color: isNotSpecified ? '#94a3b8' : bold ? '#0f172a' : '#1e293b',
          fontWeight: bold ? 700 : isNotSpecified ? 400 : 500,
          fontStyle: isNotSpecified ? 'italic' : 'normal',
          textAlign: 'right',
          maxWidth: '400px',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0 0' }} />;
}

export default QuotationPreview;
