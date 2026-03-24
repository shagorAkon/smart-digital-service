import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from '../lib/axios';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      await axios.put(`/admin/users/${userId}/status`, { status: newStatus });
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex justify-center items-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <nav className="glass border-b border-slate-700/50 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
             <span className="text-white font-bold text-sm">S</span>
           </div>
           <span className="font-bold text-lg text-white">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-emerald-400">Hi, {user?.first_name}</span>
          <button onClick={logout} className="text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition">Logout</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold text-white mb-8">User Management</h1>

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
                      <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold">
                        {u.service_interest}
                      </span>
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
                        <button onClick={() => handleStatusUpdate(u.id, 'approved')} className="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white px-3 py-1 rounded-lg text-sm transition font-medium">
                          Approve
                        </button>
                      )}
                      {u.status === 'approved' && (
                        <button onClick={() => handleStatusUpdate(u.id, 'blocked')} className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1 rounded-lg text-sm transition font-medium">
                          Block
                        </button>
                      )}
                      {u.status === 'pending' && (
                        <button onClick={() => handleStatusUpdate(u.id, 'blocked')} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-lg text-sm transition font-medium">
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500 italic">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
