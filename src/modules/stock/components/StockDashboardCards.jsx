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
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm animate-pulse flex flex-col justify-between h-24"
          >
            <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 mb-6">
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
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider truncate">
                {c.title}
              </span>
              <div className={`p-1.5 rounded-lg border ${c.color} shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className={`text-xl font-bold tracking-tight ${c.textClass || "text-gray-900"}`}>
                {formattedValue}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
