import React from "react";
import { Globe, Package, FileText, ShoppingCart } from "lucide-react";

export default function StockDashboardCards({ summary, isLoading }) {
  const cards = [
    {
      title: "Total Countries",
      value: summary?.totalCountries ?? 0,
      icon: Globe,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      isTonnage: false,
    },
    {
      title: "Total Products",
      value: summary?.totalProducts ?? 0,
      icon: Package,
      color: "text-sky-600 bg-sky-50 border-sky-100",
      isTonnage: false,
    },
    {
      title: "Total Purchase Contracts",
      value: summary?.totalPurchaseContracts ?? 0,
      icon: FileText,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      isTonnage: false,
    },
    {
      title: "Total Purchased",
      value: summary?.totalPurchasedMT ?? 0,
      icon: ShoppingCart,
      color: "text-slate-700 bg-slate-50 border-slate-200",
      isTonnage: true,
      textClass: "text-slate-900",
    },
    {
      title: "Total Amount",
      value: summary?.totalAmountByCurrency ?? {},
      icon: ShoppingCart,
      color: "text-violet-600 bg-violet-50 border-violet-100",
      isAmount: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white px-3 py-2.5 rounded-lg border border-gray-200 shadow-sm animate-pulse flex flex-col justify-between h-[76px]"
          >
            <div className="h-2.5 bg-gray-200 rounded w-20 mb-1.5"></div>
            <div className="h-4 bg-gray-200 rounded w-14"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        const formattedValue = c.isTonnage
          ? `${Number(c.value || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} MT`
          : c.isAmount
            ? Object.entries(c.value).map(([currency, amount]) => `${currency} ${Number(amount || 0).toLocaleString("en-US")}`).join(" / ") || "—"
          : Number(c.value || 0).toLocaleString();

        return (
          <div
            key={idx}
            className="bg-white px-3 py-2.5 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-shadow duration-200 flex flex-col justify-between h-[76px]"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider truncate">
                {c.title}
              </span>
              <div className={`p-1 rounded-md border ${c.color} shrink-0`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className={`text-base font-bold tracking-tight truncate ${c.textClass || "text-gray-900"}`} title={formattedValue}>
                {formattedValue}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
