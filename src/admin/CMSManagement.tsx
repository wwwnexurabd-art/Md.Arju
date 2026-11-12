import React, { useState, useEffect } from 'react';
import { 
  LayoutTemplate, 
  Save, 
  Check, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  Image as ImageIcon 
} from 'lucide-react';
import { CMSSettings } from '../../server/db';

interface CMSManagementProps {
  token: string;
  adminRole: string;
  onRefresh: () => void;
}

export const CMSManagement: React.FC<CMSManagementProps> = ({
  token,
  adminRole,
  onRefresh,
}) => {
  const [formData, setFormData] = useState<CMSSettings>({
    heroLabel: 'NEXURA.BD',
    heroHeadline: 'Welcome to Our Store',
    heroSubtext: 'Browse our latest collection of quality products.',
    heroImageUrl: '/images/hero/hero-gadgets.jpg',
    hotlineNumber: '+880 1700-000000',
    whatsappNumber: '8801700000000',
    supportEmail: 'www.nexura.bd@gmail.com',
    storeAddress: 'House 14, Road 7, Sector 3, Uttara, Dhaka-1230, Bangladesh',
    topAnnouncement: 'Cash on Delivery Available Across Bangladesh'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const canEdit = adminRole === 'super_admin' || adminRole === 'store_manager';

  useEffect(() => {
    fetch('/api/settings/cms')
      .then(res => res.json())
      .then(data => {
        setFormData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    setSaving(true);
    try {
      const res = await fetch('/api/settings/cms', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to update storefront content');

      setSuccessMsg('Storefront content and contact details updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading storefront settings...</div>;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#10183F] font-heading">
            Storefront CMS & Content Management
          </h2>
          <p className="text-xs text-slate-500">
            Control homepage hero typography, announcement bars, and customer hotline numbers
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#F10D27] hover:bg-[#d60a20] text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save & Publish to Store'}</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Hero Banner Section (Cols 1-7) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-heading font-black text-base text-[#10183F] pb-3 border-b border-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F10D27]" />
            <span>Emerald Hero Banner Content</span>
          </h3>

          <div>
            <label className="font-bold text-slate-700 block text-xs mb-1">
              Top Brand Label
            </label>
            <input
              type="text"
              disabled={!canEdit}
              value={formData.heroLabel}
              onChange={(e) => setFormData({ ...formData, heroLabel: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-[#F10D27]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block text-xs mb-1">
              Main Display Headline *
            </label>
            <input
              type="text"
              required
              disabled={!canEdit}
              value={formData.heroHeadline}
              onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-sm focus:ring-1 focus:ring-[#F10D27]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block text-xs mb-1">
              Supporting Subtitle Text
            </label>
            <textarea
              rows={2}
              disabled={!canEdit}
              value={formData.heroSubtext}
              onChange={(e) => setFormData({ ...formData, heroSubtext: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-[#F10D27]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block text-xs mb-1">
              Hero Gadget Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                disabled={!canEdit}
                value={formData.heroImageUrl}
                onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
              />
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <img src={formData.heroImageUrl} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="font-bold text-slate-700 block text-xs mb-1">
              Top Header Announcement Bar
            </label>
            <input
              type="text"
              disabled={!canEdit}
              value={formData.topAnnouncement}
              onChange={(e) => setFormData({ ...formData, topAnnouncement: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
            />
          </div>
        </div>

        {/* Right Column: Contact & Helpline Info (Cols 8-12) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-heading font-black text-base text-[#10183F] pb-3 border-b border-slate-100 flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Store Contact & Helplines</span>
          </h3>

          <div>
            <label className="font-bold text-slate-700 block text-xs mb-1">
              Hotline Phone Number
            </label>
            <input
              type="text"
              disabled={!canEdit}
              value={formData.hotlineNumber}
              onChange={(e) => setFormData({ ...formData, hotlineNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block text-xs mb-1">
              WhatsApp Support (Digits only)
            </label>
            <input
              type="text"
              disabled={!canEdit}
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block text-xs mb-1">
              Support Email Address
            </label>
            <input
              type="email"
              disabled={!canEdit}
              value={formData.supportEmail}
              onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block text-xs mb-1">
              Official Store & Hub Address
            </label>
            <textarea
              rows={3}
              disabled={!canEdit}
              value={formData.storeAddress}
              onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
