"use client";

import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '@/lib/axios';
import Pagination from '@/components/common/Pagination';
import {
  FileSpreadsheet, Filter, X, Printer,
  TrendingUp, Users, ShoppingCart, BarChart3
} from 'lucide-react';

const ITEMS_PER_PAGE = 15;

export default function SalesReportPage() {
  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    month: String(new Date().getMonth() + 1).padStart(2, '0'),
    dateRange: '',
    salesExecutiveId: '',
    productId: '',
    customerId: '',
    countryId: '',
    companyId: ''
  });

  const [options, setOptions] = useState({
    products: [],
    customers: [],
    countries: [],
    companies: []
  });

  const [data, setData] = useState({
    orders: [],
    loading: true
  });
  const [availableExecutives, setAvailableExecutives] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : null;
  const totalPages = Math.ceil(data.orders.length / ITEMS_PER_PAGE);
  const firstOrderIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageOrders = data.orders.slice(firstOrderIndex, firstOrderIndex + ITEMS_PER_PAGE);

  // Load options for filters
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [prodRes, custRes, countryRes, compRes] = await Promise.all([
          axiosInstance.get('/reports/sales/products', { params: { companyId } }),
          axiosInstance.get('/reports/sales/customers', { params: { companyId } }),
          axiosInstance.get('/reports/sales/countries', { params: { companyId } }),
          axiosInstance.get('/GetCompanies', { params: { limit: 100 } })
        ]);
        setOptions({
          products: prodRes.data || [],
          customers: custRes.data || [],
          countries: countryRes.data || [],
          companies: compRes.data?.data || []
        });
      } catch (err) {
        console.error("Failed to fetch options", err);
      }
    };
    fetchOptions();
  }, [companyId]);

  // Load report data
  useEffect(() => {
    const fetchReport = async () => {
      setData(prev => ({ ...prev, loading: true }));
      try {
        const params = { ...filters };
        if (!params.companyId) params.companyId = companyId;
        Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });

        const executiveParams = { ...params };
        delete executiveParams.salesExecutiveId;

        const [ordersRes, executivesRes] = await Promise.all([
          axiosInstance.get('/reports/sales/confirmed-orders', {
            params: { ...params, limit: 5000 }
          }),
          axiosInstance.get('/reports/sales/confirmed-orders', {
            params: { ...executiveParams, limit: 5000 }
          })
        ]);

        setData({
          orders: ordersRes.data.data || [],
          loading: false
        });
        const executiveMap = new Map();
        (executivesRes.data.data || []).forEach(order => {
          if (order.salesExecutiveId && order.salesExecutive) {
            executiveMap.set(String(order.salesExecutiveId), {
              id: order.salesExecutiveId,
              name: order.salesExecutive
            });
          }
        });
        setAvailableExecutives(Array.from(executiveMap.values()));
      } catch (error) {
        console.error("Failed to fetch report data", error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchReport();
  }, [filters, companyId]);

  const handleFilterChange = (key, value) => {
    setCurrentPage(1);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setCurrentPage(1);
    setFilters({
      year: new Date().getFullYear().toString(),
      month: String(new Date().getMonth() + 1).padStart(2, '0'),
      dateRange: '',
      salesExecutiveId: '',
      productId: '',
      customerId: '',
      countryId: '',
      companyId: ''
    });
  };

  // Calculate overall stats for the current data in the table
  const stats = useMemo(() => {
    let totalQty = 0;
    let totalBid = 0;
    let highestQty = 0;
    let highestBid = 0;
    const buyers = new Set();
    const executives = new Set();

    data.orders.forEach(o => {
      const qty = Number(o.quantity || 0);
      const bid = Number(o.salesValue || 0);

      totalQty += qty;
      totalBid += bid;
      if (qty > highestQty) highestQty = qty;
      if (bid > highestBid) highestBid = bid;
      if (o.customer) buyers.add(o.customer);
      if (o.salesExecutive) executives.add(o.salesExecutive);
    });

    return {
      totalOrders: data.orders.length,
      uniqueBuyers: buyers.size,
      activeExecutives: executives.size,
      totalQty,
      totalBid,
      highestQty,
      highestBid,
      avgQty: data.orders.length ? (totalQty / data.orders.length) : 0
    };
  }, [data.orders]);

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Order Number,Date,Customer,Executive,Product,Destination,Quantity,Value,Created By\n";
    data.orders.forEach(row => {
      const date = row.date ? new Date(row.date).toLocaleDateString() : 'N/A';
      csvContent += `${row.orderNumber || ''},${date},"${row.customer || ''}","${row.salesExecutive || ''}","${row.product || ''}","${row.destination || ''}",${row.quantity || 0},${row.salesValue || 0},"${row.salesExecutive || ''}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `monthly_sales_analysis.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderOrderRow = (o, i) => (
    <tr key={i} className="hover:bg-gray-50/80 transition-colors group">
      <td className="py-3.5 px-5 font-medium text-gray-800">{o.product || 'N/A'}</td>
      <td className="py-3.5 px-5 text-gray-600">{o.customer || 'N/A'}</td>
      <td className="py-3.5 px-5">
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50/50 text-blue-700 text-[11px] font-semibold border border-blue-100/50">
          {o.salesExecutive || 'N/A'}
        </span>
      </td>
      <td className="py-3.5 px-5 text-gray-500">{o.destination || 'N/A'}</td>
      <td className="py-3.5 px-5 text-gray-500">
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-600">{o.currency || 'N/A'}</span>
      </td>
      <td className="py-3.5 px-5 text-right font-medium text-gray-800">
        {Number(o.quantity || 0).toLocaleString()}
      </td>
      <td className="py-3.5 px-5 text-right font-medium text-gray-800">
        {Number(o.salesValue || 0).toLocaleString()}
      </td>
    </tr>
  );

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 pb-20 print:bg-white print:p-0">

      {/* Non-Printable Header & Filters */}
      <div className="p-6 pb-0 print:hidden max-w-[1400px] mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Monthly Sales Analysis</h1>
            <p className="text-gray-500 text-sm mt-1">Detailed breakdown of confirmed orders and performance.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium">
              <FileSpreadsheet className="w-4 h-4 text-green-600" /> Export CSV
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium">
              <Printer className="w-4 h-4 text-blue-600" /> Print
            </button>
          </div>
        </div>

        {/* Unified Main Container for Filters and Table */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 overflow-hidden print:border-none print:shadow-none mb-10">
          
          {/* Filters Toolbar as Table Header */}
          <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center bg-white/50 print:hidden">
            <div className="flex items-center text-gray-700 mr-2 text-sm font-semibold">
              <Filter className="w-4 h-4 mr-2 text-blue-600" /> Filters
            </div>

            <select
              value={filters.salesExecutiveId}
              onChange={e => handleFilterChange('salesExecutiveId', e.target.value)}
              className="border-none rounded-lg text-sm px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium outline-none focus:ring-0 cursor-pointer transition-colors min-w-[180px]"
            >
              <option value="">All Executives</option>
              {availableExecutives.map(exec => (
                <option key={exec.id} value={exec.id}>{exec.name}</option>
              ))}
            </select>

            <div className="h-6 w-px bg-gray-200 mx-1"></div>

            <select value={filters.year} onChange={e => handleFilterChange('year', e.target.value)} className="border-none rounded-lg text-sm px-3 py-2 bg-transparent hover:bg-gray-50 text-gray-700 font-medium outline-none focus:ring-0 cursor-pointer transition-colors">
              <option value="">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>

            <select value={filters.month} onChange={e => handleFilterChange('month', e.target.value)} className="border-none rounded-lg text-sm px-3 py-2 bg-transparent hover:bg-gray-50 text-gray-700 font-medium outline-none focus:ring-0 cursor-pointer transition-colors">
              <option value="">All Months</option>
              {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(m => (
                <option key={m} value={m}>{new Date(2000, parseInt(m) - 1, 1).toLocaleString('default', { month: 'short' })}</option>
              ))}
            </select>

            <select value={filters.productId} onChange={e => handleFilterChange('productId', e.target.value)} className="border-none rounded-lg text-sm px-3 py-2 bg-transparent hover:bg-gray-50 text-gray-700 font-medium outline-none focus:ring-0 cursor-pointer transition-colors max-w-[150px] truncate">
              <option value="">All Products</option>
              {options.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>

            <select value={filters.customerId} onChange={e => handleFilterChange('customerId', e.target.value)} className="border-none rounded-lg text-sm px-3 py-2 bg-transparent hover:bg-gray-50 text-gray-700 font-medium outline-none focus:ring-0 cursor-pointer transition-colors max-w-[150px] truncate">
              <option value="">All Customers</option>
              {options.customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <select value={filters.countryId} onChange={e => handleFilterChange('countryId', e.target.value)} className="border-none rounded-lg text-sm px-3 py-2 bg-transparent hover:bg-gray-50 text-gray-700 font-medium outline-none focus:ring-0 cursor-pointer transition-colors max-w-[150px] truncate">
              <option value="">All Countries</option>
              {options.countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <button onClick={resetFilters} className="text-sm text-gray-500 hover:text-red-600 flex items-center ml-auto transition-colors font-medium">
              <X className="w-4 h-4 mr-1" /> Reset
            </button>
          </div>

          {/* Document Header for Print */}
          <div className="mb-6 border-b-2 border-black pb-4 hidden print:block px-6 pt-6">
            <h1 className="text-2xl font-black text-black uppercase">Sales Analysis Report</h1>
            <p className="text-gray-700 mt-1 font-medium">
              Period: {filters.month ? new Date(2000, parseInt(filters.month) - 1, 1).toLocaleString('default', { month: 'long' }) : 'All Months'} {filters.year || 'All Years'}
            </p>
            <p className="text-gray-500 text-sm mt-1">Generated on {new Date().toLocaleString()}</p>
          </div>

          {data.loading ? (
            <div className="py-20 text-center text-gray-500 font-medium animate-pulse">
              Loading report data...
            </div>
          ) : data.orders.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              No confirmed orders found for the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm min-w-[1000px] print:min-w-full border-collapse">
                <thead className="bg-gray-50/80 backdrop-blur-md text-gray-500 font-medium border-b border-gray-100 text-xs tracking-widest uppercase">
                  <tr>
                    <th className="py-4 px-5 font-semibold">Product</th>
                    <th className="py-4 px-5 font-semibold">Customer</th>
                    <th className="py-4 px-5 font-semibold">Executive</th>
                    <th className="py-4 px-5 font-semibold">Country</th>
                    <th className="py-4 px-5 font-semibold">Currency</th>
                    <th className="py-4 px-5 font-semibold text-right">Qty (MT)</th>
                    <th className="py-4 px-5 font-semibold text-right">Bid / Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/50 text-gray-600 print:hidden">
                  {pageOrders.map(renderOrderRow)}
                </tbody>
                <tbody className="hidden divide-y divide-gray-50/50 text-gray-600 print:table-row-group">
                  {data.orders.map(renderOrderRow)}
                </tbody>
                {/* Standard Table Footer for Totals */}
                <tfoot className="bg-gray-50/80 backdrop-blur-md border-t border-gray-100 font-bold text-gray-900 text-sm print:bg-transparent print:border-black print:border-t-4">
                  <tr>
                    <td colSpan="5" className="py-4 px-5 text-right uppercase tracking-wider text-[11px] text-gray-400">
                      Grand Total
                    </td>
                    <td className="py-4 px-5 text-right text-blue-700 bg-blue-50/30">
                      {stats.totalQty.toLocaleString()} <span className="text-xs text-blue-500/70 font-medium">MT</span>
                    </td>
                    <td className="py-4 px-5 text-right text-emerald-700 bg-emerald-50/30">
                      {stats.totalBid.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
          {!data.loading && data.orders.length > 0 && (
            <div className="print:hidden">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={data.orders.length}
                itemsPerPage={ITEMS_PER_PAGE}
                itemName="orders"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}