import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../lib/axios';

export default function TemplateSelection() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewModal, setPreviewModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get('/cv-templates');
        setTemplates(res.data);
      } catch (err) {
        console.error('Failed to load templates');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleUseTemplate = (templateSlug) => {
    // Navigate to builder, passing the template via state so we can initialize it
    navigate('/cv-builder', { state: { selectedTemplate: templateSlug } });
  };

  // Helper to generate fake visually distinct thumbnails 
  // (In real prod, we would have actual thumbnail images in the DB)
  const getThumbnailParams = (slug) => {
    const map = {
      'minimal': '10b981/ffffff?text=Minimal+Clean',
      'modern': '3b82f6/ffffff?text=Modern+Split',
      'creative': '8b5cf6/ffffff?text=Creative+Bold',
      'corporate': '1e293b/ffffff?text=Corporate+Pro'
    };
    return map[slug] || '64748b/ffffff?text=Template';
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex justify-center items-center text-white">Loading Gallery...</div>;

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-200">
      
      {/* Top Navbar */}
      <nav className="glass border-b border-slate-700/50 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <Link to="/dashboard" className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-2 font-medium bg-emerald-500/10 px-4 py-2 rounded-xl">← Back to Dashboard</Link>
           <div className="w-px h-6 bg-slate-700 mx-2"></div>
           <span className="font-bold text-lg text-white">Template Gallery</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center py-16 px-4 bg-gradient-to-b from-slate-800/50 to-transparent">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Choose Your Perfect Resume</h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">Stand out from the crowd with our premium templates. Select a design, add your details, and download a pixel-perfect PDF tailored to win interviews.</p>
      </div>

      {/* Template Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {templates.map(t => (
            <div key={t.id} className="group relative bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_10px_40px_-15px_rgba(16,185,129,0.3)] hover:-translate-y-2">
              
              {/* Image Container with zoom effect */}
              <div className="w-full aspect-[1/1.4] overflow-hidden bg-slate-200 cursor-pointer" onClick={() => setPreviewModal(t)}>
                 <img 
                   src={`https://placehold.co/400x560/${getThumbnailParams(t.slug)}`} 
                   alt={t.name}
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 />
                 
                 {/* Quick View Overlay */}
                 <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <span className="bg-white text-slate-900 font-bold px-6 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">Quick View</span>
                 </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col items-center border-t border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-4 text-center">{t.name} Template</h3>
                <button 
                  onClick={() => handleUseTemplate(t.slug)}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-4 rounded-xl transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/20"
                >
                  Use Template
                </button>
              </div>

            </div>
          ))}

        </div>

        {templates.length === 0 && (
          <div className="text-center p-12 text-slate-500 border border-dashed border-slate-700 rounded-2xl">
            No templates available. Please check back later.
          </div>
        )}
      </main>

      {/* Full Preview Modal */}
      {previewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={() => setPreviewModal(null)}>
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"></div>
          
          <div className="relative bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="absolute top-4 right-4 z-10">
               <button onClick={() => setPreviewModal(null)} className="w-10 h-10 rounded-full bg-slate-900/50 text-white hover:bg-rose-500 transition flex items-center justify-center backdrop-blur">✕</button>
            </div>
            
            <div className="flex-1 flex flex-col md:flex-row h-full">
              {/* Image Panel */}
              <div className="w-full md:w-3/5 bg-slate-200 flex items-center justify-center p-8 overflow-y-auto">
                 <img src={`https://placehold.co/800x1120/${getThumbnailParams(previewModal.slug)}`} className="w-full max-w-md shadow-2xl" alt="Preview"/>
              </div>
              
              {/* Specs Panel */}
              <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-slate-900 text-slate-300">
                 <div className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm font-bold uppercase tracking-wider mb-4 border border-indigo-500/30 w-max">Premium Design</div>
                 <h2 className="text-4xl font-extrabold text-white mb-6">{previewModal.name}</h2>
                 
                 <p className="text-slate-400 text-lg leading-relaxed mb-8">
                   The {previewModal.name} template is carefully crafted for professionals who want to make a lasting impression. Validated against ATS systems to ensure maximum readability.
                 </p>
                 
                 <ul className="space-y-4 mb-10">
                   <li className="flex items-center gap-3">
                     <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">✓</span>
                     ATS-Friendly Layout
                   </li>
                   <li className="flex items-center gap-3">
                     <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">✓</span>
                     Dynamic Color Palettes
                   </li>
                   <li className="flex items-center gap-3">
                     <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">✓</span>
                     Auto-formatting & Spacing
                   </li>
                 </ul>

                 <div className="mt-auto">
                   <button 
                     onClick={() => handleUseTemplate(previewModal.slug)}
                     className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl transition duration-200 text-lg shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
                   >
                     Use this template
                   </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
