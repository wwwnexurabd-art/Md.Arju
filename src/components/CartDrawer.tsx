import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  Truck 
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, qty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
  onViewProduct: (product: any) => void;
  language: 'EN' | 'BN';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onViewProduct,
  language,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const estimatedTotal = subtotal - discount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'NEXURA10') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try NEXURA10 for 10% off!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      {/* Backdrop click */}
      <div className="flex-1" onClick={onClose} />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-[92vw] sm:max-w-md bg-white h-[100dvh] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-red-50 text-[#F10D27] flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-[#10183F]">
                Shopping Bag
              </h3>
              <p className="text-xs text-slate-500">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free delivery prompt banner */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-4 sm:px-5 py-2.5 flex items-center gap-2 text-xs text-slate-700">
          <Truck className="w-4 h-4 text-[#F10D27] shrink-0" />
          <span>Inside Dhaka: ৳60 delivery · Outside Dhaka: ৳100</span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 sm:space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800 mb-1">Your bag is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mb-6">
                Explore our catalog of hoodies, audio accessories, and gadgets to add items to your cart.
              </p>
              <button
                onClick={onClose}
                className="bg-[#10183F] text-white font-semibold text-xs min-h-[44px] py-2.5 px-6 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item, index) => (
              <div 
                key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${index}`}
                className="flex gap-3 sm:gap-4 p-3 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all bg-white"
              >
                {/* Product Thumbnail */}
                <div 
                  onClick={() => {
                    onViewProduct(item.product);
                    onClose();
                  }}
                  className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 shrink-0 cursor-pointer border border-slate-100"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 
                        onClick={() => {
                          onViewProduct(item.product);
                          onClose();
                        }}
                        className="text-xs sm:text-sm font-bold text-[#10183F] line-clamp-2 hover:text-[#F10D27] cursor-pointer"
                      >
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="text-slate-400 hover:text-[#F10D27] transition-colors p-2 -mr-1 -mt-1 rounded-lg cursor-pointer shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Selected variants */}
                    {(item.selectedColor || item.selectedSize) && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.selectedColor && <span>{item.selectedColor}</span>}
                        {item.selectedColor && item.selectedSize && <span> · </span>}
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      </p>
                    )}
                  </div>

                  {/* Quantity Stepper & Item Total */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="w-8 h-8 rounded bg-white text-slate-700 flex items-center justify-center text-xs hover:bg-slate-100 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-slate-800 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="w-8 h-8 rounded bg-white text-slate-700 flex items-center justify-center text-xs hover:bg-slate-100 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-bold font-mono text-sm text-[#F10D27] tabular-nums">
                      ৳{(item.product.price * item.quantity).toLocaleString('en-BD')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Checkout Actions */}
        {items.length > 0 && (
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200/80 space-y-4">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Coupon Code (e.g. NEXURA10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full pl-9 pr-3 min-h-[40px] py-2 bg-white rounded-xl border border-slate-300 text-xs uppercase font-medium focus:outline-none focus:ring-1 focus:ring-[#F10D27]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#10183F] hover:bg-slate-800 text-white font-semibold text-xs px-4 min-h-[40px] py-2 rounded-xl transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {couponApplied && (
              <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Coupon NEXURA10 applied! 10% discount included.
              </p>
            )}
            {couponError && (
              <p className="text-[11px] text-red-600">{couponError}</p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800 font-mono">
                  ৳{subtotal.toLocaleString('en-BD')}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Special Discount (10%)</span>
                  <span className="font-mono">-৳{discount.toLocaleString('en-BD')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Estimated Delivery</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#10183F] pt-2 border-t border-slate-200">
                <span>Estimated Total</span>
                <span className="text-[#F10D27] font-mono">
                  ৳{estimatedTotal.toLocaleString('en-BD')}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full bg-[#F10D27] hover:bg-[#d60a20] active:scale-98 text-white font-bold text-sm min-h-[46px] py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
