import React from 'react';
import { Sparkles, ArrowRight, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import { Product } from '../types';

interface OffersSectionProps {
  onOrderNow: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  offerProducts: Product[];
  language: 'EN' | 'BN';
}

export const OffersSection: React.FC<OffersSectionProps> = ({
  onOrderNow,
  onSelectProduct,
  offerProducts,
  language,
}) => {
  const featuredOffer = offerProducts[0];

  if (!featuredOffer) return null;

  return (
    <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-7 sm:py-10 lg:py-12">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#10183F] via-[#162258] to-[#10183F] text-white p-5 sm:p-8 lg:p-10 shadow-xl">
        {/* Decorative background aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F10D27]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Text Left */}
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F10D27] text-white text-xs font-bold uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Special Offer of the Week</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight leading-tight mb-3">
              Get the Black Paisley Hoodie & Graphic Tee Combo
            </h2>

            <p className="text-white/80 text-sm sm:text-base max-w-lg mb-5 sm:mb-6 leading-relaxed">
              Ultra-heavyweight 320 GSM combed cotton fleece with premium paisley back-print. Includes matching tee at a limited-time discounted bundle price.
            </p>

            <div className="flex flex-wrap items-baseline gap-3 sm:gap-4 mb-5 sm:mb-6">
              <span className="text-3xl sm:text-4xl font-black font-mono text-[#F10D27] tabular-nums">
                ৳1,200
              </span>
              <span className="text-white/50 text-lg line-through font-mono tabular-nums">
                ৳1,450
              </span>
              <span className="text-xs font-bold bg-white/10 text-white px-2.5 py-1 rounded-lg border border-white/20">
                Save 17% Today
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOrderNow(featuredOffer)}
                className="bg-[#F10D27] hover:bg-[#d60a20] active:scale-95 text-white font-bold text-sm px-6 min-h-[46px] py-3 rounded-full flex items-center gap-2 shadow-lg shadow-red-950/40 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Claim Offer Now</span>
              </button>

              <button
                onClick={() => onSelectProduct(featuredOffer)}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 min-h-[46px] py-3 rounded-full border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>View Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Image Right */}
          <div className="md:col-span-5 flex justify-center">
            <div 
              onClick={() => onSelectProduct(featuredOffer)}
              className="relative aspect-4/3 w-full max-w-md rounded-2xl overflow-hidden bg-white/5 border border-white/15 p-2 shadow-2xl cursor-pointer group"
            >
              <img
                src={featuredOffer.image}
                alt={featuredOffer.name}
                className="w-full h-full object-cover rounded-xl transform transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-4 right-4 bg-[#F10D27] text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
                -17% OFF
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
