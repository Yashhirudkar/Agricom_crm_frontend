"use client";

import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '@/lib/axios';
import { 
  FileSpreadsheet, FileText, Filter, X, Printer
} from 'lucide-react';

export default function SalesReportPage() {
  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    month: '',
    dateRange: '',
    salesExecutiveId: '',
    productId: '',
    customerId: '',
    countryId: '',
    companyId: ''
  });

  const [options, setOptions] = useState({
    executives: [],
    products: [],
    customers: [],
    countries: [],
    companies: []
  });

  const [data, setData] = useState({
    summary: null,
    executives: [],
    products: [],
    countries: [],
    orders: [],
    loading: true
  });

  const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : null;

  // Load options for filters
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [execRes, prodRes, custRes, countryRes, compRes] = await Promise.all([
          axiosInstance.get('/reports/sales/executives', { params: { companyId } }),
          axiosInstance.get('/reports/sales/products', { params: { companyId } }),
          axiosInstance.get('/reports/sales/customers', { params: { companyId } }),
          axiosInstance.get('/reports/sales/countries', { params: { companyId } }),
          axiosInstance.get('/GetCompanies', { params: { limit: 100 } })
        ]);
        setOptions({
          executives: execRes.data || [],
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

        const [sumRes, execRes, prodRes, ctryRes, ordRes] = await Promise.all([
          axiosInstance.get('/reports/sales/summary', { params }),
          axiosInstance.get('/reports/sales/executives', { params }),
          axiosInstance.get('/reports/sales/products', { params }),
          axiosInstance.get('/reports/sales/countries', { params }),
          axiosInstance.get('/reports/sales/orders', { params: { ...params, limit: 5000 } })
        ]);

        setData({
          summary: sumRes.data,
          executives: execRes.data,
          products: prodRes.data,
          countries: ctryRes.data,
          orders: ordRes.data.data || [],
          loading: false
        });
      } catch (error) {
        console.error("Failed to fetch report data", error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchReport();
  }, [filters, companyId]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      year: new Date().getFullYear().toString(),
      month: '',
      dateRange: '',
      salesExecutiveId: '',
      productId: '',
      customerId: '',
      countryId: '',
      companyId: ''
    });
  };

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Order Number,Date,Customer,Executive,Product,Destination,Quantity,Value\n";
    data.orders.forEach(row => {
      csvContent += `${row.orderNumber},${new Date(row.date).toLocaleDateString()},"${row.customer}","${row.salesExecutive}","${row.product}","${row.destination}",${row.quantity},${row.salesValue}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "monthly_sales_analysis.csv");
    document.body.appendChild(link);
    link.click();
  };

  const { groupedExecutives, grandTotalBuyers } = useMemo(() => {
    const grouped = {};
    const allBuyers = new Set();
    
    data.orders.forEach(o => {
      const execName = o.salesExecutive || 'Unknown Executive';
      if (!grouped[execName]) {
        grouped[execName] = {
          name: execName,
          orders: [],
          buyers: new Set(),
          totalQuantity: 0,
          totalBid: 0,
          highestQty: 0,
          highestBid: 0,
        };
      }
      const g = grouped[execName];
      g.orders.push(o);
      if (o.customer) {
          g.buyers.add(o.customer);
          allBuyers.add(o.customer);
      }
      g.totalQuantity += Number(o.quantity || 0);
      g.totalBid += Number(o.salesValue || 0);
      if (o.quantity > g.highestQty) g.highestQty = Number(o.quantity);
      if (o.salesValue > g.highestBid) g.highestBid = Number(o.salesValue);
    });

    const execArray = Object.values(grouped).map(g => ({
      ...g,
      uniqueBuyers: g.buyers.size,
      averageBid: g.orders.length ? g.totalBid / g.orders.length : 0
    })).sort((a, b) => b.totalBid - a.totalBid);

    return { groupedExecutives: execArray, grandTotalBuyers: allBuyers.size };
  }, [data.orders]);

  const totalProductQuantity = useMemo(() => {
    return data.products.reduce((acc, p) => acc + Number(p.totalQuantity || 0), 0);
  }, [data.products]);

  return (
    <div className="bg-gray-100 min-h-screen text-gray-800 pb-20 print:bg-white print:p-0">
      
      {/* Non-Printable Header & Filters */}
      <div className="p-6 pb-0 print:hidden">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Monthly Sales Analysis</h1>
            <p className="text-gray-500 text-sm mt-1">Detailed breakdown of confirmed orders by sales executive.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium">
              <FileSpreadsheet className="w-4 h-4 text-green-600" /> Export Excel
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium">
              <Printer className="w-4 h-4 text-blue-600" /> Print / PDF
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-3 items-center">
          <div className="flex items-center text-gray-500 mr-2 text-sm font-medium"><Filter className="w-4 h-4 mr-2" /> Filters</div>
          
          <select value={filters.year} onChange={e => handleFilterChange('year', e.target.value)} className="border-gray-200 border rounded-lg text-sm px-3 py-2 bg-gray-50 outline-none focus:border-blue-500">
            <option value="">All Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>

          <select value={filters.month} onChange={e => handleFilterChange('month', e.target.value)} className="border-gray-200 border rounded-lg text-sm px-3 py-2 bg-gray-50 outline-none focus:border-blue-500">
            <option value="">All Months</option>
            {['01','02','03','04','05','06','07','08','09','10','11','12'].map(m => (
               <option key={m} value={m}>{new Date(2000, parseInt(m)-1, 1).toLocaleString('default', { month: 'short' })}</option>
            ))}
          </select>

          {/* Optional: Date Range Input */}
          <input 
             type="text" 
             placeholder="YYYY-MM-DD,YYYY-MM-DD"
             value={filters.dateRange} 
             onChange={e => handleFilterChange('dateRange', e.target.value)} 
             className="border-gray-200 border rounded-lg text-sm px-3 py-2 bg-gray-50 outline-none focus:border-blue-500 w-44"
             title="Format: YYYY-MM-DD,YYYY-MM-DD"
          />

          <select value={filters.salesExecutiveId} onChange={e => handleFilterChange('salesExecutiveId', e.target.value)} className="border-gray-200 border rounded-lg text-sm px-3 py-2 bg-gray-50 outline-none focus:border-blue-500 max-w-[150px] truncate">
            <option value="">All Executives</option>
            {options.executives.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>

          <select value={filters.productId} onChange={e => handleFilterChange('productId', e.target.value)} className="border-gray-200 border rounded-lg text-sm px-3 py-2 bg-gray-50 outline-none focus:border-blue-500 max-w-[150px] truncate">
            <option value="">All Products</option>
            {options.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <select value={filters.customerId} onChange={e => handleFilterChange('customerId', e.target.value)} className="border-gray-200 border rounded-lg text-sm px-3 py-2 bg-gray-50 outline-none focus:border-blue-500 max-w-[150px] truncate">
            <option value="">All Customers</option>
            {options.customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select value={filters.countryId} onChange={e => handleFilterChange('countryId', e.target.value)} className="border-gray-200 border rounded-lg text-sm px-3 py-2 bg-gray-50 outline-none focus:border-blue-500 max-w-[150px] truncate">
            <option value="">All Countries</option>
            {options.countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          
          {options.companies.length > 0 && (
            <select value={filters.companyId} onChange={e => handleFilterChange('companyId', e.target.value)} className="border-gray-200 border rounded-lg text-sm px-3 py-2 bg-gray-50 outline-none focus:border-blue-500 max-w-[150px] truncate">
              <option value="">All Companies</option>
              {options.companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}

          <button onClick={resetFilters} className="text-sm text-gray-500 hover:text-red-500 flex items-center ml-auto transition-colors">
            <X className="w-4 h-4 mr-1" /> Reset
          </button>
        </div>
      </div>

      {/* Printable Report Container */}
      <div className="max-w-[1200px] mx-auto bg-white min-h-screen p-8 shadow-sm print:shadow-none print:p-0 print:m-0">
        
        {/* Document Header for Print */}
        <div className="mb-8 border-b-2 border-gray-800 pb-4 hidden print:block">
           <h1 className="text-3xl font-black text-gray-900 uppercase">Monthly Sales Analysis</h1>
           <p className="text-gray-600 mt-2 font-medium">
             Period: {filters.month ? new Date(2000, parseInt(filters.month)-1, 1).toLocaleString('default', { month: 'long' }) : 'All Months'} {filters.year || 'All Years'}
           </p>
           <p className="text-gray-500 text-sm">Generated on {new Date().toLocaleString()}</p>
        </div>

        {data.loading ? (
           <div className="py-20 text-center text-gray-500 font-medium animate-pulse print:hidden">Loading report data...</div>
        ) : groupedExecutives.length === 0 ? (
           <div className="py-20 text-center text-gray-500">No confirmed orders found for the selected filters.</div>
        ) : (
          <div className="space-y-16">
            {/* Executive Sections */}
            {groupedExecutives.map((exec, idx) => (
              <div key={idx} className="break-inside-avoid print:break-after-auto">
                {/* Executive Header */}
                <div className="bg-gray-100 p-3 mb-4 border-l-4 border-blue-600 print:bg-gray-100 print:border-black">
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-wider">{exec.name}</h2>
                </div>

                {/* Orders Table */}
                <div className="mb-4">
                  <table className="w-full text-left text-sm text-gray-800 border border-gray-300">
                    <thead className="bg-gray-100 text-gray-700 font-bold border-b-2 border-gray-300">
                      <tr>
                        <th className="py-2 px-3 border-r border-gray-300">Product</th>
                        <th className="py-2 px-3 border-r border-gray-300">Partner</th>
                        <th className="py-2 px-3 border-r border-gray-300 text-right">Qty (MT)</th>
                        <th className="py-2 px-3 border-r border-gray-300 text-right">Bid / Price</th>
                        <th className="py-2 px-3 border-r border-gray-300">Currency</th>
                        <th className="py-2 px-3">Country</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {exec.orders.map((o, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="py-2 px-3 border-r border-gray-300">{o.product}</td>
                          <td className="py-2 px-3 border-r border-gray-300 font-medium text-gray-900">{o.customer}</td>
                          <td className="py-2 px-3 border-r border-gray-300 text-right">{Number(o.quantity).toLocaleString()}</td>
                          <td className="py-2 px-3 border-r border-gray-300 text-right">{Number(o.salesValue).toLocaleString()}</td>
                          <td className="py-2 px-3 border-r border-gray-300">{o.currency}</td>
                          <td className="py-2 px-3">{o.destination}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-bold text-gray-900 border-t-2 border-gray-400">
                      <tr>
                        <td className="py-3 px-3 border-r border-gray-300 uppercase">Total</td>
                        <td className="py-3 px-3 border-r border-gray-300">{exec.uniqueBuyers} Buyers / {exec.orders.length} Orders</td>
                        <td className="py-3 px-3 border-r border-gray-300 text-right">{Number(exec.totalQuantity).toLocaleString()} MT</td>
                        <td className="py-3 px-3 border-r border-gray-300 text-right">{Number(exec.totalBid).toLocaleString()}</td>
                        <td className="py-3 px-3 border-r border-gray-300">-</td>
                        <td className="py-3 px-3">-</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ))}

            {/* Page Break for Print */}
            <div className="print:break-before-page"></div>

            {/* Complete Sales Analysis */}
            {data.summary && (
              <div className="break-inside-avoid">
                <div className="bg-gray-100 p-3 mb-6 border-l-4 border-gray-800 print:bg-gray-100 print:border-black">
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-wider">COMPANY SALES SUMMARY</h2>
                </div>
                
                <div className="bg-gray-50 border border-gray-300 p-5 font-medium text-gray-800 text-sm w-full md:w-2/3 lg:w-1/2 mb-10 print:bg-white print:border-gray-400">
                   <div className="grid grid-cols-2 gap-y-3">
                     <div className="text-gray-600">Grand Total Orders</div>
                     <div className="font-bold">: {data.orders.length}</div>
                     
                     <div className="text-gray-600">Grand Total Buyers</div>
                     <div className="font-bold">: {grandTotalBuyers}</div>
                     
                     <div className="text-gray-600">Grand Total Quantity</div>
                     <div className="font-bold">: {Number(data.summary.totalQuantity).toLocaleString()} MT</div>
                     
                     <div className="text-gray-600">Grand Total Price Value</div>
                     <div className="font-bold">: {Number(data.summary.totalValue).toLocaleString()}</div>
                     
                     <div className="text-gray-600">Average Order Quantity</div>
                     <div className="font-bold">: {data.summary.averageOrderSize ? data.summary.averageOrderSize.toFixed(2) : 0} MT</div>
                     
                     <div className="text-gray-600">Highest Order Quantity</div>
                     <div className="font-bold">: {data.summary.largestOrder} MT</div>
                     
                     <div className="text-gray-600">Highest Order Price</div>
                     <div className="font-bold">: {groupedExecutives.length > 0 ? Math.max(...groupedExecutives.map(e => e.highestBid)).toLocaleString() : 0}</div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Product Analysis */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 uppercase mb-3 border-b border-gray-200 pb-2">Product Analysis</h3>
                    <table className="w-full text-left text-sm border border-gray-200">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="py-2 px-3 border-b border-gray-200 font-semibold">Product</th>
                          <th className="py-2 px-3 border-b border-gray-200 font-semibold text-right">Total Qty</th>
                          <th className="py-2 px-3 border-b border-gray-200 font-semibold text-right">%</th>
                          <th className="py-2 px-3 border-b border-gray-200 font-semibold text-right">Total Bid</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.products.map((p, i) => {
                          const percentage = totalProductQuantity > 0 ? ((p.totalQuantity / totalProductQuantity) * 100).toFixed(1) : 0;
                          return (
                            <tr key={i} className="border-b border-gray-100">
                              <td className="py-2 px-3 font-medium text-gray-800">{p.name}</td>
                              <td className="py-2 px-3 text-right">{Number(p.totalQuantity).toLocaleString()} MT</td>
                              <td className="py-2 px-3 text-right text-gray-500">{percentage}%</td>
                              <td className="py-2 px-3 text-right font-medium">${Number(p.totalValue).toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Country Analysis */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 uppercase mb-3 border-b border-gray-200 pb-2">Country Analysis</h3>
                    <table className="w-full text-left text-sm border border-gray-200">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="py-2 px-3 border-b border-gray-200 font-semibold">Country</th>
                          <th className="py-2 px-3 border-b border-gray-200 font-semibold text-center">Orders</th>
                          <th className="py-2 px-3 border-b border-gray-200 font-semibold text-right">Quantity</th>
                          <th className="py-2 px-3 border-b border-gray-200 font-semibold text-right">Bid Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.countries.map((c, i) => (
                          <tr key={i} className="border-b border-gray-100">
                            <td className="py-2 px-3 font-medium text-gray-800">{c.name}</td>
                            <td className="py-2 px-3 text-center">{c.ordersCount}</td>
                            <td className="py-2 px-3 text-right">{Number(c.totalQuantity).toLocaleString()} MT</td>
                            <td className="py-2 px-3 text-right font-medium">${Number(c.totalValue).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Executive Summary Table */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900 uppercase mb-3 border-b border-gray-200 pb-2">Executive Summary</h3>
                  <table className="w-full text-left text-sm border border-gray-200">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="py-2 px-3 border-b border-gray-200 font-semibold">Executive</th>
                        <th className="py-2 px-3 border-b border-gray-200 font-semibold text-center">Buyers</th>
                        <th className="py-2 px-3 border-b border-gray-200 font-semibold text-center">Orders</th>
                        <th className="py-2 px-3 border-b border-gray-200 font-semibold text-right">Quantity</th>
                        <th className="py-2 px-3 border-b border-gray-200 font-semibold text-right">Bid Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.executives.map((e, i) => {
                        // find unique buyers from grouped data since backend executives API doesn't compute unique buyers
                        const g = groupedExecutives.find(gx => gx.name === e.name);
                        const uniqueBuyers = g ? g.uniqueBuyers : 0;
                        return (
                          <tr key={i} className="border-b border-gray-100">
                            <td className="py-2 px-3 font-bold text-gray-900">{e.name}</td>
                            <td className="py-2 px-3 text-center">{uniqueBuyers}</td>
                            <td className="py-2 px-3 text-center">{e.confirmedOrders}</td>
                            <td className="py-2 px-3 text-right text-blue-700 font-medium">{Number(e.totalQuantity).toLocaleString()} MT</td>
                            <td className="py-2 px-3 text-right text-green-700 font-medium">${Number(e.totalValue).toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
