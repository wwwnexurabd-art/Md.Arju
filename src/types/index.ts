export interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // Current price in BDT (৳)
  originalPrice?: number; // Original price before discount
  discountPercent?: number; // e.g. 17 for -17%
  image: string;
  images?: string[];
  description: string;
  inStock: boolean;
  stockCount: number;
  featured?: boolean;
  isNewArrival?: boolean;
  isOffer?: boolean;
  rating: number;
  reviewsCount: number;
  variants?: {
    type: 'size' | 'color';
    name: string;
    options: string[];
  }[];
  specifications?: Record<string, string>;
  sku: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  alternativePhone?: string;
  division: string;
  district: string;
  thana: string;
  streetAddress: string;
  note?: string;
}

export type OrderPaymentStatus = 
  | 'Awaiting Payment' 
  | 'Pending Verification' 
  | 'Payment Verified' 
  | 'Payment Rejected' 
  | 'Unpaid' 
  | 'Paid' 
  | 'Refunded';

export type OrderFulfillmentStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Processing' 
  | 'Shipped' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Returned';

export interface PaymentVerificationDetails {
  status: 'Payment Verified' | 'Payment Rejected';
  verifiedBy: string;
  verifiedAt: string;
  note?: string;
  transactionId?: string;
  senderNumber?: string;
}

export interface PaymentHistoryEntry {
  status: OrderPaymentStatus;
  timestamp: string;
  updatedBy: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  shippingAddress: ShippingAddress;
  deliveryArea: 'inside_dhaka' | 'outside_dhaka';
  paymentMethod: 'cod' | 'bkash' | 'nagad';
  paymentStatus: OrderPaymentStatus;
  transactionId?: string;
  senderNumber?: string;
  paymentVerification?: PaymentVerificationDetails;
  paymentHistory?: PaymentHistoryEntry[];
  status: OrderFulfillmentStatus;
  notes?: string;
  history?: {
    status: string;
    timestamp: string;
    updatedBy: string;
    note?: string;
  }[];
}

export type GridColumns = 1 | 2 | 3;

export type NavigationPage = 
  | 'home'
  | 'products'
  | 'product-detail'
  | 'categories'
  | 'category'
  | 'offers'
  | 'new-arrivals'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'order-tracking'
  | 'about'
  | 'contact'
  | 'faq'
  | 'shipping-policy'
  | 'refund-policy'
  | 'privacy-policy'
  | 'terms'
  | 'admin';
