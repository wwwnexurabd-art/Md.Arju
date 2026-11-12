import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db, verifyPassword, hashPassword, AdminSession } from './server/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Auth Middleware
export interface AuthenticatedRequest extends Request {
  session?: AdminSession;
}

function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : (req.headers['x-admin-token'] as string);

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  const session = db.getSession(token);
  if (!session) {
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }

  req.session = session;
  next();
}

function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.session) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.session.role)) {
      return res.status(403).json({ 
        error: `Permission denied. Your role (${req.session.role}) does not have permission for this action.` 
      });
    }
    next();
  };
}

// ----------------- AUTH ENDPOINTS -----------------
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const admin = db.getAdmins().find(a => a.email.toLowerCase() === email.trim().toLowerCase());
  if (!admin || admin.status !== 'active') {
    return res.status(401).json({ error: 'Invalid administrator credentials.' });
  }

  const isValid = verifyPassword(password, admin.passwordHash, admin.salt);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid administrator credentials.' });
  }

  // Update last login
  admin.lastLogin = new Date().toISOString();
  db.saveData();

  const session = db.createSession(admin);
  db.addAuditLog({
    adminEmail: admin.email,
    adminName: admin.name,
    role: admin.role,
    action: 'Admin Login',
    entity: 'Auth',
    details: `Successful login from ${req.ip || 'local'}`
  });

  res.json({
    token: session.token,
    user: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      lastLogin: admin.lastLogin
    }
  });
});

app.get('/api/auth/me', authenticate, (req: AuthenticatedRequest, res) => {
  res.json({
    user: {
      id: req.session!.userId,
      name: req.session!.name,
      email: req.session!.email,
      role: req.session!.role
    }
  });
});

app.post('/api/auth/logout', authenticate, (req: AuthenticatedRequest, res) => {
  if (req.session?.token) {
    db.removeSession(req.session.token);
    db.addAuditLog({
      adminEmail: req.session.email,
      adminName: req.session.name,
      role: req.session.role,
      action: 'Admin Logout',
      entity: 'Auth',
      details: 'User logged out'
    });
  }
  res.json({ success: true });
});

app.post('/api/auth/reset-password', authenticate, (req: AuthenticatedRequest, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  const admin = db.getAdmins().find(a => a.id === req.session!.userId);
  if (!admin) return res.status(404).json({ error: 'Admin account not found.' });

  const valid = verifyPassword(currentPassword, admin.passwordHash, admin.salt);
  if (!valid) return res.status(400).json({ error: 'Current password is incorrect.' });

  const hashed = hashPassword(newPassword);
  admin.passwordHash = hashed.hash;
  admin.salt = hashed.salt;
  db.saveData();

  db.addAuditLog({
    adminEmail: req.session!.email,
    adminName: req.session!.name,
    role: req.session!.role,
    action: 'Password Change',
    entity: 'Admin User',
    details: 'Password was updated successfully'
  });

  res.json({ success: true, message: 'Password updated successfully.' });
});

// ----------------- PRODUCTS ENDPOINTS -----------------
app.get('/api/products', (req, res) => {
  const { search, category, sort } = req.query;
  let products = [...db.getProducts()];

  if (category && category !== 'all') {
    products = products.filter(p => 
      p.category.toLowerCase().includes((category as string).toLowerCase())
    );
  }

  if (search) {
    const q = (search as string).toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q)
    );
  }

  if (sort === 'price_low') products.sort((a, b) => a.price - b.price);
  if (sort === 'price_high') products.sort((a, b) => b.price - a.price);
  if (sort === 'discount') products.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));

  res.json(products);
});

app.post('/api/products', authenticate, requireRole(['super_admin', 'store_manager']), (req: AuthenticatedRequest, res) => {
  const { name, category, price, originalPrice, stockCount, image, description, sku, variants, specifications } = req.body;

  if (!name || !price || isNaN(Number(price))) {
    return res.status(400).json({ error: 'Product name and valid price are required.' });
  }

  const priceNum = Number(price);
  const origPriceNum = originalPrice ? Number(originalPrice) : undefined;
  const discountPercent = origPriceNum && origPriceNum > priceNum 
    ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) 
    : undefined;

  const newProduct = {
    id: `prod-${Date.now()}`,
    sku: sku || `NX-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    name: name.trim(),
    category: category || 'Electronics & Gadgets',
    price: priceNum,
    originalPrice: origPriceNum,
    discountPercent,
    image: image || '/images/products/smartwatch-ultra.jpg',
    images: req.body.images || [image || '/images/products/smartwatch-ultra.jpg'],
    description: description || 'Premium store merchandise with guaranteed quality.',
    inStock: Number(stockCount) > 0,
    stockCount: Number(stockCount) || 10,
    rating: 4.8,
    reviewsCount: 1,
    featured: req.body.featured || false,
    variants: variants || [],
    specifications: specifications || {},
    seoTitle: req.body.seoTitle || name,
    seoDescription: req.body.seoDescription || description
  };

  db.addProduct(newProduct, req.session!.email);

  db.addAuditLog({
    adminEmail: req.session!.email,
    adminName: req.session!.name,
    role: req.session!.role,
    action: 'Create Product',
    entity: 'Product',
    entityId: newProduct.id,
    details: `Created product: ${newProduct.name} (৳${newProduct.price}, Stock: ${newProduct.stockCount})`
  });

  res.status(201).json(newProduct);
});

app.put('/api/products/:id', authenticate, requireRole(['super_admin', 'store_manager']), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (updates.price) updates.price = Number(updates.price);
  if (updates.originalPrice) updates.originalPrice = Number(updates.originalPrice);
  if (updates.stockCount !== undefined) {
    updates.stockCount = Number(updates.stockCount);
    updates.inStock = updates.stockCount > 0;
  }
  if (updates.originalPrice && updates.price && updates.originalPrice > updates.price) {
    updates.discountPercent = Math.round(((updates.originalPrice - updates.price) / updates.originalPrice) * 100);
  }

  const updated = db.updateProduct(id, updates, req.session!.email);
  if (!updated) return res.status(404).json({ error: 'Product not found.' });

  db.addAuditLog({
    adminEmail: req.session!.email,
    adminName: req.session!.name,
    role: req.session!.role,
    action: 'Update Product',
    entity: 'Product',
    entityId: id,
    details: `Updated product fields: ${Object.keys(updates).join(', ')}`
  });

  res.json(updated);
});

app.delete('/api/products/:id', authenticate, requireRole(['super_admin', 'store_manager']), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const prod = db.getProducts().find(p => p.id === id);
  if (!prod) return res.status(404).json({ error: 'Product not found.' });

  db.deleteProduct(id);

  db.addAuditLog({
    adminEmail: req.session!.email,
    adminName: req.session!.name,
    role: req.session!.role,
    action: 'Delete Product',
    entity: 'Product',
    entityId: id,
    details: `Deleted product: ${prod.name}`
  });

  res.json({ success: true, message: 'Product removed.' });
});

// ----------------- ORDERS ENDPOINTS -----------------
app.get('/api/orders', authenticate, (req, res) => {
  const { status, paymentStatus, search, date } = req.query;
  let orders = [...db.getOrders()];

  if (status && status !== 'all') {
    orders = orders.filter(o => o.status === status);
  }

  if (paymentStatus && paymentStatus !== 'all') {
    orders = orders.filter(o => o.paymentStatus === paymentStatus);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    orders = orders.filter(o => 
      o.orderNumber.toLowerCase().includes(q) || 
      o.shippingAddress.fullName.toLowerCase().includes(q) ||
      o.shippingAddress.phone.includes(q)
    );
  }

  if (date) {
    orders = orders.filter(o => o.date.startsWith(date as string));
  }

  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const { items, shippingAddress, paymentMethod, notes, couponCode, transactionId, senderNumber } = req.body;

  if (!items || !items.length || !shippingAddress || !shippingAddress.fullName || !shippingAddress.phone) {
    return res.status(400).json({ error: 'Incomplete order information.' });
  }

  // Validate manual mobile payment fields
  const method = paymentMethod || 'cod';
  if (method === 'bkash' || method === 'nagad') {
    const cleanTrx = transactionId ? String(transactionId).trim().toUpperCase() : '';
    if (!cleanTrx) {
      return res.status(400).json({ 
        error: `Transaction ID (TrxID) is required for ${method === 'bkash' ? 'bKash' : 'Nagad'} payment. / ${method === 'bkash' ? 'bKash' : 'Nagad'} পেমেন্টের জন্য ট্রানজেকশন আইডি (TrxID) আবশ্যক।` 
      });
    }

    if (!/^[A-Z0-9_-]{5,30}$/.test(cleanTrx)) {
      return res.status(400).json({
        error: 'Invalid Transaction ID format. TrxID should consist of alphanumeric characters (e.g., BL82X9KL4M).'
      });
    }

    const duplicate = db.findOrderByTrxId(cleanTrx);
    if (duplicate) {
      return res.status(400).json({
        error: `This Transaction ID (${cleanTrx}) has already been recorded for order ${duplicate.orderNumber}. Please submit a unique transaction ID or contact support.`
      });
    }
  }

  // Validate coupon if applied
  let discount = 0;
  if (couponCode) {
    const coupon = db.getCoupons().find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive);
    if (coupon) {
      const subtotal = items.reduce((sum: number, it: any) => sum + it.product.price * it.quantity, 0);
      if (subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === 'percentage') {
          discount = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        } else {
          discount = coupon.discountValue;
        }
        coupon.usedCount += 1;
      }
    }
  }

  // Automatic delivery area classification
  const deliverySettings = db.getDeliverySettings();
  const isInsideDhaka = shippingAddress.division === 'Dhaka' && 
                        shippingAddress.district === 'Dhaka' && 
                        deliverySettings.dhakaCityAreas.includes(shippingAddress.thana);

  const deliveryCharge = isInsideDhaka ? deliverySettings.insideDhakaFee : deliverySettings.outsideDhakaFee;
  const subtotal = items.reduce((sum: number, it: any) => sum + it.product.price * it.quantity, 0);
  const total = Math.max(0, subtotal - discount) + deliveryCharge;

  const newOrder = db.createOrder({
    items,
    shippingAddress,
    deliveryArea: isInsideDhaka ? 'inside_dhaka' : 'outside_dhaka',
    deliveryCharge,
    subtotal,
    discount,
    total,
    paymentMethod: method,
    transactionId: transactionId ? String(transactionId).trim().toUpperCase() : undefined,
    senderNumber: senderNumber ? String(senderNumber).trim() : undefined,
    notes
  });

  res.status(201).json(newOrder);
});

app.put('/api/orders/:orderNumber/status', authenticate, (req: AuthenticatedRequest, res) => {
  const { orderNumber } = req.params;
  const { status, note } = req.body;

  const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid order fulfillment status.' });
  }

  const updated = db.updateOrderStatus(orderNumber, status, req.session!.email, note);
  if (!updated) return res.status(404).json({ error: 'Order not found.' });

  db.addAuditLog({
    adminEmail: req.session!.email,
    adminName: req.session!.name,
    role: req.session!.role,
    action: 'Update Order Status',
    entity: 'Order',
    entityId: orderNumber,
    details: `Changed status to ${status}${note ? ` (Note: ${note})` : ''}`
  });

  res.json(updated);
});

// Admin verify or reject manual bKash/Nagad payment
app.post('/api/orders/:orderNumber/verify-payment', authenticate, requireRole(['super_admin', 'store_manager', 'order_staff']), (req: AuthenticatedRequest, res) => {
  const { orderNumber } = req.params;
  const { status, note } = req.body;

  if (status !== 'Payment Verified' && status !== 'Payment Rejected') {
    return res.status(400).json({ error: 'Invalid payment verification status. Must be "Payment Verified" or "Payment Rejected".' });
  }

  const updated = db.verifyOrderPayment(orderNumber, {
    status,
    note,
    adminEmail: req.session!.email,
    adminName: req.session!.name
  });

  if (!updated) return res.status(404).json({ error: 'Order not found.' });

  db.addAuditLog({
    adminEmail: req.session!.email,
    adminName: req.session!.name,
    role: req.session!.role,
    action: status === 'Payment Verified' ? 'Verify Mobile Payment' : 'Reject Mobile Payment',
    entity: 'Order',
    entityId: orderNumber,
    details: `${status} for ${updated.paymentMethod?.toUpperCase()} (TrxID: ${updated.transactionId || 'N/A'})${note ? ` - Note: ${note}` : ''}`
  });

  res.json(updated);
});

app.put('/api/orders/:orderNumber/payment', authenticate, requireRole(['super_admin', 'store_manager']), (req: AuthenticatedRequest, res) => {
  const { orderNumber } = req.params;
  const { paymentStatus, note } = req.body;

  const valid = ['Unpaid', 'Paid', 'Refunded', 'Pending Verification', 'Payment Verified', 'Payment Rejected', 'Awaiting Payment'];
  if (!valid.includes(paymentStatus)) {
    return res.status(400).json({ error: 'Invalid payment status.' });
  }

  const updated = db.updatePaymentStatus(orderNumber, paymentStatus, req.session!.email, note);
  if (!updated) return res.status(404).json({ error: 'Order not found.' });

  db.addAuditLog({
    adminEmail: req.session!.email,
    adminName: req.session!.name,
    role: req.session!.role,
    action: 'Update Payment Status',
    entity: 'Order',
    entityId: orderNumber,
    details: `Changed payment status to ${paymentStatus}${note ? ` (Note: ${note})` : ''}`
  });

  res.json(updated);
});

// ----------------- CUSTOMERS ENDPOINTS -----------------
app.get('/api/customers', authenticate, (req, res) => {
  const { search } = req.query;
  let customers = [...db.getCustomers()];

  if (search) {
    const q = (search as string).toLowerCase();
    customers = customers.filter(c => 
      c.fullName.toLowerCase().includes(q) || 
      c.phone.includes(q) || 
      c.district.toLowerCase().includes(q)
    );
  }

  res.json(customers);
});

app.put('/api/customers/:phone/notes', authenticate, (req: AuthenticatedRequest, res) => {
  const { phone } = req.params;
  const { notes } = req.body;

  const updated = db.updateCustomerNote(phone, notes);
  if (!updated) return res.status(404).json({ error: 'Customer not found.' });

  db.addAuditLog({
    adminEmail: req.session!.email,
    adminName: req.session!.name,
    role: req.session!.role,
    action: 'Update Customer Note',
    entity: 'Customer',
    entityId: phone,
    details: `Updated internal note for customer ${updated.fullName}`
  });

  res.json(updated);
});

// ----------------- INVENTORY ENDPOINTS -----------------
app.get('/api/inventory', authenticate, (req, res) => {
  const products = db.getProducts();
  const logs = db.getInventoryLogs();
  const lowStock = products.filter(p => p.stockCount <= 5);

  res.json({
    products: products.map(p => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      stockCount: p.stockCount,
      price: p.price,
      isLowStock: p.stockCount <= 5
    })),
    lowStock,
    recentLogs: logs.slice(0, 50)
  });
});

app.post('/api/inventory/adjust', authenticate, requireRole(['super_admin', 'store_manager']), (req: AuthenticatedRequest, res) => {
  const { productId, change, reason } = req.body;
  if (!productId || change === undefined || !reason) {
    return res.status(400).json({ error: 'Product ID, stock change, and reason are required.' });
  }

  const prod = db.getProducts().find(p => p.id === productId);
  if (!prod) return res.status(404).json({ error: 'Product not found.' });

  const prev = prod.stockCount;
  const next = Math.max(0, prev + Number(change));
  prod.stockCount = next;
  prod.inStock = next > 0;

  const log = db.addInventoryLog({
    productId: prod.id,
    productName: prod.name,
    previousStock: prev,
    newStock: next,
    change: Number(change),
    reason,
    adminEmail: req.session!.email
  });

  db.addAuditLog({
    adminEmail: req.session!.email,
    adminName: req.session!.name,
    role: req.session!.role,
    action: 'Adjust Inventory',
    entity: 'Product',
    entityId: productId,
    details: `Adjusted stock for ${prod.name}: ${change > 0 ? `+${change}` : change} (${reason})`
  });

  res.json({ success: true, product: prod, log });
});

// ----------------- COUPONS ENDPOINTS -----------------
app.get('/api/coupons', authenticate, (req, res) => {
  res.json(db.getCoupons());
});

app.post('/api/coupons', authenticate, requireRole(['super_admin', 'store_manager']), (req: AuthenticatedRequest, res) => {
  const { code, discountType, discountValue, minOrderAmount, maxDiscount, startDate, expiryDate, usageLimit, perCustomerLimit } = req.body;

  if (!code || !discountValue) {
    return res.status(400).json({ error: 'Coupon code and discount value are required.' });
  }

  const newCoupon = {
    id: `coup-${Date.now()}`,
    code: code.trim().toUpperCase(),
    discountType: discountType || 'percentage',
    discountValue: Number(discountValue),
    minOrderAmount: Number(minOrderAmount) || 0,
    maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
    startDate: startDate || new Date().toISOString().split('T')[0],
    expiryDate: expiryDate || '2026-12-31',
    usageLimit: Number(usageLimit) || 100,
    usedCount: 0,
    perCustomerLimit: Number(perCustomerLimit) || 1,
    isActive: true,
    createdAt: new Date().toISOString()
  };

  db.addCoupon(newCoupon);

  db.addAuditLog({
    adminEmail: req.session!.email,
    adminName: req.session!.name,
    role: req.session!.role,
    action: 'Create Coupon',
    entity: 'Coupon',
    entityId: newCoupon.code,
    details: `Created coupon ${newCoupon.code} (${newCoupon.discountValue}${newCoupon.discountType === 'percentage' ? '%' : '৳'} off)`
  });

  res.status(201).json(newCoupon);
});

app.put('/api/coupons/:id', authenticate, requireRole(['super_admin', 'store_manager']), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const updated = db.updateCoupon(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Coupon not found.' });

  res.json(updated);
});

app.delete('/api/coupons/:id', authenticate, requireRole(['super_admin', 'store_manager']), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  db.deleteCoupon(id);
  res.json({ success: true });
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, orderAmount } = req.body;
  if (!code) return res.status(400).json({ error: 'Coupon code required.' });

  const coupon = db.getCoupons().find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
  if (!coupon) return res.status(404).json({ error: 'Invalid or expired coupon code.' });

  if (coupon.usedCount >= coupon.usageLimit) {
    return res.status(400).json({ error: 'Coupon usage limit has been reached.' });
  }

  const today = new Date().toISOString().split('T')[0];
  if (coupon.expiryDate < today) {
    return res.status(400).json({ error: 'Coupon has expired.' });
  }

  if (orderAmount < coupon.minOrderAmount) {
    return res.status(400).json({ error: `Minimum order amount for this coupon is ৳${coupon.minOrderAmount}.` });
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((orderAmount * coupon.discountValue) / 100);
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = coupon.discountValue;
  }

  res.json({
    valid: true,
    code: coupon.code,
    discount,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue
  });
});

// ----------------- SETTINGS & CMS ENDPOINTS -----------------
app.get('/api/settings/delivery', (req, res) => {
  res.json(db.getDeliverySettings());
});

app.put('/api/settings/delivery', authenticate, requireRole(['super_admin']), (req: AuthenticatedRequest, res) => {
  const { insideDhakaFee, outsideDhakaFee, dhakaCityAreas } = req.body;
  const updated = db.updateDeliverySettings({
    insideDhakaFee: Number(insideDhakaFee),
    outsideDhakaFee: Number(outsideDhakaFee),
    dhakaCityAreas: Array.isArray(dhakaCityAreas) ? dhakaCityAreas : db.getDeliverySettings().dhakaCityAreas
  });

  db.addAuditLog({
    adminEmail: req.session!.email,
    adminName: req.session!.name,
    role: req.session!.role,
    action: 'Update Delivery Settings',
    entity: 'Settings',
    details: `Updated inside Dhaka fee: ৳${insideDhakaFee}, outside: ৳${outsideDhakaFee}`
  });

  res.json(updated);
});

app.get('/api/settings/cms', (req, res) => {
  res.json(db.getCMSSettings());
});

app.put('/api/settings/cms', authenticate, requireRole(['super_admin', 'store_manager']), (req: AuthenticatedRequest, res) => {
  const updated = db.updateCMSSettings(req.body);

  db.addAuditLog({
    adminEmail: req.session!.email,
    adminName: req.session!.name,
    role: req.session!.role,
    action: 'Update Store CMS',
    entity: 'CMS',
    details: 'Storefront text and contact settings updated'
  });

  res.json(updated);
});

// ----------------- REPORTS & ANALYTICS -----------------
app.get('/api/reports/analytics', authenticate, (req, res) => {
  const orders = db.getOrders();
  const products = db.getProducts();

  // Metrics
  const grossSales = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.subtotal, 0);

  const totalDeliveryCollected = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.deliveryCharge, 0);

  const totalDiscounts = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.discount || 0), 0);

  const refundedAmount = orders
    .filter(o => o.paymentStatus === 'Refunded')
    .reduce((sum, o) => sum + o.total, 0);

  const netRevenue = grossSales + totalDeliveryCollected - totalDiscounts - refundedAmount;

  // Status breakdown
  const statusCounts = orders.reduce((acc: any, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  // Category breakdown
  const categorySales: Record<string, number> = {};
  for (const o of orders) {
    if (o.status !== 'Cancelled') {
      for (const item of o.items) {
        const cat = item.product.category || 'Other';
        categorySales[cat] = (categorySales[cat] || 0) + (item.product.price * item.quantity);
      }
    }
  }

  // Inventory valuation
  const inventoryValuation = products.reduce((sum, p) => sum + (p.price * p.stockCount), 0);

  res.json({
    grossSales,
    totalDeliveryCollected,
    totalDiscounts,
    refundedAmount,
    netRevenue,
    totalOrders: orders.length,
    statusCounts,
    categorySales,
    inventoryValuation
  });
});

// ----------------- AUDIT LOGS & STAFF -----------------
app.get('/api/audit-logs', authenticate, requireRole(['super_admin', 'store_manager']), (req, res) => {
  res.json(db.getAuditLogs());
});

app.get('/api/admins', authenticate, requireRole(['super_admin']), (req, res) => {
  const list = db.getAdmins().map(a => ({
    id: a.id,
    name: a.name,
    email: a.email,
    role: a.role,
    status: a.status,
    createdAt: a.createdAt,
    lastLogin: a.lastLogin
  }));
  res.json(list);
});

// ----------------- VITE MIDDLEWARE / SERVE APP -----------------
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NEXURA.BD Server running on http://0.0.0.0:${PORT} (${isDev ? 'development' : 'production'})`);
  });
}

startServer();
