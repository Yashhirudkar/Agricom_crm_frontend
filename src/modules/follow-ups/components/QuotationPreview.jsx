import React from 'react';
import { useSelector } from 'react-redux';
import { selectActiveCompany } from '@/store/slices/companyContextSlice';
import { numberToWords } from '@/lib/numberUtils';

/**
 * QuotationPreview
 *
 * PURE DISPLAY COMPONENT — data-driven HTML document.
 * Receives a fully-loaded quotation object and renders seller (company) and buyer details.
 * Compatible with PDF, Print, and Email template rendering.
 *
 * @param {object} quotation - Fully-loaded quotation object
 */
const QuotationPreview = React.forwardRef(function QuotationPreview({ quotation }, ref) {
  if (!quotation) return null;

  // ─── Company / Seller Details Extraction ────────────────────────────────────
  const activeCompany = useSelector(selectActiveCompany);
  const companyObj = quotation.company || quotation.sellerCompany || quotation.seller || activeCompany || {};

  const companyName =
    companyObj.legalName ||
    companyObj.name ||
    quotation.companyName ||
    quotation.sellerName ||
    'Agricom Impex';

  const buildCompanyAddress = () => {
    if (quotation.companyAddress || quotation.sellerAddress) {
      return quotation.companyAddress || quotation.sellerAddress;
    }
    const parts = [];
    if (companyObj.address && companyObj.address !== 'Not Set') {
      parts.push(companyObj.address);
    }
    const cityState = [
      companyObj.city && companyObj.city !== 'Not Set' ? companyObj.city : null,
      companyObj.state && companyObj.state !== 'Not Set' ? companyObj.state : null,
    ].filter(Boolean).join(', ');
    if (cityState) parts.push(cityState);

    const countryPin = [
      companyObj.country && companyObj.country !== 'Not Set' ? companyObj.country : null,
      companyObj.pincode && companyObj.pincode !== 'Not Set' ? companyObj.pincode : null,
    ].filter(Boolean).join(' - ');
    if (countryPin) parts.push(countryPin);

    if (parts.length > 0) {
      return parts.join('\n');
    }

    if (companyObj.description && companyObj.description !== 'Not Set' && !companyObj.description.includes('1.')) {
      return companyObj.description;
    }

    return '202, Amaltas apartment, Rajnagar\nNagpur (MH), India 440013';
  };

  const companyAddress = buildCompanyAddress();

  const companyRole =
    companyObj.role ||
    quotation.sellerRole ||
    'Supplier / Exporter';

  const companyEmail =
    companyObj.email && companyObj.email !== 'Not Set'
      ? companyObj.email
      : quotation.companyEmail || 'info@agricomimpex.com';

  const companyPhone =
    companyObj.phone && companyObj.phone !== 'Not Set'
      ? companyObj.phone
      : quotation.companyPhone || '+91 712 2591130 / 34';

  // ─── Data Extraction & Fallback Binding ─────────────────────────────────────

  const rawItems = quotation.items || quotation.QuotationItems || quotation.quotationItems || quotation.item || [];
  const itemsList = Array.isArray(rawItems) && rawItems.length > 0 ? rawItems : [{}];
  // If no items exist, use the main quotation object as fallback for item details
  const fallbackItem = itemsList[0] || quotation.quotationItem || {};

  const buyer = quotation.buyer || quotation.partner || {};
  const importer = quotation.importer || null;

  // 1. Partner Role & Names
  const partnerRole =
    buyer?.partnerRole?.name || buyer?.role?.name || buyer?.partnerRoleName || buyer?.roleName || quotation?.partnerRoleName || 'Customer';

  const buyerName =
    buyer?.entityName || buyer?.name || (typeof quotation.buyer === 'string' ? quotation.buyer : null) || quotation.buyerName || quotation.partner?.entityName || quotation.partnerName || 'Not Specified';

  const destinationCountry = quotation.destinationCountry || buyer.country || 'Not Specified';
  const portOfLoading = (quotation.portOfLoading || quotation.loadingPort || quotation.originPort || '').trim();

  // 2. Dates
  const formattedDate = quotation.generatedAt
    ? new Date(quotation.generatedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()
    : quotation.createdAt
      ? new Date(quotation.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()
      : 'N/A';

  const currencyCode = quotation.currencyCode || fallbackItem.currencyCode || 'USD';

  // Helper to format price
  const formatPrice = (price) => {
    const parsed = parseFloat(price);
    if (isNaN(parsed)) return '0.00';
    return parsed.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const rawOfferedPrice = fallbackItem.offeredPrice ?? quotation.offeredPrice ?? quotation.price;
  const numericTotal = parseFloat(quotation.totalAmount) || (
    Array.isArray(rawItems) && rawItems.length > 0
      ? rawItems.reduce((acc, curr) => acc + (parseFloat(curr.offeredPrice ?? rawOfferedPrice) || 0), 0)
      : parseFloat(rawOfferedPrice) || 0
  );
  const priceDisplay = formatPrice(numericTotal);
  const wordsDisplay = numberToWords(numericTotal, currencyCode);
  const discountAmount = parseFloat(quotation.discountAmount || quotation.discount || 0);

  // ─── Theme Colors matching the provided image ────────────────────────────────
  const theme = {
    purple: '#8a31e8', // Exact purple from the image
    lightGray: '#f4f6f8', // Address boxes background
    rowStripe: '#f8f9fa',
    textMain: '#1e293b',
    textMuted: '#64748b',
    green: '#16a34a'
  };

  return (
    <div ref={ref} style={{ padding: '20px', display: 'flex', justifyContent: 'center', background: '#e5e7eb' }}>
      <div
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          width: '850px',
          background: '#ffffff',
          padding: '50px 60px',
          boxSizing: 'border-box',
          color: theme.textMain,
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        }}
      >
        {/* ─── HEADER ─── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <h1 style={{ color: theme.purple, fontSize: '32px', fontWeight: 800, margin: '0 0 20px 0', letterSpacing: '-0.5px' }}>
              Quotation
            </h1>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', fontSize: '11px' }}>
              <div style={{ color: theme.textMuted }}>Quotation#</div>
              <div style={{ fontWeight: 700 }}>{quotation.quotationNumber || '004'}</div>
              <div style={{ color: theme.textMuted }}>Quotation Date</div>
              <div style={{ fontWeight: 700 }}>{formattedDate}</div>
            </div>
          </div>
          <div>
            {/* Logo */}
            <img
              src={
                companyObj.logoUrl
                  ? (companyObj.logoUrl.startsWith('http') ? companyObj.logoUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${companyObj.logoUrl}`)
                  : '/agri_logo.png'
              }
              alt="Logo"
              style={{ height: '120px', maxWidth: '200px', objectFit: 'contain', marginTop: '-25px' }}
              onError={(e) => { e.target.onerror = null; e.target.src = "/agri_logo.png"; }}
            />
          </div>
        </div>

        {/* ─── ADDRESS BOXES ─── */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
          {/* Quotation By */}
          <div style={{ flex: 1, background: theme.lightGray, padding: '20px', borderRadius: '4px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '12px', fontSize: '11px', lineHeight: '1.5' }}>
              <div style={{ color: theme.textMuted }}>Quotation by</div>
              <div style={{ fontWeight: 700 }}>{companyName}</div>

              <div style={{ color: theme.textMuted }}>Address</div>
              <div style={{ whiteSpace: 'pre-line' }}>{companyAddress}</div>

              <div style={{ color: theme.textMuted }}>Role</div>
              <div>{companyRole}</div>
            </div>
          </div>

          {/* Quotation To */}
          <div style={{ flex: 1, background: theme.lightGray, padding: '20px', borderRadius: '4px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '12px', fontSize: '11px', lineHeight: '1.5' }}>
              <div style={{ color: theme.textMuted }}>Quotation to</div>
              <div style={{ fontWeight: 700 }}>{buyerName}</div>

              <div style={{ color: theme.textMuted }}>Destination</div>
              <div>{destinationCountry}</div>

              <div style={{ color: theme.textMuted }}>Role</div>
              <div>{partnerRole} {importer?.entityName ? `/ Importer: ${importer.entityName}` : ''}</div>
            </div>
          </div>
        </div>

        {/* Place / Country of supply */}
        <div style={{ display: 'flex', justifyContent: portOfLoading ? 'space-between' : 'flex-end', fontSize: '10px', marginBottom: '30px', padding: '0 20px' }}>
          {portOfLoading && (
            <div><span style={{ color: theme.textMuted, marginRight: '8px' }}>Port of Loading</span> <strong style={{ fontSize: '11px' }}>{portOfLoading}</strong></div>
          )}
          <div><span style={{ color: theme.textMuted, marginRight: '8px' }}>Port of Discharge</span> <strong style={{ fontSize: '11px' }}>{destinationCountry}</strong></div>
        </div>

        {/* ─── TABLE ─── */}
        <div style={{ marginBottom: '40px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: theme.purple, color: '#ffffff' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, borderRadius: '4px 0 0 4px' }}>Item #/Item description</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 500 }}>Packing</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 500 }}>Purity</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 500, borderRadius: '0 4px 4px 0' }}>Rate (Per MT)</th>
              </tr>
            </thead>
            <tbody>
              {itemsList.map((itm, idx) => {
                const product = itm.product || quotation.product || {};
                const productName = product?.name || itm.productName || quotation.productName || 'Product Not Specified';
                const subType = itm.subTypeSpec || product?.qualitySubType || '';

                const packaging = itm.bagSpecification || quotation.bagSpecification || null;
                const packingType = itm.packingType || packaging?.packingType || quotation.packingType || null;
                let packingDisplay = packingType?.name || itm.packingTypeName || (typeof itm.packingType === 'string' ? itm.packingType : 'Not Specified');

                let purityDisplay = 'Not Specified';
                if (itm.purity) {
                  purityDisplay = String(itm.purity).trim().endsWith('%') ? itm.purity : `${itm.purity}%`;
                }

                const itemPrice = itm.offeredPrice ?? rawOfferedPrice;
                const formattedItemPrice = formatPrice(itemPrice);

                return (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#ffffff' : theme.rowStripe }}>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ marginRight: '12px' }}>{idx + 1}.</span>
                      <strong>{productName}</strong>
                      {subType && <span style={{ display: 'block', paddingLeft: '24px', fontSize: '11px', color: theme.textMuted, marginTop: '4px' }}>{subType}</span>}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>{packingDisplay}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', borderBottom: '1px solid #f1f5f9' }}>{purityDisplay}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', borderBottom: '1px solid #f1f5f9' }}>{currencyCode} {formattedItemPrice}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ─── BOTTOM SECTION ─── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

          {/* Left: Terms & Notes */}
          <div style={{ width: '50%' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ color: theme.purple, fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Terms and Conditions</div>
              <ol style={{ paddingLeft: '16px', margin: 0, fontSize: '10px', color: theme.textMuted, lineHeight: '1.6' }}>
                <li style={{ paddingLeft: '4px', marginBottom: '8px' }}>This quotation is subject to final confirmation by the seller.</li>
                <li style={{ paddingLeft: '4px', marginBottom: '8px' }}>Prices are based on current market rates and are subject to change after the validity period.</li>
                <li style={{ paddingLeft: '4px' }}>Valid until: {quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString('en-US') : '7 Days from date of issue'}.</li>
              </ol>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <div style={{ color: theme.purple, fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Additional Notes</div>
              <p style={{ fontSize: '10px', color: theme.textMuted, margin: 0, lineHeight: '1.6', maxWidth: '90%' }}>
                Thank you for your business inquiry. Please contact us for any further clarification regarding shipping terms, documentation, or payment schedules.
              </p>
            </div>

            <div style={{ fontSize: '10px', fontWeight: 500 }}>
              For any enquiries, email us on <strong style={{ color: theme.textMain }}>{companyEmail}</strong>
              {companyPhone && (
                <>
                  <br />call us on <strong style={{ color: theme.textMain }}>{companyPhone}</strong>
                </>
              )}
            </div>
          </div>

          {/* Right: Totals & Signature */}
          <div style={{ width: '40%' }}>

            {/* Totals Box */}
            <div style={{ paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 500, marginBottom: '12px' }}>
                <div>Sub Total (Per MT)</div>
                <div>{currencyCode} {priceDisplay}</div>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 500, color: theme.green, marginBottom: '12px' }}>
                  <div>Discount</div>
                  <div>- {currencyCode} {formatPrice(discountAmount)}</div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '16px 0' }}>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>Total</div>
                <div style={{ fontSize: '20px', fontWeight: 800 }}>{currencyCode} {priceDisplay}</div>
              </div>

              <div style={{ marginTop: '12px', fontSize: '10px', color: theme.textMuted }}>
                Invoice Total (in words)<br />
                <strong style={{ color: theme.textMain, display: 'block', marginTop: '4px', fontSize: '11px' }}>
                  {wordsDisplay}
                </strong>
              </div>
            </div>

            {/* Signature Area */}
            <div style={{ marginTop: '40px', textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ position: 'relative', height: '80px', width: '200px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <img
                  src="/WhatsApp Image 2026-04-16 at 2.44.32 PM.jpeg"
                  alt="Company Seal"
                  style={{ position: 'absolute', maxHeight: '90px', maxWidth: '140px', objectFit: 'contain', opacity: 0.3, mixBlendMode: 'multiply', right: '30px' }}
                />
                <img
                  src="/akashsign.png"
                  alt="Authorized Signature"
                  style={{ position: 'relative', maxHeight: '60px', maxWidth: '180px', objectFit: 'contain', zIndex: 10, mixBlendMode: 'multiply' }}
                />
              </div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: theme.textMain, marginTop: '8px' }}>
                Authorized Signature
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
});

export default QuotationPreview;