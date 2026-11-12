import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // sha256 with salt
  salt: string;
  role: 'super_admin' | 'store_manager' | 'order_staff';
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin?: string;
}

export interface AdminSession {
  token: string;
  userId: string;
  email: string;
  name: string;
  role: 'super_admin' | 'store_manager' | 'order_staff';
  createdAt: number;
  expiresAt: number;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  previousStock: number;
  newStock: number;
  change: number;
  reason: 'Restock' | 'Order Placed' | 'Order Cancelled' | 'Damaged/Expired' | 'Manual Correction';
  adminEmail: string;
  timestamp: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 10 for 10% or 100 for ৳100
  minOrderAmount: number;
  maxDiscount?: number;
  startDate: string;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  perCustomerLimit: number;
  isActive: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
  division: string;
  district: string;
  thana: string;
  address: string;
  firstOrderDate: string;
  lastOrderDate: string;
  internalNotes?: string;
}

export interface OrderStatusHistory {
  status: string;
  timestamp: string;
  updatedBy: string;
  note?: string;
}

export interface DeliverySettings {
  insideDhakaFee: number;
  outsideDhakaFee: number;
  dhakaCityAreas: string[];
}

export interface CMSSettings {
  heroLabel: string;
  heroHeadline: string;
  heroSubtext: string;
  heroImageUrl: string;
  hotlineNumber: string;
  whatsappNumber: string;
  supportEmail: string;
  storeAddress: string;
  topAnnouncement: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminEmail: string;
  adminName: string;
  role: string;
  action: string;
  entity: string;
  entityId?: string;
  details: string;
  ipAddress?: string;
}

// Password hashing utility
export function hashPassword(password: string, salt?: string) {
  const finalSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, finalSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: finalSalt };
}

export function verifyPassword(password: string, hash: string, salt: string) {
  const testHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return testHash === hash;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store-db.json');

// Initial Dhaka City thanas
const DEFAULT_DHAKA_CITY_THANAS = [
  'Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur', 'Mohammadpur',
  'Motijheel', 'Badda', 'Rampura', 'Khilgaon', 'Old Dhaka (Puran Dhaka)',
  'Bashundhara R/A', 'Tejgaon', 'Malibagh', 'Moghbazar', 'Shahbagh',
  'Paltan', 'Lalbagh', 'New Market', 'Cantonment', 'Kafrul', 'Pallabi',
  'Hazaribagh', 'Kamrangirchar', 'Sutrapur', 'Kotwali', 'Wari',
  'Gandaria', 'Demra', 'Jatrabari', 'Khilkhet', 'Nikunja', 'Baridhara',
  'Shyamoli', 'Kallyanpur', 'Adabor', 'Kalabagan', 'Eskaton', 'Shantinagar', 'Bijoynagar'
];

// Initial Products
import { INITIAL_PRODUCTS } from '../src/data/products';

class Database {
  private data: {
    admins: AdminUser[];
    sessions: Record<string, AdminSession>;
    products: any[];
    orders: any[];
    customers: Customer[];
    inventoryLogs: InventoryLog[];
    coupons: Coupon[];
    deliverySettings: DeliverySettings;
    cmsSettings: CMSSettings;
    auditLogs: AuditLog[];
  };

  constructor() {
    this.data = this.loadData();
  }

  private loadData() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error loading DB file, initializing defaults:', err);
    }
    return this.initDefaultData();
  }

  private initDefaultData() {
    const adminPass = hashPassword('803zPL6ZUh7NWK5');
    const managerPass = hashPassword('Manager@Nexura2026');
    const staffPass = hashPassword('Staff@Nexura2026');

    const defaultAdmins: AdminUser[] = [
      {
        id: 'usr-admin-1',
        name: 'Tanvir Hossain (Super Admin)',
        email: 'admin@nexura.bd',
        passwordHash: adminPass.hash,
        salt: adminPass.salt,
        role: 'super_admin',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-manager-1',
        name: 'Afsana Mim (Store Manager)',
        email: 'manager@nexura.bd',
        passwordHash: managerPass.hash,
        salt: managerPass.salt,
        role: 'store_manager',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-staff-1',
        name: 'Kamrul Hasan (Fulfillment Staff)',
        email: 'staff@nexura.bd',
        passwordHash: staffPass.hash,
        salt: staffPass.salt,
        role: 'order_staff',
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ];

    const defaultCoupons: Coupon[] = [
      {
        id: 'coup-1',
        code: 'NEXURA10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 500,
        maxDiscount: 500,
        startDate: '2026-01-01',
        expiryDate: '2026-12-31',
        usageLimit: 500,
        usedCount: 42,
        perCustomerLimit: 2,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'coup-2',
        code: 'FESTIVE200',
        discountType: 'fixed',
        discountValue: 200,
        minOrderAmount: 2000,
        startDate: '2026-10-01',
        expiryDate: '2026-11-30',
        usageLimit: 100,
        usedCount: 15,
        perCustomerLimit: 1,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    const defaultOrders = [
      {
        id: 'ord-84291',
        orderNumber: 'NX-84291',
        date: new Date(Date.now() - 3600000 * 4).toISOString(),
        items: [
          {
            product: INITIAL_PRODUCTS[0],
            quantity: 1,
            selectedSize: 'L',
            selectedColor: 'Black Combo'
          }
        ],
        subtotal: 1200,
        deliveryCharge: 60,
        discount: 0,
        total: 1260,
        shippingAddress: {
          fullName: 'Tanvir Hossain',
          phone: '01712345678',
          division: 'Dhaka',
          district: 'Dhaka',
          thana: 'Dhanmondi',
          streetAddress: 'House 32, Road 9/A, Dhanmondi R/A'
        },
        deliveryArea: 'inside_dhaka',
        paymentMethod: 'cod',
        paymentStatus: 'Unpaid',
        status: 'Shipped',
        notes: 'Please call before arrival',
        history: [
          { status: 'Pending', timestamp: new Date(Date.now() - 3600000 * 20).toISOString(), updatedBy: 'System' },
          { status: 'Confirmed', timestamp: new Date(Date.now() - 3600000 * 14).toISOString(), updatedBy: 'admin@nexura.bd', note: 'Customer confirmed phone call' },
          { status: 'Processing', timestamp: new Date(Date.now() - 3600000 * 8).toISOString(), updatedBy: 'staff@nexura.bd', note: 'Package quality-checked and sealed' },
          { status: 'Shipped', timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), updatedBy: 'staff@nexura.bd', note: 'Handed over to Steadfast courier' }
        ]
      },
      {
        id: 'ord-84110',
        orderNumber: 'NX-84110',
        date: new Date(Date.now() - 3600000 * 28).toISOString(),
        items: [
          {
            product: INITIAL_PRODUCTS[2],
            quantity: 1,
            selectedColor: 'Type-C for Android'
          }
        ],
        subtotal: 1500,
        deliveryCharge: 100,
        discount: 0,
        total: 1600,
        shippingAddress: {
          fullName: 'Afsana Mim',
          phone: '01898765432',
          division: 'Chattogram',
          district: 'Chattogram',
          thana: 'Agrabad',
          streetAddress: 'Commercial Area, Block B, Agrabad'
        },
        deliveryArea: 'outside_dhaka',
        paymentMethod: 'bkash',
        paymentStatus: 'Paid',
        status: 'Delivered',
        notes: '',
        history: [
          { status: 'Pending', timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), updatedBy: 'System' },
          { status: 'Confirmed', timestamp: new Date(Date.now() - 3600000 * 40).toISOString(), updatedBy: 'manager@nexura.bd', note: 'bKash TrxID verified' },
          { status: 'Shipped', timestamp: new Date(Date.now() - 3600000 * 30).toISOString(), updatedBy: 'staff@nexura.bd' },
          { status: 'Delivered', timestamp: new Date(Date.now() - 3600000 * 28).toISOString(), updatedBy: 'courier_api', note: 'Delivered to recipient with signature' }
        ]
      },
      {
        id: 'ord-84005',
        orderNumber: 'NX-84005',
        date: new Date(Date.now() - 3600000 * 2).toISOString(),
        items: [
          {
            product: INITIAL_PRODUCTS[3],
            quantity: 1,
            selectedColor: 'Matte White'
          }
        ],
        subtotal: 5100,
        deliveryCharge: 60,
        discount: 0,
        total: 5160,
        shippingAddress: {
          fullName: 'Rahim Uddin',
          phone: '01912344321',
          division: 'Dhaka',
          district: 'Dhaka',
          thana: 'Uttara',
          streetAddress: 'Sector 4, Road 11, House 24'
        },
        deliveryArea: 'inside_dhaka',
        paymentMethod: 'cod',
        paymentStatus: 'Unpaid',
        status: 'Pending',
        notes: 'Call before 5 PM',
        history: [
          { status: 'Pending', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), updatedBy: 'Customer Checkout' }
        ]
      }
    ];

    const defaultCustomers: Customer[] = [
      {
        id: 'cust-1',
        fullName: 'Tanvir Hossain',
        phone: '01712345678',
        email: 'tanvir@example.com',
        totalOrders: 1,
        totalSpent: 1260,
        division: 'Dhaka',
        district: 'Dhaka',
        thana: 'Dhanmondi',
        address: 'House 32, Road 9/A, Dhanmondi R/A',
        firstOrderDate: '2026-10-26T14:30:00Z',
        lastOrderDate: '2026-10-26T14:30:00Z',
        internalNotes: 'VIP Customer, always prefers COD delivery in evening.'
      },
      {
        id: 'cust-2',
        fullName: 'Afsana Mim',
        phone: '01898765432',
        email: 'afsana@example.com',
        totalOrders: 1,
        totalSpent: 1600,
        division: 'Chattogram',
        district: 'Chattogram',
        thana: 'Agrabad',
        address: 'Commercial Area, Block B, Agrabad',
        firstOrderDate: '2026-10-25T11:15:00Z',
        lastOrderDate: '2026-10-25T11:15:00Z',
        internalNotes: 'Prompt bKash payer, friendly communication.'
      },
      {
        id: 'cust-3',
        fullName: 'Rahim Uddin',
        phone: '01912344321',
        totalOrders: 1,
        totalSpent: 5160,
        division: 'Dhaka',
        district: 'Dhaka',
        thana: 'Uttara',
        address: 'Sector 4, Road 11, House 24',
        firstOrderDate: '2026-10-28T05:00:00Z',
        lastOrderDate: '2026-10-28T05:00:00Z',
        internalNotes: 'Requested delivery before 5 PM.'
      }
    ];

    const defaultInventoryLogs: InventoryLog[] = [
      {
        id: 'log-1',
        productId: 'prod-001',
        productName: 'Black Paisley Hoodie Combo',
        previousStock: 50,
        newStock: 45,
        change: -5,
        reason: 'Order Placed',
        adminEmail: 'system',
        timestamp: new Date().toISOString()
      },
      {
        id: 'log-2',
        productId: 'prod-004',
        productName: 'J36 Ultra Retro Game Console',
        previousStock: 10,
        newStock: 15,
        change: +5,
        reason: 'Restock',
        adminEmail: 'admin@nexura.bd',
        timestamp: new Date().toISOString()
      }
    ];

    const defaultDeliverySettings: DeliverySettings = {
      insideDhakaFee: 60,
      outsideDhakaFee: 100,
      dhakaCityAreas: DEFAULT_DHAKA_CITY_THANAS
    };

    const defaultCMSSettings: CMSSettings = {
      heroLabel: 'NEXURA.BD',
      heroHeadline: 'Welcome to Our Store',
      heroSubtext: 'Browse our latest collection of quality products.',
      heroImageUrl: '/images/hero/hero-gadgets.jpg',
      hotlineNumber: '+880 01647583320',
      whatsappNumber: '971555282918',
      supportEmail: 'www.nexura.bd@gmail.com',
      storeAddress: 'House 14, Road 7, Sector 3, Uttara, Dhaka-1230, Bangladesh',
      topAnnouncement: 'Cash on Delivery Available Across Bangladesh'
    };

    const defaultAuditLogs: AuditLog[] = [
      {
        id: 'audit-1',
        timestamp: new Date().toISOString(),
        adminEmail: 'admin@nexura.bd',
        adminName: 'Tanvir Hossain',
        role: 'super_admin',
        action: 'System Boot',
        entity: 'System',
        details: 'NEXURA.BD Admin Store Engine successfully initialized'
      }
    ];

    const initial = {
      admins: defaultAdmins,
      sessions: {},
      products: INITIAL_PRODUCTS,
      orders: defaultOrders,
      customers: defaultCustomers,
      inventoryLogs: defaultInventoryLogs,
      coupons: defaultCoupons,
      deliverySettings: defaultDeliverySettings,
      cmsSettings: defaultCMSSettings,
      auditLogs: defaultAuditLogs
    };

    this.saveData(initial);
    return initial;
  }

  public saveData(dataToSave = this.data) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving DB file:', err);
    }
  }

  // Getters
  public getAdmins() { return this.data.admins; }
  public getProducts() { return this.data.products; }
  public getOrders() { return this.data.orders; }
  public getCustomers() { return this.data.customers; }
  public getInventoryLogs() { return this.data.inventoryLogs; }
  public getCoupons() { return this.data.coupons; }
  public getDeliverySettings() { return this.data.deliverySettings; }
  public getCMSSettings() { return this.data.cmsSettings; }
  public getAuditLogs() { return this.data.auditLogs; }

  // Session handling
  public createSession(user: AdminUser): AdminSession {
    const token = crypto.randomBytes(32).toString('hex');
    const session: AdminSession = {
      token,
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    this.data.sessions[token] = session;
    this.saveData();
    return session;
  }

  public getSession(token: string): AdminSession | null {
    const session = this.data.sessions[token];
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      delete this.data.sessions[token];
      this.saveData();
      return null;
    }
    return session;
  }

  public removeSession(token: string) {
    if (this.data.sessions[token]) {
      delete this.data.sessions[token];
      this.saveData();
    }
  }

  // Audit Log Entry
  public addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>) {
    const entry: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...log
    };
    this.data.auditLogs.unshift(entry);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
    this.saveData();
    return entry;
  }

  // Product Operations
  public addProduct(product: any, adminEmail: string) {
    this.data.products.unshift(product);
    this.addInventoryLog({
      productId: product.id,
      productName: product.name,
      previousStock: 0,
      newStock: product.stockCount || 0,
      change: product.stockCount || 0,
      reason: 'Restock',
      adminEmail
    });
    this.saveData();
  }

  public updateProduct(productId: string, updates: any, adminEmail: string) {
    const idx = this.data.products.findIndex(p => p.id === productId);
    if (idx !== -1) {
      const prevStock = this.data.products[idx].stockCount;
      const nextStock = updates.stockCount !== undefined ? updates.stockCount : prevStock;
      
      if (prevStock !== nextStock) {
        this.addInventoryLog({
          productId,
          productName: updates.name || this.data.products[idx].name,
          previousStock: prevStock,
          newStock: nextStock,
          change: nextStock - prevStock,
          reason: 'Manual Correction',
          adminEmail
        });
      }

      this.data.products[idx] = { ...this.data.products[idx], ...updates };
      this.saveData();
      return this.data.products[idx];
    }
    return null;
  }

  public deleteProduct(productId: string) {
    this.data.products = this.data.products.filter(p => p.id !== productId);
    this.saveData();
  }

  // Inventory Log
  public addInventoryLog(log: Omit<InventoryLog, 'id' | 'timestamp'>) {
    const entry: InventoryLog = {
      id: `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...log
    };
    this.data.inventoryLogs.unshift(entry);
    this.saveData();
    return entry;
  }

  // Order Operations
  public findOrderByTrxId(trxId: string, excludeOrderNumber?: string) {
    if (!trxId || !trxId.trim()) return null;
    const cleanTrx = trxId.trim().toUpperCase();
    return this.data.orders.find(o => 
      o.transactionId && 
      o.transactionId.toUpperCase() === cleanTrx && 
      o.orderNumber !== excludeOrderNumber &&
      o.status !== 'Cancelled' &&
      o.paymentStatus !== 'Payment Rejected'
    );
  }

  public createOrder(orderData: any) {
    // Generate order number
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `NX-${randomSuffix}`;
    const initialPaymentStatus = orderData.paymentMethod === 'cod' ? 'Unpaid' : 'Pending Verification';
    const cleanTrxId = orderData.transactionId ? String(orderData.transactionId).trim().toUpperCase() : undefined;
    const cleanSenderNumber = orderData.senderNumber ? String(orderData.senderNumber).trim() : undefined;

    const newOrder = {
      id: `ord-${randomSuffix}`,
      orderNumber,
      date: new Date().toISOString(),
      paymentStatus: initialPaymentStatus,
      status: 'Pending',
      history: [
        { status: 'Pending', timestamp: new Date().toISOString(), updatedBy: 'Customer Checkout' }
      ],
      paymentHistory: [
        {
          status: initialPaymentStatus,
          timestamp: new Date().toISOString(),
          updatedBy: 'Customer Submission',
          note: orderData.paymentMethod === 'cod'
            ? 'Cash on Delivery order placed'
            : `Submitted ${orderData.paymentMethod?.toUpperCase()} payment. TrxID: ${cleanTrxId || 'N/A'}${cleanSenderNumber ? ` from ${cleanSenderNumber}` : ''}`
        }
      ],
      ...orderData,
      transactionId: cleanTrxId,
      senderNumber: cleanSenderNumber
    };

    // Deduct inventory
    for (const item of newOrder.items) {
      const prod = this.data.products.find(p => p.id === item.product.id);
      if (prod) {
        const prev = prod.stockCount;
        prod.stockCount = Math.max(0, prod.stockCount - item.quantity);
        this.addInventoryLog({
          productId: prod.id,
          productName: prod.name,
          previousStock: prev,
          newStock: prod.stockCount,
          change: -item.quantity,
          reason: 'Order Placed',
          adminEmail: 'checkout'
        });
      }
    }

    // Upsert customer
    const phone = newOrder.shippingAddress.phone;
    const existingCust = this.data.customers.find(c => c.phone === phone);
    if (existingCust) {
      existingCust.totalOrders += 1;
      existingCust.totalSpent += newOrder.total;
      existingCust.lastOrderDate = newOrder.date;
      existingCust.address = newOrder.shippingAddress.streetAddress;
      existingCust.thana = newOrder.shippingAddress.thana;
      existingCust.district = newOrder.shippingAddress.district;
      existingCust.division = newOrder.shippingAddress.division;
    } else {
      this.data.customers.push({
        id: `cust-${Date.now()}`,
        fullName: newOrder.shippingAddress.fullName,
        phone,
        totalOrders: 1,
        totalSpent: newOrder.total,
        division: newOrder.shippingAddress.division,
        district: newOrder.shippingAddress.district,
        thana: newOrder.shippingAddress.thana,
        address: newOrder.shippingAddress.streetAddress,
        firstOrderDate: newOrder.date,
        lastOrderDate: newOrder.date
      });
    }

    this.data.orders.unshift(newOrder);
    this.saveData();
    return newOrder;
  }

  public updateOrderStatus(orderNumber: string, status: string, updatedBy: string, note?: string) {
    const order = this.data.orders.find(o => o.orderNumber === orderNumber);
    if (!order) return null;

    const previousStatus = order.status;
    order.status = status;

    if (!order.history) order.history = [];
    order.history.push({
      status,
      timestamp: new Date().toISOString(),
      updatedBy,
      note: note || undefined
    });

    // If order was cancelled or returned, restore stock
    if ((status === 'Cancelled' || status === 'Returned') && previousStatus !== 'Cancelled' && previousStatus !== 'Returned') {
      for (const item of order.items) {
        const prod = this.data.products.find((p: any) => p.id === item.product.id);
        if (prod) {
          const prev = prod.stockCount;
          prod.stockCount += item.quantity;
          this.addInventoryLog({
            productId: prod.id,
            productName: prod.name,
            previousStock: prev,
            newStock: prod.stockCount,
            change: +item.quantity,
            reason: status === 'Cancelled' ? 'Order Cancelled' : 'Damaged/Expired',
            adminEmail: updatedBy
          });
        }
      }
    }

    this.saveData();
    return order;
  }

  public updatePaymentStatus(orderNumber: string, paymentStatus: string, updatedBy: string, note?: string) {
    const order = this.data.orders.find(o => o.orderNumber === orderNumber);
    if (!order) return null;
    order.paymentStatus = paymentStatus;
    if (!order.paymentHistory) order.paymentHistory = [];
    order.paymentHistory.push({
      status: paymentStatus as any,
      timestamp: new Date().toISOString(),
      updatedBy,
      note: note || `Payment status manually updated to ${paymentStatus}`
    });
    this.saveData();
    return order;
  }

  public verifyOrderPayment(
    orderNumber: string, 
    verification: { 
      status: 'Payment Verified' | 'Payment Rejected'; 
      note?: string; 
      adminEmail: string; 
      adminName: string; 
    }
  ) {
    const order = this.data.orders.find(o => o.orderNumber === orderNumber);
    if (!order) return null;

    order.paymentStatus = verification.status;
    order.paymentVerification = {
      status: verification.status,
      verifiedBy: `${verification.adminName} (${verification.adminEmail})`,
      verifiedAt: new Date().toISOString(),
      note: verification.note || undefined,
      transactionId: order.transactionId,
      senderNumber: order.senderNumber
    };

    if (!order.paymentHistory) order.paymentHistory = [];
    order.paymentHistory.push({
      status: verification.status,
      timestamp: new Date().toISOString(),
      updatedBy: `${verification.adminName} (${verification.adminEmail})`,
      note: verification.note || (verification.status === 'Payment Verified' ? 'Payment confirmed and verified against statement' : 'Payment rejected')
    });

    this.saveData();
    return order;
  }

  // Customer Note
  public updateCustomerNote(phone: string, notes: string) {
    const cust = this.data.customers.find(c => c.phone === phone);
    if (cust) {
      cust.internalNotes = notes;
      this.saveData();
      return cust;
    }
    return null;
  }

  // Coupon Operations
  public addCoupon(coupon: Coupon) {
    this.data.coupons.unshift(coupon);
    this.saveData();
  }

  public updateCoupon(couponId: string, updates: Partial<Coupon>) {
    const idx = this.data.coupons.findIndex(c => c.id === couponId);
    if (idx !== -1) {
      this.data.coupons[idx] = { ...this.data.coupons[idx], ...updates };
      this.saveData();
      return this.data.coupons[idx];
    }
    return null;
  }

  public deleteCoupon(couponId: string) {
    this.data.coupons = this.data.coupons.filter(c => c.id !== couponId);
    this.saveData();
  }

  // Delivery Settings
  public updateDeliverySettings(settings: DeliverySettings) {
    this.data.deliverySettings = settings;
    this.saveData();
    return this.data.deliverySettings;
  }

  // CMS Settings
  public updateCMSSettings(settings: CMSSettings) {
    this.data.cmsSettings = settings;
    this.saveData();
    return this.data.cmsSettings;
  }
}

export const db = new Database();
