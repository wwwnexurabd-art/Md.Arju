import React from 'react';
import { Printer, X, Download } from 'lucide-react';
import { Order } from '../types';
import { STORE_ADDRESS, HOTLINE_NUMBER, SUPPORT_EMAIL } from '../data/products';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl my-auto animate-in zoom-in-95 print:p-0 print:shadow-none print:rounded-none">
        {/* Screen Controls (hidden during print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 print:hidden">
          <span className="font-bold text-xs text-slate-500 uppercase">Official Invoice Preview</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#F10D27] hover:bg-[#d60a20] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="space-y-6 text-slate-900">
          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-black tracking-tight text-[#10183F] uppercase font-heading">
                  NEXURA<span className="text-[#F10D27]">.BD</span>
                </span>
              </div>
              <p className="text-[10px] tracking-widest font-bold text-slate-500 uppercase">TECH · FASHION · LIFESTYLE</p>
              <p className="text-xs text-slate-500 mt-2 max-w-xs">{STORE_ADDRESS}</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Hotline: {HOTLINE_NUMBER}</p>
            </div>

            <div className="text-right">
              <span className="text-xl font-black uppercase tracking-wider text-slate-900 block font-heading">INVOICE</span>
              <span className="text-base font-black font-mono text-[#F10D27] block mt-0.5">{order.orderNumber}</span>
              <span className="text-xs text-slate-500 font-mono block mt-1">
                Date: {new Date(order.date).toLocaleDateString('en-GB')}
              </span>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800">
                Payment: {order.paymentMethod.toUpperCase()} ({(order as any).paymentStatus || 'Unpaid'})
              </span>
            </div>
          </div>

          {/* Bill To */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Customer / Recipient:</span>
              <p className="font-bold text-sm text-slate-900">{order.shippingAddress.fullName}</p>
              <p className="font-mono text-slate-600 mt-0.5">{order.shippingAddress.phone}</p>
              {order.shippingAddress.alternativePhone && (
                <p className="text-slate-400 font-mono">Alt: {order.shippingAddress.alternativePhone}</p>
              )}
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Delivery Destination:</span>
              <p className="font-medium text-slate-800">{order.shippingAddress.streetAddress}</p>
              <p className="text-slate-600 mt-0.5">
                {order.shippingAddress.thana}, {order.shippingAddress.district}, {order.shippingAddress.division}
              </p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-left border-collapse text-xs mt-4">
            <thead>
              <tr className="border-b border-slate-300 font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5">Item Description</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Unit Price</th>
                <th className="py-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3">
                    <span className="font-bold text-slate-900 block">{item.product.name}</span>
                    <span className="text-[11px] text-slate-500">
                      {item.selectedColor ? `Color: ${item.selectedColor}` : ''} {item.selectedSize ? `· Size: ${item.selectedSize}` : ''}
                    </span>
                  </td>
                  <td className="py-3 text-center font-mono font-bold">{item.quantity}</td>
                  <td className="py-3 text-right font-mono tabular-nums">৳{item.product.price.toLocaleString('en-BD')}</td>
                  <td className="py-3 text-right font-mono font-bold tabular-nums">
                    ৳{(item.product.price * item.quantity).toLocaleString('en-BD')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="border-t-2 border-slate-200 pt-4 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-slate-900">৳{order.subtotal.toLocaleString('en-BD')}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span className="font-mono font-bold text-slate-900">৳{order.deliveryCharge}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span className="font-mono">-৳{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-[#10183F] pt-2 border-t border-slate-300">
                <span>Total Payable:</span>
                <span className="font-mono text-[#F10D27]">৳{order.total.toLocaleString('en-BD')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[10px] space-y-0.5">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Method:</span>
                  <span className="font-bold text-slate-800 uppercase">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Payment Status:</span>
                  <span className="font-bold text-slate-800">{order.paymentStatus || 'Pending'}</span>
                </div>
                {order.transactionId && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">TrxID:</span>
                    <span className="font-mono font-bold text-slate-900">{order.transactionId}</span>
                  </div>
                )}
                {order.senderNumber && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Sender:</span>
                    <span className="font-mono text-slate-700">{order.senderNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="pt-8 border-t border-slate-200 flex items-end justify-between text-[11px] text-slate-400">
            <div>
              <p className="font-semibold text-slate-600">7-Day Replacement Guarantee</p>
              <p className="text-[10px]">Thank you for shopping with NEXURA.BD!</p>
            </div>

            <div className="text-center">
              <div className="w-36 border-b border-slate-400 mb-1" />
              <span className="text-[10px] uppercase font-bold text-slate-500">Authorized Signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
