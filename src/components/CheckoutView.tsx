import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  User, 
  AlertCircle,
  Copy,
  Check,
  Lock,
  ExternalLink
} from 'lucide-react';
import { CartItem, ShippingAddress, Order } from '../types';
import { BANGLADESH_DIVISIONS, DHAKA_CITY_THANAS } from '../data/products';

interface CheckoutViewProps {
  items: CartItem[];
  onBackToCart: () => void;
  onSubmitOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status'> & { couponCode?: string }) => void;
  language: 'EN' | 'BN';
  deliverySettings?: any;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  items,
  onBackToCart,
  onSubmitOrder,
  language,
  deliverySettings,
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [alternativePhone, setAlternativePhone] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [thana, setThana] = useState('Dhanmondi');
  const [streetAddress, setStreetAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [transactionId, setTransactionId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [instructionLang, setInstructionLang] = useState<'both' | 'bn' | 'en'>('both');
  const paymentNumber = '01647583320';
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Available districts based on division
  const availableDistricts = useMemo(() => {
    return Object.keys(BANGLADESH_DIVISIONS[division]?.districts || {});
  }, [division]);

  // Available thanas based on district
  const availableThanas = useMemo(() => {
    return BANGLADESH_DIVISIONS[division]?.districts[district] || [];
  }, [division, district]);

  const dhakaCityList = deliverySettings?.dhakaCityAreas || DHAKA_CITY_THANAS;
  const insideFeeRate = deliverySettings?.insideDhakaFee !== undefined ? deliverySettings.insideDhakaFee : 60;
  const outsideFeeRate = deliverySettings?.outsideDhakaFee !== undefined ? deliverySettings.outsideDhakaFee : 100;

  // Check if inside Dhaka City
  const isInsideDhakaCity = useMemo(() => {
    if (division === 'Dhaka' && district === 'Dhaka') {
      return dhakaCityList.includes(thana);
    }
    return false;
  }, [division, district, thana, dhakaCityList]);

  // Delivery charge calculation
  const deliveryCharge = isInsideDhakaCity ? insideFeeRate : outsideFeeRate;
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = Math.max(0, subtotal - discount) + deliveryCharge;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), orderAmount: subtotal })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid coupon');
      setAppliedCoupon(data);
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleDivisionChange = (newDivision: string) => {
    setDivision(newDivision);
    const firstDistrict = Object.keys(BANGLADESH_DIVISIONS[newDivision]?.districts || {})[0] || '';
    setDistrict(firstDistrict);
    const firstThana = BANGLADESH_DIVISIONS[newDivision]?.districts[firstDistrict]?.[0] || '';
    setThana(firstThana);
  };

  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    const firstThana = BANGLADESH_DIVISIONS[division]?.districts[newDistrict]?.[0] || '';
    setThana(firstThana);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
    
    // Bangladesh mobile number validation (e.g. 017..., 018..., 019..., 013..., 014..., 015..., 016...)
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Mobile Number is required';
    } else if (!/^(\+?880|0)?1[3-9]\d{8}$/.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 11-digit Bangladeshi mobile number';
    }

    if (!streetAddress.trim()) {
      newErrors.streetAddress = 'Detailed street or house address is required';
    }

    // Manual mobile payment validation (bKash or Nagad)
    if (paymentMethod === 'bkash' || paymentMethod === 'nagad') {
      const cleanTrx = transactionId.trim();
      const methodLabel = paymentMethod === 'bkash' ? 'bKash' : 'Nagad';
      if (!cleanTrx) {
        newErrors.transactionId = `${methodLabel} Transaction ID (TrxID) is required / ট্রানজেকশন আইডি (TrxID) আবশ্যক`;
      } else if (!/^[A-Za-z0-9_-]{5,30}$/.test(cleanTrx)) {
        newErrors.transactionId = 'Please enter a valid TrxID (alphanumeric, e.g. BL82X9KL4M)';
      }

      if (senderNumber.trim()) {
        const cleanSender = senderNumber.replace(/[\s-]/g, '');
        if (!/^(\+?880|0)?1[3-9]\d{8}$/.test(cleanSender)) {
          newErrors.senderNumber = 'Please enter a valid 11-digit sender phone number';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const shippingAddress: ShippingAddress = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      alternativePhone: alternativePhone.trim() || undefined,
      division,
      district,
      thana,
      streetAddress: streetAddress.trim(),
      note: orderNotes.trim() || undefined,
    };

    const cleanTrx = (paymentMethod === 'bkash' || paymentMethod === 'nagad') 
      ? transactionId.trim().toUpperCase() 
      : undefined;
    const cleanSender = (paymentMethod === 'bkash' || paymentMethod === 'nagad') 
      ? senderNumber.trim() 
      : undefined;

    setTimeout(() => {
      onSubmitOrder({
        items,
        subtotal,
        deliveryCharge,
        discount,
        total,
        shippingAddress,
        deliveryArea: isInsideDhakaCity ? 'inside_dhaka' : 'outside_dhaka',
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'Unpaid' : 'Pending Verification',
        transactionId: cleanTrx,
        senderNumber: cleanSender,
        notes: orderNotes.trim() || undefined,
        couponCode: appliedCoupon?.code
      });
      setIsSubmitting(false);
    }, 400);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No items in your cart</h2>
        <p className="text-slate-500 mb-6">Please add products to your cart before proceeding to checkout.</p>
        <button
          onClick={onBackToCart}
          className="bg-[#F10D27] text-white font-bold py-2.5 px-6 rounded-xl text-sm"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
      <button
        onClick={onBackToCart}
        className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#10183F] min-h-[40px] mb-5 sm:mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Shopping</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Form: Customer and Shipping Information (Cols 1-7) */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-7 lg:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-red-50 text-[#F10D27] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#10183F] font-heading">
                Delivery Address & Contact
              </h2>
              <p className="text-xs text-slate-500">
                Please enter accurate information for fast door-step delivery
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#10183F] uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Tanvir Ahmed"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#F10D27]/20 ${
                    errors.fullName ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Mobile Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#10183F] uppercase tracking-wider mb-1.5">
                  Mobile Number (11 digits) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#F10D27]/20 ${
                      errors.phone ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Alternative Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={alternativePhone}
                    onChange={(e) => setAlternativePhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#F10D27]/20"
                  />
                </div>
              </div>
            </div>

            {/* Division, District, Thana Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Division */}
              <div>
                <label className="block text-xs font-bold text-[#10183F] uppercase tracking-wider mb-1.5">
                  Division *
                </label>
                <select
                  value={division}
                  onChange={(e) => handleDivisionChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F10D27]/20 cursor-pointer"
                >
                  {Object.keys(BANGLADESH_DIVISIONS).map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-bold text-[#10183F] uppercase tracking-wider mb-1.5">
                  District *
                </label>
                <select
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F10D27]/20 cursor-pointer"
                >
                  {availableDistricts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              {/* Thana / Area */}
              <div>
                <label className="block text-xs font-bold text-[#10183F] uppercase tracking-wider mb-1.5">
                  Thana / Area *
                </label>
                <select
                  value={thana}
                  onChange={(e) => setThana(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#F10D27]/20 cursor-pointer"
                >
                  {availableThanas.map((th) => (
                    <option key={th} value={th}>
                      {th}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Automatic Delivery Zone Notification Badge */}
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-all ${
              isInsideDhakaCity 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 shrink-0" />
                <span className="font-semibold">
                  {isInsideDhakaCity 
                    ? `Inside Dhaka City (${thana}) — Delivery Charge: ৳60`
                    : `Outside Dhaka City (${thana}, ${district}) — Delivery Charge: ৳100`}
                </span>
              </div>
              <span className="font-mono font-bold text-sm">
                ৳{deliveryCharge}
              </span>
            </div>

            {/* Detailed Street Address */}
            <div>
              <label className="block text-xs font-bold text-[#10183F] uppercase tracking-wider mb-1.5">
                Full Street / House / Road Address *
              </label>
              <textarea
                rows={3}
                placeholder="House No, Road No, Sector / Block, Flat or Landmark..."
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                className={`w-full p-3.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#F10D27]/20 ${
                  errors.streetAddress ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                }`}
              />
              {errors.streetAddress && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.streetAddress}
                </p>
              )}
            </div>

            {/* Order Note */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Delivery Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Call before arrival, leave with security, etc."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#F10D27]/20"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-[#10183F] uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Select Payment Method *</span>
                <span className="text-[11px] font-normal text-slate-500">
                  {paymentMethod === 'cod' ? 'Cash on Delivery' : `${paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Mobile Transfer`}
                </span>
              </label>

              {/* 3 Payment Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'cod'
                      ? 'border-[#F10D27] bg-red-50/30 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-[#10183F]">Cash on Delivery</span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'cod' ? 'border-[#F10D27] bg-[#F10D27]' : 'border-slate-300'
                    }`}>
                      {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500">Pay cash upon receiving parcel</span>
                </div>

                {/* bKash */}
                <div
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'bkash'
                      ? 'border-[#E2136E] bg-[#E2136E]/5 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E2136E]" />
                      <span className="font-bold text-xs text-[#E2136E]">bKash</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'bkash' ? 'border-[#E2136E] bg-[#E2136E]' : 'border-slate-300'
                    }`}>
                      {paymentMethod === 'bkash' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500">Send Money / Payment</span>
                </div>

                {/* Nagad */}
                <div
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'nagad'
                      ? 'border-[#F7941D] bg-[#F7941D]/5 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F7941D]" />
                      <span className="font-bold text-xs text-[#F7941D]">Nagad</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'nagad' ? 'border-[#F7941D] bg-[#F7941D]' : 'border-slate-300'
                    }`}>
                      {paymentMethod === 'nagad' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500">Send Money / Payment</span>
                </div>
              </div>

              {/* bKash & Nagad Manual Payment Panel */}
              {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                <div className="mt-4 p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-4">
                  {/* Panel Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white ${
                        paymentMethod === 'bkash' ? 'bg-[#E2136E]' : 'bg-[#F7941D]'
                      }`}>
                        {paymentMethod === 'bkash' ? 'bK' : 'NG'}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#10183F]">
                          {paymentMethod === 'bkash' ? 'bKash Manual Mobile Payment' : 'Nagad Manual Mobile Payment'}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Follow the steps below to complete your order payment
                        </p>
                      </div>
                    </div>

                    {/* Instruction language switch */}
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setInstructionLang('both')}
                        className={`px-2 py-1 rounded-md transition-colors ${
                          instructionLang === 'both' ? 'bg-[#10183F] text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Both
                      </button>
                      <button
                        type="button"
                        onClick={() => setInstructionLang('bn')}
                        className={`px-2 py-1 rounded-md transition-colors ${
                          instructionLang === 'bn' ? 'bg-[#10183F] text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        বাংলা
                      </button>
                      <button
                        type="button"
                        onClick={() => setInstructionLang('en')}
                        className={`px-2 py-1 rounded-md transition-colors ${
                          instructionLang === 'en' ? 'bg-[#10183F] text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        EN
                      </button>
                    </div>
                  </div>

                  {/* Payment Target Account Box */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          {paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Payment Number (Send Money / Payment)
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xl sm:text-2xl font-black font-mono tracking-wider text-[#10183F]">
                            {paymentNumber}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Active 24/7
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(paymentNumber);
                          setCopiedNumber(true);
                          setTimeout(() => setCopiedNumber(false), 2500);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          copiedNumber
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
                        }`}
                      >
                        {copiedNumber ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied! (কপি হয়েছে)</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Number</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-slate-600">
                        Total Payable for this Order:
                      </span>
                      <span className="font-mono font-black text-base text-[#F10D27]">
                        ৳{total.toLocaleString('en-BD')} BDT
                      </span>
                    </div>
                  </div>

                  {/* Instructions (Bangla & English) */}
                  <div className="space-y-3 text-xs leading-relaxed">
                    {/* Bangla instructions */}
                    {(instructionLang === 'both' || instructionLang === 'bn') && (
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                        <h5 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F10D27]" />
                          <span>বাংলা: bKash / Nagad পেমেন্ট নির্দেশনা</span>
                        </h5>
                        <ol className="list-decimal list-inside space-y-1 text-slate-700 text-[11px] sm:text-xs">
                          <li>আপনার পছন্দের পেমেন্ট মাধ্যম নির্বাচন করুন: <strong className="text-slate-900">bKash</strong> অথবা <strong className="text-slate-900">Nagad</strong>।</li>
                          <li>নিচের নম্বরে নির্ধারিত অর্ডারের মোট টাকা (<strong className="font-mono text-[#F10D27]">৳{total.toLocaleString('en-BD')}</strong>) <strong className="text-slate-900">Send Money</strong> অথবা <strong className="text-slate-900">Payment</strong> অপশনের মাধ্যমে পাঠান।</li>
                          <li className="font-semibold text-slate-800">
                            Payment Number: <span className="font-mono text-[#F10D27] select-all font-bold">01647583320</span>
                          </li>
                          <li>পেমেন্ট সম্পন্ন হওয়ার পর Transaction ID (TrxID) সংগ্রহ করুন।</li>
                          <li>নিচের ফর্মে Transaction ID লিখে অর্ডার কনফার্ম করুন।</li>
                        </ol>
                      </div>
                    )}

                    {/* English instructions */}
                    {(instructionLang === 'both' || instructionLang === 'en') && (
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                        <h5 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10183F]" />
                          <span>English Payment Instructions</span>
                        </h5>
                        <p className="text-slate-700 text-[11px] sm:text-xs mb-1.5">
                          Send the order total (<strong className="font-mono text-[#F10D27]">৳{total.toLocaleString('en-BD')}</strong>) to the payment number below using the appropriate bKash or Nagad <strong className="text-slate-900">Send Money / Payment</strong> option. After completing the transaction, enter your Transaction ID (TrxID) in the checkout form.
                        </p>
                        <p className="text-slate-800 font-semibold text-[11px] sm:text-xs">
                          Payment Number: <span className="font-mono text-[#F10D27] select-all font-bold">01647583320</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Required Checkout Fields for Mobile Payment */}
                  <div className="p-4 bg-white rounded-xl border-2 border-slate-300 space-y-3">
                    <h5 className="font-bold text-[#10183F] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-[#F10D27]" />
                      <span>Enter Transaction Details to Complete Order</span>
                    </h5>

                    {/* TrxID Input (Mandatory) */}
                    <div>
                      <label className="block text-xs font-bold text-[#10183F] uppercase tracking-wider mb-1">
                        Transaction ID (TrxID) *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. BL82X9KL4M or 9J83B5XX"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                        className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-sm tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-[#F10D27]/20 ${
                          errors.transactionId ? 'border-red-500 bg-red-50/20' : 'border-slate-300 bg-slate-50/40'
                        }`}
                      />
                      {errors.transactionId ? (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-semibold">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.transactionId}</span>
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-500 mt-1">
                          Found in the confirmation SMS received from {paymentMethod === 'bkash' ? 'bKash (16247)' : 'Nagad (16167)'}.
                        </p>
                      )}
                    </div>

                    {/* Sender Mobile Number (Recommended) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Sender Mobile Number (Account used to send money)
                      </label>
                      <input
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        className={`w-full px-3.5 py-2 rounded-xl border font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#F10D27]/20 ${
                          errors.senderNumber ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                        }`}
                      />
                      {errors.senderNumber && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.senderNumber}</span>
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Helps our accounts team instantly identify your transaction on statement reconciliation.
                      </p>
                    </div>

                    {/* Security Notice */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-500">
                      <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        Order will be marked as <strong className="text-amber-700 font-bold">Pending Verification</strong>. We never ask for your PIN, OTP, or password.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit button on Mobile */}
            <div className="pt-4 lg:hidden">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#F10D27] hover:bg-[#d60a20] active:scale-98 text-white font-bold text-base min-h-[48px] py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>{isSubmitting ? 'Confirming Order...' : `Confirm Order — ৳${total.toLocaleString('en-BD')}`}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Order Summary & Confirm (Cols 8-12) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="text-lg font-black text-[#10183F] font-heading mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-semibold text-slate-500">{items.length} items</span>
            </h3>

            {/* Items list */}
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mb-4">
              {items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                    <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#10183F] truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Qty: {item.quantity} {item.selectedColor ? `· ${item.selectedColor}` : ''} {item.selectedSize ? `· Size ${item.selectedSize}` : ''}
                    </p>
                  </div>
                  <span className="text-xs font-bold font-mono text-slate-800 tabular-nums">
                    ৳{(item.product.price * item.quantity).toLocaleString('en-BD')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculation Totals */}
            <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-800 font-mono tabular-nums">
                  ৳{subtotal.toLocaleString('en-BD')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  Delivery Charge ({isInsideDhakaCity ? 'Inside Dhaka City' : 'Outside Dhaka City'})
                </span>
                <span className="font-bold font-mono text-slate-800 tabular-nums">
                  ৳{deliveryCharge}
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-slate-200 text-base font-black text-[#10183F]">
                <span>Total Payable</span>
                <span className="text-2xl font-bold font-mono text-[#F10D27] tabular-nums">
                  ৳{total.toLocaleString('en-BD')}
                </span>
              </div>
            </div>

            {/* Desktop Confirm Button */}
            <div className="mt-6 hidden lg:block">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#F10D27] hover:bg-[#d60a20] active:scale-98 text-white font-bold text-base py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
              >
                <span>{isSubmitting ? 'Placing Order...' : 'Confirm Order Now'}</span>
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Risk: Check product before payment on delivery</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>7-Day Replacement Guarantee for any defect</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
