import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  Eye, 
  MapPin, 
  Phone, 
  User, 
  AlertCircle, 
  Calendar,
  CreditCard,
  X,
  History,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { Order, OrderPaymentStatus, OrderFulfillmentStatus } from '../types';

interface OrderManagementProps {
  orders: Order[];
  onRefresh: () => void;
  token: string;
  adminRole: string;
  onPrintInvoice: (order: Order) => void;
  selectedOrder?: Order | null;
  onClearSelectedOrder?: () => void;
  initialViewMode?: 'all' | 'verification';
}

export const OrderManagement: React.FC<OrderManagementProps> = ({
  orders,
  onRefresh,
  token,
  adminRole,
  onPrintInvoice,
  selectedOrder: initialSelectedOrder,
  onClearSelectedOrder,
  initialViewMode = 'all',
}) => {
  const [viewMode, setViewMode] = useState<'all' | 'verification'>(initialViewMode);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(initialSelectedOrder || null);
  const [statusNote, setStatusNote] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [copiedTrx, setCopiedTrx] = useState<string | null>(null);

  // Rejection modal prompt state
  const [rejectingOrder, setRejectingOrder] = useState<Order | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const canManagePayment = adminRole === 'super_admin' || adminRole === 'store_manager' || adminRole === 'order_staff';

  const pendingVerificationCount = orders.filter(
    o => o.paymentStatus === 'Pending Verification' || 
    (o.paymentMethod !== 'cod' && (!o.paymentStatus || o.paymentStatus === 'Awaiting Payment'))
  ).length;

  const handleCopyTrx = (trx: string) => {
    navigator.clipboard.writeText(trx);
    setCopiedTrx(trx);
    setTimeout(() => setCopiedTrx(null), 2000);
  };

  const handleUpdateStatus = async (orderNumber: string, nextStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderNumber}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus, note: statusNote })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update order status');
      }

      const updated = await res.json();
      setActiveOrder(updated);
      setStatusNote('');
      setActionMsg(`Order ${orderNumber} updated to ${nextStatus}`);
      setTimeout(() => setActionMsg(''), 4000);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleVerifyPayment = async (orderNumber: string, status: 'Payment Verified' | 'Payment Rejected', note?: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderNumber}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, note })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update payment status');
      }

      const updated = await res.json();
      setActiveOrder(updated);
      setPaymentNote('');
      setRejectingOrder(null);
      setRejectionReason('');
      setActionMsg(`Order ${orderNumber} payment marked as "${status}"`);
      setTimeout(() => setActionMsg(''), 4000);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleManualPaymentStatus = async (orderNumber: string, nextPaymentStatus: string) => {
    if (!confirm(`Confirm changing payment status of ${orderNumber} to "${nextPaymentStatus}"?`)) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderNumber}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus: nextPaymentStatus, note: paymentNote })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update payment status');
      }

      const updated = await res.json();
      setActiveOrder(updated);
      setPaymentNote('');
      setActionMsg(`Payment status updated to ${nextPaymentStatus}`);
      setTimeout(() => setActionMsg(''), 4000);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const exportCSV = () => {
    const headers = [
      'Order Number', 
      'Date', 
      'Customer Name', 
      'Phone', 
      'Thana', 
      'District', 
      'Total (BDT)', 
      'Payment Method', 
      'Payment Status', 
      'Transaction ID', 
      'Sender Mobile', 
      'Fulfillment Status'
    ];
    const rows = filteredOrders.map(o => [
      o.orderNumber,
      new Date(o.date).toLocaleDateString(),
      `"${o.shippingAddress.fullName.replace(/"/g, '""')}"`,
      o.shippingAddress.phone,
      `"${o.shippingAddress.thana}"`,
      `"${o.shippingAddress.district}"`,
      o.total,
      o.paymentMethod.toUpperCase(),
      o.paymentStatus || 'Unpaid',
      o.transactionId || 'N/A',
      o.senderNumber || o.shippingAddress.phone,
      o.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexura_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter(o => {
    // If in verification view, restrict to mobile payment orders or pending verification
    if (viewMode === 'verification') {
      const isMobilePayment = o.paymentMethod === 'bkash' || o.paymentMethod === 'nagad';
      const isPendingVerif = o.paymentStatus === 'Pending Verification' || o.paymentStatus === 'Awaiting Payment';
      if (!isMobilePayment && !isPendingVerif) return false;
    }

    const q = searchTerm.toLowerCase();
    const matchSearch = 
      o.orderNumber.toLowerCase().includes(q) ||
      o.shippingAddress.fullName.toLowerCase().includes(q) ||
      o.shippingAddress.phone.includes(q) ||
      (o.transactionId && o.transactionId.toLowerCase().includes(q)) ||
      (o.senderNumber && o.senderNumber.includes(q));

    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchPayment = paymentFilter === 'all' || o.paymentStatus === paymentFilter;
    const matchDate = !dateFilter || o.date.startsWith(dateFilter);
    return matchSearch && matchStatus && matchPayment && matchDate;
  });

  const statuses: OrderFulfillmentStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-[#10183F] font-heading flex items-center gap-2">
            <span>Order & Payment Management</span>
            {pendingVerificationCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                {pendingVerificationCount} Pending Payment Verification
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            bKash & Nagad manual payment reconciliation, TrxID validation, and order fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={exportCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* View Switcher Tabs: All Orders vs Payment Verification */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-200/60 p-1.5 rounded-2xl w-full sm:w-fit">
        <button
          onClick={() => {
            setViewMode('all');
            setPaymentFilter('all');
          }}
          className={`flex-1 sm:flex-initial px-4 min-h-[40px] py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            viewMode === 'all'
              ? 'bg-white text-[#10183F] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4 shrink-0" />
          <span>All Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => {
            setViewMode('verification');
            setPaymentFilter('all');
          }}
          className={`flex-1 sm:flex-initial px-4 min-h-[40px] py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            viewMode === 'verification'
              ? 'bg-[#10183F] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4 shrink-0" />
          <span>bKash & Nagad Verification</span>
          {pendingVerificationCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F10D27] text-white">
              {pendingVerificationCount}
            </span>
          )}
        </button>
      </div>

      {/* Verification Stat Highlights (When in verification view) */}
      {viewMode === 'verification' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Mobile Orders</span>
            <p className="text-xl font-black font-mono text-[#10183F] mt-1">
              {orders.filter(o => o.paymentMethod === 'bkash' || o.paymentMethod === 'nagad').length}
            </p>
          </div>
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Pending Verification</span>
            <p className="text-xl font-black font-mono text-amber-900 mt-1">
              {orders.filter(o => o.paymentStatus === 'Pending Verification').length}
            </p>
          </div>
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Payment Verified</span>
            <p className="text-xl font-black font-mono text-emerald-900 mt-1">
              {orders.filter(o => o.paymentStatus === 'Payment Verified' || o.paymentStatus === 'Paid').length}
            </p>
          </div>
          <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">Payment Rejected</span>
            <p className="text-xl font-black font-mono text-rose-900 mt-1">
              {orders.filter(o => o.paymentStatus === 'Payment Rejected').length}
            </p>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order #, TrxID, phone, name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#F10D27]"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">All Fulfillment Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">All Payment Statuses</option>
            <option value="Pending Verification">⏳ Pending Verification</option>
            <option value="Payment Verified">✅ Payment Verified</option>
            <option value="Payment Rejected">❌ Payment Rejected</option>
            <option value="Paid">💵 Paid</option>
            <option value="Unpaid">⏳ Unpaid</option>
            <option value="Refunded">↩️ Refunded</option>
          </select>
        </div>

        <div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Order Ref / Date</th>
                <th className="p-4">Customer & Contact</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">TrxID & Sender</th>
                <th className="p-4">Payable</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4">Fulfillment</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No orders matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const payStatus = order.paymentStatus || 'Unpaid';
                  const isMobile = order.paymentMethod === 'bkash' || order.paymentMethod === 'nagad';

                  return (
                    <tr 
                      key={order.id} 
                      onClick={() => setActiveOrder(order)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    >
                      {/* Order Reference */}
                      <td className="p-4">
                        <span className="font-mono font-black text-[#10183F] block">{order.orderNumber}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(order.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{order.shippingAddress.fullName}</span>
                        <span className="font-mono text-slate-500">{order.shippingAddress.phone}</span>
                      </td>

                      {/* Payment Method Badge */}
                      <td className="p-4">
                        {order.paymentMethod === 'bkash' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#E2136E]/10 text-[#E2136E] border border-[#E2136E]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E2136E]" />
                            bKash
                          </span>
                        ) : order.paymentMethod === 'nagad' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#F7941D]/10 text-[#F7941D] border border-[#F7941D]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F7941D]" />
                            Nagad
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            COD
                          </span>
                        )}
                      </td>

                      {/* TrxID & Sender Phone */}
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        {order.transactionId ? (
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-xs text-[#10183F] bg-slate-100 px-1.5 py-0.5 rounded">
                                {order.transactionId}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyTrx(order.transactionId!)}
                                className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 cursor-pointer"
                                title="Copy TrxID"
                              >
                                {copiedTrx === order.transactionId ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                              From: {order.senderNumber || order.shippingAddress.phone}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">N/A (Cash on Delivery)</span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="p-4 font-mono font-bold text-[#F10D27] tabular-nums">
                        ৳{order.total.toLocaleString('en-BD')}
                      </td>

                      {/* Payment Status Badge */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          payStatus === 'Payment Verified' || payStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : payStatus === 'Payment Rejected'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : payStatus === 'Pending Verification'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                            : payStatus === 'Refunded'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {payStatus === 'Payment Verified' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {payStatus === 'Payment Rejected' && <XCircle className="w-3 h-3 text-rose-600" />}
                          {payStatus === 'Pending Verification' && <Clock className="w-3 h-3 text-amber-600" />}
                          <span>{payStatus}</span>
                        </span>
                      </td>

                      {/* Fulfillment Status */}
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Processing' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>

                      {/* Row Actions */}
                      <td className="p-4 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                        {/* Quick verify button if pending verification */}
                        {isMobile && payStatus === 'Pending Verification' && canManagePayment && (
                          <>
                            <button
                              onClick={() => handleVerifyPayment(order.orderNumber, 'Payment Verified', 'Verified via quick table action')}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-colors"
                              title="Verify Payment Immediately"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => {
                                setRejectingOrder(order);
                                setRejectionReason('');
                              }}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[10px] rounded-lg cursor-pointer transition-colors"
                              title="Reject Payment"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => setActiveOrder(order)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors"
                          title="Inspect Order & Payment History"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onPrintInvoice(order)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors"
                          title="Print Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Payment Confirmation Modal */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900">
                Reject Payment for Order {rejectingOrder.orderNumber}
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              Please provide an internal note or reason for rejecting this {rejectingOrder.paymentMethod.toUpperCase()} transaction (TrxID: <span className="font-mono font-bold text-slate-800">{rejectingOrder.transactionId || 'N/A'}</span>):
            </p>

            <textarea
              rows={3}
              placeholder="e.g. TrxID not found in merchant statement, incorrect amount transferred..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500/20"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={() => handleVerifyPayment(rejectingOrder.orderNumber, 'Payment Rejected', rejectionReason.trim())}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Confirm Payment Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Order Inspector Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl my-auto animate-in zoom-in-95 max-h-[90vh] overflow-y-auto space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Order Management Inspector
                </span>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black font-mono text-[#10183F]">
                    {activeOrder.orderNumber}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    activeOrder.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                    activeOrder.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {activeOrder.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPrintInvoice(activeOrder)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
                <button
                  onClick={() => {
                    setActiveOrder(null);
                    if (onClearSelectedOrder) onClearSelectedOrder();
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 text-xs">
              {/* Payment Verification Card */}
              <div className={`p-5 rounded-2xl border ${
                activeOrder.paymentMethod === 'bkash'
                  ? 'bg-[#E2136E]/5 border-[#E2136E]/30'
                  : activeOrder.paymentMethod === 'nagad'
                  ? 'bg-[#F7941D]/5 border-[#F7941D]/30'
                  : 'bg-slate-50 border-slate-200'
              } space-y-4`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <CreditCard className={`w-5 h-5 ${
                      activeOrder.paymentMethod === 'bkash' ? 'text-[#E2136E]' :
                      activeOrder.paymentMethod === 'nagad' ? 'text-[#F7941D]' : 'text-slate-600'
                    }`} />
                    <h4 className="font-bold text-sm text-[#10183F]">
                      {activeOrder.paymentMethod === 'bkash' ? 'bKash Mobile Payment Audit' :
                       activeOrder.paymentMethod === 'nagad' ? 'Nagad Mobile Payment Audit' :
                       'Cash on Delivery Payment Details'}
                    </h4>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                    activeOrder.paymentStatus === 'Payment Verified' || activeOrder.paymentStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : activeOrder.paymentStatus === 'Payment Rejected'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                  }`}>
                    {activeOrder.paymentStatus === 'Payment Verified' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {activeOrder.paymentStatus === 'Payment Rejected' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                    {activeOrder.paymentStatus === 'Pending Verification' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                    <span>{activeOrder.paymentStatus || 'Pending Verification'}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Transaction ID (TrxID)</span>
                    {activeOrder.transactionId ? (
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-mono font-black text-sm text-[#10183F] tracking-wider select-all">
                          {activeOrder.transactionId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyTrx(activeOrder.transactionId!)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                        >
                          {copiedTrx === activeOrder.transactionId ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="font-medium text-slate-500 mt-1 block">N/A (Cash on Delivery)</span>
                    )}
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sender Mobile Number</span>
                    <span className="font-mono font-bold text-sm text-slate-800 mt-1 block select-all">
                      {activeOrder.senderNumber || activeOrder.shippingAddress.phone}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Order Amount Due</span>
                    <span className="font-mono font-black text-sm text-[#F10D27] mt-1 block">
                      ৳{activeOrder.total.toLocaleString('en-BD')} BDT
                    </span>
                  </div>
                </div>

                {/* Verification Record if recorded */}
                {activeOrder.paymentVerification && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] space-y-1">
                    <span className="font-bold text-slate-800 block">Verification Record:</span>
                    <p className="text-slate-600">
                      Status: <strong className="font-bold">{activeOrder.paymentVerification.status}</strong> by{' '}
                      <span className="text-slate-800">{activeOrder.paymentVerification.verifiedBy}</span> on{' '}
                      <span className="font-mono">{new Date(activeOrder.paymentVerification.verifiedAt).toLocaleString()}</span>
                    </p>
                    {activeOrder.paymentVerification.note && (
                      <p className="text-slate-500 italic">
                        Note: "{activeOrder.paymentVerification.note}"
                      </p>
                    )}
                  </div>
                )}

                {/* Verification Action Buttons for Authorized Staff */}
                {canManagePayment && (
                  <div className="pt-2 space-y-2">
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="text"
                        placeholder="Internal verification note (e.g., Statement Ref #, Bank Auth Code, Rejection Reason)..."
                        value={paymentNote}
                        onChange={(e) => setPaymentNote(e.target.value)}
                        className="flex-1 w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white"
                      />
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          disabled={updating || activeOrder.paymentStatus === 'Payment Verified'}
                          onClick={() => handleVerifyPayment(activeOrder.orderNumber, 'Payment Verified', paymentNote)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verify Payment</span>
                        </button>
                        <button
                          type="button"
                          disabled={updating || activeOrder.paymentStatus === 'Payment Rejected'}
                          onClick={() => handleVerifyPayment(activeOrder.orderNumber, 'Payment Rejected', paymentNote || 'TrxID record not found')}
                          className="flex-1 sm:flex-none px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject Payment</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                      <span>Quick transitions:</span>
                      <button
                        onClick={() => handleManualPaymentStatus(activeOrder.orderNumber, 'Paid')}
                        className="px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700"
                      >
                        Set Paid
                      </button>
                      <button
                        onClick={() => handleManualPaymentStatus(activeOrder.orderNumber, 'Unpaid')}
                        className="px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700"
                      >
                        Set Unpaid
                      </button>
                      <button
                        onClick={() => handleManualPaymentStatus(activeOrder.orderNumber, 'Pending Verification')}
                        className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 font-semibold text-amber-800"
                      >
                        Reset to Pending Verification
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer & Shipping Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#F10D27]" />
                    <span>Customer Information</span>
                  </h4>
                  <p className="font-bold text-sm text-slate-900">{activeOrder.shippingAddress.fullName}</p>
                  <p className="font-mono text-slate-600 mt-0.5 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{activeOrder.shippingAddress.phone}</span>
                  </p>
                  {activeOrder.shippingAddress.alternativePhone && (
                    <p className="text-[11px] text-slate-400 font-mono">Alt: {activeOrder.shippingAddress.alternativePhone}</p>
                  )}
                  {activeOrder.notes && (
                    <p className="text-[11px] text-slate-600 mt-1.5 bg-white p-2 rounded-lg border border-slate-200">
                      <strong>Customer Note:</strong> {activeOrder.notes}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#F10D27]" />
                    <span>Shipping Destination</span>
                  </h4>
                  <p className="text-slate-800 font-medium">
                    {activeOrder.shippingAddress.streetAddress}
                  </p>
                  <p className="text-slate-600 mt-0.5">
                    {activeOrder.shippingAddress.thana}, {activeOrder.shippingAddress.district}, {activeOrder.shippingAddress.division}
                  </p>
                  <span className="inline-block mt-1 font-semibold text-slate-500">
                    Zone: {activeOrder.deliveryArea === 'inside_dhaka' ? 'Inside Dhaka City (৳60)' : 'Outside Dhaka City (৳100)'}
                  </span>
                </div>
              </div>

              {/* Purchased Products */}
              <div>
                <h4 className="font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Purchased Products ({activeOrder.items.length})
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-4 bg-white">
                      <div className="flex items-center gap-3">
                        <img src={item.product.image} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                        <div>
                          <h5 className="font-bold text-slate-900">{item.product.name}</h5>
                          <p className="text-[11px] text-slate-500">
                            Qty: {item.quantity} {item.selectedColor ? `· ${item.selectedColor}` : ''} {item.selectedSize ? `· Size ${item.selectedSize}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        ৳{(item.product.price * item.quantity).toLocaleString('en-BD')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculation Summary */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold">৳{activeOrder.subtotal.toLocaleString('en-BD')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-mono font-bold">৳{activeOrder.deliveryCharge}</span>
                </div>
                {activeOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span className="font-mono">-৳{activeOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-[#10183F] pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="font-mono text-[#F10D27]">৳{activeOrder.total.toLocaleString('en-BD')}</span>
                </div>
              </div>

              {/* Fulfillment Status Controls */}
              <div className="p-4 border border-slate-200 rounded-2xl bg-white space-y-3">
                <h4 className="font-bold text-[#10183F] uppercase tracking-wider">
                  Update Fulfillment & Delivery Status
                </h4>

                <div className="flex flex-wrap gap-2">
                  {statuses.map(st => (
                    <button
                      key={st}
                      type="button"
                      disabled={updating || activeOrder.status === st}
                      onClick={() => handleUpdateStatus(activeOrder.orderNumber, st)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                        activeOrder.status === st
                          ? 'bg-[#10183F] text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Optional fulfillment note (e.g. Courier consignment ID, dispatch notes)..."
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50"
                  />
                </div>
              </div>

              {/* Payment History Audit Trail */}
              {activeOrder.paymentHistory && activeOrder.paymentHistory.length > 0 && (
                <div className="pt-2">
                  <h4 className="font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-slate-400" />
                    <span>Payment Status History & Verification Log</span>
                  </h4>
                  <div className="divide-y divide-slate-100 bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-2">
                    {activeOrder.paymentHistory.map((ph, idx) => (
                      <div key={idx} className="pt-2 first:pt-0 flex items-start justify-between text-[11px] gap-2">
                        <div>
                          <span className={`font-bold inline-block px-2 py-0.5 rounded text-[10px] mr-1.5 ${
                            ph.status === 'Payment Verified' || ph.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                            ph.status === 'Payment Rejected' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {ph.status}
                          </span>
                          <span className="text-slate-600">{ph.note || 'Status updated'}</span>
                          <span className="text-slate-400 block text-[10px] mt-0.5">By: {ph.updatedBy}</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[10px] shrink-0">
                          {new Date(ph.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Status Audit Trail */}
              {activeOrder.history && activeOrder.history.length > 0 && (
                <div className="pt-2">
                  <h4 className="font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-slate-400" />
                    <span>Fulfillment Status History</span>
                  </h4>
                  <div className="divide-y divide-slate-100 bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-2">
                    {activeOrder.history.map((h, idx) => (
                      <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="font-bold text-slate-800">{h.status}</span>
                          {h.note && <span className="text-slate-500 italic block"> — "{h.note}"</span>}
                          <span className="text-slate-400 block text-[10px]">Updated by: {h.updatedBy}</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[10px]">
                          {new Date(h.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
