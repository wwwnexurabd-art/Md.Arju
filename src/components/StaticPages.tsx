import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  HelpCircle, 
  FileText,
  CheckCircle2,
  MessageCircle
} from 'lucide-react';
import { NavigationPage } from '../types';
import { HOTLINE_NUMBER, WHATSAPP_NUMBER, SUPPORT_EMAIL, STORE_ADDRESS } from '../data/products';

interface StaticPagesProps {
  page: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  language: 'EN' | 'BN';
  cms?: any;
}

export const StaticPages: React.FC<StaticPagesProps> = ({ page, onNavigate, language, cms }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* About Us */}
      {page === 'about' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-[#F10D27] uppercase tracking-wider">About Our Company</span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#10183F] font-heading mt-1">
              About NEXURA.BD
            </h1>
            <p className="text-sm text-slate-500 mt-1">TECH · FASHION · LIFESTYLE</p>
          </div>

          <div className="prose text-slate-700 space-y-4 text-sm sm:text-base leading-relaxed">
            <p>
              Welcome to <strong>NEXURA.BD</strong>, your trusted destination for premium electronics, streetwear fashion hoodies, audio recording accessories, gaming consoles, and mobile gadgets in Bangladesh.
            </p>
            <p>
              Founded with the vision to bridge the gap between world-class authentic tech products and Bangladeshi consumers, NEXURA.BD offers carefully curated items that blend cutting-edge utility with standout aesthetics.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <ShieldCheck className="w-8 h-8 text-[#F10D27] mx-auto mb-2" />
                <h4 className="font-bold text-sm text-[#10183F]">100% Genuine</h4>
                <p className="text-xs text-slate-500 mt-1">Directly sourced authentic tech & original apparel.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <Truck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-[#10183F]">Nationwide Delivery</h4>
                <p className="text-xs text-slate-500 mt-1">Inside Dhaka ৳60 (24-48h) & Outside Dhaka ৳100 (48-72h).</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <RotateCcw className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-[#10183F]">7-Day Replacement</h4>
                <p className="text-xs text-slate-500 mt-1">Hassle-free replacement for any manufacturing defect.</p>
              </div>
            </div>

            <p>
              Whether you need studio microphones for content creation, ergonomic phone coolers for mobile gaming, or heavy-knit streetwear hoodies, our fulfillment hub in Uttara, Dhaka ensures prompt packaging, fast courier transit, and seamless cash-on-delivery handling.
            </p>
          </div>
        </div>
      )}

      {/* Contact Us */}
      {page === 'contact' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-[#F10D27] uppercase tracking-wider">Get in Touch</span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#10183F] font-heading mt-1">
              Contact NEXURA.BD
            </h1>
            <p className="text-sm text-slate-500 mt-1">We are here to assist you with order inquiries, product advice, and after-sales support.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#F10D27] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hotline & Customer Support</h4>
                  <a href={`tel:${(cms?.hotlineNumber || HOTLINE_NUMBER).replace(/\s+/g, '')}`} className="text-lg font-bold text-[#10183F] hover:text-[#F10D27] block font-mono">
                    {cms?.hotlineNumber || HOTLINE_NUMBER}
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">Saturday to Thursday (10:00 AM – 9:00 PM)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">WhatsApp Support</h4>
                  <a 
                    href={`https://wa.me/${(cms?.whatsappNumber || WHATSAPP_NUMBER).replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-base font-bold text-emerald-700 hover:underline block font-mono"
                  >
                    +971 0555282918
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">Instant messaging & order confirmations</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Inquiries</h4>
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-sm font-semibold text-[#10183F] hover:text-[#F10D27] block">
                    {SUPPORT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Store & Fulfillment Center</h4>
                  <p className="text-sm font-medium text-slate-800 leading-snug">
                    {STORE_ADDRESS}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="text-base font-bold text-[#10183F] mb-4">Send Us a Direct Message</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert('Thank you! Your message has been received.'); }} className="space-y-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#F10D27]"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Your Mobile Number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#F10D27]"
                  />
                </div>
                <div>
                  <textarea
                    rows={3}
                    required
                    placeholder="How can we help you?"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#F10D27]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#F10D27] hover:bg-[#d60a20] text-white font-bold text-sm py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      {page === 'faq' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-[#F10D27] uppercase tracking-wider">Help Center</span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#10183F] font-heading mt-1">
              Frequently Asked Questions (FAQ)
            </h1>
          </div>

          <div className="divide-y divide-slate-100 space-y-4">
            <div className="pt-3">
              <h3 className="text-base font-bold text-[#10183F] mb-1">
                How much is the delivery charge?
              </h3>
              <p className="text-sm text-slate-600">
                Inside Dhaka City, delivery charge is <strong>৳60</strong>. Outside Dhaka City (all divisions and districts across Bangladesh), delivery charge is <strong>৳100</strong>.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="text-base font-bold text-[#10183F] mb-1">
                How long does delivery take?
              </h3>
              <p className="text-sm text-slate-600">
                Inside Dhaka City: Within <strong>24 to 48 hours</strong>. Outside Dhaka City: Within <strong>48 to 72 hours</strong> via partner courier services (Steadfast, Pathao, RedX).
              </p>
            </div>

            <div className="pt-4">
              <h3 className="text-base font-bold text-[#10183F] mb-1">
                Can I inspect the product before paying?
              </h3>
              <p className="text-sm text-slate-600">
                Yes! We offer 100% Cash on Delivery (COD). You can check the parcel condition in front of the delivery agent before paying.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="text-base font-bold text-[#10183F] mb-1">
                What is your return & replacement policy?
              </h3>
              <p className="text-sm text-slate-600">
                We provide a <strong>7-Day Replacement Guarantee</strong> for any hardware or manufacturing defect. If you experience any problem, simply contact our helpline or WhatsApp.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="text-base font-bold text-[#10183F] mb-1">
                How do I track my order?
              </h3>
              <p className="text-sm text-slate-600">
                Navigate to the <button onClick={() => onNavigate('order-tracking')} className="text-[#F10D27] font-bold hover:underline">Track Order</button> tab in our top menu, enter your Order ID (e.g. NX-84291) or Phone Number, and view live status updates.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Policy */}
      {page === 'shipping-policy' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-[#F10D27] uppercase tracking-wider">Policies</span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#10183F] font-heading mt-1">
              Shipping & Delivery Policy
            </h1>
          </div>

          <div className="text-sm sm:text-base text-slate-700 space-y-4 leading-relaxed">
            <p>
              At <strong>NEXURA.BD</strong>, we prioritize quick, safe, and transparent delivery of your orders across all 64 districts of Bangladesh.
            </p>

            <h3 className="text-lg font-bold text-[#10183F] mt-4">1. Delivery Zones & Charges</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
              <li><strong>Inside Dhaka City:</strong> ৳60 flat delivery charge. Covered areas include Dhanmondi, Gulshan, Banani, Uttara, Mirpur, Mohammadpur, Motijheel, Badda, Rampura, Khilgaon, Old Dhaka, Bashundhara, and surrounding central city thanas.</li>
              <li><strong>Outside Dhaka City:</strong> ৳100 flat delivery charge. Covers all other regions including Savar, Keraniganj, Gazipur, Narayanganj, Chattogram, Sylhet, Rajshahi, Khulna, Barishal, Rangpur, and Mymensingh.</li>
            </ul>

            <h3 className="text-lg font-bold text-[#10183F] mt-4">2. Order Verification Call</h3>
            <p className="text-sm text-slate-600">
              After placing an order on NEXURA.BD, our customer relationship team will place a brief phone call to verify your shipping address, color/size options, and contact availability.
            </p>

            <h3 className="text-lg font-bold text-[#10183F] mt-4">3. Courier Partners</h3>
            <p className="text-sm text-slate-600">
              We work exclusively with authorized courier networks including Steadfast Courier, Pathao Courier, and RedX Logistics to ensure tracking timestamps and secure cash handover.
            </p>
          </div>
        </div>
      )}

      {/* Refund Policy */}
      {page === 'refund-policy' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-[#F10D27] uppercase tracking-wider">Guarantee</span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#10183F] font-heading mt-1">
              Return & Refund Policy
            </h1>
          </div>

          <div className="text-sm sm:text-base text-slate-700 space-y-4 leading-relaxed">
            <p>
              NEXURA.BD is committed to 100% customer satisfaction. We provide a comprehensive <strong>7-Day Replacement Guarantee</strong> on all products.
            </p>

            <h3 className="text-lg font-bold text-[#10183F] mt-4">Conditions for Return & Replacement:</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
              <li>Product received has a manufacturing defect or physical damage during transit.</li>
              <li>Wrong item, color, or size delivered compared to your order confirmation.</li>
              <li>Product must be in its original packaging with all included accessories and user manuals.</li>
            </ul>

            <h3 className="text-lg font-bold text-[#10183F] mt-4">How to Initiate a Claim:</h3>
            <p className="text-sm text-slate-600">
              Contact our hotline at <strong>{HOTLINE_NUMBER}</strong> or send a message to our WhatsApp support at <strong>+{WHATSAPP_NUMBER}</strong> with photos/video of the issue and your Order Number within 7 days of delivery.
            </p>
          </div>
        </div>
      )}

      {/* Privacy Policy */}
      {page === 'privacy-policy' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-4 text-sm text-slate-700">
          <h1 className="text-2xl font-black text-[#10183F] font-heading mb-4">Privacy Policy</h1>
          <p>At NEXURA.BD, we value your privacy. Your personal information (name, address, mobile number) is used solely for the fulfillment of orders and delivery coordination.</p>
          <p>We do not sell, rent, or lease customer data to third-party marketing companies.</p>
        </div>
      )}

      {/* Terms */}
      {page === 'terms' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-4 text-sm text-slate-700">
          <h1 className="text-2xl font-black text-[#10183F] font-heading mb-4">Terms & Conditions</h1>
          <p>By using the NEXURA.BD storefront and placing an order, you agree to our terms of service, payment rules, and fair use guidelines.</p>
          <p>All prices are listed in Bangladeshi Taka (৳). Orders are subject to inventory availability and phone verification.</p>
        </div>
      )}
    </div>
  );
};
