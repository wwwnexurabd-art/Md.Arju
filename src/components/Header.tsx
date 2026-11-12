import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Globe, 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  SlidersHorizontal,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { NavigationPage } from '../types';
import { HOTLINE_NUMBER, WHATSAPP_NUMBER } from '../data/products';

interface HeaderProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage, param?: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  language: 'EN' | 'BN';
  onToggleLanguage: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  cms?: any;
  adminUser?: any;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenCart,
  language,
  onToggleLanguage,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  cms,
  adminUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: language === 'BN' ? 'হোম' : 'Home', page: 'home' as NavigationPage },
    { label: language === 'BN' ? 'সকল পণ্য' : 'All Products', page: 'products' as NavigationPage },
    { label: language === 'BN' ? 'অফার' : 'Special Offers', page: 'offers' as NavigationPage },
    { label: language === 'BN' ? 'নতুন আগমন' : 'New Arrivals', page: 'new-arrivals' as NavigationPage },
    { label: language === 'BN' ? 'অর্ডার ট্র্যাক' : 'Track Order', page: 'order-tracking' as NavigationPage },
  ];

  return (
    <>
      {/* Top micro announcement bar */}
      <div className="bg-[#10183F] text-white/90 text-xs py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs min-w-0">
            <span className="flex items-center gap-1.5 text-white/90 min-w-0">
              <Truck className="w-3.5 h-3.5 text-[#F10D27] shrink-0" />
              <span className="truncate">{cms?.topAnnouncement || (language === 'BN' ? 'সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা' : 'Cash on Delivery Available Across Bangladesh')}</span>
            </span>
            <span className="hidden md:inline text-white/40">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-white/80 whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{language === 'BN' ? '১০০% আসল ও গ্যারান্টিযুক্ত প্রোডাক্ট' : '100% Genuine Guaranteed'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[11px] shrink-0">
            <button 
              onClick={() => onNavigate('admin')}
              className={`transition-colors cursor-pointer flex items-center gap-1 px-2 py-0.5 rounded whitespace-nowrap ${
                adminUser 
                  ? 'bg-[#F10D27] text-white font-bold' 
                  : 'text-white/80 hover:text-white'
              }`}
              title="Store Admin Panel"
            >
              <SlidersHorizontal className="w-3 h-3 shrink-0" />
              <span>{adminUser ? `${adminUser.name.split(' ')[0]} (Admin)` : 'Admin Portal'}</span>
            </button>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="text-white/80 hidden sm:inline whitespace-nowrap">Hotline: {cms?.hotlineNumber || HOTLINE_NUMBER}</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[72px] lg:h-20 gap-2">
            {/* Left Brand Lockup */}
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden min-w-[40px] min-h-[40px] flex items-center justify-center -ml-1.5 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-50 cursor-pointer shrink-0"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div 
                onClick={() => onNavigate('home')} 
                className="flex items-center cursor-pointer select-none group py-0.5 min-w-0"
                title="NEXURA.BD — Home"
              >
                {/* Official NEXURA.BD Brand Logo Asset */}
                <img
                  src="/assets/aistudio/logo_ea12b887.png"
                  alt="NEXURA.BD — TECH · FASHION · LIFESTYLE"
                  className="h-8 sm:h-10 lg:h-11 w-auto max-w-[138px] sm:max-w-[190px] lg:max-w-[230px] object-contain transition-transform group-hover:scale-[1.02]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/logo.png';
                  }}
                />
              </div>
            </div>

            {/* Middle Nav Desktop / Tablet Landscape */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-8 text-[13px] xl:text-[14px] font-semibold text-[#10183F]">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => onNavigate(link.page)}
                  className={`transition-colors whitespace-nowrap cursor-pointer py-1 relative ${
                    currentPage === link.page
                      ? 'text-[#F10D27] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#F10D27] after:rounded-full'
                      : 'hover:text-[#F10D27] text-slate-700'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right Action Icons & Call Button */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-2.5 shrink-0">
              {/* Search Toggle button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="min-w-[40px] min-h-[40px] sm:min-w-[42px] sm:min-h-[42px] flex items-center justify-center text-slate-700 hover:text-[#10183F] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                aria-label="Search products"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Language Switcher */}
              <button
                onClick={onToggleLanguage}
                className="min-w-[40px] min-h-[40px] sm:min-w-[42px] sm:min-h-[42px] px-1.5 sm:px-2.5 text-slate-700 hover:text-[#10183F] hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center gap-1 text-xs font-semibold cursor-pointer"
                aria-label="Change Language"
                title="Switch Language"
              >
                <Globe className="w-5 h-5 text-slate-600 shrink-0" />
                <span className="hidden md:inline">{language}</span>
              </button>

              {/* WhatsApp Support Button (sm+ header; mobile uses floating action) */}
              <a
                href={`https://wa.me/${(cms?.whatsappNumber || WHATSAPP_NUMBER).replace(/[^0-9]/g, '')}?text=Hello%20NEXURA.BD,%20I%20would%20like%20to%20inquire%20about%20a%20product`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex min-w-[42px] min-h-[42px] items-center justify-center text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors cursor-pointer"
                aria-label="Chat on WhatsApp"
                title="WhatsApp Support"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600" />
              </a>

              {/* Wishlist Button */}
              <button
                onClick={() => onNavigate('products')}
                className="hidden sm:flex relative min-w-[42px] min-h-[42px] items-center justify-center text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#F10D27] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={onOpenCart}
                className="relative min-w-[40px] min-h-[40px] sm:min-w-[42px] sm:min-h-[42px] flex items-center justify-center text-slate-700 hover:text-[#F10D27] hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                aria-label="View Cart"
                title="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-[#F10D27] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Prominent Red "Call Us" Button matching reference image */}
              <button
                onClick={() => setShowCallModal(true)}
                className="bg-[#F10D27] hover:bg-[#d60a20] active:scale-95 text-white font-bold text-xs sm:text-sm px-3 sm:px-4 lg:px-5 min-h-[40px] sm:min-h-[42px] rounded-full flex items-center gap-1.5 sm:gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap ml-0.5 sm:ml-1"
              >
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white shrink-0" />
                <span>Call Us</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Search Drawer / Dropdown */}
        {searchOpen && (
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 transition-all animate-in slide-in-from-top-2">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search gadgets, hoodies, headphones, consoles..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={handleSearchKeyPress}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#F10D27]/30 focus:border-[#F10D27]"
                />
                {searchQuery && (
                  <button 
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  onSearchSubmit();
                  setSearchOpen(false);
                }}
                className="bg-[#10183F] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Call Hotline Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl relative animate-in zoom-in-95">
            <button 
              onClick={() => setShowCallModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-red-50 text-[#F10D27] rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 fill-current" />
            </div>

            <h3 className="text-xl font-bold text-[#10183F] font-heading mb-1">
              Need Immediate Support?
            </h3>
            <p className="text-sm text-slate-600 mb-5">
              Our customer care team is available Saturday to Thursday (10:00 AM – 9:00 PM).
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">Customer Helpline</span>
              <a 
                href={`tel:${HOTLINE_NUMBER.replace(/\s+/g, '')}`} 
                className="text-xl font-black text-[#F10D27] hover:underline tracking-tight block"
              >
                {HOTLINE_NUMBER}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${HOTLINE_NUMBER.replace(/\s+/g, '')}`}
                className="bg-[#F10D27] text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#d60a20] transition-colors"
              >
                <Phone className="w-4 h-4 fill-white" />
                Call Now
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="bg-white w-4/5 max-w-sm h-full flex flex-col shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/aistudio/logo_ea12b887.png"
                  alt="NEXURA.BD"
                  className="h-8 w-auto max-w-[170px] object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/logo.png';
                  }}
                />
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-2 py-6">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => {
                    onNavigate(link.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-3 rounded-xl font-semibold text-base transition-colors ${
                    currentPage === link.page
                      ? 'bg-red-50 text-[#F10D27]'
                      : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}

              <div className="h-px bg-slate-100 my-2" />

              <button
                onClick={() => {
                  onNavigate('about');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900"
              >
                About NEXURA.BD
              </button>
              <button
                onClick={() => {
                  onNavigate('contact');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900"
              >
                Contact & Store Location
              </button>
              <button
                onClick={() => {
                  onNavigate('shipping-policy');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900"
              >
                Shipping & Delivery Rules
              </button>
              <button
                onClick={() => {
                  onNavigate('refund-policy');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900"
              >
                Return & Refund Policy
              </button>
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-4 py-2.5 text-sm font-semibold text-[#10183F] flex items-center gap-2 mt-2"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#F10D27]" />
                Store Admin Panel
              </button>
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-100">
              <a
                href={`tel:${HOTLINE_NUMBER.replace(/\s+/g, '')}`}
                className="w-full bg-[#F10D27] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <Phone className="w-4 h-4 fill-white" />
                Call Hotline: {HOTLINE_NUMBER}
              </a>
            </div>
          </div>

          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
