import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from '../lib/axios';

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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`${isDragging ? 'shadow-2xl ring-2 ring-emerald-500 rounded-xl' : ''}`}>
      {React.cloneElement(children, {
        dragHandleProps: { ...attributes, ...listeners },
      })}
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

  const [cvData, setCvData] = useState({
    id: id || null,
    title: 'My Professional CV',
    full_name: user?.first_name ? `${user.first_name} ${user?.last_name || ''}` : '',
    email: user?.email || '',
    phone: '',
    address: '',
    summary: '',
    template: location.state?.selectedTemplate || 'minimal',
    primary_color: '#10b981',
    font_family: 'sans-serif',
    layout: '1-column',
    photo_path: '',
    items: [],
  });

  const [availableTemplates, setAvailableTemplates] = useState([]);

  // DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get('/cv-templates');
        setAvailableTemplates(res.data);
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
          
          // Ensure all items have a unique ID for DND, and set expanded state
          const processedItems = (fetchedData.items || []).map(i => ({
             ...i,
             id: i.id || crypto.randomUUID(),
             isExpanded: false
          }));

          setCvData({ ...fetchedData, items: processedItems });
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
    }, 1500);

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
      alert('Photo size exceeds 5MB limit. Please upload a smaller image.');
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
      console.error('Photo upload failed', error);
      setSaveStatus('Error uploading');
      alert('Photo upload failed. Ensure the image is <5MB and valid (.jpg, .png, .webp).');
    }
  };

  // --- Dynamic Items Logic ---
  const addItem = (type, defaultData) => {
    setCvData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: crypto.randomUUID(),
          type,
          data: defaultData,
          isExpanded: true,
        },
      ],
    }));
  };

  const updateItemData = (id, field, value) => {
    setCvData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, data: { ...item.data, [field]: value } } : item
      ),
    }));
  };

  const toggleExpand = (id, forceState = null) => {
    setCvData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, isExpanded: forceState !== null ? forceState : !item.isExpanded } : item
      ),
    }));
  };

  const removeItem = (id) => {
    if(!window.confirm("Delete this section?")) return;
    setCvData((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }));
  };

  const duplicateItem = (id) => {
    setCvData((prev) => {
      const itemToCopy = prev.items.find((i) => i.id === id);
      if (!itemToCopy) return prev;
      const index = prev.items.findIndex((i) => i.id === id);
      const cloned = { ...itemToCopy, id: crypto.randomUUID(), isExpanded: true };
      const newItems = [...prev.items];
      newItems.splice(index + 1, 0, cloned);
      return { ...prev, items: newItems };
    });
  };

  // --- DND Handlers ---
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCvData((prev) => {
        const oldIndex = prev.items.findIndex((i) => i.id === active.id);
        const newIndex = prev.items.findIndex((i) => i.id === over.id);
        return { ...prev, items: arrayMove(prev.items, oldIndex, newIndex) };
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
      link.setAttribute('download', `${cvData.full_name?.replace(/\s+/g, '_') || 'My_CV'}.pdf`);
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

  // Safe Filtered Lists (Maintaining order from the unified items array)
  const experiences = cvData.items.filter((i) => i.type === 'experience');
  const educations = cvData.items.filter((i) => i.type === 'education');
  const skills = cvData.items.filter((i) => i.type === 'skill');

  if (initialLoading) return <div className="min-h-screen bg-slate-900 flex justify-center items-center text-white">Loading Editor...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      <nav className="glass border-b border-slate-700/50 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-2 font-medium bg-emerald-500/10 px-3 py-1.5 rounded-lg">← Back</Link>
          <div className="w-px h-6 bg-slate-700 mx-1"></div>
          <span className="font-bold text-lg text-white">Advanced Editor</span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${saveStatus === 'Saved' ? 'bg-emerald-500/20 text-emerald-400' : saveStatus.includes('Error') ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400 animate-pulse'}`}>
            {saveStatus}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={generatePDF}
            disabled={isGenerating}
            className={`bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2.5 rounded-xl transition shadow-[0_0_15px_rgba(16,185,129,0.3)] font-bold flex items-center gap-2 ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isGenerating ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {/* Left Side: Form */}
          <div className="w-full lg:w-[45%] p-6 overflow-y-auto border-r border-slate-700/50 custom-scrollbar pb-40 space-y-6">
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Design Settings */}
              <section className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-indigo-400 text-xl">✨</span> Design Options
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Template</label>
                    <select name="template" value={cvData.template} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 text-sm font-medium">
                      {availableTemplates.map((t) => (
                        <option key={t.id} value={t.slug}>{t.name}</option>
                      ))}
                      {availableTemplates.length === 0 && <option value="minimal">Minimalist</option>}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Layout Style</label>
                    <select name="layout" value={cvData.layout} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 text-sm font-medium">
                      <option value="1-column">Single Column</option>
                      <option value="2-column">Double Column (Sidebar)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Typography</label>
                    <select name="font_family" value={cvData.font_family} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 text-sm font-medium">
                      <option value="sans-serif">Modern Sans</option>
                      <option value="serif">Classic Serif</option>
                      <option value="monospace">Developer Mono</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" name="primary_color" value={cvData.primary_color} onChange={handleChange} className="w-8 h-8 rounded cursor-pointer bg-slate-900 border-0 outline-none" />
                      <input type="text" name="primary_color" value={cvData.primary_color} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 font-mono text-xs uppercase" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Personal Details */}
              <section className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                   <span className="text-emerald-400 text-xl">👤</span> Personal Details
                </h3>
                <div className="flex flex-col sm:flex-row gap-6 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-28 h-28 rounded-xl bg-slate-900 border-2 border-dashed border-slate-600 flex flex-col justify-center items-center overflow-hidden relative group">
                      {cvData.photo_path ? (
                        <img src={`http://localhost:8080${cvData.photo_path}`} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-slate-500 text-xs font-bold text-center px-2">Drop Photo<br/>(Max 5MB)</span>
                      )}
                      <div className="absolute inset-0 bg-slate-900/70 hidden group-hover:flex justify-center items-center transition cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <span className="text-white text-xs font-bold bg-slate-800 px-3 py-1 rounded-full border border-slate-600">Change</span>
                      </div>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".jpg,.jpeg,.png,.webp" onChange={handlePhotoUpload} />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <input type="text" placeholder="Full Name" name="full_name" value={cvData.full_name} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white font-bold outline-none focus:border-emerald-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Job Title / Subtitle" name="title" value={cvData.title} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-emerald-500 col-span-2" />
                      <input type="email" placeholder="Email Address" name="email" value={cvData.email} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-emerald-500" />
                      <input type="text" placeholder="Phone Number" name="phone" value={cvData.phone} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-emerald-500" />
                      <input type="text" placeholder="Location / Address" name="address" value={cvData.address} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-emerald-500 col-span-2" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <textarea placeholder="Professional Summary (A brief description of your background...)" name="summary" value={cvData.summary} onChange={handleChange} rows="3" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-emerald-500 resize-none" />
                </div>
              </section>

              {/* Dynamic Arrays (Experience) */}
              <section className="space-y-4">
                <div className="flex justify-between items-center mb-2 px-1">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                     <span className="text-blue-400 text-xl">💼</span> Employment History
                  </h3>
                  <button onClick={() => addItem('experience', { jobTitle: '', company: '', startDate: '', endDate: '', description: '' })} className="text-sm bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold px-3 py-1.5 rounded-lg transition border border-blue-500/30">+ Add Job</button>
                </div>
                
                <SortableContext items={experiences.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {experiences.map((item) => (
                      <SortableItemWrapper key={item.id} id={item.id}>
                        {/* Render Prop Component */}
                        <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden group">
                           {/* Accordion Header */}
                           <div className="flex items-center justify-between p-3 bg-slate-800 border-b border-transparent group-hover:bg-slate-700/50 transition">
                              <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleExpand(item.id)}>
                                 {/* Drag Handle */}
                                 {/* (Passed down via React.cloneElement) */}
                                 <button {...(arguments[0]?.dragHandleProps || {})} className="text-slate-500 hover:text-white cursor-grab active:cursor-grabbing p-1">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" /></svg>
                                 </button>
                                 <div className="flex-1">
                                    <div className="font-bold text-white text-sm">{item.data.jobTitle || '(Not specified)'}</div>
                                    <div className="text-xs text-slate-400 font-medium">{item.data.company || '(Company)'}</div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-1">
                                 <button onClick={() => duplicateItem(item.id)} className="p-1.5 text-slate-500 hover:text-blue-400 rounded transition" title="Duplicate">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                                 </button>
                                 <button onClick={() => removeItem(item.id)} className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition" title="Delete">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                 </button>
                                 <button onClick={() => toggleExpand(item.id)} className="p-1 text-slate-400 ml-2">
                                    <svg className={`w-5 h-5 transition-transform duration-200 ${item.isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                 </button>
                              </div>
                           </div>
                           
                           {/* Accordion Body */}
                           {item.isExpanded && (
                             <div className="p-4 bg-slate-900/30 border-t border-slate-700/50 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <input type="text" placeholder="Job Title" value={item.data.jobTitle || ''} onChange={(e) => updateItemData(item.id, 'jobTitle', e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 text-sm" />
                                  <input type="text" placeholder="Employer / Company" value={item.data.company || ''} onChange={(e) => updateItemData(item.id, 'company', e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 text-sm" />
                                  <input type="text" placeholder="Start Date (e.g. Jan 2020)" value={item.data.startDate || ''} onChange={(e) => updateItemData(item.id, 'startDate', e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 text-sm" />
                                  <input type="text" placeholder="End Date (e.g. Present)" value={item.data.endDate || ''} onChange={(e) => updateItemData(item.id, 'endDate', e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 text-sm" />
                                </div>
                                <textarea placeholder="Describe your responsibilities and achievements..." value={item.data.description || ''} onChange={(e) => updateItemData(item.id, 'description', e.target.value)} rows="4" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 resize-none text-sm" />
                             </div>
                           )}
                        </div>
                      </SortableItemWrapper>
                    ))}
                    {experiences.length === 0 && <div className="text-center p-6 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 text-sm font-medium">No employment history added yet.</div>}
                  </div>
                </SortableContext>
              </section>

              {/* Dynamic Arrays (Education) */}
              <section className="space-y-4">
                <div className="flex justify-between items-center mb-2 px-1">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                     <span className="text-rose-400 text-xl">🎓</span> Education
                  </h3>
                  <button onClick={() => addItem('education', { degree: '', institution: '', year: '' })} className="text-sm bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold px-3 py-1.5 rounded-lg transition border border-rose-500/30">+ Add Education</button>
                </div>
                
                <SortableContext items={educations.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {educations.map((item) => (
                      <SortableItemWrapper key={item.id} id={item.id}>
                        <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden group">
                           <div className="flex items-center px-2 py-3">
                                 <button {...(arguments[0]?.dragHandleProps || {})} className="text-slate-500 hover:text-white cursor-grab active:cursor-grabbing px-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" /></svg>
                                 </button>
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1 px-2">
                                    <input type="text" placeholder="Degree / Certificate" value={item.data.degree || ''} onChange={(e) => updateItemData(item.id, 'degree', e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white outline-none focus:border-rose-500 text-sm" />
                                    <input type="text" placeholder="School / University" value={item.data.institution || ''} onChange={(e) => updateItemData(item.id, 'institution', e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white outline-none focus:border-rose-500 text-sm" />
                                    <input type="text" placeholder="Graduation Year" value={item.data.year || ''} onChange={(e) => updateItemData(item.id, 'year', e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white outline-none focus:border-rose-500 text-sm" />
                                 </div>
                                 <button onClick={() => removeItem(item.id)} className="p-2 text-slate-500 hover:text-rose-400 rounded transition ml-1" title="Delete">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                 </button>
                           </div>
                        </div>
                      </SortableItemWrapper>
                    ))}
                    {educations.length === 0 && <div className="text-center p-6 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 text-sm font-medium">No education added yet.</div>}
                  </div>
                </SortableContext>
              </section>

              {/* Dynamic Arrays (Skills) */}
              <section className="space-y-4">
                <div className="flex justify-between items-center mb-2 px-1">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                     <span className="text-cyan-400 text-xl">⚡</span> Skills
                  </h3>
                  <button onClick={() => addItem('skill', { name: '', level: 'Intermediate' })} className="text-sm bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-bold px-3 py-1.5 rounded-lg transition border border-cyan-500/30">+ Add Skill</button>
                </div>
                
                <SortableContext items={skills.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-wrap gap-3">
                    {skills.map((item) => (
                      <SortableItemWrapper key={item.id} id={item.id}>
                        <div className="flex items-center gap-1 bg-slate-800 border border-slate-600 rounded-full px-2 py-1 group hover:border-cyan-500 transition">
                            <span {...(arguments[0]?.dragHandleProps || {})} className="cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 p-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" /></svg>
                            </span>
                            <input type="text" placeholder="Skill Name" value={item.data.name || ''} onChange={(e) => updateItemData(item.id, 'name', e.target.value)} className="bg-transparent text-white outline-none w-28 text-sm font-medium px-1 placeholder-slate-500" />
                            <button onClick={() => removeItem(item.id)} className="text-slate-500 hover:text-rose-400 font-bold w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-700">×</button>
                        </div>
                      </SortableItemWrapper>
                    ))}
                    {skills.length === 0 && <div className="w-full text-center p-6 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 text-sm font-medium">No skills added yet.</div>}
                  </div>
                </SortableContext>
              </section>

              {/* Empty padding for scroll buffer */}
              <div className="h-10"></div>
            </div>
          </div>
        </DndContext>

        {/* Right Side: Live HTML Preview (Unchanged structure) */}
        <div className="w-full lg:w-[55%] p-6 lg:p-8 bg-slate-900/80 overflow-y-auto flex justify-center items-start shadow-inner box-border relative">
          
          <div className="absolute top-4 right-4 bg-slate-800 text-slate-400 text-xs px-3 py-1.5 rounded-lg border border-slate-700 font-medium">Live Preview</div>

          <div className={`bg-white w-full max-w-[794px] min-h-[1123px] shadow-2xl p-0 text-slate-800 break-words transition-all duration-300 flex ${cvData.layout === '2-column' ? 'flex-row' : 'flex-col'} overflow-hidden rounded-sm`} style={{ fontFamily: cvData.font_family }}>
            
            {cvData.layout === '2-column' ? (
              <>
                {/* Sidebar (Left in 2-column) */}
                <div className="w-[35%] p-8 text-white h-full min-h-[1123px]" style={{ backgroundColor: cvData.primary_color }}>
                  {cvData.photo_path && (
                    <div className="flex justify-center mb-8">
                      <img src={`http://localhost:8080${cvData.photo_path}`} className="w-36 h-36 object-cover rounded-full border-4 border-white/20 shadow-xl" alt="Profile" />
                    </div>
                  )}
                  
                  <h1 className="text-2xl font-black uppercase tracking-tight text-center mb-2 leading-tight">{cvData.full_name || 'YOUR NAME'}</h1>
                  
                  <div className="mt-8 flex flex-col gap-3 text-[13px] font-medium opacity-90">
                    <div className="h-0.5 w-12 bg-white/30 mb-2"></div>
                    {cvData.email && <div className="break-all">{cvData.email}</div>}
                    {cvData.phone && <div>{cvData.phone}</div>}
                    {cvData.address && <div className="leading-snug">{cvData.address}</div>}
                  </div>

                  {skills.length > 0 && (
                     <div className="mt-12">
                        <div className="h-0.5 w-12 bg-white/30 mb-4"></div>
                        <h2 className="text-lg font-bold uppercase tracking-wider mb-5">Core Skills</h2>
                        <ul className="flex flex-col gap-2 text-[13px] opacity-90">
                          {skills.map((skill, i) => (
                            <li key={i} className="border-b border-white/10 pb-1">{skill.data.name || 'Skill'}</li>
                          ))}
                        </ul>
                     </div>
                  )}
                </div>

                {/* Main Content (Right in 2-column) */}
                <div className="w-[65%] p-10 bg-white">
                  {cvData.summary && (
                    <div className="mb-10">
                      <h2 className="text-lg font-bold uppercase tracking-widest mb-3 border-b-2 pb-2" style={{ borderColor: cvData.primary_color, color: cvData.primary_color }}>Profile</h2>
                      <p className="text-[13px] leading-relaxed whitespace-pre-line text-slate-700 text-justify">{cvData.summary}</p>
                    </div>
                  )}

                  {experiences.length > 0 && (
                    <div className="mb-10">
                      <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b-2 pb-2" style={{ borderColor: cvData.primary_color, color: cvData.primary_color }}>Experience</h2>
                      <div className="space-y-8">
                        {experiences.map((exp, i) => (
                          <div key={i}>
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-bold text-slate-800 text-[15px]">{exp.data.jobTitle || 'Job Title'}</h3>
                            </div>
                            <div className="text-[13px] font-bold text-slate-500 mb-2 flex justify-between">
                               <span style={{ color: cvData.primary_color }}>{exp.data.company || 'Company Name'}</span>
                               <span className="font-medium text-slate-400">{exp.data.startDate} {exp.data.endDate ? `- ${exp.data.endDate}` : ''}</span>
                            </div>
                            <p className="text-[13px] text-slate-600 whitespace-pre-line leading-relaxed text-justify mt-2">{exp.data.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {educations.length > 0 && (
                    <div className="mb-10">
                      <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b-2 pb-2" style={{ borderColor: cvData.primary_color, color: cvData.primary_color }}>Education</h2>
                      <div className="space-y-5">
                        {educations.map((edu, i) => (
                          <div key={i} className="flex justify-between items-start">
                            <div className="w-3/4">
                              <h3 className="font-bold text-slate-800 text-[14px]">{edu.data.degree || 'Degree'}</h3>
                              <div className="text-[13px] font-semibold mt-1" style={{ color: cvData.primary_color }}>{edu.data.institution || 'Institution'}</div>
                            </div>
                            <span className="text-[12px] font-bold text-slate-400 text-right">{edu.data.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // 1 Column Default Layout
              <div className="p-16 w-full bg-white">
                <div className="border-b-4 pb-10 mb-10 flex items-center gap-10" style={{ borderColor: cvData.primary_color }}>
                  {cvData.photo_path && (
                    <img src={`http://localhost:8080${cvData.photo_path}`} className="w-40 h-40 object-cover rounded-full shadow-lg border-4" style={{ borderColor: cvData.primary_color }} alt="Profile" />
                  )}
                  <div className="flex-1">
                    <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-4" style={{ color: cvData.primary_color }}>
                      {cvData.full_name || 'YOUR NAME'}
                    </h1>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] font-bold text-slate-500">
                      {cvData.email && <span>{cvData.email}</span>}
                      {cvData.phone && <span>• {cvData.phone}</span>}
                      {cvData.address && <span className="w-full mt-1">📍 {cvData.address}</span>}
                    </div>
                  </div>
                </div>

                {cvData.summary && (
                  <div className="mb-10">
                    <h2 className="text-[16px] font-bold uppercase tracking-widest mb-3 border-b-2 pb-2 text-slate-800" style={{ borderColor: cvData.primary_color }}>
                      Professional Summary
                    </h2>
                    <p className="text-[14px] leading-relaxed whitespace-pre-line text-slate-600 text-justify">{cvData.summary}</p>
                  </div>
                )}

                {experiences.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-[16px] font-bold uppercase tracking-widest mb-5 border-b-2 pb-2 text-slate-800" style={{ borderColor: cvData.primary_color }}>
                      Experience
                    </h2>
                    <div className="space-y-8">
                      {experiences.map((exp, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-4 top-1.5 w-2 h-2 rounded-full hidden md:block" style={{ backgroundColor: cvData.primary_color }}></div>
                          <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-bold text-slate-800 text-[16px]">{exp.data.jobTitle || 'Job Title'}</h3>
                            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wide">{exp.data.startDate} {exp.data.endDate ? `— ${exp.data.endDate}` : ''}</span>
                          </div>
                          <div className="text-[14px] font-black mb-3" style={{ color: cvData.primary_color }}>{exp.data.company || 'Company Name'}</div>
                          <p className="text-[13px] text-slate-600 whitespace-pre-line leading-relaxed text-justify">{exp.data.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {educations.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-[16px] font-bold uppercase tracking-widest mb-5 border-b-2 pb-2 text-slate-800" style={{ borderColor: cvData.primary_color }}>
                      Education
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {educations.map((edu, i) => (
                        <div key={i} className="bg-slate-50 p-4 rounded border border-slate-100 border-l-4" style={{ borderLeftColor: cvData.primary_color }}>
                           <h3 className="font-bold text-slate-800 text-[15px] mb-1">{edu.data.degree || 'Degree'}</h3>
                           <div className="text-[13px] font-bold text-slate-500">{edu.data.institution || 'Institution'}</div>
                           <div className="text-[12px] font-bold mt-2" style={{ color: cvData.primary_color }}>Class of {edu.data.year || 'YYYY'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {skills.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-[16px] font-bold uppercase tracking-widest mb-5 border-b-2 pb-2 text-slate-800" style={{ borderColor: cvData.primary_color }}>
                      Skills & Expertise
                    </h2>
                    <div className="flex flex-wrap gap-2.5">
                      {skills.map((skill, i) => (
                        <span key={i} className="text-[13px] text-white px-4 py-1.5 rounded-full font-bold shadow-sm" style={{ backgroundColor: cvData.primary_color }}>
                          {skill.data.name || 'Skill'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
