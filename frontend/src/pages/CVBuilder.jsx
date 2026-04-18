import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from '../lib/axios';
import ModernTemplate from '../components/cv/ModernTemplate';
import MinimalTemplate from '../components/cv/MinimalTemplate';
import CreativeTemplate from '../components/cv/CreativeTemplate';
import CorporateTemplate from '../components/cv/CorporateTemplate';
import TemplateEngine from '../components/cv/TemplateEngine/TemplateEngine';
import ElegantTemplate from '../components/cv/ElegantTemplate';
import { 
  User, Briefcase, GraduationCap, Code, FileText, 
  Settings, Languages, Heart, Link as LinkIcon, 
  ChevronDown, ChevronUp, Plus, Trash2, Copy, 
  Move, HelpCircle, CheckCircle, Award, Target
} from 'lucide-react';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Reusable Sortable Wrapper
function SortableItemWrapper({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`${isDragging ? 'shadow-2xl ring-2 ring-emerald-500 rounded-xl bg-slate-800' : ''}`}>
      {children({ dragHandleProps: { ...attributes, ...listeners } })}
    </div>
  );
}

// --- Tag Input Component for Skills ---
function TagInput({ tags, onAdd, onRemove, placeholder }) {
  const [input, setInput] = useState('');
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 min-h-[44px] p-2 bg-slate-900 border border-slate-700 rounded-xl">
        {tags.map((tag) => (
          <span key={tag.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg font-bold text-xs">
            {tag.name}
            <button onClick={() => onRemove(tag.id)} className="hover:text-white transition-colors">
               <Trash2 className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none text-sm text-white min-w-[120px] px-2"
        />
      </div>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">Press Enter to add skill tag</p>
    </div>
  );
}

export default function CVBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [initialLoading, setInitialLoading] = useState(!!id);
  const isFirstRender = useRef(true);
  const fileInputRef = useRef(null);
  const [templateConfigMap, setTemplateConfigMap] = useState({});

  const [cvData, setCvData] = useState({
    id: id || null,
    title: 'My Professional CV',
    full_name: user?.first_name ? `${user.first_name} ${user?.last_name || ''}` : '',
    email: user?.email || '',
    phone: '',
    address: '',
    summary: '',
    career_objective: '',
    template: location.state?.selectedTemplate || 'modern',
    primary_color: '#2563eb', // Default blue for modern template
    font_family: 'Inter, sans-serif',
    layout: '2-column',
    photo_path: '',
    experiences: [],
    educations: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    interests: [],
    social_links: []
  });

  const [availableTemplates, setAvailableTemplates] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get('/cv-templates');
        setAvailableTemplates(res.data);
        
        const mapped = {};
        res.data.forEach(t => {
           let parsed;
           try { parsed = typeof t.design_config === 'string' ? JSON.parse(t.design_config) : t.design_config; } catch (e) { parsed = {}; }
           mapped[t.id] = parsed;
           mapped[t.slug] = parsed;
        });
        setTemplateConfigMap(mapped);

        // If new CV, grab template ID from local storage and apply its config
        if (!id) {
           const storedTemplateId = localStorage.getItem('selected_template_id');
           if (storedTemplateId && mapped[storedTemplateId]) {
              const cfg = mapped[storedTemplateId];
              setCvData(prev => ({
                ...prev, 
                template_id: storedTemplateId,
                primary_color: cfg.primary_color || prev.primary_color,
                font_family: cfg.font_family || prev.font_family,
              }));
           } else if (storedTemplateId) {
              setCvData(prev => ({...prev, template_id: storedTemplateId}));
           }
        }
      } catch (error) {
        console.error('Failed to load templates');
      }
    };
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchCV = async () => {
        try {
          const res = await axios.get(`/cvs/${id}`);
          const fetchedData = res.data;
          
          const processList = (list) => (list || []).map(i => ({...i, id: i.id || crypto.randomUUID(), isExpanded: false}));

          setCvData({ 
              ...fetchedData, 
              experiences: processList(fetchedData.experiences),
              educations: processList(fetchedData.educations),
              skills: processList(fetchedData.skills),
              projects: processList(fetchedData.projects),
              certifications: processList(fetchedData.certifications),
              languages: processList(fetchedData.languages),
              interests: processList(fetchedData.interests),
              social_links: processList(fetchedData.social_links || fetchedData.socialLinks)
          });
        } catch (error) {
          console.error('Failed to fetch CV', error);
          setSaveStatus('Error loading');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchCV();
    }
  }, [id]);

  useEffect(() => {
    if (initialLoading) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('Saving...');
    const timer = setTimeout(() => {
      saveCV(cvData);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cvData, initialLoading]);

  const saveCV = async (dataToSave) => {
    try {
      if (dataToSave.id) {
        await axios.put(`/cvs/${dataToSave.id}`, dataToSave);
      } else {
        const response = await axios.post('/cvs', dataToSave);
        setCvData((prev) => ({ ...prev, id: response.data.id }));
        window.history.replaceState(null, '', `/cv-builder/${response.data.id}`);
      }
      setSaveStatus('Saved');
    } catch (error) {
      console.error('Auto-save failed', error);
      setSaveStatus('Error saving');
    }
  };

  const handleChange = (e) => {
    setCvData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side validation
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Please upload a valid image (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo size exceeds 5MB limit.');
      return;
    }

    // Instant Preview
    const previewUrl = URL.createObjectURL(file);
    setCvData(prev => ({ ...prev, photo_path: previewUrl }));

    const formData = new FormData();
    formData.append('photo', file);

    try {
      setSaveStatus('Uploading...');
      const response = await axios.post('/cvs/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Replace blob URL with server path
      setCvData((prev) => ({ ...prev, photo_path: response.data.photo_path }));
      setSaveStatus('Saved');
    } catch (error) {
      console.error('Upload failed', error);
      const msg = error.response?.data?.message || 'Photo upload failed. Check file type and size.';
      alert(msg);
      // Rollback preview if failed
      setCvData(prev => ({ ...prev, photo_path: '' }));
      setSaveStatus('Error');
    }
  };

  // --- Dynamic Structured Arrays Logic ---
  const addSectionItem = (section, defaultData) => {
    setCvData((prev) => ({
      ...prev,
      [section]: [
        ...(prev[section] || []),
        { id: crypto.randomUUID(), isExpanded: true, ...defaultData },
      ],
    }));
  };

  const updateSectionItem = (section, id, field, value) => {
    setCvData((prev) => ({
      ...prev,
      [section]: prev[section].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const toggleExpand = (section, id) => {
    setCvData((prev) => ({
      ...prev,
      [section]: prev[section].map((item) =>
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      ),
    }));
  };

  const removeSectionItem = (section, id) => {
    if(!window.confirm("Delete this?")) return;
    setCvData((prev) => ({ ...prev, [section]: prev[section].filter((item) => item.id !== id) }));
  };

  const handleDragEnd = (event, section) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCvData((prev) => {
        const oldIndex = prev[section].findIndex((i) => i.id === active.id);
        const newIndex = prev[section].findIndex((i) => i.id === over.id);
        return { ...prev, [section]: arrayMove(prev[section], oldIndex, newIndex) };
      });
    }
  };

  const calculateProgress = () => {
    const fields = ['full_name', 'email', 'phone', 'address', 'summary', 'career_objective'];
    const filledFields = fields.filter(f => !!cvData[f]).length;
    const collections = ['experiences', 'educations', 'skills', 'projects', 'certifications', 'languages', 'social_links'];
    const filledCollections = collections.filter(c => cvData[c]?.length > 0).length;
    
    const totalPoints = fields.length + collections.length;
    const currentPoints = filledFields + filledCollections;
    
    return Math.round((currentPoints / totalPoints) * 100);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (initialLoading) return <div className="min-h-screen bg-slate-950 flex justify-center items-center text-emerald-500 font-bold tracking-widest uppercase animate-pulse">Loading Editor...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col selection:bg-emerald-500/30">
      
      {/* Top Navigation */}
      <nav className="bg-slate-900/50 backdrop-blur-xl border-b border-white/5 px-8 h-20 flex justify-between items-center sticky top-0 z-50 print:hidden">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="group flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all active:scale-95">
             <ChevronDown className="w-4 h-4 transform rotate-90 text-slate-400 group-hover:text-white" />
             <span className="text-sm font-bold text-slate-400 group-hover:text-white">Exit Editor</span>
          </Link>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="flex flex-col">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Document Title</span>
             <input 
               type="text" 
               name="title" 
               value={cvData.title} 
               onChange={handleChange}
               className="bg-transparent border-none outline-none font-black text-white p-0 m-0 w-64"
             />
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">CV Strength</span>
                 <span className="text-[10px] font-black text-emerald-400">{calculateProgress()}%</span>
              </div>
              <div className="w-40 h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 transition-all duration-500 ease-out" style={{ width: `${calculateProgress()}%` }}></div>
              </div>
           </div>
           
           <div className="h-10 w-px bg-white/10"></div>

           <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${saveStatus === 'Saved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse'}`}>
                {saveStatus}
              </span>
              <button
                onClick={() => window.print()} 
                className="bg-white text-slate-950 px-8 h-12 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.3)] flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Finish & Download
              </button>
           </div>
        </div>
      </nav>

      {/* Builder Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* FORM SIDE */}
        <div className="w-1/2 overflow-y-auto custom-scrollbar bg-slate-950 px-8 py-12 space-y-12 pb-40 print:hidden">
          
          <div className="max-w-xl mx-auto space-y-12">

            {/* 1. Header Section */}
            <div>
               <h2 className="text-3xl font-black mb-2 flex items-center gap-4">
                  <User className="w-8 h-8 text-emerald-500" />
                  Personal Details
               </h2>
               <p className="text-slate-500 text-sm font-medium">Add your contact info so employers can reach you.</p>
            </div>

            <section id="personal-section" className="grid grid-cols-12 gap-8 items-start">
               <div className="col-span-4 group">
                  <div className="relative aspect-square rounded-3xl bg-slate-900 border-2 border-dashed border-slate-700 flex flex-col justify-center items-center overflow-hidden hover:border-emerald-500 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                     {cvData.photo_path ? (
                        <img src={`http://localhost:8080${cvData.photo_path}`} className="w-full h-full object-cover" alt="Profile" />
                     ) : (
                        <div className="flex flex-col items-center gap-2">
                           <Plus className="w-6 h-6 text-slate-500 shadow-xl" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Upload</span>
                        </div>
                     )}
                     <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-[10px] font-black uppercase tracking-widest">Change</span>
                     </div>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept=".jpg,.jpeg,.png,.webp" onChange={handlePhotoUpload} />
               </div>

               <div className="col-span-8 space-y-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                     <input type="text" placeholder="John Doe" name="full_name" value={cvData.full_name} onChange={handleChange} className="w-full h-12 bg-slate-900 border border-slate-700 rounded-xl px-4 font-bold text-white outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Professional Title</label>
                     <input type="text" placeholder="Senior Frontend Developer" name="title" value={cvData.title} onChange={handleChange} className="w-full h-12 bg-slate-900 border border-slate-700 rounded-xl px-4 font-bold text-white outline-none focus:border-emerald-500 transition-colors" />
                  </div>
               </div>

               <div className="col-span-12 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                     <input type="email" placeholder="john@example.com" name="email" value={cvData.email} onChange={handleChange} className="w-full h-12 bg-slate-900 border border-slate-700 rounded-xl px-4 text-sm text-white outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Phone Number</label>
                     <input type="text" placeholder="+1 (555) 000-0000" name="phone" value={cvData.phone} onChange={handleChange} className="w-full h-12 bg-slate-900 border border-slate-700 rounded-xl px-4 text-sm text-white outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                  <div className="col-span-2 space-y-1">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Location</label>
                     <input type="text" placeholder="London, United Kingdom" name="address" value={cvData.address} onChange={handleChange} className="w-full h-12 bg-slate-900 border border-slate-700 rounded-xl px-4 text-sm text-white outline-none focus:border-emerald-500 transition-colors" />
                  </div>
               </div>
            </section>

            {/* 2. Professional Summary */}
            <section id="summary-section" className="bg-slate-900/40 p-8 rounded-3xl border border-white/5 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl">
                     <Target className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white">Professional Summary</h3>
                     <p className="text-xs text-slate-500 font-medium">Write 2-4 sentences about your career highlights.</p>
                  </div>
               </div>
               <textarea 
                  placeholder="Senior developer with 8+ years experience in..." 
                  name="summary" 
                  value={cvData.summary} 
                  onChange={handleChange} 
                  rows="4" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-emerald-500 transition-colors resize-none leading-relaxed" 
               />
            </section>

            {/* 3. Career Objective */}
            <section id="objective-section" className="bg-slate-900/40 p-8 rounded-3xl border border-white/5 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-2xl">
                     <Award className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white">Career Objective</h3>
                     <p className="text-xs text-slate-500 font-medium">What is your primary goal for your next role?</p>
                  </div>
               </div>
               <textarea 
                  placeholder="Seeking a challenging role as a Tech Lead to..." 
                  name="career_objective" 
                  value={cvData.career_objective} 
                  onChange={handleChange} 
                  rows="3" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-emerald-500 transition-colors resize-none leading-relaxed" 
               />
            </section>

            {/* 4. Experience Section */}
            <section id="experience-section" className="space-y-6">
               <div className="flex justify-between items-end">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-orange-500/10 rounded-2xl">
                        <Briefcase className="w-6 h-6 text-orange-500" />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-white">Work Experience</h3>
                        <p className="text-xs text-slate-500 font-medium font-bold">Showcase your professional journey.</p>
                     </div>
                  </div>
                  <button onClick={() => addSectionItem('experiences', { company: '', position: '', start_date: '', end_date: '', description: '' })} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all transform hover:scale-105 active:scale-95 border border-white/5">
                     <Plus className="w-4 h-4" />
                     Add Experience
                  </button>
               </div>
               
               <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'experiences')}>
                  <SortableContext items={(cvData.experiences||[]).map(i => i.id)} strategy={verticalListSortingStrategy}>
                     <div className="space-y-4">
                        {cvData.experiences?.map(exp => (
                           <SortableItemWrapper key={exp.id} id={exp.id}>
                              {({ dragHandleProps }) => (
                                <div className={`bg-slate-900/40 border rounded-3xl transition-all duration-300 ${exp.isExpanded ? 'border-emerald-500/40 ring-4 ring-emerald-500/5' : 'border-white/5 hover:border-white/10'}`}>
                                   <div 
                                     className="p-5 flex justify-between items-center cursor-pointer" 
                                     onClick={() => toggleExpand('experiences', exp.id)}
                                   >
                                      <div className="flex items-center gap-4">
                                         <div {...dragHandleProps} className="text-slate-600 hover:text-white transition-colors p-2 cursor-grab active:cursor-grabbing rounded-lg hover:bg-slate-800">
                                            <Move className="w-4 h-4" />
                                         </div>
                                         <div>
                                            <div className="text-sm font-black text-white">{exp.position || 'Untitled Position'}</div>
                                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{exp.company || 'Company Name'}</div>
                                         </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                         <button onClick={(e) => { e.stopPropagation(); removeSectionItem('experiences', exp.id); }} className="p-2 text-slate-600 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-500/10">
                                            <Trash2 className="w-4 h-4" />
                                         </button>
                                         <div className="p-2 text-slate-400">
                                            {exp.isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                         </div>
                                      </div>
                                   </div>
                                   {exp.isExpanded && (
                                      <div className="px-8 pb-8 pt-2 space-y-6">
                                         <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Job Title</label>
                                               <input type="text" placeholder="Product Designer" value={exp.position} onChange={(e) => updateSectionItem('experiences', exp.id, 'position', e.target.value)} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-emerald-500" />
                                            </div>
                                            <div className="space-y-1">
                                               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Employer / Company</label>
                                               <input type="text" placeholder="Apple Inc." value={exp.company} onChange={(e) => updateSectionItem('experiences', exp.id, 'company', e.target.value)} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-emerald-500" />
                                            </div>
                                            <div className="space-y-1">
                                               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Start Date</label>
                                               <input type="text" placeholder="Jan 2020" value={exp.start_date} onChange={(e) => updateSectionItem('experiences', exp.id, 'start_date', e.target.value)} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-emerald-500" />
                                            </div>
                                            <div className="space-y-1">
                                               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">End Date</label>
                                               <input type="text" placeholder="Present" value={exp.end_date} onChange={(e) => updateSectionItem('experiences', exp.id, 'end_date', e.target.value)} className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-emerald-500" />
                                            </div>
                                         </div>
                                         <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Main Tasks & Responsibilities</label>
                                            <textarea 
                                              placeholder="• Lead the design team for the core product..." 
                                              rows="4" 
                                              value={exp.description} 
                                              onChange={(e) => updateSectionItem('experiences', exp.id, 'description', e.target.value)} 
                                              className="w-full bg-slate-900 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500 leading-relaxed" 
                                            />
                                         </div>
                                      </div>
                                   )}
                                </div>
                              )}
                           </SortableItemWrapper>
                        ))}
                     </div>
                  </SortableContext>
               </DndContext>
            </section>

            {/* 5. Education Section */}
            <section id="education-section" className="space-y-6">
               <div className="flex justify-between items-end">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-blue-500/10 rounded-2xl">
                        <GraduationCap className="w-6 h-6 text-blue-500" />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-white">Education</h3>
                        <p className="text-xs text-slate-500 font-medium font-bold">Highlight your academic credentials.</p>
                     </div>
                  </div>
                  <button onClick={() => addSectionItem('educations', { institution: '', degree: '', start_date: '', end_date: '', description: '' })} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all transform hover:scale-105 active:scale-95 border border-white/5">
                     <Plus className="w-4 h-4" />
                     Add Education
                  </button>
               </div>
               
               <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'educations')}>
                  <SortableContext items={(cvData.educations||[]).map(i => i.id)} strategy={verticalListSortingStrategy}>
                     <div className="space-y-4">
                        {cvData.educations?.map(edu => (
                           <SortableItemWrapper key={edu.id} id={edu.id}>
                              {({ dragHandleProps }) => (
                                <div className={`bg-slate-900/40 border rounded-3xl transition-all duration-300 ${edu.isExpanded ? 'border-blue-500/40 ring-4 ring-blue-500/5' : 'border-white/5 hover:border-white/10'}`}>
                                   <div 
                                     className="p-5 flex justify-between items-center cursor-pointer" 
                                     onClick={() => toggleExpand('educations', edu.id)}
                                   >
                                      <div className="flex items-center gap-4">
                                         <div {...dragHandleProps} className="text-slate-600 hover:text-white transition-colors p-2 cursor-grab active:cursor-grabbing rounded-lg hover:bg-slate-800">
                                            <Move className="w-4 h-4" />
                                         </div>
                                         <div>
                                            <div className="text-sm font-black text-white">{edu.degree || 'Untitled Degree'}</div>
                                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{edu.institution || 'University Name'}</div>
                                         </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                         <button onClick={(e) => { e.stopPropagation(); removeSectionItem('educations', edu.id); }} className="p-2 text-slate-600 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-500/10">
                                            <Trash2 className="w-4 h-4" />
                                         </button>
                                         <div className="p-2 text-slate-400">
                                            {edu.isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                         </div>
                                      </div>
                                   </div>
                                   {edu.isExpanded && (
                                      <div className="px-8 pb-8 pt-2 space-y-6">
                                         <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2 space-y-1">
                                               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Degree / Specialization</label>
                                               <input type="text" placeholder="Bachelor of Computer Science" value={edu.degree} onChange={(e) => updateSectionItem('educations', edu.id, 'degree', e.target.value)} className="w-full h-12 bg-slate-900 border border-white/5 rounded-xl px-4 text-sm text-white outline-none focus:border-blue-500" />
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">School / University</label>
                                               <input type="text" placeholder="Stanford University" value={edu.institution} onChange={(e) => updateSectionItem('educations', edu.id, 'institution', e.target.value)} className="w-full h-12 bg-slate-900 border border-white/5 rounded-xl px-4 text-sm text-white outline-none focus:border-blue-500" />
                                            </div>
                                            <div className="space-y-1">
                                               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Start Year</label>
                                               <input type="text" placeholder="2016" value={edu.start_date} onChange={(e) => updateSectionItem('educations', edu.id, 'start_date', e.target.value)} className="w-full h-12 bg-slate-900 border border-white/5 rounded-xl px-4 text-sm text-white outline-none focus:border-blue-500" />
                                            </div>
                                            <div className="space-y-1">
                                               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">End Year</label>
                                               <input type="text" placeholder="2020" value={edu.end_date} onChange={(e) => updateSectionItem('educations', edu.id, 'end_date', e.target.value)} className="w-full h-12 bg-slate-900 border border-white/5 rounded-xl px-4 text-sm text-white outline-none focus:border-blue-500" />
                                            </div>
                                         </div>
                                      </div>
                                   )}
                                </div>
                              )}
                           </SortableItemWrapper>
                        ))}
                     </div>
                  </SortableContext>
               </DndContext>
            </section>

            {/* 6. Skills Section (Tag-based) */}
            <section id="skills-section" className="bg-slate-900/40 p-8 rounded-3xl border border-white/5 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-2xl">
                     <Code className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white">Key Skills</h3>
                     <p className="text-xs text-slate-500 font-medium">Add your expertise as tags.</p>
                  </div>
               </div>
               <TagInput 
                  tags={cvData.skills} 
                  placeholder="Add skill (e.g. React, Python, UI Design)"
                  onAdd={(name) => addSectionItem('skills', { name })}
                  onRemove={(id) => setCvData(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }))}
               />
            </section>

            {/* 7. Languages and Interests Grid */}
            <div className="grid grid-cols-2 gap-8">
               <section id="languages-section" className="bg-slate-900/40 p-6 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2">
                        <Languages className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-sm font-black uppercase tracking-tighter text-white">Languages</h3>
                     </div>
                     <button onClick={() => addSectionItem('languages', { name: '' })} className="p-1 hover:bg-slate-800 rounded transition-colors">
                        <Plus className="w-4 h-4 text-slate-500" />
                     </button>
                  </div>
                  <div className="space-y-2">
                     {cvData.languages?.map(lang => (
                        <div key={lang.id} className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-white/5">
                           <input 
                             type="text" 
                             placeholder="English" 
                             value={lang.name} 
                             onChange={(e) => updateSectionItem('languages', lang.id, 'name', e.target.value)} 
                             className="bg-transparent border-none outline-none text-xs text-white w-full font-medium"
                           />
                           <button onClick={() => setCvData(prev => ({ ...prev, languages: prev.languages.filter(l => l.id !== lang.id) }))}>
                              <Trash2 className="w-3 h-3 text-slate-600 hover:text-rose-500" />
                           </button>
                        </div>
                     ))}
                  </div>
               </section>

               <section id="interests-section" className="bg-slate-900/40 p-6 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-400" />
                        <h3 className="text-sm font-black uppercase tracking-tighter text-white">Interests</h3>
                     </div>
                     <button onClick={() => addSectionItem('interests', { name: '' })} className="p-1 hover:bg-slate-800 rounded transition-colors">
                        <Plus className="w-4 h-4 text-slate-500" />
                     </button>
                  </div>
                  <div className="space-y-2">
                     {cvData.interests?.map(interest => (
                        <div key={interest.id} className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-white/5">
                           <input 
                             type="text" 
                             placeholder="Photography" 
                             value={interest.name} 
                             onChange={(e) => updateSectionItem('interests', interest.id, 'name', e.target.value)} 
                             className="bg-transparent border-none outline-none text-xs text-white w-full font-medium"
                           />
                           <button onClick={() => setCvData(prev => ({ ...prev, interests: prev.interests.filter(i => i.id !== interest.id) }))}>
                              <Trash2 className="w-3 h-3 text-slate-600 hover:text-rose-500" />
                           </button>
                        </div>
                     ))}
                  </div>
               </section>
            </div>

            {/* 8. Social Links Section */}
            <section id="social-section" className="bg-slate-900/40 p-8 rounded-3xl border border-white/5 space-y-6">
               <div className="flex justify-between items-end">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-blue-400/10 rounded-2xl">
                        <LinkIcon className="w-6 h-6 text-blue-400" />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-white">Portfolio & Socials</h3>
                        <p className="text-xs text-slate-500 font-medium font-bold">Where can we see more of you?</p>
                     </div>
                  </div>
                  <button onClick={() => addSectionItem('social_links', { platform: '', url: '' })} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all border border-white/5">
                     <Plus className="w-4 h-4" />
                     Add Link
                  </button>
               </div>
               
               <div className="space-y-4">
                  {cvData.social_links?.map(link => (
                     <div key={link.id} className="flex gap-4 items-center bg-slate-950 p-4 rounded-2xl border border-white/5">
                        <input type="text" placeholder="Platform (e.g. LinkedIn)" value={link.platform} onChange={(e) => updateSectionItem('social_links', link.id, 'platform', e.target.value)} className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white outline-none w-40 focus:border-blue-400" />
                        <input type="text" placeholder="URL (e.g. https://...)" value={link.url} onChange={(e) => updateSectionItem('social_links', link.id, 'url', e.target.value)} className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-blue-400" />
                        <button onClick={() => setCvData(prev => ({ ...prev, social_links: prev.social_links.filter(l => l.id !== link.id) }))} className="text-slate-600 hover:text-rose-500">
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  ))}
               </div>
            </section>

          </div>
        </div>

        {/* PREVIEW SIDE (Scrollable & Top-Aligned) */}
        <div className="w-1/2 bg-slate-200/50 relative flex flex-col items-center p-0 overflow-y-auto print:hidden border-l border-white/5 shadow-inner">
          
          {/* Quick Navigation Panel */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
             {[
               { id: 'personal-section', icon: User, label: 'Profile' },
               { id: 'summary-section', icon: Target, label: 'Summary' },
               { id: 'experience-section', icon: Briefcase, label: 'Experience' },
               { id: 'education-section', icon: GraduationCap, label: 'Education' },
               { id: 'skills-section', icon: Code, label: 'Skills' },
               { id: 'languages-section', icon: Languages, label: 'Extras' },
               { id: 'social-section', icon: LinkIcon, label: 'Links' }
             ].map(sec => (
               <button 
                 key={sec.id}
                 onClick={() => scrollToSection(sec.id)}
                 className="group relative flex items-center bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 hover:bg-emerald-500 hover:border-emerald-500 transition-all shadow-xl"
               >
                  <sec.icon className="w-5 h-5 text-slate-700 group-hover:text-white" />
                  <span className="absolute left-14 px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                     {sec.label}
                  </span>
               </button>
             ))}
          </div>

          <div id="cv-preview-container" className="transform scale-[0.48] 2xl:scale-[0.6] origin-top shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] transition-all duration-700 bg-white flex-shrink-0 mt-2" style={{ marginBottom: '-350px' }}>
            {(() => {
               let comp = 'modern';
               if (cvData.template_id && templateConfigMap[cvData.template_id]) {
                  comp = templateConfigMap[cvData.template_id].component || 'modern';
               } else if (cvData.template && templateConfigMap[cvData.template]) {
                  comp = templateConfigMap[cvData.template].component || 'modern';
               } else if (cvData.template) {
                  comp = cvData.template;
               }

               switch (comp) {
                  case 'minimal': return <MinimalTemplate cvData={cvData} />;
                  case 'creative': return <CreativeTemplate cvData={cvData} />;
                  case 'corporate': return <CorporateTemplate cvData={cvData} />;
                  case 'elegant': return <ElegantTemplate cvData={cvData} />;
                  case 'modern':
                  default:
                     return <ModernTemplate cvData={cvData} />;
               }
            })()}
          </div>

          <div className="absolute bottom-8 right-8 flex flex-col gap-4">
             <div className="bg-slate-900/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/40 flex flex-col gap-1 items-end shadow-xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Auto-save Enabled</span>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-xs font-bold text-slate-700">{saveStatus}</span>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
