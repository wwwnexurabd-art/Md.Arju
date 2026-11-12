import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  SlidersHorizontal, 
  AlertCircle, 
  ArrowUpDown, 
  Upload, 
  Image as ImageIcon,
  Star,
  Eye
} from 'lucide-react';
import { Product } from '../types';

interface ProductManagementProps {
  products: Product[];
  onRefresh: () => void;
  token: string;
  adminRole: string;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  onRefresh,
  token,
  adminRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics & Gadgets',
    sku: '',
    price: '',
    originalPrice: '',
    stockCount: '20',
    image: '/images/products/smartwatch-ultra.jpg',
    images: ['/images/products/smartwatch-ultra.jpg'],
    description: '',
    featured: false,
    isActive: true,
    seoTitle: '',
    seoDescription: '',
    colors: 'Black, Navy',
    sizes: 'M, L, XL'
  });

  const canEdit = adminRole === 'super_admin' || adminRole === 'store_manager';

  // Open modal for editing
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    const colorOpts = product.variants?.find(v => v.type === 'color')?.options.join(', ') || '';
    const sizeOpts = product.variants?.find(v => v.type === 'size')?.options.join(', ') || '';

    setFormData({
      name: product.name,
      category: product.category,
      sku: product.sku || '',
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      stockCount: product.stockCount.toString(),
      image: product.image,
      images: product.images && product.images.length > 0 ? product.images : [product.image],
      description: product.description,
      featured: product.featured || false,
      isActive: product.inStock,
      seoTitle: (product as any).seoTitle || product.name,
      seoDescription: (product as any).seoDescription || product.description,
      colors: colorOpts,
      sizes: sizeOpts
    });
    setIsAddOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Electronics & Gadgets',
      sku: `NX-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      price: '',
      originalPrice: '',
      stockCount: '25',
      image: '/images/products/smartwatch-ultra.jpg',
      images: ['/images/products/smartwatch-ultra.jpg'],
      description: '',
      featured: false,
      isActive: true,
      seoTitle: '',
      seoDescription: '',
      colors: 'Black, Titanium',
      sizes: 'Free Size'
    });
    setIsAddOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      setActionError('Product name and price are required.');
      return;
    }

    setLoading(true);
    setActionError('');

    // Format variants
    const variants: any[] = [];
    if (formData.colors.trim()) {
      variants.push({
        type: 'color',
        name: 'Color',
        options: formData.colors.split(',').map(c => c.trim()).filter(Boolean)
      });
    }
    if (formData.sizes.trim()) {
      variants.push({
        type: 'size',
        name: 'Size',
        options: formData.sizes.split(',').map(s => s.trim()).filter(Boolean)
      });
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      sku: formData.sku.trim(),
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      stockCount: Number(formData.stockCount) || 0,
      image: formData.image,
      images: formData.images,
      description: formData.description.trim(),
      featured: formData.featured,
      inStock: formData.isActive && Number(formData.stockCount) > 0,
      variants,
      seoTitle: formData.seoTitle.trim() || formData.name.trim(),
      seoDescription: formData.seoDescription.trim() || formData.description.trim()
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save product');
      }

      setIsAddOpen(false);
      setActionMessage(editingProduct ? 'Product updated successfully' : 'Product created successfully');
      setTimeout(() => setActionMessage(''), 3000);
      onRefresh();
    } catch (err: any) {
      setActionError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete product');
      setActionMessage(`Product "${name}" deleted`);
      setTimeout(() => setActionMessage(''), 3000);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Filter and sort
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchStock = stockFilter === 'all' || 
                       (stockFilter === 'low' && p.stockCount <= 5) ||
                       (stockFilter === 'out' && p.stockCount === 0) ||
                       (stockFilter === 'in' && p.stockCount > 5);
    return matchSearch && matchCat && matchStock;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'stock') return a.stockCount - b.stockCount;
    return a.name.localeCompare(b.name);
  });

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const categories = [
    'Electronics & Gadgets',
    'Fashion & Clothing',
    'Audio & Microphones',
    'Gaming Accessories',
    'Mobile Accessories',
    'Smart Home & Lifestyle'
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-[#10183F] font-heading">
            Product Catalog & Inventory Management
          </h2>
          <p className="text-xs text-slate-500">
            {products.length} products total · Full CRUD control, variants & SKU tracking
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenAdd}
            className="bg-[#F10D27] hover:bg-[#d60a20] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        )}
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or SKU..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#F10D27]"
          />
        </div>

        {/* Category */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Stock Filter */}
        <div>
          <select
            value={stockFilter}
            onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">All Stock Statuses</option>
            <option value="low">Low Stock (≤ 5 units)</option>
            <option value="out">Out of Stock (0 units)</option>
            <option value="in">In Stock (Good)</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="name">Sort by: Name</option>
            <option value="price">Sort by: Price (Low to High)</option>
            <option value="stock">Sort by: Stock Quantity</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Item & SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Selling Price</th>
                <th className="p-4">Regular Price</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                paginated.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 truncate max-w-[200px]">{product.name}</span>
                          {product.featured && (
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{product.sku}</span>
                      </div>
                    </td>

                    <td className="p-4 text-slate-600 font-medium">
                      {product.category}
                    </td>

                    <td className="p-4 font-mono font-bold text-[#F10D27] tabular-nums">
                      ৳{product.price.toLocaleString('en-BD')}
                    </td>

                    <td className="p-4 font-mono text-slate-400 tabular-nums">
                      {product.originalPrice ? `৳${product.originalPrice.toLocaleString('en-BD')}` : '—'}
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 font-mono font-bold px-2 py-0.5 rounded ${
                        product.stockCount <= 5
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {product.stockCount <= 5 && <AlertCircle className="w-3 h-3 text-rose-500" />}
                        <span>{product.stockCount} in stock</span>
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        product.inStock && product.stockCount > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {product.inStock && product.stockCount > 0 ? 'Active' : 'Draft / OOS'}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      {canEdit ? (
                        <>
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-400">View Only</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing page {currentPage} of {totalPages}</span>
            <div className="flex gap-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 rounded bg-slate-100 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded bg-slate-100 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-auto animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-lg font-black text-[#10183F] font-heading">
                {editingProduct ? 'Edit Store Product' : 'Add New Product to Store'}
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Black Paisley Hoodie Combo"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-[#F10D27]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price (৳ BDT) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1200"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Regular Price Before Discount (৳)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="1450"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              {/* Image URL & Preview */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Primary Product Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value, images: [e.target.value] })}
                    placeholder="/images/products/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img src={formData.image} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Variants */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Color Options (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="Black, Navy, Brown"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Size Options (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="M, L, XL, XXL"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed specifications, fabric, warranty, packaging..."
                  className="w-full p-3 rounded-xl border border-slate-300"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#F10D27]"
                  />
                  <span>Featured Product on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600"
                  />
                  <span>Active & Ready for Purchase</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#F10D27] hover:bg-[#d60a20] text-white rounded-xl font-bold cursor-pointer transition-colors shadow-xs"
                >
                  {loading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
