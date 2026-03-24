import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();

  // Show pending review screen if status is pending AND they registered for CV Builder
  const isPendingCV = user?.status === 'pending' && user?.service_interest === 'CV Builder';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 relative">
        {/* Background blobs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        {isPendingCV ? (
          <div className="glass rounded-3xl p-10 text-center border border-amber-500/30 relative z-10 shadow-2xl">
             <div className="w-20 h-20 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <h2 className="text-3xl font-bold text-white mb-4">Your Request is Under Review</h2>
             <p className="text-lg text-slate-300 max-w-xl mx-auto mb-8">
                Thank you for choosing the <strong>CV Builder</strong> profile. 
                Our admin team is currently reviewing your application. You will be granted access to the premium CV builder tools once approved!
             </p>
             <button onClick={logout} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-lg">
               Return to Login
             </button>
          </div>
        ) : (
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back, {user?.first_name}!</h1>
            <p className="text-slate-400 text-lg mb-10">You have been approved! Access your personalized tools below.</p>
            
            {user?.service_interest === 'CV Builder' && (
              <div className="glass p-8 rounded-3xl border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col md:flex-row gap-8 items-center justify-between group hover:border-emerald-400 transition-all">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Professional CV Builder</h3>
                  <p className="text-slate-300 max-w-md">
                    Create, edit, and download your ATS-friendly premium CV in PDF format instantly. Stand out to employers today.
                  </p>
                </div>
                <Link to="/cv-builder" className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-emerald-500/25 transition-transform transform group-hover:scale-105">
                  Create / Edit CV
                </Link>
              </div>
            )}
            
            {user?.service_interest !== 'CV Builder' && (
              <div className="glass p-8 rounded-3xl border border-indigo-500/30 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-2">Service Hub</h3>
                <p className="text-slate-400">You selected {user?.service_interest}. Features for this service are currently in development.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
