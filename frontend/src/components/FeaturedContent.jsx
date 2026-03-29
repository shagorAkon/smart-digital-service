import React from 'react';

const contentItems = [
  {
    category: 'Travel Stories',
    title: 'A Week in the Swiss Alps',
    description: 'Discover the breathtaking views and serene valleys of Switzerland in our latest travel diary.',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop',
    tagColor: 'bg-amber-500',
  },
  {
    category: 'Latest News',
    title: 'New CV Templates Released',
    description: 'Stand out to employers with our newly designed, ATS-friendly smart templates.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop',
    tagColor: 'bg-emerald-500',
  },
  {
    category: 'Famous Places',
    title: 'The Hidden Gems of Kyoto',
    description: 'Explore the ancient temples and vibrant autumn colors that make Kyoto unforgettable.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
    tagColor: 'bg-indigo-500',
  },
];

export default function FeaturedContent() {
  return (
    <section id="services" className="py-24 bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Discover the <span className="text-emerald-400">Extraordinary</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Explore curated content designed to inspire your next journey and accelerate your career.
          </p>
        </div>

        {/* Real Estate Style Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contentItems.map((item, index) => (
            <div 
              key={index} 
              className="group rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transform hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-all z-10" />
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                />
                <div className={`absolute top-4 left-4 z-20 ${item.tagColor} text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg`}>
                  {item.category}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 mb-6 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between border-t border-slate-700/50 pt-4">
                  <span className="text-emerald-400 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More <span className="text-lg">→</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
