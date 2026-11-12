import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle, 
  Calculator,
  Save,
  ShieldAlert,
  X
} from 'lucide-react';
import { DeliverySettings } from '../../server/db';
import { BANGLADESH_DIVISIONS } from '../data/products';

interface DeliverySettingsViewProps {
  token: string;
  adminRole: string;
  onRefresh: () => void;
}

export const DeliverySettingsView: React.FC<DeliverySettingsViewProps> = ({
  token,
  adminRole,
  onRefresh,
}) => {
  const [settings, setSettings] = useState<DeliverySettings | null>(null);
  const [insideFee, setInsideFee] = useState('60');
  const [outsideFee, setOutsideFee] = useState('100');
  const [areas, setAreas] = useState<string[]>([]);
  const [newAreaInput, setNewAreaInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Test Calculator State
  const [testDivision, setTestDivision] = useState('Dhaka');
  const [testDistrict, setTestDistrict] = useState('Dhaka');
  const [testThana, setTestThana] = useState('Dhanmondi');

  const canEdit = adminRole === 'super_admin';

  useEffect(() => {
    fetch('/api/settings/delivery')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setInsideFee(data.insideDhakaFee.toString());
        setOutsideFee(data.outsideDhakaFee.toString());
        setAreas(data.dhakaCityAreas || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleAddArea = () => {
    const trimmed = newAreaInput.trim();
    if (!trimmed) return;
    if (areas.map(a => a.toLowerCase()).includes(trimmed.toLowerCase())) {
      alert('This area already exists in Dhaka City list.');
      return;
    }
    setAreas([...areas, trimmed]);
    setNewAreaInput('');
  };

  const handleRemoveArea = (area: string) => {
    setAreas(areas.filter(a => a !== area));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) {
      alert('Only Super Administrators have permission to modify delivery rules.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/settings/delivery', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          insideDhakaFee: Number(insideFee),
          outsideDhakaFee: Number(outsideFee),
          dhakaCityAreas: areas
        })
      });

      if (!res.ok) throw new Error('Failed to update delivery settings');

      setSuccessMsg('Delivery charges and Dhaka City area mappings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Calculate test fee preview
  const isTestInside = testDivision === 'Dhaka' && 
                       testDistrict === 'Dhaka' && 
                       areas.includes(testThana);
  const previewFee = isTestInside ? Number(insideFee) : Number(outsideFee);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading delivery settings...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#10183F] font-heading">
            Delivery Zones & Pricing Engine
          </h2>
          <p className="text-xs text-slate-500">
            Configure automated shipping fees for Inside Dhaka City vs Outside Dhaka District/Nationwide
          </p>
        </div>

        {!canEdit && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 rounded-xl text-xs font-semibold border border-amber-200">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Super Admin permission required to edit pricing</span>
          </div>
        )}
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Fee Settings & Calculator (Cols 1-6) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-heading font-black text-base text-[#10183F] pb-3 border-b border-slate-100 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#F10D27]" />
              <span>Base Delivery Rates</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                <label className="font-bold text-emerald-950 block text-xs uppercase mb-1.5">
                  Inside Dhaka City Rate
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-emerald-700">৳</span>
                  <input
                    type="number"
                    disabled={!canEdit}
                    value={insideFee}
                    onChange={(e) => setInsideFee(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white rounded-xl border border-emerald-200 font-mono font-bold text-base text-emerald-900"
                  />
                </div>
                <span className="text-[10px] text-emerald-700 mt-1 block">
                  Applied strictly to confirmed Dhaka City thanas
                </span>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100">
                <label className="font-bold text-amber-950 block text-xs uppercase mb-1.5">
                  Outside Dhaka / Nationwide
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-amber-700">৳</span>
                  <input
                    type="number"
                    disabled={!canEdit}
                    value={outsideFee}
                    onChange={(e) => setOutsideFee(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white rounded-xl border border-amber-200 font-mono font-bold text-base text-amber-900"
                  />
                </div>
                <span className="text-[10px] text-amber-700 mt-1 block">
                  Includes Savar, Keraniganj, Gazipur, Chittagong, etc.
                </span>
              </div>
            </div>

            {canEdit && (
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#F10D27] hover:bg-[#d60a20] text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Changes...' : 'Publish Delivery Rates'}</span>
              </button>
            )}
          </div>

          {/* Live Delivery Zone Tester / Preview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-heading font-black text-base text-[#10183F] pb-3 border-b border-slate-100 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span>Live Rule Tester & Preview</span>
            </h3>

            <p className="text-xs text-slate-500">
              Select an address below to verify which delivery rate will be calculated at customer checkout:
            </p>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Division</label>
                <select
                  value={testDivision}
                  onChange={(e) => {
                    setTestDivision(e.target.value);
                    const firstDist = Object.keys(BANGLADESH_DIVISIONS[e.target.value]?.districts || {})[0] || '';
                    setTestDistrict(firstDist);
                    const firstThana = BANGLADESH_DIVISIONS[e.target.value]?.districts[firstDist]?.[0] || '';
                    setTestThana(firstThana);
                  }}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-white"
                >
                  {Object.keys(BANGLADESH_DIVISIONS).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">District</label>
                <select
                  value={testDistrict}
                  onChange={(e) => {
                    setTestDistrict(e.target.value);
                    const firstThana = BANGLADESH_DIVISIONS[testDivision]?.districts[e.target.value]?.[0] || '';
                    setTestThana(firstThana);
                  }}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-white"
                >
                  {Object.keys(BANGLADESH_DIVISIONS[testDivision]?.districts || {}).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Thana / Area</label>
                <select
                  value={testThana}
                  onChange={(e) => setTestThana(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-white"
                >
                  {(BANGLADESH_DIVISIONS[testDivision]?.districts[testDistrict] || []).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Preview Banner */}
            <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
              isTestInside 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}>
              <div>
                <span className="font-bold block">
                  {isTestInside ? 'Classification: INSIDE DHAKA CITY' : 'Classification: OUTSIDE DHAKA CITY'}
                </span>
                <span className="text-[11px] opacity-80">
                  {testThana}, {testDistrict} ({testDivision})
                </span>
              </div>
              <div className="font-mono font-black text-xl">
                ৳{previewFee}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dhaka City Explicit Areas Manager (Cols 7-12) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-heading font-black text-base text-[#10183F]">
                Authorized Dhaka City Areas ({areas.length})
              </h3>
              <p className="text-xs text-slate-400">
                Only thanas in this list qualify for the ৳{insideFee} rate
              </p>
            </div>
          </div>

          {/* Add Area */}
          {canEdit && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add thana/area (e.g. Aftabnagar, Bawnia)..."
                value={newAreaInput}
                onChange={(e) => setNewAreaInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddArea(); } }}
                className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#F10D27]"
              />
              <button
                type="button"
                onClick={handleAddArea}
                className="px-4 py-2 bg-[#10183F] hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Area</span>
              </button>
            </div>
          )}

          {/* Areas List */}
          <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto p-1">
            {areas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              >
                <MapPin className="w-3 h-3 text-[#F10D27]" />
                <span>{area}</span>
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => handleRemoveArea(area)}
                    className="text-slate-400 hover:text-red-600 transition-colors ml-0.5 cursor-pointer"
                    title={`Remove ${area}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
