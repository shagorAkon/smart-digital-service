import React, { useState } from 'react';

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative py-32 bg-slate-900 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Explore the <span className="text-emerald-400">World</span> with Us</h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-16 text-lg">
          Immerse yourself in our cinematic short film. Let the breathtaking landscapes inspire your next big decision.
        </p>

        <div className="relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)] aspect-[16/9] group bg-slate-800">
          
          {/* Thumbnail / Placeholder */}
          {!isPlaying && (
            <>
              <img 
                src="https://images.unsplash.com/photo-1506744626753-143bcff19eb0?q=80&w=1200&auto=format&fit=crop" 
                alt="Video Thumbnail" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/50 transition-colors" />
              
              {/* Play Button */}
              <button 
                onClick={() => setIsPlaying(true)}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-emerald-500/90 hover:bg-emerald-400 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.6)] backdrop-blur-md transition-all hover:scale-110 z-10 group"
              >
                <svg className="w-10 h-10 ml-2 group-hover:text-slate-900 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </>
          )}

          {/* Actual Video iFrame (Youtube Placeholder) */}
          {isPlaying && (
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          )}
        </div>
      </div>
    </section>
  );
}
