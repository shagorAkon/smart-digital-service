import React from 'react';

export default function CorporateTemplate({ cvData }) {
  const { experiences = [], educations = [], skills = [], projects = [], certifications = [], languages = [], social_links = [] } = cvData;
  const primaryColor = cvData.primary_color || '#1e293b'; // Slate 800

  return (
    <div className="bg-slate-50 w-full max-w-[850px] min-h-[1150px] shadow-2xl flex flex-col font-sans" style={{ fontFamily: cvData.font_family || 'Georgia, serif' }}>
      
      {/* Header Panel */}
      <div className="px-16 py-12 flex justify-between items-center text-white" style={{ backgroundColor: primaryColor }}>
        <div>
          <h1 className="text-4xl font-bold tracking-wider mb-2">
            {cvData.full_name || 'Your Name'}
          </h1>
          <h2 className="text-xl font-medium tracking-widest text-slate-300 uppercase">
            {cvData.title || 'Professional Title'}
          </h2>
        </div>
        {cvData.photo_path && (
          <img 
            src={`http://localhost:8080${cvData.photo_path}`} 
            className="w-28 h-28 object-cover rounded shadow-lg border-2 border-white/20" 
            alt="Profile" 
          />
        )}
      </div>

      <div className="flex flex-1">
        {/* Sidebar (Left) */}
        <div className="w-[35%] bg-slate-200 px-8 py-10 text-slate-800">
           
           <div className="mb-10">
              <h3 className="text-lg font-bold tracking-widest uppercase mb-4 text-slate-900 border-b-2 border-slate-300 pb-2">Details</h3>
              <div className="space-y-4 text-[13px] font-medium text-slate-700">
                 {cvData.address && (
                    <div>
                       <strong className="block text-slate-900 uppercase text-[10px] tracking-wider mb-0.5">Address</strong>
                       {cvData.address}
                    </div>
                 )}
                 {cvData.phone && (
                    <div>
                       <strong className="block text-slate-900 uppercase text-[10px] tracking-wider mb-0.5">Phone</strong>
                       {cvData.phone}
                    </div>
                 )}
                 {cvData.email && (
                    <div>
                       <strong className="block text-slate-900 uppercase text-[10px] tracking-wider mb-0.5">Email</strong>
                       {cvData.email}
                    </div>
                 )}
              </div>
           </div>

           {skills.length > 0 && (
              <div className="mb-10">
                 <h3 className="text-lg font-bold tracking-widest uppercase mb-4 text-slate-900 border-b-2 border-slate-300 pb-2">Skills</h3>
                 <ul className="text-[13px] space-y-2 font-medium text-slate-700 list-disc pl-4">
                    {skills.map((skill, i) => (
                       <li key={i}>{skill.name} {skill.level && `(${skill.level})`}</li>
                    ))}
                 </ul>
              </div>
           )}

           {languages.length > 0 && (
              <div className="mb-10">
                 <h3 className="text-lg font-bold tracking-widest uppercase mb-4 text-slate-900 border-b-2 border-slate-300 pb-2">Languages</h3>
                 <ul className="text-[13px] space-y-2 font-medium text-slate-700">
                    {languages.map((lang, i) => (
                       <li key={i} className="flex justify-between items-center border-b border-slate-300/50 pb-1">
                          <span>{lang.name}</span>
                          <span className="italic text-slate-500 text-[11px]">{lang.proficiency}</span>
                       </li>
                    ))}
                 </ul>
              </div>
           )}

        </div>

        {/* Main Content (Right) */}
        <div className="w-[65%] bg-white px-10 py-10">
           
           {cvData.summary && (
              <div className="mb-10">
                 <h3 className="text-[15px] font-bold tracking-widest uppercase text-slate-800 border-l-4 pl-3 mb-4" style={{ borderColor: primaryColor }}>Profile</h3>
                 <p className="text-[14px] leading-relaxed text-slate-700 text-justify font-serif">
                    {cvData.summary}
                 </p>
              </div>
           )}

           {experiences.length > 0 && (
              <div className="mb-10">
                 <h3 className="text-[15px] font-bold tracking-widest uppercase text-slate-800 border-l-4 pl-3 mb-6" style={{ borderColor: primaryColor }}>Employment History</h3>
                 <div className="space-y-6">
                    {experiences.map((exp, i) => (
                       <div key={i}>
                          <div className="flex justify-between items-baseline mb-1">
                             <h4 className="text-[15px] font-bold text-slate-900 leading-tight">{exp.position || exp.jobTitle}</h4>
                             <span className="text-[12px] font-bold text-slate-500 tracking-wider">
                                {exp.start_date || exp.startDate} – {exp.current ? 'Present' : (exp.end_date || exp.endDate)}
                             </span>
                          </div>
                          <h5 className="text-[13px] font-bold text-slate-600 mb-2 italic">{exp.company}</h5>
                          <p className="text-[13px] text-slate-700 leading-relaxed text-justify font-serif whitespace-pre-line">
                             {exp.description}
                          </p>
                       </div>
                    ))}
                 </div>
              </div>
           )}

           {educations.length > 0 && (
              <div className="mb-10">
                 <h3 className="text-[15px] font-bold tracking-widest uppercase text-slate-800 border-l-4 pl-3 mb-6" style={{ borderColor: primaryColor }}>Education</h3>
                 <div className="space-y-5">
                    {educations.map((edu, i) => (
                       <div key={i}>
                          <div className="flex justify-between items-baseline mb-1">
                             <h4 className="text-[14px] font-bold text-slate-900 leading-tight">{edu.degree}</h4>
                             <span className="text-[12px] font-bold text-slate-500 tracking-wider">
                                {edu.start_date || edu.startDate} – {edu.end_date || edu.endDate || edu.year}
                             </span>
                          </div>
                          <h5 className="text-[13px] font-bold text-slate-600 italic">{edu.institution}</h5>
                          {edu.description && <p className="text-[12px] text-slate-600 mt-2 font-serif">{edu.description}</p>}
                       </div>
                    ))}
                 </div>
              </div>
           )}

        </div>
      </div>
    </div>
  );
}
