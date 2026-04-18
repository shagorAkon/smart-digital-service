import React from 'react';

export default function ModernTemplate({ cvData }) {
  const { experiences = [], educations = [], skills = [], projects = [], certifications = [], languages = [], interests = [], social_links = [] } = cvData;
  const primaryColor = cvData.primary_color || '#2563eb';

  return (
    <div className="bg-white w-full max-w-[850px] min-h-[1150px] shadow-2xl flex flex-row overflow-hidden relative" style={{ fontFamily: cvData.font_family || 'Inter, sans-serif' }}>
      
      {/* Left Sidebar */}
      <div className="w-[35%] text-slate-100 flex flex-col pt-12 pb-12" style={{ backgroundColor: primaryColor }}>
        {/* Profile Photo */}
        {cvData.photo_path && (
          <div className="flex justify-center mb-8 px-8">
            <img 
              src={`http://localhost:8080${cvData.photo_path}`} 
              className="w-40 h-40 object-cover rounded-full border-[4px] border-white/20 shadow-xl" 
              alt="Profile" 
            />
          </div>
        )}

        {/* Contact info */}
        <div className="px-8 mt-4 space-y-4 text-[13px] font-medium tracking-wide">
          <div className="w-8 h-[2px] bg-white/40 mb-4 tracking-widest"></div>
          
          <h3 className="uppercase font-bold tracking-widest mb-2 text-[11px] text-white/50">Details</h3>
          {cvData.address && <div className="leading-relaxed">📍 {cvData.address}</div>}
          {cvData.phone && <div>📞 {cvData.phone}</div>}
          {cvData.email && <div className="break-all">✉️ {cvData.email}</div>}
        </div>

        {/* Social Links */}
        {social_links.length > 0 && (
          <div className="px-8 mt-10 space-y-3 text-[13px]">
            <h3 className="uppercase font-bold tracking-widest mb-3 text-[11px] text-white/50">Links</h3>
            {social_links.map((link, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="font-bold">{link.platform}</span>
                <a href={link.url} target="_blank" rel="noreferrer" className="text-white/80 break-all underline decoration-white/30 truncate">{link.url}</a>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="px-8 mt-10">
            <h3 className="uppercase font-bold tracking-widest mb-3 text-[11px] text-white/50">Skills</h3>
            <ul className="flex flex-col gap-2 text-[13px] font-semibold tracking-wide">
              {skills.map((skill, i) => (
                <li key={i} className="flex justify-between items-center border-b border-white/10 pb-1.5">
                  {skill.name}
                  {skill.level && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{skill.level}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="px-8 mt-10">
            <h3 className="uppercase font-bold tracking-widest mb-3 text-[11px] text-white/50">Languages</h3>
            <ul className="flex flex-col gap-2 text-[13px] tracking-wide">
              {languages.map((lang, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span className="font-bold">{lang.name}</span>
                  {lang.proficiency && <span className="text-white/70 italic text-[11px]">{lang.proficiency}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <div className="px-8 mt-10">
            <h3 className="uppercase font-bold tracking-widest mb-3 text-[11px] text-white/50">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, i) => (
                <span key={i} className="text-[12px] bg-white/10 px-3 py-1 rounded-lg border border-white/5 font-medium">
                  {interest.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="w-[65%] bg-slate-50 p-12 text-slate-800 flex flex-col">
        {/* Header Block */}
        <div className="border-b-[3px] pb-6 mb-8" style={{ borderColor: primaryColor }}>
          <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 leading-none mb-3">
            {cvData.full_name || 'Your Name'}
          </h1>
          <h2 className="text-lg font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
            {cvData.title || 'Professional Title'}
          </h2>
        </div>

        {/* Profile Summary */}
        {cvData.summary && (
          <div className="mb-10 group">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest mb-3 text-slate-900">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              Profile
            </h3>
            <p className="text-[14px] leading-relaxed text-slate-600 text-justify">
              {cvData.summary}
            </p>
          </div>
        )}

        {/* Career Objective */}
        {cvData.career_objective && (
          <div className="mb-10 group bg-slate-100 p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest mb-3 text-slate-900">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              Objective
            </h3>
            <p className="text-[14px] leading-relaxed text-slate-600">
              {cvData.career_objective}
            </p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mb-10 relative">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest mb-5 text-slate-900">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              Employment History
            </h3>
            <div className="space-y-6 relative border-l-2 ml-1" style={{ borderColor: primaryColor + '40' }}>
              {experiences.map((exp, i) => (
                <div key={i} className="pl-6 relative">
                  <div className="absolute w-3 h-3 rounded-full border-2 border-white -left-[7px] top-1.5" style={{ backgroundColor: primaryColor }}></div>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-bold text-[15px] text-slate-900">{exp.position || exp.jobTitle}</h4>
                  </div>
                  <div className="text-[13px] font-bold tracking-wide mb-2 flex items-center gap-2">
                     <span style={{ color: primaryColor }}>{exp.company}</span>
                     <span className="text-slate-300">•</span>
                     <span className="text-slate-500 uppercase text-[11px]">
                         {exp.start_date || exp.startDate} – {exp.current ? 'Present' : (exp.end_date || exp.endDate)}
                     </span>
                  </div>
                  <p className="text-[13px] text-slate-600 leading-relaxed text-justify whitespace-pre-line mt-2">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {educations.length > 0 && (
          <div className="mb-10">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest mb-5 text-slate-900">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              Education
            </h3>
            <div className="space-y-5">
              {educations.map((edu, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 border-t-4" style={{ borderTopColor: primaryColor }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-[14px] text-slate-900 leading-tight mb-1">{edu.degree}</h4>
                      <div className="text-[13px] font-semibold text-slate-500">{edu.institution}</div>
                    </div>
                    <div className="text-[11px] font-bold tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">
                       {edu.start_date || edu.startDate} – {edu.end_date || edu.endDate || edu.year}
                    </div>
                  </div>
                  {edu.description && (
                     <p className="text-[12px] text-slate-500 mt-3 pt-3 border-t border-slate-100">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-10">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest mb-5 text-slate-900">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              Projects
            </h3>
            <div className="grid grid-cols-2 gap-4">
               {projects.map((proj, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                     {proj.link && (
                         <a href={proj.link} target="_blank" rel="noreferrer" className="absolute top-3 right-3 text-slate-300 hover:text-slate-600 transition">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                         </a>
                     )}
                     <h4 className="font-bold text-[14px] text-slate-900 mb-2 truncate pr-6">{proj.title}</h4>
                     <p className="text-[12px] text-slate-500 line-clamp-3 leading-relaxed">{proj.description}</p>
                  </div>
               ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="mb-10">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest mb-5 text-slate-900">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              Certifications
            </h3>
            <div className="space-y-3">
              {certifications.map((cert, i) => (
                <div key={i} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: primaryColor + '10' }}>
                    <svg className="w-5 h-5" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[14px] text-slate-900">{cert.name}</h4>
                    {cert.issuer && <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{cert.issuer}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
