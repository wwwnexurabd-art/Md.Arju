import React, { useState } from 'react';
import { 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  AlertTriangle, 
  DollarSign, 
  Package, 
  ArrowUpRight, 
  ArrowRight,
  Calendar,
  Users
} from 'lucide-react';
import { Order, Product } from '../types';

interface DashboardOverviewProps {
  orders: Order[];
  products: Product[];
  onNavigateTab: (tab: string) => void;
  onSelectOrder: (order: Order) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  orders,
  products,
  onNavigateTab,
  onSelectOrder,
}) => {
  const [trendRange, setTrendRange] = useState<'7d' | '30d'>('7d');

  // Order Counts
  const totalOrders = orders.length;
  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.date.startsWith(today)).length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const processingOrders = orders.filter(o => o.status === 'Processing').length;
  const shippedOrders = orders.filter(o => o.status === 'Shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

  // Sales calculations
  const totalSales = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  // Monthly sales (current month)
  const currentMonthStr = today.substring(0, 7);
  const monthlySales = orders
    .filter(o => o.status !== 'Cancelled' && o.date.startsWith(currentMonthStr))
    .reduce((sum, o) => sum + o.total, 0);

  // Low stock products (stock <= 5)
  const lowStockProducts = products.filter(p => p.stockCount <= 5);

  // Pending payment verification orders
  const pendingPaymentOrders = orders.filter(o => o.paymentStatus === 'Pending Verification');

  // Compute top selling products from orders
  const productSalesMap: Record<string, { product: Product; unitsSold: number; revenue: number }> = {};
  for (const o of orders) {
    if (o.status !== 'Cancelled') {
      for (const item of o.items) {
        const pId = item.product.id;
        if (!productSalesMap[pId]) {
          productSalesMap[pId] = {
            product: item.product,
            unitsSold: 0,
            revenue: 0
          };
        }
        productSalesMap[pId].unitsSold += item.quantity;
        productSalesMap[pId].revenue += (item.product.price * item.quantity);
      }
    }
  }

  const topSelling = Object.values(productSalesMap)
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);

  // Generate 7-day trend data from real orders
  const days = trendRange === '7d' ? 7 : 14;
  const trendDays: { label: string; date: string; amount: number; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
    const dayTotal = orders
      .filter(o => o.status !== 'Cancelled' && o.date.startsWith(dateStr))
      .reduce((sum, o) => sum + o.total, 0);
    const dayCount = orders
      .filter(o => o.status !== 'Cancelled' && o.date.startsWith(dateStr))
      .length;
    trendDays.push({ label: dayLabel, date: dateStr, amount: dayTotal, count: dayCount });
  }

  const maxTrendAmount = Math.max(1000, ...trendDays.map(t => t.amount));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome & Quick Links */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#F10D27] uppercase tracking-wider">Live Store Overview</span>
          <h1 className="text-xl sm:text-2xl font-black text-[#10183F] font-heading mt-0.5">
            Operational Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Real-time fulfillment metrics, sales statistics, and inventory alerts
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('orders')}
            className="bg-[#F10D27] hover:bg-[#d60a20] text-white text-xs font-bold px-4 min-h-[40px] py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Process Orders ({pendingOrders})</span>
          </button>
          <button
            onClick={() => onNavigateTab('products')}
            className="bg-[#10183F] hover:bg-slate-800 text-white text-xs font-bold px-4 min-h-[40px] py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Manage Products</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Sales */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-lg sm:text-2xl font-black text-[#10183F] font-mono tabular-nums truncate">
              ৳{totalSales.toLocaleString('en-BD')}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3 shrink-0" />
              <span className="truncate">Month: ৳{monthlySales.toLocaleString('en-BD')}</span>
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-lg sm:text-2xl font-black text-[#10183F] font-mono tabular-nums">
              {totalOrders}
            </div>
            <span className="text-[11px] text-slate-500 font-semibold mt-0.5 block">
              Today: <strong className="text-slate-800">{todayOrders}</strong> orders
            </span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Orders</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-lg sm:text-2xl font-black text-amber-600 font-mono tabular-nums">
              {pendingOrders}
            </div>
            <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">
              Requires phone verification
            </span>
          </div>
        </div>

        {/* Shipped & In Transit */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">In Transit</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-lg sm:text-2xl font-black text-purple-600 font-mono tabular-nums">
              {shippedOrders}
            </div>
            <span className="text-[11px] text-slate-500 font-semibold mt-0.5 block">
              Processing: {processingOrders}
            </span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className={`col-span-2 md:col-span-1 p-4 sm:p-5 rounded-2xl border shadow-xs flex flex-col justify-between ${
          lowStockProducts.length > 0 
            ? 'bg-rose-50/60 border-rose-200 text-rose-900' 
            : 'bg-white border-slate-200/80 text-slate-900'
        }`}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock (&le;5)</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              lowStockProducts.length > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-lg sm:text-2xl font-black font-mono tabular-nums ${
              lowStockProducts.length > 0 ? 'text-[#F10D27]' : 'text-slate-800'
            }`}>
              {lowStockProducts.length}
            </div>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-[11px] font-bold text-[#F10D27] hover:underline flex items-center gap-1 mt-0.5 cursor-pointer"
            >
              <span>Restock inventory</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Pending Payment Verification Alert Banner */}
      {pendingPaymentOrders.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300/80 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
              ৳
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950 flex flex-wrap items-center gap-2">
                <span>{pendingPaymentOrders.length} Mobile Payment(s) Awaiting Verification</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  Action Required
                </span>
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Customers have submitted bKash / Nagad Transaction IDs (TrxID) for pending orders. Verify against statements to confirm fulfillment.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('payments')}
            className="bg-[#10183F] hover:bg-slate-900 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto flex items-center gap-1.5"
          >
            <span>Open Verification Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Middle Grid: Sales Trend Chart & Order Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Trend Chart (Cols 1-8) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h3 className="font-heading font-black text-lg text-[#10183F]">Sales Revenue Trend</h3>
              <p className="text-xs text-slate-400">Daily gross turnover from confirmed customer purchases</p>
            </div>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setTrendRange('7d')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  trendRange === '7d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setTrendRange('30d')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  trendRange === '30d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                14 Days
              </button>
            </div>
          </div>

          {/* SVG Bar / Curve Graphic */}
          <div className="h-64 flex items-end gap-2 sm:gap-4 pt-6 px-2">
            {trendDays.map((td, idx) => {
              const heightPercent = Math.max(10, Math.round((td.amount / maxTrendAmount) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 bg-[#10183F] text-white text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-md">
                    <span className="font-bold">৳{td.amount.toLocaleString('en-BD')}</span>
                    <span className="text-slate-300 block">{td.count} orders</span>
                  </div>

                  {/* Bar */}
                  <div 
                    className="w-full bg-slate-100 group-hover:bg-[#F10D27] rounded-t-xl transition-all duration-300 relative overflow-hidden"
                    style={{ height: `${heightPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                  </div>

                  {/* Label */}
                  <span className="text-[10px] text-slate-400 mt-2 truncate w-full text-center group-hover:text-slate-800 font-medium">
                    {td.label.split(',')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution (Cols 9-12) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-heading font-black text-lg text-[#10183F]">Order Breakdown</h3>
              <p className="text-xs text-slate-400">Current lifecycle states across all orders</p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Pending</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{pendingOrders} ({Math.round((pendingOrders / (totalOrders || 1)) * 100)}%)</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Processing</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{processingOrders}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span>Shipped</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{shippedOrders}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Delivered</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{deliveredOrders}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>Cancelled</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{cancelledOrders}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('orders')}
              className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#10183F] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Full Order Management</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Top Selling Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Selling Products (Cols 1-6) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="font-heading font-black text-lg text-[#10183F]">Top-Selling Products</h3>
            <button onClick={() => onNavigateTab('products')} className="text-xs font-bold text-[#F10D27] hover:underline">
              View All
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {topSelling.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No sales recorded yet.</p>
            ) : (
              topSelling.map((ts, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-400 w-4">{idx + 1}</span>
                    <img src={ts.product.image} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{ts.product.name}</h4>
                      <span className="text-[11px] text-slate-400">{ts.product.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-xs text-slate-900 block">{ts.unitsSold} units</span>
                    <span className="text-[11px] font-mono text-[#F10D27] font-semibold">৳{ts.revenue.toLocaleString('en-BD')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders (Cols 7-12) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="font-heading font-black text-lg text-[#10183F]">Recent Customer Orders</h3>
            <button onClick={() => onNavigateTab('orders')} className="text-xs font-bold text-[#F10D27] hover:underline">
              Manage Orders
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {orders.slice(0, 5).map((ord) => (
              <div 
                key={ord.id} 
                onClick={() => onSelectOrder(ord)}
                className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/60 p-2 rounded-xl transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#10183F]">{ord.orderNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      ord.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      ord.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-600 block mt-0.5">
                    {ord.shippingAddress.fullName} · {ord.shippingAddress.thana}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-xs text-[#F10D27] block">
                    ৳{ord.total.toLocaleString('en-BD')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(ord.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
