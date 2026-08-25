import React, { useState, useEffect, useCallback } from 'react';
import { X, FileText, ChevronLeft, Plus, AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import axiosClient from '@/lib/axios';
import CountrySelect from '@/components/common/CountrySelect';
import InfiniteSearchSelect from './InfiniteSearchSelect';
import QuotationPreview from './QuotationPreview';
import { useCreateQuotationMutation } from '../mutations/quotations.mutation';

// ─── Style helpers ─────────────────────────────────────────────────────────────

const inp =
  'w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white transition-all';
const lbl = 'block text-[11px] font-semibold text-gray-600 mb-1.5';
const errCls = 'text-[10px] text-red-500 mt-1';

const EMPTY_FORM = {
  partnerRoleId: null,
  buyerId: null,
  buyerData: null,
  importerId: null,
  destinationCountry: { name: '', iso2Code: '', iso3Code: '' },
  productId: null,
  productData: null,           // full product object for sub-type derivation
  subTypeSpec: '',
  subTypeOptions: [],          // derived from product.qualitySubType
  packagingOptions: [],        // from GET /masters/products/:id/packaging
  packagingId: null,
  packagingName: '',           // display only
  packingTypeId: null,
  packingTypeName: '',         // auto-filled, read-only
  purity: '',
  offeredPrice: '',
  currencyCode: null,
  currencyItem: null,
  validUntil: '',
};

// ─── Main component ────────────────────────────────────────────────────────────

export default function CreateQuotationDrawer({ isOpen, onClose, followUp, onQuotationCreated }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [partnerRoles, setPartnerRoles] = useState([]);
  const [packingTypes, setPackingTypes] = useState([]);
  const [loadingPackaging, setLoadingPackaging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [quotationResult, setQuotationResult] = useState(null);

  const createMutation = useCreateQuotationMutation();

  // ─── Reset on close ───────────────────────────────────────────────────────

  useEffect(() => {
    if (isOpen) {
      // Fetch partner roles for dropdown
      axiosClient.get('/masters/partner-roles/options').then((res) => {
        const roles = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];
        setPartnerRoles(roles);
      }).catch(() => setPartnerRoles([]));

      // Fetch packing types from master
      axiosClient.get('/masters/packing-types/options').then((res) => {
        const list = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];
        setPackingTypes(list);
      }).catch(() => setPackingTypes([]));

      const partnerObj = followUp?.partner;
      const pId = partnerObj?.id || followUp?.partnerId || (typeof followUp?.partner === 'number' ? followUp.partner : null);

      const applyPartnerDetails = (pData) => {
        const rId = pData?.partnerRoleId || pData?.partnerRole?.id || null;
        const countryStr = pData?.country || followUp?.destinationCountry || '';

        setForm({
          ...EMPTY_FORM,
          partnerRoleId: rId ? Number(rId) : null,
          buyerId: pData?.id ? Number(pData.id) : pId ? Number(pId) : null,
          buyerData: pData || null,
          destinationCountry: countryStr ? { name: countryStr, iso2Code: '', iso3Code: '' } : EMPTY_FORM.destinationCountry,
        });
      };

      if (pId) {
        axiosClient.get(`/masters/partners/${pId}`).then((res) => {
          const fetchedData = res.data?.data || res.data;
          applyPartnerDetails(fetchedData || partnerObj);
        }).catch(() => {
          applyPartnerDetails(partnerObj || { id: pId });
        });
      } else {
        setForm(EMPTY_FORM);
      }

      setErrors({});
      setShowPreview(false);
      setQuotationResult(null);
    }
  }, [isOpen, followUp]);

  // ─── Derive SubType options from product ──────────────────────────────────

  const deriveSubTypeOptions = (product) => {
    if (!product) return [];
    const raw = product.qualitySubType || product.quality_sub_type || '';
    if (!raw.trim()) return [];
    return raw
      .split(/[,;/]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  // ─── On product selected ──────────────────────────────────────────────────

  const handleProductChange = useCallback(async (productItem) => {
    if (!productItem) {
      setForm((f) => ({
        ...f,
        productId: null,
        productData: null,
        subTypeSpec: '',
        subTypeOptions: [],
        packagingOptions: [],
        packagingId: null,
        packagingName: '',
        packingTypeId: null,
        packingTypeName: '',
      }));
      return;
    }

    const subTypeOptions = deriveSubTypeOptions(productItem);
    setForm((f) => ({
      ...f,
      productId: productItem.id,
      productData: productItem,
      subTypeSpec: subTypeOptions.length === 1 ? subTypeOptions[0] : '',
      subTypeOptions,
      packagingOptions: [],
      packagingId: null,
      packagingName: '',
      packingTypeId: null,
      packingTypeName: '',
    }));

    // Load packaging assignments for this product
    setLoadingPackaging(true);
    try {
      const res = await axiosClient.get(`/masters/products/${productItem.id}/packaging`);
      const specs = Array.isArray(res.data) ? res.data : [];
      setForm((f) => ({ ...f, packagingOptions: specs }));
    } catch {
      setForm((f) => ({ ...f, packagingOptions: [] }));
    } finally {
      setLoadingPackaging(false);
    }
  }, []);

  // ─── On packaging selected → auto-fill packing type ──────────────────────

  const handlePackagingChange = (e) => {
    const specId = parseInt(e.target.value, 10);
    if (!specId) {
      setForm((f) => ({ ...f, packagingId: null, packagingName: '', packingTypeId: null, packingTypeName: '' }));
      return;
    }
    const spec = form.packagingOptions.find((s) => s.id === specId);
    if (!spec) return;

    const pt = spec.packingType || null;
    const ptName = pt?.name || '';

    // Build a label like "PP Woven Bag / 25 KG Net"
    const bagTypeName = spec.bagType?.name || '';
    const label = [bagTypeName, spec.netWeight ? `${spec.netWeight} KG Net` : null]
      .filter(Boolean)
      .join(' / ') || `Spec #${spec.id}`;

    setForm((f) => ({
      ...f,
      packagingId: spec.id,
      packagingName: label,
      packingTypeId: pt?.id || null,
      packingTypeName: ptName,
    }));
  };

  // ─── Validation ───────────────────────────────────────────────────────────

  const validate = () => {
    const e = {};
    if (!form.partnerRoleId) e.partnerRoleId = 'Partner Role is required';
    if (!form.buyerId) e.buyerId = 'Partner is required';
    if (!form.destinationCountry?.name) e.destinationCountry = 'Destination country is required';
    if (!form.productId) e.productId = 'Product is required';
    if (!form.offeredPrice || isNaN(Number(form.offeredPrice)) || Number(form.offeredPrice) <= 0)
      e.offeredPrice = 'Valid price is required';
    if (!form.currencyCode) e.currencyCode = 'Currency is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleGenerate = async () => {
    if (!validate()) return;

    const payload = {
      buyerId: form.buyerId,
      importerId: form.importerId || undefined,
      destinationCountry: form.destinationCountry.name,
      followUpId: followUp?.id || undefined,
      currencyCode: form.currencyCode,
      validUntil: form.validUntil || undefined,
      items: [
        {
          productId: form.productId,
          subTypeSpec: form.subTypeSpec || undefined,
          packagingId: form.packagingId || undefined,
          packingTypeId: form.packingTypeId || undefined,
          purity: form.purity || undefined,
          offeredPrice: Number(form.offeredPrice),
        },
      ],
    };

    try {
      const result = await createMutation.mutateAsync(payload);
      setQuotationResult(result);
      setShowPreview(true);
      if (onQuotationCreated) {
        onQuotationCreated(result);
      }
    } catch {
      // Error handled by mutation onError (toast)
    }
  };

  // ─── Escape key ───────────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel — 950px wide */}
      <div
        className="relative z-10 bg-white h-full flex flex-col shadow-2xl border-l border-gray-100"
        style={{ width: '950px', maxWidth: '95vw', animation: 'slideIn 0.25s ease-out' }}
      >
        {/* ── Header ── */}
        <div className="px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              {showPreview ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPreview(false)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#007aff] hover:text-blue-700 transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Back to Form
                  </button>
                  <span className="text-gray-300">|</span>
                  <span className="text-xs text-gray-400 font-medium">Quotation Preview</span>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-gray-900 leading-tight flex items-center gap-2">
                    <FileText className="h-5 w-5 text-violet-600" />
                    Create Quotation
                  </h2>
                  {followUp && (
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      Follow-up with <span className="font-semibold text-gray-600">{followUp.partner?.entityName || 'Partner'}</span>
                    </p>
                  )}
                </>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          {showPreview ? (
            /* Preview mode */
            <div className="p-6 bg-gray-50 min-h-full">
              {quotationResult && (
                <>
                  {/* Success banner */}
                  <div className="mb-5 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-emerald-800">
                        Quotation generated successfully!
                      </div>
                      <div className="text-xs text-emerald-600 mt-0.5">
                        Quotation No: <span className="font-bold">{quotationResult.quotationNumber}</span>
                      </div>
                    </div>
                  </div>
                  <QuotationPreview quotation={quotationResult} />
                </>
              )}
            </div>
          ) : (
            /* Form mode */
            <div className="p-6 space-y-6">

              {/* ── Section 1: Buyer Information ── */}
              <FormSection title="Buyer Information" icon="🏢">
                <div className="grid grid-cols-3 gap-4">
                  {/* Partner Role */}
                  <div>
                    <label className={lbl}>
                      Partner Role <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className={`${inp} appearance-none pr-8 ${errors.partnerRoleId ? 'border-red-300' : ''}`}
                        value={form.partnerRoleId || ''}
                        onChange={(e) => {
                          const rId = e.target.value ? Number(e.target.value) : null;
                          setForm((f) => ({ ...f, partnerRoleId: rId, buyerId: null, buyerData: null }));
                          if (errors.partnerRoleId) setErrors((e) => ({ ...e, partnerRoleId: undefined }));
                        }}
                      >
                        <option value="">Select Role</option>
                        {partnerRoles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    </div>
                    {errors.partnerRoleId && <p className={errCls}>{errors.partnerRoleId}</p>}
                  </div>

                  {/* Partner (Buyer) Select */}
                  <div>
                    <InfiniteSearchSelect
                      label="Partner"
                      required
                      disabled={!form.partnerRoleId}
                      endpoint="/masters/partners/options"
                      queryParams={form.partnerRoleId ? { partnerRoleId: form.partnerRoleId } : {}}
                      getOptionLabel={(p) => p?.entityName || ''}
                      getOptionValue={(p) => p?.id}
                      value={form.buyerId}
                      initialItem={form.buyerData}
                      onChange={(item) => {
                        setForm((f) => ({
                          ...f,
                          buyerId: item?.id || null,
                          buyerData: item || null,
                          destinationCountry: item?.country ? { name: item.country, iso2Code: '', iso3Code: '' } : f.destinationCountry,
                        }));
                        if (errors.buyerId) setErrors((e) => ({ ...e, buyerId: undefined }));
                      }}
                      placeholder={!form.partnerRoleId ? 'Select Role first' : 'Select Partner'}
                      error={errors.buyerId}
                    />
                  </div>

                  {/* Destination Country */}
                  <div>
                    <label className={lbl}>
                      Destination Country <span className="text-red-500">*</span>
                    </label>
                    <CountrySelect
                      value={form.destinationCountry}
                      onChange={(val) => {
                        setForm((f) => ({ ...f, destinationCountry: val }));
                        if (errors.destinationCountry) setErrors((e) => ({ ...e, destinationCountry: undefined }));
                      }}
                      error={errors.destinationCountry}
                    />
                    {errors.destinationCountry && (
                      <p className={errCls}>{errors.destinationCountry}</p>
                    )}
                  </div>
                </div>
              </FormSection>

              {/* ── Section 2: Product Information ── */}
              <FormSection title="Product Information" icon="📦">
                <div className="grid grid-cols-2 gap-4">
                  {/* Product */}
                  <div>
                    <InfiniteSearchSelect
                      label="Product"
                      required
                      endpoint="/masters/products/options"
                      queryParams={{}}
                      getOptionLabel={(p) => p?.name || ''}
                      getOptionValue={(p) => p?.id}
                      value={form.productId}
                      onChange={(item) => {
                        handleProductChange(item);
                        if (errors.productId) setErrors((e) => ({ ...e, productId: undefined }));
                      }}
                      placeholder="Search product..."
                      error={errors.productId}
                    />
                  </div>

                  {/* SubType / Spec */}
                  <div>
                    <label className={lbl}>SubType / Spec</label>
                    {form.subTypeOptions.length > 0 ? (
                      <select
                        className={inp}
                        value={form.subTypeSpec}
                        onChange={(e) => setForm((f) => ({ ...f, subTypeSpec: e.target.value }))}
                      >
                        <option value="">Select sub-type...</option>
                        {form.subTypeOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className={inp}
                        placeholder={form.productId ? 'Enter sub-type / spec...' : 'Select a product first'}
                        disabled={!form.productId}
                        value={form.subTypeSpec}
                        onChange={(e) => setForm((f) => ({ ...f, subTypeSpec: e.target.value }))}
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  {/* Packing Type — Dynamic master select */}
                  <div>
                    <label className={lbl}>Packing Type</label>
                    <div className="relative">
                      <select
                        className={`${inp} appearance-none pr-8`}
                        value={form.packingTypeId || ''}
                        onChange={(e) => {
                          const val = e.target.value ? Number(e.target.value) : null;
                          const pt = packingTypes.find((p) => p.id === val);
                          setForm((f) => ({
                            ...f,
                            packingTypeId: val,
                            packingTypeName: pt?.name || '',
                          }));
                        }}
                      >
                        <option value="">Select Packing Type</option>
                        {packingTypes.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    </div>
                  </div>

                  {/* Purity — Dynamic select dropdown */}
                  <div>
                    <label className={lbl}>Purity</label>
                    <div className="relative">
                      <select
                        className={`${inp} appearance-none pr-8`}
                        value={form.purity || ''}
                        onChange={(e) => setForm((f) => ({ ...f, purity: e.target.value }))}
                      >
                        <option value="">Select Purity</option>
                        <option value="99.99%">99.99%</option>
                        <option value="99%">99%</option>
                        <option value="98%">98%</option>
                        <option value="97%">97%</option>
                        <option value="96%">96%</option>
                        <option value="95%">95%</option>
                        <option value="FAQ">FAQ</option>
                        <option value="Raw">Raw</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    </div>
                  </div>
                </div>
              </FormSection>

              {/* ── Section 3: Pricing & Validity ── */}
              <FormSection title="Pricing & Validity" icon="💰">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={lbl}>
                      Price We Offer <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className={`${inp} ${errors.offeredPrice ? 'border-red-300' : ''}`}
                      placeholder="e.g. 850.00"
                      value={form.offeredPrice}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, offeredPrice: e.target.value }));
                        if (errors.offeredPrice) setErrors((e) => ({ ...e, offeredPrice: undefined }));
                      }}
                    />
                    {errors.offeredPrice && <p className={errCls}>{errors.offeredPrice}</p>}
                  </div>

                  <div>
                    <InfiniteSearchSelect
                      label="Currency"
                      required
                      endpoint="/masters/currencies"
                      queryParams={{ status: 'Active', limit: 15 }}
                      getOptionLabel={(c) => `${c.code} — ${c.name}`}
                      getOptionValue={(c) => c.code}
                      value={form.currencyCode}
                      onChange={(item) => {
                        setForm((f) => ({ ...f, currencyCode: item?.code || null, currencyItem: item }));
                        if (errors.currencyCode) setErrors((e) => ({ ...e, currencyCode: undefined }));
                      }}
                      placeholder="Select currency..."
                      error={errors.currencyCode}
                    />
                  </div>

                  <div>
                    <label className={lbl}>Valid Upto</label>
                    <div className="relative">
                      <input
                        type="date"
                        className={`${inp} cursor-pointer`}
                        value={form.validUntil || ''}
                        onClick={(e) => e.target.showPicker?.()}
                        onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </FormSection>

              {/* Validation summary */}
              {Object.keys(errors).length > 0 && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  Please fill in all required fields before generating the quotation.
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3 flex-shrink-0">
          {showPreview ? (
            <>
              <button
                type="button"
                onClick={() => { setShowPreview(false); setQuotationResult(null); setForm(EMPTY_FORM); setErrors({}); }}
                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                New Quotation
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={createMutation.isPending}
                className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="h-3.5 w-3.5" />
                    Generate Quotation
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Slide-in animation */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── FormSection helper ────────────────────────────────────────────────────────

function FormSection({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">{icon}</span>
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">{title}</h3>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      {children}
    </div>
  );
}
