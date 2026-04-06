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
    <div ref={setNodeRef} style={style} className={`${isDragging ? 'shadow-2xl ring-2 ring-emerald-500 rounded-xl' : ''}`}>
      {children({ dragHandleProps: { ...attributes, ...listeners } })}
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

        // If new CV, grab template ID from local storage
        if (!id) {
           const storedTemplateId = localStorage.getItem('selected_template_id');
           if (storedTemplateId) {
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
              social_links: processList(fetchedData.socialLinks || fetchedData.social_links)
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

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo size exceeds 5MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);

    try {
      setSaveStatus('Uploading photo...');
      const response = await axios.post('/cvs/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCvData((prev) => ({ ...prev, photo_path: response.data.photo_path }));
      setSaveStatus('Saved');
    } catch (error) {
      alert('Photo upload failed.');
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

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post('/cv/generate', cvData, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${cvData.full_name?.replace(/\\s+/g, '_') || 'My_CV'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Failed to generate PDF. Print using browser.');
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  if (initialLoading) return <div className="min-h-screen bg-slate-900 flex justify-center items-center text-white font-bold tracking-widest uppercase">Loading Editor...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col print:bg-white print:text-black">
      <nav className="glass border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 print:hidden">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 transition font-bold px-3 py-1.5 rounded-lg border border-blue-500/20">Dashboard</Link>
          <span className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider ${saveStatus === 'Saved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400 animate-pulse'}`}>
            {saveStatus}
          </span>
        </div>
        <button
            onClick={() => window.print()} 
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2 rounded-xl font-bold uppercase tracking-widest text-xs transition"
          >
            Export PDF
          </button>
      </nav>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Pane - FORM BUILDER */}
        <div className="w-1/2 bg-slate-800/80 backdrop-blur-xl border-r border-slate-700/50 flex flex-col relative z-10 shadow-2xl overflow-y-auto custom-scrollbar pb-40 space-y-6 print:hidden">
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Personal Details */}
            <section className="bg-slate-800 p-6 rounded-2xl shadow-xl flex gap-6">
               <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-slate-900 flex justify-center items-center overflow-hidden border border-slate-600 relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                     {cvData.photo_path ? (
                        <img src={`http://localhost:8080${cvData.photo_path}`} className="w-full h-full object-cover" alt="Profile" />
                     ) : (
                        <span className="text-[10px] uppercase font-bold text-slate-500">Photo</span>
                     )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept=".jpg,.png" onChange={handlePhotoUpload} />
               </div>
               <div className="flex-1 space-y-3">
                  <input type="text" placeholder="Full Name" name="full_name" value={cvData.full_name} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 font-black text-white outline-none" />
                  <input type="text" placeholder="Job Title" name="title" value={cvData.title} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white outline-none" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="email" placeholder="Email" name="email" value={cvData.email} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none" />
                    <input type="text" placeholder="Phone" name="phone" value={cvData.phone} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none" />
                  </div>
                  <input type="text" placeholder="Address / Location" name="address" value={cvData.address} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none" />
               </div>
            </section>

            <section className="bg-slate-800 p-6 rounded-2xl shadow-xl">
               <h3 className="font-black uppercase tracking-widest text-xs mb-3 text-slate-400">Professional Summary</h3>
               <textarea placeholder="Write a brief professional profile..." name="summary" value={cvData.summary} onChange={handleChange} rows="4" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white outline-none resize-none" />
            </section>

            {/* Experiences Array */}
            <section className="bg-slate-800 p-6 rounded-2xl shadow-xl">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black uppercase tracking-widest text-xs text-slate-400">Employment History</h3>
                  <button onClick={() => addSectionItem('experiences', { company: '', position: '', start_date: '', end_date: '', description: '' })} className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded">+ Add Job</button>
               </div>
               <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'experiences')}>
                  <SortableContext items={(cvData.experiences||[]).map(i => i.id)} strategy={verticalListSortingStrategy}>
                     <div className="space-y-3">
                        {cvData.experiences?.map(exp => (
                           <SortableItemWrapper key={exp.id} id={exp.id}>
                              {({ dragHandleProps }) => (
                                <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden group">
                                   <div className="p-3 flex justify-between cursor-pointer hover:bg-slate-800" onClick={() => toggleExpand('experiences', exp.id)}>
                                      <div className="flex gap-3">
                                         <button {...dragHandleProps} className="text-slate-500 cursor-grab">≡</button>
                                         <div>
                                            <div className="text-sm font-bold text-white">{exp.position || '(Not specified)'}</div>
                                            <div className="text-xs text-slate-400">{exp.company}</div>
                                         </div>
                                      </div>
                                      <button onClick={(e) => { e.stopPropagation(); removeSectionItem('experiences', exp.id); }} className="text-slate-500 hover:text-rose-400 px-2">×</button>
                                   </div>
                                   {exp.isExpanded && (
                                      <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
                                         <div className="grid grid-cols-2 gap-3">
                                            <input type="text" placeholder="Job Title" value={exp.position} onChange={(e) => updateSectionItem('experiences', exp.id, 'position', e.target.value)} className="bg-slate-800 px-3 py-2 text-xs rounded text-white outline-none" />
                                            <input type="text" placeholder="Company" value={exp.company} onChange={(e) => updateSectionItem('experiences', exp.id, 'company', e.target.value)} className="bg-slate-800 px-3 py-2 text-xs rounded text-white outline-none" />
                                            <input type="text" placeholder="Start Date" value={exp.start_date} onChange={(e) => updateSectionItem('experiences', exp.id, 'start_date', e.target.value)} className="bg-slate-800 px-3 py-2 text-xs rounded text-white outline-none" />
                                            <input type="text" placeholder="End Date" value={exp.end_date} onChange={(e) => updateSectionItem('experiences', exp.id, 'end_date', e.target.value)} className="bg-slate-800 px-3 py-2 text-xs rounded text-white outline-none" />
                                         </div>
                                         <textarea placeholder="Description" rows="3" value={exp.description} onChange={(e) => updateSectionItem('experiences', exp.id, 'description', e.target.value)} className="w-full bg-slate-800 px-3 py-2 text-xs rounded text-white outline-none" />
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

            {/* Educations Array */}
            <section className="bg-slate-800 p-6 rounded-2xl shadow-xl">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black uppercase tracking-widest text-xs text-slate-400">Education</h3>
                  <button onClick={() => addSectionItem('educations', { institution: '', degree: '', start_date: '', end_date: '', description: '' })} className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded">+ Add Education</button>
               </div>
               <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'educations')}>
                  <SortableContext items={(cvData.educations||[]).map(i => i.id)} strategy={verticalListSortingStrategy}>
                     <div className="space-y-3">
                        {cvData.educations?.map(edu => (
                           <SortableItemWrapper key={edu.id} id={edu.id}>
                              {({ dragHandleProps }) => (
                                <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden group">
                                   <div className="p-3 flex justify-between cursor-pointer hover:bg-slate-800" onClick={() => toggleExpand('educations', edu.id)}>
                                      <div className="flex gap-3">
                                         <button {...dragHandleProps} className="text-slate-500 cursor-grab">≡</button>
                                         <div>
                                            <div className="text-sm font-bold text-white">{edu.degree || '(Not specified)'}</div>
                                            <div className="text-xs text-slate-400">{edu.institution}</div>
                                         </div>
                                      </div>
                                      <button onClick={(e) => { e.stopPropagation(); removeSectionItem('educations', edu.id); }} className="text-slate-500 hover:text-rose-400 px-2">×</button>
                                   </div>
                                   {edu.isExpanded && (
                                      <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
                                         <div className="grid grid-cols-2 gap-3">
                                            <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => updateSectionItem('educations', edu.id, 'degree', e.target.value)} className="bg-slate-800 px-3 py-2 text-xs rounded text-white outline-none" />
                                            <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => updateSectionItem('educations', edu.id, 'institution', e.target.value)} className="bg-slate-800 px-3 py-2 text-xs rounded text-white outline-none" />
                                            <input type="text" placeholder="Start Year" value={edu.start_date} onChange={(e) => updateSectionItem('educations', edu.id, 'start_date', e.target.value)} className="bg-slate-800 px-3 py-2 text-xs rounded text-white outline-none" />
                                            <input type="text" placeholder="End Year" value={edu.end_date} onChange={(e) => updateSectionItem('educations', edu.id, 'end_date', e.target.value)} className="bg-slate-800 px-3 py-2 text-xs rounded text-white outline-none" />
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

             {/* Skills and Languages Arrays Inline */}
             <div className="grid grid-cols-2 gap-6">
                <section className="bg-slate-800 p-6 rounded-2xl shadow-xl">
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-400">Skills</h3>
                      <button onClick={() => addSectionItem('skills', { name: '', level: '' })} className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-0.5 rounded">+ Add</button>
                   </div>
                   <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'skills')}>
                      <SortableContext items={(cvData.skills||[]).map(i => i.id)} strategy={verticalListSortingStrategy}>
                         <div className="space-y-2">
                            {cvData.skills?.map(skill => (
                               <SortableItemWrapper key={skill.id} id={skill.id}>
                                  {({ dragHandleProps }) => (
                                    <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-lg border border-slate-700">
                                        <button {...dragHandleProps} className="text-slate-500 cursor-grab px-1">≡</button>
                                        <input type="text" placeholder="Skill" value={skill.name} onChange={(e) => updateSectionItem('skills', skill.id, 'name', e.target.value)} className="bg-transparent w-full outline-none text-xs text-white" />
                                        <button onClick={() => removeSectionItem('skills', skill.id)} className="text-slate-500 hover:text-rose-400 px-2">×</button>
                                    </div>
                                  )}
                               </SortableItemWrapper>
                            ))}
                         </div>
                      </SortableContext>
                   </DndContext>
                </section>
                
                <section className="bg-slate-800 p-6 rounded-2xl shadow-xl">
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-400">Languages</h3>
                      <button onClick={() => addSectionItem('languages', { name: '', proficiency: '' })} className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-0.5 rounded">+ Add</button>
                   </div>
                   <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'languages')}>
                      <SortableContext items={(cvData.languages||[]).map(i => i.id)} strategy={verticalListSortingStrategy}>
                         <div className="space-y-2">
                            {cvData.languages?.map(lang => (
                               <SortableItemWrapper key={lang.id} id={lang.id}>
                                  {({ dragHandleProps }) => (
                                    <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-lg border border-slate-700">
                                        <button {...dragHandleProps} className="text-slate-500 cursor-grab px-1">≡</button>
                                        <input type="text" placeholder="Language" value={lang.name} onChange={(e) => updateSectionItem('languages', lang.id, 'name', e.target.value)} className="bg-transparent w-full outline-none text-xs text-white" />
                                        <button onClick={() => removeSectionItem('languages', lang.id)} className="text-slate-500 hover:text-rose-400 px-2">×</button>
                                    </div>
                                  )}
                               </SortableItemWrapper>
                            ))}
                         </div>
                      </SortableContext>
                   </DndContext>
                </section>
             </div>

          </div>
        </div>

        <div className="w-1/2 bg-slate-300 relative flex items-center justify-center p-8 overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(slate-400 1px, transparent 1px), linear-gradient(90deg, slate-400 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div id="cv-preview-container" className="transform scale-[0.6] 2xl:scale-[0.8] origin-center hover:scale-[0.62] 2xl:hover:scale-[0.82] transition-transform duration-500 will-change-transform shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)]">
            {cvData.template_id && templateConfigMap[cvData.template_id] ? (
               <TemplateEngine cvData={cvData} config={templateConfigMap[cvData.template_id]} />
            ) : cvData.template && templateConfigMap[cvData.template] ? (
               <TemplateEngine cvData={cvData} config={templateConfigMap[cvData.template]} />
            ) : (
               <>
                 {cvData.template === 'minimal' && <MinimalTemplate cvData={cvData} />}
                 {cvData.template === 'creative' && <CreativeTemplate cvData={cvData} />}
                 {cvData.template === 'corporate' && <CorporateTemplate cvData={cvData} />}
                 {(!cvData.template || cvData.template === 'modern') && <ModernTemplate cvData={cvData} />}
               </>
            )}
          </div>

          <div className="absolute bottom-6 right-6 flex flex-col gap-2 print:hidden">
            <button 
              onClick={() => handleDownloadPDF()}
              className="bg-emerald-600 shadow-xl shadow-emerald-900/50 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 group flex items-center justify-center font-bold tracking-widest gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              EXPORT PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
