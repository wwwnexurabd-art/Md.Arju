import React, { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Minus, 
  History, 
  Check, 
  X, 
  Search, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Product } from '../types';

interface InventoryManagementProps {
  products: Product[];
  inventoryLogs: any[];
  onRefresh: () => void;
  token: string;
  adminRole: string;
}

export const InventoryManagement: React.FC<InventoryManagementProps> = ({
  products,
  inventoryLogs,
  onRefresh,
  token,
  adminRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentChange, setAdjustmentChange] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState<string>('Restock');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const canAdjust = adminRole === 'super_admin' || adminRole === 'store_manager';

  const lowStockProducts = products.filter(p => p.stockCount <= 5);
  const totalUnits = products.reduce((sum, p) => sum + p.stockCount, 0);
  const totalValuation = products.reduce((sum, p) => sum + (p.price * p.stockCount), 0);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdjust = (prod: Product) => {
    setSelectedProduct(prod);
    setAdjustmentChange('');
    setAdjustmentReason('Restock');
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !adjustmentChange) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          change: Number(adjustmentChange),
          reason: adjustmentReason
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to adjust stock');
      }

      setActionSuccess(`Stock for ${selectedProduct.name} adjusted by ${adjustmentChange}`);
      setTimeout(() => setActionSuccess(''), 3000);
      setSelectedProduct(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header & KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Warehouse Units</span>
          <div className="text-2xl font-black text-[#10183F] font-mono mt-1 tabular-nums">
            {totalUnits.toLocaleString()} units
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Across {products.length} distinct catalog items</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Valuation</span>
          <div className="text-2xl font-black text-[#F10D27] font-mono mt-1 tabular-nums">
            ৳{totalValuation.toLocaleString('en-BD')}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Asset value at current selling prices</span>
        </div>

        <div className={`p-5 rounded-2xl border shadow-xs ${
          lowStockProducts.length > 0 
            ? 'bg-rose-50/60 border-rose-200 text-rose-900' 
            : 'bg-white border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock (&le;5 units)</span>
            {lowStockProducts.length > 0 && <AlertTriangle className="w-4 h-4 text-rose-600" />}
          </div>
          <div className="text-2xl font-black font-mono mt-1 tabular-nums">
            {lowStockProducts.length} items
          </div>
          <span className="text-[11px] font-semibold mt-1 block">
            {lowStockProducts.length > 0 ? 'Requires immediate restock' : 'All inventory levels healthy'}
          </span>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Stock Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-black text-lg text-[#10183F]">Current Inventory by Product</h3>
            <p className="text-xs text-slate-500">Live counts and threshold adjustments</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#F10D27]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Product Details</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Unit Price</th>
                <th className="p-4">Stock In Hand</th>
                <th className="p-4">Inventory Value</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const isLow = p.stockCount <= 5;
                const isOut = p.stockCount === 0;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={p.image} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                      <div>
                        <span className="font-bold text-slate-900 block">{p.name}</span>
                        <span className="text-[10px] text-slate-400">{p.category}</span>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-medium text-slate-600">
                      {p.sku}
                    </td>

                    <td className="p-4 font-mono font-bold text-slate-800 tabular-nums">
                      ৳{p.price.toLocaleString('en-BD')}
                    </td>

                    <td className="p-4">
                      <span className={`font-mono font-bold text-sm ${
                        isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-emerald-700'
                      }`}>
                        {p.stockCount} units
                      </span>
                    </td>

                    <td className="p-4 font-mono font-bold text-[#10183F] tabular-nums">
                      ৳{(p.price * p.stockCount).toLocaleString('en-BD')}
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isOut ? 'bg-red-100 text-red-800' :
                        isLow ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock Alert' : 'Healthy'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      {canAdjust && (
                        <button
                          onClick={() => handleOpenAdjust(p)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg cursor-pointer transition-colors"
                        >
                          Adjust (+/-)
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movement History Logs */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
          <History className="w-5 h-5 text-slate-500" />
          <div>
            <h3 className="font-heading font-black text-base text-[#10183F]">
              Stock Movement History & Audit Log
            </h3>
            <p className="text-xs text-slate-400">Timestamped ledger of additions, deductions, and customer checkout allocations</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 text-xs max-h-72 overflow-y-auto">
          {inventoryLogs.length === 0 ? (
            <p className="py-6 text-center text-slate-400">No stock movements recorded yet.</p>
          ) : (
            inventoryLogs.map((log: any) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-slate-800">{log.productName}</span>
                  <span className="text-slate-500 block text-[11px]">
                    Reason: <strong>{log.reason}</strong> · By: {log.adminEmail}
                  </span>
                </div>

                <div className="text-right">
                  <span className={`font-mono font-bold block ${
                    log.change > 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {log.change > 0 ? `+${log.change}` : log.change} units
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-[#10183F]">Adjust Stock Level</h3>
              <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium block">Selected Product:</span>
                <span className="font-bold text-slate-900 block mt-0.5">{selectedProduct.name}</span>
                <span className="text-slate-500 font-mono mt-0.5 block">
                  Current Stock: <strong>{selectedProduct.stockCount} units</strong>
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Stock Change (e.g. +10 to restock, or -2 for damage) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="+10 or -5"
                  value={adjustmentChange}
                  onChange={(e) => setAdjustmentChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:ring-1 focus:ring-[#F10D27]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Reason for Adjustment *
                </label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Restock">Warehouse Restock / Supplier Shipment</option>
                  <option value="Manual Correction">Manual Physical Inventory Count Correction</option>
                  <option value="Damaged/Expired">Damaged / Expired Product Write-off</option>
                  <option value="Order Cancelled">Order Returned / Restocked</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#F10D27] hover:bg-[#d60a20] text-white rounded-xl font-bold transition-colors"
                >
                  {isSubmitting ? 'Updating...' : 'Confirm Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
