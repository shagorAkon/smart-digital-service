import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../lib/axios';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const res = await axios.get('/cvs');
        setCvs(res.data);
      } catch (err) {
        console.error('Failed to load CVs');
      } finally {
        setLoading(false);
      }
    };
    if (user?.status === 'approved' && user?.service_interest === 'CV Builder') {
        fetchCVs();
    } else {
        setLoading(false);
    }
  }, [user]);

  const handleDeleteCV = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this CV?")) return;
    try {
      await axios.delete(`/cvs/${id}`);
      setCvs(cvs.filter(cv => cv.id !== id));
    } catch (err) {
      alert("Failed to delete CV");
    }
  };

  const handleDuplicateCV = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await axios.post(`/cvs/${id}/duplicate`);
      setCvs([...cvs, res.data]);
    } catch (err) {
      alert("Failed to duplicate CV");
    }
  };

  const isPendingCV = user?.status === 'pending' && user?.service_interest === 'CV Builder';

  const computeCompletion = (cv) => {
      let score = 20; // Base score for having a record
      if (cv.full_name) score += 10;
      if (cv.email) score += 10;
      if (cv.summary) score += 20;
      if (cv.items && cv.items.some(i => i.type === 'experience')) score += 20;
      if (cv.items && cv.items.some(i => i.type === 'education')) score += 10;
      if (cv.items && cv.items.some(i => i.type === 'skill')) score += 10;
      return Math.min(score, 100);
  };

  const highestCompletion = cvs.length > 0 ? Math.max(...cvs.map(computeCompletion)) : 0;

  return (
    <div className="min-h-screen bg-slate-900 border-t-4 border-emerald-500 text-slate-200 font-sans flex flex-col">
      
      {/* Dashboard Nav */}
      <nav className="glass border-b border-slate-700/50 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
             <span className="text-white font-bold text-sm">S</span>
           </div>
           <span className="font-bold text-lg text-white">Smart Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-emerald-400 font-medium">{user?.first_name} {user?.last_name}</span>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-sm text-indigo-400 hover:text-indigo-300 font-bold transition">Admin Panel</Link>
          )}
          <button onClick={logout} className="text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition shadow-md">Logout</button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 relative">
        {/* Background blob */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        {isPendingCV ? (
          <div className="glass rounded-3xl p-10 text-center border border-amber-500/30 relative z-10 shadow-2xl max-w-2xl mx-auto mt-10">
             <div className="w-20 h-20 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <h2 className="text-3xl font-bold text-white mb-4">Your Request is Under Review</h2>
             <p className="text-lg text-slate-300 max-w-xl mx-auto mb-8">
                Thank you for choosing the <strong>CV Builder</strong> profile. Our admin team is currently reviewing your application.
             </p>
             <button onClick={logout} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-lg">Return to Login</button>
          </div>
        ) : (
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
             
             {/* Main Content Area */}
             <div className="lg:col-span-3 space-y-8">
                 
                 <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white mb-1">Welcome, {user?.first_name} 👋</h1>
                        <p className="text-slate-400">Manage your resumes and land your dream job.</p>
                    </div>
                    {user?.service_interest === 'CV Builder' && (
                        <Link to="/cv-templates" className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition transform hover:-translate-y-1">
                            + Create New CV
                        </Link>
                    )}
                 </div>

                 {user?.service_interest === 'CV Builder' ? (
                     <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                           <span className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex justify-center items-center text-xs">📄</span> My Resumes
                        </h2>
                        
                        {loading ? (
                            <div className="p-12 text-center text-slate-500 animate-pulse">Loading resumes...</div>
                        ) : cvs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {cvs.map(cv => (
                                    <div key={cv.id} onClick={() => navigate(`/cv-builder/${cv.id}`)} className="group glass p-6 rounded-2xl border border-slate-700/50 hover:border-emerald-500/50 transition cursor-pointer flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-16 bg-slate-800 rounded flex items-center justify-center border border-slate-600/50 shadow-inner overflow-hidden relative">
                                                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-indigo-500"></div>
                                                <span className="text-[8px] font-mono text-slate-500 opacity-50 uppercase">{cv.template}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={(e) => handleDuplicateCV(cv.id, e)} className="p-2 bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg transition" title="Duplicate">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                                                </button>
                                                <button onClick={(e) => handleDeleteCV(cv.id, e)} className="p-2 bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg transition" title="Delete">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition">{cv.title || 'Untitled CV'}</h3>
                                        <p className="text-sm text-slate-400 mb-6">Last edited: {new Date(cv.updated_at).toLocaleDateString()}</p>
                                        
                                        <div className="mt-auto pt-4 border-t border-slate-700/50 flex justify-between items-center">
                                            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Template: {cv.template}</span>
                                            <span className="text-sm text-slate-300 font-medium group-hover:underline">Edit Resume &rarr;</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-12 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-800/20">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📝</div>
                                <h3 className="text-xl font-bold text-white mb-2">No CVs yet</h3>
                                <p className="text-slate-400 mb-6 max-w-sm mx-auto">You haven't created any resumes yet. Start by selecting a premium template.</p>
                                <Link to="/cv-templates" className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white font-bold py-2.5 px-6 rounded-lg transition">Browse Templates</Link>
                            </div>
                        )}
                     </div>
                 ) : (
                    <div className="glass p-8 rounded-3xl border border-indigo-500/30 shadow-lg mt-8">
                        <h3 className="text-xl font-bold text-white mb-2">Service Hub</h3>
                        <p className="text-slate-400">You selected {user?.service_interest}. Features for this service are currently in development.</p>
                    </div>
                 )}
             </div>

             {/* Sidebar (Widgets) */}
             <div className="space-y-6">
                 {/* Progress Widget */}
                 <div className="glass p-6 rounded-2xl border border-slate-700/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full pointer-events-none"></div>
                    <h3 className="font-bold text-white mb-4">Profile Strength</h3>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-3xl font-black text-indigo-400">{highestCompletion}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 mb-4 border border-slate-700">
                        <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2.5 rounded-full" style={{ width: `${highestCompletion}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        {highestCompletion === 100 
                            ? "Outstanding! Your profile is fully complete and ready for applications." 
                            : "Add more Experience, Skills, and a Summary to reach 100% profile strength."}
                    </p>
                 </div>

                 {/* Tips Widget */}
                 <div className="glass p-6 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/80">
                    <h3 className="font-bold text-white flex items-center gap-2 mb-4">
                        <span className="text-amber-400">💡</span> Pro Tips
                    </h3>
                    <ul className="space-y-4 text-sm text-slate-300">
                        <li className="flex gap-3">
                            <span className="text-emerald-500 mt-0.5">•</span>
                            <span>Quantify your achievements using numbers (e.g., "Increased sales by 20%").</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-emerald-500 mt-0.5">•</span>
                            <span>Tailor your Summary to the specific job you are applying for.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-emerald-500 mt-0.5">•</span>
                            <span>Use action verbs like 'Led', 'Developed', and 'Managed'.</span>
                        </li>
                    </ul>
                 </div>
             </div>

          </div>
        )}
      </main>
    </div>
  );
}
