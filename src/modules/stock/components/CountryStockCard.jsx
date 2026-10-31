import React from "react";
import { ChevronRight } from "lucide-react";

export default function CountryStockCard({ countryGroup, onSelectProduct }) {
  const { country, totalPurchased = 0, products = [] } = countryGroup;

  const formatMT = (val) => {
    return `${Number(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })} MT`;
  };
  const formatAmounts = (amounts = {}) => {
    const entries = Object.entries(amounts);
    if (entries.length === 0) return "—";
    return entries.map(([currency, amount]) => (
      <div key={currency}>{currency} {Number(amount || 0).toLocaleString("en-US")}</div>
    ));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden">
      {/* Country Card Header */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
          <h2 className="text-base font-bold text-gray-900 tracking-tight">{country}</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            {products.length} {products.length === 1 ? "Product" : "Products"}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Purchased:</span>
            <span className="font-semibold text-gray-900">{formatMT(totalPurchased)}</span>
          </div>
        </div>
      </div>

      {/* Direct Data Table (No Collapse, Excel Dashboard Style) */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3 w-10 text-center">#</th>
              <th className="py-2.5 px-3">Product</th>
              <th className="py-2.5 px-3 text-right">Purchased</th>
              <th className="py-2.5 px-3 text-right">Amount</th>
              <th className="py-2.5 px-3 text-center w-20">Contracts</th>
              <th className="py-2.5 px-2 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-400 italic">
                  No products found for this country
                </td>
              </tr>
            ) : (
              products.map((item, index) => {
                const contractsCount = item.contractCount ?? item.contracts?.length ?? 0;

                return (
                  <tr
                    key={item.product || index}
                    onClick={() => onSelectProduct?.(item, country)}
                    className="hover:bg-indigo-50/50 cursor-pointer transition-colors group"
                    title="Click to view purchase contract details"
                  >
                    <td className="py-2 px-3 text-center text-gray-400 font-mono text-[11px]">
                      {index + 1}
                    </td>
                    <td className="py-2 px-3 font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {item.product}
                    </td>
                    <td className="py-2 px-3 text-right text-gray-800 font-medium">
                      {formatMT(item.purchased)}
                    </td>
                    <td className="py-2 px-3 text-right text-gray-800 font-medium">
                      {formatAmounts(item.amountByCurrency)}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                        {contractsCount}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center text-gray-400 group-hover:text-indigo-600 transition-colors">
                      <ChevronRight className="w-3.5 h-3.5 inline" />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Bottom Total Row */}
          {products.length > 0 && (
            <tfoot>
              <tr className="bg-slate-100/80 border-t-2 border-gray-300 font-bold text-gray-900 text-xs">
                <td colSpan={2} className="py-2.5 px-3 uppercase tracking-wider text-[11px] text-gray-700">
                  TOTAL
                </td>
                <td className="py-2.5 px-3 text-right text-gray-900">
                  {formatMT(totalPurchased)}
                </td>
                <td className="py-2.5 px-3 text-right text-gray-900">
                  {formatAmounts(countryGroup.amountByCurrency)}
                </td>
                <td colSpan={2} className="py-2.5 px-3 text-center text-gray-600">
                  {products.reduce(
                    (acc, p) => acc + (p.contractCount ?? p.contracts?.length ?? 0),
                    0,
                  )}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
