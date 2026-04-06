import React from 'react';

// Sub-components could be abstracted, but defining here for module portability
const HeaderVariants = {
  modern_split: ({ cvData, config }) => (
    <div className="flex justify-between items-center pb-6 mb-6 border-b-2" style={{ borderColor: config.theme_color }}>
      <div>
        <h1 className="text-4xl font-black uppercase" style={{ color: config.theme_color }}>{cvData.full_name || 'Your Name'}</h1>
        <h2 className="text-xl text-slate-500 uppercase tracking-widest mt-1">{cvData.title || 'Professional Title'}</h2>
      </div>
      <div className="text-right text-[12px] space-y-1 text-slate-600 font-medium">
        <div>{cvData.email}</div>
        <div>{cvData.phone}</div>
        <div>{cvData.address}</div>
      </div>
    </div>
  ),
  banner_overlap: ({ cvData, config }) => (
    <div className="relative pt-12 pb-8 mb-10 px-10 text-white shadow-md rounded-b-3xl" style={{ backgroundColor: config.theme_color }}>
      <h1 className="text-5xl font-black uppercase tracking-tight">{cvData.full_name || 'Your Name'}</h1>
      <h2 className="text-lg uppercase tracking-[0.2em] opacity-90 mt-2">{cvData.title || 'Professional Title'}</h2>
      <div className="flex gap-6 text-[12px] mt-4 font-medium opacity-80 uppercase tracking-widest">
        <span>{cvData.email}</span>
        <span>{cvData.phone}</span>
        <span>{cvData.address}</span>
      </div>
    </div>
  ),
  classic: ({ cvData, config }) => (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-serif font-bold uppercase text-slate-900 border-b-4 inline-block pb-2 px-10" style={{ borderColor: config.theme_color }}>
         {cvData.full_name || 'Your Name'}
      </h1>
      <div className="text-sm font-serif italic text-slate-600 mt-3 space-x-3">
         <span>{cvData.email}</span> • <span>{cvData.phone}</span> • <span>{cvData.address}</span>
      </div>
    </div>
  ),
  floating: ({ cvData, config }) => (
    <div className="bg-slate-100 p-8 rounded-2xl mb-8 flex items-center shadow-sm border border-slate-200">
      {cvData.photo_path && <img src={`http://localhost:8080${cvData.photo_path}`} className="w-24 h-24 rounded-full mr-6 border-4" style={{ borderColor: config.theme_color }} alt="profile"/>}
      <div>
         <h1 className="text-3xl font-bold text-slate-800">{cvData.full_name || 'Your Name'}</h1>
         <h2 className="text-slate-500 font-medium uppercase tracking-wider">{cvData.title || 'Professional Title'}</h2>
      </div>
    </div>
  ),
  side_header: ({ cvData, config }) => (
     <div className="text-right border-r-4 pr-6 mb-8" style={{ borderColor: config.theme_color }}>
        <h1 className="text-5xl font-black text-slate-800">{cvData.full_name || 'Your Name'}</h1>
        <div className="text-slate-500 mt-2">{cvData.email} | {cvData.phone}</div>
     </div>
  )
};

const ExperienceVariants = {
  timeline: ({ exp, config }) => (
    <div className="relative pl-6 pb-6 border-l-2 last:pb-0" style={{ borderColor: config.theme_color }}>
       <div className="absolute w-4 h-4 rounded-full -left-[9px] top-1 border-4 border-white" style={{ backgroundColor: config.theme_color }}></div>
       <div className="text-[12px] font-bold text-slate-400 mb-1">{exp.start_date || exp.startDate} - {exp.current ? 'Present' : (exp.end_date || exp.endDate)}</div>
       <h4 className="text-[15px] font-bold text-slate-900">{exp.position || exp.jobTitle}</h4>
       <h5 className="text-[13px] font-bold mb-2" style={{ color: config.theme_color }}>{exp.company}</h5>
       <p className="text-[13px] text-slate-600 leading-relaxed font-medium">{exp.description}</p>
    </div>
  ),
  block: ({ exp, config }) => (
    <div className="bg-slate-50 p-4 rounded-lg mb-4 border-l-4" style={{ borderColor: config.theme_color }}>
      <div className="flex justify-between items-start mb-1">
         <h4 className="font-bold text-[15px]">{exp.position || exp.jobTitle}</h4>
         <span className="text-[11px] bg-slate-200 px-2 py-1 rounded">{exp.start_date || exp.startDate} - {exp.current ? 'Present' : (exp.end_date || exp.endDate)}</span>
      </div>
      <h5 className="text-[13px] text-slate-500 mb-2 italic">{exp.company}</h5>
      <p className="text-[13px] text-slate-700 whitespace-pre-line">{exp.description}</p>
    </div>
  ),
  minimal: ({ exp, config }) => (
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-0.5">
         <strong className="text-[14px] uppercase tracking-wide text-slate-900">{exp.position || exp.jobTitle} <span className="text-slate-400 font-normal ml-2">@ {exp.company}</span></strong>
         <span className="text-[12px] font-bold text-slate-500">{exp.start_date || exp.startDate} to {exp.current ? 'Present' : (exp.end_date || exp.endDate)}</span>
      </div>
      <p className="text-[13px] text-slate-700 mt-1">{exp.description}</p>
    </div>
  ),
  bulleted: ({ exp, config }) => (
     <div className="mb-4">
        <h4 className="font-bold text-[14px] text-slate-800 flex items-center gap-2">
           <span className="text-lg" style={{ color: config.theme_color }}>•</span> {exp.position || exp.jobTitle} | {exp.company}
        </h4>
        <div className="text-[11px] text-slate-400 mb-2 ml-5">{exp.start_date || exp.startDate} - {exp.current ? 'Present' : (exp.end_date || exp.endDate)}</div>
        <div className="text-[12px] text-slate-600 ml-5">{exp.description}</div>
     </div>
  )
};

export default function TemplateEngine({ cvData, config }) {
  // Config defaults if missing
  const cfg = {
    layout: 'single_column',
    header_style: 'classic',
    experience_style: 'minimal',
    theme_color: '#334155',
    font_family: 'Arial, sans-serif',
    show_icons: false,
    ...config
  };

  const { experiences = [], educations = [], skills = [], projects = [] } = cvData;

  const HeaderComp = HeaderVariants[cfg.header_style] || HeaderVariants.classic;
  const ExpComp = ExperienceVariants[cfg.experience_style] || ExperienceVariants.minimal;

  // Generic renderers for repeated lists
  const renderSidebarElements = () => (
    <div className="space-y-8">
      {skills.length > 0 && (
         <div>
            <h3 className="uppercase text-[14px] font-bold tracking-widest mb-4 border-b-2 inline-block pb-1" style={{ borderColor: cfg.theme_color, color: cfg.layout.includes('two_column') ? 'white' : cfg.theme_color }}>SKILLS</h3>
            <div className="flex flex-col gap-2">
               {skills.map((s, i) => (
                  <div key={i} className="text-[12px] flex justify-between uppercase">
                     <span>{s.name}</span>
                     {s.level && <span className="opacity-50 font-medium">{s.level}</span>}
                  </div>
               ))}
            </div>
         </div>
      )}
      {educations.length > 0 && (
         <div>
            <h3 className="uppercase text-[14px] font-bold tracking-widest mb-4 border-b-2 inline-block pb-1" style={{ borderColor: cfg.theme_color, color: cfg.layout.includes('two_column') ? 'white' : cfg.theme_color }}>EDUCATION</h3>
            <div className="space-y-4">
               {educations.map((e, i) => (
                  <div key={i}>
                     <h4 className="font-bold text-[13px] leading-tight">{e.degree}</h4>
                     <div className="text-[12px] opacity-80 my-1">{e.institution}</div>
                     <div className="text-[10px] uppercase font-bold tracking-wider" style={{ color: cfg.theme_color }}>{e.start_date || e.startDate} - {e.end_date || e.endDate || e.year}</div>
                  </div>
               ))}
            </div>
         </div>
      )}
    </div>
  );

  const renderMainElements = () => (
    <div>
      {cvData.summary && (
         <div className="mb-10">
            <h3 className="uppercase text-[16px] font-black tracking-widest text-slate-800 mb-4 border-l-4 pl-3" style={{ borderColor: cfg.theme_color }}>Profile</h3>
            <p className="text-[13px] text-slate-700 leading-relaxed text-justify">{cvData.summary}</p>
         </div>
      )}

      {experiences.length > 0 && (
         <div className="mb-10">
            <h3 className="uppercase text-[16px] font-black tracking-widest text-slate-800 mb-6 border-l-4 pl-3" style={{ borderColor: cfg.theme_color }}>Experience</h3>
            <div>
               {experiences.map((exp, i) => <ExpComp key={i} exp={exp} config={cfg} />)}
            </div>
         </div>
      )}

      {projects.length > 0 && (
         <div className="mb-10">
            <h3 className="uppercase text-[16px] font-black tracking-widest text-slate-800 mb-6 border-l-4 pl-3" style={{ borderColor: cfg.theme_color }}>Projects</h3>
            <div className="grid grid-cols-2 gap-4">
               {projects.map((p, i) => (
                  <div key={i} className="border border-slate-200 p-4 rounded shadow-sm hover:shadow-md transition">
                     <h4 className="font-bold text-[14px]">{p.title}</h4>
                     {p.link && <a href={p.link} className="text-[11px] text-blue-500 break-all">{p.link}</a>}
                     <p className="text-[12px] text-slate-600 mt-2">{p.description}</p>
                  </div>
               ))}
            </div>
         </div>
      )}
    </div>
  );

  // Layout Engine Matcher
  if (cfg.layout === 'two_column_left') {
     return (
        <div className="bg-white w-full max-w-[850px] min-h-[1150px] shadow-2xl flex font-sans" style={{ fontFamily: cfg.font_family }}>
           <div className="w-[35%] py-12 px-8 text-white flex flex-col" style={{ backgroundColor: '#1e293b' }}>
              <div className="mb-12">
                 <h1 className="text-3xl font-black uppercase mb-1">{cvData.full_name || 'Your Name'}</h1>
                 <h2 className="text-sm uppercase tracking-widest" style={{ color: cfg.theme_color }}>{cvData.title || 'Professional Title'}</h2>
                 <div className="mt-6 text-[12px] space-y-2 font-medium opacity-80">
                    <div>{cvData.email}</div>
                    <div>{cvData.phone}</div>
                    <div>{cvData.address}</div>
                 </div>
              </div>
              {renderSidebarElements()}
           </div>
           <div className="w-[65%] py-12 px-10 shrink-0">
              {cfg.header_style !== 'none' && <HeaderComp cvData={cvData} config={{...cfg, theme_color: 'transparent'}} />}
              {renderMainElements()}
           </div>
        </div>
     );
  }

  if (cfg.layout === 'two_column_right') {
     return (
        <div className="bg-slate-50 w-full max-w-[850px] min-h-[1150px] shadow-2xl flex flex-row-reverse font-sans" style={{ fontFamily: cfg.font_family }}>
           <div className="w-[30%] py-12 px-8 bg-slate-200 text-slate-800 border-l border-slate-300">
              <div className="mb-10 text-right">
                  <h1 className="text-2xl font-bold uppercase" style={{ color: cfg.theme_color }}>{cvData.full_name || 'Name'}</h1>
                  <h2 className="text-xs uppercase mt-1 text-slate-500">{cvData.title}</h2>
              </div>
              {renderSidebarElements()}
           </div>
           <div className="w-[70%] py-12 px-10">
              <HeaderComp cvData={cvData} config={cfg} />
              {renderMainElements()}
           </div>
        </div>
     );
  }

  // default single_column
  return (
     <div className="bg-white w-full max-w-[850px] min-h-[1150px] shadow-2xl py-14 px-16 font-sans" style={{ fontFamily: cfg.font_family }}>
        <HeaderComp cvData={cvData} config={cfg} />
        {renderMainElements()}
        <div className="mt-10">
           {renderSidebarElements()}
        </div>
     </div>
  );
}
