import React from 'react';

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-slate-950 border-t border-emerald-900/30 pt-16 pb-8 overflow-hidden">
      
      {/* Decorative gradient orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl text-white">SmartDigital</span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
              We empower professionals and explorers by bridging the gap between cutting-edge digital platforms and real-life experiences. Your journey starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-emerald-400 font-bold mb-6 tracking-wider uppercase text-sm">Services</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Pre-built CV Maker</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Travel Stories</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Premium TV</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Social Network Hub</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-emerald-400 font-bold mb-6 tracking-wider uppercase text-sm">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span className="text-slate-400 text-sm">124 Digital Avenue, Suite 400<br/>San Francisco, CA 94107</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span className="text-slate-400 text-sm">contact@smartdigital.demo</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span className="text-slate-400 text-sm">+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Smart Digital Services. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
