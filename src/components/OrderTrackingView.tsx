import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  AlertCircle,
  Phone,
  ArrowRight
} from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingViewProps {
  orders: Order[];
  initialOrderNumber?: string;
  onSelectProduct?: (product: any) => void;
  language: 'EN' | 'BN';
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orders,
  initialOrderNumber = '',
  language,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialOrderNumber);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    if (initialOrderNumber) {
      return orders.find(o => o.orderNumber.toLowerCase() === initialOrderNumber.toLowerCase()) || null;
    }
    return orders[0] || null;
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setErrorMsg('Please enter an order number or mobile phone number.');
      return;
    }

    const found = orders.find(
      o => o.orderNumber.toLowerCase() === term || 
           o.shippingAddress.phone.replace(/[\s-]/g, '').includes(term)
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchedOrder(null);
      setErrorMsg(`No order found matching "${searchTerm}". Try demo order "NX-84291" or "NX-84110".`);
    }
  };

  const steps = [
    { title: 'Order Placed', desc: 'Received in system', done: true },
    { 
      title: 'Order Confirmed', 
      desc: 'Customer verified by call', 
      done: searchedOrder ? ['Confirmed', 'Processing', 'Shipped', 'Delivered'].includes(searchedOrder.status) : false 
    },
    { 
      title: 'Processing & Packed', 
      desc: 'Quality check completed', 
      done: searchedOrder ? ['Processing', 'Shipped', 'Delivered'].includes(searchedOrder.status) : false 
    },
    { 
      title: 'Out for Delivery', 
      desc: 'Courier rider on the way', 
      done: searchedOrder ? ['Shipped', 'Delivered'].includes(searchedOrder.status) : false 
    },
    { 
      title: 'Delivered', 
      desc: 'Delivered to customer', 
      done: searchedOrder ? searchedOrder.status === 'Delivered' : false 
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-[#10183F] font-heading mb-2">
          Track Your Order
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Enter your NEXURA.BD Order ID or Mobile Number to see current delivery updates in real-time.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8 sm:mb-10">
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. NX-84291 or 01712345678"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 min-h-[46px] py-3 bg-white border border-slate-300 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F10D27]/20 shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="bg-[#F10D27] hover:bg-[#d60a20] text-white font-bold text-sm min-h-[46px] px-6 py-3 rounded-2xl shadow-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            Track Order
          </button>
        </div>

        {errorMsg && (
          <p className="text-xs text-red-500 mt-2.5 flex items-center justify-center gap-1.5 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </p>
        )}
      </form>

      {/* Tracking Result Card */}
      {searchedOrder && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-5 sm:p-8 animate-in fade-in duration-300">
          {/* Header summary */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Order Tracking Details
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-[#10183F]">
                {searchedOrder.orderNumber}
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                searchedOrder.status === 'Delivered'
                  ? 'bg-emerald-100 text-emerald-800'
                  : searchedOrder.status === 'Shipped'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {searchedOrder.status}
              </span>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                {new Date(searchedOrder.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="py-6 sm:py-8">
            <div className="relative">
              {/* Connecting Line on sm+ */}
              <div className="hidden sm:block absolute top-5 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5 sm:gap-4 relative z-10">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-0">
                    <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all ${
                      step.done
                        ? 'bg-[#F10D27] text-white shadow-md shadow-red-500/20'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}>
                      {step.done ? (
                        <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <span className="text-xs font-bold font-mono">{idx + 1}</span>
                      )}
                    </div>
                    <div className="sm:mt-3 text-left sm:text-center">
                      <h4 className={`text-xs font-bold ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.title}
                      </h4>
                      <p className="text-[11px] sm:text-[10px] text-slate-500 mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Destination & Items Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 bg-slate-50/60 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-6 sm:p-8 rounded-b-3xl">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Recipient & Address
              </h4>
              <p className="text-sm font-bold text-slate-800">{searchedOrder.shippingAddress.fullName}</p>
              <p className="text-xs text-slate-600 font-mono mt-0.5">{searchedOrder.shippingAddress.phone}</p>
              <p className="text-xs text-slate-600 mt-1">
                {searchedOrder.shippingAddress.streetAddress}, {searchedOrder.shippingAddress.thana}, {searchedOrder.shippingAddress.district}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Order Value & Method
              </h4>
              <p className="text-base font-bold text-[#F10D27] font-mono">
                ৳{searchedOrder.total.toLocaleString('en-BD')}
              </p>
              <p className="text-xs text-slate-600">
                Payment: <span className="font-semibold uppercase">{searchedOrder.paymentMethod}</span> ({searchedOrder.items.length} items)
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Delivery Zone: {searchedOrder.deliveryArea === 'inside_dhaka' ? 'Inside Dhaka City (৳60)' : 'Outside Dhaka City (৳100)'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
