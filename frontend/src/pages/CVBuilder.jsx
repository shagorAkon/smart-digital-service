import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from '../lib/axios';

export default function CVBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const isFirstRender = useRef(true);
  const fileInputRef = useRef(null);

  const [cvData, setCvData] = useState({
    id: id || null,
    title: 'My Professional CV',
    full_name: user?.first_name + ' ' + user?.last_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    summary: '',
    template: 'minimal',
    primary_color: '#10b981',
    font_family: 'sans-serif',
    layout: '1-column',
    photo_path: '',
    items: []
  });

  const [availableTemplates, setAvailableTemplates] = useState([]);

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
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('Saving...');
    const timer = setTimeout(() => {
      saveCV(cvData);
    }, 1500);

    return () => clearTimeout(timer);
  }, [cvData]);

  const saveCV = async (dataToSave) => {
    try {
      if (dataToSave.id) {
        await axios.put(`/cvs/${dataToSave.id}`, dataToSave);
      } else {
        const response = await axios.post('/cvs', dataToSave);
        setCvData(prev => ({ ...prev, id: response.data.id }));
        window.history.replaceState(null, '', `/cv-builder/${response.data.id}`);
      }
      setSaveStatus('Saved');
    } catch (error) {
      console.error("Auto-save failed", error);
      setSaveStatus('Error saving');
    }
  };

  const handleChange = (e) => {
    setCvData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      setSaveStatus('Uploading photo...');
      // IMPORTANT: Update base URL logic if needed, assumes API is relative or configured in axios instance
      const response = await axios.post('/cvs/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCvData(prev => ({ ...prev, photo_path: response.data.photo_path }));
      setSaveStatus('Saved');
    } catch (error) {
      console.error('Photo upload failed', error);
      setSaveStatus('Error uploading');
      alert('Photo upload failed. Ensure the image is <2MB and valid.');
    }
  };

  // --- Dynamic Items Logic ---
  const addExperience = () => {
    setCvData(prev => ({ ...prev, items: [...prev.items, { type: 'experience', data: { jobTitle: '', company: '', startDate: '', endDate: '', description: '' }, order: prev.items.length }] }));
  };
  const addEducation = () => {
    setCvData(prev => ({ ...prev, items: [...prev.items, { type: 'education', data: { degree: '', institution: '', year: '' }, order: prev.items.length }] }));
  };
  const addSkill = () => {
    setCvData(prev => ({ ...prev, items: [...prev.items, { type: 'skill', data: { name: '', level: 'Intermediate' }, order: prev.items.length }] }));
  };

  const updateItemData = (index, field, value) => {
    setCvData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], data: { ...newItems[index].data, [field]: value } };
      return { ...prev, items: newItems };
    });
  };

  const removeItem = (index) => {
    setCvData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
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

  const experiences = cvData.items.filter(i => i.type === 'experience');
  const educations = cvData.items.filter(i => i.type === 'education');
  const skills = cvData.items.filter(i => i.type === 'skill');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      <nav className="glass border-b border-slate-700/50 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <Link to="/dashboard" className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-2 font-medium">← Back</Link>
           <div className="w-px h-6 bg-slate-700 mx-2"></div>
           <span className="font-bold text-lg text-white">Advanced CV Builder</span>
           <span className={`text-xs px-2 py-1 rounded-full ${saveStatus === 'Saved' ? 'bg-emerald-500/20 text-emerald-400' : saveStatus.includes('Error') ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
             {saveStatus}
           </span>
        </div>
        <div>
          <button 
            onClick={generatePDF}
            disabled={isGenerating}
            className={`bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-xl transition shadow-lg shadow-emerald-500/20 font-bold ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isGenerating ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 p-6 overflow-y-auto border-r border-slate-700/50 custom-scrollbar pb-32 space-y-8">
          <div className="max-w-2xl mx-auto space-y-8">
            
            {/* Design & Layout Customization */}
            <section className="glass p-6 rounded-2xl border border-slate-700/50">
               <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                 <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex justify-center items-center">✨</span> 
                 Design Settings
               </h3>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Template</label>
                    <select name="template" value={cvData.template} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500">
                      {availableTemplates.map(t => (
                         <option key={t.id} value={t.slug}>{t.name}</option>
                      ))}
                      {availableTemplates.length === 0 && <option value="minimal">Minimalist</option>}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Layout Style</label>
                    <select name="layout" value={cvData.layout} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500">
                      <option value="1-column">Single Column</option>
                      <option value="2-column">Double Column (Sidebar)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Font Family</label>
                    <select name="font_family" value={cvData.font_family} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500">
                      <option value="sans-serif">Modern Sans</option>
                      <option value="serif">Classic Serif</option>
                      <option value="monospace">Developer Mono</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" name="primary_color" value={cvData.primary_color} onChange={handleChange} className="w-10 h-10 rounded cursor-pointer bg-slate-900 border-0 outline-none" />
                      <input type="text" name="primary_color" value={cvData.primary_color} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500 font-mono text-xs uppercase" />
                    </div>
                  </div>
               </div>
            </section>

            {/* Personal Info with Photo Upload */}
            <section className="glass p-6 rounded-2xl border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-4">Personal Details</h3>
              
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-2xl bg-slate-800 border-2 border-dashed border-slate-600 flex flex-col justify-center items-center overflow-hidden relative group">
                    {cvData.photo_path ? (
                      <img src={`http://localhost:8080${cvData.photo_path}`} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-slate-400 text-sm">No Photo</span>
                    )}
                    <div className="absolute inset-0 bg-black/50 hidden group-hover:flex justify-center items-center transition cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <span className="text-white text-xs font-bold">Change</span>
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handlePhotoUpload} />
                  <button onClick={() => fileInputRef.current?.click()} className="mt-3 w-32 text-xs bg-slate-800 hover:bg-slate-700 text-white py-1.5 rounded-lg border border-slate-600">Upload Photo</button>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">CV Title <span className="italic">(for dashboard)</span></label>
                    <input type="text" name="title" value={cvData.title} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                      <input type="text" name="full_name" value={cvData.full_name} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Email</label>
                      <input type="email" name="email" value={cvData.email} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Phone</label>
                      <input type="text" name="phone" value={cvData.phone} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Location</label>
                      <input type="text" name="address" value={cvData.address} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Profile Summary */}
            <section className="glass p-6 rounded-2xl border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-4">Professional Summary</h3>
              <textarea name="summary" value={cvData.summary} onChange={handleChange} rows="4" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 resize-none" />
            </section>

            {/* Dynamic Experience */}
            <section className="glass p-6 rounded-2xl border border-slate-700/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Work Experience</h3>
                <button onClick={addExperience} className="text-sm bg-indigo-500 hover:bg-indigo-400 text-white px-3 py-1 rounded-lg transition">+ Add</button>
              </div>
              
              <div className="space-y-6">
                {cvData.items.map((item, index) => {
                  if (item.type !== 'experience') return null;
                  return (
                    <div key={index} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 relative group">
                      <button onClick={() => removeItem(index)} className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition">✕</button>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <input type="text" placeholder="Job Title" value={item.data.jobTitle || ''} onChange={(e) => updateItemData(index, 'jobTitle', e.target.value)} className="bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" />
                        <input type="text" placeholder="Company" value={item.data.company || ''} onChange={(e) => updateItemData(index, 'company', e.target.value)} className="bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" />
                        <input type="text" placeholder="Start Date" value={item.data.startDate || ''} onChange={(e) => updateItemData(index, 'startDate', e.target.value)} className="bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" />
                        <input type="text" placeholder="End Date" value={item.data.endDate || ''} onChange={(e) => updateItemData(index, 'endDate', e.target.value)} className="bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" />
                      </div>
                      <textarea placeholder="Description" value={item.data.description || ''} onChange={(e) => updateItemData(index, 'description', e.target.value)} rows="3" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 resize-none text-sm" />
                    </div>
                  );
                })}
              </div>
            </section>

             {/* Dynamic Education */}
             <section className="glass p-6 rounded-2xl border border-slate-700/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Education</h3>
                <button onClick={addEducation} className="text-sm bg-rose-500 hover:bg-rose-400 text-white px-3 py-1 rounded-lg transition">+ Add</button>
              </div>
              
              <div className="space-y-4">
                {cvData.items.map((item, index) => {
                  if (item.type !== 'education') return null;
                  return (
                    <div key={index} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 relative group grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button onClick={() => removeItem(index)} className="absolute top-2 right-2 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition">✕</button>
                      <input type="text" placeholder="Degree / Certificate" value={item.data.degree || ''} onChange={(e) => updateItemData(index, 'degree', e.target.value)} className="bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white outline-none focus:border-rose-500 text-sm" />
                      <input type="text" placeholder="Institution" value={item.data.institution || ''} onChange={(e) => updateItemData(index, 'institution', e.target.value)} className="bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white outline-none focus:border-rose-500 text-sm" />
                      <input type="text" placeholder="Year" value={item.data.year || ''} onChange={(e) => updateItemData(index, 'year', e.target.value)} className="bg-slate-900/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white outline-none focus:border-rose-500 text-sm" />
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Dynamic Skills */}
            <section className="glass p-6 rounded-2xl border border-slate-700/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Skills</h3>
                <button onClick={addSkill} className="text-sm bg-cyan-500 hover:bg-cyan-400 text-white px-3 py-1 rounded-lg transition">+ Add</button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {cvData.items.map((item, index) => {
                  if (item.type !== 'skill') return null;
                  return (
                    <div key={index} className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1">
                      <input type="text" placeholder="Skill" value={item.data.name || ''} onChange={(e) => updateItemData(index, 'name', e.target.value)} className="bg-transparent text-white outline-none w-24 text-sm" />
                      <button onClick={() => removeItem(index)} className="text-slate-500 hover:text-rose-400 font-bold">×</button>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>
        </div>

        {/* Right Side: Live HTML Preview */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10 bg-slate-800/50 overflow-y-auto flex justify-center items-start">
          
          <div className={`bg-white w-full max-w-[794px] min-h-[1123px] shadow-2xl p-0 text-slate-800 break-words transition-all duration-300 flex ${cvData.layout === '2-column' ? 'flex-row' : 'flex-col'}`} style={{ fontFamily: cvData.font_family }}>
            
            {/* Conditional Rendering based on layout selection */}
            {cvData.layout === '2-column' ? (
              <>
                {/* Sidebar (Left in 2-column) */}
                <div className="w-1/3 p-8 text-white h-full min-h-[1123px]" style={{ backgroundColor: cvData.primary_color }}>
                  {cvData.photo_path && (
                    <div className="flex justify-center mb-6">
                      <img src={`http://localhost:8080${cvData.photo_path}`} className="w-40 h-40 object-cover rounded-full border-4 border-white/20 shadow-xl" alt="Profile" />
                    </div>
                  )}
                  
                  <h1 className="text-2xl font-bold uppercase tracking-tight text-center mb-2">{cvData.full_name || 'YOUR NAME'}</h1>
                  
                  <div className="mt-6 flex flex-col gap-3 text-sm font-medium opacity-90">
                    <div className="h-0.5 w-12 bg-white/30 mb-2"></div>
                    {cvData.email && <div>{cvData.email}</div>}
                    {cvData.phone && <div>{cvData.phone}</div>}
                    {cvData.address && <div>{cvData.address}</div>}
                  </div>

                  {skills.length > 0 && (
                     <div className="mt-10">
                        <div className="h-0.5 w-12 bg-white/30 mb-4"></div>
                        <h2 className="text-lg font-bold uppercase tracking-wider mb-4">Skills</h2>
                        <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
                          {skills.map((skill, i) => (
                            <li key={i}>{skill.data.name || 'Skill'}</li>
                          ))}
                        </ul>
                     </div>
                  )}
                </div>

                {/* Main Content (Right in 2-column) */}
                <div className="w-2/3 p-8">
                  {cvData.summary && (
                    <div className="mb-8">
                      <h2 className="text-lg font-bold uppercase tracking-wider mb-2 border-b-2 pb-1" style={{ borderColor: cvData.primary_color, color: cvData.primary_color }}>Profile</h2>
                      <p className="text-sm leading-relaxed whitespace-pre-line text-slate-700">{cvData.summary}</p>
                    </div>
                  )}

                  {experiences.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b-2 pb-1" style={{ borderColor: cvData.primary_color, color: cvData.primary_color }}>Experience</h2>
                      <div className="space-y-6">
                        {experiences.map((exp, i) => (
                          <div key={i}>
                            <div className="flex justify-between items-baseline mb-1">
                              <h3 className="font-bold text-slate-800">{exp.data.jobTitle || 'Job Title'}</h3>
                              <span className="text-xs font-medium text-slate-500">{exp.data.startDate} {exp.data.endDate ? `- ${exp.data.endDate}` : ''}</span>
                            </div>
                            <div className="text-sm font-semibold text-slate-600 mb-2">{exp.data.company || 'Company Name'}</div>
                            <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{exp.data.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {educations.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b-2 pb-1" style={{ borderColor: cvData.primary_color, color: cvData.primary_color }}>Education</h2>
                      <div className="space-y-4">
                        {educations.map((edu, i) => (
                          <div key={i} className="flex justify-between items-baseline">
                            <div>
                              <h3 className="font-bold text-slate-800">{edu.data.degree || 'Degree'}</h3>
                              <div className="text-sm text-slate-600">{edu.data.institution || 'Institution'}</div>
                            </div>
                            <span className="text-xs font-medium text-slate-500">{edu.data.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // 1 Column Default Layout
              <div className="p-12 w-full">
                {/* Header */}
                <div className="border-b-4 pb-8 mb-8 flex items-center gap-8" style={{ borderColor: cvData.primary_color }}>
                  {cvData.photo_path && (
                    <img src={`http://localhost:8080${cvData.photo_path}`} className="w-32 h-32 object-cover rounded-xl shadow-lg border-2 border-slate-200" alt="Profile" />
                  )}
                  <div>
                    <h1 className="text-5xl font-bold uppercase tracking-tight" style={{ color: cvData.primary_color }}>
                      {cvData.full_name || 'YOUR NAME'}
                    </h1>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-slate-500">
                      {cvData.email && <span>{cvData.email}</span>}
                      {cvData.phone && <span>• {cvData.phone}</span>}
                      {cvData.address && <span>• {cvData.address}</span>}
                    </div>
                  </div>
                </div>

                {/* Summary */}
                {cvData.summary && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold uppercase tracking-wider mb-2 border-b-2 pb-1 text-slate-800" style={{ borderColor: cvData.primary_color }}>
                      Professional Summary
                    </h2>
                    <p className="text-sm leading-relaxed whitespace-pre-line text-slate-700">{cvData.summary}</p>
                  </div>
                )}

                {/* Experience */}
                {experiences.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b-2 pb-1 text-slate-800" style={{ borderColor: cvData.primary_color }}>
                      Experience
                    </h2>
                    <div className="space-y-6">
                      {experiences.map((exp, i) => (
                        <div key={i}>
                          <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-bold text-slate-800 text-lg">{exp.data.jobTitle || 'Job Title'}</h3>
                            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{exp.data.startDate} {exp.data.endDate ? `- ${exp.data.endDate}` : ''}</span>
                          </div>
                          <div className="text-sm font-semibold mb-2" style={{ color: cvData.primary_color }}>{exp.data.company || 'Company Name'}</div>
                          <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{exp.data.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {educations.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b-2 pb-1 text-slate-800" style={{ borderColor: cvData.primary_color }}>
                      Education
                    </h2>
                    <div className="space-y-4">
                      {educations.map((edu, i) => (
                        <div key={i} className="flex justify-between items-baseline">
                          <div>
                            <h3 className="font-bold text-slate-800">{edu.data.degree || 'Degree'}</h3>
                            <div className="text-sm font-medium" style={{ color: cvData.primary_color }}>{edu.data.institution || 'Institution'}</div>
                          </div>
                          <span className="text-sm font-medium text-slate-500">{edu.data.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b-2 pb-1 text-slate-800" style={{ borderColor: cvData.primary_color }}>
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, i) => (
                        <span key={i} className="text-sm text-white px-3 py-1.5 rounded-md font-medium shadow-sm" style={{ backgroundColor: cvData.primary_color }}>
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
