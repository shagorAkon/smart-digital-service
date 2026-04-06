import React from 'react';

export default function ElegantTemplate({ cvData }) {
  const { experiences = [], educations = [], skills = [], projects = [], certifications = [], languages = [], social_links = [] } = cvData;
  const primaryColor = cvData.primary_color || '#0ea5e9'; // A nice freepik cyan/blue default

  return (
    <div className="bg-slate-50 w-full max-w-[850px] min-h-[1150px] shadow-2xl flex font-sans relative overflow-hidden" style={{ fontFamily: cvData.font_family || 'Montserrat, sans-serif' }}>
      
      {/* Background Vector Shapes */}
      <div className="absolute top-[-100px] right-[-50px] w-[500px] h-[300px] rounded-[100px] rotate-[-20deg] opacity-10" style={{ backgroundColor: primaryColor }}></div>
      <div className="absolute bottom-[-150px] left-[-150px] w-[400px] h-[400px] rounded-full opacity-10" style={{ backgroundColor: primaryColor }}></div>

      {/* Sidebar - Dark theme typical of vector designs */}
      <div className="w-[38%] py-12 text-slate-100 flex flex-col items-center relative z-10" style={{ backgroundColor: '#1e293b' }}>
        
        {/* Photo with colored border */}
        <div className="mb-6 relative">
          <div className="absolute inset-[-5px] rounded-full" style={{ backgroundColor: primaryColor }}></div>
          {cvData.photo_path ? (
              <img 
                src={`http://localhost:8080${cvData.photo_path}`} 
                className="w-36 h-36 object-cover rounded-full relative z-10 border-4 border-[#1e293b]" 
                alt="Profile" 
              />
          ) : (
              <div className="w-36 h-36 rounded-full relative z-10 border-4 border-[#1e293b] bg-slate-700 flex items-center justify-center">
                 <span className="text-slate-400">Photo</span>
              </div>
          )}
        </div>

        {/* Contact Block */}
        <div className="w-full px-8 mb-10">
           <h3 className="uppercase font-black tracking-widest text-[16px] mb-5 border-b-[3px] inline-block pb-1" style={{ borderColor: primaryColor }}>Contact</h3>
           <div className="space-y-4 text-[13px] font-medium tracking-wide">
             {cvData.phone && (
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>☎</div>
                   <div>{cvData.phone}</div>
                </div>
             )}
             {cvData.email && (
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full flex items-center justify-center text-white break-all" style={{ backgroundColor: primaryColor }}>✉</div>
                   <div className="break-all">{cvData.email}</div>
                </div>
             )}
             {cvData.address && (
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>📍</div>
                   <div>{cvData.address}</div>
                </div>
             )}
           </div>
        </div>

        {/* Skills with Progress Bars */}
        {skills.length > 0 && (
           <div className="w-full px-8 mb-10">
              <h3 className="uppercase font-black tracking-widest text-[16px] mb-5 border-b-[3px] inline-block pb-1" style={{ borderColor: primaryColor }}>Skills</h3>
              <div className="space-y-4">
                 {skills.map((skill, i) => (
                    <div key={i}>
                       <div className="flex justify-between text-[12px] font-bold tracking-wider mb-1 uppercase">
                          <span>{skill.name}</span>
                          <span style={{ color: primaryColor }}>{skill.level || 'Pro'}</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          {/* Fake progress bar width based on name length for visual flair */}
                          <div className="h-full rounded-full" style={{ backgroundColor: primaryColor, width: `${Math.min(100, Math.max(40, skill.name.length * 8))}%` }}></div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* Languages with Dots */}
        {languages.length > 0 && (
           <div className="w-full px-8 mb-10">
              <h3 className="uppercase font-black tracking-widest text-[16px] mb-5 border-b-[3px] inline-block pb-1" style={{ borderColor: primaryColor }}>Languages</h3>
              <div className="space-y-3">
                 {languages.map((lang, i) => (
                    <div key={i} className="flex justify-between items-center text-[13px] font-bold tracking-wider">
                       <span>{lang.name}</span>
                       <span className="text-[11px] opacity-70 italic">{lang.proficiency}</span>
                    </div>
                 ))}
              </div>
           </div>
        )}

      </div>

      {/* Main Content */}
      <div className="w-[62%] py-12 px-10 relative z-10 text-slate-800">
        
        {/* Name and Title Vector Banner */}
        <div className="mb-10 relative">
           <div className="absolute -left-10 w-2 h-full" style={{ backgroundColor: primaryColor }}></div>
           <h1 className="text-[46px] font-black uppercase tracking-tighter leading-[1.1] text-slate-900 mb-2">
             {cvData.full_name || 'YOUR NAME'}
           </h1>
           <h2 className="text-xl font-bold tracking-[0.2em] uppercase" style={{ color: primaryColor }}>
             {cvData.title || 'Professional Title'}
           </h2>
        </div>

        {/* Profile */}
        {cvData.summary && (
           <div className="mb-10">
              <h3 className="text-2xl font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>👤</span> 
                Profile
              </h3>
              <p className="text-[14px] leading-relaxed text-slate-600 font-medium text-justify">
                {cvData.summary}
              </p>
           </div>
        )}

        {/* Experience - Vector Timeline */}
        {experiences.length > 0 && (
           <div className="mb-10">
              <h3 className="text-2xl font-black uppercase tracking-wider text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>💼</span> 
                Experience
              </h3>
              <div className="relative border-l-2 ml-5" style={{ borderColor: primaryColor }}>
                 {experiences.map((exp, i) => (
                    <div key={i} className="pl-8 pb-8 relative group">
                       {/* Timeline Dot */}
                       <div className="absolute w-5 h-5 rounded-full border-4 border-white -left-[11px] top-1" style={{ backgroundColor: primaryColor }}></div>
                       
                       <div className="flex justify-between items-start mb-1">
                          <h4 className="text-[16px] font-black uppercase tracking-wide text-slate-900">{exp.position || exp.jobTitle}</h4>
                       </div>
                       <div className="text-[13px] font-bold text-slate-500 mb-2 tracking-wider flex items-center gap-2">
                          <span style={{ color: primaryColor }}>{exp.company}</span>
                          <span className="text-slate-300">|</span>
                          <span>{exp.start_date || exp.startDate} - {exp.current ? 'Present' : (exp.end_date || exp.endDate)}</span>
                       </div>
                       <p className="text-[13px] text-slate-600 font-medium text-justify leading-relaxed whitespace-pre-line">
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
              <h3 className="text-2xl font-black uppercase tracking-wider text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>🎓</span> 
                Education
              </h3>
              <div className="space-y-5 ml-2">
                 {educations.map((edu, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                       <div className="absolute top-0 left-0 w-1 h-full transition-all" style={{ backgroundColor: primaryColor }}></div>
                       <h4 className="text-[15px] font-black text-slate-900 uppercase tracking-widest">{edu.degree}</h4>
                       <div className="text-[13px] font-bold text-slate-500 my-1">{edu.institution}</div>
                       <div className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded text-white mt-1" style={{ backgroundColor: primaryColor }}>
                          {edu.start_date || edu.startDate} - {edu.end_date || edu.endDate || edu.year}
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
