import React from 'react';
import { ShoppingBag, ArrowRight, Heart, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onOrderNow: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  language: 'EN' | 'BN';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onOrderNow,
  isWishlisted,
  onToggleWishlist,
  language,
}) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition-all duration-300 p-3 sm:p-4 flex flex-col justify-between relative">
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-50 mb-3 sm:mb-4 cursor-pointer">
          {/* Discount Badge matching reference */}
          {product.discountPercent && product.discountPercent > 0 ? (
            <span className="absolute top-2.5 left-2.5 z-10 bg-[#F10D27] text-white text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-md shadow-xs pointer-events-none">
              -{product.discountPercent}%
            </span>
          ) : null}

          {/* Wishlist toggle button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`absolute top-2 right-2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isWishlisted
                ? 'bg-rose-50 text-[#F10D27] shadow-xs'
                : 'bg-white/85 hover:bg-white text-slate-500 hover:text-[#F10D27] shadow-xs backdrop-blur-xs'
            }`}
            aria-label="Save to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#F10D27]' : ''}`} />
          </button>

          {/* Quick View Overlay on hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="absolute bottom-2.5 right-2.5 z-10 bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 backdrop-blur-xs hidden sm:flex cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
            <span>Quick View</span>
          </button>

          {/* Product Image */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onClick={() => onSelect(product)}
            onError={(e) => {
              // Fallback
              (e.target as HTMLImageElement).src = '/images/products/black-paisley-hoodie.jpg';
            }}
          />
        </div>

        {/* Product Details */}
        <div className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4">
          {/* Product Name */}
          <h3 
            onClick={() => onSelect(product)}
            className="text-[#10183F] font-bold text-[13px] sm:text-base leading-snug line-clamp-2 hover:text-[#F10D27] transition-colors cursor-pointer min-h-[2.3rem] sm:min-h-[2.5rem]"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price Container matching reference card */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 pt-0.5 flex-wrap">
            <span className="text-[#F10D27] text-base sm:text-[1.35rem] font-bold font-heading tracking-tight leading-none">
              ৳{product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-slate-400 text-[11px] sm:text-xs line-through tabular-nums">
                ৳{product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Red "Order Now ->" CTA Button matching reference image */}
      <button
        onClick={() => onOrderNow(product)}
        className="w-full bg-[#F10D27] hover:bg-[#d60a20] active:scale-98 text-white font-bold text-xs sm:text-sm min-h-[44px] py-2.5 px-2.5 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm transition-all cursor-pointer group/btn whitespace-nowrap"
      >
        <ShoppingBag className="w-4 h-4 transition-transform group-hover/btn:scale-110 shrink-0" />
        <span>{language === 'BN' ? 'অর্ডার করুন' : 'Order Now'}</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1 shrink-0" />
      </button>
    </div>
  );
};
