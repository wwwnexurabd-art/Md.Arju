import React, { useState } from 'react';
import { 
  Package, 
  ShoppingBag, 
  DollarSign, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  SlidersHorizontal, 
  Search, 
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Product, Order } from '../types';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onUpdateProduct: (products: Product[]) => void;
  onUpdateOrderStatus: (orderNumber: string, status: Order['status']) => void;
  onClose: () => void;
  language: 'EN' | 'BN';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  onUpdateProduct,
  onUpdateOrderStatus,
  onClose,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // New product form
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Electronics & Gadgets');
  const [newProdStock, setNewProdStock] = useState('25');
  const [newProdImage, setNewProdImage] = useState('/images/products/smartwatch-ultra.jpg');
  const [newProdDesc, setNewProdDesc] = useState('');

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const totalStockItems = products.reduce((sum, p) => sum + p.stockCount, 0);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const updated = products.map(p => p.id === editingProduct.id ? editingProduct : p);
    onUpdateProduct(updated);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter(p => p.id !== id);
      onUpdateProduct(updated);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;

    const priceNum = parseFloat(newProdPrice);
    const origPriceNum = newProdOriginalPrice ? parseFloat(newProdOriginalPrice) : undefined;
    const discount = origPriceNum && origPriceNum > priceNum 
      ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) 
      : undefined;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      sku: `NX-NEW-${Math.floor(100 + Math.random() * 900)}`,
      name: newProdName.trim(),
      category: newProdCategory,
      price: priceNum,
      originalPrice: origPriceNum,
      discountPercent: discount,
      image: newProdImage || '/images/products/smartwatch-ultra.jpg',
      description: newProdDesc.trim() || 'Premium store merchandise with official warranty.',
      inStock: true,
      stockCount: parseInt(newProdStock) || 20,
      rating: 4.8,
      reviewsCount: 1,
    };

    onUpdateProduct([newProduct, ...products]);
    setIsAddingProduct(false);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdOriginalPrice('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-[#10183F] font-heading">
            Store Management Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Real-time management for NEXURA.BD orders, inventory, pricing, and discounts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#10183F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Customer Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#10183F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Catalog Products ({products.length})
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales</span>
          <div className="text-xl sm:text-2xl font-black text-[#10183F] font-mono mt-1 tabular-nums">
            ৳{totalRevenue.toLocaleString('en-BD')}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">From verified checkout</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
          <div className="text-xl sm:text-2xl font-black text-[#10183F] font-mono mt-1 tabular-nums">
            {orders.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">{pendingOrders} pending verification</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Products</span>
          <div className="text-xl sm:text-2xl font-black text-[#10183F] font-mono mt-1 tabular-nums">
            {products.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Live in catalog</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Inventory</span>
          <div className="text-xl sm:text-2xl font-black text-[#10183F] font-mono mt-1 tabular-nums">
            {totalStockItems}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Units available in warehouse</span>
        </div>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-black text-[#10183F] font-heading">Customer Order Log</h2>
            <div className="text-xs text-slate-500">
              Update order statuses to notify customers in real-time
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Delivery Zone</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <span className="font-bold font-mono text-[#10183F] block">{order.orderNumber}</span>
                      <span className="text-slate-400 text-[10px]">
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800 block">{order.shippingAddress.fullName}</span>
                      <span className="font-mono text-slate-500">{order.shippingAddress.phone}</span>
                      <span className="text-slate-400 block text-[10px] truncate max-w-[180px]">
                        {order.shippingAddress.streetAddress}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.deliveryArea === 'inside_dhaka'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {order.deliveryArea === 'inside_dhaka' ? 'Dhaka City (৳60)' : 'Outside Dhaka (৳100)'}
                      </span>
                      <span className="text-slate-500 block text-[10px] mt-0.5">
                        {order.shippingAddress.thana}, {order.shippingAddress.district}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-700">
                        {order.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-[#F10D27] tabular-nums">
                      ৳{order.total.toLocaleString('en-BD')}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full font-bold text-[11px] ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'Processing'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.orderNumber, e.target.value as any)}
                        className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-[#10183F] font-heading">
              Product Catalog & Inventory
            </h2>
            <button
              onClick={() => setIsAddingProduct(true)}
              className="bg-[#F10D27] hover:bg-[#d60a20] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Add Product Form Modal */}
          {isAddingProduct && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <h3 className="text-lg font-bold text-[#10183F]">Add New Store Product</h3>
                  <button onClick={() => setIsAddingProduct(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wireless RGB Mechanical Numpad"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Price (৳) *</label>
                      <input
                        type="number"
                        required
                        placeholder="1200"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Original Price (৳)</label>
                      <input
                        type="number"
                        placeholder="1500"
                        value={newProdOriginalPrice}
                        onChange={(e) => setNewProdOriginalPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Category</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                      >
                        <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                        <option value="Fashion & Clothing">Fashion & Clothing</option>
                        <option value="Audio & Microphones">Audio & Microphones</option>
                        <option value="Gaming Accessories">Gaming Accessories</option>
                        <option value="Mobile Accessories">Mobile Accessories</option>
                        <option value="Smart Home & Lifestyle">Smart Home & Lifestyle</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Initial Stock Count</label>
                      <input
                        type="number"
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Product Description</label>
                    <textarea
                      rows={2}
                      placeholder="Brief details about the specifications and materials..."
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#F10D27] text-white rounded-xl font-bold hover:bg-[#d60a20]"
                    >
                      Save Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Product Modal */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <h3 className="text-lg font-bold text-[#10183F]">Edit Product</h3>
                  <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Product Title</label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Price (৳)</label>
                      <input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Discount %</label>
                      <input
                        type="number"
                        value={editingProduct.discountPercent || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, discountPercent: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Stock Count</label>
                      <input
                        type="number"
                        value={editingProduct.stockCount}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Status</label>
                      <select
                        value={editingProduct.inStock ? 'true' : 'false'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.value === 'true' })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                      >
                        <option value="true">In Stock</option>
                        <option value="false">Out of Stock</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#F10D27] text-white rounded-xl font-bold hover:bg-[#d60a20]"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-4">Item</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Current Price</th>
                    <th className="p-4">Discount</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                        <div>
                          <span className="font-bold text-slate-800 block">{product.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{product.sku}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 font-medium">{product.category}</td>
                      <td className="p-4 font-mono font-bold text-[#F10D27] tabular-nums">
                        ৳{product.price.toLocaleString('en-BD')}
                      </td>
                      <td className="p-4">
                        {product.discountPercent ? (
                          <span className="bg-red-50 text-[#F10D27] font-bold px-2 py-0.5 rounded text-[10px]">
                            -{product.discountPercent}%
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`font-mono font-bold ${product.stockCount > 5 ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {product.stockCount} units
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-1.5 text-slate-600 hover:text-[#10183F] bg-slate-100 rounded-lg"
                          title="Edit Product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 bg-rose-50 rounded-lg"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
