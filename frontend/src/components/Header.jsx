import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fixed w-full top-0 z-50 glass transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Digital<span className="text-emerald-400">Services</span></span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">Home</a>
            <a href="#services" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">Services</a>
            <a href="#about" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">About</a>
            <a href="#contact" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">Contact</a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors">
              Login
            </Link>
            <Link to="/register" className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-full font-medium transition-all shadow-lg shadow-emerald-500/30 transform hover:-translate-y-0.5">
              Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
