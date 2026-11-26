import { currencies } from "@/constants/currenciesData";

export const ANALYTICS_COLORS = [
  "#007aff", // Primary Blue
  "#10b981", // Emerald
  "#6366f1", // Indigo
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#8b5cf6", // Violet
  "#f97316", // Orange
  "#14b8a6", // Teal
  "#ef4444", // Rose
  "#64748b", // Slate (Others)
];

const MONTH_SHORT_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const getExecutiveFirstName = (name) =>
  name?.trim().split(/\s+/)[0] || "";

/**
 * Safely parse a date string (preferring YYYY-MM-DD prefix to avoid timezone shifts).
 */
export function parseOrderDateParts(dateValue) {
  if (!dateValue) return null;
  if (typeof dateValue === "string") {
    const match = dateValue.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return {
        year: Number(match[1]),
        month: Number(match[2]),
        day: Number(match[3]),
      };
    }
  }
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return null;
  return {
    year: parsed.getFullYear(),
    month: parsed.getMonth() + 1,
    day: parsed.getDate(),
  };
}

/**
 * Detect currency consistency across filtered orders.
 * Returns single-currency metadata when uniform, or mixed breakdown when multiple currencies exist.
 */
export function detectCurrencyMeta(orders = []) {
  const totalsByCurrency = new Map();

  orders.forEach((order) => {
    const code = (order.currency || "").trim().toUpperCase();
    if (!code) return;
    const prev = totalsByCurrency.get(code) || 0;
    totalsByCurrency.set(code, prev + Number(order.salesValue || 0));
  });

  const codes = Array.from(totalsByCurrency.keys());
  if (codes.length === 1) {
    const code = codes[0];
    const info = currencies[code];
    return {
      mode: "single",
      code,
      symbol: info?.symbol || code,
      locale: code === "INR" ? "en-IN" : "en-US",
      breakdown: [{ code, total: totalsByCurrency.get(code) || 0 }],
    };
  }

  if (codes.length > 1) {
    const breakdown = Array.from(totalsByCurrency.entries())
      .map(([code, total]) => ({
        code,
        symbol: currencies[code]?.symbol || code,
        total,
      }))
      .sort((a, b) => b.total - a.total);
    return {
      mode: "mixed",
      code: "",
      symbol: "",
      locale: "en-IN",
      breakdown,
    };
  }

  return {
    mode: "none",
    code: "",
    symbol: "",
    locale: "en-IN",
    breakdown: [],
  };
}

export function formatNumber(value, maximumFractionDigits = 0) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "0";
  return num.toLocaleString("en-IN", { maximumFractionDigits });
}

export function formatCurrencyValue(value, currencyMeta, maximumFractionDigits = 0) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "0";
  const locale = currencyMeta?.locale || "en-IN";
  const formatted = num.toLocaleString(locale, { maximumFractionDigits });
  if (currencyMeta?.mode === "single" && currencyMeta?.symbol) {
    return `${currencyMeta.symbol} ${formatted}`;
  }
  return formatted;
}

export function formatCompactCurrency(value, currencyMeta) {
  const num = Number(value || 0);
  if (!Number.isFinite(num) || num === 0) return "0";
  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";
  const prefix =
    currencyMeta?.mode === "single" && currencyMeta?.symbol
      ? currencyMeta.symbol
      : "";

  if (currencyMeta?.code === "INR" || currencyMeta?.locale === "en-IN") {
    if (abs >= 1e7) return `${sign}${prefix}${(abs / 1e7).toFixed(1)}Cr`;
    if (abs >= 1e5) return `${sign}${prefix}${(abs / 1e5).toFixed(1)}L`;
    if (abs >= 1e3) return `${sign}${prefix}${(abs / 1e3).toFixed(0)}K`;
    return `${sign}${prefix}${Math.round(abs)}`;
  }

  if (abs >= 1e9) return `${sign}${prefix}${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}${prefix}${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}${prefix}${(abs / 1e3).toFixed(0)}K`;
  return `${sign}${prefix}${Math.round(abs)}`;
}

export function formatCompactNumber(value) {
  const num = Number(value || 0);
  if (!Number.isFinite(num) || num === 0) return "0";
  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(1)}K`;
  return `${sign}${Math.round(abs)}`;
}

function formatMonthKeyLabel(monthKey) {
  if (!monthKey || !monthKey.includes("-")) return monthKey || "";
  const [yStr, mStr] = monthKey.split("-");
  const mIdx = Number(mStr) - 1;
  if (mIdx < 0 || mIdx > 11) return monthKey;
  return `${MONTH_SHORT_NAMES[mIdx]} ${yStr}`;
}

function getPreviousMonthKey(monthKey) {
  const [yStr, mStr] = monthKey.split("-");
  let year = Number(yStr);
  let month = Number(mStr) - 1;
  if (month < 1) {
    month = 12;
    year -= 1;
  }
  return `${year}-${String(month).padStart(2, "0")}`;
}

function computeDeltaPct(current, previous) {
  if (previous === 0) {
    return current > 0 ? null : 0;
  }
  return ((current - previous) / previous) * 100;
}

/**
 * Bucket sorted items into top N + "Others" while preserving exact share percentages.
 */
function bucketDistribution(items, limit, totalRevenue, valueAccessor) {
  if (!items.length) return [];

  const totalMetric = items.reduce((acc, item) => acc + valueAccessor(item), 0);
  const kept = items.slice(0, limit);
  const tail = items.slice(limit);

  const result = kept.map((item, idx) => {
    const val = valueAccessor(item);
    return {
      ...item,
      value: val,
      pct: totalMetric > 0 ? (val / totalMetric) * 100 : 0,
      revenuePct: totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0,
      fill: ANALYTICS_COLORS[idx % (ANALYTICS_COLORS.length - 1)],
    };
  });

  if (tail.length > 0) {
    const othersAgg = tail.reduce(
      (acc, item) => ({
        revenue: acc.revenue + item.revenue,
        quantity: acc.quantity + item.quantity,
        orders: acc.orders + item.orders,
      }),
      { revenue: 0, quantity: 0, orders: 0 }
    );
    const othersVal = valueAccessor(othersAgg);
    result.push({
      id: "__others__",
      name: `Others (${tail.length})`,
      fullName: `Others (${tail.length} items)`,
      ...othersAgg,
      value: othersVal,
      pct: totalMetric > 0 ? (othersVal / totalMetric) * 100 : 0,
      revenuePct:
        totalRevenue > 0 ? (othersAgg.revenue / totalRevenue) * 100 : 0,
      fill: ANALYTICS_COLORS[ANALYTICS_COLORS.length - 1],
    });
  }

  return result;
}

/**
 * Build human-readable chips for currently active filters.
 */
export function buildActiveFilterChips(filters = {}, options = {}, availableExecutives = []) {
  const chips = [];

  if (filters.year) {
    chips.push({ key: "year", label: "Year", value: filters.year });
  } else {
    chips.push({ key: "year", label: "Year", value: "All Years" });
  }

  if (filters.month) {
    const monthName =
      MONTH_SHORT_NAMES[Number(filters.month) - 1] || filters.month;
    chips.push({ key: "month", label: "Month", value: monthName });
  } else {
    chips.push({ key: "month", label: "Month", value: "All Months" });
  }

  if (filters.businessReference) {
    chips.push({
      key: "businessReference",
      label: "Ref",
      value: filters.businessReference,
    });
  }

  if (filters.salesExecutiveId) {
    const match = availableExecutives.find(
      (e) => String(e.id) === String(filters.salesExecutiveId)
    );
    chips.push({
      key: "salesExecutiveId",
      label: "Executive",
      value: match ? getExecutiveFirstName(match.name) : filters.salesExecutiveId,
    });
  }

  if (filters.productId) {
    const match = (options.products || []).find(
      (p) => String(p.id) === String(filters.productId)
    );
    chips.push({
      key: "productId",
      label: "Product",
      value: match?.name || filters.productId,
    });
  }

  if (filters.customerId) {
    const match = (options.customers || []).find(
      (c) => String(c.id) === String(filters.customerId)
    );
    chips.push({
      key: "customerId",
      label: "Customer",
      value: match?.name || filters.customerId,
    });
  }

  if (filters.countryId) {
    const match = (options.countries || []).find(
      (c) => String(c.id) === String(filters.countryId)
    );
    chips.push({
      key: "countryId",
      label: "Country",
      value: match?.name || filters.countryId,
    });
  }

  return chips;
}

/**
 * Derive all analytics datasets purely from the currently filtered report orders.
 */
export function computeSalesAnalytics(
  orders = [],
  filters = {},
  options = {},
  availableExecutives = []
) {
  const currencyMeta = detectCurrencyMeta(orders);

  let totalRevenue = 0;
  let totalQuantity = 0;
  const totalOrders = orders.length;

  const productMap = new Map();
  const executiveMap = new Map();
  const countryMap = new Map();
  const customerMap = new Map();

  // Month-of-year Jan..Dec for trend chart
  const monthBuckets = MONTH_SHORT_NAMES.map((label, index) => ({
    label,
    monthIndex: index + 1,
    revenue: 0,
    quantity: 0,
    orders: 0,
  }));

  // Chronological YYYY-MM buckets for MoM comparison
  const ymMap = new Map();
  // Daily buckets for single-month drill-down toggle
  const dayMap = new Map();

  orders.forEach((order) => {
    const qty = Number(order.quantity || 0);
    const rev = Number(order.salesValue || 0);

    totalQuantity += qty;
    totalRevenue += rev;

    // 1. Product grouping
    const productKey = order.productId
      ? String(order.productId)
      : order.product || "Unknown";
    const productName = order.product?.trim() || "Unknown";
    if (!productMap.has(productKey)) {
      productMap.set(productKey, {
        id: productKey,
        name: productName,
        fullName: productName,
        revenue: 0,
        quantity: 0,
        orders: 0,
      });
    }
    const prodEntry = productMap.get(productKey);
    prodEntry.revenue += rev;
    prodEntry.quantity += qty;
    prodEntry.orders += 1;

    // 2. Executive grouping (preserve full name + first name)
    const execRawName = order.salesExecutive?.trim() || "Unknown";
    const execKey = order.salesExecutiveId
      ? String(order.salesExecutiveId)
      : execRawName;
    const execDisplayName =
      execRawName === "Unknown"
        ? "Unknown"
        : getExecutiveFirstName(execRawName) || execRawName;
    if (!executiveMap.has(execKey)) {
      executiveMap.set(execKey, {
        id: execKey,
        name: execDisplayName,
        fullName: execRawName,
        revenue: 0,
        quantity: 0,
        orders: 0,
      });
    }
    const execEntry = executiveMap.get(execKey);
    execEntry.revenue += rev;
    execEntry.quantity += qty;
    execEntry.orders += 1;

    // 3. Country grouping
    const countryName = order.destination?.trim() || "Unknown";
    if (!countryMap.has(countryName)) {
      countryMap.set(countryName, {
        id: countryName,
        name: countryName,
        revenue: 0,
        quantity: 0,
        orders: 0,
      });
    }
    const countryEntry = countryMap.get(countryName);
    countryEntry.revenue += rev;
    countryEntry.quantity += qty;
    countryEntry.orders += 1;

    // 4. Customer grouping
    const customerKey = order.customerId
      ? String(order.customerId)
      : order.customer || "Unknown";
    const customerName = order.customer?.trim() || "Unknown";
    if (!customerMap.has(customerKey)) {
      customerMap.set(customerKey, {
        id: customerKey,
        name: customerName,
        fullName: customerName,
        revenue: 0,
        quantity: 0,
        orders: 0,
      });
    }
    const custEntry = customerMap.get(customerKey);
    custEntry.revenue += rev;
    custEntry.quantity += qty;
    custEntry.orders += 1;

    // 5. Date-based aggregations
    const parts = parseOrderDateParts(order.date);
    if (parts) {
      const mBucket = monthBuckets[parts.month - 1];
      if (mBucket) {
        mBucket.revenue += rev;
        mBucket.quantity += qty;
        mBucket.orders += 1;
      }

      const ymKey = `${parts.year}-${String(parts.month).padStart(2, "0")}`;
      if (!ymMap.has(ymKey)) {
        ymMap.set(ymKey, {
          key: ymKey,
          label: formatMonthKeyLabel(ymKey),
          revenue: 0,
          quantity: 0,
          orders: 0,
        });
      }
      const ymEntry = ymMap.get(ymKey);
      ymEntry.revenue += rev;
      ymEntry.quantity += qty;
      ymEntry.orders += 1;

      const dayKey = `${ymKey}-${String(parts.day).padStart(2, "0")}`;
      if (!dayMap.has(dayKey)) {
        dayMap.set(dayKey, {
          key: dayKey,
          label: `${String(parts.day).padStart(2, "0")} ${
            MONTH_SHORT_NAMES[parts.month - 1]
          }`,
          revenue: 0,
          quantity: 0,
          orders: 0,
        });
      }
      const dayEntry = dayMap.get(dayKey);
      dayEntry.revenue += rev;
      dayEntry.quantity += qty;
      dayEntry.orders += 1;
    }
  });

  // Sort collections descending by revenue (primary) then quantity
  const sortByPerformance = (a, b) =>
    b.revenue - a.revenue || b.quantity - a.quantity;

  const sortedProducts = Array.from(productMap.values()).sort(sortByPerformance);
  const sortedExecutives = Array.from(executiveMap.values()).sort(
    sortByPerformance
  );
  const sortedCountries = Array.from(countryMap.values()).sort(
    sortByPerformance
  );
  const sortedCustomers = Array.from(customerMap.values()).sort(
    sortByPerformance
  );

  // KPI calculations
  const avgSellingPrice = totalQuantity > 0 ? totalRevenue / totalQuantity : 0;
  const avgOrderQty = totalOrders > 0 ? totalQuantity / totalOrders : 0;

  const topCustomerRaw = sortedCustomers[0] || null;
  const topCustomer = topCustomerRaw
    ? {
        name: topCustomerRaw.name,
        revenue: topCustomerRaw.revenue,
        quantity: topCustomerRaw.quantity,
        orders: topCustomerRaw.orders,
        sharePct:
          totalRevenue > 0 ? (topCustomerRaw.revenue / totalRevenue) * 100 : 0,
      }
    : null;

  const topExecutiveRaw = sortedExecutives[0] || null;
  const topExecutive = topExecutiveRaw
    ? {
        name: topExecutiveRaw.name,
        fullName: topExecutiveRaw.fullName,
        revenue: topExecutiveRaw.revenue,
        quantity: topExecutiveRaw.quantity,
        orders: topExecutiveRaw.orders,
        sharePct:
          totalRevenue > 0 ? (topExecutiveRaw.revenue / totalRevenue) * 100 : 0,
      }
    : null;

  // Product Performance Table
  const productPerformanceTable = sortedProducts.map((p) => ({
    ...p,
    avgPrice: p.quantity > 0 ? p.revenue / p.quantity : 0,
    contributionPct:
      totalRevenue > 0 ? (p.revenue / totalRevenue) * 100 : 0,
  }));

  // Distributions (Product: Top 5 + Others; Customer: Top 10 + Others)
  const useRevenueForShare = totalRevenue > 0;
  const productDistribution = bucketDistribution(
    sortedProducts,
    5,
    totalRevenue,
    (item) => (useRevenueForShare ? item.revenue : item.quantity)
  );
  const customerContribution = bucketDistribution(
    sortedCustomers,
    10,
    totalRevenue,
    (item) => (useRevenueForShare ? item.revenue : item.quantity)
  );

  // Country Sales (preserve full list, top 10 shown comfortably in chart)
  const countrySales = sortedCountries.map((c) => ({
    ...c,
    pct: totalRevenue > 0 ? (c.revenue / totalRevenue) * 100 : 0,
  }));

  // Daily trend sorted chronologically
  const dailyTrend = Array.from(dayMap.values()).sort((a, b) =>
    a.key.localeCompare(b.key)
  );

  // Month-over-Month Comparison (strictly from currently filtered orders)
  const sortedMonthKeys = Array.from(ymMap.keys()).sort();
  const isSingleMonthFilter = Boolean(filters.month);
  let currentMonthKey = null;
  let previousMonthKey = null;

  if (filters.year && filters.month) {
    currentMonthKey = `${filters.year}-${String(filters.month).padStart(2, "0")}`;
    previousMonthKey = getPreviousMonthKey(currentMonthKey);
  } else if (sortedMonthKeys.length > 0) {
    currentMonthKey = sortedMonthKeys[sortedMonthKeys.length - 1];
    previousMonthKey = getPreviousMonthKey(currentMonthKey);
  }

  const currentMonthData = currentMonthKey
    ? ymMap.get(currentMonthKey) || {
        key: currentMonthKey,
        label: formatMonthKeyLabel(currentMonthKey),
        revenue: totalRevenue,
        quantity: totalQuantity,
        orders: totalOrders,
      }
    : {
        key: "",
        label: "Current Period",
        revenue: totalRevenue,
        quantity: totalQuantity,
        orders: totalOrders,
      };

  const previousMonthData = previousMonthKey ? ymMap.get(previousMonthKey) : null;
  const canCompareMom = !isSingleMonthFilter && sortedMonthKeys.length > 1;
  const prevValues = previousMonthData || {
    key: previousMonthKey || "",
    label: previousMonthKey ? formatMonthKeyLabel(previousMonthKey) : "Previous Month",
    revenue: 0,
    quantity: 0,
    orders: 0,
  };

  const monthOverMonth = {
    canCompare: canCompareMom,
    isSingleMonthFilter,
    currentLabel: currentMonthData.label,
    previousLabel: prevValues.label,
    revenue: {
      current: currentMonthData.revenue,
      previous: prevValues.revenue,
      deltaPct: canCompareMom
        ? computeDeltaPct(currentMonthData.revenue, prevValues.revenue)
        : null,
    },
    quantity: {
      current: currentMonthData.quantity,
      previous: prevValues.quantity,
      deltaPct: canCompareMom
        ? computeDeltaPct(currentMonthData.quantity, prevValues.quantity)
        : null,
    },
    orders: {
      current: currentMonthData.orders,
      previous: prevValues.orders,
      deltaPct: canCompareMom
        ? computeDeltaPct(currentMonthData.orders, prevValues.orders)
        : null,
    },
  };

  return {
    currencyMeta,
    activeFilters: buildActiveFilterChips(filters, options, availableExecutives),
    kpis: {
      totalRevenue,
      totalQuantity,
      totalOrders,
      avgSellingPrice,
      avgOrderQty,
      uniqueCustomers: customerMap.size,
      activeExecutives: executiveMap.size,
      topCustomer,
      topExecutive,
    },
    monthOverMonth,
    monthlyTrend: monthBuckets,
    dailyTrend,
    productDistribution,
    executivePerformance: sortedExecutives,
    countrySales,
    customerContribution,
    productPerformanceTable,
  };
}
