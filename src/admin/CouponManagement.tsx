import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Calendar, 
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Coupon } from '../../server/db';

interface CouponManagementProps {
  coupons: Coupon[];
  onRefresh: () => void;
  token: string;
  adminRole: string;
}

export const CouponManagement: React.FC<CouponManagementProps> = ({
  coupons,
  onRefresh,
  token,
  adminRole,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minOrderAmount: '500',
    maxDiscount: '',
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: '2026-12-31',
    usageLimit: '100',
    perCustomerLimit: '1',
    isActive: true
  });

  const canManage = adminRole === 'super_admin' || adminRole === 'store_manager';

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '10',
      minOrderAmount: '500',
      maxDiscount: '500',
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: '2026-12-31',
      usageLimit: '100',
      perCustomerLimit: '1',
      isActive: true
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue.toString(),
      minOrderAmount: c.minOrderAmount.toString(),
      maxDiscount: c.maxDiscount ? c.maxDiscount.toString() : '',
      startDate: c.startDate,
      expiryDate: c.expiryDate,
      usageLimit: c.usageLimit.toString(),
      perCustomerLimit: c.perCustomerLimit.toString(),
      isActive: c.isActive
    });
    setIsAddOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.discountValue) return;

    setLoading(true);
    try {
      const url = editingCoupon ? `/api/coupons/${editingCoupon.id}` : '/api/coupons';
      const method = editingCoupon ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: formData.code.trim().toUpperCase(),
          discountType: formData.discountType,
          discountValue: Number(formData.discountValue),
          minOrderAmount: Number(formData.minOrderAmount),
          maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
          startDate: formData.startDate,
          expiryDate: formData.expiryDate,
          usageLimit: Number(formData.usageLimit),
          perCustomerLimit: Number(formData.perCustomerLimit),
          isActive: formData.isActive
        })
      });

      if (!res.ok) throw new Error('Failed to save coupon');
      setIsAddOpen(false);
      setActionSuccess(editingCoupon ? 'Coupon updated' : 'Coupon created');
      setTimeout(() => setActionSuccess(''), 3000);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (c: Coupon) => {
    try {
      await fetch(`/api/coupons/${c.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !c.isActive })
      });
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    try {
      await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setActionSuccess(`Coupon ${code} removed`);
      setTimeout(() => setActionSuccess(''), 3000);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-[#10183F] font-heading">
            Coupons & Promotional Vouchers
          </h2>
          <p className="text-xs text-slate-500">
            Create discount codes, set minimum purchase requirements, and track redemption limits
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenAdd}
            className="bg-[#F10D27] hover:bg-[#d60a20] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        )}
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount Value</th>
                <th className="p-4">Min. Spend</th>
                <th className="p-4">Redemptions</th>
                <th className="p-4">Validity Range</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-mono font-black text-sm text-[#10183F]">
                    {c.code}
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-[#F10D27]">
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `৳${c.discountValue} FLAT OFF`}
                    </span>
                    {c.maxDiscount && (
                      <span className="text-[10px] text-slate-400 block">Max ৳{c.maxDiscount}</span>
                    )}
                  </td>

                  <td className="p-4 font-mono text-slate-700 font-semibold">
                    ৳{c.minOrderAmount}
                  </td>

                  <td className="p-4">
                    <span className="font-mono font-bold text-slate-800">{c.usedCount}</span>
                    <span className="text-slate-400 font-mono"> / {c.usageLimit}</span>
                  </td>

                  <td className="p-4 text-slate-600 font-mono text-[11px]">
                    {c.startDate} to {c.expiryDate}
                  </td>

                  <td className="p-4">
                    {canManage ? (
                      <button
                        onClick={() => handleToggleActive(c)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          c.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${c.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span>{c.isActive ? 'Active' : 'Disabled'}</span>
                      </button>
                    ) : (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {c.isActive ? 'Active' : 'Disabled'}
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right space-x-2">
                    {canManage && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.code)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-[#10183F]">
                {editingCoupon ? 'Edit Coupon Code' : 'Create New Promotional Voucher'}
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLASH20"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono uppercase font-bold text-sm focus:ring-1 focus:ring-[#F10D27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed BDT Amount (৳)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    placeholder="10 or 200"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min. Order (৳)</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Max Cap (৳)</label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#F10D27] hover:bg-[#d60a20] text-white rounded-xl font-bold transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
