import React from 'react';

export default function CreativeTemplate({ cvData }) {
  const { experiences = [], educations = [], skills = [], projects = [], certifications = [], languages = [], social_links = [] } = cvData;
  const primaryColor = cvData.primary_color || '#db2777';

  return (
    <div className="bg-white w-full max-w-[850px] min-h-[1150px] shadow-2xl flex flex-col relative" style={{ fontFamily: cvData.font_family || 'Poppins, sans-serif' }}>
      
      {/* Top Banner */}
      <div className="h-48 w-full relative flex items-end px-12 pb-8" style={{ backgroundColor: primaryColor }}>
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-black/20"></div>

        <div className="relative z-10 text-white w-full pr-40">
           <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 drop-shadow-md">
             {cvData.full_name || 'Your Name'}
           </h1>
           <h2 className="text-xl font-bold tracking-widest opacity-90 uppercase">
             {cvData.title || 'Professional Title'}
           </h2>
        </div>
        
        {cvData.photo_path && (
          <img 
            src={`http://localhost:8080${cvData.photo_path}`} 
            className="w-32 h-32 object-cover rounded-full absolute right-12 -bottom-16 border-[6px] border-white shadow-xl" 
            alt="Profile" 
          />
        )}
      </div>

      <div className="flex flex-1 mt-6">
        {/* Left Column (Main Content) */}
        <div className="w-[65%] pl-12 pr-8 py-8 text-slate-800">
           {cvData.summary && (
              <div className="mb-10">
                 <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                    <span className="w-8 h-[3px]" style={{ backgroundColor: primaryColor }}></span>
                    PROFILE
                 </h3>
                 <p className="text-[14px] leading-relaxed text-slate-600 font-medium">{cvData.summary}</p>
              </div>
           )}

           {experiences.length > 0 && (
              <div className="mb-10">
                 <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <span className="w-8 h-[3px]" style={{ backgroundColor: primaryColor }}></span>
                    EXPERIENCE
                 </h3>
                 <div className="space-y-8">
                    {experiences.map((exp, i) => (
                       <div key={i} className="relative pl-6 border-l-2 border-slate-200">
                          <div className="absolute w-4 h-4 rounded-full -left-[9px] top-1 border-4 border-white" style={{ backgroundColor: primaryColor }}></div>
                          <div className="text-[12px] font-bold text-slate-400 mb-1 tracking-wider">
                             {exp.start_date || exp.startDate} - {exp.current ? 'Present' : (exp.end_date || exp.endDate)}
                          </div>
                          <h4 className="text-[16px] font-bold text-slate-900 leading-tight">{exp.position || exp.jobTitle}</h4>
                          <h5 className="text-[14px] font-bold mb-3" style={{ color: primaryColor }}>{exp.company}</h5>
                          <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                             {exp.description}
                          </p>
                       </div>
                    ))}
                 </div>
              </div>
           )}

           {projects.length > 0 && (
              <div className="mb-10">
                 <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <span className="w-8 h-[3px]" style={{ backgroundColor: primaryColor }}></span>
                    PROJECTS
                 </h3>
                 <div className="grid grid-cols-1 gap-6">
                    {projects.map((proj, i) => (
                       <div key={i} className="bg-slate-50 p-5 rounded-tr-3xl rounded-bl-3xl border border-slate-100">
                          <h4 className="font-bold text-[15px] text-slate-900 mb-1">{proj.title}</h4>
                          {proj.link && <a href={proj.link} className="text-[12px] text-blue-500 mb-2 block">{proj.link}</a>}
                          <p className="text-[13px] text-slate-600 leading-relaxed font-medium">{proj.description}</p>
                       </div>
                    ))}
                 </div>
              </div>
           )}
        </div>

        {/* Right Column (Sidebar) */}
        <div className="w-[35%] bg-slate-50 border-l border-slate-200 px-8 py-8 pt-20 flex flex-col gap-10">
           
           <div>
              <h3 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-widest border-b-2 pb-2 inline-block" style={{ borderColor: primaryColor }}>Contact</h3>
              <ul className="text-[13px] font-medium text-slate-600 space-y-4">
                 {cvData.phone && <li className="flex items-center gap-3"><span className="text-lg">📱</span>{cvData.phone}</li>}
                 {cvData.email && <li className="flex items-center gap-3 break-all"><span className="text-lg">📧</span>{cvData.email}</li>}
                 {cvData.address && <li className="flex items-center gap-3"><span className="text-lg">📍</span>{cvData.address}</li>}
              </ul>
           </div>

           {skills.length > 0 && (
              <div>
                 <h3 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-widest border-b-2 pb-2 inline-block" style={{ borderColor: primaryColor }}>Skills</h3>
                 <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                       <span key={i} className="text-[12px] font-bold text-white px-3 py-1.5 rounded-br-xl rounded-tl-xl shadow-sm" style={{ backgroundColor: primaryColor }}>
                          {skill.name} {skill.level && <span className="opacity-80">({skill.level})</span>}
                       </span>
                    ))}
                 </div>
              </div>
           )}

           {educations.length > 0 && (
              <div>
                 <h3 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-widest border-b-2 pb-2 inline-block" style={{ borderColor: primaryColor }}>Education</h3>
                 <div className="space-y-5">
                    {educations.map((edu, i) => (
                       <div key={i} className="relative">
                          <h4 className="font-bold text-[14px] text-slate-900 leading-tight mb-1">{edu.degree}</h4>
                          <div className="text-[13px] text-slate-600 font-bold mb-1">{edu.institution}</div>
                          <div className="text-[11px] font-bold text-slate-400 tracking-wider">
                             {edu.start_date || edu.startDate} - {edu.end_date || edu.endDate || edu.year}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           )}

           {social_links.length > 0 && (
              <div>
                 <h3 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-widest border-b-2 pb-2 inline-block" style={{ borderColor: primaryColor }}>Socials</h3>
                 <div className="space-y-3">
                    {social_links.map((link, i) => (
                       <a key={i} href={link.url} target="_blank" rel="noreferrer" className="block text-[13px] font-bold text-slate-600 hover:text-slate-900 break-all underline decoration-slate-300">
                          {link.platform}
                       </a>
                    ))}
                 </div>
              </div>
           )}

        </div>
      </div>
    </div>
  );
}
