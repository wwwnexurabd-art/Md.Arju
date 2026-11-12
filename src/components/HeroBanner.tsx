import React from 'react';
import { 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Lock, 
  Headphones 
} from 'lucide-react';
import { NavigationPage } from '../types';

interface HeroBannerProps {
  onOrderNow: () => void;
  onViewOffers: () => void;
  language: 'EN' | 'BN';
  cms?: any;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOrderNow,
  onViewOffers,
  language,
  cms,
}) => {
  return (
    <section className="relative max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-3 pb-6 sm:py-5 lg:py-6">
      {/* Outer rounded emerald green container matching reference */}
      <div className="relative overflow-hidden rounded-3xl sm:rounded-[36px] bg-[#003D2B] text-white shadow-xl">
        {/* Subtle ambient golden glowing circular ring in the top right background */}
        <div 
          className="absolute -top-20 -right-20 w-[380px] h-[380px] sm:w-[560px] sm:h-[560px] rounded-full pointer-events-none opacity-40 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(234, 179, 8, 0.45) 0%, rgba(16, 185, 129, 0.15) 50%, transparent 70%)'
          }}
        />
        {/* Golden ring arc overlay */}
        <div 
          className="absolute right-12 top-6 w-72 h-72 sm:w-88 sm:h-88 rounded-full border border-amber-300/20 pointer-events-none hidden md:block"
          style={{
            boxShadow: 'inset 0 0 40px rgba(245, 158, 11, 0.1), 0 0 30px rgba(245, 158, 11, 0.15)'
          }}
        />

        <div className="relative z-10 px-5 py-6 sm:px-8 sm:py-9 lg:px-12 lg:py-10 xl:py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-8 items-center">
            {/* Left Content (Cols 1-7 on tablet & laptop) */}
            <div className="md:col-span-7 flex flex-col justify-center">
              {/* Brand Label with line */}
              <div className="flex items-center gap-2 mb-2.5 sm:mb-3.5">
                <span className="w-8 h-0.5 bg-white/60 rounded-full" />
                <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-white/90 uppercase">
                  {cms?.heroLabel || 'NEXURA.BD'}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-[1.95rem] sm:text-4xl lg:text-5xl xl:text-[3.4rem] font-black text-white font-heading tracking-tight leading-[1.1] mb-3 sm:mb-4">
                {cms?.heroHeadline || (language === 'BN' ? 'আমাদের স্টোরে স্বাগতম' : 'Welcome to Our Store')}
              </h1>

              {/* Supporting Text */}
              <p className="text-white/80 text-sm sm:text-base lg:text-lg font-normal max-w-lg mb-5 sm:mb-7 leading-relaxed">
                {cms?.heroSubtext || (language === 'BN' 
                  ? 'আমাদের প্রিমিয়াম কোয়ালিটির লেটেস্ট প্রোডাক্ট কালেকশন ব্রাউজ করুন।' 
                  : 'Browse our latest collection of quality products.')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {/* Red "Order Now" Button */}
                <button
                  onClick={onOrderNow}
                  className="bg-[#F10D27] hover:bg-[#d60a20] active:scale-95 text-white font-bold text-sm sm:text-base px-5 sm:px-7 min-h-[46px] py-3 rounded-full flex items-center gap-2.5 shadow-lg shadow-red-900/40 transition-all cursor-pointer group"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                  <span>{language === 'BN' ? 'এখনই অর্ডার করুন' : 'Order Now'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                {/* Transparent "View All Offers" Button */}
                <button
                  onClick={onViewOffers}
                  className="bg-transparent hover:bg-white/10 active:scale-95 text-white font-semibold text-sm sm:text-base px-5 sm:px-6 min-h-[46px] py-3 rounded-full border border-white/80 hover:border-white flex items-center gap-2 transition-all cursor-pointer group"
                >
                  <span>{language === 'BN' ? 'সকল অফার দেখুন' : 'View All Offers'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right Product Gadget Collage (Cols 8-12 on tablet & laptop) */}
            <div className="md:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md mx-auto aspect-4/3 rounded-2xl overflow-hidden group">
                <img
                  src={cms?.heroImageUrl || '/images/hero/hero-gadgets.jpg'}
                  alt="NEXURA.BD Tech Gadgets Collection - Headphones, Smartphone, Wireless Earbuds, Smartwatch, Speaker"
                  className="w-full h-full object-cover object-center rounded-2xl transform transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                  onError={(e) => {
                    // Fallback to reference asset if needed
                    (e.target as HTMLImageElement).src = '/public/assets/aistudio/NX_5b437282.jpeg';
                  }}
                />
                {/* Radial gradient mask to seamlessly blend into emerald background */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#003D2B]/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Bottom Trust Indicators Strip matching reference image */}
          <div className="mt-6 sm:mt-8 lg:mt-9 pt-5 sm:pt-6 border-t border-white/15">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-2">
              {/* Item 1 */}
              <div className="flex items-center gap-2.5 sm:gap-3 md:pr-4">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/40 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">100%</div>
                  <div className="text-[11px] sm:text-xs text-white/80 font-normal truncate">Original Products</div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center gap-2.5 sm:gap-3 sm:px-3 md:px-4 sm:border-l sm:border-white/20">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/40 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">Fast & Safe</div>
                  <div className="text-[11px] sm:text-xs text-white/80 font-normal truncate">Delivery</div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-center gap-2.5 sm:gap-3 sm:px-3 md:px-4 sm:border-l sm:border-white/20">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/40 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">Secure</div>
                  <div className="text-[11px] sm:text-xs text-white/80 font-normal truncate">Payment</div>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-center gap-2.5 sm:gap-3 sm:pl-3 md:pl-4 sm:border-l sm:border-white/20">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/40 flex items-center justify-center shrink-0">
                  <Headphones className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">24/7</div>
                  <div className="text-[11px] sm:text-xs text-white/80 font-normal truncate">Customer Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
