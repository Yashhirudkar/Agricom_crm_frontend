"use client";
import React, { useRef } from "react";
import { CalendarDays, FileText, ChevronDown } from "lucide-react";
import AsyncSelect from "react-select/async";
import { toast } from "sonner";
import { purchaseContractApi } from "../services/purchaseContractApi";
import {
  calculatePaymentDueDate,
  formatContractDate,
  parseContractDate,
} from "../utils/dateUtils";

const buyerSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "36px",
    borderRadius: "12px",
    borderColor: state.isFocused ? "#007aff" : "#e5e7eb",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(0,122,255,0.2)" : "none",
    "&:hover": { borderColor: state.isFocused ? "#007aff" : "#d1d5db" },
    fontSize: "12px",
  }),
  valueContainer: (base) => ({ ...base, padding: "0 12px" }),
  input: (base) => ({ ...base, margin: 0, padding: 0 }),
  indicatorsContainer: (base) => ({ ...base, height: "34px" }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, padding: "0 8px", color: "#9ca3af" }),
  clearIndicator: (base) => ({ ...base, padding: "0 4px", color: "#9ca3af" }),
  option: (base, state) => ({
    ...base,
    fontSize: "12px",
    backgroundColor: state.isSelected ? "#007aff" : state.isFocused ? "#eff6ff" : "#fff",
    color: state.isSelected ? "#fff" : "#111827",
  }),
  menu: (base) => ({ ...base, zIndex: 10000, fontSize: "12px" }),
  menuPortal: (base) => ({ ...base, zIndex: 10000 }),
  noOptionsMessage: (base) => ({ ...base, fontSize: "12px" }),
};

export default function PurchaseContractInformationSection({
  contract,
  summary,
  form,
  setForm,
  masters = {},
  exporterOptions = [],
  isView = false,
}) {
  const contractDatePickerRef = useRef(null);
  const inp = "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white transition-all disabled:opacity-75 disabled:bg-gray-100";
  const lbl = "block text-[11px] font-semibold text-gray-600 mb-1.5";

  const isManual = contract?.purchaseType === "MTT" || !contract?.salesContractId;
  const contractNo = form.contractNumber || summary?.contractInfo?.contractNumber || (contract?.salesContract?.contractNumber ? `PC-${contract.salesContract.contractNumber}` : (contract?.id ? `PC-${contract.id}` : "PC-NEW"));
  const defaultBuyer = contract?.salesContract?.seller?.entityName || summary?.commercialInfo?.buyer?.entityName || "";
  const defaultSeller = summary?.commercialInfo?.seller?.entityName || "";
  const contractTypeDisplay = isManual ? "MTT (Manual Trade)" : (contract?.salesContract?.contractType || "SC (Sales Contract)");

  const buyersOptions = masters?.buyers || masters?.partners || [];
  const buyerSelectOptions = buyersOptions.map((buyer) => ({
    value: buyer.id,
    label: buyer.entityName || buyer.name,
  }));
  const selectedBuyerOption = buyerSelectOptions.find(
    (option) => Number(option.value) === Number(form.buyerId)
  ) || (form.buyerId && form.buyerName
    ? { value: form.buyerId, label: form.buyerName }
    : null);
  const sellersOptions = exporterOptions;

  const loadBuyerOptions = async (inputValue) => {
    const search = inputValue.trim();
    if (search.length < 2) {
      const normalizedSearch = search.toLowerCase();
      return buyerSelectOptions.filter((option) =>
        option.label.toLowerCase().includes(normalizedSearch)
      );
    }
    if (!masters?.buyerRoleId) {
      return [];
    }

    try {
      const response = await purchaseContractApi.getPartnersOptions({
        partnerRoleId: masters.buyerRoleId,
        search,
        limit: 50,
        page: 1,
        isActive: true,
      });
      const data = response.data?.data || response.data || [];
      return Array.isArray(data)
        ? data.map((buyer) => ({
          value: buyer.id,
          label: buyer.entityName || buyer.name,
        }))
        : [];
    } catch (error) {
      console.error("Failed to search buyer entities", error);
      toast.error("Buyer search is temporarily unavailable. Please try again.");
      return [];
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <FileText className="h-3.5 w-3.5 text-[#007aff]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Contract Information</h2>
            <p className="text-[10px] text-gray-400">Basic purchase contract details and counterparty entities</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className={lbl}>
              Contract Date <span className="text-red-500">*</span>
            </label>
            {isView ? (
              <div className="text-sm font-semibold text-gray-900 py-1.5">{formatContractDate(form.contractDate) || "\u00A0"}</div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={form.contractDateInput ?? formatContractDate(form.contractDate)}
                  onChange={(e) => {
                    const value = e.target.value;
                    const parsedDate = parseContractDate(value);
                    setForm((f) => ({
                      ...f,
                      contractDateInput: value,
                      contractDate: value === "" ? "" : (parsedDate || f.contractDate),
                      ...(value === "" || parsedDate
                        ? { paymentDueDate: calculatePaymentDueDate(parsedDate || "") }
                        : {}),
                    }));
                  }}
                  onBlur={() => {
                    const parsedDate = parseContractDate(form.contractDateInput);
                    if (parsedDate) {
                      setForm((f) => ({
                        ...f,
                        contractDateInput: formatContractDate(parsedDate),
                      }));
                    }
                  }}
                  maxLength={8}
                  placeholder="DD-MM-YY"
                  className={`${inp} font-medium pr-9`}
                  aria-label="CONTRACT DATE (DD-MM-YY)"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (contractDatePickerRef.current?.showPicker) {
                      contractDatePickerRef.current.showPicker();
                    } else {
                      contractDatePickerRef.current?.click();
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#007aff]"
                  aria-label="CHOOSE CONTRACT DATE"
                >
                  <CalendarDays className="h-4 w-4" />
                </button>
                <input
                  ref={contractDatePickerRef}
                  type="date"
                  value={form.contractDate || ""}
                  onChange={(e) => setForm((f) => ({
                    ...f,
                    contractDate: e.target.value,
                    contractDateInput: formatContractDate(e.target.value),
                    paymentDueDate: calculatePaymentDueDate(e.target.value),
                  }))}
                  className="sr-only"
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </div>
            )}
          </div>

          <div>
            <label className={lbl}>
              Contract Type <span className="text-red-500">*</span>
            </label>
            {isView ? (
              <div className="text-sm font-semibold text-gray-900 py-1.5">{contractTypeDisplay || "\u00A0"}</div>
            ) : (
              <input
                type="text"
                value={contractTypeDisplay}
                readOnly
                className={`${inp} bg-purple-50/60 font-bold text-purple-700 border-purple-200`}
              />
            )}
          </div>

          {/* Buyer Entity */}
          <div>
            <label className={lbl}>
              Buyer Entity {isManual && !isView && <span className="text-red-500">*</span>}
            </label>
            {isView ? (
              <div className="text-sm font-semibold text-gray-900 py-1.5">{form.buyerName || defaultBuyer || "\u00A0"}</div>
            ) : isManual && buyersOptions.length > 0 ? (
              <AsyncSelect
                inputId="purchase-contract-buyer"
                aria-label="Buyer Entity"
                value={selectedBuyerOption}
                defaultOptions={buyerSelectOptions}
                cacheOptions
                loadOptions={loadBuyerOptions}
                onChange={(option) => {
                  const bId = option ? Number(option.value) : null;
                  setForm((f) => ({
                    ...f,
                    buyerId: bId,
                    buyerName: option?.label || "",
                  }));
                }}
                placeholder="Select Buyer Entity"
                isSearchable
                isClearable
                styles={buyerSelectStyles}
                filterOption={null}
                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                menuPosition="fixed"
                menuPlacement="auto"
                noOptionsMessage={() => "No buyer entities found"}
              />
            ) : (
              <input
                type="text"
                value={form.buyerName || defaultBuyer}
                onChange={(e) => setForm((f) => ({ ...f, buyerName: e.target.value }))}
                readOnly={!isManual}
                placeholder="Enter Buyer Entity"
                className={`${inp} ${!isManual ? "bg-gray-50" : ""} font-semibold text-gray-800`}
              />
            )}
          </div>

          {/* Seller / Supplier / EXPORTER Entity */}
          <div>
            <label className={lbl}>
              Seller / Supplier / EXPORTER {!isView && <span className="text-red-500">*</span>}
            </label>
            {isView ? (
              <div className="text-sm font-semibold text-gray-900 py-1.5">{form.supplierName || "\u00A0"}</div>
            ) : (
              <div className="relative">
                <select
                  value={form.sellerId || ""}
                  onChange={(e) => {
                    const sId = Number(e.target.value);
                    const sObj = sellersOptions.find((s) => s.id === sId);
                    setForm((f) => ({
                      ...f,
                      sellerId: sId || null,
                      supplierName: sObj?.entityName || sObj?.name || "",
                    }));
                  }}
                  className={`${inp} appearance-none pr-8 font-semibold text-gray-900`}
                >
                  <option value="">Select Exporter Entity</option>
                  {sellersOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.entityName || s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
              </div>
            )}
          </div>

          <div>
            <label className={lbl}>Seller Contract No</label>
            {isView ? (
              <div className="text-sm font-mono text-gray-900 py-1.5">{form.sellerContractNo || "\u00A0"}</div>
            ) : (
              <input
                type="text"
                value={form.sellerContractNo || ""}
                onChange={(e) => setForm((f) => ({ ...f, sellerContractNo: e.target.value }))}
                className={`${inp} font-mono`}
                placeholder="e.g. SUP-88219"
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
