import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from '../lib/axios';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'templates'
  const [users, setUsers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await axios.get('/admin/cv-templates');
      setTemplates(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchTemplates()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      await axios.put(`/admin/users/${userId}/status`, { status: newStatus });
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const handleTemplateToggle = async (templateId) => {
    try {
      const res = await axios.put(`/admin/cv-templates/${templateId}/toggle`);
      setTemplates(templates.map(t => t.id === templateId ? res.data : t));
    } catch (err) {
      alert('Failed to toggle template status');
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex justify-center items-center text-white">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <nav className="glass border-b border-slate-700/50 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
             <span className="text-white font-bold text-sm">A</span>
           </div>
           <span className="font-bold text-lg text-white">Admin Panel</span>
           <div className="w-px h-6 bg-slate-700 mx-2"></div>
           <div className="flex gap-2">
              <button onClick={() => setActiveTab('users')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${activeTab === 'users' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>Users</button>
              <button onClick={() => setActiveTab('templates')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${activeTab === 'templates' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>CV Templates</button>
           </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-emerald-400 font-medium">Hi, {user?.first_name}</span>
          <button onClick={logout} className="text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition font-medium">Logout</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {activeTab === 'users' && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              User Management
            </h1>
            <div className="glass rounded-2xl overflow-hidden border border-slate-700/50">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/50 text-slate-300 text-sm">
                      <th className="p-4 border-b border-slate-700/50">Name</th>
                      <th className="p-4 border-b border-slate-700/50">Email</th>
                      <th className="p-4 border-b border-slate-700/50">Service Interest</th>
                      <th className="p-4 border-b border-slate-700/50">Status</th>
                      <th className="p-4 border-b border-slate-700/50">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-800/30 transition-colors border-b border-slate-700/50 last:border-0">
                        <td className="p-4 font-medium text-white">{u.first_name} {u.last_name}</td>
                        <td className="p-4 text-slate-400">{u.email}</td>
                        <td className="p-4">
                          <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold">{u.service_interest}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            u.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 
                            u.status === 'blocked' ? 'bg-red-500/20 text-red-400' : 
                            'bg-amber-500/20 text-amber-400'
                          }`}>
                            {u.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 flex gap-2">
                          {u.status !== 'approved' && (
                            <button onClick={() => handleStatusUpdate(u.id, 'approved')} className="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white px-3 py-1 rounded-lg text-sm transition font-medium">Approve</button>
                          )}
                          {u.status === 'approved' && (
                            <button onClick={() => handleStatusUpdate(u.id, 'blocked')} className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1 rounded-lg text-sm transition font-medium">Block</button>
                          )}
                          {u.status === 'pending' && (
                            <button onClick={() => handleStatusUpdate(u.id, 'blocked')} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-lg text-sm transition font-medium">Reject</button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan="5" className="p-8 text-center text-slate-500 italic">No users found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white">CV Templates</h1>
              <span className="text-slate-400 text-sm">Add/Edit coming soon</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map(t => (
                <div key={t.id} className={`p-6 rounded-2xl border transition-all ${t.is_active ? 'bg-slate-800/80 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-slate-800/30 border-slate-700/50 opacity-60'}`}>
                  <div className="w-full h-32 bg-slate-900 rounded-lg mb-4 flex items-center justify-center font-mono text-slate-500 border border-slate-700/30 overflow-hidden relative">
                    {/* Placeholder for template thumbnail */}
                    {t.slug}.blade.php
                    
                    {!t.is_active && (
                       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="text-rose-400 font-bold uppercase text-xs tracking-widest border border-rose-400/50 px-3 py-1 rounded bg-slate-900">Disabled</span>
                       </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{t.name}</h3>
                  <div className="text-xs text-slate-400 mb-6 font-mono bg-slate-900/50 inline-block px-2 py-1 rounded text-emerald-400/70">ID: {t.slug}</div>
                  
                  <button 
                    onClick={() => handleTemplateToggle(t.id)} 
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2 ${t.is_active ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300'}`}
                  >
                    {t.is_active ? 'Disable Template' : 'Enable Template'}
                  </button>
                </div>
              ))}
              {templates.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500">No templates found in database.</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
