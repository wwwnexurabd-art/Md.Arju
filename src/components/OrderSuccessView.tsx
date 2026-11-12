import React from 'react';
import { 
  CheckCircle, 
  MessageCircle, 
  Printer, 
  ArrowRight, 
  Package, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock 
} from 'lucide-react';
import { Order, NavigationPage } from '../types';
import { WHATSAPP_NUMBER } from '../data/products';

interface OrderSuccessViewProps {
  order: Order;
  onNavigate: (page: NavigationPage) => void;
  onTrackOrder: (orderNumber: string) => void;
  language: 'EN' | 'BN';
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({
  order,
  onNavigate,
  onTrackOrder,
  language,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = encodeURIComponent(
    `Hello NEXURA.BD!\nI have placed an order.\n\n` +
    `*Order ID:* ${order.orderNumber}\n` +
    `*Customer:* ${order.shippingAddress.fullName}\n` +
    `*Phone:* ${order.shippingAddress.phone}\n` +
    `*Delivery Area:* ${order.shippingAddress.thana}, ${order.shippingAddress.district}\n` +
    `*Total Payable:* ৳${order.total.toLocaleString('en-BD')}\n` +
    `*Payment Method:* ${order.paymentMethod.toUpperCase()}` +
    (order.transactionId ? `\n*TrxID:* ${order.transactionId}` : '') +
    (order.senderNumber ? `\n*Sender Mobile:* ${order.senderNumber}` : '') +
    `\n*Payment Status:* ${order.paymentStatus || 'Pending Verification'}\n\n` +
    `Please confirm my order and shipment. Thank you!`
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Success Badge */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75">
          <CheckCircle className="w-10 h-10 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#10183F] font-heading mb-2">
          Order Successfully Placed!
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto">
          Thank you for choosing NEXURA.BD. Our customer support will contact you shortly to confirm dispatch.
        </p>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden mb-8">
        {/* Header bar */}
        <div className="bg-[#10183F] text-white p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-300 font-medium">Order Reference Number</span>
            <div className="text-2xl font-black font-mono tracking-wider text-white">
              {order.orderNumber}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full font-bold bg-[#F10D27] text-white">
              {order.status}
            </span>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content details */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Customer Information
              </h3>
              <p className="font-bold text-slate-800 text-sm">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-slate-600 font-mono flex items-center gap-1.5 mt-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {order.shippingAddress.phone}
              </p>
              {order.shippingAddress.alternativePhone && (
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Alt: {order.shippingAddress.alternativePhone}
                </p>
              )}
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Shipping Destination
              </h3>
              <p className="text-sm text-slate-800 font-medium flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-[#F10D27] shrink-0 mt-0.5" />
                <span>
                  {order.shippingAddress.streetAddress}, {order.shippingAddress.thana}, {order.shippingAddress.district}, {order.shippingAddress.division}
                </span>
              </p>
              <span className="inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {order.deliveryArea === 'inside_dhaka' ? 'Inside Dhaka City (24-48h)' : 'Outside Dhaka City (48-72h)'}
              </span>
            </div>
          </div>

          {/* Itemized list */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Ordered Items
            </h3>
            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 shrink-0">
                      <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#10183F]">{item.product.name}</h4>
                      <p className="text-xs text-slate-500">
                        Qty: {item.quantity} {item.selectedColor ? `· ${item.selectedColor}` : ''} {item.selectedSize ? `· Size ${item.selectedSize}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold font-mono text-slate-800 tabular-nums">
                    ৳{(item.product.price * item.quantity).toLocaleString('en-BD')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 space-y-2 text-xs text-slate-600 border border-slate-100">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-800 font-mono">৳{order.subtotal.toLocaleString('en-BD')}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span className="font-bold text-slate-800 font-mono">৳{order.deliveryCharge.toLocaleString('en-BD')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount Applied</span>
                <span className="font-mono">-৳{order.discount.toLocaleString('en-BD')}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 text-base font-black text-[#10183F]">
              <span>Total Payable</span>
              <span className="text-xl font-bold font-mono text-[#F10D27]">
                ৳{order.total.toLocaleString('en-BD')}
              </span>
            </div>

            {/* Payment Method & Verification Summary */}
            <div className="pt-3 border-t border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Payment Method:</span>
                <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}
                </span>
              </div>

              {order.paymentMethod !== 'cod' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Payment Status:</span>
                    <span className={`font-bold text-xs px-2.5 py-0.5 rounded-full ${
                      order.paymentStatus === 'Payment Verified' || order.paymentStatus === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.paymentStatus === 'Payment Rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}>
                      {order.paymentStatus || 'Pending Verification'}
                    </span>
                  </div>

                  {order.transactionId && (
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Submitted TrxID:</span>
                      <span className="font-mono font-bold text-slate-900 tracking-wider">
                        {order.transactionId}
                      </span>
                    </div>
                  )}

                  {order.senderNumber && (
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Sender Account:</span>
                      <span className="font-mono text-slate-700">
                        {order.senderNumber}
                      </span>
                    </div>
                  )}

                  <p className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200/80 mt-1">
                    ℹ️ Our accounts team is verifying your transaction ID with merchant records. You will receive an SMS confirmation once verified.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* WhatsApp Instant Confirmation Banner */}
        <div className="bg-emerald-50 border-t border-emerald-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-950">
                Confirm Fast via WhatsApp
              </h4>
              <p className="text-xs text-emerald-800">
                Click to send your order summary to our WhatsApp desk for VIP priority handling.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirm on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => onTrackOrder(order.orderNumber)}
          className="w-full sm:w-auto bg-[#10183F] hover:bg-slate-800 text-white font-bold text-sm px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Package className="w-4 h-4" />
          <span>Track Order Progress</span>
        </button>

        <button
          onClick={() => onNavigate('home')}
          className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
