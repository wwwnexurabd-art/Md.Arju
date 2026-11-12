import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  FileText, 
  Save, 
  Check, 
  X,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Customer } from '../../server/db';

interface CustomerManagementProps {
  customers: Customer[];
  onRefresh: () => void;
  token: string;
}

export const CustomerManagement: React.FC<CustomerManagementProps> = ({
  customers,
  onRefresh,
  token,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);
  const [internalNote, setInternalNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const filtered = customers.filter(c => 
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDetail = (cust: Customer) => {
    setSelectedCust(cust);
    setInternalNote(cust.internalNotes || '');
    setSaveSuccess(false);
  };

  const handleSaveNote = async () => {
    if (!selectedCust) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/customers/${selectedCust.phone}/notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes: internalNote })
      });
      if (!res.ok) throw new Error('Failed to save note');
      const updated = await res.json();
      setSelectedCust(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-[#10183F] font-heading">
            Customer Directory & Profiles
          </h2>
          <p className="text-xs text-slate-500">
            {customers.length} verified purchasing customers · Purchase value, delivery profiles, and internal notes
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#F10D27]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Customer Name</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Delivery Region</th>
                <th className="p-4">Orders Count</th>
                <th className="p-4">Total Purchases</th>
                <th className="p-4">Internal Notes</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No customers found matching search.
                  </td>
                </tr>
              ) : (
                filtered.map((cust) => (
                  <tr 
                    key={cust.id}
                    onClick={() => handleOpenDetail(cust)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <td className="p-4 font-bold text-slate-900">
                      {cust.fullName}
                    </td>

                    <td className="p-4 font-mono font-medium text-slate-600">
                      {cust.phone}
                    </td>

                    <td className="p-4 text-slate-700">
                      {cust.thana}, {cust.district}
                    </td>

                    <td className="p-4 font-mono font-bold text-[#10183F]">
                      {cust.totalOrders} {cust.totalOrders === 1 ? 'order' : 'orders'}
                    </td>

                    <td className="p-4 font-mono font-bold text-[#F10D27] tabular-nums">
                      ৳{cust.totalSpent.toLocaleString('en-BD')}
                    </td>

                    <td className="p-4 text-slate-500 italic max-w-xs truncate">
                      {cust.internalNotes || <span className="not-italic text-slate-300">No notes</span>}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(cust);
                        }}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail & Notes Drawer Modal */}
      {selectedCust && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Profile</span>
                <h3 className="text-xl font-black text-[#10183F] font-heading">{selectedCust.fullName}</h3>
              </div>
              <button onClick={() => setSelectedCust(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-medium block">Phone Number</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">{selectedCust.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Total Spend</span>
                  <span className="font-mono font-bold text-[#F10D27] text-sm">৳{selectedCust.totalSpent.toLocaleString('en-BD')}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Total Orders</span>
                  <span className="font-bold text-slate-800">{selectedCust.totalOrders} completed</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Default Area</span>
                  <span className="font-bold text-slate-800">{selectedCust.thana}, {selectedCust.district}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-medium block mb-1">Registered Delivery Address</span>
                <p className="p-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium leading-relaxed">
                  {selectedCust.address}, {selectedCust.thana}, {selectedCust.district}, {selectedCust.division}
                </p>
              </div>

              {/* Internal Staff Notes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-[#10183F] uppercase tracking-wider">
                    Internal Staff Notes (Restricted)
                  </label>
                  {saveSuccess && (
                    <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                      <Check className="w-3.5 h-3.5" /> Note saved!
                    </span>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="e.g. VIP client, preferred courier or calling hours, special requests..."
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-1 focus:ring-[#F10D27]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCust(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={savingNote}
                  onClick={handleSaveNote}
                  className="px-5 py-2 bg-[#F10D27] hover:bg-[#d60a20] text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingNote ? 'Saving...' : 'Save Notes'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
