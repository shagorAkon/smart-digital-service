import React from 'react';

export default function MinimalTemplate({ cvData }) {
  const { experiences = [], educations = [], skills = [], projects = [], certifications = [], languages = [], interests = [], social_links = [] } = cvData;
  const primaryColor = cvData.primary_color || '#333333';

  return (
    <div className="bg-white w-full max-w-[850px] min-h-[1150px] shadow-2xl p-16 flex flex-col" style={{ fontFamily: cvData.font_family || 'Arial, sans-serif' }}>
      
      {/* Header */}
      <div className="border-b-2 pb-6 mb-8 text-center" style={{ borderColor: primaryColor }}>
        {cvData.photo_path && (
          <img 
            src={`http://localhost:8080${cvData.photo_path}`} 
            className="w-24 h-24 object-cover rounded-full mx-auto mb-4 border border-slate-300" 
            alt="Profile" 
          />
        )}
        <h1 className="text-4xl font-extrabold tracking-widest uppercase mb-2 text-slate-800" style={{ color: primaryColor }}>
          {cvData.full_name || 'Your Name'}
        </h1>
        <h2 className="text-xl font-medium tracking-wider text-slate-500 mb-4 uppercase">
          {cvData.title || 'Professional Title'}
        </h2>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px] font-medium text-slate-600 uppercase tracking-widest">
          {cvData.email && <span>{cvData.email}</span>}
          {cvData.phone && <span>{cvData.phone}</span>}
          {cvData.address && <span>{cvData.address}</span>}
        </div>
      </div>

      {/* Summary & Objective */}
      <div className="space-y-6 mb-10">
        {cvData.summary && (
          <div>
            <h3 className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2 text-slate-800" style={{ borderColor: primaryColor }}>Summary</h3>
            <p className="text-[14px] leading-relaxed text-slate-700 text-justify">
              {cvData.summary}
            </p>
          </div>
        )}

        {cvData.career_objective && (
          <div>
            <h3 className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2 text-slate-800" style={{ borderColor: primaryColor }}>Objective</h3>
            <p className="text-[14px] leading-relaxed text-slate-700 italic">
              {cvData.career_objective}
            </p>
          </div>
        )}
      </div>

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-bold uppercase tracking-widest mb-6 border-b pb-2 text-slate-800" style={{ borderColor: primaryColor }}>Experience</h3>
          <div className="space-y-6">
            {experiences.map((exp, i) => (
              <div key={i} className="flex flex-col">
                <div className="flex justify-between items-end mb-1">
                  <h4 className="font-bold text-[15px] text-slate-900">{exp.position || exp.jobTitle}</h4>
                  <span className="text-[12px] font-bold text-slate-500 tracking-wider">
                     {exp.start_date || exp.startDate} – {exp.current ? 'Present' : (exp.end_date || exp.endDate)}
                  </span>
                </div>
                <div className="text-[13px] font-bold text-slate-600 mb-2" style={{ color: primaryColor }}>{exp.company}</div>
                <p className="text-[13px] text-slate-700 leading-relaxed text-justify whitespace-pre-line">
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
          <h3 className="text-lg font-bold uppercase tracking-widest mb-6 border-b pb-2 text-slate-800" style={{ borderColor: primaryColor }}>Education</h3>
          <div className="space-y-4">
            {educations.map((edu, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-[15px] text-slate-900">{edu.degree}</h4>
                  <div className="text-[13px] text-slate-600">{edu.institution}</div>
                  {edu.description && <p className="text-[12px] text-slate-500 mt-1">{edu.description}</p>}
                </div>
                <span className="text-[12px] font-bold text-slate-500 tracking-wider">
                   {edu.start_date || edu.startDate} – {edu.end_date || edu.endDate || edu.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Others - Grid format */}
      <div className="grid grid-cols-2 gap-10">
        <div>
          {skills.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2 text-slate-800" style={{ borderColor: primaryColor }}>Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span key={i} className="text-[12px] font-medium bg-slate-100 text-slate-700 px-3 py-1 rounded">
                    {skill.name} {skill.level && <span className="opacity-50 ml-1">({skill.level})</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
          {languages.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2 text-slate-800" style={{ borderColor: primaryColor }}>Languages</h3>
              <ul className="text-[13px] space-y-1">
                {languages.map((lang, i) => (
                   <li key={i}><strong className="text-slate-800">{lang.name}</strong> <span className="text-slate-500">— {lang.proficiency}</span></li>
                ))}
              </ul>
            </div>
          )}
          {interests.length > 0 && (
            <div>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2 text-slate-800" style={{ borderColor: primaryColor }}>Interests</h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, i) => (
                  <span key={i} className="text-[12px] font-medium bg-slate-50 text-slate-600 px-3 py-1 border border-slate-200 rounded-full">
                    {interest.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          {projects.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2 text-slate-800" style={{ borderColor: primaryColor }}>Projects</h3>
              <div className="space-y-4">
                {projects.map((proj, i) => (
                  <div key={i}>
                    <h4 className="font-bold text-[13px] text-slate-900">{proj.title}</h4>
                    {proj.link && <a href={proj.link} className="text-[11px] text-blue-500 block mb-1">{proj.link}</a>}
                    <p className="text-[12px] text-slate-600 line-clamp-2 leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {certifications.length > 0 && (
            <div>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2 text-slate-800" style={{ borderColor: primaryColor }}>Certifications</h3>
              <div className="space-y-3">
                {certifications.map((cert, i) => (
                  <div key={i}>
                    <h4 className="font-bold text-[13px] text-slate-900">{cert.name}</h4>
                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{cert.issuer}</span>
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
