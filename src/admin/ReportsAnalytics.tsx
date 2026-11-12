import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  Package, 
  Tag, 
  Printer, 
  Calendar, 
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { Order, Product } from '../types';

interface ReportsAnalyticsProps {
  orders: Order[];
  products: Product[];
  token: string;
}

export const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({
  orders,
  products,
  token,
}) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports/analytics', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [orders, token]);

  if (loading || !analytics) {
    return <div className="p-8 text-center text-slate-400">Loading financial reports...</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  const statusList = Object.entries(analytics.statusCounts || {});
  const categoryList = Object.entries(analytics.categorySales || {}).sort((a: any, b: any) => b[1] - a[1]);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#10183F] font-heading">
            Executive Financial & Performance Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Accounting breakdown distinguishing Gross Merchandise Value (GMV), discounts, delivery, and Net Turnover
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="bg-[#10183F] hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print Statement</span>
        </button>
      </div>

      {/* Accounting Breakdown Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Gross Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Merchandise Value</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-1 tabular-nums">
            ৳{analytics.grossSales.toLocaleString('en-BD')}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Sum of item retail prices</span>
        </div>

        {/* Delivery Charges Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Delivery Logistics Collected</span>
          <div className="text-xl sm:text-2xl font-black text-blue-600 font-mono mt-1 tabular-nums">
            ৳{analytics.totalDeliveryCollected.toLocaleString('en-BD')}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Shipping fees paid by clients</span>
        </div>

        {/* Discounts Granted */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Discounts & Coupons</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 font-mono mt-1 tabular-nums">
            -৳{analytics.totalDiscounts.toLocaleString('en-BD')}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Promotional reductions</span>
        </div>

        {/* Refunds */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Refunds Recorded</span>
          <div className="text-xl sm:text-2xl font-black text-rose-600 font-mono mt-1 tabular-nums">
            -৳{analytics.refundedAmount.toLocaleString('en-BD')}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Returns / cancellations</span>
        </div>

        {/* Net Revenue */}
        <div className="bg-[#10183F] text-white p-5 rounded-2xl shadow-md col-span-2 md:col-span-1">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Net Realized Revenue</span>
          <div className="text-xl sm:text-2xl font-black text-[#F10D27] font-mono mt-1 tabular-nums">
            ৳{analytics.netRevenue.toLocaleString('en-BD')}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Net recognized inflows</span>
        </div>
      </div>

      {/* Middle Grid: Category Breakdown & Orders by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Revenue Distribution (Cols 1-7) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-heading font-black text-base text-[#10183F] pb-3 border-b border-slate-100 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#F10D27]" />
            <span>Revenue by Product Category</span>
          </h3>

          <div className="space-y-3 pt-2">
            {categoryList.map(([cat, amount]: any, idx) => {
              const pct = analytics.grossSales > 0 ? Math.round((amount / analytics.grossSales) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{cat}</span>
                    <span className="font-mono text-slate-900">৳{amount.toLocaleString('en-BD')} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-[#10183F] h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.max(5, pct)}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Fulfillment Distribution (Cols 8-12) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-heading font-black text-base text-[#10183F] pb-3 border-b border-slate-100 flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600" />
            <span>Fulfillment Pipeline Status</span>
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            {statusList.map(([st, count]: any, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <span className="font-bold text-slate-800">{st}</span>
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {count} orders
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Asset Valuation */}
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-[#10183F]">Current Inventory Valuation (Stock Asset)</h4>
          <p className="text-xs text-slate-500">Total estimated asset liquidation value of all products currently held in warehouse.</p>
        </div>
        <div className="font-mono font-black text-2xl text-[#10183F]">
          ৳{analytics.inventoryValuation.toLocaleString('en-BD')}
        </div>
      </div>
    </div>
  );
};
