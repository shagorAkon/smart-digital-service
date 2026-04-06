import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';

export default function TemplateSelection() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all active templates from backend API
    axios.get('/api/cv-templates')
      .then(res => {
        const data = res.data;
        setTemplates(data);
        
        // Extract unique categories
        const cats = [...new Set(data.map(t => t.category))].filter(Boolean);
        setCategories(['All', ...cats]);
        
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading templates", err);
        setLoading(false);
      });
  }, []);

  const handleSelect = (templateId) => {
    // Save template_id to DB/session
    localStorage.setItem('selected_template_id', templateId);
    navigate('/cv-builder');
  };

  // Helper to generate a placeholder thumbnail using color hexes in the config
  const getThumbnail = (template) => {
    if (template.preview_image) return template.preview_image;
    
    let color = '3b82f6'; // Default blue
    try {
       const config = typeof template.design_config === 'string' ? JSON.parse(template.design_config) : template.design_config;
       if (config && config.theme_color) {
          color = config.theme_color.replace('#', '');
       }
    } catch (e) {}

    const name = encodeURIComponent(template.name.replace(' ', '+'));
    return `https://placehold.co/400x560/${color}/ffffff?text=${name}`;
  };

  const filtered = activeCategory === 'All' ? templates : templates.filter(t => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      
      {/* Header */}
      <nav className="bg-slate-800/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white flex items-center gap-2 group transition-colors">
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Back to Dashboard
            </button>
            <div className="h-8 w-px bg-slate-700"></div>
            <h1 className="text-2xl font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Template Gallery
            </h1>
          </div>
          <div className="text-sm font-medium text-slate-400">
            Choose from <span className="text-emerald-400 font-bold">{templates.length}</span> professional designs.
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Category Filters */}
        {!loading && categories.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
               {categories.map(cat => (
                  <button 
                     key={cat}
                     onClick={() => setActiveCategory(cat)}
                     className={`px-6 py-2.5 rounded-full font-bold uppercase tracking-wider text-[12px] transition-all transform hover:scale-105 active:scale-95 ${activeCategory === cat ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'}`}
                  >
                     {cat}
                  </button>
               ))}
            </div>
        )}

        {loading ? (
           <div className="flex justify-center py-20 text-emerald-400">
              <svg className="animate-spin h-10 w-10" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
           </div>
        ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-8">
             {filtered.map(template => (
               <div 
                 key={template.id} 
                 className="group bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-emerald-900/20 hover:-translate-y-2 flex flex-col"
               >
                 <div className="relative overflow-hidden aspect-[1/1.4] bg-slate-900">
                   <img 
                     src={getThumbnail(template)} 
                     alt={template.name}
                     className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                   />
                   
                   {/* Hover Overlay */}
                   <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                     <button 
                       onClick={() => handleSelect(template.id)}
                       className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/50 backdrop-blur-md px-6 py-2.5 rounded-full font-bold uppercase tracking-widest text-xs transition-colors"
                     >
                       Quick View
                     </button>
                   </div>
                 </div>

                 <div className="p-5 flex-1 flex flex-col justify-between">
                   <div>
                      <h3 className="text-lg font-black text-white mb-1 leading-tight group-hover:text-emerald-400 transition-colors">
                        {template.name}
                      </h3>
                      <span className="inline-block text-[10px] uppercase font-bold tracking-widest text-emerald-400/80 bg-emerald-400/10 px-2 py-0.5 rounded mb-4 border border-emerald-400/20">
                         {template.category}
                      </span>
                   </div>
                   
                   <button 
                     onClick={() => handleSelect(template.id)}
                     className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors shadow-lg shadow-emerald-500/20"
                   >
                     Use Template
                   </button>
                 </div>
               </div>
             ))}
           </div>
        )}
      </main>
    </div>
  );
}
