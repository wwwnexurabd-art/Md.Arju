import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Boxes, 
  Tag, 
  Truck, 
  LayoutTemplate, 
  BarChart3, 
  ShieldCheck, 
  LogOut, 
  ArrowLeft, 
  Menu, 
  X,
  Bell,
  ExternalLink,
  CreditCard
} from 'lucide-react';
import { Product, Order } from '../types';
import { DashboardOverview } from './DashboardOverview';
import { ProductManagement } from './ProductManagement';
import { OrderManagement } from './OrderManagement';
import { CustomerManagement } from './CustomerManagement';
import { InventoryManagement } from './InventoryManagement';
import { CouponManagement } from './CouponManagement';
import { DeliverySettingsView } from './DeliverySettingsView';
import { CMSManagement } from './CMSManagement';
import { ReportsAnalytics } from './ReportsAnalytics';
import { AuditLogsView } from './AuditLogsView';
import { InvoiceModal } from './InvoiceModal';

interface AdminLayoutProps {
  user: any;
  token: string;
  onLogout: () => void;
  onExitToStore: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  token,
  onLogout,
  onExitToStore,
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Live state from server
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Inspector modal states
  const [printOrder, setPrintOrder] = useState<Order | null>(null);
  const [selectedOrderForInspection, setSelectedOrderForInspection] = useState<Order | null>(null);

  const fetchAllData = async () => {
    try {
      const [prodRes, ordRes, custRes, invRes, coupRes] = await Promise.all([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/orders', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
        fetch('/api/customers', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
        fetch('/api/inventory', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
        fetch('/api/coupons', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json())
      ]);

      setProducts(Array.isArray(prodRes) ? prodRes : []);
      setOrders(Array.isArray(ordRes) ? ordRes : []);
      setCustomers(Array.isArray(custRes) ? custRes : []);
      setInventoryLogs(invRes?.recentLogs || []);
      setCoupons(Array.isArray(coupRes) ? coupRes : []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  const pendingPaymentCount = orders.filter(
    o => o.paymentStatus === 'Pending Verification' || 
    (o.paymentMethod !== 'cod' && (!o.paymentStatus || o.paymentStatus === 'Awaiting Payment'))
  ).length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingBag, badge: orders.filter(o => o.status === 'Pending').length },
    { id: 'payments', label: 'Payment Verification', icon: CreditCard, alert: pendingPaymentCount > 0 ? `${pendingPaymentCount} pending` : undefined },
    { id: 'products', label: 'Products & Catalog', icon: Package },
    { id: 'inventory', label: 'Inventory & Restock', icon: Boxes, alert: products.filter(p => p.stockCount <= 5).length ? `${products.filter(p => p.stockCount <= 5).length} low` : undefined },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'coupons', label: 'Coupons & Deals', icon: Tag },
    { id: 'delivery', label: 'Delivery Zones & Pricing', icon: Truck },
    { id: 'cms', label: 'Storefront CMS', icon: LayoutTemplate },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'audit', label: 'Staff & Audit Logs', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col lg:flex-row text-slate-900 font-sans">
      {/* Mobile / Tablet Portrait Header */}
      <div className="lg:hidden bg-[#10183F] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg bg-white/10 text-white cursor-pointer"
            aria-label="Open admin menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-heading font-black text-lg text-white">
            NEXURA<span className="text-[#F10D27]">.ADMIN</span>
          </span>
        </div>

        <button
          onClick={onExitToStore}
          className="text-xs font-bold text-white/80 hover:text-white flex items-center gap-1 min-h-[40px] px-2 cursor-pointer"
        >
          <span>Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mobile / Tablet Portrait Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 lg:w-64 xl:w-72 shrink-0 bg-[#10183F] text-white flex flex-col justify-between transition-transform duration-300 shadow-2xl lg:shadow-none lg:static lg:translate-x-0
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Brand Header */}
          <div className="p-5 xl:p-6 pb-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src="/images/logo-icon.png"
                  alt="NEXURA.BD"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <span className="font-heading font-black text-xl text-white tracking-tight block leading-tight">
                  NEXURA<span className="text-[#F10D27]">.BD</span>
                </span>
                <span className="text-[9px] tracking-widest font-bold text-slate-400 uppercase">
                  MANAGEMENT ENGINE
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              aria-label="Close admin menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Admin Profile Card */}
          <div className="p-3.5 xl:p-4 mx-3.5 xl:mx-4 my-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">{user.name}</span>
              <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase mt-1 ${
                user.role === 'super_admin' ? 'bg-[#F10D27] text-white' :
                user.role === 'store_manager' ? 'bg-blue-500 text-white' :
                'bg-emerald-600 text-white'
              }`}>
                {user.role.replace('_', ' ')}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="min-w-[38px] min-h-[38px] flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-white/10 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 max-h-[calc(100dvh-260px)] overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 min-h-[42px] py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#F10D27] text-white shadow-md shadow-red-900/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-white text-[#10183F] shrink-0">
                      {item.badge}
                    </span>
                  ) : null}

                  {item.alert ? (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-amber-400 text-slate-900 shrink-0 whitespace-nowrap">
                      {item.alert}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Storefront Exit */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onExitToStore}
            className="w-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs min-h-[42px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Live Storefront</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-3.5 sm:p-5 lg:p-6 xl:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading store dashboard...</div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <DashboardOverview
                orders={orders}
                products={products}
                onNavigateTab={setActiveTab}
                onSelectOrder={(ord) => {
                  setSelectedOrderForInspection(ord);
                  setActiveTab('orders');
                }}
              />
            )}

            {activeTab === 'products' && (
              <ProductManagement
                products={products}
                onRefresh={fetchAllData}
                token={token}
                adminRole={user.role}
              />
            )}

            {activeTab === 'orders' && (
              <OrderManagement
                orders={orders}
                onRefresh={fetchAllData}
                token={token}
                adminRole={user.role}
                onPrintInvoice={(ord) => setPrintOrder(ord)}
                selectedOrder={selectedOrderForInspection}
                onClearSelectedOrder={() => setSelectedOrderForInspection(null)}
                initialViewMode="all"
              />
            )}

            {activeTab === 'payments' && (
              <OrderManagement
                orders={orders}
                onRefresh={fetchAllData}
                token={token}
                adminRole={user.role}
                onPrintInvoice={(ord) => setPrintOrder(ord)}
                selectedOrder={selectedOrderForInspection}
                onClearSelectedOrder={() => setSelectedOrderForInspection(null)}
                initialViewMode="verification"
              />
            )}

            {activeTab === 'customers' && (
              <CustomerManagement
                customers={customers}
                onRefresh={fetchAllData}
                token={token}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryManagement
                products={products}
                inventoryLogs={inventoryLogs}
                onRefresh={fetchAllData}
                token={token}
                adminRole={user.role}
              />
            )}

            {activeTab === 'coupons' && (
              <CouponManagement
                coupons={coupons}
                onRefresh={fetchAllData}
                token={token}
                adminRole={user.role}
              />
            )}

            {activeTab === 'delivery' && (
              <DeliverySettingsView
                token={token}
                adminRole={user.role}
                onRefresh={fetchAllData}
              />
            )}

            {activeTab === 'cms' && (
              <CMSManagement
                token={token}
                adminRole={user.role}
                onRefresh={fetchAllData}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsAnalytics
                orders={orders}
                products={products}
                token={token}
              />
            )}

            {activeTab === 'audit' && (
              <AuditLogsView
                token={token}
                adminRole={user.role}
              />
            )}
          </>
        )}
      </main>

      {/* Printable Invoice Modal */}
      <InvoiceModal
        order={printOrder}
        onClose={() => setPrintOrder(null)}
      />
    </div>
  );
};
