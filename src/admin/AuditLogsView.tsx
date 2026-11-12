import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  History, 
  UserCheck, 
  Clock, 
  Search, 
  Lock, 
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { AuditLog } from '../../server/db';

interface AuditLogsViewProps {
  token: string;
  adminRole: string;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ token, adminRole }) => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Password reset inside session state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/audit-logs', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/admins', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json())
    ])
      .then(([logsData, adminsData]) => {
        setAuditLogs(Array.isArray(logsData) ? logsData : []);
        setAdmins(Array.isArray(adminsData) ? adminsData : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');
    setPassLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');
      setPassSuccess('Your administrator password has been updated securely.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPassError(err.message);
    } finally {
      setPassLoading(false);
    }
  };

  const filteredLogs = auditLogs.filter(l => 
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#10183F] font-heading">
            Staff Directory, Role Access & Security Audit
          </h2>
          <p className="text-xs text-slate-500">
            Immutable log of administrative operations, authorized staff accounts, and credentials
          </p>
        </div>
      </div>

      {/* Staff Accounts Grid */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-heading font-black text-base text-[#10183F] pb-3 border-b border-slate-100 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span>Authorized Administrative Staff & Roles</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {admins.map((adm) => (
            <div key={adm.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{adm.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  adm.role === 'super_admin' ? 'bg-[#10183F] text-white' :
                  adm.role === 'store_manager' ? 'bg-blue-100 text-blue-800' :
                  'bg-slate-200 text-slate-700'
                }`}>
                  {adm.role.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p className="font-mono text-xs text-slate-600">{adm.email}</p>
              <span className="text-[10px] text-slate-400 block">
                Last Login: {adm.lastLogin ? new Date(adm.lastLogin).toLocaleString() : 'Recent'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Password Reset Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-heading font-black text-base text-[#10183F] pb-3 border-b border-slate-100 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#F10D27]" />
          <span>Update Account Password</span>
        </h3>

        {passSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
            {passSuccess}
          </div>
        )}
        {passError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{passError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="max-w-md space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Current Password *</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">New Secure Password (min 8 chars) *</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={passLoading}
            className="px-5 py-2.5 bg-[#10183F] hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition-colors"
          >
            {passLoading ? 'Updating Password...' : 'Save New Password'}
          </button>
        </form>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-black text-lg text-[#10183F]">Chronological Audit Log</h3>
            <p className="text-xs text-slate-400">All authenticated system changes</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter audit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Admin Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Action</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-slate-800">
                    {log.adminEmail}
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {log.role}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-[#10183F]">
                    {log.action}
                  </td>
                  <td className="p-4 text-slate-600 font-medium max-w-md">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
