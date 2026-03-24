import React, { useState, useEffect } from 'react';

const images = [
  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=2070&auto=format&fit=crop', // Mountains
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop', // Paris
  'https://images.unsplash.com/photo-1512453979436-5a50ce8c6b96?q=80&w=2074&auto=format&fit=crop', // Modern City
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slider */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply z-10" />
          <img src={img} alt="Hero Background" className="w-full h-full object-cover" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-20">
        <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm font-semibold tracking-wider mb-6 animate-fade-in-up">
          WELCOME TO THE FUTURE
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-xl">
          Transform Your Future with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">Smart Digital Services</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto drop-shadow-md">
          Experience premium travel stories, world-class TV, and professional CV building solutions—all in one elegant platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] transform hover:-translate-y-1">
            Get Started Now
          </button>
          <button className="glass hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg transition-all border border-white/20">
            Explore Features
          </button>
        </div>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-8 bg-emerald-400' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
