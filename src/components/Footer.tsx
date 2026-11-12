import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Truck, 
  Heart,
  MessageCircle,
  CreditCard
} from 'lucide-react';
import { NavigationPage } from '../types';
import { HOTLINE_NUMBER, WHATSAPP_NUMBER, SUPPORT_EMAIL, STORE_ADDRESS, CATEGORIES } from '../data/products';

interface FooterProps {
  onNavigate: (page: NavigationPage, param?: string) => void;
  onSelectCategory: (categoryId: string) => void;
  language: 'EN' | 'BN';
  cms?: any;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory, language, cms }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#10183F] text-white pt-12 sm:pt-16 pb-20 sm:pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 sm:pb-12 border-b border-slate-800">
          {/* Brand Info (Cols 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src="/images/logo-icon.png"
                  alt="NEXURA.BD"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <span className="text-xl font-black tracking-tight text-white uppercase font-heading block">
                  NEXURA<span className="text-[#F10D27]">.BD</span>
                </span>
                <span className="text-[9px] tracking-[0.2em] font-bold text-slate-400 uppercase block -mt-1">
                  TECH · FASHION · LIFESTYLE
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Premium ecommerce store in Bangladesh delivering authentic technology gadgets, street fashion hoodies, gaming gear, and mobile accessories with nationwide Cash on Delivery.
            </p>

            {/* Direct Contact mini */}
            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F10D27] shrink-0" />
                <span className="font-mono hover:text-white transition-colors cursor-pointer" onClick={() => window.location.href = `tel:${(cms?.hotlineNumber || HOTLINE_NUMBER).replace(/\s+/g, '')}`}>
                  {cms?.hotlineNumber || HOTLINE_NUMBER}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F10D27] shrink-0" />
                <span className="break-all">{SUPPORT_EMAIL}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F10D27] shrink-0 mt-0.5" />
                <span className="text-slate-400">{STORE_ADDRESS}</span>
              </div>
            </div>
          </div>

          {/* Quick Links (Cols 5-7) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer py-0.5">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors cursor-pointer py-0.5">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('offers')} className="hover:text-white transition-colors cursor-pointer py-0.5">
                  Special Offers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('new-arrivals')} className="hover:text-white transition-colors cursor-pointer py-0.5">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('order-tracking')} className="hover:text-white transition-colors cursor-pointer py-0.5">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer py-0.5">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer py-0.5">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Product Categories (Cols 8-9) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-white transition-colors cursor-pointer text-left py-0.5"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Customer Policies (Cols 10-12) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Stay Connected
            </h4>
            <p className="text-xs text-slate-400">
              Subscribe to get exclusive voucher alerts, combo drops, and early discounts.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F10D27]"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#F10D27] hover:bg-[#d60a20] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Join
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Thanks for subscribing! Check your inbox soon.
                </p>
              )}
            </form>

            <div className="pt-2 text-xs text-slate-400 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <button onClick={() => onNavigate('shipping-policy')} className="hover:text-white cursor-pointer">Shipping</button>
              <span>·</span>
              <button onClick={() => onNavigate('refund-policy')} className="hover:text-white cursor-pointer">Refunds</button>
              <span>·</span>
              <button onClick={() => onNavigate('privacy-policy')} className="hover:text-white cursor-pointer">Privacy</button>
              <span>·</span>
              <button onClick={() => onNavigate('terms')} className="hover:text-white cursor-pointer">Terms</button>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Payment Logos & Copyright */}
        <div className="pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center md:text-left">
          <div>
            © {new Date().getFullYear()} NEXURA.BD. All rights reserved. TECH · FASHION · LIFESTYLE.
          </div>

          {/* Payment Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 sm:gap-3">
            <span className="text-[11px] text-slate-400 font-medium">Supported Payments:</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-white font-bold text-[10px] tracking-wide border border-slate-700">
                Cash on Delivery
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#E2136E]/20 text-[#E2136E] font-black text-[10px] border border-[#E2136E]/30">
                bKash
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#F7941D]/20 text-[#F7941D] font-black text-[10px] border border-[#F7941D]/30">
                Nagad
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-bold text-[10px] border border-slate-700">
                Visa / MC
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
