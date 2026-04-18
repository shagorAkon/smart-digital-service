import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';

// Import all template components for live preview rendering
import ModernTemplate from '../components/cv/ModernTemplate';
import CreativeTemplate from '../components/cv/CreativeTemplate';
import MinimalTemplate from '../components/cv/MinimalTemplate';
import CorporateTemplate from '../components/cv/CorporateTemplate';
import ElegantTemplate from '../components/cv/ElegantTemplate';

// Sample CV data used to render realistic preview thumbnails
const SAMPLE_CV = {
  full_name: 'Alex Johnson',
  title: 'Senior Product Designer',
  email: 'alex@example.com',
  phone: '+1 (555) 987-6543',
  address: 'San Francisco, CA',
  summary: 'Award-winning product designer with 8+ years of experience crafting intuitive digital experiences for Fortune 500 companies. Passionate about user-centered design, accessibility, and design systems.',
  career_objective: 'Seeking a leadership role where I can drive product innovation and mentor the next generation of designers.',
  photo_path: '',
  primary_color: '#2563eb',
  font_family: 'Inter, sans-serif',
  experiences: [
    { position: 'Lead Product Designer', company: 'Tech Corp', start_date: 'Jan 2021', end_date: 'Present', description: 'Led a team of 6 designers to ship 3 major product launches. Established design system used across 12 products.' },
    { position: 'Senior UX Designer', company: 'StartupXYZ', start_date: 'Mar 2018', end_date: 'Dec 2020', description: 'Redesigned the core user journey reducing churn by 35%. Built component library from scratch.' },
  ],
  educations: [
    { degree: 'M.Sc. Human-Computer Interaction', institution: 'Stanford University', start_date: '2015', end_date: '2017' },
    { degree: 'B.A. Visual Communication', institution: 'UCLA', start_date: '2011', end_date: '2015' },
  ],
  skills: [
    { name: 'Figma', level: 'Expert' },
    { name: 'React', level: 'Advanced' },
    { name: 'User Research', level: 'Expert' },
    { name: 'Design Systems' },
    { name: 'Prototyping' },
  ],
  projects: [
    { title: 'DesignOps Platform', description: 'Internal tooling for design workflow automation.', link: '' },
  ],
  certifications: [
    { name: 'Google UX Certificate', issuer: 'Google' },
    { name: 'Certified Scrum Master', issuer: 'Scrum Alliance' },
  ],
  languages: [
    { name: 'English', proficiency: 'Native' },
    { name: 'Spanish', proficiency: 'Conversational' },
  ],
  interests: [
    { name: 'Photography' },
    { name: 'Open Source' },
    { name: 'Travel' },
  ],
  social_links: [],
};

// Map component key to React component
const COMPONENT_MAP = {
  modern: ModernTemplate,
  creative: CreativeTemplate,
  minimal: MinimalTemplate,
  corporate: CorporateTemplate,
  elegant: ElegantTemplate,
};

const ITEMS_PER_PAGE = 12;

export default function TemplateSelection() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Fetch all active templates from backend API
    axios.get('/cv-templates')
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

  // Parse design_config safely
  const getConfig = (template) => {
    try {
      return typeof template.design_config === 'string'
        ? JSON.parse(template.design_config)
        : (template.design_config || {});
    } catch { return {}; }
  };

  const filtered = activeCategory === 'All' ? templates : templates.filter(t => t.category === activeCategory);

  // Reset page when category changes
  useEffect(() => { setCurrentPage(1); }, [activeCategory]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
      
      {/* Header */}
      <nav className="bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="group flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all active:scale-95"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-white transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              <span className="text-sm font-semibold text-slate-400 group-hover:text-white transition-colors">Back</span>
            </button>
            <div className="h-8 w-px bg-white/10"></div>
            <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
              CHOOSE YOUR TEMPLATE
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 uppercase tracking-widest">
              {templates.length} Professional Designs
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Category Filters */}
        {!loading && categories.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12 px-4">
               {categories.map(cat => (
                  <button 
                     key={cat}
                     onClick={() => setActiveCategory(cat)}
                     className={`px-6 py-2.5 rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-all transform hover:scale-105 active:scale-95 border-2 ${activeCategory === cat ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)]' : 'bg-slate-900/50 text-slate-400 hover:bg-slate-900 hover:text-white border-white/5 hover:border-white/10'}`}
                  >
                     {cat}
                  </button>
               ))}
            </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
             Array(8).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col gap-4">
                   <div className="aspect-[1/1.4] bg-slate-800 rounded-3xl"></div>
                   <div className="h-6 w-2/3 bg-slate-800 rounded-lg"></div>
                   <div className="h-10 w-full bg-slate-800 rounded-xl"></div>
                </div>
             ))
          ) : (
             paginated.map(template => {
               const config = getConfig(template);
               const compKey = config.component || 'modern';
               const TemplateComp = COMPONENT_MAP[compKey] || COMPONENT_MAP.modern;

               // Build preview data with template-specific colors/fonts
               const previewData = {
                 ...SAMPLE_CV,
                 primary_color: config.primary_color || SAMPLE_CV.primary_color,
                 font_family: config.font_family || SAMPLE_CV.font_family,
               };

               return (
                <div 
                  key={template.id} 
                  className="group relative flex flex-col bg-slate-900/50 rounded-3xl border border-white/5 hover:border-emerald-500/40 transition-all duration-500 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] hover:-translate-y-3"
                >
                  {/* Live Preview Container */}
                  <div className="relative aspect-[1/1.4] m-3 overflow-hidden rounded-2xl bg-white shadow-inner">
                    {/* Scaled-down real template render */}
                    <div 
                      className="absolute top-0 left-0 origin-top-left pointer-events-none"
                      style={{ 
                        width: '850px', 
                        transform: 'scale(0.22)',
                        transformOrigin: 'top left',
                      }}
                    >
                      <TemplateComp cvData={previewData} />
                    </div>
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-500"></div>

                    {/* Hover Action */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[1px]">
                       <button 
                         onClick={() => handleSelect(template.id)}
                         className="px-8 py-3 bg-white text-slate-950 rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:scale-105 active:scale-95"
                       >
                         Select Template
                       </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-5 pb-5 pt-2 flex flex-col">
                    <div className="flex justify-between items-start gap-4 mb-3">
                       <div className="flex flex-col gap-1">
                          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight">
                            {template.name}
                          </h3>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                             <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.primary_color || '#10b981' }}></span>
                             {template.category || 'Professional'}
                          </span>
                       </div>
                    </div>
                    
                    <button 
                      onClick={() => handleSelect(template.id)}
                      className="w-full h-12 bg-white/5 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 border border-white/5 hover:border-emerald-500 shadow-lg active:scale-95 flex items-center justify-center gap-3"
                    >
                      Use Template
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                  </div>
                </div>
               );
             })
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-16">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              ← Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl font-black text-sm transition-all active:scale-95 ${currentPage === page ? 'bg-emerald-500 text-white shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'}`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              Next →
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
