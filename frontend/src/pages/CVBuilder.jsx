import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from '../lib/axios';

export default function CVBuilder() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  // CV State
  const [cvData, setCvData] = useState({
    fullName: user?.first_name + ' ' + user?.last_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    summary: '',
    experience: '',
    education: user?.education || '',
    skills: ''
  });

  const handleChange = (e) => {
    setCvData({ ...cvData, [e.target.name]: e.target.value });
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // Expecting backend to return a blob/pdf stream
      const response = await axios.post('/cv/generate', cvData, {
        responseType: 'blob'
      });
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${cvData.fullName.replace(/\s+/g, '_')}_CV.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to generate PDF', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      {/* Navbar */}
      <nav className="glass border-b border-slate-700/50 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <Link to="/dashboard" className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-2 font-medium">
             ← Back to Dashboard
           </Link>
           <div className="w-px h-6 bg-slate-700 mx-2"></div>
           <span className="font-bold text-lg text-white">Smart CV Builder</span>
        </div>
        <div>
          <button 
            onClick={generatePDF}
            disabled={isGenerating}
            className={`bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-xl transition shadow-lg shadow-emerald-500/20 font-bold ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isGenerating ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 p-6 overflow-y-auto border-r border-slate-700/50 custom-scrollbar pb-32">
          <div className="max-w-2xl mx-auto space-y-8">
            
            {/* Personal Info */}
            <section className="glass p-6 rounded-2xl border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">1</span>
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                  <input type="text" name="fullName" value={cvData.fullName} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Email</label>
                  <input type="email" name="email" value={cvData.email} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Phone</label>
                  <input type="text" name="phone" value={cvData.phone} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500" placeholder="+123 456 7890" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Location / Address</label>
                  <input type="text" name="address" value={cvData.address} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500" placeholder="New York, USA" />
                </div>
              </div>
            </section>

            {/* Profile Summary */}
            <section className="glass p-6 rounded-2xl border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">2</span>
                Professional Summary
              </h3>
              <textarea name="summary" value={cvData.summary} onChange={handleChange} rows="4" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 resize-none" placeholder="A brief summary of your professional background and goals..." />
            </section>

            {/* Experience */}
            <section className="glass p-6 rounded-2xl border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">3</span>
                Work Experience
              </h3>
              <textarea name="experience" value={cvData.experience} onChange={handleChange} rows="5" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 resize-none font-mono text-sm" placeholder="e.g.&#10;Software Engineer at Google (2020-Present)&#10;- Developed scalable microservices&#10;- Led a team of 4 engineers" />
            </section>

            {/* Education & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="glass p-6 rounded-2xl border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">4</span>
                  Education
                </h3>
                <textarea name="education" value={cvData.education} onChange={handleChange} rows="4" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 resize-none font-mono text-sm" placeholder="e.g. B.Sc. in Computer Science" />
              </section>

              <section className="glass p-6 rounded-2xl border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">5</span>
                  Top Skills
                </h3>
                <textarea name="skills" value={cvData.skills} onChange={handleChange} rows="4" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 resize-none font-mono text-sm" placeholder="e.g. JavaScript, React, Node.js, Leadership" />
              </section>
            </div>

          </div>
        </div>

        {/* Right Side: Live HTML Preview (A4 styled box) */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10 bg-slate-800/50 overflow-y-auto flex justify-center items-start">
          
          <div className="bg-white w-full max-w-[794px] min-h-[1123px] shadow-2xl p-12 text-slate-800 break-words">
            {/* CV Header */}
            <div className="border-b-2 border-slate-300 pb-6 mb-6">
              <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-tight">{cvData.fullName || 'YOUR NAME'}</h1>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600 font-medium">
                {cvData.email && <span>{cvData.email}</span>}
                {cvData.phone && <span>• {cvData.phone}</span>}
                {cvData.address && <span>• {cvData.address}</span>}
              </div>
            </div>

            {/* Profile Summary */}
            {cvData.summary && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">Professional Summary</h2>
                <p className="text-sm leading-relaxed whitespace-pre-line">{cvData.summary}</p>
              </div>
            )}

            {/* Experience */}
            {cvData.experience && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">Experience</h2>
                <div className="text-sm leading-relaxed whitespace-pre-line mt-2">
                  {cvData.experience}
                </div>
              </div>
            )}

            {/* Education */}
            {cvData.education && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">Education</h2>
                <div className="text-sm leading-relaxed whitespace-pre-line mt-2">
                  {cvData.education}
                </div>
              </div>
            )}

            {/* Skills */}
            {cvData.skills && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">Skills</h2>
                <div className="text-sm leading-relaxed whitespace-pre-line mt-2">
                  {cvData.skills}
                </div>
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
